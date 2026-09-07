import { repository } from '@/lib/data/repository';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const state = searchParams.get('state') || undefined;
    const type = searchParams.get('type') || undefined;
    const search = searchParams.get('search') || undefined;

    const colleges = await repository.getColleges({ state, type, search });
    return NextResponse.json(colleges);
  } catch (error) {
    console.error('Error fetching colleges:', error);
    return NextResponse.json({ error: 'Failed to fetch colleges' }, { status: 500 });
  }
}
