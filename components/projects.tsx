"use client";

import { useState, type MouseEvent, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Maximize2 } from "lucide-react";
import { DEPLOYED_PROJECTS, OPEN_SOURCE_PROJECTS, projectPath, type Project } from "@/lib/projects-data";
import type { TechKey } from "@/lib/tech-icons";
import type { MediaItem } from "@/lib/media";
import { TechIconTooltip } from "@/components/ui/tech-icon-tooltip";
import { projectLinks, type ProjectLink } from "@/components/project-links";
import dynamic from "next/dynamic";

const Lightbox = dynamic(() => import("@/components/ui/lightbox").then((m) => ({ default: m.Lightbox })), { ssr: false });

const TITLE_ACTION_CLASS =
  "title-link truncate cursor-pointer bg-transparent border-0 p-0 text-left font-[inherit] text-inherit outline-none";

const MEDIA_FRAME_CLASS =
  "relative w-full aspect-video overflow-hidden shrink-0 md:rounded-lg md:border md:border-neutral-200 md:dark:border-neutral-800";

const DESKTOP_LINK_CLASS = "icon-btn-ghost";

const MOBILE_LINK_CLASS =
  "frame-dashed inline-flex size-9 items-center justify-center text-neutral-700 dark:text-neutral-300 transition-colors hover:border-neutral-500 dark:hover:border-neutral-400";

function CardShell({ onActivate, children }: { onActivate: () => void; children: ReactNode }) {
  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest("a, button")) return;
    if (window.getSelection()?.toString()) return;
    onActivate();
  };

  return (
    <div
      onClick={handleClick}
      className="group flex flex-col h-full min-w-0 cursor-pointer max-md:overflow-hidden max-md:frame-dashed"
    >
      {children}
    </div>
  );
}

function LinkIcons({
  name,
  links,
  className,
  linkClassName,
}: {
  name: string;
  links: ProjectLink[];
  className: string;
  linkClassName: string;
}) {
  return (
    <div className={className}>
      {links.map((link) => (
        <a
          key={link.href}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${link.label} for ${name}`}
          className={linkClassName}
        >
          {link.icon}
        </a>
      ))}
    </div>
  );
}

function CardContent({
  name,
  title,
  description,
  tech,
  links,
}: {
  name: string;
  title: ReactNode;
  description: string;
  tech: TechKey[];
  links: ProjectLink[];
}) {
  return (
    <div className="flex flex-col flex-grow min-w-0 max-md:p-3">
      <div className="flex items-center justify-between gap-3 mb-1 md:mb-2">
        <h2 className="flex min-w-0 text-base md:text-lg font-custom font-semibold text-neutral-900 dark:text-neutral-50">
          {title}
        </h2>
        <LinkIcons name={name} links={links} className="hidden md:flex gap-3" linkClassName={DESKTOP_LINK_CLASS} />
      </div>
      <p className="text-xs md:text-sm text-neutral-600 dark:text-neutral-400 mb-3 md:mb-4 max-w-[68ch] leading-relaxed md:tracking-wide font-custom2 max-md:line-clamp-3">
        {description}
      </p>
      <p className="max-md:hidden text-xs text-neutral-500 font-medium mb-2 font-custom2 mt-auto">Tech Stack</p>
      <div className="max-md:mt-auto">
        <TechIconTooltip tech={tech} scope={name} />
      </div>
      <LinkIcons name={name} links={links} className="md:hidden flex gap-2 pt-3" linkClassName={MOBILE_LINK_CLASS} />
    </div>
  );
}

const Projects = ({ full = false }: { full?: boolean }) => {
  const [activeMedia, setActiveMedia] = useState<MediaItem | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [hasLightbox, setHasLightbox] = useState(false);
  const openMedia = (media: MediaItem) => {
    setHasLightbox(true);
    setActiveMedia(media);
  };

  const visibleDeployed = (showAll || full) ? DEPLOYED_PROJECTS : DEPLOYED_PROJECTS.slice(0, 2);
  const showOpenSource = showAll || full;
  const remaining = DEPLOYED_PROJECTS.length + OPEN_SOURCE_PROJECTS.length - 2;

  return (
    <div className="mt-6 md:mt-8">
      <p className="max-md:hidden font-custom2 text-neutral-700 dark:text-neutral-300 mt-3 px-4 py-[7px] text-sm inline-block bg-neutral-100 dark:bg-neutral-900 frame-dashed">
        I love crafting production-grade software that solves real problems.
      </p>

      <div className="grid grid-cols-2 gap-3 md:gap-x-8 md:gap-y-10 py-5 md:py-7">
        {visibleDeployed.map((project, idx) => (
          <ProjectCard
            key={project.title}
            project={project}
            idx={idx}
            openMedia={openMedia}
          />
        ))}
      </div>

      {showOpenSource && (
        <div className="mt-2">
          <h2 className="text-neutral-900 dark:text-neutral-50 font-custom font-bold text-2xl tracking-tight py-2">
            <span className="link--elara">More Projects</span>
          </h2>
          <div className="hidden md:block absolute right-6 left-0 h-px bg-[var(--pattern-fg)] my-0.5 opacity-90 dark:opacity-15"></div>
          <div className="grid grid-cols-2 gap-3 my-4 md:my-2 md:flex md:flex-col md:gap-0 md:divide-y md:divide-dashed md:divide-neutral-200 md:dark:divide-neutral-800 md:[&>*]:py-5">
            {OPEN_SOURCE_PROJECTS.map((project) => (
              <OpenSourceCard key={project.title} project={project} />
            ))}
          </div>
        </div>
      )}

      {!showAll && !full && remaining > 0 && (
        <div className="flex justify-center pt-4 pb-6 max-md:pt-0 max-md:pb-2">
          <button onClick={() => setShowAll(true)} className="text-toggle">
            Show {remaining} more project{remaining > 1 ? "s" : ""}
          </button>
        </div>
      )}

      {showAll && !full && remaining > 0 && (
        <div className="flex justify-center pt-2 pb-6">
          <button
            onClick={() => setShowAll(false)}
            className="text-toggle"
          >
            ↑ Show less
          </button>
        </div>
      )}

      {hasLightbox && (
        <Lightbox
          items={activeMedia ? [activeMedia] : []}
          index={activeMedia ? 0 : null}
          onIndexChange={(index) => index === null && setActiveMedia(null)}
        />
      )}
    </div>
  );
};

function ProjectCard({
  project,
  idx,
  openMedia,
}: {
  project: Project;
  idx: number;
  openMedia: (media: MediaItem) => void;
}) {
  const router = useRouter();
  const preview: MediaItem = { src: project.src, caption: project.title };

  return (
    <CardShell onActivate={() => router.push(projectPath(project.slug))}>
      <div className={`${MEDIA_FRAME_CLASS} md:mb-4`}>
        <Image
          src={project.src}
          alt={project.title}
          fill
          sizes="(max-width: 768px) 50vw, 448px"
          quality={70}
          priority={idx === 0}
          className="object-cover object-top"
        />
        <button
          type="button"
          onClick={() => openMedia(preview)}
          aria-label={`Expand screenshot of ${project.title}`}
          className="max-md:hidden absolute top-2.5 right-2.5 inline-flex items-center gap-1.5 rounded-full bg-black/65 text-white text-xs font-custom2 px-2.5 py-1 cursor-zoom-in opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
        >
          <Maximize2 size={11} aria-hidden="true" />
          Expand
        </button>
      </div>

      <CardContent
        name={project.title}
        title={
          <Link href={projectPath(project.slug)} className={TITLE_ACTION_CLASS}>
            {project.title}
          </Link>
        }
        description={project.description}
        tech={project.tech}
        links={projectLinks(project)}
      />
    </CardShell>
  );
}

function OpenSourceCard({ project }: { project: Project }) {
  const router = useRouter();
  return (
    <CardShell onActivate={() => router.push(projectPath(project.slug))}>
      <div className="flex flex-col-reverse h-full md:flex-row md:gap-8 md:items-start">
        <CardContent
          name={project.title}
          title={
            <Link href={projectPath(project.slug)} className={TITLE_ACTION_CLASS}>
              {project.title}
            </Link>
          }
          description={project.description}
          tech={project.tech}
          links={projectLinks(project)}
        />
        <div className={`${MEDIA_FRAME_CLASS} md:w-52`}>
          <Image
            src={project.src}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 50vw, 208px"
            quality={60}
            className="object-cover"
          />
        </div>
      </div>
    </CardShell>
  );
}

export default Projects;
