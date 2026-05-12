import * as THREE from "three";

// ─── Starfield ────────────────────────────────────────────────────────────────

export function getStarfield({ numStars = 15000 } = {}) {
  function randomSpherePoint() {
    const minRadius = 150;
    const maxRadius = 800;
    const radius = Math.random() * (maxRadius - minRadius) + minRadius;
    const u = Math.random();
    const v = Math.random();
    const theta = 2 * Math.PI * u;
    const phi = Math.acos(2 * v - 1);
    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.sin(phi) * Math.sin(theta);
    const z = radius * Math.cos(phi);
    
    // Random star color distribution
    const rand = Math.random();
    let col = new THREE.Color();
    if (rand > 0.95) col.setHSL(0.6, 0.8, 0.9); // Blue
    else if (rand > 0.8) col.setHSL(0.1, 0.5, 0.9); // Orange/Warm
    else if (rand > 0.7) col.setHSL(0.16, 0.6, 0.9); // Yellowish
    else col.setHSL(0, 0, 1); // White

    return { 
      pos: new THREE.Vector3(x, y, z), 
      color: col,
      size: Math.random() * 2.5 + 0.5 // Varied sizes
    };
  }

  const verts: number[] = [];
  const colors: number[] = [];
  const sizes: number[] = [];

  for (let i = 0; i < numStars; i++) {
    const p = randomSpherePoint();
    verts.push(p.pos.x, p.pos.y, p.pos.z);
    colors.push(p.color.r, p.color.g, p.color.b);
    sizes.push(p.size);
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(verts, 3));
  geo.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  geo.setAttribute("size", new THREE.Float32BufferAttribute(sizes, 1));

  const mat = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
    },
    vertexShader: /* glsl */ `
      attribute vec3 color;
      attribute float size;
      varying vec3 vColor;
      varying float vTwinkle;
      uniform float uTime;

      void main() {
        vColor = color;
        // Unique seed for each star's twinkling based on its position
        float seed = position.x + position.y + position.z;
        vTwinkle = sin(uTime * 1.5 + seed) * 0.5 + 0.5;
        
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = size * (300.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: /* glsl */ `
      varying vec3 vColor;
      varying float vTwinkle;

      void main() {
        float r = distance(gl_PointCoord, vec2(0.5));
        if (r > 0.5) discard;
        
        // Soft radial glow
        float strength = 1.0 - (r * 2.0);
        strength = pow(strength, 3.0);
        
        // Twinkling effect: 70% base brightness + 30% pulse
        float finalAlpha = strength * (0.5 + vTwinkle * 0.5);
        
        gl_FragColor = vec4(vColor, finalAlpha);
      }
    `,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
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
    subtitle: "Bursa, Türkiye",
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
    subtitle: "Western Hemisphere",
    description: "You might be here, or somewhere else across these vast waters, living a life as complex as my own.",
    align: "left",
    earthRotationX: 0.580,
    earthRotationY: 0.114,
    earthRotationZ: 0.220,
    earthPositionX: 0.210,
    cameraZ: 1.400,
    duration: 1.2,
    autoRotate: false,
  },
  {
    id: "asia",
    title: "Shared Horizons",
    subtitle: "Eastern Hemisphere",
    description: "Thousands of miles apart, yet we are separated only by borders we've drawn on a map that has none.",
    align: "right",
    earthRotationX: 0.660,
    earthRotationY: -2.975,
    earthRotationZ: 0.000,
    earthPositionX: -0.150,
    cameraZ: 1.400,
    duration: 1.2,
    autoRotate: false,
  },
  {
    id: "africa",
    title: "The Cradle of Life",
    subtitle: "African Continent",
    description: "Our roots run deep here, connecting us all to the same origin in this vast, spinning home.",
    align: "left",
    earthRotationX: 0.260,
    earthRotationY: -2.070,
    earthRotationZ: 0.080,
    earthPositionX: 0.300,
    cameraZ: 1.500,
    duration: 1.2,
    autoRotate: false,
  },
  {
    id: "south-america",
    title: "The Breathing Planet",
    subtitle: "South American Treasures",
    description: "A testament to the fragility and beauty of our ecosystem, shared by every person on this globe.",
    align: "right",
    earthRotationX: -0.230,
    earthRotationY: -0.360,
    earthRotationZ: 0.000,
    earthPositionX: -0.260,
    cameraZ: 1.500,
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
