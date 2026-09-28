import React, { useEffect, useState } from 'react';

interface CountUpProps {
  to: number;
  from?: number;
  duration?: number;
  decimals?: number;
  suffix?: string;
  className?: string;
}

export const CountUp: React.FC<CountUpProps> = ({
  to,
  from = 0,
  duration = 1.6,
  decimals = 3,
  suffix = '',
  className = '',
}) => {
  const [current, setCurrent] = useState(from);

  useEffect(() => {
    let startTime: number | null = null;
    let frameId: number;

    const easeOutCubic = (x: number): number => 1 - Math.pow(1 - x, 3);

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = (timestamp - startTime) / 1000;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutCubic(progress);

      const val = from + (to - from) * eased;
      setCurrent(val);

      if (progress < 1) {
        frameId = requestAnimationFrame(step);
      } else {
        setCurrent(to);
      }
    };

    frameId = requestAnimationFrame(step);

    return () => cancelAnimationFrame(frameId);
  }, [to, from, duration]);

  return (
    <span className={`font-tabular ${className}`}>
      {current.toFixed(decimals)}
      {suffix}
    </span>
  );
};
