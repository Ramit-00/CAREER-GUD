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
    { key: 'SCIENCE_PCM', label: 'PCM (Engineering)', color: '#6366f1' },
    { key: 'SCIENCE_PCB', label: 'PCB (Medical)', color: '#06b6d4' },
    { key: 'COMMERCE_MATHS', label: 'Commerce (Finance)', color: '#10b981' },
    { key: 'ARTS', label: 'Arts & Law', color: '#f59e0b' },
    { key: 'VOCATIONAL', label: 'Applied Technology', color: '#8b5cf6' },
  ];

  const maxVal = Math.max(...categories.map((c) => scores[c.key] || 0), 10);

  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">Aptitude & Interest Distribution</h4>
          <p className="text-xs text-slate-500">Multi-stream alignment across higher secondary paths</p>
        </div>
        <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300">
          5 Core Pillars
        </span>
      </div>

      {/* Progress Bars */}
      <div className="flex flex-col gap-3.5 pt-2">
        {categories.map((cat) => {
          const rawScore = scores[cat.key] || 0;
          const percentage = Math.min(Math.round((rawScore / maxVal) * 100), 100);

          return (
            <div key={cat.key} className="flex flex-col gap-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-700 dark:text-slate-200">{cat.label}</span>
                <span className="text-slate-500">{percentage}% Affinity</span>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
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
