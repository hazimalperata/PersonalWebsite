import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";

export function Footer() {
  const t = useTranslations("footer");
  return (
    <footer className="relative z-10 border-t border-fg-2/20 bg-bg/80 py-10 backdrop-blur-sm">
      <Container className="text-xs text-fg-2">
        <p>{t("rights", { year: new Date().getFullYear() })}</p>
      </Container>
    </footer>
  );
}
