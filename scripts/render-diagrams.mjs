import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";

const SOURCE_DIR = path.join("data", "projects", "diagrams");
const OUTPUT_DIR = path.join("public", "diagrams");
const THEMES = ["light", "dark"];
const SHARED = "_classes.d2";
const LAYOUT_FLAGS = [
  "--pad", "12",
  "--elk-nodeNodeBetweenLayers", "28",
  "--elk-edgeNodeBetweenLayers", "16",
  "--elk-padding", "[top=28,left=16,bottom=16,right=16]",
];

const read = (name) => readFileSync(path.join(SOURCE_DIR, name), "utf-8");
const isDiagram = (name) => name.endsWith(".d2") && !name.startsWith("_");

const render = (name, theme) => {
  const input = [read(SHARED), read(`_${theme}.d2`), read(name)].join("\n");
  const output = path.join(OUTPUT_DIR, `${path.basename(name, ".d2")}.${theme}.svg`);
  execFileSync("d2", [...LAYOUT_FLAGS, "-", output], { input, stdio: ["pipe", "ignore", "inherit"] });
  console.log(output);
};

mkdirSync(OUTPUT_DIR, { recursive: true });
readdirSync(SOURCE_DIR).filter(isDiagram).forEach((name) => THEMES.forEach((theme) => render(name, theme)));
