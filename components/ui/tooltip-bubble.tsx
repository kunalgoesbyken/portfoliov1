import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function TooltipBubble({
  side = "top",
  children,
}: {
  side?: "top" | "bottom";
  children: ReactNode;
}) {
  const top = side === "top";
  return (
    <span
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute left-1/2 z-20 hidden -translate-x-1/2 group-hover/tip:block group-focus-visible/tip:block",
        top ? "bottom-full mb-2" : "top-full mt-0.5",
      )}
    >
      <span className="border-line-strong bg-muted font-custom2 text-fg relative block rounded-md border px-2 py-1 text-[10px] font-medium whitespace-nowrap shadow-lg">
        {children}
        <span
          aria-hidden="true"
          className={cn(
            "border-line-strong bg-muted absolute left-1/2 size-2 -translate-x-1/2 rotate-45",
            top ? "-bottom-1 border-r border-b" : "-top-1 border-t border-l",
          )}
        />
      </span>
    </span>
  );
}
