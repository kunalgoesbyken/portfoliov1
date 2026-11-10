import type { ReactNode } from "react";

interface LegendEntry {
  label: string;
  swatch: ReactNode;
}

const box = (rx: number, dash?: string) => <rect x="1" y="1" width="20" height="12" rx={rx} strokeDasharray={dash} />;

const LEGEND: Record<string, LegendEntry> = {
  client: { label: "Entry point or output", swatch: box(3) },
  service: { label: "Component I built", swatch: box(0.5) },
  store: { label: "Data or state", swatch: <path d="M2 4c0-3 18-3 18 0v6c0 3-18 3-18 0Z M2 4c0 3 18 3 18 0" /> },
  model: { label: "Model", swatch: <path d="M6 1h10l5 6-5 6H6L1 7Z" /> },
  external: { label: "Outside my code", swatch: box(1, "3 2") },
};

const DECISION: LegendEntry = { label: "Design decision, click for why", swatch: box(1) };

function LegendItem({ entry, className }: { entry: LegendEntry; className: string }) {
  return (
    <li className="inline-flex items-center gap-1.5">
      <svg width="22" height="14" viewBox="0 0 22 14" fill="none" strokeWidth="1.5" aria-hidden="true" className={className}>
        {entry.swatch}
      </svg>
      {entry.label}
    </li>
  );
}

export function DiagramLegend({ kinds, hasRationale }: { kinds: string[]; hasRationale: boolean }) {
  const entries = kinds.flatMap((kind) => LEGEND[kind] ?? []);
  return (
    <ul aria-label="Legend" className="flex min-h-9 flex-wrap items-center gap-x-5 gap-y-1.5 border-t border-neutral-200 dark:border-neutral-800 px-4 py-2.5 font-custom2 text-xs text-neutral-500">
      {entries.map((entry) => (
        <LegendItem key={entry.label} entry={entry} className="stroke-neutral-500" />
      ))}
      {hasRationale && <LegendItem entry={DECISION} className="stroke-amber-700 dark:stroke-amber-400" />}
    </ul>
  );
}
