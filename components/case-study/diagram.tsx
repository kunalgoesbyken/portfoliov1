import { promises as fs } from "fs";
import path from "path";
import { DiagramExplorer } from "@/components/case-study/diagram-explorer";

const DIAGRAM_DIR = path.join(process.cwd(), "public", "diagrams");

const readSvg = (name: string, theme: "light" | "dark") => fs.readFile(path.join(DIAGRAM_DIR, `${name}.${theme}.svg`), "utf-8");

export async function Diagram({ name, title }: { name: string; title: string }) {
  const [lightSvg, darkSvg] = await Promise.all([readSvg(name, "light"), readSvg(name, "dark")]);
  return <DiagramExplorer title={title} lightSvg={lightSvg} darkSvg={darkSvg} />;
}
