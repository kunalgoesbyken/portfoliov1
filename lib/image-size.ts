import path from "path";
import sharp from "sharp";

const PUBLIC_DIR = path.join(process.cwd(), "public");

export interface ImageSize {
  width: number;
  height: number;
}

export const imageSize = async (src: string): Promise<ImageSize> => {
  const { width, height } = await sharp(path.join(PUBLIC_DIR, src)).metadata();
  if (!width || !height) throw new Error(`Cannot read the size of ${src}`);
  return { width, height };
};
