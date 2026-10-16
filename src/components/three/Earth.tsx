"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import { SRGBColorSpace, type Mesh, type MeshStandardMaterial } from "three";
import { textureSet } from "@/lib/capabilities";
import { useSceneTheme } from "./useSceneTheme";

const SPIN = 0.02; // rad/s

export default function Earth({ tier }: { tier: "low" | "high" }) {
  const set = textureSet(tier);
  const [map, lights, bump] = useTexture([set.map, set.lights, set.bump], (textures) => {
    for (const t of textures) t.anisotropy = 4;
    textures[0].colorSpace = SRGBColorSpace;
    textures[1].colorSpace = SRGBColorSpace;
  });
  const theme = useSceneTheme();
  const mesh = useRef<Mesh>(null);
  const material = useRef<MeshStandardMaterial>(null);

  useFrame((_, dt) => {
    if (mesh.current) mesh.current.rotation.y += dt * SPIN;
    if (material.current) material.current.emissiveIntensity = theme.emissive;
  });

  return (
    <mesh ref={mesh}>
      <sphereGeometry args={[1, 96, 96]} />
      <meshStandardMaterial
        ref={material}
        map={map}
        emissiveMap={lights}
        emissive="#ffd9a0"
        emissiveIntensity={theme.emissive}
        bumpMap={bump}
        bumpScale={0.02}
        roughness={0.9}
        metalness={0}
      />
    </mesh>
  );
}
