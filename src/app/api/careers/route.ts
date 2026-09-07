import { repository } from '@/lib/data/repository';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const stream = searchParams.get('stream') || undefined;
    const search = searchParams.get('search') || undefined;

    const careers = await repository.getCareers({ stream, search });
    return NextResponse.json(careers);
  } catch (error) {
    console.error('Error fetching careers:', error);
    return NextResponse.json({ error: 'Failed to fetch careers' }, { status: 500 });
  }
}
