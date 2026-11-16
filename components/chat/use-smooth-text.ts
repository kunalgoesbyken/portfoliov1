"use client";

import { useEffect, useState } from "react";
import { useMediaQuery } from "@/lib/hooks";

const CATCH_UP_FRAMES = 10;

export function useSmoothText(text: string) {
  const [shown, setShown] = useState(text.length);
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const target = text.length;
  const visible = reducedMotion ? target : Math.min(shown, target);

  useEffect(() => {
    if (visible >= target) return;
    const frame = requestAnimationFrame(() =>
      setShown((current) => Math.min(target, current + Math.ceil((target - current) / CATCH_UP_FRAMES))),
    );
    return () => cancelAnimationFrame(frame);
  }, [visible, target]);

  return { text: text.slice(0, visible), revealing: visible < target };
}
