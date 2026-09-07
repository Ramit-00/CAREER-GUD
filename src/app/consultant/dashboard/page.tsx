'use client';

import { ConsultationBooking } from '@/types';
import {
  Briefcase,
  Calendar,
  CheckCircle2,
  Clock,
  GraduationCap,
  Mail,
  ShieldCheck,
  User,
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

export default function ConsultantDashboardPage() {
  const { data: session } = useSession();
  const [bookings, setBookings] = useState<ConsultationBooking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/consultants/bookings');
      if (res.ok) {
        const data = await res.json();
        setBookings(data);
      }
    } catch (err) {
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 flex flex-col gap-8">
      {/* Header */}
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="h-4 w-4" />
              <span>Consultant Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
              Welcome, {session?.user?.name || 'Mentor'}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Review upcoming student consultations and examine their pre-shared assessment profiles.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-slate-50 border border-slate-200 p-3 text-center dark:bg-slate-800 dark:border-slate-700">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Sessions</span>
              <span className="text-lg font-black text-slate-900 dark:text-white">{bookings.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bookings Section */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">
          Student Consultation Requests
        </h2>

        {loading ? (
          <div className="py-12 text-center text-xs text-slate-500">
            Loading consultations...
          </div>
        ) : bookings.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-500">
            No active student consultations yet.
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 text-xs dark:border-slate-800 dark:bg-slate-800/40"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 pb-3 dark:border-slate-700">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-indigo-500" />
                    <span className="font-bold text-slate-900 dark:text-white text-sm">{booking.studentName}</span>
                    <span className="text-slate-400 font-normal">({booking.studentEmail})</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="rounded-full bg-teal-100 px-2.5 py-0.5 text-[10px] font-bold text-teal-800 dark:bg-teal-950 dark:text-teal-300">
                      Domain: {booking.domain}
                    </span>
                    <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      {booking.status}
                    </span>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-4 text-slate-600 dark:text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-slate-400" />
                    Date: <strong>{booking.requestedDate}</strong>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-slate-400" />
                    Slot: <strong>{booking.timeSlot}</strong>
                  </span>
                </div>

                <div className="mt-3 rounded-xl bg-white p-3 border border-slate-200 dark:bg-slate-900 dark:border-slate-700">
                  <strong className="text-slate-900 dark:text-white block mb-1">Student Context & Question:</strong>
                  <p className="text-slate-600 dark:text-slate-300">{booking.studentNotes}</p>
                </div>

                {/* Pre-Shared Profile Signals */}
                {booking.sharedProfileSummary && (
                  <div className="mt-3 rounded-xl bg-indigo-50/60 p-3 border border-indigo-100 dark:bg-indigo-950/30 dark:border-indigo-900 text-slate-700 dark:text-slate-300">
                    <strong className="text-indigo-900 dark:text-indigo-300 block mb-1.5">
                      📊 Pre-Shared Assessment Profile:
                    </strong>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                      <div>Class: <strong>{booking.sharedProfileSummary.currentClass}</strong></div>
                      <div>10th Score: <strong>{booking.sharedProfileSummary.tenthScore}%</strong></div>
                      <div>Top Interests: <strong>{booking.sharedProfileSummary.topInterests?.join(', ')}</strong></div>
                      <div>Top Strengths: <strong>{booking.sharedProfileSummary.topStrengths?.join(', ')}</strong></div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
