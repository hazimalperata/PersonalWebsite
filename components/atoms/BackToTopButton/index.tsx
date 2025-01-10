"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";
import { useTranslations } from "next-intl";
import { ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BackToTopButton() {
  const t = useTranslations("Common");

  const [isVisible, setIsVisible] = useState(false);

  const isBrowser = () => typeof window !== "undefined";

  function scrollToTop() {
    if (!isBrowser()) return;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const handleScroll = () => {
    if (window.scrollY > 100) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <Button
      variant="outline"
      onClick={scrollToTop}
      className={clsx(
        "fixed bottom-0 right-0 z-overlay mb-[71px] !rounded-r-none transition-opacity duration-500 !border-r-0",
        {
          "visible opacity-100": isVisible,
          "invisible opacity-0": !isVisible,
        },
      )}
    >
      {t("backToTop")}
      <ArrowUp className="inline-block" />
    </Button>
  );
}
