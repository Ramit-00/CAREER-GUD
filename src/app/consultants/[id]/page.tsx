'use client';

import { ConsultantDomain, ConsultantProfile, ConsultationBooking } from '@/types';
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Download,
  ExternalLink,
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
      <div className="py-24 text-center text-sm font-semibold text-slate-600 dark:text-slate-400">
        <span className="animate-spin inline-block h-6 w-6 border-2 border-[#0B2A4A] border-t-transparent rounded-full mb-3" />
        <p>Loading mentor credentials...</p>
      </div>
    );
  }

  if (!consultant) {
    return (
      <div className="py-24 text-center">
        <h2 className="text-xl font-bold text-[#0B2A4A] dark:text-white">Mentor Profile Not Found</h2>
        <Link href="/consultants" className="mt-4 inline-block text-[#0B2A4A] font-bold hover:underline dark:text-sky-400">
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
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Verified Mentors
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card (2 cols) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="rounded-3xl border-2 border-slate-200 bg-white p-8 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-3xl sm:text-4xl font-black text-[#0B2A4A] dark:text-white tracking-tight">
                  {consultant.name}
                </h1>
                <p className="text-sm sm:text-base font-bold text-[#0B2A4A] dark:text-blue-400 mt-1">
                  {consultant.headline}
                </p>
                <p className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 mt-1">
                  {consultant.currentRole} • {consultant.experienceYears} Years Professional Experience
                </p>
              </div>

              <div className="flex items-center gap-1.5 rounded-xl bg-amber-50 border border-amber-200 px-3 py-1.5 text-xs sm:text-sm font-black text-amber-800 dark:bg-amber-950 dark:border-amber-900 dark:text-amber-300 shadow-xs">
                <Star className="h-4 w-4 fill-amber-400 text-amber-500" />
                <span>{consultant.rating} ({consultant.reviewCount} Sessions)</span>
              </div>
            </div>

            <div className="mt-6 border-t-2 border-slate-100 dark:border-slate-800 pt-5">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                About the Mentor
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-normal">
                {consultant.bio}
              </p>
            </div>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 border-t-2 border-slate-100 dark:border-slate-800 pt-5 text-xs sm:text-sm">
              <div className="rounded-xl bg-[#F8F9FA] p-3.5 border border-slate-200 dark:bg-slate-800/80 dark:border-slate-700">
                <span className="font-black text-slate-700 dark:text-slate-300 uppercase text-xs block">Alma Mater</span>
                <span className="font-bold text-slate-950 dark:text-white mt-1 block text-sm">{consultant.almaMater}</span>
              </div>
              <div className="rounded-xl bg-[#F8F9FA] p-3.5 border border-slate-200 dark:bg-slate-800/80 dark:border-slate-700">
                <span className="font-black text-slate-700 dark:text-slate-300 uppercase text-xs block">Highest Degree</span>
                <span className="font-bold text-slate-950 dark:text-white mt-1 block text-sm">{consultant.highestEducation}</span>
              </div>
            </div>

            {/* Per-Domain Verification Table */}
            <div className="mt-6 border-t-2 border-slate-100 dark:border-slate-800 pt-5">
              <div className="flex items-center gap-2 mb-3">
                <ShieldCheck className="h-5 w-5 text-[#138808] dark:text-emerald-400" />
                <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-[#0B2A4A] dark:text-white">
                  Domain Verification Audit Status
                </h3>
              </div>

              <div className="flex flex-col gap-2.5">
                {consultant.domainVerifications.map((v, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-xl border-2 border-slate-200 bg-[#F8F9FA] p-3.5 text-xs sm:text-sm dark:border-slate-800 dark:bg-slate-800/60"
                  >
                    <div>
                      <strong className="text-slate-950 dark:text-white font-bold">{v.domain} Guidance:</strong>
                      <span className="text-slate-700 dark:text-slate-300 ml-2 font-medium">{v.proofDescription}</span>
                    </div>

                    <span
                      className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-black shrink-0 self-start sm:self-auto border ${
                        v.status === 'VERIFIED'
                          ? 'bg-emerald-50 text-[#138808] border-emerald-300 dark:bg-emerald-950 dark:text-emerald-200 dark:border-emerald-800'
                          : v.status === 'REJECTED'
                          ? 'bg-rose-100 text-rose-900 border-rose-300 dark:bg-rose-950 dark:text-rose-200'
                          : 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950 dark:text-amber-200'
                      }`}
                    >
                      {v.status === 'VERIFIED' ? (
                        <>
                          <CheckCircle2 className="h-3.5 w-3.5 text-[#138808] dark:text-emerald-400" />
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
        <div className="rounded-3xl border-2 border-slate-200 bg-white p-6 sm:p-8 shadow-xs dark:border-slate-800 dark:bg-slate-900 h-fit">
          <div className="flex items-center justify-between border-b-2 border-slate-100 dark:border-slate-800 pb-4">
            <span className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">Consultation Fee</span>
            <span className="text-2xl font-black text-slate-950 dark:text-white">
              ₹{consultant.feePerSessionINR}{' '}
              <span className="text-xs font-bold text-slate-500">/ 45 mins</span>
            </span>
          </div>

          {bookingSuccess ? (
            <div className="mt-6 rounded-2xl bg-emerald-50 border-2 border-emerald-200 p-6 text-xs dark:bg-emerald-950/40 dark:border-emerald-900 text-left">
              <div className="text-center mb-4">
                <CheckCircle2 className="h-10 w-10 text-emerald-600 mx-auto mb-2" />
                <h4 className="font-black text-emerald-950 dark:text-emerald-200 text-base">Consultation Confirmed!</h4>
                <p className="text-emerald-800 dark:text-emerald-300 mt-1 font-medium leading-relaxed">
                  Your 1-on-1 session with <strong className="font-bold text-emerald-950 dark:text-white">{consultant.name}</strong> is scheduled.
                </p>
              </div>

              {/* Slot & Meeting Details */}
              <div className="rounded-xl bg-white p-3.5 border border-emerald-200 dark:bg-slate-900 dark:border-emerald-900 flex flex-col gap-2 mb-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600 dark:text-slate-400 font-semibold">Date & Time:</span>
                  <span className="font-black text-slate-950 dark:text-white">{requestedDate} • {timeSlot}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600 dark:text-slate-400 font-semibold">Domain:</span>
                  <span className="font-bold text-[#0B2A4A] dark:text-blue-300">{selectedDomain}</span>
                </div>
                {confirmedBooking?.meetingUrl && (
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                    <span className="text-[11px] uppercase tracking-wider font-black text-slate-600 dark:text-slate-400 block mb-1">
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
                      className="flex items-center justify-center gap-2 rounded-xl border-2 border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-800 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-850 dark:text-slate-200 dark:hover:bg-slate-800 transition cursor-pointer"
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
                      className="flex items-center justify-center gap-2 rounded-xl border-2 border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-800 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-850 dark:text-slate-200 dark:hover:bg-slate-800 transition"
                    >
                      <Calendar className="h-3.5 w-3.5 text-blue-600" />
                      <span>Add to Google Calendar</span>
                      <ExternalLink className="h-3 w-3 opacity-70" />
                    </a>
                  </>
                )}
              </div>

              <div className="flex items-center justify-between gap-2 pt-2 border-t border-emerald-200 dark:border-emerald-900">
                <button
                  type="button"
                  onClick={() => {
                    setBookingSuccess(false);
                    setConfirmedBooking(null);
                  }}
                  className="text-xs font-bold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
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
          ) : (
            <form onSubmit={handleBooking} className="mt-6 flex flex-col gap-4 text-xs sm:text-sm">
              {bookingError && (
                <div className="flex items-start gap-2.5 rounded-xl border border-red-300 bg-red-50 p-3 text-xs font-semibold text-red-900 dark:border-red-900 dark:bg-red-950 dark:text-red-200">
                  <AlertCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
                  <span>{bookingError}</span>
                </div>
              )}
              <div>
                <label className="block font-black text-slate-900 dark:text-white mb-2">
                  Select Verified Domain
                </label>
                <div className="flex flex-col gap-2">
                  {verifiedDomains.map((vd) => (
                    <label
                      key={vd.domain}
                      className={`flex items-center gap-2.5 rounded-xl border-2 p-3 cursor-pointer transition ${
                        selectedDomain === vd.domain
                          ? 'border-[#0B2A4A] bg-blue-50/80 text-[#0B2A4A] dark:border-blue-400 dark:bg-blue-950/60 dark:text-blue-200'
                          : 'border-slate-300 bg-white hover:bg-slate-100 hover:border-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800'
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
                      <span className="font-bold text-slate-950 dark:text-white">{vd.domain}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-black text-slate-900 dark:text-white mb-1.5">
                  Preferred Date
                </label>
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={requestedDate}
                  onChange={(e) => setRequestedDate(e.target.value)}
                  className="w-full rounded-xl border-2 border-slate-300 bg-white p-2.5 font-semibold text-slate-900 focus:border-[#0B2A4A] focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white shadow-xs"
                />
              </div>

              <div>
                <label className="block font-black text-slate-900 dark:text-white mb-1.5">
                  Preferred Slot
                </label>
                <select
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  className="w-full rounded-xl border-2 border-slate-300 bg-white p-2.5 font-semibold text-slate-900 focus:border-[#0B2A4A] focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white shadow-xs"
                >
                  <option>17:00 - 17:45 IST</option>
                  <option>18:00 - 18:45 IST</option>
                  <option>19:00 - 19:45 IST</option>
                  <option>20:00 - 20:45 IST</option>
                </select>
              </div>

              <div>
                <label className="block font-black text-slate-900 dark:text-white mb-1.5">
                  Your Background & Question
                </label>
                <textarea
                  required
                  rows={3}
                  value={studentNotes}
                  onChange={(e) => setStudentNotes(e.target.value)}
                  placeholder="E.g. In Class 10 with 82% in math, wondering if PCM workload will be too intense..."
                  className="w-full rounded-xl border-2 border-slate-300 bg-white p-2.5 font-medium text-slate-900 focus:border-[#0B2A4A] focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white shadow-xs"
                />
              </div>

              {/* Share Profile Toggle */}
              <label className="flex items-start gap-2.5 rounded-xl border border-slate-300 bg-[#F8F9FA] p-3 dark:border-slate-700 dark:bg-slate-800/60 cursor-pointer">
                <input
                  type="checkbox"
                  checked={shareProfile}
                  onChange={(e) => setShareProfile(e.target.checked)}
                  className="mt-0.5 accent-[#0B2A4A] h-4 w-4 rounded"
                />
                <span className="text-xs text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
                  <strong className="font-bold text-slate-950 dark:text-white">Share my CAREER-GUD assessment profile summary</strong> with the mentor so they review my quiz marks & interest signals before the session.
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
