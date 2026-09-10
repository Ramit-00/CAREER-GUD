'use client';

import {
  calculateEstimatedRank,
  IndianCategory,
  NationalExam,
  RankEstimateResult,
} from '@/lib/data/rankData';
import {
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  Compass,
  ExternalLink,
  GraduationCap,
  HelpCircle,
  Percent,
  Search,
  Sliders,
  TrendingUp,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';

const EXAMS: Array<{ id: NationalExam; name: string; maxScoreLabel: string; min: number; max: number; step: number; defaultVal: number; description: string }> = [
  {
    id: 'JEE_MAIN',
    name: 'JEE Main (Engineering)',
    maxScoreLabel: 'Percentile (NTA Score)',
    min: 40,
    max: 99.99,
    step: 0.1,
    defaultVal: 95.5,
    description: 'National Testing Agency exam for NITs, IIITs, CFTIs and JEE Advanced qualifier',
  },
  {
    id: 'NEET_UG',
    name: 'NEET-UG (Medical)',
    maxScoreLabel: 'Marks (Out of 720)',
    min: 150,
    max: 720,
    step: 1,
    defaultVal: 620,
    description: 'Single national entrance test for MBBS, BDS, and AYUSH admissions across India',
  },
  {
    id: 'CUET_UG',
    name: 'CUET-UG (Central Universities)',
    maxScoreLabel: 'Normalized Aggregate Percentile',
    min: 40,
    max: 99.99,
    step: 0.1,
    defaultVal: 94.0,
    description: 'Entrance for Delhi University (DU), BHU, JNU, and 40+ central universities',
  },
  {
    id: 'CLAT',
    name: 'CLAT (National Law Universities)',
    maxScoreLabel: 'Marks (Out of 120)',
    min: 30,
    max: 120,
    step: 0.5,
    defaultVal: 88,
    description: 'Consortium of National Law Universities entrance for 5-Year Integrated Law (B.A. LL.B.)',
  },
  {
    id: 'IPMAT',
    name: 'IPMAT (Integrated IIM MBA)',
    maxScoreLabel: 'Overall Aptitude Percentile',
    min: 40,
    max: 99.99,
    step: 0.1,
    defaultVal: 92.5,
    description: 'Direct entry to 5-Year Dual-Degree Management at IIM Indore, Rohtak, Ranchi',
  },
];

const CATEGORIES: Array<{ id: IndianCategory; label: string; note: string }> = [
  { id: 'OPEN', label: 'OPEN / General', note: 'Unreserved merit quota' },
  { id: 'OBC_NCL', label: 'OBC-NCL', note: 'Central OBC Non-Creamy Layer (27%)' },
  { id: 'EWS', label: 'GEN-EWS', note: 'Economically Weaker Section (10%)' },
  { id: 'SC', label: 'Scheduled Caste (SC)', note: 'Constitutional reservation (15%)' },
  { id: 'ST', label: 'Scheduled Tribe (ST)', note: 'Constitutional reservation (7.5%)' },
  { id: 'PWD', label: 'PwD (Divyangjan)', note: 'Horizontal reservation (5%)' },
];

const STATES = [
  'All India (Other State Quota)',
  'Delhi (NCT)',
  'Maharashtra',
  'Karnataka',
  'Tamil Nadu',
  'Telangana',
  'Uttar Pradesh',
  'Rajasthan',
  'West Bengal',
  'Madhya Pradesh',
  'Gujarat',
  'Bihar',
  'Punjab / Haryana',
  'Kerala',
];

export default function RankEstimatorPage() {
  const [selectedExam, setSelectedExam] = useState<NationalExam>('JEE_MAIN');
  const [score, setScore] = useState<number>(95.5);
  const [category, setCategory] = useState<IndianCategory>('OPEN');
  const [state, setState] = useState<string>('All India (Other State Quota)');

  const currentExamConfig = useMemo(() => {
    return EXAMS.find((e) => e.id === selectedExam) || EXAMS[0];
  }, [selectedExam]);

  const estimate: RankEstimateResult = useMemo(() => {
    return calculateEstimatedRank(selectedExam, score, category, state);
  }, [selectedExam, score, category, state]);

  const handleExamChange = (examId: NationalExam) => {
    setSelectedExam(examId);
    const config = EXAMS.find((e) => e.id === examId);
    if (config) {
      setScore(config.defaultVal);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 dark:bg-slate-950">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-bold text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-300 mb-3">
            <Award className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
            National Entrance Intelligence
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Indian Entrance Cutoff & Category Rank Estimator
          </h1>
          <p className="mt-3 text-sm sm:text-base font-medium text-slate-600 dark:text-slate-300 leading-relaxed">
            Eliminate misleading coaching predictions. Map your estimated marks or percentile against verified JoSAA, MCC, and Consortium of NLUs category cutoffs (OPEN, OBC-NCL, EWS, SC, ST, PwD).
          </p>
        </div>

        {/* Interactive Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Form & Inputs */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Exam Selector */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
                1. Select National Examination
              </label>
              <div className="grid grid-cols-1 gap-2">
                {EXAMS.map((exam) => (
                  <button
                    key={exam.id}
                    onClick={() => handleExamChange(exam.id)}
                    className={`flex flex-col items-start p-3 rounded-xl border text-left transition-all ${
                      selectedExam === exam.id
                        ? 'border-[#0B2A4A] bg-[#0B2A4A]/5 dark:border-amber-400 dark:bg-amber-400/10'
                        : 'border-slate-200 hover:border-slate-300 dark:border-slate-800 dark:hover:border-slate-700'
                    }`}
                  >
                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                      {exam.name}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {exam.description}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Score / Percentile Slider */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  2. {currentExamConfig.maxScoreLabel}
                </label>
                <span className="text-xl font-black text-[#0B2A4A] dark:text-amber-400">
                  {score}
                </span>
              </div>
              <input
                type="range"
                min={currentExamConfig.min}
                max={currentExamConfig.max}
                step={currentExamConfig.step}
                value={score}
                onChange={(e) => setScore(Number(e.target.value))}
                className="w-full accent-[#0B2A4A] dark:accent-amber-400 cursor-pointer h-2 bg-slate-200 rounded-lg dark:bg-slate-700"
              />
              <div className="flex justify-between text-[11px] font-semibold text-slate-400 mt-2">
                <span>Min: {currentExamConfig.min}</span>
                <span>Max: {currentExamConfig.max}</span>
              </div>
            </div>

            {/* Category & State Selector */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                  3. Indian Reservation Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as IndianCategory)}
                  className="w-full rounded-xl border border-slate-300 bg-white p-3 text-sm font-semibold text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label} ({c.note})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                  4. Home State (for State Quotas)
                </label>
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white p-3 text-sm font-semibold text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                >
                  {STATES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Right Column: Calculated Intelligence & Benchmarks */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {/* Rank Projection Cards */}
            <div className="rounded-2xl border-2 border-[#0B2A4A]/20 bg-white p-6 shadow-sm dark:border-amber-400/30 dark:bg-slate-900">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-5">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Estimated National Rank Standing
                  </span>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">
                    {currentExamConfig.name} Projection
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold text-slate-400 block">Percentile</span>
                  <span className="inline-block font-black text-emerald-600 dark:text-emerald-400 text-sm">
                    {estimate.percentileEquivalent}%ile
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-xl bg-slate-50 p-4 border border-slate-100 dark:bg-slate-800/60 dark:border-slate-800">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1">
                    All-India Rank (AIR)
                  </span>
                  <div className="text-2xl font-black text-[#0B2A4A] dark:text-white">
                    ~{estimate.estimatedAllIndiaRank.midpoint.toLocaleString('en-IN')}
                  </div>
                  <span className="text-[11px] font-medium text-slate-500 mt-1 block">
                    Range: {estimate.estimatedAllIndiaRank.min.toLocaleString('en-IN')} -{' '}
                    {estimate.estimatedAllIndiaRank.max.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="rounded-xl bg-amber-50/50 p-4 border border-amber-100 dark:bg-amber-950/20 dark:border-amber-900/40">
                  <span className="text-xs font-bold text-amber-900 dark:text-amber-300 block mb-1">
                    Estimated Category Rank ({category})
                  </span>
                  <div className="text-2xl font-black text-amber-700 dark:text-amber-400">
                    ~{estimate.estimatedCategoryRank.midpoint.toLocaleString('en-IN')}
                  </div>
                  <span className="text-[11px] font-medium text-amber-800/80 dark:text-amber-300/80 mt-1 block">
                    Range: {estimate.estimatedCategoryRank.min.toLocaleString('en-IN')} -{' '}
                    {estimate.estimatedCategoryRank.max.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Guidance Note */}
              <div className="mt-5 rounded-xl bg-blue-50/70 p-3.5 border border-blue-100 text-xs font-medium text-blue-900 dark:bg-blue-950/30 dark:border-blue-900/50 dark:text-blue-200 leading-relaxed flex items-start gap-2">
                <Compass className="h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                <span>{estimate.guidanceNote}</span>
              </div>
            </div>

            {/* Institution Closing Benchmarks */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    Eligible National Flagship Institutions
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Based on verified 2024 closing ranks under your selected quota
                  </p>
                </div>
                <span className="text-xs font-bold text-slate-400">
                  {estimate.eligibleInstitutions.length} Benchmarks
                </span>
              </div>

              <div className="space-y-3">
                {estimate.eligibleInstitutions.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition dark:border-slate-800 dark:bg-slate-800/40 dark:hover:bg-slate-800/70 gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black text-slate-900 dark:text-white">
                          {item.institution}
                        </span>
                        <span className="rounded bg-slate-200 px-1.5 py-0.5 text-[10px] font-bold text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                          {item.location}
                        </span>
                      </div>
                      <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mt-0.5">
                        {item.program}
                      </p>
                      <span className="text-[11px] font-semibold text-slate-400">
                        Counseling: {item.counselingBody} | Prev. Closing Rank: ~{item.previousClosingRank.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="sm:text-right shrink-0">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${
                          item.admissionProbability === 'HIGH'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                            : item.admissionProbability === 'MODERATE'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                            : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                        }`}
                      >
                        {item.admissionProbability === 'HIGH' ? (
                          <CheckCircle2 className="h-3 w-3" />
                        ) : (
                          <TrendingUp className="h-3 w-3" />
                        )}
                        {item.admissionProbability} Odds
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Links */}
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-bold">
                <Link
                  href="/colleges"
                  className="text-[#0B2A4A] dark:text-amber-400 hover:underline inline-flex items-center gap-1"
                >
                  Browse Detailed College Catalogs <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <Link
                  href="/consultants"
                  className="rounded-xl bg-[#0B2A4A] px-4 py-2 text-white hover:bg-[#081f37] dark:bg-amber-400 dark:text-slate-950 dark:hover:bg-amber-300 transition"
                >
                  Consult a Verified Mentor
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
