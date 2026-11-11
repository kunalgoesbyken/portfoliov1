"use client";

import dynamic from "next/dynamic";
import ClientOnly from "@/components/client-only";
import MountOnVisible from "@/components/ui/mount-on-visible";

const DisplacementText = dynamic(
  () => import("@/components/ui/displacement-text"),
  { ssr: false },
);

const IDLE_DELAY_MS = 3000;

export function LazyDisplacementText({ text }: { text: string }) {
  return (
    <div className="relative h-36 w-full overflow-hidden md:h-60">
      <ClientOnly delay={IDLE_DELAY_MS}>
        <MountOnVisible rootMargin="0px">
          <DisplacementText
            text={text}
            fontSize={450}
            className="absolute inset-0 h-full w-full"
          />
        </MountOnVisible>
      </ClientOnly>
    </div>
  );
}
