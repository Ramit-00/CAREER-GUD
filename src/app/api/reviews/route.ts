import { repository } from '@/lib/data/repository';
import { Role } from '@/types';
import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const ReviewSubmissionSchema = z.object({
  targetType: z.enum(['COLLEGE', 'CAREER']),
  targetId: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  title: z.string().min(3).max(120),
  comment: z.string().min(10).max(2000),
});

export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET || 'carrer-gud-super-secret-key-for-jwt-token-at-least-32-chars' });
    if (!token?.id) {
      return NextResponse.json({ error: 'You must be logged in to post a review' }, { status: 401 });
    }

    const raw = await req.json();
    const parsed = ReviewSubmissionSchema.safeParse(raw);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation failed', details: parsed.error.format() }, { status: 400 });
    }

    const review = await repository.addReview({
      ...parsed.data,
      userId: token.id as string,
      userName: (token.name as string) || 'Student Reviewer',
      userRole: (token.role as Role) || 'STUDENT',
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error('Review submit error:', error);
    return NextResponse.json({ error: 'Failed to post review' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const targetType = searchParams.get('targetType') as 'COLLEGE' | 'CAREER' | null;
    const targetId = searchParams.get('targetId');

    if (!targetType || !targetId) {
      return NextResponse.json({ error: 'targetType and targetId are required' }, { status: 400 });
    }

    const reviews = await repository.getReviews(targetType, targetId);
    return NextResponse.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}
