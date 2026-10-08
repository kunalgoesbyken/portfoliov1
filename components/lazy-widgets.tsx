"use client";

import dynamic from "next/dynamic";
import ClientOnly from "@/components/client-only";

// Non-critical widgets: their code is only fetched once ClientOnly mounts
// them (after hydration + idle), so it never sits in the initial JS graph.
const FractalTree = dynamic(() => import("@/components/ui/fractal-tree"), { ssr: false });
const Chatbot = dynamic(() => import("@/components/chatbot"), { ssr: false });

export function LazyFractalTree() {
  return (
    <ClientOnly delay={2500}>
      <FractalTree />
    </ClientOnly>
  );
}

export function LazyChatbot() {
  return (
    <ClientOnly>
      <Chatbot />
    </ClientOnly>
  );
}
