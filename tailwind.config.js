/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './frontend/src/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './*.{ts,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          teal: '#8ec6c5',
          'teal-dark': '#6ba8a7',
          lavender: '#9b82b9',
          'lavender-dark': '#7d67a0',
          purple: '#a855f7',
          'purple-dark': '#7c3aed',
          blue: '#3b82f6',
          glow: '#c084fc',
        },
        antigravity: {
          base: '#0d0d12',
          panel: '#161622',
          input: '#1e1e2e',
          border: '#2a2a3e',
          surface: '#252535',
        },
        decision: {
          gold: '#f59e0b',
          green: '#10b981',
          red: '#ef4444',
          blue: '#6366f1',
        },
      },
      fontFamily: {
        sans: ['Roboto', 'system-ui', 'sans-serif'],
        display: ['Roboto', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideLeft: {
          '0%': { opacity: '0', transform: 'translateX(-12px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        dot: {
          '0%, 80%, 100%': { transform: 'scale(0.6)', opacity: '0.3' },
          '40%': { transform: 'scale(1)', opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        glowPulse: {
          '0%': { boxShadow: '0 0 0 0 rgba(168,85,247,0.3)' },
          '50%': { boxShadow: '0 0 20px 8px rgba(168,85,247,0.15)' },
          '100%': { boxShadow: '0 0 0 0 rgba(168,85,247,0.3)' },
        },
        glowRing: {
          '0%': { transform: 'scale(0.85)', opacity: '0.4' },
          '50%': { transform: 'scale(1.1)', opacity: '0.7' },
          '100%': { transform: 'scale(0.85)', opacity: '0.4' },
        },
        statusPulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.4' },
        },
        blob: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -40px) scale(1.05)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.95)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.35s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-left': 'slideLeft 0.35s ease-out',
        'dot': 'dot 1.4s infinite ease-in-out both',
        'shimmer': 'shimmer 2s infinite linear',
        'glow-pulse': 'glowPulse 2.5s infinite ease-in-out',
        'glow-ring': 'glowRing 4s infinite ease-in-out',
        'status-pulse': 'statusPulse 1.5s infinite ease-in-out',
        'blob': 'blob 25s infinite alternate ease-in-out',
        'scale-in': 'scaleIn 0.3s ease-out',
      },
      boxShadow: {
        'glow-purple': '0 0 20px 4px rgba(168,85,247,0.2)',
        'glow-teal': '0 0 20px 4px rgba(142,198,197,0.2)',
        'glow-sm': '0 0 10px 2px rgba(168,85,247,0.15)',
        'card-dark': '0 4px 24px rgba(0,0,0,0.4)',
        'card-light': '0 4px 24px rgba(0,0,0,0.06)',
      },
    },
  },
  plugins: [],
};
