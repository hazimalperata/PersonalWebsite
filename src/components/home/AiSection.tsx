import { useTranslations } from "next-intl";
import { Reveal } from "./Reveal";
import css from "./home.module.css";

const PRODUCTS = ["dremly", "posme", "rommer"] as const;

/** "How I use AI", first half: the AI in my products. The four-step workflow that follows is `AiSteps`. */
export function AiSection() {
  const t = useTranslations("home.ai");
  return (
    <section className={css.band} id="ai" aria-labelledby="ai-h">
      <span className={css.tag}>{t("tag")}</span>
      <h2 id="ai-h" className={css.h2}>
        {t("title")}
      </h2>
      <p className={css.aiIntro}>{t("intro")}</p>
      <ul className={css.aiProd} aria-label={t("productsLabel")}>
        {PRODUCTS.map((key, i) => (
          <li key={key} className={css.panel}>
            <Reveal delay={i * 90}>
              <h3>{t(`products.${key}.name`)}</h3>
              <p>{t(`products.${key}.line`)}</p>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}
