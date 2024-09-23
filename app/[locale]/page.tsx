import Header from "@/components/Header";
import EntrySection from "@/components/EntrySection";
import Technologies from "@/components/Technologies";
import FooterBlock from "@/components/Footer";
import CtaSection from "@/components/Contact";
import Services from "@/components/Feature";
import React from "react";

export default function HomePage() {

  return (
    <div>
      <Header/>
      <EntrySection/>
      <Technologies/>
      <Services/>
      <CtaSection/>
      <FooterBlock/>
    </div>
  );
}
