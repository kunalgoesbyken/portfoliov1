import type { Metadata } from "next";
import PageShell from "@/components/ui/page-shell";
import { Heading, Lede } from "@/components/ui/heading";
import Separator from "@/components/separator";
import Projects from "@/components/projects";

export const metadata: Metadata = {
  title: "Projects",
  description: "Projects and open source contributions by Kunal Roy Choudhury",
};

export default function ProjectsPage() {
  return (
    <PageShell>
      <Heading as="h1">Projects</Heading>
      <Lede className="mt-3 max-md:line-clamp-3 md:mt-4">
        Hi there! I love building stuff for people and am passionate about contributing to open source. Here are my
        projects and open source contributions. Feel free to take a look.
      </Lede>
      <Separator className="my-3 w-[212px]" />
      <Projects full />
    </PageShell>
  );
}
