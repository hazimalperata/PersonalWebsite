"use client";

import { useRef } from "react";
import { extend, useFrame, type ThreeElement } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";
import { BackSide, Color, CustomBlending, OneFactor, OneMinusSrcAlphaFactor, type ShaderMaterial } from "three";
import { useSceneTheme } from "./useSceneTheme";

const RADIUS = 1.03;
// -dot(normal, view) of the shell's back face where the ray just grazes the planet (radius 1)
const RIM_MAX = Math.sqrt(1 - 1 / (RADIUS * RADIUS));

const AtmosphereMaterial = shaderMaterial(
  { uColor: new Color("#8CCBFF"), uIntensity: 1.1, uAlpha: 0 },
  /* glsl */ `
    varying vec3 vNormal;
    varying vec3 vView;
    void main() {
      vec4 mv = modelViewMatrix * vec4(position, 1.0);
      vNormal = normalize(normalMatrix * normal);
      vView = normalize(-mv.xyz);
      gl_Position = projectionMatrix * mv;
    }
  `,
  /* glsl */ `
    const float RIM_MAX = ${RIM_MAX.toFixed(4)};
    const float FALLOFF = 1.6;
    uniform vec3 uColor;
    uniform float uIntensity;
    uniform float uAlpha;
    varying vec3 vNormal;
    varying vec3 vView;
    void main() {
      // Back faces of the shell. Where the ray grazes the planet, -dot(n, v) is RIM_MAX; it falls
      // to 0 at the outer edge of the shell, so the halo is brightest at the planet and fades out.
      float rim = clamp(dot(-vNormal, vView) / RIM_MAX, 0.0, 1.0);
      float glow = pow(rim, FALLOFF);
      // Premultiplied output: uAlpha 0 adds light (night sky), uAlpha 1 covers a pale background.
      float strength = glow * uIntensity;
      gl_FragColor = vec4(uColor * strength, min(strength * uAlpha, 1.0));
    }
  `,
);

extend({ AtmosphereMaterial });

declare module "@react-three/fiber" {
  interface ThreeElements {
    atmosphereMaterial: ThreeElement<typeof AtmosphereMaterial>;
  }
}

export default function Atmosphere() {
  const theme = useSceneTheme();
  const material = useRef<ShaderMaterial>(null);

  useFrame(() => {
    const uniforms = material.current?.uniforms;
    if (!uniforms) return;
    uniforms.uColor.value.copy(theme.atmosphere);
    uniforms.uIntensity.value = theme.atmosphereIntensity;
    uniforms.uAlpha.value = theme.atmosphereAlpha;
  });

  return (
    <mesh>
      <sphereGeometry args={[RADIUS, 64, 64]} />
      <atmosphereMaterial
        ref={material}
        uColor={theme.atmosphere}
        uIntensity={theme.atmosphereIntensity}
        uAlpha={theme.atmosphereAlpha}
        side={BackSide}
        blending={CustomBlending}
        blendSrc={OneFactor}
        blendDst={OneMinusSrcAlphaFactor}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}
