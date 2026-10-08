import Container from "@/components/containers";
import Projects from "@/components/projects";
import PageBorder from "@/components/ui/page-border";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects | Kunal",
  description: "Projects and open source contributions by Kunal Roy Choudhury",
};

export default function ProjectsPage() {
  return (
    <Container className="min-h-screen px-6 sm:px-10 pt-20 md:p-20 md:pb-10 mx-auto">

      <PageBorder side="right" />
      <PageBorder side="left" />

      <h1 className="text-neutral-900 dark:text-neutral-50 font-custom font-semibold text-3xl tracking-tight ">
        <span className="link--elara">Projects</span>
      </h1>

      <p className="tracking-tight font-custom2 text-neutral-600 dark:text-neutral-400 max-w-lg text-sm md:text-base mt-3 md:mt-4 max-md:line-clamp-3">
        Hi there! I love building stuff for people and am passionate about contributing to open source. Here are my projects and open source contributions—feel free to take a look.
      </p>

      <div className="hidden md:block absolute right-6 w-[212px] h-px bg-[var(--pattern-fg)] my-3 opacity-90 dark:opacity-15"></div>

      <Projects full={true} />

    </Container>
  )
}