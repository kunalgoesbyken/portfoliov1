import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SiMedium } from "react-icons/si";
import PageShell from "@/components/ui/page-shell";
import { Heading, Lede } from "@/components/ui/heading";
import Separator from "@/components/separator";
import { getAllBlogs } from "@/util/mdx_clean";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Blog",
  description: "Thoughts on software engineering, web development, and technology",
};

export default async function BlogIndex() {
  const posts = await getAllBlogs();

  return (
    <PageShell>
      <Heading as="h1">All blogs</Heading>
      <Lede className="mt-1 mb-3 max-w-xl leading-relaxed">
        I am a software engineer with a passion for building scalable and efficient systems. I spend my days crafting
        backend infrastructure while tinkering with ideas after hours.
      </Lede>
      <Separator />

      <div className="mt-3 flex flex-col divide-y divide-dashed divide-line">
        {posts.map((p) => (
          <Link
            key={p.slug}
            href={p.externalUrl ?? `/blog/${p.slug}`}
            {...(p.externalUrl ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className="group flex flex-col gap-2 py-5 outline-none md:flex-row md:items-start md:justify-between md:gap-8"
          >
            <div className="min-w-0 flex-1">
              <div className="mb-1.5 flex items-center gap-3">
                <h2 className="title-link font-custom text-lg font-bold text-fg md:text-xl">{p.title ?? p.slug}</h2>
                {p.externalUrl && <SiMedium aria-label="On Medium" className="size-4 shrink-0 text-fg-faint" />}
              </div>
              {p.description && (
                <p className="line-clamp-2 max-w-2xl font-custom2 text-sm leading-relaxed text-fg-muted">{p.description}</p>
              )}
            </div>

            <div className="flex items-center gap-2 text-fg-subtle transition-colors group-hover:text-fg md:pt-1.5">
              {p.date && <time dateTime={p.date} className="font-custom2 text-sm whitespace-nowrap">{formatDate(p.date)}</time>}
              <ArrowUpRight aria-hidden="true" className="size-4 shrink-0" />
            </div>
          </Link>
        ))}
      </div>
    </PageShell>
  );
}
