'use client';

import { sanitizeSafeUrl } from '@/lib/utils/urlSanitizer';
import { ConsultantDomain, VerificationStatus } from '@/types';
import {
  AlertCircle,
  Briefcase,
  Check,
  CheckCircle2,
  Clock,
  ExternalLink,
  LayoutDashboard,
  Lock,
  Mail,
  Phone,
  RefreshCw,
  Search,
  ShieldCheck,
  UserCheck,
  X,
  XCircle,
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface ConsultantItem {
  id: string;
  userId: string;
  name: string;
  email: string;
  headline: string;
  bio: string;
  experienceYears: number;
  highestEducation: string;
  almaMater: string;
  currentRole: string;
  phone?: string;
  linkedinUrl?: string;
  feePerSessionINR: number;
  verificationStatus: 'PENDING' | 'VERIFIED' | 'REJECTED';
  domainVerifications: Array<{
    domain: ConsultantDomain;
    status: VerificationStatus;
    proofDescription: string;
    verifiedAt?: string;
    adminNotes?: string;
  }>;
}

export default function AdminHubPage() {
  const router = useRouter();
  const { data: session, status: authStatus } = useSession();
  const [advisors, setAdvisors] = useState<ConsultantItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'PENDING' | 'VERIFIED' | 'REJECTED' | 'SECURITY'>('PENDING');
  const [searchQuery, setSearchQuery] = useState('');
  const [domainFilter, setDomainFilter] = useState<string>('ALL');
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchAdvisors = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/consultants');
      if (res.ok) {
        const data = await res.json();
        setAdvisors(data);
      }
    } catch (err) {
      console.error('Error fetching advisors:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authStatus === 'loading') return;
    const userRole = (session?.user as { role?: string })?.role;
    if (!session || userRole !== 'ADMIN') {
      router.replace('/admin/portal-login');
      return;
    }
    fetchAdvisors();
  }, [authStatus, session, router]);

  // Whole Profile Approve or Reject
  const handleProfileDecision = async (consultantId: string, action: 'APPROVE' | 'REJECT') => {
    setActionInProgress(consultantId);
    setStatusMessage(null);
    try {
      const res = await fetch('/api/admin/consultants/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          consultantId,
          action,
          adminNotes: action === 'APPROVE' ? 'Approved by Administrator in Admin Hub' : 'Application declined by Administrator',
        }),
      });

      if (res.ok) {
        setStatusMessage({
          type: 'success',
          text: `Advisor application successfully ${action === 'APPROVE' ? 'approved and activated' : 'rejected'}.`,
        });
        await fetchAdvisors();
      } else {
        throw new Error('Failed to update status');
      }
    } catch (err) {
      console.error('Action error:', err);
      setStatusMessage({ type: 'error', text: 'Failed to update advisor status. Please try again.' });
    } finally {
      setActionInProgress(null);
    }
  };

  // Granular Domain Verify / Reject
  const handleDomainDecision = async (
    consultantId: string,
    domain: ConsultantDomain,
    status: VerificationStatus
  ) => {
    const key = `${consultantId}_${domain}`;
    setActionInProgress(key);
    setStatusMessage(null);
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
              ? 'Statutory domain qualification verified.'
              : 'Documentation inadequate for this domain.',
        }),
      });

      if (res.ok) {
        setStatusMessage({
          type: 'success',
          text: `Domain ${domain} updated to ${status}.`,
        });
        await fetchAdvisors();
      } else {
        throw new Error('Failed to update domain');
      }
    } catch (err) {
      console.error('Domain verify error:', err);
      setStatusMessage({ type: 'error', text: 'Failed to update domain verification.' });
    } finally {
      setActionInProgress(null);
    }
  };

  // Filter advisors based on tab, search query, and domain
  const filteredAdvisors = advisors.filter((a) => {
    if (activeTab !== 'SECURITY' && a.verificationStatus !== activeTab) {
      return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = a.name.toLowerCase().includes(q);
      const matchEmail = a.email.toLowerCase().includes(q);
      const matchAlma = a.almaMater?.toLowerCase().includes(q);
      if (!matchName && !matchEmail && !matchAlma) return false;
    }

    if (domainFilter !== 'ALL') {
      const hasDomain = a.domainVerifications?.some((d) => d.domain === domainFilter);
      if (!hasDomain) return false;
    }

    return true;
  });

  const pendingCount = advisors.filter((a) => a.verificationStatus === 'PENDING').length;
  const verifiedCount = advisors.filter((a) => a.verificationStatus === 'VERIFIED').length;
  const rejectedCount = advisors.filter((a) => a.verificationStatus === 'REJECTED').length;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 flex flex-col gap-8">
      {/* Top Banner Header */}
      <div className="rounded-3xl border-2 border-amber-400/40 bg-[#071C33] p-6 sm:p-8 text-white shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-amber-400/50 bg-amber-500/20 px-3 py-1 text-xs font-black text-amber-300">
                <ShieldCheck className="h-4 w-4 text-amber-400" />
                Administrative Governance Portal
              </span>
              {pendingCount > 0 && (
                <span className="rounded-md bg-amber-500/90 px-2 py-0.5 text-[10px] font-black uppercase text-slate-950 animate-pulse">
                  {pendingCount} Action Required
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
              Admin Hub: Advisory Applications & Credentials Audit
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 font-medium max-w-2xl">
              Inspect mentor credentials, review submitted degree documentation, evaluate domain qualifications, and accept or reject applications.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/admin/overview"
              className="flex items-center gap-1.5 rounded-xl border border-slate-600 bg-slate-800 px-4 py-2.5 text-xs font-bold text-white hover:bg-slate-700 transition cursor-pointer"
            >
              <LayoutDashboard className="h-4 w-4 text-amber-400" />
              <span>Dashboard Overview</span>
            </Link>
            <button
              onClick={fetchAdvisors}
              disabled={loading}
              className="flex items-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-400 px-4 py-2.5 text-xs font-black text-slate-950 shadow-md transition cursor-pointer"
            >
              <RefreshCw className={`h-3.5 w-3.5 text-slate-950 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh Queue</span>
            </button>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="mt-8 flex flex-wrap gap-2 border-t border-slate-700/80 pt-4">
          <button
            onClick={() => setActiveTab('PENDING')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition cursor-pointer ${
              activeTab === 'PENDING'
                ? 'bg-amber-400 text-slate-950 font-black shadow-md ring-2 ring-amber-300'
                : 'text-slate-300 hover:bg-slate-800/80'
            }`}
          >
            <Clock className="h-4 w-4" />
            <span>Pending Applications ({pendingCount})</span>
            {pendingCount > 0 && (
              <span className="rounded-full bg-red-600 px-1.5 py-0.2 text-[10px] font-black text-white">
                {pendingCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('VERIFIED')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition cursor-pointer ${
              activeTab === 'VERIFIED'
                ? 'bg-amber-400 text-slate-950 font-black shadow-md ring-2 ring-amber-300'
                : 'text-slate-300 hover:bg-slate-800/80'
            }`}
          >
            <UserCheck className="h-4 w-4" />
            <span>Verified Mentors ({verifiedCount})</span>
          </button>

          <button
            onClick={() => setActiveTab('REJECTED')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition cursor-pointer ${
              activeTab === 'REJECTED'
                ? 'bg-amber-400 text-slate-950 font-black shadow-md ring-2 ring-amber-300'
                : 'text-slate-300 hover:bg-slate-800/80'
            }`}
          >
            <XCircle className="h-4 w-4" />
            <span>Rejected Applications ({rejectedCount})</span>
          </button>

          <button
            onClick={() => setActiveTab('SECURITY')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition cursor-pointer ${
              activeTab === 'SECURITY'
                ? 'bg-amber-400 text-slate-950 font-black shadow-md ring-2 ring-amber-300'
                : 'text-slate-300 hover:bg-slate-800/80'
            }`}
          >
            <Lock className="h-4 w-4" />
            <span>Security Governance</span>
          </button>
        </div>
      </div>

      {/* Alert Status Feedback */}
      {statusMessage && (
        <div
          className={`flex items-center justify-between gap-3 rounded-2xl p-4 text-xs sm:text-sm font-bold shadow-xs ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-200 dark:border-emerald-800'
              : 'bg-rose-50 text-rose-900 border border-rose-300 dark:bg-rose-950/60 dark:text-rose-200 dark:border-rose-800'
          }`}
        >
          <div className="flex items-center gap-2">
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="h-5 w-5 text-rose-600 dark:text-rose-400 shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
          <button
            onClick={() => setStatusMessage(null)}
            className="p-1 hover:opacity-75 cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Main Content Area */}
      {activeTab !== 'SECURITY' ? (
        <div className="rounded-3xl border-2 border-slate-200 bg-white p-6 sm:p-8 shadow-xs dark:border-slate-800 dark:bg-slate-900 flex flex-col gap-6">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5 dark:border-slate-800">
            <div>
              <h2 className="text-xl font-black text-[#0B2A4A] dark:text-white flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-emerald-600" />
                <span>
                  {activeTab === 'PENDING' && 'Pending Application Audit Queue'}
                  {activeTab === 'VERIFIED' && 'Verified Mentorship Council'}
                  {activeTab === 'REJECTED' && 'Declined Advisor Applications'}
                </span>
                <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 text-xs font-black text-slate-700 dark:text-slate-300">
                  {filteredAdvisors.length}
                </span>
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 font-medium">
                {activeTab === 'PENDING' && 'Review candidate experience, degree proof, and verify or decline their practice.'}
                {activeTab === 'VERIFIED' && 'Advisors active on the public mentor roster eligible for student session booking.'}
                {activeTab === 'REJECTED' && 'Candidates whose credentials were deemed fraudulent, unverifiable, or incomplete.'}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search mentor or university..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="rounded-xl border border-slate-300 bg-slate-50 py-2 pl-9 pr-3 text-xs font-bold text-slate-900 focus:border-[#0B2A4A] focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <select
                value={domainFilter}
                onChange={(e) => setDomainFilter(e.target.value)}
                className="rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-900 focus:border-[#0B2A4A] focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                <option value="ALL">All Domains</option>
                <option value="ENGINEERING">Engineering</option>
                <option value="MEDICAL">Medical</option>
                <option value="COMMERCE">Commerce</option>
                <option value="ARTS">Arts / Design</option>
                <option value="OVERSEAS">Overseas</option>
              </select>
            </div>
          </div>

          {/* Advisors List */}
          {loading ? (
            <div className="py-20 text-center text-sm font-bold text-slate-700 dark:text-slate-300">
              <span className="animate-spin inline-block h-6 w-6 border-3 border-blue-600 border-t-transparent rounded-full mb-3" />
              <p>Loading advisor applications...</p>
            </div>
          ) : filteredAdvisors.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-12 text-center dark:border-slate-700 dark:bg-slate-800/40">
              <Briefcase className="h-8 w-8 text-slate-400 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                No advisor applications match the selected criteria.
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {activeTab === 'PENDING'
                  ? 'All received applications have been audited. Great work!'
                  : 'Try changing search terms or domain filters.'}
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {filteredAdvisors.map((adv) => {
                const isBusy = actionInProgress === adv.id;

                return (
                  <div
                    key={adv.id}
                    className="rounded-2xl border-2 border-slate-200 bg-[#F8F9FA] p-6 text-xs sm:text-sm dark:border-slate-800 dark:bg-slate-800/60 shadow-xs"
                  >
                    {/* Header Details */}
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-200 pb-4 dark:border-slate-700">
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className="text-lg font-black text-[#0B2A4A] dark:text-white">
                            {adv.name}
                          </h3>
                          <span
                            className={`rounded-md px-2.5 py-0.5 text-xs font-black uppercase tracking-wider border ${
                              adv.verificationStatus === 'VERIFIED'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800'
                                : adv.verificationStatus === 'REJECTED'
                                ? 'bg-red-50 text-red-800 border-red-300 dark:bg-red-950/60 dark:text-red-300 dark:border-red-800'
                                : 'bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800'
                            }`}
                          >
                            {adv.verificationStatus}
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 mt-1">
                          {adv.headline}
                        </p>
                        <div className="flex flex-wrap gap-4 text-xs text-slate-600 dark:text-slate-300 mt-2.5">
                          <span className="flex items-center gap-1">
                            <Mail className="h-3.5 w-3.5 text-slate-400" />
                            <strong>{adv.email}</strong>
                          </span>
                          {adv.phone && (
                            <span className="flex items-center gap-1">
                              <Phone className="h-3.5 w-3.5 text-slate-400" />
                              <span>{adv.phone}</span>
                            </span>
                          )}
                          {adv.linkedinUrl && (
                            <a
                              href={sanitizeSafeUrl(adv.linkedinUrl)}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center gap-1 text-[#0B2A4A] dark:text-amber-400 font-bold hover:underline"
                            >
                              <ExternalLink className="h-3.5 w-3.5" />
                              <span>LinkedIn Profile</span>
                            </a>
                          )}
                        </div>
                      </div>

                      {/* Top Action Buttons (Profile-Level) */}
                      <div className="flex items-center gap-2 shrink-0">
                        {adv.verificationStatus !== 'VERIFIED' && (
                          <button
                            onClick={() => handleProfileDecision(adv.id, 'APPROVE')}
                            disabled={isBusy}
                            className="flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-4 py-2 text-xs font-black text-white shadow-sm disabled:opacity-50 transition cursor-pointer"
                          >
                            <CheckCircle2 className="h-4 w-4" />
                            <span>Approve & Verify Advisor</span>
                          </button>
                        )}
                        {adv.verificationStatus !== 'REJECTED' && (
                          <button
                            onClick={() => handleProfileDecision(adv.id, 'REJECT')}
                            disabled={isBusy}
                            className="flex items-center gap-1.5 rounded-xl border border-red-300 bg-white hover:bg-red-100 px-4 py-2 text-xs font-black text-red-600 dark:bg-slate-900 dark:border-red-900 dark:hover:bg-red-950/50 dark:hover:text-red-300 disabled:opacity-50 transition cursor-pointer"
                          >
                            <XCircle className="h-4 w-4" />
                            <span>Reject Application</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Academic & Professional Grid */}
                    <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      <div className="rounded-xl bg-white p-3 border border-slate-200 dark:bg-slate-900 dark:border-slate-700">
                        <span className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase font-bold">Experience</span>
                        <strong className="text-slate-950 dark:text-white font-black text-sm">{adv.experienceYears} Years</strong>
                      </div>
                      <div className="rounded-xl bg-white p-3 border border-slate-200 dark:bg-slate-900 dark:border-slate-700">
                        <span className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase font-bold">Alma Mater</span>
                        <strong className="text-slate-950 dark:text-white font-black text-sm truncate block">{adv.almaMater || 'Not set'}</strong>
                      </div>
                      <div className="rounded-xl bg-white p-3 border border-slate-200 dark:bg-slate-900 dark:border-slate-700">
                        <span className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase font-bold">Highest Degree</span>
                        <strong className="text-slate-950 dark:text-white font-black text-sm truncate block">{adv.highestEducation || 'Degree'}</strong>
                      </div>
                      <div className="rounded-xl bg-white p-3 border border-slate-200 dark:bg-slate-900 dark:border-slate-700">
                        <span className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase font-bold">Fee / Session</span>
                        <strong className="text-emerald-700 dark:text-emerald-400 font-black text-sm">₹{adv.feePerSessionINR}</strong>
                      </div>
                    </div>

                    {/* Bio Quote */}
                    {adv.bio && (
                      <div className="mt-4 rounded-xl bg-white p-3.5 border border-slate-200 dark:bg-slate-900 dark:border-slate-700">
                        <span className="text-[10px] uppercase font-black tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
                          Counseling Philosophy & Bio:
                        </span>
                        <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-normal italic">
                          &ldquo;{adv.bio}&rdquo;
                        </p>
                      </div>
                    )}

                    {/* Domain Verifications Sub-List */}
                    <div className="mt-4 flex flex-col gap-2.5">
                      <span className="text-xs font-black uppercase tracking-wider text-[#0B2A4A] dark:text-amber-400">
                        Submitted Domain Competencies & Verifiable Credentials:
                      </span>
                      <div className="flex flex-col gap-2">
                        {adv.domainVerifications?.map((v) => {
                          const domainKey = `${adv.id}_${v.domain}`;
                          const isDomainBusy = actionInProgress === domainKey;

                          return (
                            <div
                              key={v.domain}
                              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3.5 dark:border-slate-700 dark:bg-slate-900"
                            >
                              <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-extrabold text-slate-950 dark:text-white text-xs sm:text-sm">
                                    {v.domain} Guidance
                                  </span>
                                  <span
                                    className={`rounded-md px-2 py-0.5 text-[10px] font-black border ${
                                      v.status === 'VERIFIED'
                                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/50 dark:text-emerald-300'
                                        : v.status === 'REJECTED'
                                        ? 'bg-red-50 text-red-800 border-red-300 dark:bg-red-950/50 dark:text-red-300'
                                        : 'bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950/50 dark:text-amber-300'
                                    }`}
                                  >
                                    {v.status}
                                  </span>
                                </div>
                                <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                                  Proof / License: <strong className="text-slate-900 dark:text-white font-bold">{v.proofDescription || 'Standard application submission'}</strong>
                                </p>
                              </div>

                              <div className="flex items-center gap-2 shrink-0">
                                {v.status !== 'VERIFIED' && (
                                  <button
                                    onClick={() => handleDomainDecision(adv.id, v.domain, 'VERIFIED')}
                                    disabled={isDomainBusy}
                                    className="flex items-center gap-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 px-3 py-1 text-xs font-bold text-white transition cursor-pointer disabled:opacity-50"
                                  >
                                    <Check className="h-3.5 w-3.5" />
                                    <span>Accept Domain</span>
                                  </button>
                                )}
                                {v.status !== 'REJECTED' && (
                                  <button
                                    onClick={() => handleDomainDecision(adv.id, v.domain, 'REJECTED')}
                                    disabled={isDomainBusy}
                                    className="flex items-center gap-1 rounded-lg border border-red-300 bg-white hover:bg-red-100 px-3 py-1 text-xs font-bold text-red-600 dark:bg-slate-900 dark:border-red-900 dark:hover:bg-red-950/50 dark:hover:text-red-300 transition cursor-pointer disabled:opacity-50"
                                  >
                                    <X className="h-3.5 w-3.5" />
                                    <span>Decline Domain</span>
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* Security Governance Tab */
        <div className="rounded-3xl border-2 border-slate-200 bg-white p-6 sm:p-8 shadow-xs dark:border-slate-800 dark:bg-slate-900 flex flex-col gap-6">
          <h3 className="text-xl font-black text-[#0B2A4A] dark:text-white flex items-center gap-2">
            <Lock className="h-6 w-6 text-amber-500" />
            Platform Security Governance & Access Controls
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-emerald-300 bg-emerald-50/70 p-5 dark:border-emerald-800 dark:bg-emerald-950/40">
              <div className="flex items-center gap-2 text-emerald-900 dark:text-emerald-300 font-bold text-sm">
                <ShieldCheck className="h-5 w-5 text-emerald-600" />
                <span>Dual-Factor Master Secret Guard</span>
              </div>
              <p className="mt-2 text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                Admin portal access strictly enforces server-validated environment secret key verification before issuing JWT session tokens.
              </p>
              <div className="mt-4 flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-300">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping" />
                <span>Status: Fully Armed & Enforced</span>
              </div>
            </div>

            <div className="rounded-2xl border border-blue-300 bg-blue-50/70 p-5 dark:border-blue-800 dark:bg-blue-950/40">
              <div className="flex items-center gap-2 text-[#0B2A4A] dark:text-blue-300 font-bold text-sm">
                <Lock className="h-5 w-5 text-blue-600" />
                <span>Zero Public Auto-Provisioning</span>
              </div>
              <p className="mt-2 text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                Unregistered sign-ins via Google OAuth or credentials strictly reject nonexistent accounts with mandatory registration gates.
              </p>
              <div className="mt-4 flex items-center gap-2 text-xs font-bold text-[#0B2A4A] dark:text-blue-300">
                <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                <span>Status: Supabase Protected</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
