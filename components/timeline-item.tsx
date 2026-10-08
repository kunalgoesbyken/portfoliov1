"use client";

import { useState, type ReactNode } from "react";
import dynamic from "next/dynamic";
import type { TechKey } from "@/lib/tech-icons";

// The tech icon SVGs live inside the collapsed panel, so they are fetched and
// rendered on first expand instead of being serialized into the page twice.
const TechIconTooltip = dynamic(
  () => import("@/components/ui/tech-icon-tooltip").then((m) => ({ default: m.TechIconTooltip })),
  { ssr: false },
);

/** Client island: only holds the expand/collapse state. Content is server-rendered. */
export function ExpandableItem({
  header,
  children,
  tech,
  scope,
}: {
  header: ReactNode;
  children: ReactNode;
  tech?: TechKey[];
  scope: string;
}) {
  const [open, setOpen] = useState(false);
  const [everOpened, setEverOpened] = useState(false);
  const toggle = () =>
    setOpen((v) => {
      if (!v) setEverOpened(true);
      return !v;
    });

  return (
    <div className="group relative rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors duration-200 border border-transparent hover:border-neutral-100 dark:hover:border-neutral-800">
      <div
        className="group/row flex items-start max-md:items-center max-md:relative gap-4 max-md:gap-3 p-4 max-md:px-0 max-md:py-3.5 max-md:min-h-14 cursor-pointer"
        onClick={(e) => {
          // Clicking the company logo link should only navigate.
          if ((e.target as HTMLElement).closest("a")) return;
          toggle();
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            toggle();
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
        <div className="overflow-hidden">
          <div className="px-4 pb-4 max-md:px-0 md:pl-20 md:pr-4">
            {tech && (
              <div className="mb-3 min-h-4">
                {everOpened && <TechIconTooltip tech={tech} size="sm" scope={scope} />}
              </div>
            )}
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
