import { promises as fs } from "fs";
import path from "path";
import matter from "gray-matter";
import { DATA_DIR } from "@/lib/config";
import type { MediaItem } from "@/lib/media";
import { imageSize, type ImageSize } from "@/lib/image-size";

export interface Stat {
  value: string;
  label: string;
}

export interface Screenshot extends MediaItem, ImageSize {}

export interface CaseStudyMeta {
  summary: string;
  category: string;
  role: string;
  timeline: string;
  stats: Stat[];
  stack: string[];
  gallery: Screenshot[];
}

export interface CaseStudy {
  meta: CaseStudyMeta;
  content: string;
}

type Raw = Record<string, unknown>;

const CASE_STUDY_DIR = path.join(DATA_DIR, "projects");

const fail = (slug: string, field: string): never => {
  throw new Error(`Case study "${slug}" has an invalid "${field}" field`);
};

const requireText = (slug: string, field: string, value: unknown): string =>
  typeof value === "string" && value.trim() ? value : fail(slug, field);

const requireList = <T,>(slug: string, field: string, value: unknown): T[] => {
  if (value === undefined) return [];
  return Array.isArray(value) ? value : fail(slug, field);
};

const parseStat = (slug: string, raw: Raw): Stat => ({
  value: requireText(slug, "stats.value", raw.value),
  label: requireText(slug, "stats.label", raw.label),
});

const parseScreenshot = async (slug: string, raw: Raw): Promise<Screenshot> => {
  const src = requireText(slug, "gallery.src", raw.src);
  const caption = requireText(slug, "gallery.caption", raw.caption);
  return { src, caption, ...(await imageSize(src)) };
};

const parseMeta = async (slug: string, data: Raw): Promise<CaseStudyMeta> => ({
  summary: requireText(slug, "summary", data.summary),
  category: requireText(slug, "category", data.category),
  role: requireText(slug, "role", data.role),
  timeline: requireText(slug, "timeline", data.timeline),
  stats: requireList<Raw>(slug, "stats", data.stats).map((raw) => parseStat(slug, raw)),
  stack: requireList<unknown>(slug, "stack", data.stack).map((raw) => requireText(slug, "stack", raw)),
  gallery: await Promise.all(requireList<Raw>(slug, "gallery", data.gallery).map((raw) => parseScreenshot(slug, raw))),
});

export const getCaseStudy = async (slug: string): Promise<CaseStudy> => {
  const raw = await fs.readFile(path.join(CASE_STUDY_DIR, `${slug}.mdx`), "utf-8");
  const { data, content } = matter(raw);
  return { meta: await parseMeta(slug, data), content };
};
