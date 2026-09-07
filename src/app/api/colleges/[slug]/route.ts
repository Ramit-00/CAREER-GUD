import { repository } from '@/lib/data/repository';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;
    const college = await repository.getCollegeBySlug(slug);

    if (!college) {
      return NextResponse.json({ error: 'College not found' }, { status: 404 });
    }

    const reviews = await repository.getReviews('COLLEGE', college.slug);

    return NextResponse.json({
      college,
      reviews,
    });
  } catch (error) {
    console.error('Error fetching college detail:', error);
    return NextResponse.json({ error: 'Failed to fetch college details' }, { status: 500 });
  }
}
