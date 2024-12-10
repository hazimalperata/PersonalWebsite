import Navbar from "@/components/Navbar";
import React, {ReactNode} from "react";
import Footer from "@/components/Footer";

type DefaultWrapperProps = {
  children: ReactNode | ReactNode[];
  hideNavbar?: boolean;
  hideFooter?: boolean;
}

export default function DefaultWrapper({children, hideNavbar, hideFooter}: DefaultWrapperProps) {
  return (
    <>
      {!hideNavbar && (
        <Navbar/>
      )}
      {children}
      {!hideFooter && (
        <Footer/>
      )}
    </>
  )
}
