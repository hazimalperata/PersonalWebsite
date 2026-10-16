import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Gallery } from "@/components/gallery/Gallery";
import { GalleryScene } from "@/components/gallery/GalleryScene";
import { Container } from "@/components/ui/Container";
import { routing } from "@/i18n/routing";

const languages = { en: "/gallery", tr: "/tr/gallery", "x-default": "/gallery" };

export async function generateMetadata({ params }: PageProps<"/[locale]/gallery">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const t = await getTranslations({ locale, namespace: "gallery" });
  const canonical = locale === "tr" ? "/tr/gallery" : "/gallery";
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: { canonical, languages },
    openGraph: {
      title: t("metaTitle"),
      description: t("metaDescription"),
      url: canonical,
      type: "website",
      locale: locale === "tr" ? "tr_TR" : "en_US",
      images: [{ url: "/images/og/home.png", width: 1200, height: 628 }],
    },
    twitter: { card: "summary_large_image" },
  };
}

export default async function GalleryPage({ params }: PageProps<"/[locale]/gallery">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "gallery" });
  return (
    <div className="relative z-10 pb-24 pt-32 md:pb-32 md:pt-40">
      <GalleryScene />
      <Container>
        <h1 className="font-display text-4xl font-semibold md:text-6xl">{t("title")}</h1>
        <p className="mt-4 mb-12 max-w-xl text-lg text-fg-2 md:mb-16">{t("intro")}</p>
        <Gallery />
      </Container>
    </div>
  );
}
