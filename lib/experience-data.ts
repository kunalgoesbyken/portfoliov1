import { SITE_LOCATION } from "@/lib/site";
import type { TechKey } from "@/lib/tech-icons";

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
    summary: "First hire, now leads a team of 3 building a backtesting engine that turns plain English into trading strategies.",
    details: [
      "Built the backtesting engine. The LLM's output is constrained to a typed Pydantic IR over 185 indicators and 148 patterns, then compiled deterministically and validated statically",
      "Sped up backtesting with runtime Numba-JIT kernels and whole-universe fused execution over struct-of-arrays float32 Parquet. Liveness analysis loads only the columns a strategy actually references",
      "Backtest and live execution share the same IR and compiler. Tick coalescing keeps evaluation latency bounded, and Redis Lua handles atomic capital allocation across workers",
      "Built an LLM chart terminal with 85 typed operations and symbolic price references, plus a 1.4k-line validator that enforces level provenance so the LLM can't make up chart levels",
      "Built transactional push on Postgres using SKIP LOCKED, visibility leases and idempotent partial indexes. Cut market-data queries from 13.6s to 48-135ms and 5.9s to 782ms, and streamed bars via Redis Pub/Sub to a TradingView datafeed",
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
      "Built [Prism](https://indiankanoon.org/prism/) from scratch. It's AI that reads case law and legal documents at scale.",
      "Got it handling 5,000+ concurrent users.",
    ],
    summary: "Only engineer on Prism, a legal research product launched on a platform with 1.5M users.",
    details: [
      "Built on Django, PostgreSQL and Redis, with LLM workflows spanning 10+ tools",
      "Got 40% lower latency and 92% query accuracy out of a RAG retrieval stack, using PostgreSQL full-text search, query expansion, caching and index tuning",
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
    summary: "A big data migration and a round of database tuning.",
    details: [
      "Moved 500K+ subscriptions of enterprise billing data with zero customer-facing downtime",
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
    summary: "APIs and data retrieval frameworks built to scale.",
    details: [
      "Helped get to a 60% faster release cycle by pulling services out of a 2M+ LOC monolith with Spring Boot and hexagonal architecture",
      "Tuned SQL pagination over 100K+ record tables",
    ],
  },
];

export const experiencePeriod = ({ start, end }: Experience) => `${start} - ${end ?? "Present"}`;
