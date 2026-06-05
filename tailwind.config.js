/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // МНОГО ВАЖНО: Това казва на Tailwind да прочете стиловете в твоите файлове!
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}