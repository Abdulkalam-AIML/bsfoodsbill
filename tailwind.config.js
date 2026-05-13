/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6fbff',
          100: '#ccf7ff',
          200: '#99efff',
          300: '#66e7ff',
          400: '#33dfff',
          500: '#00d4ff',
          600: '#00b8e6',
          700: '#0099bf',
          800: '#007a99',
          900: '#005c73',
        },
        navy: {
          50: '#e8eaf0',
          100: '#c5c9d8',
          200: '#9ea5bf',
          300: '#7780a6',
          400: '#596593',
          500: '#3b4a80',
          600: '#354378',
          700: '#2d3a6d',
          800: '#263263',
          900: '#0a0e27',
          950: '#060818',
        },
        accent: {
          orange: '#ff6b35',
          cyan: '#00d4ff',
          blue: '#3b82f6',
          electric: '#6366f1',
          green: '#10b981',
          red: '#ef4444',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Outfit', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-glass': 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
        'gradient-dark': 'linear-gradient(135deg, #0a0e27 0%, #1a1f3a 50%, #0a0e27 100%)',
        'gradient-card': 'linear-gradient(135deg, rgba(0,212,255,0.1) 0%, rgba(99,102,241,0.1) 100%)',
        'gradient-accent': 'linear-gradient(135deg, #00d4ff 0%, #6366f1 100%)',
        'gradient-warm': 'linear-gradient(135deg, #ff6b35 0%, #ff9f1c 100%)',
      },
      boxShadow: {
        'glass': '0 8px 32px rgba(0, 0, 0, 0.3)',
        'glass-sm': '0 4px 16px rgba(0, 0, 0, 0.2)',
        'neon': '0 0 20px rgba(0, 212, 255, 0.3)',
        'neon-strong': '0 0 40px rgba(0, 212, 255, 0.5)',
        'card': '0 4px 24px rgba(0, 0, 0, 0.12)',
        'card-hover': '0 8px 40px rgba(0, 212, 255, 0.2)',
      },
      backdropBlur: {
        'glass': '20px',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s ease-in-out infinite',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'fade-in': 'fadeIn 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'shimmer': 'shimmer 2s infinite linear',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(0, 212, 255, 0.2)' },
          '100%': { boxShadow: '0 0 20px rgba(0, 212, 255, 0.6)' },
        },
      },
    },
  },
  plugins: [],
}
