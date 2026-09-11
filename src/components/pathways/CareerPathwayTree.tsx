'use client';

import { ExamBadge } from '@/components/common/ExamBadgeModal';
import { Compass } from 'lucide-react';
import { useState } from 'react';

interface PathwayTrack {
  id: string;
  name: string;
  stream: string;
  category: 'CORE' | 'CROSS_STREAM';
  steps: {
    title: string;
    description: string;
    badge?: string;
    exams?: string[];
  }[];
}

const PATHWAYS: PathwayTrack[] = [
  {
    id: 'tech',
    name: 'Software & Computing',
    stream: 'Science (PCM)',
    category: 'CORE',
    steps: [
      { title: 'Class 10 Baseline', description: 'Strong focus on Mathematics, Algebra, & Logic (75%+ recommended)' },
      { title: 'Class 11-12 (+2)', description: 'Choose PCM + Computer Science. Daily problem solving in Calculus & Mechanics.', badge: 'Stream: PCM' },
      {
        title: 'National Entrance Exam',
        description: 'Qualify through premier national testing channels:',
        exams: ['JEE Main', 'JEE Advanced', 'BITSAT'],
        badge: 'Competitive Gate',
      },
      { title: 'Undergraduate Degree', description: 'B.Tech / B.E. in Computer Science, Artificial Intelligence, or Data Science (4 Years).' },
      { title: 'Career Trajectory', description: 'Software Engineer → Senior Distributed Systems Architect → VP Engineering (₹12 - 70+ LPA).' },
    ],
  },
  {
    id: 'mgmt_ipm',
    name: 'Cross-Stream: Management & IIMs',
    stream: 'PCM / Commerce / Arts',
    category: 'CROSS_STREAM',
    steps: [
      { title: 'Class 10 Baseline', description: 'Quantitative fluency, critical reading comprehension, and business curiosity' },
      { title: 'Class 11-12 (+2)', description: 'Eligible from PCM, Commerce, or Arts. Build speed in arithmetic and verbal logic.', badge: 'Open to All Streams' },
      {
        title: 'Integrated Entrance Test',
        description: 'Direct entry into 5-Year Integrated BBA+MBA at premier IIMs without CAT:',
        exams: ['IPMAT', 'CUET-UG'],
        badge: 'No CAT Required',
      },
      { title: 'Integrated Degree', description: '5-Year Integrated Program in Management (IPM at IIM Indore, IIM Rohtak, or IIM Ranchi).' },
      { title: 'Career Trajectory', description: 'Management Consultant / Corporate Strategy / Product Manager at Tier-1 MNCs (₹24 - 45+ LPA).' },
    ],
  },
  {
    id: 'med',
    name: 'Clinical Medicine & Surgery',
    stream: 'Science (PCB)',
    category: 'CORE',
    steps: [
      { title: 'Class 10 Baseline', description: 'Dedication to human biology, patient empathy, and high memory retention' },
      { title: 'Class 11-12 (+2)', description: 'Choose PCB (Physics, Chemistry, Biology). Master NCERT textbooks line-by-line.', badge: 'Stream: PCB' },
      {
        title: 'National Entrance Exam',
        description: 'Single statutory national test for all Indian medical seats:',
        exams: ['NEET-UG'],
        badge: 'Statutory NMC Exam',
      },
      { title: 'Medical College (5.5 Yrs)', description: 'MBBS Degree (4.5 Years Academics + 1 Year Mandatory Rotatory Hospital Internship).' },
      { title: 'Specialization & Practice', description: 'NEET-PG / NEXT for MD (Medicine) or MS (Surgery) specialist consultant practice.' },
    ],
  },
  {
    id: 'biotech_admin',
    name: 'Cross-Stream: Biotech & Health Admin',
    stream: 'Science (PCB / PCMB)',
    category: 'CROSS_STREAM',
    steps: [
      { title: 'Class 10 Baseline', description: 'Passion for life sciences, genetics, laboratory discovery, or health systems' },
      { title: 'Class 11-12 (+2)', description: 'Choose PCB/PCMB. Skip 10-year clinical residency marathon for faster industry mobility.', badge: 'No Night Duties' },
      {
        title: 'Research Entrance Channels',
        description: 'Premier pure sciences and university examinations:',
        exams: ['IISER IAT', 'CUET-UG'],
        badge: 'Research & Ops',
      },
      { title: 'Undergraduate Program', description: 'BS-MS Dual Degree in Biological Sciences (IISERs) or Master of Hospital Admin (MHA at AIIMS/TISS).' },
      { title: 'Career Trajectory', description: 'Genomics Scientist / Clinical Research Director / Hospital Healthcare Administrator (₹10 - 32+ LPA).' },
    ],
  },
  {
    id: 'law',
    name: 'Cross-Stream: Corporate & Tech Law',
    stream: 'PCM / Commerce / Arts',
    category: 'CROSS_STREAM',
    steps: [
      { title: 'Class 10 Baseline', description: 'Critical debate, articulate writing, analytical logic, and social governance' },
      { title: 'Class 11-12 (+2)', description: 'Eligible from any stream. Science students hold high advantages in cyber patent law.', badge: 'Open to All Streams' },
      {
        title: 'National Law Entrance',
        description: 'National entrance for premier National Law Universities:',
        exams: ['CLAT'],
        badge: 'NLUs Consortium',
      },
      { title: 'Law School (5 Years)', description: '5-Year Integrated B.A. LL.B. (Hons) or B.B.A. LL.B. at NLSIU Bengaluru, NALSAR, etc.' },
      { title: 'Career Trajectory', description: 'Corporate M&A Lawyer / Technology & Patent Counsel at Tier-1 firms (₹16 - 35+ LPA).' },
    ],
  },
  {
    id: 'design',
    name: 'Cross-Stream: Industrial & UX Design',
    stream: 'PCM / Any Stream',
    category: 'CROSS_STREAM',
    steps: [
      { title: 'Class 10 Baseline', description: 'Visual-spatial observation, sketching curiosity, and human psychology' },
      { title: 'Class 11-12 (+2)', description: 'PCM or any stream. Build sketching perspective and digital design thinking.', badge: 'Creative Tech' },
      {
        title: 'Design Entrance Test',
        description: 'Elite design examinations for IITs and national institutes:',
        exams: ['UCEED', 'NID DAT'],
        badge: 'IIT Bombay & NID',
      },
      { title: 'Design College (4 Years)', description: 'Bachelor of Design (B.Des) at IIT Bombay (IDC), IIT Delhi, IIT Guwahati, or NID Ahmedabad.' },
      { title: 'Career Trajectory', description: 'Product Designer / UX Lead / Industrial Design Director at top tech firms (₹14 - 40+ LPA).' },
    ],
  },
  {
    id: 'finance',
    name: 'Chartered Accountancy & Finance',
    stream: 'Commerce (with/without Maths)',
    category: 'CORE',
    steps: [
      { title: 'Class 10 Baseline', description: 'Financial systems, numerical precision, business economics, and auditing' },
      { title: 'Class 11-12 (+2)', description: 'Commerce with Accountancy, Business Studies, & Economics.', badge: 'Stream: Commerce' },
      {
        title: 'Statutory Entry Gate',
        description: 'Register with statutory accounting body alongside central university entrance:',
        exams: ['CA Foundation', 'CUET-UG'],
        badge: 'ICAI Statutory',
      },
      { title: 'Articleship & Training', description: 'CA Intermediate + 2 years mandatory full-time corporate audit articleship.' },
      { title: 'Career Trajectory', description: 'Chartered Accountant (CA) / Chief Financial Officer (CFO) / Partner (₹12 - 50+ LPA).' },
    ],
  },
];

export function CareerPathwayTree() {
  const [activeTab, setActiveTab] = useState(PATHWAYS[0].id);
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | 'CORE' | 'CROSS_STREAM'>('ALL');

  const filteredPathways = PATHWAYS.filter((p) => {
    if (selectedCategory === 'ALL') return true;
    return p.category === selectedCategory;
  });

  const currentPathway = PATHWAYS.find((p) => p.id === activeTab) || PATHWAYS[0];

  return (
    <div className="flex flex-col gap-8 rounded-3xl border-2 border-slate-300 bg-[#EAEFF5] p-6 sm:p-10 shadow-xs">
      {/* Header section with breathing room */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b-2 border-slate-200 pb-6">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="rounded-lg bg-white px-3 py-1 text-xs font-bold text-[#D96B00] border border-amber-200 shadow-2xs">
              Interactive Educational Roadmaps
            </span>
            <span className="text-xs font-semibold text-slate-600">Class 10 → +2 → Exams → Degrees</span>
          </div>
          <h3 className="mt-3 text-2xl sm:text-3xl font-black text-[#0B2A4A] tracking-tight">
            Non-Linear Career Pathways in India
          </h3>
          <p className="text-sm sm:text-base text-slate-700 mt-2 leading-relaxed">
            Taking PCM or PCB does not limit you to only Engineering or MBBS. Explore both core professional routes and high-growth alternative trajectories.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 text-xs font-semibold text-slate-800 bg-white px-4 py-2.5 rounded-xl border border-slate-300 self-start md:self-auto shadow-2xs">
          <Compass className="h-4 w-4 text-[#D96B00] shrink-0" />
          <span>Click any exam badge to open official portals</span>
        </div>
      </div>

      {/* Filter Categories: All, Core, Cross-Stream */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold text-slate-700 mr-1">Filter Tracks:</span>
        <button
          type="button"
          onClick={() => {
            setSelectedCategory('ALL');
            if (!PATHWAYS.some((p) => p.id === activeTab)) {
              setActiveTab(PATHWAYS[0].id);
            }
          }}
          className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-colors cursor-pointer ${
            selectedCategory === 'ALL'
              ? 'bg-[#0B2A4A] text-white shadow-xs'
              : 'bg-white border border-slate-300 text-slate-800 hover:bg-slate-100 hover:text-slate-950'
          }`}
        >
          All Pathways ({PATHWAYS.length})
        </button>
        <button
          type="button"
          onClick={() => {
            setSelectedCategory('CORE');
            const firstCore = PATHWAYS.find((p) => p.category === 'CORE');
            if (firstCore) setActiveTab(firstCore.id);
          }}
          className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-colors cursor-pointer ${
            selectedCategory === 'CORE'
              ? 'bg-[#0B2A4A] text-white shadow-xs'
              : 'bg-white border border-slate-300 text-slate-800 hover:bg-slate-100 hover:text-slate-950'
          }`}
        >
          Core Discipline Tracks (PCM / PCB / Commerce)
        </button>
        <button
          type="button"
          onClick={() => {
            setSelectedCategory('CROSS_STREAM');
            const firstCross = PATHWAYS.find((p) => p.category === 'CROSS_STREAM');
            if (firstCross) setActiveTab(firstCross.id);
          }}
          className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-colors cursor-pointer ${
            selectedCategory === 'CROSS_STREAM'
              ? 'bg-[#D96B00] text-white shadow-xs'
              : 'bg-white text-[#D96B00] hover:bg-amber-50 border border-amber-300'
          }`}
        >
          Cross-Stream Alternatives (IIMs, Law, Design, Biotech)
        </button>
      </div>

      {/* Pathway Selection Tabs */}
      <div className="flex flex-wrap gap-2.5">
        {filteredPathways.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setActiveTab(p.id)}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold transition-all cursor-pointer shadow-2xs ${
              activeTab === p.id
                ? 'bg-[#0B2A4A] text-white shadow-md border border-[#071C33]'
                : 'border border-slate-300 bg-white text-slate-800 hover:bg-slate-100 hover:border-slate-400 hover:text-slate-950'
            }`}
          >
            <span>{p.name}</span>
            {p.category === 'CROSS_STREAM' && (
              <span
                className={`rounded-md px-2 py-0.5 text-xs font-bold uppercase tracking-wider ${
                  activeTab === p.id
                    ? 'bg-amber-400 text-slate-950'
                    : 'bg-amber-100 text-[#D96B00]'
                }`}
              >
                Flexible
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Track Metadata Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-slate-300 bg-white px-6 py-3.5 text-sm shadow-2xs">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Stream Prerequisite:</span>
          <span className="font-bold text-slate-950">{currentPathway.stream}</span>
        </div>
        <span className="text-xs font-bold text-[#0B2A4A]">
          5 Sequential Career Milestones
        </span>
      </div>

      {/* Step Cards - Clean layout with generous breathing room */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {currentPathway.steps.map((step, idx) => (
          <div
            key={idx}
            className="flex flex-col justify-between gap-4 rounded-2xl border-2 border-slate-300/80 bg-white p-5 shadow-2xs hover:border-[#0B2A4A] hover:shadow-md transition-all group"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#0B2A4A] text-xs font-black text-white shadow-xs">
                  {idx + 1}
                </span>
                {step.badge && (
                  <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-bold text-slate-800">
                    {step.badge}
                  </span>
                )}
              </div>

              <h4 className="text-sm font-bold text-slate-950 mt-3 leading-snug">
                {step.title}
              </h4>
              <p className="text-xs font-medium text-slate-700 leading-relaxed mt-1.5">
                {step.description}
              </p>
            </div>

            {/* Clickable Exam Badges */}
            {step.exams && step.exams.length > 0 && (
              <div className="mt-2 pt-3 border-t border-slate-100 flex flex-col gap-1.5">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Examinations:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {step.exams.map((examName, eIdx) => (
                    <ExamBadge key={eIdx} examName={examName} size="sm" />
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

