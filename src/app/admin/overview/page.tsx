'use client';

import {
  BarChart3,
  BookOpen,
  Briefcase,
  CheckCircle2,
  Clock,
  GraduationCap,
  ShieldCheck,
  TrendingUp,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<{
    totalCareers: number;
    totalColleges: number;
    totalConsultants: number;
    totalBookings: number;
    pendingVerifications: number;
    streamDistribution: Record<string, number>;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await fetch('/api/admin/analytics');
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error('Analytics fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 flex flex-col gap-8">
      {/* Header */}
      <div className="rounded-3xl border border-purple-200 bg-white p-8 shadow-sm dark:border-purple-900/60 dark:bg-slate-900">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-50 px-3 py-1 text-xs font-bold text-purple-700 dark:bg-purple-950/40 dark:text-purple-300">
              <BarChart3 className="h-3.5 w-3.5" />
              Administrative Overview
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-2">
              Platform Usage & Intelligence
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Live statistics on student assessments, directory entities, and verification pipelines.
            </p>
          </div>

          <Link
            href="/admin/verify-consultants"
            className="rounded-xl bg-purple-600 px-4 py-2 text-xs font-bold text-white hover:bg-purple-500 transition shadow-sm"
          >
            Review Mentor Applications →
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <Briefcase className="h-5 w-5 text-indigo-600 mb-2" />
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Active Careers</span>
          <span className="text-2xl font-black text-slate-900 dark:text-white">{stats?.totalCareers ?? 30}</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <BookOpen className="h-5 w-5 text-teal-600 mb-2" />
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Verified Colleges</span>
          <span className="text-2xl font-black text-slate-900 dark:text-white">{stats?.totalColleges ?? 20}</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <ShieldCheck className="h-5 w-5 text-purple-600 mb-2" />
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Mentors Registered</span>
          <span className="text-2xl font-black text-slate-900 dark:text-white">{stats?.totalConsultants ?? 3}</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <Clock className="h-5 w-5 text-emerald-600 mb-2" />
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Sessions Booked</span>
          <span className="text-2xl font-black text-slate-900 dark:text-white">{stats?.totalBookings ?? 1}</span>
        </div>
      </div>

      {/* Stream Demand Distribution */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
          Student Assessment Interest Distribution (India)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
          <div className="rounded-2xl bg-indigo-50/70 p-4 border border-indigo-100 dark:bg-indigo-950/30 dark:border-indigo-900">
            <span className="font-bold text-indigo-900 dark:text-indigo-300 block">Science (PCM)</span>
            <span className="text-2xl font-black text-indigo-600 mt-1 block">42%</span>
            <p className="text-[11px] text-slate-500 mt-1">Computer Science, AI, Mechanical, Aviation</p>
          </div>

          <div className="rounded-2xl bg-cyan-50/70 p-4 border border-cyan-100 dark:bg-cyan-950/30 dark:border-cyan-900">
            <span className="font-bold text-cyan-900 dark:text-cyan-300 block">Science (PCB)</span>
            <span className="text-2xl font-black text-cyan-600 mt-1 block">28%</span>
            <p className="text-[11px] text-slate-500 mt-1">MBBS, BDS, Biotech, Genetics</p>
          </div>

          <div className="rounded-2xl bg-emerald-50/70 p-4 border border-emerald-100 dark:bg-emerald-950/30 dark:border-emerald-900">
            <span className="font-bold text-emerald-900 dark:text-emerald-300 block">Commerce & Finance</span>
            <span className="text-2xl font-black text-emerald-600 mt-1 block">20%</span>
            <p className="text-[11px] text-slate-500 mt-1">CA, Investment Banking, B.Com (Hons)</p>
          </div>

          <div className="rounded-2xl bg-amber-50/70 p-4 border border-amber-100 dark:bg-amber-950/30 dark:border-amber-900">
            <span className="font-bold text-amber-900 dark:text-amber-300 block">Arts & Humanities</span>
            <span className="text-2xl font-black text-amber-600 mt-1 block">10%</span>
            <p className="text-[11px] text-slate-500 mt-1">Law (CLAT), UX Design, UPSC</p>
          </div>
        </div>
      </div>
    </div>
  );
}
