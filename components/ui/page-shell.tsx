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
          "min-h-screen px-6 pt-20 sm:px-10 md:p-20 md:pb-10",
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
