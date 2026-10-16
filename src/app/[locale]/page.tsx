import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { SignalSection } from "@/components/signal";
import { AiSection } from "@/components/home/AiSection";
import { AiSteps } from "@/components/home/AiSteps";
import { Contact } from "@/components/home/Contact";
import { Experience } from "@/components/home/Experience";
import { Hero } from "@/components/home/Hero";
import { HomeScene } from "@/components/home/HomeScene";
import { MoreWork } from "@/components/home/MoreWork";
import { Proof, proofText } from "@/components/home/Proof";
import { SelectedWork } from "@/components/home/SelectedWork";
import { TimelineSection } from "@/components/home/TimelineSection";
import css from "@/components/home/home.module.css";
import { profile } from "@/data/profile";
import { routing } from "@/i18n/routing";
import { getProjects } from "@/lib/content";
import { getProofFacts } from "@/lib/proof";

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
  const selected = projects.filter((p) => p.featured);
  const more = projects.filter((p) => !p.featured);
  const facts = getProofFacts(
    projects,
    profile.experience.map((e) => e.from),
  );
  const apps = facts.find((f) => f.id === "apps")?.value ?? 0;

  return (
    <div className={css.home}>
      <HomeScene proof={facts.map((f) => proofText(f, locale))} work={selected.map((p) => p.signal)} />
      <Hero apps={apps} />
      <TimelineSection />
      <Proof facts={facts} />
      <SelectedWork projects={selected} />
      <SignalSection id="calm" state="calm">
        <MoreWork projects={more} />
        <AiSection />
      </SignalSection>
      <AiSteps />
      <Experience />
      <Contact />
    </div>
  );
}
