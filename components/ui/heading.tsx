import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const SIZES = {
  display: "text-5xl md:text-6xl",
  xl: "text-4xl md:text-5xl",
  lg: "text-3xl",
  md: "text-2xl",
} as const;

export function Heading({
  as: Tag = "h2",
  size = "lg",
  className,
  children,
}: {
  as?: "h1" | "h2" | "h3";
  size?: keyof typeof SIZES;
  className?: string;
  children: ReactNode;
}) {
  return <Tag className={cn("font-custom tracking-tight text-balance text-fg", SIZES[size], className)}>{children}</Tag>;
}

export function Lede({ className, children }: { className?: string; children: ReactNode }) {
  return <p className={cn("max-w-prose font-custom2 text-sm text-fg-muted md:text-base", className)}>{children}</p>;
}
