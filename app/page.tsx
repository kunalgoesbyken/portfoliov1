import Container from "@/components/containers";
import Socials from "@/components/socials";
import Separator from "@/components/separator";
import { getGithubData } from "@/lib/github";
import PageBorder from "@/components/ui/page-border";
import { Suspense } from "react";
import Projects from "@/components/projects";
import Timeline from "@/components/timeline";
import GithubGraph from "@/components/githubgraph";
import LazySkills from "@/components/lazy-skills";
import GetInTouch from "@/components/get-in-touch";








function SectionSkeleton() {
  return <div className="w-full h-48 animate-pulse bg-neutral-100 dark:bg-neutral-900 rounded-lg" />;
}

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
          <p>
            <span className="text-neutral-950 dark:text-neutral-100 font-semibold font-custom">⚀ </span>
            <span className="text-neutral-700 dark:text-neutral-300">I build backends that don't fall over — and frontends like this one.</span>
          </p>

          <p>
            <span className="text-neutral-950 dark:text-neutral-100 font-semibold">⚁ </span>
            <span className="text-neutral-700 dark:text-neutral-300">Rust, Go, and the boring reliability work most people skip.</span>
          </p>

          <p>
            <span className="text-neutral-950 dark:text-neutral-100 font-semibold">⚂ </span>
            <span className="text-neutral-700 dark:text-neutral-300">
              AI tools, shipped and in production. Not demos.
            </span>
          </p>
        </div>

        <Separator fullWidth className="my-3" />
        <div className="md:hidden mt-5 border-t border-dashed border-neutral-300 dark:border-neutral-700" />



        <Suspense fallback={<SectionSkeleton />}>
          <Projects />
        </Suspense>

        <Separator />


        <div className="defer-render"><Suspense fallback={<SectionSkeleton />}>
          <Timeline />
        </Suspense></div>



        <div className="defer-render"><Suspense fallback={<SectionSkeleton />}>
          <GithubGraph data={githubData} />
        </Suspense></div>

        <Separator className="mt-12" />

        <div className="defer-render"><Suspense fallback={<SectionSkeleton />}>
          <LazySkills />
        </Suspense></div>

        <Separator className="mt-4" />

        <div className="defer-render"><Suspense fallback={<SectionSkeleton />}>
          <GetInTouch />
        </Suspense></div>


      </Container>
    </div>
  );
}