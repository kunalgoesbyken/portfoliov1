
import Container from "@/components/containers";
import Separator from "@/components/separator";
import PageBorder from "@/components/ui/page-border";
import { getAllBlogs } from "@/util/mdx_clean";
import type { Metadata } from "next";
import Link from 'next/link';
import { ArrowUpRight } from "lucide-react";
import { SiMedium } from "react-icons/si";

export const metadata: Metadata = {
  title: "Blog | Kunal",
  description: "Thoughts on software engineering, web development, and technology",
};

export default async function BlogIndex() {
  const posts = await getAllBlogs();

  return (

    <Container className="min-h-screen px-8 pt-24 md:p-20 md:pb-10 relative mx-auto">
      <PageBorder side="right" />
      <PageBorder side="left" />
      <div className="max-w-4xl mx-auto ">

        {/* Header */}
        <div className="mb-3">
          <h1 className="text-3xl text-neutral-900 dark:text-neutral-50 md:text-3xl font-bold font-custom tracking-tight ">
            <span className="link--elara">All blogs</span></h1>

          <p className="text-s text-neutral-600 dark:text-neutral-400 leading-relaxed mt-1 tracking-tight font-custom2 max-w-xl">
            I am a software engineer with a passion for building scalable
            and efficient systems. I spend my days crafting backend infrastructure
            while tinkering with ideas after hours.
          </p>
        </div>
        <Separator />

        <div className="flex flex-col divide-y divide-dashed divide-neutral-200 dark:divide-neutral-800 mt-3">
          {posts.map((p) => (
            <Link
              key={p.slug}
              href={p.externalUrl ?? `/blog/${p.slug}`}
              {...(p.externalUrl ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="group flex flex-col md:flex-row md:items-start md:justify-between gap-2 md:gap-8 py-5 outline-none"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1.5">
                  <h2 className="title-link text-lg md:text-xl font-bold font-custom text-neutral-900 dark:text-neutral-100">
                    {p.title ?? p.slug}
                  </h2>
                  {p.externalUrl && (
                    <SiMedium aria-label="On Medium" className="w-4 h-4 shrink-0 text-neutral-400 dark:text-neutral-500" />
                  )}
                </div>

                {p.description && (
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 font-custom2 leading-relaxed line-clamp-2 max-w-2xl">
                    {p.description}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 md:pt-1.5 text-neutral-500 dark:text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-neutral-100 transition-colors">
                {p.date && (
                  <time className="text-sm font-custom2 whitespace-nowrap">
                    {new Date(p.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </time>
                )}
                <ArrowUpRight aria-hidden="true" className="w-4 h-4 shrink-0" />
              </div>
            </Link>
          ))}
        </div>

      </div>
    </Container>
  );
}
