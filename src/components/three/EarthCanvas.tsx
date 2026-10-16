"use client";

import dynamic from "next/dynamic";
import { Component, useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { sceneTextureUrls } from "@/lib/capabilities";
import { cn } from "@/lib/cn";
import { useTier } from "@/lib/useTier";
import Poster from "./Poster";

const EarthScene = dynamic(() => import("./EarthScene"), { ssr: false });

interface BoundaryProps {
  fallback: ReactNode;
  onError: () => void;
  children: ReactNode;
}

class SceneBoundary extends Component<BoundaryProps, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: unknown) {
    console.warn("[earth] scene failed, showing the poster instead", error);
    this.props.onError();
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

/**
 * Extra time the mobile tier (`low`) gets to hydrate and run the hero reveal before the scene starts
 * compiling shaders; on a throttled phone that setup would otherwise block input. Desktop does not wait.
 */
export const SETTLE_MS = 2500;

/** Resolves after first paint (plus `settleMs`), so the SSR headline stays the LCP. */
function useAfterIdle(enabled: boolean, settleMs: number): boolean {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (!enabled) return;
    let idleId: number | undefined;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const schedule = () => {
      if (typeof requestIdleCallback === "function") {
        idleId = requestIdleCallback(() => setReady(true), { timeout: 1500 });
      } else {
        timer = setTimeout(() => setReady(true), 200);
      }
    };
    if (settleMs > 0) timer = setTimeout(schedule, settleMs);
    else schedule();
    return () => {
      if (timer !== undefined) clearTimeout(timer);
      if (idleId !== undefined) cancelIdleCallback(idleId);
    };
  }, [enabled, settleMs]);
  return ready;
}

/** A texture that never decodes must not hang the scene: past this, the poster takes over. */
export const PREFLIGHT_TIMEOUT_MS = 8000;

/**
 * Decodes every texture the scene will request, so a missing or blocked file is found here (and the poster
 * takes over) instead of as an uncaught rejection from inside the 3D library. The browser cache then serves
 * the scene's own requests for the same URLs.
 */
export function preflightTextures(urls: string[], timeoutMs = PREFLIGHT_TIMEOUT_MS): Promise<void> {
  const decoded = Promise.all(
    urls.map((url) => {
      const img = new Image();
      img.src = url;
      return img.decode();
    }),
  ).then(() => undefined);
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error("texture preflight timed out")), timeoutMs);
  });
  return Promise.race([decoded, timeout]).finally(() => clearTimeout(timer));
}

/**
 * Fixed backdrop behind the page. `onReady` fires at most once: when the scene's textures have
 * loaded, or as soon as the poster is shown instead (poster tier, scene error, lost GL context),
 * so whatever waits on it never hangs.
 */
export default function EarthCanvas({ onReady }: { onReady?: () => void }) {
  const tier = useTier();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);
  const [sceneReady, setSceneReady] = useState(false);
  const idle = useAfterIdle(tier === "low" || tier === "high", tier === "low" ? SETTLE_MS : 0);

  const latestOnReady = useRef(onReady);
  const fired = useRef(false);
  useEffect(() => {
    latestOnReady.current = onReady;
  }, [onReady]);
  const fireReady = useCallback(() => {
    if (fired.current) return;
    fired.current = true;
    latestOnReady.current?.();
  }, []);
  const onSceneReady = useCallback(() => {
    setSceneReady(true);
    fireReady();
  }, [fireReady]);
  const onSceneFailed = useCallback(() => setFailed(true), []);

  const showsPoster = tier === "poster" || failed;
  const [texturesOk, setTexturesOk] = useState(false);
  useEffect(() => {
    if (!idle || showsPoster || tier === null) return;
    let cancelled = false;
    preflightTextures(sceneTextureUrls(tier)).then(
      () => {
        if (!cancelled) setTexturesOk(true);
      },
      () => {
        if (!cancelled) setFailed(true);
      },
    );
    return () => {
      cancelled = true;
    };
  }, [idle, showsPoster, tier]);
  useEffect(() => {
    // No textures to wait for: the poster counts as ready as soon as it is chosen.
    if (showsPoster) fireReady();
  }, [showsPoster, fireReady]);

  if (tier === null) return null;

  let content: ReactNode = null;
  if (showsPoster) content = <Poster />;
  else if (idle && texturesOk) {
    content = (
      <SceneBoundary fallback={<Poster />} onError={onSceneFailed}>
        <EarthScene tier={tier} wrapperRef={wrapperRef} onReady={onSceneReady} onContextLost={onSceneFailed} />
      </SceneBoundary>
    );
  }

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0"
      style={{ viewTransitionName: "earth" }}
      ref={wrapperRef}
    >
      {/* the scene writes the scroll fade to the wrapper; this inner layer carries the fade-in */}
      <div
        className={cn(
          "absolute inset-0 transition-opacity duration-400 ease-out motion-reduce:transition-none",
          showsPoster || sceneReady ? "opacity-100" : "opacity-0",
        )}
      >
        {content}
      </div>
    </div>
  );
}
