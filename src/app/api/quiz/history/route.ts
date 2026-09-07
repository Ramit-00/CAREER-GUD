import { repository } from '@/lib/data/repository';
import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET || 'carrer-gud-super-secret-key-for-jwt-token-at-least-32-chars' });
    if (!token?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const attempts = await repository.getQuizAttempts(token.id as string);
    return NextResponse.json(attempts);
  } catch (error) {
    console.error('Quiz history fetch error:', error);
    return NextResponse.json({ error: 'Failed to retrieve quiz history' }, { status: 500 });
  }
}
