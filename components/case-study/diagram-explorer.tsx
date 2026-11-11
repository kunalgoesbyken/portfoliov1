"use client";

import { memo, useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { DiagramPanel } from "@/components/case-study/diagram-panel";
import { DiagramLegend } from "@/components/case-study/diagram-legend";
import { DiagramSteps } from "@/components/case-study/diagram-steps";
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
  name: string;
  title: string;
  rationale: DiagramRationale;
  aspectRatio?: string;
  stepCount: number;
}

interface SvgPair {
  light: string;
  dark: string;
}

const fetchSvg = (name: string, theme: keyof SvgPair) =>
  fetch(`/diagrams/${name}.${theme}.svg`).then((res) => (res.ok ? res.text() : Promise.reject(new Error(res.statusText))));

function useLazySvgs(name: string, rootRef: React.RefObject<HTMLElement | null>) {
  const [svgs, setSvgs] = useState<SvgPair | null>(null);
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    let cancelled = false;
    const load = () =>
      Promise.all([fetchSvg(name, "light"), fetchSvg(name, "dark")])
        .then(([light, dark]) => !cancelled && setSvgs({ light, dark }))
        .catch(() => {});
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        io.disconnect();
        load();
      },
      { rootMargin: "800px" },
    );
    io.observe(root);
    return () => {
      cancelled = true;
      io.disconnect();
    };
  }, [name, rootRef]);
  return svgs;
}

const SvgLayers = memo(function SvgLayers({ lightSvg, darkSvg }: { lightSvg: string; darkSvg: string }) {
  return (
    <>
      <div className="dark:hidden" dangerouslySetInnerHTML={{ __html: lightSvg }} />
      <div className="hidden dark:block" dangerouslySetInnerHTML={{ __html: darkSvg }} />
    </>
  );
});

export function DiagramExplorer({ name, title, rationale, aspectRatio, stepCount }: DiagramExplorerProps) {
  const figureRef = useRef<HTMLElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const svgs = useLazySvgs(name, figureRef);
  const graphRef = useRef<DiagramGraph | null>(null);
  const [hovered, setHovered] = useState<DiagramNode | null>(null);
  const [selection, setSelection] = useState<DiagramSelection | null>(null);
  const [graph, setGraph] = useState<DiagramGraph | null>(null);
  const [legend, setLegend] = useState<ReturnType<typeof kindsOf>>({ kinds: [], hasRationale: false });
  const selectedKey = selection?.node.key ?? null;

  useEffect(() => {
    if (!rootRef.current || !svgs) return;
    graphRef.current = readGraph(rootRef.current, rationale);
    setGraph(graphRef.current);
    setLegend(kindsOf(graphRef.current));
  }, [rationale, svgs]);

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
    <figure ref={figureRef} className="not-prose my-8 rounded-lg border border-line bg-surface-raised md:-mx-8">
      <figcaption className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 px-4 pt-3 font-custom2 text-xs">
        <span className="eyebrow text-fg-muted">{title}</span>
        <span className="text-fg-subtle" aria-live="polite">
          {hovered ? (
            `${hovered.label}: click for details`
          ) : (
            <>
              <span className="md:hidden">Tap a step for details</span>
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
        className="diagram-explorer scrollbar-subtle overflow-x-auto p-4 max-md:hidden"
      >
        {svgs ? (
          <SvgLayers lightSvg={svgs.light} darkSvg={svgs.dark} />
        ) : (
          <div aria-hidden="true" className="mx-auto w-full min-w-[760px]" style={{ aspectRatio }} />
        )}
      </div>
      {graph ? (
        <DiagramSteps graph={graph} />
      ) : (
        <div className="md:hidden" style={{ minHeight: `${stepCount * 5.25}rem` }} aria-hidden="true" />
      )}
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
