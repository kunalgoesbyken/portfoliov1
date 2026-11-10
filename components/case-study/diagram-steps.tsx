"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ChevronDown } from "lucide-react";
import { KindSwatch } from "@/components/case-study/diagram-legend";
import { orderedNodes, selectionOf, type DiagramGraph, type DiagramLink, type DiagramNode } from "@/components/case-study/diagram-graph";

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

function Links({ heading, links, icon, onOpen }: { heading: string; links: DiagramLink[]; icon: React.ReactNode; onOpen: (key: string) => void }) {
  if (links.length === 0) return null;
  return (
    <div className="mt-5">
      <p className="font-custom2 text-xs uppercase tracking-[0.14em] text-neutral-500">{heading}</p>
      <ul className="mt-1 divide-y divide-neutral-200 dark:divide-neutral-800 border-y border-neutral-200 dark:border-neutral-800">
        {links.map(({ node, label }) => (
          <li key={node.key}>
            <button
              type="button"
              onClick={() => onOpen(node.key)}
              className="flex min-h-11 w-full items-center gap-3 py-2 text-left font-custom2 text-sm text-neutral-800 dark:text-neutral-200"
            >
              <span className="text-neutral-400" aria-hidden="true">
                {icon}
              </span>
              <span className="min-w-0 flex-1 break-words">{node.label}</span>
              {label && <span className="max-w-[40%] shrink-0 break-words text-right text-xs text-neutral-500">{label}</span>}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Step({ graph, node, open, onToggle, onOpen }: { graph: DiagramGraph; node: DiagramNode; open: boolean; onToggle: () => void; onOpen: (key: string) => void }) {
  const selection = useMemo(() => selectionOf(graph, node.key), [graph, node.key]);
  const panelId = `step-${node.key.replace(/\W/g, "-")}`;
  return (
    <li id={`${panelId}-row`} className={`transition-colors motion-reduce:transition-none ${open ? "bg-neutral-50 dark:bg-neutral-900/50" : ""}`}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={panelId}
        className="flex min-h-14 w-full items-center gap-3 px-4 py-3 text-left"
      >
        <KindSwatch kind={node.kind} className={node.why ? "stroke-amber-700 dark:stroke-amber-400" : "stroke-neutral-500"} />
        <span className="min-w-0 flex-1">
          <span className="block break-words font-custom2 text-sm text-neutral-900 dark:text-neutral-100">{node.label}</span>
          {node.sub && <span className="block break-words font-custom2 text-xs text-neutral-500">{node.sub}</span>}
        </span>
        <ChevronDown size={16} aria-hidden="true" className={`shrink-0 text-neutral-400 transition-transform motion-reduce:transition-none ${open ? "rotate-180" : ""}`} />
      </button>
      <div
        id={panelId}
        role="region"
        aria-label={node.label}
        inert={!open}
        className={`grid transition-[grid-template-rows] duration-200 motion-reduce:transition-none ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
      >
        <div className="overflow-hidden">
          <div className="px-4 pb-4">
            <p className="font-custom2 text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">{node.detail}</p>
            {node.why && (
              <div className="mt-5 border-l-2 border-amber-700 dark:border-amber-400 pl-4">
                <p className="font-custom2 text-xs uppercase tracking-[0.14em] text-amber-700 dark:text-amber-400">Why this choice</p>
                <p className="mt-2 font-custom2 text-sm leading-relaxed text-neutral-800 dark:text-neutral-200">{node.why}</p>
              </div>
            )}
            {selection && (
              <>
                <Links heading="Receives from" links={selection.inputs} icon={<ArrowLeft size={14} />} onOpen={onOpen} />
                <Links heading="Sends to" links={selection.outputs} icon={<ArrowRight size={14} />} onOpen={onOpen} />
              </>
            )}
          </div>
        </div>
      </div>
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
    <ol ref={rootRef} aria-label="Architecture steps" className="divide-y divide-neutral-200 dark:divide-neutral-800 md:hidden">
      {sections.map(({ zone, nodes }, index) => (
        <li key={`${zone}-${index}`}>
          {zone && graph.zones.get(zone) && (
            <p className="bg-neutral-50 dark:bg-neutral-900/60 px-4 py-2 font-custom2 text-xs uppercase tracking-[0.14em] text-neutral-500">
              {graph.zones.get(zone)}
            </p>
          )}
          <ul className="divide-y divide-neutral-200 dark:divide-neutral-800">
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
