'use client';

import { sanitizeCallbackUrl } from '@/lib/utils/urlSanitizer';
import {
  AlertCircle,
  ArrowRight,
  Briefcase,
  GraduationCap,
  Lock,
  Mail,
  ShieldCheck,
} from 'lucide-react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';

function getInitialLoginError(error: string | null): string {
  if (error === 'AdminAccessRequired') {
    return 'Administrator privileges are required for that page. Please log in via the Admin Portal.';
  }
  if (error === 'ConsultantAccessRequired') {
    return 'Consultant portal access required.';
  }
  if (error === 'NoAccountFound' || error === 'AccessDenied' || error === 'OAuthCallback') {
    return 'No account was found with this email. You must create an account first before you can sign in.';
  }
  return '';
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = sanitizeCallbackUrl(searchParams.get('callbackUrl'), '/dashboard');
  const urlError = searchParams.get('error');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(() => getInitialLoginError(urlError));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      const cleanEmail = email.trim().toLowerCase();
      const result = await signIn('credentials', {
        redirect: false,
        email: cleanEmail,
        password,
        callbackUrl,
      });

      if (result?.error) {
        setErrorMessage(result.error);
      } else if (result?.ok) {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err) {
      console.error('Sign in error:', err);
      setErrorMessage('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // Explicitly set cookie indicating sign-in intent with secure attributes
    if (typeof document !== 'undefined') {
      document.cookie = 'auth_action=login; path=/; max-age=300; SameSite=Lax; Secure';
    }
    signIn('google', { callbackUrl });
  };

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center px-4 py-12">
      <div className="rounded-3xl border border-slate-200/90 bg-white p-8 shadow-lg dark:border-slate-800 dark:bg-slate-900">
        <div className="text-center">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0B2A4A] text-amber-400 shadow-sm mb-3">
            <GraduationCap className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-extrabold text-[#0B2A4A] dark:text-white tracking-tight">
            Sign In to CAREER-GUD
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300">
            Access your personalized career pathways, assessments & mentor sessions
          </p>
        </div>

        {/* Google OAuth Button */}
        <div className="mt-6">
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white py-3 text-xs sm:text-sm font-bold text-slate-800 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700 transition shadow-xs cursor-pointer"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>
        </div>

        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200 dark:border-slate-800" />
          </div>
          <span className="relative bg-white px-3 text-xs font-bold uppercase tracking-wider text-slate-400 dark:bg-slate-900 dark:text-slate-500">
            or sign in with email
          </span>
        </div>

        {errorMessage && (
          <div className="mb-4 flex items-start gap-2.5 rounded-xl bg-rose-50 border border-rose-200 p-3.5 text-xs font-bold text-rose-800 dark:bg-rose-950/60 dark:border-rose-900 dark:text-rose-200">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <div>
              <p>{errorMessage}</p>
              <Link
                href="/register"
                className="mt-1.5 inline-block text-[11px] font-extrabold text-[#0B2A4A] underline dark:text-amber-400"
              >
                Click here to create an account →
              </Link>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-3.5 text-xs sm:text-sm font-medium text-slate-900 focus:border-[#0B2A4A] focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white shadow-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-3.5 text-xs sm:text-sm font-medium text-slate-900 focus:border-[#0B2A4A] focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white shadow-xs"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#0B2A4A] py-3 text-xs sm:text-sm font-bold text-white shadow-sm hover:bg-[#071C33] disabled:opacity-50 transition cursor-pointer"
          >
            {loading ? 'Verifying Account...' : 'Sign In'}
            <ArrowRight className="h-4 w-4 text-amber-400" />
          </button>
        </form>

        {/* Advisor Sign-in / Application Notice */}
        <div className="mt-6 rounded-2xl border border-emerald-200/80 bg-emerald-50/60 p-3.5 dark:border-emerald-900/60 dark:bg-emerald-950/30 text-xs">
          <div className="flex items-center gap-2 font-bold text-emerald-900 dark:text-emerald-300">
            <Briefcase className="h-4 w-4 text-emerald-700 dark:text-emerald-400 shrink-0" />
            <span>Are you a Career Advisor or Mentor?</span>
          </div>
          <p className="mt-1 text-slate-600 dark:text-slate-300">
            Sign in with your registered account, or{' '}
            <Link
              href="/register/advisor"
              className="font-bold text-emerald-800 underline dark:text-emerald-400"
            >
              apply for council verification
            </Link>
            .
          </p>
        </div>

        {/* Register Link */}
        <p className="mt-5 text-center text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300">
          Don&apos;t have an account yet?{' '}
          <Link
            href="/register"
            className="font-bold text-[#0B2A4A] hover:underline dark:text-amber-400"
          >
            Create an account
          </Link>
        </p>

        {/* Secure Admin Gate Link */}
        <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 text-center">
          <Link
            href="/admin/portal-login"
            className="inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition"
          >
            <ShieldCheck className="h-3.5 w-3.5 text-amber-500" />
            <span>Authorized Personnel: Admin Security Portal</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm">Loading sign in...</div>}>
      <LoginForm />
    </Suspense>
  );
}
