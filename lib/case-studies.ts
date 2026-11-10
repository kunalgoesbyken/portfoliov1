import { promises as fs } from "fs";
import path from "path";
import matter from "gray-matter";
import { DATA_DIR } from "@/lib/config";
import type { MediaItem } from "@/lib/media";

export interface Stat {
  value: string;
  label: string;
}

export interface CaseStudyMeta {
  summary: string;
  category: string;
  stats: Stat[];
  gallery: MediaItem[];
}

export interface CaseStudy {
  meta: CaseStudyMeta;
  content: string;
}

const CASE_STUDY_DIR = path.join(DATA_DIR, "projects");

const fail = (slug: string, field: string): never => {
  throw new Error(`Case study "${slug}" has an invalid "${field}" field`);
};

const requireText = (slug: string, field: string, value: unknown): string =>
  typeof value === "string" && value.trim() ? value : fail(slug, field);

const parseStat = (slug: string, raw: Record<string, unknown>): Stat => ({
  value: requireText(slug, "stats.value", raw.value),
  label: requireText(slug, "stats.label", raw.label),
});

const parseMedia = (slug: string, raw: Record<string, unknown>): MediaItem => {
  const src = requireText(slug, "gallery.src", raw.src);
  const caption = requireText(slug, "gallery.caption", raw.caption);
  if (raw.type !== "video") return { type: "image", src, caption };
  return { type: "video", src, caption, poster: requireText(slug, "gallery.poster", raw.poster) };
};

const parseList = <T>(slug: string, field: string, value: unknown, parse: (slug: string, raw: Record<string, unknown>) => T): T[] => {
  if (value === undefined) return [];
  if (!Array.isArray(value)) return fail(slug, field);
  return value.map((item) => parse(slug, item));
};

const parseMeta = (slug: string, data: Record<string, unknown>): CaseStudyMeta => ({
  summary: requireText(slug, "summary", data.summary),
  category: requireText(slug, "category", data.category),
  stats: parseList(slug, "stats", data.stats, parseStat),
  gallery: parseList(slug, "gallery", data.gallery, parseMedia),
});

export const getCaseStudy = async (slug: string): Promise<CaseStudy> => {
  const raw = await fs.readFile(path.join(CASE_STUDY_DIR, `${slug}.mdx`), "utf-8");
  const { data, content } = matter(raw);
  return { meta: parseMeta(slug, data), content };
};
