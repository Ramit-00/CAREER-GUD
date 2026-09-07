import { repository } from '@/lib/data/repository';
import { ConsultantDomain, VerificationStatus } from '@/types';
import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const VerifyDomainSchema = z.object({
  consultantId: z.string().min(1),
  domain: z.enum(['MEDICAL', 'ENGINEERING', 'COMMERCE', 'ARTS', 'OVERSEAS']),
  status: z.enum(['PENDING', 'VERIFIED', 'REJECTED']),
  adminNotes: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET || 'carrer-gud-super-secret-key-for-jwt-token-at-least-32-chars' });
    if (!token || token.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const raw = await req.json();
    const parsed = VerifyDomainSchema.safeParse(raw);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation failed', details: parsed.error.format() }, { status: 400 });
    }

    const { consultantId, domain, status, adminNotes } = parsed.data;

    const ok = await repository.verifyConsultantDomain(
      consultantId,
      domain as ConsultantDomain,
      status as VerificationStatus,
      adminNotes
    );

    if (!ok) {
      return NextResponse.json({ error: 'Consultant not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: `Domain ${domain} updated to ${status}` });
  } catch (error) {
    console.error('Verify domain error:', error);
    return NextResponse.json({ error: 'Failed to update domain verification' }, { status: 500 });
  }
}
