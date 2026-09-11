'use client';

import { ConsultantDomain, ConsultantProfile } from '@/types';
import {
  ArrowRight,
  Award,
  CheckCircle2,
  GraduationCap,
  ShieldCheck,
  Star,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const DOMAIN_FILTERS: { id: string; label: string; domain?: ConsultantDomain }[] = [
  { id: 'ALL', label: 'All Verified Mentors' },
  { id: 'MEDICAL', label: 'Medical & Healthcare (NEET)', domain: 'MEDICAL' },
  { id: 'ENGINEERING', label: 'Engineering & Tech (JEE)', domain: 'ENGINEERING' },
  { id: 'COMMERCE', label: 'Commerce, CA & Finance', domain: 'COMMERCE' },
  { id: 'ARTS', label: 'Law (CLAT), Design & Arts', domain: 'ARTS' },
  { id: 'OVERSEAS', label: 'Study Overseas', domain: 'OVERSEAS' },
];

export default function ConsultantsDirectoryPage() {
  const [consultants, setConsultants] = useState<ConsultantProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('ALL');

  const fetchConsultants = async () => {
    setLoading(true);
    try {
      const url = new URL('/api/consultants', window.location.origin);
      const activeObj = DOMAIN_FILTERS.find((d) => d.id === selectedFilter);
      if (activeObj?.domain) {
        url.searchParams.set('domain', activeObj.domain);
      }

      const res = await fetch(url.toString());
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

  useEffect(() => {
    fetchConsultants();
  }, [selectedFilter]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header Hero Container */}
      <div className="rounded-3xl border-2 border-slate-300 bg-[#EAEFF5] p-6 sm:p-10 shadow-xs mb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b-2 border-slate-200">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-lg border border-amber-300 bg-white px-3.5 py-1.5 text-xs font-bold text-[#D96B00] mb-3 shadow-2xs">
              <ShieldCheck className="h-4 w-4 text-[#138808]" />
              Independent Domain Certification Registry
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-[#0B2A4A] tracking-tight">
              Verified Academic &amp; Industry Advisors
            </h1>
            <p className="mt-2 text-sm text-slate-700 max-w-2xl leading-relaxed font-normal">
              Direct advisory sessions with certified practitioners. Advisors are strictly restricted by administrative protocol to counsel solely within their verified domains.
            </p>
          </div>

          <Link
            href="/consultants/apply"
            className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-300 bg-white px-5 py-2.5 text-xs sm:text-sm font-bold text-[#0B2A4A] hover:border-[#0B2A4A] hover:bg-[#0B2A4A] hover:text-white transition shrink-0 shadow-xs cursor-pointer"
          >
            <span>Apply for Advisory Certification</span>
            <ArrowRight className="h-4 w-4 text-amber-500" />
          </Link>
        </div>

        {/* Domain Filters */}
        <div className="mt-6 flex flex-wrap gap-2.5">
          {DOMAIN_FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setSelectedFilter(f.id)}
              className={`rounded-xl px-4 py-2 text-xs sm:text-sm font-bold transition cursor-pointer ${
                selectedFilter === f.id
                  ? 'bg-[#0B2A4A] text-white shadow-xs'
                  : 'bg-white text-slate-800 border-2 border-slate-300 hover:border-slate-400 hover:bg-slate-100 hover:text-slate-950'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Consultants Grid */}
      {loading ? (
        <div className="py-20 text-center text-sm font-bold text-slate-700">
          <span className="animate-spin inline-block h-6 w-6 border-3 border-[#0B2A4A] border-t-transparent rounded-full mb-3" />
          <p>Loading verified advisor directory...</p>
        </div>
      ) : consultants.length === 0 ? (
        <div className="py-20 text-center text-sm font-bold text-slate-700">
          No advisors currently certified in this specific domain.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {consultants.map((consultant) => (
            <div
              key={consultant.id}
              className="flex flex-col justify-between rounded-2xl border-2 border-slate-300 bg-[#EAEFF5] p-6 shadow-xs hover:bg-white hover:border-[#0B2A4A] hover:shadow-md transition-all group"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-black text-slate-950 group-hover:text-[#0B2A4A] transition-colors">
                      {consultant.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#0B2A4A] font-bold line-clamp-1 mt-0.5">
                      {consultant.headline}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 rounded-lg bg-white border border-amber-300 px-2.5 py-1 text-xs font-black text-amber-900 shadow-2xs">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-500" />
                    <span>{consultant.rating}</span>
                  </div>
                </div>

                <p className="mt-3 text-xs sm:text-sm text-slate-700 line-clamp-3 leading-relaxed font-normal">
                  {consultant.bio}
                </p>

                <div className="mt-4 flex flex-col gap-1.5 text-xs font-semibold text-slate-700">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-slate-500 shrink-0" />
                    <span>{consultant.almaMater} ({consultant.highestEducation})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-slate-500 shrink-0" />
                    <span>{consultant.experienceYears} Years Academic / Industry Experience</span>
                  </div>
                </div>

                {/* Verified Domain Badges */}
                <div className="mt-4 pt-3.5 border-t-2 border-slate-200">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-700 block mb-2">
                    Certified Domains:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {consultant.domainVerifications
                      .filter((v) => v.status === 'VERIFIED')
                      .map((v, i) => (
                        <span
                          key={i}
                          className="flex items-center gap-1.5 rounded-lg bg-white border border-emerald-300 px-2.5 py-1 text-xs font-bold text-[#138808] shadow-2xs"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5 text-[#138808]" />
                          <span>{v.domain}</span>
                        </span>
                      ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between border-t-2 border-slate-200 pt-4">
                <div>
                  <span className="text-xs text-slate-600 uppercase font-black block">Rate / 45-min Session</span>
                  <span className="text-base font-black text-slate-950">₹{consultant.feePerSessionINR}</span>
                </div>
                <Link
                  href={`/consultants/${consultant.id}`}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#0B2A4A] px-4 py-2 text-xs sm:text-sm font-bold text-white hover:bg-[#153e6b] transition shadow-xs cursor-pointer"
                >
                  <span>Book Advisory</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
