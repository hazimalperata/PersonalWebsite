"use client";

/* eslint-disable react-hooks/immutability -- three.js materials and uniforms are imperative objects mutated every frame */

/**
 * Liquid chrome background: a domain-warped fbm field shaded like brushed metal, written for this prototype.
 * The overall idea (warped noise as a liquid surface, cursor-following highlight) follows React Bits'
 * "Liquid Chrome" (https://reactbits.dev/backgrounds/liquid-chrome, MIT + Commons Clause), but the shader is original.
 */
import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const VERT = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

const FRAG = /* glsl */ `
precision highp float;
uniform float uTime;
uniform vec2 uRes;
uniform vec2 uMouse;
varying vec2 vUv;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}
float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
  for (int i = 0; i < 4; i++) {
    v += a * noise(p);
    p = m * p;
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 asp = vec2(uRes.x / uRes.y, 1.0);
  vec2 uv = (vUv - 0.5) * asp * 1.5;
  float t = uTime * 0.045;

  vec2 q = vec2(fbm(uv + vec2(0.0, t)), fbm(uv + vec2(5.2, 1.3) - t));
  vec2 r = vec2(fbm(uv + 2.6 * q + vec2(1.7, 9.2) + t * 1.4), fbm(uv + 2.6 * q + vec2(8.3, 2.8) - t));
  float f = fbm(uv + 2.6 * r);

  // fake surface normal from the warp vectors
  vec3 n = normalize(vec3((r - 0.5) * 2.2, 0.55));
  vec2 mp = (uMouse - 0.5) * asp * 1.5;
  vec3 L = normalize(vec3(mp - uv * 0.4, 0.55));
  float spec = pow(max(dot(n, L), 0.0), 26.0);
  float rim = pow(1.0 - max(n.z, 0.0), 2.0);

  float ribbon = smoothstep(0.52, 0.98, sin(f * 10.0 + r.x * 5.0 + t * 6.0) * 0.5 + 0.5);
  vec3 base = vec3(0.012, 0.013, 0.018);
  vec3 chrome = vec3(0.50, 0.53, 0.60);
  vec3 irid = 0.5 + 0.5 * cos(6.28318 * (f * 0.8 + vec3(0.0, 0.33, 0.67) + r.y * 0.6));

  vec3 col = base;
  col += chrome * pow(ribbon, 2.6) * 0.1;
  col += irid * ribbon * 0.03 * (0.4 + rim);
  col += vec3(0.85, 0.88, 1.0) * spec * 0.15;
  col += chrome * rim * 0.02;

  float d = length(vUv - vec2(0.62, 0.46));
  col *= mix(0.55, 1.0, smoothstep(1.05, 0.15, d));
  col *= smoothstep(0.0, 0.06, vUv.y) * 0.55 + 0.45; // keep the bottom a bit calmer

  gl_FragColor = vec4(col, 1.0);
  #include <colorspace_fragment>
}
`;

function Field({ pointer }: { pointer: React.RefObject<THREE.Vector2> }) {
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: VERT,
        fragmentShader: FRAG,
        depthTest: false,
        depthWrite: false,
        uniforms: {
          uTime: { value: 0 },
          uRes: { value: new THREE.Vector2(1, 1) },
          uMouse: { value: new THREE.Vector2(0.62, 0.46) },
        },
      }),
    [],
  );
  useEffect(() => () => material.dispose(), [material]);
  useFrame(({ clock, size }, dt) => {
    const u = material.uniforms;
    u.uTime.value = clock.elapsedTime;
    (u.uRes.value as THREE.Vector2).set(size.width, size.height);
    const m = u.uMouse.value as THREE.Vector2;
    const k = 1 - Math.exp(-2.2 * dt);
    m.x += (pointer.current.x - m.x) * k;
    m.y += (pointer.current.y - m.y) * k;
  });
  return (
    <mesh frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
}

export default function ChromeShader({ active }: { active: boolean }) {
  const pointer = useRef(new THREE.Vector2(0.62, 0.46));
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.set(e.clientX / window.innerWidth, 1 - e.clientY / window.innerHeight);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);
  return (
    <Canvas
      dpr={[1, 1.25]}
      frameloop={active ? "always" : "never"}
      gl={{ antialias: false, alpha: false, powerPreference: "high-performance" }}
      style={{ pointerEvents: "none" }}
      aria-hidden
    >
      <Field pointer={pointer} />
    </Canvas>
  );
}
