import { useTranslations } from "next-intl";

export default function ThemeChangerLoading() {
  const t = useTranslations("Common");

  return (
    <div role="status" className="flex animate-pulse ml-auto w-fit">
      <div className="h-[42px] w-[42px] rounded-full bg-gray-300 dark:bg-gray-600"></div>
      <span className="sr-only">{t("loading")}</span>
    </div>
  );
}
