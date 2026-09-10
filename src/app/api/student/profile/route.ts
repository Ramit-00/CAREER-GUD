import { getJwtSecret } from '@/lib/auth/jwtSecret';
import { prisma } from '@/lib/prisma';
import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const StudentProfileUpdateSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  aboutMe: z.string().max(1000).nullable().optional(),
  currentClass: z
    .enum(['CLASS_9', 'CLASS_10', 'CLASS_11', 'CLASS_12', 'POST_12', 'UNDERGRAD'])
    .nullable()
    .optional(),
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
  board: z.string().max(60).nullable().optional(),
  previousClassPercentage: z.number().min(0).max(100).nullable().optional(),
  tenthPercentage: z.number().min(0).max(100).nullable().optional(),
  twelfthPercentage: z.number().min(0).max(100).nullable().optional(),
  interests: z.array(z.string().max(100)).max(30).optional(),
  strengths: z.array(z.string().max(100)).max(30).optional(),
});

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({
      req,
      secret: getJwtSecret(),
    });

    if (!token?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: token.id as string },
      include: {
        studentProfile: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      name: user.name,
      email: user.email,
      profile: user.studentProfile,
    });
  } catch (error) {
    console.error('Fetch student profile error:', error);
    return NextResponse.json({ error: 'Failed to fetch student profile' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = await getToken({
      req,
      secret: getJwtSecret(),
    });

    if (!token?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const raw = await req.json();
    const parsed = StudentProfileUpdateSchema.safeParse(raw);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid profile data', details: parsed.error.format() },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const userId = token.id as string;

    // Sanitize user text inputs to prevent stored XSS
    const stripHtml = (str?: string | null) => (str ? str.replace(/<[^>]*>?/gm, '').trim() : str);

    // Update user name if provided
    let updatedUserName = token.name as string;
    if (data.name && data.name.trim()) {
      const cleanName = stripHtml(data.name)!;
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { name: cleanName },
      });
      updatedUserName = updatedUser.name;
    }

    const cleanAboutMe = data.aboutMe !== undefined ? (data.aboutMe === null ? null : stripHtml(data.aboutMe)) : undefined;
    const cleanBoard = data.board !== undefined ? (data.board === null ? null : stripHtml(data.board)) : undefined;
    const cleanInterests = data.interests ? data.interests.map((i) => stripHtml(i) || '').filter(Boolean) : undefined;
    const cleanStrengths = data.strengths ? data.strengths.map((s) => stripHtml(s) || '').filter(Boolean) : undefined;

    const profile = await prisma.studentProfile.upsert({
      where: { userId },
      update: {
        aboutMe: cleanAboutMe,
        currentClass: data.currentClass !== undefined ? data.currentClass : undefined,
        currentStream: data.currentStream !== undefined ? data.currentStream : undefined,
        board: cleanBoard,
        previousClassPercentage: data.previousClassPercentage !== undefined ? data.previousClassPercentage : undefined,
        tenthPercentage: data.tenthPercentage !== undefined ? data.tenthPercentage : undefined,
        twelfthPercentage: data.twelfthPercentage !== undefined ? data.twelfthPercentage : undefined,
        interests: cleanInterests,
        strengths: cleanStrengths,
      },
      create: {
        userId,
        aboutMe: cleanAboutMe || null,
        currentClass: data.currentClass || null,
        currentStream: data.currentStream || null,
        board: cleanBoard || null,
        previousClassPercentage: data.previousClassPercentage ?? null,
        tenthPercentage: data.tenthPercentage ?? null,
        twelfthPercentage: data.twelfthPercentage ?? null,
        interests: cleanInterests || [],
        strengths: cleanStrengths || [],
      },
    });

    return NextResponse.json({
      success: true,
      name: updatedUserName,
      profile,
    });
  } catch (error) {
    console.error('Update student profile error:', error);
    return NextResponse.json({ error: 'Failed to update student profile' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  return POST(req);
}
