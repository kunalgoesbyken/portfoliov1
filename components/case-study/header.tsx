import Link from "next/link";
import { Heading } from "@/components/ui/heading";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { TechIconTooltip } from "@/components/ui/tech-icon-tooltip";
import { projectLinks } from "@/components/project-links";
import type { Project } from "@/lib/projects-data";
import type { CaseStudyMeta } from "@/lib/case-studies";

const statusOf = ({ live, crates, pypi }: Project) => {
  if (live) return "Live";
  if (crates || pypi) return "Published package";
  return "Open source";
};

function Facts({ facts }: { facts: [string, string][] }) {
  return (
    <dl className="mt-6 flex flex-wrap gap-x-10 gap-y-3 font-custom2">
      {facts.map(([term, detail]) => (
        <div key={term}>
          <dt className="eyebrow">{term}</dt>
          <dd className="mt-1 text-sm text-fg">{detail}</dd>
        </div>
      ))}
    </dl>
  );
}

export function CaseStudyHeader({ project, meta }: { project: Project; meta: CaseStudyMeta }) {
  const { summary, role, timeline } = meta;
  return (
    <header>
      <Link
        href="/projects"
        className="inline-flex items-center gap-1.5 max-md:py-3 font-custom2 text-sm text-fg-subtle hover:text-fg transition-colors"
      >
        <ArrowLeft size={14} aria-hidden="true" /> All projects
      </Link>
      <p className="mt-8 eyebrow">{project.category}</p>
      <Heading as="h1" size="display" className="mt-2">
        {project.title}
      </Heading>
      <p className="mt-4 max-w-prose font-custom2 text-base md:text-lg leading-relaxed text-fg-body">{summary}</p>
      <Facts facts={[["Role", role], ["Timeline", timeline], ["Status", statusOf(project)]]} />
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-x-6 gap-y-0 md:gap-y-2">
          {projectLinks(project).map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 max-md:py-3 font-custom2 text-sm text-fg link-underline"
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
