import type { Stat } from "@/lib/case-studies";

export function StatStrip({ stats }: { stats: Stat[] }) {
  if (stats.length === 0) return null;
  return (
    <dl className="mt-10 grid grid-cols-2 gap-y-8 md:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.label} className="flex flex-col gap-1.5 border-l border-line pl-4 pr-3">
          <dt className="order-2 font-custom2 text-xs leading-snug text-fg-subtle">{stat.label}</dt>
          <dd className="order-1 font-custom text-3xl font-bold tracking-tight text-fg md:text-4xl">{stat.value}</dd>
        </div>
      ))}
    </dl>
  );
}
