import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import React from "react";
import { Inter } from "next/font/google";
import clsx from "clsx";
import { ThemeProvider } from "next-themes";
import BackToTopButton from "@/components/atoms/BackToTopButton";
import { routing } from "@/i18n/routing";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({
  subsets: ["latin"],
});

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({
    locale,
  }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={clsx(inter.className, "antialiased")}>
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider enableSystem attribute="class" defaultTheme="system">
            {children}
            <BackToTopButton />
          </ThemeProvider>
        </NextIntlClientProvider>
        <Toaster />
        <ReactQueryDevtools initialIsOpen={false} />
      </body>
    </html>
  );
}
