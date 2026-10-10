"use client";

import { useState, useEffect, useRef, useCallback, type MouseEvent, type ReactNode, type Ref } from "react";
import Image from "next/image";
import { Globe, Play, ArrowUpRight, Package } from "lucide-react";
import { SiPypi } from "react-icons/si";
import GithubIcon from "@/components/ui/github-icon";
import { TechKey } from "@/lib/tech-icons";
import { TechIconTooltip } from "@/components/ui/tech-icon-tooltip";
import dynamic from "next/dynamic";
import type { MediaItem } from "@/components/ui/lightbox";

const Lightbox = dynamic(() => import("@/components/ui/lightbox").then((m) => ({ default: m.Lightbox })), { ssr: false });

interface Project {
  title: string;
  src: string;
  poster?: string;
  video?: string;
  thumbVideo?: string;
  description: string;
  tech: TechKey[];
  github: string;
  live?: string;
}

interface OpenSourceProject {
  title: string;
  description: string;
  tech: TechKey[];
  github: string;
  pypi?: string;
  crates?: string;
}

const DEPLOYED_PROJECTS: Project[] = [
  {
    title: "Gostman",
    src: "/images/gostman-poster.jpg",
    poster: "/images/gostman-poster.jpg",
    video: "/videos/gostman-full.mp4",
    thumbVideo: "/videos/gostman-preview.mp4",
    description:
      "A native, privacy-first API client built with Wails (Go + React). 10x lighter than Postman with native support for REST, GraphQL, and WebSockets. 100% local and private.",
    tech: ["go", "react"],
    github: "https://github.com/kunalgoesbyken/gostman",
    live: "https://gostman.vercel.app/",
  },
  {
    title: "TaskFlow",
    src: "/images/taskflow-poster.jpg",
    poster: "/images/taskflow-poster.jpg",
    video: "/videos/taskflow-full.mp4",
    thumbVideo: "/videos/taskflow-preview.mp4",
    description:
      "Async team coordination hub for tracking work handoffs across timezones. Real-time task updates, bulk operations, analytics dashboard, GitHub OAuth & issue sync, and self-hostable with Docker.",
    tech: ["next", "ts", "supabase", "prisma"],
    github: "https://github.com/kunalgoesbyken/TaskFlow",
    live: "https://taskflow-deploy-eta.vercel.app",
  },
  {
    title: "MailFlowAI",
    src: "/images/mailflow-ai-1280.webp",
    description:
      "AI email assistant with Gmail integration and CopilotKit for natural-language control. 30-second auto-sync and AI-powered drafting.",
    tech: ["react", "ts", "tailwind", "gmail"],
    github: "https://github.com/kunalgoesbyken/MailFlowAI",
    live: "https://ai-mail-app-pearl.vercel.app/",
  },
];

const OPEN_SOURCE_PROJECTS: OpenSourceProject[] = [
  {
    title: "AeroSieve",
    description:
      "Turns raw recordings into speech-model training data. Decodes audio, cuts it into speech clips, drops the silent, noisy, clipped, or tonal ones, and writes WebDataset shards. 43 minutes of Hindi audio curated in 1.7s on one CPU core. Ships as a CLI, Rust crate, and Python bindings.",
    tech: ["rust", "python"],
    github: "https://github.com/kunalgoesbyken/AeroSieve",
    crates: "https://crates.io/crates/aerosieve-cli",
  },
  {
    title: "Un-Nexted",
    description:
      "Next.js core features (SSR, hydration, and file-system routing) reimplemented from scratch to show how the meta-framework actually works.",
    tech: ["bun", "react", "ts"],
    github: "https://github.com/kunalgoesbyken/Un-nexted",
  },
  {
    title: "codebase-indexer",
    description:
      "Offline semantic code search. Walks a codebase, chunks source files with tree-sitter ASTs, embeds them with nomic-embed (INT8 ONNX), and indexes for hybrid BM25 + vector search with RRF fusion.",
    tech: ["rust", "onnx"],
    github: "https://github.com/kunalgoesbyken/codebase-indexer",
  },
  {
    title: "pdf2docx-healer",
    description:
      "A drop-in replacement for pdf2docx that preserves formatting. It heals bullet lists, hyperlinks, CJK fonts, and scanned PDFs via OCR in a post-processing pass. Published on PyPI.",
    tech: ["python"],
    github: "https://github.com/kunalgoesbyken/pdf2docx-healer",
    pypi: "https://pypi.org/project/pdf2docx-healer/",
  },
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

const TITLE_ACTION_CLASS =
  "title-link cursor-pointer bg-transparent border-0 p-0 text-left font-[inherit] text-inherit outline-none";

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
      className="group flex flex-col h-full cursor-pointer"
    >
      {children}
    </div>
  );
}

function CardBody({ children }: { children: ReactNode }) {
  return <div className="flex flex-col flex-grow">{children}</div>;
}

function CardHeader({ title, children }: { title: ReactNode; children?: ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-1 md:mb-2">
      <h2 className="text-lg font-custom font-semibold text-neutral-900 dark:text-neutral-50">
        {title}
      </h2>
      {children && <div className="hidden md:flex gap-3">{children}</div>}
    </div>
  );
}

function CardDescription({ children }: { children: ReactNode }) {
  return (
    <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3 md:mb-4 max-w-[68ch] leading-relaxed tracking-wide font-custom2 max-md:line-clamp-3">
      {children}
    </p>
  );
}

function CardTechFooter({ tech, scope }: { tech: TechKey[]; scope: string }) {
  return (
    <>
      <p className="max-md:hidden text-xs text-neutral-500 font-medium mb-2 font-custom2 mt-auto">
        Tech Stack
      </p>
      <TechIconTooltip tech={tech} scope={scope} />
    </>
  );
}

function IconButton({
  href,
  ariaLabel,
  children,
}: {
  href: string;
  ariaLabel: string;
  children: ReactNode;
}) {
  return (
    <button
      onClick={() => window.open(href, "_blank")}
      className="icon-btn-ghost"
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}

function MobileActions({
  links,
}: {
  links: { href: string; label: string; icon: ReactNode; label2: string }[];
}) {
  return (
    <div className="md:hidden flex gap-2 mt-4">
      {links.map((l, i) => (
        <a
          key={l.label}
          href={l.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${l.label} for ${l.label2}`}
          className={`flex-1 min-h-11 inline-flex items-center justify-center gap-2 rounded-lg text-sm font-medium font-custom2 transition-colors active:scale-[0.98] ${
            i === 0
              ? "bg-neutral-900 text-neutral-50 dark:bg-neutral-100 dark:text-neutral-900"
              : "border border-neutral-200 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200"
          }`}
        >
          {l.icon}
          {l.label}
          {i === 0 && <ArrowUpRight size={14} className="opacity-70" aria-hidden="true" />}
        </a>
      ))}
    </div>
  );
}

const Projects = ({ full = false }: { full?: boolean }) => {
  const [activeMedia, setActiveMedia] = useState<MediaItem | null>(null);
  const [showAll, setShowAll] = useState(false);
  // Lightbox code (motion AnimatePresence) is fetched on first open only.
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
      <p className="max-md:hidden font-custom2 text-neutral-700 dark:text-neutral-300 mt-3 px-4 py-[7px] text-sm inline-block bg-neutral-100 dark:bg-neutral-900 border-dashed border-neutral-300 dark:border-neutral-700 border">
        I love crafting production-grade software that solves real problems.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10 py-5 md:py-7">
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
            <span className="link--elara">Open Source &amp; Libraries</span>
          </h2>
          <div className="hidden md:block absolute right-6 left-0 h-px bg-[var(--pattern-fg)] my-0.5 opacity-90 dark:opacity-15"></div>
          <div className="flex flex-col divide-y divide-dashed divide-neutral-200 dark:divide-neutral-800 my-2 [&>*]:py-5">
            {OPEN_SOURCE_PROJECTS.map((project) => (
              <OpenSourceCard key={project.title} project={project} />
            ))}
          </div>
        </div>
      )}

      {!showAll && !full && remaining > 0 && (
        <div
          onClick={() => setShowAll(true)}
          className="flex justify-center items-center cursor-pointer pt-4 pb-6 max-md:pt-0 max-md:pb-2"
        >
          <span className="max-md:w-full max-md:min-h-12 max-md:flex max-md:items-center max-md:justify-center max-md:border max-md:rounded-lg max-md:text-sm font-custom2 text-xs text-neutral-500 dark:text-neutral-400 border-b border-dashed border-neutral-300 dark:border-neutral-700 pb-[2px] tracking-wide hover:text-neutral-900 dark:hover:text-neutral-100 hover:border-neutral-500 dark:hover:border-neutral-400 transition-colors duration-200">
            Show {remaining} more project{remaining > 1 ? "s" : ""}
          </span>
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
      <div
        className="relative w-full h-44 max-md:h-auto overflow-hidden shrink-0 rounded-lg border border-neutral-200 dark:border-neutral-800 mb-4"
        style={{ aspectRatio: "16/9" }}
      >
        <Image
          src={project.poster || project.src}
          alt={project.title}
          fill
          sizes="(max-width: 768px) 100vw, 448px"
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
          <span className="md:hidden absolute bottom-2 left-2 inline-flex items-center gap-1.5 rounded-full bg-black/65 text-white text-xs font-custom2 pl-2 pr-2.5 py-1">
            <Play size={11} fill="currentColor" aria-hidden="true" /> Watch demo
          </span>
        )}
      </div>

      <CardBody>
        <CardHeader
          title={
            <button type="button" onClick={openProjectMedia} className={TITLE_ACTION_CLASS}>
              {project.title}
            </button>
          }
        >
          {project.live && (
            <IconButton href={project.live} ariaLabel={`View live site for ${project.title}`}>
              <Globe size={16} />
            </IconButton>
          )}
          <IconButton href={project.github} ariaLabel={`View GitHub repository for ${project.title}`}>
            <GithubIcon size={16} />
          </IconButton>
        </CardHeader>
        <CardDescription>{project.description}</CardDescription>
        <CardTechFooter tech={project.tech} scope={project.title} />
        <MobileActions
          links={[
            ...(project.live ? [{ href: project.live, label: "Live", icon: <Globe size={16} />, label2: project.title }] : []),
            { href: project.github, label: "GitHub", icon: <GithubIcon size={16} />, label2: project.title },
          ]}
        />
      </CardBody>
    </CardShell>
  );
}

function OpenSourceCard({ project }: { project: OpenSourceProject }) {
  return (
    <CardShell onActivate={() => window.open(project.github, "_blank")}>
      <CardBody>
        <CardHeader
          title={
            <a href={project.github} target="_blank" rel="noopener noreferrer" className={TITLE_ACTION_CLASS}>
              {project.title}
            </a>
          }
        >
          {project.crates && (
            <IconButton href={project.crates} ariaLabel={`View crates.io package for ${project.title}`}>
              <Package size={16} />
            </IconButton>
          )}
          {project.pypi && (
            <IconButton href={project.pypi} ariaLabel={`View PyPI package for ${project.title}`}>
              <SiPypi size={16} />
            </IconButton>
          )}
          <IconButton href={project.github} ariaLabel={`View GitHub repository for ${project.title}`}>
            <GithubIcon size={16} />
          </IconButton>
        </CardHeader>
        <CardDescription>{project.description}</CardDescription>
        <CardTechFooter tech={project.tech} scope={project.title} />
        <MobileActions
          links={[
            ...(project.crates ? [{ href: project.crates, label: "crates.io", icon: <Package size={16} />, label2: project.title }] : []),
            ...(project.pypi ? [{ href: project.pypi, label: "PyPI", icon: <SiPypi size={16} />, label2: project.title }] : []),
            { href: project.github, label: "GitHub", icon: <GithubIcon size={16} />, label2: project.title },
          ]}
        />
      </CardBody>
    </CardShell>
  );
}

export default Projects;