import { IBM_Plex_Mono, Sora } from "next/font/google";

export const sora = Sora({ subsets: ["latin", "latin-ext"], weight: ["400", "600"], variable: "--font-sora", display: "swap" });
export const plexMono = IBM_Plex_Mono({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500"],
  variable: "--font-plex",
  display: "swap",
});
