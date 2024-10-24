'use client'

import ThemeChanger from "@/components/ThemeChanger";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import styles from "./index.module.scss";
import clsx from "clsx";
import {useEffect, useState} from "react";

export default function Header() {
  const [isFixedHeader, setIsFixedHeader] = useState(false);

  useEffect(() => {
    const checkScroll = () => {
      if (typeof window !== "undefined") {
        const currentScroll = window.scrollY;
        setIsFixedHeader(currentScroll > 58);
      }
    }

    checkScroll();

    window.addEventListener("scroll", checkScroll);
    return () => window.removeEventListener("scroll", checkScroll);
  }, []);

  return (
    <header
      className={clsx("absolute top-0 flex flex-row items-center justify-center w-full z-header", {
        [styles.stickyHeader]: isFixedHeader,
        "bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300": !isFixedHeader,
      })}
    >
      <div className="grid grid-cols-3 max-w-screen-2xl w-full py-2 px-5">
        <div className="flex flex-row items-center gap-x-5">
          <div>A</div>
          <div>A</div>
          <div>A</div>
          <div>A</div>
          <div>A</div>
        </div>
        <div className="flex justify-center items-center">
          LOGO
        </div>
        <div className="flex flex-row items-center justify-end gap-x-5">
          <ThemeChanger/>
          <LanguageSwitcher/>
        </div>
      </div>
    </header>
  )
}
