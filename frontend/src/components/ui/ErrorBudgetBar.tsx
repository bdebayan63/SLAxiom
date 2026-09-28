import React from 'react';
import { motion } from 'motion/react';

interface ErrorBudgetBarProps {
  remainingPercent: number; // e.g. 72.4%
  allowedMinutesLeft: number; // e.g. 134 minutes
  burnRate: number; // e.g. 0.85x
}

export const ErrorBudgetBar: React.FC<ErrorBudgetBarProps> = ({
  remainingPercent,
  allowedMinutesLeft,
  burnRate,
}) => {
  const isHealthy = remainingPercent > 30;
  const isWarning = remainingPercent <= 30 && remainingPercent > 10;
  const barColor = isHealthy
    ? 'bg-gradient-to-r from-purple-600 to-violet-600' // Royal Violet (Zero green, zero blue)
    : isWarning
    ? 'bg-amber-500'
    : 'bg-rose-500';

  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between items-center text-xs">
        <span className="text-slate-600 font-medium">Monthly Error Budget</span>
        <div className="flex items-center gap-3">
          <span className="font-tabular text-slate-800 font-semibold">
            {allowedMinutesLeft}m remaining
          </span>
          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-100 text-slate-600 border border-slate-200">
            {burnRate}x burn
          </span>
        </div>
      </div>

      {/* Progress Track */}
      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200 p-0.5">
        <motion.div
          className={`h-full rounded-full ${barColor}`}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(Math.max(remainingPercent, 0), 100)}%` }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>

      <div className="flex justify-between text-[11px] text-slate-400">
        <span>0% depleted</span>
        <span className="font-tabular text-slate-700 font-semibold">{remainingPercent.toFixed(1)}% safe</span>
        <span>100% breach</span>
      </div>
    </div>
  );
};
