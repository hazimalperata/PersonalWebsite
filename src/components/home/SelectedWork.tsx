import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { SIGNAL_ATTR, SignalSection } from "@/components/signal";
import { NewTabHint } from "@/components/ui/NewTabHint";
import { Link } from "@/i18n/navigation";
import type { ProjectMeta } from "@/lib/content";
import { lanes, laneTotal } from "@/lib/signal/data";
import { Reveal } from "./Reveal";
import css from "./home.module.css";

function Illustration() {
  const t = useTranslations("home.work");
  return (
    <div className={css.illus}>
      <span className={css.illusCap}>{t("illustrationCaption")}</span>
      <svg viewBox="0 0 420 96" role="img" aria-label={t("illustrationAlt")}>
        <g fill="none" stroke="#6EE7B7" strokeWidth="1.2">
          <rect x="4" y="14" width="112" height="68" rx="10" />
          <rect x="154" y="14" width="112" height="68" rx="10" />
          <rect x="304" y="14" width="112" height="68" rx="10" />
          <path d="M116 48h38M266 48h38" strokeDasharray="3 4" />
          <path d="M148 43l6 5-6 5M298 43l6 5-6 5" />
        </g>
        <g fill="#E8EAF0" fontFamily="var(--font-plex), monospace" fontSize="10" textAnchor="middle">
          <text x="60" y="44">
            {t("illustration.app")}
          </text>
          <text x="60" y="60" fill="#8B90A0">
            {t("illustration.appNote")}
          </text>
          <text x="210" y="44">
            {t("illustration.api")}
          </text>
          <text x="210" y="60" fill="#8B90A0">
            {t("illustration.apiNote")}
          </text>
          <text x="360" y="44">
            {t("illustration.panel")}
          </text>
          <text x="360" y="60" fill="#8B90A0">
            {t("illustration.panelNote")}
          </text>
        </g>
      </svg>
    </div>
  );
}

function WorkCard({ project, index }: { project: ProjectMeta; index: number }) {
  const t = useTranslations("home.work");
  const status = useTranslations("project");
  const locale = useLocale() === "tr" ? "tr" : "en";
  const lane = project.signal ? lanes.find((l) => l.id === project.signal) : undefined;
  const commits = project.signal ? laneTotal(project.signal) : 0;
  const noScreens = project.images.length === 0;
  const phones = project.portraitImages && !noScreens;
  const isWeb = project.platforms.includes("Web");
  const stageAttr = { [SIGNAL_ATTR.work]: index };
  const titleId = `work-${project.slug}`;
  return (
    <div className={`${css.work}${index % 2 === 1 ? ` ${css.workRight}` : ""}`}>
      <div className={css.stage} aria-hidden="true" {...stageAttr} />
      <Reveal className={`${css.workCard} ${css.panel}${phones ? ` ${css.workCardPhones}` : ""}`}>
        <article aria-labelledby={titleId}>
          <div className={css.meta}>
            <span className={css.sw}>
              {lane && <i style={{ background: lane.color }} aria-hidden="true" />}
              {t(`kind.${project.kind}`)}
            </span>
            <span>{project.year}</span>
            {project.platforms.length > 0 && <span>{project.platforms.join(" · ")}</span>}
            {commits > 0 && (
              <span>
                {t("commits", {
                  count: commits.toLocaleString(locale === "tr" ? "tr-TR" : "en-US"),
                })}
              </span>
            )}
            {project.status !== "completed" && <span>{status(project.status)}</span>}
          </div>
          <h3 id={titleId}>{project.title}</h3>
          <p>{project.summary}</p>
          <p className={css.role}>{project.role}</p>
          {noScreens && <p className={css.note}>{t("clientNote")}</p>}
          {project.stack.length > 0 && (
            <ul className={css.chips} aria-label={t("stackLabel")}>
              {project.stack.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          )}
          <div className={css.links}>
            <Link className={css.main} href={`/work/${project.slug}`}>
              {t("caseStudy")}
            </Link>
            {project.storeLinks.map((l) => (
              <a key={l.store} href={l.href} target="_blank" rel="noopener noreferrer">
                {t(`store.${l.store}`)}
                <NewTabHint />
              </a>
            ))}
          </div>
        </article>
        {noScreens && <Illustration />}
        {phones && (
          <div className={css.phones}>
            {project.images.slice(0, 2).map((src, k) => (
              <figure className={css.shot} key={src}>
                <Image src={src} alt={t("screenshot", { title: project.title, n: k + 1 })} fill sizes="176px" />
              </figure>
            ))}
          </div>
        )}
        {!noScreens && !phones && (
          <figure className={css.browser}>
            {isWeb && (
              <div className={css.browserBar} aria-hidden="true">
                <i />
                <i />
                <i />
              </div>
            )}
            <div className={css.wide}>
              <Image
                src={project.images[0]}
                alt={t("screenshotWide", { title: project.title })}
                fill
                sizes="(max-width: 900px) 90vw, 560px"
              />
            </div>
          </figure>
        )}
      </Reveal>
    </div>
  );
}

/** One section per selected project; each carries an empty stage the field draws that project's cluster in. */
export function SelectedWork({ projects }: { projects: ProjectMeta[] }) {
  const t = useTranslations("home.work");
  return (
    <div id="work">
      <h2 className="sr-only">{t("heading")}</h2>
      {projects.map((project, i) => (
        <SignalSection key={project.slug} id={`work-${i}`} state={`work:${i}`}>
          <WorkCard project={project} index={i} />
        </SignalSection>
      ))}
    </div>
  );
}
