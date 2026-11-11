"use client";

import { useState, type ReactNode } from "react";
import dynamic from "next/dynamic";
import { Collapse } from "@/components/ui/collapse";
import type { TechKey } from "@/lib/tech-icons";

const TechIconTooltip = dynamic(
  () => import("@/components/ui/tech-icon-tooltip").then((m) => ({ default: m.TechIconTooltip })),
  { ssr: false },
);

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
  const toggle = () => {
    setEverOpened(true);
    setOpen((v) => !v);
  };

  return (
    <div className="relative">
      <div
        className="group/row flex cursor-pointer items-start gap-4 rounded-sm py-4 outline-none focus-visible:ring-2 focus-visible:ring-line-hover focus-visible:ring-offset-4 focus-visible:ring-offset-surface max-md:relative max-md:min-h-14 max-md:items-center max-md:gap-3 max-md:py-3.5"
        onClick={(e) => {
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

      <Collapse open={open}>
        <div className="pb-4 md:pl-16">
          {tech && (
            <div className="mb-3 min-h-4">{everOpened && <TechIconTooltip tech={tech} size="sm" scope={scope} />}</div>
          )}
          {children}
        </div>
      </Collapse>
    </div>
  );
}
