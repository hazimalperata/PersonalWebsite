import "../globals.css";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/cn";
import { siteUrl } from "@/lib/site";
import { Analytics } from "@vercel/analytics/next";
import { SignalProvider, plexMono, sora } from "@/components/signal";
import { SkipLink } from "@/components/layout/SkipLink";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
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
    <html lang={locale} className={cn(sora.variable, plexMono.variable)}>
      <body className="min-h-dvh bg-bg text-fg">
        <NextIntlClientProvider>
          <SignalProvider>
            <SkipLink />
            <Header />
            <main id="content">{children}</main>
            <Footer />
          </SignalProvider>
        </NextIntlClientProvider>
        <Analytics />
      </body>
    </html>
  );
}
