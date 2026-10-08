"use client";

import { useState, type ReactNode } from "react";

/** Client island: only holds the expand/collapse state. Content is server-rendered. */
export function ExpandableItem({ header, children }: { header: ReactNode; children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="group relative rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors duration-200 border border-transparent hover:border-neutral-100 dark:hover:border-neutral-800">
      <div
        className="group/row flex items-start max-md:items-center max-md:relative gap-4 max-md:gap-3 p-4 max-md:px-0 max-md:py-3.5 max-md:min-h-14 cursor-pointer"
        onClick={(e) => {
          // Clicking the company logo link should only navigate.
          if ((e.target as HTMLElement).closest("a")) return;
          setOpen((v) => !v);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOpen((v) => !v);
          }
        }}
        role="button"
        tabIndex={0}
        aria-expanded={open}
      >
        {header}
      </div>

      <div
        className={`grid transition-all duration-300 ease-in-out ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
      >
        <div className="overflow-hidden">{children}</div>
      </div>
    </div>
  );
}
