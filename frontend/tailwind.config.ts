import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#18211f",
        paper: "#f7f5ee",
        panel: "#fffdf8",
        line: "#ded8ca",
        teal: "#0f766e",
        amber: "#b45309",
        rose: "#be123c"
      },
      boxShadow: {
        soft: "0 14px 40px rgba(24, 33, 31, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
