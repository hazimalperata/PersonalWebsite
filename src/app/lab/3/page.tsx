import type { Metadata } from "next";
import { geist, geistMono } from "@/lab/d3/fonts";
import { SmoothScroll, TopBar } from "@/lab/d3/Chrome";
import { Hero } from "@/lab/d3/Hero";
import { DeviceStage } from "@/lab/d3/DeviceStage";
import { SystemStage } from "@/lab/d3/SystemStage";
import { AiSection, Capabilities, ContactFooter, MoreWork, Proof, Timeline } from "@/lab/d3/Sections";
import "@/lab/d3/d3.css";
import "@/lab/d3/d3-ai.css";

export const metadata: Metadata = {
  title: "Direction 3 · Device Theatre · Hazim Alper Ata",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <div className={`d3 ${geist.variable} ${geistMono.variable}`}>
      <SmoothScroll />
      <TopBar />
      {/* The footer is fixed underneath; main slides up to uncover it (the "peel"). */}
      <main className="d3-main">
        <Hero />
        <Proof />
        <DeviceStage />
        <MoreWork />
        <Capabilities />
        <AiSection />
        <SystemStage />
        <Timeline />
      </main>
      <ContactFooter />
    </div>
  );
}
