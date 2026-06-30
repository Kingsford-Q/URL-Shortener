/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef4ff",
          100: "#dce8ff",
          200: "#b9d1ff",
          300: "#8bb0ff",
          400: "#5c87ff",
          500: "#3a63f5",
          600: "#2a47d6",
          700: "#2336ab",
          800: "#1f2f87",
          900: "#1d2c6b",
        },
      },
    },
  },
  plugins: [],
};
