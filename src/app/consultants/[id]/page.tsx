'use client';

import { ConsultantDomain, ConsultantProfile } from '@/types';
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  GraduationCap,
  ExternalLink,
  Lock,
  Share2,
  ShieldCheck,
  Star,
  UserCheck,
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ConsultantDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { data: session } = useSession();

  const [consultant, setConsultant] = useState<ConsultantProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Booking Form State
  const [selectedDomain, setSelectedDomain] = useState<ConsultantDomain | null>(null);
  const [requestedDate, setRequestedDate] = useState('2025-04-10');
  const [timeSlot, setTimeSlot] = useState('17:00 - 17:45 IST');
  const [studentNotes, setStudentNotes] = useState('');
  const [shareProfile, setShareProfile] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  useEffect(() => {
    fetchConsultant();
  }, [id]);

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

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      router.push(`/login?callbackUrl=/consultants/${id}`);
      return;
    }

    if (!selectedDomain) {
      alert('Please select a verified domain for this consultation.');
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

      if (!res.ok) throw new Error('Booking failed');

      setBookingSuccess(true);
    } catch (err) {
      console.error('Booking error:', err);
      alert('Failed to submit booking. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center text-sm text-slate-500">
        <span className="animate-spin inline-block h-6 w-6 border-2 border-indigo-600 border-t-transparent rounded-full mb-3" />
        <p>Loading mentor credentials...</p>
      </div>
    );
  }

  if (!consultant) {
    return (
      <div className="py-24 text-center">
        <h2 className="text-xl font-bold">Mentor Profile Not Found</h2>
        <Link href="/consultants" className="mt-4 inline-block text-indigo-600 underline">
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
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                  {consultant.name}
                </h1>
                <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 mt-1">
                  {consultant.headline}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  {consultant.currentRole} • {consultant.experienceYears} Years Experience
                </p>
              </div>

              <div className="flex items-center gap-1 rounded-xl bg-amber-50 px-2.5 py-1.5 text-xs font-bold text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                <span>{consultant.rating} ({consultant.reviewCount} Sessions)</span>
              </div>
            </div>

            <div className="mt-6 border-t border-slate-100 dark:border-slate-800 pt-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                About the Mentor
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {consultant.bio}
              </p>
            </div>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-100 dark:border-slate-800 pt-4 text-xs">
              <div>
                <span className="font-bold text-slate-400 uppercase text-[10px] block">Alma Mater</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5 block">{consultant.almaMater}</span>
              </div>
              <div>
                <span className="font-bold text-slate-400 uppercase text-[10px] block">Highest Degree</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5 block">{consultant.highestEducation}</span>
              </div>
            </div>

            {/* Per-Domain Verification Table */}
            <div className="mt-6 border-t border-slate-100 dark:border-slate-800 pt-4">
              <div className="flex items-center gap-2 mb-3">
                <ShieldCheck className="h-4 w-4 text-teal-600" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Domain Verification Audit Status
                </h3>
              </div>

              <div className="flex flex-col gap-2">
                {consultant.domainVerifications.map((v, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 rounded-xl border border-slate-100 bg-slate-50 p-3 text-xs dark:border-slate-800 dark:bg-slate-800/50"
                  >
                    <div>
                      <strong className="text-slate-900 dark:text-white font-bold">{v.domain} Guidance:</strong>
                      <span className="text-slate-500 ml-1.5">{v.proofDescription}</span>
                    </div>

                    <span
                      className={`rounded-md px-2 py-0.5 text-[10px] font-bold shrink-0 self-start sm:self-auto ${
                        v.status === 'VERIFIED'
                          ? 'bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300'
                          : v.status === 'REJECTED'
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      }`}
                    >
                      {v.status === 'VERIFIED' ? '✓ Verified & Bookable' : v.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Booking Form (1 col) */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900 h-fit">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Consultation Fee</span>
            <span className="text-xl font-black text-slate-900 dark:text-white">
              ₹{consultant.feePerSessionINR}{' '}
              <span className="text-xs font-normal text-slate-400">/ 45 mins</span>
            </span>
          </div>

          {bookingSuccess ? (
            <div className="mt-6 rounded-2xl bg-teal-50 p-5 text-center text-xs dark:bg-teal-950/40">
              <CheckCircle2 className="h-8 w-8 text-teal-600 mx-auto mb-2" />
              <h4 className="font-bold text-teal-900 dark:text-teal-200 text-sm">Consultation Requested!</h4>
              <p className="text-teal-700 dark:text-teal-300 mt-1">
                Your session request with {consultant.name} has been confirmed. You can view details in your Student Dashboard.
              </p>
              <Link
                href="/dashboard"
                className="mt-4 inline-block rounded-xl bg-teal-600 px-4 py-2 font-bold text-white hover:bg-teal-500"
              >
                Go to Dashboard
              </Link>
            </div>
          ) : (
            <form onSubmit={handleBooking} className="mt-6 flex flex-col gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Select Verified Domain
                </label>
                <div className="flex flex-col gap-1.5">
                  {verifiedDomains.map((vd) => (
                    <label
                      key={vd.domain}
                      className={`flex items-center gap-2 rounded-xl border p-2.5 cursor-pointer transition ${
                        selectedDomain === vd.domain
                          ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900 dark:border-indigo-400 dark:bg-indigo-950/50 dark:text-indigo-200'
                          : 'border-slate-200 hover:bg-slate-50 dark:border-slate-700'
                      }`}
                    >
                      <input
                        type="radio"
                        name="consultationDomain"
                        value={vd.domain}
                        checked={selectedDomain === vd.domain}
                        onChange={() => setSelectedDomain(vd.domain)}
                        className="accent-indigo-600"
                      />
                      <span className="font-bold">{vd.domain}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Preferred Date
                </label>
                <input
                  type="date"
                  required
                  value={requestedDate}
                  onChange={(e) => setRequestedDate(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-2.5 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Preferred Slot
                </label>
                <select
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-2.5 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                >
                  <option>17:00 - 17:45 IST</option>
                  <option>18:00 - 18:45 IST</option>
                  <option>19:00 - 19:45 IST</option>
                  <option>20:00 - 20:45 IST</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Your Background & Question
                </label>
                <textarea
                  required
                  rows={3}
                  value={studentNotes}
                  onChange={(e) => setStudentNotes(e.target.value)}
                  placeholder="E.g. In Class 10 with 82% in math, wondering if PCM workload will be too intense..."
                  className="w-full rounded-xl border border-slate-200 p-2.5 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              {/* Share Profile Toggle */}
              <label className="flex items-start gap-2 rounded-xl bg-slate-50 p-3 dark:bg-slate-800/40 cursor-pointer">
                <input
                  type="checkbox"
                  checked={shareProfile}
                  onChange={(e) => setShareProfile(e.target.checked)}
                  className="mt-0.5 accent-indigo-600 rounded"
                />
                <span className="text-[11px] text-slate-600 dark:text-slate-300">
                  <strong>Share my CARRER-GUD assessment profile summary</strong> with the mentor so they review my quiz marks & interest signals before the session.
                </span>
              </label>

              <button
                type="submit"
                disabled={bookingLoading}
                className="mt-2 w-full rounded-xl bg-indigo-600 py-3 font-bold text-white hover:bg-indigo-500 disabled:opacity-50 transition shadow-md shadow-indigo-600/20"
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
