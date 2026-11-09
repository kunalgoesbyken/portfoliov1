import Container from "@/components/containers";
import Socials from "@/components/socials";
import Separator from "@/components/separator";
import { getGithubData } from "@/lib/github";
import PageBorder from "@/components/ui/page-border";
import Projects from "@/components/projects";
import Timeline from "@/components/timeline";
import GithubGraph from "@/components/githubgraph";
import LazySkills from "@/components/lazy-skills";
import GetInTouch from "@/components/get-in-touch";
import { SITE_TAGLINES } from "@/lib/site";

const DICE = ["⚀", "⚁", "⚂"];

export default async function Home() {
  const githubData = await getGithubData();

  return (
    <div className="relative flex min-h-screen justify-center font-sans overflow-hidden">
      <Container className="min-h-screen px-6 sm:px-10 pt-20 md:p-20 md:pb-10 mx-auto">

        <PageBorder side="right" />
        <PageBorder side="left" />

        {/* ---------------------------------------- */}
        {/* HEADING + SOCIALS (FIXED SAME LINE) */}
        {/* ---------------------------------------- */}

        <div className="flex w-full flex-wrap items-center justify-between gap-1 md:gap-4">
          <h1 className="text-3xl md:text-3xl font-bold font-custom tracking-tight text-neutral-900 dark:text-neutral-50">
            <span className="link--elara">Kunal Roy Choudhury</span>
          </h1>

          <Socials />
        </div>

        {/* ---------------------------------------- */}
        {/* SUBTEXT */}
        {/* ---------------------------------------- */}

        <div className="text-secondary font-custom2 text-s mt-1 max-md:mt-3 max-md:text-[15px] max-md:leading-snug max-md:space-y-1.5">
          {SITE_TAGLINES.map((line, i) => (
            <p key={line}>
              <span className="text-neutral-950 dark:text-neutral-100 font-semibold">{DICE[i]} </span>
              <span className="text-neutral-700 dark:text-neutral-300">{line}</span>
            </p>
          ))}
        </div>

        <Separator fullWidth className="my-3" />
        <div className="md:hidden mt-5 border-t border-dashed border-neutral-300 dark:border-neutral-700" />

        <Projects />

        <Separator />

        <div className="defer-render"><Timeline /></div>

        <div className="defer-render"><GithubGraph data={githubData} /></div>

        <Separator className="mt-12" />

        <div className="defer-render"><LazySkills /></div>

        <Separator className="mt-4" />

        <div className="defer-render"><GetInTouch /></div>

      </Container>
    </div>
  );
}