import type { Metadata } from "next";
import "@/lab/d4/d4.css";
import { Content } from "@/lab/d4/Content";
import { plexMono, sora } from "@/lab/d4/fonts";
import { SignalShell } from "@/lab/d4/SignalShell";

export const metadata: Metadata = {
  title: "Lab 4 · Living Signal · Hazim Alper Ata",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <div data-d4-root className={`d4 ${sora.variable} ${plexMono.variable}`}>
      <SignalShell>
        <Content />
      </SignalShell>
    </div>
  );
}
