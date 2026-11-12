import { notFound } from "next/navigation";
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
  category: string;
  description: string;
  details?: string[];
  tech: TechKey[];
}

export const DEPLOYED_PROJECTS: Project[] = [
  {
    slug: "gostman",
    title: "Gostman",
    src: "/images/projects/gostman/00-producthunt.webp",
    category: "Developer tool",
    description:
      "Open source API client for REST, GraphQL, gRPC and WebSocket: a native desktop app (Go + Wails), a web app, and a single-binary CLI that runs collections in CI and serves them to coding agents over MCP. No account, no telemetry, no paid tier.",
    details: [
      "Collections are plain YAML files you can commit",
      "gostman run runs the same collections in CI, with data-driven and parallel runs and HTML reports",
      "gostman mcp lets coding agents call saved requests without seeing secrets",
    ],
    tech: ["go", "react"],
    github: "https://github.com/kunalgoesbyken/gostman",
    live: "https://gostman.com",
  },
  {
    slug: "aerosieve",
    title: "AeroSieve",
    src: "/images/projects/aerosieve/00-producthunt.webp",
    category: "Voice AI data pipeline",
    description:
      "Turns raw recordings into speech-model training data, with a reason for every clip it drops. Caught 24,385 of 24,409 injected defects across six languages, curates audio 940x faster than real time on a laptop CPU, and judges 1,000 live streams at 14.8 ms p95 over WebSocket. Runs in the browser via WebAssembly, and ships as a CLI, Rust crate and Python bindings.",
    details: [
      "Decodes audio, cuts it into 3 to 30 second speech clips, drops silent, noisy, clipped and tonal clips, and writes WebDataset shards",
      "SieveBench injected those defects into 51,352 damaged recordings",
      "The 940x figure is 43 minutes of 48 kHz Hindi audio curated in 2.75s, with no ML model by default",
      "Streaming verdicts are identical to batch results",
    ],
    tech: ["rust", "python"],
    github: "https://github.com/kunalgoesbyken/AeroSieve",
    live: "https://aerosieve.vercel.app",
    crates: "https://crates.io/crates/aerosieve-cli",
  },
  {
    slug: "seedfall",
    title: "Seedfall",
    src: "/images/seedfall-poster.webp",
    category: "Reliability testing",
    description:
      "Deterministic simulation testing for unmodified Go programs. Runs services on wazero under a seeded scheduler, then crashes them mid-write, tears their writes and partitions their network, and replays any failure from one seed. Found a missing directory fsync in hashicorp/raft that leaves a node unable to restart.",
    details: [
      "Compiles Go with the stock toolchain to wasip1 and runs each node on wazero under a seeded scheduler and virtual clock",
      "Failing runs shrink to the few faults that matter",
      "Checks linearizability with Porcupine",
    ],
    tech: ["go"],
    github: "https://github.com/kunalgoesbyken/seedfall",
    live: "https://seedfall-lemon.vercel.app",
  },
  {
    slug: "codebase-indexer",
    title: "codebase-indexer",
    src: "/images/codebase-indexer-poster.webp",
    category: "Search and retrieval",
    description:
      "Offline semantic code search. Chunks source files with tree-sitter ASTs, embeds them with nomic-embed (INT8 ONNX), and fuses BM25 and a hand-written persisted HNSW index with RRF. Only changed files are re-embedded, so a no-op re-index takes 95 ms.",
    details: [
      "Append-only vector store with SHA-256 delta detection to find changed files",
    ],
    tech: ["rust", "onnx"],
    github: "https://github.com/kunalgoesbyken/codebase-indexer",
  },
  {
    slug: "un-nexted",
    title: "Un-Nexted",
    src: "/images/projects/un-nexted/00-producthunt.webp",
    category: "Framework internals",
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
    src: "/images/projects/taskflow/01-dashboard.webp",
    category: "Team productivity",
    description:
      "Async team coordination hub for tracking work handoffs across timezones. Real-time task updates, bulk operations, analytics dashboard, GitHub OAuth & issue sync, and self-hostable with Docker.",
    tech: ["next", "ts", "supabase", "prisma"],
    github: "https://github.com/kunalgoesbyken/TaskFlow",
    live: "https://taskflow-deploy-eta.vercel.app",
  },
  {
    slug: "mailflow-ai",
    title: "MailFlowAI",
    src: "/images/projects/mailflow-ai/01-inbox.webp",
    category: "AI product",
    description:
      "A Gmail client with an AI assistant that finds, opens and drafts mail through typed tool calls (Vercel AI SDK and Groq), and never sends without your confirmation. Mail goes straight from Gmail to the browser, with 30-second background sync.",
    details: [
      "The assistant acts through four typed tool calls (Groq gpt-oss-120b) and cannot send mail; drafts go through the same confirm dialog as hand-written mail",
      "Built with Next.js 15, React 19, Zustand and Tailwind CSS v4",
    ],
    tech: ["react", "ts", "tailwind", "gmail"],
    github: "https://github.com/kunalgoesbyken/MailFlowAI",
    live: "https://ai-mail-app-pearl.vercel.app/",
  },
  {
    slug: "pdf2docx-healer",
    title: "pdf2docx-healer",
    src: "/images/pdf2docx-healer-terminal.webp",
    category: "Python library",
    description:
      "A drop-in replacement for pdf2docx that preserves formatting. It heals bullet lists, hyperlinks, CJK fonts, and scanned PDFs via OCR in a post-processing pass. Published on PyPI.",
    tech: ["python"],
    github: "https://github.com/kunalgoesbyken/pdf2docx-healer",
    pypi: "https://pypi.org/project/pdf2docx-healer/",
  },
];

export const ALL_PROJECTS: Project[] = [...DEPLOYED_PROJECTS, ...OPEN_SOURCE_PROJECTS];

export const projectPath = (slug: string) => `/projects/${slug}`;

const LINK_KINDS = [
  { key: "live", label: "Live site" },
  { key: "crates", label: "crates.io" },
  { key: "pypi", label: "PyPI" },
  { key: "github", label: "GitHub" },
] as const satisfies { key: keyof ProjectLinks; label: string }[];

export const projectLinkEntries = (links: ProjectLinks) =>
  LINK_KINDS.flatMap(({ key, label }) => {
    const href = links[key];
    return href ? [{ key, label, href }] : [];
  });

export const findProject = (slug: string) => ALL_PROJECTS.find((p) => p.slug === slug) ?? notFound();
