"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";
import { SIGNAL_ATTR, SignalSection, useMotionEnabled, useSignal } from "@/components/signal";
import { registerGsap, ScrollTrigger } from "@/lib/motion";
import css from "./home.module.css";

const STEPS = ["spec", "agents", "review", "gates"] as const;
const STATIC_ATTR = "data-signal-static-mode";

/**
 * The four steps on a pinned scroll runway. The sticky panel stays put while the page scrolls through the runway;
 * the scroll progress fills the particle pipeline above the cards from left to right (the engine owns the fill and
 * writes each card's `--on<n>` emphasis), so passed steps stay lit and upcoming ones dim.
 * Every step's text is always in the DOM. Under reduced motion or without WebGL there is no runway: a plain list.
 */
export function AiSteps() {
  const t = useTranslations("home.ai");
  const { setPipelineProgress } = useSignal();
  const motion = useMotionEnabled();
  const run = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = run.current;
    if (!motion || !el) return;
    const root = document.documentElement;
    let trigger: ReturnType<typeof ScrollTrigger.create> | undefined;
    // Once the page is static the trigger goes inert instead of being killed: killing it makes ScrollTrigger refresh
    // and cancels a scroll that is under way at that moment. It is killed with the component.
    let live = false;

    const stop = () => {
      live = false;
      setPipelineProgress(null);
      for (let n = 0; n < STEPS.length; n++) el.style.removeProperty(`--on${n}`);
    };
    const start = () => {
      if (live || root.hasAttribute(STATIC_ATTR)) return;
      live = true;
      if (!trigger) {
        registerGsap();
        // ScrollTrigger runs on the page's one GSAP ticker (SignalProvider); no scroll listener of our own.
        trigger = ScrollTrigger.create({
          trigger: el,
          start: "top top",
          end: "bottom bottom",
          onUpdate: (self) => {
            if (live) setPipelineProgress(self.progress);
          },
        });
      }
      setPipelineProgress(trigger.progress || 0);
    };

    start();
    // the canvas sets the static-mode flag after idle (no WebGL, lost context): the runway is a plain list from then on
    const watch = new MutationObserver(() => (root.hasAttribute(STATIC_ATTR) ? stop() : start()));
    watch.observe(root, { attributes: true, attributeFilter: [STATIC_ATTR] });
    return () => {
      watch.disconnect();
      stop();
      trigger?.kill();
    };
  }, [motion, setPipelineProgress]);

  return (
    <SignalSection id="ai-workflow" state="pipeline">
      <div ref={run} className={css.aiRun} {...{ [SIGNAL_ATTR.pipeRun]: "" }}>
        <div className={css.aiSticky}>
          <p className={css.aiLead}>{t("lead")}</p>
          {/* open space for the four pipeline nodes: the field draws them here, one per card column */}
          <div className={css.nodes} aria-hidden="true">
            {STEPS.map((key, i) => (
              <span key={key} className={css.slot} {...{ [SIGNAL_ATTR.step]: i }} />
            ))}
          </div>
          <ol className={`${css.steps}${motion ? ` ${css.stepsPinned}` : ""}`} aria-label={t("stepsLabel")}>
            {STEPS.map((key, i) => (
              <li key={key} className={`${css.step} ${css.panel}`}>
                <span className={css.stepIdx}>{String(i + 1).padStart(2, "0")}</span>
                <h3>{t(`steps.${key}.title`)}</h3>
                <p className={css.stepLine}>{t(`steps.${key}.line`)}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </SignalSection>
  );
}
