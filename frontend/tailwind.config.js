/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--bg-main)",
        surface: "var(--bg-card)",
        primary: "#8b5cf6", // Violet
        secondary: "#06b6d4", // Cyan
        accent: "#d946ef", // Fuchsia
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
