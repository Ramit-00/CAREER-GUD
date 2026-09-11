import { getJwtSecret } from '@/lib/auth/jwtSecret';
import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

// Sliding window rate limiter with auto-pruning to prevent memory growth
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

interface RateRule {
  limit: number;
  unauthLimit?: number;
  windowMs: number;
  postOnly?: boolean;
}

const RATE_RULES: Record<string, RateRule> = {
  '/api/chat': { limit: 30, unauthLimit: 10, windowMs: 60 * 1000, postOnly: true },
  '/api/auth/register': { limit: 10, windowMs: 60 * 1000, postOnly: true },
  '/api/auth/register-advisor': { limit: 10, windowMs: 60 * 1000, postOnly: true },
  '/api/reviews': { limit: 15, windowMs: 60 * 1000, postOnly: true },
  '/api/quiz/submit': { limit: 20, windowMs: 60 * 1000, postOnly: true },
  '/api/consultants/apply': { limit: 10, windowMs: 60 * 1000, postOnly: true },
  '/api/consultants/bookings': { limit: 15, windowMs: 60 * 1000, postOnly: true },
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

function getClientIdentifier(req: NextRequest, userId?: string): string {
  if (userId) {
    return `user:${userId}`;
  }
  // Trusted reverse-proxy IP extraction (prevents simple X-Forwarded-For injection)
  const realIp = req.headers.get('x-real-ip');
  const cfIp = req.headers.get('cf-connecting-ip');
  const vercelIp = req.headers.get('x-vercel-forwarded-for')?.split(',')[0].trim();
  const forwardedFor = req.headers.get('x-forwarded-for')?.split(',')[0].trim();

  const ip = realIp || cfIp || vercelIp || forwardedFor || '127.0.0.1';
  return `ip:${ip}`;
}

// Distributed Upstash Redis Edge rate limiter with automatic in-memory fallback
async function checkDistributedRateLimit(
  key: string,
  limit: number,
  windowMs: number
): Promise<{ success: boolean; retryAfterSec: number } | null> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (url && token && url.startsWith('http')) {
    try {
      const windowSec = Math.max(1, Math.ceil(windowMs / 1000));
      const res = await fetch(`${url.replace(/\/$/, '')}/pipeline`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([
          ['INCR', `ratelimit:${key}`],
          ['EXPIRE', `ratelimit:${key}`, windowSec, 'NX'],
        ]),
        signal: AbortSignal.timeout(1000),
      });

      if (res.ok) {
        const data = await res.json();
        const currentCount = Number(data[0]?.result) || 1;
        if (currentCount > limit) {
          return { success: false, retryAfterSec: windowSec };
        }
        return { success: true, retryAfterSec: 0 };
      }
    } catch {
      // Fallback to local in-memory rate limiter on network error or timeout
    }
  }

  return null; // Signals fallback to in-memory rate limiter
}

async function checkRateLimit(req: NextRequest, path: string, userId?: string): Promise<NextResponse | null> {
  for (const [endpoint, rule] of Object.entries(RATE_RULES)) {
    if (path === endpoint || path.startsWith(`${endpoint}/`)) {
      if (rule.postOnly && req.method !== 'POST') {
        continue;
      }

      const identifier = getClientIdentifier(req, userId);
      const key = `${identifier}:${endpoint}`;
      const effectiveLimit = !userId && rule.unauthLimit ? rule.unauthLimit : rule.limit;

      // 1. Attempt distributed Upstash rate limiting across Edge PoPs
      const upstashResult = await checkDistributedRateLimit(key, effectiveLimit, rule.windowMs);
      if (upstashResult !== null) {
        if (!upstashResult.success) {
          return new NextResponse(
            JSON.stringify({
              error: 'Too many requests. Rate limit exceeded. Please wait a moment before trying again.',
            }),
            {
              status: 429,
              headers: {
                'Content-Type': 'application/json',
                'Retry-After': upstashResult.retryAfterSec.toString(),
              },
            }
          );
        }
        return null;
      }

      // 2. Fallback to in-memory sliding window rate limiter
      pruneRateLimitMap();
      const currentTime = Date.now();
      const rateData = rateLimitMap.get(key) || { count: 0, resetTime: currentTime + rule.windowMs };

      if (currentTime > rateData.resetTime) {
        rateData.count = 1;
        rateData.resetTime = currentTime + rule.windowMs;
      } else {
        rateData.count += 1;
      }
      rateLimitMap.set(key, rateData);

      if (rateData.count > effectiveLimit) {
        const retryAfterSec = Math.max(1, Math.ceil((rateData.resetTime - currentTime) / 1000));
        return new NextResponse(
          JSON.stringify({
            error: 'Too many requests. Rate limit exceeded. Please wait a moment before trying again.',
          }),
          {
            status: 429,
            headers: {
              'Content-Type': 'application/json',
              'Retry-After': retryAfterSec.toString(),
            },
          }
        );
      }
    }
  }
  return null;
}

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // 1. Token extraction & Role-based Access Control
  const token = await getToken({ 
    req, 
    secret: getJwtSecret()
  });
  const role = token?.role as string | undefined;
  const userId = token?.id as string | undefined;

  // 2. Rate limiting on sensitive endpoints (session-aware with Edge Redis support)
  const rateLimitResponse = await checkRateLimit(req, path, userId);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

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
    '/api/chat',
    '/api/chat/:path*',
    '/api/auth/register',
    '/api/auth/register-advisor',
    '/api/reviews',
    '/api/reviews/:path*',
    '/api/quiz/:path*',
    '/api/consultants/apply',
    '/api/consultants/bookings',
    '/api/consultants/bookings/:path*',
  ],
};

