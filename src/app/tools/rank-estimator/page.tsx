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
    <div className="min-h-screen bg-white py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header Hero Container */}
        <div className="rounded-3xl border-2 border-slate-300 bg-[#EAEFF5] p-6 sm:p-10 shadow-xs mb-10 text-center max-w-4xl mx-auto">
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-amber-300 bg-white px-3.5 py-1.5 text-xs font-bold text-[#D96B00] mb-3 shadow-2xs">
            <Award className="h-3.5 w-3.5 text-[#D96B00]" />
            National Entrance Intelligence
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-[#0B2A4A] tracking-tight">
            Indian Entrance Cutoff &amp; Category Rank Estimator
          </h1>
          <p className="mt-3 text-sm sm:text-base font-medium text-slate-700 leading-relaxed max-w-2xl mx-auto">
            Eliminate misleading coaching predictions. Map your estimated marks or percentile against verified JoSAA, MCC, and Consortium of NLUs category cutoffs (OPEN, OBC-NCL, EWS, SC, ST, PwD).
          </p>
        </div>

        {/* Interactive Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Form & Inputs */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Exam Selector */}
            <div className="rounded-2xl border-2 border-slate-300 bg-[#EAEFF5] p-6 shadow-xs">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
                1. Select National Examination
              </label>
              <div className="grid grid-cols-1 gap-2.5">
                {EXAMS.map((exam) => (
                  <button
                    key={exam.id}
                    onClick={() => handleExamChange(exam.id)}
                    className={`flex flex-col items-start p-3.5 rounded-xl border-2 text-left transition-all cursor-pointer shadow-2xs ${
                      selectedExam === exam.id
                        ? 'border-[#0B2A4A] bg-[#0B2A4A] text-white shadow-xs'
                        : 'border-slate-300 hover:border-[#0B2A4A] bg-white'
                    }`}
                  >
                    <span className={`text-sm font-bold ${selectedExam === exam.id ? 'text-white' : 'text-slate-900'}`}>
                      {exam.name}
                    </span>
                    <span className={`text-xs mt-0.5 ${selectedExam === exam.id ? 'text-slate-200' : 'text-slate-600'}`}>
                      {exam.description}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Score / Percentile Slider */}
            <div className="rounded-2xl border-2 border-slate-300 bg-[#EAEFF5] p-6 shadow-xs">
              <div className="flex justify-between items-center mb-3">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  2. {currentExamConfig.maxScoreLabel}
                </label>
                <span className="text-xl font-black text-[#0B2A4A] rounded-xl bg-white px-3 py-1 border border-slate-200 shadow-2xs">
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
                className="w-full accent-[#0B2A4A] cursor-pointer h-2 bg-slate-200 rounded-lg"
              />
              <div className="flex justify-between text-[11px] font-bold text-slate-500 mt-2">
                <span>Min: {currentExamConfig.min}</span>
                <span>Max: {currentExamConfig.max}</span>
              </div>
            </div>

            {/* Category & State Selector */}
            <div className="rounded-2xl border-2 border-slate-300 bg-[#EAEFF5] p-6 shadow-xs flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  3. Indian Reservation Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as IndianCategory)}
                  className="w-full rounded-xl border-2 border-slate-300 bg-white p-3 text-sm font-semibold text-slate-900 shadow-2xs focus:border-[#0B2A4A] focus:outline-none"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label} ({c.note})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  4. Home State (for State Quotas)
                </label>
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full rounded-xl border-2 border-slate-300 bg-white p-3 text-sm font-semibold text-slate-900 shadow-2xs focus:border-[#0B2A4A] focus:outline-none"
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
            <div className="rounded-2xl border-2 border-slate-300 bg-[#EAEFF5] p-6 sm:p-8 shadow-xs">
              <div className="flex items-center justify-between border-b-2 border-slate-200 pb-4 mb-5">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Estimated National Rank Standing
                  </span>
                  <h3 className="text-lg font-black text-slate-900">
                    {currentExamConfig.name} Projection
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold text-slate-500 block">Percentile</span>
                  <span className="inline-block font-black text-[#138808] text-sm">
                    {estimate.percentileEquivalent}%ile
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-2xl bg-white p-5 border border-slate-200 shadow-2xs">
                  <span className="text-xs font-bold text-slate-600 block mb-1">
                    All-India Rank (AIR)
                  </span>
                  <div className="text-2xl font-black text-[#0B2A4A]">
                    ~{estimate.estimatedAllIndiaRank.midpoint.toLocaleString('en-IN')}
                  </div>
                  <span className="text-[11px] font-medium text-slate-600 mt-1 block">
                    Range: {estimate.estimatedAllIndiaRank.min.toLocaleString('en-IN')} -{' '}
                    {estimate.estimatedAllIndiaRank.max.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="rounded-2xl bg-white p-5 border border-amber-200 shadow-2xs">
                  <span className="text-xs font-bold text-[#D96B00] block mb-1">
                    Estimated Category Rank ({category})
                  </span>
                  <div className="text-2xl font-black text-[#D96B00]">
                    ~{estimate.estimatedCategoryRank.midpoint.toLocaleString('en-IN')}
                  </div>
                  <span className="text-[11px] font-medium text-amber-900/80 mt-1 block">
                    Range: {estimate.estimatedCategoryRank.min.toLocaleString('en-IN')} -{' '}
                    {estimate.estimatedCategoryRank.max.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Guidance Note */}
              <div className="mt-5 rounded-xl bg-white p-4 border border-blue-200 text-xs font-medium text-[#0B2A4A] leading-relaxed flex items-start gap-2 shadow-2xs">
                <Compass className="h-4 w-4 text-[#0B2A4A] shrink-0 mt-0.5" />
                <span>{estimate.guidanceNote}</span>
              </div>
            </div>

            {/* Institution Closing Benchmarks */}
            <div className="rounded-2xl border-2 border-slate-300 bg-[#EAEFF5] p-6 sm:p-8 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    Eligible National Flagship Institutions
                  </h3>
                  <p className="text-xs text-slate-600">
                    Based on verified 2024 closing ranks under your selected quota
                  </p>
                </div>
                <span className="text-xs font-bold text-slate-500">
                  {estimate.eligibleInstitutions.length} Benchmarks
                </span>
              </div>

              <div className="space-y-3">
                {estimate.eligibleInstitutions.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-slate-200 bg-white hover:border-[#0B2A4A] transition gap-3 shadow-2xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black text-slate-900">
                          {item.institution}
                        </span>
                        <span className="rounded-md bg-slate-100 border border-slate-200 px-1.5 py-0.5 text-[10px] font-bold text-slate-800">
                          {item.location}
                        </span>
                      </div>
                      <p className="text-xs font-medium text-slate-700 mt-0.5">
                        {item.program}
                      </p>
                      <span className="text-[11px] font-semibold text-slate-500">
                        Counseling: {item.counselingBody} | Prev. Closing Rank: ~{item.previousClosingRank.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="sm:text-right shrink-0">
                      <span
                        className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-xs font-bold shadow-2xs ${
                          item.admissionProbability === 'HIGH'
                            ? 'border-emerald-300 bg-emerald-50 text-[#138808]'
                            : item.admissionProbability === 'MODERATE'
                            ? 'border-amber-300 bg-amber-50 text-[#D96B00]'
                            : 'border-rose-300 bg-rose-50 text-rose-800'
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
              <div className="mt-6 pt-4 border-t-2 border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-bold">
                <Link
                  href="/colleges"
                  className="text-[#0B2A4A] hover:text-[#D96B00] hover:underline inline-flex items-center gap-1"
                >
                  Browse Detailed College Catalogs <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <Link
                  href="/consultants"
                  className="rounded-xl bg-[#0B2A4A] px-4 py-2.5 text-white hover:bg-[#153e6b] transition shadow-xs"
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
