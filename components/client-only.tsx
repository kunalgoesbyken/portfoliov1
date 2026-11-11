"use client";

import { useEffect, useState, type ReactNode } from "react";
import { whenIdle } from "@/lib/idle";

export default function ClientOnly({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const [ready, setReady] = useState(false);
  useEffect(() => whenIdle(() => setReady(true), { delay }), [delay]);
  return ready ? <>{children}</> : null;
}
