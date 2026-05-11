"use client";

import dynamic from "next/dynamic";

// Three.js uses browser APIs — SSR must be disabled
const EarthScene = dynamic(
  () => import("@/components/earth/EarthScene"),
  { ssr: false },
);

export default function EarthPage() {
  return <EarthScene />;
}
