import type { ReactNode } from "react";
import { HighlightBody } from "@/components/case-study/highlight-body";

export function Highlights({ children }: { children: ReactNode }) {
  return <div className="not-prose my-8 divide-y divide-line border-y border-line">{children}</div>;
}

export function Highlight({ title, result, children }: { title: string; result?: string; children: ReactNode }) {
  return (
    <article className="grid gap-x-8 gap-y-2 py-6 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
      <div>
        <h3 className="font-custom text-xl leading-snug font-bold text-fg">{title}</h3>
        {result && <p className="mt-2 font-custom2 text-base md:text-sm font-medium md:font-normal leading-snug text-accent">{result}</p>}
      </div>
      <HighlightBody>{children}</HighlightBody>
    </article>
  );
}
