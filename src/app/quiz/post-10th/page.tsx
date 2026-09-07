'use client';

import { ScoreRadarChart } from '@/components/charts/ScoreRadarChart';
import { TENTH_GRADE_QUIZ_QUESTIONS } from '@/lib/data/seedData';
import { QuizResult } from '@/types';
import confetti from 'canvas-confetti';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  HelpCircle,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function Post10thQuizPage() {
  // Stepper state: 'PROFILE' -> 'QUESTIONS' -> 'RESULT'
  const [step, setStep] = useState<'PROFILE' | 'QUESTIONS' | 'RESULT'>('PROFILE');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Profile data
  const [tenthScore, setTenthScore] = useState<number>(80);
  const [mathScore, setMathScore] = useState<number>(80);
  const [scienceScore, setScienceScore] = useState<number>(80);

  // Quiz answers: questionId -> optionId
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);

  const currentQ = TENTH_GRADE_QUIZ_QUESTIONS[currentQuestionIndex];
  const progressPct = Math.round(((currentQuestionIndex + 1) / TENTH_GRADE_QUIZ_QUESTIONS.length) * 100);

  const handleSelectOption = (optId: string) => {
    const updatedAnswers = { ...answers, [currentQ.id]: optId };
    setAnswers(updatedAnswers);

    if (currentQuestionIndex < TENTH_GRADE_QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Quiz finished -> submit
      handleSubmitQuiz(updatedAnswers);
    }
  };

  const handleSubmitQuiz = async (finalAnswers: Record<string, string>) => {
    setSubmitting(true);
    try {
      const res = await fetch('/api/quiz/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quizType: 'STREAM_10TH',
          answers: finalAnswers,
          userProfile: {
            tenthPercentage: tenthScore,
            mathScore,
            scienceScore,
          },
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to score quiz');
      }

      const result: QuizResult = await res.json();
      setQuizResult(result);
      setStep('RESULT');

      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // ignore if canvas not supported
      }
    } catch (err) {
      console.error('Quiz submission error:', err);
      alert('Could not submit quiz. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetake = () => {
    setAnswers({});
    setCurrentQuestionIndex(0);
    setQuizResult(null);
    setStep('PROFILE');
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      {/* 1. Academic Profile Setup Stage */}
      {step === 'PROFILE' && (
        <div className="rounded-3xl border border-slate-200 bg-white p-8 sm:p-12 shadow-xl dark:border-slate-800 dark:bg-slate-900">
          <div className="text-center max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 mb-3">
              <Sparkles className="h-3.5 w-3.5" />
              Class 10 Stream Discovery
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
              Let&apos;s Calibrate Your Baseline
            </h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Before evaluating your interests, we calibrate your actual marks. In India, stream transitions (like Class 10 to Class 11 PCM/PCB) represent a 4x leap in depth. We use this to evaluate real friction points.
            </p>
          </div>

          <div className="mt-8 max-w-xl mx-auto flex flex-col gap-6">
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                <span>Class 10 Overall Percentage (Expected or Actual)</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-black text-sm">{tenthScore}%</span>
              </div>
              <input
                type="range"
                min={40}
                max={99}
                value={tenthScore}
                onChange={(e) => setTenthScore(Number(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                <span>Mathematics Marks (Out of 100)</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-black text-sm">{mathScore}%</span>
              </div>
              <input
                type="range"
                min={35}
                max={100}
                value={mathScore}
                onChange={(e) => setMathScore(Number(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <p className="mt-1 text-[11px] text-slate-400">
                Critical for Non-Medical (PCM) and high-tier Commerce finance pathways.
              </p>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                <span>Science Marks (Physics / Chemistry / Biology)</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-black text-sm">{scienceScore}%</span>
              </div>
              <input
                type="range"
                min={35}
                max={100}
                value={scienceScore}
                onChange={(e) => setScienceScore(Number(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
            </div>

            <button
              onClick={() => setStep('QUESTIONS')}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 py-4 text-sm font-bold text-white shadow-lg shadow-indigo-600/25 hover:bg-indigo-500 transition active:scale-98"
            >
              <span>Continue to Diagnostic Questions</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* 2. Diagnostic Questions Stepper */}
      {step === 'QUESTIONS' && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-xl dark:border-slate-800 dark:bg-slate-900">
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-2">
              <span>
                Question {currentQuestionIndex + 1} of {TENTH_GRADE_QUIZ_QUESTIONS.length}
              </span>
              <span className="text-indigo-600 dark:text-indigo-400">{progressPct}% Complete</span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-600 to-teal-500 transition-all duration-300"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          {/* Current Question */}
          <div className="my-6">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-snug">
              {currentQ.question}
            </h2>
            {currentQ.subtitle && (
              <p className="mt-2 text-xs sm:text-sm text-slate-500">
                {currentQ.subtitle}
              </p>
            )}
          </div>

          {/* Options Grid */}
          <div className="flex flex-col gap-3">
            {currentQ.options.map((opt) => {
              const isSelected = answers[currentQ.id] === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => handleSelectOption(opt.id)}
                  className={`flex flex-col items-start p-4 rounded-2xl border text-left transition-all ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/80 dark:border-indigo-400 dark:bg-indigo-950/40 shadow-sm'
                      : 'border-slate-200 bg-slate-50/60 hover:border-indigo-300 hover:bg-white dark:border-slate-800 dark:bg-slate-800/50 dark:hover:bg-slate-800'
                  }`}
                >
                  <span className="text-sm font-bold text-slate-900 dark:text-white leading-relaxed">
                    {opt.text}
                  </span>
                  {opt.subtext && (
                    <span className="mt-1 text-xs text-slate-500 leading-normal">
                      {opt.subtext}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Navigation Controls */}
          <div className="mt-8 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-4">
            <button
              onClick={() => {
                if (currentQuestionIndex > 0) {
                  setCurrentQuestionIndex(currentQuestionIndex - 1);
                } else {
                  setStep('PROFILE');
                }
              }}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Previous
            </button>

            {submitting && (
              <div className="flex items-center gap-2 text-xs font-bold text-indigo-600">
                <span className="animate-spin inline-block h-3.5 w-3.5 border-2 border-indigo-600 border-t-transparent rounded-full" />
                <span>Scoring & generating reality check...</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. Comprehensive Scored Results */}
      {step === 'RESULT' && quizResult && (
        <div className="flex flex-col gap-8 animate-in fade-in zoom-in-95">
          {/* Header Banner */}
          <div className="rounded-3xl border border-indigo-100 bg-gradient-to-br from-indigo-500/10 via-white to-teal-500/10 p-8 sm:p-10 shadow-lg dark:border-slate-800 dark:from-slate-900 dark:to-slate-900">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-bold text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300">
                  🎯 Top Recommended +1/+2 Stream
                </span>
                <h1 className="mt-3 text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
                  {quizResult.primaryRecommendation.title}
                </h1>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
                  {quizResult.primaryRecommendation.whyItFits}
                </p>
              </div>

              <div className="flex flex-col items-center justify-center rounded-2xl bg-white p-4 shadow-md dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shrink-0">
                <span className="text-3xl font-black text-indigo-600 dark:text-indigo-400">
                  {quizResult.primaryRecommendation.matchPercentage}%
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Affinity Match
                </span>
              </div>
            </div>
          </div>

          {/* Realism & Friction Alert */}
          <div
            className={`rounded-3xl border p-6 sm:p-8 shadow-sm ${
              quizResult.realismCheck.status === 'RED'
                ? 'border-rose-200 bg-rose-50/70 dark:border-rose-900 dark:bg-rose-950/30'
                : quizResult.realismCheck.status === 'AMBER'
                ? 'border-amber-200 bg-amber-50/70 dark:border-amber-900 dark:bg-amber-950/30'
                : 'border-emerald-200 bg-emerald-50/70 dark:border-emerald-900 dark:bg-emerald-950/30'
            }`}
          >
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
              {quizResult.realismCheck.status === 'RED' ? (
                <AlertTriangle className="h-4 w-4 text-rose-600" />
              ) : quizResult.realismCheck.status === 'AMBER' ? (
                <AlertTriangle className="h-4 w-4 text-amber-600" />
              ) : (
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              )}
              <span>Reality Check Analysis: {quizResult.realismCheck.headline}</span>
            </div>

            <p className="mt-3 text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
              {quizResult.realismCheck.description}
            </p>

            <div className="mt-4 rounded-2xl bg-white/80 p-4 text-xs dark:bg-slate-900/80">
              <strong className="text-slate-900 dark:text-white">Workload & Competition Context: </strong>
              <span className="text-slate-600 dark:text-slate-300">
                {quizResult.realismCheck.workloadReality}
              </span>
            </div>

            {quizResult.realismCheck.recommendedPivot && (
              <p className="mt-3 text-xs text-indigo-800 dark:text-indigo-300 font-semibold">
                💡 High-Value Alternative: {quizResult.realismCheck.recommendedPivot}
              </p>
            )}
          </div>

          {/* Multi-Dimensional Score Radar */}
          <ScoreRadarChart scores={quizResult.scores} />

          {/* Recommended Subjects & Degrees */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="h-4 w-4 text-indigo-500" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Recommended School Subjects (+1/+2)
                </h3>
              </div>
              <ul className="flex flex-col gap-2 text-xs text-slate-700 dark:text-slate-300">
                {quizResult.primaryRecommendation.recommendedSubjects?.map((sub, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-teal-500 shrink-0" />
                    <span>{sub}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-4 w-4 text-teal-500" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Eligible Future Degrees
                </h3>
              </div>
              <ul className="flex flex-col gap-2 text-xs text-slate-700 dark:text-slate-300">
                {quizResult.primaryRecommendation.recommendedDegrees?.map((deg, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
                    <span>{deg}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Action Plan */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
              Your Class 10 → 11 Action Plan
            </h3>
            <div className="flex flex-col gap-3">
              {quizResult.primaryRecommendation.actionPlan.map((action, idx) => (
                <div key={idx} className="flex items-start gap-3 rounded-2xl bg-slate-50 p-3.5 text-xs text-slate-700 dark:bg-slate-800/50 dark:text-slate-300">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{action}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Secondary Recommendation */}
          {quizResult.secondaryRecommendations.length > 0 && (
            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 text-xs dark:border-slate-800 dark:bg-slate-900/60">
              <strong className="text-slate-800 dark:text-slate-200">Secondary Viable Stream: </strong>
              <span>
                {quizResult.secondaryRecommendations[0].title} ({quizResult.secondaryRecommendations[0].matchPercentage}% affinity).
              </span>
            </div>
          )}

          {/* Action Footer */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              onClick={handleRetake}
              className="flex items-center gap-1.5 rounded-xl border border-slate-300 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 transition"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Retake Assessment
            </button>

            <div className="flex items-center gap-3">
              <Link
                href="/careers"
                className="rounded-xl border border-slate-300 px-4 py-2.5 text-xs font-semibold text-slate-800 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200"
              >
                Explore Careers
              </Link>
              <Link
                href="/consultants"
                className="rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-indigo-500"
              >
                Talk to a Verified Mentor
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
