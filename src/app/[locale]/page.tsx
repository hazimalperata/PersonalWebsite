import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { About } from "@/components/about/About";
import { Contact } from "@/components/contact/Contact";
import { Gallery } from "@/components/gallery/Gallery";
import { Hero } from "@/components/hero/Hero";
import HomeOrbit from "@/components/three/HomeOrbit";
import { SelectedWork } from "@/components/work/SelectedWork";
import { getProjects } from "@/lib/content";
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
  const projects = await getProjects(locale);
  return (
    <>
      <HomeOrbit>
        <Hero />
        <SelectedWork projects={projects} />
      </HomeOrbit>
      <About locale={locale} />
      <Gallery />
      <Contact locale={locale} />
    </>
  );
}
