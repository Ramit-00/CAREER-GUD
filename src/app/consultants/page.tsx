'use client';

import { ConsultantDomain, ConsultantProfile } from '@/types';
import {
  ArrowRight,
  Award,
  CheckCircle2,
  GraduationCap,
  Search,
  ShieldCheck,
  Star,
  UserCheck,
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

  useEffect(() => {
    fetchConsultants();
  }, [selectedFilter]);

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

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1 text-xs font-bold text-teal-700 dark:bg-teal-950/40 dark:text-teal-300 mb-2">
            <ShieldCheck className="h-3.5 w-3.5" />
            Strict Per-Domain Human Verification
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
            Verified Indian Career Consultants
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
            Book 1-on-1 strategic consultations with verified alumni and industry leaders. Mentors are rigorously restricted to advise only in domains where their credentials have been independently validated.
          </p>
        </div>

        <Link
          href="/consultants/apply"
          className="rounded-2xl border-2 border-indigo-600 px-5 py-2.5 text-xs font-bold text-indigo-600 hover:bg-indigo-50 dark:border-indigo-400 dark:text-indigo-400 dark:hover:bg-indigo-950/30 transition shrink-0"
        >
          Apply as Domain Mentor →
        </Link>
      </div>

      {/* Domain Filters */}
      <div className="mt-8 flex flex-wrap gap-2">
        {DOMAIN_FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setSelectedFilter(f.id)}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
              selectedFilter === f.id
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Consultants Grid */}
      {loading ? (
        <div className="py-20 text-center text-sm text-slate-500">
          <span className="animate-spin inline-block h-5 w-5 border-2 border-indigo-600 border-t-transparent rounded-full mb-2" />
          <p>Loading verified consultants...</p>
        </div>
      ) : consultants.length === 0 ? (
        <div className="py-20 text-center text-sm text-slate-500">
          No consultants verified in this domain yet.
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {consultants.map((consultant) => (
            <div
              key={consultant.id}
              className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 hover:border-indigo-300 dark:hover:border-indigo-800 transition"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                      {consultant.name}
                    </h3>
                    <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium line-clamp-1 mt-0.5">
                      {consultant.headline}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 rounded-lg bg-amber-50 px-2 py-1 text-xs font-bold text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    <span>{consultant.rating}</span>
                  </div>
                </div>

                <p className="mt-3 text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                  {consultant.bio}
                </p>

                <div className="mt-4 flex flex-col gap-1 text-xs text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <GraduationCap className="h-3.5 w-3.5 text-slate-400" />
                    <span>{consultant.almaMater} ({consultant.highestEducation})</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Award className="h-3.5 w-3.5 text-slate-400" />
                    <span>{consultant.experienceYears} Years Clinical/Industry Experience</span>
                  </div>
                </div>

                {/* Verified Domain Badges */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Verified Advisory Domains:
                  </span>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {consultant.domainVerifications
                      .filter((v) => v.status === 'VERIFIED')
                      .map((v, i) => (
                        <span
                          key={i}
                          className="flex items-center gap-1 rounded-md bg-teal-50 border border-teal-200 px-2 py-0.5 text-[10px] font-bold text-teal-700 dark:bg-teal-950 dark:border-teal-800 dark:text-teal-300"
                        >
                          <CheckCircle2 className="h-3 w-3 text-teal-600" />
                          <span>{v.domain}</span>
                        </span>
                      ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-4">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Fee per 45-min Session</span>
                  <span className="text-sm font-black text-slate-900 dark:text-white">₹{consultant.feePerSessionINR}</span>
                </div>
                <Link
                  href={`/consultants/${consultant.id}`}
                  className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-500 shadow-sm transition"
                >
                  <span>Book Consultation</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
