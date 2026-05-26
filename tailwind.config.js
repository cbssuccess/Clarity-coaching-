/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Deep dark backgrounds
        'app-bg': '#13131f',
        'card-bg': '#1c1c2e',
        'surface': '#242438',
        'surface-2': '#2d2d45',
        'border': '#3a3a55',
        // Pastel accent palette
        'pastel-rose': '#f4b8c1',
        'pastel-lavender': '#c4b5fd',
        'pastel-mint': '#a7f3d0',
        'pastel-peach': '#fcd5b5',
        'pastel-sky': '#bae6fd',
        'pastel-yellow': '#fef08a',
        // Text
        'text-primary': '#e8e8f0',
        'text-secondary': '#9898b8',
        'text-muted': '#5a5a78',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow-rose': '0 0 20px rgba(244, 184, 193, 0.15)',
        'glow-lavender': '0 0 20px rgba(196, 181, 253, 0.15)',
        'glow-mint': '0 0 20px rgba(167, 243, 208, 0.15)',
        'glow-peach': '0 0 20px rgba(252, 213, 181, 0.15)',
        'glow-sky': '0 0 20px rgba(186, 230, 253, 0.15)',
        'glow-yellow': '0 0 20px rgba(254, 240, 138, 0.15)',
        'glow-soft': '0 0 30px rgba(196, 181, 253, 0.1)',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-in-right': 'slideInRight 0.35s ease-out',
        'celebration': 'celebration 0.5s ease-out',
        'float': 'float 3s ease-in-out infinite',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(100%)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        celebration: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
      },
    },
  },
  plugins: [],
}
