'use client';

import { College } from '@/types';
import { ArrowRight, BookOpen, Building2, MapPin, Search, Star } from 'lucide-react';
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
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-slate-200 dark:border-slate-800">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1 text-xs font-bold text-teal-700 dark:bg-teal-950/40 dark:text-teal-300 mb-2">
            <Building2 className="h-3.5 w-3.5" />
            NIRF Aligned Public Data
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
            Top Indian Colleges & Programs
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
            Explore premier government and private institutions with authentic placement records, program fee breakdowns, and entrance exam requirements.
          </p>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex items-center gap-2 max-w-md w-full">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search college name, city, or degree..."
              className="w-full rounded-2xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm focus:border-teal-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white shadow-sm"
            />
          </div>
          <button
            type="submit"
            className="rounded-2xl bg-teal-600 px-4 py-2.5 text-sm font-bold text-white shadow-md hover:bg-teal-500 transition"
          >
            Search
          </button>
        </form>
      </div>

      {/* Filters */}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {STATES.map((st) => (
            <button
              key={st}
              onClick={() => setSelectedState(st)}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition ${
                selectedState === st
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300'
              }`}
            >
              {st === 'ALL' ? 'All States' : st}
            </button>
          ))}
        </div>

        <div className="flex gap-2 text-xs">
          {TYPES.map((t) => (
            <button
              key={t}
              onClick={() => setSelectedType(t)}
              className={`rounded-lg px-2.5 py-1 font-semibold transition ${
                selectedType === t
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* College Grid */}
      {loading ? (
        <div className="py-20 text-center text-sm text-slate-500">
          <span className="animate-spin inline-block h-5 w-5 border-2 border-teal-600 border-t-transparent rounded-full mb-2" />
          <p>Loading verified colleges...</p>
        </div>
      ) : colleges.length === 0 ? (
        <div className="py-20 text-center text-sm text-slate-500">
          No colleges match your filter.
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {colleges.map((col) => (
            <div
              key={col.id}
              className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 hover:border-teal-300 dark:hover:border-teal-800 transition"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-teal-50 px-2.5 py-1 text-[11px] font-bold text-teal-700 dark:bg-teal-950/50 dark:text-teal-300">
                    NIRF #{col.nirfRank ?? 'N/A'}
                  </span>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    {col.type}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-3">
                  {col.name}
                </h3>
                <p className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                  <MapPin className="h-3.5 w-3.5 text-slate-400" />
                  {col.city}, {col.state}
                </p>

                {/* Placements Box */}
                <div className="mt-4 rounded-2xl bg-slate-50 p-3.5 text-xs dark:bg-slate-800/40">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Public Placement Record
                  </span>
                  <div className="mt-1 flex justify-between">
                    <span className="text-slate-600 dark:text-slate-300">Avg Package:</span>
                    <strong className="text-slate-900 dark:text-white">{col.placementStats.avgPackageINR}</strong>
                  </div>
                  <div className="mt-0.5 flex justify-between">
                    <span className="text-slate-600 dark:text-slate-300">Highest Package:</span>
                    <strong className="text-emerald-600 dark:text-emerald-400">{col.placementStats.highestPackageINR}</strong>
                  </div>
                  <div className="mt-0.5 flex justify-between">
                    <span className="text-slate-600 dark:text-slate-300">Placement %:</span>
                    <strong className="text-slate-900 dark:text-white">{col.placementStats.placementPercentage}%</strong>
                  </div>
                </div>

                {/* Programs Tag */}
                <div className="mt-4">
                  <span className="text-[11px] font-semibold text-slate-500">Popular Programs:</span>
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    {col.programs.map((p) => (
                      <span
                        key={p.id}
                        className="rounded-lg bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                      >
                        {p.name.split(' (')[0]}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <Link
                href={`/colleges/${col.slug}`}
                className="mt-6 flex items-center justify-center gap-2 rounded-xl border border-slate-200 py-2.5 text-xs font-bold text-slate-800 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-800 transition"
              >
                <span>View Degree Programs & Fees</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
