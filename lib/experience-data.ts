import { SITE_LOCATION } from "@/lib/site";
import { techNames, type TechKey } from "@/lib/tech-icons";

export interface Experience {
  company: string;
  designation: string;
  start: string;
  end?: string;
  location: string;
  logo: string;
  logoDark?: string;
  logoWidth?: number;
  logoHeight?: number;
  href?: string;
  tech: TechKey[];
  highlights: string[];
  summary: string;
  details: string[];
}

export const EXPERIENCES: Experience[] = [
  {
    company: "FinStocks AI",
    designation: "Lead Software Engineer",
    start: "March 2026",
    location: SITE_LOCATION,
    logo: "/images/logos/finstocks-light.png",
    logoDark: "/images/logos/finstocks-dark.png",
    href: "https://finstocks.ai/",
    tech: ["python", "pydantic", "numba", "postgres", "redis", "fastapi", "tradingview", "ts"],
    highlights: [
      `I was the first hire. Now I lead a team of 3, and we built the thing that turns "buy when RSI dips under 30" into a strategy you can actually backtest.`,
      "The LLM never touches the math. It just fills out a typed spec (185 indicators, 148 patterns) and a compiler takes it from there. Same spec, same result, every time.",
      "Backtests chew through the whole stock universe in one pass with Numba-JIT kernels, and only read the Parquet columns a strategy actually needs.",
      "Backtesting and live trading share one compiler, so what you tested is exactly what trades. Redis Lua scripts stop workers from fighting over capital.",
      "Built a chart terminal you can just talk to. 85 typed operations, plus a 1.4k-line validator whose whole job is stopping the LLM from inventing price levels.",
      "Push notifications run on Postgres with SKIP LOCKED, so nothing gets lost and nobody gets pinged twice.",
      "Market-data queries went from 13.6s to 48-135ms, and another one from 5.9s to 782ms. Live bars stream over Redis Pub/Sub straight into TradingView charts.",
    ],
    summary: "First employee. Leads a 3-engineer team building a natural-language-to-strategy backtesting engine.",
    details: [
      "Architected the backtesting engine: LLM output constrained to a typed Pydantic IR over 185 indicators and 148 patterns, with deterministic compilation and static validation",
      "Accelerated backtesting with runtime Numba-JIT kernels and whole-universe fused execution over struct-of-arrays float32 Parquet; liveness analysis loads only strategy-referenced columns",
      "Unified backtest and live execution through the same IR and compiler: tick coalescing for bounded evaluation latency, Redis Lua for atomic capital allocation across workers",
      "Built an LLM chart terminal with 85 typed operations and symbolic price references, with a 1.4k-line validator enforcing level provenance to prevent fabricated chart levels",
      "Engineered transactional push on Postgres using SKIP LOCKED, visibility leases and idempotent partial indexes; cut market-data queries from 13.6s to 48-135ms and 5.9s to 782ms, streaming bars via Redis Pub/Sub to a TradingView datafeed",
    ],
  },
  {
    company: "Indian Kanoon",
    designation: "Software Developer",
    start: "April 2025",
    end: "Feb 2026",
    location: SITE_LOCATION,
    logo: "/images/logos/kanoon-light.png",
    logoDark: "/images/logos/kanoon-dark.png",
    href: "https://indiankanoon.org/",
    tech: ["python", "django", "react", "redis", "celery", "postgres", "gemini"],
    highlights: [
      `Built <a href="https://indiankanoon.org/prism/" target="_blank" rel="noopener noreferrer" class="underline hover:text-fg-muted transition-colors">Prism</a> from scratch. It's AI that reads case law and legal documents at scale.`,
      "Got it handling 5,000+ concurrent users.",
    ],
    summary: "Sole engineer on Prism, a legal research product launched into a 1.5M-user platform.",
    details: [
      "Built on Django, PostgreSQL and Redis with LLM workflows spanning 10+ tools",
      "Achieved 40% lower latency and 92% query accuracy in a RAG retrieval stack using PostgreSQL full-text search, query expansion, caching and index tuning",
      "Scaled it to 5,000+ concurrent users",
    ],
  },
  {
    company: "Chargebee",
    designation: "Software Engineer Intern",
    start: "Sept 2024",
    end: "April 2025",
    location: SITE_LOCATION,
    logo: "/images/logos/chargebee.png",
    href: "https://www.chargebee.com/",
    tech: ["java", "vue", "postgres", "docker"],
    highlights: [
      "Led a big data migration and a round of database tuning.",
      "Moved 500K+ subscriptions of enterprise billing data, and customers never saw a second of downtime.",
      "Built the migration framework on JOOQ schedulers, plus Vue.js tooling that caught bad data before it moved.",
    ],
    summary: "Large-scale data migration and database optimization.",
    details: [
      "Migrated 500K+ subscriptions of enterprise billing data with zero customer-facing downtime",
      "Built the migration framework with JOOQ schedulers and Vue.js validation tooling",
    ],
  },
  {
    company: "AiDash",
    designation: "Software Engineer Intern",
    start: "Jan 2024",
    end: "Sept 2024",
    location: SITE_LOCATION,
    logo: "/images/logos/aidash.png",
    href: "https://www.linkedin.com/company/aidash/",
    tech: ["java", "python", "django", "mongo", "postgres", "s3", "docker", "jenkins"],
    highlights: [
      "Designed APIs and data retrieval frameworks built to scale.",
      "Broke a monolith into microservices.",
      "Tuned SQL pagination until retrieval felt instant.",
    ],
    summary: "Scalable APIs and data retrieval frameworks.",
    details: [
      "Contributed to a 60% faster release cycle by extracting services from a 2M+ LOC monolith using Spring Boot and hexagonal architecture",
      "Optimized SQL pagination over 100K+ record tables",
    ],
  },
];

export const experiencePeriod = ({ start, end }: Experience) => `${start} - ${end ?? "Present"}`;

const toContext = (exp: Experience) =>
  [
    `## ${exp.company}, ${exp.designation} (${experiencePeriod(exp)})${exp.end ? "" : ", CURRENT ROLE"}`,
    exp.summary,
    ...exp.details.map((detail) => `- ${detail}`),
    `- Stack: ${exp.tech.map((key) => techNames[key]).join(", ")}`,
  ].join("\n");

export const EXPERIENCE_CONTEXT = EXPERIENCES.map(toContext).join("\n\n");
