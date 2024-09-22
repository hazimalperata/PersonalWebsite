import type {Config} from "tailwindcss";

const config: Config = {
  darkMode: 'class',
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        'sm': '640px',
        'md': '768px',
        'lg': '1025px',
        'xl': '1280px',
        '2xl': '1440px',
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",

        darkblue: "#25273C",
        lightblue: "#E4E5F1",
        darkPrimary: "#CACDE8",
        lightPrimary: "#D2D3DB",
        darkSecondary: "#E4E5F1",
        lightSecondary: "#9394A5",
        darkThird: "#777A92",
        lightThird: "#484B6A",
      },
      zIndex: {
        "1": "1",
        'overlay': '1000',
        'dropdown': '2000',
        'header': '3000',
        'modal': '4000',
      },
      fontSize: {
        'xxs': '8px',
        'xs': '10px',
        'sm': '12px',
        'tiny': '14px',
        'base': '16px',
        'lg': '18px',
        'xl': '20px',
        '2xl': '24px',
        '3xl': '30px',
        '4xl': '32px',
        '5xl': '40px',
        '6xl': '48px',
        '7xl': '64px',
        '8xl': '96px',
      },
    },
    screens: {
      "2xl": "1440px"
    }
  },
  plugins: [],
};
export default config;
