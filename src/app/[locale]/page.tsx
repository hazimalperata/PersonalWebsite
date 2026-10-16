import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";

export async function generateMetadata({ params }: PageProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: locale === "tr" ? "/tr" : "/",
      languages: { en: "/", tr: "/tr", "x-default": "/" },
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: locale === "tr" ? "/tr" : "/",
      type: "website",
      locale: locale === "tr" ? "tr_TR" : "en_US",
      images: [{ url: "/images/og/home.png", width: 1200, height: 628 }],
    },
    twitter: { card: "summary_large_image" },
  };
}

export default async function Home({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "home" });
  // Placeholder until the Living Signal home page lands.
  return (
    <section className="relative z-10 flex min-h-dvh items-center">
      <h1 className="mx-auto w-full max-w-[var(--container-site)] px-4 font-display text-4xl md:px-6">{t("name")}</h1>
    </section>
  );
}
