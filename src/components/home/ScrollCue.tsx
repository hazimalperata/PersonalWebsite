"use client";

import { useMotionEnabled } from "@/components/signal";
import css from "./home.module.css";

export function ScrollCue({ label }: { label: string }) {
  const motion = useMotionEnabled();
  return (
    <div className={`${css.cue}${motion ? ` ${css.cueOn}` : ""}`} aria-hidden="true">
      <span className={css.cueLine}>
        <span className={css.cueDot} />
      </span>
      {label}
    </div>
  );
}
