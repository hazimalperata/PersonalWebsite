import { ViewTransition } from "react";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { SIGNAL_ATTR } from "@/components/signal/dom";
import { TextLink } from "@/components/ui/TextLink";
import type { ProjectMeta } from "@/lib/content";
import type { AppLocale } from "@/i18n/routing";
import { formatLaneRange } from "@/lib/lane-line";
import { laneRange, laneTotal } from "@/lib/signal/data";

const SIGNAL_HEADER = { [SIGNAL_ATTR.header]: "" };

export async function ProjectHeader({ meta, locale }: { meta: ProjectMeta; locale: AppLocale }) {
  const t = await getTranslations("project");
  const a11y = await getTranslations("a11y");

  const lane = meta.signal;
  const range = lane ? laneRange(lane) : null;
  const total = lane ? laneTotal(lane) : 0;
  const laneLine =
    lane && range && total > 0 ? `${t("commits", { count: total })} · ${formatLaneRange(range, locale)}` : null;

  // Only text that comes from the EN content file is marked English; the labels around it follow the page locale.
  const en = meta.fallback ? "en" : undefined;
  const storeHrefs = new Set(meta.storeLinks.map((s) => s.href));
  const visit = meta.link && !storeHrefs.has(meta.link) ? meta.link : null;
  const links = [
    ...meta.storeLinks.map((s) => ({ href: s.href, label: t(`stores.${s.store}`) })),
    ...(visit ? [{ href: visit, label: t("link") }] : []),
  ];

  return (
    <header className="mt-6 flex flex-col md:flex-row md:items-stretch md:gap-8">
      <div
        className="rounded-2xl border border-fg/10 bg-bg/80 p-6 backdrop-blur-md md:w-[min(48rem,58%)] md:shrink-0 md:p-9"
      >
        <p className="text-sm text-fg/80">{[t(`kind.${meta.kind}`), meta.year, ...meta.platforms].join(" · ")}</p>
        <h1 lang={en} className="mt-3 max-w-[20ch] font-display text-4xl font-semibold md:text-5xl">{meta.title}</h1>
        {laneLine ? (
          <p data-testid="lane-line" className="mt-3 font-mono text-sm text-fg/80">
            {laneLine}
          </p>
        ) : null}
        <p lang={en} className="mt-5 max-w-[62ch] text-lg text-fg/85">{meta.summary}</p>
        <dl className="mt-7 grid gap-5 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-fg/70">{t("role")}</dt>
            <dd lang={en} className="mt-1">
              {meta.role}
            </dd>
          </div>
          <div>
            <dt className="text-fg/70">{t("status")}</dt>
            <dd className="mt-1">{t(meta.status)}</dd>
          </div>
          {meta.stack.length > 0 ? (
            <div className="sm:col-span-2">
              <dt className="text-fg/70">{t("stack")}</dt>
              <dd lang={en} className="mt-1 font-mono text-[0.9rem]">{meta.stack.join(" · ")}</dd>
            </div>
          ) : null}
        </dl>
        {links.length > 0 ? (
          <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm">
            {links.map((l) => (
              <li key={l.href}>
                <TextLink href={l.href} target="_blank" rel="noopener noreferrer">
                  {l.label}
                  <span className="sr-only"> ({a11y("externalLink")})</span>
                </TextLink>
              </li>
            ))}
          </ul>
        ) : null}
        {meta.fallback ? <p className="mt-6 text-sm text-fg/70">{t("englishOnly")}</p> : null}
      </div>
      {/* The lane's own timeline is drawn here by the particle field; the text above stays on its panel. */}
      {lane && laneLine ? <div aria-hidden="true" {...SIGNAL_HEADER} className="order-first mb-4 h-56 md:order-none md:mb-0 md:h-auto md:min-h-72 md:flex-1" /> : null}
    </header>
  );
}

export function ProjectCover({ meta }: { meta: ProjectMeta }) {
  if (!meta.cover) return null;
  if (meta.portraitImages) {
    // Portrait phone screenshots stay unframed: natural proportions, no crop, no rounded corners.
    return (
      <ViewTransition name={`project-${meta.slug}`}>
        <div className="mt-10">
          <Image
            src={meta.cover}
            alt=""
            width={660}
            height={1434}
            sizes="(min-width:768px) 320px, 70vw"
            priority
            className="h-auto max-h-[70vh] w-auto max-w-full"
          />
        </div>
      </ViewTransition>
    );
  }
  return (
    <ViewTransition name={`project-${meta.slug}`}>
      <div className="relative mt-10 aspect-[16/10] overflow-hidden rounded-md">
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
  );
}
