import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory sliding window rate limiter for API routes
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_CHAT = 30; // 30 messages per minute

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // 1. Rate limiting on sensitive endpoints like /api/chat
  if (path.startsWith('/api/chat')) {
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    const currentTime = Date.now();
    const rateData = rateLimitMap.get(ip) || { count: 0, resetTime: currentTime + RATE_LIMIT_WINDOW };

    if (currentTime > rateData.resetTime) {
      rateData.count = 1;
      rateData.resetTime = currentTime + RATE_LIMIT_WINDOW;
    } else {
      rateData.count += 1;
    }
    rateLimitMap.set(ip, rateData);

    if (rateData.count > MAX_REQUESTS_CHAT) {
      return new NextResponse(
        JSON.stringify({ error: 'Rate limit exceeded. Please wait a moment before sending more messages.' }),
        { status: 429, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }

  // 2. Role-based Route Protection
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET || 'carrer-gud-super-secret-key-for-jwt-token-at-least-32-chars' });
  const role = token?.role as string | undefined;

  // Protect Admin routes
  if (path.startsWith('/admin')) {
    if (!token || role !== 'ADMIN') {
      const loginUrl = new URL('/login', req.url);
      loginUrl.searchParams.set('callbackUrl', path);
      loginUrl.searchParams.set('error', 'AdminAccessRequired');
      return NextResponse.redirect(loginUrl);
    }
  }

  // Protect Consultant private portal
  if (path.startsWith('/consultant/dashboard')) {
    if (!token || (role !== 'CONSULTANT' && role !== 'ADMIN')) {
      const loginUrl = new URL('/login', req.url);
      loginUrl.searchParams.set('callbackUrl', path);
      loginUrl.searchParams.set('error', 'ConsultantAccessRequired');
      return NextResponse.redirect(loginUrl);
    }
  }

  // Protect Student Dashboard
  if (path.startsWith('/dashboard')) {
    if (!token) {
      const loginUrl = new URL('/login', req.url);
      loginUrl.searchParams.set('callbackUrl', path);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/consultant/dashboard/:path*', '/admin/:path*', '/api/chat/:path*'],
};
