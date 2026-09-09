import { getJwtSecret } from '@/lib/auth/jwtSecret';
import { repository } from '@/lib/data/repository';
import { scoringEngine } from '@/lib/recommendation/scoringEngine';
import { StreamType } from '@/types';
import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const SubmitQuizSchema = z.object({
  quizType: z.enum(['STREAM_10TH', 'MEDICAL_12TH', 'NON_MEDICAL_12TH', 'COMMERCE_12TH', 'ARTS_12TH', 'BOTH_12TH']),
  answers: z
    .record(z.string().max(64), z.string().max(256))
    .refine((obj) => Object.keys(obj).length <= 50, {
      message: 'A maximum of 50 answers can be submitted per assessment.',
    }),
  userProfile: z
    .object({
      tenthPercentage: z.number().min(0).max(100).optional(),
      twelfthPercentage: z.number().min(0).max(100).optional(),
      mathScore: z.number().min(0).max(100).optional(),
      scienceScore: z.number().min(0).max(100).optional(),
      englishScore: z.number().min(0).max(100).optional(),
      socialScienceScore: z.number().min(0).max(100).optional(),
      interests: z.array(z.string().max(100)).max(30).optional(),
      strengths: z.array(z.string().max(100)).max(30).optional(),
    })
    .optional(),
  selectedStream: z.string().max(50).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const raw = await req.json();
    const parsed = SubmitQuizSchema.safeParse(raw);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid quiz submission format', details: parsed.error.format() }, { status: 400 });
    }

    const { quizType, answers, userProfile, selectedStream } = parsed.data;

    let result;
    if (quizType === 'STREAM_10TH') {
      result = scoringEngine.calculate10thStreamResult(answers, userProfile);
    } else {
      const stream = (selectedStream as StreamType) || 'SCIENCE_PCM';
      result = scoringEngine.calculate12thDegreeResult(stream, answers, {
        twelfthPercentage: userProfile?.twelfthPercentage,
        subjects: {
          Mathematics: userProfile?.mathScore ?? 75,
          Biology: userProfile?.scienceScore ?? 75,
        },
      });
    }

    // Associate with user if logged in
    const token = await getToken({ req, secret: getJwtSecret() });
    const userId = token?.id as string | undefined;

    await repository.saveQuizAttempt({
      ...result,
      userId,
    });

    // If user is logged in, also update their student profile with extracted signals
    if (userId) {
      const existing = await repository.getStudentProfile(userId);
      if (existing) {
        existing.currentClass = quizType === 'STREAM_10TH' ? 'CLASS_10' : 'CLASS_12';
        if (quizType === 'STREAM_10TH') {
          existing.currentStream = result.primaryRecommendation.streamCategory as StreamType;
        }
        if (userProfile?.tenthPercentage) {
          existing.academicScores.tenthPercentage = userProfile.tenthPercentage;
        }
        await repository.upsertStudentProfile(existing);
      }
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Quiz submit error:', error);
    return NextResponse.json({ error: 'Failed to process quiz submission' }, { status: 500 });
  }
}
