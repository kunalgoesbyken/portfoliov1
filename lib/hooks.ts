"use client";

import { useSyncExternalStore } from "react";

export function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

type NavigatorWithUserAgentData = Navigator & { userAgentData?: { platform?: string } };

const APPLE_PLATFORMS = ["mac", "iphone", "ipad", "ipod"];

const detectApplePlatform = () => {
  const nav: NavigatorWithUserAgentData = navigator;
  const platform = (nav.userAgentData?.platform || nav.platform).toLowerCase();
  return APPLE_PLATFORMS.some((name) => platform.includes(name));
};

export function useIsApplePlatform() {
  return useSyncExternalStore(
    () => () => {},
    detectApplePlatform,
    () => false,
  );
}

export function useScrolledPast(threshold: number) {
  return useSyncExternalStore(
    (onChange) => {
      window.addEventListener("scroll", onChange, { passive: true });
      return () => window.removeEventListener("scroll", onChange);
    },
    () => window.scrollY > threshold,
    () => false,
  );
}
