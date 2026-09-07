import { repository } from '@/lib/data/repository';
import { ConsultantDomain } from '@/types';
import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const ApplySchema = z.object({
  headline: z.string().min(5).max(120),
  bio: z.string().min(20).max(2000),
  experienceYears: z.number().int().min(1),
  highestEducation: z.string().min(2),
  almaMater: z.string().min(2),
  currentRole: z.string().min(2),
  linkedinUrl: z.string().url().optional().or(z.literal('')),
  feePerSessionINR: z.number().min(0).max(10000),
  domains: z.array(
    z.object({
      domain: z.enum(['MEDICAL', 'ENGINEERING', 'COMMERCE', 'ARTS', 'OVERSEAS']),
      proofDescription: z.string().min(10),
    })
  ).min(1),
});

export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET || 'carrer-gud-super-secret-key-for-jwt-token-at-least-32-chars' });
    if (!token?.id) {
      return NextResponse.json({ error: 'Authentication required to apply' }, { status: 401 });
    }

    const raw = await req.json();
    const parsed = ApplySchema.safeParse(raw);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation failed', details: parsed.error.format() }, { status: 400 });
    }

    const { domains, ...profileData } = parsed.data;

    const domainVerifications = domains.map((d) => ({
      domain: d.domain as ConsultantDomain,
      status: 'PENDING' as const,
      proofDescription: d.proofDescription,
    }));

    const profile = await repository.applyForConsultant({
      ...profileData,
      userId: token.id as string,
      name: (token.name as string) || 'Consultant Applicant',
      email: (token.email as string) || '',
      domainVerifications,
    });

    return NextResponse.json({ success: true, profile }, { status: 201 });
  } catch (error) {
    console.error('Consultant apply error:', error);
    return NextResponse.json({ error: 'Failed to submit application' }, { status: 500 });
  }
}
