import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { TechIconTooltip } from "@/components/ui/tech-icon-tooltip";
import { projectLinks } from "@/components/project-links";
import type { OpenSourceProject } from "@/lib/projects-data";

export function CaseStudyHeader({ project, category, summary }: { project: OpenSourceProject; category: string; summary: string }) {
  return (
    <header>
      <Link
        href="/projects"
        className="inline-flex items-center gap-1.5 font-custom2 text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
      >
        <ArrowLeft size={14} aria-hidden="true" /> All projects
      </Link>
      <p className="mt-8 font-custom2 text-xs uppercase tracking-[0.14em] text-neutral-500 dark:text-neutral-400">{category}</p>
      <h1 className="mt-2 font-custom text-5xl md:text-6xl tracking-tight text-neutral-900 dark:text-neutral-50">{project.title}</h1>
      <p className="mt-4 max-w-2xl font-custom2 text-base md:text-lg leading-relaxed text-neutral-700 dark:text-neutral-300">{summary}</p>
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {projectLinks(project).map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="frame-dashed inline-flex items-center gap-2 px-3 py-1.5 font-custom2 text-sm text-neutral-700 dark:text-neutral-300 hover:border-neutral-500 dark:hover:border-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
            >
              {link.icon}
              {link.label}
              <ArrowUpRight size={13} aria-hidden="true" className="opacity-60" />
            </a>
          ))}
        </div>
        <TechIconTooltip tech={project.tech} scope={project.slug} />
      </div>
    </header>
  );
}
