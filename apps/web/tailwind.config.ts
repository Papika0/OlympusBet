import type { Config } from 'tailwindcss';

/**
 * OlympusBet Tailwind Configuration
 * 
 * Design Theme: "Divine Luxury"
 * - Deep midnight blues for backgrounds
 * - Marble whites for text and accents
 * - Shimmering metallic golds for highlights
 */
const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary palette - Divine Luxury
        olympus: {
          midnight: '#0f172a', // Deep midnight blue
          navy: '#1e293b',
          slate: '#334155',
          marble: '#f8fafc', // Marble white
          gold: '#ffd700', // Metallic gold
          'gold-dark': '#ff8c00',
          'gold-light': '#ffe066',
        },
        // Faction colors
        sparta: {
          primary: '#dc2626', // Red - Blood of warriors
          secondary: '#991b1b',
        },
        athens: {
          primary: '#2563eb', // Blue - Wisdom of Athena
          secondary: '#1d4ed8',
        },
      },
      fontFamily: {
        // Cinzel - Greek/Roman inscription style for headings
        cinzel: ['Cinzel', 'serif'],
        // Inter - Clean and readable for body text
        inter: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        // Glassmorphism gradients
        'glass-dark': 'linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.6) 100%)',
        'glass-gold': 'linear-gradient(135deg, rgba(255, 215, 0, 0.1) 0%, rgba(255, 140, 0, 0.05) 100%)',
        // Gold shimmer effect
        'gold-shimmer': 'linear-gradient(90deg, #ffd700 0%, #ff8c00 50%, #ffd700 100%)',
      },
      boxShadow: {
        // Golden glow effects
        'gold-glow': '0 0 20px rgba(255, 215, 0, 0.3)',
        'gold-glow-lg': '0 0 40px rgba(255, 215, 0, 0.4)',
        // Glass effect shadows
        glass: '0 8px 32px rgba(0, 0, 0, 0.3)',
      },
      animation: {
        // Custom animations for mythology effects
        'shimmer': 'shimmer 2s linear infinite',
        'pulse-gold': 'pulse-gold 2s ease-in-out infinite',
        'lightning': 'lightning 0.5s ease-out',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
        'pulse-gold': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        lightning: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '50%': { opacity: '1' },
          '100%': { opacity: '0', transform: 'translateY(10px)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
