import Image from 'next/image';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { TechKey } from "@/lib/tech-icons";
import { ExpandableItem } from "@/components/timeline-item";

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
  const className = "size-12 max-md:size-10 rounded-lg border border-line bg-surface-raised p-1.5 object-contain";

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
    <Link href={href} target="_blank" rel="noopener noreferrer" className="block">
      {images}
    </Link>
  );
};

export const Timeline = () => {
  const experiences: ExperienceItem[] = [
    {
      company: "FinStocks AI",
      designation: "Lead Software Engineer",
      date: "March 2026 - Present",
      description: `I was the first hire. Now I lead a team of 3, and we built the thing that turns "buy when RSI dips under 30" into a strategy you can actually backtest.
The LLM never touches the math. It just fills out a typed spec (185 indicators, 148 patterns) and a compiler takes it from there. Same spec, same result, every time.
Backtests chew through the whole stock universe in one pass with Numba-JIT kernels, and only read the Parquet columns a strategy actually needs.
Backtesting and live trading share one compiler, so what you tested is exactly what trades. Redis Lua scripts stop workers from fighting over capital.
Built a chart terminal you can just talk to. 85 typed operations, plus a 1.4k-line validator whose whole job is stopping the LLM from inventing price levels.
Push notifications run on Postgres with SKIP LOCKED, so nothing gets lost and nobody gets pinged twice.
Market-data queries went from 13.6s to 48-135ms, and another one from 5.9s to 782ms. Live bars stream over Redis Pub/Sub straight into TradingView charts.`,
      logo: "/images/logos/finstocks-light.png",
      logoDark: "/images/logos/finstocks-dark.png",
      href: "https://finstocks.ai/",
      tech: ["python", "pydantic", "numba", "postgres", "redis", "fastapi", "tradingview", "ts"],
    },
    {
      company: "Indian Kanoon",
      designation: "Software Developer",
      date: "April 2025 - Feb 2026",
      description: `Built <a href="https://indiankanoon.org/prism/" target="_blank" rel="noopener noreferrer" class="underline hover:text-fg-muted transition-colors">Prism</a> from scratch. It's AI that reads case law and legal documents at scale.
Got it handling 5,000+ concurrent users.`,
      logo: "/images/logos/kanoon-light.png",
      logoDark: "/images/logos/kanoon-dark.png",
      href: "https://indiankanoon.org/",
      tech: ["python", "django", "react", "redis", "celery", "postgres", "gemini"],
    },
    {
      company: "Chargebee",
      designation: "Software Engineer Intern",
      date: "Sept 2024 - April 2025",
      description: `Led a big data migration and a round of database tuning.
Moved 2 million records and cut query time by 45%.
Built a validation layer that caught bad data before it reached 500k subscriptions.`,
      logo: "/images/logos/chargebee.png",
      href: "https://www.chargebee.com/",
      tech: ["java", "vue", "postgres", "docker"],
    },
    {
      company: "AiDash",
      designation: "Software Engineer Intern",
      date: "Jan 2024 - Sept 2024",
      description: `Designed APIs and data retrieval frameworks built to scale.
Broke a monolith into microservices.
Tuned SQL pagination until retrieval felt instant.`,
      logo: "/images/logos/aidash.png",
      href: "https://www.linkedin.com/company/aidash/",
      tech: ["java", "python", "django", "mongo", "postgres", "s3", "docker", "jenkins"],
    }
  ];

  return (
    <div className="mb-6">
      <div className="flex flex-col divide-y divide-dashed divide-line">
        {experiences.map((exp) => (
          <ExpandableItem
            key={exp.company}
            tech={exp.tech}
            scope={exp.company}
            header={
              <>
                <div className="relative shrink-0 mt-1 max-md:mt-0 z-10">
                  <CompanyLogo experience={exp} />
                </div>

                <div className="flex flex-col md:flex-row md:justify-between flex-1 gap-2 md:gap-4 max-md:gap-0.5 max-md:pr-9 min-w-0">
                  <div className="flex flex-col gap-1">
                    <h3 className="font-custom text-xl text-fg">
                      {exp.company}
                    </h3>
                    <p className="text-sm font-medium text-fg-muted font-custom2">
                      {exp.designation}
                    </p>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-4 mt-1 md:mt-0 max-md:mt-0">
                    <span className="font-custom2 text-sm whitespace-nowrap text-fg-subtle">
                      {exp.date}
                    </span>
                    <div className="max-md:absolute max-md:right-0 max-md:top-1/2 max-md:-translate-y-1/2 max-md:grid max-md:place-items-center max-md:size-11 p-1 text-fg-faint group-hover/row:text-fg transition-[color,rotate] duration-200 group-aria-expanded/row:rotate-180">
                      <ChevronDown size={16} />
                    </div>
                  </div>
                </div>
              </>
            }
          >
            <ul className="space-y-2 text-sm text-fg-body font-custom2 leading-relaxed">
                {exp.description
                  .split("\n")
                  .filter((line) => line.trim() !== "")
                  .map((point, i) => (
                    <li
                      key={i}
                      className="relative pl-4 before:absolute before:left-0 before:content-['-'] before:text-fg-faint"
                      dangerouslySetInnerHTML={{ __html: point }}
                    />
                  ))}
            </ul>
          </ExpandableItem>
        ))}
      </div>
    </div>
  );
};

export default Timeline;
