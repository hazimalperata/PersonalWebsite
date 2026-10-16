"use client";

import { Canvas, useThree } from "@react-three/fiber";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { labFacts } from "@/lab/facts";
import { buildPoints, projects } from "./data";
import { fragmentShader, vertexShader } from "./shaders";
import { buildStates, getLayout, STATE } from "./states";

gsap.registerPlugin(ScrollTrigger);

interface Anchor {
  a: number;
  b: number;
}

/** Scroll position -> a continuous state coordinate (integer part = state, fraction = morph to the next). */
function createScrollMap() {
  let anchors: Anchor[] = [];
  const measure = () => {
    const vh = window.innerHeight;
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-signal]"));
    const list: Array<Anchor & { i: number }> = [];
    for (const el of els) {
      const i = Number(el.dataset.signal);
      const r = el.getBoundingClientRect();
      const top = r.top + window.scrollY;
      const m = Math.min(r.height, vh);
      list.push({ i, a: top + (m - vh) / 2, b: top + r.height - (m + vh) / 2 });
    }
    list.sort((x, y) => x.i - y.i);
    anchors = list;
  };
  const at = (y: number) => {
    const n = anchors.length;
    if (n === 0) return 0;
    if (y <= anchors[0].b) return 0;
    for (let i = 0; i < n - 1; i++) {
      if (y <= anchors[i].b) return i;
      if (y < anchors[i + 1].a) {
        const t = (y - anchors[i].b) / Math.max(1, anchors[i + 1].a - anchors[i].b);
        const e = Math.min(1, Math.max(0, (t - 0.2) / 0.6));
        return i + e;
      }
    }
    return n - 1;
  };
  return { measure, at };
}

interface Built {
  pipe: { xs: number[]; vw: number; vh: number; nodes: Array<[number, number]>; size: number };
  attrs: THREE.BufferAttribute[];
  meta: ReturnType<typeof buildStates>["meta"];
}

function Field({ coarse }: { coarse: boolean }) {
  const { gl, scene, camera, size } = useThree();
  const stride = coarse ? 3 : 1;
  const pts = useMemo(() => buildPoints(stride), [stride]);

  const { geometry, material } = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const n = pts.length;
    const color = new Float32Array(n * 3);
    const seed = new Float32Array(n);
    const proj = new Float32Array(n);
    pts.forEach((p, i) => {
      const c = projects[p.proj].rgb;
      color.set(c, i * 3);
      seed[i] = p.seed;
      proj[i] = p.proj;
    });
    g.setAttribute("aColor", new THREE.BufferAttribute(color, 3));
    g.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));
    g.setAttribute("aProj", new THREE.BufferAttribute(proj, 1));
    const zero = new THREE.BufferAttribute(new Float32Array(n * 3), 3);
    g.setAttribute("position", zero);
    g.setAttribute("aFrom", zero);
    g.setAttribute("aTo", zero);
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
        uMouse: { value: new THREE.Vector2(-1e5, -1e5) },
        uOrbit: { value: 0 },
        uToContact: { value: 0 },
        uA: { value: new THREE.Vector4(3, 40, 1, 0.8) },
        uB: { value: new THREE.Vector4(3, 40, 1, 0.8) },
        uFocus: { value: new THREE.Vector2(-1, -1) },
        uPipeX: { value: -1e5 },
        uIsPipe: { value: new THREE.Vector2(0, 0) },
        uHot: { value: new THREE.Vector3(0, 0, 1) },
        uIsSys: { value: new THREE.Vector2(0, 0) },
      },
    });
    return { geometry: g, material: m };
  }, [pts]);

  const built = useRef<Built | null>(null);
  const curI = useRef(-1);

  // build every state's positions once per size, after the display font is ready (text sampling needs it)
  useEffect(() => {
    let cancelled = false;
    const w = size.width;
    const h = size.height;
    if (!w || !h) return;
    const root = document.querySelector<HTMLElement>("[data-d4-root]");
    const family = (root && getComputedStyle(root).getPropertyValue("--font-sora").trim()) || "sans-serif";
    const texts = labFacts.proof.map((p) => `${p.value}${p.suffix}`);
    const run = () => {
      if (cancelled) return;
      const L = getLayout(w, h, coarse);
      const b = buildStates(pts, L, family, texts);
      built.current = { pipe: { xs: L.pipe.xs, vw: L.vw, vh: L.vh, nodes: L.sys.nodes, size: L.sys.size }, attrs: b.states.map((s) => new THREE.BufferAttribute(s, 3)), meta: b.meta };
      curI.current = -1;
      document.documentElement.dataset.d4Ready = "1";
    };
    const t = window.setTimeout(
      () => {
        const fonts = document.fonts;
        if (fonts && fonts.load) {
          Promise.race([fonts.load(`600 100px ${family}`, "0123456789+"), new Promise((r) => setTimeout(r, 1500))]).then(run, run);
        } else run();
      },
      built.current ? 160 : 0,
    );
    return () => {
      cancelled = true;
      window.clearTimeout(t);
    };
  }, [pts, size.width, size.height, coarse]);

  useEffect(() => {
    const u = material.uniforms;
    const scroll = createScrollMap();
    ScrollTrigger.config({ ignoreMobileResize: true });
    let target = 0;
    const st = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        target = scroll.at(self.scroll());
      },
      onRefresh: (self) => {
        scroll.measure();
        target = scroll.at(self.scroll());
      },
    });
    scroll.measure();
    target = scroll.at(window.scrollY);

    let s = target;
    let time = 0;
    let orbit = 0;
    const mouse = new THREE.Vector2(-1e5, -1e5);
    const mouseTarget = new THREE.Vector2(-1e5, -1e5);
    const root = document.querySelector<HTMLElement>("[data-d4-root]");
    let lastTl = -1;
    const ai = document.querySelector<HTMLElement>("[data-ai]");
    const sys = document.querySelector<HTMLElement>("[data-sys]");
    const span = { aiTop: 0, aiH: 1, sysTop: 0, sysH: 1 };
    const measureAi = () => {
      if (ai) {
        const r = ai.getBoundingClientRect();
        span.aiTop = r.top + window.scrollY;
        span.aiH = r.height;
      }
      if (sys) {
        const r = sys.getBoundingClientRect();
        span.sysTop = r.top + window.scrollY;
        span.sysH = r.height;
      }
    };
    measureAi();
    ScrollTrigger.addEventListener("refresh", measureAi);
    let aiP = 0;
    let lastAi = "";
    let lastSys = -1;
    const hot = new THREE.Vector2(0, 0);
    let hotInit = false;

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      mouseTarget.set(e.clientX - window.innerWidth / 2, window.innerHeight / 2 - e.clientY);
    };
    const onLeave = () => mouseTarget.set(-1e5, -1e5);
    if (!coarse) {
      window.addEventListener("pointermove", onMove, { passive: true });
      document.documentElement.addEventListener("pointerleave", onLeave);
    }

    const tick = (_t: number, deltaMs: number) => {
      const b = built.current;
      if (!b) return;
      const dt = Math.min(deltaMs, 50) / 1000;
      time += dt;
      const diff = target - s;
      s = Math.abs(diff) < 1e-4 ? target : s + diff * (1 - Math.exp(-dt * 5.5));
      const last = STATE.count - 1;
      const i = Math.min(last - 1, Math.max(0, Math.floor(s)));
      const mix = Math.min(1, Math.max(0, s - i));
      if (i !== curI.current) {
        curI.current = i;
        geometry.setAttribute("aFrom", b.attrs[i]);
        geometry.setAttribute("aTo", b.attrs[i + 1]);
        const A = b.meta[i];
        const B = b.meta[i + 1];
        u.uA.value.set(A.size, A.noise, A.repel, A.alpha);
        u.uB.value.set(B.size, B.noise, B.repel, B.alpha);
        u.uFocus.value.set(A.focus, B.focus);
        u.uToContact.value = i + 1 === STATE.contact ? 1 : 0;
        u.uIsPipe.value.set(i === STATE.pipe ? 1 : 0, i + 1 === STATE.pipe ? 1 : 0);
        u.uIsSys.value.set(i === STATE.sys ? 1 : 0, i + 1 === STATE.sys ? 1 : 0);
      }
      if (i + 1 === STATE.contact && mix > 0.5) orbit += dt * 0.07;
      u.uOrbit.value = orbit;
      u.uMix.value = mix;
      u.uTime.value = time;
      u.uPx.value = gl.getPixelRatio();
      mouse.lerp(mouseTarget, 1 - Math.exp(-dt * 10));
      u.uMouse.value.copy(mouse);
      const vhNow = window.innerHeight;
      if (ai) {
        const raw = Math.min(1, Math.max(0, (window.scrollY - span.aiTop) / Math.max(1, span.aiH - vhNow)));
        aiP += (raw - aiP) * (1 - Math.exp(-dt * 6));
        const xs = b.pipe.xs;
        const x0 = xs[0] - 70;
        const px = x0 + (xs[3] + 70 - x0) * aiP;
        u.uPipeX.value = px - b.pipe.vw / 2;
        const key = [0, 1, 2, 3].map((n) => Math.min(1, Math.max(0, (px - xs[n]) / 90 + 0.5)).toFixed(2)).join(",");
        if (key !== lastAi) {
          lastAi = key;
          key.split(",").forEach((v, n) => ai.style.setProperty("--on" + n, v));
        }
      }
      if (sys) {
        const raw = Math.min(1, Math.max(0, (window.scrollY - span.sysTop) / Math.max(1, span.sysH - vhNow)));
        const idx = Math.min(4, Math.floor(Math.min(0.999, raw) * 5));
        const nd = b.pipe.nodes[idx];
        const tx = nd[0] - b.pipe.vw / 2;
        const ty = b.pipe.vh / 2 - nd[1];
        if (!hotInit) {
          hot.set(tx, ty);
          hotInit = true;
        }
        hot.x += (tx - hot.x) * (1 - Math.exp(-dt * 5));
        hot.y += (ty - hot.y) * (1 - Math.exp(-dt * 5));
        u.uHot.value.set(hot.x, hot.y, b.pipe.size * 0.62);
        if (idx !== lastSys) {
          lastSys = idx;
          sys.dataset.active = String(idx);
        }
      }
      if (root) {
        // presence of the timeline overlays (lane labels, year ticks)
        const tl = Math.max(0, 1 - Math.abs(s - STATE.timeline) * 1.7);
        const q = Math.round(tl * 100) / 100;
        if (q !== lastTl) {
          lastTl = q;
          root.style.setProperty("--tl", String(q));
        }
      }
      gl.render(scene, camera);
    };
    gsap.ticker.add(tick);
    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener("load", onResize);
    return () => {
      gsap.ticker.remove(tick);
      st.kill();
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("load", onResize);
      ScrollTrigger.removeEventListener("refresh", measureAi);
    };
  }, [coarse, geometry, material, gl, scene, camera]);

  useEffect(
    () => () => {
      geometry.dispose();
      material.dispose();
    },
    [geometry, material],
  );

  return <points geometry={geometry} material={material} frustumCulled={false} />;
}

export function SignalField({ coarse }: { coarse: boolean }) {
  return (
    <div className="d4-canvas" aria-hidden="true">
      <Canvas
        orthographic
        camera={{ position: [0, 0, 10], near: 0.1, far: 100, zoom: 1 }}
        dpr={[1, coarse ? 1 : 1.5]}
        frameloop="never"
        gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
      >
        <Field coarse={coarse} />
      </Canvas>
    </div>
  );
}
