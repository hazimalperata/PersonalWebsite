import { useTranslations } from "next-intl";

/** Visually hidden cue appended to links that open a new tab. */
export function NewTabHint() {
  const t = useTranslations("a11y");
  return <span className="sr-only"> ({t("externalLink")})</span>;
}
