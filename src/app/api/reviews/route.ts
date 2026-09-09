import { getJwtSecret } from '@/lib/auth/jwtSecret';
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
    const token = await getToken({ req, secret: getJwtSecret() });
    if (!token?.id) {
      return NextResponse.json({ error: 'You must be logged in to post a review' }, { status: 401 });
    }

    const raw = await req.json();
    const parsed = ReviewSubmissionSchema.safeParse(raw);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation failed', details: parsed.error.format() }, { status: 400 });
    }

    // Sanitize user inputs to prevent stored XSS
    const cleanTitle = parsed.data.title.replace(/<[^>]*>?/gm, '').trim();
    const cleanComment = parsed.data.comment.replace(/<[^>]*>?/gm, '').trim();

    if (cleanTitle.length < 3 || cleanComment.length < 10) {
      return NextResponse.json({ error: 'Review text is invalid or contains prohibited markup.' }, { status: 400 });
    }

    // Prevent review bombing and spam: one review per user per target (L5)
    const existingReviews = await repository.getReviews(parsed.data.targetType, parsed.data.targetId);
    const hasExistingReview = existingReviews.some((r) => r.userId === token.id);
    if (hasExistingReview) {
      return NextResponse.json(
        { error: 'You have already submitted a verified review for this item.' },
        { status: 409 }
      );
    }

    const review = await repository.addReview({
      targetType: parsed.data.targetType,
      targetId: parsed.data.targetId,
      rating: parsed.data.rating,
      title: cleanTitle,
      comment: cleanComment,
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
