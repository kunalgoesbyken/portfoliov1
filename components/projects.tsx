"use client";

import { useState, useEffect, useRef, useCallback, type ReactNode, type Ref } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { Globe } from "lucide-react";
import { SiPypi } from "react-icons/si";
import GithubIcon from "@/components/ui/github-icon";
import { TechKey } from "@/lib/tech-icons";
import { TechIconTooltip } from "@/components/ui/tech-icon-tooltip";
import { Lightbox, type MediaItem } from "@/components/ui/lightbox";

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
}

const DEPLOYED_PROJECTS: Project[] = [
  {
    title: "Gostman",
    src: "/images/project3.png",
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
    src: "/images/mailflow-ai.png",
    description:
      "AI email assistant with Gmail integration and CopilotKit for natural-language control. 30-second auto-sync and AI-powered drafting.",
    tech: ["react", "ts", "tailwind", "gmail"],
    github: "https://github.com/kunalgoesbyken/MailFlowAI",
    live: "https://ai-mail-app-pearl.vercel.app/",
  },
];

const OPEN_SOURCE_PROJECTS: OpenSourceProject[] = [
  {
    title: "Un-Nexted",
    description:
      "Next.js core features — SSR, hydration, and file-system routing — reimplemented from scratch to show how the meta-framework actually works.",
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
      "A drop-in replacement for pdf2docx that preserves formatting — heals bullet lists, hyperlinks, CJK fonts, and scanned PDFs via OCR in a post-processing pass. Published on PyPI.",
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

const useVideoPlayback = (isInView: boolean) => {
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

const cardMotion = (idx: number) => ({
  initial: { opacity: 0, filter: "blur(10px)" },
  whileInView: { opacity: 1, filter: "blur(0px)" },
  transition: { duration: 0.6, ease: "easeOut" as const, delay: idx * 0.12 },
  viewport: { once: true, amount: 0.2 },
});

function CardShell({
  idx,
  ref,
  onMouseEnter,
  onMouseLeave,
  children,
}: {
  idx: number;
  ref?: Ref<HTMLDivElement>;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  children: ReactNode;
}) {
  return (
    <motion.div
      ref={ref}
      {...cardMotion(idx)}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="group card-surface"
    >
      <div className="card-radial-overlay" />
      {children}
    </motion.div>
  );
}

function CardBody({ children }: { children: ReactNode }) {
  return <div className="p-5 flex flex-col flex-grow">{children}</div>;
}

function CardHeader({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-2">
      <h2 className="text-lg font-custom font-semibold text-neutral-900 dark:text-neutral-50">
        {title}
      </h2>
      {children && <div className="flex gap-3">{children}</div>}
    </div>
  );
}

function CardDescription({ children }: { children: ReactNode }) {
  return (
    <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4 leading-relaxed tracking-wide font-custom2">
      {children}
    </p>
  );
}

function CardTechFooter({ tech, scope }: { tech: TechKey[]; scope: string }) {
  return (
    <>
      <p className="text-xs text-neutral-500 font-medium mb-2 font-custom2 mt-auto">
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

const Projects = ({ full = false }: { full?: boolean }) => {
  const [activeMedia, setActiveMedia] = useState<MediaItem | null>(null);
  const [showAll, setShowAll] = useState(false);

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
    <div className="mt-8">
      <p className="font-custom2 text-neutral-700 dark:text-neutral-300 mt-3 px-4 py-[7px] text-sm inline-block bg-neutral-100 dark:bg-neutral-900 border-dashed border-neutral-300 dark:border-neutral-700 border">
        I love crafting production-grade software that solves real problems.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 py-7">
        {visibleDeployed.map((project, idx) => (
          <ProjectCard
            key={project.title}
            project={project}
            idx={idx}
            setActiveMedia={setActiveMedia}
          />
        ))}
      </div>

      {showOpenSource && (
        <div className="mt-2">
          <h2 className="text-neutral-900 dark:text-neutral-50 font-custom font-bold text-2xl tracking-tight py-2">
            <span className="link--elara">Open Source &amp; Libraries</span>
          </h2>
          <div className="hidden md:block absolute right-6 left-0 h-px bg-[var(--pattern-fg)] my-0.5 opacity-90 dark:opacity-15"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 py-5">
            {OPEN_SOURCE_PROJECTS.map((project, idx) => (
              <OpenSourceCard key={project.title} project={project} idx={idx} />
            ))}
          </div>
        </div>
      )}

      {!showAll && !full && remaining > 0 && (
        <div
          onClick={() => setShowAll(true)}
          className="flex justify-center items-center cursor-pointer pt-4 pb-6"
        >
          <span className="font-custom2 text-xs text-neutral-500 dark:text-neutral-400 border-b border-dashed border-neutral-300 dark:border-neutral-700 pb-[2px] tracking-wide hover:text-neutral-900 dark:hover:text-neutral-100 hover:border-neutral-500 dark:hover:border-neutral-400 transition-colors duration-200">
            Show {remaining} more project{remaining > 1 ? "s" : ""}
          </span>
        </div>
      )}

      {showAll && !full && remaining > 0 && (
        <div className="flex justify-center pt-2 pb-6">
          <button
            onClick={() => setShowAll(false)}
            className="font-custom2 text-xs text-neutral-400 dark:text-neutral-500 border-b border-dashed border-neutral-200 dark:border-neutral-800 pb-[2px] tracking-wide cursor-pointer bg-transparent hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors duration-200"
          >
            ↑ Show less
          </button>
        </div>
      )}

      <Lightbox media={activeMedia} onClose={() => setActiveMedia(null)} />
    </div>
  );
};

function ProjectCard({
  project,
  idx,
  setActiveMedia,
}: {
  project: Project;
  idx: number;
  setActiveMedia: (media: MediaItem | null) => void;
}) {
  const { isInView, observerRef } = useProjectVisibility();
  const { videoRef, isReady, handleCanPlay, play, pause } = useVideoPlayback(isInView);
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

  return (
    <CardShell
      idx={idx}
      ref={observerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="relative w-full h-44 overflow-hidden shrink-0 cursor-pointer"
        style={{ aspectRatio: "16/9" }}
        onClick={() => {
          if (project.thumbVideo) {
            setActiveMedia({ type: "video", src: project.video || project.thumbVideo });
          } else {
            setActiveMedia({ type: "image", src: project.src });
          }
        }}
      >
        <Image
          src={project.poster || project.src}
          alt={project.title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          priority={idx === 0}
          className={`object-cover transition-opacity duration-500 ease-out ${
            shouldMountVideo && isHovered && isReady ? "opacity-0" : "opacity-100"
          }`}
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

        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-300" />
      </div>

      <CardBody>
        <CardHeader title={project.title}>
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
      </CardBody>
    </CardShell>
  );
}

function OpenSourceCard({
  project,
  idx,
}: {
  project: OpenSourceProject;
  idx: number;
}) {
  return (
    <CardShell idx={idx}>
      <CardBody>
        <CardHeader title={project.title}>
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
      </CardBody>
    </CardShell>
  );
}

export default Projects;