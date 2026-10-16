import "../globals.css";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { fontBody, fontDisplay, fontMono } from "@/lib/fonts";
import { cn } from "@/lib/cn";
import { siteUrl } from "@/lib/site";
import { Analytics } from "@vercel/analytics/next";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { ThemeScript } from "@/components/layout/ThemeScript";
import { Providers } from "@/components/layout/Providers";
import { SkipLink } from "@/components/layout/SkipLink";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Grain } from "@/components/layout/Grain";
import type { Metadata } from "next";

export const metadata: Metadata = { metadataBase: new URL(siteUrl) };

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  return (
    <html lang={locale} suppressHydrationWarning className={cn(fontDisplay.variable, fontBody.variable, fontMono.variable)}>
      <head>
        <ThemeScript />
      </head>
      <body className="min-h-dvh bg-bg text-fg">
        <NextIntlClientProvider>
          <ThemeProvider>
            <Providers>
              <SkipLink />
              <Header />
              <main id="content">{children}</main>
              <Footer />
              <Grain />
            </Providers>
          </ThemeProvider>
        </NextIntlClientProvider>
        <Analytics />
      </body>
    </html>
  );
}
