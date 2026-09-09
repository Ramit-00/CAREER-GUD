import { getJwtSecret } from '@/lib/auth/jwtSecret';
import { prisma } from '@/lib/prisma';
import { repository } from '@/lib/data/repository';
import { ConsultantDomain, VerificationStatus } from '@/types';
import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({
      req,
      secret: getJwtSecret(),
    });

    if (!token || token.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    // Fetch all consultants (PENDING, VERIFIED, REJECTED) directly from Supabase via Prisma
    const dbConsultants = await prisma.consultantProfile.findMany({
      include: {
        user: {
          select: { name: true, email: true, image: true },
        },
        verifications: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    if (dbConsultants && dbConsultants.length > 0) {
      const formatted = dbConsultants.map((c) => ({
        id: c.id,
        userId: c.userId,
        name: c.user.name,
        email: c.user.email,
        headline: c.headline,
        bio: c.bio,
        experienceYears: c.experienceYears,
        highestEducation: c.highestEducation,
        almaMater: c.almaMater,
        currentRole: c.currentRole,
        phone: c.phone || undefined,
        linkedinUrl: c.linkedinUrl || undefined,
        feePerSessionINR: c.feePerSessionINR,
        rating: c.rating,
        reviewCount: c.reviewCount,
        avatarUrl: c.avatarUrl || c.user.image || undefined,
        verificationStatus: c.verificationStatus,
        domainVerifications: c.verifications.map((v) => ({
          domain: v.domain as ConsultantDomain,
          status: v.status as VerificationStatus,
          proofDescription: v.proofDescription,
          verifiedAt: v.verifiedAt?.toISOString(),
          adminNotes: v.adminNotes || undefined,
        })),
      }));

      return NextResponse.json(formatted);
    }

    // Fallback to repository
    const consultants = await repository.getConsultants();
    return NextResponse.json(consultants);
  } catch (error) {
    console.error('Admin fetch consultants error:', error);
    return NextResponse.json({ error: 'Failed to fetch consultants for audit' }, { status: 500 });
  }
}
