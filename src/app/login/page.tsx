'use client';

import {
  AlertCircle,
  ArrowRight,
  Briefcase,
  GraduationCap,
  Lock,
  Mail,
  ShieldCheck,
  User,
} from 'lucide-react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
  const urlError = searchParams.get('error');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(
    urlError === 'AdminAccessRequired'
      ? 'Administrator privileges are required for that page.'
      : urlError === 'ConsultantAccessRequired'
      ? 'Consultant portal access required.'
      : ''
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
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

  const handleFastDemoLogin = async (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('password123');
    setLoading(true);
    setErrorMessage('');

    const result = await signIn('credentials', {
      redirect: false,
      email: demoEmail,
      password: 'password123',
      callbackUrl,
    });

    if (result?.ok) {
      router.push(callbackUrl);
      router.refresh();
    } else {
      setErrorMessage(result?.error || 'Failed to sign in with demo credentials');
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center px-4 py-12">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl dark:border-slate-800 dark:bg-slate-900">
        <div className="text-center">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-teal-500 text-white shadow-md shadow-indigo-500/20 mb-3">
            <GraduationCap className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Welcome Back</h1>
          <p className="mt-1 text-xs text-slate-500">Sign in to your CARRER-GUD account</p>
        </div>

        {/* 1-Click Fast Demo Logins */}
        <div className="mt-6 rounded-2xl border border-indigo-100 bg-indigo-50/60 p-4 dark:border-indigo-950 dark:bg-indigo-950/30">
          <span className="block text-[11px] font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300 mb-2.5">
            ⚡ Quick 1-Click Test Roles:
          </span>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleFastDemoLogin('student@carrer-gud.in')}
              disabled={loading}
              className="flex flex-col items-center justify-center rounded-xl bg-white p-2 text-center text-xs font-semibold text-slate-700 shadow-sm hover:border-indigo-500 hover:text-indigo-600 dark:bg-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition"
            >
              <User className="h-4 w-4 mb-1 text-indigo-500" />
              <span>Student</span>
            </button>
            <button
              type="button"
              onClick={() => handleFastDemoLogin('consultant@carrer-gud.in')}
              disabled={loading}
              className="flex flex-col items-center justify-center rounded-xl bg-white p-2 text-center text-xs font-semibold text-slate-700 shadow-sm hover:border-teal-500 hover:text-teal-600 dark:bg-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition"
            >
              <Briefcase className="h-4 w-4 mb-1 text-teal-500" />
              <span>Consultant</span>
            </button>
            <button
              type="button"
              onClick={() => handleFastDemoLogin('admin@carrer-gud.in')}
              disabled={loading}
              className="flex flex-col items-center justify-center rounded-xl bg-white p-2 text-center text-xs font-semibold text-slate-700 shadow-sm hover:border-purple-500 hover:text-purple-600 dark:bg-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition"
            >
              <ShieldCheck className="h-4 w-4 mb-1 text-purple-500" />
              <span>Admin</span>
            </button>
          </div>
        </div>

        {/* Google OAuth Button */}
        <div className="mt-6">
          <button
            type="button"
            onClick={() => signIn('google', { callbackUrl })}
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-300 bg-white py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24">
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
          <span className="relative bg-white px-3 text-xs uppercase text-slate-400 dark:bg-slate-900">
            or sign in with email
          </span>
        </div>

        {errorMessage && (
          <div className="mb-4 flex items-center gap-2 rounded-xl bg-rose-50 p-3 text-xs font-semibold text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3.5 text-sm focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3.5 text-sm focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 disabled:opacity-50 transition"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-500">
          Don&apos;t have an account yet?{' '}
          <Link href="/register" className="font-bold text-indigo-600 hover:underline dark:text-indigo-400">
            Create an account
          </Link>
        </p>
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
