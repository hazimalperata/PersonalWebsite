"use client";

import { useEffect } from "react";
import { sceneKey, type SignalScene } from "./scenes";
import { signalStore } from "./store";

/**
 * Called by a page-level client component. Sets the active scene; the engine morphs from the previous one.
 * The scene is compared by value, so passing a fresh object every render is fine.
 */
export function useSignalScene(scene: SignalScene): void {
  const key = sceneKey(scene);
  useEffect(() => {
    signalStore.setScene(JSON.parse(key) as SignalScene);
  }, [key]);
}
