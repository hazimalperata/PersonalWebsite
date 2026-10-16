"use client";

import { useLocale } from "next-intl";
import { useSyncExternalStore } from "react";
import { profile } from "@/data/profile";
import { formatLocalTime } from "@/lib/time";

const PLACEHOLDER = "--:--";

function subscribe(onChange: () => void) {
  const id = window.setInterval(onChange, 30_000);
  return () => window.clearInterval(id);
}

/** ISO instant truncated to the minute: stable between calls inside a minute, as the store requires. */
const getSnapshot = () => `${new Date().toISOString().slice(0, 16)}:00Z`;
const getServerSnapshot = () => "";

/** Local time in the profile's city. The server cannot know the visit time, so it renders a fixed-width placeholder. */
export function LocalTime() {
  const locale = useLocale();
  const iso = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const time = iso ? formatLocalTime(new Date(iso), profile.location.tz, locale) : PLACEHOLDER;

  return (
    <time dateTime={iso || undefined} className="tabular-nums">
      {time}
    </time>
  );
}
