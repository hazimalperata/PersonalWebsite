import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { ProjectMeta } from "@/lib/content";
import { Reveal } from "./Reveal";
import css from "./home.module.css";

/** Every project that is not in the selected set, derived from the content files. */
export function MoreWork({ projects }: { projects: ProjectMeta[] }) {
  const t = useTranslations("home.more");
  const status = useTranslations("project");
  return (
    <section className={css.band} aria-labelledby="more-h">
      <span className={css.tag}>{t("tag")}</span>
      <h2 id="more-h" className={css.h2}>
        {t("title")}
      </h2>
      <Reveal>
        <ul className={css.moreList}>
          {projects.map((p) => (
            <li key={p.slug}>
              <Link href={`/work/${p.slug}`}>
                {/* EN-only projects keep their English copy on /tr; mark it so assistive tech reads it right */}
                <span className={css.t} lang={p.fallback ? "en" : undefined}>
                  {p.title}
                  {p.status !== "completed" && <span className={css.s}>{status(p.status)}</span>}
                </span>
                <span className={css.d} lang={p.fallback ? "en" : undefined}>
                  {p.summary}
                </span>
              </Link>
            </li>
          ))}
          <li>
            {/* Old links to /gallery#gallery and a cached /gallery redirect land here and still reach the page. */}
            <Link id="gallery" href="/gallery">
              <span className={css.t}>{t("galleryTitle")}</span>
              <span className={css.d}>{t("galleryLine")}</span>
            </Link>
          </li>
        </ul>
      </Reveal>
    </section>
  );
}
