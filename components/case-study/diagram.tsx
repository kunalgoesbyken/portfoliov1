import { promises as fs } from "fs";
import path from "path";
import { DiagramExplorer } from "@/components/case-study/diagram-explorer";
import type { DiagramRationale } from "@/components/case-study/diagram-graph";
import { DATA_DIR } from "@/lib/config";

const DIAGRAM_DIR = path.join(process.cwd(), "public", "diagrams");
const RATIONALE_DIR = path.join(DATA_DIR, "projects", "diagrams");

const readRationale = async (name: string): Promise<DiagramRationale> => {
  const raw = await fs.readFile(path.join(RATIONALE_DIR, `${name}.why.json`), "utf-8").catch(() => null);
  return raw ? JSON.parse(raw) : {};
};

const VIEW_BOX = /viewBox="[-\d.]+ [-\d.]+ ([\d.]+) ([\d.]+)"/;

const aspectRatioOf = (svg: string) => {
  const [, width, height] = svg.match(VIEW_BOX) ?? [];
  return width && height ? `${width} / ${height}` : undefined;
};

const stepCountOf = (svg: string) => svg.split("<title>").length - 1;

export async function Diagram({ name, title }: { name: string; title: string }) {
  const [svg, rationale] = await Promise.all([fs.readFile(path.join(DIAGRAM_DIR, `${name}.light.svg`), "utf-8"), readRationale(name)]);
  return <DiagramExplorer name={name} title={title} rationale={rationale} aspectRatio={aspectRatioOf(svg)} stepCount={stepCountOf(svg)} />;
}
