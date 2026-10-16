import { pick, type ExperienceItem } from "@/data/profile";
import type { AppLocale } from "@/i18n/routing";

const MAX_POINTS = 5;

/** "2021-11" -> "Nov 2021" / "Kas 2021". */
function formatMonth(iso: string, locale: AppLocale): string {
  const [year, month] = iso.split("-").map(Number);
  return new Intl.DateTimeFormat(locale, { month: "short", year: "numeric", timeZone: "UTC" })
    .format(new Date(Date.UTC(year, month - 1, 1)))
    .replace(".", "");
}

export function Timeline({
  items,
  locale,
  presentLabel,
}: {
  items: ExperienceItem[];
  locale: AppLocale;
  presentLabel: string;
}) {
  return (
    <ol className="relative mt-8 space-y-12 border-l border-fg-2/30 pl-8">
      {items.map((item, index) => (
        <li key={item.company} className="relative">
          <span aria-hidden className="absolute -left-[37px] top-2 size-2 rounded-full bg-accent" />
          <span aria-hidden="true" className="font-body text-xs tabular-nums text-fg-2">{String(index + 1).padStart(2, "0")}</span>
          <h4 className="font-display text-xl">{item.company}</h4>
          <p className="text-fg-2">
            {pick(item.role, locale)}
            {" · "}
            {formatMonth(item.from, locale)} – {item.to === null ? presentLabel : formatMonth(item.to, locale)}
          </p>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-fg-2">
            {item.points.slice(0, MAX_POINTS).map((point) => (
              <li key={point.en}>{pick(point, locale)}</li>
            ))}
          </ul>
        </li>
      ))}
    </ol>
  );
}
