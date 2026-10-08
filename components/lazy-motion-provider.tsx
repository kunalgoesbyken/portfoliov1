"use client";

import { LazyMotion } from "motion/react";

// domAnimation is enough: no layout/layoutId/drag usage remains (Navbar pill is CSS).
// Do not reintroduce `layout*` or `drag` props without switching back to domMax.
const loadFeatures = () => import("./motion-features").then((res) => res.default);

export default function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={loadFeatures} strict>
      {children}
    </LazyMotion>
  );
}
