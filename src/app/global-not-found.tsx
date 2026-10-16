import "./globals.css";
import { getTranslations, getLocale } from "next-intl/server";
import { fontBody, fontDisplay, fontMono } from "@/lib/fonts";
import { cn } from "@/lib/cn";
import { ThemeScript } from "@/components/layout/ThemeScript";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("notFound");
  return { title: t("title") };
}

// Server-rendered 404 for every unmatched URL. The root layout sits under a
// dynamic [locale] segment, so Next cannot compose one from layout + not-found.
export default async function GlobalNotFound() {
  const locale = await getLocale();
  const t = await getTranslations("notFound");
  return (
    <html lang={locale} suppressHydrationWarning className={cn(fontDisplay.variable, fontBody.variable, fontMono.variable)}>
      <head>
        <ThemeScript />
      </head>
      <body className="min-h-dvh bg-bg text-fg">
        <main id="content" className="flex min-h-dvh flex-col items-start justify-center gap-6 p-6">
          <h1 className="font-display text-4xl">{t("title")}</h1>
          <a href={locale === "en" ? "/" : `/${locale}`} className="text-fg-2 hover:text-fg underline underline-offset-4">
            {t("home")}
          </a>
        </main>
      </body>
    </html>
  );
}
