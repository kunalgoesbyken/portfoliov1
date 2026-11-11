import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Collapse({
  open,
  id,
  label,
  className,
  children,
}: {
  open: boolean;
  id?: string;
  label?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      id={id}
      role={label ? "region" : undefined}
      aria-label={label}
      inert={!open}
      className={cn(
        "grid transition-[grid-template-rows,opacity] duration-300 ease-in-out motion-reduce:transition-none",
        open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        className,
      )}
    >
      <div className="overflow-hidden">{children}</div>
    </div>
  );
}
