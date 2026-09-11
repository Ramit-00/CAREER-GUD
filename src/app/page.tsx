import { AutomationMeter } from '@/components/charts/AutomationMeter';
import { CareerPathwayTree } from '@/components/pathways/CareerPathwayTree';
import { SEED_CAREERS, SEED_COLLEGES, SEED_CONSULTANTS } from '@/lib/data/seedData';
import {
  ArrowRight,
  CheckCircle2,
  Scale,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const featuredCareers = SEED_CAREERS.slice(0, 3);
  const featuredColleges = SEED_COLLEGES.slice(0, 3);
  const featuredConsultants = SEED_CONSULTANTS.slice(0, 3);

  return (
    <div className="flex flex-col">
      {/* ================= OFFICIAL UPDATES TICKER (सूचना पट्ट) ================= */}
      <div className="border-b border-amber-200 bg-[#FFF8EE] text-xs font-semibold text-slate-800">
        <div className="mx-auto flex h-10 max-w-6xl items-center gap-3 px-4 sm:px-6 lg:px-8">
          <div className="flex shrink-0 items-center gap-1.5 rounded-sm bg-[#D96B00] px-2.5 py-1 text-[11px] font-black uppercase tracking-wider text-white">
            <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-white"></span>
            <span>LATEST UPDATES</span>
          </div>
          <div className="flex-1 overflow-hidden truncate">
            <span className="inline-block rounded-xs bg-red-600 px-1.5 py-0.5 text-[10px] font-extrabold text-white mr-2">NEW</span>
            <span className="text-slate-800 font-medium">
              National Academic Pathways for JEE Main, NEET-UG, IPMAT, CUET-UG & CLAT synchronized with official regulatory portals.
            </span>
          </div>
          <Link href="/careers" className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-[#0B2A4A] hover:underline">
            <span>View All Pathways</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>

      {/* 1. HERO SECTION - Dignified Institutional Canvas */}
      <section className="relative overflow-hidden bg-white border-b border-slate-200 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 text-center">
          {/* Welcome Badge - Structured, not pill */}
          <div className="inline-flex items-center gap-2 rounded-lg border border-amber-300 bg-[#FFF8EE] px-4 py-1.5 text-xs font-bold text-[#D96B00] mb-6 shadow-2xs">
            <Sparkles className="h-4 w-4 text-[#D96B00]" />
            <span>National Educational Architecture • Class 10 & 12 Academic Guidance</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-950 max-w-4xl mx-auto leading-tight sm:leading-tight">
            Find the <span className="text-[#0B2A4A] underline decoration-[#FF9933] decoration-4 underline-offset-6">Right Stream & Career</span> Without Coaching Hype.
          </h1>

          <p className="mt-5 text-base sm:text-lg font-medium text-slate-700 max-w-2xl mx-auto leading-relaxed">
            Eliminate guesswork and commercial bias. Discover whether PCM, PCB, Commerce, or Arts matches your genuine academic stamina, and explore high-trajectory degrees, national entrance exams, and 10-year industry outlooks.
          </p>

          {/* TWO PRIMARY CHOICE CARDS (CLASS 10 VS CLASS 12) - Dignified Institutional Cards with Accent Bars */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto text-left">
            {/* Class 10 Card */}
            <div className="flex flex-col justify-between rounded-2xl border-2 border-slate-300 border-t-4 border-t-[#FF9933] bg-[#EAEFF5] p-7 sm:p-8 shadow-xs hover:shadow-md hover:bg-white hover:border-amber-400 transition-all group">
              <div>
                <div className="flex items-center justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-[#D96B00] font-black text-base border border-amber-200 shadow-2xs">
                    10
                  </span>
                  <span className="rounded-lg bg-white border border-amber-200 px-3 py-1 text-xs font-bold text-[#D96B00] shadow-2xs">
                    12-Minute Diagnostic
                  </span>
                </div>

                <h3 className="mt-5 text-xl sm:text-2xl font-black text-slate-950">
                  Class 10: Stream Discovery
                </h3>
                <p className="mt-2 text-sm text-slate-700 leading-relaxed font-medium">
                  Find whether PCM, PCB, PCMB, Commerce, or Arts matches your quantitative comfort, memory retention, and personal interests.
                </p>

                <ul className="mt-5 flex flex-col gap-2 text-xs sm:text-sm text-slate-800 font-medium">
                  <li className="flex items-center gap-2 rounded-xl bg-white p-2.5 border border-slate-200 shadow-2xs">
                    <CheckCircle2 className="h-4 w-4 text-emerald-700 shrink-0" />
                    <span>Calculus &amp; science stamina friction assessment</span>
                  </li>
                  <li className="flex items-center gap-2 rounded-xl bg-white p-2.5 border border-slate-200 shadow-2xs">
                    <CheckCircle2 className="h-4 w-4 text-emerald-700 shrink-0" />
                    <span>Realistic match scores across all 5 streams</span>
                  </li>
                  <li className="flex items-center gap-2 rounded-xl bg-white p-2.5 border border-slate-200 shadow-2xs">
                    <CheckCircle2 className="h-4 w-4 text-emerald-700 shrink-0" />
                    <span>No coaching bias or parental pressure</span>
                  </li>
                </ul>
              </div>

              <Link
                href="/quiz/post-10th"
                className="mt-8 flex items-center justify-center gap-2 rounded-xl bg-[#0B2A4A] px-6 py-3.5 text-sm font-bold text-white hover:bg-[#071C33] border border-[#071C33] shadow-xs transition-all group-hover:gap-3"
              >
                <span>Start Class 10 Stream Quiz</span>
                <ArrowRight className="h-4 w-4 text-amber-400" />
              </Link>
            </div>

            {/* Class 12 Card */}
            <div className="flex flex-col justify-between rounded-2xl border-2 border-slate-300 border-t-4 border-t-[#0B2A4A] bg-[#EAEFF5] p-7 sm:p-8 shadow-xs hover:shadow-md hover:bg-white hover:border-[#0B2A4A] transition-all group">
              <div>
                <div className="flex items-center justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-[#0B2A4A] font-black text-base border border-blue-200 shadow-2xs">
                    12
                  </span>
                  <span className="rounded-lg bg-white border border-slate-300 px-3 py-1 text-xs font-bold text-[#0B2A4A] shadow-2xs">
                    Degrees &amp; Exams Matrix
                  </span>
                </div>

                <h3 className="mt-5 text-xl sm:text-2xl font-black text-slate-950">
                  Class 12: Degree &amp; Career Matrix
                </h3>
                <p className="mt-2 text-sm text-slate-700 leading-relaxed font-medium">
                  Explore degrees beyond just B.Tech &amp; MBBS. Discover IIM 5-Year IPM, Law at NLUs, Design at IITs, and Biotech research at IISERs.
                </p>

                <ul className="mt-5 flex flex-col gap-2 text-xs sm:text-sm text-slate-800 font-medium">
                  <li className="flex items-center gap-2 rounded-xl bg-white p-2.5 border border-slate-200 shadow-2xs">
                    <CheckCircle2 className="h-4 w-4 text-[#D96B00] shrink-0" />
                    <span>Non-linear options for PCM &amp; PCB students</span>
                  </li>
                  <li className="flex items-center gap-2 rounded-xl bg-white p-2.5 border border-slate-200 shadow-2xs">
                    <CheckCircle2 className="h-4 w-4 text-[#D96B00] shrink-0" />
                    <span>Official entrance exams: JEE, NEET, IPMAT, CLAT, UCEED</span>
                  </li>
                  <li className="flex items-center gap-2 rounded-xl bg-white p-2.5 border border-slate-200 shadow-2xs">
                    <CheckCircle2 className="h-4 w-4 text-[#D96B00] shrink-0" />
                    <span>10-Year industry automation risk metrics</span>
                  </li>
                </ul>
              </div>

              <Link
                href="/quiz/post-12th"
                className="mt-8 flex items-center justify-center gap-2 rounded-xl bg-[#D96B00] px-6 py-3.5 text-sm font-bold text-white hover:bg-[#B25800] border border-[#B25800] shadow-xs transition-all group-hover:gap-3"
              >
                <span>Start Class 12 Career Quiz</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Trust strip */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm font-bold text-slate-800 border-t border-slate-200 pt-6">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-700" />
              <span>100% Free Public Diagnostics</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-700" />
              <span>NIRF &amp; Statutory Regulatory Data</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-700" />
              <span>Independent Verified Mentors</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. HOW IT WORKS - 3 Clear Steps for Students */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="rounded-md bg-[#FFF8EE] px-3.5 py-1 text-xs font-bold text-[#D96B00] border border-amber-200">
            Simple 3-Step Process
          </span>
          <h2 className="mt-3 text-2xl sm:text-4xl font-black text-slate-950 tracking-tight">
            How CAREER-GUD Guides Your Journey
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-700 font-medium leading-relaxed">
            Designed specifically for Indian academic realities to help you make confident decisions with peace of mind.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="flex flex-col rounded-2xl border-2 border-slate-300 bg-[#EAEFF5] p-7 shadow-xs hover:bg-white hover:border-[#0B2A4A] transition">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0B2A4A] text-white font-black text-lg shadow-sm border border-[#071C33]">
              1
            </div>
            <h3 className="mt-5 text-lg font-bold text-slate-950">
              Discover Genuine Aptitude
            </h3>
            <p className="mt-2 text-sm text-slate-700 leading-relaxed font-medium">
              Take our 12-minute diagnostic evaluating your actual comfort with mathematics, biology, abstract reasoning, and syllabus volume.
            </p>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col rounded-2xl border-2 border-slate-300 bg-[#EAEFF5] p-7 shadow-xs hover:bg-white hover:border-[#D96B00] transition">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#D96B00] text-white font-black text-lg shadow-sm border border-[#B25800]">
              2
            </div>
            <h3 className="mt-5 text-lg font-bold text-slate-950">
              Explore Realistic Roadmaps
            </h3>
            <p className="mt-2 text-sm text-slate-700 leading-relaxed font-medium">
              View clear degree tracks and national entrance exams (JEE, NEET, IPMAT, CLAT, UCEED) with direct links to official portals.
            </p>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col rounded-2xl border-2 border-slate-300 bg-[#EAEFF5] p-7 shadow-xs hover:bg-white hover:border-emerald-600 transition">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#138808] text-white font-black text-lg shadow-sm border border-[#0D6105]">
              3
            </div>
            <h3 className="mt-5 text-lg font-bold text-slate-950">
              Connect with Verified Mentors
            </h3>
            <p className="mt-2 text-sm text-slate-700 leading-relaxed font-medium">
              Book 1-on-1 counseling with domain-certified mentors in Engineering, Medicine, Law, or Finance who give unbiased advice.
            </p>
          </div>
        </div>
      </section>

      {/* 3. INTERACTIVE PATHWAY ROADMAP (SPACIOUS SECTION) */}
      <section className="bg-white border-y border-slate-200 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <CareerPathwayTree />
        </div>
      </section>

      {/* 4. REALITY CHECK: THE STATISTICAL LANDSCAPE IN INDIA */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="rounded-3xl border-2 border-slate-300 border-l-6 border-l-[#FF9933] bg-[#EAEFF5] p-8 sm:p-12 shadow-xs">
          <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-12">
            <div className="lg:w-1/2 flex flex-col gap-4">
              <div className="inline-flex items-center gap-2 rounded-md bg-white px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#D96B00] border border-amber-200 self-start shadow-2xs">
                <Scale className="h-4 w-4 text-[#D96B00]" />
                <span>Operating Principle</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight">
                Be Realistic, Not Idealistic.
              </h2>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-medium">
                In India, over 14 lakh students sit for JEE and 23 lakh for NEET each year. Rushing blindly into multi-year coaching without assessing genuine aptitude leads to wasted drop years and heavy stress.
              </p>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-medium">
                CAREER-GUD gives you honest, statutory figures so you can prepare effectively while securing high-trajectory alternative paths where your genuine strengths shine.
              </p>
            </div>

            <div className="lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
                <span className="text-2xl font-black text-[#0B2A4A]">1.2%</span>
                <h4 className="mt-1 text-sm font-bold text-slate-950">JEE Advanced Ratio</h4>
                <p className="mt-1.5 text-xs text-slate-700 leading-relaxed font-medium">
                  ~17,385 IIT seats for 14.2 lakh candidates. We detail top NITs, IIITs, BITS, and specialized Tech paths.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
                <span className="text-2xl font-black text-[#138808]">2.4%</span>
                <h4 className="mt-1 text-sm font-bold text-slate-950">Govt Medical MBBS</h4>
                <p className="mt-1.5 text-xs text-slate-700 leading-relaxed font-medium">
                  55,000 state seats for 23 lakh applicants. We detail Biotechnology, Clinical Trials &amp; Healthcare Ops.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
                <span className="text-2xl font-black text-[#D96B00]">5-Yr IPM</span>
                <h4 className="mt-1 text-sm font-bold text-slate-950">IIMs via IPMAT</h4>
                <p className="mt-1.5 text-xs text-slate-700 leading-relaxed font-medium">
                  Direct entry into IIM Indore &amp; Rohtak immediately after Class 12 without needing CAT or B.Tech first.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
                <span className="text-2xl font-black text-[#002D62]">NLUs</span>
                <h4 className="mt-1 text-sm font-bold text-slate-950">Corporate Law (CLAT)</h4>
                <p className="mt-1.5 text-xs text-slate-700 leading-relaxed font-medium">
                  Science &amp; Commerce students excel in Corporate Law, IP, and Cyber Law with starting salaries ₹16-25 LPA.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FEATURED CAREERS WITH AUTOMATION RISK */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-slate-200">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#D96B00]">
              Future-Ready Industry Trajectories
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-950 mt-1">
              Explore Popular Careers in India
            </h2>
          </div>
          <Link
            href="/careers"
            className="mt-3 sm:mt-0 inline-flex items-center gap-1.5 text-sm font-bold text-[#0B2A4A] hover:text-[#071C33]"
          >
            <span>View All 30+ Careers</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredCareers.map((career) => (
            <div
              key={career.id}
              className="flex flex-col justify-between rounded-2xl border-2 border-slate-300 bg-[#EAEFF5] p-7 shadow-xs hover:shadow-md hover:bg-white hover:border-[#0B2A4A] transition-all group"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="rounded-lg bg-white px-2.5 py-1 text-xs font-bold text-[#D96B00] border border-amber-200 shadow-2xs">
                    {career.streamLabel.split(' ')[0]}
                  </span>
                  <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                    <TrendingUp className="h-3.5 w-3.5" />
                    {career.outlook.demandTrend}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-950 mt-4 group-hover:text-[#0B2A4A] transition-colors">
                  {career.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 mt-2 line-clamp-3 leading-relaxed font-medium">
                  {career.description}
                </p>

                {/* Automation Meter */}
                <div className="mt-5">
                  <AutomationMeter
                    score={career.outlook.automationRiskScore}
                    label={career.outlook.automationRiskLabel}
                  />
                </div>

                {/* Salary box */}
                <div className="mt-4 rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                    Verified Industry Compensation
                  </span>
                  <div className="flex items-baseline justify-between mt-1 text-xs sm:text-sm">
                    <span className="text-slate-700">Entry: <strong className="text-slate-950 font-bold">{career.outlook.avgSalaryRangeINR.entry}</strong></span>
                    <span className="text-[#0B2A4A] font-bold">Mid: {career.outlook.avgSalaryRangeINR.mid}</span>
                  </div>
                </div>
              </div>

              <Link
                href={`/careers/${career.slug}`}
                className="mt-6 flex items-center justify-center gap-2 rounded-xl border-2 border-slate-300 bg-white py-2.5 text-xs sm:text-sm font-bold text-[#0B2A4A] group-hover:border-[#0B2A4A] group-hover:bg-[#0B2A4A] group-hover:text-white transition shadow-2xs cursor-pointer"
              >
                <span>View Full Roadmap</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* 6. NIRF TOP COLLEGES DIRECTORY */}
      <section className="bg-white border-t border-slate-200 py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-slate-200">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#D96B00]">
                Statutory NIRF Verified Data
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-950 mt-1">
                Premier Higher Educational Institutions
              </h2>
            </div>
            <Link
              href="/colleges"
              className="mt-3 sm:mt-0 inline-flex items-center gap-1.5 text-sm font-bold text-[#0B2A4A] hover:text-[#071C33]"
            >
              <span>Explore All Colleges</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredColleges.map((college) => (
              <div
                key={college.id}
                className="flex flex-col justify-between rounded-2xl border-2 border-slate-200 bg-white p-7 shadow-xs hover:shadow-md hover:border-slate-400 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="rounded-md bg-[#0B2A4A] px-2.5 py-1 text-xs font-black text-white border border-[#071C33]">
                      NIRF #{college.nirfRank}
                    </span>
                    <span className="text-xs font-bold text-slate-600">{college.city}, {college.state}</span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-950 mt-4">
                    {college.name}
                  </h3>

                  <div className="mt-4 flex flex-col gap-2 text-xs sm:text-sm font-medium text-slate-700 border-t border-slate-200 pt-3">
                    <div className="flex justify-between py-0.5">
                      <span>Average CTC:</span>
                      <strong className="text-slate-950 font-bold">{college.placementStats.avgPackageINR}</strong>
                    </div>
                    <div className="flex justify-between py-0.5">
                      <span>Highest CTC:</span>
                      <strong className="text-emerald-700 font-bold">{college.placementStats.highestPackageINR}</strong>
                    </div>
                    <div className="flex justify-between py-0.5">
                      <span>Placement Rate:</span>
                      <strong className="text-slate-950 font-bold">{college.placementStats.placementPercentage}%</strong>
                    </div>
                  </div>
                </div>

                <Link
                  href={`/colleges/${college.slug}`}
                  className="mt-6 flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white py-2.5 text-xs sm:text-sm font-bold text-slate-800 hover:bg-slate-100 hover:text-slate-950 transition"
                >
                  <span>Seat Matrix & Cutoffs</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. VERIFIED MENTORS & CALL TO ACTION */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="rounded-2xl border-2 border-slate-300 bg-white p-8 sm:p-12 text-slate-900 shadow-sm">
          <div className="flex flex-col lg:flex-row items-start justify-between gap-8">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 rounded-md border border-emerald-300 bg-emerald-50 px-3.5 py-1 text-xs font-bold text-emerald-800 mb-3">
                <ShieldCheck className="h-4 w-4 text-emerald-700" />
                <span>Verified Domain Mentorship</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight">
                Get Advice from Real Professionals.
              </h2>
              <p className="mt-3 text-sm sm:text-base text-slate-700 font-medium leading-relaxed">
                Connect with mentors who only advise in the fields they studied and practiced. Medical specialists advise on medical options, and engineering alumni advise on technical branches.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <Link
                href="/consultants"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#D96B00] px-6 py-3.5 text-sm font-bold text-white hover:bg-[#B25800] border border-[#B25800] shadow-sm transition"
              >
                <span>Browse Verified Mentors</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/quiz/post-10th"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-slate-100 px-6 py-3.5 text-sm font-bold text-slate-800 hover:bg-slate-200 transition"
              >
                <span>Take Assessment First</span>
              </Link>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-5">
            {featuredConsultants.map((consultant) => (
              <div
                key={consultant.id}
                className="flex flex-col justify-between rounded-2xl border-2 border-slate-300 bg-[#EAEFF5] p-6 shadow-xs hover:bg-white hover:border-[#0B2A4A] transition-all"
              >
                <div>
                  <h4 className="font-bold text-slate-950 text-base">{consultant.name}</h4>
                  <p className="text-xs text-slate-700 font-medium line-clamp-1 mt-1">{consultant.headline}</p>
                  <p className="text-xs text-slate-500 font-semibold mt-1">{consultant.almaMater}</p>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {consultant.domainVerifications
                      .filter((v) => v.status === 'VERIFIED')
                      .map((v, i) => (
                        <span
                          key={i}
                          className="rounded-md bg-emerald-50 border border-emerald-300 px-2.5 py-0.5 text-xs font-bold text-emerald-800"
                        >
                          Verified {v.domain}
                        </span>
                      ))}
                  </div>
                </div>

                <Link
                  href={`/consultants/${consultant.id}`}
                  className="mt-6 text-xs font-bold text-[#D96B00] hover:text-[#B25800] inline-flex items-center gap-1.5"
                >
                  <span>View Verified Profile & Book</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
