'use client';

import { College } from '@/types';
import { ArrowRight, Building2, MapPin, Search } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const STATES = ['ALL', 'Delhi', 'Maharashtra', 'Karnataka', 'Rajasthan'];
const TYPES = ['ALL', 'GOVERNMENT', 'PRIVATE', 'DEEMED'];

export default function CollegesPage() {
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedState, setSelectedState] = useState('ALL');
  const [selectedType, setSelectedType] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchColleges();
  }, [selectedState, selectedType]);

  const fetchColleges = async () => {
    setLoading(true);
    try {
      const url = new URL('/api/colleges', window.location.origin);
      if (selectedState !== 'ALL') url.searchParams.set('state', selectedState);
      if (selectedType !== 'ALL') url.searchParams.set('type', selectedType);
      if (searchQuery) url.searchParams.set('search', searchQuery);

      const res = await fetch(url.toString());
      if (res.ok) {
        const data = await res.json();
        setColleges(data);
      }
    } catch (err) {
      console.error('Error fetching colleges:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchColleges();
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b-2 border-slate-200 dark:border-slate-800">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-amber-300 bg-[#FFF8EE] px-3 py-1.5 text-xs font-bold text-[#D96B00] dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300 mb-3 shadow-2xs">
            <Building2 className="h-4 w-4 text-[#D96B00] dark:text-amber-400" />
            National Institutional Ranking Framework (NIRF) & Placement Audits
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-[#0B2A4A] dark:text-white tracking-tight">
            Accredited Colleges & Universities in India
          </h1>
          <p className="mt-2 text-sm text-slate-700 dark:text-slate-300 max-w-2xl leading-relaxed font-normal">
            Audit public placement records, statutory accreditation status (UGC/AICTE/MCI/BCI), seat matrices, and semester fee structures.
          </p>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex items-center gap-2 max-w-md w-full">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 dark:text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by college name, city, or degree..."
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

      {/* Filters */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2.5">
          {STATES.map((st) => (
            <button
              key={st}
              onClick={() => setSelectedState(st)}
              className={`rounded-xl px-4 py-2 text-xs sm:text-sm font-bold transition ${
                selectedState === st
                  ? 'bg-[#0B2A4A] text-white shadow-xs'
                  : 'bg-white text-slate-800 border-2 border-slate-300 hover:border-slate-400 hover:bg-slate-100 hover:text-slate-950 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-white'
              }`}
            >
              {st === 'ALL' ? 'All States' : st}
            </button>
          ))}
        </div>

        <div className="flex gap-2 text-xs sm:text-sm">
          {TYPES.map((t) => (
            <button
              key={t}
              onClick={() => setSelectedType(t)}
              className={`rounded-lg px-3 py-1.5 font-bold transition ${
                selectedType === t
                  ? 'bg-[#0B2A4A] text-white dark:bg-white dark:text-slate-950'
                  : 'text-slate-700 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* College Grid */}
      {loading ? (
        <div className="py-20 text-center text-sm font-bold text-slate-700 dark:text-slate-300">
          <span className="animate-spin inline-block h-6 w-6 border-3 border-blue-600 border-t-transparent rounded-full mb-3" />
          <p>Loading accredited institutions...</p>
        </div>
      ) : colleges.length === 0 ? (
        <div className="py-20 text-center text-sm font-bold text-slate-700 dark:text-slate-300">
          No institutions matched your filter criteria.
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {colleges.map((col) => (
            <div
              key={col.id}
              className="flex flex-col justify-between rounded-2xl border-2 border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 hover:border-slate-400 dark:hover:border-slate-600 transition"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="rounded-lg bg-blue-50/80 px-2.5 py-1 text-xs font-black text-[#0B2A4A] dark:bg-blue-950 dark:text-blue-200 border border-blue-200 dark:border-blue-800">
                    NIRF #{col.nirfRank ?? 'N/A'}
                  </span>
                  <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-800 dark:bg-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                    {col.type}
                  </span>
                </div>

                <h3 className="text-lg font-black text-slate-950 dark:text-white mt-3">
                  {col.name}
                </h3>
                <p className="flex items-center gap-1 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 mt-1.5">
                  <MapPin className="h-4 w-4 text-slate-500 shrink-0" />
                  {col.city}, {col.state}
                </p>

                {/* Placements Box */}
                <div className="mt-4 rounded-xl border border-slate-300 bg-[#F8F9FA] p-3 text-xs dark:border-slate-700 dark:bg-slate-800/80 font-bold">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Placement Audit (NIRF / Institutional)
                  </span>
                  <div className="mt-1.5 flex justify-between">
                    <span className="text-slate-700 dark:text-slate-300">Avg CTC:</span>
                    <strong className="text-slate-950 dark:text-white">{col.placementStats.avgPackageINR}</strong>
                  </div>
                  <div className="mt-1 flex justify-between">
                    <span className="text-slate-700 dark:text-slate-300">Highest CTC:</span>
                    <strong className="text-[#138808] dark:text-emerald-400">{col.placementStats.highestPackageINR}</strong>
                  </div>
                  <div className="mt-1 flex justify-between">
                    <span className="text-slate-700 dark:text-slate-300">Placement %:</span>
                    <strong className="text-slate-950 dark:text-white">{col.placementStats.placementPercentage}%</strong>
                  </div>
                </div>

                {/* Programs Tag */}
                <div className="mt-4">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Accredited Programs:</span>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {col.programs.map((p) => (
                      <span
                        key={p.id}
                        className="rounded-md bg-slate-200 px-2.5 py-1 text-xs font-bold text-slate-800 dark:bg-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700"
                      >
                        {p.name.split(' (')[0]}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <Link
                href={`/colleges/${col.slug}`}
                className="mt-6 flex items-center justify-center gap-2 rounded-xl border-2 border-slate-300 py-2.5 text-xs sm:text-sm font-bold text-[#0B2A4A] hover:bg-[#0B2A4A] hover:text-white hover:border-[#0B2A4A] dark:border-slate-700 dark:text-white dark:hover:bg-[#0B2A4A] dark:hover:border-[#0B2A4A] transition"
              >
                <span>Seat Matrix & Fee Details</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
