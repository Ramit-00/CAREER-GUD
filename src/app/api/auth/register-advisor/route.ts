import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const AdvisorRegisterSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters').max(128, 'Password must not exceed 128 characters'),
  phone: z.string().min(8, 'Please provide a valid contact number').max(20),
  domain: z.enum(['MEDICAL', 'ENGINEERING', 'COMMERCE', 'ARTS', 'OVERSEAS']),
  experienceYears: z.number().int().min(2, 'Minimum 2 years of professional counseling experience is required'),
  highestEducation: z.string().min(2, 'Please specify your highest degree'),
  almaMater: z.string().min(2, 'Please enter your Alma Mater / University'),
  currentRole: z.string().min(2, 'Please enter your current professional role'),
  linkedinUrl: z.string().url('Please provide a valid LinkedIn profile URL').refine((url) => /^https?:\/\//i.test(url), {
    message: 'LinkedIn URL must start with http:// or https://',
  }),
  feePerSessionINR: z.number().min(0).max(15000),
  proofDescription: z
    .string()
    .min(15, 'Please provide detailed degree verification, registration number, or verification document link')
    .max(5000),
  bio: z.string().min(30, 'Please write a brief statement of counseling experience & philosophy (min 30 characters)').max(5000),
});

export async function POST(req: NextRequest) {
  try {
    const raw = await req.json();
    const parsed = AdvisorRegisterSchema.safeParse(raw);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.format() },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const normalizedEmail = data.email.toLowerCase().trim();

    // 1. Check if an account already exists in Supabase
    const existing = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'An account with this email address already exists. Please log in instead.' },
        { status: 409 }
      );
    }

    // 2. Hash password with bcrypt
    const passwordHash = await bcrypt.hash(data.password, 10);

    // 3. Create user as CONSULTANT
    const user = await prisma.user.create({
      data: {
        name: data.name.trim(),
        email: normalizedEmail,
        passwordHash,
        role: 'CONSULTANT',
      },
    });

    // 4. Create ConsultantProfile in PENDING verification status
    const profile = await prisma.consultantProfile.create({
      data: {
        userId: user.id,
        headline: `${data.currentRole} | ${data.experienceYears}+ Yrs Counseling Exp`,
        bio: data.bio.trim(),
        experienceYears: data.experienceYears,
        highestEducation: data.highestEducation.trim(),
        almaMater: data.almaMater.trim(),
        currentRole: data.currentRole.trim(),
        phone: data.phone.trim(),
        linkedinUrl: data.linkedinUrl.trim(),
        feePerSessionINR: data.feePerSessionINR,
        rating: 5.0,
        reviewCount: 0,
        verificationStatus: 'PENDING',
      },
    });

    // 5. Create ConsultantDomainVerification in PENDING status
    await prisma.consultantDomainVerification.create({
      data: {
        consultantId: profile.id,
        domain: data.domain,
        status: 'PENDING',
        proofDescription: data.proofDescription.trim(),
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Advisor application registered successfully. Pending administrative verification.',
        userId: user.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Advisor registration API error:', error);
    return NextResponse.json(
      { error: 'Failed to process advisor application. Please verify all details.' },
      { status: 500 }
    );
  }
}
