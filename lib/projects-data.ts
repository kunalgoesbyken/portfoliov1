import type { TechKey } from "@/lib/tech-icons";

export interface ProjectLinks {
  github: string;
  live?: string;
  crates?: string;
  pypi?: string;
}

export interface Project extends ProjectLinks {
  slug: string;
  title: string;
  src: string;
  description: string;
  tech: TechKey[];
}

export const DEPLOYED_PROJECTS: Project[] = [
  {
    slug: "gostman",
    title: "Gostman",
    src: "/images/gostman-landing.jpg",
    description:
      "Open source API client for REST, GraphQL, gRPC and WebSocket: a native desktop app (Go + Wails), a web app, and a single-binary CLI that runs collections in CI and serves them to coding agents over MCP. No account, no telemetry, no paid tier.",
    tech: ["go", "react"],
    github: "https://github.com/kunalgoesbyken/gostman",
    live: "https://gostman.com",
  },
  {
    slug: "aerosieve",
    title: "AeroSieve",
    src: "/images/aerosieve-landing.webp",
    description:
      "Turns raw recordings into speech-model training data, with a reason for every clip it drops. Caught 24,385 of 24,409 injected defects across six languages, curates audio 940x faster than real time on a laptop CPU, and judges 1,000 live streams at 14.8 ms p95 over WebSocket. Runs in the browser via WebAssembly, and ships as a CLI, Rust crate and Python bindings.",
    tech: ["rust", "python"],
    github: "https://github.com/kunalgoesbyken/AeroSieve",
    live: "https://aerosieve.vercel.app",
    crates: "https://crates.io/crates/aerosieve-cli",
  },
  {
    slug: "seedfall",
    title: "Seedfall",
    src: "/images/seedfall-poster.webp",
    description:
      "Deterministic simulation testing for unmodified Go programs. Runs services on wazero under a seeded scheduler, then crashes them mid-write, tears their writes and partitions their network, and replays any failure from one seed. Found a missing directory fsync in hashicorp/raft that leaves a node unable to restart.",
    tech: ["go"],
    github: "https://github.com/kunalgoesbyken/seedfall",
    live: "https://seedfall-lemon.vercel.app",
  },
  {
    slug: "codebase-indexer",
    title: "codebase-indexer",
    src: "/images/codebase-indexer-poster.webp",
    description:
      "Offline semantic code search. Chunks source files with tree-sitter ASTs, embeds them with nomic-embed (INT8 ONNX), and fuses BM25 and a hand-written persisted HNSW index with RRF. Only changed files are re-embedded, so a no-op re-index takes 95 ms.",
    tech: ["rust", "onnx"],
    github: "https://github.com/kunalgoesbyken/codebase-indexer",
  },
  {
    slug: "un-nexted",
    title: "Un-Nexted",
    src: "/images/un-nexted-1600.webp",
    description:
      "Next.js core features (SSR, hydration, and file-system routing) reimplemented from scratch to show how the meta-framework actually works.",
    tech: ["bun", "react", "ts"],
    github: "https://github.com/kunalgoesbyken/Un-nexted",
  },
];

export const OPEN_SOURCE_PROJECTS: Project[] = [
  {
    slug: "taskflow",
    title: "TaskFlow",
    src: "/images/taskflow-poster.jpg",
    description:
      "Async team coordination hub for tracking work handoffs across timezones. Real-time task updates, bulk operations, analytics dashboard, GitHub OAuth & issue sync, and self-hostable with Docker.",
    tech: ["next", "ts", "supabase", "prisma"],
    github: "https://github.com/kunalgoesbyken/TaskFlow",
    live: "https://taskflow-deploy-eta.vercel.app",
  },
  {
    slug: "mailflow-ai",
    title: "MailFlowAI",
    src: "/images/mailflow-ai-1280.webp",
    description:
      "A Gmail client with an AI assistant that finds, opens and drafts mail through typed tool calls (Vercel AI SDK and Groq), and never sends without your confirmation. Mail goes straight from Gmail to the browser, with 30-second background sync.",
    tech: ["react", "ts", "tailwind", "gmail"],
    github: "https://github.com/kunalgoesbyken/MailFlowAI",
    live: "https://ai-mail-app-pearl.vercel.app/",
  },
  {
    slug: "pdf2docx-healer",
    title: "pdf2docx-healer",
    src: "/images/pdf2docx-healer-terminal.webp",
    description:
      "A drop-in replacement for pdf2docx that preserves formatting. It heals bullet lists, hyperlinks, CJK fonts, and scanned PDFs via OCR in a post-processing pass. Published on PyPI.",
    tech: ["python"],
    github: "https://github.com/kunalgoesbyken/pdf2docx-healer",
    pypi: "https://pypi.org/project/pdf2docx-healer/",
  },
];

export const ALL_PROJECTS: Project[] = [...DEPLOYED_PROJECTS, ...OPEN_SOURCE_PROJECTS];

export const projectPath = (slug: string) => `/projects/${slug}`;
