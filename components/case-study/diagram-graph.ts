export interface DiagramNode {
  key: string;
  label: string;
  detail: string;
  kind: string;
  why: string;
  groups: SVGGElement[];
}

export type DiagramRationale = Record<string, string>;

interface DiagramEdge {
  from: string;
  to: string;
  label: string;
  groups: SVGGElement[];
}

export interface DiagramGraph {
  nodes: Map<string, DiagramNode>;
  edges: DiagramEdge[];
}

export interface DiagramLink {
  node: DiagramNode;
  label: string;
}

export interface DiagramSelection {
  node: DiagramNode;
  inputs: DiagramLink[];
  outputs: DiagramLink[];
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

const textOf = (group: SVGGElement) => {
  const text = group.querySelector("text");
  return (text?.querySelector("tspan") ?? text)?.textContent?.trim() ?? "";
};

const addNode = (graph: DiagramGraph, group: SVGGElement, key: string, title: SVGTitleElement, rationale: DiagramRationale) => {
  const existing = graph.nodes.get(key);
  if (existing) {
    existing.groups.push(group);
    return;
  }
  graph.nodes.set(key, {
    key,
    label: textOf(group) || key,
    detail: title.textContent?.trim() ?? "",
    kind: group.classList[1] ?? "",
    why: rationale[key] ?? "",
    groups: [group],
  });
};

const addEdge = (graph: DiagramGraph, group: SVGGElement, ends: { from: string; to: string }) => {
  const existing = graph.edges.find((edge) => edge.from === ends.from && edge.to === ends.to);
  if (existing) {
    existing.groups.push(group);
    return;
  }
  graph.edges.push({ ...ends, label: textOf(group), groups: [group] });
};

const markNode = (node: DiagramNode) =>
  node.groups.forEach((group) => {
    group.dataset.node = node.key;
    group.setAttribute("tabindex", "0");
    group.setAttribute("role", "button");
    group.setAttribute("aria-label", `${node.label}: show details`);
    group.toggleAttribute("data-why", !!node.why);
  });

export const readGraph = (root: HTMLElement, rationale: DiagramRationale): DiagramGraph => {
  const graph: DiagramGraph = { nodes: new Map(), edges: [] };
  root.querySelectorAll<SVGGElement>("svg g[class]").forEach((group) => {
    const key = decodeKey(group);
    if (!key) return;
    const title = group.querySelector<SVGTitleElement>(":scope > title");
    const ends = parseEdgeKey(key);
    if (title) addNode(graph, group, key, title, rationale);
    else if (ends) addEdge(graph, group, ends);
  });
  root.querySelectorAll("svg title").forEach((title) => title.remove());
  graph.nodes.forEach(markNode);
  return graph;
};

export const kindsOf = (graph: DiagramGraph) => {
  const nodes = [...graph.nodes.values()];
  return { kinds: [...new Set(nodes.map((node) => node.kind))], hasRationale: nodes.some((node) => node.why) };
};

const linksOf = (graph: DiagramGraph, edges: DiagramEdge[], end: "from" | "to"): DiagramLink[] =>
  edges.flatMap((edge) => {
    const node = graph.nodes.get(edge[end]);
    return node ? [{ node, label: edge.label }] : [];
  });

export const selectionOf = (graph: DiagramGraph, key: string): DiagramSelection | null => {
  const node = graph.nodes.get(key);
  if (!node) return null;
  return {
    node,
    inputs: linksOf(graph, graph.edges.filter((edge) => edge.to === key), "from"),
    outputs: linksOf(graph, graph.edges.filter((edge) => edge.from === key), "to"),
  };
};

const relatedTo = (graph: DiagramGraph, key: string) => {
  const edges = graph.edges.filter((edge) => edge.from === key || edge.to === key);
  const nodes = new Set([key, ...edges.flatMap((edge) => [edge.from, edge.to])]);
  return { nodes, edges: new Set(edges) };
};

export const applyFocus = (graph: DiagramGraph, focus: string | null, selected: string | null) => {
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

export const nodeKeyAt = (target: EventTarget | null) =>
  target instanceof Element ? (target.closest<SVGGElement>("g[data-node]")?.dataset.node ?? null) : null;
