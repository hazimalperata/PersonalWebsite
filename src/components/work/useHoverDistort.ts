'use client';

import { useEffect, useRef, type PointerEvent, type RefObject } from 'react';
import type {
  PlaneGeometry,
  ShaderMaterial,
  Texture,
  WebGLRenderer,
} from 'three';
import { distortFragment } from './distort.frag';
import { distortVertex } from './distort.vert';

const FADE_MS = 300;
const MAX_DPR = 1.5;
const SPEED_FOR_FULL_PX_S = 1500;
const IDLE_MS = 80;

interface Session {
  readonly disposed: boolean;
  reenter(): void;
  leave(): void;
  move(clientX: number, clientY: number): void;
  dispose(): void;
}

/** At most one WebGL context for the whole page: a new hover evicts the previous one. */
let activeSession: Session | null = null;

function createSession(
  wrapper: HTMLElement,
  src: string,
  startX: number,
  startY: number,
): Session {
  let disposed = false;
  let leaving = false;
  let raf = 0;
  let timer: ReturnType<typeof setTimeout> | undefined;
  let cleanup: (() => void) | null = null;
  let canvasEl: HTMLCanvasElement | null = null;

  let target = 0;
  let lastX = startX;
  let lastY = startY;
  let lastMoveAt = performance.now();
  const mouse = { x: 0.5, y: 0.5 };

  function fadeTo(opacity: number) {
    if (canvasEl) canvasEl.style.opacity = String(opacity);
  }

  const session: Session = {
    get disposed() {
      return disposed;
    },
    reenter() {
      leaving = false;
      clearTimeout(timer);
      timer = undefined;
      fadeTo(1);
    },
    leave() {
      leaving = true;
      target = 0;
      if (!canvasEl) return; // still loading: init() disposes itself once it sees `leaving`
      fadeTo(0);
      clearTimeout(timer);
      timer = setTimeout(() => session.dispose(), FADE_MS);
    },
    move(clientX, clientY) {
      const now = performance.now();
      const rect = wrapper.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      const dt = Math.max(8, now - lastMoveAt);
      const speed = (Math.hypot(clientX - lastX, clientY - lastY) / dt) * 1000;
      target = Math.min(1, speed / SPEED_FOR_FULL_PX_S);
      lastX = clientX;
      lastY = clientY;
      lastMoveAt = now;
      mouse.x = (clientX - rect.left) / rect.width;
      mouse.y = 1 - (clientY - rect.top) / rect.height;
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      clearTimeout(timer);
      cancelAnimationFrame(raf);
      cleanup?.();
      cleanup = null;
      if (activeSession === session) activeSession = null;
    },
  };

  async function init() {
    let texture: Texture | undefined;
    let renderer: WebGLRenderer | undefined;
    let geometry: PlaneGeometry | undefined;
    let material: ShaderMaterial | undefined;
    let canvas: HTMLCanvasElement | undefined;

    // Set before any fallible work so a throw anywhere below still releases what exists so far.
    cleanup = () => {
      geometry?.dispose();
      material?.dispose();
      texture?.dispose();
      if (renderer) {
        renderer.dispose();
        renderer.forceContextLoss();
      }
      canvas?.remove();
      canvasEl = null;
    };

    try {
      const THREE = await import('three');
      if (disposed || leaving) return session.dispose();

      texture = await new THREE.TextureLoader().loadAsync(src);
      if (disposed || leaving) return session.dispose();
      texture.colorSpace = THREE.SRGBColorSpace;
      const image = texture.image as HTMLImageElement;
      const imageAspect = image.width / image.height;

      canvas = document.createElement('canvas');
      canvas.setAttribute('aria-hidden', 'true');
      canvas.className = 'pointer-events-none absolute inset-0 h-full w-full';
      canvas.style.opacity = '0';
      canvas.style.transition = `opacity ${FADE_MS}ms var(--ease-out, ease-out)`;

      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: false,
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, MAX_DPR));

      const uniforms = {
        uTex: { value: texture },
        uTime: { value: 0 },
        uStrength: { value: 0 },
        uMouse: { value: new THREE.Vector2(0.5, 0.5) },
        uScale: { value: new THREE.Vector2(1, 1) },
      };
      geometry = new THREE.PlaneGeometry(2, 2);
      material = new THREE.ShaderMaterial({
        uniforms,
        vertexShader: distortVertex,
        fragmentShader: distortFragment,
      });
      const scene = new THREE.Scene();
      scene.add(new THREE.Mesh(geometry, material));
      const camera = new THREE.Camera();
      const gl = renderer;

      let width = 0;
      let height = 0;
      const resize = () => {
        const w = wrapper.clientWidth;
        const h = wrapper.clientHeight;
        if (w === width && h === height) return;
        width = w;
        height = h;
        gl.setSize(w, h, false);
        // Same maths as CSS object-cover: shrink the sampled window on the axis that overflows.
        const wrapperAspect = w / h;
        if (imageAspect > wrapperAspect)
          uniforms.uScale.value.set(wrapperAspect / imageAspect, 1);
        else uniforms.uScale.value.set(1, imageAspect / wrapperAspect);
      };

      let strength = 0;
      let last = performance.now();
      const frame = (now: number) => {
        raf = requestAnimationFrame(frame);
        const dt = Math.max(0, Math.min(0.05, (now - last) / 1000));
        last = now;
        if (performance.now() - lastMoveAt > IDLE_MS) target = 0;
        strength += (target - strength) * (1 - Math.exp(-dt * 6));
        resize();
        uniforms.uTime.value += dt;
        uniforms.uStrength.value = strength;
        uniforms.uMouse.value.set(mouse.x, mouse.y);
        gl.render(scene, camera);
      };

      canvasEl = canvas;
      wrapper.appendChild(canvas);
      resize();
      gl.render(scene, camera);
      void canvas.offsetWidth; // commit opacity 0 so the fade-in actually transitions
      fadeTo(1);
      raf = requestAnimationFrame(frame);
    } catch {
      session.dispose();
    }
  }

  void init();
  return session;
}

/**
 * Hover distortion controller. Returns the wrapper ref and the pointer handlers to spread onto it.
 * The texture is read from the already-loaded <img> (`currentSrc`), so the optimized, right-sized
 * and cached response is reused instead of fetching the full-resolution original.
 * Does nothing unless `enabled`, the primary pointer is fine (mouse/pen) and the event is not touch.
 */
export function useHoverDistort(
  imgRef: RefObject<HTMLImageElement | null>,
  fallbackSrc: string,
  enabled: boolean,
) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const sessionRef = useRef<Session | null>(null);

  useEffect(
    () => () => {
      sessionRef.current?.dispose();
    },
    [],
  );

  const onPointerEnter = (event: PointerEvent<HTMLDivElement>) => {
    if (!enabled || event.pointerType === 'touch') return;
    if (!window.matchMedia('(pointer: fine)').matches) return;
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const current = sessionRef.current;
    if (current && !current.disposed) {
      current.reenter();
      current.move(event.clientX, event.clientY);
      return;
    }
    activeSession?.dispose();
    const img = imgRef.current;
    const textureSrc = img?.currentSrc || img?.src || fallbackSrc;
    const session = createSession(
      wrapper,
      textureSrc,
      event.clientX,
      event.clientY,
    );
    sessionRef.current = session;
    activeSession = session;
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    sessionRef.current?.move(event.clientX, event.clientY);
  };

  const onPointerLeave = () => {
    sessionRef.current?.leave();
  };

  return {
    wrapperRef,
    handlers: { onPointerEnter, onPointerMove, onPointerLeave },
  };
}
