"use client";

import { useLocale, useTranslations } from "next-intl";
import { LOCALES } from "@/i18n/routing";
import LanguageSwitcherSelect from "@/components/LanguageSwitcherSelect";

export default function LanguageSwitcher() {
  const t = useTranslations("LanguageSwitcher");
  const locale = useLocale();

  return (
    <LanguageSwitcherSelect defaultValue={locale} label={t("label")}>
      {Object.values(LOCALES).map((locale) => (
        <option key={locale} value={locale} className="w-min text-tiny">
          {t("locale", { locale })}
        </option>
      ))}
    </LanguageSwitcherSelect>
  );
}
