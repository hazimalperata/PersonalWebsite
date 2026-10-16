import { Geist_Mono, Inter } from "next/font/google";

export const inter = Inter({ subsets: ["latin"], variable: "--d5-sans", display: "swap", weight: "variable" });
export const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--d5-mono",
  display: "swap",
  weight: ["400", "500"],
});
