"use client";

/* eslint-disable react-hooks/immutability -- three.js materials and uniforms are imperative objects mutated every frame */

/**
 * The device sequence: one R3F scene. The phone is built from geometry (extruded rounded body, bezel, glass,
 * screen), lit by generated lightformers (no HDR download). `progress.current.value` (0..1, damped by the
 * parent) drives every transform; nothing here owns scroll state.
 */
import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { drawPoseScreen } from "./pose";
import { easeInOut, lerp, seg } from "./gsap";

export interface StageProgress {
  current: { target: number; value: number };
}

interface Props {
  progress: StageProgress;
  coarse: boolean;
  imageUrls: { dremly: string[]; posme: string[]; mobile: string; seller: string };
  onReady: (invalidate: () => void) => void;
}

/* ---------------------------------------------------------------- helpers */

function roundedRect(w: number, h: number, r: number): THREE.Shape {
  const s = new THREE.Shape();
  const x = -w / 2;
  const y = -h / 2;
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y);
  s.absarc(x + w - r, y + r, r, -Math.PI / 2, 0, false);
  s.lineTo(x + w, y + h - r);
  s.absarc(x + w - r, y + h - r, r, 0, Math.PI / 2, false);
  s.lineTo(x + r, y + h);
  s.absarc(x + r, y + h - r, r, Math.PI / 2, Math.PI, false);
  s.lineTo(x, y + r);
  s.absarc(x + r, y + r, r, Math.PI, Math.PI * 1.5, false);
  return s;
}

function roundedPlane(w: number, h: number, r: number): THREE.ShapeGeometry {
  const g = new THREE.ShapeGeometry(roundedRect(w, h, r), 12);
  const pos = g.attributes.position;
  const uv = g.attributes.uv;
  for (let i = 0; i < pos.count; i++) uv.setXY(i, (pos.getX(i) + w / 2) / w, (pos.getY(i) + h / 2) / h);
  return g;
}

/** Cover-fit of an image onto a surface: returns [repeatX, repeatY, offsetX, offsetY]. */
function coverFit(image: { width: number; height: number }, surfaceAspect: number): THREE.Vector4 {
  const ta = image.width / image.height;
  if (ta > surfaceAspect) {
    const rx = surfaceAspect / ta;
    return new THREE.Vector4(rx, 1, (1 - rx) / 2, 0);
  }
  const ry = ta / surfaceAspect;
  return new THREE.Vector4(1, ry, 0, (1 - ry) / 2);
}

const SCREEN_W = 0.9;
const SCREEN_H = 1.99;

const SCREEN_VERT = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;
const SCREEN_FRAG = /* glsl */ `
uniform sampler2D uA;
uniform sampler2D uB;
uniform vec4 uRA;
uniform vec4 uRB;
uniform float uMix;
uniform float uEnd;
varying vec2 vUv;
void main() {
  vec3 a = texture2D(uA, vUv * uRA.xy + uRA.zw).rgb;
  vec3 b = texture2D(uB, vUv * uRB.xy + uRB.zw).rgb;
  vec3 c = mix(a, b, uMix);
  vec3 dark = vec3(0.0021, 0.0021, 0.0030);
  c = mix(c, dark, uEnd);
  gl_FragColor = vec4(c, 1.0);
  #include <colorspace_fragment>
}
`;

const pointer = { x: 0, y: 0 };

/* ------------------------------------------------------------------ Scene */

function Stage({ progress, coarse, imageUrls, onReady }: Props) {
  const { size, invalidate } = useThree();
  useEffect(() => onReady(invalidate), [invalidate, onReady]);

  useEffect(() => {
    if (coarse) return;
    const move = (e: PointerEvent) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, [coarse]);

  const urls = useMemo(
    () => [...imageUrls.dremly, ...imageUrls.posme, imageUrls.mobile, imageUrls.seller],
    [imageUrls],
  );
  const textures = useTexture(urls) as THREE.Texture[];

  // Screen sources: d0 d1 d2 p0 p1 rommer
  const rommer = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 450;
    canvas.height = 1000;
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
    return { canvas, tex };
  }, []);
  useEffect(() => () => rommer.tex.dispose(), [rommer]);

  const screenAspect = SCREEN_W / SCREEN_H;
  const sources = useMemo(() => {
    const phoneTex = textures.slice(0, 5);
    phoneTex.forEach((t) => {
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = 8;
      t.needsUpdate = true;
    });
    const list = [...phoneTex.map((t) => ({ tex: t, fit: coverFit(t.image as HTMLImageElement, screenAspect) })),
      { tex: rommer.tex, fit: new THREE.Vector4(1, 1, 0, 0) }];
    return list;
  }, [textures, rommer, screenAspect]);

  const wide = useMemo(() => {
    const mobile = textures[5];
    const seller = textures[6];
    [mobile, seller].forEach((t) => {
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = 8;
      t.needsUpdate = true;
    });
    const a = (t: THREE.Texture) => (t.image as HTMLImageElement).width / (t.image as HTMLImageElement).height;
    return { mobile, seller, ma: a(mobile), sa: a(seller) };
  }, [textures]);

  const screenMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: SCREEN_VERT,
        fragmentShader: SCREEN_FRAG,
        toneMapped: false,
        uniforms: {
          uA: { value: null },
          uB: { value: null },
          uRA: { value: new THREE.Vector4(1, 1, 0, 0) },
          uRB: { value: new THREE.Vector4(1, 1, 0, 0) },
          uMix: { value: 0 },
          uEnd: { value: 0 },
        },
      }),
    [],
  );
  useEffect(() => () => screenMat.dispose(), [screenMat]);

  const geo = useMemo(() => {
    const body = new THREE.ExtrudeGeometry(roundedRect(1.0, 2.1, 0.17), {
      depth: 0.07,
      bevelEnabled: true,
      bevelThickness: 0.02,
      bevelSize: 0.02,
      bevelSegments: 5,
      curveSegments: 18,
    });
    body.translate(0, 0, -0.035);
    return {
      body,
      bezel: roundedPlane(0.975, 2.075, 0.15),
      screen: roundedPlane(SCREEN_W, SCREEN_H, 0.125),
      island: roundedPlane(0.27, 0.075, 0.037),
      cam: roundedPlane(0.4, 0.4, 0.1),
    };
  }, []);
  useEffect(() => () => Object.values(geo).forEach((g) => g.dispose()), [geo]);

  const phone = useRef<THREE.Group>(null);
  const tilt = useRef<THREE.Group>(null);
  const panelA = useRef<THREE.Group>(null);
  const panelB = useRef<THREE.Group>(null);
  const matA = useRef<THREE.MeshBasicMaterial>(null);
  const matB = useRef<THREE.MeshBasicMaterial>(null);
  const frameA = useRef<THREE.MeshBasicMaterial>(null);
  const frameB = useRef<THREE.MeshBasicMaterial>(null);
  const t0 = useRef(0);

  const panelGeo = useMemo(() => {
    const wA = 3.0;
    const hA = wA / wide.ma;
    const wB = 2.7;
    const hB = wB / wide.sa;
    return {
      wA,
      hA,
      wB,
      hB,
      a: roundedPlane(wA, hA, 0.06),
      aFrame: roundedPlane(wA + 0.07, hA + 0.07, 0.085),
      b: roundedPlane(wB, hB, 0.06),
      bFrame: roundedPlane(wB + 0.07, hB + 0.07, 0.085),
    };
  }, [wide]);
  useEffect(
    () => () => {
      panelGeo.a.dispose();
      panelGeo.aFrame.dispose();
      panelGeo.b.dispose();
      panelGeo.bFrame.dispose();
    },
    [panelGeo],
  );

  useFrame((state, dt) => {
    const p = progress.current.value;
    const e = (a: number, b: number) => easeInOut(seg(p, a, b));
    const aspect = size.width / size.height;
    const isWide = aspect > 1;
    const vh = 2 * 7 * Math.tan(THREE.MathUtils.degToRad(17.5));
    const vw = vh * aspect;
    t0.current += dt;

    /* screen content */
    let s = 0;
    s += e(0.06, 0.1) + e(0.125, 0.165) + e(0.2, 0.25) + e(0.315, 0.355) + e(0.425, 0.47);
    const ai = Math.min(Math.floor(s), sources.length - 1);
    const bi = Math.min(ai + 1, sources.length - 1);
    const mix = ai === bi ? 0 : s - ai;
    const u = screenMat.uniforms;
    u.uA.value = sources[ai].tex;
    u.uB.value = sources[bi].tex;
    (u.uRA.value as THREE.Vector4).copy(sources[ai].fit);
    (u.uRB.value as THREE.Vector4).copy(sources[bi].fit);
    u.uMix.value = mix;
    u.uEnd.value = e(0.93, 0.985);

    // Rommer canvas only needs repainting while it is on a surface that can be seen.
    if (s > 3.6 && p < 0.97) {
      const ctx = rommer.canvas.getContext("2d");
      if (ctx) {
        drawPoseScreen(ctx, rommer.canvas.width, rommer.canvas.height, state.clock.elapsedTime);
        rommer.tex.needsUpdate = true;
      }
    }

    /* phone placement */
    const S = isWide ? 1.3 : Math.min(0.8, vw * 0.4);
    const baseX = isWide ? vw * 0.215 : 0;
    const baseY = isWide ? 0 : vh * 0.2;
    const aside = e(0.62, 0.72);
    const ret = e(0.84, 0.92);
    const asideX = isWide ? vw * 0.37 : vw * 0.2;
    const asideY = isWide ? vh * 0.27 : baseY + 0.55;
    const asideZ = -2.6;
    const x = lerp(lerp(baseX, asideX, aside), 0, ret);
    const y = lerp(lerp(baseY, asideY, aside), 0, ret);
    const z = lerp(lerp(0, asideZ, aside), 0, ret);
    const sc = lerp(lerp(S, S * 0.62, aside), S, ret);

    const enter = 1 - e(0, 0.075);
    const turn1 = e(0.17, 0.285);
    const turn2 = e(0.385, 0.5);
    const rotY = -0.35 + 1.25 * enter - Math.PI * 2 * (turn1 + turn2) + 1.15 * aside;
    // the final rest is exactly front-on (two full turns done)
    const rYFinal = lerp(rotY, -Math.PI * 4, ret);

    const zoomT = e(0.9, 1);
    const float = Math.sin(t0.current * 0.9) * 0.035 * (1 - zoomT);

    if (phone.current) {
      phone.current.position.set(x, y + float, z);
      phone.current.scale.setScalar(sc);
    }
    if (tilt.current) {
      const mx = pointer.x * 0.1 * (1 - zoomT);
      const my = pointer.y * 0.06 * (1 - zoomT);
      tilt.current.rotation.set(my + Math.sin(t0.current * 0.6) * 0.012, rYFinal + mx, 0);
    }

    state.camera.position.z = 7 * Math.pow(0.9 / 7, zoomT);
    state.camera.updateProjectionMatrix();

    /* floating 1likte panels */
    const inA = e(0.655, 0.7);
    const outA = isWide ? e(0.84, 0.88) : e(0.775, 0.805);
    const inB = isWide ? e(0.76, 0.805) : e(0.775, 0.82);
    const outB = e(0.84, 0.88);
    const oA = inA * (1 - outA);
    const oB = inB * (1 - outB);
    const pw = isWide ? 1 : Math.min(1, (vw * 0.88) / panelGeo.wA);
    const fl = Math.sin(t0.current * 0.7) * 0.04;
    if (panelA.current) {
      panelA.current.visible = oA > 0.01;
      const px = isWide ? vw * 0.2 : 0;
      const py = isWide ? vh * 0.12 : vh * 0.2;
      panelA.current.position.set(px, py + (1 - inA) * -0.35 + fl, 0.2);
      panelA.current.rotation.set(0.07 + (1 - inA) * 0.2, -0.5 + (1 - inA) * -0.6 + (isWide ? 0 : 0.35), 0.0);
      panelA.current.scale.setScalar(isWide ? 0.86 : pw);
    }
    if (panelB.current) {
      panelB.current.visible = oB > 0.01;
      const px = isWide ? vw * 0.2 : 0;
      const py = isWide ? -vh * 0.2 : vh * 0.2;
      panelB.current.position.set(px, py + (1 - inB) * -0.35 - fl, isWide ? -0.5 : 0.25);
      panelB.current.rotation.set(0.06 + (1 - inB) * 0.2, -0.42 + (1 - inB) * -0.6 + (isWide ? 0 : 0.35), 0.0);
      panelB.current.scale.setScalar(isWide ? 1 : Math.min(1, (vw * 0.88) / panelGeo.wB));
    }
    if (matA.current) matA.current.opacity = oA;
    if (frameA.current) frameA.current.opacity = oA;
    if (matB.current) matB.current.opacity = oB;
    if (frameB.current) frameB.current.opacity = oB;
  });

  return (
    <>
      <Environment resolution={256} frames={1} background={false}>
        <Lightformer form="rect" intensity={2.6} color="#fff6ea" position={[0, 5, -4]} scale={[12, 3, 1]} />
        <Lightformer form="rect" intensity={1.8} color="#c9d6ff" position={[-5, 1, 2]} scale={[1.6, 9, 1]} />
        <Lightformer form="rect" intensity={1.6} color="#ffd9bf" position={[5, -1, 3]} scale={[1.4, 9, 1]} />
        <Lightformer form="ring" intensity={1.2} color="#ffffff" position={[0, -2, 5]} scale={4} />
        <Lightformer form="rect" intensity={0.8} color="#ffffff" position={[0, -5, -2]} scale={[10, 1.5, 1]} />
      </Environment>
      <ambientLight intensity={0.15} />
      <directionalLight position={[3, 4, 5]} intensity={0.6} color="#fff3e6" />

      <group ref={phone}>
        <group ref={tilt}>
          <mesh geometry={geo.body}>
            <meshPhysicalMaterial color="#9a9aa4" metalness={1} roughness={0.28} clearcoat={0.6} clearcoatRoughness={0.25} envMapIntensity={1.15} />
          </mesh>
          {/* side buttons */}
          <mesh position={[-0.535, 0.55, 0]}>
            <boxGeometry args={[0.025, 0.16, 0.045]} />
            <meshStandardMaterial color="#8c8c96" metalness={1} roughness={0.35} />
          </mesh>
          <mesh position={[-0.535, 0.3, 0]}>
            <boxGeometry args={[0.025, 0.2, 0.045]} />
            <meshStandardMaterial color="#8c8c96" metalness={1} roughness={0.35} />
          </mesh>
          <mesh position={[0.535, 0.4, 0]}>
            <boxGeometry args={[0.025, 0.34, 0.045]} />
            <meshStandardMaterial color="#8c8c96" metalness={1} roughness={0.35} />
          </mesh>
          <mesh geometry={geo.bezel} position={[0, 0, 0.0562]}>
            <meshStandardMaterial color="#050507" roughness={0.4} metalness={0.2} />
          </mesh>
          <mesh geometry={geo.screen} position={[0, 0, 0.0575]}>
            <primitive object={screenMat} attach="material" />
          </mesh>
          <mesh geometry={geo.island} position={[0, 0.885, 0.0582]}>
            <meshBasicMaterial color="#020203" />
          </mesh>
          {/* camera plate on the back */}
          <group position={[0.2, 0.78, -0.0566]} rotation={[0, Math.PI, 0]}>
            <mesh geometry={geo.cam}>
              <meshPhysicalMaterial color="#17171c" metalness={0.5} roughness={0.18} clearcoat={1} />
            </mesh>
            {(
              [
                [-0.09, 0.09],
                [0.09, 0.09],
                [0, -0.09],
              ] as const
            ).map(([lx, ly]) => (
              <group key={`${lx}${ly}`} position={[lx, ly, 0.003]}>
                <mesh>
                  <circleGeometry args={[0.072, 32]} />
                  <meshStandardMaterial color="#cfd3e0" metalness={1} roughness={0.25} />
                </mesh>
                <mesh position={[0, 0, 0.002]}>
                  <circleGeometry args={[0.052, 32]} />
                  <meshStandardMaterial color="#04050a" metalness={0.9} roughness={0.08} />
                </mesh>
              </group>
            ))}
          </group>
          {/* glass: only carries reflections */}
          <mesh geometry={geo.screen} position={[0, 0, 0.0592]}>
            <meshPhysicalMaterial color="#000000" transparent opacity={0.1} roughness={0.04} metalness={0} envMapIntensity={1.6} depthWrite={false} />
          </mesh>
        </group>
      </group>

      <group ref={panelA} visible={false}>
        <mesh geometry={panelGeo.aFrame} position={[0, 0, -0.01]}>
          <meshBasicMaterial ref={frameA} color="#2a2a33" transparent opacity={0} toneMapped={false} />
        </mesh>
        <mesh geometry={panelGeo.a}>
          <meshBasicMaterial ref={matA} map={wide.mobile} transparent opacity={0} toneMapped={false} />
        </mesh>
      </group>
      <group ref={panelB} visible={false}>
        <mesh geometry={panelGeo.bFrame} position={[0, 0, -0.01]}>
          <meshBasicMaterial ref={frameB} color="#2a2a33" transparent opacity={0} toneMapped={false} />
        </mesh>
        <mesh geometry={panelGeo.b}>
          <meshBasicMaterial ref={matB} map={wide.seller} transparent opacity={0} toneMapped={false} />
        </mesh>
      </group>
    </>
  );
}

export default function DeviceScene(props: Props) {
  return (
    <Canvas
      flat
      frameloop="demand"
      dpr={props.coarse ? 1 : [1, 1.5]}
      gl={{ antialias: !props.coarse, alpha: true, powerPreference: "high-performance" }}
      camera={{ fov: 35, position: [0, 0, 7], near: 0.05, far: 30 }}
      style={{ pointerEvents: "none" }}
      aria-hidden
    >
      <Stage {...props} />
    </Canvas>
  );
}
