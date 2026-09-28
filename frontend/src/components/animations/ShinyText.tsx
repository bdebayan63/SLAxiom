import React from 'react';

interface ShinyTextProps {
  text: string;
  disabled?: boolean;
  speed?: number;
  className?: string;
}

export const ShinyText: React.FC<ShinyTextProps> = ({
  text,
  disabled = false,
  speed = 4,
  className = '',
}) => {
  return (
    <span
      className={`relative inline-block font-bold overflow-hidden ${
        disabled
          ? 'text-slate-400'
          : 'bg-clip-text text-transparent bg-gradient-to-r from-purple-900 via-amber-700 to-purple-800'
      } ${className}`}
      style={{
        backgroundImage: disabled
          ? 'none'
          : 'linear-gradient(120deg, #581c87 0%, #b45309 50%, #581c87 100%)',
        backgroundSize: '200% 100%',
        animation: disabled ? 'none' : `shine ${speed}s linear infinite`,
      }}
    >
      {text}
      <style>{`
        @keyframes shine {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </span>
  );
};
