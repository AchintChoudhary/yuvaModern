/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,営業,html,css}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          950: '#050505',
          900: '#0B0B0B',
          800: '#111111',
          700: '#1F1F1F',
          600: '#2A2A2A',
        },
        primary: {
          DEFAULT: '#FF6A00',
          hover: '#FF7A00',
          light: '#FF8C1A',
          glow: 'rgba(255, 106, 0, 0.15)',
        },
        secondary: {
          DEFAULT: '#FFA62B',
        },
        grey: {
          DEFAULT: '#A1A1A1',
          light: '#F5F5F5',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      },
      animation: {
        'glow-pulse': 'glow-pulse 3s infinite alternate',
      },
      keyframes: {
        'glow-pulse': {
          '0%': { boxShadow: '0 0 10px rgba(255, 106, 0, 0.1), 0 0 20px rgba(255, 106, 0, 0.05)' },
          '100%': { boxShadow: '0 0 25px rgba(255, 106, 0, 0.35), 0 0 45px rgba(255, 106, 0, 0.15)' },
        }
      }
    },
  },
  plugins: [],
}
