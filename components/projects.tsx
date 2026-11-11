"use client";

import { useState, type MouseEvent, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DEPLOYED_PROJECTS, OPEN_SOURCE_PROJECTS, projectPath, type Project } from "@/lib/projects-data";
import { TechIconTooltip } from "@/components/ui/tech-icon-tooltip";
import { Section } from "@/components/ui/section";
import { ShowMore } from "@/components/ui/show-more";
import { projectLinks, type ProjectLink } from "@/components/project-links";
import { cn } from "@/lib/utils";
import { IMAGE_QUALITY, LCP_IMAGE_PROPS } from "@/lib/image";

const PREVIEW_COUNT = 2;

const MOBILE_GRID = "grid grid-cols-2 gap-3 max-md:[&>:last-child:nth-child(odd)]:col-span-2";

const MEDIA_FRAME_CLASS =
  "relative aspect-video w-full shrink-0 overflow-hidden motion-reduce:transition-none md:rounded-lg md:border md:border-line md:transition-[translate,border-color] md:duration-200 md:group-hover:-translate-y-0.5 md:group-hover:border-line-hover";

const LINK_CLASS = {
  desktop: "icon-btn-ghost",
  mobile: "frame-dashed inline-flex size-11 items-center justify-center text-fg-body transition-colors hover:border-line-hover",
};

function CardShell({ href, children }: { href: string; children: ReactNode }) {
  const router = useRouter();
  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest("a, button")) return;
    if (window.getSelection()?.toString()) return;
    router.push(href);
  };

  return (
    <div onClick={handleClick} className="group flex h-full min-w-0 cursor-pointer flex-col max-md:overflow-hidden max-md:frame-dashed">
      {children}
    </div>
  );
}

function LinkIcons({ name, links, variant }: { name: string; links: ProjectLink[]; variant: keyof typeof LINK_CLASS }) {
  return (
    <div className={variant === "desktop" ? "hidden gap-3 md:flex" : "flex gap-2 pt-3 md:hidden"}>
      {links.map((link) => (
        <a
          key={link.href}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${link.label} for ${name}`}
          className={LINK_CLASS[variant]}
        >
          {link.icon}
        </a>
      ))}
    </div>
  );
}

function CardBody({ project }: { project: Project }) {
  const links = projectLinks(project);
  return (
    <div className="flex min-w-0 flex-grow flex-col max-md:p-3">
      <div className="mb-1 flex items-center justify-between gap-3 md:mb-2">
        <h3 className="flex min-w-0 font-custom text-base font-bold text-fg md:text-lg">
          <Link href={projectPath(project.slug)} className="title-link truncate outline-none max-md:-my-2.5 max-md:py-2.5">
            {project.title}
          </Link>
        </h3>
        <LinkIcons name={project.title} links={links} variant="desktop" />
      </div>
      <p className="mb-3 max-w-prose font-custom2 text-xs leading-relaxed text-fg-muted max-md:line-clamp-3 md:mb-4 md:text-sm">
        {project.description}
      </p>
      <p className="mt-auto mb-2 font-custom2 text-xs font-medium text-fg-subtle max-md:hidden">Tech stack</p>
      <div className="max-md:mt-auto">
        <TechIconTooltip tech={project.tech} scope={project.title} />
      </div>
      <LinkIcons name={project.title} links={links} variant="mobile" />
    </div>
  );
}

function ProjectCard({ project, layout, priority = false }: { project: Project; layout: "featured" | "row"; priority?: boolean }) {
  const featured = layout === "featured";
  const media = (
    <div className={cn(MEDIA_FRAME_CLASS, featured ? "md:mb-4" : "md:w-52")}>
      <Image
        src={project.src}
        alt={project.title}
        fill
        sizes={featured ? "(max-width: 768px) 50vw, 448px" : "(max-width: 768px) 50vw, 208px"}
        quality={featured ? IMAGE_QUALITY.card : IMAGE_QUALITY.thumb}
        {...(priority ? LCP_IMAGE_PROPS : {})}
        className={featured ? "object-cover object-top" : "object-cover"}
      />
    </div>
  );

  return (
    <CardShell href={projectPath(project.slug)}>
      {featured ? (
        <>
          {media}
          <CardBody project={project} />
        </>
      ) : (
        <div className="flex h-full flex-col-reverse md:flex-row md:items-start md:gap-8">
          <CardBody project={project} />
          {media}
        </div>
      )}
    </CardShell>
  );
}

export default function Projects({ full = false }: { full?: boolean }) {
  const [showAll, setShowAll] = useState(false);
  const expanded = showAll || full;
  const deployed = expanded ? DEPLOYED_PROJECTS : DEPLOYED_PROJECTS.slice(0, PREVIEW_COUNT);
  const hiddenCount = DEPLOYED_PROJECTS.length + OPEN_SOURCE_PROJECTS.length - PREVIEW_COUNT;

  return (
    <div>
      <div className={cn(MOBILE_GRID, "pb-6 md:gap-x-8 md:gap-y-10 md:pb-8")}>
        {deployed.map((project, idx) => (
          <ProjectCard key={project.slug} project={project} layout="featured" priority={idx === 0} />
        ))}
      </div>

      {expanded && (
        <Section title="More projects" as="h3" size="md">
          <div className={cn(MOBILE_GRID, "mb-4 md:flex md:flex-col md:gap-0 md:divide-y md:divide-dashed md:divide-line md:[&>*]:py-5 md:[&>:first-child]:pt-0")}>
            {OPEN_SOURCE_PROJECTS.map((project) => (
              <ProjectCard key={project.slug} project={project} layout="row" />
            ))}
          </div>
        </Section>
      )}

      {!full && (
        <ShowMore
          expanded={showAll}
          hiddenCount={hiddenCount}
          noun="project"
          onToggle={() => setShowAll((value) => !value)}
          className={showAll ? "pt-2 pb-6" : undefined}
        />
      )}
    </div>
  );
}
