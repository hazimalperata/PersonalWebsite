import EntrySection from "@/components/EntrySection";
import Technologies from "@/components/Technologies";
import CtaSection from "@/components/Contact";
import Services from "@/components/Feature";
import React from "react";
import DefaultWrapper from "@/components/wrappers/NavbarWrapper";
import Expertises from "@/components/Expertises";

export default function HomePage() {

  return (
    <DefaultWrapper>
      <EntrySection/>
      <Technologies/>
      <Expertises/>
      <Services/>
      <CtaSection/>
    </DefaultWrapper>
  );
}
