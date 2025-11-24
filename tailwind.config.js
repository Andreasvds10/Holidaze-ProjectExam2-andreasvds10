/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          ink: "#0f1720",
          cream: "#f7f5f2",
          gold: "#c2a36b",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "system-ui",
          "ui-sans-serif",
          "Segoe UI",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
        display: ["Playfair Display", "ui-serif", "Georgia", "serif"],
      },
      boxShadow: {
        card: "0 8px 24px rgba(15, 23, 32, 0.07)",
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
      },
    },
  },
  plugins: [],
};
