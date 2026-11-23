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
    tech: ["python", "go", "pydantic", "numba", "postgres", "redis", "fastapi", "gemini", "tradingview", "ts"],
    highlights: [
      `FinStocks lets Indian traders trade by chatting. Ask about a stock in English or Hindi, turn an idea like "buy when RSI dips under 30" into a strategy, test it on years of data, then trade it through Zerodha, Groww, Dhan or Upstox. I was the first engineer and now lead a team of 3.`,
      "Led the strategy engine. The AI only writes the strategy down in a fixed format and plain code does the math, so the same idea always gives the same backtest, and what you tested is exactly what trades live.",
      `Made the assistant safe to say yes to. It knows "buy 10 HDFC Bank" is an order and "should I buy HDFC Bank" is a question, never places a trade you didn't see on screen, and is tested against tricks like a fake "live mode is on" message.`,
      "Found why the AI news feature gave every stock the same score. The AI was reading web links instead of headlines, one ticker got tagged on 59% of all news, and a label mismatch wiped out every signal. Fixed all of it and made the pipeline fail loudly instead of faking a neutral answer.",
      `Built a chart you can talk to. Say "mark the dojis on Reliance" and it draws them, with a checker that stops the AI from making up price levels.`,
      "Kept it fast and correct. Option chains load in 54 ms instead of 9 seconds, and prices that were off by 5.5 hours (server clock vs Indian time) now line up.",
    ],
    summary: "First engineer, now leads a team of 3 building an AI trading assistant for Indian retail traders.",
    details: [
      "Rebuilt the news pipeline that feeds news-triggered strategies: HTML-stripped summaries (15,501 of 15,509 headlines were truncated markup), word-boundary ticker matching with an ambiguity blocklist (45.5% of tags were noise), a fixed sentiment label mismatch that had scored every stock a neutral 5.0, and hybrid lexical plus vector retrieval fused with Reciprocal Rank Fusion",
      "Replaced silent fallbacks with loud failures across the news and ranking jobs, and added an append-only prediction ledger so model accuracy can be tracked over time",
      "Hardened the LLM service: owner-scoped job cancel and backtest analysis, jobs that survive a dropped socket, blocking handlers moved off the event loop, and order-vs-research routing",
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
