import type { ReactNode } from "react";
import { Heading, Lede } from "@/components/ui/heading";
import { cn } from "@/lib/utils";

export function Section({
  title,
  description,
  action,
  as = "h2",
  size = "lg",
  className,
  children,
}: {
  title?: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  as?: "h2" | "h3";
  size?: "lg" | "md";
  className?: string;
  children: ReactNode;
}) {
  return (
    <section className={cn("-mx-(--bleed) border-t border-line px-(--bleed) pt-10 pb-2 md:pt-12", className)}>
      {title && (
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Heading as={as} size={size}>
              {title}
            </Heading>
            {description && <Lede className="mt-2">{description}</Lede>}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}
