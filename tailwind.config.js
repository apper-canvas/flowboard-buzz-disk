/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
theme: {
    extend: {
      colors: {
        border: '#e2e8f0',
        background: '#ffffff',
        foreground: '#0f172a',
        muted: {
          DEFAULT: '#f1f5f9',
foreground: '#64748b'
        },
        primary: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          DEFAULT: '#6366F1',
          light: '#818CF8',
          dark: '#4F46E5'
        },
        secondary: {
          DEFAULT: '#10B981',
          light: '#34D399',
          dark: '#059669'
        },
        accent: '#F59E0B',
        surface: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a'
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        heading: ['Inter', 'ui-sans-serif', 'system-ui']
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
        'neu-light': '5px 5px 15px #d1d9e6, -5px -5px 15px #ffffff',
        'neu-dark': '5px 5px 15px rgba(0, 0, 0, 0.3), -5px -5px 15px rgba(255, 255, 255, 0.05)',
        'hover': '0 8px 16px rgba(0,0,0,0.1)',
        'dragging': '0 12px 24px rgba(0,0,0,0.15)'
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem'
      },
      animation: {
        'slide-in': 'slideIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'fade-in': 'fadeIn 0.2s ease-out',
        'bounce-subtle': 'bounceSubtle 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)'
      },
      keyframes: {
        slideIn: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' }
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        bounceSubtle: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '50%': { transform: 'scale(1.02)' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        }
      }
    }
  },
  plugins: [],
  darkMode: 'class',
}