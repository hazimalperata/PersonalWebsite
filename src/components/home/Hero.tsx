import { useLocale, useTranslations } from "next-intl";
import { SignalSection } from "@/components/signal";
import { lanes, signalRange, totalCommits } from "@/lib/signal/data";
import { Counter } from "./Counter";
import { ScrollCue } from "./ScrollCue";
import css from "./home.module.css";

/** The headline is plain server-rendered text: it is the LCP element, nothing hides it behind JS. */
export function Hero({ apps }: { apps: number }) {
  const t = useTranslations("home");
  const locale = useLocale() === "tr" ? "tr" : "en";
  const total = totalCommits.toLocaleString(locale === "tr" ? "tr-TR" : "en-US");
  return (
    <SignalSection id="top" state="nebula">
      <div className={css.hero}>
        <div className={css.heroInner}>
          <span className={css.tag}>{t("hero.tag")}</span>
          <h1>
            <span>{t("hero.line1")}</span>
            <span>{t("hero.line2")}</span>
          </h1>
          <p className={css.msg}>{t("hero.message")}</p>
          <div className={`${css.who} ${css.mono}`}>
            <b>{t("name")}</b>
            <span>{t("hero.apps", { count: apps })}</span>
          </div>
          <div className={css.btns}>
            <a className={`${css.btn} ${css.btnPrimary}`} href="#work">
              {t("hero.seeWork")}
            </a>
            <a className={css.btn} href="#contact">
              {t("hero.contact")}
            </a>
          </div>
          <div className={css.counter}>
            <Counter value={totalCommits} locale={locale} label={t("hero.counterLabel", { count: total })} />
            <span className={css.counterL}>
              {t("hero.counter", {
                lanes: lanes.length,
                first: signalRange.first.slice(0, 4),
                last: signalRange.last.slice(0, 4),
              })}
            </span>
          </div>
        </div>
        <ScrollCue label={t("hero.scroll")} />
      </div>
    </SignalSection>
  );
}
