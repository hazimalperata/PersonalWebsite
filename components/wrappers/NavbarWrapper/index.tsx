import Navbar from "@/components/Navbar";
import React from "react";
import Footer from "@/components/Footer";
import { DefaultWrapperProps } from "@/components/wrappers/NavbarWrapper/types";
import clsx from "clsx";
import styles from "./index.module.scss";

export default function DefaultWrapper({
  children,
  hideNavbar,
  hideFooter,
}: DefaultWrapperProps) {
  return (
    <main className={clsx("flex h-full w-full flex-col", styles.customMain)}>
      {!hideNavbar && <Navbar />}
      {children}
      {!hideFooter && <Footer />}
    </main>
  );
}
