import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, readdirSync, rmSync } from "node:fs";
import path from "node:path";

const SOURCE_DIR = path.join("data", "projects", "diagrams");
const OUTPUT_DIR = path.join("public", "diagrams");
const THEMES = ["light", "dark"];
const LAYOUTS = { wide: "right", tall: "down" };
const SHARED = "_classes.d2";
const LAYOUT_FLAGS = [
  "--pad", "12",
  "--elk-nodeNodeBetweenLayers", "28",
  "--elk-edgeNodeBetweenLayers", "16",
  "--elk-padding", "[top=28,left=16,bottom=16,right=16]",
];

const read = (name) => readFileSync(path.join(SOURCE_DIR, name), "utf-8");
const isDiagram = (name) => name.endsWith(".d2") && !name.startsWith("_");

const render = (name, layout, theme) => {
  const input = [`direction: ${LAYOUTS[layout]}`, read(SHARED), read(`_${theme}.d2`), read(name)].join("\n");
  const output = path.join(OUTPUT_DIR, `${path.basename(name, ".d2")}.${layout}.${theme}.svg`);
  execFileSync("d2", [...LAYOUT_FLAGS, "-", output], { input, stdio: ["pipe", "ignore", "inherit"] });
  console.log(output);
};

rmSync(OUTPUT_DIR, { recursive: true, force: true });
mkdirSync(OUTPUT_DIR, { recursive: true });
readdirSync(SOURCE_DIR)
  .filter(isDiagram)
  .forEach((name) => Object.keys(LAYOUTS).forEach((layout) => THEMES.forEach((theme) => render(name, layout, theme))));
