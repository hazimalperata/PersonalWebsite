import { Geist, Geist_Mono } from "next/font/google";

export const geist = Geist({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--d3-sans",
  display: "swap",
});

export const geistMono = Geist_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--d3-mono",
  display: "swap",
});
