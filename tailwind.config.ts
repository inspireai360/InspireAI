import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#5B62F4",
        dark: "#08091A",
        darkAlt: "#0F1228",
        success: "#22C55E",
      },
      fontFamily: {
        sans: ["var(--font-dm-sans)", "system-ui", "sans-serif"],
        heading: ["var(--font-syne)", "system-ui", "sans-serif"],
        orbitron: ["var(--font-orbitron)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
