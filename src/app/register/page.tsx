'use client';

import {
  AlertCircle,
  ArrowRight,
  Briefcase,
  GraduationCap,
  Info,
  Lock,
  Mail,
  User,
} from 'lucide-react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';

function getInitialRegisterError(error: string | null, email: string): string {
  if (error === 'NoAccountFound') {
    return email
      ? `No account was found for ${email}. Please complete your registration below to create your student account.`
      : 'No account was found with that email. You must create an account first before you can sign in.';
  }
  return '';
}

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlError = searchParams.get('error');
  const urlEmail = searchParams.get('email') || '';

  const [accountType, setAccountType] = useState<'STUDENT' | 'ADVISOR'>('STUDENT');
  const [name, setName] = useState('');
  const [email, setEmail] = useState(urlEmail);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(() => getInitialRegisterError(urlError, urlEmail));

  const handleStudentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 1. Register student account via backend API
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role: 'STUDENT' }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Registration failed. Please check your details.');
        setLoading(false);
        return;
      }

      // 2. Sign in with the newly created credentials
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
        callbackUrl: '/onboarding/student',
      });

      if (result?.ok) {
        router.push('/onboarding/student');
        router.refresh();
      } else {
        router.push('/login');
      }
    } catch (err) {
      console.error('Student registration error:', err);
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = () => {
    if (typeof document !== 'undefined') {
      document.cookie = 'auth_action=register; path=/; max-age=300; SameSite=Lax; Secure';
    }
    signIn('google', { callbackUrl: '/onboarding/student' });
  };

  return (
    <div className="mx-auto flex min-h-[85vh] max-w-lg flex-col justify-center px-4 py-12">
      <div className="rounded-3xl border border-slate-200/90 bg-white p-8 sm:p-10 shadow-lg dark:border-slate-800 dark:bg-slate-900">
        <div className="text-center">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0B2A4A] text-amber-400 shadow-sm mb-3">
            <GraduationCap className="h-6 w-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B2A4A] dark:text-white tracking-tight">
            Create Your Account
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300">
            Select your account profile type to get started
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="mt-6 grid grid-cols-2 gap-3 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800">
          <button
            type="button"
            onClick={() => setAccountType('STUDENT')}
            className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs sm:text-sm font-extrabold transition cursor-pointer ${
              accountType === 'STUDENT'
                ? 'bg-white text-[#0B2A4A] shadow-sm dark:bg-slate-900 dark:text-white'
                : 'text-slate-600 hover:text-slate-950 hover:bg-slate-200/70 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-700/60'
            }`}
          >
            <User className="h-4 w-4" />
            <span>Student / Parent</span>
          </button>

          <button
            type="button"
            onClick={() => setAccountType('ADVISOR')}
            className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs sm:text-sm font-extrabold transition cursor-pointer ${
              accountType === 'ADVISOR'
                ? 'bg-white text-emerald-800 shadow-sm dark:bg-slate-900 dark:text-emerald-400'
                : 'text-slate-600 hover:text-slate-950 hover:bg-slate-200/70 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-700/60'
            }`}
          >
            <Briefcase className="h-4 w-4" />
            <span>Career Advisor</span>
          </button>
        </div>

        {/* Notice if redirected from sign-in because account was not found */}
        {urlError === 'NoAccountFound' && (
          <div className="mt-5 flex items-start gap-2.5 rounded-xl bg-amber-50 border border-amber-300 p-3.5 text-xs font-bold text-[#994500] dark:bg-amber-950/40 dark:border-amber-800 dark:text-amber-200">
            <Info className="h-4 w-4 shrink-0 mt-0.5" />
            <div>
              <span>Account Not Found:</span>
              <p className="font-normal mt-0.5">
                You tried to sign in, but no account exists yet for your email. Please complete this form to create your student account first.
              </p>
            </div>
          </div>
        )}

        {/* Tab 1: Student Registration Form */}
        {accountType === 'STUDENT' ? (
          <div>
            {/* Google OAuth Option */}
            <div className="mt-6">
              <button
                type="button"
                onClick={handleGoogleRegister}
                className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white py-3 text-xs sm:text-sm font-bold text-slate-800 hover:bg-slate-100 hover:text-slate-950 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700 dark:hover:text-white transition shadow-xs cursor-pointer"
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
                <span>Register with Google</span>
              </button>
            </div>

            <div className="relative my-6 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-800" />
              </div>
              <span className="relative bg-white px-3 text-xs font-bold uppercase tracking-wider text-slate-400 dark:bg-slate-900 dark:text-slate-500">
                or register with email
              </span>
            </div>

            {error && !urlError && (
              <div className="mb-4 flex items-center gap-2 rounded-xl bg-rose-50 border border-rose-200 p-3.5 text-xs font-bold text-rose-800 dark:bg-rose-950/60 dark:border-rose-900 dark:text-rose-200">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleStudentSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1.5">
                  Student Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Aarav Sharma"
                    className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-3.5 text-xs sm:text-sm font-medium text-slate-900 focus:border-[#0B2A4A] focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white shadow-xs"
                  />
                </div>
              </div>

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
                    placeholder="student@example.com"
                    className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-3.5 text-xs sm:text-sm font-medium text-slate-900 focus:border-[#0B2A4A] focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white shadow-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1.5">
                  Create Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="password"
                    required
                    minLength={6}
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
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#0B2A4A] py-3.5 text-xs sm:text-sm font-bold text-white shadow-sm hover:bg-[#071C33] disabled:opacity-50 transition cursor-pointer"
              >
                {loading ? 'Creating Student Account...' : 'Create Account & Continue'}
                <ArrowRight className="h-4 w-4 text-amber-400" />
              </button>
            </form>
          </div>
        ) : (
          /* Tab 2: Career Advisor Gateway Callout */
          <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50/70 p-6 dark:border-emerald-900/60 dark:bg-emerald-950/30 text-center">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-700 text-amber-300 shadow-sm mb-3">
              <Briefcase className="h-6 w-6" />
            </div>
            <h2 className="text-lg font-extrabold text-emerald-950 dark:text-emerald-100">
              Career Advisor & Mentor Registration
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Advisors must provide verified academic credentials, years of counseling experience, alma mater records, and proof documentation for administrative review before advisory status is granted.
            </p>

            <Link
              href="/register/advisor"
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 py-3.5 text-xs sm:text-sm font-bold text-white shadow-sm hover:bg-emerald-800 transition cursor-pointer"
            >
              <span>Proceed to Advisor Application & Credential Submission</span>
              <ArrowRight className="h-4 w-4 text-amber-300" />
            </Link>
          </div>
        )}

        <p className="mt-6 text-center text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300">
          Already have an account?{' '}
          <Link
            href="/login"
            className="font-bold text-[#0B2A4A] hover:underline dark:text-amber-400"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm">Loading registration...</div>}>
      <RegisterForm />
    </Suspense>
  );
}
