"use client";

import { Canvas, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useSyncExternalStore } from "react";
import * as THREE from "three";
import { gsap, registerGsap, ScrollTrigger } from "@/lib/motion";
import { anchoredBox, elementBox, signalSelector } from "./dom";
import { buildPoints, laneIndex, laneMeta } from "./points";
import { blend, buildTrack, lerpMeta, measureAnchors, pipelineShowing, playheadAt, type Anchor, type Track } from "./scenes";
import type { SignalScene } from "./scenes";
import { fragmentShader, vertexShader } from "./shaders";
import { clusterBox, getLayout, type Layout, type StateMeta } from "./states";
import { signalStore } from "./store";

registerGsap();

/** Time (s) a scene change takes to morph; each point leaves slightly after the previous one on top of this. */
const MORPH_SECONDS = 1.3;

interface Pending {
  track: Track;
  key: string;
  L: Layout;
  scene: SignalScene;
}

function readFamily(): string {
  const host = document.querySelector<HTMLElement>("[data-signal-fonts]") ?? document.body;
  return getComputedStyle(host).getPropertyValue("--font-sora").trim() || "sans-serif";
}

/** Proof numbers are sampled from the font that is actually on screen, so wait for it (but never for long). */
async function fontsReady(family: string): Promise<void> {
  const fonts = document.fonts;
  if (!fonts) return;
  const settle = (async () => {
    try {
      await fonts.load(`600 100px ${family}`, "0123456789+.,");
      await fonts.ready;
    } catch {
      /* the fallback face is good enough */
    }
  })();
  await Promise.race([settle, new Promise((r) => setTimeout(r, 1500))]);
}

const damp = (rate: number, dt: number) => 1 - Math.exp(-dt * rate);
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/** 1 when `key` is on screen, falling to 0 as the playhead moves away (`reach` = how far the fade extends). */
function presence(keys: string[], i0: number, i1: number, mix: number, key: string, reach: number): number {
  if (keys[i0] === key && keys[i1] === key) return 1;
  const dist = keys[i0] === key ? mix : keys[i1] === key ? 1 - mix : 1;
  return Math.max(0, 1 - dist * reach);
}

function Field({ coarse, onLost }: { coarse: boolean; onLost: () => void }) {
  const { gl, scene: three, camera, size } = useThree();
  const pts = useMemo(() => buildPoints(coarse ? 3 : 1), [coarse]);
  const seeds = useMemo(() => Float32Array.from(pts, (p) => p.seed), [pts]);
  const snap = useSyncExternalStore(signalStore.subscribe, signalStore.get, signalStore.get);
  const pending = useRef<Pending | null>(null);
  const built = useRef(false);

  const { geometry, material, fromAttr, toAttr } = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const n = pts.length;
    const color = new Float32Array(n * 3);
    const lane = new Float32Array(n);
    pts.forEach((p, i) => {
      color.set(laneMeta[p.lane].rgb, i * 3);
      lane[i] = p.lane;
    });
    g.setAttribute("aColor", new THREE.BufferAttribute(color, 3));
    g.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
    g.setAttribute("aLane", new THREE.BufferAttribute(lane, 1));
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(n * 3), 3));
    const fromAttr = new THREE.BufferAttribute(new Float32Array(n * 3), 3).setUsage(THREE.DynamicDrawUsage);
    const toAttr = new THREE.BufferAttribute(new Float32Array(n * 3), 3).setUsage(THREE.DynamicDrawUsage);
    g.setAttribute("aFrom", fromAttr);
    g.setAttribute("aTo", toAttr);
    const m = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      uniforms: {
        uMix: { value: 0 },
        uTime: { value: 0 },
        uPx: { value: 1 },
        uFade: { value: 0 },
        uMouse: { value: new THREE.Vector2(-1e5, -1e5) },
        uOrbit: { value: 0 },
        uOrbitSel: { value: new THREE.Vector2(0, 0) },
        uA: { value: new THREE.Vector4(3, 40, 1, 0.8) },
        uB: { value: new THREE.Vector4(3, 40, 1, 0.8) },
        uFocus: { value: new THREE.Vector2(-1, -1) },
        uIsPipe: { value: new THREE.Vector2(0, 0) },
        uHot: { value: new THREE.Vector3(0, 0, 1e5) },
      },
    });
    return { geometry: g, material: m, fromAttr, toAttr };
  }, [pts, seeds]);

  // Build the active scene's track whenever the scene or the size changes (and when the marked elements resize).
  useEffect(() => {
    const w = size.width;
    const h = size.height;
    if (!w || !h) return;
    let cancelled = false;
    let timer = 0;
    const scene = snap.scene;
    const key = snap.key;
    const run = async () => {
      const family = readFamily();
      if (scene.kind === "home" && (scene.proof?.length ?? 0) > 0) await fontsReady(family);
      if (cancelled) return;
      const L = getLayout(w, h, coarse, {
        work: scene.kind === "home" ? (scene.work ?? []).map((_, i) => anchoredBox(signalSelector("work", i))) : [],
        step: scene.kind === "home" ? [0, 1, 2, 3].map((i) => anchoredBox(signalSelector("step", i))) : [],
      });
      const track = buildTrack(scene, {
        pts,
        L,
        family,
        header: elementBox(signalSelector("header")),
        target: elementBox(signalSelector("target")),
      });
      pending.current = { track, key, L, scene };
    };
    const schedule = (delay: number) => {
      window.clearTimeout(timer);
      timer = window.setTimeout(run, delay);
    };
    schedule(built.current ? 120 : 0);
    built.current = true;
    let ro: ResizeObserver | undefined;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(() => schedule(160));
      const sel = (["header", "target", "work", "step"] as const).map((k) => signalSelector(k)).join(", ");
      for (const el of document.querySelectorAll(sel)) ro.observe(el);
    }
    // page height changes (images, fonts) move anchored boxes: ScrollTrigger refreshes on those
    const onRefresh = () => schedule(160);
    ScrollTrigger.addEventListener("refresh", onRefresh);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      ro?.disconnect();
      ScrollTrigger.removeEventListener("refresh", onRefresh);
    };
  }, [pts, size.width, size.height, coarse, snap.scene, snap.key]);

  // The ticker: scroll -> playhead, playhead -> uniforms, render. Lenis is driven by the same ticker (provider).
  useEffect(() => {
    const u = material.uniforms;
    const overlay = () => document.querySelector<HTMLElement>("[data-signal-overlay]");
    const S = {
      track: null as Track | null,
      key: "",
      L: null as Layout | null,
      scene: { kind: "home" } as SignalScene,
      order: [0],
      anchors: [] as Anchor[],
      j: 0,
      jTarget: 0,
      gen: 0,
      sig: "",
      clock: 0,
      trackStart: 0,
      trans: null as { t: number } | null,
      mix: 0,
      from: new Float32Array(0) as Float32Array,
      to: new Float32Array(0) as Float32Array,
      metaA: null as StateMeta | null,
      metaB: null as StateMeta | null,
      orbit: 0,
      fade: 0,
      pres: { tl: 0, axis: 0, illus: 0 },
      sent: { tl: -1, axis: -1, illus: -1 },
      hot: { x: 0, y: 0, lr: Math.log(4000), init: false },
    };

    const setMeta = (A: StateMeta, B: StateMeta) => {
      S.metaA = A;
      S.metaB = B;
      u.uA.value.set(A.size, A.noise, A.repel, A.alpha);
      u.uB.value.set(B.size, B.noise, B.repel, B.alpha);
      u.uFocus.value.set(A.focus, B.focus);
      u.uIsPipe.value.set(A.pipe ? 1 : 0, B.pipe ? 1 : 0);
      u.uOrbitSel.value.set(A.orbit ? 1 : 0, B.orbit ? 1 : 0);
    };
    const loadFrom = (arr: Float32Array) => {
      fromAttr.array.set(arr);
      fromAttr.needsUpdate = true;
      S.from = arr;
    };
    const loadTo = (arr: Float32Array) => {
      toAttr.array.set(arr);
      toAttr.needsUpdate = true;
      S.to = arr;
    };

    const measure = () => {
      const t = S.track;
      if (!t || t.drive !== "home") {
        S.anchors = [];
        S.order = t ? t.keys.map((_, i) => i) : [0];
        return;
      }
      const els = Array.from(document.querySelectorAll<HTMLElement>("[data-signal]"));
      S.anchors = measureAnchors(t.keys, els, window.innerHeight, window.scrollY);
      S.order = S.anchors.length ? S.anchors.map((a) => a.state) : [0];
      S.jTarget = playheadAt(S.anchors, window.scrollY);
    };

    const resolve = () => {
      const n = S.order.length;
      const jj = Math.min(n - 1, Math.max(0, S.j));
      const k = Math.min(Math.max(n - 2, 0), Math.floor(jj));
      return { i0: S.order[k], i1: S.order[Math.min(k + 1, n - 1)], mix: n > 1 ? jj - k : 0 };
    };

    const applyTrack = (p: Pending) => {
      const prev = S.track;
      const changed = p.key !== S.key;
      const hadScene = prev !== null;
      // snapshot of what is on screen, before the old track goes away
      const snapshot =
        hadScene && changed && S.metaA && S.metaB
          ? {
              pos: blend(S.from, S.to, S.mix, seeds, { angle: S.orbit, from: !!S.metaA.orbit, to: !!S.metaB.orbit }),
              meta: lerpMeta(S.metaA, S.metaB, S.mix),
            }
          : null;
      S.track = p.track;
      S.key = p.key;
      S.L = p.L;
      S.scene = p.scene;
      S.gen++;
      S.sig = "";
      if (changed) S.trackStart = S.clock;
      measure();
      S.j = changed ? (p.track.drive === "home" ? S.jTarget : 0) : Math.min(S.j, Math.max(0, S.order.length - 1));
      signalStore.setAxis(p.track.axis);
      const rommer = p.scene.kind === "home" ? (p.scene.work ?? []).findIndex((x) => x.lane === "rommer") : -1;
      if (rommer >= 0) {
        const b = clusterBox(p.L, rommer, "rommer", pts.filter((q) => q.lane === laneIndex("rommer")).length);
        signalStore.setIllus({ left: b.cx, top: b.y + b.h + 10 });
      } else signalStore.setIllus(null);
      if (snapshot) {
        const { i0, i1, mix } = resolve();
        const m0 = p.track.meta[i0];
        const m1 = p.track.meta[i1];
        const target = blend(p.track.states[i0], p.track.states[i1], mix, seeds, { angle: S.orbit, from: !!m0.orbit, to: !!m1.orbit });
        loadFrom(snapshot.pos);
        loadTo(target);
        setMeta(snapshot.meta, { ...lerpMeta(m0, m1, mix), orbit: false });
        S.mix = 0;
        S.trans = { t: 0 };
        S.sig = `trans:${S.gen}`;
      }
    };

    ScrollTrigger.config({ ignoreMobileResize: true });
    const st = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        if (S.track?.drive === "home") S.jTarget = playheadAt(S.anchors, self.scroll());
      },
      onRefresh: measure,
    });

    const mouse = new THREE.Vector2(-1e5, -1e5);
    const mouseTarget = new THREE.Vector2(-1e5, -1e5);
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      mouseTarget.set(e.clientX - window.innerWidth / 2, window.innerHeight / 2 - e.clientY);
    };
    const onLeave = () => mouseTarget.set(-1e5, -1e5);
    if (!coarse) {
      window.addEventListener("pointermove", onMove, { passive: true });
      document.documentElement.addEventListener("pointerleave", onLeave);
    }
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);

    const tick = (_t: number, deltaMs: number) => {
      if (document.hidden) return;
      const dt = Math.min(deltaMs, 50) / 1000;
      S.clock += dt;
      const p = pending.current;
      if (p) {
        pending.current = null;
        applyTrack(p);
      }
      const track = S.track;
      if (!track) return;

      // playhead
      const sy = window.scrollY;
      if (track.drive === "home") {
        S.j += (S.jTarget - S.j) * damp(5.5, dt);
        if (Math.abs(S.jTarget - S.j) < 1e-4) S.j = S.jTarget;
      } else if (track.drive === "header" && track.header) {
        const target = clamp01(sy / (0.75 * (track.header.y + track.header.h)));
        S.j += (target - S.j) * damp(5.5, dt);
      } else if (track.drive === "time" && track.auto) {
        const k = clamp01((S.clock - S.trackStart - track.auto.delay) / track.auto.duration);
        S.j = k * k * (3 - 2 * k);
      } else if (track.drive === "fixed") {
        S.j = 0;
      }

      let i0 = 0;
      let i1 = 0;
      let mix = 0;
      if (S.trans) {
        S.trans.t += dt / MORPH_SECONDS;
        mix = Math.min(1, S.trans.t);
        if (S.trans.t >= 1) {
          S.trans = null;
          S.sig = "";
        }
      }
      if (!S.trans) {
        ({ i0, i1, mix } = resolve());
        const sig = `${S.gen}:${i0}:${i1}`;
        if (sig !== S.sig) {
          S.sig = sig;
          loadFrom(track.states[i0]);
          loadTo(track.states[i1]);
          setMeta(track.meta[i0], track.meta[i1]);
        }
      }
      S.mix = mix;
      // a highlighted step never outlives the pipeline state
      if (!S.trans && track.drive === "home" && signalStore.get().pipelineFocus !== null && !pipelineShowing(track.keys, i0, i1)) {
        signalStore.setPipelineFocus(null);
      }

      // orbit (contact ring)
      const A = S.metaA;
      const B = S.metaB;
      if (A && B && ((A.orbit && mix < 0.5) || (B.orbit && mix > 0.5))) S.orbit += dt * 0.07;
      u.uOrbit.value = S.orbit;
      u.uMix.value = mix;
      u.uTime.value += dt;
      u.uPx.value = gl.getPixelRatio();
      S.fade = Math.min(1, S.fade + dt * 1.1);
      u.uFade.value = S.fade * S.fade * (3 - 2 * S.fade);
      mouse.lerp(mouseTarget, 1 - Math.exp(-dt * 10));
      u.uMouse.value.copy(mouse);

      // the focused pipeline node glows; with no focus every node is lit
      if (S.L) {
        const f = signalStore.get().pipelineFocus;
        const { xs, ys, size: nodeSize } = S.L.pipe;
        if (f !== null && xs[f] !== undefined) {
          const tx = xs[f] - S.L.vw / 2;
          const ty = S.L.vh / 2 - ys[f];
          if (!S.hot.init) {
            S.hot.x = tx;
            S.hot.y = ty;
            S.hot.init = true;
          }
          S.hot.x += (tx - S.hot.x) * damp(7, dt);
          S.hot.y += (ty - S.hot.y) * damp(7, dt);
          S.hot.lr += (Math.log(nodeSize * 0.62) - S.hot.lr) * damp(7, dt);
        } else {
          S.hot.lr += (Math.log(4000) - S.hot.lr) * damp(4, dt);
        }
        u.uHot.value.set(S.hot.x, S.hot.y, Math.exp(S.hot.lr));
      }

      // overlay layers follow the playhead
      const ov = overlay();
      if (ov) {
        const settled = !S.trans;
        const workIdx = S.scene.kind === "home" ? (S.scene.work ?? []).findIndex((w) => w.lane === "rommer") : -1;
        const want = {
          tl: settled && track.drive === "home" ? presence(track.keys, i0, i1, mix, "timeline", 1.7) : 0,
          axis: settled && track.drive === "header" && track.axis ? presence(track.keys, i0, i1, mix, "timeline", 1.4) : 0,
          illus: settled && workIdx >= 0 ? presence(track.keys, i0, i1, mix, `work:${workIdx}`, 1.7) : 0,
        };
        for (const k of ["tl", "axis", "illus"] as const) {
          S.pres[k] += (want[k] - S.pres[k]) * damp(8, dt);
          const q = Math.round(S.pres[k] * 100) / 100;
          if (q !== S.sent[k]) {
            S.sent[k] = q;
            ov.style.setProperty(`--${k}`, String(q));
          }
        }
      }
      gl.render(three, camera);
    };
    gsap.ticker.add(tick);
    return () => {
      gsap.ticker.remove(tick);
      st.kill();
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("load", onLoad);
    };
  }, [coarse, pts, geometry, material, fromAttr, toAttr, seeds, gl, three, camera]);

  useEffect(() => {
    const el = gl.domElement;
    const lost = (e: Event) => {
      e.preventDefault();
      onLost();
    };
    el.addEventListener("webglcontextlost", lost);
    return () => el.removeEventListener("webglcontextlost", lost);
  }, [gl, onLost]);

  useEffect(
    () => () => {
      geometry.dispose();
      material.dispose();
    },
    [geometry, material],
  );

  return <points geometry={geometry} material={material} frustumCulled={false} />;
}

export default function SignalEngine({ coarse, onLost }: { coarse: boolean; onLost: () => void }) {
  return (
    <div
      aria-hidden="true"
      data-signal-canvas
      style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100lvh", zIndex: 0, pointerEvents: "none" }}
    >
      <Canvas
        orthographic
        camera={{ position: [0, 0, 10], near: 0.1, far: 100, zoom: 1 }}
        dpr={[1, coarse ? 1 : 1.5]}
        frameloop="never"
        gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
      >
        <Field coarse={coarse} onLost={onLost} />
      </Canvas>
    </div>
  );
}
