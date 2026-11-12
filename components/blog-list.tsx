import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SiMedium } from "react-icons/si";
import type { BlogMeta } from "@/util/mdx_clean";
import { formatDate } from "@/lib/utils";

export function BlogList({ posts, as: Title = "h2" }: { posts: BlogMeta[]; as?: "h2" | "h3" }) {
  return (
    <div className="flex flex-col divide-y divide-dashed divide-line [&>:first-child]:pt-0">
      {posts.map((p) => (
        <Link
          key={p.slug}
          href={p.externalUrl ?? `/blog/${p.slug}`}
          {...(p.externalUrl ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          className="group flex flex-col gap-2 py-5 outline-none md:flex-row md:items-start md:justify-between md:gap-8"
        >
          <div className="min-w-0 flex-1">
            <div className="mb-1.5 flex items-center gap-3">
              <Title className="title-link font-custom text-lg font-bold text-fg md:text-xl">{p.title ?? p.slug}</Title>
              {p.externalUrl && <SiMedium aria-label="On Medium" className="size-4 shrink-0 text-fg-faint" />}
            </div>
            {p.description && (
              <p className="line-clamp-2 max-w-prose font-custom2 text-sm leading-relaxed text-fg-muted">{p.description}</p>
            )}
          </div>

          <div className="flex items-center gap-2 text-fg-subtle transition-colors group-hover:text-fg md:pt-1.5">
            {p.date && <time dateTime={p.date} className="font-custom2 text-sm whitespace-nowrap">{formatDate(p.date)}</time>}
            <ArrowUpRight aria-hidden="true" className="size-4 shrink-0" />
          </div>
        </Link>
      ))}
    </div>
  );
}
