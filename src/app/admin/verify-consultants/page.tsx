'use client';

import { ConsultantDomain, ConsultantProfile, VerificationStatus } from '@/types';
import {
  Check,
  CheckCircle2,
  Clock,
  ExternalLink,
  GraduationCap,
  ShieldCheck,
  X,
  XCircle,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function AdminVerifyConsultantsPage() {
  const [consultants, setConsultants] = useState<ConsultantProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);

  useEffect(() => {
    fetchConsultants();
  }, []);

  const fetchConsultants = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/consultants');
      if (res.ok) {
        const data = await res.json();
        setConsultants(data);
      }
    } catch (err) {
      console.error('Error fetching consultants:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyDomain = async (
    consultantId: string,
    domain: ConsultantDomain,
    status: VerificationStatus
  ) => {
    const key = `${consultantId}_${domain}`;
    setActionInProgress(key);

    try {
      const res = await fetch('/api/admin/consultants/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          consultantId,
          domain,
          status,
          adminNotes:
            status === 'VERIFIED'
              ? 'Approved: Council registration and degree verified.'
              : 'Rejected: Inadequate verifiable proof for this domain.',
        }),
      });

      if (!res.ok) throw new Error('Failed to update verification');

      // Update local state
      setConsultants((prev) =>
        prev.map((c) => {
          if (c.id === consultantId) {
            const updatedVerifs = c.domainVerifications.map((v) => {
              if (v.domain === domain) {
                return { ...v, status };
              }
              return v;
            });
            return { ...c, domainVerifications: updatedVerifs };
          }
          return c;
        })
      );
    } catch (err) {
      console.error('Verify error:', err);
      alert('Failed to update status.');
    } finally {
      setActionInProgress(null);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 flex flex-col gap-8">
      {/* Header */}
      <div className="rounded-3xl border border-purple-200 bg-white p-8 shadow-sm dark:border-purple-900/60 dark:bg-slate-900">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-50 px-3 py-1 text-xs font-bold text-purple-700 dark:bg-purple-950/40 dark:text-purple-300">
              <ShieldCheck className="h-3.5 w-3.5" />
              Administrative Verification Portal
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-2">
              Per-Domain Mentor Auditing
            </h1>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl">
              Enforce the strict rule: Consultants can only be matched or booked for domains where an administrator has explicitly verified their credentials.
            </p>
          </div>

          <Link
            href="/admin/overview"
            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200"
          >
            Platform Analytics →
          </Link>
        </div>
      </div>

      {/* Verification List */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">
          Consultant Profiles & Submitted Domains ({consultants.length})
        </h2>

        {loading ? (
          <div className="py-12 text-center text-xs text-slate-500">
            Loading consultant credentials...
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {consultants.map((consultant) => (
              <div
                key={consultant.id}
                className="rounded-2xl border border-slate-200 bg-slate-50/70 p-6 text-xs dark:border-slate-800 dark:bg-slate-800/40"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-slate-200/60 pb-4 dark:border-slate-700">
                  <div>
                    <h3 className="text-base font-black text-slate-900 dark:text-white">
                      {consultant.name}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                      {consultant.headline}
                    </p>
                    <div className="flex flex-wrap gap-4 text-slate-500 mt-2 text-[11px]">
                      <span>Alma Mater: <strong>{consultant.almaMater}</strong></span>
                      <span>Education: <strong>{consultant.highestEducation}</strong></span>
                      <span>Role: <strong>{consultant.currentRole}</strong></span>
                      <span>Fee: <strong>₹{consultant.feePerSessionINR}</strong></span>
                    </div>
                  </div>
                </div>

                {/* Domains List */}
                <div className="mt-4 flex flex-col gap-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Domain Credentials Review:
                  </span>

                  {consultant.domainVerifications.map((v) => {
                    const key = `${consultant.id}_${v.domain}`;
                    const isBusy = actionInProgress === key;

                    return (
                      <div
                        key={v.domain}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3.5 dark:border-slate-700 dark:bg-slate-900"
                      >
                        <div className="flex flex-col gap-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 dark:text-white text-xs">
                              {v.domain} Advisory
                            </span>
                            <span
                              className={`rounded px-1.5 py-0.5 text-[9px] font-bold ${
                                v.status === 'VERIFIED'
                                  ? 'bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300'
                                  : v.status === 'REJECTED'
                                  ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                                  : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                              }`}
                            >
                              {v.status}
                            </span>
                          </div>
                          <span className="text-slate-500 text-[11px]">{v.proofDescription}</span>
                          {v.adminNotes && (
                            <span className="text-slate-400 text-[10px] italic">
                              Admin note: {v.adminNotes}
                            </span>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2 shrink-0">
                          {v.status !== 'VERIFIED' && (
                            <button
                              onClick={() => handleVerifyDomain(consultant.id, v.domain, 'VERIFIED')}
                              disabled={isBusy}
                              className="flex items-center gap-1 rounded-lg bg-teal-600 px-2.5 py-1.5 text-[11px] font-bold text-white hover:bg-teal-500 disabled:opacity-50 transition"
                            >
                              <Check className="h-3.5 w-3.5" />
                              Approve
                            </button>
                          )}

                          {v.status !== 'REJECTED' && (
                            <button
                              onClick={() => handleVerifyDomain(consultant.id, v.domain, 'REJECTED')}
                              disabled={isBusy}
                              className="flex items-center gap-1 rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1.5 text-[11px] font-bold text-rose-700 hover:bg-rose-100 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300 disabled:opacity-50 transition"
                            >
                              <X className="h-3.5 w-3.5" />
                              Reject
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
