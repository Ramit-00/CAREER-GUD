'use client';

import { getExamByName, NationalExam } from '@/lib/data/examData';
import {
  AlertCircle,
  Award,
  BookOpen,
  Building,
  CheckCircle2,
  ExternalLink,
  Info,
  Users,
  X,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface ExamBadgeProps {
  examName: string;
  className?: string;
  size?: 'sm' | 'md';
}

export function ExamBadge({ examName, className = '', size = 'md' }: ExamBadgeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const exam = getExamByName(examName);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={`group inline-flex items-center gap-1.5 rounded-md border border-slate-300 bg-slate-50 font-bold text-[#0B2A4A] transition hover:bg-[#FFF8EE] hover:border-[#D96B00] hover:text-[#D96B00] hover:shadow-xs ${
          size === 'sm' ? 'px-2.5 py-1 text-xs' : 'px-3 py-1.5 text-xs'
        } ${className}`}
        title={`View official details and external links for ${examName}`}
      >
        <Award className="h-3.5 w-3.5 text-[#D96B00] shrink-0" />
        <span>{examName}</span>
        <ExternalLink className="h-3 w-3 text-slate-500 shrink-0 opacity-70 group-hover:opacity-100" />
      </button>

      {isOpen && (
        <ExamModal
          exam={exam}
          examName={examName}
          onClose={() => setIsOpen(false)}
        />
      )}
    </>
  );
}

interface ExamModalProps {
  exam: NationalExam | null;
  examName: string;
  onClose: () => void;
}

export function ExamModal({ exam, examName, onClose }: ExamModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Fallback if exam is not in registry
  const fallbackWikipedia = `https://en.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(examName)}`;
  const fallbackSearch = `https://www.google.com/search?q=${encodeURIComponent(examName + ' entrance exam official website India')}`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border-2 border-slate-300 bg-white shadow-2xl animate-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-200 bg-slate-50 px-6 py-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded bg-[#0B2A4A] px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-white">
                National Examination
              </span>
              {exam?.openToAllStreams && (
                <span className="rounded border border-emerald-400 bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-900">
                  Open to All Streams (+2)
                </span>
              )}
            </div>
            <h2 className="mt-2 text-xl font-black text-slate-950">
              {exam ? exam.fullName : examName}
            </h2>
            <p className="text-xs font-semibold text-slate-700 mt-0.5">
              Conducting Body: <strong className="text-slate-950">{exam ? exam.conductingBody : 'National Authority'}</strong>
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
            aria-label="Close dialog"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-6 flex flex-col gap-5 text-sm text-slate-800 leading-relaxed">
          {/* Summary */}
          <div>
            <span className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
              Overview & Academic Scope
            </span>
            <p className="text-sm font-medium text-slate-900 leading-relaxed">
              {exam ? exam.summary : `National standard entrance examination in India: ${examName}.`}
            </p>
          </div>

          {/* Statutory Eligibility & Streams */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <span className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Senior Secondary Eligibility (+2)
            </span>
            <p className="text-sm font-bold text-slate-950">
              {exam ? exam.streamEligibility : 'Check official examination information bulletin.'}
            </p>
          </div>

          {/* Format & Statistics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="rounded-xl border border-slate-200 bg-white p-3.5">
              <div className="flex items-center gap-1.5 text-slate-700 mb-1">
                <Info className="h-4 w-4 text-blue-700" />
                <span className="text-xs font-bold uppercase tracking-wider">Format & Frequency</span>
              </div>
              <p className="text-xs font-semibold text-slate-900">
                {exam ? exam.formatAndFrequency : 'Computer-based / Pen-paper national test.'}
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-3.5">
              <div className="flex items-center gap-1.5 text-slate-700 mb-1">
                <Users className="h-4 w-4 text-blue-700" />
                <span className="text-xs font-bold uppercase tracking-wider">Aspirant Volume</span>
              </div>
              <p className="text-xs font-semibold text-slate-900">
                {exam ? exam.annualAspirants : 'High competitive registration across India.'}
              </p>
            </div>
          </div>

          {/* Reality Check Ratio */}
          {exam?.selectionRatioReality && (
            <div className="rounded-xl border border-amber-300 bg-amber-50/80 p-4">
              <div className="flex items-center gap-1.5 text-amber-900 font-bold mb-1">
                <AlertCircle className="h-4 w-4 text-amber-700" />
                <span className="text-xs uppercase tracking-wider">Competition Reality Benchmark</span>
              </div>
              <p className="text-xs text-slate-800 font-medium leading-relaxed">
                {exam.selectionRatioReality}
              </p>
            </div>
          )}

          {/* Key Participating Institutes */}
          {exam?.keyInstitutions && exam.keyInstitutions.length > 0 && (
            <div>
              <span className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Key Participating Institutions
              </span>
              <div className="flex flex-wrap gap-1.5">
                {exam.keyInstitutions.map((inst, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-800"
                  >
                    <Building className="h-3.5 w-3.5 text-slate-600" />
                    {inst}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer with External Verified Links */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-200 bg-slate-100 px-6 py-4">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
            <CheckCircle2 className="h-4 w-4 text-emerald-700" />
            <span>Verified Official Statutory Sources</span>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <a
              href={exam ? exam.wikipediaUrl : fallbackWikipedia}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex flex-1 sm:flex-initial items-center justify-center gap-1.5 rounded-lg border-2 border-slate-300 bg-white px-3.5 py-2 text-xs font-bold text-slate-800 shadow-xs hover:bg-slate-100 hover:text-slate-950 transition"
            >
              <BookOpen className="h-4 w-4" />
              <span>Wikipedia Guide</span>
              <ExternalLink className="h-3 w-3 opacity-70" />
            </a>

            <a
              href={exam ? exam.officialWebsite : fallbackSearch}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex flex-1 sm:flex-initial items-center justify-center gap-1.5 rounded-lg bg-[#0B2A4A] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#071C33] border border-[#071C33] transition"
            >
              <span>Official Exam Portal</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
