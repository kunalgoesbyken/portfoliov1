import type { Metadata } from "next";
import PageShell from "@/components/ui/page-shell";
import { Heading } from "@/components/ui/heading";
import { Section } from "@/components/ui/section";
import Projects from "@/components/projects";

export const metadata: Metadata = {
  title: "Projects",
  description: "Projects and open source contributions by Kunal Roy Choudhury",
};

export default function ProjectsPage() {
  return (
    <PageShell>
      <Heading as="h1" className="mb-10">
        Projects
      </Heading>
      <Section title="Featured">
        <Projects full />
      </Section>
    </PageShell>
  );
}
