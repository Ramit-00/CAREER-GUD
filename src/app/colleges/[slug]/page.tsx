'use client';

import { College, Review } from '@/types';
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  Building2,
  CheckCircle2,
  ExternalLink,
  GraduationCap,
  MapPin,
  Star,
  Users,
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function CollegeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const { data: session } = useSession();

  const [college, setCollege] = useState<College | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookmarked, setBookmarked] = useState(false);

  // Review Form
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    fetchCollege();
  }, [slug]);

  const fetchCollege = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/colleges/${slug}`);
      if (res.ok) {
        const data = await res.json();
        setCollege(data.college);
        setReviews(data.reviews || []);
      }
    } catch (err) {
      console.error('Fetch college error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBookmark = async () => {
    if (!session) {
      router.push('/login');
      return;
    }

    try {
      const res = await fetch('/api/users/me', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'COLLEGE', slug }),
      });
      if (res.ok) {
        const data = await res.json();
        setBookmarked(data.saved);
      }
    } catch (err) {
      console.error('Bookmark error:', err);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      router.push('/login');
      return;
    }

    setSubmittingReview(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetType: 'COLLEGE',
          targetId: slug,
          rating: reviewRating,
          title: reviewTitle,
          comment: reviewComment,
        }),
      });

      if (res.ok) {
        const newRev = await res.json();
        setReviews([newRev, ...reviews]);
        setReviewTitle('');
        setReviewComment('');
        alert('Review posted successfully!');
      }
    } catch (err) {
      console.error('Review submit error:', err);
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center text-sm text-slate-500">
        <span className="animate-spin inline-block h-6 w-6 border-2 border-teal-600 border-t-transparent rounded-full mb-3" />
        <p>Loading college intelligence profile...</p>
      </div>
    );
  }

  if (!college) {
    return (
      <div className="py-24 text-center">
        <h2 className="text-xl font-bold">College Profile Not Found</h2>
        <Link href="/colleges" className="mt-4 inline-block text-teal-600 underline">
          Back to Colleges Directory
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 flex flex-col gap-10">
      {/* Back Link */}
      <div>
        <Link
          href="/colleges"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Colleges Directory
        </Link>
      </div>

      {/* Header Banner */}
      <div className="rounded-3xl border border-slate-200 bg-white p-8 sm:p-10 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-bold text-teal-700 dark:bg-teal-950/50 dark:text-teal-300">
                NIRF #{college.nirfRank ?? 'N/A'} in India
              </span>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                {college.type} Institution
              </span>
              <span className="text-xs text-slate-400">Est. {college.establishedYear}</span>
            </div>

            <h1 className="mt-3 text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
              {college.name}
            </h1>
            <p className="flex items-center gap-1 text-sm text-slate-500 mt-2">
              <MapPin className="h-4 w-4 text-slate-400" />
              {college.address}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleToggleBookmark}
              className={`flex items-center gap-1.5 rounded-xl border px-4 py-2.5 text-xs font-bold transition ${
                bookmarked
                  ? 'border-teal-600 bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-300'
                  : 'border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200'
              }`}
            >
              <Bookmark className="h-4 w-4" />
              <span>{bookmarked ? 'Saved to Profile' : 'Save College'}</span>
            </button>

            <a
              href={college.website}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white hover:bg-slate-800 transition dark:bg-slate-100 dark:text-slate-900"
            >
              <span>Official Portal</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>

        {/* Placement Record Bar */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-slate-100 dark:border-slate-800">
          <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/40">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Average Annual Package</span>
            <div className="mt-1 text-lg font-black text-slate-900 dark:text-white">{college.placementStats.avgPackageINR}</div>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/40">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Highest Annual Package</span>
            <div className="mt-1 text-lg font-black text-emerald-600 dark:text-emerald-400">{college.placementStats.highestPackageINR}</div>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/40">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Placement Percentage</span>
            <div className="mt-1 text-lg font-black text-teal-600 dark:text-teal-400">{college.placementStats.placementPercentage}% Verified</div>
          </div>
        </div>
      </div>

      {/* Degree Programs Offered */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
          Programs & Degree Courses Offered
        </h3>

        <div className="flex flex-col gap-6">
          {college.programs.map((program) => (
            <div
              key={program.id}
              className="rounded-2xl border border-slate-200 bg-slate-50/70 p-6 dark:border-slate-800 dark:bg-slate-800/40"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white">{program.name}</h4>
                  <span className="text-xs text-slate-500">
                    {program.degreeLevel} • {program.durationYears} Years Duration • {program.seatsAvailable} Seats
                  </span>
                </div>

                <div className="rounded-xl bg-white px-3 py-1.5 border border-slate-200 text-right dark:bg-slate-900 dark:border-slate-700">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Annual Fees</span>
                  <span className="text-xs font-bold text-slate-900 dark:text-white">{program.feesPerYearINR}</span>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <strong className="text-slate-700 dark:text-slate-300">Eligibility Criteria:</strong>
                  <p className="text-slate-500 mt-0.5">{program.eligibility}</p>
                </div>
                <div>
                  <strong className="text-slate-700 dark:text-slate-300">Entrance Exams:</strong>
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    {program.entranceExams.map((ex, i) => (
                      <span
                        key={i}
                        className="rounded-md bg-teal-100/70 text-teal-800 px-2 py-0.5 text-[10px] font-bold dark:bg-teal-950 dark:text-teal-300"
                      >
                        {ex}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sample Courses Inside Program */}
              {program.courses && program.courses.length > 0 && (
                <div className="mt-5 pt-4 border-t border-slate-200 dark:border-slate-700">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Sample Semester Course Modules:
                  </span>
                  <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {program.courses.map((course) => (
                      <div
                        key={course.id}
                        className="rounded-xl bg-white p-2.5 border border-slate-200 text-xs dark:bg-slate-900 dark:border-slate-800"
                      >
                        <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400">
                          Sem {course.semester}
                        </span>
                        <h5 className="font-semibold text-slate-900 dark:text-white mt-0.5">{course.name}</h5>
                        <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{course.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Top Recruiters & Facilities */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
            Verified Top Recruiters
          </h3>
          <div className="flex flex-wrap gap-2">
            {college.placementStats.topRecruiters.map((rec, i) => (
              <span
                key={i}
                className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                🏢 {rec}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
            Campus Infrastructure & Facilities
          </h3>
          <ul className="flex flex-col gap-2 text-xs text-slate-700 dark:text-slate-300">
            {college.facilities.map((fac, i) => (
              <li key={i} className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-teal-500 shrink-0" />
                <span>{fac}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Student Reviews Section */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
          Student & Alumni Reviews ({reviews.length})
        </h3>

        {/* Review Form */}
        <form onSubmit={handleSubmitReview} className="rounded-2xl border border-slate-100 bg-slate-50 p-4 mb-8 dark:border-slate-800 dark:bg-slate-800/40">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-3">
            Leave a Verified Student Review
          </h4>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs text-slate-500">Rating:</span>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setReviewRating(star)}
                className={`text-base ${reviewRating >= star ? 'text-amber-400' : 'text-slate-300'}`}
              >
                ★
              </button>
            ))}
          </div>

          <input
            type="text"
            required
            value={reviewTitle}
            onChange={(e) => setReviewTitle(e.target.value)}
            placeholder="Headline of your campus or academic experience..."
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs focus:border-teal-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white mb-2"
          />

          <textarea
            required
            rows={3}
            value={reviewComment}
            onChange={(e) => setReviewComment(e.target.value)}
            placeholder="Share honest details regarding hostel life, faculty, or placement drives..."
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs focus:border-teal-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white mb-3"
          />

          <button
            type="submit"
            disabled={submittingReview}
            className="rounded-xl bg-teal-600 px-4 py-2 text-xs font-bold text-white hover:bg-teal-500 disabled:opacity-50 transition"
          >
            {submittingReview ? 'Posting...' : 'Submit Review'}
          </button>
        </form>

        {/* Existing Reviews */}
        <div className="flex flex-col gap-4">
          {reviews.length === 0 ? (
            <p className="text-xs text-slate-400">No reviews yet for this college.</p>
          ) : (
            reviews.map((r) => (
              <div key={r.id} className="border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900 dark:text-white">{r.userName}</span>
                  <div className="text-amber-400 font-bold">{'★'.repeat(r.rating)}</div>
                </div>
                <h5 className="font-semibold text-xs text-slate-800 dark:text-slate-200 mt-1">{r.title}</h5>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{r.comment}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
