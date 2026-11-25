"use client";

import { memo, useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from "react";
import { DiagramPanel } from "@/components/case-study/diagram-panel";
import { DiagramLegend } from "@/components/case-study/diagram-legend";
import {
  DIAGRAM_LAYOUTS,
  MIN_DIAGRAM_SCALE,
  applyFocus,
  kindsOf,
  nodeKeyAt,
  pickLayout,
  readGraph,
  selectionOf,
  type DiagramGraph,
  type DiagramLayout,
  type DiagramNode,
  type DiagramRationale,
  type DiagramSelection,
  type DiagramSize,
} from "@/components/case-study/diagram-graph";

interface DiagramExplorerProps {
  name: string;
  title: string;
  rationale: DiagramRationale;
  sizes: Record<DiagramLayout, DiagramSize>;
}

interface SvgPair {
  light: string;
  dark: string;
}

const LAYOUT_GUESS: Record<DiagramLayout, string> = { wide: "max-md:hidden", tall: "md:hidden" };

const fetchSvg = (name: string, layout: DiagramLayout, theme: keyof SvgPair) =>
  fetch(`/diagrams/${name}.${layout}.${theme}.svg`).then((res) => (res.ok ? res.text() : Promise.reject(new Error(res.statusText))));

const sizeStyle = ({ width, height }: DiagramSize): CSSProperties => ({
  width: `min(100%, ${width}px)`,
  minWidth: `${width * MIN_DIAGRAM_SCALE}px`,
  aspectRatio: `${width} / ${height}`,
});

function useContentWidth(ref: React.RefObject<HTMLElement | null>) {
  const [width, setWidth] = useState<number | null>(null);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => entry && setWidth(entry.contentRect.width));
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref]);
  return width;
}

function useLazySvgs(name: string, layout: DiagramLayout | null, rootRef: React.RefObject<HTMLElement | null>) {
  const [loaded, setLoaded] = useState<{ layout: DiagramLayout; svgs: SvgPair } | null>(null);
  useEffect(() => {
    const root = rootRef.current;
    if (!root || !layout) return;
    let cancelled = false;
    const load = () =>
      Promise.all([fetchSvg(name, layout, "light"), fetchSvg(name, layout, "dark")])
        .then(([light, dark]) => !cancelled && setLoaded({ layout, svgs: { light, dark } }))
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
  }, [name, layout, rootRef]);
  return loaded?.layout === layout ? loaded.svgs : null;
}

const SvgLayers = memo(function SvgLayers({ lightSvg, darkSvg }: { lightSvg: string; darkSvg: string }) {
  return (
    <>
      <div className="dark:hidden" dangerouslySetInnerHTML={{ __html: lightSvg }} />
      <div className="hidden dark:block" dangerouslySetInnerHTML={{ __html: darkSvg }} />
    </>
  );
});

export function DiagramExplorer({ name, title, rationale, sizes }: DiagramExplorerProps) {
  const figureRef = useRef<HTMLElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const contentWidth = useContentWidth(rootRef);
  const layout = contentWidth === null ? null : pickLayout(sizes, contentWidth);
  const svgs = useLazySvgs(name, layout, figureRef);
  const graphRef = useRef<DiagramGraph | null>(null);
  const [hovered, setHovered] = useState<DiagramNode | null>(null);
  const [selection, setSelection] = useState<DiagramSelection | null>(null);
  const [legend, setLegend] = useState<ReturnType<typeof kindsOf>>({ kinds: [], hasRationale: false });
  const selectedKey = selection?.node.key ?? null;

  useEffect(() => {
    if (!rootRef.current || !svgs) return;
    graphRef.current = readGraph(rootRef.current, rationale);
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
    <figure ref={figureRef} className="not-prose my-8 rounded-lg border border-line bg-surface-raised max-md:-mx-(--bleed) md:-mx-8">
      <figcaption className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 px-4 pt-3 font-custom2 text-xs">
        <span className="eyebrow text-fg-muted">{title}</span>
        <span className="text-fg-subtle" aria-live="polite">
          {hovered ? (
            `${hovered.label}: click for details`
          ) : (
            <>
              <span className="md:hidden">Tap a box for details</span>
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
        className="diagram-explorer scrollbar-subtle overflow-x-auto p-4 max-md:px-2"
      >
        {layout ? (
          <div aria-hidden={!svgs} className="diagram-canvas" style={sizeStyle(sizes[layout])}>
            {svgs && <SvgLayers lightSvg={svgs.light} darkSvg={svgs.dark} />}
          </div>
        ) : (
          DIAGRAM_LAYOUTS.map((guess) => (
            <div key={guess} aria-hidden="true" className={`diagram-canvas ${LAYOUT_GUESS[guess]}`} style={sizeStyle(sizes[guess])} />
          ))
        )}
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
