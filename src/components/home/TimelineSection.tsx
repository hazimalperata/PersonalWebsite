import { useLocale, useTranslations } from "next-intl";
import { SignalSection } from "@/components/signal";
import { Link } from "@/i18n/navigation";
import { lanes, laneTotal } from "@/lib/signal/data";
import css from "./home.module.css";

/**
 * The timeline itself is drawn by the field. This section holds the scroll, the heading, a caption and a real list
 * of the lanes (links where a case page exists), because the labels drawn in the field are not reachable.
 */
export function TimelineSection() {
  const t = useTranslations("home");
  const locale = useLocale() === "tr" ? "tr" : "en";
  const fmt = new Intl.NumberFormat(locale === "tr" ? "tr-TR" : "en-US");
  return (
    <SignalSection id="timeline" state="timeline">
      <div className={css.tl}>
        <div className={css.tlSticky}>
          <h2>{t("timeline.title")}</h2>
          <div className={css.tlFoot}>
            <p className={css.tlCaption}>
              <span className={css.tlDot} aria-hidden="true" />
              {t("timeline.caption")}
            </p>
            <ul className={css.legend} aria-label={t("timeline.legend")}>
              {lanes.map((lane) => {
                const inner = (
                  <>
                    <i style={{ background: lane.color }} aria-hidden="true" />
                    {lane.name[locale]}
                    <small>
                      {t("timeline.commits", {
                        count: fmt.format(laneTotal(lane.id)),
                      })}
                    </small>
                  </>
                );
                return (
                  <li key={lane.id}>
                    {lane.slug ? (
                      <Link className={css.legendItem} href={`/work/${lane.slug}`}>
                        {inner}
                      </Link>
                    ) : (
                      <span className={css.legendItem}>{inner}</span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </SignalSection>
  );
}
