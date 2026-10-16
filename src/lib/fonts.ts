import { Geist, Geist_Mono, Syne } from "next/font/google";

export const fontDisplay = Syne({
  subsets: ["latin", "latin-ext"],
  weight: ["700", "800"],
  variable: "--font-syne",
  display: "swap",
});
export const fontBody = Geist({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500"],
  variable: "--font-geist",
  display: "swap",
});
export const fontMono = Geist_Mono({
  subsets: ["latin", "latin-ext"],
  weight: ["400"],
  variable: "--font-geist-mono",
  display: "swap",
});
