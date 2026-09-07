import { repository } from '@/lib/data/repository';
import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { StreamType } from '@/types';

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
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET || 'carrer-gud-super-secret-key-for-jwt-token-at-least-32-chars' });
    if (!token?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const profile = await repository.getStudentProfile(token.id as string);
    return NextResponse.json(profile || { userId: token.id });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET || 'carrer-gud-super-secret-key-for-jwt-token-at-least-32-chars' });
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

export async function POST(req: NextRequest) {
  // Toggle saved career or college bookmark
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET || 'carrer-gud-super-secret-key-for-jwt-token-at-least-32-chars' });
    if (!token?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { type, slug } = await req.json();
    if (!type || !slug) {
      return NextResponse.json({ error: 'type and slug are required' }, { status: 400 });
    }

    const res = await repository.toggleSavedItem(token.id as string, type, slug);
    return NextResponse.json(res);
  } catch (error) {
    console.error('Toggle saved error:', error);
    return NextResponse.json({ error: 'Failed to toggle bookmark' }, { status: 500 });
  }
}
