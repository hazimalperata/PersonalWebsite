import { getTranslations } from "next-intl/server";
import { pick, profile } from "@/data/profile";
import type { AppLocale } from "@/i18n/routing";
import { Section } from "@/components/ui/Section";
import { Skills } from "./Skills";
import { Timeline } from "./Timeline";

export async function About({ locale }: { locale: AppLocale }) {
  const t = await getTranslations({ locale, namespace: "about" });

  return (
    <Section id="about" className="relative z-10 bg-bg">
      <div className="grid gap-8 lg:grid-cols-12">
        <h2 className="font-display text-3xl md:text-4xl lg:sticky lg:top-24 lg:col-span-3 lg:self-start">
          {t("title")}
        </h2>

        <div className="lg:col-span-8 lg:col-start-5">
          <div className="space-y-5 text-lg leading-relaxed max-w-[62ch]">
            {profile.intro.map((paragraph) => (
              <p key={paragraph.en}>{pick(paragraph, locale)}</p>
            ))}
          </div>

          <h3 className="mt-16 font-display text-xl">{t("experience")}</h3>
          <Timeline items={profile.experience} locale={locale} presentLabel={t("present")} />

          <h3 className="mt-16 font-display text-xl">{t("education")}</h3>
          {profile.education.map((entry) => (
            <p key={entry.name.en} className="mt-4">
              <span className="font-medium">{pick(entry.name, locale)}</span>
              <span className="text-fg-2">
                {" · "}
                {pick(entry.description, locale)}
              </span>
            </p>
          ))}

          <h3 className="mt-16 font-display text-xl">{t("skills")}</h3>
          <Skills locale={locale} />
        </div>
      </div>
    </Section>
  );
}
