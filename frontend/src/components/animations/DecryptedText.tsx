import React, { useEffect, useState } from 'react';

interface DecryptedTextProps {
  text: string;
  speed?: number;
  className?: string;
  trigger?: any;
}

const GLYPHS = '0123456789ABCDEFabcdef!@#$%^&*<>~';

export const DecryptedText: React.FC<DecryptedTextProps> = ({
  text,
  speed = 30,
  className = '',
  trigger,
}) => {
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    let iteration = 0;
    const maxIterations = text.length;

    const interval = setInterval(() => {
      setDisplayText(
        text
          .split('')
          .map((char, index) => {
            if (index < iteration) {
              return text[index];
            }
            if (char === ' ') return ' ';
            return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          })
          .join('')
      );

      iteration += 1 / 2;

      if (iteration >= maxIterations) {
        clearInterval(interval);
        setDisplayText(text);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed, trigger]);

  return <span className={`font-mono ${className}`}>{displayText || text}</span>;
};
