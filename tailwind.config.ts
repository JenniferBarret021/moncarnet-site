import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        violet: {
          50: '#F5F0FF',
          100: '#EDE5FE',
          200: '#9272E0',
          500: '#5B3FA8',
          600: '#4A3290',
          700: '#3D1F6E',
          800: '#2D1560',
          900: '#1F0F3D',
          950: '#0B0518',
        },
        ink: '#1B1530',
        slate: {
          DEFAULT: '#6B6478',
          soft: '#A0A0AE',
        },
        paper: {
          DEFAULT: '#FBFAF7',
          100: '#F4F1EA',
        },
        line: '#E8E2D8',
        amber: {
          100: '#FEF3C7',
          900: '#92400E',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['Georgia', 'serif'],
      },
      letterSpacing: {
        tightest: '-0.035em',
        tighter: '-0.03em',
        tight: '-0.02em',
        wide: '0.06em',
        wider: '0.08em',
        widest: '0.12em',
      },
      boxShadow: {
        cta: '0 4px 16px rgba(91, 63, 168, 0.25)',
        'cta-strong': '0 8px 24px rgba(91, 63, 168, 0.30)',
        device: '0 24px 60px rgba(27, 21, 48, 0.22), 0 4px 12px rgba(27, 21, 48, 0.08)',
        'device-phone': '0 24px 60px rgba(27, 21, 48, 0.28), 0 4px 12px rgba(27, 21, 48, 0.08)',
        fab: '0 8px 20px rgba(91, 63, 168, 0.35)',
        'plan-highlight': '0 12px 32px rgba(27, 21, 48, 0.18)',
      },
      backgroundImage: {
        'violet-gradient': 'linear-gradient(135deg, #3D1F6E 0%, #1F0F3D 50%, #0B0518 100%)',
        'hero-glow':
          'radial-gradient(circle, rgba(91,63,168,0.18) 0%, rgba(61,31,110,0.10) 45%, transparent 70%)',
        'cta-glow':
          'radial-gradient(circle, rgba(91,63,168,0.08) 0%, rgba(91,63,168,0.04) 50%, transparent 70%)',
        'avatar-violet': 'linear-gradient(135deg, #9272E0, #5B3FA8)',
      },
      transitionTimingFunction: {
        'out-soft': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 600ms cubic-bezier(0.16, 1, 0.3, 1) both',
      },
    },
  },
  plugins: [],
};

export default config;
