import { describe, expect, it } from "vitest";
import { globeHeightShare, poseFor } from "./cameraPose";

describe("poseFor", () => {
  it("keeps the start pose unchanged", () => {
    expect(poseFor(0)).toEqual({ cameraZ: 2.6, cameraY: -0.2, earthX: 0, earthY: -1.15, earthScale: 1 });
  });
  it("reads as a small dot at p = 0.85", () => {
    expect(globeHeightShare(poseFor(0.85))).toBeLessThan(0.06);
  });
  it("keeps shrinking up to p = 1", () => {
    expect(globeHeightShare(poseFor(1))).toBeLessThan(globeHeightShare(poseFor(0.85)));
    for (let p = 0.05; p <= 1; p += 0.05) {
      expect(globeHeightShare(poseFor(p))).toBeLessThan(globeHeightShare(poseFor(p - 0.05)));
    }
  });
  it("stays inside the camera far plane and drifts only slightly", () => {
    expect(poseFor(1).cameraZ).toBeLessThan(50);
    expect(Math.abs(poseFor(1).earthX)).toBeLessThanOrEqual(1);
  });
});
