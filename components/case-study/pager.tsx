import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { ALL_PROJECTS, projectPath, type Project } from "@/lib/projects-data";

const neighbours = (slug: string) => {
  const index = ALL_PROJECTS.findIndex((p) => p.slug === slug);
  const at = (offset: number) => ALL_PROJECTS[(index + offset + ALL_PROJECTS.length) % ALL_PROJECTS.length];
  return [at(-1), at(1)];
};

function PagerLink({ project, direction }: { project: Project; direction: "previous" | "next" }) {
  const isNext = direction === "next";
  return (
    <Link
      href={projectPath(project.slug)}
      className={`group flex flex-col gap-1 py-2 ${isNext ? "items-end text-right" : ""}`}
    >
      <span className="inline-flex items-center gap-1.5 font-custom2 text-xs uppercase tracking-[0.14em] text-neutral-500 dark:text-neutral-400">
        {!isNext && <ArrowLeft size={12} aria-hidden="true" />}
        {isNext ? "Next project" : "Previous project"}
        {isNext && <ArrowRight size={12} aria-hidden="true" />}
      </span>
      <span className="title-link font-custom text-xl md:text-2xl text-neutral-900 dark:text-neutral-50">{project.title}</span>
    </Link>
  );
}

export function ProjectPager({ slug }: { slug: string }) {
  const [previous, next] = neighbours(slug);
  return (
    <nav aria-label="More projects" className="mt-14 grid grid-cols-2 gap-6 border-t border-neutral-200 dark:border-neutral-800 pt-6">
      {previous && <PagerLink project={previous} direction="previous" />}
      {next && <PagerLink project={next} direction="next" />}
    </nav>
  );
}
