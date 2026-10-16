"use client";

import { Suspense, useCallback, useEffect, useState, type RefObject } from "react";
import { Canvas } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { useTheme } from "@/components/layout/ThemeProvider";
import type { Theme } from "@/lib/theme";
import Atmosphere from "./Atmosphere";
import CameraRig from "./CameraRig";
import Clouds from "./Clouds";
import Earth from "./Earth";
import { fadeFor, scrollState, subscribeScrollProgress, writeFade } from "./scrollState";
import Stars from "./Stars";
import SunLight from "./SunLight";
import { SceneThemeContext, useSceneThemeDriver } from "./useSceneTheme";

interface Props {
  tier: "low" | "high";
  wrapperRef: RefObject<HTMLElement | null>;
  onReady?: () => void;
  onContextLost: () => void;
}

/** Mounts only once every texture in the sibling Suspense tree has resolved. */
function Ready({ onReady }: { onReady?: () => void }) {
  useEffect(() => {
    onReady?.();
  }, [onReady]);
  return null;
}

function SceneContents({ tier, theme, wrapperRef, onReady }: Pick<Props, "tier" | "wrapperRef" | "onReady"> & { theme: Theme }) {
  const sceneTheme = useSceneThemeDriver(theme);

  return (
    <SceneThemeContext.Provider value={sceneTheme}>
      <Suspense fallback={null}>
        <SunLight />
        <Stars tier={tier} />
        <CameraRig wrapper={wrapperRef}>
          <Earth tier={tier} />
          <Clouds tier={tier} />
          <Atmosphere />
        </CameraRig>
        {tier === "high" && (
          <EffectComposer multisampling={0}>
            <Bloom intensity={0.35} luminanceThreshold={0.85} mipmapBlur />
          </EffectComposer>
        )}
        <Ready onReady={onReady} />
      </Suspense>
    </SceneThemeContext.Provider>
  );
}

export default function EarthScene({ tier, wrapperRef, onReady, onContextLost }: Props) {
  // read here: React context does not reliably cross into the Canvas reconciler
  const { theme } = useTheme();
  // a cap for the renderer's pixel ratio: [min, max]; PerformanceMonitor lowers the max
  const [dpr, setDpr] = useState<[number, number]>(tier === "high" ? [1, 1.5] : [1, 1]);
  const [tabVisible, setTabVisible] = useState(true);
  const [faded, setFaded] = useState(() => fadeFor(scrollState.progress) === 0);
  const active = tabVisible && !faded;

  useEffect(() => {
    scrollState.visible = active;
  }, [active]);

  useEffect(() => {
    const onVisibility = () => setTabVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  // The render loop sleeps once the canvas has faded out; a progress change alone wakes it again.
  useEffect(() => {
    return subscribeScrollProgress((progress) => {
      setFaded(writeFade(wrapperRef.current, progress) === 0);
    });
  }, [wrapperRef]);

  const onLost = useCallback(() => onContextLost(), [onContextLost]);

  return (
    <Canvas
      flat
      dpr={dpr}
      frameloop={active ? "always" : "never"}
      gl={{ antialias: false, powerPreference: "high-performance", alpha: true }}
      camera={{ fov: 35, near: 0.1, far: 100, position: [0, -0.2, 2.6] }}
      onCreated={({ gl }) => gl.domElement.addEventListener("webglcontextlost", onLost)}
    >
      <PerformanceMonitor onDecline={() => setDpr([1, 1])} />
      <SceneContents tier={tier} theme={theme} wrapperRef={wrapperRef} onReady={onReady} />
    </Canvas>
  );
}
