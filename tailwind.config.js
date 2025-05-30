/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts}"],
  theme: {
    extend: {
      fontFamily: {
        myfont: ['Agrandir', 'sans-serif'], // 'myfont' is now a usable class
      },
    },
  },
  plugins: [],
}