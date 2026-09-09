import { getJwtSecret } from '@/lib/auth/jwtSecret';
import { prisma } from '@/lib/prisma';
import { ClassLevel } from '@prisma/client';
import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({
      req,
      secret: getJwtSecret(),
    });

    if (!token || token.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden: Insufficient administrative privileges.' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q')?.trim().toLowerCase();
    const classFilter = searchParams.get('class');

    const students = await prisma.user.findMany({
      where: {
        role: 'STUDENT',
        ...(q
          ? {
              OR: [
                { name: { contains: q, mode: 'insensitive' } },
                { email: { contains: q, mode: 'insensitive' } },
              ],
            }
          : {}),
        ...(classFilter && classFilter !== 'ALL'
          ? {
              studentProfile: {
                currentClass: classFilter as ClassLevel,
              },
            }
          : {}),
      },
      include: {
        studentProfile: true,
        _count: {
          select: {
            quizAttempts: true,
            studentBookings: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    const formatted = students.map((s) => ({
      id: s.id,
      name: s.name,
      email: s.email,
      createdAt: s.createdAt,
      profile: s.studentProfile,
      stats: {
        quizAttempts: s._count.quizAttempts,
        bookings: s._count.studentBookings,
      },
    }));

    return NextResponse.json({
      students: formatted,
      total: formatted.length,
    });
  } catch (err) {
    console.error('Admin fetch students error:', err);
    return NextResponse.json({ error: 'Failed to retrieve students' }, { status: 500 });
  }
}
