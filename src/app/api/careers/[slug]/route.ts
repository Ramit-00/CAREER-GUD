import { repository } from '@/lib/data/repository';
import { similarityEngine } from '@/lib/recommendation/similarityEngine';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;
    const career = await repository.getCareerBySlug(slug);

    if (!career) {
      return NextResponse.json({ error: 'Career not found' }, { status: 404 });
    }

    const reviews = await repository.getReviews('CAREER', career.slug);
    const adjacent = similarityEngine.findAdjacentCareers(career.requiredSkills, [career.slug], 3);

    return NextResponse.json({
      career,
      reviews,
      adjacentCareers: adjacent,
    });
  } catch (error) {
    console.error('Error fetching career detail:', error);
    return NextResponse.json({ error: 'Failed to fetch career details' }, { status: 500 });
  }
}
