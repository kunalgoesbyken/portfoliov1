"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { KindSwatch } from "@/components/case-study/diagram-legend";
import { DiagramNodeDetail } from "@/components/case-study/diagram-detail";
import { Collapse } from "@/components/ui/collapse";
import { orderedNodes, selectionOf, type DiagramGraph, type DiagramNode } from "@/components/case-study/diagram-graph";

interface Section {
  zone: string;
  nodes: DiagramNode[];
}

const sectionsOf = (graph: DiagramGraph): Section[] =>
  orderedNodes(graph).reduce<Section[]>((sections, node) => {
    const last = sections[sections.length - 1];
    if (last && last.zone === node.zone) last.nodes.push(node);
    else sections.push({ zone: node.zone, nodes: [node] });
    return sections;
  }, []);

function Step({ graph, node, open, onToggle, onOpen }: { graph: DiagramGraph; node: DiagramNode; open: boolean; onToggle: () => void; onOpen: (key: string) => void }) {
  const selection = useMemo(() => selectionOf(graph, node.key), [graph, node.key]);
  const panelId = `step-${node.key.replace(/\W/g, "-")}`;
  return (
    <li id={`${panelId}-row`} className={`transition-colors motion-reduce:transition-none ${open ? "bg-surface-alt/60" : ""}`}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={panelId}
        className="flex min-h-14 w-full items-center gap-3 px-4 py-3 text-left"
      >
        <KindSwatch kind={node.kind} className={node.why ? "stroke-accent" : "stroke-fg-subtle"} />
        <span className="min-w-0 flex-1">
          <span className="block break-words font-custom2 text-sm text-fg">{node.label}</span>
          {node.sub && <span className="block break-words font-custom2 text-xs text-fg-subtle">{node.sub}</span>}
        </span>
        <ChevronDown size={16} aria-hidden="true" className={`shrink-0 text-fg-faint transition-transform motion-reduce:transition-none ${open ? "rotate-180" : ""}`} />
      </button>
      <Collapse open={open} id={panelId} label={node.label} className="duration-200">
        <div className="px-4 pb-4">
          <DiagramNodeDetail node={node} selection={selection} onSelect={onOpen} />
        </div>
      </Collapse>
    </li>
  );
}

export function DiagramSteps({ graph }: { graph: DiagramGraph }) {
  const [openKey, setOpenKey] = useState<string | null>(null);
  const rootRef = useRef<HTMLOListElement>(null);
  const sections = useMemo(() => sectionsOf(graph), [graph]);

  useEffect(() => {
    if (!openKey) return;
    const row = rootRef.current?.querySelector(`[id="step-${openKey.replace(/\W/g, "-")}-row"]`);
    row?.scrollIntoView({ block: "nearest" });
  }, [openKey]);

  return (
    <ol ref={rootRef} aria-label="Architecture steps" className="divide-y divide-line md:hidden">
      {sections.map(({ zone, nodes }, index) => (
        <li key={`${zone}-${index}`}>
          {zone && graph.zones.get(zone) && (
            <p className="bg-surface-alt/60 px-4 py-2 eyebrow">
              {graph.zones.get(zone)}
            </p>
          )}
          <ul className="divide-y divide-line">
            {nodes.map((node) => (
              <Step
                key={node.key}
                graph={graph}
                node={node}
                open={openKey === node.key}
                onToggle={() => setOpenKey((current) => (current === node.key ? null : node.key))}
                onOpen={setOpenKey}
              />
            ))}
          </ul>
        </li>
      ))}
    </ol>
  );
}
