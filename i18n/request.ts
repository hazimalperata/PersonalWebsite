import {notFound} from 'next/navigation';
import {getRequestConfig} from 'next-intl/server';
import {Locale, routing} from './routing';

export default getRequestConfig(async ({requestLocale}) => {
  // Validate that the incoming `locale` parameter is valid
  const locale = await requestLocale;
  if (locale === undefined || !routing.locales.includes(locale as Locale)) notFound();

  return {
    messages: (await import(`../messages/${locale}.json`)).default
  };
});
