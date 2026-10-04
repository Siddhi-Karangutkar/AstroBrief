/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        space: {
          900: "#070A13",
          800: "#0D1322",
          700: "#151D32",
        },
        neon: {
          cyan: "#00F2FE",
          purple: "#9D4EDD",
          blue: "#4FACFE",
        },
      },
    },
  },
  plugins: [],
};
