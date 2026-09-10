'use client';

import { AutomationMeter } from '@/components/charts/AutomationMeter';
import { Career } from '@/types';
import { ArrowRight, Briefcase, Search, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const STREAMS = [
  { id: 'ALL', label: 'All Streams' },
  { id: 'SCIENCE_PCM', label: 'Science (PCM / Non-Med)' },
  { id: 'SCIENCE_PCB', label: 'Science (PCB / Medical)' },
  { id: 'COMMERCE', label: 'Commerce & Finance' },
  { id: 'ARTS', label: 'Arts & Design' },
];

export default function CareersPage() {
  const [careers, setCareers] = useState<Career[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStream, setSelectedStream] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchCareers = async () => {
    setLoading(true);
    try {
      const url = new URL('/api/careers', window.location.origin);
      if (selectedStream !== 'ALL') url.searchParams.set('stream', selectedStream);
      if (searchQuery) url.searchParams.set('search', searchQuery);

      const res = await fetch(url.toString());
      if (res.ok) {
        const data = await res.json();
        setCareers(data);
      }
    } catch (err) {
      console.error('Error fetching careers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCareers();
  }, [selectedStream]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCareers();
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b-2 border-slate-200 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-lg border border-amber-300 bg-[#FFF8EE] px-3 py-1.5 text-xs font-bold text-[#D96B00] dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300 mb-3 shadow-2xs">
            <Briefcase className="h-4 w-4 text-[#D96B00] dark:text-amber-400" />
            Empirical Indian Career Dossier & Industry Outlook
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#0B2A4A] dark:text-white tracking-tight">
            Career Pathways & Future Automation Risk
          </h1>
          <p className="mt-2 text-sm text-slate-700 dark:text-slate-300 max-w-2xl font-normal leading-relaxed">
            Statutory prerequisites, daily workload realities, official entrance examinations, verified compensation bands in INR, and AI automation exposure indices.
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex items-center gap-2 max-w-md w-full">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 dark:text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search careers, skills, or degrees..."
              className="w-full rounded-xl border-2 border-slate-300 bg-white py-2.5 pl-10 pr-3 text-xs sm:text-sm font-medium text-slate-900 focus:border-[#0B2A4A] focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white shadow-xs"
            />
          </div>
          <button
            type="submit"
            className="rounded-xl bg-[#0B2A4A] px-5 py-2.5 text-xs sm:text-sm font-bold text-white hover:bg-[#071C33] transition shadow-xs"
          >
            Search
          </button>
        </form>
      </div>

      {/* Stream Filter Pills */}
      <div className="mt-6 flex flex-wrap gap-2.5">
        {STREAMS.map((s) => (
          <button
            key={s.id}
            onClick={() => setSelectedStream(s.id)}
            className={`rounded-xl px-4 py-2 text-xs sm:text-sm font-bold transition ${
              selectedStream === s.id
                ? 'bg-[#0B2A4A] text-white shadow-xs'
                : 'bg-white text-slate-800 border-2 border-slate-300 hover:border-slate-400 hover:bg-slate-100 hover:text-slate-950 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-white'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Career Grid */}
      {loading ? (
        <div className="py-20 text-center text-sm font-bold text-slate-700 dark:text-slate-300">
          <span className="animate-spin inline-block h-6 w-6 border-3 border-blue-600 border-t-transparent rounded-full mb-3" />
          <p>Loading verified career dossiers...</p>
        </div>
      ) : careers.length === 0 ? (
        <div className="py-20 text-center text-sm font-bold text-slate-700 dark:text-slate-300">
          No career profiles matched your query.
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {careers.map((career) => (
            <div
              key={career.id}
              className="flex flex-col justify-between rounded-2xl border-2 border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 hover:border-slate-400 dark:hover:border-slate-600 transition"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="rounded-lg bg-blue-50/80 px-2.5 py-1 text-xs font-black text-[#0B2A4A] border border-blue-200 dark:bg-blue-950/80 dark:border-blue-900 dark:text-blue-200">
                    {career.streamLabel}
                  </span>
                  <span className="text-xs font-bold text-[#138808] dark:text-emerald-400 flex items-center gap-1">
                    <TrendingUp className="h-4 w-4" />
                    {career.outlook.demandTrend}
                  </span>
                </div>

                <h3 className="text-lg font-black text-slate-950 dark:text-white mt-3">
                  {career.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 mt-2 line-clamp-3 leading-relaxed font-normal">
                  {career.description}
                </p>

                {/* Automation Meter */}
                <div className="mt-4">
                  <AutomationMeter
                    score={career.outlook.automationRiskScore}
                    label={career.outlook.automationRiskLabel}
                  />
                </div>

                {/* Salary Info */}
                <div className="mt-4 rounded-xl border border-slate-300 bg-[#F8F9FA] p-3 text-xs dark:border-slate-700 dark:bg-slate-800/80">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Verified Industry Compensation (India)
                  </span>
                  <div className="flex justify-between mt-1.5 font-bold">
                    <span className="text-slate-700 dark:text-slate-300">
                      Entry: <strong className="text-slate-950 dark:text-white">{career.outlook.avgSalaryRangeINR.entry}</strong>
                    </span>
                    <span className="text-[#0B2A4A] dark:text-blue-400">
                      Mid: {career.outlook.avgSalaryRangeINR.mid}
                    </span>
                  </div>
                </div>

                {/* Key Skills */}
                <div className="mt-3.5 flex flex-wrap gap-1.5">
                  {career.requiredSkills.slice(0, 3).map((sk, i) => (
                    <span
                      key={i}
                      className="rounded-md bg-slate-200 px-2.5 py-1 text-xs font-bold text-slate-800 dark:bg-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700"
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              <Link
                href={`/careers/${career.slug}`}
                className="mt-6 flex items-center justify-center gap-2 rounded-xl border-2 border-slate-300 py-2.5 text-xs sm:text-sm font-bold text-[#0B2A4A] hover:bg-[#0B2A4A] hover:text-white hover:border-[#0B2A4A] dark:border-slate-700 dark:text-white dark:hover:bg-[#0B2A4A] dark:hover:border-[#0B2A4A] transition"
              >
                <span>Curricular Roadmap & Reality Check</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
