/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        midnight: '#0A0E1C',
        surface: '#131A2C',
        'surface-raised': '#1B2438',
        gold: '#C9A227',
        'gold-soft': '#E8C766',
        cream: '#F3EFE6',
        slate: '#8B93A7',
        emerald: '#34D399',
        rose: '#F2697A',
      },
      fontFamily: {
        display: ['Cormorant Garamond', 'Georgia', 'serif'],
        body: ['Plus Jakarta Sans', 'sans-serif'],
        arabic: ['IBM Plex Sans Arabic', 'sans-serif'],
      },
      fontVariantNumeric: {
        tabular: 'tabular-nums',
      },
      borderRadius: {
        control: '8px',
        card: '16px',
      },
      animation: {
        'count-up': 'countUp 0.8s ease-out forwards',
        'fill-bar': 'fillBar 1s ease-out forwards',
      },
      keyframes: {
        countUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fillBar: {
          '0%': { width: '0%' },
        },
      },
    },
  },
  plugins: [],
};
