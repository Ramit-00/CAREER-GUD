import { getJwtSecret } from '@/lib/auth/jwtSecret';
import { prisma } from '@/lib/prisma';
import { repository } from '@/lib/data/repository';
import { similarityEngine } from '@/lib/recommendation/similarityEngine';
import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;
    if (!slug || !/^[a-zA-Z0-9_-]{1,100}$/.test(slug)) {
      return NextResponse.json({ error: 'Invalid career slug' }, { status: 400 });
    }

    const career = await repository.getCareerBySlug(slug);

    if (!career) {
      return NextResponse.json({ error: 'Career not found' }, { status: 404 });
    }

    const reviews = await repository.getReviews('CAREER', career.slug);
    const adjacent = similarityEngine.findAdjacentCareers(career.requiredSkills, [career.slug], 3);

    // Check if current authenticated user has saved this career
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
            itemType: 'CAREER',
            itemSlug: career.slug,
          },
        },
      });

      if (bookmark) {
        isSaved = true;
      } else {
        const studentProf = await prisma.studentProfile.findUnique({
          where: { userId: token.id as string },
          select: { savedCareers: true },
        });
        if (studentProf?.savedCareers?.includes(career.slug)) {
          isSaved = true;
        }
      }
    }

    return NextResponse.json({
      career,
      reviews,
      adjacentCareers: adjacent,
      isSaved,
    });
  } catch (error) {
    console.error('Error fetching career detail:', error);
    return NextResponse.json({ error: 'Failed to fetch career details' }, { status: 500 });
  }
}
