"use client";

import { IoIosArrowRoundUp } from "react-icons/io";
import { useEffect, useState } from "react";
import clsx from "clsx";
import { useTranslations } from "next-intl";

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
    <button
      className={clsx(
        "fixed bottom-0 right-0 z-50 mb-[71px] flex items-center gap-2 rounded-s-full border-y border-l border-gray-300 bg-background px-4 py-2 text-sm transition-opacity duration-500 hover:bg-gray-100 dark:hover:bg-gray-700",
        {
          "visible opacity-100": isVisible,
          "invisible opacity-0": !isVisible,
        },
      )}
      onClick={scrollToTop}
    >
      {t("backToTop")}
      <IoIosArrowRoundUp className="inline-block h-4 w-4" />
    </button>
  );
}
