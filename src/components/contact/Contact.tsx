import { getTranslations } from "next-intl/server";
import { profile } from "@/data/profile";
import type { AppLocale } from "@/i18n/routing";
import { LocalTime } from "@/components/hero/LocalTime";
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { NewTabHint } from "@/components/ui/NewTabHint";
import { TextLink } from "@/components/ui/TextLink";

export async function Contact({ locale }: { locale: AppLocale }) {
  const t = await getTranslations({ locale, namespace: "contact" });
  const other: AppLocale = locale === "en" ? "tr" : "en";
  const cvLabel = (l: AppLocale) => (l === "en" ? t("cvEn") : t("cvTr"));

  return (
    <Section id="contact" className="relative z-10 bg-bg">
      <h2 className="font-display text-4xl md:text-5xl">{t("title")}</h2>

      <a
        href={`mailto:${profile.email}`}
        className="mt-8 inline-block max-w-full font-display text-xl [overflow-wrap:anywhere] underline decoration-fg-2 decoration-1 underline-offset-8 transition-[text-decoration-color] duration-200 hover:decoration-fg motion-reduce:transition-none sm:text-2xl md:text-3xl"
      >
        {profile.email}
      </a>

      <div className="mt-10 flex flex-wrap gap-6">
        {profile.social
          .filter((link) => link.icon !== "email")
          .map((link) => (
            <TextLink key={link.name} href={link.href} target="_blank" rel="noreferrer">
              {link.name}
              <NewTabHint />
            </TextLink>
          ))}
      </div>

      <div className="mt-10 flex flex-wrap gap-4">
        <Button variant="ghost" href={profile.cv[locale]} download>
          {cvLabel(locale)}
        </Button>
        <Button variant="ghost" href={profile.cv[other]} download>
          {cvLabel(other)}
        </Button>
      </div>

      <p className="mt-16 text-sm text-fg-2">
        {t("localTime")} <LocalTime />
      </p>
    </Section>
  );
}
