/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'JIT',
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      'gray': '#808080',
      'gray-light': '#E6E6E6',
      'white': '#FFFFFF',
    },
    extend: {},
  },
  plugins: [],
}
