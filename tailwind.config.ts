import type { Config } from "tailwindcss";

// Ported 1:1 from the existing site's inline `tailwind.config` (index.html).
// Do not change these values without also updating the live site design.
const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        adaNavy: "#0c2340",
        adaBlue: "#0056b3",
        adaSoftBlue: "#f0f7ff",
        adaRose: "#e11d48",
        adaGray: "#4a5568",
        adaLightGray: "#f8fafc",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
