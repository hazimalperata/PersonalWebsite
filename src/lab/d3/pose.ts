/**
 * A tiny pose rig used for the Rommer *illustration*: it is drawn, not captured, and always labelled so.
 * Coordinates live in a 200 x 400 box. Limb lengths are constant (two-bone IK on the legs).
 */
export interface Pt {
  x: number;
  y: number;
}

export type JointName =
  | "head"
  | "neck"
  | "hip"
  | "sL"
  | "sR"
  | "eL"
  | "eR"
  | "wL"
  | "wR"
  | "hL"
  | "hR"
  | "kL"
  | "kR"
  | "aL"
  | "aR";

export type Pose = Record<JointName, Pt>;

export const POSE_BONES: Array<[JointName, JointName]> = [
  ["head", "neck"],
  ["neck", "hip"],
  ["sL", "sR"],
  ["sL", "eL"],
  ["eL", "wL"],
  ["sR", "eR"],
  ["eR", "wR"],
  ["hL", "hR"],
  ["hL", "kL"],
  ["kL", "aL"],
  ["hR", "kR"],
  ["kR", "aR"],
];

function leg(h: Pt, a: Pt, len: number, side: -1 | 1): Pt {
  const mx = (h.x + a.x) / 2;
  const my = (h.y + a.y) / 2;
  const dx = a.x - h.x;
  const dy = a.y - h.y;
  const d = Math.hypot(dx, dy);
  const off = Math.sqrt(Math.max(0, len * len - (d / 2) * (d / 2)));
  // perpendicular to the hip-ankle line, flipped so the knee points outwards
  let nx = -dy / d;
  let ny = dx / d;
  if (nx * side < 0) {
    nx = -nx;
    ny = -ny;
  }
  return { x: mx + nx * off, y: my + ny * off };
}

export function getPose(t: number): Pose {
  const k = 0.5 - 0.5 * Math.cos(t * 1.15);
  const hipY = 232 + 26 * k;
  const hip = { x: 100, y: hipY };
  const neck = { x: 100, y: hipY - 98 + 4 * k };
  const head = { x: 100, y: neck.y - 36 };
  const sL = { x: neck.x - 31, y: neck.y + 9 };
  const sR = { x: neck.x + 31, y: neck.y + 9 };
  const th = 0.25 + k * 2.55;
  const arm = (s: Pt, dir: -1 | 1) => {
    const e = { x: s.x + dir * Math.sin(th) * 64, y: s.y + Math.cos(th) * 64 };
    const th2 = th + 0.3;
    const w = { x: e.x + dir * Math.sin(th2) * 58, y: e.y + Math.cos(th2) * 58 };
    return { e, w };
  };
  const aL = arm(sL, -1);
  const aR = arm(sR, 1);
  const hL = { x: 86, y: hipY };
  const hR = { x: 114, y: hipY };
  const ankL = { x: 72, y: 372 };
  const ankR = { x: 128, y: 372 };
  return {
    head,
    neck,
    hip,
    sL,
    sR,
    eL: aL.e,
    eR: aR.e,
    wL: aL.w,
    wR: aR.w,
    hL,
    hR,
    kL: leg(hL, ankL, 76, -1),
    kR: leg(hR, ankR, 76, 1),
    aL: ankL,
    aR: ankR,
  };
}

/** Paints the Rommer illustration screen on a 2D canvas. */
export function drawPoseScreen(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) {
  const bg = ctx.createLinearGradient(0, 0, 0, h);
  bg.addColorStop(0, "#0d0f15");
  bg.addColorStop(1, "#171922");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  // faint grid
  ctx.strokeStyle = "rgba(237,233,227,0.05)";
  ctx.lineWidth = 1;
  const step = w / 8;
  for (let x = step; x < w; x += step) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
  }
  for (let y = step; y < h; y += step) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }

  const sc = (w * 0.92) / 200;
  const ox = (w - 200 * sc) / 2;
  const oy = (h - 400 * sc) / 2 - h * 0.025;
  const pose = getPose(t);
  const P = (p: Pt) => ({ x: ox + p.x * sc, y: oy + p.y * sc });

  // wrist trails
  for (const j of ["wL", "wR"] as const) {
    for (let i = 1; i <= 14; i++) {
      const q = P(getPose(t - i * 0.05)[j]);
      ctx.fillStyle = `rgba(190,205,255,${0.22 * (1 - i / 15)})`;
      ctx.beginPath();
      ctx.arc(q.x, q.y, 3 * sc * (1 - i / 18), 0, Math.PI * 2);
      ctx.fill();
    }
  }

  ctx.lineCap = "round";
  ctx.strokeStyle = "rgba(237,233,227,0.88)";
  ctx.lineWidth = 2.6 * sc;
  for (const [a, b] of POSE_BONES) {
    const pa = P(pose[a]);
    const pb = P(pose[b]);
    ctx.beginPath();
    ctx.moveTo(pa.x, pa.y);
    ctx.lineTo(pb.x, pb.y);
    ctx.stroke();
  }
  // head
  const hd = P(pose.head);
  ctx.beginPath();
  ctx.arc(hd.x, hd.y, 15 * sc, 0, Math.PI * 2);
  ctx.stroke();

  // joints
  for (const key of Object.keys(pose) as JointName[]) {
    if (key === "head") continue;
    const q = P(pose[key]);
    const g = ctx.createRadialGradient(q.x - 1, q.y - 1, 0, q.x, q.y, 6 * sc);
    g.addColorStop(0, "#ffffff");
    g.addColorStop(0.6, "#b9c8ff");
    g.addColorStop(1, "#ffd7bd");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(q.x, q.y, 4.6 * sc, 0, Math.PI * 2);
    ctx.fill();
  }

  // floor line
  ctx.strokeStyle = "rgba(237,233,227,0.18)";
  ctx.lineWidth = 1.5;
  const fy = oy + 376 * sc;
  ctx.beginPath();
  ctx.moveTo(w * 0.12, fy);
  ctx.lineTo(w * 0.88, fy);
  ctx.stroke();

  ctx.fillStyle = "#8A8A93";
  ctx.textAlign = "center";
  ctx.font = `${Math.round(w * 0.036)}px ui-monospace, Menlo, Consolas, monospace`;
  ctx.fillText("ILLUSTRATION · ON-DEVICE POSE ANALYSIS", w / 2, h - h * 0.045);
}
