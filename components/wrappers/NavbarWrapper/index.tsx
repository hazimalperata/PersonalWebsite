import Navbar from "@/components/Navbar";
import React from "react";
import Footer from "@/components/Footer";
import { DefaultWrapperProps } from "@/components/wrappers/NavbarWrapper/types";

export default function DefaultWrapper({
  children,
  hideNavbar,
  hideFooter,
}: DefaultWrapperProps) {
  return (
    <main className="flex h-full w-full flex-col justify-between min-h-screen">
      {!hideNavbar && <Navbar />}
      {children}
      {!hideFooter && <Footer />}
    </main>
  );
}
