import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "tr"],
  defaultLocale: "en",
  localePrefix: "as-needed",
  alternateLinks: false,
});

export type AppLocale = (typeof routing.locales)[number];
