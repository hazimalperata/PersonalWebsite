import { useTranslations } from "next-intl";
import type { CSSProperties } from "react";
import { profile } from "@/data/profile";
import { formatCoordinates } from "@/lib/time";
import { LocalTime } from "./LocalTime";
import styles from "./hero.module.css";

/** Mono status strip: local time, coordinates, availability. Fades in 600 ms after first paint. */
export function Telemetry() {
  const t = useTranslations("hero");
  const { lat, lon } = profile.location;

  return (
    <p
      className={`${styles.fadeIn} mt-10 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-xs text-fg-2`}
      style={{ "--fade-delay": "600ms" } as CSSProperties}
    >
      <span>
        <LocalTime /> {t("location")}
      </span>
      <span aria-hidden="true" className="hidden sm:inline">·</span>
      <span>{formatCoordinates(lat, lon)}</span>
      <span aria-hidden="true" className="hidden sm:inline">·</span>
      <span className="inline-flex items-center gap-2">
        <span aria-hidden="true" className="size-1.5 rounded-full bg-amber" />
        {t("openToWork")}
      </span>
    </p>
  );
}
