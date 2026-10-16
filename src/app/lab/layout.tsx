import "./lab.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Lab · Hazim Alper Ata",
  robots: { index: false, follow: false },
};

/** Separate root layout: the prototypes do not inherit the live site's header, footer, theme or fonts. */
export default function LabLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
