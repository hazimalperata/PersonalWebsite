"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { AmbientLight, DirectionalLight } from "three";
import { useSceneTheme } from "./useSceneTheme";

export default function SunLight() {
  const theme = useSceneTheme();
  const sun = useRef<DirectionalLight>(null);
  const ambient = useRef<AmbientLight>(null);

  useFrame(() => {
    sun.current?.position.set(Math.cos(theme.sunAngle) * 5, 1.2, Math.sin(theme.sunAngle) * 5);
    if (ambient.current) {
      ambient.current.intensity = theme.ambient;
      ambient.current.color.copy(theme.ambientColor);
    }
  });

  return (
    <>
      <directionalLight ref={sun} intensity={2.2} position={[Math.cos(theme.sunAngle) * 5, 1.2, Math.sin(theme.sunAngle) * 5]} />
      <ambientLight ref={ambient} intensity={theme.ambient} color={theme.ambientColor} />
    </>
  );
}
