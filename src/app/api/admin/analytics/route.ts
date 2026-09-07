import { repository } from '@/lib/data/repository';
import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET || 'carrer-gud-super-secret-key-for-jwt-token-at-least-32-chars' });
    if (!token || token.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const careers = await repository.getCareers();
    const colleges = await repository.getColleges();
    const consultants = await repository.getConsultants();
    const bookings = await repository.getBookings();

    const pendingVerificationsCount = consultants.reduce(
      (count, c) => count + c.domainVerifications.filter((v) => v.status === 'PENDING').length,
      0
    );

    return NextResponse.json({
      totalCareers: careers.length,
      totalColleges: colleges.length,
      totalConsultants: consultants.length,
      totalBookings: bookings.length,
      pendingVerifications: pendingVerificationsCount,
      streamDistribution: {
        SCIENCE_PCM: 42,
        SCIENCE_PCB: 28,
        COMMERCE: 20,
        ARTS: 10,
      },
    });
  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json({ error: 'Failed to retrieve analytics' }, { status: 500 });
  }
}
