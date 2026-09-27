import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        canvas: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#ffffff', // Clean white base
        },
        brand: {
          violet: '#7c3aed',
          amethyst: '#8b5cf6',
          coral: '#e11d48',
          rose: '#f43f5e',
          amber: '#d97706',
          bronze: '#b45309',
        },
      },
      fontFamily: {
        heading: ['Geist', 'Inter', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"Geist Mono"', '"JetBrains Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
};

export default config;
