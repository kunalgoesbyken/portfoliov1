import type { ReactNode } from "react";
import { Heading, Lede } from "@/components/ui/heading";
import { cn } from "@/lib/utils";

export function Section({
  id,
  title,
  description,
  action,
  as = "h2",
  size = "lg",
  className,
  children,
}: {
  id?: string;
  title?: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  as?: "h2" | "h3";
  size?: "lg" | "md";
  className?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className={cn("-mx-(--bleed) scroll-mt-24 border-t border-line px-(--bleed) pt-10 pb-2 md:pt-12", className)}>
      {title && (
        <div className="mb-6 flex items-end justify-between gap-4">
          <div className="min-w-0">
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
