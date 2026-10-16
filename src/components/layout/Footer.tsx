import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { BackToTop } from "./BackToTop";

export function Footer() {
  const t = useTranslations("footer");
  return (
    <footer className="relative z-10 border-t border-fg-2/20 bg-bg py-12">
      <Container className="flex flex-wrap items-center justify-between gap-4 text-xs text-fg-2">
        <p>{t("rights", { year: new Date().getFullYear() })}</p>
        <BackToTop />
      </Container>
    </footer>
  );
}
