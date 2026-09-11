'use client';

import { ExamBadge } from '@/components/common/ExamBadgeModal';
import { ParentReportModal } from '@/components/common/ParentReportModal';
import { QuizResult, StreamType } from '@/types';
import {
  AlertCircle,
  ArrowRight,
  BarChart3,
  BookOpen,
  Cpu,
  FileText,
  GraduationCap,
  Microscope,
  RotateCcw,
  Scale,
  Share2,
  Stethoscope,
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

const STREAM_OPTIONS: { id: StreamType; title: string; desc: string; icon: React.ReactNode }[] = [
  {
    id: 'SCIENCE_PCM',
    title: 'Science: Non-Medical (PCM)',
    desc: 'Physics, Chemistry & Mathematics. Statutory eligibility for B.Tech, B.Arch, Merchant Navy, Defense/NDA, Pure Sciences, and all cross-stream programs (Management, Law, Design).',
    icon: <Cpu className="h-5 w-5 text-[#0B2A4A]" />,
  },
  {
    id: 'SCIENCE_PCB',
    title: 'Science: Medical (PCB)',
    desc: 'Physics, Chemistry & Biology. Statutory eligibility for MBBS, BDS, Pharmacy, Biotechnology, Bioinformatics, Clinical Sciences, and cross-stream fields (Law, Healthcare Management).',
    icon: <Stethoscope className="h-5 w-5 text-[#138808]" />,
  },
  {
    id: 'SCIENCE_PCMB',
    title: 'Science: Dual Stream (PCMB)',
    desc: 'Physics, Chemistry, Maths & Biology. Maximum statutory flexibility across all technological, computational biology, research, and corporate disciplines.',
    icon: <Microscope className="h-5 w-5 text-[#0B2A4A]" />,
  },
  {
    id: 'COMMERCE_MATHS',
    title: 'Commerce (with / without Maths)',
    desc: 'Accountancy, Economics & Business Studies. Direct entry into Chartered Accountancy (CA), Investment Banking, Corporate Law, and IIM Integrated Management.',
    icon: <BarChart3 className="h-5 w-5 text-[#D96B00]" />,
  },
  {
    id: 'ARTS',
    title: 'Humanities & Social Sciences',
    desc: 'Political Science, Psychology, Economics, Sociology. Direct entry into National Law Universities (CLAT), Design (UCEED/NID), Public Policy, and Management.',
    icon: <Scale className="h-5 w-5 text-slate-800" />,
  },
];

const TRAJECTORY_OPTIONS = [
  {
    id: 'CORE',
    title: 'Core Discipline Track',
    badge: 'Standard Pathway',
    desc: 'Traditional degree matching your stream: B.Tech Engineering for PCM, MBBS/Clinical Medicine for PCB, Chartered Accountancy (CA) for Commerce.',
  },
  {
    id: 'MANAGEMENT_LEADERSHIP',
    title: 'Cross-Stream: Management & Strategy (IPMAT / IIMs)',
    badge: 'High-Growth Corporate',
    desc: 'Direct fast-track into a 5-Year Integrated BBA + MBA at IIM Indore, Rohtak, and Ranchi right after Class 12. Skip post-graduate CAT uncertainty.',
  },
  {
    id: 'CORPORATE_LAW',
    title: 'Cross-Stream: Corporate & Technology Law (CLAT / NLUs)',
    badge: 'Legal Leadership',
    desc: '5-Year Integrated B.A. LL.B. / B.B.A. LL.B. at Tier-1 National Law Universities (NLSIU, NALSAR) specializing in Cyber Law, Tech Patents & M&A.',
  },
  {
    id: 'DESIGN_INNOVATION',
    title: 'Cross-Stream: Product & Interaction Design (UCEED / NID)',
    badge: 'Creative Technology',
    desc: 'Bachelor of Design (B.Des) at IIT Bombay (IDC), IIT Delhi, or NID Ahmedabad. High-demand digital UI/UX leadership and industrial product styling.',
  },
  {
    id: 'BIOTECH_HEALTH_ADMIN',
    title: 'Cross-Stream: Biotechnology, Genomics & Health Systems',
    badge: 'Science & Management',
    desc: '5-Year BS-MS in Pure Sciences & Biotechnology (IISERs via IAT) or Hospital Administration (TISS/AIIMS) without 10-year MBBS emergency residency.',
  },
];

export default function Post12thQuizPage() {
  const { data: session } = useSession();
  const [selectedStream, setSelectedStream] = useState<StreamType>('SCIENCE_PCM');
  const [targetTrajectory, setTargetTrajectory] = useState<string>('CORE');
  const [twelfthPercentage, setTwelfthPercentage] = useState<number>(82);
  const [mathScore, setMathScore] = useState<number>(80);
  const [scienceScore, setScienceScore] = useState<number>(80);
  const [submitting, setSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [showParentModal, setShowParentModal] = useState(false);

  // Restore draft from sessionStorage
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem('career_gud_draft_12th');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.selectedStream) setSelectedStream(parsed.selectedStream);
        if (parsed.targetTrajectory) setTargetTrajectory(parsed.targetTrajectory);
        if (parsed.twelfthPercentage) setTwelfthPercentage(parsed.twelfthPercentage);
        if (parsed.mathScore) setMathScore(parsed.mathScore);
        if (parsed.scienceScore) setScienceScore(parsed.scienceScore);
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  // Save draft to sessionStorage
  useEffect(() => {
    try {
      sessionStorage.setItem(
        'career_gud_draft_12th',
        JSON.stringify({
          selectedStream,
          targetTrajectory,
          twelfthPercentage,
          mathScore,
          scienceScore,
        })
      );
    } catch {
      // Ignore storage errors
    }
  }, [selectedStream, targetTrajectory, twelfthPercentage, mathScore, scienceScore]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    if (document.documentElement) document.documentElement.scrollTop = 0;
    if (document.body) document.body.scrollTop = 0;
  }, [quizResult]);

  const handleSubmit = async () => {
    setSubmitting(true);
    setSubmissionError(null);
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
          answers: { targetTrajectory },
          userProfile: {
            twelfthPercentage,
            mathScore,
            scienceScore,
          },
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to score assessment');
      }

      setQuizResult(data);
      try {
        sessionStorage.removeItem('career_gud_draft_12th');
      } catch {}
    } catch (err: any) {
      console.error('Quiz submission error:', err);
      setSubmissionError(err.message || 'Could not submit assessment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      {!quizResult ? (
        <div className="rounded-3xl border-2 border-slate-300 bg-[#EAEFF5] p-8 sm:p-10 shadow-xs">
          <div className="text-center max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-2 rounded-lg border border-amber-300 bg-white px-3.5 py-1.5 text-xs font-bold text-[#D96B00] mb-3 shadow-2xs">
              <GraduationCap className="h-4 w-4 text-[#D96B00]" />
              Statutory Eligibility &amp; Program Alignment
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-[#0B2A4A]">
              Undergraduate Degree &amp; Career Program Matcher
            </h1>
            <p className="mt-2 text-sm font-medium text-slate-700 leading-relaxed">
              In India, your senior secondary stream establishes statutory eligibility (e.g., NMC mandates Biology for MBBS; COA mandates Mathematics for Architecture). Select your confirmed discipline below.
            </p>
          </div>

          {/* Stream Selector */}
          <div className="mt-8 flex flex-col gap-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Select Current Secondary Stream (+2):
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {STREAM_OPTIONS.map((st) => (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => setSelectedStream(st.id)}
                  className={`flex items-start gap-3 rounded-xl border-2 p-4 text-left transition cursor-pointer shadow-2xs ${
                    selectedStream === st.id
                      ? 'border-[#0B2A4A] bg-[#0B2A4A] text-white shadow-xs'
                      : 'border-slate-300 bg-white hover:border-[#0B2A4A] hover:bg-slate-50'
                  }`}
                >
                  <div className="mt-0.5 shrink-0">{st.icon}</div>
                  <div>
                    <h4 className={`text-sm font-bold ${selectedStream === st.id ? 'text-white' : 'text-slate-950'}`}>{st.title}</h4>
                    <p className={`text-xs font-medium mt-1 leading-relaxed ${selectedStream === st.id ? 'text-slate-200' : 'text-slate-700'}`}>{st.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Career Trajectory & Cross-Stream Intent */}
          <div className="mt-8 flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-950">
                Career Trajectory &amp; Non-Linear Pathways:
              </label>
              <span className="text-xs font-bold text-[#D96B00]">
                You are not pigeonholed: PCM &amp; PCB qualify for management, law &amp; design
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {TRAJECTORY_OPTIONS.map((tr) => (
                <button
                  key={tr.id}
                  type="button"
                  onClick={() => setTargetTrajectory(tr.id)}
                  className={`flex flex-col items-start gap-1 rounded-xl border-2 p-4 text-left transition cursor-pointer shadow-2xs ${
                    targetTrajectory === tr.id
                      ? 'border-[#D96B00] bg-[#FFF8EE] ring-2 ring-[#D96B00] shadow-xs'
                      : 'border-slate-300 bg-white hover:border-[#D96B00] hover:bg-slate-50'
                  }`}
                >
                  <div className="flex w-full items-center justify-between">
                    <h4 className="text-sm font-bold text-slate-950">{tr.title}</h4>
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded shadow-2xs ${
                        targetTrajectory === tr.id
                          ? 'bg-[#D96B00] text-white'
                          : 'bg-slate-100 text-slate-800'
                      }`}
                    >
                      {tr.badge}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-slate-700 mt-1 leading-relaxed">
                    {tr.desc}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Marks Calibration */}
          <div className="mt-8 rounded-2xl border-2 border-slate-200 bg-white p-6 shadow-2xs">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-4">
              Academic Baseline Verification
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <span className="text-xs font-bold text-slate-800">
                  Class 12 Aggregate (%): <strong className="text-[#0B2A4A] font-extrabold">{twelfthPercentage}%</strong>
                </span>
                <input
                  type="range"
                  min={50}
                  max={99}
                  value={twelfthPercentage}
                  onChange={(e) => setTwelfthPercentage(Number(e.target.value))}
                  className="w-full mt-2 accent-[#0B2A4A] cursor-pointer"
                />
              </div>

              {selectedStream !== 'ARTS' && (
                <div>
                  <span className="text-xs font-bold text-slate-800">
                    Mathematics (%): <strong className="text-[#0B2A4A] font-extrabold">{mathScore}%</strong>
                  </span>
                  <input
                    type="range"
                    min={40}
                    max={100}
                    value={mathScore}
                    onChange={(e) => setMathScore(Number(e.target.value))}
                    className="w-full mt-2 accent-[#0B2A4A] cursor-pointer"
                  />
                </div>
              )}

              {(selectedStream === 'SCIENCE_PCB' || selectedStream === 'SCIENCE_PCMB') && (
                <div>
                  <span className="text-xs font-bold text-slate-800">
                    Biology (%): <strong className="text-[#0B2A4A] font-extrabold">{scienceScore}%</strong>
                  </span>
                  <input
                    type="range"
                    min={40}
                    max={100}
                    value={scienceScore}
                    onChange={(e) => setScienceScore(Number(e.target.value))}
                    className="w-full mt-2 accent-[#0B2A4A] cursor-pointer"
                  />
                </div>
              )}
            </div>
          </div>

          {submissionError && (
            <div className="mt-4 flex items-center gap-2 rounded-xl border border-rose-300 bg-rose-50 p-3 text-xs font-bold text-rose-900">
              <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
              <span>{submissionError}</span>
            </div>
          )}

          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-[#0B2A4A] py-3.5 text-xs font-bold text-white hover:bg-[#153e6b] disabled:opacity-50 transition shadow-sm cursor-pointer"
          >
            {submitting ? (
              <span>Mapping Statutory Eligibility &amp; Cutoffs...</span>
            ) : (
              <>
                <span>Match Accredited Degrees &amp; Career Frameworks</span>
                <ArrowRight className="h-4 w-4 text-amber-300" />
              </>
            )}
          </button>
        </div>
      ) : (
        /* Scored Results */
        <div className="flex flex-col gap-6 animate-in fade-in zoom-in-95">
          {/* Header */}
          <div className="rounded-3xl border-2 border-slate-300 bg-[#EAEFF5] p-6 sm:p-8 shadow-xs border-t-4 border-t-[#0B2A4A]">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="rounded-lg border border-amber-300 bg-white px-3 py-1 text-xs font-bold text-[#D96B00] shadow-2xs">
                  Primary Matched Degree Trajectory
                </span>
                <h1 className="mt-3 text-2xl sm:text-3xl font-black text-[#0B2A4A]">
                  {quizResult.primaryRecommendation.title}
                </h1>
                <p className="mt-2 text-sm font-medium text-slate-700 leading-relaxed max-w-2xl">
                  {quizResult.primaryRecommendation.whyItFits}
                </p>
              </div>

              <div className="flex flex-col items-center justify-center rounded-2xl bg-white p-5 border-2 border-blue-200 shadow-2xs shrink-0">
                <span className="text-3xl font-black text-[#0B2A4A]">
                  {quizResult.primaryRecommendation.matchPercentage}%
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 mt-0.5">
                  Aptitude Fit
                </span>
              </div>
            </div>
          </div>

          {/* Realism Note */}
          <div className="rounded-2xl border-2 border-amber-300 bg-[#FFFDF5] p-6 border-l-6 border-l-[#FF9933] shadow-xs">
            <div className="flex items-center gap-2 text-xs font-bold uppercase text-amber-900">
              <AlertCircle className="h-5 w-5 text-[#D96B00]" />
              <span className="text-sm font-black text-slate-950">Realism Advisory: {quizResult.realismCheck.headline}</span>
            </div>
            <p className="mt-3 text-sm text-slate-800 leading-relaxed font-medium">
              {quizResult.realismCheck.description}
            </p>
            <p className="mt-3 text-xs text-slate-700 font-semibold">
              National Examination Benchmark: {quizResult.realismCheck.workloadReality}
            </p>
          </div>

          {/* Key Entrance Exams with Interactive Modals and Links */}
          {quizResult.primaryRecommendation.topExams && (
            <div className="rounded-2xl border-2 border-slate-300 bg-[#EAEFF5] p-6 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-[#0B2A4A]" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#0B2A4A]">
                    National Entrance Examinations &amp; Statutory Portals
                  </h3>
                </div>
                <span className="text-xs font-bold text-slate-600">
                  Click any exam badge to view official links &amp; Wikipedia overview
                </span>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {quizResult.primaryRecommendation.topExams.map((exam, i) => (
                  <ExamBadge key={i} examName={exam} />
                ))}
              </div>
            </div>
          )}

          {/* Parallel & Cross-Stream Alternate Trajectories */}
          {quizResult.secondaryRecommendations && quizResult.secondaryRecommendations.length > 0 && (
            <div className="rounded-2xl border-2 border-slate-300 bg-[#EAEFF5] p-6 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                    Non-Linear Options &amp; Parallel Degrees
                  </span>
                  <h3 className="text-lg font-black text-[#0B2A4A] mt-1">
                    Alternative High-Trajectory Pathways
                  </h3>
                </div>
                <span className="rounded-lg border border-amber-300 bg-white px-3 py-1 text-xs font-bold text-[#D96B00] shadow-2xs">
                  Cross-Stream Viable
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {quizResult.secondaryRecommendations.map((sec, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border-2 border-slate-200 bg-white p-4.5 shadow-2xs"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-[#0B2A4A] text-sm">{sec.title}</span>
                      <span className="font-bold text-[#D96B00]">{sec.matchPercentage}% Match</span>
                    </div>
                    <p className="text-xs text-slate-700 mt-2 leading-relaxed font-medium">
                      {sec.whyItFits}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Plan */}
          <div className="rounded-2xl border-2 border-slate-300 bg-[#EAEFF5] p-6 shadow-xs">
            <h3 className="text-sm font-bold text-[#0B2A4A] mb-4">
              Strategic Admission Milestones
            </h3>
            <div className="flex flex-col gap-3">
              {quizResult.primaryRecommendation.actionPlan.map((action, idx) => (
                <div key={idx} className="flex items-start gap-3 rounded-xl bg-white p-3.5 text-xs sm:text-sm font-medium text-slate-800 border border-slate-200 shadow-2xs">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-[#0B2A4A] text-xs font-bold text-white">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{action}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Parent Discussion Dossier Card */}
          <div className="rounded-2xl border-2 border-emerald-300 bg-emerald-50/70 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-emerald-800">
                <FileText className="h-4 w-4" />
                <span>Family Alignment &amp; Higher Ed Discussion</span>
              </div>
              <h3 className="text-base font-black text-slate-950 mt-1">
                Share Degree &amp; Career Strategy with Parents
              </h3>
              <p className="text-xs text-slate-700 mt-0.5 font-medium max-w-xl">
                Includes printable 2-page academic roadmap, 5 data-backed conversation prompts on entrance exams vs degrees, and 1-click WhatsApp summary.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowParentModal(true)}
              className="flex items-center gap-2 rounded-xl bg-[#138808] px-5 py-2.5 text-xs font-black text-white hover:bg-emerald-700 transition shadow-xs shrink-0 cursor-pointer"
            >
              <Share2 className="h-3.5 w-3.5" />
              <span>Open Parent Dossier</span>
            </button>
          </div>

          {/* Action Links */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t-2 border-slate-200">
            <button
              type="button"
              onClick={() => setQuizResult(null)}
              className="flex items-center gap-2 rounded-xl border-2 border-slate-300 px-4 py-2.5 text-xs font-bold text-slate-800 hover:bg-slate-100 transition cursor-pointer"
            >
              <RotateCcw className="h-4 w-4" />
              Retake / Select Another Stream
            </button>

            <div className="flex items-center gap-3">
              <Link
                href={`/careers?stream=${encodeURIComponent(quizResult.primaryRecommendation.title)}`}
                className="rounded-xl border-2 border-slate-300 px-4 py-2.5 text-xs font-bold text-[#0B2A4A] hover:bg-slate-100"
              >
                Explore {quizResult.primaryRecommendation.title} Careers →
              </Link>
              <Link
                href="/colleges"
                className="rounded-xl bg-[#0B2A4A] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#153e6b] shadow-sm"
              >
                View Accredited Institutions
              </Link>
            </div>
          </div>

          {/* Parent Report Modal */}
          {quizResult && (
            <ParentReportModal
              isOpen={showParentModal}
              onClose={() => setShowParentModal(false)}
              result={quizResult}
              studentName={session?.user?.name || 'Class 12 Student'}
            />
          )}
        </div>
      )}
    </div>
  );
}

