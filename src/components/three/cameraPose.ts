/** Scale of the earth group at the point where the canvas fade starts (p = 0.85). */
const DOT_AT = 0.85;
const DOT_SCALE = 0.1;

export interface Pose {
  cameraZ: number;
  cameraY: number;
  earthX: number;
  earthY: number;
  earthScale: number;
}

/**
 * Camera and planet pose for a scroll progress 0..1.
 * p = 0 is the hero pose. The camera stays inside the far plane (z <= 9), so the globe is scaled
 * down instead of flying away: ~10% scale at p = 0.85 (a pale blue dot, a few percent of the
 * viewport height) and still shrinking at p = 1. It drifts slightly sideways as it recedes.
 */
export function poseFor(p: number): Pose {
  return {
    cameraZ: 2.6 + p * 6.4,
    cameraY: -0.2 + p * 0.5,
    earthX: 0.9 * p * p,
    earthY: -1.15 + p * 1.1,
    earthScale: Math.pow(DOT_SCALE, p / DOT_AT),
  };
}

/** Rough share of the viewport height the globe (radius 1) covers, for a camera at fov 35. */
export function globeHeightShare(pose: Pose, fovDeg = 35): number {
  const half = Math.tan((fovDeg * Math.PI) / 360);
  return pose.earthScale / (pose.cameraZ * half);
}
