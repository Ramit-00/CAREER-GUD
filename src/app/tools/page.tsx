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
    color: 'blue',
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
    <div className="min-h-screen bg-white py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header Hero Container */}
        <div className="rounded-3xl border-2 border-slate-300 bg-[#EAEFF5] p-6 sm:p-10 shadow-xs mb-10 text-center max-w-4xl mx-auto">
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-amber-300 bg-white px-3.5 py-1.5 text-xs font-bold text-[#D96B00] mb-3 shadow-2xs">
            <Sparkles className="h-3.5 w-3.5 text-[#D96B00]" />
            Empirical Educational Intelligence
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-[#0B2A4A] tracking-tight">
            Academic Intelligence &amp; Calculation Suite
          </h1>
          <p className="mt-4 text-sm sm:text-base font-medium text-slate-700 leading-relaxed max-w-2xl mx-auto">
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
                className="group relative rounded-2xl border-2 border-slate-300 bg-[#EAEFF5] p-6 sm:p-8 shadow-xs transition-all hover:shadow-md hover:bg-white hover:border-[#0B2A4A] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="rounded-xl bg-white p-3 text-[#0B2A4A] border border-slate-200 shadow-2xs group-hover:scale-105 group-hover:border-[#0B2A4A] transition">
                      <Icon className="h-6 w-6 text-[#0B2A4A]" />
                    </span>
                    <span className="rounded-lg bg-white border border-slate-300 px-3 py-1 text-[11px] font-bold text-slate-800 shadow-2xs">
                      {tool.badge}
                    </span>
                  </div>

                  <h2 className="text-lg sm:text-xl font-black text-slate-900 group-hover:text-[#0B2A4A] transition">
                    {tool.title}
                  </h2>
                  <p className="mt-2.5 text-xs sm:text-sm font-medium text-slate-700 leading-relaxed">
                    {tool.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t-2 border-slate-200 flex items-center justify-between text-xs font-bold text-[#0B2A4A] group-hover:text-[#D96B00]">
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
