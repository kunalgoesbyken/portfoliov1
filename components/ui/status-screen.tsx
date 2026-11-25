import type { ReactNode } from "react";
import { Heading } from "@/components/ui/heading";
import PageShell from "@/components/ui/page-shell";

export function StatusScreen({
  title,
  message,
  action,
}: {
  title: ReactNode;
  message: ReactNode;
  action: ReactNode;
}) {
  return (
    <PageShell className="flex flex-col">
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <Heading as="h1">{title}</Heading>
        <p className="font-custom2 text-fg-muted mt-3 max-w-md text-sm">
          {message}
        </p>
        <div className="mt-6">{action}</div>
      </div>
    </PageShell>
  );
}
