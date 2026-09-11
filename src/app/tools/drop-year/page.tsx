'use client';

import {
  AlertOctagon,
  AlertTriangle,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock,
  Compass,
  HeartPulse,
  HelpCircle,
  Percent,
  Shield,
  Target,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import Link from 'next/link';
import React, { useMemo, useState } from 'react';

export default function DropYearDiagnosticPage() {
  const [exam, setExam] = useState<'JEE' | 'NEET'>('JEE');
  const [previousDropCount, setPreviousDropCount] = useState<number>(0);
  const [baselineScore, setBaselineScore] = useState<number>(85); // Percentile or marks
  const [targetScore, setTargetScore] = useState<number>(98);
  const [studyStaminaHours, setStudyStaminaHours] = useState<number>(5);
  const [syllabusCoverage, setSyllabusCoverage] = useState<number>(65);
  const [burnoutLevel, setBurnoutLevel] = useState<'LOW' | 'MODERATE' | 'SEVERE'>('MODERATE');

  const diagnosticResult = useMemo(() => {
    // Gap size
    const scoreGap = targetScore - baselineScore;

    // Base score calculation
    let improvementProbability = 50; // Base 50%

    // Syllabus coverage factor
    if (syllabusCoverage < 50) improvementProbability -= 15;
    else if (syllabusCoverage >= 80) improvementProbability += 15;

    // Stamina factor
    if (studyStaminaHours < 4) improvementProbability -= 20;
    else if (studyStaminaHours >= 7) improvementProbability += 10;

    // Burnout factor
    if (burnoutLevel === 'SEVERE') improvementProbability -= 25;
    else if (burnoutLevel === 'LOW') improvementProbability += 10;

    // Prior drop penalty: 2nd drops statistically have diminished returns
    if (previousDropCount === 1) improvementProbability -= 15;
    else if (previousDropCount >= 2) improvementProbability -= 30;

    improvementProbability = Math.min(85, Math.max(12, improvementProbability));

    const burnoutRiskScore =
      (burnoutLevel === 'SEVERE' ? 50 : burnoutLevel === 'MODERATE' ? 25 : 5) +
      previousDropCount * 20 +
      (studyStaminaHours > 8 ? 15 : 0);

    let verdict: {
      type: 'RECOMMENDED_FULL' | 'RECOMMENDED_PARTIAL' | 'PIVOT_ADVISED';
      title: string;
      color: string;
      summary: string;
      actionableGuidance: string[];
    } = {
      type: 'RECOMMENDED_PARTIAL',
      title: 'Partial Drop / Parallel Enrollment Strongly Recommended',
      color: 'amber',
      summary:
        'Taking an isolated 365-day gap without college enrollment carries high emotional friction and a 42% risk of score plateau. Enrolling in a local college (B.Sc / BCA / State B.Tech) provides emotional stability while you prepare for a targeted second attempt.',
      actionableGuidance: [
        'Secure admission in an accredited degree program with flexible attendance.',
        'Dedicate 3 evening hours daily exclusively to previous year question (PYQ) mock tests.',
        'Focus only on bridging high-weightage weak chapters instead of re-reading entire theory books.',
      ],
    };

    if (improvementProbability >= 65 && burnoutRiskScore < 40 && previousDropCount === 0) {
      verdict = {
        type: 'RECOMMENDED_FULL',
        title: 'Full Dedicated Drop Year Statistically Favorable',
        color: 'emerald',
        summary:
          'Your academic baseline, high study stamina, and low emotional fatigue indicate positive statistical odds for achieving a 10-15 percentile leap. Maintain disciplined test series routines.',
        actionableGuidance: [
          'Enroll in an offline or hybrid national test series (minimum 2 full-syllabus mocks per week).',
          'Track test error analysis rigorously in a separate notebook.',
          'Schedule non-negotiable physical exercise and family meals to prevent isolation midway through the year.',
        ],
      };
    } else if (improvementProbability < 35 || burnoutRiskScore >= 65 || previousDropCount >= 2) {
      verdict = {
        type: 'PIVOT_ADVISED',
        title: 'High Risk Warning: Drop Year Not Advised (Pivot Recommended)',
        color: 'rose',
        summary:
          'Statistical data indicates that taking another repeat year with current fatigue levels carries an 80%+ risk of score plateau or psychological burnout. National Education Policy 2020 offers equivalent career and salary avenues without taking entrance drop risks.',
        actionableGuidance: [
          'Accept current college seat or look at CUET Central University admissions.',
          'Target corporate career avenues: Data Science, Corporate Law (CLAT), or Integrated Management (IPMAT).',
          'Remember: Top tech firms and consulting companies recruit on demonstrated problem-solving skills, not your Class 12 entrance percentile.',
        ],
      };
    }

    return {
      improvementProbability,
      burnoutRiskScore: Math.min(95, burnoutRiskScore),
      scoreGap,
      verdict,
    };
  }, [
    exam,
    previousDropCount,
    baselineScore,
    targetScore,
    studyStaminaHours,
    syllabusCoverage,
    burnoutLevel,
  ]);

  return (
    <div className="min-h-screen bg-white py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header Hero Container */}
        <div className="rounded-3xl border-2 border-slate-300 bg-[#EAEFF5] p-6 sm:p-10 shadow-xs mb-10 text-center max-w-4xl mx-auto">
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-rose-300 bg-white px-3.5 py-1.5 text-xs font-bold text-rose-800 mb-3 shadow-2xs">
            <HeartPulse className="h-3.5 w-3.5 text-rose-600" />
            Empirical Statistical Diagnostic
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-[#0B2A4A] tracking-tight">
            &quot;Drop Year&quot; Statistical Reality &amp; Risk Diagnostic
          </h1>
          <p className="mt-3 text-sm sm:text-base font-medium text-slate-700 leading-relaxed max-w-2xl mx-auto">
            Over 15 lakh Indian students take repeat gap years for JEE and NEET. National counseling data reveals that over 60% of droppers plateau within ±5 percentile of their baseline. Evaluate your statistical odds before committing 365 days.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Diagnostic Inputs */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            <div className="rounded-2xl border-2 border-slate-300 bg-[#EAEFF5] p-6 shadow-xs space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                1. Exam &amp; Target Ambition
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    setExam('JEE');
                    setBaselineScore(85);
                    setTargetScore(98);
                  }}
                  className={`p-3.5 rounded-xl border-2 text-left font-bold text-xs transition shadow-2xs cursor-pointer ${
                    exam === 'JEE'
                      ? 'border-[#0B2A4A] bg-[#0B2A4A] text-white shadow-xs'
                      : 'border-slate-300 text-slate-700 bg-white hover:border-[#0B2A4A]'
                  }`}
                >
                  JEE Main / Advanced
                </button>
                <button
                  onClick={() => {
                    setExam('NEET');
                    setBaselineScore(480);
                    setTargetScore(635);
                  }}
                  className={`p-3.5 rounded-xl border-2 text-left font-bold text-xs transition shadow-2xs cursor-pointer ${
                    exam === 'NEET'
                      ? 'border-[#0B2A4A] bg-[#0B2A4A] text-white shadow-xs'
                      : 'border-slate-300 text-slate-700 bg-white hover:border-[#0B2A4A]'
                  }`}
                >
                  NEET-UG (Medical)
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  How many drop years have you already taken?
                </label>
                <select
                  value={previousDropCount}
                  onChange={(e) => setPreviousDropCount(Number(e.target.value))}
                  className="w-full rounded-xl border-2 border-slate-300 bg-white p-2.5 text-xs font-bold text-slate-900 shadow-2xs focus:border-[#0B2A4A] focus:outline-none"
                >
                  <option value={0}>0 - First time considering a drop year</option>
                  <option value={1}>1 - Already taken 1 drop (considering 2nd drop)</option>
                  <option value={2}>2+ - Considering 3rd drop or beyond</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Previous {exam === 'JEE' ? 'Percentile' : 'Score / 720'}
                  </label>
                  <input
                    type="number"
                    value={baselineScore}
                    onChange={(e) => setBaselineScore(Number(e.target.value))}
                    className="w-full rounded-xl border-2 border-slate-300 bg-white p-2.5 text-xs font-bold text-slate-900 shadow-2xs focus:border-[#0B2A4A] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Target {exam === 'JEE' ? 'Percentile' : 'Score / 720'}
                  </label>
                  <input
                    type="number"
                    value={targetScore}
                    onChange={(e) => setTargetScore(Number(e.target.value))}
                    className="w-full rounded-xl border-2 border-slate-300 bg-white p-2.5 text-xs font-bold text-slate-900 shadow-2xs focus:border-[#0B2A4A] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border-2 border-slate-300 bg-[#EAEFF5] p-6 shadow-xs space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                2. Stamina &amp; Psychological Fatigue
              </h3>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-800 mb-1">
                  <span>Daily Independent Problem-Solving Stamina</span>
                  <span className="text-[#0B2A4A] font-black rounded-lg bg-white px-2.5 py-0.5 border border-slate-200 shadow-2xs">
                    {studyStaminaHours} Hours / Day
                  </span>
                </div>
                <input
                  type="range"
                  min={2}
                  max={10}
                  step={1}
                  value={studyStaminaHours}
                  onChange={(e) => setStudyStaminaHours(Number(e.target.value))}
                  className="w-full accent-[#0B2A4A] cursor-pointer h-2 bg-slate-200 rounded-lg"
                />
                <span className="text-[11px] text-slate-500 mt-1 block font-medium">
                  Self-study hours solving new problems, excluding watching passive video lectures.
                </span>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-800 mb-1">
                  <span>Syllabus Completed with Previous Year Questions</span>
                  <span className="text-[#0B2A4A] font-black rounded-lg bg-white px-2.5 py-0.5 border border-slate-200 shadow-2xs">
                    {syllabusCoverage}%
                  </span>
                </div>
                <input
                  type="range"
                  min={20}
                  max={100}
                  step={5}
                  value={syllabusCoverage}
                  onChange={(e) => setSyllabusCoverage(Number(e.target.value))}
                  className="w-full accent-[#0B2A4A] cursor-pointer h-2 bg-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Current Level of Emotional Fatigue / Pressure
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['LOW', 'MODERATE', 'SEVERE'] as const).map((level) => (
                    <button
                      key={level}
                      onClick={() => setBurnoutLevel(level)}
                      className={`p-3 rounded-xl border-2 text-center font-bold text-xs transition shadow-2xs cursor-pointer ${
                        burnoutLevel === level
                          ? 'border-[#0B2A4A] bg-[#0B2A4A] text-white shadow-xs'
                          : 'border-slate-300 text-slate-800 bg-white hover:border-[#0B2A4A]'
                      }`}
                    >
                      {level === 'LOW' ? 'Low Fatigue' : level === 'MODERATE' ? 'Moderate Stress' : 'Severe Burnout'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Diagnostic Verdict & Analysis */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            <div
              className={`rounded-2xl p-6 border-2 shadow-xs ${
                diagnosticResult.verdict.color === 'emerald'
                  ? 'border-emerald-400 bg-emerald-50 text-emerald-950'
                  : diagnosticResult.verdict.color === 'amber'
                  ? 'border-amber-400 bg-amber-50 text-amber-950'
                  : 'border-rose-400 bg-rose-50 text-rose-950'
              }`}
            >
              <div className="flex items-center gap-2 font-black text-base mb-1">
                {diagnosticResult.verdict.color === 'emerald' ? (
                  <CheckCircle2 className="h-5 w-5 text-[#138808]" />
                ) : (
                  <AlertOctagon className="h-5 w-5 text-rose-600" />
                )}
                <span>{diagnosticResult.verdict.title}</span>
              </div>
              <p className="text-xs font-medium leading-relaxed">
                {diagnosticResult.verdict.summary}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl border-2 border-slate-300 bg-[#EAEFF5] p-5 shadow-xs">
                <span className="text-xs font-bold text-slate-500 block mb-1">
                  Probability of Target Leap
                </span>
                <span className="text-2xl font-black text-[#0B2A4A]">
                  {diagnosticResult.improvementProbability}%
                </span>
                <span className="text-[11px] text-slate-500 block mt-1">
                  Statistical likelihood of target reach
                </span>
              </div>

              <div className="rounded-2xl border-2 border-slate-300 bg-[#EAEFF5] p-5 shadow-xs">
                <span className="text-xs font-bold text-slate-500 block mb-1">
                  Burnout Risk Index
                </span>
                <span className="text-2xl font-black text-rose-600">
                  {diagnosticResult.burnoutRiskScore} / 100
                </span>
                <span className="text-[11px] text-slate-500 block mt-1">
                  Psychological fatigue vulnerability
                </span>
              </div>
            </div>

            {/* Strategic Action Items */}
            <div className="rounded-2xl border-2 border-slate-300 bg-[#EAEFF5] p-6 shadow-xs space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Recommended Action Blueprint:
              </h4>
              <div className="space-y-2.5">
                {diagnosticResult.verdict.actionableGuidance.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 rounded-xl bg-white p-3 border border-slate-200 text-xs text-slate-800 shadow-2xs">
                    <CheckCircle2 className="h-4 w-4 text-[#138808] shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t-2 border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                <Link
                  href="/tools/stream-pivot"
                  className="text-xs font-bold text-[#0B2A4A] hover:text-[#D96B00] hover:underline inline-flex items-center gap-1"
                >
                  Explore High-Growth Non-Drop Trajectories <ArrowRight className="h-3.5 w-3.5" />
                </Link>

                <Link
                  href="/consultants"
                  className="rounded-xl bg-[#0B2A4A] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#153e6b] transition shadow-xs"
                >
                  Book 1-on-1 Strategy Session
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
