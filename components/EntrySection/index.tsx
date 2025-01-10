import React from "react";
import HeroSection from "@/components/molecules/HeroSection";
import ExperiencesSection from "@/components/molecules/ExperiencesSection";

export default function EntrySection() {
  return (
    <section className="relative flex flex-col items-center gap-y-10">
      <HeroSection />
      <ExperiencesSection />
    </section>
  );
}
