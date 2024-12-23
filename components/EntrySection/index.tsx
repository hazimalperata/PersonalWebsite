import TextArea from "@/components/EntrySection/TextArea";
import MainLineArea from "@/components/EntrySection/MainLineArea";
import React from "react";

export default function EntrySection() {
  return (
    <section className="relative mt-32 flex flex-col items-center gap-y-10">
      <TextArea />
      <MainLineArea />
    </section>
  );
}
