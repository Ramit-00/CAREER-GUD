import { getJwtSecret } from '@/lib/auth/jwtSecret';
import { prisma } from '@/lib/prisma';
import { repository } from '@/lib/data/repository';
import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;
    if (!slug || !/^[a-zA-Z0-9_-]{1,100}$/.test(slug)) {
      return NextResponse.json({ error: 'Invalid college slug' }, { status: 400 });
    }

    const college = await repository.getCollegeBySlug(slug);

    if (!college) {
      return NextResponse.json({ error: 'College not found' }, { status: 404 });
    }

    const reviews = await repository.getReviews('COLLEGE', college.slug);

    // Check if current authenticated user has saved this college
    let isSaved = false;
    const token = await getToken({
      req,
      secret: getJwtSecret(),
    });

    if (token?.id) {
      const bookmark = await prisma.userBookmark.findUnique({
        where: {
          userId_itemType_itemSlug: {
            userId: token.id as string,
            itemType: 'COLLEGE',
            itemSlug: college.slug,
          },
        },
      });

      if (bookmark) {
        isSaved = true;
      } else {
        const studentProf = await prisma.studentProfile.findUnique({
          where: { userId: token.id as string },
          select: { savedColleges: true },
        });
        if (studentProf?.savedColleges?.includes(college.slug)) {
          isSaved = true;
        }
      }
    }

    return NextResponse.json({
      college,
      reviews,
      isSaved,
    });
  } catch (error) {
    console.error('Error fetching college detail:', error);
    return NextResponse.json({ error: 'Failed to fetch college details' }, { status: 500 });
  }
}
