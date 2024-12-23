import {defineRouting} from 'next-intl/routing';
import {createNavigation} from 'next-intl/navigation';

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
    '/deneme': {
      en: '/trying',
      tr: '/deneme'
    },
    '/deneme/[slug]': {
      en: '/trying/[slug]',
      tr: '/deneme/[slug]'
    },
  }

});

export type Locale = (typeof routing.locales)[number];

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const {Link, redirect, usePathname, useRouter} = createNavigation(routing);
