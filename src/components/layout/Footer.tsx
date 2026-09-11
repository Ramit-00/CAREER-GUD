import { CheckCircle2, HeartHandshake, PhoneCall, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t-2 border-slate-300 bg-slate-100 text-slate-800">
      {/* 1. Student Welfare Alert Banner */}
      <div className="border-b border-amber-200 bg-amber-50 py-3.5 px-4">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 text-xs font-semibold">
          <div className="flex items-center gap-2 text-slate-900">
            <HeartHandshake className="h-4 w-4 text-[#D96B00]" />
            <span>
              <strong className="font-bold text-[#D96B00]">Student Wellbeing Priority:</strong> Exams and ranks do not define your life value.
            </span>
          </div>
          <div className="flex items-center gap-4 text-slate-800">
            <span className="flex items-center gap-1.5">
              <PhoneCall className="h-3.5 w-3.5 text-emerald-700" />
              Tele-MANAS 24/7 Helpline: <strong className="text-slate-950 font-black">14416</strong> / <strong className="text-slate-950 font-black">1800-891-4416</strong>
            </span>
            <span className="hidden sm:inline text-slate-400">|</span>
            <span className="hidden sm:inline font-bold">AASRA: +91-9820466726</span>
          </div>
        </div>
      </div>

      {/* 2. Main Directory Columns */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand Col */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black tracking-tight text-slate-950">
                CAREER<span className="text-[#D96B00]">-GUD</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
              India&apos;s realistic, evidence-based academic and career guidance platform. Designed conforming to national educational standards to help students choose streams and degrees free from coaching hype.
            </p>
            <div className="flex items-center gap-2 text-xs font-bold text-[#D96B00]">
              <ShieldCheck className="h-4 w-4 text-[#D96B00]" />
              <span>Core Principle: Realistic, Not Idealistic.</span>
            </div>
          </div>

          {/* Academic Decisions */}
          <div>
            <h4 className="text-sm font-bold text-slate-950 tracking-wider uppercase mb-4 border-b border-slate-300 pb-2">
              Academic Decision Gates
            </h4>
            <ul className="flex flex-col gap-2.5 text-xs sm:text-sm font-medium text-slate-700">
              <li>
                <Link href="/quiz/post-10th" className="hover:text-[#D96B00] hover:underline transition">
                  Class 10 Stream Discovery (PCM, PCB, Commerce, Arts)
                </Link>
              </li>
              <li>
                <Link href="/quiz/post-12th" className="hover:text-[#D96B00] hover:underline transition">
                  Class 12 Degree & Exam Matching (B.Tech, MBBS, CA, Law)
                </Link>
              </li>
              <li>
                <Link href="/careers" className="hover:text-[#D96B00] hover:underline transition">
                  30+ Indian Careers & Automation Outlook
                </Link>
              </li>
              <li>
                <Link href="/colleges" className="hover:text-[#D96B00] hover:underline transition">
                  NIRF Top Indian Colleges & Placements
                </Link>
              </li>
            </ul>
          </div>

          {/* Human Guidance */}
          <div>
            <h4 className="text-sm font-bold text-slate-950 tracking-wider uppercase mb-4 border-b border-slate-300 pb-2">
              Mentorship & Counseling
            </h4>
            <ul className="flex flex-col gap-2.5 text-xs sm:text-sm font-medium text-slate-700">
              <li>
                <Link href="/consultants" className="hover:text-[#D96B00] hover:underline transition">
                  Verified Domain Mentors
                </Link>
              </li>
              <li>
                <Link href="/consultants/apply" className="hover:text-[#D96B00] hover:underline transition">
                  Apply as Domain Consultant
                </Link>
              </li>
              <li>
                <Link href="/chat" className="hover:text-[#D96B00] hover:underline transition">
                  AI Academic Counselor (24/7 Grounded)
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-[#D96B00] hover:underline transition">
                  Student Assessment Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Key Indian Examinations */}
          <div>
            <h4 className="text-sm font-bold text-slate-950 tracking-wider uppercase mb-4 border-b border-slate-300 pb-2">
              Statutory Indian Entrance Matrix
            </h4>
            <div className="flex flex-wrap gap-2 text-xs font-semibold">
              <span className="rounded-md bg-white px-2.5 py-1 text-slate-900 border border-slate-300 shadow-2xs">JEE Main / Adv</span>
              <span className="rounded-md bg-white px-2.5 py-1 text-slate-900 border border-slate-300 shadow-2xs">NEET-UG</span>
              <span className="rounded-md bg-white px-2.5 py-1 text-slate-900 border border-slate-300 shadow-2xs">CUET-UG</span>
              <span className="rounded-md bg-white px-2.5 py-1 text-slate-900 border border-slate-300 shadow-2xs">CLAT (Law)</span>
              <span className="rounded-md bg-white px-2.5 py-1 text-slate-900 border border-slate-300 shadow-2xs">CA Foundation</span>
              <span className="rounded-md bg-white px-2.5 py-1 text-slate-900 border border-slate-300 shadow-2xs">IPMAT (IIMs)</span>
              <span className="rounded-md bg-white px-2.5 py-1 text-slate-900 border border-slate-300 shadow-2xs">UCEED / NID</span>
              <span className="rounded-md bg-white px-2.5 py-1 text-slate-900 border border-slate-300 shadow-2xs">IISER IAT</span>
            </div>
          </div>
        </div>

        {/* 3. GIGW & Policy Links Strip */}
        <div className="mt-10 border-t border-slate-300 pt-6">
          <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-slate-600 font-medium">
            <li><Link href="/" className="hover:text-[#D96B00]">Website Policies</Link></li>
            <li><span className="text-slate-400">•</span></li>
            <li><Link href="/" className="hover:text-[#D96B00]">Terms of Use</Link></li>
            <li><span className="text-slate-400">•</span></li>
            <li><Link href="/" className="hover:text-[#D96B00]">Disclaimer & Fair-Use</Link></li>
            <li><span className="text-slate-400">•</span></li>
            <li><Link href="/" className="hover:text-[#D96B00]">Privacy Policy</Link></li>
            <li><span className="text-slate-400">•</span></li>
            <li><Link href="/" className="hover:text-[#D96B00]">Accessibility Statement (GIGW 3.0)</Link></li>
            <li><span className="text-slate-400">•</span></li>
            <li><Link href="/" className="hover:text-[#D96B00]">NIRF Verified Sources</Link></li>
          </ul>
        </div>

        {/* 4. Bottom Legal & Timestamp Bar */}
        <div className="mt-6 border-t border-slate-300 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-600 font-medium">
          <p>© {new Date().getFullYear()} CAREER-GUD. National Guidance Architecture for Secondary & Higher Secondary Education.</p>
          <div className="mt-2 sm:mt-0 flex items-center gap-3">
            <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>GIGW & WCAG 2.0 AA Aligned</span>
            </span>
            <span className="text-slate-400">|</span>
            <span>Last Updated: 09 Sep 2026</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
