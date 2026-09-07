import { repository } from '@/lib/data/repository';
import { ConsultantDomain } from '@/types';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const domain = (searchParams.get('domain') as ConsultantDomain) || undefined;

    const consultants = await repository.getConsultants(domain);
    return NextResponse.json(consultants);
  } catch (error) {
    console.error('Error fetching consultants:', error);
    return NextResponse.json({ error: 'Failed to fetch consultants' }, { status: 500 });
  }
}
