'use client';

import { AutomationMeter } from '@/components/charts/AutomationMeter';
import { Career } from '@/types';
import { ArrowRight, Briefcase, Search, Sparkles, TrendingUp } from 'lucide-react';
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

  useEffect(() => {
    fetchCareers();
  }, [selectedStream]);

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCareers();
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 mb-2">
            <Sparkles className="h-3.5 w-3.5" />
            30+ Realistic Indian Career Outlooks
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
            Explore Careers & Future Opportunities
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
            Understand day-to-day realities, entrance exams, real salary bands in INR, and AI automation vulnerability across all Indian streams.
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex items-center gap-2 max-w-md w-full">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search careers, skills, or degrees..."
              className="w-full rounded-2xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white shadow-sm"
            />
          </div>
          <button
            type="submit"
            className="rounded-2xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white shadow-md hover:bg-indigo-500 transition"
          >
            Search
          </button>
        </form>
      </div>

      {/* Stream Filter Pills */}
      <div className="mt-8 flex flex-wrap gap-2">
        {STREAMS.map((s) => (
          <button
            key={s.id}
            onClick={() => setSelectedStream(s.id)}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
              selectedStream === s.id
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Career Grid */}
      {loading ? (
        <div className="py-20 text-center text-sm text-slate-500">
          <span className="animate-spin inline-block h-5 w-5 border-2 border-indigo-600 border-t-transparent rounded-full mb-2" />
          <p>Loading career profiles...</p>
        </div>
      ) : careers.length === 0 ? (
        <div className="py-20 text-center text-sm text-slate-500">
          No careers matched your search criteria.
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {careers.map((career) => (
            <div
              key={career.id}
              className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 hover:border-indigo-300 dark:hover:border-indigo-800 transition"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    {career.streamLabel}
                  </span>
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <TrendingUp className="h-3.5 w-3.5" />
                    {career.outlook.demandTrend}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-3">
                  {career.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 line-clamp-3 leading-relaxed">
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
                <div className="mt-4 rounded-2xl bg-slate-50 p-3 text-xs dark:bg-slate-800/40">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Salary in India
                  </span>
                  <div className="flex justify-between mt-1">
                    <span className="text-slate-600 dark:text-slate-300">
                      Entry: <strong>{career.outlook.avgSalaryRangeINR.entry}</strong>
                    </span>
                    <span className="text-indigo-600 dark:text-indigo-400 font-bold">
                      Mid: {career.outlook.avgSalaryRangeINR.mid}
                    </span>
                  </div>
                </div>

                {/* Key Skills */}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {career.requiredSkills.slice(0, 3).map((sk, i) => (
                    <span
                      key={i}
                      className="rounded-lg bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              <Link
                href={`/careers/${career.slug}`}
                className="mt-6 flex items-center justify-center gap-2 rounded-xl border border-slate-200 py-2.5 text-xs font-bold text-slate-800 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-800 transition"
              >
                <span>View Full Roadmap & Reality Check</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
