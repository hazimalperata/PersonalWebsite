import type { AppLocale } from "@/i18n/routing";

const INTL_LOCALE: Record<AppLocale, string> = { en: "en-US", tr: "tr-TR" };

function parts(iso: string): { month: number; year: number } | null {
  const m = /^(\d{4})-(\d{2})/.exec(iso);
  return m ? { year: Number(m[1]), month: Number(m[2]) - 1 } : null;
}

/**
 * "Jul–Oct 2026" inside one year, "Nov 2025–Mar 2026" across years, "Oct 2026" for a single month.
 * Month names come from Intl, so Turkish gets "Tem–Eki 2026".
 */
export function formatLaneRange(range: { first: string; last: string }, locale: AppLocale): string {
  const a = parts(range.first);
  const b = parts(range.last);
  if (!a || !b) return "";
  const fmt = new Intl.DateTimeFormat(INTL_LOCALE[locale], { month: "short", timeZone: "UTC" });
  const month = (p: { month: number; year: number }) => fmt.format(new Date(Date.UTC(p.year, p.month, 1)));
  if (a.year === b.year && a.month === b.month) return `${month(b)} ${b.year}`;
  if (a.year === b.year) return `${month(a)}–${month(b)} ${b.year}`;
  return `${month(a)} ${a.year}–${month(b)} ${b.year}`;
}
