'use client';

import { AutomationMeter } from '@/components/charts/AutomationMeter';
import { ExamBadge } from '@/components/common/ExamBadgeModal';
import { Career, Review } from '@/types';
import {
  ArrowLeft,
  Bookmark,
  Clock,
  GraduationCap,
  Star,
  TrendingUp,
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function CareerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const { data: session } = useSession();

  const [career, setCareer] = useState<Career | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [adjacentCareers, setAdjacentCareers] = useState<Array<{ career: Career; similarityScore: number }>>([]);
  const [loading, setLoading] = useState(true);
  const [bookmarked, setBookmarked] = useState(false);

  // Review form state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    if (document.documentElement) document.documentElement.scrollTop = 0;
    if (document.body) document.body.scrollTop = 0;
    fetchDetail();
  }, [slug]);

  const fetchDetail = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/careers/${slug}`);
      if (res.ok) {
        const data = await res.json();
        setCareer(data.career);
        setReviews(data.reviews || []);
        setAdjacentCareers(data.adjacentCareers || []);
        if (data.isSaved !== undefined) {
          setBookmarked(Boolean(data.isSaved));
        }
      }
    } catch (err) {
      console.error('Fetch career detail error:', err);
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
      const res = await fetch('/api/bookmarks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'CAREER', slug }),
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
          targetType: 'CAREER',
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
      <div className="py-24 text-center text-sm font-semibold text-slate-600 dark:text-slate-400">
        <span className="animate-spin inline-block h-6 w-6 border-2 border-[#0B2A4A] border-t-transparent rounded-full mb-3" />
        <p>Loading career intelligence profile...</p>
      </div>
    );
  }

  if (!career) {
    return (
      <div className="py-24 text-center">
        <h2 className="text-xl font-bold text-[#0B2A4A] dark:text-white">Career Profile Not Found</h2>
        <Link href="/careers" className="mt-4 inline-block text-[#0B2A4A] font-bold hover:underline dark:text-sky-400">
          Back to Careers Directory
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 flex flex-col gap-10">
      {/* Back Link */}
      <div>
        <Link
          href="/careers"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-700 hover:text-blue-600 dark:text-slate-300 dark:hover:text-white transition"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Careers Directory
        </Link>
      </div>

      {/* Header Banner */}
      <div className="rounded-3xl border-2 border-slate-200 bg-white p-8 sm:p-10 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="rounded-lg bg-blue-50/80 px-3 py-1 text-xs font-black text-[#0B2A4A] border border-blue-200 dark:bg-blue-950 dark:border-blue-900 dark:text-blue-200">
                {career.streamLabel}
              </span>
              <span className="flex items-center gap-1.5 text-xs font-bold text-[#138808] dark:text-emerald-400">
                <TrendingUp className="h-4 w-4" />
                {career.outlook.demandTrend}
              </span>
            </div>

            <h1 className="mt-4 text-3xl sm:text-4xl font-black text-[#0B2A4A] dark:text-white tracking-tight">
              {career.title}
            </h1>
            <p className="mt-3 text-sm sm:text-base text-slate-700 dark:text-slate-200 leading-relaxed max-w-2xl font-normal">
              {career.description}
            </p>
          </div>

          <button
            onClick={handleToggleBookmark}
            className={`flex items-center gap-2 rounded-xl border-2 px-4 py-2.5 text-xs sm:text-sm font-black transition cursor-pointer shrink-0 ${
              bookmarked
                ? 'border-[#0B2A4A] bg-blue-50 text-[#0B2A4A] hover:bg-blue-100 dark:border-blue-500 dark:bg-blue-950/80 dark:text-blue-200 dark:hover:bg-blue-900 shadow-xs'
                : 'border-slate-300 bg-slate-50 text-slate-800 hover:bg-slate-100 hover:border-slate-400 hover:text-slate-950 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-200 dark:hover:bg-slate-700 dark:hover:text-white dark:hover:border-slate-600'
            }`}
          >
            <Bookmark className={`h-4 w-4 ${bookmarked ? 'fill-current text-[#0B2A4A] dark:text-blue-300' : ''}`} />
            <span>{bookmarked ? 'Saved to Profile' : 'Save Career Option'}</span>
          </button>
        </div>

        {/* Salary Bands */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t-2 border-slate-200 dark:border-slate-800">
          <div className="rounded-2xl bg-[#F8F9FA] p-4 border border-slate-200 dark:bg-slate-800/80 dark:border-slate-700">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">Entry Level (0-2 Yrs)</span>
            <div className="mt-1 text-xl font-black text-slate-950 dark:text-white">{career.outlook.avgSalaryRangeINR.entry}</div>
          </div>
          <div className="rounded-2xl bg-[#F8F9FA] p-4 border border-slate-200 dark:bg-slate-800/80 dark:border-slate-700">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">Mid Career (3-7 Yrs)</span>
            <div className="mt-1 text-xl font-black text-[#0B2A4A] dark:text-blue-400">{career.outlook.avgSalaryRangeINR.mid}</div>
          </div>
          <div className="rounded-2xl bg-[#F8F9FA] p-4 border border-slate-200 dark:bg-slate-800/80 dark:border-slate-700">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">Senior Practice (8+ Yrs)</span>
            <div className="mt-1 text-xl font-black text-[#138808] dark:text-emerald-400">{career.outlook.avgSalaryRangeINR.senior}</div>
          </div>
        </div>
      </div>

      {/* Automation Risk & Future Outlook */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-3xl border-2 border-slate-200 bg-white p-6 sm:p-8 shadow-xs dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-[#0B2A4A] dark:text-blue-400">
              Future Resilience
            </span>
            <h3 className="text-xl font-black text-slate-950 dark:text-white mt-1">
              AI Automation Vulnerability
            </h3>
            <div className="mt-4">
              <AutomationMeter
                score={career.outlook.automationRiskScore}
                label={career.outlook.automationRiskLabel}
              />
            </div>
            <p className="mt-4 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
              {career.outlook.growthNotes}
            </p>
          </div>

          <div className="mt-6 rounded-2xl bg-[#F8F9FA] p-3.5 text-xs text-slate-700 dark:bg-slate-800/80 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-medium">
            <strong className="text-slate-950 dark:text-white font-bold">Regional Hotspots:</strong> {career.outlook.regionalDemandNotes}
          </div>
        </div>

        {/* Day in the Life */}
        <div className="rounded-3xl border-2 border-slate-200 bg-white p-6 sm:p-8 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="h-5 w-5 text-[#0B2A4A] dark:text-teal-400" />
            <h3 className="text-xl font-black text-slate-950 dark:text-white">A Day in the Life</h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-normal">
            {career.dayInTheLife}
          </p>

          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mt-6 mb-2">
            Core Technical & Personal Competencies
          </h4>
          <div className="flex flex-wrap gap-2">
            {career.requiredSkills.map((skill, i) => (
              <span
                key={i}
                className="rounded-xl border border-slate-300 bg-[#F8F9FA] px-3 py-1.5 text-xs font-bold text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Eligibility & Entrance Exams */}
      <div className="rounded-3xl border-2 border-slate-200 bg-white p-6 sm:p-8 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-2.5 mb-4">
          <GraduationCap className="h-6 w-6 text-[#0B2A4A] dark:text-blue-400" />
          <h3 className="text-xl sm:text-2xl font-black text-[#0B2A4A] dark:text-white">
            Eligibility & Entrance Gateway
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs sm:text-sm">
          <div className="rounded-xl bg-[#F8F9FA] p-4 border border-slate-200 dark:bg-slate-800/80 dark:border-slate-700">
            <span className="font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider text-xs block">10+2 Stream Requirement</span>
            <p className="mt-1.5 font-bold text-slate-950 dark:text-white text-sm sm:text-base">{career.eligibility.streamRequirement}</p>
          </div>
          <div className="rounded-xl bg-[#F8F9FA] p-4 border border-slate-200 dark:bg-slate-800/80 dark:border-slate-700">
            <span className="font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider text-xs block">Mandatory Subjects</span>
            <p className="mt-1.5 font-bold text-slate-950 dark:text-white text-sm sm:text-base">{career.eligibility.mandatorySubjects.join(', ')}</p>
          </div>
          <div className="rounded-xl bg-[#F8F9FA] p-4 border border-slate-200 dark:bg-slate-800/80 dark:border-slate-700">
            <span className="font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider text-xs block">Academic Cutoff Guidance</span>
            <p className="mt-1.5 font-bold text-slate-950 dark:text-white text-sm sm:text-base">{career.eligibility.minimumPercentageGuide}</p>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t-2 border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs sm:text-sm font-black text-[#0B2A4A] dark:text-white">
              National Entrance Examinations & Statutory Links:
            </span>
            <span className="text-xs font-bold text-[#D96B00] dark:text-amber-400 hidden sm:inline">
              Click any exam badge for official portal & syllabus overview
            </span>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {career.eligibility.topEntranceExams.map((exam, i) => (
              <ExamBadge key={i} examName={exam} />
            ))}
          </div>
        </div>
      </div>

      {/* Pathway Stepper */}
      <div className="rounded-3xl border-2 border-slate-200 bg-white p-6 sm:p-8 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <h3 className="text-xl sm:text-2xl font-black text-[#0B2A4A] dark:text-white mb-6">
          Education & Career Roadmap
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {career.pathwaySteps.map((step, idx) => (
            <div key={idx} className="rounded-2xl border-2 border-slate-200 bg-[#F8F9FA] p-4 text-xs dark:border-slate-700 dark:bg-slate-800/60">
              <span className="rounded-lg bg-[#0B2A4A] text-white font-black px-2.5 py-1 text-xs inline-block">
                {step.stage}
              </span>
              <p className="mt-3 text-slate-800 dark:text-slate-200 leading-relaxed font-semibold text-xs sm:text-sm">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Adjacent Careers (Powered by Similarity Engine) */}
      {adjacentCareers.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-[#0B2A4A] dark:text-blue-400">
                Vector Similarity Engine
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-[#0B2A4A] dark:text-white">
                Adjacent Careers You Might Also Like
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {adjacentCareers.map(({ career: adj, similarityScore }) => (
              <Link
                key={adj.id}
                href={`/careers/${adj.slug}`}
                className="group flex flex-col justify-between rounded-2xl border-2 border-slate-200 bg-white p-5 hover:border-[#0B2A4A] transition dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-500 shadow-xs"
              >
                <div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-700 dark:text-slate-300">{adj.streamLabel.split(' ')[0]}</span>
                    <span className="rounded-full bg-blue-50/90 px-2.5 py-0.5 font-black text-[#0B2A4A] border border-blue-200 dark:bg-blue-950 dark:text-blue-200">
                      {similarityScore}% Match
                    </span>
                  </div>
                  <h4 className="font-black text-base text-slate-950 group-hover:text-[#0B2A4A] dark:text-white mt-2.5">
                    {adj.title}
                  </h4>
                  <p className="text-xs text-slate-700 dark:text-slate-300 line-clamp-2 mt-1.5 leading-relaxed font-normal">{adj.description}</p>
                </div>
                <div className="mt-4 text-xs font-bold text-[#0B2A4A] dark:text-blue-400 inline-flex items-center gap-1 group-hover:underline">
                  Explore Roadmap →
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Reviews Section */}
      <div className="rounded-3xl border-2 border-slate-200 bg-white p-6 sm:p-8 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <h3 className="text-xl sm:text-2xl font-black text-[#0B2A4A] dark:text-white mb-6">
          Student & Alumni Perspectives ({reviews.length})
        </h3>

        {/* Review Form */}
        <form onSubmit={handleSubmitReview} className="rounded-2xl border-2 border-slate-200 bg-[#F8F9FA] p-5 mb-8 dark:border-slate-800 dark:bg-slate-800/50">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-3">
            Share Your Insight On This Career
          </h4>
          <div className="flex items-center gap-1.5 mb-3">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 mr-1">Rating:</span>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setReviewRating(star)}
                className="p-0.5 hover:scale-110 transition"
              >
                <Star
                  className={`h-4 w-4 ${
                    reviewRating >= star
                      ? 'fill-amber-400 text-amber-500'
                      : 'text-slate-300 dark:text-slate-600'
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
            placeholder="Headline of your perspective..."
            className="w-full rounded-xl border-2 border-slate-300 bg-white px-3 py-2.5 text-xs sm:text-sm font-medium text-slate-900 focus:border-[#0B2A4A] focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white mb-2.5 shadow-xs"
          />

          <textarea
            required
            rows={3}
            value={reviewComment}
            onChange={(e) => setReviewComment(e.target.value)}
            placeholder="Share honest details about preparation, difficulty, or industry reality..."
            className="w-full rounded-xl border-2 border-slate-300 bg-white px-3 py-2.5 text-xs sm:text-sm font-medium text-slate-900 focus:border-[#0B2A4A] focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white mb-3 shadow-xs"
          />

          <button
            type="submit"
            disabled={submittingReview}
            className="rounded-xl bg-[#0B2A4A] px-5 py-2.5 text-xs sm:text-sm font-bold text-white hover:bg-[#071C33] disabled:opacity-50 transition shadow-xs"
          >
            {submittingReview ? 'Posting...' : 'Submit Perspective'}
          </button>
        </form>

        {/* Existing Reviews */}
        <div className="flex flex-col gap-4">
          {reviews.length === 0 ? (
            <p className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400">Be the first to share an insight for this career!</p>
          ) : (
            reviews.map((r) => (
              <div key={r.id} className="border-b-2 border-slate-100 dark:border-slate-800 pb-4">
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="font-black text-slate-950 dark:text-white">{r.userName}</span>
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <Star
                        key={idx}
                        className={`h-3.5 w-3.5 ${
                          idx < r.rating
                            ? 'fill-amber-400 text-amber-500'
                            : 'text-slate-200 dark:text-slate-700'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <h5 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100 mt-1">{r.title}</h5>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 mt-1 leading-relaxed font-normal">{r.comment}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
