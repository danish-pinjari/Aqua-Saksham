import React from 'react';

interface GaugeChartProps {
  percentage: number;
}

export const GaugeChart: React.FC<GaugeChartProps> = ({ percentage }) => {
  const getColor = (pct: number) => {
    if (pct <= 20) return '#10b981'; // emerald-500
    if (pct <= 50) return '#f59e0b'; // amber-500
    if (pct <= 75) return '#f97316'; // orange-500
    return '#ef4444'; // red-500
  };

  const strokeDashoffset = 100 - percentage;
  const strokeColor = getColor(percentage);

  return (
    <div className="relative w-36 h-36 flex items-center justify-center">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
        <path
          className="text-slate-100 dark:text-slate-800"
          strokeWidth="3.8"
          stroke="currentColor"
          fill="none"
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
        />
        <path
          stroke={strokeColor}
          strokeWidth="3.8"
          strokeDasharray="100, 100"
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="none"
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          style={{ transition: 'stroke-dashoffset 0.8s ease-in-out' }}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-2xl font-black text-slate-800 dark:text-slate-100">{percentage}%</span>
        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Estimated</span>
      </div>
    </div>
  );
};