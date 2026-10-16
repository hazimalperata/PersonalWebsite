"use client";

import { useTranslations } from "next-intl";

/**
 * Strings the field owns: `signal.staticLabel`, `signal.pointRatio`, `signal.illustration`. The keys live in
 * `messages/*.json`; the typed message catalogue is widened here so this module does not depend on their order.
 */
export function useSignalText(): (key: "staticLabel" | "pointRatio" | "illustration") => string {
  const t = useTranslations() as unknown as (key: string) => string;
  return (key) => t(`signal.${key}`);
}
