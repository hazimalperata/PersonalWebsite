import { sceneKey, type SignalScene } from "./scenes";
import type { Axis } from "./states";

export interface SignalSnapshot {
  scene: SignalScene;
  key: string;
  /** scroll progress (0 to 1) through the workflow runway: the pipeline fills left to right; null = all lit */
  pipelineProgress: number | null;
  /** date axis of the current project scene (viewport px), or null */
  axis: Axis | null;
  /** where the "Illustration" tag of the pose skeleton goes (viewport px), or null */
  illus: { left: number; top: number } | null;
}

type Listener = () => void;

/**
 * A tiny external store: the engine runs outside React (GSAP ticker), pages and overlays are React. One instance
 * is shared by the provider, the scene hook, the canvas and the overlay.
 */
export function createSignalStore() {
  const initial: SignalScene = { kind: "home" };
  let snap: SignalSnapshot = { scene: initial, key: sceneKey(initial), pipelineProgress: null, axis: null, illus: null };
  const listeners = new Set<Listener>();
  const emit = () => listeners.forEach((l) => l());
  const set = (patch: Partial<SignalSnapshot>) => {
    snap = { ...snap, ...patch };
    emit();
  };
  return {
    subscribe(l: Listener) {
      listeners.add(l);
      return () => {
        listeners.delete(l);
      };
    },
    get: () => snap,
    setScene(scene: SignalScene) {
      const key = sceneKey(scene);
      if (key === snap.key) return;
      // a new scene never inherits the old scene's pipeline fill
      set({ scene, key, axis: null, illus: null, pipelineProgress: null });
    },
    setPipelineProgress(p: number | null) {
      if (p === snap.pipelineProgress) return;
      set({ pipelineProgress: p });
    },
    setAxis(axis: Axis | null) {
      if (JSON.stringify(axis) === JSON.stringify(snap.axis)) return;
      set({ axis });
    },
    setIllus(illus: { left: number; top: number } | null) {
      if (JSON.stringify(illus) === JSON.stringify(snap.illus)) return;
      set({ illus });
    },
    reset() {
      const scene: SignalScene = { kind: "home" };
      snap = { scene, key: sceneKey(scene), pipelineProgress: null, axis: null, illus: null };
      emit();
    },
  };
}

export const signalStore = createSignalStore();
