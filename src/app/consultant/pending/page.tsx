'use client';

import {
  Clock,
  ExternalLink,
  LogOut,
  ShieldCheck,
} from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ConsultantPendingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="py-24 text-center text-sm text-slate-500">
        <span className="animate-spin inline-block h-6 w-6 border-2 border-amber-500 border-t-transparent rounded-full mb-3" />
        <p>Loading application status...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <div className="rounded-3xl border border-amber-300 bg-amber-50/50 p-8 sm:p-12 text-center shadow-lg">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500 text-slate-950 shadow-xs mb-4">
          <Clock className="h-8 w-8" />
        </div>

        <div className="inline-block px-3 py-1 rounded-lg bg-amber-100 border border-amber-300 text-xs font-extrabold text-[#994500] mb-3">
          Application Status: Under Administrative Audit
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B2A4A] tracking-tight">
          Application Pending Review
        </h1>

        <p className="mt-3 text-xs sm:text-sm font-medium text-slate-700 leading-relaxed max-w-lg mx-auto">
          Thank you for applying to become a verified mentor on CAREER-GUD
          {session?.user?.name ? `, ${session.user.name}` : ''}. Our governance team is currently auditing your submitted degrees, professional experience, and council registration.
        </p>

        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-xs">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3 flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-amber-600" />
            <span>Verification Process Checklist</span>
          </h2>
          <ul className="flex flex-col gap-2.5 text-xs text-slate-700">
            <li className="flex items-start gap-2">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                ✓
              </span>
              <span>Personal profile & counseling domain submitted successfully.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-amber-100 text-amber-900 text-[11px] font-bold">
                ⋯
              </span>
              <span>Background audit: Council registration & educational degree verification in progress.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-700 text-[11px] font-bold">
                3
              </span>
              <span>Upon admin approval, your Advisory Portal, student booking calendar, and Verified Badge will activate automatically.</span>
            </li>
          </ul>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/careers"
            className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-xs font-bold text-slate-800 hover:bg-slate-100 hover:text-slate-950 transition shadow-xs"
          >
            <span>Explore Career Pathways</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>

          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-slate-200 px-5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-300 transition cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
}
