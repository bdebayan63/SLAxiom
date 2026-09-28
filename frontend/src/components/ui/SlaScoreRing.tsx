import React from 'react';
import { motion } from 'motion/react';

interface SlaScoreRingProps {
  attainment: number; // e.g. 99.994
  target: number; // e.g. 99.900
  size?: number;
  strokeWidth?: number;
  label?: string;
}

export const SlaScoreRing: React.FC<SlaScoreRingProps> = ({
  attainment,
  target,
  size = 170,
  strokeWidth = 11,
  label = 'Availability SLA',
}) => {
  const center = size / 2;
  const radius = center - strokeWidth - 4;
  const circumference = 2 * Math.PI * radius;

  const minScale = 98.0;
  const normalized = Math.min(Math.max((attainment - minScale) / (100 - minScale), 0), 1);
  const strokeDashoffset = circumference - normalized * circumference;

  const isHealthy = attainment >= target;
  const isWarning = attainment < target && attainment >= target - 0.2;
  const strokeColor = isHealthy
    ? '#7c3aed' // Royal Violet (Zero blue, zero green)
    : isWarning
    ? '#d97706' // Warm Amber
    : '#e11d48'; // Rose Crimson

  const targetNorm = (target - minScale) / (100 - minScale);
  const targetAngle = targetNorm * 360 - 90;
  const targetRad = (targetAngle * Math.PI) / 180;
  const x1 = center + (radius - strokeWidth / 2) * Math.cos(targetRad);
  const y1 = center + (radius - strokeWidth / 2) * Math.sin(targetRad);
  const x2 = center + (radius + strokeWidth / 2) * Math.cos(targetRad);
  const y2 = center + (radius + strokeWidth / 2) * Math.sin(targetRad);

  return (
    <div className="relative inline-flex flex-col items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background Track */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke="#f1f5f9"
          strokeWidth={strokeWidth}
          fill="none"
        />

        {/* Target Indicator */}
        <line
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke="#94a3b8"
          strokeWidth={2}
          strokeDasharray="2 2"
        />

        {/* Animated Attainment Arc */}
        <motion.circle
          cx={center}
          cy={center}
          r={radius}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeLinecap="round"
          fill="none"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
        />
      </svg>

      {/* Interior Numeric Readout */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none pointer-events-none">
        <span className="font-tabular text-2xl font-bold tracking-tight text-slate-900">
          {attainment.toFixed(3)}%
        </span>
        <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mt-0.5">
          {label}
        </span>
        <div className="mt-1 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200">
          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: strokeColor }} />
          <span className="text-[10px] text-slate-600 font-mono font-medium">
            Obj: {target.toFixed(2)}%
          </span>
        </div>
      </div>
    </div>
  );
};
