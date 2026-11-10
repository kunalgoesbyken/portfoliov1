import type { Stat } from "@/lib/case-studies";

export function StatStrip({ stats }: { stats: Stat[] }) {
  if (stats.length === 0) return null;
  return (
    <dl className="mt-8 grid grid-cols-2 md:grid-cols-4 border-t border-l border-dashed border-neutral-300 dark:border-neutral-700">
      {stats.map((stat) => (
        <div key={stat.label} className="flex flex-col gap-1 p-4 border-r border-b border-dashed border-neutral-300 dark:border-neutral-700">
          <dt className="order-2 font-custom2 text-xs leading-snug text-neutral-500 dark:text-neutral-400">{stat.label}</dt>
          <dd className="order-1 font-custom text-2xl md:text-3xl tracking-tight text-neutral-900 dark:text-neutral-50">{stat.value}</dd>
        </div>
      ))}
    </dl>
  );
}
