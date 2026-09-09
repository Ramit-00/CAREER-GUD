import { getJwtSecret } from '@/lib/auth/jwtSecret';
import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

// Sliding window rate limiter with auto-pruning to prevent memory growth
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

interface RateRule {
  limit: number;
  windowMs: number;
  postOnly?: boolean;
}

const RATE_RULES: Record<string, RateRule> = {
  '/api/chat': { limit: 30, windowMs: 60 * 1000 },
  '/api/auth/register': { limit: 10, windowMs: 60 * 1000, postOnly: true },
  '/api/auth/register-advisor': { limit: 10, windowMs: 60 * 1000, postOnly: true },
  '/api/reviews': { limit: 15, windowMs: 60 * 1000, postOnly: true },
  '/api/quiz/submit': { limit: 20, windowMs: 60 * 1000, postOnly: true },
  '/api/consultants/apply': { limit: 10, windowMs: 60 * 1000, postOnly: true },
};

function pruneRateLimitMap() {
  if (rateLimitMap.size > 500) {
    const now = Date.now();
    for (const [key, val] of rateLimitMap.entries()) {
      if (now > val.resetTime) {
        rateLimitMap.delete(key);
      }
    }
  }
}

function checkRateLimit(req: NextRequest, path: string): NextResponse | null {
  for (const [endpoint, rule] of Object.entries(RATE_RULES)) {
    if (path === endpoint || path.startsWith(`${endpoint}/`)) {
      if (rule.postOnly && req.method !== 'POST') {
        continue;
      }
      pruneRateLimitMap();
      const ip =
        req.headers.get('x-real-ip') ||
        req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
        '127.0.0.1';
      const key = `${ip}:${endpoint}`;
      const currentTime = Date.now();
      const rateData = rateLimitMap.get(key) || { count: 0, resetTime: currentTime + rule.windowMs };

      if (currentTime > rateData.resetTime) {
        rateData.count = 1;
        rateData.resetTime = currentTime + rule.windowMs;
      } else {
        rateData.count += 1;
      }
      rateLimitMap.set(key, rateData);

      if (rateData.count > rule.limit) {
        return new NextResponse(
          JSON.stringify({
            error: 'Too many requests. Rate limit exceeded. Please wait a moment before trying again.',
          }),
          { status: 429, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }
  }
  return null;
}

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // 1. Rate limiting on sensitive endpoints
  const rateLimitResponse = checkRateLimit(req, path);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  // 2. Token extraction & Role-based Access Control
  const token = await getToken({ 
    req, 
    secret: getJwtSecret()
  });
  const role = token?.role as string | undefined;

  // Protect Admin API routes (Return 401/403 JSON, never HTML redirects)
  if (path.startsWith('/api/admin')) {
    if (!token) {
      return new NextResponse(
        JSON.stringify({ error: 'Authentication required for administrative operations.' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }
    if (role !== 'ADMIN') {
      return new NextResponse(
        JSON.stringify({ error: 'Forbidden: Insufficient administrative privileges.' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }

  // Protect Admin UI routes (Redirect to /admin/portal-login)
  if (path.startsWith('/admin')) {
    if (path === '/admin/portal-login') {
      return NextResponse.next();
    }
    if (!token || role !== 'ADMIN') {
      const loginUrl = new URL('/admin/portal-login', req.url);
      loginUrl.searchParams.set('callbackUrl', path);
      loginUrl.searchParams.set('error', 'AdminAccessRequired');
      return NextResponse.redirect(loginUrl);
    }
  }

  // Protect Consultant private portal (both /consultant/dashboard and /consultant/pending)
  if (path.startsWith('/consultant')) {
    if (!token) {
      const loginUrl = new URL('/login', req.url);
      loginUrl.searchParams.set('callbackUrl', path);
      loginUrl.searchParams.set('error', 'ConsultantAccessRequired');
      return NextResponse.redirect(loginUrl);
    }

    if (role === 'CONSULTANT') {
      const verStatus = (token as { verificationStatus?: string }).verificationStatus;
      // If status is not VERIFIED (i.e. PENDING or REJECTED), lock out of dashboard
      if (verStatus !== 'VERIFIED') {
        if (path !== '/consultant/pending') {
          return NextResponse.redirect(new URL('/consultant/pending', req.url));
        }
      } else {
        // If VERIFIED and accessing pending page, redirect to active dashboard
        if (path === '/consultant/pending') {
          return NextResponse.redirect(new URL('/consultant/dashboard', req.url));
        }
      }
    } else if (role !== 'ADMIN') {
      const loginUrl = new URL('/login', req.url);
      loginUrl.searchParams.set('error', 'ConsultantAccessRequired');
      return NextResponse.redirect(loginUrl);
    }
  }

  // Protect Student Onboarding
  if (path.startsWith('/onboarding')) {
    if (!token) {
      const loginUrl = new URL('/login', req.url);
      loginUrl.searchParams.set('callbackUrl', path);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Protect & Role-Route Dashboard
  if (path.startsWith('/dashboard')) {
    if (!token) {
      const loginUrl = new URL('/login', req.url);
      loginUrl.searchParams.set('callbackUrl', path);
      return NextResponse.redirect(loginUrl);
    }

    // Role-specific routing: Never show student dashboard to Admins or Advisors
    if (role === 'ADMIN') {
      return NextResponse.redirect(new URL('/admin/overview', req.url));
    }
    if (role === 'CONSULTANT') {
      const verStatus = (token as { verificationStatus?: string }).verificationStatus;
      if (verStatus !== 'VERIFIED') {
        return NextResponse.redirect(new URL('/consultant/pending', req.url));
      }
      return NextResponse.redirect(new URL('/consultant/dashboard', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*', 
    '/consultant/:path*', 
    '/admin/:path*', 
    '/onboarding/:path*',
    '/api/admin/:path*',
    '/api/chat/:path*',
    '/api/auth/register',
    '/api/auth/register-advisor',
    '/api/reviews/:path*',
    '/api/quiz/:path*',
    '/api/consultants/apply'
  ],
};

