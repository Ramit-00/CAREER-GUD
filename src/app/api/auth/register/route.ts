import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const RegisterSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters').max(100),
  role: z.enum(['STUDENT']).default('STUDENT'),
});

export async function POST(req: NextRequest) {
  try {
    const raw = await req.json();

    // Security check: Block any attempt to register as ADMIN or unverified CONSULTANT
    if (raw.role === 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden: Administrative accounts cannot be created through public registration.' },
        { status: 403 }
      );
    }

    if (raw.role === 'CONSULTANT') {
      return NextResponse.json(
        { error: 'Consultants must submit verifiable credentials through /register/advisor.' },
        { status: 400 }
      );
    }

    const parsed = RegisterSchema.safeParse(raw);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { name, email, password } = parsed.data;
    const normalizedEmail = email.toLowerCase().trim();

    // 1. Check if user already exists in Supabase PostgreSQL
    const existing = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'An account with this email address already exists. Please log in instead.' },
        { status: 409 }
      );
    }

    // 2. Hash password securely with bcrypt
    const passwordHash = await bcrypt.hash(password, 10);
    const cleanName = name.replace(/<[^>]*>?/gm, '').trim();

    // 3. Create user in Supabase
    const newUser = await prisma.user.create({
      data: {
        name: cleanName,
        email: normalizedEmail,
        passwordHash,
        role: 'STUDENT',
      },
    });

    // 4. Initialize default student profile in Supabase
    await prisma.studentProfile.create({
      data: {
        userId: newUser.id,
        currentClass: 'CLASS_10',
        board: 'CBSE',
        interests: [],
        strengths: [],
        savedCareers: [],
        savedColleges: [],
      },
    });

    return NextResponse.json(
      {
        success: true,
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Student registration API error:', error);
    return NextResponse.json({ error: 'Failed to create student account' }, { status: 500 });
  }
}
