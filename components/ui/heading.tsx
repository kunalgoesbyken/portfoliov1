import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const SIZES = {
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
  return (
    <Tag
      className={cn(
        "font-custom text-fg font-bold tracking-tight",
        SIZES[size],
        className,
      )}
    >
      <span className="link--elara">{children}</span>
    </Tag>
  );
}

export function Lede({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <p
      className={cn(
        "font-custom2 text-fg-muted max-w-lg text-sm tracking-tight md:text-base",
        className,
      )}
    >
      {children}
    </p>
  );
}
