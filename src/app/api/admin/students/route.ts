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
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)));
    const skip = (page - 1) * limit;

    const whereCondition = {
      role: 'STUDENT' as const,
      ...(q
        ? {
            OR: [
              { name: { contains: q, mode: 'insensitive' as const } },
              { email: { contains: q, mode: 'insensitive' as const } },
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
    };

    const [total, students] = await Promise.all([
      prisma.user.count({ where: whereCondition }),
      prisma.user.findMany({
        where: whereCondition,
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
        skip,
        take: limit,
      }),
    ]);

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
      total,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      },
    });
  } catch (err) {
    console.error('Admin fetch students error:', err);
    return NextResponse.json({ error: 'Failed to retrieve students' }, { status: 500 });
  }
}
