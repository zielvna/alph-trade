import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        white: "#ffffff",
        black: "#000000",
        gray: "#808080",
        red: "#ff0000",
        green: "#00ff00",
        blue: "#0000ff",
      },
    },
  },
  plugins: [],
  safelist: [
    {
      pattern: /bg-+/,
    },
  ],
};
export default config;
