'use client';

import { AutomationMeter } from '@/components/charts/AutomationMeter';
import { QuizResult, StreamType } from '@/types';
import confetti from 'canvas-confetti';
import {
  AlertCircle,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  GraduationCap,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const STREAM_OPTIONS: { id: StreamType; title: string; desc: string; icon: string }[] = [
  {
    id: 'SCIENCE_PCM',
    title: 'Science: Non-Medical (PCM)',
    desc: 'Physics, Chemistry & Mathematics. Open to B.Tech, B.Arch, Pilot training, Pure Sciences, and NDA.',
    icon: '⚡',
  },
  {
    id: 'SCIENCE_PCB',
    title: 'Science: Medical (PCB)',
    desc: 'Physics, Chemistry & Biology. Open to MBBS, BDS, Pharmacy, Biotechnology, and Allied Healthcare.',
    icon: '🧬',
  },
  {
    id: 'SCIENCE_PCMB',
    title: 'Science: Both (PCMB)',
    desc: 'Physics, Chemistry, Maths & Biology. Maximum flexibility across engineering and clinical sciences.',
    icon: '🔬',
  },
  {
    id: 'COMMERCE_MATHS',
    title: 'Commerce (with or without Maths)',
    desc: 'Accountancy, Economics & Business. Open to Chartered Accountancy (CA), Investment Banking, B.Com, and CFA.',
    icon: '📈',
  },
  {
    id: 'ARTS',
    title: 'Arts / Humanities / Design',
    desc: 'Political Science, Psychology, Literature, History. Open to Corporate Law (CLAT), UX Design (UCEED), and UPSC.',
    icon: '⚖️',
  },
];

export default function Post12thQuizPage() {
  const [selectedStream, setSelectedStream] = useState<StreamType>('SCIENCE_PCM');
  const [twelfthPercentage, setTwelfthPercentage] = useState<number>(82);
  const [mathScore, setMathScore] = useState<number>(80);
  const [scienceScore, setScienceScore] = useState<number>(80);
  const [submitting, setSubmitting] = useState(false);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await fetch('/api/quiz/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quizType:
            selectedStream === 'SCIENCE_PCB'
              ? 'MEDICAL_12TH'
              : selectedStream === 'COMMERCE_MATHS' || selectedStream === 'COMMERCE_NO_MATHS'
              ? 'COMMERCE_12TH'
              : selectedStream === 'ARTS'
              ? 'ARTS_12TH'
              : 'NON_MEDICAL_12TH',
          selectedStream,
          answers: { q12_pref: 'analytical_rigor' },
          userProfile: {
            twelfthPercentage,
            mathScore,
            scienceScore,
          },
        }),
      });

      if (!res.ok) throw new Error('Failed to score quiz');

      const data: QuizResult = await res.json();
      setQuizResult(data);

      try {
        confetti({ particleCount: 80, spread: 60 });
      } catch {
        // ignore
      }
    } catch (err) {
      console.error('Quiz submission error:', err);
      alert('Could not submit. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      {!quizResult ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-8 sm:p-12 shadow-xl dark:border-slate-800 dark:bg-slate-900">
          <div className="text-center max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1 text-xs font-bold text-teal-700 dark:bg-teal-950/40 dark:text-teal-300 mb-3">
              <GraduationCap className="h-3.5 w-3.5" />
              Class 12 Degree & Exam Matcher
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
              Which Degree Should You Pursue After +2?
            </h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              In India, your Class 12 stream sets legal eligibility boundaries (for example, you cannot enter MBBS without 10+2 Biology, or B.Arch without Mathematics). Select your current stream below.
            </p>
          </div>

          {/* Stream Selector */}
          <div className="mt-8 flex flex-col gap-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Select Your Class 11-12 Stream:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {STREAM_OPTIONS.map((st) => (
                <button
                  key={st.id}
                  onClick={() => setSelectedStream(st.id)}
                  className={`flex items-start gap-3 rounded-2xl border p-4 text-left transition ${
                    selectedStream === st.id
                      ? 'border-teal-600 bg-teal-50/70 dark:border-teal-400 dark:bg-teal-950/40 shadow-sm'
                      : 'border-slate-200 bg-slate-50/60 hover:border-teal-300 dark:border-slate-800 dark:bg-slate-800/50'
                  }`}
                >
                  <span className="text-2xl">{st.icon}</span>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">{st.title}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">{st.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Marks Calibration */}
          <div className="mt-8 rounded-2xl border border-slate-100 bg-slate-50/70 p-5 dark:border-slate-800 dark:bg-slate-800/40">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
              Academic Performance Context
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Class 12 Marks (%): <strong>{twelfthPercentage}%</strong>
                </span>
                <input
                  type="range"
                  min={50}
                  max={99}
                  value={twelfthPercentage}
                  onChange={(e) => setTwelfthPercentage(Number(e.target.value))}
                  className="w-full mt-2 accent-teal-600"
                />
              </div>

              {selectedStream !== 'ARTS' && (
                <div>
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Maths Score: <strong>{mathScore}%</strong>
                  </span>
                  <input
                    type="range"
                    min={40}
                    max={100}
                    value={mathScore}
                    onChange={(e) => setMathScore(Number(e.target.value))}
                    className="w-full mt-2 accent-teal-600"
                  />
                </div>
              )}

              {(selectedStream === 'SCIENCE_PCB' || selectedStream === 'SCIENCE_PCMB') && (
                <div>
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Biology Score: <strong>{scienceScore}%</strong>
                  </span>
                  <input
                    type="range"
                    min={40}
                    max={100}
                    value={scienceScore}
                    onChange={(e) => setScienceScore(Number(e.target.value))}
                    className="w-full mt-2 accent-teal-600"
                  />
                </div>
              )}
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-teal-600 py-4 text-sm font-bold text-white shadow-lg shadow-teal-600/25 hover:bg-teal-500 disabled:opacity-50 transition active:scale-98"
          >
            {submitting ? (
              <span>Matching Degrees & Exams...</span>
            ) : (
              <>
                <span>Match Recommended Degrees & Careers</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      ) : (
        /* Scored Results */
        <div className="flex flex-col gap-8 animate-in fade-in zoom-in-95">
          {/* Header */}
          <div className="rounded-3xl border border-teal-100 bg-gradient-to-br from-teal-500/10 via-white to-indigo-500/10 p-8 sm:p-10 shadow-lg dark:border-slate-800 dark:from-slate-900 dark:to-slate-900">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="rounded-full bg-teal-100 px-3 py-1 text-xs font-bold text-teal-800 dark:bg-teal-900 dark:text-teal-300">
                  Top Matched Degree & Pathway
                </span>
                <h1 className="mt-3 text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
                  {quizResult.primaryRecommendation.title}
                </h1>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
                  {quizResult.primaryRecommendation.whyItFits}
                </p>
              </div>

              <div className="flex flex-col items-center justify-center rounded-2xl bg-white p-4 shadow-md dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shrink-0">
                <span className="text-3xl font-black text-teal-600 dark:text-teal-400">
                  {quizResult.primaryRecommendation.matchPercentage}%
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Aptitude Fit
                </span>
              </div>
            </div>
          </div>

          {/* Realism Note */}
          <div className="rounded-3xl border border-amber-200 bg-amber-50/70 p-6 sm:p-8 dark:border-amber-900 dark:bg-amber-950/30">
            <div className="flex items-center gap-2 text-xs font-bold uppercase text-amber-800 dark:text-amber-300">
              <AlertCircle className="h-4 w-4" />
              <span>Realism Advisory: {quizResult.realismCheck.headline}</span>
            </div>
            <p className="mt-2 text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
              {quizResult.realismCheck.description}
            </p>
            <p className="mt-3 text-xs text-slate-500 font-medium">
              Workload Benchmark: {quizResult.realismCheck.workloadReality}
            </p>
          </div>

          {/* Key Entrance Exams */}
          {quizResult.primaryRecommendation.topExams && (
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="h-4 w-4 text-indigo-500" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Key Indian Entrance Examinations to Target
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {quizResult.primaryRecommendation.topExams.map((exam, i) => (
                  <span
                    key={i}
                    className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  >
                    🎯 {exam}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Action Plan */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
              Strategic Next Steps
            </h3>
            <div className="flex flex-col gap-3">
              {quizResult.primaryRecommendation.actionPlan.map((action, idx) => (
                <div key={idx} className="flex items-start gap-3 rounded-2xl bg-slate-50 p-3.5 text-xs text-slate-700 dark:bg-slate-800/50 dark:text-slate-300">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal-600 text-[10px] font-bold text-white">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{action}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Links */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setQuizResult(null)}
              className="flex items-center gap-1.5 rounded-xl border border-slate-300 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 transition"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Retake / Select Another Stream
            </button>

            <div className="flex items-center gap-3">
              <Link
                href="/careers"
                className="rounded-xl border border-slate-300 px-4 py-2.5 text-xs font-semibold text-slate-800 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200"
              >
                Explore Careers Directory
              </Link>
              <Link
                href="/colleges"
                className="rounded-xl bg-teal-600 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-teal-500"
              >
                View Eligible Colleges
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
