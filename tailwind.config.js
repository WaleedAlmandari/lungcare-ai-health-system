/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // ✅ ضروري تخليها class عشان التبديل يكون يدوي
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: { extend: {} },
  plugins: [],
}