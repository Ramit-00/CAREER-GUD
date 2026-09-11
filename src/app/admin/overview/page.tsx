'use client';

import {
  AlertCircle,
  ArrowRight,
  Award,
  BarChart3,
  BookOpen,
  Briefcase,
  CheckCircle2,
  Clock,
  ExternalLink,
  Flame,
  GraduationCap,
  KeyRound,
  Lock,
  Mail,
  RefreshCw,
  Search,
  ShieldAlert,
  ShieldCheck,
  TrendingUp,
  User,
  Users,
  X,
  XCircle,
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface TrendingCareer {
  title: string;
  domain: string;
  hypeScore: number;
  growthRate: string;
  avgSalary: string;
  status: string;
}

interface AnalyticsStats {
  totalStudents: number;
  totalConsultants: number;
  pendingConsultants: number;
  totalBookings: number;
  totalQuizzes: number;
  totalCareers: number;
  totalColleges: number;
  streamDistribution: Record<string, number>;
  trendingCareers: TrendingCareer[];
}

interface StudentItem {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  profile: {
    aboutMe?: string | null;
    currentClass?: string | null;
    board?: string | null;
    tenthPercentage?: number | null;
    twelfthPercentage?: number | null;
    previousClassPercentage?: number | null;
    currentStream?: string | null;
    interests?: string[];
    strengths?: string[];
  } | null;
  stats: {
    quizAttempts: number;
    bookings: number;
  };
}

interface ConsultantItem {
  id: string;
  name: string;
  email: string;
  role: string;
  phone?: string | null;
  consultantProfile: {
    id: string;
    headline: string;
    bio: string;
    experienceYears: number;
    highestEducation: string;
    almaMater: string;
    currentRole: string;
    feePerSessionINR: number;
    verificationStatus: 'PENDING' | 'VERIFIED' | 'REJECTED';
    linkedinUrl?: string | null;
    verifications: Array<{
      id: string;
      domain: string;
      status: 'PENDING' | 'VERIFIED' | 'REJECTED';
      proofDescription: string;
    }>;
  } | null;
}

export default function AdminOverviewPage() {
  const router = useRouter();
  const { data: session, status: authStatus } = useSession();
  const [activeTab, setActiveTab] = useState<'trends' | 'students'>('trends');

  // Stats state
  const [stats, setStats] = useState<AnalyticsStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);

  // Market Trends interactive filtering & sorting state
  const [trendDomainFilter, setTrendDomainFilter] = useState<string>('ALL');
  const [trendSortBy, setTrendSortBy] = useState<'hype' | 'growth' | 'salary'>('hype');
  const [trendSearch, setTrendSearch] = useState<string>('');

  // Student directory state
  const [students, setStudents] = useState<StudentItem[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [studentSearch, setStudentSearch] = useState('');
  const [classFilter, setClassFilter] = useState('ALL');
  const [selectedStudent, setSelectedStudent] = useState<StudentItem | null>(null);

  const fetchAnalytics = async () => {
    setLoadingStats(true);
    try {
      const res = await fetch('/api/admin/analytics');
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error('Analytics error:', err);
    } finally {
      setLoadingStats(false);
    }
  };

  const fetchStudents = async () => {
    setLoadingStudents(true);
    try {
      const params = new URLSearchParams();
      if (studentSearch) params.set('q', studentSearch);
      if (classFilter !== 'ALL') params.set('class', classFilter);

      const res = await fetch(`/api/admin/students?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setStudents(data.students || []);
      }
    } catch (err) {
      console.error('Fetch students error:', err);
    } finally {
      setLoadingStudents(false);
    }
  };

  useEffect(() => {
    if (authStatus === 'loading') return;
    const userRole = (session?.user as { role?: string })?.role;
    if (!session || userRole !== 'ADMIN') {
      router.replace('/admin/portal-login');
      return;
    }
    fetchAnalytics();
  }, [authStatus, session, router]);

  useEffect(() => {
    if (activeTab === 'students') {
      fetchStudents();
    }
  }, [activeTab]);

  const formatClassLabel = (cls?: string | null) => {
    if (!cls) return 'Not specified';
    switch (cls) {
      case 'CLASS_9': return 'Class 9';
      case 'CLASS_10': return 'Class 10';
      case 'CLASS_11': return 'Class 11';
      case 'CLASS_12': return 'Class 12';
      case 'POST_12': return 'Post-12';
      case 'UNDERGRAD': return 'Undergrad';
      default: return cls;
    }
  };

  // Filtered & sorted careers for the interactive Hype Index
  const filteredCareers = (stats?.trendingCareers || [])
    .filter((c) => {
      if (trendDomainFilter !== 'ALL' && c.domain !== trendDomainFilter) return false;
      if (trendSearch.trim()) {
        const q = trendSearch.toLowerCase();
        if (!c.title.toLowerCase().includes(q) && !c.domain.toLowerCase().includes(q)) {
          return false;
        }
      }
      return true;
    })
    .sort((a, b) => {
      if (trendSortBy === 'hype') return b.hypeScore - a.hypeScore;
      if (trendSortBy === 'growth') return b.growthRate.localeCompare(a.growthRate);
      return b.avgSalary.localeCompare(a.avgSalary);
    });

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 flex flex-col gap-8">
      {/* Top Banner Header */}
      <div className="rounded-3xl border-2 border-slate-200 bg-[#071C33] p-6 sm:p-8 text-white shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-blue-400/40 bg-blue-500/20 px-3 py-1 text-xs font-black text-blue-300">
                <BarChart3 className="h-4 w-4 text-blue-400" />
                Institutional Analytics & Oversight
              </span>
              <span className="rounded-md bg-emerald-950/80 border border-emerald-500/50 px-2 py-0.5 text-[10px] font-extrabold uppercase text-emerald-300">
                Live Supabase Connected
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
              Administrator Platform Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 font-medium max-w-2xl">
              High-level institutional intelligence: Live student enrollments, mentor strength, career assessments, and dynamic industry hype trends.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href="/admin/hub"
              className="flex items-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-400 px-4 py-2.5 text-xs font-black text-slate-950 shadow-md transition cursor-pointer"
            >
              <ShieldCheck className="h-4 w-4 text-slate-950" />
              <span>Admin Hub: Verify Mentors ({stats?.pendingConsultants ?? 0} Pending)</span>
              <ArrowRight className="h-4 w-4 text-slate-950" />
            </Link>

            <button
              onClick={() => {
                fetchAnalytics();
                if (activeTab === 'students') fetchStudents();
              }}
              className="flex items-center gap-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 px-4 py-2.5 text-xs font-bold text-white transition cursor-pointer"
            >
              <RefreshCw className={`h-3.5 w-3.5 text-amber-400 ${loadingStats ? 'animate-spin' : ''}`} />
              <span>Sync Live Data</span>
            </button>
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="mt-8 flex flex-wrap gap-3 border-t border-slate-700/80 pt-4">
          <button
            onClick={() => setActiveTab('trends')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition cursor-pointer ${
              activeTab === 'trends'
                ? 'bg-amber-400 text-slate-950 font-black shadow-md ring-2 ring-amber-300'
                : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
            }`}
          >
            <Flame className="h-4 w-4" />
            <span>Market Trends & Hype Index</span>
          </button>

          <button
            onClick={() => setActiveTab('students')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition cursor-pointer ${
              activeTab === 'students'
                ? 'bg-amber-400 text-slate-950 font-black shadow-md ring-2 ring-amber-300'
                : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
            }`}
          >
            <GraduationCap className="h-4 w-4" />
            <span>Student Directory & Academic Roster ({stats?.totalStudents ?? '...'})</span>
          </button>
        </div>
      </div>

      {/* KPI Overview Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-2xl border-2 border-slate-200 bg-white p-5 shadow-xs">
          <GraduationCap className="h-6 w-6 text-[#0B2A4A] mb-2" />
          <span className="text-xs uppercase font-black text-slate-600 block">Registered Students</span>
          <span className="text-3xl font-black text-slate-950">{stats?.totalStudents ?? 0}</span>
        </div>

        <div className="rounded-2xl border-2 border-slate-200 bg-white p-5 shadow-xs">
          <Briefcase className="h-6 w-6 text-emerald-600 mb-2" />
          <span className="text-xs uppercase font-black text-slate-600 block">Active Advisors</span>
          <span className="text-3xl font-black text-slate-950">{stats?.totalConsultants ?? 0}</span>
        </div>

        <Link
          href="/admin/hub"
          className="rounded-2xl border-2 border-amber-300 bg-amber-50/70 p-5 shadow-xs hover:border-amber-400 transition block group"
        >
          <div className="flex items-center justify-between mb-2">
            <Clock className="h-6 w-6 text-amber-600" />
            <span className="text-[11px] font-bold text-amber-800 group-hover:underline flex items-center gap-0.5">
              Review in Hub →
            </span>
          </div>
          <span className="text-xs uppercase font-black text-slate-600 block">Pending Audits</span>
          <span className="text-3xl font-black text-amber-600">{stats?.pendingConsultants ?? 0}</span>
        </Link>

        <div className="rounded-2xl border-2 border-slate-200 bg-white p-5 shadow-xs">
          <BarChart3 className="h-6 w-6 text-blue-600 mb-2" />
          <span className="text-xs uppercase font-black text-slate-600 block">Quiz Assessments</span>
          <span className="text-3xl font-black text-slate-950">{stats?.totalQuizzes ?? 0}</span>
        </div>
      </div>

      {/* TAB 1: INTERACTIVE MARKET TRENDS & HYPE */}
      {activeTab === 'trends' && (
        <div className="flex flex-col gap-8 animate-in fade-in duration-200">
          {/* Trending Hype Careers with interactive filters */}
          <div className="rounded-3xl border-2 border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200">
              <div>
                <h3 className="text-xl font-black text-[#0B2A4A] flex items-center gap-2">
                  <Flame className="h-5 w-5 text-red-500 animate-pulse" />
                  High-Demand & Surging Careers (Interactive Hype Index)
                </h3>
                <p className="text-xs text-slate-600 mt-1 font-medium">
                  Real-time Indian industry demand, entry remuneration, and growth projections
                </p>
              </div>

              {/* Sort & Search */}
              <div className="flex flex-wrap items-center gap-2.5">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search career or skill..."
                    value={trendSearch}
                    onChange={(e) => setTrendSearch(e.target.value)}
                    className="rounded-xl border border-slate-300 bg-slate-50 py-1.5 pl-9 pr-3 text-xs font-bold text-slate-900 focus:border-[#0B2A4A] focus:outline-none"
                  />
                </div>

                <select
                  value={trendSortBy}
                  onChange={(e) => setTrendSortBy(e.target.value as any)}
                  className="rounded-xl border border-slate-300 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-900 focus:border-[#0B2A4A] focus:outline-none"
                >
                  <option value="hype">Sort: Highest Hype</option>
                  <option value="growth">Sort: Fastest Growth</option>
                  <option value="salary">Sort: Top Salary</option>
                </select>
              </div>
            </div>

            {/* Interactive Domain Filter Chips */}
            <div className="flex flex-wrap gap-2 mb-6">
              {[
                { id: 'ALL', label: '🔥 All Trending Careers' },
                { id: 'Tech & AI', label: '🤖 Tech & AI' },
                { id: 'Medical & Bio', label: '🧬 Medical & Bio' },
                { id: 'Finance & Commerce', label: '📈 Finance & Commerce' },
                { id: 'Law & Policy', label: '⚖️ Law & Policy' },
                { id: 'Creative & Design', label: '🎨 Creative & Design' },
              ].map((chip) => {
                const isActive = trendDomainFilter === chip.id;
                return (
                  <button
                    key={chip.id}
                    onClick={() => setTrendDomainFilter(chip.id)}
                    className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition cursor-pointer ${
                      isActive
                        ? 'bg-[#0B2A4A] text-white shadow-xs font-black'
                        : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {chip.label}
                  </button>
                );
              })}
            </div>

            {/* Career Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCareers.map((career, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border-2 border-slate-200 bg-slate-50/70 p-5 flex flex-col justify-between hover:border-slate-300 transition"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="rounded-md bg-blue-100 px-2.5 py-0.5 text-[10px] font-black text-[#0B2A4A]">
                        {career.domain}
                      </span>
                      <span className="rounded-md bg-red-100 border border-red-300 px-2.5 py-0.5 text-[10px] font-black text-red-800">
                        Hype {career.hypeScore}/100
                      </span>
                    </div>

                    <h4 className="font-black text-slate-950 text-base leading-snug">
                      {career.title}
                    </h4>

                    {/* Visual Hype Progress Bar */}
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 mb-1">
                        <span>Market Momentum</span>
                        <span>{career.hypeScore}%</span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
                        <div
                          className="h-full bg-gradient-to-r from-amber-500 to-red-500 transition-all duration-500"
                          style={{ width: `${career.hypeScore}%` }}
                        />
                      </div>
                    </div>

                    <p className="text-xs font-bold text-emerald-700 mt-2.5">
                      Growth: {career.growthRate}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">Salary Band</span>
                    <strong className="font-extrabold text-slate-950">{career.avgSalary}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Academic Stream Popularity Breakdown */}
          <div className="rounded-3xl border-2 border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
            <h3 className="text-lg sm:text-xl font-black text-[#0B2A4A] mb-4">
              Student Stream Distribution in Database
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs sm:text-sm">
              <div className="rounded-2xl bg-blue-50 p-4 border border-blue-200">
                <span className="font-black text-[#0B2A4A] block text-xs uppercase tracking-wider">
                  Science (PCM)
                </span>
                <span className="text-2xl font-black text-[#0B2A4A] mt-1 block">
                  {stats?.streamDistribution?.SCIENCE_PCM ?? 0} Students
                </span>
                <p className="text-[11px] text-slate-600 mt-1">CS, AI, Robotics, Aerospace</p>
              </div>

              <div className="rounded-2xl bg-emerald-50 p-4 border border-emerald-200">
                <span className="font-black text-[#138808] block text-xs uppercase tracking-wider">
                  Science (PCB)
                </span>
                <span className="text-2xl font-black text-[#138808] mt-1 block">
                  {stats?.streamDistribution?.SCIENCE_PCB ?? 0} Students
                </span>
                <p className="text-[11px] text-slate-600 mt-1">MBBS, Biotech, Genomics</p>
              </div>

              <div className="rounded-2xl bg-amber-50 p-4 border border-amber-200">
                <span className="font-black text-[#D96B00] block text-xs uppercase tracking-wider">
                  Commerce
                </span>
                <span className="text-2xl font-black text-[#D96B00] mt-1 block">
                  {(stats?.streamDistribution?.COMMERCE_MATHS ?? 0) + (stats?.streamDistribution?.COMMERCE_NO_MATHS ?? 0)} Students
                </span>
                <p className="text-[11px] text-slate-600 mt-1">Finance, CA, IPMAT</p>
              </div>

              <div className="rounded-xl bg-slate-100 p-4 border border-slate-200">
                <span className="font-black text-slate-800 block text-xs uppercase tracking-wider">
                  Arts &amp; Humanities
                </span>
                <span className="text-2xl font-black text-slate-900 mt-1 block">
                  {stats?.streamDistribution?.ARTS ?? 0} Students
                </span>
                <p className="text-[11px] text-slate-600 mt-1">Design, Law, Public Policy</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: FULL STUDENT DIRECTORY & OVERSIGHT */}
      {activeTab === 'students' && (
        <div className="rounded-3xl border-2 border-slate-200 bg-white p-6 sm:p-8 shadow-xs flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-black text-[#0B2A4A] flex items-center gap-2">
                <GraduationCap className="h-6 w-6 text-[#0B2A4A]" />
                Live Student Directory & Academic Roster
              </h3>
              <p className="text-xs text-slate-600 mt-1 font-medium">
                Direct access to every student enrolled in Supabase PostgreSQL
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && fetchStudents()}
                  placeholder="Search name or email..."
                  className="rounded-xl border border-slate-300 bg-slate-50 py-2 pl-9 pr-3 text-xs font-bold text-slate-900 focus:border-[#0B2A4A] focus:outline-none"
                />
              </div>

              <select
                value={classFilter}
                onChange={(e) => {
                  setClassFilter(e.target.value);
                  setTimeout(fetchStudents, 50);
                }}
                className="rounded-xl border border-slate-300 bg-slate-50 py-2 px-3 text-xs font-bold text-slate-900 focus:border-[#0B2A4A] focus:outline-none"
              >
                <option value="ALL">All Classes</option>
                <option value="CLASS_9">Class 9</option>
                <option value="CLASS_10">Class 10</option>
                <option value="CLASS_11">Class 11</option>
                <option value="CLASS_12">Class 12</option>
                <option value="POST_12">Post-12</option>
                <option value="UNDERGRAD">Undergrad</option>
              </select>

              <button
                onClick={fetchStudents}
                className="rounded-xl bg-[#0B2A4A] px-4 py-2 text-xs font-bold text-white hover:bg-[#071C33] cursor-pointer"
              >
                Filter
              </button>
            </div>
          </div>

          {/* Student Table */}
          {loadingStudents ? (
            <div className="py-16 text-center text-sm font-bold text-slate-700">
              <span className="animate-spin inline-block h-6 w-6 border-3 border-blue-600 border-t-transparent rounded-full mb-3" />
              <p>Querying Supabase student records...</p>
            </div>
          ) : students.length === 0 ? (
            <div className="py-16 text-center text-sm font-bold text-slate-700 rounded-2xl border-2 border-dashed border-slate-200">
              <p>No students match your query.</p>
              <p className="text-xs text-slate-500 mt-1">Students will appear here as soon as they complete registration on /register.</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-700 font-black uppercase tracking-wider">
                  <tr>
                    <th className="p-3.5">Student Name & Email</th>
                    <th className="p-3.5">Class / Board</th>
                    <th className="p-3.5">10th %</th>
                    <th className="p-3.5">12th %</th>
                    <th className="p-3.5">Quizzes</th>
                    <th className="p-3.5">Joined Date</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-medium">
                  {students.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50">
                      <td className="p-3.5">
                        <strong className="block text-slate-950 font-bold text-xs sm:text-sm">
                          {s.name}
                        </strong>
                        <span className="text-slate-500 text-[11px]">{s.email}</span>
                      </td>
                      <td className="p-3.5">
                        <span className="rounded-md bg-blue-50 border border-blue-200 px-2 py-0.5 font-bold text-blue-900">
                          {formatClassLabel(s.profile?.currentClass)}
                        </span>
                        <span className="block text-slate-500 text-[11px] mt-1">
                          {s.profile?.board || 'Board: N/A'}
                        </span>
                      </td>
                      <td className="p-3.5">
                        {s.profile?.tenthPercentage != null ? (
                          <span className="font-extrabold text-[#0B2A4A]">
                            {s.profile.tenthPercentage}%
                          </span>
                        ) : (
                          <span className="text-slate-400 italic">Not set</span>
                        )}
                      </td>
                      <td className="p-3.5">
                        {s.profile?.twelfthPercentage != null ? (
                          <span className="font-extrabold text-[#0B2A4A]">
                            {s.profile.twelfthPercentage}%
                          </span>
                        ) : (
                          <span className="text-slate-400 italic">Not set</span>
                        )}
                      </td>
                      <td className="p-3.5">
                        <span className="font-bold text-slate-800">
                          {s.stats.quizAttempts} Completed
                        </span>
                      </td>
                      <td className="p-3.5 text-slate-500">
                        {new Date(s.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => setSelectedStudent(s)}
                          className="rounded-lg bg-slate-100 hover:bg-slate-200 px-3 py-1.5 font-black text-[11px] text-slate-800 cursor-pointer"
                        >
                          Inspect File
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Student Detailed File Modal */}
          {selectedStudent && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 animate-in fade-in">
              <div className="w-full max-w-xl rounded-3xl border-2 border-slate-200 bg-white p-6 sm:p-8 shadow-2xl flex flex-col gap-5 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0B2A4A] text-amber-400 font-black text-xl">
                      {selectedStudent.name[0]}
                    </div>
                    <div>
                      <h4 className="font-black text-lg text-slate-950">{selectedStudent.name}</h4>
                      <p className="text-xs text-slate-500">{selectedStudent.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedStudent(null)}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* About Me */}
                {selectedStudent.profile?.aboutMe && (
                  <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
                    <span className="text-[11px] font-black uppercase text-amber-800 block mb-1">
                      Student Bio / Aspirations:
                    </span>
                    <p className="text-xs text-slate-800 italic">
                      &ldquo;{selectedStudent.profile.aboutMe}&rdquo;
                    </p>
                  </div>
                )}

                {/* Academic Record Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="rounded-xl bg-slate-100 p-3">
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Class</span>
                    <strong className="text-slate-950 font-black">
                      {formatClassLabel(selectedStudent.profile?.currentClass)}
                    </strong>
                  </div>
                  <div className="rounded-xl bg-slate-100 p-3">
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Board</span>
                    <strong className="text-slate-950 font-black">
                      {selectedStudent.profile?.board || 'Not set'}
                    </strong>
                  </div>
                  <div className="rounded-xl bg-slate-100 p-3">
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">10th Score</span>
                    <strong className="text-blue-600 font-black">
                      {selectedStudent.profile?.tenthPercentage != null ? `${selectedStudent.profile.tenthPercentage}%` : 'N/A'}
                    </strong>
                  </div>
                  <div className="rounded-xl bg-slate-100 p-3">
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">12th Score</span>
                    <strong className="text-blue-600 font-black">
                      {selectedStudent.profile?.twelfthPercentage != null ? `${selectedStudent.profile.twelfthPercentage}%` : 'N/A'}
                    </strong>
                  </div>
                </div>

                {/* Interests & Strengths */}
                <div className="flex flex-col gap-2 text-xs">
                  <span className="font-bold text-slate-700">Declared Interests:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedStudent.profile?.interests && selectedStudent.profile.interests.length > 0 ? (
                      selectedStudent.profile.interests.map((it, i) => (
                        <span key={i} className="rounded-lg bg-blue-100 px-2.5 py-1 font-bold text-blue-900 text-[11px]">
                          {it}
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-400 italic">None declared</span>
                    )}
                  </div>
                </div>

                <div className="flex justify-end pt-2 border-t border-slate-200">
                  <button
                    onClick={() => setSelectedStudent(null)}
                    className="rounded-xl bg-[#0B2A4A] px-5 py-2 text-xs font-bold text-white hover:bg-[#071C33] cursor-pointer"
                  >
                    Done Reviewing
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Quick Action Footer to Admin Hub */}
      <div className="rounded-2xl border border-amber-300 bg-amber-50/60 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500 text-slate-950 font-black shadow-xs shrink-0">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-sm font-black text-slate-900">Looking for Advisor Applications & Credential Audits?</h4>
            <p className="text-xs text-slate-600 font-medium">Head over to the dedicated Admin Hub portal to review, approve, or reject candidate mentors.</p>
          </div>
        </div>
        <Link
          href="/admin/hub"
          className="inline-flex items-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-400 px-4 py-2 text-xs font-black text-slate-950 shadow-xs transition shrink-0"
        >
          <span>Open Admin Hub</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}

