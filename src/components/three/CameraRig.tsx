"use client";

import { useRef, type ReactNode, type RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import { MathUtils, type Group } from "three";
import { poseFor } from "./cameraPose";
import { scrollState, writeFade } from "./scrollState";

const LAMBDA = 4;
const TILT = (-23.4 * Math.PI) / 180;

interface Props {
  wrapper: RefObject<HTMLElement | null>;
  children: ReactNode;
}

/**
 * Pulls the camera back and sinks the planet as the page scrolls, then fades the canvas out.
 * Owns the (axially tilted) group the planet lives in, so it can move it.
 */
export default function CameraRig({ wrapper, children }: Props) {
  const earth = useRef<Group>(null);

  useFrame(({ camera }, dt) => {
    const p = scrollState.progress;
    const pose = poseFor(p);
    camera.position.z = MathUtils.damp(camera.position.z, pose.cameraZ, LAMBDA, dt);
    camera.position.y = MathUtils.damp(camera.position.y, pose.cameraY, LAMBDA, dt);
    const group = earth.current;
    if (group) {
      group.position.x = MathUtils.damp(group.position.x, pose.earthX, LAMBDA, dt);
      group.position.y = MathUtils.damp(group.position.y, pose.earthY, LAMBDA, dt);
      const scale = MathUtils.damp(group.scale.x, pose.earthScale, LAMBDA, dt);
      group.scale.setScalar(scale);
    }
    writeFade(wrapper.current, p);
  });

  return (
    <group ref={earth} position={[0, -1.15, 0]} rotation={[0, 0, TILT]}>
      {children}
    </group>
  );
}
