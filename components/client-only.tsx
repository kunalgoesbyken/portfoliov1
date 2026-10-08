"use client";

import { useEffect, useState, type ReactNode } from "react";

// Renders children only on the client, after the browser is idle, so heavy
// non-critical widgets never compete with first paint and hydration.
export default function ClientOnly({
  children,
  delay = 0,
}: {
  children: ReactNode;
  delay?: number;
}) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    let idleId: number | undefined;
    const timer = setTimeout(() => {
      if (w.requestIdleCallback) {
        idleId = w.requestIdleCallback(() => setReady(true), { timeout: 2500 });
      } else {
        setReady(true);
      }
    }, delay);
    return () => {
      clearTimeout(timer);
      if (idleId !== undefined) w.cancelIdleCallback?.(idleId);
    };
  }, [delay]);

  return ready ? <>{children}</> : null;
}
