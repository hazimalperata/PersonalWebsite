"use client";

import { useLenis } from "lenis/react";
import { useTranslations } from "next-intl";
import { prefersReducedMotion } from "@/lib/motion";
import { TextLinkButton } from "@/components/ui/TextLink";

export function BackToTop() {
  const t = useTranslations("footer");
  const lenis = useLenis();

  function onClick() {
    if (lenis) lenis.scrollTo(0);
    else window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? "auto" : "smooth" });
  }

  return <TextLinkButton onClick={onClick}>{t("top")}</TextLinkButton>;
}
