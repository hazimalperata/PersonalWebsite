import type { ReactNode } from "react";

// Strip the main site header/footer for the immersive /earth experience
export default function EarthLayout({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        background: "#000",
        minHeight: "100vh",
        overflow: "hidden auto",
      }}
    >
      {children}
    </div>
  );
}
