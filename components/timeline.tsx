import Image from 'next/image';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { TechKey } from "@/lib/tech-icons";
import { ExpandableItem } from "@/components/timeline-item";
import { TechIconTooltip } from "@/components/ui/tech-icon-tooltip";

interface ExperienceItem {
  company: string;
  designation: string;
  date: string;
  description: string;
  logo: string;
  logoDark?: string;
  logoWidth?: number;
  logoHeight?: number;
  href?: string;
  tech?: TechKey[];
}

const CompanyLogo = ({ experience }: { experience: ExperienceItem }) => {
  const { company, logo, logoDark, logoWidth = 48, logoHeight = 48, href } = experience;
  const className = "size-12 max-md:size-10 rounded-lg object-contain";

  const images = (
    <>
      <Image
        src={logo}
        alt={company}
        width={logoWidth}
        height={logoHeight}
        className={logoDark ? `${className} dark:hidden` : className}
      />
      {logoDark && (
        <Image
          src={logoDark}
          alt={company}
          width={logoWidth}
          height={logoHeight}
          className={`${className} hidden dark:block`}
        />
      )}
    </>
  );

  if (!href) return images;

  return (
    <Link href={href} target="_blank" className="block">
      {images}
    </Link>
  );
};

export const Timeline = () => {
  const experiences: ExperienceItem[] = [
    {
      company: "FinStocks AI",
      designation: "Lead Software Engineer",
      date: "July 2026 - Present",
      description: `First employee. Architected a natural-language-to-strategy backtesting engine, leading a 3-engineer team — LLM output constrained to a typed Pydantic IR over 185 indicators and 148 patterns, with deterministic compilation and static validation.
Accelerated backtesting with runtime Numba-JIT kernels and whole-universe fused execution over struct-of-arrays float32 Parquet; liveness analysis loads only strategy-referenced columns.
Unified backtest and live execution through the same IR and compiler — tick coalescing for bounded evaluation latency, Redis Lua for atomic capital allocation across workers.
Built an LLM chart terminal with 85 typed operations and symbolic price references, enforcing level provenance through a 1.4k-line validator that prevents fabricated chart levels.
Engineered transactional push on Postgres with SKIP LOCKED, visibility leases and idempotent partial indexes; cut market-data queries from 13.6s to 48-135ms and 5.9s to 782ms, streaming bars via Redis Pub/Sub to a TradingView datafeed.`,
      logo: "/images/logos/finstocks-light.png",
      logoDark: "/images/logos/finstocks-dark.png",
      href: "https://finstocks.ai/",
      tech: ["python", "pydantic", "numba", "postgres", "redis", "fastapi", "tradingview", "ts"],
    },
    {
      company: "CollectEdge",
      designation: "Software Development Engineer",
      date: "March 2026 - June 2026",
      description: `Scaled Rust microservices to 50K+ daily messages across 10+ queues.
Built an AI call analytics platform — transcription, analysis, and sentiment scoring.
Shipped a predictive dialer and a credit risk engine that scores in under 100ms.`,
      logo: "/images/logos/collectedge.jpeg",
      href: "https://www.collectedge.in/",
      logoWidth: 199,
      logoHeight: 36,
      tech: ["rust", "flutter", "aws", "react", "postgres"],
    },
    {
      company: "Indian Kanoon",
      designation: "Software Developer",
      date: "April 2025 - Feb 2026",
      description: `Built <a href="https://indiankanoon.org/prism/" target="_blank" class="underline hover:text-neutral-600 dark:hover:text-neutral-400 transition-colors">Prism</a> from scratch — AI that analyzes case law and legal documents at scale.
Scaled it to 5,000+ concurrent users.`,
      logo: "/images/logos/indian_kanoon_logo.jpeg",
      href: "https://indiankanoon.org/",
      tech: ["python", "django", "react", "redis", "celery", "postgres", "gemini"],
    },
    {
      company: "Chargebee",
      designation: "Software Engineer Intern",
      date: "Sept 2024 - April 2025",
      description: `Led large-scale data migration and database optimization.
Migrated 2 million records, cutting query time by 45%.
Built a validation layer that caught bad data before it reached 500k subscriptions.`,
      logo: "/images/logos/chargebee.jpg",
      href: "https://www.chargebee.com/",
      tech: ["java", "vue", "postgres", "docker"],
    },
    {
      company: "AiDash",
      designation: "Software Engineer Intern",
      date: "Jan 2024 - Sept 2024",
      description: `Designed scalable APIs and data retrieval frameworks.
Decomposed a monolith into microservices.
Optimized SQL pagination for near-instant retrieval.`,
      logo: "/images/logos/aidash.jpg",
      href: "https://www.linkedin.com/company/aidash/",
      tech: ["java", "python", "django", "mongo", "postgres", "s3", "docker", "jenkins"],
    }
  ];

  return (
    <div className="max-w-4xl mx-auto mb-0">
      <h1 className="text-3xl font-bold font-custom tracking-tight text-neutral-900 dark:text-neutral-50 py-2">
        <span className="link--elara">Experiences</span>
      </h1>
      <div className="hidden md:block absolute right-6 left-0 h-px bg-[var(--pattern-fg)] my-0.5 opacity-90 dark:opacity-15"></div>

      <div className="flex flex-col gap-4 max-md:gap-0 max-md:divide-y max-md:divide-dashed max-md:divide-neutral-200 max-md:dark:divide-neutral-800 px-4 max-md:px-0 md:px-0 my-6 max-md:my-3">
        {experiences.map((exp) => (
          <ExpandableItem
            key={exp.company}
            header={
              <>
                {/* Logo */}
                <div className="relative shrink-0 mt-1 max-md:mt-0 z-10">
                  <CompanyLogo experience={exp} />
                </div>

                {/* Content Container */}
                <div className="flex flex-col md:flex-row md:justify-between flex-1 gap-2 md:gap-4 max-md:gap-0.5 max-md:pr-9 min-w-0">
                  <div className="flex flex-col gap-1">
                    <h3 className="text-lg max-md:text-base font-bold text-neutral-900 dark:text-neutral-50 font-custom tracking-wide">
                      {exp.company}
                    </h3>
                    <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400 font-custom2">
                      {exp.designation}
                    </p>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-4 mt-1 md:mt-0 max-md:mt-0">
                    <span className="text-sm max-md:text-[13px] text-neutral-500 dark:text-neutral-500 font-custom2 whitespace-nowrap">
                      {exp.date}
                    </span>
                    <div className="max-md:absolute max-md:right-0 max-md:top-1/2 max-md:-translate-y-1/2 max-md:grid max-md:place-items-center max-md:size-11 p-1 rounded-full bg-transparent group-hover:bg-neutral-200 dark:group-hover:bg-neutral-700 transition-all duration-200 group-aria-expanded/row:rotate-180">
                      <ChevronDown size={16} className="text-neutral-500 dark:text-neutral-400" />
                    </div>
                  </div>
                </div>
              </>
            }
          >
            <div className="px-4 pb-4 max-md:px-0 md:pl-20 md:pr-4">
              {exp.tech && <div className="mb-3"><TechIconTooltip tech={exp.tech} size="sm" scope={exp.company} /></div>}

              <ul className="list-disc pl-4 space-y-2 text-sm text-neutral-600 dark:text-neutral-300 font-custom2 leading-relaxed">
                {exp.description
                  .split("\n")
                  .filter((line) => line.trim() !== "")
                  .map((point, i) => (
                    <li
                      key={i}
                      dangerouslySetInnerHTML={{ __html: point }}
                    />
                  ))}
              </ul>
            </div>
          </ExpandableItem>
        ))}
      </div>
    </div>
  );
};

export default Timeline;
