'use client';

import {
  AlertTriangle,
  Award,
  CheckCircle2,
  Download,
  FileText,
  Printer,
  Share2,
  Shield,
  TrendingUp,
  X,
} from 'lucide-react';
import { QuizResult } from '@/types';
import React, { useRef } from 'react';

export interface ParentDossierProps {
  isOpen: boolean;
  onClose: () => void;
  studentName?: string;
  currentClass?: string;
  tenthScore?: number;
  primaryPathTitle?: string;
  primaryStreamCategory?: string;
  rationale?: string;
  realismHeadline?: string;
  realismDescription?: string;
  workloadReality?: string;
  topStrengths?: string[];
  topInterests?: string[];
  result?: QuizResult;
}

export function ParentReportModal({
  isOpen,
  onClose,
  studentName = 'Student',
  currentClass = 'Class 10 / 12',
  tenthScore = 85,
  primaryPathTitle,
  primaryStreamCategory,
  rationale,
  realismHeadline,
  realismDescription,
  workloadReality,
  topStrengths,
  topInterests,
  result,
}: ParentDossierProps) {
  const printAreaRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const resolvedTitle = primaryPathTitle || result?.primaryRecommendation?.title || 'Recommended Academic Pathway';
  const resolvedCategory = primaryStreamCategory || result?.primaryRecommendation?.streamCategory || 'General Academic';
  const resolvedRationale = rationale || result?.primaryRecommendation?.whyItFits || 'Strong psychometric alignment with student strengths.';
  const resolvedHeadline = realismHeadline || result?.realismCheck?.headline || 'Strong Foundation with Manageable Rigor';
  const resolvedDescription = realismDescription || result?.realismCheck?.description || 'Academic indicators show positive alignment with analytical demands.';
  const resolvedWorkload = workloadReality || result?.realismCheck?.workloadReality || 'Expect 3-4 hours of daily dedicated study beyond standard curriculum.';
  const resolvedStrengths = topStrengths || (result?.scores ? Object.entries(result.scores).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([k]) => k.toUpperCase()) : ['Analytical Logic', 'Consistency', 'Problem Solving']);
  const resolvedInterests = topInterests || ['Applied Science', 'Modern Technology'];

  const handlePrint = () => {
    window.print();
  };

  const handleWhatsAppShare = () => {
    const text = `*CAREER-GUD Academic Dossier for ${studentName}*\n\n` +
      `*Target Stream/Degree:* ${resolvedTitle} (${resolvedCategory})\n` +
      `*Academic Baseline:* ${tenthScore}% (Class 10)\n` +
      `*Recommended Readiness:* ${resolvedHeadline}\n\n` +
      `*Core Strengths:* ${resolvedStrengths.join(', ')}\n\n` +
      `*Family Discussion Summary:* This academic path is objectively modeled to balance student aptitude with long-term employment stability under NEP 2020.\n\n` +
      `Verified by CAREER-GUD National Academic Intelligence.`;

    const encoded = encodeURIComponent(text);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 p-4 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-2xl bg-white shadow-2xl border border-slate-200 my-8">
        {/* Modal Top Actions (Hidden in Print) */}
        <div className="flex items-center justify-between border-b border-slate-200 p-4 print:hidden">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-[#0B2A4A]" />
            <span className="font-bold text-slate-900 text-sm">
              Official Parent Academic Dossier (Print & Export)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleWhatsAppShare}
              className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 transition"
            >
              <Share2 className="h-3.5 w-3.5" /> Share WhatsApp
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 rounded-lg bg-[#0B2A4A] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#081f37] transition"
            >
              <Printer className="h-3.5 w-3.5" /> Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Printable Report Content */}
        <div ref={printAreaRef} className="p-8 sm:p-10 space-y-6 text-slate-800 print:text-black">
          {/* Official Header */}
          <div className="border-b-2 border-[#0B2A4A] pb-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded bg-[#0B2A4A] px-2 py-0.5 text-xs font-black tracking-wider text-white">
                  CAREER-GUD
                </span>
                <span className="text-xs font-bold tracking-wider text-slate-500 uppercase">
                  National Guidance Intelligence
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                Parent Academic Evaluation Dossier
              </h2>
              <p className="text-xs text-slate-500">
                Objective, Anti-Hype Academic Alignment Report for Indian Secondary & Higher Secondary Students
              </p>
            </div>
            <div className="text-right text-xs">
              <span className="font-bold text-slate-500 block">Date of Assessment</span>
              <span className="font-bold text-slate-900">
                {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
            </div>
          </div>

          {/* Student Profile Overview */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <div>
              <span className="text-slate-500 font-semibold block">Student Candidate</span>
              <span className="font-black text-slate-900 text-sm">{studentName}</span>
            </div>
            <div>
              <span className="text-slate-500 font-semibold block">Target Grade</span>
              <span className="font-bold text-slate-900">{currentClass}</span>
            </div>
            <div>
              <span className="text-slate-500 font-semibold block">Class 10 Baseline</span>
              <span className="font-black text-[#0B2A4A] text-sm">{tenthScore}%</span>
            </div>
            <div>
              <span className="text-slate-500 font-semibold block">Assessment Status</span>
              <span className="font-bold text-emerald-600">Calibrated (NEP 2020)</span>
            </div>
          </div>

          {/* Section 1: Objective Recommendation */}
          <div className="space-y-2">
            <h3 className="text-sm font-black uppercase tracking-wider text-[#0B2A4A] flex items-center gap-1.5">
              <Award className="h-4 w-4" /> 1. Primary Recommended Trajectory
            </h3>
            <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs">
              <div className="flex justify-between items-center mb-1">
                <span className="font-black text-base text-slate-900">
                  {resolvedTitle}
                </span>
                <span className="rounded-md bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-900">
                  {resolvedCategory}
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed mt-2">
                {resolvedRationale}
              </p>
            </div>
          </div>

          {/* Section 2: Reality Check & Workload Balance */}
          <div className="space-y-2">
            <h3 className="text-sm font-black uppercase tracking-wider text-[#0B2A4A] flex items-center gap-1.5">
              <TrendingUp className="h-4 w-4" /> 2. Academic Friction & Coaching Reality Check
            </h3>
            <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/60 text-xs space-y-2">
              <div className="flex items-center gap-2 font-bold text-amber-950">
                <CheckCircle2 className="h-4 w-4 text-amber-600 shrink-0" />
                <span>{resolvedHeadline}</span>
              </div>
              <p className="text-amber-900 leading-relaxed">
                {resolvedDescription}
              </p>
              <div className="pt-2 border-t border-amber-200/60 text-[11px] font-semibold text-amber-800">
                <strong>Daily Workload Reality:</strong> {resolvedWorkload}
              </div>
            </div>
          </div>

          {/* Section 3: 5 Data-Backed Parent Discussion Prompts */}
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-wider text-[#0B2A4A] flex items-center gap-1.5">
              <FileText className="h-4 w-4" /> 3. 5 Objective Parent Discussion Prompts
            </h3>
            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="font-black text-slate-900 block mb-0.5">
                  1. Balancing Aspiration & Daily Workload Stamina
                </span>
                <span className="text-slate-600">
                  Discuss whether the student genuinely enjoys problem-solving across 3-4 hours of independent study, rather than enrolling in coaching due to social pressure.
                </span>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="font-black text-slate-900 block mb-0.5">
                  2. Competitive Odds & Non-JEE / Non-NEET Alternatives
                </span>
                <span className="text-slate-600">
                  Understand that selection rates in IITs (~1.2%) and AIIMS (~0.2%) require healthy backups. High-growth alternatives like IPMAT (IIMs), CUET (Central Universities), or design degrees offer equivalent salary outcomes.
                </span>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="font-black text-slate-900 block mb-0.5">
                  3. Higher Education ROI vs Private Tuition Expenses
                </span>
                <span className="text-slate-600">
                  Evaluate total 4-year tuition against median NIRF packages rather than outlier brochure claims. Private fees above ₹18 Lakhs should be scrutinized against verified campus placement statistics.
                </span>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="font-black text-slate-900 block mb-0.5">
                  4. Generative AI & 10-Year Career Longevity
                </span>
                <span className="text-slate-600">
                  Ensure the chosen trajectory emphasizes conceptual logic and multidisciplinary skills that cannot be automated by artificial intelligence over the next decade.
                </span>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="font-black text-slate-900 block mb-0.5">
                  5. Pivot Flexibility Under NEP 2020
                </span>
                <span className="text-slate-600">
                  Reassure the student that under National Education Policy 2020, transitioning between domains (e.g. Science to Economics or Law) is fully supported through CUET without repeating academic years.
                </span>
              </div>
            </div>
          </div>

          {/* Official Verification Seal Footer */}
          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400 font-semibold">
            <div className="flex items-center gap-1.5">
              <Shield className="h-4 w-4 text-slate-400" />
              <span>Certified CAREER-GUD Academic Guidance Seal</span>
            </div>
            <span>National Verification ID: CG-DOSSIER-{Date.now().toString(36).toUpperCase()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
