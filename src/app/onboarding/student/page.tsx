'use client';

import {
  AlertCircle,
  ArrowRight,
  Check,
  GraduationCap,
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const CLASS_OPTIONS = [
  { id: 'CLASS_9', label: 'Class 9', desc: 'Early foundation & skill exploration' },
  { id: 'CLASS_10', label: 'Class 10', desc: 'Stream selection (PCM / PCB / Commerce / Arts)' },
  { id: 'CLASS_11', label: 'Class 11', desc: '+1 Stream underway, preparing for entrances' },
  { id: 'CLASS_12', label: 'Class 12', desc: 'Final board year & college entrance exam sprint' },
  { id: 'POST_12', label: 'Dropper / Gap Year', desc: 'Targeting JEE / NEET / CUET / CLAT ranks' },
  { id: 'UNDERGRAD', label: 'College Undergrad', desc: 'Exploring adjacent careers & placements' },
];

const BOARD_OPTIONS = ['CBSE', 'ICSE / ISC', 'State Board', 'IB / Cambridge (IGCSE)', 'Other'];

const STREAM_OPTIONS = [
  { id: 'SCIENCE_PCM', label: 'Science: PCM (Physics, Chemistry, Maths)' },
  { id: 'SCIENCE_PCB', label: 'Science: PCB (Physics, Chemistry, Biology)' },
  { id: 'SCIENCE_PCMB', label: 'Science: PCMB (All Four Sciences)' },
  { id: 'COMMERCE_MATHS', label: 'Commerce with Mathematics' },
  { id: 'COMMERCE_NO_MATHS', label: 'Commerce without Mathematics' },
  { id: 'ARTS', label: 'Arts & Humanities' },
];

const POPULAR_INTERESTS = [
  'Artificial Intelligence',
  'Software & Web',
  'Medicine & Surgery',
  'Robotics',
  'Finance & Investment Banking',
  'Chartered Accountancy',
  'Corporate Law & Judiciary',
  'UI/UX & Product Design',
  'Aviation & Commercial Pilot',
  'Biotechnology & Genetics',
  'Civil Services (UPSC)',
];

export default function StudentOnboardingPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login?callbackUrl=/onboarding/student');
    }
  }, [status, router]);

  const [currentClass, setCurrentClass] = useState('CLASS_10');
  const [board, setBoard] = useState('CBSE');
  const [previousClassScore, setPreviousClassScore] = useState('');
  const [tenthScore, setTenthScore] = useState('');
  const [twelfthScore, setTwelfthScore] = useState('');
  const [currentStream, setCurrentStream] = useState<string | null>(null);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    'Artificial Intelligence',
  ]);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const toggleInterest = (item: string) => {
    if (selectedInterests.includes(item)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== item));
    } else {
      setSelectedInterests([...selectedInterests, item]);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/student/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentClass,
          board,
          previousClassPercentage: previousClassScore ? parseFloat(previousClassScore) : undefined,
          tenthPercentage: tenthScore ? parseFloat(tenthScore) : undefined,
          twelfthPercentage: twelfthScore ? parseFloat(twelfthScore) : undefined,
          currentStream: currentStream || undefined,
          interests: selectedInterests,
        }),
      });

      if (!res.ok) {
        throw new Error('Server returned error status');
      }

      router.push('/dashboard');
      router.refresh();
    } catch (err) {
      console.error('Failed to save onboarding profile:', err);
      setErrorMessage('Could not save academic profile. Please verify your marks and try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleSkip = () => {
    router.push('/dashboard');
  };

  const isSeniorStudent = ['CLASS_11', 'CLASS_12', 'POST_12', 'UNDERGRAD'].includes(currentClass);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-sm">
        {/* Welcome Header */}
        <div className="text-center">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0B2A4A] text-amber-400 shadow-xs mb-3">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div>
            <span className="inline-block px-3 py-1 rounded-md bg-amber-50 border border-amber-200 text-xs font-black text-[#994500] mb-2">
              Optional Academic Profile Setup
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B2A4A] tracking-tight">
            Welcome{session?.user?.name ? `, ${session.user.name}` : ''}!
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm font-medium text-slate-600 max-w-md mx-auto">
            Help CAREER-GUD calibrate your admission probability, prerequisite reality checks, and exam targets.
          </p>
        </div>

        {errorMessage && (
          <div className="mt-6 flex items-center gap-2 rounded-xl bg-rose-50 border border-rose-200 p-4 text-xs font-bold text-rose-800">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="mt-8 flex flex-col gap-6">
          {/* 1. Class Selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5">
              1. In which class / academic stage are you currently studying?
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {CLASS_OPTIONS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCurrentClass(c.id)}
                  className={`flex flex-col items-start rounded-xl border p-3 text-left transition cursor-pointer ${
                    currentClass === c.id
                      ? 'border-[#0B2A4A] bg-[#0B2A4A]/5 ring-2 ring-[#0B2A4A]'
                      : 'border-slate-300 bg-white hover:bg-slate-100 hover:border-slate-400'
                  }`}
                >
                  <span className="text-xs sm:text-sm font-bold text-slate-900">
                    {c.label}
                  </span>
                  <span className="text-[11px] font-medium text-slate-500 mt-0.5">
                    {c.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Educational Board */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              2. Which School Educational Board?
            </label>
            <div className="flex flex-wrap gap-2">
              {BOARD_OPTIONS.map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => setBoard(b)}
                  className={`rounded-xl border px-3.5 py-2 text-xs font-bold transition cursor-pointer ${
                    board === b
                      ? 'border-[#0B2A4A] bg-[#0B2A4A] text-white'
                      : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-950'
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Academic Percentage Breakdown */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
            <span className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
              3. Recent Academic Percentage (% Aggregate)
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Previous Class %
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  value={previousClassScore}
                  onChange={(e) => setPreviousClassScore(e.target.value)}
                  placeholder="e.g. 84.5"
                  className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs font-semibold text-slate-900 focus:border-[#0B2A4A] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Class 10 Board % (if completed)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  value={tenthScore}
                  onChange={(e) => setTenthScore(e.target.value)}
                  placeholder="e.g. 88.0"
                  className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs font-semibold text-slate-900 focus:border-[#0B2A4A] focus:outline-none"
                />
              </div>

              {isSeniorStudent && (
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Class 12 Board % (if completed)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    value={twelfthScore}
                    onChange={(e) => setTwelfthScore(e.target.value)}
                    placeholder="e.g. 82.5"
                    className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs font-semibold text-slate-900 focus:border-[#0B2A4A] focus:outline-none"
                  />
                </div>
              )}
            </div>
          </div>

          {/* 4. Stream (For Class 11 and above) */}
          {isSeniorStudent && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                4. Which Stream are you studying / did you complete?
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {STREAM_OPTIONS.map((st) => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => setCurrentStream(st.id)}
                    className={`rounded-xl border p-2.5 text-left text-xs font-bold transition cursor-pointer ${
                      currentStream === st.id
                        ? 'border-[#0B2A4A] bg-[#0B2A4A] text-white shadow-xs'
                        : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-950'
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 5. Key Interests */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              5. Select Careers & Domains you are curious about:
            </label>
            <div className="flex flex-wrap gap-2">
              {POPULAR_INTERESTS.map((item) => {
                const active = selectedInterests.includes(item);
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => toggleInterest(item)}
                    className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                      active
                        ? 'border-[#0B2A4A] bg-[#0B2A4A] text-white'
                        : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-950'
                    }`}
                  >
                    {active && <Check className="h-3 w-3" />}
                    <span>{item}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Buttons: Save vs. Skip */}
          <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={handleSkip}
              className="text-xs font-bold text-slate-500 hover:text-slate-900 transition cursor-pointer underline"
            >
              Skip for now, I&apos;ll fill this later
            </button>

            <button
              type="submit"
              disabled={saving}
              className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-[#0B2A4A] px-6 py-3 text-xs sm:text-sm font-bold text-white shadow-sm hover:bg-[#071C33] disabled:opacity-50 transition cursor-pointer"
            >
              {saving ? 'Saving Profile...' : 'Save & Proceed to Dashboard'}
              <ArrowRight className="h-4 w-4 text-amber-400" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
