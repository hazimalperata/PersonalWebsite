import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

export enum LOCALES {
  EN = "en",
  TR = "tr",
}

export const DEFAULT_LOCALE = LOCALES.EN;

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: Object.values(LOCALES),

  // Used when no locale matches
  defaultLocale: DEFAULT_LOCALE,
  pathnames: {
    // If locales use different paths, you can
    // specify each external path per locale
    "/": {
      en: "/",
      tr: "/",
    },
    "/login": {
      en: "/login",
      tr: "/giris",
    },
    "/picker": {
      en: "/picker",
      tr: "/picker",
    },
    "/blog": {
      en: "/blog",
      tr: "/blog",
    },
    "/blog/[slug]": {
      en: "/blog/[slug]",
      tr: "/blog/[slug]",
    },
    "/blog/[slug]/[subSlug]": {
      en: "/blog/[slug]/[subSlug]",
      tr: "/blog/[slug]/[subSlug]",
    },
  },
});

export type Locale = (typeof routing.locales)[number];

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);
