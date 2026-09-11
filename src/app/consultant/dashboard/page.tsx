'use client';

import { ConsultationBooking } from '@/types';
import {
  ArrowRight,
  Bookmark,
  Briefcase,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  ExternalLink,
  FileText,
  GraduationCap,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  User,
  Video,
  XCircle,
} from 'lucide-react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { downloadIcsFile, generateIcsContent } from '@/lib/calendar';

interface SavedCareerItem {
  slug: string;
  title: string;
  streamLabel: string;
  avgSalary?: string;
  description?: string;
}

interface SavedCollegeItem {
  slug: string;
  name: string;
  city: string;
  state: string;
  nirfRanking: number;
  avgPackage?: string;
}

export default function ConsultantDashboardPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [bookings, setBookings] = useState<ConsultationBooking[]>([]);
  const [savedCareersList, setSavedCareersList] = useState<SavedCareerItem[]>([]);
  const [savedCollegesList, setSavedCollegesList] = useState<SavedCollegeItem[]>([]);
  const [removingBookmark, setRemovingBookmark] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [bookRes, bookmarkRes] = await Promise.all([
        fetch('/api/consultants/bookings'),
        fetch('/api/bookmarks'),
      ]);

      if (bookRes.ok) {
        const data = await bookRes.json();
        setBookings(data || []);
      }

      if (bookmarkRes.ok) {
        const bData = await bookmarkRes.json();
        setSavedCareersList(bData.careers || []);
        setSavedCollegesList(bData.colleges || []);
      }
    } catch (err) {
      console.error('Error fetching consultant dashboard:', err);
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
      const userRole = (session?.user as any)?.role;
      if (userRole === 'STUDENT') {
        router.replace('/dashboard');
      } else if (userRole === 'ADMIN') {
        router.replace('/admin/overview');
      } else {
        fetchDashboardData();
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
        } else {
          setSavedCollegesList((prev) => prev.filter((c) => c.slug !== slug));
        }
      }
    } catch (err) {
      console.error('Failed to remove bookmark:', err);
    } finally {
      setRemovingBookmark(null);
    }
  };

  const handleUpdateStatus = async (bookingId: string, newStatus: ConsultationBooking['status']) => {
    setUpdatingId(bookingId);
    try {
      const res = await fetch('/api/consultants/bookings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId, status: newStatus }),
      });

      if (res.ok) {
        setBookings((prev) =>
          prev.map((b) => (b.id === bookingId ? { ...b, status: newStatus } : b))
        );
      }
    } catch (err) {
      console.error('Status update failed:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  const completedCount = bookings.filter((b) => b.status === 'COMPLETED').length;
  const estEarnings = completedCount * 1200; // Estimated INR earnings per completed session

  const verificationStatus = (session?.user as any)?.verificationStatus || 'VERIFIED';

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8 flex flex-col gap-8">
      {/* Verification Status Banner */}
      {verificationStatus === 'PENDING' ? (
        <div className="flex items-center gap-3 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-xs sm:text-sm font-bold text-amber-900">
          <ShieldAlert className="h-6 w-6 text-amber-600 shrink-0" />
          <div>
            <p className="font-extrabold text-sm">Counselor Audit in Progress</p>
            <p className="font-medium text-xs text-amber-800">
              Your professional credentials and experience documents are being reviewed by CAREER-GUD governance. Once approved, your profile will be publicly bookable.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3 rounded-2xl border border-emerald-300 bg-emerald-50/80 p-4 text-xs sm:text-sm font-bold text-emerald-950">
          <ShieldCheck className="h-6 w-6 text-emerald-600 shrink-0" />
          <div>
            <span className="inline-block px-2.5 py-0.5 rounded-md bg-emerald-200 text-emerald-900 text-[10px] font-black uppercase tracking-wider mb-0.5">
              Verified Career Counselor
            </span>
            <p className="font-semibold text-xs text-emerald-900">
              Your credentials have been audited and approved. You are actively receiving student consultation requests.
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-emerald-700">
              <Briefcase className="h-4 w-4" />
              <span>Advisory Practice Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-950 mt-1.5 tracking-tight">
              Welcome, {session?.user?.name || 'Career Mentor'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 font-normal leading-relaxed">
              Manage student mentorship bookings, evaluate academic profiles, and conduct career guidance sessions.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="rounded-2xl bg-slate-100 border border-slate-200 p-3.5 text-center shadow-xs min-w-[100px]">
              <span className="text-[10px] uppercase font-black text-slate-600 block">Total Requests</span>
              <span className="text-xl font-black text-slate-950">{bookings.length}</span>
            </div>
            <div className="rounded-2xl bg-slate-100 border border-slate-200 p-3.5 text-center shadow-xs min-w-[100px]">
              <span className="text-[10px] uppercase font-black text-emerald-700 block">Completed</span>
              <span className="text-xl font-black text-emerald-700">{completedCount}</span>
            </div>
            <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-3.5 text-center shadow-xs min-w-[110px]">
              <span className="text-[10px] uppercase font-black text-emerald-800 block">Est. Revenue</span>
              <span className="text-xl font-black text-emerald-900">₹{estEarnings.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bookings Section */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl sm:text-2xl font-black text-slate-950 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-emerald-600" />
            Student Consultation Appointments
          </h2>
          <span className="text-xs font-bold text-slate-600">
            {bookings.length} Appointment{bookings.length === 1 ? '' : 's'}
          </span>
        </div>

        {loading ? (
          <div className="py-16 text-center text-sm font-bold text-slate-700">
            <span className="animate-spin inline-block h-6 w-6 border-3 border-emerald-600 border-t-transparent rounded-full mb-3" />
            <p>Loading consultation pipeline...</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="py-16 text-center text-sm font-bold text-slate-700">
            <p>No student consultation requests received yet.</p>
            <p className="text-xs text-slate-500 mt-1">Students browsing the mentor directory will appear here when they request appointments.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-xs sm:text-sm"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-900 font-bold">
                      <User className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="font-black text-slate-950 text-base block">{booking.studentName}</span>
                      <span className="text-slate-600 text-xs font-semibold">{booking.studentEmail}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="rounded-lg bg-blue-100 px-3 py-1 text-xs font-black text-blue-900 border border-blue-200">
                      Domain: {booking.domain}
                    </span>
                    <span
                      className={`rounded-lg px-3 py-1 text-xs font-black border ${
                        booking.status === 'COMPLETED'
                          ? 'bg-blue-100 text-[#0B2A4A] border-blue-200'
                          : booking.status === 'CONFIRMED'
                          ? 'bg-emerald-100 text-[#138808] border-emerald-300'
                          : 'bg-amber-100 text-amber-900 border-amber-300'
                      }`}
                    >
                      {booking.status}
                    </span>
                  </div>
                </div>

                <div className="mt-3.5 flex flex-wrap gap-5 text-slate-800 font-medium">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-emerald-600" />
                    Requested Date: <strong className="font-bold text-slate-950">{booking.requestedDate}</strong>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-emerald-600" />
                    Time Slot: <strong className="font-bold text-slate-950">{booking.timeSlot}</strong>
                  </span>
                </div>

                {booking.studentNotes && (
                  <div className="mt-3.5 rounded-xl bg-white p-4 border border-slate-200 shadow-xs">
                    <strong className="text-slate-950 block mb-1 font-bold text-xs">Student Inquiries & Academic Goals:</strong>
                    <p className="text-slate-700 font-normal leading-relaxed">{booking.studentNotes}</p>
                  </div>
                )}

                {/* Pre-Shared Profile Signals */}
                {booking.sharedProfileSummary && (
                  <div className="mt-3.5 rounded-xl bg-slate-200/70 p-4 border border-slate-300 text-slate-800 font-medium">
                    <strong className="text-slate-950 flex items-center gap-1.5 mb-2 text-xs font-bold">
                      <FileText className="h-4 w-4 text-emerald-600" />
                      Pre-Shared Student Profile Record:
                    </strong>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      <div>Class: <strong className="font-bold text-slate-950">{booking.sharedProfileSummary.currentClass || 'Not specified'}</strong></div>
                      <div>10th Score: <strong className="font-bold text-slate-950">{booking.sharedProfileSummary.tenthScore != null ? `${booking.sharedProfileSummary.tenthScore}%` : 'Not provided'}</strong></div>
                      <div>Interests: <strong className="font-bold text-slate-950">{booking.sharedProfileSummary.topInterests?.join(', ') || 'None listed'}</strong></div>
                      <div>Strengths: <strong className="font-bold text-slate-950">{booking.sharedProfileSummary.topStrengths?.join(', ') || 'None listed'}</strong></div>
                    </div>
                  </div>
                )}

                {/* Advisor Status Actions & Meeting Room */}
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200">
                  <div className="flex items-center gap-2 flex-wrap">
                    {booking.meetingUrl && booking.status !== 'CANCELLED' && (
                      <a
                        href={booking.meetingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-1.5 text-xs font-black text-white hover:bg-blue-700 transition shadow-xs"
                      >
                        <Video className="h-3.5 w-3.5" />
                        <span>Join Video Room</span>
                        <ExternalLink className="h-3 w-3 opacity-75" />
                      </a>
                    )}

                    {booking.status !== 'CANCELLED' && (
                      <button
                        type="button"
                        onClick={() => {
                          const ics = generateIcsContent({
                            title: `CAREER-GUD Consultation with ${booking.studentName}`,
                            description: `Domain: ${booking.domain}\nStudent Notes: ${booking.studentNotes || ''}`,
                            date: booking.requestedDate,
                            timeSlot: booking.timeSlot,
                            meetingUrl: booking.meetingUrl,
                          });
                          downloadIcsFile(`consultation-${booking.requestedDate}.ics`, ics);
                        }}
                        className="flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                        title="Download .ics Calendar Invite"
                      >
                        <Download className="h-3.5 w-3.5 text-emerald-600" />
                        <span>Calendar Invite</span>
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-2 flex-wrap ml-auto">
                    {booking.status === 'REQUESTED' && (
                      <button
                        onClick={() => handleUpdateStatus(booking.id, 'CONFIRMED')}
                        disabled={updatingId === booking.id}
                        className="flex items-center gap-1.5 rounded-xl bg-[#0B2A4A] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-[#071C33] disabled:opacity-50 transition cursor-pointer"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                        <span>{updatingId === booking.id ? 'Confirming...' : 'Confirm Appointment'}</span>
                      </button>
                    )}
                    {booking.status === 'CONFIRMED' && (
                      <button
                        onClick={() => handleUpdateStatus(booking.id, 'COMPLETED')}
                        disabled={updatingId === booking.id}
                        className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 disabled:opacity-50 transition cursor-pointer"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>{updatingId === booking.id ? 'Updating...' : 'Mark Completed'}</span>
                      </button>
                    )}
                    {booking.status !== 'CANCELLED' && booking.status !== 'COMPLETED' && (
                      <button
                        onClick={() => handleUpdateStatus(booking.id, 'CANCELLED')}
                        disabled={updatingId === booking.id}
                        className="flex items-center gap-1.5 rounded-xl border border-red-300 bg-white px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50 disabled:opacity-50 transition cursor-pointer"
                      >
                        <XCircle className="h-3.5 w-3.5" />
                        <span>Cancel</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Advisor Saved Reference Careers & Colleges */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-xl font-black text-[#0B2A4A] flex items-center gap-2">
              <Bookmark className="h-5 w-5 text-emerald-600" />
              Advisor Reference Portfolio (Saved Careers & Colleges)
            </h2>
            <p className="text-xs font-semibold text-slate-600 mt-1">
              Curate and access high-demand career pathways and university profiles for quick reference during student consultations
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
            <span className="rounded-xl bg-blue-50 border border-blue-200 px-3 py-1 font-black text-[#0B2A4A]">
              {savedCareersList.length} Careers
            </span>
            <span className="rounded-xl bg-emerald-50 border border-emerald-200 px-3 py-1 font-black text-emerald-800">
              {savedCollegesList.length} Colleges
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Saved Careers */}
          <div className="flex flex-col gap-3">
            <span className="font-black text-slate-950 text-sm flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-[#D96B00]" />
              Saved Careers ({savedCareersList.length})
            </span>
            {savedCareersList.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center rounded-2xl border-2 border-dashed border-slate-200">
                No career references bookmarked yet.
              </p>
            ) : (
              <div className="flex flex-col gap-3">
                {savedCareersList.map((car) => (
                  <div
                    key={car.slug}
                    className="rounded-2xl border-2 border-slate-300 bg-[#EAEFF5] p-4 text-xs hover:border-[#0B2A4A] transition-all flex flex-col justify-between gap-3 shadow-xs"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="rounded-md bg-amber-100 text-[#D96B00] border border-amber-200 px-2 py-0.5 text-[10px] font-black uppercase">
                          {car.streamLabel}
                        </span>
                        <h4 className="font-black text-slate-950 text-sm mt-1.5">{car.title}</h4>
                      </div>
                      <button
                        onClick={() => handleRemoveBookmark('CAREER', car.slug)}
                        disabled={removingBookmark === car.slug}
                        className="rounded-lg p-1.5 text-slate-400 hover:text-red-600 transition cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                      <span className="font-bold text-slate-700">Pay: {car.avgSalary || 'Industry Average'}</span>
                      <Link
                        href={`/careers/${car.slug}`}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-[#0B2A4A] px-3 py-1 text-xs font-black text-white hover:bg-[#071C33]"
                      >
                        <span>View Details</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Saved Colleges */}
          <div className="flex flex-col gap-3">
            <span className="font-black text-slate-950 text-sm flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-[#138808]" />
              Saved Colleges ({savedCollegesList.length})
            </span>
            {savedCollegesList.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center rounded-2xl border-2 border-dashed border-slate-200">
                No college references bookmarked yet.
              </p>
            ) : (
              <div className="flex flex-col gap-3">
                {savedCollegesList.map((col) => (
                  <div
                    key={col.slug}
                    className="rounded-2xl border-2 border-slate-300 bg-[#EAEFF5] p-4 text-xs hover:border-[#0B2A4A] transition-all flex flex-col justify-between gap-3 shadow-xs"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-slate-600 text-[11px] font-semibold">{col.city}, {col.state}</span>
                        <h4 className="font-black text-slate-950 text-sm mt-1">{col.name}</h4>
                      </div>
                      <button
                        onClick={() => handleRemoveBookmark('COLLEGE', col.slug)}
                        disabled={removingBookmark === col.slug}
                        className="rounded-lg p-1.5 text-slate-400 hover:text-red-600 transition cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                      <span className="font-bold text-slate-700">Package: {col.avgPackage || 'High'}</span>
                      <Link
                        href={`/colleges/${col.slug}`}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-[#0B2A4A] px-3 py-1 text-xs font-black text-white hover:bg-[#071C33]"
                      >
                        <span>View Profile</span>
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

