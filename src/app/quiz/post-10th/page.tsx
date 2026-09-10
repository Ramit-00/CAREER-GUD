'use client';

import { ScoreRadarChart } from '@/components/charts/ScoreRadarChart';
import { ParentReportModal } from '@/components/common/ParentReportModal';
import { TENTH_GRADE_QUIZ_QUESTIONS } from '@/lib/data/seedData';
import { QuizResult } from '@/types';
import {
  AlertCircle,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Compass,
  FileText,
  GraduationCap,
  RotateCcw,
  Share2,
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Post10thQuizPage() {
  const { data: session } = useSession();
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
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [showParentModal, setShowParentModal] = useState(false);

  // Restore draft from sessionStorage
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem('career_gud_draft_10th');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.answers && Object.keys(parsed.answers).length > 0) {
          setAnswers(parsed.answers);
          if (parsed.tenthScore) setTenthScore(parsed.tenthScore);
          if (parsed.mathScore) setMathScore(parsed.mathScore);
          if (parsed.scienceScore) setScienceScore(parsed.scienceScore);
          if (typeof parsed.currentQuestionIndex === 'number') {
            setCurrentQuestionIndex(parsed.currentQuestionIndex);
          }
          setStep('QUESTIONS');
        }
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  // Persist draft to sessionStorage
  useEffect(() => {
    if (Object.keys(answers).length > 0 && step === 'QUESTIONS') {
      try {
        sessionStorage.setItem(
          'career_gud_draft_10th',
          JSON.stringify({
            answers,
            tenthScore,
            mathScore,
            scienceScore,
            currentQuestionIndex,
          })
        );
      } catch {
        // Ignore storage errors
      }
    }
  }, [answers, tenthScore, mathScore, scienceScore, currentQuestionIndex, step]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    if (document.documentElement) document.documentElement.scrollTop = 0;
    if (document.body) document.body.scrollTop = 0;
  }, [step, currentQuestionIndex]);

  const currentQ = TENTH_GRADE_QUIZ_QUESTIONS[currentQuestionIndex];
  const progressPct = Math.round(((currentQuestionIndex + 1) / TENTH_GRADE_QUIZ_QUESTIONS.length) * 100);

  const handleSelectOption = (optId: string) => {
    setSubmissionError(null);
    const updatedAnswers = { ...answers, [currentQ.id]: optId };
    setAnswers(updatedAnswers);

    if (currentQuestionIndex < TENTH_GRADE_QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleSubmitQuiz(updatedAnswers);
    }
  };

  const handleSubmitQuiz = async (finalAnswers: Record<string, string>) => {
    setSubmitting(true);
    setSubmissionError(null);
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

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || 'Failed to score quiz');
      }

      setQuizResult(result);
      try {
        sessionStorage.removeItem('career_gud_draft_10th');
      } catch {}
      setStep('RESULT');
    } catch (err: any) {
      console.error('Quiz submission error:', err);
      setSubmissionError(err.message || 'Could not submit assessment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetake = () => {
    try {
      sessionStorage.removeItem('career_gud_draft_10th');
    } catch {}
    setAnswers({});
    setCurrentQuestionIndex(0);
    setQuizResult(null);
    setSubmissionError(null);
    setStep('PROFILE');
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      {/* 1. Academic Profile Setup Stage */}
      {step === 'PROFILE' && (
        <div className="rounded-2xl border-2 border-slate-200 bg-white p-8 sm:p-10 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <div className="text-center max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-2 rounded-md border border-amber-200 bg-[#FFF8EE] px-3 py-1 text-xs font-bold text-[#D96B00] dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-300 mb-3">
              <Compass className="h-4 w-4 text-[#D96B00] dark:text-amber-400" />
              Standard Academic Calibration
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-950 dark:text-white">
              Calibrate Secondary Academic Baseline
            </h1>
            <p className="mt-2 text-sm font-medium text-slate-700 dark:text-slate-200 leading-relaxed">
              Before measuring abstract reasoning and interest profiles, we establish your performance baseline. Senior secondary syllabus volume represents a steep leap over Class 10; this ensures realistic friction modeling.
            </p>
          </div>

          <div className="mt-8 max-w-lg mx-auto flex flex-col gap-6">
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-800 dark:text-slate-200 mb-2">
                <span>Class 10 Overall Aggregate (%)</span>
                <span className="text-[#0B2A4A] dark:text-amber-400 font-black text-sm">{tenthScore}%</span>
              </div>
              <input
                type="range"
                min={40}
                max={99}
                value={tenthScore}
                onChange={(e) => setTenthScore(Number(e.target.value))}
                className="w-full accent-[#0B2A4A] cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-slate-800 dark:text-slate-200 mb-2">
                <span>Mathematics (Out of 100)</span>
                <span className="text-[#0B2A4A] dark:text-amber-400 font-black text-sm">{mathScore}%</span>
              </div>
              <input
                type="range"
                min={35}
                max={100}
                value={mathScore}
                onChange={(e) => setMathScore(Number(e.target.value))}
                className="w-full accent-[#0B2A4A] cursor-pointer"
              />
              <p className="mt-1.5 text-xs font-medium text-slate-600 dark:text-slate-400">
                Core metric for PCM engineering entrance pacing and quantitative commerce disciplines.
              </p>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-slate-800 dark:text-slate-200 mb-2">
                <span>Science (Physics / Chemistry / Biology)</span>
                <span className="text-[#0B2A4A] dark:text-amber-400 font-black text-sm">{scienceScore}%</span>
              </div>
              <input
                type="range"
                min={35}
                max={100}
                value={scienceScore}
                onChange={(e) => setScienceScore(Number(e.target.value))}
                className="w-full accent-[#0B2A4A] cursor-pointer"
              />
            </div>

            <button
              type="button"
              onClick={() => setStep('QUESTIONS')}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#0B2A4A] py-3.5 text-xs font-bold text-white hover:bg-[#071C33] border border-[#071C33] transition shadow-xs"
            >
              <span>Proceed to Assessment Inventory</span>
              <ArrowRight className="h-4 w-4 text-amber-400" />
            </button>
          </div>
        </div>
      )}

      {/* 2. Diagnostic Questions Stepper */}
      {step === 'QUESTIONS' && (
        <div className="rounded-2xl border-2 border-slate-200 bg-white p-6 sm:p-8 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
              <span>
                Assessment Item {currentQuestionIndex + 1} of {TENTH_GRADE_QUIZ_QUESTIONS.length}
              </span>
              <span className="text-[#0B2A4A] dark:text-amber-400 font-black">{progressPct}% Complete</span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
              <div
                className="h-full bg-[#0B2A4A] transition-all duration-300"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          {/* Current Question */}
          <div className="my-6">
            <h2 className="text-xl sm:text-2xl font-black text-slate-950 dark:text-white leading-snug">
              {currentQ.question}
            </h2>
            {currentQ.subtitle && (
              <p className="mt-1.5 text-xs font-medium text-slate-700 dark:text-slate-300">
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
                  type="button"
                  onClick={() => handleSelectOption(opt.id)}
                  className={`flex flex-col items-start p-4 rounded-xl border-2 text-left transition-all ${
                    isSelected
                      ? 'border-[#0B2A4A] bg-amber-50/80 dark:border-amber-400 dark:bg-slate-800 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-400 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700'
                  }`}
                >
                  <span className="text-sm font-bold text-slate-950 dark:text-white leading-snug">
                    {opt.text}
                  </span>
                  {opt.subtext && (
                    <span className="mt-1 text-xs font-medium text-slate-700 dark:text-slate-300 leading-normal">
                      {opt.subtext}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {submissionError && (
            <div className="mt-4 flex items-center gap-2 rounded-xl border border-rose-300 bg-rose-50 p-3 text-xs font-bold text-rose-900 dark:border-rose-900 dark:bg-rose-950 dark:text-rose-200">
              <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
              <span>{submissionError}</span>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="mt-8 flex items-center justify-between border-t border-slate-200 dark:border-slate-700 pt-4">
            <button
              type="button"
              onClick={() => {
                if (currentQuestionIndex > 0) {
                  setCurrentQuestionIndex(currentQuestionIndex - 1);
                } else {
                  setStep('PROFILE');
                }
              }}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Previous Item
            </button>

            {submitting && (
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
                <span className="animate-spin inline-block h-4 w-4 border-2 border-[#0B2A4A] border-t-transparent rounded-full" />
                <span>Computing psychometric alignment...</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. Comprehensive Scored Results */}
      {step === 'RESULT' && quizResult && (
        <div className="flex flex-col gap-6 animate-in fade-in zoom-in-95">
          {/* Header Banner */}
          <div className="rounded-2xl border-2 border-slate-200 bg-white p-6 sm:p-8 shadow-sm dark:border-slate-700 dark:bg-slate-900 border-t-4 border-t-[#0B2A4A]">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="rounded-md bg-[#FFF8EE] border border-amber-200 px-3 py-1 text-xs font-bold text-[#D96B00] dark:bg-amber-950 dark:text-amber-300">
                  Primary Stream Recommendation (+1 / +2)
                </span>
                <h1 className="mt-3 text-2xl sm:text-3xl font-black text-slate-950 dark:text-white">
                  {quizResult.primaryRecommendation.title}
                </h1>
                <p className="mt-2 text-sm font-medium text-slate-700 dark:text-slate-200 leading-relaxed max-w-2xl">
                  {quizResult.primaryRecommendation.whyItFits}
                </p>
              </div>

              <div className="flex flex-col items-center justify-center rounded-2xl bg-[#0B2A4A] p-5 text-white shadow-sm border border-[#071C33] shrink-0">
                <span className="text-3xl font-black text-amber-300">
                  {quizResult.primaryRecommendation.matchPercentage}%
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-200 mt-0.5">
                  Affinity Score
                </span>
              </div>
            </div>
          </div>

          {/* Realism & Friction Alert */}
          <div
            className={`rounded-2xl border-2 p-6 ${
              quizResult.realismCheck.status === 'RED'
                ? 'border-rose-400 bg-rose-50 dark:border-rose-800 dark:bg-rose-950/50'
                : quizResult.realismCheck.status === 'AMBER'
                ? 'border-amber-400 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/50'
                : 'border-emerald-400 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/50'
            }`}
          >
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
              {quizResult.realismCheck.status === 'RED' ? (
                <AlertTriangle className="h-5 w-5 text-rose-700 dark:text-rose-400" />
              ) : quizResult.realismCheck.status === 'AMBER' ? (
                <AlertTriangle className="h-5 w-5 text-amber-700 dark:text-amber-400" />
              ) : (
                <CheckCircle2 className="h-5 w-5 text-emerald-700 dark:text-emerald-400" />
              )}
              <span className="text-sm font-black text-slate-950 dark:text-white">Friction Analysis: {quizResult.realismCheck.headline}</span>
            </div>

            <p className="mt-3 text-sm text-slate-800 dark:text-slate-100 leading-relaxed font-medium">
              {quizResult.realismCheck.description}
            </p>

            <div className="mt-4 rounded-xl bg-white p-4 text-xs font-medium dark:bg-slate-900 border border-slate-300 dark:border-slate-700">
              <strong className="text-slate-950 dark:text-white font-bold">Syllabus Volume & Pacing Context: </strong>
              <span className="text-slate-800 dark:text-slate-200">
                {quizResult.realismCheck.workloadReality}
              </span>
            </div>

            {quizResult.realismCheck.recommendedPivot && (
              <p className="mt-3 text-xs text-slate-900 dark:text-white font-bold">
                Strategic Parallel Route: {quizResult.realismCheck.recommendedPivot}
              </p>
            )}
          </div>

          {/* Multi-Dimensional Score Radar */}
          <ScoreRadarChart scores={quizResult.scores} />

          {/* Recommended Subjects & Degrees */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-2xl border-2 border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="h-5 w-5 text-[#0B2A4A] dark:text-amber-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-950 dark:text-white">
                  Curricular Subject Combinations (+1 / +2)
                </h3>
              </div>
              <ul className="flex flex-col gap-2.5 text-sm font-medium text-slate-800 dark:text-slate-200">
                {quizResult.primaryRecommendation.recommendedSubjects?.map((sub, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>{sub}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border-2 border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
              <div className="flex items-center gap-2 mb-4">
                <GraduationCap className="h-5 w-5 text-[#0B2A4A] dark:text-amber-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-950 dark:text-white">
                  Statutory Degree Eligibility
                </h3>
              </div>
              <ul className="flex flex-col gap-2.5 text-sm font-medium text-slate-800 dark:text-slate-200">
                {quizResult.primaryRecommendation.recommendedDegrees?.map((deg, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#D96B00] dark:text-amber-400 shrink-0" />
                    <span>{deg}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Action Plan */}
          <div className="rounded-2xl border-2 border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <h3 className="text-sm font-bold text-slate-950 dark:text-white mb-4">
              Action Plan for Class 11 Transition
            </h3>
            <div className="flex flex-col gap-3">
              {quizResult.primaryRecommendation.actionPlan.map((action, idx) => (
                <div key={idx} className="flex items-start gap-3 rounded-xl bg-slate-50 p-3.5 text-xs sm:text-sm font-medium text-slate-800 dark:bg-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-[#0B2A4A] text-xs font-bold text-white">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{action}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Secondary Recommendation */}
          {quizResult.secondaryRecommendations.length > 0 && (
            <div className="rounded-xl border-2 border-slate-200 bg-slate-50 p-4 text-xs sm:text-sm font-medium dark:border-slate-700 dark:bg-slate-800">
              <strong className="text-slate-950 dark:text-white font-bold">Viable Alternative Stream: </strong>
              <span className="text-slate-800 dark:text-slate-200">
                {quizResult.secondaryRecommendations[0].title} ({quizResult.secondaryRecommendations[0].matchPercentage}% match index).
              </span>
            </div>
          )}

          {/* Parent Discussion Dossier Card */}
          <div className="rounded-2xl border-2 border-emerald-300 bg-emerald-50/70 p-6 dark:border-emerald-800 dark:bg-emerald-950/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                <FileText className="h-4 w-4" />
                <span>Family Alignment & Discussion Toolkit</span>
              </div>
              <h3 className="text-base font-black text-slate-950 dark:text-white mt-1">
                Share Assessment Dossier with Parents
              </h3>
              <p className="text-xs text-slate-700 dark:text-slate-300 mt-0.5 font-medium max-w-xl">
                Includes printable 2-page academic profile, 5 data-backed dinner conversation prompts, and 1-click WhatsApp summary for family decision-making.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowParentModal(true)}
              className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-black text-white hover:bg-emerald-700 transition shadow-xs shrink-0 cursor-pointer"
            >
              <Share2 className="h-3.5 w-3.5" />
              <span>Open Parent Dossier</span>
            </button>
          </div>

          {/* Action Footer */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t-2 border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={handleRetake}
              className="flex items-center gap-2 rounded-xl border-2 border-slate-300 px-4 py-2.5 text-xs font-bold text-slate-800 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              <RotateCcw className="h-4 w-4" />
              Retake Assessment
            </button>

            <div className="flex items-center gap-3">
              <Link
                href={`/careers?stream=${encodeURIComponent(quizResult.primaryRecommendation.title)}`}
                className="rounded-xl border-2 border-slate-300 px-4 py-2.5 text-xs font-bold text-slate-900 hover:bg-slate-100 dark:border-slate-700 dark:text-white dark:hover:bg-slate-800"
              >
                Explore {quizResult.primaryRecommendation.title} Careers →
              </Link>
              <Link
                href="/consultants"
                className="rounded-xl bg-[#0B2A4A] hover:bg-[#071C33] px-5 py-2.5 text-xs font-bold text-white shadow-sm border border-[#071C33]"
              >
                Schedule Advisor Review
              </Link>
            </div>
          </div>

          {/* Parent Report Modal */}
          {quizResult && (
            <ParentReportModal
              isOpen={showParentModal}
              onClose={() => setShowParentModal(false)}
              result={quizResult}
              studentName={session?.user?.name || 'Secondary Student'}
            />
          )}
        </div>
      )}
    </div>
  );
}

