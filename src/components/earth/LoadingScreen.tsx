"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./earth.module.scss";

interface Props {
  progress: number; // 0..1
}

export default function LoadingScreen({ progress }: Props) {
  const isLoaded = progress >= 1;

  return (
    <AnimatePresence>
      {!isLoaded && (
        <motion.div
          className={styles.loadingScreen}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 1.2, ease: "easeInOut" } }}
        >
          <div className={styles.loadingGlobe} />
          <div className={styles.loadingBar}>
            <div
              className={styles.loadingBarFill}
              style={{ width: `${Math.round(progress * 100)}%` }}
            />
          </div>
          <p className={styles.loadingText}>
            Loading · {Math.round(progress * 100)}%
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
