import type { Metadata } from "next";
import "@/lab/d2/d2.css";
import { Kinetic } from "@/lab/d2/Kinetic";
import { bodyFont, displayFont } from "@/lab/d2/fonts";

export const metadata: Metadata = {
  title: "Hazim Alper Ata · Kinetic Editorial (Lab 2)",
  robots: { index: false, follow: false },
};

export default function LabTwo() {
  return (
    <div className={`d2 ${displayFont.variable} ${bodyFont.variable}`}>
      <noscript>
        <style>{".d2 .prehide{visibility:visible!important}"}</style>
      </noscript>
      <Kinetic />
    </div>
  );
}
