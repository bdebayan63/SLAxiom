import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Loader2 } from 'lucide-react';

interface HoldButtonProps {
  label: string;
  onExecute: () => void | Promise<void>;
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
}

export const HoldButton: React.FC<HoldButtonProps> = ({
  label,
  onExecute,
  isLoading = false,
  disabled = false,
  className = '',
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.button
      type="button"
      onClick={onExecute}
      disabled={disabled || isLoading}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileTap={{ scale: 0.98 }}
      className={`relative inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200 overflow-hidden shadow-sm disabled:opacity-50 disabled:cursor-not-allowed ${
        disabled
          ? 'bg-slate-100 text-slate-400 border border-slate-200'
          : 'bg-gradient-to-r from-purple-700 via-violet-700 to-purple-800 text-white hover:shadow-purple-500/20 hover:from-purple-600 hover:to-violet-700 border border-purple-600'
      } ${className}`}
    >
      {/* Background Sheen Effect */}
      <motion.div
        className="absolute inset-0 bg-white/20 pointer-events-none"
        initial={{ x: '-100%' }}
        animate={{ x: isHovered ? '100%' : '-100%' }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
      />

      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin text-purple-200" />
          <span>Generating ZK-SNARK Proof...</span>
        </>
      ) : (
        <>
          <ShieldCheck className="w-4 h-4 text-purple-200" />
          <span>{label}</span>
        </>
      )}
    </motion.button>
  );
};
