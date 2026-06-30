const FALLBACK_SANS = [
  "ui-sans-serif",
  "system-ui",
  "-apple-system",
  "Segoe UI",
  "Roboto",
  "Helvetica Neue",
  "Arial",
  "sans-serif",
];
const FALLBACK_MONO = ["ui-monospace", "SFMono-Regular", "Menlo", "Consolas", "monospace"];

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', ...FALLBACK_SANS],
        display: ['"Outfit"', ...FALLBACK_SANS],
        mono: ['"JetBrains Mono"', ...FALLBACK_MONO],
      },
      colors: {
        ink: {
          50: "#f7f6f3",
          100: "#eeece6",
          200: "#dcd8cd",
          300: "#bfb9a9",
          400: "#9c9480",
          500: "#7d7560",
          600: "#5f5848",
          700: "#4a4439",
          800: "#332f28",
          900: "#211e19",
          950: "#15130f",
        },
        brand: {
          50: "#f0faf5",
          100: "#dbf3e6",
          200: "#b6e6cd",
          300: "#85d1ac",
          400: "#52b487",
          500: "#2f9670",
          600: "#21785a",
          700: "#1c5f49",
          800: "#194c3b",
          900: "#163e31",
          950: "#0b231c",
        },
      },
      boxShadow: {
        soft: "0 1px 2px 0 rgb(21 19 15 / 0.04), 0 1px 3px 0 rgb(21 19 15 / 0.06)",
        card: "0 1px 2px 0 rgb(21 19 15 / 0.04), 0 8px 24px -8px rgb(21 19 15 / 0.10)",
        lifted: "0 12px 32px -12px rgb(21 19 15 / 0.22)",
        "brand-glow": "0 8px 24px -8px rgb(33 120 90 / 0.45)",
        focus: "0 0 0 3px rgb(47 150 112 / 0.25)",
      },
      borderRadius: {
        xl: "0.875rem",
        "2xl": "1.25rem",
        "3xl": "1.75rem",
      },
      keyframes: {
        "fade-in": { from: { opacity: 0 }, to: { opacity: 1 } },
        "fade-up": {
          from: { opacity: 0, transform: "translateY(8px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
        "scale-in": {
          from: { opacity: 0, transform: "scale(0.96)" },
          to: { opacity: 1, transform: "scale(1)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-400px 0" },
          "100%": { backgroundPosition: "400px 0" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.2s ease-out",
        "fade-up": "fade-up 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
        "scale-in": "scale-in 0.18s cubic-bezier(0.16, 1, 0.3, 1)",
        shimmer: "shimmer 1.6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
