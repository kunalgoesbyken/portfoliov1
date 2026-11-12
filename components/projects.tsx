"use client";

import { useState, type MouseEvent, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import {
  DEPLOYED_PROJECTS,
  OPEN_SOURCE_PROJECTS,
  projectPath,
  type Project,
} from "@/lib/projects-data";
import { TechIconTooltip } from "@/components/ui/tech-icon-tooltip";
import { Section } from "@/components/ui/section";
import { ShowMore } from "@/components/ui/show-more";
import { projectLinks, type ProjectLink } from "@/components/project-links";
import { cn } from "@/lib/utils";
import { IMAGE_QUALITY, LCP_IMAGE_PROPS } from "@/lib/image";

const PREVIEW_COUNT = 2;

const MOBILE_GRID =
  "grid grid-cols-2 gap-3 max-md:[&>:last-child:nth-child(odd)]:col-span-2";

const FEATURED_GRID =
  "md:-mx-4 md:grid-cols-2 md:gap-0 md:[&>*]:border-dashed md:[&>*]:border-line md:[&>*]:p-4 md:[&>:nth-child(odd)]:border-r md:[&>:nth-child(n+3)]:border-t";

const STRIPES =
  "bg-[repeating-linear-gradient(315deg,var(--pattern-fg)_0,var(--pattern-fg)_1px,transparent_0,transparent_50%)] bg-[length:10px_10px]";

const LINK_CLASS = {
  desktop: "icon-btn-ghost",
  mobile:
    "frame-dashed inline-flex size-11 items-center justify-center text-fg-body transition-colors hover:border-line-hover",
};

function CardShell({ href, children }: { href: string; children: ReactNode }) {
  const router = useRouter();
  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest("a, button")) return;
    if (window.getSelection()?.toString()) return;
    router.push(href);
  };

  return (
    <div
      onClick={handleClick}
      className="group max-md:frame-dashed flex h-full min-w-0 cursor-pointer flex-col max-md:overflow-hidden"
    >
      {children}
    </div>
  );
}

function ProjectPreview({
  project,
  featured,
  priority,
}: {
  project: Project;
  featured: boolean;
  priority: boolean;
}) {
  const sizes = featured
    ? "(max-width: 768px) 45vw, 320px"
    : "(max-width: 768px) 45vw, 180px";
  const quality = featured ? IMAGE_QUALITY.card : IMAGE_QUALITY.thumb;

  return (
    <div
      className={cn(
        "md:border-line md:bg-surface-raised md:group-hover:border-line-strong shrink-0 transition-colors duration-300 motion-reduce:transition-none md:rounded-xl md:border md:p-1",
        featured ? "md:mb-4" : "md:w-56",
      )}
    >
      <div
        className={cn(
          "bg-surface-alt max-md:border-line relative isolate overflow-hidden select-none max-md:border-b md:rounded-lg md:shadow-[inset_0_0_0_1px_var(--line)]",
          featured ? "h-32 md:h-52" : "h-32 md:h-36",
        )}
      >
        <Image
          src={project.src}
          alt=""
          aria-hidden="true"
          fill
          sizes={sizes}
          quality={quality}
          className="-z-10 scale-150 object-cover opacity-25 blur-2xl saturate-150 transition-opacity duration-500 group-hover:opacity-90 motion-reduce:transition-none max-md:hidden dark:opacity-30 dark:group-hover:opacity-80"
        />

        <div
          aria-hidden="true"
          className={cn(
            "absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_at_top,black,transparent_80%)] opacity-70 transition-opacity duration-500 group-hover:opacity-0 motion-reduce:transition-none",
            STRIPES,
          )}
        />

        <span
          className={cn(
            "font-custom2 text-2xs text-fg-subtle absolute top-2 left-2.5 z-10 font-medium whitespace-nowrap max-md:hidden",
            "transition-[left,translate,color] duration-300 motion-reduce:transition-none",
            "group-hover:left-1/2 group-hover:-translate-x-1/2 group-hover:text-white group-hover:[text-shadow:0_1px_2px_rgb(0_0_0/0.6)]",
          )}
        >
          {project.label}
        </span>

        <div
          className={cn(
            "border-line-strong bg-surface-raised/70 absolute bottom-0 left-1/2 w-[86%] -translate-x-1/2 rounded-t-[10px] border border-b-0 p-1 pb-0 backdrop-blur-sm md:w-[82%]",
            "shadow-[0_-12px_32px_-12px_rgb(0_0_0/0.35)] dark:shadow-[0_-12px_32px_-8px_rgb(0_0_0/0.7)]",
            "h-[80%] transition-[height] duration-500 ease-[var(--ease-expo-out)] motion-reduce:transition-none md:h-[76%] md:group-hover:h-[70%]",
          )}
        >
          <div className="relative size-full overflow-hidden rounded-t-md shadow-[0_0_0_1px_var(--line)]">
            <Image
              src={project.src}
              alt={project.title}
              fill
              sizes={sizes}
              quality={quality}
              {...(priority ? LCP_IMAGE_PROPS : {})}
              className="object-cover object-top"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function LinkIcons({
  name,
  links,
  variant,
}: {
  name: string;
  links: ProjectLink[];
  variant: keyof typeof LINK_CLASS;
}) {
  return (
    <div
      className={
        variant === "desktop"
          ? "hidden gap-3 md:flex"
          : "flex gap-2 pt-3 md:hidden"
      }
    >
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
  const href = projectPath(project.slug);
  return (
    <div className="flex min-w-0 flex-grow flex-col max-md:p-3 md:px-1">
      <div className="mb-1 flex items-center justify-between gap-3 md:mb-1.5">
        <h3 className="font-custom text-fg flex min-w-0 text-base font-bold md:text-lg">
          <Link
            href={href}
            className="title-link truncate outline-none max-md:-my-2.5 max-md:py-2.5"
          >
            {project.title}
          </Link>
        </h3>
        <LinkIcons name={project.title} links={links} variant="desktop" />
      </div>
      <p className="font-custom2 text-fg-muted mb-3 max-w-prose text-xs leading-relaxed max-md:line-clamp-3 md:mb-4 md:text-sm">
        {project.description}
      </p>
      <div className="mt-auto flex items-center justify-between gap-3">
        <TechIconTooltip tech={project.tech} scope={project.title} />
        <Link
          href={href}
          tabIndex={-1}
          className="font-custom2 text-fg-subtle group-hover:text-fg hidden items-center gap-1 text-sm transition-colors duration-300 md:inline-flex"
        >
          View project
          <ArrowUpRight
            aria-hidden="true"
            className="size-3.5 group-hover:hidden"
          />
          <ArrowRight
            aria-hidden="true"
            className="hidden size-3.5 group-hover:block"
          />
        </Link>
      </div>
      <LinkIcons name={project.title} links={links} variant="mobile" />
    </div>
  );
}

function ProjectCard({
  project,
  layout,
  priority = false,
}: {
  project: Project;
  layout: "featured" | "row";
  priority?: boolean;
}) {
  const featured = layout === "featured";
  const media = (
    <ProjectPreview project={project} featured={featured} priority={priority} />
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
  const deployed = expanded
    ? DEPLOYED_PROJECTS
    : DEPLOYED_PROJECTS.slice(0, PREVIEW_COUNT);
  const hiddenCount =
    DEPLOYED_PROJECTS.length + OPEN_SOURCE_PROJECTS.length - PREVIEW_COUNT;

  return (
    <div>
      <div className={cn(MOBILE_GRID, FEATURED_GRID, "pb-6 md:pb-8")}>
        {deployed.map((project, idx) => (
          <ProjectCard
            key={project.slug}
            project={project}
            layout="featured"
            priority={idx === 0}
          />
        ))}
      </div>

      {expanded && (
        <Section title="More projects" as="h3" size="md">
          <div
            className={cn(
              MOBILE_GRID,
              "md:divide-line mb-4 md:flex md:flex-col md:gap-0 md:divide-y md:divide-dashed md:[&>*]:py-5 md:[&>:first-child]:pt-0",
            )}
          >
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
