import TextArea from "@/components/EntrySection/TextArea";
import MainLineArea from "@/components/EntrySection/MainLineArea";
import React from "react";

export default function EntrySection() {
  return (
    <section
      className="relative flex flex-col gap-y-10 items-center mt-32"
    >
      <TextArea/>
      <MainLineArea/>
    </section>
  )
}
