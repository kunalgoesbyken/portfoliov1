"use client";

import { LazyMotion } from "motion/react";

// Wraps the few lazily-loaded widgets that animate with `m.*` (chatbot, lightbox),
// so motion never ships in the initial page bundle. domAnimation is enough:
// do not introduce `layout*` or `drag` props without switching to domMax.
const loadFeatures = () => import("./motion-features").then((res) => res.default);

export default function MotionScope({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={loadFeatures} strict>
      {children}
    </LazyMotion>
  );
}
