export default function PageBorder({ side }: { side: "left" | "right" }) {
  return (
    <div
      aria-hidden="true"
      className={`absolute ${side === "right" ? "right-0" : "left-0"} top-0 h-full w-3 border-x border-x-pattern bg-[repeating-linear-gradient(315deg,var(--pattern-fg)_0,var(--pattern-fg)_1px,transparent_0,transparent_50%)] bg-[length:10px_10px] opacity-80 md:w-6 dark:opacity-12`}
    />
  );
}
