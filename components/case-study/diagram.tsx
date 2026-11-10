import rough from "roughjs";
import type { Drawable, Options } from "roughjs/bin/core";
import { Kalam } from "next/font/google";

const hand = Kalam({ weight: ["400", "700"], subsets: ["latin"], display: "swap" });

const KIND_LABELS = {
  client: "Interface",
  service: "Service",
  ai: "Model / AI",
  store: "Storage",
  external: "External",
} as const;

type NodeKind = keyof typeof KIND_LABELS;

interface DiagramNode {
  id: string;
  label: string;
  sub?: string;
  col: number;
  row: number;
  kind: NodeKind;
}

interface DiagramEdge {
  from: string;
  to: string;
  label?: string;
}

interface DiagramProps {
  title: string;
  nodes: DiagramNode[];
  edges: DiagramEdge[];
}

interface Point {
  x: number;
  y: number;
}

const CELL = { w: 216, h: 136 };
const BOX = { w: 172, h: 76 };
const PAD = 28;
const ARROW_GAP = 8;
const ARROW_HEAD = 12;
const ARROW_SPREAD = Math.PI / 7;
const EDGE_LABEL_CHAR_WIDTH = 7;
const EDGE_LABEL_MARGIN = 12;

const generator = rough.generator();

const sketch = (seed: number): Options => ({ seed, roughness: 1.1, bowing: 1.2, strokeWidth: 1.4, hachureGap: 6, fillWeight: 1.2 });

const centerOf = (node: DiagramNode): Point => ({
  x: PAD + node.col * CELL.w + CELL.w / 2,
  y: PAD + node.row * CELL.h + CELL.h / 2,
});

const boxEdgePoint = (center: Point, toward: Point, inset: number): Point => {
  const dx = toward.x - center.x;
  const dy = toward.y - center.y;
  const scale = Math.min((BOX.w / 2 + inset) / Math.abs(dx || 1e-6), (BOX.h / 2 + inset) / Math.abs(dy || 1e-6));
  return { x: center.x + dx * scale, y: center.y + dy * scale };
};

const arrowHead = (tip: Point, from: Point): [number, number][] => {
  const angle = Math.atan2(tip.y - from.y, tip.x - from.x);
  const wing = (offset: number): [number, number] => [
    tip.x - ARROW_HEAD * Math.cos(angle + offset),
    tip.y - ARROW_HEAD * Math.sin(angle + offset),
  ];
  return [wing(ARROW_SPREAD), [tip.x, tip.y], wing(-ARROW_SPREAD)];
};

const labelFits = (label: string, a: Point, b: Point) =>
  Math.hypot(b.x - a.x, b.y - a.y) >= label.length * EDGE_LABEL_CHAR_WIDTH + EDGE_LABEL_MARGIN * 2;

function SketchPaths({ drawable, fillClass }: { drawable: Drawable; fillClass?: string }) {
  return (
    <>
      {drawable.sets.map((set, i) => (
        <path
          key={i}
          d={generator.opsToPath(set)}
          className={set.type === "path" ? "sk-ink" : fillClass}
          fill="none"
        />
      ))}
    </>
  );
}

function NodeShape({ node, seed }: { node: DiagramNode; seed: number }) {
  const c = centerOf(node);
  const box = generator.rectangle(c.x - BOX.w / 2, c.y - BOX.h / 2, BOX.w, BOX.h, {
    ...sketch(seed),
    fill: "currentColor",
    fillStyle: "hachure",
  });
  return (
    <g>
      <SketchPaths drawable={box} fillClass={`sk-fill sk-${node.kind}`} />
      <text x={c.x} y={node.sub ? c.y - 4 : c.y + 6} textAnchor="middle" className="sk-label">
        {node.label}
      </text>
      {node.sub && (
        <text x={c.x} y={c.y + 18} textAnchor="middle" className="sk-sub">
          {node.sub}
        </text>
      )}
    </g>
  );
}

function EdgeShape({ edge, byId, seed }: { edge: DiagramEdge; byId: Map<string, DiagramNode>; seed: number }) {
  const from = byId.get(edge.from);
  const to = byId.get(edge.to);
  if (!from || !to) throw new Error(`Diagram edge ${edge.from} -> ${edge.to} references a missing node`);
  const a = boxEdgePoint(centerOf(from), centerOf(to), ARROW_GAP);
  const b = boxEdgePoint(centerOf(to), centerOf(from), ARROW_GAP);
  const line = generator.line(a.x, a.y, b.x, b.y, sketch(seed));
  const head = generator.linearPath(arrowHead(b, a), sketch(seed));
  const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
  const showLabel = edge.label && labelFits(edge.label, a, b);
  return (
    <g>
      <SketchPaths drawable={line} />
      <SketchPaths drawable={head} />
      {showLabel && (
        <text x={mid.x} y={mid.y - 7} textAnchor="middle" className="sk-edge">
          {edge.label}
        </text>
      )}
    </g>
  );
}

function Legend({ kinds }: { kinds: NodeKind[] }) {
  return (
    <ul className="not-prose flex flex-wrap gap-x-5 gap-y-2 px-4 pb-4 my-0 [&>li]:!m-0 font-custom2 text-xs text-neutral-500 dark:text-neutral-400">
      {kinds.map((kind) => (
        <li key={kind} className="flex items-center gap-2">
          <span className={`sk-swatch sk-${kind}`} aria-hidden="true" />
          {KIND_LABELS[kind]}
        </li>
      ))}
    </ul>
  );
}

export function Diagram({ title, nodes, edges }: DiagramProps) {
  const byId = new Map(nodes.map((node) => [node.id, node]));
  const cols = Math.max(...nodes.map((n) => n.col)) + 1;
  const rows = Math.max(...nodes.map((n) => n.row)) + 1;
  const width = PAD * 2 + cols * CELL.w;
  const height = PAD * 2 + rows * CELL.h;
  const kinds = (Object.keys(KIND_LABELS) as NodeKind[]).filter((kind) => nodes.some((n) => n.kind === kind));

  return (
    <figure className="not-prose sketch my-8 frame-dashed bg-white/60 dark:bg-neutral-900/40">
      <figcaption className="px-4 pt-3 font-custom2 text-xs uppercase tracking-[0.14em] text-neutral-500 dark:text-neutral-400">
        {title}
      </figcaption>
      <div className="overflow-x-auto scrollbar-subtle">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          aria-label={`${title}: ${nodes.map((n) => n.label).join(", ")}`}
          className={`${hand.className} w-full h-auto`}
          style={{ minWidth: Math.min(width, 640) }}
        >
          {edges.map((edge, i) => (
            <EdgeShape key={`${edge.from}-${edge.to}`} edge={edge} byId={byId} seed={nodes.length + i + 1} />
          ))}
          {nodes.map((node, i) => (
            <NodeShape key={node.id} node={node} seed={i + 1} />
          ))}
        </svg>
      </div>
      <p className="md:hidden px-4 pb-2 font-custom2 text-xs text-neutral-400 dark:text-neutral-500">Swipe sideways to see the full diagram.</p>
      <Legend kinds={kinds} />
    </figure>
  );
}
