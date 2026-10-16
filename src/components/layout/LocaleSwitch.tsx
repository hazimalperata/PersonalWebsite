"use client";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";

export function LocaleSwitch() {
  const locale = useLocale();
  const t = useTranslations("locale");
  const pathname = usePathname();
  const router = useRouter();
  const next = locale === "en" ? "tr" : "en";
  return (
    <button
      type="button"
      lang={next}
      className="text-xs text-fg-2 hover:text-fg"
      onClick={() => router.replace(pathname, { locale: next })}
    >
      {t("switch")}
    </button>
  );
}
