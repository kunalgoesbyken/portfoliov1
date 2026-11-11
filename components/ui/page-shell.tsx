import type { ReactNode } from "react";
import Container from "@/components/containers";
import PageBorder from "@/components/ui/page-border";
import { cn } from "@/lib/utils";

export default function PageShell({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className="overflow-x-clip">
      <Container
        className={cn(
          "min-h-screen px-6 pt-20 [--bleed:0.75rem] sm:px-10 sm:[--bleed:1.75rem] md:p-20 md:pb-10 md:[--bleed:3.5rem]",
          className,
        )}
      >
        <PageBorder side="right" />
        <PageBorder side="left" />
        {children}
      </Container>
    </div>
  );
}
