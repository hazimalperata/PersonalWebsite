"use client";

import { useLenis } from "lenis/react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { MotionConfig, motion, useIsPresent } from "motion/react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

export interface LightboxItem {
  src: string;
  width: number;
  height: number;
  alt: string;
}

interface LightboxProps {
  items: LightboxItem[];
  index: number;
  onClose: () => void;
  onIndex: (index: number) => void;
}

const FOCUSABLE = "button:not([disabled]), [href], [tabindex]:not([tabindex='-1'])";
const EASE = [0.4, 0, 0.2, 1] as const;
const FADE = { duration: 0.2, ease: EASE };

const controlClass =
  "absolute flex h-12 w-12 items-center justify-center rounded-full bg-bg-2/80 text-fg " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

export function Lightbox({ items, index, onClose, onIndex }: LightboxProps) {
  const t = useTranslations("gallery");
  const lenis = useLenis();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const isPresent = useIsPresent();
  const count = items.length;
  const item = items[index];

  // Latest props for the single document listener below.
  const live = useRef({ index, count, onClose, onIndex });
  useEffect(() => {
    live.current = { index, count, onClose, onIndex };
  });

  const go = useCallback((delta: number) => {
    const { index: i, count: n, onIndex: set } = live.current;
    set((i + delta + n) % n);
  }, []);

  // Scroll lock while open; released as soon as the exit starts.
  useEffect(() => {
    if (!isPresent) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    lenis?.stop();
    return () => {
      document.body.style.overflow = previous;
      lenis?.start();
    };
  }, [lenis, isPresent]);

  // Focus enters on the close button; the opener restores its own focus on close.
  useEffect(() => {
    closeRef.current?.focus();
  }, []);

  // Keys and the focus trap are inert once the exit animation has started.
  useEffect(() => {
    if (!isPresent) return;
    function onKeyDown(e: KeyboardEvent) {
      const modified = e.altKey || e.ctrlKey || e.metaKey;
      if (e.key === "Escape") {
        e.preventDefault();
        live.current.onClose();
      } else if (e.key === "ArrowRight" && !modified) {
        e.preventDefault();
        go(1);
      } else if (e.key === "ArrowLeft" && !modified) {
        e.preventDefault();
        go(-1);
      } else if (e.key === "Tab") {
        const nodes = dialogRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE);
        if (!nodes || nodes.length === 0) return;
        const first = nodes[0];
        const last = nodes[nodes.length - 1];
        const active = document.activeElement;
        const inside = dialogRef.current?.contains(active) ?? false;
        if (!inside) {
          e.preventDefault();
          (e.shiftKey ? last : first).focus();
        } else if (e.shiftKey && active === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && active === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [go, isPresent]);

  if (!item) return null;

  return createPortal(
    <MotionConfig reducedMotion="user">
      <motion.div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={item.alt}
        inert={!isPresent}
        onClick={(e) => {
          // Backdrop only: the photo and the controls keep their own clicks.
          if (e.target instanceof Element && e.target.closest("button, img")) return;
          live.current.onClose();
        }}
        className={`fixed inset-0 z-[60] flex items-center justify-center bg-bg/90 backdrop-blur-md${isPresent ? "" : " pointer-events-none"}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={FADE}
      >
        <button type="button" ref={closeRef} aria-label={t("close")} onClick={onClose} className={`${controlClass} right-4 top-4`}>
          <X size={24} aria-hidden="true" />
        </button>
        <button type="button" aria-label={t("prev")} onClick={() => go(-1)} className={`${controlClass} left-4 top-1/2 -translate-y-1/2`}>
          <ChevronLeft size={24} aria-hidden="true" />
        </button>
        <button type="button" aria-label={t("next")} onClick={() => go(1)} className={`${controlClass} right-4 top-1/2 -translate-y-1/2`}>
          <ChevronRight size={24} aria-hidden="true" />
        </button>
        <motion.div
          className="relative h-[80vh] w-[90vw] max-w-6xl"
          initial={{ scale: 1.02 }}
          animate={{ scale: 1 }}
          transition={FADE}
        >
          <Image key={item.src} src={item.src} alt={item.alt} fill sizes="100vw" className="object-contain" loading="eager" />
        </motion.div>
        <p aria-live="polite" className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm tabular-nums text-fg-2">
          <span className="sr-only">{item.alt}. </span>
          {index + 1} / {count}
        </p>
      </motion.div>
    </MotionConfig>,
    document.body,
  );
}
