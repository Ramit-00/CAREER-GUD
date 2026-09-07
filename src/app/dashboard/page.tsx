'use client';

import { ConsultationBooking, QuizResult, StudentProfile } from '@/types';
import {
  ArrowRight,
  Bookmark,
  BookOpen,
  Briefcase,
  Calendar,
  CheckCircle2,
  Clock,
  GraduationCap,
  Sparkles,
  User,
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function StudentDashboardPage() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [quizHistory, setQuizHistory] = useState<QuizResult[]>([]);
  const [bookings, setBookings] = useState<ConsultationBooking[]>([]);
  const [loading, setLoading] = useState(true);

  // Edit profile state
  const [isEditing, setIsEditing] = useState(false);
  const [tenthPercentage, setTenthPercentage] = useState<number>(80);
  const [interestsText, setInterestsText] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [profRes, quizRes, bookRes] = await Promise.all([
        fetch('/api/users/me'),
        fetch('/api/quiz/history'),
        fetch('/api/consultants/bookings'),
      ]);

      if (profRes.ok) {
        const p: StudentProfile = await profRes.json();
        setProfile(p);
        setTenthPercentage(p.academicScores?.tenthPercentage ?? 80);
        setInterestsText(p.interests?.join(', ') ?? '');
      }

      if (quizRes.ok) {
        const q: QuizResult[] = await quizRes.json();
        setQuizHistory(q);
      }

      if (bookRes.ok) {
        const b: ConsultationBooking[] = await bookRes.json();
        setBookings(b);
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const parsedInterests = interestsText
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const res = await fetch('/api/users/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          academicScores: { tenthPercentage },
          interests: parsedInterests,
        }),
      });

      if (res.ok) {
        const updated = await res.json();
        setProfile(updated);
        setIsEditing(false);
        alert('Profile updated successfully!');
      }
    } catch (err) {
      console.error('Save profile error:', err);
    } finally {
      setSavingProfile(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 flex flex-col gap-8">
      {/* Header Profile Card */}
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 text-white font-black text-xl shadow-md shadow-indigo-600/20">
              {session?.user?.name?.[0] || 'S'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-slate-900 dark:text-white">
                  {session?.user?.name || 'Aarav Patel'}
                </h1>
                <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-[10px] font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                  Student Account
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{session?.user?.email || 'student@carrer-gud.in'}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200"
            >
              {isEditing ? 'Cancel' : 'Edit Academic Signals'}
            </button>
            <Link
              href="/quiz/post-10th"
              className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-500 transition shadow-sm"
            >
              Take New Quiz
            </Link>
          </div>
        </div>

        {/* Edit Form */}
        {isEditing && (
          <form onSubmit={handleSaveProfile} className="mt-6 border-t border-slate-100 dark:border-slate-800 pt-5 flex flex-col gap-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  10th Percentage: {tenthPercentage}%
                </label>
                <input
                  type="range"
                  min={40}
                  max={99}
                  value={tenthPercentage}
                  onChange={(e) => setTenthPercentage(Number(e.target.value))}
                  className="w-full accent-indigo-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Key Interests (comma separated)
                </label>
                <input
                  type="text"
                  value={interestsText}
                  onChange={(e) => setInterestsText(e.target.value)}
                  placeholder="E.g. AI, Space, Robotics, Economics"
                  className="w-full rounded-xl border border-slate-200 p-2 text-xs focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={savingProfile}
              className="self-start rounded-xl bg-indigo-600 px-4 py-2 font-bold text-white hover:bg-indigo-500 transition"
            >
              {savingProfile ? 'Saving...' : 'Save Signals'}
            </button>
          </form>
        )}

        {/* Academic Signals Summary */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 border-t border-slate-100 dark:border-slate-800 pt-4 text-xs">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Class Level</span>
            <span className="font-bold text-slate-800 dark:text-slate-200 mt-0.5 block">{profile?.currentClass || 'Class 10'}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">10th Baseline</span>
            <span className="font-bold text-indigo-600 dark:text-indigo-400 mt-0.5 block">{profile?.academicScores?.tenthPercentage ?? 84.5}%</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Board</span>
            <span className="font-bold text-slate-800 dark:text-slate-200 mt-0.5 block">{profile?.board || 'CBSE'}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Saved Items</span>
            <span className="font-bold text-teal-600 dark:text-teal-400 mt-0.5 block">
              {(profile?.savedCareers?.length || 0) + (profile?.savedColleges?.length || 0)} Bookmarks
            </span>
          </div>
        </div>
      </div>

      {/* Quiz Assessment History */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-indigo-500" />
            Quiz Assessments & Stream Recommendations
          </h2>
        </div>

        {quizHistory.length === 0 ? (
          <div className="rounded-2xl bg-slate-50 p-6 text-center text-xs text-slate-500 dark:bg-slate-800/40">
            <p>You haven&apos;t taken a stream assessment yet.</p>
            <Link
              href="/quiz/post-10th"
              className="mt-3 inline-block rounded-xl bg-indigo-600 px-4 py-2 font-bold text-white hover:bg-indigo-500"
            >
              Take Class 10 Stream Discovery Quiz
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {quizHistory.map((quiz) => (
              <div
                key={quiz.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50/70 p-4 text-xs dark:border-slate-800 dark:bg-slate-800/40"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-bold text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
                      {quiz.quizType}
                    </span>
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                      {quiz.primaryRecommendation.title}
                    </h3>
                  </div>
                  <p className="text-slate-500 mt-1 line-clamp-1">{quiz.primaryRecommendation.whyItFits}</p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="rounded-xl bg-white border border-slate-200 px-3 py-1 text-xs font-black text-indigo-600 dark:bg-slate-900 dark:border-slate-700">
                    {quiz.primaryRecommendation.matchPercentage}% Affinity
                  </span>
                  <Link
                    href="/quiz/post-10th"
                    className="rounded-xl bg-indigo-600 px-3 py-1 font-bold text-white hover:bg-indigo-500"
                  >
                    Retake
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Booked Consultations */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Calendar className="h-4 w-4 text-teal-500" />
          1-on-1 Mentor Sessions
        </h2>

        {bookings.length === 0 ? (
          <div className="rounded-2xl bg-slate-50 p-6 text-center text-xs text-slate-500 dark:bg-slate-800/40">
            <p>No active mentor bookings.</p>
            <Link
              href="/consultants"
              className="mt-3 inline-block rounded-xl bg-teal-600 px-4 py-2 font-bold text-white hover:bg-teal-500"
            >
              Browse Verified Domain Mentors
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {bookings.map((b) => (
              <div
                key={b.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50/70 p-4 text-xs dark:border-slate-800 dark:bg-slate-800/40"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white text-sm">{b.consultantName}</span>
                    <span className="rounded bg-teal-100 px-1.5 py-0.5 text-[10px] font-bold text-teal-800 dark:bg-teal-950 dark:text-teal-300">
                      {b.domain}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-500 mt-1 text-[11px]">
                    <span>Date: <strong>{b.requestedDate}</strong></span>
                    <span>Slot: <strong>{b.timeSlot}</strong></span>
                  </div>
                </div>

                <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 shrink-0 self-start sm:self-auto">
                  {b.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bookmarked Careers & Colleges */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Bookmark className="h-4 w-4 text-amber-500" />
          Saved Careers & Colleges
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/40">
            <span className="font-bold text-slate-700 dark:text-slate-300 block mb-2">Saved Careers:</span>
            {profile?.savedCareers && profile.savedCareers.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {profile.savedCareers.map((slug) => (
                  <Link
                    key={slug}
                    href={`/careers/${slug}`}
                    className="rounded-lg bg-white border border-slate-200 px-2.5 py-1 font-semibold text-indigo-600 hover:border-indigo-400 dark:bg-slate-900 dark:border-slate-700 dark:text-indigo-400"
                  >
                    {slug} →
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-slate-400">No careers saved yet.</p>
            )}
          </div>

          <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/40">
            <span className="font-bold text-slate-700 dark:text-slate-300 block mb-2">Saved Colleges:</span>
            {profile?.savedColleges && profile.savedColleges.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {profile.savedColleges.map((slug) => (
                  <Link
                    key={slug}
                    href={`/colleges/${slug}`}
                    className="rounded-lg bg-white border border-slate-200 px-2.5 py-1 font-semibold text-teal-600 hover:border-teal-400 dark:bg-slate-900 dark:border-slate-700 dark:text-teal-400"
                  >
                    {slug} →
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-slate-400">No colleges saved yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
