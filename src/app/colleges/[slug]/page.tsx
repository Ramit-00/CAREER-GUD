'use client';

import { College, Review } from '@/types';
import { sanitizeSafeUrl } from '@/lib/utils/urlSanitizer';
import {
  ArrowLeft,
  Bookmark,
  Building2,
  CheckCircle2,
  ExternalLink,
  MapPin,
  Star,
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
  const [reviewStatus, setReviewStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchCollege = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/colleges/${slug}`);
      if (res.ok) {
        const data = await res.json();
        setCollege(data.college);
        setReviews(data.reviews || []);
        if (data.isSaved !== undefined) {
          setBookmarked(Boolean(data.isSaved));
        }
      }
    } catch (err) {
      console.error('Fetch college error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    if (document.documentElement) document.documentElement.scrollTop = 0;
    if (document.body) document.body.scrollTop = 0;
    fetchCollege();
  }, [slug]);

  const handleToggleBookmark = async () => {
    if (!session) {
      router.push('/login');
      return;
    }

    try {
      const res = await fetch('/api/bookmarks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'COLLEGE', slug }),
      });
      if (res.ok) {
        const data = await res.json();
        setBookmarked(Boolean(data.saved));
      }
    } catch (err) {
      console.error('Bookmark error:', err);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setReviewStatus(null);
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

      const resData = await res.json();
      if (res.ok) {
        setReviews([resData, ...reviews]);
        setReviewTitle('');
        setReviewComment('');
        setReviewStatus({ type: 'success', message: 'Review posted successfully!' });
      } else {
        setReviewStatus({ type: 'error', message: resData.error || 'Failed to submit review.' });
      }
    } catch (err) {
      console.error('Review submit error:', err);
      setReviewStatus({ type: 'error', message: 'Failed to post review. Please try again.' });
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center text-sm text-slate-600">
        <span className="animate-spin inline-block h-6 w-6 border-2 border-teal-600 border-t-transparent rounded-full mb-3" />
        <p>Loading college intelligence profile...</p>
      </div>
    );
  }

  if (!college) {
    return (
      <div className="py-24 text-center">
        <h2 className="text-xl font-bold text-[#0B2A4A]">College Profile Not Found</h2>
        <Link href="/colleges" className="mt-4 inline-block text-[#0B2A4A] font-bold underline">
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
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-700 hover:text-blue-600 transition"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Colleges Directory
        </Link>
      </div>

      {/* Header Banner */}
      <div className="rounded-3xl border-2 border-slate-300 bg-[#EAEFF5] p-8 sm:p-10 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="rounded-lg bg-blue-50 px-3 py-1 text-xs font-black text-[#0B2A4A] border border-blue-200 shadow-2xs">
                NIRF #{college.nirfRank ?? 'N/A'} in India
              </span>
              <span className="rounded-lg bg-white px-3 py-1 text-xs font-bold text-slate-800 border border-slate-300 shadow-2xs">
                {college.type} Institution
              </span>
              <span className="text-xs font-bold text-slate-600">Est. {college.establishedYear}</span>
            </div>

            <h1 className="mt-4 text-3xl sm:text-4xl font-black text-[#0B2A4A] tracking-tight">
              {college.name}
            </h1>
            <p className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-700 mt-2">
              <MapPin className="h-4 w-4 text-slate-500 shrink-0" />
              {college.address}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleToggleBookmark}
              className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs sm:text-sm font-black transition cursor-pointer shadow-2xs ${
                bookmarked
                  ? 'border-[#0B2A4A] bg-blue-50 text-[#0B2A4A] hover:bg-blue-100'
                  : 'border-slate-300 bg-white text-slate-800 hover:bg-slate-100 hover:border-slate-400 hover:text-slate-950'
              }`}
            >
              <Bookmark className={`h-4 w-4 ${bookmarked ? 'fill-current text-[#0B2A4A]' : ''}`} />
              <span>{bookmarked ? 'Saved to Profile' : 'Save College'}</span>
            </button>

            <a
              href={sanitizeSafeUrl(college.website)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-xl bg-[#0B2A4A] px-5 py-2.5 text-xs sm:text-sm font-bold text-white hover:bg-[#071C33] transition shadow-xs"
            >
              <span>Official Portal</span>
              <ExternalLink className="h-4 w-4 text-amber-400" />
            </a>
          </div>
        </div>

        {/* Placement Record Bar */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t-2 border-slate-200">
          <div className="rounded-2xl bg-white p-4 border border-slate-200 shadow-2xs">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Average Annual Package</span>
            <div className="mt-1 text-xl font-black text-slate-950">{college.placementStats.avgPackageINR}</div>
          </div>
          <div className="rounded-2xl bg-white p-4 border border-slate-200 shadow-2xs">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Highest Annual Package</span>
            <div className="mt-1 text-xl font-black text-[#138808]">{college.placementStats.highestPackageINR}</div>
          </div>
          <div className="rounded-2xl bg-white p-4 border border-slate-200 shadow-2xs">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Placement Percentage</span>
            <div className="mt-1 text-xl font-black text-[#0B2A4A]">{college.placementStats.placementPercentage}% Verified</div>
          </div>
        </div>
      </div>

      {/* Degree Programs Offered */}
      <div className="rounded-3xl border-2 border-slate-300 bg-[#EAEFF5] p-6 sm:p-8 shadow-xs">
        <h3 className="text-xl sm:text-2xl font-black text-[#0B2A4A] mb-6">
          Programs &amp; Degree Courses Offered
        </h3>

        <div className="flex flex-col gap-6">
          {college.programs.map((program) => (
            <div
              key={program.id}
              className="rounded-2xl border border-slate-300/80 bg-white p-6 shadow-2xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-lg font-black text-[#0B2A4A]">{program.name}</h4>
                  <span className="text-xs sm:text-sm font-semibold text-slate-700">
                    {program.degreeLevel} • {program.durationYears} Years Duration • {program.seatsAvailable} Seats
                  </span>
                </div>

                <div className="rounded-xl bg-slate-100 px-3.5 py-2 border border-slate-300 text-right shadow-2xs">
                  <span className="text-xs text-slate-600 uppercase font-black block">Annual Fees</span>
                  <span className="text-sm font-black text-[#0B2A4A]">{program.feesPerYearINR}</span>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                <div>
                  <strong className="text-slate-900 font-bold block">Eligibility Criteria:</strong>
                  <p className="text-slate-700 mt-1 font-normal leading-relaxed">{program.eligibility}</p>
                </div>
                <div>
                  <strong className="text-slate-900 font-bold block">Entrance Exams:</strong>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {program.entranceExams.map((ex, i) => (
                      <span
                        key={i}
                        className="rounded-md bg-blue-50 text-[#0B2A4A] px-2.5 py-1 text-xs font-bold border border-blue-200"
                      >
                        {ex}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sample Courses Inside Program */}
              {program.courses && program.courses.length > 0 && (
                <div className="mt-5 pt-4 border-t border-slate-200">
                  <span className="text-xs font-black uppercase tracking-wider text-[#0B2A4A]">
                    Sample Semester Course Modules:
                  </span>
                  <div className="mt-2.5 grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {program.courses.map((course) => (
                      <div
                        key={course.id}
                        className="rounded-xl bg-slate-100 p-3 border border-slate-200 text-xs sm:text-sm shadow-2xs"
                      >
                        <span className="text-xs font-black text-[#0B2A4A]">
                          Sem {course.semester}
                        </span>
                        <h5 className="font-bold text-slate-950 mt-1">{course.name}</h5>
                        <p className="text-xs text-slate-700 mt-1 line-clamp-2 leading-relaxed font-normal">{course.description}</p>
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
        <div className="rounded-3xl border-2 border-slate-300 bg-[#EAEFF5] p-6 sm:p-8 shadow-xs">
          <h3 className="text-xl font-black text-[#0B2A4A] mb-4">
            Verified Top Recruiters
          </h3>
          <div className="flex flex-wrap gap-2">
            {college.placementStats.topRecruiters.map((rec, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-900 shadow-2xs"
              >
                <Building2 className="h-4 w-4 text-[#0B2A4A]" />
                <span>{rec}</span>
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border-2 border-slate-300 bg-[#EAEFF5] p-6 sm:p-8 shadow-xs">
          <h3 className="text-xl font-black text-[#0B2A4A] mb-4">
            Campus Infrastructure &amp; Facilities
          </h3>
          <ul className="flex flex-col gap-2.5 text-xs sm:text-sm font-semibold text-slate-800">
            {college.facilities.map((fac, i) => (
              <li key={i} className="flex items-center gap-2 rounded-xl bg-white p-2.5 border border-slate-200 shadow-2xs">
                <CheckCircle2 className="h-4 w-4 text-[#138808] shrink-0" />
                <span>{fac}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Student Reviews Section */}
      <div className="rounded-3xl border-2 border-slate-300 bg-[#EAEFF5] p-6 sm:p-8 shadow-xs">
        <h3 className="text-xl sm:text-2xl font-black text-[#0B2A4A] mb-6">
          Student &amp; Alumni Reviews ({reviews.length})
        </h3>

        {/* Review Form */}
        <form onSubmit={handleSubmitReview} className="rounded-2xl border border-slate-300/80 bg-white p-5 mb-8 shadow-2xs">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 mb-3">
            Leave a Verified Student Review
          </h4>
          <div className="flex items-center gap-1.5 mb-3">
            <span className="text-xs font-bold text-slate-700 mr-1">Rating:</span>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setReviewRating(star)}
                className="p-0.5 hover:scale-110 transition cursor-pointer"
              >
                <Star
                  className={`h-4 w-4 ${
                    reviewRating >= star
                      ? 'fill-amber-400 text-amber-500'
                      : 'text-slate-300'
                  }`}
                />
              </button>
            ))}
          </div>

          <input
            type="text"
            required
            value={reviewTitle}
            onChange={(e) => setReviewTitle(e.target.value)}
            placeholder="Headline of your campus or academic experience..."
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-xs sm:text-sm font-medium text-slate-900 focus:border-[#0B2A4A] focus:outline-none mb-2.5 shadow-xs"
          />

          <textarea
            required
            rows={3}
            value={reviewComment}
            onChange={(e) => setReviewComment(e.target.value)}
            placeholder="Share honest details regarding hostel life, faculty, or placement drives..."
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-xs sm:text-sm font-medium text-slate-900 focus:border-[#0B2A4A] focus:outline-none mb-3 shadow-xs"
          />

          {reviewStatus && (
            <div
              className={`mb-3 rounded-xl p-3 text-xs font-bold border ${
                reviewStatus.type === 'success'
                  ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                  : 'bg-rose-50 text-rose-900 border-rose-300'
              }`}
            >
              {reviewStatus.message}
            </div>
          )}

          <button
            type="submit"
            disabled={submittingReview}
            className="rounded-xl bg-[#0B2A4A] px-5 py-2.5 text-xs sm:text-sm font-bold text-white hover:bg-[#071C33] disabled:opacity-50 transition shadow-xs cursor-pointer"
          >
            {submittingReview ? 'Posting...' : 'Submit Review'}
          </button>
        </form>

        {/* Existing Reviews */}
        <div className="flex flex-col gap-3">
          {reviews.length === 0 ? (
            <p className="text-xs sm:text-sm font-semibold text-slate-600">No reviews yet for this college.</p>
          ) : (
            reviews.map((r) => (
              <div key={r.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="font-black text-slate-950">{r.userName}</span>
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <Star
                        key={idx}
                        className={`h-3.5 w-3.5 ${
                          idx < r.rating
                            ? 'fill-amber-400 text-amber-500'
                            : 'text-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <h5 className="font-bold text-xs sm:text-sm text-slate-900 mt-2">{r.title}</h5>
                <p className="text-xs sm:text-sm text-slate-700 mt-1 leading-relaxed font-normal">{r.comment}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
