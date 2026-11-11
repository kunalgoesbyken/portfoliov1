import type { ReactNode } from "react";
import { Heading } from "@/components/ui/heading";

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
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <Heading as="h1">{title}</Heading>
      <p className="font-custom2 text-fg-muted mt-3 max-w-md text-sm">
        {message}
      </p>
      <div className="mt-6">{action}</div>
    </div>
  );
}
