import { XMLParser } from "fast-xml-parser";
import { parse } from "node-html-parser";
import { MEDIUM_FEED_URL } from "@/lib/social-links";
import type { BlogMeta } from "@/util/mdx_clean";

const REVALIDATE_SECONDS = 3600;
const FETCH_TIMEOUT_MS = 8000;

type FeedItem = {
  title: string;
  link: string;
  pubDate: string;
  category?: string[];
  "content:encoded"?: string;
};

const parser = new XMLParser({ isArray: (name) => name === "item" || name === "category" });

const canonicalUrl = (link: string) => {
  const url = new URL(link);
  return `${url.origin}${url.pathname}`;
};

const firstParagraph = (html: string) => parse(html).querySelector("p")?.text.trim();

const toBlogMeta = (item: FeedItem): BlogMeta => {
  const externalUrl = canonicalUrl(item.link);
  return {
    title: item.title,
    slug: externalUrl.split("/").pop(),
    date: new Date(item.pubDate).toISOString().slice(0, 10),
    description: firstParagraph(item["content:encoded"] ?? ""),
    tags: item.category,
    externalUrl,
  };
};

export const getMediumPosts = async (): Promise<BlogMeta[]> => {
  try {
    const response = await fetch(MEDIUM_FEED_URL, {
      next: { revalidate: REVALIDATE_SECONDS },
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });
    if (!response.ok) throw new Error(`Medium feed responded ${response.status}`);
    const feed = parser.parse(await response.text());
    return ((feed.rss?.channel?.item ?? []) as FeedItem[]).map(toBlogMeta);
  } catch (error) {
    console.warn("Failed to read Medium feed", error);
    return [];
  }
};
