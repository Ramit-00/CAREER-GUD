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
  let badgeBg = 'bg-emerald-50 text-emerald-800 border-emerald-300';
  let Icon = CheckCircle2;

  if (score > 0.6) {
    color = 'from-rose-500 to-red-600';
    badgeBg = 'bg-rose-50 text-rose-800 border-rose-300';
    Icon = ShieldAlert;
  } else if (score > 0.3) {
    color = 'from-amber-500 to-orange-500';
    badgeBg = 'bg-amber-50 text-amber-800 border-amber-300';
    Icon = AlertTriangle;
  }

  return (
    <div className={`flex flex-col gap-2.5 rounded-xl border border-slate-200 bg-white p-4 shadow-xs ${className}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
          AI Automation Exposure
        </span>
        <div className={`flex items-center gap-1.5 rounded-md border px-2.5 py-0.5 text-xs font-extrabold ${badgeBg}`}>
          <Icon className="h-3.5 w-3.5" />
          <span>{percentage}% Risk</span>
        </div>
      </div>

      {/* Visual Bar */}
      <div className="relative h-2.5 w-full overflow-hidden rounded-md bg-slate-200">
        <div
          className={`h-full rounded-md bg-gradient-to-r ${color} transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="flex items-center justify-between text-xs font-bold">
        <span className="text-slate-950">{label}</span>
        <span className="text-slate-700">
          {percentage < 30 ? 'High Human Resilience' : percentage < 60 ? 'AI-Assisted Hybrid' : 'High Routine Replacement'}
        </span>
      </div>
    </div>
  );
}
