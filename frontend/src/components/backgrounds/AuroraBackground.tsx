import React from 'react';
import { motion } from 'motion/react';

interface AuroraBackgroundProps {
  children?: React.ReactNode;
  className?: string;
}

export const AuroraBackground: React.FC<AuroraBackgroundProps> = ({
  children,
  className = '',
}) => {
  return (
    <div className={`relative min-h-screen w-full bg-[#fdfdfd] text-slate-900 overflow-hidden ${className}`}>
      {/* Dynamic Animated Ambient Luminous Orbs (Light Luxury Theme: Violet, Amber, Rose — No Blue, No Green) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Soft Royal Violet Ambient Bloom */}
        <motion.div
          animate={{
            x: ['-5%', '10%', '-8%'],
            y: ['-5%', '8%', '-10%'],
            scale: [1, 1.12, 0.96],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: 'mirror',
            ease: 'easeInOut',
          }}
          className="absolute -top-[10%] left-[15%] w-[620px] h-[620px] rounded-full bg-gradient-to-tr from-purple-200/50 via-violet-200/40 to-transparent blur-[110px]"
        />

        {/* Warm Golden Amber Secondary Glow */}
        <motion.div
          animate={{
            x: ['8%', '-10%', '6%'],
            y: ['10%', '-8%', '10%'],
            scale: [0.95, 1.15, 1],
          }}
          transition={{
            duration: 24,
            repeat: Infinity,
            repeatType: 'mirror',
            ease: 'easeInOut',
          }}
          className="absolute top-[30%] -right-[8%] w-[680px] h-[680px] rounded-full bg-gradient-to-br from-amber-200/45 via-orange-100/35 to-rose-100/30 blur-[120px]"
        />

        {/* Subtle Rose / Coral Accent Bloom */}
        <motion.div
          animate={{
            x: ['-8%', '8%', '-6%'],
            y: ['12%', '-6%', '8%'],
          }}
          transition={{
            duration: 26,
            repeat: Infinity,
            repeatType: 'mirror',
            ease: 'easeInOut',
          }}
          className="absolute -bottom-[15%] left-[20%] w-[580px] h-[580px] rounded-full bg-gradient-to-t from-rose-200/40 via-purple-100/30 to-transparent blur-[130px]"
        />

        {/* Elegant Micro-Lattice Pattern */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `
              radial-gradient(circle at 50% 50%, #7c3aed 1.5px, transparent 1.5px),
              linear-gradient(to right, rgba(124, 58, 237, 0.12) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(124, 58, 237, 0.12) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />

        {/* Top Fine Border Line */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-purple-300 to-transparent" />
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 w-full">{children}</div>
    </div>
  );
};
