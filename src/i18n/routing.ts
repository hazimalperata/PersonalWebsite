import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "tr"],
  defaultLocale: "en",
  localePrefix: "as-needed",
  alternateLinks: false,
  // English unless the visitor picks Türkçe: no Accept-Language or cookie redirect to /tr
  localeDetection: false,
});

export type AppLocale = (typeof routing.locales)[number];
