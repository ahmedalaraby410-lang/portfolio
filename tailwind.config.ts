import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#050507",
        paper: "#f6f2ea",
        nickel: "#9a9ca3",
        mercury: "#d9dce5",
        lime: "#cdf56a",
        coral: "#ff765f",
        cyan: "#86e7ff"
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "Inter", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "SFMono-Regular", "monospace"]
      },
      boxShadow: {
        glow: "0 0 70px rgba(205, 245, 106, 0.18)",
        glass: "inset 0 1px 0 rgba(255,255,255,.12), 0 28px 80px rgba(0,0,0,.48)"
      }
    }
  },
  plugins: []
};

export default config;
