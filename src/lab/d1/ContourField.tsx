"use client";

import { useEffect, useRef } from "react";
import { useMotionEnabled } from "@/lab/useMotionEnabled";

const VERT = `#version 300 es
in vec2 p;
out vec2 uv;
void main(){ uv = p * .5 + .5; gl_Position = vec4(p, 0., 1.); }`;

/** Topographic isolines from fbm noise; the pointer raises a soft hill. Blueprint blue, premultiplied alpha. */
const FRAG = `#version 300 es
precision highp float;
in vec2 uv;
out vec4 o;
uniform vec2 res;
uniform float t;
uniform vec2 m;
uniform float hill;
float h(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float n(vec2 p){
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3. - 2. * f);
  return mix(mix(h(i), h(i + vec2(1, 0)), f.x), mix(h(i + vec2(0, 1)), h(i + vec2(1, 1)), f.x), f.y);
}
float fbm(vec2 p){
  float a = .5, s = 0.;
  for (int i = 0; i < 5; i++) { s += a * n(p); p = p * 2.02 + vec2(7.3, 1.7); a *= .5; }
  return s;
}
void main(){
  float asp = res.x / res.y;
  vec2 p = (uv - .5) * vec2(asp, 1.) * 2.6;
  float v = fbm(p + vec2(t * .025, -t * .018));
  vec2 d = (uv - m) * vec2(asp, 1.);
  v += hill * .38 * exp(-dot(d, d) * 9.);
  float f = v * 16.;
  float w = max(fwidth(f), 1e-4);
  float minor = 1. - smoothstep(0., 1.4, abs(fract(f - .5) - .5) / w);
  float g = f / 4.;
  float wg = max(fwidth(g), 1e-4);
  float major = 1. - smoothstep(0., 1.9, abs(fract(g - .5) - .5) / wg);
  float a = clamp(minor * .5 + major * .5, 0., 1.) * .26;
  o = vec4(vec3(.122, .31, 1.) * a, a);
}`;

/**
 * Raw WebGL2 contour-line field behind the hero. Pauses when off-screen or the tab is hidden, caps DPR,
 * renders at reduced resolution on coarse pointers, and draws a single static frame under reduced motion.
 */
export function ContourField() {
  const motion = useMotionEnabled();
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl2", { antialias: false, alpha: true, premultipliedAlpha: true, powerPreference: "low-power" });
    if (!gl) return;

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const uRes = gl.getUniformLocation(prog, "res");
    const uT = gl.getUniformLocation(prog, "t");
    const uM = gl.getUniformLocation(prog, "m");
    const uHill = gl.getUniformLocation(prog, "hill");

    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const resize = () => {
      const dpr = coarse ? 0.6 : Math.min(window.devicePixelRatio || 1, 1.5);
      const w = Math.max(2, Math.round(canvas.clientWidth * dpr));
      const h = Math.max(2, Math.round(canvas.clientHeight * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      gl.viewport(0, 0, w, h);
      gl.uniform2f(uRes, w, h);
    };

    let visible = true;
    let raf = 0;
    let running = false;
    const mouse = { tx: 0.62, ty: 0.55, x: 0.62, y: 0.55, hill: 0, target: 0 };
    const start = performance.now();

    const draw = (time: number) => {
      mouse.x += (mouse.tx - mouse.x) * 0.06;
      mouse.y += (mouse.ty - mouse.y) * 0.06;
      mouse.hill += (mouse.target - mouse.hill) * 0.05;
      gl.uniform1f(uT, time);
      gl.uniform2f(uM, mouse.x, mouse.y);
      gl.uniform1f(uHill, mouse.hill);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const loop = () => {
      draw((performance.now() - start) / 1000 + 3);
      raf = requestAnimationFrame(loop);
    };
    const play = () => {
      if (running || !motion || !visible || document.hidden) return;
      running = true;
      raf = requestAnimationFrame(loop);
    };
    const pause = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    resize();
    draw(3);

    const ro = new ResizeObserver(() => {
      resize();
      if (!running) draw(3);
    });
    ro.observe(canvas);

    if (!motion) {
      return () => {
        ro.disconnect();
        gl.deleteProgram(prog);
      };
    }

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) play();
      else pause();
    });
    io.observe(canvas);
    const onVis = () => (document.hidden ? pause() : play());
    document.addEventListener("visibilitychange", onVis);

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.tx = (e.clientX - r.left) / r.width;
      mouse.ty = 1 - (e.clientY - r.top) / r.height;
      mouse.target = e.clientY >= r.top && e.clientY <= r.bottom ? 1 : 0;
    };
    const onLeave = () => {
      mouse.target = 0;
    };
    if (!coarse) {
      window.addEventListener("pointermove", onMove, { passive: true });
      document.documentElement.addEventListener("pointerleave", onLeave);
    }
    play();

    return () => {
      pause();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      gl.deleteProgram(prog);
    };
  }, [motion]);

  return <canvas ref={ref} className="d1-contour" aria-hidden="true" />;
}
