import { repository } from '@/lib/data/repository';
import { ConsultantDomain } from '@/types';
import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const BookingCreateSchema = z.object({
  consultantId: z.string().min(1),
  consultantName: z.string().min(1),
  domain: z.enum(['MEDICAL', 'ENGINEERING', 'COMMERCE', 'ARTS', 'OVERSEAS']),
  requestedDate: z.string().min(1),
  timeSlot: z.string().min(1),
  studentNotes: z.string().min(5).max(1000),
  shareProfile: z.boolean().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET || 'carrer-gud-super-secret-key-for-jwt-token-at-least-32-chars' });
    if (!token?.id) {
      return NextResponse.json({ error: 'You must be logged in to book a session' }, { status: 401 });
    }

    const raw = await req.json();
    const parsed = BookingCreateSchema.safeParse(raw);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation failed', details: parsed.error.format() }, { status: 400 });
    }

    let sharedProfileSummary;
    if (parsed.data.shareProfile) {
      const studentProfile = await repository.getStudentProfile(token.id as string);
      if (studentProfile) {
        sharedProfileSummary = {
          currentClass: studentProfile.currentClass,
          stream: studentProfile.currentStream || undefined,
          tenthScore: studentProfile.academicScores.tenthPercentage,
          twelfthScore: studentProfile.academicScores.twelfthPercentage,
          topInterests: studentProfile.interests,
          topStrengths: studentProfile.strengths,
        };
      }
    }

    const booking = await repository.createBooking({
      studentId: token.id as string,
      studentName: (token.name as string) || 'Student',
      studentEmail: (token.email as string) || '',
      consultantId: parsed.data.consultantId,
      consultantName: parsed.data.consultantName,
      domain: parsed.data.domain as ConsultantDomain,
      requestedDate: parsed.data.requestedDate,
      timeSlot: parsed.data.timeSlot,
      status: 'CONFIRMED', // Instant confirm in demo mode
      studentNotes: parsed.data.studentNotes,
      sharedProfileSummary,
    });

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    console.error('Booking error:', error);
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET || 'carrer-gud-super-secret-key-for-jwt-token-at-least-32-chars' });
    if (!token?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const role = token.role as string;
    let bookings;

    if (role === 'CONSULTANT') {
      bookings = await repository.getBookings({ consultantId: token.id as string });
    } else {
      bookings = await repository.getBookings({ studentId: token.id as string });
    }

    return NextResponse.json(bookings);
  } catch (error) {
    console.error('Fetch bookings error:', error);
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }
}
