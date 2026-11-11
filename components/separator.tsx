import { cn } from "@/lib/utils";

export default function Separator({ className, fullWidth = false }: { className?: string; fullWidth?: boolean }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "absolute right-6 hidden h-px bg-pattern opacity-90 md:block dark:opacity-15",
        fullWidth ? "left-0" : "w-[53rem]",
        className,
      )}
    />
  );
}
