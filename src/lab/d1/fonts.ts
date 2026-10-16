import { Inter_Tight, JetBrains_Mono } from "next/font/google";

export const headFont = Inter_Tight({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--d1-head",
  display: "swap",
});

export const monoFont = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--d1-mono",
  display: "swap",
});
