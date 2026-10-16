"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { SIGNAL_ATTR, SignalSection, useMotionEnabled, useSignal } from "@/components/signal";
import { registerGsap, ScrollTrigger } from "@/lib/motion";
import { stepForProgress } from "./aiProgress";
import css from "./home.module.css";

const STEPS = ["spec", "agents", "review", "gates"] as const;

/**
 * The four steps on a pinned scroll runway. The sticky panel stays put while the page scrolls through the runway;
 * the scroll progress picks the active step (full opacity, the others dimmed) and lights its node in the field.
 * Every step's text is always in the DOM. Under reduced motion or without WebGL there is no runway: a plain list.
 */
export function AiSteps() {
  const t = useTranslations("home.ai");
  const { setPipelineFocus } = useSignal();
  const motion = useMotionEnabled();
  const run = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [onScreen, setOnScreen] = useState(false);

  useEffect(() => {
    const el = run.current;
    if (!motion || !el || document.documentElement.hasAttribute("data-signal-static-mode")) return;
    registerGsap();
    // ScrollTrigger runs on the page's one GSAP ticker (SignalProvider); no scroll listener of our own.
    const progress = ScrollTrigger.create({
      trigger: el,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => setActive(stepForProgress(self.progress, STEPS.length)),
    });
    const view = ScrollTrigger.create({
      trigger: el,
      start: "top bottom",
      end: "bottom top",
      onToggle: (self) => setOnScreen(self.isActive),
    });
    return () => {
      progress.kill();
      view.kill();
      setOnScreen(false);
    };
  }, [motion]);

  useEffect(() => {
    setPipelineFocus(onScreen ? active : null);
    return () => setPipelineFocus(null);
  }, [onScreen, active, setPipelineFocus]);

  return (
    <SignalSection id="ai-workflow" state="pipeline">
      <div ref={run} className={css.aiRun}>
        <div className={css.aiSticky}>
          <p className={css.aiLead}>{t("lead")}</p>
          <ol className={`${css.steps}${motion ? ` ${css.stepsPinned}` : ""}`} aria-label={t("stepsLabel")}>
            {STEPS.map((key, i) => {
              const slotAttr = { [SIGNAL_ATTR.step]: i };
              return (
                <li
                  key={key}
                  className={`${css.step} ${css.panel}`}
                  data-active={motion ? String(i === active) : undefined}
                >
                  <div className={css.node} aria-hidden="true" {...slotAttr} />
                  <span className={css.stepIdx}>{String(i + 1).padStart(2, "0")}</span>
                  <h3>{t(`steps.${key}.title`)}</h3>
                  <p className={css.stepLine}>{t(`steps.${key}.line`)}</p>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </SignalSection>
  );
}
