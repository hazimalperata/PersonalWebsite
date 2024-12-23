import {Variants} from "framer-motion";

export const backgroundVariant: Variants = {
  initial: {
    opacity: 1,
    // filter: 'blur(8px)',
    // scale: 0.95,
    // opacity: 0.5,
  },
  animate: {
    // filter: 'blur(0px)',
    opacity: 0.7,
    transition: {
      type: "tween",
      duration: 3,
    }
  },
  exit: {
    // scale: 0.95,
    opacity: 0,
    transition: {
      type: "tween",
      duration: 1,
    }
  },
}

export const displayVariant: Variants = {
  initial: {
    y: 50,
    opacity: 0,
    filter: "blur(4px)"
  },
  animate: {
    y: 0,
    opacity: 1,
    filter: "blur(0px)",
    transition: {
      type: "tween",
      duration: 3,
    }
  },
  exit: {
    transition: {
      type: "tween",
      duration: 1,
    },
    scale: 0.95,
    opacity: 0.5,
  },
};

export const anim = (variants: Variants) => {
  return {
    initial: "initial",
    animate: "animate",
    exit: "exit",
    variants
  }
}
