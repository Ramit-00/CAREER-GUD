'use client';

import { ConsultantDomain, ConsultantProfile, ConsultationBooking } from '@/types';
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Download,
  ExternalLink,
  GraduationCap,
  Lock,
  ShieldCheck,
  Star,
  Video,
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { downloadIcsFile, generateGoogleCalendarUrl, generateIcsContent } from '@/lib/calendar';

export default function ConsultantDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { data: session } = useSession();
  const userRole = (session?.user as any)?.role;
  const isConsultant = session && userRole === 'CONSULTANT';
  const isStudent = session && (userRole === 'STUDENT' || userRole === 'ADMIN');

  const [consultant, setConsultant] = useState<ConsultantProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Booking Form State
  const [selectedDomain, setSelectedDomain] = useState<ConsultantDomain | null>(null);
  const [requestedDate, setRequestedDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [timeSlot, setTimeSlot] = useState('17:00 - 17:45 IST');
  const [studentNotes, setStudentNotes] = useState('');
  const [shareProfile, setShareProfile] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<ConsultationBooking | null>(null);

  const fetchConsultant = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/consultants/${id}`);
      if (res.ok) {
        const data: ConsultantProfile = await res.json();
        setConsultant(data);
        const firstVerified = data.domainVerifications.find((v) => v.status === 'VERIFIED');
        if (firstVerified) {
          setSelectedDomain(firstVerified.domain);
        }
      }
    } catch (err) {
      console.error('Error fetching consultant:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    if (document.documentElement) document.documentElement.scrollTop = 0;
    if (document.body) document.body.scrollTop = 0;
    fetchConsultant();
  }, [id]);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookingError(null);
    if (!session) {
      router.push(`/login?callbackUrl=/consultants/${id}`);
      return;
    }

    const userRole = (session?.user as any)?.role;
    if (userRole === 'CONSULTANT') {
      setBookingError('Consultation booking is exclusively reserved for student accounts. Advisor accounts cannot book consultations.');
      return;
    }

    if (!selectedDomain) {
      setBookingError('Please select a verified domain for this consultation.');
      return;
    }

    setBookingLoading(true);
    try {
      const res = await fetch('/api/consultants/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          consultantId: consultant?.id,
          consultantName: consultant?.name,
          domain: selectedDomain,
          requestedDate,
          timeSlot,
          studentNotes,
          shareProfile,
        }),
      });

      const resData = await res.json();
      if (!res.ok) {
        throw new Error(resData.error || 'Booking request failed');
      }

      setConfirmedBooking(resData);
      setBookingSuccess(true);
    } catch (err: any) {
      console.error('Booking error:', err);
      setBookingError(err.message || 'Failed to submit booking. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center text-sm font-semibold text-slate-700">
        <span className="animate-spin inline-block h-6 w-6 border-2 border-[#0B2A4A] border-t-transparent rounded-full mb-3" />
        <p>Loading mentor credentials...</p>
      </div>
    );
  }

  if (!consultant) {
    return (
      <div className="py-24 text-center">
        <h2 className="text-xl font-bold text-[#0B2A4A]">Mentor Profile Not Found</h2>
        <Link href="/consultants" className="mt-4 inline-block text-[#0B2A4A] font-bold hover:underline">
          Back to Mentors Directory
        </Link>
      </div>
    );
  }

  const verifiedDomains = consultant.domainVerifications.filter((v) => v.status === 'VERIFIED');

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 flex flex-col gap-8">
      <div>
        <Link
          href="/consultants"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Verified Mentors
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card (2 cols) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xs">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-3xl sm:text-4xl font-black text-[#0B2A4A] tracking-tight">
                  {consultant.name}
                </h1>
                <p className="text-sm sm:text-base font-bold text-[#0B2A4A] mt-1">
                  {consultant.headline}
                </p>
                <p className="text-xs sm:text-sm font-semibold text-slate-700 mt-1">
                  {consultant.currentRole} • {consultant.experienceYears} Years Professional Experience
                </p>
              </div>

              <div className="flex items-center gap-1.5 rounded-xl bg-amber-50 border border-amber-200 px-3 py-1.5 text-xs sm:text-sm font-black text-amber-800 shadow-xs">
                <Star className="h-4 w-4 fill-amber-400 text-amber-500" />
                <span>{consultant.rating} ({consultant.reviewCount} Sessions)</span>
              </div>
            </div>

            <div className="mt-6 border-t border-slate-100 pt-5">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 mb-2">
                About the Mentor
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                {consultant.bio}
              </p>
            </div>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-100 pt-5 text-xs sm:text-sm">
              <div className="rounded-xl bg-slate-100 p-3.5 border border-slate-200">
                <span className="font-black text-slate-700 uppercase text-xs block">Alma Mater</span>
                <span className="font-bold text-slate-950 mt-1 block text-sm">{consultant.almaMater}</span>
              </div>
              <div className="rounded-xl bg-slate-100 p-3.5 border border-slate-200">
                <span className="font-black text-slate-700 uppercase text-xs block">Highest Degree</span>
                <span className="font-bold text-slate-950 mt-1 block text-sm">{consultant.highestEducation}</span>
              </div>
            </div>

            {/* Per-Domain Verification Table */}
            <div className="mt-6 border-t border-slate-100 pt-5">
              <div className="flex items-center gap-2 mb-3">
                <ShieldCheck className="h-5 w-5 text-[#138808]" />
                <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-[#0B2A4A]">
                  Domain Verification Audit Status
                </h3>
              </div>

              <div className="flex flex-col gap-2.5">
                {consultant.domainVerifications.map((v, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-xl border border-slate-200 bg-slate-100 p-3.5 text-xs sm:text-sm"
                  >
                    <div>
                      <strong className="text-slate-950 font-bold">{v.domain} Guidance:</strong>
                      <span className="text-slate-700 ml-2 font-medium">{v.proofDescription}</span>
                    </div>

                    <span
                      className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-black shrink-0 self-start sm:self-auto border ${
                        v.status === 'VERIFIED'
                          ? 'bg-emerald-50 text-[#138808] border-emerald-300'
                          : v.status === 'REJECTED'
                          ? 'bg-rose-100 text-rose-900 border-rose-300'
                          : 'bg-amber-100 text-amber-900 border-amber-300'
                      }`}
                    >
                      {v.status === 'VERIFIED' ? (
                        <>
                          <CheckCircle2 className="h-3.5 w-3.5 text-[#138808]" />
                          <span>Verified & Bookable</span>
                        </>
                      ) : (
                        v.status
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Booking Form (1 col) */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs h-fit">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <span className="text-xs font-black uppercase tracking-wider text-slate-700">Consultation Fee</span>
            <span className="text-2xl font-black text-slate-950">
              ₹{consultant.feePerSessionINR}{' '}
              <span className="text-xs font-bold text-slate-500">/ 45 mins</span>
            </span>
          </div>

          {bookingSuccess ? (
            <div className="mt-6 rounded-2xl bg-emerald-50 border border-emerald-200 p-6 text-xs text-left">
              <div className="text-center mb-4">
                <CheckCircle2 className="h-10 w-10 text-emerald-600 mx-auto mb-2" />
                <h4 className="font-black text-emerald-950 text-base">Consultation Confirmed!</h4>
                <p className="text-emerald-800 mt-1 font-medium leading-relaxed">
                  Your 1-on-1 session with <strong className="font-bold text-emerald-950">{consultant.name}</strong> is scheduled.
                </p>
              </div>

              {/* Slot & Meeting Details */}
              <div className="rounded-xl bg-white p-3.5 border border-emerald-200 flex flex-col gap-2 mb-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600 font-semibold">Date & Time:</span>
                  <span className="font-black text-slate-950">{requestedDate} • {timeSlot}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600 font-semibold">Domain:</span>
                  <span className="font-bold text-[#0B2A4A]">{selectedDomain}</span>
                </div>
                {confirmedBooking?.meetingUrl && (
                  <div className="pt-2 border-t border-slate-100">
                    <span className="text-[11px] uppercase tracking-wider font-black text-slate-600 block mb-1">
                      Private Video Meeting Room
                    </span>
                    <a
                      href={confirmedBooking.meetingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-black text-white hover:bg-blue-700 transition shadow-xs w-full"
                    >
                      <Video className="h-4 w-4" />
                      <span>Join Jitsi Video Room</span>
                      <ExternalLink className="h-3.5 w-3.5 opacity-80" />
                    </a>
                  </div>
                )}
              </div>

              {/* Calendar Sync Actions */}
              <div className="flex flex-col gap-2 mb-4">
                {confirmedBooking && (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        const ics = generateIcsContent({
                          title: `CAREER-GUD Consultation with ${consultant.name}`,
                          description: `Domain: ${selectedDomain}\nNotes: ${studentNotes}`,
                          date: requestedDate,
                          timeSlot: timeSlot,
                          meetingUrl: confirmedBooking.meetingUrl,
                        });
                        downloadIcsFile(`consultation-${consultant.name.replace(/\s+/g, '-').toLowerCase()}-${requestedDate}.ics`, ics);
                      }}
                      className="flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-800 hover:bg-slate-100 transition cursor-pointer"
                    >
                      <Download className="h-3.5 w-3.5 text-emerald-600" />
                      <span>Download .ics Calendar Invite</span>
                    </button>

                    <a
                      href={generateGoogleCalendarUrl({
                        title: `CAREER-GUD Consultation: ${consultant.name} (${selectedDomain})`,
                        description: `Career Guidance session with ${consultant.name}.\n\nQuestions/Notes: ${studentNotes}`,
                        date: requestedDate,
                        timeSlot: timeSlot,
                        meetingUrl: confirmedBooking.meetingUrl,
                      })}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-800 hover:bg-slate-100 transition"
                    >
                      <Calendar className="h-3.5 w-3.5 text-blue-600" />
                      <span>Add to Google Calendar</span>
                      <ExternalLink className="h-3 w-3 opacity-70" />
                    </a>
                  </>
                )}
              </div>

              <div className="flex items-center justify-between gap-2 pt-2 border-t border-emerald-200">
                <button
                  type="button"
                  onClick={() => {
                    setBookingSuccess(false);
                    setConfirmedBooking(null);
                  }}
                  className="text-xs font-bold text-slate-600 hover:text-slate-900"
                >
                  ← Book Another
                </button>
                <Link
                  href="/dashboard"
                  className="rounded-xl bg-[#0B2A4A] px-4 py-2 text-xs font-bold text-white hover:bg-[#071C33] shadow-xs"
                >
                  Student Dashboard →
                </Link>
              </div>
            </div>
          ) : !session ? (
            <div className="mt-6 rounded-2xl border-2 border-slate-300 bg-[#EAEFF5] p-6 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0B2A4A] text-white shadow-xs">
                <GraduationCap className="h-6 w-6 text-amber-400" />
              </div>
              <div className="inline-flex items-center gap-1.5 rounded-md bg-amber-100 border border-amber-300 px-2.5 py-0.5 text-[11px] font-black text-amber-900 mb-2">
                <Lock className="h-3 w-3 text-amber-700" />
                <span>Student Authentication Required</span>
              </div>
              <h4 className="text-base font-black text-slate-950">Book 1-on-1 Consultation</h4>
              <p className="mt-2 text-xs leading-relaxed text-slate-700 font-medium">
                Consultation sessions with certified mentors are exclusively reserved for registered students. Sign in with your student account to schedule a session and automatically share your quiz results with <strong className="font-bold text-slate-950">{consultant.name}</strong>.
              </p>
              <div className="mt-5 flex flex-col gap-2.5">
                <Link
                  href={`/login?callbackUrl=/consultants/${id}`}
                  className="flex items-center justify-center gap-2 rounded-xl bg-[#0B2A4A] px-4 py-3 text-xs sm:text-sm font-black text-white hover:bg-[#071C33] transition shadow-xs cursor-pointer"
                >
                  <span>Sign In as Student to Book</span>
                  <ArrowLeft className="h-4 w-4 rotate-180" />
                </Link>
                <Link
                  href="/register"
                  className="text-xs font-bold text-slate-700 hover:text-[#0B2A4A] transition py-1"
                >
                  New student? <span className="underline font-black text-[#0B2A4A]">Create a Free Student Account</span>
                </Link>
              </div>
            </div>
          ) : isConsultant ? (
            <div className="mt-6 rounded-2xl border-2 border-amber-300 bg-amber-50 p-6 text-left">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-200/80 text-amber-900 shadow-2xs">
                  <ShieldCheck className="h-5 w-5 text-amber-700" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-amber-950">Advisor Account Detected</h4>
                  <p className="mt-1 text-xs leading-relaxed text-amber-900 font-medium">
                    You are currently signed in as an <strong>Academic Advisor / Consultant</strong>. Consultation bookings are exclusively reserved for students seeking guidance.
                  </p>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-amber-200 flex flex-col gap-2">
                <Link
                  href="/consultant/dashboard"
                  className="flex items-center justify-center gap-2 rounded-xl bg-[#0B2A4A] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#071C33] transition shadow-xs cursor-pointer"
                >
                  <span>Go to Advisory Portal</span>
                </Link>
                <p className="text-[11px] text-center text-amber-800 font-medium mt-1">
                  To book guidance sessions, please sign in using a student account.
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleBooking} className="mt-6 flex flex-col gap-4 text-xs sm:text-sm">
              <div className="flex items-center justify-between rounded-xl bg-emerald-50 border border-emerald-300 px-3.5 py-2 text-xs">
                <div className="flex items-center gap-2 min-w-0">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span className="font-bold text-emerald-950 truncate">
                    Booking as: <strong className="font-black text-slate-950">{session?.user?.name || 'Student'}</strong>
                  </span>
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider rounded-md bg-emerald-200 px-1.5 py-0.5 text-emerald-900 shrink-0 ml-2">
                  Student Account
                </span>
              </div>
              {bookingError && (
                <div className="flex items-start gap-2.5 rounded-xl border border-red-300 bg-red-50 p-3 text-xs font-semibold text-red-900">
                  <AlertCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
                  <span>{bookingError}</span>
                </div>
              )}
              <div>
                <label className="block font-black text-slate-900 mb-2">
                  Select Verified Domain
                </label>
                <div className="flex flex-col gap-2">
                  {verifiedDomains.map((vd) => (
                    <label
                      key={vd.domain}
                      className={`flex items-center gap-2.5 rounded-xl border p-3 cursor-pointer transition ${
                        selectedDomain === vd.domain
                          ? 'border-[#0B2A4A] bg-blue-50/80 text-[#0B2A4A]'
                          : 'border-slate-300 bg-white hover:bg-slate-100 hover:border-slate-400'
                      }`}
                    >
                      <input
                        type="radio"
                        name="consultationDomain"
                        value={vd.domain}
                        checked={selectedDomain === vd.domain}
                        onChange={() => setSelectedDomain(vd.domain)}
                        className="accent-[#0B2A4A] h-4 w-4"
                      />
                      <span className="font-bold text-slate-950">{vd.domain}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-black text-slate-900 mb-1.5">
                  Preferred Date
                </label>
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={requestedDate}
                  onChange={(e) => setRequestedDate(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white p-2.5 font-semibold text-slate-900 focus:border-[#0B2A4A] focus:outline-none shadow-xs"
                />
              </div>

              <div>
                <label className="block font-black text-slate-900 mb-1.5">
                  Preferred Slot
                </label>
                <select
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white p-2.5 font-semibold text-slate-900 focus:border-[#0B2A4A] focus:outline-none shadow-xs"
                >
                  <option>17:00 - 17:45 IST</option>
                  <option>18:00 - 18:45 IST</option>
                  <option>19:00 - 19:45 IST</option>
                  <option>20:00 - 20:45 IST</option>
                </select>
              </div>

              <div>
                <label className="block font-black text-slate-900 mb-1.5">
                  Your Background & Question
                </label>
                <textarea
                  required
                  rows={3}
                  value={studentNotes}
                  onChange={(e) => setStudentNotes(e.target.value)}
                  placeholder="E.g. In Class 10 with 82% in math, wondering if PCM workload will be too intense..."
                  className="w-full rounded-xl border border-slate-300 bg-white p-2.5 font-medium text-slate-900 focus:border-[#0B2A4A] focus:outline-none shadow-xs"
                />
              </div>

              {/* Share Profile Toggle */}
              <label className="flex items-start gap-2.5 rounded-xl border border-slate-300 bg-slate-100 p-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={shareProfile}
                  onChange={(e) => setShareProfile(e.target.checked)}
                  className="mt-0.5 accent-[#0B2A4A] h-4 w-4 rounded"
                />
                <span className="text-xs text-slate-800 font-medium leading-relaxed">
                  <strong className="font-bold text-slate-950">Share my CAREER-GUD assessment profile summary</strong> with the mentor so they review my quiz marks & interest signals before the session.
                </span>
              </label>

              <button
                type="submit"
                disabled={bookingLoading}
                className="mt-2 w-full rounded-xl bg-[#0B2A4A] py-3 font-black text-white hover:bg-[#071C33] disabled:opacity-50 transition shadow-xs"
              >
                {bookingLoading ? 'Submitting Request...' : 'Confirm Consultation Request'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
