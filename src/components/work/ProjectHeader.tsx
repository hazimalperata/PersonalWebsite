import { ViewTransition } from "react";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { TextLink } from "@/components/ui/TextLink";
import type { ProjectMeta } from "@/lib/content";

export async function ProjectHeader({ meta }: { meta: ProjectMeta }) {
  const t = await getTranslations("project");
  const a11y = await getTranslations("a11y");
  return (
    <header className="mt-10">
      <div lang={meta.fallback ? "en" : undefined}>
        <h1 className="max-w-[20ch] font-display text-4xl md:text-5xl">{meta.title}</h1>
        <p className="mt-6 max-w-[62ch] text-lg text-fg-2">{meta.summary}</p>
        <dl className="mt-8 grid grid-cols-2 gap-6 text-sm md:grid-cols-4">
          <div>
            <dt className="text-fg-2">{t("role")}</dt>
            <dd>{meta.role}</dd>
          </div>
          <div>
            <dt className="text-fg-2">{t("year")}</dt>
            <dd>{meta.year}</dd>
          </div>
          <div>
            <dt className="text-fg-2">{t("status")}</dt>
            <dd>{t(meta.status)}</dd>
          </div>
          {meta.link ? (
            <div>
              <dt className="text-fg-2" aria-hidden="true">
                &nbsp;
              </dt>
              <dd>
                <TextLink
                  href={meta.link}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`${t("link")}: ${meta.title} (${a11y("externalLink")})`}
                >
                  {t("link")}
                </TextLink>
              </dd>
            </div>
          ) : null}
        </dl>
      </div>
      {meta.cover ? (
        <ViewTransition name={`project-${meta.slug}`}>
          <div className="relative mt-12 aspect-[16/10] overflow-hidden rounded-md">
            <Image
              src={meta.cover}
              alt=""
              fill
              sizes="(min-width:1280px) 1200px, 100vw"
              priority
              className="object-cover"
            />
          </div>
        </ViewTransition>
      ) : null}
      {meta.fallback ? <p className="mt-6 text-xs text-fg-2">{t("englishOnly")}</p> : null}
    </header>
  );
}
