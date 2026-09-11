'use client';

import { ConsultantDomain } from '@/types';
import {
  ArrowRight,
  CheckCircle2,
  FileCheck,
  Plus,
  Trash2,
  Upload,
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const DOMAINS: ConsultantDomain[] = ['MEDICAL', 'ENGINEERING', 'COMMERCE', 'ARTS', 'OVERSEAS'];

export default function ConsultantApplyPage() {
  const { data: session } = useSession();
  const router = useRouter();

  const [headline, setHeadline] = useState('');
  const [bio, setBio] = useState('');
  const [experienceYears, setExperienceYears] = useState(5);
  const [highestEducation, setHighestEducation] = useState('');
  const [almaMater, setAlmaMater] = useState('');
  const [currentRole, setCurrentRole] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [feePerSessionINR, setFeePerSessionINR] = useState(1000);

  const [domainApplications, setDomainApplications] = useState<
    Array<{ domain: ConsultantDomain; proofDescription: string; proofDocumentUrl?: string }>
  >([
    {
      domain: 'ENGINEERING',
      proofDescription: 'B.Tech Degree from premier engineering institute + 5 yrs tech leadership.',
    },
  ]);

  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [appliedSuccess, setAppliedSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleAddDomain = () => {
    setDomainApplications([
      ...domainApplications,
      { domain: 'COMMERCE', proofDescription: '' },
    ]);
  };

  const handleRemoveDomain = (index: number) => {
    setDomainApplications(domainApplications.filter((_, i) => i !== index));
  };

  const handleDomainChange = (index: number, domain: ConsultantDomain) => {
    const updated = [...domainApplications];
    updated[index].domain = domain;
    setDomainApplications(updated);
  };

  const handleProofChange = (index: number, proof: string) => {
    const updated = [...domainApplications];
    updated[index].proofDescription = proof;
    setDomainApplications(updated);
  };

  const handleFileUpload = async (index: number, file: File) => {
    setUploadingIndex(index);
    try {
      const res = await fetch('/api/consultants/upload-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type || 'application/pdf',
          fileSize: file.size,
          domain: domainApplications[index].domain,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const updated = [...domainApplications];
        updated[index].proofDocumentUrl = data.fileUrl;
        setDomainApplications(updated);
      }
    } catch (err) {
      console.error('Document upload error:', err);
    } finally {
      setUploadingIndex(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    if (!session) {
      router.push('/login?callbackUrl=/consultants/apply');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/consultants/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          headline,
          bio,
          experienceYears,
          highestEducation,
          almaMater,
          currentRole,
          linkedinUrl: linkedinUrl || undefined,
          feePerSessionINR,
          domains: domainApplications,
        }),
      });

      const resData = await res.json();
      if (!res.ok) {
        throw new Error(resData.error || 'Failed to submit application. Please check all fields.');
      }

      setAppliedSuccess(true);
    } catch (err: any) {
      console.error('Application submit error:', err);
      setSubmitError(err.message || 'Failed to submit application. Please check all fields.');
    } finally {
      setSubmitting(false);
    }
  };

  if (appliedSuccess) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <div className="rounded-3xl border border-teal-200 bg-teal-50/80 p-8">
          <CheckCircle2 className="h-12 w-12 text-teal-600 mx-auto mb-3" />
          <h2 className="text-2xl font-black text-teal-900">
            Consultant Application Submitted!
          </h2>
          <p className="mt-2 text-xs text-teal-700 leading-relaxed">
            Our administrative team reviews all submitted degrees, council registration numbers, and institutional credentials per domain. Once approved, your profile will become bookable in verified domains.
          </p>
          <Link
            href="/consultants"
            className="mt-6 inline-block rounded-xl bg-teal-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-teal-500 transition"
          >
            Browse Mentors Directory
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 sm:p-12 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <span className="rounded-lg border border-amber-300 bg-[#FFF8EE] px-3.5 py-1 text-xs font-black text-[#D96B00]">
            Professional Mentorship Registry
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-[#0B2A4A] tracking-tight">
          Apply as a Verified Career Consultant
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
          CAREER-GUD maintains strict quality control: you will be independently audited and approved for specific domains (Medical, Engineering, Commerce, Law/Arts, Overseas).
        </p>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5 text-xs sm:text-sm">
          <div>
            <label className="block font-black text-slate-900 mb-1.5">
              Professional Headline
            </label>
            <input
              type="text"
              required
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="E.g. Senior Clinical Specialist & AIIMS Alumna | NEET Career Strategist"
              className="w-full rounded-xl border border-slate-300 bg-white p-3 font-medium text-slate-900 focus:border-blue-600 focus:outline-none shadow-xs"
            />
          </div>

          <div>
            <label className="block font-black text-slate-900 mb-1.5">
              Bio & Counseling Experience
            </label>
            <textarea
              required
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Describe your background, students mentored, and realistic counseling philosophy..."
              className="w-full rounded-xl border border-slate-300 bg-white p-3 font-medium text-slate-900 focus:border-blue-600 focus:outline-none shadow-xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-black text-slate-900 mb-1.5">
                Experience (Years)
              </label>
              <input
                type="number"
                min={1}
                max={40}
                required
                value={experienceYears}
                onChange={(e) => setExperienceYears(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-300 bg-white p-2.5 font-bold text-slate-900 focus:border-blue-600 focus:outline-none shadow-xs"
              />
            </div>

            <div>
              <label className="block font-black text-slate-900 mb-1.5">
                Highest Education
              </label>
              <input
                type="text"
                required
                value={highestEducation}
                onChange={(e) => setHighestEducation(e.target.value)}
                placeholder="E.g. MBBS, MD or B.Tech, M.Tech"
                className="w-full rounded-xl border border-slate-300 bg-white p-2.5 font-bold text-slate-900 focus:border-blue-600 focus:outline-none shadow-xs"
              />
            </div>

            <div>
              <label className="block font-black text-slate-900 mb-1.5">
                Alma Mater
              </label>
              <input
                type="text"
                required
                value={almaMater}
                onChange={(e) => setAlmaMater(e.target.value)}
                placeholder="E.g. AIIMS Delhi or IIT Bombay"
                className="w-full rounded-xl border border-slate-300 bg-white p-2.5 font-bold text-slate-900 focus:border-blue-600 focus:outline-none shadow-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-black text-slate-900 mb-1.5">
                Current Role / Designation
              </label>
              <input
                type="text"
                required
                value={currentRole}
                onChange={(e) => setCurrentRole(e.target.value)}
                placeholder="E.g. Associate Professor"
                className="w-full rounded-xl border border-slate-300 bg-white p-2.5 font-bold text-slate-900 focus:border-blue-600 focus:outline-none shadow-xs"
              />
            </div>

            <div>
              <label className="block font-black text-slate-900 mb-1.5">
                LinkedIn Profile
              </label>
              <input
                type="url"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                placeholder="https://linkedin.com/in/..."
                className="w-full rounded-xl border border-slate-300 bg-white p-2.5 font-medium text-slate-900 focus:border-blue-600 focus:outline-none shadow-xs"
              />
            </div>

            <div>
              <label className="block font-black text-slate-900 mb-1.5">
                Fee per Session (INR)
              </label>
              <input
                type="number"
                min={0}
                max={10000}
                value={feePerSessionINR}
                onChange={(e) => setFeePerSessionINR(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-300 bg-white p-2.5 font-bold text-slate-900 focus:border-blue-600 focus:outline-none shadow-xs"
              />
            </div>
          </div>

          {/* Per-Domain Verification Credentials */}
          <div className="mt-4 border-t border-slate-200 pt-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-black text-slate-950 text-base">
                  Domain Expertise & Credential Proof
                </h3>
                <p className="text-xs text-slate-600 font-medium">
                  Select which stream(s) you wish to advise on and describe your verifiable proof.
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddDomain}
                className="flex items-center gap-1.5 rounded-xl bg-slate-100 border border-slate-300 px-3.5 py-1.5 text-xs font-bold text-slate-900 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                Add Domain
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {domainApplications.map((app, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4 flex flex-col gap-3"
                >
                  <div className="flex items-center justify-between">
                    <select
                      value={app.domain}
                      onChange={(e) => handleDomainChange(idx, e.target.value as ConsultantDomain)}
                      className="rounded-xl border border-slate-300 bg-white p-2 font-black text-slate-900 text-xs sm:text-sm shadow-xs"
                    >
                      {DOMAINS.map((d) => (
                        <option key={d} value={d}>
                          {d} Guidance
                        </option>
                      ))}
                    </select>

                    {domainApplications.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveDomain(idx)}
                        className="text-slate-400 hover:text-red-600 transition"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  <input
                    type="text"
                    required
                    value={app.proofDescription}
                    onChange={(e) => handleProofChange(idx, e.target.value)}
                    placeholder="E.g. Degree certificate registration number, ICAI member ID, bar council number..."
                    className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs sm:text-sm font-medium text-slate-900 focus:border-blue-600 focus:outline-none shadow-xs"
                  />

                  {/* Document Upload Option */}
                  <div className="flex items-center justify-between gap-2 pt-1 text-xs">
                    <label className="flex items-center gap-1.5 cursor-pointer text-slate-600 hover:text-slate-900 font-semibold">
                      <Upload className="h-3.5 w-3.5 text-blue-600" />
                      <span>{uploadingIndex === idx ? 'Uploading Document...' : 'Upload Certificate / ID (PDF/Image)'}</span>
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png,.webp"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload(idx, file);
                        }}
                      />
                    </label>

                    {app.proofDocumentUrl && (
                      <span className="flex items-center gap-1 text-emerald-600 font-bold">
                        <FileCheck className="h-3.5 w-3.5" />
                        <span>Document Attached</span>
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {submitError && (
            <div className="mt-4 rounded-xl border border-rose-300 bg-rose-50 p-3 text-xs font-bold text-rose-900">
              {submitError}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#0B2A4A] py-3.5 text-sm sm:text-base font-black text-white shadow-xs hover:bg-[#071C33] disabled:opacity-50 transition cursor-pointer"
          >
            {submitting ? 'Submitting Application...' : 'Submit Application for Admin Audit'}
            <ArrowRight className="h-4 w-4 text-amber-400" />
          </button>
        </form>
      </div>
    </div>
  );
}
