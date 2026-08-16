/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4C1D95',
          light: '#7C3AED',
          lighter: '#8B5CF6',
          dark: '#2E1065',
          darker: '#1E0A4E',
        },
        secondary: {
          DEFAULT: '#A78BFA',
          light: '#C4B5FD',
          dark: '#7C3AED',
        },
        accent: {
          DEFAULT: '#F59E0B',
          light: '#FCD34D',
          dark: '#D97706',
        },
        aqua: {
          DEFAULT: '#06B6D4',
          light: '#67E8F9',
          dark: '#0891B2',
        },
        success: {
          DEFAULT: '#10B981',
          light: '#6EE7B7',
          dark: '#059669',
        },
        error: {
          DEFAULT: '#F87171',
          light: '#FCA5A5',
          dark: '#DC2626',
        },
        warning: {
          DEFAULT: '#FBBF24',
          light: '#FDE68A',
        },
        bg: {
          light: '#FAF8FF',
          dark: '#0F0A1E',
        },
        surface: {
          DEFAULT: '#1A1235',
          elevated: '#231A45',
          card: '#2A2155',
        },
        border: {
          DEFAULT: 'rgba(167,139,250,0.15)',
          bright: 'rgba(167,139,250,0.35)',
        },
      },
      fontFamily: {
        display: ['Nunito', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      fontSize: {
        'display-xl': ['3rem', { lineHeight: '1.1', fontWeight: '800' }],
        'display-lg': ['2.25rem', { lineHeight: '1.2', fontWeight: '700' }],
        'display-md': ['1.75rem', { lineHeight: '1.25', fontWeight: '700' }],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.25rem',
        '4xl': '1.75rem',
      },
      boxShadow: {
        'glow-primary': '0 0 20px rgba(124,58,237,0.4)',
        'glow-accent': '0 0 20px rgba(245,158,11,0.4)',
        'glow-success': '0 0 20px rgba(16,185,129,0.4)',
        'glow-aqua': '0 0 20px rgba(6,182,212,0.4)',
        card: '0 4px 24px rgba(0,0,0,0.3)',
        'card-hover': '0 8px 40px rgba(0,0,0,0.45)',
        elevated: '0 8px 32px rgba(76,29,149,0.25)',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #4C1D95 0%, #7C3AED 100%)',
        'gradient-accent': 'linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)',
        'gradient-aqua': 'linear-gradient(135deg, #06B6D4 0%, #3B82F6 100%)',
        'gradient-success': 'linear-gradient(135deg, #10B981 0%, #06B6D4 100%)',
        'gradient-dark': 'linear-gradient(180deg, #0F0A1E 0%, #1A1235 100%)',
        'gradient-surface': 'linear-gradient(135deg, #1A1235 0%, #231A45 100%)',
        'gradient-xp': 'linear-gradient(90deg, #A78BFA 0%, #4C1D95 100%)',
        'world-shimmer': 'linear-gradient(90deg, transparent 0%, rgba(167,139,250,0.1) 50%, transparent 100%)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 8s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
        'bounce-subtle': 'bounceSubtle 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'xp-fill': 'xpFill 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.05)' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        xpFill: {
          '0%': { width: '0%' },
          '100%': { width: 'var(--xp-width)' },
        },
      },
    },
  },
  plugins: [],
}
