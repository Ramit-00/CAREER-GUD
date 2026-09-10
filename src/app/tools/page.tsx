'use client';

import {
  ArrowRight,
  Award,
  Calculator,
  Compass,
  GraduationCap,
  HeartPulse,
  Landmark,
  MessageSquare,
  PiggyBank,
  Repeat,
  Shield,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import Link from 'next/link';
import React from 'react';

const INTELLIGENCE_TOOLS = [
  {
    title: 'Indian Entrance Cutoff & Category Rank Estimator',
    description:
      'Map your estimated marks or percentile in JEE Main, NEET-UG, CUET, CLAT, or IPMAT to All-India and Category ranks (OPEN, OBC-NCL, EWS, SC, ST, PwD) with verified JoSAA & MCC closing ranks.',
    href: '/tools/rank-estimator',
    badge: 'National Quotas & Cutoffs',
    icon: Award,
    color: 'amber',
  },
  {
    title: 'Higher Education ROI & Education Loan EMI Calculator',
    description:
      'Calculate true degree outlay against verified NIRF median packages, monthly debt servicing EMIs, break-even recovery horizons, and CSIS government interest subsidy eligibility.',
    href: '/tools/roi-calculator',
    badge: 'Financial & Debt Intelligence',
    icon: PiggyBank,
    color: 'emerald',
  },
  {
    title: 'NEP 2020 Stream Switch & Pivot Simulator',
    description:
      'Explore regulatory pathways to pivot from Science PCB/PCM to Commercial Aviation, Corporate Cyber Law, Economics at DU, or IIM Management under UGC & AICTE revised rules.',
    href: '/tools/stream-pivot',
    badge: 'NEP 2020 Flexibility',
    icon: Repeat,
    color: 'purple',
  },
  {
    title: '"Drop Year" Statistical Reality & Risk Diagnostic',
    description:
      'Empirical analysis of repeat year odds. Evaluate baseline gap, self-study stamina, and emotional fatigue to decide between a Full Drop, Partial Degree, or high-growth Career Pivot.',
    href: '/tools/drop-year',
    badge: 'Empirical Risk Engine',
    icon: HeartPulse,
    color: 'rose',
  },
  {
    title: 'Post-10th Stream Selection Diagnostic',
    description:
      'Multi-dimensional assessment evaluating aptitude, academic stamina, and vocational interest to recommend the ideal Class 11 stream (PCM, PCB, Commerce with/without Maths, Arts).',
    href: '/quiz/post-10th',
    badge: 'Class 10 Assessment',
    icon: Compass,
    color: 'blue',
  },
  {
    title: 'Post-12th Degree & Career Trajectory Engine',
    description:
      'Psychometric calibration mapping 12th-grade stream specializations to high-longevity bachelor degrees, entrance exams, and 5-to-10 year employment outlooks.',
    href: '/quiz/post-12th',
    badge: 'Class 12 Trajectory',
    icon: GraduationCap,
    color: 'blue',
  },
];

export default function ToolsHubPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 dark:bg-slate-950">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3.5 py-1 text-xs font-bold text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-300 mb-3">
            <Sparkles className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
            Empirical Educational Intelligence
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            Academic Intelligence &amp; Calculation Suite
          </h1>
          <p className="mt-4 text-sm sm:text-base font-medium text-slate-600 dark:text-slate-300 leading-relaxed">
            Data-backed calculators, psychometric diagnostics, and regulatory simulators engineered specifically for Indian high school &amp; college students, parents, and mentors.
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {INTELLIGENCE_TOOLS.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.href}
                href={tool.href}
                className="group relative rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm transition hover:shadow-md hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="rounded-full bg-slate-100 p-3 text-slate-800 dark:bg-slate-800 dark:text-amber-400 group-hover:scale-105 transition">
                      <Icon className="h-6 w-6" />
                    </span>
                    <span className="rounded-md bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      {tool.badge}
                    </span>
                  </div>

                  <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white group-hover:text-[#0B2A4A] dark:group-hover:text-amber-400 transition">
                    {tool.title}
                  </h2>
                  <p className="mt-2.5 text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300 leading-relaxed">
                    {tool.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-[#0B2A4A] dark:text-amber-400">
                  <span>Launch Tool</span>
                  <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
