"use client";

import { Component, lazy, Suspense, useCallback, useEffect, useState, type ReactNode } from "react";
import { SignalOverlay } from "./SignalOverlay";
import { StaticTimeline } from "./StaticTimeline";

// The engine pulls in three and the R3F renderer; keep it out of the first paint.
const SignalEngine = lazy(() => import("./SignalEngine"));

/** True when a WebGL context can be created here. Never throws. */
export function hasWebGL(): boolean {
  try {
    if (typeof WebGLRenderingContext === "undefined") return false;
    const c = document.createElement("canvas");
    const gl = (c.getContext("webgl2") || c.getContext("webgl")) as WebGLRenderingContext | null;
    if (!gl) return false;
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return true;
  } catch {
    return false;
  }
}

class EngineBoundary extends Component<{ onError: () => void; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: unknown) {
    console.warn("[signal] engine failed, showing the static timeline instead", error);
    this.props.onError();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

/**
 * The fixed particle canvas with its overlay, or the static timeline when WebGL cannot be created, fails while
 * running, or is lost. Nothing throws to the page.
 */
export function SignalCanvas({ coarse }: { coarse: boolean }) {
  const [mode, setMode] = useState<"checking" | "gl" | "static">("checking");
  useEffect(() => {
    // feature detection needs the browser, so it can only run after hydration
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMode(hasWebGL() ? "gl" : "static");
  }, []);
  const fail = useCallback(() => setMode("static"), []);

  if (mode === "checking") return null;
  if (mode === "static") return <StaticTimeline />;
  return (
    <>
      <EngineBoundary onError={fail}>
        <Suspense fallback={null}>
          <SignalEngine coarse={coarse} onLost={fail} />
        </Suspense>
      </EngineBoundary>
      <SignalOverlay coarse={coarse} />
    </>
  );
}
