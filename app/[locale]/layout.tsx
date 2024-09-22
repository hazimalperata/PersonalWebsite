import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';
import React from "react";
import {Inter} from "next/font/google";
import clsx from 'clsx';
import {ThemeProvider} from 'next-themes';

const inter = Inter({
  subsets: ["latin"]
})

export default async function LocaleLayout({children, params: {locale}}: { children: React.ReactNode; params: { locale: string }; }) {
  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();


  return (
    <html lang={locale} suppressHydrationWarning>
    <body className={clsx(inter.className, "antialiased")}>
    <NextIntlClientProvider messages={messages}>
      <ThemeProvider attribute="class">
        {children}
      </ThemeProvider>
    </NextIntlClientProvider>
    </body>
    </html>
  );
}
