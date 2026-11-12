import { XMLParser } from "fast-xml-parser";
import { parse } from "node-html-parser";
import { REVALIDATE_SECONDS } from "@/lib/config";
import { MEDIUM_FEED_URL } from "@/lib/social-links";
import { toIsoDate } from "@/lib/utils";
import type { BlogMeta } from "@/util/mdx_clean";

const FETCH_TIMEOUT_MS = 8000;

type FeedItem = {
  title?: unknown;
  link?: unknown;
  pubDate?: unknown;
  category?: unknown[];
  "content:encoded"?: unknown;
};

const parser = new XMLParser({ isArray: (name) => name === "item" || name === "category" });

const text = (value: unknown) => (typeof value === "string" && value.trim() ? value.trim() : undefined);

const toUrl = (value: unknown) => {
  const link = text(value);
  return link && URL.canParse(link) ? new URL(link) : undefined;
};

const firstParagraph = (html: unknown) => {
  const source = text(html);
  return source ? text(parse(source).querySelector("p")?.text) : undefined;
};

const toBlogMeta = (item: FeedItem): BlogMeta[] => {
  const title = text(item.title);
  const url = toUrl(item.link);
  const date = toIsoDate(item.pubDate);
  if (!title || !url || !date) return [];

  const externalUrl = `${url.origin}${url.pathname}`;
  return [
    {
      title,
      slug: url.pathname.split("/").filter(Boolean).pop(),
      date,
      description: firstParagraph(item["content:encoded"]),
      tags: item.category?.flatMap((tag) => text(tag) ?? []),
      externalUrl,
    },
  ];
};

export const getMediumPosts = async (): Promise<BlogMeta[]> => {
  try {
    const response = await fetch(MEDIUM_FEED_URL, {
      next: { revalidate: REVALIDATE_SECONDS },
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });
    if (!response.ok) throw new Error(`Medium feed responded ${response.status}`);
    const items: FeedItem[] = parser.parse(await response.text()).rss?.channel?.item ?? [];
    return items.flatMap(toBlogMeta);
  } catch (error) {
    console.warn("Failed to read Medium feed", error);
    return [];
  }
};
