import { CheckCircle2, HeartHandshake, PhoneCall, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t-3 border-amber-500/90 bg-[#071C33] text-slate-300">
      {/* 1. Student Welfare Alert Banner */}
      <div className="border-b border-slate-800/90 bg-[#030F1C] py-3.5 px-4">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 text-xs font-medium">
          <div className="flex items-center gap-2 text-white">
            <HeartHandshake className="h-4 w-4 text-amber-400" />
            <span>
              <strong className="font-bold text-amber-300">Student Wellbeing Priority:</strong> Exams and ranks do not define your life value.
            </span>
          </div>
          <div className="flex items-center gap-4 text-slate-300">
            <span className="flex items-center gap-1.5">
              <PhoneCall className="h-3.5 w-3.5 text-emerald-400" />
              Tele-MANAS 24/7 Helpline: <strong className="text-white font-bold">14416</strong> / <strong className="text-white font-bold">1800-891-4416</strong>
            </span>
            <span className="hidden sm:inline text-slate-600">|</span>
            <span className="hidden sm:inline font-semibold">AASRA: +91-9820466726</span>
          </div>
        </div>
      </div>

      {/* 2. Main Directory Columns */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand Col */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black tracking-tight text-white">
                CAREER<span className="text-[#FF9933]">-GUD</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
              India&apos;s realistic, evidence-based academic and career guidance platform. Designed conforming to national educational standards to help students choose streams and degrees free from coaching hype.
            </p>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
              <ShieldCheck className="h-4 w-4 text-amber-400" />
              <span>Core Principle: Realistic, Not Idealistic.</span>
            </div>
          </div>

          {/* Academic Decisions */}
          <div>
            <h4 className="text-sm font-bold text-white tracking-wider uppercase mb-4 border-b border-slate-700 pb-2">
              Academic Decision Gates
            </h4>
            <ul className="flex flex-col gap-2.5 text-xs sm:text-sm font-medium text-slate-300">
              <li>
                <Link href="/quiz/post-10th" className="hover:text-amber-400 hover:underline transition">
                  Class 10 Stream Discovery (PCM, PCB, Commerce, Arts)
                </Link>
              </li>
              <li>
                <Link href="/quiz/post-12th" className="hover:text-amber-400 hover:underline transition">
                  Class 12 Degree & Exam Matching (B.Tech, MBBS, CA, Law)
                </Link>
              </li>
              <li>
                <Link href="/careers" className="hover:text-amber-400 hover:underline transition">
                  30+ Indian Careers & Automation Outlook
                </Link>
              </li>
              <li>
                <Link href="/colleges" className="hover:text-amber-400 hover:underline transition">
                  NIRF Top Indian Colleges & Placements
                </Link>
              </li>
            </ul>
          </div>

          {/* Human Guidance */}
          <div>
            <h4 className="text-sm font-bold text-white tracking-wider uppercase mb-4 border-b border-slate-700 pb-2">
              Mentorship & Counseling
            </h4>
            <ul className="flex flex-col gap-2.5 text-xs sm:text-sm font-medium text-slate-300">
              <li>
                <Link href="/consultants" className="hover:text-amber-400 hover:underline transition">
                  Verified Domain Mentors
                </Link>
              </li>
              <li>
                <Link href="/consultants/apply" className="hover:text-amber-400 hover:underline transition">
                  Apply as Domain Consultant
                </Link>
              </li>
              <li>
                <Link href="/chat" className="hover:text-amber-400 hover:underline transition">
                  AI Academic Counselor (24/7 Grounded)
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-amber-400 hover:underline transition">
                  Student Assessment Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Key Indian Examinations */}
          <div>
            <h4 className="text-sm font-bold text-white tracking-wider uppercase mb-4 border-b border-slate-700 pb-2">
              Statutory Indian Entrance Matrix
            </h4>
            <div className="flex flex-wrap gap-2 text-xs font-semibold">
              <span className="rounded-md bg-[#0B2A4A] px-2.5 py-1 text-slate-100 border border-slate-600">JEE Main / Adv</span>
              <span className="rounded-md bg-[#0B2A4A] px-2.5 py-1 text-slate-100 border border-slate-600">NEET-UG</span>
              <span className="rounded-md bg-[#0B2A4A] px-2.5 py-1 text-slate-100 border border-slate-600">CUET-UG</span>
              <span className="rounded-md bg-[#0B2A4A] px-2.5 py-1 text-slate-100 border border-slate-600">CLAT (Law)</span>
              <span className="rounded-md bg-[#0B2A4A] px-2.5 py-1 text-slate-100 border border-slate-600">CA Foundation</span>
              <span className="rounded-md bg-[#0B2A4A] px-2.5 py-1 text-slate-100 border border-slate-600">IPMAT (IIMs)</span>
              <span className="rounded-md bg-[#0B2A4A] px-2.5 py-1 text-slate-100 border border-slate-600">UCEED / NID</span>
              <span className="rounded-md bg-[#0B2A4A] px-2.5 py-1 text-slate-100 border border-slate-600">IISER IAT</span>
            </div>
          </div>
        </div>

        {/* 3. GIGW & Policy Links Strip */}
        <div className="mt-10 border-t border-slate-800 pt-6">
          <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-slate-400 font-medium">
            <li><Link href="/" className="hover:text-amber-400">Website Policies</Link></li>
            <li><span className="text-slate-700">•</span></li>
            <li><Link href="/" className="hover:text-amber-400">Terms of Use</Link></li>
            <li><span className="text-slate-700">•</span></li>
            <li><Link href="/" className="hover:text-amber-400">Disclaimer & Fair-Use</Link></li>
            <li><span className="text-slate-700">•</span></li>
            <li><Link href="/" className="hover:text-amber-400">Privacy Policy</Link></li>
            <li><span className="text-slate-700">•</span></li>
            <li><Link href="/" className="hover:text-amber-400">Accessibility Statement (GIGW 3.0)</Link></li>
            <li><span className="text-slate-700">•</span></li>
            <li><Link href="/" className="hover:text-amber-400">NIRF Verified Sources</Link></li>
          </ul>
        </div>

        {/* 4. Bottom Legal & Timestamp Bar */}
        <div className="mt-6 border-t border-slate-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 font-medium">
          <p>© {new Date().getFullYear()} CAREER-GUD. National Guidance Architecture for Secondary & Higher Secondary Education.</p>
          <div className="mt-2 sm:mt-0 flex items-center gap-3">
            <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>GIGW & WCAG 2.0 AA Aligned</span>
            </span>
            <span className="text-slate-700">|</span>
            <span>Last Updated: 09 Sep 2026</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
