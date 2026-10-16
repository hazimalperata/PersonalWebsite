"use client";

import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";
import { SIGNAL_ATTR, SignalSection, useMotionEnabled, useSignal } from "@/components/signal";
import css from "./home.module.css";

const STEPS = ["spec", "agents", "review", "gates"] as const;

/**
 * The four steps as disclosures, one open at a time. Each card holds an empty slot the field draws a pipeline
 * node in; the open step's node glows, but only while this section is on screen.
 */
export function AiSteps() {
  const t = useTranslations("home.ai");
  const { setPipelineFocus } = useSignal();
  const motion = useMotionEnabled();
  const [open, setOpen] = useState<number | null>(0);
  const [instant, setInstant] = useState(false);
  const [visible, setVisible] = useState(false);
  const section = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = section.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver((entries) => setVisible(entries.some((e) => e.isIntersecting)), {
      threshold: 0.3,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    setPipelineFocus(visible ? open : null);
    return () => setPipelineFocus(null);
  }, [visible, open, setPipelineFocus]);

  const toggle = useCallback((i: number, byKeyboard: boolean) => {
    setInstant(byKeyboard);
    setOpen((cur) => (cur === i ? null : i));
  }, []);

  return (
    <SignalSection id="ai-workflow" state="pipeline">
      <div ref={section} className={css.aiRun}>
        <p className={css.aiLead}>{t("lead")}</p>
        <ol
          className={`${css.steps}${motion ? ` ${css.stepsAnimated}` : ""}${instant ? ` ${css.stepsInstant}` : ""}`}
          aria-label={t("stepsLabel")}
        >
          {STEPS.map((key, i) => {
            const isOpen = open === i;
            const slotAttr = { [SIGNAL_ATTR.step]: i };
            return (
              <li key={key} className={`${css.step} ${css.panel}${isOpen ? ` ${css.stepOpen}` : ""}`}>
                <div className={css.node} aria-hidden="true" {...slotAttr} />
                <span className={css.stepIdx}>{String(i + 1).padStart(2, "0")}</span>
                <h3>
                  <button
                    type="button"
                    className={css.stepBtn}
                    aria-expanded={isOpen}
                    aria-controls={`ai-step-${key}`}
                    onClick={(e) => toggle(i, e.detail === 0)}
                  >
                    {t(`steps.${key}.title`)}
                    <span className={css.chev} aria-hidden="true" />
                  </button>
                </h3>
                <p className={css.stepLine}>{t(`steps.${key}.line`)}</p>
                <div id={`ai-step-${key}`} className={css.detail}>
                  <div>
                    <p>{t(`steps.${key}.detail`)}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </SignalSection>
  );
}
