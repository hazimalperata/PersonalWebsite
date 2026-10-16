"use client";

import Image from "next/image";
import { useTheme } from "@/components/layout/ThemeProvider";
import { posterFor } from "@/lib/capabilities";

/**
 * The still stand-in for the scene. The live scene keeps the earth below the headline; the poster is a
 * close crop, so a scrim of the page background keeps the hero text readable in both themes.
 */
export default function Poster() {
  const { theme } = useTheme();
  return (
    <>
      <Image src={posterFor(theme)} alt="" fill sizes="100vw" priority={false} className="object-cover" />
      <div aria-hidden className="absolute inset-0 bg-linear-to-b from-bg from-60% to-transparent to-95%" />
    </>
  );
}
