import { useTranslations } from "next-intl";
import type { CSSProperties } from "react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SplitHeading } from "@/components/ui/SplitHeading";
import { ScrollCue } from "./ScrollCue";
import { Telemetry } from "./Telemetry";
import styles from "./hero.module.css";

export function Hero() {
  const t = useTranslations("hero");
  const sub = `${t("role")} ${t("line")}`;

  return (
    <section className="relative z-10 min-h-[100svh] pt-32 pb-24">
      <Container className="lg:grid lg:grid-cols-12 lg:gap-6">
        <div className="lg:col-span-8">
          <SplitHeading
            key={t("name")}
            as="h1"
            className="max-w-[12ch] font-display text-[clamp(2.75rem,8vw,7rem)] leading-[0.95] font-extrabold tracking-[-0.02em]"
          >
            {t("name")}
          </SplitHeading>
          <SplitHeading key={sub} as="p" delay={0.1} className="mt-6 max-w-[28ch] text-xl text-fg-2 md:text-2xl">
            {sub}
          </SplitHeading>
          <Telemetry />
          <div className={`${styles.fadeIn} mt-10`} style={{ "--fade-delay": "700ms" } as CSSProperties}>
            <Button variant="primary" href="#contact">
              {t("cta")}
            </Button>
          </div>
        </div>
      </Container>
      <ScrollCue />
    </section>
  );
}
