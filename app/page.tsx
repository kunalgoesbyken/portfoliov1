import PageShell from "@/components/ui/page-shell";
import { Heading } from "@/components/ui/heading";
import Socials from "@/components/socials";
import Separator from "@/components/separator";
import Projects from "@/components/projects";
import Timeline from "@/components/timeline";
import GithubGraph from "@/components/githubgraph";
import LazySkills from "@/components/lazy-skills";
import GetInTouch from "@/components/get-in-touch";
import { getGithubData } from "@/lib/github";
import { SITE_NAME, SITE_TAGLINES } from "@/lib/site";

const DICE = ["⚀", "⚁", "⚂"];

export default async function Home() {
  const githubData = await getGithubData();

  return (
    <PageShell>
      <div className="flex w-full flex-wrap items-center justify-between gap-1 md:gap-4">
        <Heading as="h1">{SITE_NAME}</Heading>
        <Socials />
      </div>

      <div className="mt-1 font-custom2 max-md:mt-3 max-md:space-y-1.5 max-md:text-[15px] max-md:leading-snug">
        {SITE_TAGLINES.map((line, i) => (
          <p key={line}>
            <span aria-hidden="true" className="font-semibold text-fg">{DICE[i]} </span>
            <span className="text-fg-body">{line}</span>
          </p>
        ))}
      </div>

      <Separator fullWidth className="my-3" />
      <div className="mt-5 border-t border-dashed border-line-strong md:hidden" />

      <Projects />

      <Separator />

      <div className="defer-render"><Timeline /></div>

      <div className="defer-render"><GithubGraph data={githubData} /></div>

      <Separator className="mt-12" />

      <div className="defer-render"><LazySkills /></div>

      <Separator className="mt-4" />

      <div className="defer-render"><GetInTouch /></div>
    </PageShell>
  );
}
