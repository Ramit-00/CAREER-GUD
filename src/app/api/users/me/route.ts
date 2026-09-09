import { getJwtSecret } from '@/lib/auth/jwtSecret';
import { prisma } from '@/lib/prisma';
import { repository } from '@/lib/data/repository';
import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const UpdateProfileSchema = z.object({
  currentClass: z.enum(['CLASS_10', 'CLASS_12', 'POST_12', 'UNDERGRAD']).optional(),
  currentStream: z
    .enum([
      'SCIENCE_PCM',
      'SCIENCE_PCB',
      'SCIENCE_PCMB',
      'COMMERCE_MATHS',
      'COMMERCE_NO_MATHS',
      'ARTS',
      'VOCATIONAL',
    ])
    .nullable()
    .optional(),
  board: z.string().optional(),
  academicScores: z
    .object({
      tenthPercentage: z.number().optional(),
      twelfthPercentage: z.number().optional(),
      subjectMarks: z.record(z.string(), z.number()).optional(),
    })
    .optional(),
  interests: z.array(z.string()).optional(),
  strengths: z.array(z.string()).optional(),
  budgetMaxINR: z.number().optional(),
  preferredLocations: z.array(z.string()).optional(),
});

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: getJwtSecret() });
    if (!token?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = token.id as string;

    // Fetch from Supabase PostgreSQL
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        studentProfile: true,
        bookmarks: true,
      },
    });

    const careerSlugs = new Set<string>();
    const collegeSlugs = new Set<string>();

    user?.bookmarks?.forEach((b) => {
      if (b.itemType === 'CAREER') careerSlugs.add(b.itemSlug);
      if (b.itemType === 'COLLEGE') collegeSlugs.add(b.itemSlug);
    });

    user?.studentProfile?.savedCareers?.forEach((s) => careerSlugs.add(s));
    user?.studentProfile?.savedColleges?.forEach((s) => collegeSlugs.add(s));

    const profile = await repository.getStudentProfile(userId);
    return NextResponse.json({
      ...(profile || { userId }),
      savedCareers: Array.from(careerSlugs),
      savedColleges: Array.from(collegeSlugs),
      studentProfile: user?.studentProfile,
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: getJwtSecret() });
    if (!token?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const raw = await req.json();
    const parsed = UpdateProfileSchema.safeParse(raw);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid profile data', details: parsed.error.format() }, { status: 400 });
    }

    const existing = (await repository.getStudentProfile(token.id as string)) || {
      userId: token.id as string,
      currentClass: 'CLASS_10',
      academicScores: {},
      interests: [],
      strengths: [],
      savedCareers: [],
      savedColleges: [],
    };

    const updated = await repository.upsertStudentProfile({
      ...existing,
      ...parsed.data,
      academicScores: {
        ...existing.academicScores,
        ...parsed.data.academicScores,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}

