import { promises as fs } from "fs";
import path from "path";
import matter from "gray-matter";
import { DATA_DIR } from "@/lib/config";
import { getMediumPosts } from "@/util/medium";
import { toIsoDate } from "@/lib/utils";

export type BlogMeta = {
  title?: string;
  slug?: string;
  date?: string;
  description?: string;
  image?: string;
  tags?: string[];
  externalUrl?: string;
};

export type Blog = {
  content: string;
  data: BlogMeta;
};

const MDX_EXTENSION = /\.mdx$/i;

const CACHE = new Map<string, Blog>();

const normalizeSlug = (slug: string) => slug.replace(MDX_EXTENSION, "");

const isValidSlug = (slug: string) => path.basename(slug) === slug && !slug.includes("..");

const parseBlog = (raw: string, slug: string): Blog => {
  const { content, data } = matter(raw);
  const meta = data as BlogMeta;
  return { content, data: { ...meta, slug: meta.slug ?? slug, date: toIsoDate(meta.date) } };
};

export const getSingleBlog = async (slug: string): Promise<Blog> => {
  const key = normalizeSlug(slug);
  if (!isValidSlug(key)) throw new Error("Invalid slug");

  const cached = process.env.NODE_ENV !== "development" && CACHE.get(key);
  if (cached) return cached;

  const blog = parseBlog(await fs.readFile(path.join(DATA_DIR, `${key}.mdx`), "utf-8"), key);
  CACHE.set(key, blog);
  return blog;
};

const byDateDesc = (a: BlogMeta, b: BlogMeta) => {
  if (!a.date || !b.date) return Number(!a.date) - Number(!b.date);
  return b.date.localeCompare(a.date);
};

const getLocalBlogs = async (): Promise<BlogMeta[]> => {
  const files = (await fs.readdir(DATA_DIR)).filter((file) => MDX_EXTENSION.test(file));
  const results = await Promise.allSettled(files.map((file) => getSingleBlog(file)));
  results
    .filter((result): result is PromiseRejectedResult => result.status === "rejected")
    .forEach(({ reason }) => console.warn("Failed to read blog", reason));
  return results.flatMap((result) => (result.status === "fulfilled" ? [result.value.data] : []));
};

export const getAllBlogs = async (): Promise<BlogMeta[]> => {
  const [local, remote] = await Promise.all([getLocalBlogs(), getMediumPosts()]);
  const written = new Set(local.map((post) => post.externalUrl));
  return [...local, ...remote.filter((post) => !written.has(post.externalUrl))].sort(byDateDesc);
};
