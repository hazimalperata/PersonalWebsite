"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SECTIONS } from "./utils";
import styles from "./earth.module.scss";

interface Props {
  activeSectionId: string;
  currentStep: number;
  totalSteps: number;
  onStart?: () => void;
}

const CONTENT_SECTION_IDS = SECTIONS.filter(
  (s) => s.id !== "outro"
).map((s) => s.id);

export default function EarthOverlay({ activeSectionId, currentStep, totalSteps, onStart }: Props) {
  const activeSection = SECTIONS.find((s) => s.id === activeSectionId);
  const isOutro = activeSectionId === "outro";
  const isHero = activeSectionId === "hero";

  // Progress bar fill: map step 0..max to 0..100%
  // (subtract 2 from totalSteps because hero and outro aren't in the dots normally, 
  // but let's just do currentStep / (totalSteps - 1))
  const progress = currentStep / (totalSteps - 1);
  const fillPct = `${Math.round(progress * 100)}%`;

  return (
    <div className={styles.overlayContainer}>
      {/* ── Hero ── */}
      <AnimatePresence mode="wait">
        {isHero && (
          <motion.div
            key="hero"
            className={styles.heroContent}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 1, ease: "easeOut" } }}
            exit={{ opacity: 0, y: -20, transition: { duration: 0.6, ease: "easeIn" } }}
          >
            <h1 className={styles.heroTitle}>{activeSection?.title}</h1>
            <p className={styles.heroSubtitle}>{activeSection?.subtitle}</p>

            <button
              className={styles.startBtn}
              onClick={onStart}
            >
              Start Journey
            </button>

            <div className={styles.scrollHint} style={{ marginTop: '2rem' }}>
              <span>and then scroll to explore</span>
            </div>
          </motion.div>
        )}

        {/* ── Section cards (Turkey, Americas, Asia, Africa, S.America) ── */}
        {!isHero && !isOutro && activeSection && (
          <motion.div
            key={activeSectionId}
            className={[
              styles.sectionContent,
              activeSection.align === "right" ? styles.alignRight : styles.alignLeft,
            ].join(" ")}
            initial={{
              opacity: 0,
              x: activeSection.align === "right" ? 40 : -40,
            }}
            animate={{
              opacity: 1,
              x: 0,
              transition: { duration: 0.8, ease: "easeOut" },
            }}
            exit={{
              opacity: 0,
              x: activeSection.align === "right" ? 40 : -40,
              transition: { duration: 0.5, ease: "easeIn" },
            }}
          >
            <p className={styles.sectionSubtitle}>{activeSection.subtitle}</p>
            <h2 className={styles.sectionTitle}>{activeSection.title}</h2>
            <p className={styles.sectionDescription}>{activeSection.description}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Progress bar (hidden on hero & outro) ── */}
      {!isHero && !isOutro && (
        <div className={styles.progressBar}>
          <div className={styles.progressTrack}>
            <div className={styles.progressFill} style={{ height: fillPct }} />
          </div>
          {CONTENT_SECTION_IDS.filter((id) => id !== "hero").map((id) => (
            <div
              key={id}
              className={[
                styles.progressDot,
                activeSectionId === id ? styles.active : "",
              ].join(" ")}
            />
          ))}
        </div>
      )}
    </div>
  );
}
