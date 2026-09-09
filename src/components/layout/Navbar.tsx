'use client';

import {
  BookOpen,
  Briefcase,
  ChevronDown,
  Compass,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  ShieldCheck,
  UserCheck,
  X,
} from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

export function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [quizDropdownOpen, setQuizDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const leaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const navigatingRef = useRef(false);
  const pointerStartRef = useRef<{ x: number; y: number } | null>(null);

  // Close dropdown and mobile menu whenever route changes
  useEffect(() => {
    setQuizDropdownOpen(false);
    setMobileMenuOpen(false);
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
      leaveTimeoutRef.current = null;
    }
  }, [pathname]);

  // Close dropdown when clicking or tapping outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        if (leaveTimeoutRef.current) {
          clearTimeout(leaveTimeoutRef.current);
          leaveTimeoutRef.current = null;
        }
        setQuizDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      if (leaveTimeoutRef.current) {
        clearTimeout(leaveTimeoutRef.current);
      }
    };
  }, []);

  const handleDropdownMouseEnter = () => {
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
      leaveTimeoutRef.current = null;
    }
    setQuizDropdownOpen(true);
  };

  const handleDropdownMouseLeave = () => {
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
    }
    leaveTimeoutRef.current = setTimeout(() => {
      setQuizDropdownOpen(false);
    }, 300);
  };

  const handleNavigate = (path: string, e?: React.SyntheticEvent | Event) => {
    if (e) {
      e.stopPropagation();
    }
    if (navigatingRef.current) return;
    navigatingRef.current = true;
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
      leaveTimeoutRef.current = null;
    }
    setQuizDropdownOpen(false);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    if (document.documentElement) document.documentElement.scrollTop = 0;
    if (document.body) document.body.scrollTop = 0;
    router.push(path);
    setTimeout(() => {
      navigatingRef.current = false;
    }, 600);
  };

  const handleItemPointerDown = (e: React.PointerEvent) => {
    pointerStartRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleItemPointerUp = (path: string, e: React.PointerEvent) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    if (pointerStartRef.current) {
      const dist = Math.hypot(
        e.clientX - pointerStartRef.current.x,
        e.clientY - pointerStartRef.current.y
      );
      pointerStartRef.current = null;
      // Under 20px jitter is a genuine tap or click on trackpad / mouse
      if (dist < 20) {
        handleNavigate(path, e);
      }
    } else {
      handleNavigate(path, e);
    }
  };
  const role = (session?.user as unknown as { role?: string })?.role;

  const isAdminHubActive = role === 'ADMIN' && pathname.startsWith('/admin/hub');
  const isConsultantPortalActive = role === 'CONSULTANT' && pathname.startsWith('/consultant/dashboard');
  const isDashboardActive =
    (role === 'ADMIN' && (pathname === '/admin/overview' || pathname === '/dashboard')) ||
    (role === 'CONSULTANT' && pathname.startsWith('/consultant/dashboard')) ||
    (role !== 'ADMIN' && role !== 'CONSULTANT' && (pathname === '/dashboard' || pathname.startsWith('/dashboard/')));

  const dashboardHref = role === 'ADMIN' ? '/admin/overview' : role === 'CONSULTANT' ? '/consultant/dashboard' : '/dashboard';
  return (
    <header className="sticky top-0 z-50 w-full border-b-2 border-slate-200 bg-white/98 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/98 shadow-xs">
      {/* 1. National Tricolor Line */}
      <div className="tricolor-strip" aria-hidden="true">
        <div className="strip-saffron"></div>
        <div className="strip-white"></div>
        <div className="strip-green"></div>
      </div>

      {/* 2. Institutional Utility Bar (GIGW Compliant Tone) */}
      <div className="border-b border-slate-200/90 bg-slate-50/90 py-1 px-4 text-xs font-semibold text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-amber-500"></span>
            <span>भारत सरकार | Government of India • National Guidance Architecture</span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-xs">
            <span>Toll-Free Helpline: <strong className="text-slate-900 dark:text-white">1800-11-2026</strong></span>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <span>Tele-MANAS: <strong className="text-slate-900 dark:text-white">14416</strong></span>
          </div>
        </div>
      </div>

      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo - Institutional Authority */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0B2A4A] text-white shadow-xs transition-transform group-hover:scale-105 border border-[#071C33]">
            <GraduationCap className="h-6 w-6 text-amber-400" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tight text-slate-950 dark:text-white">
              CAREER<span className="text-[#D96B00] dark:text-amber-400">-GUD</span>
            </span>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-600 dark:text-slate-300">
              National Guidance Architecture
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-sm font-bold text-slate-700 dark:text-slate-200">
          {/* Quizzes Dropdown - Hover and Click/Tap with Click-Outside Guard */}
          <div
            ref={dropdownRef}
            className="relative"
            onMouseEnter={handleDropdownMouseEnter}
            onMouseLeave={handleDropdownMouseLeave}
          >
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                if (leaveTimeoutRef.current) {
                  clearTimeout(leaveTimeoutRef.current);
                  leaveTimeoutRef.current = null;
                }
                setQuizDropdownOpen((prev) => !prev);
              }}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl hover:bg-slate-100 hover:text-slate-950 dark:hover:bg-slate-800 dark:hover:text-white transition-colors cursor-pointer select-none touch-manipulation ${
                pathname.startsWith('/quiz')
                  ? 'text-[#0B2A4A] dark:text-amber-400 font-extrabold bg-amber-50/70 border-b-2 border-[#D96B00] dark:bg-slate-800'
                  : ''
              }`}
            >
              <Compass className="h-4 w-4 text-[#D96B00] dark:text-amber-400" />
              <span>Assessments</span>
              <ChevronDown className={`h-3.5 w-3.5 opacity-60 transition-transform duration-200 ${quizDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {quizDropdownOpen && (
              <div
                className="absolute left-0 top-full pt-1.5 w-88 z-50"
                onMouseEnter={handleDropdownMouseEnter}
                onMouseLeave={handleDropdownMouseLeave}
              >
                <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-xl dark:border-slate-700 dark:bg-slate-900 animate-in fade-in zoom-in-95">
                  <Link
                    href="/quiz/post-10th"
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavigate('/quiz/post-10th', e);
                    }}
                    onPointerDown={handleItemPointerDown}
                    onPointerUp={(e) => handleItemPointerUp('/quiz/post-10th', e)}
                    className="flex flex-col gap-1 rounded-xl p-3 hover:bg-amber-50/70 dark:hover:bg-slate-800 transition-colors cursor-pointer group select-none touch-manipulation active:scale-[0.99] border-l-3 border-[#D96B00]"
                  >
                    <div className="flex items-center gap-2.5 text-sm font-bold text-slate-900 dark:text-white group-hover:text-[#D96B00] dark:group-hover:text-amber-400">
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-100 text-xs font-black text-[#D96B00] dark:bg-amber-950 dark:text-amber-300 pointer-events-none">
                        10
                      </span>
                      <span className="pointer-events-none font-bold">Class 10: Stream Selection</span>
                    </div>
                    <span className="text-xs font-medium text-slate-600 dark:text-slate-400 pl-9 pointer-events-none">
                      Discover PCM, PCB, Commerce, or Arts based on real strengths
                    </span>
                  </Link>

                  <Link
                    href="/quiz/post-12th"
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavigate('/quiz/post-12th', e);
                    }}
                    onPointerDown={handleItemPointerDown}
                    onPointerUp={(e) => handleItemPointerUp('/quiz/post-12th', e)}
                    className="flex flex-col gap-1 rounded-xl p-3 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer group select-none touch-manipulation active:scale-[0.99] border-l-3 border-[#0B2A4A] mt-1"
                  >
                    <div className="flex items-center gap-2.5 text-sm font-bold text-slate-900 dark:text-white group-hover:text-[#0B2A4A] dark:group-hover:text-slate-100">
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-xs font-black text-[#0B2A4A] dark:bg-slate-800 dark:text-white pointer-events-none">
                        12
                      </span>
                      <span className="pointer-events-none font-bold">Class 12: Degree & Exam Matrix</span>
                    </div>
                    <span className="text-xs font-medium text-slate-600 dark:text-slate-400 pl-9 pointer-events-none">
                      Degrees, IIMs, Law, Design, Biotech & national exams beyond B.Tech/MBBS
                    </span>
                  </Link>
                </div>
              </div>
            )}
          </div>

          <Link
            href="/careers"
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl hover:bg-slate-100 hover:text-slate-950 dark:hover:bg-slate-800 dark:hover:text-white transition-colors ${
              pathname.startsWith('/careers')
                ? 'text-[#0B2A4A] dark:text-amber-400 font-extrabold bg-amber-50/70 border-b-2 border-[#D96B00] dark:bg-slate-800'
                : ''
            }`}
          >
            <Briefcase className="h-4 w-4 opacity-70" />
            <span>Pathways</span>
          </Link>

          <Link
            href="/colleges"
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl hover:bg-slate-100 hover:text-slate-950 dark:hover:bg-slate-800 dark:hover:text-white transition-colors ${
              pathname.startsWith('/colleges')
                ? 'text-[#0B2A4A] dark:text-amber-400 font-extrabold bg-amber-50/70 border-b-2 border-[#D96B00] dark:bg-slate-800'
                : ''
            }`}
          >
            <BookOpen className="h-4 w-4 opacity-70" />
            <span>Colleges</span>
          </Link>

          <Link
            href="/consultants"
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl hover:bg-slate-100 hover:text-slate-950 dark:hover:bg-slate-800 dark:hover:text-white transition-colors ${
              pathname.startsWith('/consultants')
                ? 'text-[#0B2A4A] dark:text-amber-400 font-extrabold bg-amber-50/70 border-b-2 border-[#D96B00] dark:bg-slate-800'
                : ''
            }`}
          >
            <UserCheck className="h-4 w-4 opacity-70" />
            <span>Mentors</span>
          </Link>

          <Link
            href="/chat"
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl hover:bg-slate-100 hover:text-slate-950 dark:hover:bg-slate-800 dark:hover:text-white transition-colors ${
              pathname === '/chat'
                ? 'text-[#0B2A4A] dark:text-amber-400 font-extrabold bg-amber-50/70 border-b-2 border-[#D96B00] dark:bg-slate-800'
                : ''
            }`}
          >
            <MessageSquare className="h-4 w-4 text-[#D96B00] dark:text-amber-400" />
            <span>AI Advisor</span>
          </Link>
        </nav>

        {/* Action Buttons / User Menu - Protected with shrink-0 and separate spacing */}
        <div className="hidden lg:flex items-center gap-3 shrink-0 pl-4 border-l border-slate-200 dark:border-slate-800">
          {session ? (
            <div className="flex items-center gap-2">
              {role === 'ADMIN' && (
                <Link
                  href="/admin/hub"
                  className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-black transition-all shadow-xs ${
                    isAdminHubActive
                      ? 'bg-amber-400 text-slate-950 ring-2 ring-amber-400 hover:bg-amber-300 hover:text-slate-950 dark:bg-amber-400 dark:text-slate-950 dark:ring-amber-300 dark:hover:bg-amber-300'
                      : 'border border-amber-300/80 bg-amber-50/80 text-amber-950 hover:bg-amber-100 hover:text-amber-900 transition-colors dark:border-slate-700 dark:bg-slate-800 dark:text-amber-300 dark:hover:bg-slate-700 dark:hover:text-amber-200'
                  }`}
                >
                  <ShieldCheck className={`h-4 w-4 ${isAdminHubActive ? 'text-slate-950' : 'text-amber-600 dark:text-amber-400'}`} />
                  <span>Admin Hub</span>
                </Link>
              )}

              {role === 'CONSULTANT' && (
                <Link
                  href="/consultant/dashboard"
                  className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all shadow-xs ${
                    isConsultantPortalActive
                      ? 'bg-emerald-600 text-white ring-2 ring-emerald-500 hover:bg-emerald-700 dark:bg-emerald-600 dark:text-white dark:ring-emerald-400'
                      : 'border border-emerald-300 bg-emerald-50 text-emerald-900 hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-200 dark:hover:bg-emerald-900/60 dark:hover:text-white'
                  }`}
                >
                  <Briefcase className={`h-4 w-4 ${isConsultantPortalActive ? 'text-white' : 'text-emerald-700 dark:text-emerald-400'}`} />
                  <span>Advisory Portal</span>
                </Link>
              )}

              <Link
                href={dashboardHref}
                className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-black transition-all shadow-xs ${
                  isDashboardActive
                    ? 'bg-[#0B2A4A] text-white ring-2 ring-blue-500/50 hover:bg-[#071C33] dark:bg-blue-600 dark:text-white dark:ring-blue-400 dark:hover:bg-blue-500'
                    : 'border border-slate-200 bg-slate-50 text-slate-800 hover:bg-slate-100 hover:text-[#0B2A4A] dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700 dark:hover:text-amber-300'
                }`}
              >
                <LayoutDashboard className={`h-4 w-4 ${isDashboardActive ? 'text-white' : 'text-slate-700 dark:text-slate-200'}`} />
                <span>Dashboard</span>
              </Link>

              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                title="Sign out"
                className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 hover:text-red-600 transition-colors dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-red-400"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <Link
                href="/login"
                className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 hover:text-[#0B2A4A] transition-colors dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 dark:hover:text-white"
              >
                Sign In
              </Link>
              <Link
                href="/quiz/post-10th"
                className="rounded-xl bg-[#0B2A4A] px-4 py-2 text-xs font-bold text-white hover:bg-[#071C33] border border-[#071C33] shadow-xs transition-all"
              >
                Start Free Quiz
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="flex lg:hidden items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="border-b border-slate-200 bg-white px-4 py-3 lg:hidden dark:border-slate-800 dark:bg-slate-950 animate-in slide-in-from-top-2 max-h-[calc(100dvh-5.5rem)] overflow-y-auto overscroll-contain shadow-lg">
          <div className="flex flex-col gap-1.5">
            <Link
              href="/quiz/post-10th"
              className="flex items-center gap-2 rounded-xl py-2 px-3 text-sm font-semibold text-slate-800 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer select-none touch-manipulation"
              onClick={(e) => {
                e.preventDefault();
                handleNavigate('/quiz/post-10th', e);
              }}
            >
              <Compass className="h-4 w-4 text-[#D96B00] pointer-events-none" />
              <span className="pointer-events-none">Class 10: Stream Selection</span>
            </Link>
            <Link
              href="/quiz/post-12th"
              className="flex items-center gap-2 rounded-xl py-2 px-3 text-sm font-semibold text-slate-800 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer select-none touch-manipulation"
              onClick={(e) => {
                e.preventDefault();
                handleNavigate('/quiz/post-12th', e);
              }}
            >
              <GraduationCap className="h-4 w-4 text-[#0B2A4A] dark:text-slate-200 pointer-events-none" />
              <span className="pointer-events-none">Class 12: Degree & Exam Matrix</span>
            </Link>
            <Link
              href="/careers"
              className="flex items-center gap-2 rounded-xl py-2 px-3 text-sm font-semibold text-slate-800 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Briefcase className="h-4 w-4 opacity-70" />
              Career Pathways
            </Link>
            <Link
              href="/colleges"
              className="flex items-center gap-2 rounded-xl py-2 px-3 text-sm font-semibold text-slate-800 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              <BookOpen className="h-4 w-4 opacity-70" />
              Colleges & NIRF Data
            </Link>
            <Link
              href="/consultants"
              className="flex items-center gap-2 rounded-xl py-2 px-3 text-sm font-semibold text-slate-800 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              <UserCheck className="h-4 w-4 opacity-70" />
              Verified Mentors
            </Link>
            <Link
              href="/chat"
              className="flex items-center gap-2 rounded-xl py-2 px-3 text-sm font-semibold text-slate-800 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              <MessageSquare className="h-4 w-4 text-[#D96B00]" />
              AI Academic Counselor
            </Link>

            <div className="mt-2.5 border-t border-slate-200 pt-2.5 dark:border-slate-800">
              {session ? (
                <div className="flex flex-col gap-1.5">
                  {role === 'ADMIN' && (
                    <Link
                      href="/admin/hub"
                      className={`flex items-center gap-2 rounded-xl py-2 px-3 text-xs sm:text-sm font-bold transition-colors ${
                        isAdminHubActive
                          ? 'bg-amber-400 text-slate-950 ring-2 ring-amber-400 font-black shadow-xs hover:bg-amber-300'
                          : 'border border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200 dark:hover:bg-amber-900/60'
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <ShieldCheck className={`h-4 w-4 ${isAdminHubActive ? 'text-slate-950' : 'text-amber-600 dark:text-amber-400'}`} />
                      <span>Admin Hub (Audits & Verifications)</span>
                    </Link>
                  )}
                  {role === 'CONSULTANT' && (
                    <Link
                      href="/consultant/dashboard"
                      className={`flex items-center gap-2 rounded-xl py-2 px-3 text-xs sm:text-sm font-bold transition-colors ${
                        isConsultantPortalActive
                          ? 'bg-emerald-600 text-white ring-2 ring-emerald-500 font-black shadow-xs hover:bg-emerald-700'
                          : 'border border-emerald-300 bg-emerald-50 text-emerald-900 hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-200 dark:hover:bg-emerald-900/60'
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Briefcase className="h-4 w-4 text-emerald-700 dark:text-emerald-400" />
                      <span>Advisory Portal</span>
                    </Link>
                  )}
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href={dashboardHref}
                      className={`flex items-center justify-center gap-1.5 rounded-xl py-2 px-3 text-xs sm:text-sm font-bold transition-colors ${
                        isDashboardActive
                          ? 'bg-[#0B2A4A] text-white ring-2 ring-blue-500/50 font-black dark:bg-blue-600 dark:text-white'
                          : 'bg-slate-100 text-slate-800 hover:bg-slate-200 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700'
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      <span className="truncate">Dashboard</span>
                    </Link>
                    <button
                      onClick={() => signOut({ callbackUrl: '/' })}
                      className="flex items-center justify-center gap-1.5 rounded-xl py-2 px-3 text-xs sm:text-sm font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2.5">
                  <Link
                    href="/login"
                    className="block w-full text-center rounded-xl border border-slate-300 bg-slate-50 py-2.5 text-xs sm:text-sm font-bold text-slate-800 hover:bg-slate-100 hover:text-[#0B2A4A] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700 dark:hover:text-white transition-colors shadow-xs"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/quiz/post-10th"
                    className="block w-full text-center rounded-xl bg-[#0B2A4A] py-2.5 text-xs sm:text-sm font-bold text-white hover:bg-[#071C33] shadow-xs transition-colors"
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
