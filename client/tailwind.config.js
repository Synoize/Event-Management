/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary-pink": "#d9256d",
        "primary-orange": "#f67b34",
        "primary-black": "#000",
      },
    },
  },
  plugins: [],
}
