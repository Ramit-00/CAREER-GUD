import { AutomationMeter } from '@/components/charts/AutomationMeter';
import { CareerPathwayTree } from '@/components/pathways/CareerPathwayTree';
import { SEED_CAREERS, SEED_COLLEGES, SEED_CONSULTANTS } from '@/lib/data/seedData';
import {
  ArrowRight,
  Award,
  BookOpen,
  Brain,
  Briefcase,
  CheckCircle2,
  Compass,
  GraduationCap,
  Scale,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  UserCheck,
} from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const featuredCareers = SEED_CAREERS.slice(0, 3);
  const featuredColleges = SEED_COLLEGES.slice(0, 3);
  const featuredConsultants = SEED_CONSULTANTS.slice(0, 3);

  return (
    <div className="flex flex-col gap-20 pb-20">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-12 md:pt-20">
        {/* Subtle background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none -z-10" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50/80 px-4 py-1.5 text-xs font-bold text-indigo-700 dark:border-indigo-900/60 dark:bg-indigo-950/40 dark:text-indigo-300 mb-6">
            <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
            <span>Built Specifically for the Indian Education Landscape</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 dark:text-white max-w-5xl mx-auto leading-[1.12]">
            Stop Choosing Subjects Based on Peer Pressure.{' '}
            <span className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-teal-500 bg-clip-text text-transparent">
              Discover What Genuinely Fits You.
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Realistic, AI-grounded guidance for Class 10 and 12 students in India. Evaluate +1/+2 streams, degree options, future AI automation risks, and true salary bands in INR — free of coaching institute hype.
          </p>

          {/* Dual Action Decision Bifurcator */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-xl mx-auto">
            <Link
              href="/quiz/post-10th"
              className="group flex w-full sm:w-auto items-center justify-center gap-3 rounded-2xl bg-indigo-600 px-7 py-4 text-base font-bold text-white shadow-xl shadow-indigo-600/25 hover:bg-indigo-500 transition-all active:scale-95"
            >
              <span>I&apos;m in Class 10 (Find My Stream)</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              href="/quiz/post-12th"
              className="flex w-full sm:w-auto items-center justify-center gap-3 rounded-2xl border-2 border-slate-300 bg-white px-7 py-4 text-base font-bold text-slate-800 hover:border-indigo-500 hover:text-indigo-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 transition-all active:scale-95"
            >
              <span>I&apos;m in Class 12 (Find Degree & Career)</span>
            </Link>
          </div>

          {/* Trust points */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-semibold text-slate-500">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-teal-500" />
              <span>Zero Coaching Sponsorship Bias</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-teal-500" />
              <span>Grounded in NIRF & Public Placement Reports</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-teal-500" />
              <span>Per-Domain Verified Mentors</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Decision Gates: 10th vs 12th */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Class 10 Box */}
          <div className="relative overflow-hidden rounded-3xl border border-indigo-100 bg-gradient-to-br from-indigo-50/70 to-white p-8 dark:border-indigo-950 dark:from-indigo-950/20 dark:to-slate-900 shadow-sm">
            <span className="inline-flex rounded-xl bg-indigo-100 px-3 py-1 text-xs font-bold text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300">
              Decision Point #1
            </span>
            <h3 className="mt-4 text-2xl font-black text-slate-900 dark:text-white">
              Class 10: Stream Selection (+1 & +2)
            </h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Are you choosing Science (PCM or PCB) just because relatives expect it? Discover whether your analytical problem-solving, commercial curiosity, or socio-linguistic aptitude points toward Non-Medical, Medical, Commerce, or Arts.
            </p>

            <ul className="mt-6 flex flex-col gap-2.5 text-xs text-slate-700 dark:text-slate-300 font-medium">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-indigo-500" />
                <span>PCM vs. PCB vs. PCMB vs. Commerce vs. Arts objective scoring</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-indigo-500" />
                <span>Honest friction check: Compares your 10th math/science marks to +1 pace</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-indigo-500" />
                <span>Personalized preparation action plan for Class 11</span>
              </li>
            </ul>

            <Link
              href="/quiz/post-10th"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-indigo-500 transition"
            >
              Take Stream Discovery Quiz
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Class 12 Box */}
          <div className="relative overflow-hidden rounded-3xl border border-teal-100 bg-gradient-to-br from-teal-50/70 to-white p-8 dark:border-teal-950 dark:from-teal-950/20 dark:to-slate-900 shadow-sm">
            <span className="inline-flex rounded-xl bg-teal-100 px-3 py-1 text-xs font-bold text-teal-700 dark:bg-teal-900 dark:text-teal-300">
              Decision Point #2
            </span>
            <h3 className="mt-4 text-2xl font-black text-slate-900 dark:text-white">
              Class 12: Degree, Exam & Career Match
            </h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Done with +2 or appearing for board exams? Match your stream and subject eligibility to realistic degrees: B.Tech, MBBS, B.Arch, CA, Corporate Law (CLAT), Design (UCEED), or Aviation, with genuine exam cutoffs.
            </p>

            <ul className="mt-6 flex flex-col gap-2.5 text-xs text-slate-700 dark:text-slate-300 font-medium">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-teal-500" />
                <span>Strict prerequisite checks (e.g. Biology for MBBS, Math for B.Arch)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-teal-500" />
                <span>Realistic exam cutoffs for JEE, NEET, CUET, CLAT, BITSAT</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-teal-500" />
                <span>10-year career outlook with AI automation risk scores & INR salary bands</span>
              </li>
            </ul>

            <Link
              href="/quiz/post-12th"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-teal-500 transition"
            >
              Take Degree & Career Quiz
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 3. Core Manifesto: Be Realistic, Not Idealistic */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 sm:p-12 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-12">
            <div className="lg:w-1/2 flex flex-col gap-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                <Scale className="h-4 w-4" />
                <span>Our Core Operating Principle</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white leading-tight">
                Be Realistic, Not Idealistic.
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Most career platforms give dangerous blind encouragement: <em>&ldquo;You can do whatever you set your mind to!&rdquo;</em> In India, where 14 lakh students fight for 17,000 IIT seats and 23 lakh fight for 55,000 government medical seats, ungrounded optimism leads to wasted drop years, depression, and severe financial strain.
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                CARRER-GUD confronts reality head-on. If your 10th Math is 52% and you target JEE Advanced, we tell you honestly what bridge work it will take and show you viable alternative routes where you can genuinely thrive.
              </p>
            </div>

            <div className="lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-800/50">
                <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">1.2%</span>
                <h4 className="mt-1 text-sm font-bold text-slate-900 dark:text-white">JEE Selection Reality</h4>
                <p className="mt-1 text-xs text-slate-500">
                  14.2 lakh aspirants for ~17,385 IIT seats. We highlight NIT, BITS, and strong state engineering alternatives.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-800/50">
                <span className="text-2xl font-black text-teal-600 dark:text-teal-400">2.4%</span>
                <h4 className="mt-1 text-sm font-bold text-slate-900 dark:text-white">NEET-UG Govt MBBS Ratio</h4>
                <p className="mt-1 text-xs text-slate-500">
                  Over 23 lakh aspirants for ~55,000 govt seats. We show allied health, research & biotech backup options.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-800/50">
                <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">12 - 18%</span>
                <h4 className="mt-1 text-sm font-bold text-slate-900 dark:text-white">CA Final Pass Rate</h4>
                <p className="mt-1 text-xs text-slate-500">
                  Statutory monopoly on audits, but demands strict self-discipline during articleship training.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-800/50">
                <span className="text-2xl font-black text-amber-600 dark:text-amber-400">0.1%</span>
                <h4 className="mt-1 text-sm font-bold text-slate-900 dark:text-white">UPSC CSE Selection</h4>
                <p className="mt-1 text-xs text-slate-500">
                  Prestige is unmatched, but mandatory to build a parallel private career before attempting multiple years.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Interactive Pathway Roadmap */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <CareerPathwayTree />
      </section>

      {/* 5. Featured Careers with Automation Risk */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Future Opportunities & AI Exposure
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
              Popular Career Outlooks in India
            </h2>
          </div>
          <Link
            href="/careers"
            className="mt-3 sm:mt-0 inline-flex items-center gap-1.5 text-sm font-bold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
          >
            Explore all 30+ Careers
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredCareers.map((career) => (
            <div
              key={career.id}
              className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 hover:border-indigo-300 dark:hover:border-indigo-800 transition"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    {career.streamLabel.split(' ')[0]}
                  </span>
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <TrendingUp className="h-3.5 w-3.5" />
                    {career.outlook.demandTrend}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-3">
                  {career.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                  {career.description}
                </p>

                {/* Automation Meter */}
                <div className="mt-4">
                  <AutomationMeter
                    score={career.outlook.automationRiskScore}
                    label={career.outlook.automationRiskLabel}
                  />
                </div>

                {/* Salary */}
                <div className="mt-4 rounded-2xl bg-slate-50 p-3 dark:bg-slate-800/40">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Average Salary Band (India)
                  </span>
                  <div className="flex items-baseline justify-between mt-1 text-xs">
                    <span className="text-slate-600 dark:text-slate-300">Entry: <strong>{career.outlook.avgSalaryRangeINR.entry}</strong></span>
                    <span className="text-indigo-600 dark:text-indigo-400 font-bold">Mid: {career.outlook.avgSalaryRangeINR.mid}</span>
                  </div>
                </div>
              </div>

              <Link
                href={`/careers/${career.slug}`}
                className="mt-6 flex items-center justify-center gap-2 rounded-xl border border-slate-200 py-2.5 text-xs font-bold text-slate-800 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-800 transition"
              >
                View Eligibility & Roadmap
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Featured Colleges Directory */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
              Verified Public Institutional Data
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
              Top Indian Colleges & Placements
            </h2>
          </div>
          <Link
            href="/colleges"
            className="mt-3 sm:mt-0 inline-flex items-center gap-1.5 text-sm font-bold text-teal-600 hover:text-teal-500 dark:text-teal-400"
          >
            Explore College Directory
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredColleges.map((college) => (
            <div
              key={college.id}
              className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-teal-50 px-2.5 py-1 text-[10px] font-bold text-teal-700 dark:bg-teal-950/50 dark:text-teal-300">
                    NIRF #{college.nirfRank}
                  </span>
                  <span className="text-xs text-slate-500">{college.city}, {college.state}</span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-3">
                  {college.name}
                </h3>

                <div className="mt-4 flex flex-col gap-1.5 text-xs text-slate-600 dark:text-slate-400">
                  <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 py-1">
                    <span>Average Package:</span>
                    <strong className="text-slate-900 dark:text-white">{college.placementStats.avgPackageINR}</strong>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 py-1">
                    <span>Highest Package:</span>
                    <strong className="text-emerald-600 dark:text-emerald-400">{college.placementStats.highestPackageINR}</strong>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>Placement Rate:</span>
                    <strong className="text-slate-900 dark:text-white">{college.placementStats.placementPercentage}%</strong>
                  </div>
                </div>
              </div>

              <Link
                href={`/colleges/${college.slug}`}
                className="mt-6 flex items-center justify-center gap-2 rounded-xl border border-slate-200 py-2.5 text-xs font-bold text-slate-800 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-800 transition"
              >
                View Programs & Fees
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Verified Consultant Marketplace Teaser */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200 bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-900 p-8 sm:p-12 text-white shadow-xl">
          <div className="flex flex-col lg:flex-row items-start justify-between gap-8">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-teal-400/40 bg-teal-500/10 px-3 py-1 text-xs font-bold text-teal-300 mb-4">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Strict Per-Domain Verification Protocol</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black">
                Connect with Verified Human Mentors.
              </h2>
              <p className="mt-3 text-sm text-slate-300 leading-relaxed">
                A Commerce mentor should never advise you on MBBS surgery, and an engineer shouldn&apos;t fabricate legal advice. Every consultant on CARRER-GUD undergoes rigorous credential checks and is only bookable for their officially verified domain.
              </p>
            </div>

            <Link
              href="/consultants"
              className="inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3.5 text-sm font-bold text-slate-900 shadow-md hover:bg-slate-100 transition shrink-0"
            >
              Browse Verified Mentors
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            {featuredConsultants.map((consultant) => (
              <div
                key={consultant.id}
                className="flex flex-col justify-between rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur"
              >
                <div>
                  <h4 className="font-bold text-white text-base">{consultant.name}</h4>
                  <p className="text-xs text-indigo-200 line-clamp-1 mt-0.5">{consultant.headline}</p>
                  <p className="text-xs text-slate-400 mt-2">{consultant.almaMater}</p>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {consultant.domainVerifications
                      .filter((v) => v.status === 'VERIFIED')
                      .map((v, i) => (
                        <span
                          key={i}
                          className="rounded-md bg-teal-400/20 border border-teal-400/30 px-2 py-0.5 text-[10px] font-bold text-teal-200"
                        >
                          ✓ Verified {v.domain}
                        </span>
                      ))}
                  </div>
                </div>

                <Link
                  href={`/consultants/${consultant.id}`}
                  className="mt-4 text-xs font-semibold text-teal-300 hover:underline inline-flex items-center gap-1"
                >
                  Book 1-on-1 Session →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
