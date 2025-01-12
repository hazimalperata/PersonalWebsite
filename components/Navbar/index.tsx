"use client";

import ThemeChanger from "@/components/ThemeChanger";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import styles from "./index.module.scss";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { PersonalLogo } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import * as React from "react";

export default function Navbar() {
  // TODO
  // const t = useTranslations("Navbar");

  const [isFixedHeader, setIsFixedHeader] = useState(false);

  useEffect(() => {
    const checkScroll = () => {
      if (typeof window !== "undefined") {
        const currentScroll = window.scrollY;
        setIsFixedHeader(currentScroll > 58);
      }
    };

    checkScroll();

    window.addEventListener("scroll", checkScroll);
    return () => window.removeEventListener("scroll", checkScroll);
  }, []);

  return (
    <>
      <span className="h-16" />
      <header
        className={clsx(
          "absolute top-0 z-header flex w-full flex-row items-center justify-center",
          {
            [styles.stickyHeader]: isFixedHeader,
            "bg-secondary": !isFixedHeader,
          },
        )}
      >
        <div className="grid w-full max-w-screen-2xl grid-cols-3 px-5 py-2">
          <nav className="flex flex-row items-center gap-x-2">
            <Button asChild size="lg" variant="link">
              <Link href="/blog">Blog</Link>
            </Button>
          </nav>
          <PersonalLogo className="mx-auto" />
          <div className="flex flex-row items-center justify-items-end gap-x-4">
            <ThemeChanger />
            <LanguageSwitcher />
          </div>
        </div>
      </header>
    </>
  );
}
