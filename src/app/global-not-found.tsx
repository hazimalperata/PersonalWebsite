import "./globals.css";
import { NextIntlClientProvider } from "next-intl";
import { getTranslations, getLocale } from "next-intl/server";
import { SignalProvider } from "@/components/signal";
import { SIGNAL_ATTR } from "@/components/signal/dom";
import { plexMono, sora } from "@/components/signal/fonts";
import { cn } from "@/lib/cn";
import type { Metadata } from "next";
import { NotFoundScene } from "./NotFoundScene";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("notFound");
  return { title: `${t("title")} · Hazim Alper Ata` };
}

// Server-rendered 404 for every unmatched URL. The root layout sits under a
// dynamic [locale] segment, so Next cannot compose one from layout + not-found.
// The headline and the way home are plain server HTML; the field only enhances.
export default async function GlobalNotFound() {
  const locale = await getLocale();
  const t = await getTranslations("notFound");
  return (
    <html lang={locale} className={cn(sora.variable, plexMono.variable)}>
      <body className="min-h-dvh bg-bg text-fg">
        <NextIntlClientProvider>
          <SignalProvider>
            <NotFoundScene />
            <main
              id="content"
              className="relative z-10 mx-auto flex min-h-dvh w-full max-w-[var(--container-site)] flex-col items-center justify-center gap-6 px-4 text-center md:px-6"
            >
              <h1 className="font-display text-4xl font-semibold md:text-6xl">{t("title")}</h1>
              <p className="max-w-md text-lg text-fg-2">{t("lead")}</p>
              <a
                href={locale === "en" ? "/" : `/${locale}`}
                {...{ [SIGNAL_ATTR.target]: "" }}
                className="mt-8 rounded-full border border-fg/30 px-6 py-3 text-fg hover:border-fg focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent"
              >
                {t("home")}
              </a>
            </main>
          </SignalProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
