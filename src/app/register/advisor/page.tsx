'use client';

import {
  AlertCircle,
  ArrowRight,
  Briefcase,
  CheckCircle2,
  GraduationCap,
  ShieldCheck,
  User,
} from 'lucide-react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const DOMAIN_OPTIONS = [
  { id: 'MEDICAL', label: 'Medical & Healthcare (NEET-UG, MBBS, BDS, Biotech)' },
  { id: 'ENGINEERING', label: 'Engineering & Technology (JEE, B.Tech, CS, Robotics)' },
  { id: 'COMMERCE', label: 'Commerce, Finance & CA (Chartered Accountancy, SRCC, IPMAT)' },
  { id: 'ARTS', label: 'Arts, Law & Design (CLAT, UCEED, NID, Civil Services)' },
  { id: 'OVERSEAS', label: 'Overseas Admissions & Global Scholarships (SAT, GRE, Ivy/Russell)' },
];

export default function AdvisorRegisterPage() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [domain, setDomain] = useState('ENGINEERING');
  const [experienceYears, setExperienceYears] = useState(5);
  const [highestEducation, setHighestEducation] = useState('');
  const [almaMater, setAlmaMater] = useState('');
  const [currentRole, setCurrentRole] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [feePerSessionINR, setFeePerSessionINR] = useState(1000);
  const [proofDescription, setProofDescription] = useState('');
  const [bio, setBio] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (linkedinUrl && !/^https?:\/\//i.test(linkedinUrl)) {
      setError('Please provide a valid LinkedIn URL starting with https://');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // 1. Submit application to backend API
      const res = await fetch('/api/auth/register-advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          password,
          phone,
          domain,
          experienceYears: parseInt(experienceYears.toString(), 10),
          highestEducation,
          almaMater,
          currentRole,
          linkedinUrl,
          feePerSessionINR: parseInt(feePerSessionINR.toString(), 10),
          proofDescription,
          bio,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to submit application. Please check your inputs.');
        setLoading(false);
        return;
      }

      // 2. Sign in with the newly registered consultant account
      const loginRes = await signIn('credentials', {
        redirect: false,
        email,
        password,
        callbackUrl: '/consultant/pending',
      });

      if (loginRes?.ok) {
        router.push('/consultant/pending');
        router.refresh();
      } else {
        router.push('/login');
      }
    } catch (err) {
      console.error('Advisor registration error:', err);
      setError('An error occurred during application submission. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-lg dark:border-slate-800 dark:bg-slate-900">
        <div className="text-center">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-700 text-amber-300 shadow-sm mb-3">
            <Briefcase className="h-6 w-6" />
          </div>
          <div className="inline-block px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-extrabold text-emerald-800 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-200 mb-2">
            Compulsory Verification & Credential Audit
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B2A4A] dark:text-white tracking-tight">
            Apply to Become a CAREER-GUD Mentor
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300 max-w-xl mx-auto">
            To protect students from misleading advice, all counselors must submit verifiable degrees, experience records, and professional background for administrative audit.
          </p>
        </div>

        {error && (
          <div className="mt-6 flex items-center gap-2 rounded-xl bg-rose-50 border border-rose-200 p-4 text-xs font-bold text-rose-800 dark:bg-rose-950/60 dark:border-rose-900 dark:text-rose-200">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-6">
          {/* Section 1: Account Identity */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 sm:p-6 dark:border-slate-800 dark:bg-slate-800/40">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#0B2A4A] dark:text-amber-400 mb-3 flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>1. Personal & Contact Credentials</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Dr. Ananya Sharma / Er. Rajesh Menon"
                  className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs sm:text-sm font-medium text-slate-900 focus:border-[#0B2A4A] focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Official Email Address <span className="text-rose-600">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="counselor@institution.edu"
                  className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs sm:text-sm font-medium text-slate-900 focus:border-[#0B2A4A] focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Create Password <span className="text-rose-600">*</span>
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs sm:text-sm font-medium text-slate-900 focus:border-[#0B2A4A] focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Contact Phone Number <span className="text-rose-600">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs sm:text-sm font-medium text-slate-900 focus:border-[#0B2A4A] focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Domain Specialization */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
              2. Target Domain Specialization <span className="text-rose-600">*</span>
            </label>
            <div className="grid grid-cols-1 gap-2">
              {DOMAIN_OPTIONS.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => setDomain(d.id)}
                  className={`rounded-xl border p-3 text-left text-xs font-bold transition cursor-pointer flex items-center justify-between ${
                    domain === d.id
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-950 hover:bg-emerald-100/70 dark:bg-emerald-950/60 dark:text-emerald-100 ring-2 ring-emerald-600 dark:hover:bg-emerald-950/80'
                      : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 dark:hover:text-white'
                  }`}
                >
                  <span>{d.label}</span>
                  {domain === d.id && <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />}
                </button>
              ))}
            </div>
          </div>

          {/* Section 3: Professional Experience & Qualifications */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 sm:p-6 dark:border-slate-800 dark:bg-slate-800/40">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#0B2A4A] dark:text-amber-400 mb-3 flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              <span>3. Academic & Work Experience (All Mandatory)</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Years of Counseling Experience <span className="text-rose-600">*</span>
                </label>
                <input
                  type="number"
                  required
                  min={2}
                  max={45}
                  value={experienceYears}
                  onChange={(e) => setExperienceYears(parseInt(e.target.value, 10))}
                  className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs sm:text-sm font-medium text-slate-900 focus:border-[#0B2A4A] focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Highest Degree Qualification <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={highestEducation}
                  onChange={(e) => setHighestEducation(e.target.value)}
                  placeholder="e.g. MD / MBBS, M.Tech (CSE), CA, PhD"
                  className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs sm:text-sm font-medium text-slate-900 focus:border-[#0B2A4A] focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Alma Mater / University <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={almaMater}
                  onChange={(e) => setAlmaMater(e.target.value)}
                  placeholder="e.g. AIIMS Delhi, IIT Bombay, SRCC Delhi"
                  className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs sm:text-sm font-medium text-slate-900 focus:border-[#0B2A4A] focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Current Role & Organization <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={currentRole}
                  onChange={(e) => setCurrentRole(e.target.value)}
                  placeholder="e.g. Head of College Counseling, Senior Physician"
                  className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs sm:text-sm font-medium text-slate-900 focus:border-[#0B2A4A] focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  LinkedIn Profile URL <span className="text-rose-600">*</span>
                </label>
                <input
                  type="url"
                  required
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  placeholder="https://linkedin.com/in/username"
                  className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs sm:text-sm font-medium text-slate-900 focus:border-[#0B2A4A] focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Session Fee (INR per 45-min consultation)
                </label>
                <input
                  type="number"
                  required
                  min={0}
                  max={15000}
                  step={100}
                  value={feePerSessionINR}
                  onChange={(e) => setFeePerSessionINR(parseInt(e.target.value, 10))}
                  className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs sm:text-sm font-medium text-slate-900 focus:border-[#0B2A4A] focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Verification Proof & Philosophy */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              4. Verification Proof / Document Link / Council Reg # <span className="text-rose-600">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={proofDescription}
              onChange={(e) => setProofDescription(e.target.value)}
              placeholder="State Medical Council registration number, ICAI membership ID, or Google Drive / DigiLocker link to degree certificates..."
              className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs sm:text-sm font-medium text-slate-900 focus:border-[#0B2A4A] focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            />
            <p className="mt-1 text-[11px] text-slate-500">
              Administrators review this documentation before activating your verified mentor badge.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              5. Counseling Philosophy & Bio <span className="text-rose-600">*</span>
            </label>
            <textarea
              required
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Explain how you help students make realistic academic decisions, handle competitive exam pressure, and choose careers based on genuine strengths rather than coaching hype..."
              className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs sm:text-sm font-medium text-slate-900 focus:border-[#0B2A4A] focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            />
          </div>

          <div className="rounded-xl bg-amber-50 border border-amber-200 p-3.5 text-xs text-[#994500] dark:bg-amber-950/30 dark:border-amber-900 dark:text-amber-200 flex items-start gap-2">
            <ShieldCheck className="h-4 w-4 shrink-0 mt-0.5" />
            <span>
              By submitting this application, you attest that all qualifications, experience figures, and credentials provided are true and verifiable. Fraudulent claims result in immediate permanent disqualification.
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 py-3.5 text-xs sm:text-sm font-bold text-white shadow-md hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 disabled:opacity-50 transition cursor-pointer"
          >
            {loading ? 'Submitting Application...' : 'Submit Application for Administrative Audit'}
            <ArrowRight className="h-4 w-4 text-amber-300" />
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-600 dark:text-slate-400">
          Already a registered mentor?{' '}
          <Link href="/login" className="font-bold text-[#0B2A4A] underline dark:text-amber-400">
            Sign In Here
          </Link>
        </p>
      </div>
    </div>
  );
}
