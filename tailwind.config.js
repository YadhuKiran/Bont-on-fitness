/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f2fee5",
          100: "#e0fbbf",
          200: "#c8f888",
          300: "#aff641",
          400: "#9bf00f",
          500: "#7fd60a",
          600: "#65ab07",
          700: "#4d8009",
          800: "#3f660e",
          900: "#364f10",
          950: "#1a2c04",
        },
        ink: {
          50: "#f6f7f9",
          100: "#eceef2",
          200: "#d4d8e1",
          300: "#aeb6c6",
          400: "#818da5",
          500: "#636f8b",
          600: "#4e5871",
          700: "#41485c",
          800: "#383d4e",
          900: "#1a1d28",
          950: "#0e1018",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Inter", "system-ui", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-out",
        "slide-up": "slideUp 0.3s ease-out",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(155, 240, 15, 0.4)" },
          "50%": { boxShadow: "0 0 0 8px rgba(155, 240, 15, 0)" },
        },
      },
    },
  },
  plugins: [],
};
