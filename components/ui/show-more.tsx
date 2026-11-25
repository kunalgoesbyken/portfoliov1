"use client";

import { ChevronDown, ChevronUp } from "lucide-react";

export function ShowMore({
  expanded,
  hiddenCount,
  noun = "",
  onToggle,
  className = "pt-4 pb-6 max-md:pt-0 max-md:pb-2",
}: {
  expanded: boolean;
  hiddenCount: number;
  noun?: string;
  onToggle: () => void;
  className?: string;
}) {
  if (hiddenCount <= 0) return null;
  const Icon = expanded ? ChevronUp : ChevronDown;
  const label = noun ? `${noun}${hiddenCount > 1 ? "s" : ""}` : "";
  return (
    <div className={`flex justify-center ${className}`}>
      <button
        type="button"
        aria-expanded={expanded}
        onClick={onToggle}
        className="text-toggle gap-1.5 max-md:min-h-12 max-md:w-full max-md:border max-md:text-sm"
      >
        {expanded
          ? "Show less"
          : `Show ${hiddenCount} more${label ? ` ${label}` : ""}`}
        <Icon aria-hidden="true" className="size-3.5" />
      </button>
    </div>
  );
}
