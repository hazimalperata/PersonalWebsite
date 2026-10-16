import { useLocale, useTranslations } from "next-intl";
import { profile } from "@/data/profile";
import { Reveal } from "./Reveal";
import css from "./home.module.css";

const POINTS_SHOWN = 2;

/** "YYYY-MM" to a fractional year, so a bar starts and ends at the right month. */
function yearFraction(month: string): number {
  const [y, m] = month.split("-").map(Number);
  return y + (m - 1) / 12;
}

export function Experience() {
  const t = useTranslations("home.experience");
  const locale = useLocale() === "tr" ? "tr" : "en";
  const now = new Date();
  const nowFraction = now.getFullYear() + now.getMonth() / 12;
  const first = Math.floor(Math.min(...profile.experience.map((e) => yearFraction(e.from))));
  const end = now.getFullYear() + 1;
  const span = end - first;
  const pct = (f: number) => `${(((f - first) / span) * 100).toFixed(2)}%`;
  const years = Array.from({ length: end - first }, (_, i) => first + i);
  const fmt = new Intl.DateTimeFormat(locale === "tr" ? "tr-TR" : "en-US", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
  const when = (month: string) => fmt.format(new Date(`${month}-01T00:00:00Z`));

  return (
    <section className={css.band} id="about" aria-labelledby="xp-h">
      <span className={css.tag}>{t("tag")}</span>
      <h2 id="xp-h" className={css.h2}>
        {t("title")}
      </h2>
      <Reveal className={`${css.xp} ${css.panel}`}>
        <div className={css.xpAxis} aria-hidden="true" title={t("timelineLabel")}>
          {years.map((y) => (
            <span key={y} style={{ left: pct(y + 0.5) }}>
              {y}
            </span>
          ))}
        </div>
        <ul className={css.xpList}>
          {profile.experience.map((e) => {
            const from = yearFraction(e.from);
            const to = e.to ? yearFraction(e.to) + 1 / 12 : nowFraction;
            return (
              <li className={css.xpRow} key={`${e.company}-${e.from}`}>
                <div className={css.xpHead}>
                  <h3 className={css.xpCo}>{e.company}</h3>
                  <span className={css.xpYr}>
                    {e.role[locale]} · {when(e.from)} – {e.to ? when(e.to) : t("present")}
                  </span>
                </div>
                <div
                  className={css.xpBarWrap}
                  style={{
                    marginLeft: pct(from),
                    width: `${(((to - from) / span) * 100).toFixed(2)}%`,
                  }}
                  aria-hidden="true"
                >
                  <div className={css.xpBar} />
                </div>
                <ul className={css.xpPoints}>
                  {e.points.slice(0, POINTS_SHOWN).map((p) => (
                    <li key={p.en}>{p[locale]}</li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ul>
      </Reveal>
    </section>
  );
}
