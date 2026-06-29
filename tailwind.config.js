/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        olive: {
          50:  '#faf8f0', 100: '#f5efda', 200: '#ead9a8',
          300: '#ddc88a', 400: '#c9b07a', 500: '#b8a06a',
          600: '#9a8858', 700: '#7a6840', 800: '#5a4c2c',
          900: '#3a3018',
        },
        charcoal: {
          950: '#070707', 900: '#0a0a0a',
          800: '#111111', 700: '#181818',
          600: '#222220', 500: '#2e2e2a',
        },
        cream: {
          50:  '#fefdfb', 100: '#faf6ee',
          200: '#f5f0e8', 300: '#ede8de',
          400: '#e4ddd0',
        },
        'theme-bg':     'var(--bg-primary)',
        'theme-card':   'var(--glass-bg)',
        'theme-accent': 'var(--accent)',
        'theme-text':   'var(--text-primary)',
        'theme-text-2': 'var(--text-secondary)',
        'theme-muted':  'var(--text-muted)',
        'theme-border': 'var(--border)',
      },
      fontFamily: {
        sans:    ['Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'Montserrat', '"Space Grotesk"', 'Inter', 'system-ui', 'sans-serif'],
        heading: ['Outfit', 'Montserrat', '"Space Grotesk"', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':  'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-olive':  'linear-gradient(135deg, #b8a06a 0%, #c9b07a 50%, #ddc88a 100%)',
        'gradient-warm':   'linear-gradient(135deg, #c9b07a 0%, #f0e0a0 50%, #b8a06a 100%)',
      },
      animation: {
        'float':         'float-gentle 6s ease-in-out infinite',
        'shimmer':       'shimmer-warm 4.5s linear infinite',
        'fade-in':       'fadeIn 0.4s ease-out',
        'orb-pulse':     'orb-pulse 4s ease-in-out infinite',
        'grain':         'grain 0.8s steps(1) infinite',
        'fog-drift':     'fog-drift 28s ease-in-out infinite',
      },
      keyframes: {
        fadeIn:          { '0%':{ opacity:'0' }, '100%':{ opacity:'1' } },
      },
      spacing: { '18':'4.5rem','22':'5.5rem','26':'6.5rem','30':'7.5rem' },
      borderRadius: {
        sm:'var(--radius-sm)', md:'var(--radius-md)', DEFAULT:'var(--radius-lg)',
        lg:'var(--radius-lg)', xl:'var(--radius-xl)', '2xl':'var(--radius-2xl)',
      },
      backdropBlur: { xs:'2px', sm:'6px', DEFAULT:'12px', md:'16px', lg:'20px', xl:'28px' },
      boxShadow: {
        'token-sm':'var(--shadow-sm)', 'token-md':'var(--shadow-md)',
        'token-lg':'var(--shadow-lg)', 'token-xl':'var(--shadow-xl)',
        'token-glow':'var(--shadow-glow)', 'token-glow-lg':'var(--shadow-glow-lg)',
        'olive':  '0 0 30px rgba(201,176,122,0.35)',
        'warm':   '0 0 30px rgba(184,160,106,0.30)',
      },
      transitionProperty: { theme:'background-color, color, border-color, box-shadow' },
      transitionDuration: { '350':'350ms' },
    },
  },
  plugins: [],
};
