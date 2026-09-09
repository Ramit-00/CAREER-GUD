'use client';

import { sanitizeCallbackUrl } from '@/lib/utils/urlSanitizer';
import {
  AlertCircle,
  ArrowRight,
  KeyRound,
  Lock,
  Mail,
  ShieldAlert,
  ShieldCheck,
} from 'lucide-react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';

function AdminPortalLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = sanitizeCallbackUrl(searchParams.get('callbackUrl'), '/admin/hub');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminSecretKey, setAdminSecretKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

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
        adminSecretKey,
        callbackUrl,
      });

      if (result?.error) {
        setErrorMessage(result.error);
      } else if (result?.ok) {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err) {
      console.error('Admin authentication error:', err);
      setErrorMessage('Access denied. An unexpected verification error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[85vh] max-w-lg flex-col justify-center px-4 py-12">
      <div className="rounded-3xl border-2 border-amber-500/30 bg-[#071C33] p-8 sm:p-10 shadow-2xl text-white">
        <div className="text-center">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/20 border border-amber-400/40 text-amber-400 shadow-md mb-3">
            <ShieldCheck className="h-8 w-8 text-amber-400" />
          </div>
          <div className="inline-block px-3 py-1 rounded-full bg-red-950/80 border border-red-500/50 text-[11px] font-extrabold uppercase tracking-wider text-red-300 mb-2">
            Restricted Security Gateway
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Administrator Security Portal
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm font-medium text-slate-300">
            Mandatory dual-factor authentication for CAREER-GUD governance and audit personnel
          </p>
        </div>

        {errorMessage && (
          <div className="mt-6 flex items-center gap-2.5 rounded-2xl bg-red-950/90 border border-red-500/80 p-4 text-xs font-bold text-red-200">
            <ShieldAlert className="h-5 w-5 shrink-0 text-red-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Admin Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="w-full rounded-xl border border-slate-700 bg-slate-900/90 py-3 pl-11 pr-3.5 text-xs sm:text-sm font-medium text-white focus:border-amber-400 focus:outline-none shadow-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Admin Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-slate-700 bg-slate-900/90 py-3 pl-11 pr-3.5 text-xs sm:text-sm font-medium text-white focus:border-amber-400 focus:outline-none shadow-xs"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-amber-300">
                Master Admin Security Key
              </label>
              <span className="text-[10px] text-slate-400">Environment Protected</span>
            </div>
            <div className="relative">
              <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-amber-400" />
              <input
                type="password"
                required
                value={adminSecretKey}
                onChange={(e) => setAdminSecretKey(e.target.value)}
                placeholder="Enter ADMIN_SECRET_KEY"
                className="w-full rounded-xl border border-amber-500/50 bg-slate-900/90 py-3 pl-11 pr-3.5 text-xs sm:text-sm font-medium text-white focus:border-amber-400 focus:outline-none shadow-xs"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 py-3.5 text-xs sm:text-sm font-extrabold text-slate-950 shadow-lg hover:bg-amber-400 disabled:opacity-50 transition cursor-pointer"
          >
            {loading ? 'Verifying Security Credentials...' : 'Authenticate as Administrator'}
            <ArrowRight className="h-4 w-4 text-slate-950" />
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-800 text-center">
          <Link
            href="/login"
            className="text-xs font-medium text-slate-400 hover:text-white transition underline"
          >
            Return to Public Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function AdminPortalLoginPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm">Loading security gate...</div>}>
      <AdminPortalLoginForm />
    </Suspense>
  );
}
