import { HeartHandshake, PhoneCall, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-900 text-slate-400 dark:border-slate-800">
      {/* Student Welfare Alert Banner */}
      <div className="border-b border-slate-800 bg-slate-950/60 py-3 px-4">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <HeartHandshake className="h-4 w-4 text-rose-400" />
            <span>
              <strong>Student Wellbeing Priority:</strong> Exams and ranks do not define your life value.
            </span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span className="flex items-center gap-1.5">
              <PhoneCall className="h-3.5 w-3.5 text-teal-400" />
              Tele-MANAS 24/7 Helpline: <strong className="text-white">14416</strong> / <strong className="text-white">1800-891-4416</strong>
            </span>
            <span className="hidden sm:inline text-slate-600">|</span>
            <span className="hidden sm:inline">AASRA: +91-9820466726</span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand Col */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black tracking-tight text-white">
                CARRER<span className="text-indigo-400">-GUD</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              India&apos;s realistic, AI-powered career counseling platform. We empower Class 10 and 12 students to make evidence-based academic choices free from peer pressure and coaching marketing hype.
            </p>
            <div className="flex items-center gap-2 text-xs text-indigo-300">
              <ShieldCheck className="h-4 w-4" />
              <span>Core Principle: Realistic, Not Idealistic.</span>
            </div>
          </div>

          {/* Academic Decisions */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Academic Decision Gates
            </h4>
            <ul className="flex flex-col gap-2 text-sm">
              <li>
                <Link href="/quiz/post-10th" className="hover:text-white transition">
                  Class 10 Stream Discovery (PCM, PCB, Commerce, Arts)
                </Link>
              </li>
              <li>
                <Link href="/quiz/post-12th" className="hover:text-white transition">
                  Class 12 Degree & Exam Matching (B.Tech, MBBS, CA, Law)
                </Link>
              </li>
              <li>
                <Link href="/careers" className="hover:text-white transition">
                  30+ Indian Careers & Automation Outlook
                </Link>
              </li>
              <li>
                <Link href="/colleges" className="hover:text-white transition">
                  NIRF Top Indian Colleges & Placements
                </Link>
              </li>
            </ul>
          </div>

          {/* Human Guidance */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Mentorship & Community
            </h4>
            <ul className="flex flex-col gap-2 text-sm">
              <li>
                <Link href="/consultants" className="hover:text-white transition">
                  Verified Human Consultants
                </Link>
              </li>
              <li>
                <Link href="/consultants/apply" className="hover:text-white transition">
                  Apply as Domain Consultant
                </Link>
              </li>
              <li>
                <Link href="/chat" className="hover:text-white transition">
                  AI Academic Counselor (24/7 Grounded)
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-white transition">
                  Student Assessment Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Indian Entrance Matrix */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Key Indian Examinations
            </h4>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="rounded-md bg-slate-800 px-2.5 py-1 text-slate-300 border border-slate-700">JEE Main / Adv</span>
              <span className="rounded-md bg-slate-800 px-2.5 py-1 text-slate-300 border border-slate-700">NEET-UG</span>
              <span className="rounded-md bg-slate-800 px-2.5 py-1 text-slate-300 border border-slate-700">CUET-UG</span>
              <span className="rounded-md bg-slate-800 px-2.5 py-1 text-slate-300 border border-slate-700">CLAT (Law)</span>
              <span className="rounded-md bg-slate-800 px-2.5 py-1 text-slate-300 border border-slate-700">CA Foundation</span>
              <span className="rounded-md bg-slate-800 px-2.5 py-1 text-slate-300 border border-slate-700">NATA (Architecture)</span>
              <span className="rounded-md bg-slate-800 px-2.5 py-1 text-slate-300 border border-slate-700">UCEED / NID</span>
              <span className="rounded-md bg-slate-800 px-2.5 py-1 text-slate-300 border border-slate-700">NDA (Armed Forces)</span>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} CARRER-GUD. Grounded Academic Intelligence for Indian Students.</p>
          <p className="mt-2 sm:mt-0">Educational guidance only; not medical or legal advice.</p>
        </div>
      </div>
    </footer>
  );
}
