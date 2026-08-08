/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      'xs':  '475px',
      'sm':  '640px',
      'md':  '768px',
      'lg':  '1024px',
      'xl':  '1280px',
      '2xl': '1536px',
    },
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          900: '#1e3a8a',
        },
        hireme: {
          50:  '#f0fce8',
          100: '#dcf5c4',
          200: '#baeb92',
          300: '#8fda57',
          400: '#6dc62b',
          500: '#55b32b',
          600: '#418f1e',
          700: '#326e18',
          800: '#285716',
          900: '#1e4011',
          950: '#0f2208',
        },
      },
      boxShadow: {
        'glow-green':    '0 0 20px -4px rgba(85,179,43,0.45)',
        'glow-green-lg': '0 0 40px -8px rgba(85,179,43,0.35)',
        'glow-indigo':   '0 0 20px -4px rgba(99,102,241,0.45)',
        'glow-sm':       '0 2px 8px 0 rgba(0,0,0,0.08)',
        'card':          '0 4px 24px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04)',
        'card-hover':    '0 12px 40px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)',
        'glass':         '0 8px 32px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.6)',
      },
      backgroundImage: {
        'hireme-gradient': 'linear-gradient(135deg, #55b32b 0%, #41a020 100%)',
        'hireme-shimmer':  'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.25) 50%, transparent 60%)',
      },
      animation: {
        'shimmer':       'shimmer 2.5s infinite linear',
        'float':         'float 6s ease-in-out infinite',
        'glow-pulse':    'glow-pulse 3s ease-in-out infinite',
        'slide-up':      'slide-up 0.4s cubic-bezier(0.16,1,0.3,1) both',
        'fade-in':       'fade-in 0.3s ease both',
        'spin-slow':     'spin 8s linear infinite',
      },
      keyframes: {
        shimmer: {
          '0%':   { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition:  '200% center' },
        },
        float: {
          '0%,100%': { transform: 'translateY(0px)' },
          '50%':     { transform: 'translateY(-12px)' },
        },
        'glow-pulse': {
          '0%,100%': { opacity: '0.6' },
          '50%':     { opacity: '1' },
        },
        'slide-up': {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}