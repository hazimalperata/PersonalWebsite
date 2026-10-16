"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { Flip } from "gsap/Flip";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, Flip, useGSAP);
}

export { gsap, ScrollTrigger, SplitText, Flip, useGSAP };

export const PAPER = "#F2EFE8";
export const INK = "#0B0B0B";
export const RED = "#E2261C";
export const ACID = "#E4FF3A";
