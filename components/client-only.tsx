"use client";

import { useEffect, useState, type ReactNode } from "react";

// Renders children only on the client, after the browser is idle, so heavy
// non-critical widgets never compete with first paint and hydration.
export default function ClientOnly({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    if (w.requestIdleCallback) {
      const id = w.requestIdleCallback(() => setReady(true), { timeout: 2500 });
      return () => w.cancelIdleCallback?.(id);
    }
    const id = setTimeout(() => setReady(true), 1200);
    return () => clearTimeout(id);
  }, []);

  return ready ? <>{children}</> : null;
}
