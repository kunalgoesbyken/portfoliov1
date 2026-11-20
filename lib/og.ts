import { readFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

export const OG_SIZE = { width: 1200, height: 630 };

export const readAsset = (...segments: string[]) => readFile(path.join(process.cwd(), ...segments));

export const toPngDataUrl = async (publicPath: string, width: number, height: number) => {
  const png = await sharp(await readAsset("public", publicPath))
    .resize(width * 2, height * 2, { fit: "cover", position: "left top" })
    .png()
    .toBuffer();
  return `data:image/png;base64,${png.toString("base64")}`;
};

export const toLogoDataUrl = async (publicPath: string, maxWidth: number, maxHeight: number) => {
  const { data, info } = await sharp(await readAsset("public", publicPath))
    .trim()
    .resize(maxWidth * 2, maxHeight * 2, { fit: "inside" })
    .png()
    .toBuffer({ resolveWithObject: true });
  return { src: `data:image/png;base64,${data.toString("base64")}`, width: info.width / 2, height: info.height / 2 };
};

export const loadOgFonts = async () => {
  const [serif, sans] = await Promise.all([
    readAsset("assets", "fonts", "InstrumentSerif-Regular.ttf"),
    readAsset("assets", "fonts", "InstrumentSans-Medium.ttf"),
  ]);
  return [
    { name: "Instrument Serif", data: serif, weight: 400 as const, style: "normal" as const },
    { name: "Instrument Sans", data: sans, weight: 500 as const, style: "normal" as const },
  ];
};
