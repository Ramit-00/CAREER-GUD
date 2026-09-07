'use client';

import {
  BookOpen,
  Briefcase,
  ChevronDown,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  UserCheck,
  X,
} from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [quizDropdownOpen, setQuizDropdownOpen] = useState(false);

  const role = (session?.user as unknown as { role?: string })?.role;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:border-slate-800 dark:bg-slate-950/90">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-teal-500 text-white shadow-md shadow-indigo-500/20 transition-transform group-hover:scale-105">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
              CARRER<span className="text-indigo-600 dark:text-indigo-400">-GUD</span>
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              AI Career Compass • India
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-slate-700 dark:text-slate-200">
          {/* Quizzes Dropdown */}
          <div className="relative">
            <button
              onClick={() => setQuizDropdownOpen(!quizDropdownOpen)}
              onBlur={() => setTimeout(() => setQuizDropdownOpen(false), 200)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition ${
                pathname.startsWith('/quiz') ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : ''
              }`}
            >
              <Sparkles className="h-4 w-4 text-indigo-500" />
              <span>Career Quizzes</span>
              <ChevronDown className="h-3.5 w-3.5 opacity-60" />
            </button>

            {quizDropdownOpen && (
              <div className="absolute left-0 mt-2 w-72 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl dark:border-slate-800 dark:bg-slate-900 animate-in fade-in zoom-in-95">
                <Link
                  href="/quiz/post-10th"
                  className="flex flex-col gap-0.5 rounded-xl p-3 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition"
                  onClick={() => setQuizDropdownOpen(false)}
                >
                  <div className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300">
                      10
                    </span>
                    Class 10: Stream Finder
                  </div>
                  <span className="text-xs text-slate-500 pl-8">
                    Discover PCM, PCB, Commerce or Arts based on your real aptitude
                  </span>
                </Link>

                <Link
                  href="/quiz/post-12th"
                  className="flex flex-col gap-0.5 rounded-xl p-3 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition"
                  onClick={() => setQuizDropdownOpen(false)}
                >
                  <div className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-teal-100 text-xs font-bold text-teal-700 dark:bg-teal-900 dark:text-teal-300">
                      12
                    </span>
                    Class 12: Degree & Career Match
                  </div>
                  <span className="text-xs text-slate-500 pl-8">
                    Map your +2 stream & exams to B.Tech, MBBS, CA, Law, or Design
                  </span>
                </Link>
              </div>
            )}
          </div>

          <Link
            href="/careers"
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition ${
              pathname.startsWith('/careers') ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : ''
            }`}
          >
            <Briefcase className="h-4 w-4 opacity-70" />
            <span>Careers Outlook</span>
          </Link>

          <Link
            href="/colleges"
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition ${
              pathname.startsWith('/colleges') ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : ''
            }`}
          >
            <BookOpen className="h-4 w-4 opacity-70" />
            <span>Colleges Directory</span>
          </Link>

          <Link
            href="/consultants"
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition ${
              pathname.startsWith('/consultants') ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : ''
            }`}
          >
            <UserCheck className="h-4 w-4 opacity-70" />
            <span>Find Consultants</span>
          </Link>

          <Link
            href="/chat"
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition ${
              pathname === '/chat' ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : ''
            }`}
          >
            <MessageSquare className="h-4 w-4 text-teal-500" />
            <span>AI Counselor</span>
          </Link>
        </nav>

        {/* Action Buttons / User Menu */}
        <div className="hidden md:flex items-center gap-3">
          {session ? (
            <div className="flex items-center gap-2">
              {role === 'ADMIN' && (
                <Link
                  href="/admin/verify-consultants"
                  className="flex items-center gap-1.5 rounded-lg border border-purple-200 bg-purple-50 px-2.5 py-1.5 text-xs font-semibold text-purple-700 hover:bg-purple-100 transition dark:border-purple-900 dark:bg-purple-950/40 dark:text-purple-300"
                >
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>Admin Hub</span>
                </Link>
              )}

              {role === 'CONSULTANT' && (
                <Link
                  href="/consultant/dashboard"
                  className="flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 transition dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300"
                >
                  <Briefcase className="h-3.5 w-3.5" />
                  <span>Consultant Portal</span>
                </Link>
              )}

              <Link
                href="/dashboard"
                className="flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-800 hover:bg-slate-200 transition dark:bg-slate-800 dark:text-slate-100"
              >
                <LayoutDashboard className="h-3.5 w-3.5" />
                <span>Dashboard</span>
              </Link>

              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                title="Sign out"
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-red-600 transition dark:hover:bg-slate-800"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="px-3.5 py-2 text-sm font-semibold text-slate-700 hover:text-indigo-600 transition dark:text-slate-300"
              >
                Sign In
              </Link>
              <Link
                href="/quiz/post-10th"
                className="rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-indigo-600/30 hover:from-indigo-500 hover:to-indigo-600 transition"
              >
                Start Free Quiz
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="border-b border-slate-200 bg-white px-4 pt-2 pb-6 md:hidden dark:border-slate-800 dark:bg-slate-950">
          <div className="flex flex-col gap-2 pt-2">
            <Link
              href="/quiz/post-10th"
              className="flex items-center gap-2 rounded-lg p-2 text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Sparkles className="h-4 w-4 text-indigo-500" />
              Class 10 Stream Finder
            </Link>
            <Link
              href="/quiz/post-12th"
              className="flex items-center gap-2 rounded-lg p-2 text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800"
              onClick={() => setMobileMenuOpen(false)}
            >
              <GraduationCap className="h-4 w-4 text-teal-500" />
              Class 12 Degree & Career Quiz
            </Link>
            <Link
              href="/careers"
              className="flex items-center gap-2 rounded-lg p-2 text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Briefcase className="h-4 w-4 opacity-70" />
              Careers Directory
            </Link>
            <Link
              href="/colleges"
              className="flex items-center gap-2 rounded-lg p-2 text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800"
              onClick={() => setMobileMenuOpen(false)}
            >
              <BookOpen className="h-4 w-4 opacity-70" />
              Colleges Directory
            </Link>
            <Link
              href="/consultants"
              className="flex items-center gap-2 rounded-lg p-2 text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800"
              onClick={() => setMobileMenuOpen(false)}
            >
              <UserCheck className="h-4 w-4 opacity-70" />
              Find Consultants
            </Link>
            <Link
              href="/chat"
              className="flex items-center gap-2 rounded-lg p-2 text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800"
              onClick={() => setMobileMenuOpen(false)}
            >
              <MessageSquare className="h-4 w-4 text-teal-500" />
              AI Counselor
            </Link>

            <div className="mt-4 border-t border-slate-100 pt-4 dark:border-slate-800">
              {session ? (
                <div className="flex flex-col gap-2">
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-2 rounded-lg bg-slate-100 p-2 text-sm font-medium dark:bg-slate-800"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard ({session.user?.name})
                  </Link>
                  <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="flex items-center gap-2 rounded-lg p-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link
                    href="/login"
                    className="block w-full text-center rounded-xl border border-slate-300 py-2 text-sm font-semibold hover:bg-slate-50 dark:border-slate-700"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/quiz/post-10th"
                    className="block w-full text-center rounded-xl bg-indigo-600 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Start Free Quiz
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
