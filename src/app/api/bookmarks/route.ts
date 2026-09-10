import { getJwtSecret } from '@/lib/auth/jwtSecret';
import { prisma } from '@/lib/prisma';
import { repository } from '@/lib/data/repository';
import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({
      req,
      secret: getJwtSecret(),
    });

    if (!token?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = token.id as string;

    // 1. Fetch user bookmarks from Supabase PostgreSQL
    const dbBookmarks = await prisma.userBookmark.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    // 2. Also check if studentProfile has any saved items
    const studentProf = await prisma.studentProfile.findUnique({
      where: { userId },
      select: { savedCareers: true, savedColleges: true },
    });

    // Merge unique slugs
    const careerSlugs = new Set<string>();
    const collegeSlugs = new Set<string>();

    dbBookmarks.forEach((b) => {
      if (b.itemType === 'CAREER') careerSlugs.add(b.itemSlug);
      if (b.itemType === 'COLLEGE') collegeSlugs.add(b.itemSlug);
    });

    studentProf?.savedCareers?.forEach((s) => careerSlugs.add(s));
    studentProf?.savedColleges?.forEach((s) => collegeSlugs.add(s));

    // 3. Hydrate careers with real metadata
    const careers = (
      await Promise.all(
        Array.from(careerSlugs).map(async (slug) => {
          const car = await repository.getCareerBySlug(slug);
          if (car) {
            return {
              slug: car.slug,
              title: car.title,
              streamLabel: car.streamLabel,
              streamCategory: car.streamCategory,
              description: car.description,
              demandTrend: car.outlook.demandTrend,
              avgSalary: car.outlook.avgSalaryRangeINR.mid || car.outlook.avgSalaryRangeINR.entry,
              avgSalaryEntry: car.outlook.avgSalaryRangeINR.entry,
              avgSalaryMid: car.outlook.avgSalaryRangeINR.mid,
              avgRating: car.avgRating,
            };
          }
          return {
            slug,
            title: slug.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
            streamLabel: 'Career Pathway',
            streamCategory: 'ALL',
            description: 'Saved career curriculum.',
            demandTrend: 'STABLE',
            avgSalary: 'Competitive',
            avgSalaryEntry: 'Competitive',
            avgSalaryMid: 'Competitive',
            avgRating: 4.5,
          };
        })
      )
    ).filter(Boolean);

    // 4. Hydrate colleges with real metadata
    const colleges = (
      await Promise.all(
        Array.from(collegeSlugs).map(async (slug) => {
          const col = await repository.getCollegeBySlug(slug);
          if (col) {
            return {
              slug: col.slug,
              name: col.name,
              city: col.city,
              state: col.state,
              nirfRanking: col.nirfRank ?? 0,
              avgPackage: col.placementStats.avgPackageINR,
              website: col.website,
              tier: col.nirfRank && col.nirfRank <= 10 ? 'TIER_1' : col.nirfRank && col.nirfRank <= 50 ? 'TIER_2' : 'OTHER',
            };
          }
          return {
            slug,
            name: slug.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
            city: 'India',
            state: '',
            nirfRanking: 0,
            avgPackage: 'Competitive',
            website: '#',
            tier: 'TIER_1',
          };
        })
      )
    ).filter(Boolean);

    return NextResponse.json({
      careers,
      colleges,
      total: careers.length + colleges.length,
    });
  } catch (error) {
    console.error('Fetch bookmarks error:', error);
    return NextResponse.json({ error: 'Failed to fetch bookmarks' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = await getToken({
      req,
      secret: getJwtSecret(),
    });

    if (!token?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = token.id as string;
    const body = await req.json();
    const type = body.type as 'CAREER' | 'COLLEGE';
    const slug = body.slug as string;

    if (!type || !slug || !['CAREER', 'COLLEGE'].includes(type) || !/^[a-zA-Z0-9_-]{1,100}$/.test(slug)) {
      return NextResponse.json({ error: 'Valid type (CAREER|COLLEGE) and slug required' }, { status: 400 });
    }

    // Check if already bookmarked
    const existing = await prisma.userBookmark.findUnique({
      where: {
        userId_itemType_itemSlug: {
          userId,
          itemType: type,
          itemSlug: slug,
        },
      },
    });

    let title = slug;
    let subtitle = '';
    if (type === 'CAREER') {
      const car = await repository.getCareerBySlug(slug);
      if (car) {
        title = car.title;
        subtitle = car.streamLabel;
      }
    } else {
      const col = await repository.getCollegeBySlug(slug);
      if (col) {
        title = col.name;
        subtitle = `${col.city}, ${col.state}`;
      }
    }

    const isSaved = await prisma.$transaction(async (tx) => {
      let saved = false;
      if (existing) {
        await tx.userBookmark.delete({
          where: { id: existing.id },
        });
        saved = false;
      } else {
        await tx.userBookmark.create({
          data: {
            userId,
            itemType: type,
            itemSlug: slug,
            title,
            subtitle,
          },
        });
        saved = true;
      }

      // Synchronize StudentProfile if exists
      const studentProf = await tx.studentProfile.findUnique({
        where: { userId },
      });

      if (studentProf) {
        if (type === 'CAREER') {
          let updatedList = studentProf.savedCareers || [];
          if (saved) {
            if (!updatedList.includes(slug)) updatedList = [...updatedList, slug];
          } else {
            updatedList = updatedList.filter((s) => s !== slug);
          }
          await tx.studentProfile.update({
            where: { userId },
            data: { savedCareers: updatedList },
          });
        } else {
          let updatedList = studentProf.savedColleges || [];
          if (saved) {
            if (!updatedList.includes(slug)) updatedList = [...updatedList, slug];
          } else {
            updatedList = updatedList.filter((s) => s !== slug);
          }
          await tx.studentProfile.update({
            where: { userId },
            data: { savedColleges: updatedList },
          });
        }
      }

      return saved;
    });

    // Sync in-memory store
    await repository.toggleSavedItem(userId, type, slug);

    return NextResponse.json({
      saved: isSaved,
      type,
      slug,
      message: isSaved ? 'Saved to Profile' : 'Removed from Saved',
    });
  } catch (error) {
    console.error('Toggle bookmark error:', error);
    return NextResponse.json({ error: 'Failed to toggle bookmark' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const token = await getToken({
      req,
      secret: getJwtSecret(),
    });

    if (!token?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = token.id as string;
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');
    const slug = searchParams.get('slug');

    if (!type || !slug || !['CAREER', 'COLLEGE'].includes(type) || !/^[a-zA-Z0-9_-]{1,100}$/.test(slug)) {
      return NextResponse.json({ error: 'Valid type (CAREER|COLLEGE) and slug required' }, { status: 400 });
    }

    await prisma.userBookmark.deleteMany({
      where: {
        userId,
        itemType: type,
        itemSlug: slug,
      },
    });

    // Synchronize StudentProfile
    const studentProf = await prisma.studentProfile.findUnique({
      where: { userId },
    });

    if (studentProf) {
      if (type === 'CAREER') {
        await prisma.studentProfile.update({
          where: { userId },
          data: {
            savedCareers: (studentProf.savedCareers || []).filter((s) => s !== slug),
          },
        });
      } else {
        await prisma.studentProfile.update({
          where: { userId },
          data: {
            savedColleges: (studentProf.savedColleges || []).filter((s) => s !== slug),
          },
        });
      }
    }

    return NextResponse.json({ success: true, message: 'Removed from Saved' });
  } catch (error) {
    console.error('Delete bookmark error:', error);
    return NextResponse.json({ error: 'Failed to delete bookmark' }, { status: 500 });
  }
}
