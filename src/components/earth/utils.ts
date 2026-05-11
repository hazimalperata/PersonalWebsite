import * as THREE from "three";

// ─── Starfield ────────────────────────────────────────────────────────────────

export function getStarfield({ numStars = 15000 } = {}) {
  function randomSpherePoint() {
    const minRadius = 75;
    const maxRadius = 500;
    const radius = Math.random() * (maxRadius - minRadius) + minRadius;
    const u = Math.random();
    const v = Math.random();
    const theta = 2 * Math.PI * u;
    const phi = Math.acos(2 * v - 1);
    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.sin(phi) * Math.sin(theta);
    const z = radius * Math.cos(phi);
    return { pos: new THREE.Vector3(x, y, z), hue: 0.6, minDist: radius };
  }

  const verts: number[] = [];
  const colors: number[] = [];
  let col: THREE.Color;

  for (let i = 0; i < numStars; i++) {
    const p = randomSpherePoint();
    const { pos, hue } = p;
    col = new THREE.Color().setHSL(hue, 0.2, Math.random());
    verts.push(pos.x, pos.y, pos.z);
    colors.push(col.r, col.g, col.b);
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(verts, 3));
  geo.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));

  const mat = new THREE.PointsMaterial({
    size: 0.2,
    vertexColors: true,
    map: new THREE.TextureLoader().load("/textures/space/star.png"),
    transparent: true,
  });

  return new THREE.Points(geo, mat);
}

// ─── Fresnel Glow Material ────────────────────────────────────────────────────

export function getFresnelMat({
  rimHex = 0x0088ff,
  facingHex = 0x000000,
} = {}) {
  const uniforms = {
    color1: { value: new THREE.Color(rimHex) },
    color2: { value: new THREE.Color(facingHex) },
    fresnelBias: { value: 0.1 },
    fresnelScale: { value: 1.0 },
    fresnelPower: { value: 4.0 },
  };

  const vs = /* glsl */ `
    uniform float fresnelBias;
    uniform float fresnelScale;
    uniform float fresnelPower;
    varying float vReflectionFactor;

    void main() {
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      vec4 worldPosition = modelMatrix * vec4(position, 1.0);
      vec3 worldNormal = normalize(mat3(modelMatrix[0].xyz, modelMatrix[1].xyz, modelMatrix[2].xyz) * normal);
      vec3 I = worldPosition.xyz - cameraPosition;
      vReflectionFactor = fresnelBias + fresnelScale * pow(1.0 + dot(normalize(I), worldNormal), fresnelPower);
      gl_Position = projectionMatrix * mvPosition;
    }
  `;

  const fs = /* glsl */ `
    uniform vec3 color1;
    uniform vec3 color2;
    varying float vReflectionFactor;

    void main() {
      float f = clamp(vReflectionFactor, 0.0, 1.0);
      gl_FragColor = vec4(mix(color2, color1, vec3(f)), f);
    }
  `;

  return new THREE.ShaderMaterial({
    uniforms,
    vertexShader: vs,
    fragmentShader: fs,
    transparent: true,
    blending: THREE.AdditiveBlending,
  });
}

// ─── Sections Data ────────────────────────────────────────────────────────────

export type SectionAlign = "center" | "left" | "right";

export interface Section {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  align: SectionAlign;
  earthRotationY: number;
  earthRotationX?: number;
  earthRotationZ?: number;
  earthPositionX: number;
  cameraZ: number;
  duration?: number;
  autoRotate?: boolean;
}

export const SECTIONS: Section[] = [
  {
    id: "hero",
    title: "The Pale Blue Dot",
    subtitle: "A Perspective Journey",
    description: "Pause for a moment. Look at our world from a distance, and remember the shared story of humanity.",
    align: "center",
    earthRotationY: 0,
    earthPositionX: 0,
    cameraZ: 8,
    duration: 1.2,
    autoRotate: false,
  },
  {
    id: "turkey",
    title: "My Perspective",
    subtitle: "🇹🇷 Istanbul, Turkey",
    description: "This is where I breathe, where I code, and where I look up at the same stars as you do.",
    align: "right",
    earthRotationX: 0.780,
    earthRotationY: -2.150,
    earthRotationZ: 0.130,
    earthPositionX: -0.110,
    cameraZ: 1.200,
    duration: 1.2,
    autoRotate: false,
  },
  {
    id: "north-america",
    title: "Across the Ocean",
    subtitle: "🌎 Western Hemisphere",
    description: "You might be here, or somewhere else across these vast waters, living a life as complex as my own.",
    align: "left",
    earthRotationY: -Math.PI * 0.75,
    earthPositionX: 0.5,
    cameraZ: 2.5,
    duration: 1.2,
    autoRotate: false,
  },
  {
    id: "asia",
    title: "Shared Horizons",
    subtitle: "🌏 Eastern Hemisphere",
    description: "Thousands of miles apart, yet we are separated only by borders we've drawn on a map that has none.",
    align: "right",
    earthRotationY: Math.PI * 0.25,
    earthPositionX: -0.5,
    cameraZ: 2.5,
    duration: 1.2,
    autoRotate: false,
  },
  {
    id: "africa",
    title: "The Cradle of Life",
    subtitle: "🌍 African Continent",
    description: "Our roots run deep here, connecting us all to the same origin in this vast, spinning home.",
    align: "left",
    earthRotationY: 0.15,
    earthPositionX: 0.5,
    cameraZ: 2.5,
    duration: 1.2,
    autoRotate: false,
  },
  {
    id: "south-america",
    title: "The Breathing Planet",
    subtitle: "🌎 South American Treasures",
    description: "A testament to the fragility and beauty of our ecosystem, shared by every person on this globe.",
    align: "right",
    earthRotationY: -Math.PI * 0.85,
    earthPositionX: -0.5,
    cameraZ: 2.5,
    duration: 1.2,
    autoRotate: false,
  },
  {
    id: "outro",
    title: "The Only Home We've Ever Known",
    subtitle: "We are all together",
    description: "When we step back, all our differences fade. There are no lines, no borders—just one single, beautiful miracle.",
    align: "center",
    earthRotationY: -Math.PI * 0.85,
    earthPositionX: 0,
    cameraZ: 200,
    duration: 32,
    autoRotate: true,
  },
];
