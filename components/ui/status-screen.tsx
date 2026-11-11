import type { ReactNode } from "react";

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
      <h1 className="font-custom text-fg font-bold">{title}</h1>
      <p className="font-custom2 text-fg-muted mt-3 max-w-md text-sm">
        {message}
      </p>
      <div className="mt-6">{action}</div>
    </div>
  );
}
