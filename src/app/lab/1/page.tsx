import type { Metadata } from "next";
import "@/lab/d1/d1.css";
import { headFont, monoFont } from "@/lab/d1/fonts";
import { Chrome } from "@/lab/d1/Chrome";
import { Hero } from "@/lab/d1/Hero";
import { AiSection, Capabilities, Experience, Proof, Work } from "@/lab/d1/Sections";
import { Contact } from "@/lab/d1/Contact";

export const metadata: Metadata = {
  title: "Hazim Alper Ata · Blueprint",
  description: "Frontend and mobile engineer. Prototype 1: Blueprint.",
};

export default function Page() {
  return (
    <div className={`d1 ${headFont.variable} ${monoFont.variable}`} data-motion="0" data-sheet="1">
      <Chrome />
      <main>
        <Hero />
        <Proof />
        <Work />
        <Capabilities />
        <AiSection />
        <Experience />
        <Contact />
      </main>
    </div>
  );
}
