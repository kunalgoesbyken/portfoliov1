"use client";

import { memo, useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { DiagramPanel } from "@/components/case-study/diagram-panel";
import { DiagramLegend } from "@/components/case-study/diagram-legend";
import {
  applyFocus,
  kindsOf,
  nodeKeyAt,
  readGraph,
  selectionOf,
  type DiagramGraph,
  type DiagramNode,
  type DiagramRationale,
  type DiagramSelection,
} from "@/components/case-study/diagram-graph";

interface DiagramExplorerProps {
  title: string;
  lightSvg: string;
  darkSvg: string;
  rationale: DiagramRationale;
}

const SvgLayers = memo(function SvgLayers({ lightSvg, darkSvg }: { lightSvg: string; darkSvg: string }) {
  return (
    <>
      <div className="dark:hidden" dangerouslySetInnerHTML={{ __html: lightSvg }} />
      <div className="hidden dark:block" dangerouslySetInnerHTML={{ __html: darkSvg }} />
    </>
  );
});

export function DiagramExplorer({ title, lightSvg, darkSvg, rationale }: DiagramExplorerProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<DiagramGraph | null>(null);
  const [hovered, setHovered] = useState<DiagramNode | null>(null);
  const [selection, setSelection] = useState<DiagramSelection | null>(null);
  const [legend, setLegend] = useState<ReturnType<typeof kindsOf>>({ kinds: [], hasRationale: false });
  const selectedKey = selection?.node.key ?? null;

  useEffect(() => {
    if (!rootRef.current) return;
    graphRef.current = readGraph(rootRef.current, rationale);
    setLegend(kindsOf(graphRef.current));
  }, [rationale]);

  useEffect(() => {
    if (graphRef.current) applyFocus(graphRef.current, hovered?.key ?? selectedKey, selectedKey);
  }, [hovered, selectedKey]);

  const select = (key: string | null) => {
    const graph = graphRef.current;
    if (!graph || !key) return;
    setSelection((current) => (current?.node.key === key ? null : selectionOf(graph, key)));
  };
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    const key = nodeKeyAt(e.target);
    if (!key) return;
    e.preventDefault();
    select(key);
  };
  const onPointerOver = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    setHovered(graphRef.current?.nodes.get(nodeKeyAt(e.target) ?? "") ?? null);
  };
  const isInsideDiagram = (target: EventTarget | null) => target instanceof Node && !!rootRef.current?.contains(target);

  return (
    <figure className="not-prose my-8 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 md:-mx-8">
      <figcaption className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 px-4 pt-3 font-custom2 text-xs">
        <span className="uppercase tracking-[0.14em] text-neutral-600 dark:text-neutral-400">{title}</span>
        <span className="text-neutral-500" aria-live="polite">
          {hovered ? (
            `${hovered.label}: click for details`
          ) : (
            <>
              <span className="md:hidden">Tap a box for details, swipe to pan</span>
              <span className="max-md:hidden">Hover to trace connections, click a box for details</span>
            </>
          )}
        </span>
      </figcaption>
      <div
        ref={rootRef}
        onClick={(e) => select(nodeKeyAt(e.target))}
        onKeyDown={onKeyDown}
        onPointerOver={onPointerOver}
        onPointerLeave={() => setHovered(null)}
        className="diagram-explorer scrollbar-subtle overflow-x-auto p-4"
      >
        <SvgLayers lightSvg={lightSvg} darkSvg={darkSvg} />
      </div>
      <DiagramLegend kinds={legend.kinds} hasRationale={legend.hasRationale} />
      <DiagramPanel
        title={title}
        selection={selection}
        onSelect={(key) => graphRef.current && setSelection(selectionOf(graphRef.current, key))}
        onClose={() => setSelection(null)}
        keepOpenWithin={isInsideDiagram}
      />
    </figure>
  );
}
