/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#9333ea', // purple-600
          dark: '#7e22ce', // purple-700
        }
      }
    },
  },
  plugins: [],
};