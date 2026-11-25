import { promises as fs } from "fs";
import path from "path";
import { DiagramExplorer } from "@/components/case-study/diagram-explorer";
import { DIAGRAM_LAYOUTS, type DiagramLayout, type DiagramRationale, type DiagramSize } from "@/components/case-study/diagram-graph";
import { DATA_DIR } from "@/lib/config";

const DIAGRAM_DIR = path.join(process.cwd(), "public", "diagrams");
const RATIONALE_DIR = path.join(DATA_DIR, "projects", "diagrams");

const readRationale = async (name: string): Promise<DiagramRationale> => {
  const raw = await fs.readFile(path.join(RATIONALE_DIR, `${name}.why.json`), "utf-8").catch(() => null);
  return raw ? JSON.parse(raw) : {};
};

const VIEW_BOX = /viewBox="[-\d.]+ [-\d.]+ ([\d.]+) ([\d.]+)"/;

const readSize = async (name: string, layout: DiagramLayout): Promise<DiagramSize> => {
  const file = path.join(DIAGRAM_DIR, `${name}.${layout}.light.svg`);
  const [, width, height] = (await fs.readFile(file, "utf-8")).match(VIEW_BOX) ?? [];
  if (!width || !height) throw new Error(`${file} has no viewBox`);
  return { width: Number(width), height: Number(height) };
};

export async function Diagram({ name, title }: { name: string; title: string }) {
  const [rationale, ...sizes] = await Promise.all([readRationale(name), ...DIAGRAM_LAYOUTS.map((layout) => readSize(name, layout))]);
  const sizeOf = Object.fromEntries(DIAGRAM_LAYOUTS.map((layout, index) => [layout, sizes[index]])) as Record<DiagramLayout, DiagramSize>;
  return <DiagramExplorer name={name} title={title} rationale={rationale} sizes={sizeOf} />;
}
