import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  threshold: string;
  status: 'NORMAL' | 'WARNING' | 'DANGER' | 'Good';
  icon: LucideIcon;
  subtext?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  unit,
  threshold,
  status,
  icon: Icon,
  subtext
}) => {
  const getStatusColor = () => {
    switch (status) {
      case 'NORMAL':
      case 'Good':
        return 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800';
      case 'WARNING':
        return 'text-amber-600 bg-amber-50 dark:bg-amber-950/50 dark:text-amber-400 border-amber-200 dark:border-amber-800';
      case 'DANGER':
        return 'text-rose-600 bg-rose-50 dark:bg-rose-950/50 dark:text-rose-400 border-rose-200 dark:border-rose-800';
      default:
        return 'text-slate-600 bg-slate-50 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">{title}</span>
        <div className="p-2 rounded-lg bg-aqua-50 dark:bg-aqua-950/40 text-aqua-600 dark:text-aqua-400">
          <Icon className="w-4 h-4" />
        </div>
      </div>
      
      <div className="flex items-baseline space-x-1.5">
        <span className="text-3xl font-extrabold text-slate-800 dark:text-slate-100">{value}</span>
        {unit && <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{unit}</span>}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
        <span className="text-slate-400 dark:text-slate-500">{threshold}</span>
        <span className={`px-2 py-0.5 rounded-full font-semibold border ${getStatusColor()}`}>
          {status}
        </span>
      </div>
      {subtext && <p className="mt-1 text-[11px] text-slate-400">{subtext}</p>}
    </div>
  );
};