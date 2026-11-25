import { Children, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export function InlineList({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <span className={cn("block overflow-hidden", className)}>
      <span className="-ml-4 flex flex-wrap gap-y-1">
        {Children.map(children, (child) => (
          <span>
            <span aria-hidden="true" className="text-fg-faint inline-block w-4 text-center">
              ·
            </span>
            {child}
          </span>
        ))}
      </span>
    </span>
  );
}
