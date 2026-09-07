import { AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react';

interface AutomationMeterProps {
  score: number; // 0.0 to 1.0
  label: string;
  className?: string;
}

export function AutomationMeter({ score, label, className = '' }: AutomationMeterProps) {
  const percentage = Math.round(score * 100);

  // Color selection
  let color = 'from-emerald-500 to-teal-500';
  let badgeBg = 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800';
  let Icon = CheckCircle2;

  if (score > 0.6) {
    color = 'from-rose-500 to-red-600';
    badgeBg = 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800';
    Icon = ShieldAlert;
  } else if (score > 0.3) {
    color = 'from-amber-500 to-orange-500';
    badgeBg = 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800';
    Icon = AlertTriangle;
  }

  return (
    <div className={`flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 ${className}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          AI Automation Exposure
        </span>
        <div className={`flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-bold ${badgeBg}`}>
          <Icon className="h-3.5 w-3.5" />
          <span>{percentage}% Risk</span>
        </div>
      </div>

      {/* Visual Bar */}
      <div className="relative h-3 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${color} transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="flex items-center justify-between text-xs text-slate-500">
        <span className="font-medium text-slate-700 dark:text-slate-300">{label}</span>
        <span>{percentage < 30 ? 'High Human Resilience' : percentage < 60 ? 'AI-Assisted Hybrid' : 'High Routine Replacement'}</span>
      </div>
    </div>
  );
}
