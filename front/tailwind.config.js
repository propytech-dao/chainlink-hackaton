/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
  ],
  
  theme: {
    extend: {
      fontFamily: {
        default: ['var(--font-inter)'],
        amiri: ['var(--font-amiri)'],
        poppins: ['var(--font-poppins)'],
      },
    },
  },

  plugins: [],
}
