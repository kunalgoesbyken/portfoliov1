import type { ReactNode } from "react";
import { HighlightBody } from "@/components/case-study/highlight-body";

export function Highlights({ children }: { children: ReactNode }) {
  return <div className="not-prose my-8 divide-y divide-neutral-200 dark:divide-neutral-800 border-y border-neutral-200 dark:border-neutral-800">{children}</div>;
}

export function Highlight({ title, result, children }: { title: string; result?: string; children: ReactNode }) {
  return (
    <article className="grid gap-x-8 gap-y-2 py-6 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
      <div>
        <h3 className="font-custom text-xl leading-snug text-neutral-900 dark:text-neutral-50">{title}</h3>
        {result && <p className="mt-2 font-custom2 text-base md:text-sm font-medium md:font-normal leading-snug text-amber-700 dark:text-amber-400 max-md:!text-amber-700 dark:max-md:!text-amber-400">{result}</p>}
      </div>
      <HighlightBody>{children}</HighlightBody>
    </article>
  );
}
