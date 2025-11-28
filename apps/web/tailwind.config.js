/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // OlympusBet Luxury Marble/Gold Theme
      colors: {
        // Primary colors - Gold
        gold: {
          50: '#FFF9E6',
          100: '#FFF3CC',
          200: '#FFE799',
          300: '#FFDB66',
          400: '#FFCF33',
          500: '#FFD700', // Primary Gold
          600: '#D4AF37', // Classic Gold
          700: '#B8860B', // Dark Goldenrod
          800: '#8B6914',
          900: '#5E4609',
        },
        // Secondary colors - Marble
        marble: {
          50: '#FAFAFA',
          100: '#F5F5F5',
          200: '#EEEEEE',
          300: '#E0E0E0',
          400: '#BDBDBD',
          500: '#9E9E9E',
          600: '#757575',
          700: '#616161',
          800: '#424242',
          900: '#212121',
        },
        // Accent colors - Olympian Blue
        olympian: {
          50: '#E3F2FD',
          100: '#BBDEFB',
          200: '#90CAF9',
          300: '#64B5F6',
          400: '#42A5F5',
          500: '#1E3A5F', // Deep Olympian Blue
          600: '#1565C0',
          700: '#0D47A1',
          800: '#0A3A7E',
          900: '#072D5B',
        },
        // Faction colors
        sparta: {
          500: '#8B0000', // Dark Red
          600: '#700000',
          700: '#550000',
        },
        athens: {
          500: '#1E3A5F', // Navy Blue
          600: '#152A47',
          700: '#0C1A2F',
        },
        // Rank colors
        rank: {
          mortal: '#8B7355',
          hero: '#CD7F32',
          demigod: '#C0C0C0',
          titan: '#FFD700',
          olympian: '#E5E4E2',
          god: '#B9F2FF',
        },
      },
      // Typography
      fontFamily: {
        display: ['Cinzel', 'serif'], // Greek-inspired display font
        body: ['Cormorant Garamond', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
      // Backgrounds
      backgroundImage: {
        'marble-texture': "url('/textures/marble.png')",
        'gold-gradient': 'linear-gradient(135deg, #D4AF37 0%, #FFD700 50%, #D4AF37 100%)',
        'olympus-gradient': 'linear-gradient(180deg, #1E3A5F 0%, #0A1628 100%)',
      },
      // Box shadows
      boxShadow: {
        'gold-glow': '0 0 20px rgba(212, 175, 55, 0.5)',
        'marble-soft': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      },
      // Animations
      animation: {
        'gold-shimmer': 'shimmer 2s linear infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
};
