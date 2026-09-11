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

  useEffect(() => {
    fetchColleges();
  }, [selectedState, selectedType]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchColleges();
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header Hero Container */}
      <div className="rounded-3xl border-2 border-slate-300 bg-[#EAEFF5] p-6 sm:p-10 shadow-xs mb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b-2 border-slate-200">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-lg border border-amber-300 bg-white px-3 py-1.5 text-xs font-bold text-[#D96B00] mb-3 shadow-2xs">
              <Building2 className="h-4 w-4 text-[#D96B00]" />
              National Institutional Ranking Framework (NIRF) &amp; Placement Audits
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-[#0B2A4A] tracking-tight">
              Accredited Colleges &amp; Universities in India
            </h1>
            <p className="mt-2 text-sm text-slate-700 max-w-2xl leading-relaxed font-normal">
              Audit public placement records, statutory accreditation status (UGC/AICTE/MCI/BCI), seat matrices, and semester fee structures.
            </p>
          </div>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex items-center gap-2 max-w-md w-full">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by college name, city, or degree..."
                className="w-full rounded-xl border-2 border-slate-300 bg-white py-2.5 pl-10 pr-3 text-xs sm:text-sm font-medium text-slate-900 focus:border-[#0B2A4A] focus:outline-none shadow-xs"
              />
            </div>
            <button
              type="submit"
              className="rounded-xl bg-[#0B2A4A] px-5 py-2.5 text-xs sm:text-sm font-bold text-white hover:bg-[#153e6b] transition shadow-xs cursor-pointer"
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
                className={`rounded-xl px-4 py-2 text-xs sm:text-sm font-bold transition cursor-pointer ${
                  selectedState === st
                    ? 'bg-[#0B2A4A] text-white shadow-xs'
                    : 'bg-white text-slate-800 border-2 border-slate-300 hover:border-slate-400 hover:bg-slate-100 hover:text-slate-950'
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
                className={`rounded-lg px-3 py-1.5 font-bold transition cursor-pointer ${
                  selectedType === t
                    ? 'bg-[#0B2A4A] text-white'
                    : 'text-slate-700 hover:text-slate-950'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* College Grid */}
      {loading ? (
        <div className="py-20 text-center text-sm font-bold text-slate-700">
          <span className="animate-spin inline-block h-6 w-6 border-3 border-[#0B2A4A] border-t-transparent rounded-full mb-3" />
          <p>Loading accredited institutions...</p>
        </div>
      ) : colleges.length === 0 ? (
        <div className="py-20 text-center text-sm font-bold text-slate-700">
          No institutions matched your filter criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {colleges.map((col) => (
            <div
              key={col.id}
              className="flex flex-col justify-between rounded-2xl border-2 border-slate-300 bg-[#EAEFF5] p-6 shadow-xs hover:bg-white hover:border-[#0B2A4A] hover:shadow-md transition-all group"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="rounded-lg bg-blue-50/90 px-2.5 py-1 text-xs font-black text-[#0B2A4A] border border-blue-200 shadow-2xs">
                    NIRF #{col.nirfRank ?? 'N/A'}
                  </span>
                  <span className="rounded-lg bg-white px-2.5 py-1 text-xs font-bold text-slate-800 border border-slate-300 shadow-2xs">
                    {col.type}
                  </span>
                </div>

                <h3 className="text-lg font-black text-slate-950 mt-3 group-hover:text-[#0B2A4A] transition-colors">
                  {col.name}
                </h3>
                <p className="flex items-center gap-1 text-xs sm:text-sm font-medium text-slate-700 mt-1.5">
                  <MapPin className="h-4 w-4 text-slate-500 shrink-0" />
                  {col.city}, {col.state}
                </p>

                {/* Placements Box */}
                <div className="mt-4 rounded-xl border border-slate-200 bg-white p-3.5 text-xs font-bold shadow-2xs">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-700">
                    Placement Audit (NIRF / Institutional)
                  </span>
                  <div className="mt-2 flex justify-between">
                    <span className="text-slate-700">Avg CTC:</span>
                    <strong className="text-slate-950">{col.placementStats.avgPackageINR}</strong>
                  </div>
                  <div className="mt-1 flex justify-between">
                    <span className="text-slate-700">Highest CTC:</span>
                    <strong className="text-[#138808]">{col.placementStats.highestPackageINR}</strong>
                  </div>
                  <div className="mt-1 flex justify-between">
                    <span className="text-slate-700">Placement %:</span>
                    <strong className="text-slate-950">{col.placementStats.placementPercentage}%</strong>
                  </div>
                </div>

                {/* Programs Tag */}
                <div className="mt-4">
                  <span className="text-xs font-bold text-slate-800">Accredited Programs:</span>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {col.programs.map((p) => (
                      <span
                        key={p.id}
                        className="rounded-md bg-white px-2.5 py-1 text-xs font-bold text-slate-800 border border-slate-200 shadow-2xs"
                      >
                        {p.name.split(' (')[0]}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <Link
                href={`/colleges/${col.slug}`}
                className="mt-6 flex items-center justify-center gap-2 rounded-xl border-2 border-slate-300 bg-white py-2.5 text-xs sm:text-sm font-bold text-[#0B2A4A] group-hover:border-[#0B2A4A] group-hover:bg-[#0B2A4A] group-hover:text-white transition cursor-pointer shadow-2xs"
              >
                <span>Seat Matrix &amp; Fee Details</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
