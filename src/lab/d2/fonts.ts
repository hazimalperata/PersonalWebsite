import { Bricolage_Grotesque, Inter } from "next/font/google";

/** Bricolage Grotesque, variable: wght 200-800 plus the wdth axis (75-100) and opsz. */
export const displayFont = Bricolage_Grotesque({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-d2-display",
  display: "swap",
});

export const bodyFont = Inter({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-d2-body",
  display: "swap",
});
