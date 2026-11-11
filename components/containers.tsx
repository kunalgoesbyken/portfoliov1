import { cn } from "@/lib/utils";

const Container = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn("relative mx-auto h-full w-full max-w-4xl bg-surface px-8 sm:px-10 md:px-14", className)}>
    {children}
  </div>
);

export default Container;
