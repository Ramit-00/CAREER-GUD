import { getJwtSecret } from '@/lib/auth/jwtSecret';
import { prisma } from '@/lib/prisma';
import { repository } from '@/lib/data/repository';
import { ConsultantDomain, VerificationStatus } from '@/types';
import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const VerifyRequestSchema = z.union([
  z.object({
    consultantId: z.string().min(1),
    action: z.enum(['APPROVE', 'REJECT', 'PENDING']),
    adminNotes: z.string().optional(),
  }),
  z.object({
    consultantId: z.string().min(1),
    domain: z.enum(['MEDICAL', 'ENGINEERING', 'COMMERCE', 'ARTS', 'OVERSEAS']),
    status: z.enum(['PENDING', 'VERIFIED', 'REJECTED']),
    adminNotes: z.string().optional(),
  }),
]);

export async function POST(req: NextRequest) {
  try {
    const token = await getToken({
      req,
      secret: getJwtSecret(),
    });

    if (!token || token.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const raw = await req.json();
    const parsed = VerifyRequestSchema.safeParse(raw);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.format() },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // Case A: Whole Profile Action (APPROVE / REJECT)
    if ('action' in data) {
      const { consultantId, action, adminNotes } = data;
      const newStatus = action === 'APPROVE' ? 'VERIFIED' : action === 'REJECT' ? 'REJECTED' : 'PENDING';

      // 1. Update ConsultantProfile verificationStatus
      await prisma.consultantProfile.update({
        where: { id: consultantId },
        data: { verificationStatus: newStatus },
      });

      // 2. Also update all domain verifications under this consultant
      await prisma.consultantDomainVerification.updateMany({
        where: { consultantId },
        data: {
          status: newStatus,
          adminNotes: adminNotes || (action === 'APPROVE' ? 'Verified by Admin' : 'Rejected by Admin'),
          verifiedAt: newStatus === 'VERIFIED' ? new Date() : null,
        },
      });

      // 3. Keep in-memory repository synchronized
      const allConsultants = await repository.getConsultants();
      const memConsultant = allConsultants.find((c) => c.id === consultantId);
      if (memConsultant) {
        memConsultant.verificationStatus = newStatus as VerificationStatus;
        memConsultant.domainVerifications?.forEach((dv) => {
          dv.status = newStatus as VerificationStatus;
        });
      }

      return NextResponse.json({
        success: true,
        message: `Consultant profile successfully updated to ${newStatus}.`,
      });
    }

    // Case B: Specific Domain Verification
    const { consultantId, domain, status, adminNotes } = data;

    // 1. Update ConsultantDomainVerification in Supabase PostgreSQL
    await prisma.consultantDomainVerification.upsert({
      where: {
        consultantId_domain: {
          consultantId,
          domain,
        },
      },
      update: {
        status,
        adminNotes,
        verifiedAt: status === 'VERIFIED' ? new Date() : null,
      },
      create: {
        consultantId,
        domain,
        status,
        proofDescription: 'Admin evaluation record',
        adminNotes,
        verifiedAt: status === 'VERIFIED' ? new Date() : null,
      },
    });

    // 2. If status is VERIFIED, ensure ConsultantProfile status is updated to VERIFIED
    if (status === 'VERIFIED') {
      await prisma.consultantProfile.update({
        where: { id: consultantId },
        data: { verificationStatus: 'VERIFIED' },
      });
    }

    // 3. Keep in-memory repository synchronized for active session caches
    await repository.verifyConsultantDomain(
      consultantId,
      domain as ConsultantDomain,
      status as VerificationStatus,
      adminNotes
    );

    return NextResponse.json({
      success: true,
      message: `Domain ${domain} updated to ${status} in Supabase database.`,
    });
  } catch (error) {
    console.error('Verify error:', error);
    return NextResponse.json({ error: 'Failed to update verification' }, { status: 500 });
  }
}
