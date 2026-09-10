'use client';

import { ConsultationBooking, QuizResult } from '@/types';
import {
  AlertCircle,
  ArrowRight,
  Bookmark,
  Briefcase,
  Building,
  Calendar,
  CheckCircle2,
  Clock,
  Compass,
  Download,
  Edit3,
  ExternalLink,
  GraduationCap,
  MapPin,
  Save,
  School,
  Sparkles,
  Target,
  Trash2,
  Video,
  X,
  XCircle,
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { downloadIcsFile, generateGoogleCalendarUrl, generateIcsContent } from '@/lib/calendar';

interface StudentProfileData {
  id?: string;
  aboutMe?: string | null;
  currentClass?: string | null;
  currentStream?: string | null;
  board?: string | null;
  tenthPercentage?: number | null;
  twelfthPercentage?: number | null;
  previousClassPercentage?: number | null;
  interests?: string[];
  strengths?: string[];
  savedCareers?: string[];
  savedColleges?: string[];
}

interface SavedCareerItem {
  slug: string;
  title: string;
  streamLabel: string;
  streamCategory?: string;
  description?: string;
  demandTrend?: string;
  avgSalary?: string;
  avgSalaryEntry?: string;
  avgSalaryMid?: string;
  avgRating?: number;
}

interface SavedCollegeItem {
  slug: string;
  name: string;
  city: string;
  state: string;
  nirfRanking: number;
  avgPackage?: string;
  website?: string;
  tier?: string;
}

export default function StudentDashboardPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [studentName, setStudentName] = useState<string>('');
  const [studentEmail, setStudentEmail] = useState<string>('');
  const [profile, setProfile] = useState<StudentProfileData | null>(null);
  const [quizHistory, setQuizHistory] = useState<QuizResult[]>([]);
  const [bookings, setBookings] = useState<ConsultationBooking[]>([]);
  const [loading, setLoading] = useState(true);

  // Saved Careers & Colleges states
  const [savedCareersList, setSavedCareersList] = useState<SavedCareerItem[]>([]);
  const [savedCollegesList, setSavedCollegesList] = useState<SavedCollegeItem[]>([]);
  const [removingBookmark, setRemovingBookmark] = useState<string | null>(null);
  const [cancellingBookingId, setCancellingBookingId] = useState<string | null>(null);

  const handleCancelBooking = async (bookingId: string) => {
    if (!window.confirm('Are you sure you want to cancel this consultation appointment?')) {
      return;
    }
    setCancellingBookingId(bookingId);
    try {
      const res = await fetch('/api/consultants/bookings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId, status: 'CANCELLED' }),
      });
      if (res.ok) {
        setBookings((prev) =>
          prev.map((b) => (b.id === bookingId ? { ...b, status: 'CANCELLED' } : b))
        );
      }
    } catch (err) {
      console.error('Failed to cancel booking:', err);
    } finally {
      setCancellingBookingId(null);
    }
  };

  // Edit Profile modal/form states
  const [isEditing, setIsEditing] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form input fields
  const [formName, setFormName] = useState('');
  const [formAboutMe, setFormAboutMe] = useState('');
  const [formClass, setFormClass] = useState<string>('');
  const [formBoard, setFormBoard] = useState<string>('');
  const [formStream, setFormStream] = useState<string>('');
  const [formTenth, setFormTenth] = useState<string>('');
  const [formTwelfth, setFormTwelfth] = useState<string>('');
  const [formPrevClass, setFormPrevClass] = useState<string>('');
  const [formInterests, setFormInterests] = useState<string>('');
  const [formStrengths, setFormStrengths] = useState<string>('');

  const populateForm = (name?: string, p?: StudentProfileData | null) => {
    setFormName(name || session?.user?.name || '');
    setFormAboutMe(p?.aboutMe || '');
    setFormClass(p?.currentClass || '');
    setFormBoard(p?.board || '');
    setFormStream(p?.currentStream || '');
    setFormTenth(p?.tenthPercentage != null ? String(p.tenthPercentage) : '');
    setFormTwelfth(p?.twelfthPercentage != null ? String(p.twelfthPercentage) : '');
    setFormPrevClass(p?.previousClassPercentage != null ? String(p.previousClassPercentage) : '');
    setFormInterests(p?.interests?.join(', ') || '');
    setFormStrengths(p?.strengths?.join(', ') || '');
  };

  const fetchStudentDashboard = async () => {
    setLoading(true);
    try {
      const [profileRes, quizRes, bookRes, bookmarkRes] = await Promise.all([
        fetch('/api/student/profile'),
        fetch('/api/quiz/history'),
        fetch('/api/consultants/bookings'),
        fetch('/api/bookmarks'),
      ]);

      if (profileRes.ok) {
        const data = await profileRes.json();
        setStudentName(data.name || session?.user?.name || 'Student');
        setStudentEmail(data.email || session?.user?.email || '');
        setProfile(data.profile || null);
        populateForm(data.name, data.profile);
      }

      if (quizRes.ok) {
        const q: QuizResult[] = await quizRes.json();
        setQuizHistory(q || []);
      }

      if (bookRes.ok) {
        const b: ConsultationBooking[] = await bookRes.json();
        setBookings(b || []);
      }

      if (bookmarkRes.ok) {
        const bData = await bookmarkRes.json();
        setSavedCareersList(bData.careers || []);
        setSavedCollegesList(bData.colleges || []);
      }
    } catch (err) {
      console.error('Error fetching student dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  // Role and session check
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login');
      return;
    }
    if (status === 'authenticated') {
      const userRole = (session?.user as { role?: string })?.role;
      if (userRole === 'ADMIN') {
        router.replace('/admin/overview');
      } else if (userRole === 'CONSULTANT') {
        router.replace('/consultant/dashboard');
      } else {
        fetchStudentDashboard();
      }
    }
  }, [status, session, router]);

  const handleRemoveBookmark = async (type: 'CAREER' | 'COLLEGE', slug: string) => {
    setRemovingBookmark(slug);
    try {
      const res = await fetch(`/api/bookmarks?type=${type}&slug=${slug}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        if (type === 'CAREER') {
          setSavedCareersList((prev) => prev.filter((c) => c.slug !== slug));
          setProfile((prev) => (prev ? { ...prev, savedCareers: (prev.savedCareers || []).filter((s) => s !== slug) } : null));
        } else {
          setSavedCollegesList((prev) => prev.filter((c) => c.slug !== slug));
          setProfile((prev) => (prev ? { ...prev, savedColleges: (prev.savedColleges || []).filter((s) => s !== slug) } : null));
        }
      }
    } catch (err) {
      console.error('Failed to remove bookmark:', err);
    } finally {
      setRemovingBookmark(null);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setFeedbackMsg(null);

    try {
      const payload: Record<string, any> = {
        name: formName.trim() || studentName,
        aboutMe: formAboutMe.trim() || null,
        currentClass: formClass || null,
        board: formBoard.trim() || null,
        currentStream: formStream || null,
        tenthPercentage: formTenth !== '' ? parseFloat(formTenth) : null,
        twelfthPercentage: formTwelfth !== '' ? parseFloat(formTwelfth) : null,
        previousClassPercentage: formPrevClass !== '' ? parseFloat(formPrevClass) : null,
        interests: formInterests
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        strengths: formStrengths
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
      };

      const res = await fetch('/api/student/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        setStudentName(data.name || formName);
        setProfile(data.profile);
        setIsEditing(false);
        setFeedbackMsg({ type: 'success', text: 'Academic profile updated successfully!' });
      } else {
        setFeedbackMsg({ type: 'error', text: data.error || 'Failed to save changes.' });
      }
    } catch (err) {
      console.error('Save profile error:', err);
      setFeedbackMsg({ type: 'error', text: 'An unexpected error occurred while saving.' });
    } finally {
      setSavingProfile(false);
    }
  };

  const formatClass = (cls?: string | null) => {
    if (!cls) return 'Not specified';
    switch (cls) {
      case 'CLASS_9':
        return 'Class 9';
      case 'CLASS_10':
        return 'Class 10';
      case 'CLASS_11':
        return 'Class 11';
      case 'CLASS_12':
        return 'Class 12';
      case 'POST_12':
        return 'Post-12 / Dropper';
      case 'UNDERGRAD':
        return 'Undergraduate';
      default:
        return cls;
    }
  };

  const formatStream = (stream?: string | null) => {
    if (!stream) return 'Not decided';
    switch (stream) {
      case 'SCIENCE_PCM':
        return 'Science (PCM)';
      case 'SCIENCE_PCB':
        return 'Science (PCB)';
      case 'SCIENCE_PCMB':
        return 'Science (PCMB)';
      case 'COMMERCE_MATHS':
        return 'Commerce with Maths';
      case 'COMMERCE_NO_MATHS':
        return 'Commerce without Maths';
      case 'ARTS':
        return 'Arts / Humanities';
      case 'VOCATIONAL':
        return 'Vocational Studies';
      default:
        return stream;
    }
  };

  const hasIncompleteRecord =
    !profile?.currentClass ||
    profile.tenthPercentage == null ||
    !profile.board;

  if (status === 'loading' || loading) {
    return (
      <div className="py-24 text-center text-sm text-slate-500">
        <span className="animate-spin inline-block h-6 w-6 border-2 border-[#0B2A4A] border-t-transparent rounded-full mb-3" />
        <p>Loading your student profile...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8 flex flex-col gap-8">
      {/* Feedback banner */}
      {feedbackMsg && (
        <div
          className={`flex items-center justify-between rounded-2xl p-4 text-xs sm:text-sm font-bold shadow-sm ${
            feedbackMsg.type === 'success'
              ? 'bg-emerald-50 border border-emerald-300 text-emerald-900 dark:bg-emerald-950 dark:border-emerald-800 dark:text-emerald-200'
              : 'bg-red-50 border border-red-300 text-red-900 dark:bg-red-950 dark:border-red-800 dark:text-red-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {feedbackMsg.type === 'success' ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
            )}
            <span>{feedbackMsg.text}</span>
          </div>
          <button
            onClick={() => setFeedbackMsg(null)}
            className="text-slate-500 hover:text-slate-800 dark:text-slate-400"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Header Profile Card */}
      <div className="rounded-3xl border-2 border-slate-200 bg-white p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0B2A4A] text-amber-400 font-black text-2xl shadow-md shrink-0 border border-[#071C33]">
              {studentName?.[0]?.toUpperCase() || 'S'}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-black text-[#0B2A4A] dark:text-white tracking-tight">
                  {studentName || 'Student'}
                </h1>
                <span className="rounded-full bg-blue-50 border border-blue-200 px-3 py-0.5 text-xs font-black text-[#0B2A4A] dark:bg-blue-950 dark:border-blue-800 dark:text-blue-200">
                  Student Account
                </span>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400 mt-1">
                {studentEmail || session?.user?.email}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setIsEditing(!isEditing);
                if (!isEditing) populateForm(studentName, profile);
              }}
              className="flex items-center gap-2 rounded-xl border-2 border-slate-300 bg-white px-4 py-2.5 text-xs font-black text-slate-800 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700 transition cursor-pointer shadow-xs"
            >
              <Edit3 className="h-4 w-4 text-[#0B2A4A] dark:text-amber-400" />
              <span>{isEditing ? 'Close Editor' : 'Edit Profile & Marks'}</span>
            </button>
            <Link
              href="/quiz/post-10th"
              className="rounded-xl bg-[#0B2A4A] px-4 py-2.5 text-xs font-black text-white hover:bg-[#071C33] transition shadow-xs"
            >
              Take Assessment
            </Link>
          </div>
        </div>

        {/* Bio / About Me Quote */}
        {profile?.aboutMe ? (
          <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50/50 p-4 dark:border-amber-900/50 dark:bg-amber-950/20">
            <span className="text-[11px] font-black uppercase tracking-wider text-amber-800 dark:text-amber-300 block mb-1">
              About Me & Career Aspirations
            </span>
            <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 italic font-medium">
              &ldquo;{profile.aboutMe}&rdquo;
            </p>
          </div>
        ) : (
          <div className="mt-6 rounded-2xl border border-dashed border-slate-300 p-3.5 text-center text-xs text-slate-500 dark:border-slate-700 dark:text-slate-400">
            No bio added yet. Click <strong>Edit Profile & Marks</strong> to describe your academic interests and goals.
          </div>
        )}

        {/* Incomplete Record Notice */}
        {hasIncompleteRecord && !isEditing && (
          <div className="mt-5 flex items-center justify-between rounded-2xl border border-amber-300 bg-amber-50/70 p-4 text-xs font-bold text-amber-900 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
              <span>Your academic signals are not fully specified yet. Fill your 10th/12th percentages to receive accurate career matches.</span>
            </div>
            <button
              onClick={() => setIsEditing(true)}
              className="ml-3 shrink-0 rounded-lg bg-amber-500 px-3 py-1.5 font-black text-[11px] text-slate-950 hover:bg-amber-400 cursor-pointer"
            >
              Complete Now
            </button>
          </div>
        )}

        {/* Edit Form Modal/Drawer */}
        {isEditing && (
          <form
            onSubmit={handleSaveProfile}
            className="mt-6 border-t-2 border-slate-200 dark:border-slate-800 pt-6 flex flex-col gap-5 text-sm animate-in fade-in duration-200"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-[#0B2A4A] dark:text-white flex items-center gap-2">
                <Edit3 className="h-4 w-4 text-[#D96B00]" />
                Update Student Information & Academic Marks
              </h3>
              <span className="text-xs text-slate-500 dark:text-slate-400">Persisted securely in Supabase</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Your Name"
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 p-2.5 text-xs font-bold text-slate-900 focus:border-[#0B2A4A] focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              {/* Education Board */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  School Board
                </label>
                <select
                  value={formBoard}
                  onChange={(e) => setFormBoard(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 p-2.5 text-xs font-bold text-slate-900 focus:border-[#0B2A4A] focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                >
                  <option value="">-- Select Board --</option>
                  <option value="CBSE">CBSE (Central Board of Secondary Education)</option>
                  <option value="ICSE / ISC">ICSE / ISC (Council for the Indian School Certificate)</option>
                  <option value="State Board">State Board (Maharashtra, Karnataka, UP, etc.)</option>
                  <option value="IB">IB (International Baccalaureate)</option>
                  <option value="Cambridge">Cambridge (IGCSE / A-Levels)</option>
                  <option value="Other">Other National / International</option>
                </select>
              </div>

              {/* Current Class */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Current Class / Grade
                </label>
                <select
                  value={formClass}
                  onChange={(e) => setFormClass(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 p-2.5 text-xs font-bold text-slate-900 focus:border-[#0B2A4A] focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                >
                  <option value="">-- Not specified --</option>
                  <option value="CLASS_9">Class 9</option>
                  <option value="CLASS_10">Class 10</option>
                  <option value="CLASS_11">Class 11</option>
                  <option value="CLASS_12">Class 12</option>
                  <option value="POST_12">Post-12 / Entrance Repeater</option>
                  <option value="UNDERGRAD">Undergraduate Student</option>
                </select>
              </div>

              {/* Stream */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Current Stream (If 11th / 12th)
                </label>
                <select
                  value={formStream}
                  onChange={(e) => setFormStream(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 p-2.5 text-xs font-bold text-slate-900 focus:border-[#0B2A4A] focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                >
                  <option value="">-- Not decided / Not applicable --</option>
                  <option value="SCIENCE_PCM">Science (Physics, Chemistry, Maths)</option>
                  <option value="SCIENCE_PCB">Science (Physics, Chemistry, Biology)</option>
                  <option value="SCIENCE_PCMB">Science (PCMB with Biology & Maths)</option>
                  <option value="COMMERCE_MATHS">Commerce with Mathematics</option>
                  <option value="COMMERCE_NO_MATHS">Commerce without Mathematics</option>
                  <option value="ARTS">Arts / Humanities</option>
                  <option value="VOCATIONAL">Vocational / Applied</option>
                </select>
              </div>

              {/* 10th Percentage */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  10th Board Percentage (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={formTenth}
                  onChange={(e) => setFormTenth(e.target.value)}
                  placeholder="e.g. 88.5"
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 p-2.5 text-xs font-bold text-slate-900 focus:border-[#0B2A4A] focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              {/* 12th Percentage */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  12th Board Percentage (%) (If completed)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={formTwelfth}
                  onChange={(e) => setFormTwelfth(e.target.value)}
                  placeholder="e.g. 91.2 (or leave empty)"
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 p-2.5 text-xs font-bold text-slate-900 focus:border-[#0B2A4A] focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              {/* Previous Class Percentage */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Previous Academic Year Score (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={formPrevClass}
                  onChange={(e) => setFormPrevClass(e.target.value)}
                  placeholder="e.g. 85.0"
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 p-2.5 text-xs font-bold text-slate-900 focus:border-[#0B2A4A] focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              {/* Interests */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Key Interests (comma-separated)
                </label>
                <input
                  type="text"
                  value={formInterests}
                  onChange={(e) => setFormInterests(e.target.value)}
                  placeholder="AI, Robotics, Economics, Space, Law"
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 p-2.5 text-xs font-bold text-slate-900 focus:border-[#0B2A4A] focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>
            </div>

            {/* About Me */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                About Me (Tell mentors and counselors about your ambitions)
              </label>
              <textarea
                rows={3}
                value={formAboutMe}
                onChange={(e) => setFormAboutMe(e.target.value)}
                placeholder="Write a brief statement about your interests, dreams, favorite subjects, or career questions..."
                className="w-full rounded-xl border border-slate-300 bg-slate-50 p-2.5 text-xs font-medium text-slate-900 focus:border-[#0B2A4A] focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div className="flex items-center gap-3 mt-1">
              <button
                type="submit"
                disabled={savingProfile}
                className="flex items-center gap-2 rounded-xl bg-[#0B2A4A] px-6 py-2.5 font-black text-xs text-white hover:bg-[#071C33] disabled:opacity-50 transition shadow-xs cursor-pointer"
              >
                <Save className="h-4 w-4 text-amber-400" />
                <span>{savingProfile ? 'Saving Changes...' : 'Save Academic Record'}</span>
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 hover:text-slate-950 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 dark:hover:text-white transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Academic Signals Summary Grid */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t-2 border-slate-200 dark:border-slate-800 pt-6">
          <div className="rounded-2xl border-2 border-slate-200 bg-[#F8F9FA] p-4 dark:border-slate-800 dark:bg-slate-800/40">
            <span className="text-[11px] uppercase tracking-wider font-black text-slate-600 dark:text-slate-400 block">Class Level</span>
            <span className="font-black text-slate-950 dark:text-white text-base mt-1 block">
              {formatClass(profile?.currentClass)}
            </span>
          </div>

          <div className="rounded-2xl border-2 border-slate-200 bg-[#F8F9FA] p-4 dark:border-slate-800 dark:bg-slate-800/40">
            <span className="text-[11px] uppercase tracking-wider font-black text-slate-600 dark:text-slate-400 block">10th Percentage</span>
            <span className="font-black text-[#0B2A4A] dark:text-blue-400 text-base mt-1 block">
              {profile?.tenthPercentage != null ? `${profile.tenthPercentage}%` : 'Not provided'}
            </span>
          </div>

          <div className="rounded-2xl border-2 border-slate-200 bg-[#F8F9FA] p-4 dark:border-slate-800 dark:bg-slate-800/40">
            <span className="text-[11px] uppercase tracking-wider font-black text-slate-600 dark:text-slate-400 block">12th Percentage</span>
            <span className="font-black text-slate-950 dark:text-white text-base mt-1 block">
              {profile?.twelfthPercentage != null ? `${profile.twelfthPercentage}%` : 'Not provided'}
            </span>
          </div>

          <div className="rounded-2xl border-2 border-slate-200 bg-[#F8F9FA] p-4 dark:border-slate-800 dark:bg-slate-800/40">
            <span className="text-[11px] uppercase tracking-wider font-black text-slate-600 dark:text-slate-400 block">School Board</span>
            <span className="font-black text-slate-950 dark:text-white text-base mt-1 block">
              {profile?.board || 'Not specified'}
            </span>
          </div>
        </div>

        {profile?.currentStream && (
          <div className="mt-3 flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-400">
            <span>Enrolled Stream:</span>
            <span className="rounded-lg bg-slate-100 px-2.5 py-0.5 font-extrabold text-[#0B2A4A] dark:bg-slate-800 dark:text-blue-300">
              {formatStream(profile.currentStream)}
            </span>
          </div>
        )}
      </div>

      {/* Academic Milestone Tracker */}
      {(() => {
        const milestone1Complete = Boolean(
          profile?.tenthPercentage != null || quizHistory.some((q) => q.quizType?.includes('10'))
        );
        const milestone2Complete = Boolean(profile?.currentStream || quizHistory.length > 0);
        const milestone3Complete = Boolean(savedCareersList.length > 0 || savedCollegesList.length > 0);
        const milestone4Complete = Boolean(bookings.length > 0);

        const completedCount = [
          milestone1Complete,
          milestone2Complete,
          milestone3Complete,
          milestone4Complete,
        ].filter(Boolean).length;
        const progressPct = Math.round((completedCount / 4) * 100);

        const milestones = [
          {
            step: 1,
            title: 'Class 10 Diagnostic',
            subtitle: 'Baseline & Aptitude Calibration',
            description: 'Provide 10th standard scores or complete the stream aptitude evaluation.',
            isDone: milestone1Complete,
            href: '/quiz/post-10th',
            actionText: milestone1Complete ? 'Retake Diagnostic' : 'Start Diagnostic',
            badge: milestone1Complete ? 'Completed' : 'Recommended Next',
          },
          {
            step: 2,
            title: 'Stream Decider & Alignment',
            subtitle: 'PCM • PCB • Commerce • Arts',
            description: 'Evaluate course workloads, subject difficulty curves, and career matches.',
            isDone: milestone2Complete,
            href: '/tools/stream-pivot',
            actionText: milestone2Complete ? 'Explore Stream Pivots' : 'Decide Stream',
            badge: milestone2Complete ? 'Completed' : milestone1Complete ? 'Current Focus' : 'Upcoming',
          },
          {
            step: 3,
            title: 'Entrance & College Calibration',
            subtitle: 'JEE • NEET • CUET • CLAT',
            description: 'Estimate entrance ranks, analyze NIRF cutoffs, and shortlist target institutions.',
            isDone: milestone3Complete,
            href: '/tools/rank-estimator',
            actionText: milestone3Complete ? 'Calibrate Ranks' : 'Estimate Cutoffs',
            badge: milestone3Complete ? 'Completed' : milestone2Complete ? 'Current Focus' : 'Upcoming',
          },
          {
            step: 4,
            title: 'Verified 1-on-1 Mentorship',
            subtitle: 'IIT / IIM / AIIMS Domain Mentors',
            description: 'Schedule a strategic counseling session with vetted professionals.',
            isDone: milestone4Complete,
            href: '/consultants',
            actionText: milestone4Complete ? 'View Sessions' : 'Book Counselor',
            badge: milestone4Complete ? 'Completed' : milestone3Complete ? 'Current Focus' : 'Upcoming',
          },
        ];

        return (
          <div className="rounded-3xl border-2 border-slate-200 bg-white p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b-2 border-slate-100 dark:border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <Compass className="h-5 w-5 text-[#0B2A4A] dark:text-amber-400" />
                  <h2 className="text-xl font-black text-[#0B2A4A] dark:text-white">
                    Academic Milestone Tracker
                  </h2>
                  <span className="rounded-full bg-amber-50 border border-amber-300 px-3 py-0.5 text-xs font-black text-[#D96B00] dark:bg-amber-950 dark:border-amber-800 dark:text-amber-300">
                    {completedCount}/4 Stages Achieved
                  </span>
                </div>
                <p className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 mt-1">
                  Step-by-step roadmap from 10th standard diagnostic to college admission and mentor strategy.
                </p>
              </div>

              {/* Progress gauge bar */}
              <div className="flex flex-col gap-1.5 min-w-[200px]">
                <div className="flex justify-between text-xs font-black text-slate-800 dark:text-slate-200">
                  <span>Journey Progress</span>
                  <span className="text-[#0B2A4A] dark:text-amber-400">{progressPct}%</span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden border border-slate-200 dark:border-slate-700">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-[#0B2A4A] transition-all duration-500 rounded-full"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
              </div>
            </div>

            {/* 4 Timeline Stage Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
              {milestones.map((m) => (
                <div
                  key={m.step}
                  className={`flex flex-col justify-between rounded-2xl border-2 p-5 transition shadow-xs ${
                    m.isDone
                      ? 'border-emerald-200 bg-emerald-50/40 dark:border-emerald-900/60 dark:bg-emerald-950/20'
                      : 'border-slate-200 bg-[#F8F9FA] hover:border-slate-300 dark:border-slate-800 dark:bg-slate-800/40'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-[#0B2A4A] text-xs font-black text-white dark:bg-slate-800">
                        0{m.step}
                      </span>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider ${
                          m.isDone
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800'
                            : m.badge === 'Recommended Next' || m.badge === 'Current Focus'
                            ? 'bg-amber-100 text-amber-800 border border-amber-300 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800'
                            : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
                        }`}
                      >
                        {m.badge}
                      </span>
                    </div>

                    <h3 className="font-black text-slate-900 dark:text-white text-sm">
                      {m.title}
                    </h3>
                    <p className="text-[11px] font-bold text-[#D96B00] dark:text-amber-400 mt-0.5">
                      {m.subtitle}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 font-medium leading-relaxed">
                      {m.description}
                    </p>
                  </div>

                  <div className="pt-4 mt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-bold">
                      {m.isDone ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      ) : (
                        <Clock className="h-4 w-4 text-slate-400 shrink-0" />
                      )}
                      <span className={m.isDone ? 'text-emerald-700 dark:text-emerald-300' : 'text-slate-500'}>
                        {m.isDone ? 'Verified' : 'Pending'}
                      </span>
                    </div>
                    <Link
                      href={m.href}
                      className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-black transition ${
                        m.isDone
                          ? 'text-slate-700 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white'
                          : 'bg-[#0B2A4A] text-white hover:bg-[#071C33]'
                      }`}
                    >
                      <span>{m.actionText}</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })()}

      {/* Quiz Assessment History */}
      <div className="rounded-3xl border-2 border-slate-200 bg-white p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-black text-[#0B2A4A] dark:text-white flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-[#D96B00]" />
            Quiz Assessments & Career Pathways
          </h2>
        </div>

        {quizHistory.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-[#F8F9FA] p-8 text-center dark:border-slate-700 dark:bg-slate-800/40">
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">You haven&apos;t taken a career assessment yet.</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Take an assessment based on your current academic class to discover aligned streams and colleges.</p>
            <div className="mt-4 flex flex-wrap justify-center gap-3">
              <Link
                href="/quiz/post-10th"
                className="rounded-xl bg-[#0B2A4A] px-5 py-2.5 font-black text-xs text-white hover:bg-[#071C33] shadow-sm"
              >
                Class 10 Stream Discovery Quiz →
              </Link>
              <Link
                href="/quiz/post-12th"
                className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 font-black text-xs text-slate-800 hover:bg-slate-100 hover:text-slate-950 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700 dark:hover:text-white transition-colors"
              >
                Post-12th Career Navigator →
              </Link>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {quizHistory.map((quiz) => (
              <div
                key={quiz.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border-2 border-slate-200 bg-[#F8F9FA] p-5 dark:border-slate-800 dark:bg-slate-800/60"
              >
                <div>
                  <div className="flex items-center gap-2.5">
                    <span className="rounded-full bg-blue-50 border border-blue-300 px-3 py-0.5 text-xs font-black text-[#0B2A4A] dark:bg-blue-950 dark:text-blue-200 dark:border-blue-800">
                      {quiz.quizType}
                    </span>
                    <h3 className="font-black text-[#0B2A4A] dark:text-white text-base">
                      {quiz.primaryRecommendation?.title}
                    </h3>
                  </div>
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-2 line-clamp-1">
                    {quiz.primaryRecommendation?.whyItFits}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="rounded-xl bg-white border-2 border-slate-300 px-3.5 py-1.5 text-xs font-black text-[#0B2A4A] dark:bg-slate-900 dark:border-slate-700 dark:text-blue-300">
                    {quiz.primaryRecommendation?.matchPercentage}% Affinity
                  </span>
                  <Link
                    href="/quiz/post-10th"
                    className="rounded-xl bg-[#0B2A4A] px-4 py-2 text-xs font-black text-white hover:bg-[#071C33] shadow-sm transition"
                  >
                    Retake
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 1-on-1 Mentor Sessions */}
      <div className="rounded-3xl border-2 border-slate-200 bg-white p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-xl font-black text-[#0B2A4A] dark:text-white mb-5 flex items-center gap-2">
          <Calendar className="h-5 w-5 text-[#138808]" />
          My Counselor & Mentor Consultations
        </h2>

        {bookings.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-[#F8F9FA] p-8 text-center dark:border-slate-700 dark:bg-slate-800/40">
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">No active mentor consultations booked.</p>
            <Link
              href="/consultants"
              className="mt-4 inline-block rounded-xl bg-[#0B2A4A] px-5 py-2.5 font-black text-xs text-white hover:bg-[#071C33] shadow-sm"
            >
              Browse Verified Domain Mentors
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {bookings.map((b) => (
              <div
                key={b.id}
                className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl border-2 border-slate-200 bg-[#F8F9FA] p-5 dark:border-slate-800 dark:bg-slate-800/60"
              >
                <div>
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="font-black text-[#0B2A4A] dark:text-white text-base">{b.consultantName}</span>
                    <span className="rounded-full bg-blue-50 border border-blue-200 px-2.5 py-0.5 text-xs font-black text-[#0B2A4A] dark:bg-teal-950 dark:text-teal-200 dark:border-teal-800">
                      {b.domain}
                    </span>
                    <span
                      className={`rounded-full px-3 py-0.5 text-xs font-black border ${
                        b.status === 'CONFIRMED'
                          ? 'bg-emerald-50 text-[#138808] border-emerald-300 dark:bg-emerald-950 dark:text-emerald-200'
                          : b.status === 'COMPLETED'
                          ? 'bg-purple-50 text-purple-800 border-purple-200 dark:bg-purple-950 dark:text-purple-200'
                          : b.status === 'CANCELLED'
                          ? 'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950 dark:text-rose-200'
                          : 'bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-200'
                      }`}
                    >
                      {b.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-slate-700 dark:text-slate-300 mt-2 text-xs font-bold flex-wrap">
                    <span>Date: <strong className="text-slate-950 dark:text-white">{b.requestedDate}</strong></span>
                    <span>Slot: <strong className="text-slate-950 dark:text-white">{b.timeSlot}</strong></span>
                  </div>
                  {b.studentNotes && (
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-1 italic">
                      &quot;{b.studentNotes}&quot;
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0 flex-wrap">
                  {b.meetingUrl && b.status !== 'CANCELLED' && (
                    <a
                      href={b.meetingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-1.5 text-xs font-black text-white hover:bg-blue-700 shadow-xs transition"
                    >
                      <Video className="h-3.5 w-3.5" />
                      <span>Join Video Room</span>
                      <ExternalLink className="h-3 w-3 opacity-75" />
                    </a>
                  )}

                  {b.status !== 'CANCELLED' && (
                    <button
                      type="button"
                      onClick={() => {
                        const ics = generateIcsContent({
                          title: `CAREER-GUD Consultation with ${b.consultantName}`,
                          description: `Domain: ${b.domain}\nStudent Notes: ${b.studentNotes || ''}`,
                          date: b.requestedDate,
                          timeSlot: b.timeSlot,
                          meetingUrl: b.meetingUrl,
                        });
                        downloadIcsFile(`consultation-${b.requestedDate}.ics`, ics);
                      }}
                      className="flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-850 dark:text-slate-200 transition"
                      title="Download .ics Calendar Invite"
                    >
                      <Download className="h-3.5 w-3.5 text-emerald-600" />
                      <span>Calendar</span>
                    </button>
                  )}

                  {(b.status === 'REQUESTED' || b.status === 'CONFIRMED') && (
                    <button
                      type="button"
                      onClick={() => handleCancelBooking(b.id)}
                      disabled={cancellingBookingId === b.id}
                      className="flex items-center gap-1 rounded-xl border border-rose-200 bg-white px-3 py-1.5 text-xs font-bold text-rose-700 hover:bg-rose-50 disabled:opacity-50 dark:border-rose-900 dark:bg-slate-855 dark:text-rose-300 transition cursor-pointer"
                    >
                      <XCircle className="h-3.5 w-3.5" />
                      <span>{cancellingBookingId === b.id ? 'Cancelling...' : 'Cancel'}</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bookmarked Careers & Colleges */}
      <div className="rounded-3xl border-2 border-slate-200 bg-white p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4 dark:border-slate-800">
          <div>
            <h2 className="text-xl font-black text-[#0B2A4A] dark:text-white flex items-center gap-2">
              <Bookmark className="h-5 w-5 text-[#D96B00]" />
              Saved Careers & Colleges
            </h2>
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mt-1">
              Your personalized academic portfolio — review roadmaps, NIRF metrics, and entrance prerequisites anytime
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
            <span className="rounded-xl bg-blue-50 border border-blue-200 px-3 py-1 font-black text-[#0B2A4A] dark:bg-blue-950 dark:border-blue-800 dark:text-blue-300">
              {savedCareersList.length} Careers
            </span>
            <span className="rounded-xl bg-emerald-50 border border-emerald-200 px-3 py-1 font-black text-emerald-800 dark:bg-emerald-950 dark:border-emerald-800 dark:text-emerald-300">
              {savedCollegesList.length} Colleges
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 1. Saved Careers List */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="font-black text-slate-950 dark:text-white text-sm flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-[#D96B00]" />
                Saved Career Roadmaps ({savedCareersList.length})
              </span>
              <Link
                href="/careers"
                className="text-xs font-bold text-[#0B2A4A] hover:underline dark:text-blue-400 flex items-center gap-1"
              >
                <span>Browse All</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            {savedCareersList.length === 0 ? (
              <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-[#F8F9FA] p-8 text-center dark:border-slate-800 dark:bg-slate-800/40">
                <Bookmark className="h-8 w-8 text-slate-400 mx-auto mb-2 opacity-50" />
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300">No careers bookmarked yet.</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 max-w-xs mx-auto">
                  Click &ldquo;Save Career Option&rdquo; on any career pathway to save it to your permanent portfolio.
                </p>
                <Link
                  href="/careers"
                  className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-[#0B2A4A] px-4 py-2 text-xs font-bold text-white hover:bg-[#071C33] shadow-xs"
                >
                  <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                  <span>Explore Career Pathways</span>
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {savedCareersList.map((car) => (
                  <div
                    key={car.slug}
                    className="rounded-2xl border-2 border-slate-200 bg-[#F8F9FA] p-4 text-xs dark:border-slate-800 dark:bg-slate-800/50 hover:border-[#0B2A4A] transition-all flex flex-col justify-between gap-3 shadow-xs"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="rounded-md bg-amber-100/80 text-[#D96B00] border border-amber-200 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800">
                          {car.streamLabel || 'Career Pathway'}
                        </span>
                        <h4 className="font-black text-slate-950 dark:text-white text-sm sm:text-base mt-1.5">
                          {car.title}
                        </h4>
                        {car.description && (
                          <p className="text-slate-600 dark:text-slate-300 text-xs mt-1 line-clamp-2 leading-relaxed">
                            {car.description}
                          </p>
                        )}
                      </div>

                      <button
                        onClick={() => handleRemoveBookmark('CAREER', car.slug)}
                        disabled={removingBookmark === car.slug}
                        title="Remove from saved"
                        className="rounded-lg p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition shrink-0 cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-700">
                      <span className="font-bold text-slate-700 dark:text-slate-300 text-xs">
                        Compensation: <strong className="text-slate-950 dark:text-white">{car.avgSalary || 'Verified Industry Pay'}</strong>
                      </span>
                      <Link
                        href={`/careers/${car.slug}`}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-[#0B2A4A] px-3.5 py-1.5 text-xs font-black text-white hover:bg-[#071C33] shadow-xs transition"
                      >
                        <span>View Roadmap</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 2. Saved Colleges List */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="font-black text-slate-950 dark:text-white text-sm flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-[#138808]" />
                Saved Universities & Colleges ({savedCollegesList.length})
              </span>
              <Link
                href="/colleges"
                className="text-xs font-bold text-[#0B2A4A] hover:underline dark:text-blue-400 flex items-center gap-1"
              >
                <span>Browse All</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            {savedCollegesList.length === 0 ? (
              <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-[#F8F9FA] p-8 text-center dark:border-slate-800 dark:bg-slate-800/40">
                <School className="h-8 w-8 text-slate-400 mx-auto mb-2 opacity-50" />
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300">No colleges bookmarked yet.</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 max-w-xs mx-auto">
                  Click &ldquo;Save College&rdquo; on any university profile to save it to your portfolio.
                </p>
                <Link
                  href="/colleges"
                  className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-[#0B2A4A] px-4 py-2 text-xs font-bold text-white hover:bg-[#071C33] shadow-xs"
                >
                  <Building className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Explore Verified Colleges</span>
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {savedCollegesList.map((col) => (
                  <div
                    key={col.slug}
                    className="rounded-2xl border-2 border-slate-200 bg-[#F8F9FA] p-4 text-xs dark:border-slate-800 dark:bg-slate-800/50 hover:border-[#0B2A4A] transition-all flex flex-col justify-between gap-3 shadow-xs"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          {col.nirfRanking > 0 && (
                            <span className="rounded-md bg-emerald-100 text-emerald-950 border border-emerald-300 px-2 py-0.5 text-[10px] font-black uppercase dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800">
                              NIRF #{col.nirfRanking}
                            </span>
                          )}
                          <span className="text-slate-500 text-[11px] font-semibold flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {col.city}{col.state ? `, ${col.state}` : ''}
                          </span>
                        </div>
                        <h4 className="font-black text-slate-950 dark:text-white text-sm sm:text-base mt-1.5">
                          {col.name}
                        </h4>
                      </div>

                      <button
                        onClick={() => handleRemoveBookmark('COLLEGE', col.slug)}
                        disabled={removingBookmark === col.slug}
                        title="Remove from saved"
                        className="rounded-lg p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition shrink-0 cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-700">
                      <span className="font-bold text-slate-700 dark:text-slate-300 text-xs">
                        Avg Package: <strong className="text-emerald-700 dark:text-emerald-400">{col.avgPackage || 'High Placement'}</strong>
                      </span>
                      <Link
                        href={`/colleges/${col.slug}`}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-[#0B2A4A] px-3.5 py-1.5 text-xs font-black text-white hover:bg-[#071C33] shadow-xs transition"
                      >
                        <span>View College</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
