import React from 'react';
import { motion } from 'motion/react';

interface SpringCheckProps {
  className?: string;
  size?: number;
}

export const SpringCheck: React.FC<SpringCheckProps> = ({
  className = '',
  size = 24,
}) => {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`text-purple-600 ${className}`}
      initial={{ scale: 0, rotate: -45 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 18,
      }}
    >
      <polyline points="20 6 9 17 4 12" />
    </motion.svg>
  );
};
