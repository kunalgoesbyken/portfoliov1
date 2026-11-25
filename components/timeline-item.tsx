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
  leading,
  header,
  children,
  tech,
  scope,
}: {
  leading: ReactNode;
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
      <div className="flex items-stretch gap-4 max-md:relative max-md:min-h-14 max-md:gap-3">
        <div className="flex shrink-0 items-start pt-5 max-md:items-center max-md:pt-0">{leading}</div>
        <h3 className="flex min-w-0 flex-1">
          <button
            type="button"
            onClick={toggle}
            aria-expanded={open}
            className="group/row flex min-w-0 flex-1 cursor-pointer items-start rounded-sm py-4 text-left outline-none focus-visible:ring-2 focus-visible:ring-line-hover focus-visible:ring-offset-4 focus-visible:ring-offset-surface max-md:items-center max-md:py-3.5"
          >
            {header}
          </button>
        </h3>
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
