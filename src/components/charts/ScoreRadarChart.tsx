'use client';

interface ScoreRadarChartProps {
  scores: {
    SCIENCE_PCM?: number;
    SCIENCE_PCB?: number;
    SCIENCE_PCMB?: number;
    COMMERCE_MATHS?: number;
    COMMERCE_NO_MATHS?: number;
    ARTS?: number;
    VOCATIONAL?: number;
    [key: string]: number | undefined;
  };
}

export function ScoreRadarChart({ scores }: ScoreRadarChartProps) {
  const categories = [
    { key: 'SCIENCE_PCM', label: 'PCM (Engineering)', color: '#0B2A4A' },
    { key: 'SCIENCE_PCB', label: 'PCB (Medical)', color: '#0284C7' },
    { key: 'COMMERCE_MATHS', label: 'Commerce (Finance)', color: '#138808' },
    { key: 'ARTS', label: 'Arts & Law', color: '#D96B00' },
    { key: 'VOCATIONAL', label: 'Applied Technology', color: '#475569' },
  ];

  const maxVal = Math.max(...categories.map((c) => scores[c.key] || 0), 10);

  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-slate-300 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-base font-bold text-[#0B2A4A] dark:text-white">Aptitude & Interest Distribution</h4>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">Multi-stream alignment across higher secondary paths</p>
        </div>
        <span className="rounded-md bg-[#FFF8EE] border border-[#FFD8A8] px-2.5 py-1 text-xs font-bold text-[#994500] dark:bg-amber-950/40 dark:text-amber-200 dark:border-amber-800">
          5 Core Pillars
        </span>
      </div>

      {/* Progress Bars */}
      <div className="flex flex-col gap-4 pt-2">
        {categories.map((cat) => {
          const rawScore = scores[cat.key] || 0;
          const percentage = Math.min(Math.round((rawScore / maxVal) * 100), 100);

          return (
            <div key={cat.key} className="flex flex-col gap-1.5">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-900 dark:text-white">{cat.label}</span>
                <span className="text-slate-700 dark:text-slate-300">{percentage}% Affinity</span>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: cat.color,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
