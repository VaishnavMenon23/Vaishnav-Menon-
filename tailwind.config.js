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
        'microsoft-blue': '#0078D4',
        'microsoft-blue-light': '#106EBE',
        'microsoft-cyan': '#00BCF2',
        'microsoft-gray': '#F3F2F1',
        'microsoft-dark': '#323130',
      },
      fontFamily: {
        'segoe': ['Segoe UI', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
