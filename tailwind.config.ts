import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./content/**/*.{md,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0E1B33",
        paper: "#F7F3EC",
        "paper-mid": "#EDE7D9",
        lacre: "#1B3B8F",
        ouro: "#B8902A",
        chumbo: "#4A4A4A",
        "chumbo-lt": "#7A7A7A",
        borda: "#D4C9B4",
      },
      fontFamily: {
        display: ["var(--font-playfair)"],
        serif: ["var(--font-source-serif)"],
        sans: ["var(--font-inter)"],
      },
      maxWidth: {
        prose: "68ch",
      },
      letterSpacing: {
        meta: "0.14em",
      },
    },
  },
  plugins: [],
};

export default config;
