"use client";

import { LazyMotion } from "motion/react";

// domMax is required for `layoutId` (Navbar shared-layout pill/underline).
const loadFeatures = () => import("./motion-features").then((res) => res.default);

export default function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={loadFeatures} strict>
      {children}
    </LazyMotion>
  );
}
