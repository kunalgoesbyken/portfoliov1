import Image from "next/image";
import { CalendarDays } from "lucide-react";
import PageShell from "@/components/ui/page-shell";
import { Heading } from "@/components/ui/heading";
import { Section } from "@/components/ui/section";
import Socials from "@/components/socials";
import Projects from "@/components/projects";
import Timeline from "@/components/timeline";
import GithubGraph from "@/components/githubgraph";
import LazySkills from "@/components/lazy-skills";
import { getGithubData } from "@/lib/github";
import { ChaosButton } from "@/components/chaos";
import { SITE_LOCATION, SITE_NAME, SITE_ROLE, SITE_TAGLINES } from "@/lib/site";
import { SOCIAL_LINKS } from "@/lib/social-links";

export default async function Home() {
  const githubData = await getGithubData();

  return (
    <PageShell>
      <header data-chaos className="mb-10">
        <div className="flex items-start gap-4 md:gap-5">
          <Image
            src="/images/kunal-sm.jpg"
            width={160}
            height={160}
            priority
            alt={SITE_NAME}
            className="ring-line size-16 shrink-0 rounded-2xl object-cover ring-1 md:size-20"
          />
          <div className="flex min-w-0 flex-1 flex-wrap items-start justify-between gap-x-4 gap-y-2">
            <div className="min-w-0">
              <Heading as="h1">{SITE_NAME}</Heading>
              <p className="font-custom2 text-fg-muted mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1.5 text-sm">
                <span>{SITE_ROLE}</span>
                <span aria-hidden="true" className="text-fg-faint">
                  ·
                </span>
                <span>{SITE_LOCATION}</span>
                <span className="border-line-strong text-fg-body rounded-full border px-2.5 py-0.5 text-xs font-medium">
                  Open to work
                </span>
              </p>
            </div>
            <Socials />
          </div>
        </div>

        <ul className="font-custom2 text-fg-body mt-5 space-y-1 text-base">
          {SITE_TAGLINES.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <a
            href={SOCIAL_LINKS.booking}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-solid px-4 py-2 max-md:min-h-11"
          >
            <CalendarDays aria-hidden="true" className="size-4" />
            Book an intro call
          </a>
          <ChaosButton />
        </div>
      </header>

      <Section title="Projects">
        <Projects />
      </Section>

      <Section title="Experience" className="defer-render">
        <Timeline />
      </Section>

      <Section title="Proof of work" className="defer-render">
        <GithubGraph data={githubData} />
      </Section>

      <Section title="Skills" className="defer-render">
        <LazySkills />
      </Section>
    </PageShell>
  );
}
