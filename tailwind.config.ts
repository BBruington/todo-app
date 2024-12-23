import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  purge: [],
  theme: {
    extend: {},
    screens: {
      sm: { min: "400px" }, // Custom breakpoint for max-width: 550px
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
export default config;
