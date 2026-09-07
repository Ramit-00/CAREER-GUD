'use client';

import { ArrowRight, BookOpen, CheckCircle, GraduationCap, Milestone, Trophy } from 'lucide-react';
import { useState } from 'react';

interface PathwayTrack {
  id: string;
  name: string;
  stream: string;
  color: string;
  steps: {
    title: string;
    description: string;
    badge?: string;
  }[];
}

const PATHWAYS: PathwayTrack[] = [
  {
    id: 'tech',
    name: 'Software & AI Engineer',
    stream: 'Science (PCM)',
    color: 'from-indigo-600 to-blue-600',
    steps: [
      { title: 'Class 10 Baseline', description: 'Strong focus on Mathematics, Algebra, & Computer Logic (75%+ recommended)' },
      { title: 'Class 11-12 (+2)', description: 'Choose PCM + Computer Science. Daily problem solving in Calculus & Physics.', badge: 'Stream: PCM' },
      { title: 'National Entrance Exam', description: 'Appear for JEE Main, JEE Advanced, and BITSAT.', badge: 'Exams: JEE / BITSAT' },
      { title: 'Degree (4 Years)', description: 'B.Tech / B.E. in Computer Science, AI & Data Science, or Software Engineering.' },
      { title: 'Career Outcome', description: 'AI Engineer / Full Stack Developer (Starting: ₹8 - 18 LPA, Peak: ₹70L - 1.2+ Cr).' },
    ],
  },
  {
    id: 'med',
    name: 'Doctor & Surgeon (MBBS)',
    stream: 'Science (PCB)',
    color: 'from-cyan-600 to-teal-600',
    steps: [
      { title: 'Class 10 Baseline', description: 'Interest in biology, human systems, and high retention for scientific terms' },
      { title: 'Class 11-12 (+2)', description: 'Choose PCB (Physics, Chemistry, Biology). Master NCERT textbooks line-by-line.', badge: 'Stream: PCB' },
      { title: 'National Entrance Exam', description: 'NEET-UG (Over 23 lakh candidates compete for ~55,000 Govt MBBS seats).', badge: 'Exam: NEET-UG' },
      { title: 'Medical College (5.5 Years)', description: 'MBBS Degree (4.5 Years Academics + 1 Year Hospital Rotatory Internship).' },
      { title: 'Post-Graduation & Specialization', description: 'NEET-PG / NEXT for MD (Medicine) or MS (Surgery) specialist practice.' },
    ],
  },
  {
    id: 'finance',
    name: 'Chartered Accountant (CA)',
    stream: 'Commerce (Maths/Accounts)',
    color: 'from-emerald-600 to-green-600',
    steps: [
      { title: 'Class 10 Baseline', description: 'Interest in financial systems, numerical precision, and business logic' },
      { title: 'Class 11-12 (+2)', description: 'Commerce with Accountancy, Business Studies, Economics, & Mathematics.', badge: 'Stream: Commerce' },
      { title: 'Foundation & Entry', description: 'Register with ICAI for CA Foundation and appear for CUET for top DU colleges.', badge: 'Exam: CA Foundation' },
      { title: 'Intermediate & Articleship', description: 'Pass CA Intermediate; undergo 2 years mandatory full-time corporate audit training.' },
      { title: 'CA Final & Membership', description: 'Clear CA Final to become a certified Chartered Accountant & Financial Controller.' },
    ],
  },
  {
    id: 'law',
    name: 'Corporate Lawyer',
    stream: 'Arts / Humanities / Any',
    color: 'from-amber-600 to-orange-600',
    steps: [
      { title: 'Class 10 Baseline', description: 'Curiosity about social justice, reading comprehension, and debate' },
      { title: 'Class 11-12 (+2)', description: 'Humanities, Commerce, or Science. Focus on reading speed and legal logic.', badge: 'Any Stream' },
      { title: 'National Entrance Exam', description: 'Common Law Admission Test (CLAT) for premier National Law Universities.', badge: 'Exam: CLAT' },
      { title: 'Law School (5 Years)', description: '5-Year Integrated B.A., LL.B. (Hons) at NLSIU Bengaluru, NALSAR, etc.' },
      { title: 'Career Outcome', description: 'Associate at premier corporate law firm or Advocate (Starting: ₹10 - 18 LPA).' },
    ],
  },
];

export function CareerPathwayTree() {
  const [activeTab, setActiveTab] = useState(PATHWAYS[0].id);
  const currentPathway = PATHWAYS.find((p) => p.id === activeTab) || PATHWAYS[0];

  return (
    <div className="flex flex-col gap-6 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Roadmap Architecture
          </span>
          <h3 className="text-xl font-black text-slate-900 dark:text-white">
            End-to-End Indian Career Pathways
          </h3>
          <p className="text-xs text-slate-500">
            From Class 10 → Stream Choice → Entrance Exams → Degrees → Long-term Roles
          </p>
        </div>

        {/* Pathway Pills */}
        <div className="flex flex-wrap gap-2">
          {PATHWAYS.map((p) => (
            <button
              key={p.id}
              onClick={() => setActiveTab(p.id)}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition ${
                activeTab === p.id
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* Pathway Stepper */}
      <div className="relative mt-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {currentPathway.steps.map((step, idx) => (
            <div
              key={idx}
              className="relative flex flex-col gap-2 rounded-2xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-800/40"
            >
              <div className="flex items-center justify-between">
                <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-indigo-100 text-xs font-bold text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300">
                  {idx + 1}
                </span>
                {step.badge && (
                  <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-bold text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                    {step.badge}
                  </span>
                )}
              </div>

              <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                {step.title}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {step.description}
              </p>

              {idx < currentPathway.steps.length - 1 && (
                <div className="hidden md:block absolute -right-3.5 top-1/2 -translate-y-1/2 z-10">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white border border-slate-200 shadow-sm dark:bg-slate-900 dark:border-slate-700">
                    <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
