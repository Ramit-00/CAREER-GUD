import { prisma } from '@/lib/prisma';
import { repository } from '@/lib/data/repository';
import { ConsultantDomain } from '@/types';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const domain = (searchParams.get('domain') as ConsultantDomain) || undefined;

    // 1. Query Supabase PostgreSQL via Prisma for verified consultants
    const dbConsultants = await prisma.consultantProfile.findMany({
      where: {
        verifications: {
          some: {
            status: 'VERIFIED',
            ...(domain ? { domain: domain as any } : {}),
          },
        },
      },
      include: {
        user: {
          select: { name: true, image: true },
        },
        verifications: true,
      },
    });

    if (dbConsultants && dbConsultants.length > 0) {
      const formatted = dbConsultants.map((c) => ({
        id: c.id,
        userId: c.userId,
        name: c.user.name,
        headline: c.headline,
        bio: c.bio,
        experienceYears: c.experienceYears,
        highestEducation: c.highestEducation,
        almaMater: c.almaMater,
        currentRole: c.currentRole,
        linkedinUrl: c.linkedinUrl || undefined,
        feePerSessionINR: c.feePerSessionINR,
        rating: c.rating,
        reviewCount: c.reviewCount,
        avatarUrl: c.avatarUrl || c.user.image || undefined,
        domainVerifications: c.verifications.map((v) => ({
          domain: v.domain as ConsultantDomain,
          status: v.status as any,
          proofDescription: v.proofDescription,
          verifiedAt: v.verifiedAt?.toISOString(),
        })),
      }));

      return NextResponse.json(formatted);
    }

    // Fallback to repository if DB is cold
    const consultants = await repository.getConsultants(domain);
    const sanitized = consultants.map(({ email: _email, phone: _phone, ...publicProfile }) => ({
      ...publicProfile,
      domainVerifications: (publicProfile.domainVerifications || []).map(
        ({ adminNotes: _notes, ...dv }) => dv
      ),
    }));
    return NextResponse.json(sanitized);
  } catch (error) {
    console.error('Error fetching consultants:', error);
    return NextResponse.json({ error: 'Failed to fetch consultants' }, { status: 500 });
  }
}
