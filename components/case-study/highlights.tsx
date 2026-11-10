import type { ReactNode } from "react";

export function Highlights({ children }: { children: ReactNode }) {
  return <div className="not-prose my-6 grid gap-3 md:grid-cols-2">{children}</div>;
}

export function Highlight({ title, result, children }: { title: string; result?: string; children: ReactNode }) {
  return (
    <article className="frame-dashed flex flex-col gap-2 bg-white/60 dark:bg-neutral-900/40 p-4">
      <h3 className="!m-0 font-custom !font-normal text-xl leading-snug text-neutral-900 dark:text-neutral-50">{title}</h3>
      <div className="font-custom2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400 [&_code]:text-[0.8rem] [&_code]:font-mono">
        {children}
      </div>
      {result && (
        <p className="mt-auto pt-2 border-t border-dashed border-neutral-300 dark:border-neutral-700 font-custom2 text-sm font-medium text-neutral-900 dark:text-neutral-100">
          {result}
        </p>
      )}
    </article>
  );
}
