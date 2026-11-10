import { promises as fs } from "fs";
import path from "path";
import { DiagramExplorer } from "@/components/case-study/diagram-explorer";
import type { DiagramRationale } from "@/components/case-study/diagram-graph";
import { DATA_DIR } from "@/lib/config";

const DIAGRAM_DIR = path.join(process.cwd(), "public", "diagrams");
const RATIONALE_DIR = path.join(DATA_DIR, "projects", "diagrams");

const readSvg = (name: string, theme: "light" | "dark") => fs.readFile(path.join(DIAGRAM_DIR, `${name}.${theme}.svg`), "utf-8");

const readRationale = async (name: string): Promise<DiagramRationale> => {
  const file = path.join(RATIONALE_DIR, `${name}.why.json`);
  const raw = await fs.readFile(file, "utf-8").catch(() => null);
  return raw ? JSON.parse(raw) : {};
};

export async function Diagram({ name, title }: { name: string; title: string }) {
  const [lightSvg, darkSvg, rationale] = await Promise.all([readSvg(name, "light"), readSvg(name, "dark"), readRationale(name)]);
  return <DiagramExplorer title={title} lightSvg={lightSvg} darkSvg={darkSvg} rationale={rationale} />;
}
