import type { HTMLMotionProps } from "motion/react";

type Preset = Pick<HTMLMotionProps<"div">, "initial" | "animate" | "exit" | "transition">;

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

export const fade: Preset = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.15 },
};

export const rise: Preset = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 6 },
  transition: { duration: 0.25, ease: EASE_OUT_EXPO },
};

export const pop: Preset = {
  initial: { opacity: 0, scale: 0.94, y: 8 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.94, y: 8 },
  transition: { duration: 0.22, ease: EASE_OUT_EXPO },
};
