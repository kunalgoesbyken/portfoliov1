"use client";

import { useState, useEffect, useRef, useCallback, type MouseEvent, type ReactNode, type Ref } from "react";
import Image from "next/image";
import { Globe, Play, Package } from "lucide-react";
import { SiPypi } from "react-icons/si";
import GithubIcon from "@/components/ui/github-icon";
import { DEPLOYED_PROJECTS, OPEN_SOURCE_PROJECTS, type OpenSourceProject, type Project, type ProjectLinks } from "@/lib/projects-data";
import type { TechKey } from "@/lib/tech-icons";
import { TechIconTooltip } from "@/components/ui/tech-icon-tooltip";
import dynamic from "next/dynamic";
import type { MediaItem } from "@/components/ui/lightbox";

const Lightbox = dynamic(() => import("@/components/ui/lightbox").then((m) => ({ default: m.Lightbox })), { ssr: false });

interface ProjectLink {
  href: string;
  label: string;
  icon: ReactNode;
}

const TITLE_ACTION_CLASS =
  "title-link truncate cursor-pointer bg-transparent border-0 p-0 text-left font-[inherit] text-inherit outline-none";

const MEDIA_FRAME_CLASS =
  "relative w-full aspect-video overflow-hidden shrink-0 md:rounded-lg md:border md:border-neutral-200 md:dark:border-neutral-800";

const DESKTOP_LINK_CLASS = "icon-btn-ghost";

const MOBILE_LINK_CLASS =
  "frame-dashed inline-flex size-9 items-center justify-center text-neutral-700 dark:text-neutral-300 transition-colors hover:border-neutral-500 dark:hover:border-neutral-400";

const projectLinks = ({ live, crates, pypi, github }: ProjectLinks): ProjectLink[] => [
  ...(live ? [{ href: live, label: "Live site", icon: <Globe size={16} /> }] : []),
  ...(crates ? [{ href: crates, label: "crates.io package", icon: <Package size={16} /> }] : []),
  ...(pypi ? [{ href: pypi, label: "PyPI package", icon: <SiPypi size={16} /> }] : []),
  { href: github, label: "GitHub repository", icon: <GithubIcon size={16} /> },
];

const useProjectVisibility = () => {
  const [isInView, setIsInView] = useState(false);
  const observerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const element = observerRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsInView(true);
          observer.unobserve(element);
        }
      },
      { rootMargin: "200px", threshold: 0.01 }
    );

    observer.observe(element);
    return () => observer.unobserve(element);
  }, []);

  return { isInView, observerRef };
};

const useVideoPlayback = () => {
  const [isReady, setIsReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isPlaying = useRef(false);
  const hasLoaded = useRef(false);

  const handleCanPlay = useCallback(() => setIsReady(true), []);

  const play = useCallback(() => {
    if (typeof window !== "undefined" && ("ontouchstart" in window || navigator.maxTouchPoints > 0)) return;
    const video = videoRef.current;
    if (!video) return;
    if (!hasLoaded.current) {
      video.load();
      hasLoaded.current = true;
    }
    if (isReady && !isPlaying.current) {
      video.play().catch(() => {});
      isPlaying.current = true;
    }
  }, [isReady]);

  const pause = useCallback(() => {
    const video = videoRef.current;
    if (video && isPlaying.current) {
      video.pause();
      video.currentTime = 0;
      isPlaying.current = false;
    }
  }, []);

  return { videoRef, isReady, handleCanPlay, play, pause };
};

function CardShell({
  ref,
  onActivate,
  onMouseEnter,
  onMouseLeave,
  children,
}: {
  ref?: Ref<HTMLDivElement>;
  onActivate: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  children: ReactNode;
}) {
  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest("a, button")) return;
    if (window.getSelection()?.toString()) return;
    onActivate();
  };

  return (
    <div
      ref={ref}
      onClick={handleClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
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

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveMedia(null);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

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

      {hasLightbox && <Lightbox media={activeMedia} onClose={() => setActiveMedia(null)} />}
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
  const { isInView, observerRef } = useProjectVisibility();
  const { videoRef, isReady, handleCanPlay, play, pause } = useVideoPlayback();
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHovered && isInView) {
      play();
    } else {
      pause();
    }
  }, [isHovered, isInView, play, pause]);

  const isTouchDevice = typeof window !== "undefined" && ("ontouchstart" in window || navigator.maxTouchPoints > 0);
  const shouldMountVideo = !isTouchDevice && !!project.thumbVideo && isInView;

  const openProjectMedia = () =>
    openMedia(
      project.thumbVideo
        ? { type: "video", src: project.video || project.thumbVideo }
        : { type: "image", src: project.src },
    );

  return (
    <CardShell
      ref={observerRef}
      onActivate={openProjectMedia}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`${MEDIA_FRAME_CLASS} md:mb-4`}>
        <Image
          src={project.poster || project.src}
          alt={project.title}
          fill
          sizes="(max-width: 768px) 50vw, 448px"
          quality={60}
          priority={idx === 0}
          fetchPriority={idx === 0 ? "high" : "auto"}
          loading={idx === 0 ? "eager" : undefined}
          decoding={idx === 0 ? "sync" : "async"}
          className="object-cover"
        />

        {shouldMountVideo && (
          <video
            ref={videoRef}
            src={project.thumbVideo}
            preload="none"
            muted
            loop
            playsInline
            onCanPlay={handleCanPlay}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-out ${
              isHovered && isReady ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          />
        )}

        {project.thumbVideo && (
          <span className="md:hidden absolute bottom-1.5 left-1.5 inline-flex items-center gap-1 rounded-full bg-black/65 text-white text-[10px] font-custom2 px-2 py-0.5">
            <Play size={9} fill="currentColor" aria-hidden="true" /> Demo
          </span>
        )}
      </div>

      <CardContent
        name={project.title}
        title={
          <button type="button" onClick={openProjectMedia} className={TITLE_ACTION_CLASS}>
            {project.title}
          </button>
        }
        description={project.description}
        tech={project.tech}
        links={projectLinks(project)}
      />
    </CardShell>
  );
}

function OpenSourceCard({ project }: { project: OpenSourceProject }) {
  return (
    <CardShell onActivate={() => window.open(project.github, "_blank")}>
      <div className="flex flex-col-reverse h-full md:flex-row md:gap-8 md:items-start">
        <CardContent
          name={project.title}
          title={
            <a href={project.github} target="_blank" rel="noopener noreferrer" className={TITLE_ACTION_CLASS}>
              {project.title}
            </a>
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
