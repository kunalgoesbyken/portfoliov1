import type { ReactNode } from "react";
import { MobileFold } from "@/components/case-study/mobile-fold";

const FOLDED_KICKER = "For everyone";

export function Section({ kicker, title, children }: { kicker: string; title: string; children: ReactNode }) {
  return (
    <section className="mt-10 md:mt-14 first:mt-10">
      <p className="not-prose font-custom2 text-xs uppercase tracking-[0.14em] text-amber-700 dark:text-amber-400">{kicker}</p>
      <h2 className="!mt-1 !font-normal">{title}</h2>
      {kicker === FOLDED_KICKER ? <MobileFold>{children}</MobileFold> : children}
    </section>
  );
}
