import PageShell from "@/components/ui/page-shell";
import { Heading } from "@/components/ui/heading";
import { Section } from "@/components/ui/section";
import Socials from "@/components/socials";
import Projects from "@/components/projects";
import Timeline from "@/components/timeline";
import GithubGraph from "@/components/githubgraph";
import LazySkills from "@/components/lazy-skills";
import GetInTouch from "@/components/get-in-touch";
import { getGithubData } from "@/lib/github";
import { SITE_NAME, SITE_TAGLINES } from "@/lib/site";

export default async function Home() {
  const githubData = await getGithubData();

  return (
    <PageShell>
      <div className="flex w-full flex-wrap items-center justify-between gap-1 md:gap-4">
        <Heading as="h1">{SITE_NAME}</Heading>
        <Socials />
      </div>

      <ul className="mt-3 mb-10 space-y-1 font-custom2 text-base text-fg-body">
        {SITE_TAGLINES.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>

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

      <Section title="Get in touch" description="I'm currently open to meaningful work." className="defer-render">
        <GetInTouch />
      </Section>
    </PageShell>
  );
}
