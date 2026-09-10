'use client';

import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Compass,
  ExternalLink,
  GraduationCap,
  Layers,
  Repeat,
  ShieldAlert,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import Link from 'next/link';
import React, { useMemo, useState } from 'react';

type SourceStream = 'SCIENCE_PCB' | 'SCIENCE_PCM' | 'COMMERCE_NO_MATHS' | 'ARTS_HUMANITIES';

interface PivotScenario {
  id: string;
  source: SourceStream;
  targetCareer: string;
  targetDegree: string;
  regulatoryFeasibility: 'SEAMLESS_NEP2020' | 'BRIDGE_EXAM_REQUIRED' | 'CUET_RESTRICTED';
  regulatoryBody: string;
  transitionDifficulty: 'LOW' | 'MODERATE' | 'CHALLENGING';
  mandatoryPrerequisites: string[];
  bridgeMechanism: string;
  universityEligibilitySummary: string;
  actionRoadmap: string[];
}

const PIVOT_DATABASE: PivotScenario[] = [
  {
    id: 'pcb-to-econ',
    source: 'SCIENCE_PCB',
    targetCareer: 'Corporate Economics & Financial Analyst',
    targetDegree: 'B.A. (Hons.) Economics / B.Com (Hons.)',
    regulatoryFeasibility: 'SEAMLESS_NEP2020',
    regulatoryBody: 'University Grants Commission (UGC) & CUET-UG',
    transitionDifficulty: 'MODERATE',
    mandatoryPrerequisites: ['Class 12 Mathematics is required for DU Economics Hons, but NOT required for B.Com at central universities'],
    bridgeMechanism: 'Opt for Mathematics via NIOS (National Institute of Open Schooling) On-Demand examination, or target B.Com / BBA via CUET Section I + Section III (General Test).',
    universityEligibilitySummary: 'Under Delhi University CUET guidelines, students can select subjects studied in Class 12. Science students can choose Physics + Chemistry + Biology in Section II to qualify for commerce degrees with zero marks deduction!',
    actionRoadmap: [
      'Take CUET-UG with your existing Science subjects + General Test.',
      'If aiming specifically for Top-tier Economics Hons, register for single-subject Mathematics through NIOS On-Demand.',
      'Explore BBA in Finance or BMS (Bachelor of Management Studies) at DU / Christ / NMIMS.',
    ],
  },
  {
    id: 'pcb-to-biotech-management',
    source: 'SCIENCE_PCB',
    targetCareer: 'Healthcare Analytics & Biotech Management',
    targetDegree: 'B.Sc. Biotechnology / BBA in Healthcare Management',
    regulatoryFeasibility: 'SEAMLESS_NEP2020',
    regulatoryBody: 'All India Council for Technical Education (AICTE)',
    transitionDifficulty: 'LOW',
    mandatoryPrerequisites: ['Class 12 PCB with 50%+ aggregate'],
    bridgeMechanism: 'Direct eligibility; no bridge exams needed. Completely bypasses the high-friction NEET repeat cycle.',
    universityEligibilitySummary: 'Direct admission based on Class 12 marks or CUET. Eliminates the extreme 1:100 MBBS seat competition while leading directly to pharmaceuticals, genomics, and healthcare corporate consulting.',
    actionRoadmap: [
      'Apply to central and state universities via CUET (Domain: Biology + Chemistry).',
      'Target top private universities offering campus placement pipelines with biopharma firms.',
      'Plan for MBA in Hospital / Healthcare Management or M.Sc. Genomics.',
    ],
  },
  {
    id: 'arts-to-pilot',
    source: 'ARTS_HUMANITIES',
    targetCareer: 'Commercial Airline Pilot',
    targetDegree: 'Commercial Pilot License (CPL) + B.Sc Aviation',
    regulatoryFeasibility: 'BRIDGE_EXAM_REQUIRED',
    regulatoryBody: 'Directorate General of Civil Aviation (DGCA)',
    transitionDifficulty: 'MODERATE',
    mandatoryPrerequisites: ['Class 12 Physics & Mathematics (DGCA Mandate)'],
    bridgeMechanism: 'Enroll in NIOS (National Institute of Open Schooling) for Physics and Mathematics as an On-Demand candidate while in Class 12 or post-12th.',
    universityEligibilitySummary: 'DGCA regulations explicitly recognize NIOS Senior Secondary certificates. Thousands of Indian pilots with non-science backgrounds successfully qualify by clearing these two subjects via NIOS within 3 to 6 months.',
    actionRoadmap: [
      'Register on nios.ac.in for Class 12 Physics & Mathematics On-Demand exams.',
      'Obtain DGCA Class 2 Medical Fitness Certificate from an authorized DGCA Medical Examiner.',
      'Apply for DGCA Computer Number to sit for CPL Ground Navigation, Meteorology, and Air Regulations papers.',
    ],
  },
  {
    id: 'pcm-to-ipmat',
    source: 'SCIENCE_PCM',
    targetCareer: 'Investment Banking & Strategic Management',
    targetDegree: 'Integrated Programme in Management (IPM - 5 Year BBA+MBA)',
    regulatoryFeasibility: 'SEAMLESS_NEP2020',
    regulatoryBody: 'Indian Institutes of Management (IIMs)',
    transitionDifficulty: 'LOW',
    mandatoryPrerequisites: ['Class 12 any stream with 60%+ marks'],
    bridgeMechanism: 'Direct entrance via IPMAT exam (Quantitative Ability + Verbal Ability). PCM mathematics foundation provides massive natural advantage.',
    universityEligibilitySummary: 'IIM Indore, IIM Rohtak, IIM Ranchi, IIM Bodh Gaya, and IIM Jammu offer direct entry after Class 12. No JEE grind, no engineering burnout. Students graduate directly with an IIM MBA degree.',
    actionRoadmap: [
      'Register for IPMAT Indore and IPMAT Rohtak in February/March.',
      'Leverage PCM arithmetic and algebra for the Quantitative section; focus dedicated prep on Reading Comprehension.',
      'Average graduate placement at IIM Indore IPM: ₹25 - ₹30 LPA.',
    ],
  },
  {
    id: 'commerce-to-cyber-law',
    source: 'COMMERCE_NO_MATHS',
    targetCareer: 'Corporate Cyber Law & Data Privacy Counsel',
    targetDegree: 'B.B.A. LL.B. (Hons.)',
    regulatoryFeasibility: 'SEAMLESS_NEP2020',
    regulatoryBody: 'Bar Council of India (BCI) & Consortium of NLUs',
    transitionDifficulty: 'LOW',
    mandatoryPrerequisites: ['Class 12 any stream with 45%+ marks'],
    bridgeMechanism: 'Direct entry via CLAT or AILET. Zero mathematics prerequisites.',
    universityEligibilitySummary: '24 National Law Universities (NLUs) offer 5-year corporate law programs. Rapidly surging demand due to the Digital Personal Data Protection (DPDP) Act 2023 in India.',
    actionRoadmap: [
      'Begin reading the Hindu / Indian Express editorials daily to build critical reading stamina for CLAT passages.',
      'Target NLU Bangalore, NALSAR, and WBNUJS corporate recruitment programs.',
      'Average law firm starting salary: ₹14 - ₹20 LPA with partnership trajectories.',
    ],
  },
  {
    id: 'pcb-to-data-science',
    source: 'SCIENCE_PCB',
    targetCareer: 'Bioinformatics & Healthcare Data Scientist',
    targetDegree: 'BCA (Bachelor of Computer Applications) / B.Sc Data Science',
    regulatoryFeasibility: 'SEAMLESS_NEP2020',
    regulatoryBody: 'AICTE / UGC 2024 Revised Guidelines',
    transitionDifficulty: 'MODERATE',
    mandatoryPrerequisites: ['Class 12 any stream with computer or statistics orientation'],
    bridgeMechanism: 'Under AICTE revised 2024 regulations, Mathematics in Class 12 is NO LONGER mandatory for BCA admissions at most universities.',
    universityEligibilitySummary: 'Students can learn Python, SQL, and data analytics from scratch in semester 1. Perfect bridge for PCB students wanting tech jobs without taking JEE.',
    actionRoadmap: [
      'Apply to central and state universities for BCA / B.Sc Data Science.',
      'Complete introductory Python and statistics courses before college starts.',
      'Combine biological domain knowledge with ML algorithms for biomedical research roles.',
    ],
  },
];

export default function StreamPivotSimulatorPage() {
  const [selectedSource, setSelectedSource] = useState<SourceStream>('SCIENCE_PCB');

  const matchingScenarios = useMemo(() => {
    return PIVOT_DATABASE.filter((p) => p.source === selectedSource);
  }, [selectedSource]);

  return (
    <div className="min-h-screen bg-slate-50 py-10 dark:bg-slate-950">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-200 bg-purple-50 px-3 py-1 text-xs font-bold text-purple-900 dark:border-purple-900/60 dark:bg-purple-950/40 dark:text-purple-300 mb-3">
            <Repeat className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
            National Education Policy 2020 Trajectory Simulator
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            NEP 2020 Stream Switch & Pivot Simulator
          </h1>
          <p className="mt-3 text-sm sm:text-base font-medium text-slate-600 dark:text-slate-300 leading-relaxed">
            Over 30% of students face severe academic burnout within months of choosing Science or Commerce. Learn the exact regulatory pathways to transition into Aviation, Law, IIM Management, or Economics without losing an academic year.
          </p>
        </div>

        {/* Stream Selector Buttons */}
        <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
            Select Your Current Class 11 / 12 Stream
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <button
              onClick={() => setSelectedSource('SCIENCE_PCB')}
              className={`p-3.5 rounded-xl border text-left transition font-bold text-xs ${
                selectedSource === 'SCIENCE_PCB'
                  ? 'border-purple-600 bg-purple-50 text-purple-950 dark:border-purple-400 dark:bg-purple-950/40 dark:text-purple-200'
                  : 'border-slate-200 text-slate-700 hover:border-slate-300 dark:border-slate-800 dark:text-slate-300'
              }`}
            >
              Science (PCB - Medical)
            </button>
            <button
              onClick={() => setSelectedSource('SCIENCE_PCM')}
              className={`p-3.5 rounded-xl border text-left transition font-bold text-xs ${
                selectedSource === 'SCIENCE_PCM'
                  ? 'border-purple-600 bg-purple-50 text-purple-950 dark:border-purple-400 dark:bg-purple-950/40 dark:text-purple-200'
                  : 'border-slate-200 text-slate-700 hover:border-slate-300 dark:border-slate-800 dark:text-slate-300'
              }`}
            >
              Science (PCM - Non-Med)
            </button>
            <button
              onClick={() => setSelectedSource('COMMERCE_NO_MATHS')}
              className={`p-3.5 rounded-xl border text-left transition font-bold text-xs ${
                selectedSource === 'COMMERCE_NO_MATHS'
                  ? 'border-purple-600 bg-purple-50 text-purple-950 dark:border-purple-400 dark:bg-purple-950/40 dark:text-purple-200'
                  : 'border-slate-200 text-slate-700 hover:border-slate-300 dark:border-slate-800 dark:text-slate-300'
              }`}
            >
              Commerce (No Maths)
            </button>
            <button
              onClick={() => setSelectedSource('ARTS_HUMANITIES')}
              className={`p-3.5 rounded-xl border text-left transition font-bold text-xs ${
                selectedSource === 'ARTS_HUMANITIES'
                  ? 'border-purple-600 bg-purple-50 text-purple-950 dark:border-purple-400 dark:bg-purple-950/40 dark:text-purple-200'
                  : 'border-slate-200 text-slate-700 hover:border-slate-300 dark:border-slate-800 dark:text-slate-300'
              }`}
            >
              Arts & Humanities
            </button>
          </div>
        </div>

        {/* Pivot Scenarios List */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black text-slate-900 dark:text-white">
              Viable Regulatory Pivot Pathways ({matchingScenarios.length})
            </h3>
            <span className="text-xs text-slate-400 font-semibold">
              Verified with UGC, AICTE, DGCA & BCI Rules
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {matchingScenarios.map((scenario) => (
              <div
                key={scenario.id}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                        Target Trajectory
                      </span>
                      <h4 className="text-lg font-black text-slate-900 dark:text-white">
                        {scenario.targetCareer}
                      </h4>
                      <p className="text-xs font-semibold text-purple-700 dark:text-purple-300 mt-0.5">
                        {scenario.targetDegree}
                      </p>
                    </div>

                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold ${
                        scenario.regulatoryFeasibility === 'SEAMLESS_NEP2020'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                      }`}
                    >
                      {scenario.regulatoryFeasibility === 'SEAMLESS_NEP2020'
                        ? 'Direct NEP 2020 Pathway'
                        : 'Bridge Paper Required'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                    {scenario.universityEligibilitySummary}
                  </p>

                  <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-100 dark:bg-slate-800/60 dark:border-slate-800 text-xs space-y-2 mb-4">
                    <div className="flex items-start gap-1.5 font-bold text-slate-800 dark:text-slate-200">
                      <Compass className="h-4 w-4 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
                      <span>Bridge Mechanism:</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 pl-5">
                      {scenario.bridgeMechanism}
                    </p>
                  </div>

                  <div className="space-y-1.5 mb-4">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      Step-by-Step Action Roadmap:
                    </span>
                    <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-300 pl-1">
                      {scenario.actionRoadmap.map((step, sIdx) => (
                        <li key={sIdx} className="flex items-start gap-2">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-400">
                    Authority: {scenario.regulatoryBody}
                  </span>
                  <Link
                    href="/consultants"
                    className="text-xs font-bold text-purple-700 dark:text-purple-300 hover:underline inline-flex items-center gap-1"
                  >
                    Discuss with Mentor <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
