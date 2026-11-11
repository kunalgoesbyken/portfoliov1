import type { ReactNode } from "react";
import { MobileFold } from "@/components/case-study/mobile-fold";

const FOLDED_KICKER = "For everyone";

export function Section({ kicker, title, children }: { kicker: string; title: string; children: ReactNode }) {
  return (
    <section className="mt-10 md:mt-14 first:mt-10">
      <p className="not-prose eyebrow text-accent">{kicker}</p>
      <h2 className="!mt-1 !font-normal">{title}</h2>
      {kicker === FOLDED_KICKER ? <MobileFold>{children}</MobileFold> : children}
    </section>
  );
}
