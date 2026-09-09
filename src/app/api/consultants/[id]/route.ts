import { repository } from '@/lib/data/repository';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const consultant = await repository.getConsultantById(id);

    if (!consultant) {
      return NextResponse.json({ error: 'Consultant not found' }, { status: 404 });
    }

    // Sanitize: redact mentor private email, phone, and admin audit remarks from public view
    const { email: _email, phone: _phone, ...sanitizedProfile } = consultant;
    const cleanVerifications = (sanitizedProfile.domainVerifications || []).map(
      ({ adminNotes: _notes, ...dv }) => dv
    );
    return NextResponse.json({ ...sanitizedProfile, domainVerifications: cleanVerifications });
  } catch (error) {
    console.error('Error fetching consultant:', error);
    return NextResponse.json({ error: 'Failed to fetch consultant' }, { status: 500 });
  }
}

