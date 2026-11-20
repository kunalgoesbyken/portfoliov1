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
  logo?: string;
  src: string;
  category: string;
  description: string;
  details?: string[];
  tech: TechKey[];
}

export const DEPLOYED_PROJECTS: Project[] = [
  {
    slug: "gostman",
    logo: "/images/projects/gostman/logo.png",
    title: "Gostman",
    src: "/images/projects/gostman/00-producthunt.webp",
    category: "Developer tool",
    description:
      "An open source API client for REST, GraphQL, gRPC and WebSocket. It comes as a native desktop app (Go + Wails), a web app, and a single-binary CLI that runs collections in CI and serves them to coding agents over MCP. No account, no telemetry, no paid tier.",
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
    logo: "/images/projects/aerosieve/logo.png",
    title: "AeroSieve",
    src: "/images/projects/aerosieve/00-producthunt.webp",
    category: "Voice AI data pipeline",
    description:
      "Turns raw recordings into speech-model training data and names the reason for every clip it drops. On 2,917 real Hindi phone recordings, Whisper's error rate is 8.9 points higher on the clips it rejects, and that test exposed a codec bug I fixed. It caught 24,385 of 24,409 injected defects in six languages.",
    details: [
      "Tested on Gram Vaani Hindi with human-verified transcripts: rejected audio is harder for two unrelated recognizers, and the gap holds within 8 kHz phone audio alone",
      "The same test showed its noise check does not predict errors on real calls, which is now a documented limitation",
      "Decodes audio, cuts it into 3 to 30 second speech clips, drops silent, noisy, clipped and tonal clips, and writes WebDataset shards",
      "Ships as a CLI, Rust crate, Python bindings, a WebSocket service and a WebAssembly build that runs in the browser",
    ],
    tech: ["rust", "python"],
    github: "https://github.com/kunalgoesbyken/AeroSieve",
    live: "https://aerosieve.vercel.app",
    crates: "https://crates.io/crates/aerosieve-cli",
  },
  {
    slug: "seedfall",
    logo: "/images/projects/seedfall/logo.png",
    title: "Seedfall",
    src: "/images/projects/seedfall/00-producthunt.webp",
    category: "Reliability testing",
    description:
      "Deterministic simulation testing for unmodified Go programs. It runs services on wazero under a seeded scheduler, then crashes them mid-write, tears their writes and partitions their network, and replays any failure from one seed. It found a missing directory fsync in hashicorp/raft that leaves a node unable to restart.",
    details: [
      "Compiles Go with the stock toolchain to wasip1 and runs each node on wazero under a seeded scheduler and virtual clock",
      "Failing runs shrink to the few faults that matter",
      "Checks linearizability with Porcupine",
      "Ships seedfall-gym, an RL environment of 42 crash-bug tasks scored on hidden seeds",
    ],
    tech: ["go"],
    github: "https://github.com/kunalgoesbyken/seedfall",
    live: "https://seedfall.kunalrc.xyz",
  },
  {
    slug: "codebase-indexer",
    title: "codebase-indexer",
    src: "/images/projects/codebase-indexer/00-producthunt.webp",
    category: "Search and retrieval",
    description:
      "Offline semantic code search. It chunks source files with tree-sitter ASTs, embeds them with nomic-embed (INT8 ONNX), and fuses BM25 and a hand-written persisted HNSW index with RRF. Only changed files get re-embedded, so a no-op re-index takes 95 ms.",
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
      "I reimplemented Next.js core features (SSR, hydration and file-system routing) from scratch to show how the meta-framework actually works.",
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
      "A hub where async teams coordinate and track work handoffs across timezones. Real-time task updates, bulk operations, an analytics dashboard, GitHub OAuth and issue sync, and you can self-host it with Docker.",
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
