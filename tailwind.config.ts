import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "var(--color-ink)",
        paper: "var(--color-paper)",
        accent: "var(--color-accent)",
        "accent-strong": "var(--color-accent-strong)",
        muted: "var(--color-muted)",
        border: "var(--color-border)",
        surface: "var(--color-surface)"
      },
      boxShadow: {
        soft: "0 30px 80px -60px var(--color-shadow)"
      }
    }
  },
  plugins: []
};

export default config;
