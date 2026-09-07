'use client';

import { AutomationMeter } from '@/components/charts/AutomationMeter';
import { Career, Review } from '@/types';
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  BookOpen,
  Briefcase,
  CheckCircle2,
  Clock,
  GraduationCap,
  Sparkles,
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
      const res = await fetch('/api/users/me', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'CAREER', slug }),
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
      <div className="py-24 text-center text-sm text-slate-500">
        <span className="animate-spin inline-block h-6 w-6 border-2 border-indigo-600 border-t-transparent rounded-full mb-3" />
        <p>Loading career intelligence profile...</p>
      </div>
    );
  }

  if (!career) {
    return (
      <div className="py-24 text-center">
        <h2 className="text-xl font-bold">Career Profile Not Found</h2>
        <Link href="/careers" className="mt-4 inline-block text-indigo-600 underline">
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
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Careers Directory
        </Link>
      </div>

      {/* Header Banner */}
      <div className="rounded-3xl border border-slate-200 bg-white p-8 sm:p-10 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300">
                {career.streamLabel}
              </span>
              <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <TrendingUp className="h-3.5 w-3.5" />
                {career.outlook.demandTrend}
              </span>
            </div>

            <h1 className="mt-3 text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
              {career.title}
            </h1>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
              {career.description}
            </p>
          </div>

          <button
            onClick={handleToggleBookmark}
            className={`flex items-center gap-1.5 rounded-xl border px-4 py-2.5 text-xs font-bold transition shrink-0 ${
              bookmarked
                ? 'border-indigo-600 bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'
                : 'border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200'
            }`}
          >
            <Bookmark className="h-4 w-4" />
            <span>{bookmarked ? 'Saved to Profile' : 'Save Career'}</span>
          </button>
        </div>

        {/* Salary Bands */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-slate-100 dark:border-slate-800">
          <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/40">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Entry Level (0-2 Yrs)</span>
            <div className="mt-1 text-lg font-black text-slate-900 dark:text-white">{career.outlook.avgSalaryRangeINR.entry}</div>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/40">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Mid Career (3-7 Yrs)</span>
            <div className="mt-1 text-lg font-black text-indigo-600 dark:text-indigo-400">{career.outlook.avgSalaryRangeINR.mid}</div>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/40">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Senior Practice (8+ Yrs)</span>
            <div className="mt-1 text-lg font-black text-emerald-600 dark:text-emerald-400">{career.outlook.avgSalaryRangeINR.senior}</div>
          </div>
        </div>
      </div>

      {/* Automation Risk & Future Outlook */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Future Resilience
            </span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
              AI Automation Vulnerability
            </h3>
            <div className="mt-4">
              <AutomationMeter
                score={career.outlook.automationRiskScore}
                label={career.outlook.automationRiskLabel}
              />
            </div>
            <p className="mt-4 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {career.outlook.growthNotes}
            </p>
          </div>

          <div className="mt-6 rounded-2xl bg-slate-50 p-3 text-xs text-slate-500 dark:bg-slate-800/50">
            <strong>Regional Hotspots:</strong> {career.outlook.regionalDemandNotes}
          </div>
        </div>

        {/* Day in the Life */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="h-4 w-4 text-teal-500" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">A Day in the Life</h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {career.dayInTheLife}
          </p>

          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mt-6 mb-2">
            Core Technical & Personal Competencies
          </h4>
          <div className="flex flex-wrap gap-2">
            {career.requiredSkills.map((skill, i) => (
              <span
                key={i}
                className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Eligibility & Entrance Exams */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-2 mb-4">
          <GraduationCap className="h-5 w-5 text-indigo-600" />
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            Eligibility & Entrance Gateway
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs">
          <div>
            <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">10+2 Stream Requirement</span>
            <p className="mt-1 font-semibold text-slate-800 dark:text-slate-200">{career.eligibility.streamRequirement}</p>
          </div>
          <div>
            <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Mandatory Subjects</span>
            <p className="mt-1 font-semibold text-slate-800 dark:text-slate-200">{career.eligibility.mandatorySubjects.join(', ')}</p>
          </div>
          <div>
            <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Academic Cutoff Guidance</span>
            <p className="mt-1 font-semibold text-slate-800 dark:text-slate-200">{career.eligibility.minimumPercentageGuide}</p>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">National Entrance Exams:</span>
          <div className="mt-2 flex flex-wrap gap-2">
            {career.eligibility.topEntranceExams.map((exam, i) => (
              <span
                key={i}
                className="rounded-lg bg-indigo-50 border border-indigo-100 px-3 py-1 text-xs font-bold text-indigo-700 dark:bg-indigo-950/50 dark:border-indigo-900 dark:text-indigo-300"
              >
                🎯 {exam}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Pathway Stepper */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
          Education & Career Roadmap
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {career.pathwaySteps.map((step, idx) => (
            <div key={idx} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs dark:border-slate-800 dark:bg-slate-800/40">
              <span className="rounded-full bg-indigo-600 text-white font-black px-2 py-0.5 text-[10px]">
                {step.stage}
              </span>
              <p className="mt-2 text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
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
              <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                Vector Similarity Engine
              </span>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                Adjacent Careers You Might Also Like
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {adjacentCareers.map(({ career: adj, similarityScore }) => (
              <Link
                key={adj.id}
                href={`/careers/${adj.slug}`}
                className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 hover:border-indigo-400 transition dark:border-slate-800 dark:bg-slate-900"
              >
                <div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">{adj.streamLabel.split(' ')[0]}</span>
                    <span className="rounded-full bg-teal-50 px-2 py-0.5 font-bold text-teal-700 dark:bg-teal-950 dark:text-teal-300">
                      {similarityScore}% Match
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 group-hover:text-indigo-600 dark:text-white mt-2">
                    {adj.title}
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1">{adj.description}</p>
                </div>
                <div className="mt-4 text-xs font-semibold text-indigo-600 dark:text-indigo-400 inline-flex items-center gap-1">
                  Explore Roadmap →
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Reviews Section */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
          Student & Alumni Perspectives ({reviews.length})
        </h3>

        {/* Review Form */}
        <form onSubmit={handleSubmitReview} className="rounded-2xl border border-slate-100 bg-slate-50 p-4 mb-8 dark:border-slate-800 dark:bg-slate-800/40">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-3">
            Share Your Insight On This Career
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
            placeholder="Headline of your perspective..."
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white mb-2"
          />

          <textarea
            required
            rows={3}
            value={reviewComment}
            onChange={(e) => setReviewComment(e.target.value)}
            placeholder="Share honest details about preparation, difficulty, or industry reality..."
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white mb-3"
          />

          <button
            type="submit"
            disabled={submittingReview}
            className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-500 disabled:opacity-50 transition"
          >
            {submittingReview ? 'Posting...' : 'Submit Perspective'}
          </button>
        </form>

        {/* Existing Reviews */}
        <div className="flex flex-col gap-4">
          {reviews.length === 0 ? (
            <p className="text-xs text-slate-400">Be the first to share an insight for this career!</p>
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
