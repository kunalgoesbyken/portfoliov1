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
      "Postman without the account, the bloat or the paywall. Test your APIs on desktop, in the browser or in CI, and let AI agents call them without ever seeing your keys.",
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
      "Cleans messy recordings into training data for speech AI and says why it dropped each clip. On real Hindi phone calls, speech AI made more mistakes on exactly the clips it dropped.",
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
      "Crashes your Go app thousands of ways on purpose, then replays any failure exactly. It found a bug in HashiCorp's Raft that can stop a server from coming back up.",
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
      "Search your code by what it does, not just what it's called. It runs fully offline on your laptop and re-checks an unchanged repo in 95 ms.",
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
      "I rebuilt the core of Next.js from scratch in under 700 lines to see how it really works: page routing, server rendering and the step that makes pages interactive.",
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
      "A task board for remote teams that makes handing work to the next timezone explicit, so nothing gets dropped overnight. Live updates, GitHub sync, and you can host it yourself.",
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
      "Gmail with an assistant you can just ask: find that invoice, open it, draft a reply. It never sends anything until you click confirm.",
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
      "Turning a PDF into a Word file usually breaks the bullets, links and fonts. This Python package puts them back, scanned pages included. Published on PyPI.",
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
