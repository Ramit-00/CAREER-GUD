import { getJwtSecret } from '@/lib/auth/jwtSecret';
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
    const token = await getToken({ req, secret: getJwtSecret() });
    if (!token?.id) {
      return NextResponse.json({ error: 'You must be logged in to book a session' }, { status: 401 });
    }

    const raw = await req.json();
    const parsed = BookingCreateSchema.safeParse(raw);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation failed', details: parsed.error.format() }, { status: 400 });
    }

    // Validate that requestedDate is not in the past
    const bookingDate = new Date(parsed.data.requestedDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (isNaN(bookingDate.getTime()) || bookingDate < today) {
      return NextResponse.json(
        { error: 'Appointment date cannot be in the past. Please select today or a future date.' },
        { status: 400 }
      );
    }

    // Security check: Verify consultant exists and is officially verified in this domain
    const consultant = await repository.getConsultantById(parsed.data.consultantId);
    if (!consultant) {
      return NextResponse.json({ error: 'Selected consultant was not found.' }, { status: 404 });
    }

    const isVerifiedForDomain = consultant.domainVerifications?.some(
      (v) => v.domain === parsed.data.domain && v.status === 'VERIFIED'
    );
    if (!isVerifiedForDomain) {
      return NextResponse.json(
        { error: `Consultant is not officially certified or verified for ${parsed.data.domain} guidance.` },
        { status: 403 }
      );
    }

    // Sanitize user inputs to prevent stored XSS
    const cleanNotes = parsed.data.studentNotes.replace(/<[^>]*>?/gm, '').trim();

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
      consultantId: consultant.id,
      consultantName: consultant.name,
      domain: parsed.data.domain as ConsultantDomain,
      requestedDate: parsed.data.requestedDate,
      timeSlot: parsed.data.timeSlot,
      status: 'CONFIRMED', // Instant confirm in verified portal
      studentNotes: cleanNotes,
      sharedProfileSummary,
    });

    return NextResponse.json({ success: true, booking }, { status: 201 });
  } catch (error) {
    console.error('Booking error:', error);
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: getJwtSecret() });
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

export async function PATCH(req: NextRequest) {
  try {
    const token = await getToken({
      req,
      secret: getJwtSecret(),
    });
    if (!token?.id || (token.role !== 'CONSULTANT' && token.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized: Consultant or Admin privileges required' }, { status: 401 });
    }

    const raw = await req.json();
    const PatchBookingSchema = z.object({
      bookingId: z.string().min(1),
      status: z.enum(['REQUESTED', 'CONFIRMED', 'COMPLETED', 'CANCELLED']),
    });

    const parsed = PatchBookingSchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid booking update payload', details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { bookingId, status } = parsed.data;

    // Security check (BOLA / IDOR protection):
    // Verify target booking exists and belongs to the authenticated consultant (unless ADMIN)
    const allBookings = await repository.getBookings();
    const target = allBookings.find((b) => b.id === bookingId);
    if (!target) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    if (token.role !== 'ADMIN' && target.consultantId !== token.id) {
      return NextResponse.json(
        { error: 'Forbidden: You do not have authorization to modify this booking.' },
        { status: 403 }
      );
    }

    const updated = await repository.updateBookingStatus(bookingId, status);
    return NextResponse.json({ success: true, booking: updated });
  } catch (error) {
    console.error('Update booking status error:', error);
    return NextResponse.json({ error: 'Failed to update booking status' }, { status: 500 });
  }
}

