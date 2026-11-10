"use client";

import { memo, useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { X } from "lucide-react";

interface DiagramNode {
  key: string;
  label: string;
  detail: string;
  groups: SVGGElement[];
}

interface DiagramEdge {
  from: string;
  to: string;
  groups: SVGGElement[];
}

interface DiagramGraph {
  nodes: Map<string, DiagramNode>;
  edges: DiagramEdge[];
}

interface DiagramExplorerProps {
  title: string;
  lightSvg: string;
  darkSvg: string;
}

const EDGE_ARROW = " -> ";
const EDGE_INDEX_SUFFIX = ")[";

const decodeKey = (group: Element) => {
  const token = group.classList[0];
  if (!token) return null;
  try {
    return new DOMParser().parseFromString(atob(token), "text/html").documentElement.textContent;
  } catch {
    return null;
  }
};

const parseEdgeKey = (key: string) => {
  const open = key.indexOf("(");
  if (open === -1 || !key.includes(EDGE_ARROW)) return null;
  const scope = key.slice(0, open);
  const [from, to] = key.slice(open + 1, key.lastIndexOf(EDGE_INDEX_SUFFIX)).split(EDGE_ARROW);
  return from && to ? { from: scope + from, to: scope + to } : null;
};

const addNode = (graph: DiagramGraph, group: SVGGElement, key: string, title: SVGTitleElement) => {
  const existing = graph.nodes.get(key);
  if (existing) {
    existing.groups.push(group);
    return;
  }
  const text = group.querySelector("text");
  const label = (text?.querySelector("tspan") ?? text)?.textContent?.trim() || key;
  graph.nodes.set(key, { key, label, detail: title.textContent?.trim() ?? "", groups: [group] });
};

const addEdge = (graph: DiagramGraph, group: SVGGElement, ends: { from: string; to: string }) => {
  const existing = graph.edges.find((edge) => edge.from === ends.from && edge.to === ends.to);
  if (existing) {
    existing.groups.push(group);
    return;
  }
  graph.edges.push({ ...ends, groups: [group] });
};

const readGraph = (root: HTMLElement): DiagramGraph => {
  const graph: DiagramGraph = { nodes: new Map(), edges: [] };
  root.querySelectorAll<SVGGElement>("svg g[class]").forEach((group) => {
    const key = decodeKey(group);
    if (!key) return;
    const title = group.querySelector<SVGTitleElement>(":scope > title");
    const ends = parseEdgeKey(key);
    if (title) addNode(graph, group, key, title);
    else if (ends) addEdge(graph, group, ends);
  });
  root.querySelectorAll("svg title").forEach((title) => title.remove());
  graph.nodes.forEach((node) =>
    node.groups.forEach((group) => {
      group.dataset.node = node.key;
      group.setAttribute("tabindex", "0");
      group.setAttribute("role", "button");
      group.setAttribute("aria-label", `${node.label}: show details`);
    }),
  );
  return graph;
};

const relatedTo = (graph: DiagramGraph, key: string) => {
  const edges = graph.edges.filter((edge) => edge.from === key || edge.to === key);
  const nodes = new Set([key, ...edges.flatMap((edge) => [edge.from, edge.to])]);
  return { nodes, edges: new Set(edges) };
};

const applyFocus = (graph: DiagramGraph, focus: string | null, selected: string | null) => {
  const related = focus ? relatedTo(graph, focus) : null;
  graph.nodes.forEach((node) =>
    node.groups.forEach((group) => {
      group.toggleAttribute("data-dim", !!related && !related.nodes.has(node.key));
      group.toggleAttribute("data-selected", node.key === selected);
    }),
  );
  graph.edges.forEach((edge) =>
    edge.groups.forEach((group) => group.toggleAttribute("data-dim", !!related && !related.edges.has(edge))),
  );
};

const nodeKeyAt = (target: EventTarget | null) =>
  target instanceof Element ? (target.closest<SVGGElement>("g[data-node]")?.dataset.node ?? null) : null;

const SvgLayers = memo(function SvgLayers({ lightSvg, darkSvg }: { lightSvg: string; darkSvg: string }) {
  return (
    <>
      <div className="dark:hidden" dangerouslySetInnerHTML={{ __html: lightSvg }} />
      <div className="hidden dark:block" dangerouslySetInnerHTML={{ __html: darkSvg }} />
    </>
  );
});

export function DiagramExplorer({ title, lightSvg, darkSvg }: DiagramExplorerProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<DiagramGraph | null>(null);
  const [hovered, setHovered] = useState<DiagramNode | null>(null);
  const [selected, setSelected] = useState<DiagramNode | null>(null);

  useEffect(() => {
    if (rootRef.current) graphRef.current = readGraph(rootRef.current);
  }, []);

  useEffect(() => {
    if (graphRef.current) applyFocus(graphRef.current, (hovered ?? selected)?.key ?? null, selected?.key ?? null);
  }, [hovered, selected]);

  const nodeAt = (target: EventTarget | null) => graphRef.current?.nodes.get(nodeKeyAt(target) ?? "") ?? null;
  const toggle = (node: DiagramNode | null) => node && setSelected((current) => (current?.key === node.key ? null : node));
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    const node = nodeAt(e.target);
    if (!node) return;
    e.preventDefault();
    toggle(node);
  };
  const onPointerOver = (e: PointerEvent<HTMLDivElement>) => e.pointerType === "mouse" && setHovered(nodeAt(e.target));

  return (
    <figure className="not-prose my-8 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
      <figcaption className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 px-4 pt-3 font-custom2 text-xs">
        <span className="uppercase tracking-[0.14em] text-neutral-600 dark:text-neutral-400">{title}</span>
        <span className="text-neutral-500" aria-live="polite">
          {hovered && !selected ? (
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
        onClick={(e) => toggle(nodeAt(e.target))}
        onKeyDown={onKeyDown}
        onPointerOver={onPointerOver}
        onPointerLeave={() => setHovered(null)}
        className="diagram-explorer scrollbar-subtle overflow-x-auto p-4"
      >
        <SvgLayers lightSvg={lightSvg} darkSvg={darkSvg} />
      </div>
      {selected && (
        <div className="relative mx-4 mb-4 rounded-md border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 p-4 pr-10">
          <p className="font-custom2 text-sm font-semibold text-neutral-900 dark:text-neutral-100">{selected.label}</p>
          <p className="mt-1 font-custom2 text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">{selected.detail}</p>
          <button
            type="button"
            onClick={() => setSelected(null)}
            aria-label="Close details"
            className="absolute right-3 top-3 cursor-pointer text-neutral-500 transition-colors hover:text-neutral-900 dark:hover:text-neutral-100"
          >
            <X size={16} />
          </button>
        </div>
      )}
    </figure>
  );
}
