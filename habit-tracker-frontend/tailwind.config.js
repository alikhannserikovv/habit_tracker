/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#4F9DDE',
          DEFAULT: '#3B82F6',
          dark: '#2563EB',
        },
      },
    },
  },
  plugins: [],
}