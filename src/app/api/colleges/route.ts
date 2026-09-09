import { repository } from '@/lib/data/repository';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const state = searchParams.get('state')?.slice(0, 50) || undefined;
    const type = searchParams.get('type')?.slice(0, 50) || undefined;
    const search = searchParams.get('search')?.slice(0, 100) || undefined;

    const colleges = await repository.getColleges({ state, type, search });
    return NextResponse.json(colleges);
  } catch (error) {
    console.error('Error fetching colleges:', error);
    return NextResponse.json({ error: 'Failed to fetch colleges' }, { status: 500 });
  }
}
