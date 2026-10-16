"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import { SRGBColorSpace, type Mesh } from "three";
import { textureSet } from "@/lib/capabilities";

const SPIN = 0.026; // rad/s, a touch faster than the surface

export default function Clouds({ tier }: { tier: "low" | "high" }) {
  const set = textureSet(tier);
  const [map, alphaMap] = useTexture([set.clouds, set.cloudsAlpha], (textures) => {
    textures[0].colorSpace = SRGBColorSpace;
  });
  const mesh = useRef<Mesh>(null);

  useFrame((_, dt) => {
    if (mesh.current) mesh.current.rotation.y += dt * SPIN;
  });

  return (
    <mesh ref={mesh}>
      <sphereGeometry args={[1.008, 64, 64]} />
      <meshStandardMaterial map={map} alphaMap={alphaMap} transparent opacity={0.9} depthWrite={false} />
    </mesh>
  );
}
