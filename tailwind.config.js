/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        sakura: {
          50: '#fff5f7',
          100: '#ffe4ea',
          200: '#fecdd8',
          300: '#fda5ba',
          400: '#fb7193',
          500: '#f43f6e',
          600: '#e11d54',
          700: '#be1241',
          800: '#9f1238',
          900: '#881333',
          950: '#4c0519',
        },
        plum: {
          950: '#0a0711',
          900: '#120d1e',
          850: '#160f24',
          800: '#1d132e',
          700: '#ff02b7ff',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        display: ['Outfit', 'Plus Jakarta Sans', 'sans-serif'],
      },
      boxShadow: {
        'sakura-glow': '0 0 35px -5px rgba(251, 113, 133, 0.3)',
        'sakura-glow-sm': '0 0 15px -3px rgba(251, 113, 133, 0.25)',
      },
      animation: {
        'fadeIn': 'fadeIn 0.3s ease-out forwards',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      }
    },
  },
  plugins: [],
}
