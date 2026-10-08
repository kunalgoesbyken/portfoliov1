"use client";

import dynamic from "next/dynamic";
import ClientOnly from "@/components/client-only";

const Analytics = dynamic(() => import("@vercel/analytics/react").then((m) => ({ default: m.Analytics })), { ssr: false });
const SpeedInsights = dynamic(() => import("@vercel/speed-insights/next").then((m) => ({ default: m.SpeedInsights })), { ssr: false });

// Loads telemetry only after hydration + idle so it never competes with first paint.
export default function DeferredAnalytics() {
  return (
    <ClientOnly delay={4000}>
      <Analytics />
      <SpeedInsights />
    </ClientOnly>
  );
}
