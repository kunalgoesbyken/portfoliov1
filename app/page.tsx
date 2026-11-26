import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import PageShell from "@/components/ui/page-shell";
import { Heading } from "@/components/ui/heading";
import { Section } from "@/components/ui/section";
import { InlineList } from "@/components/ui/inline-list";
import Socials from "@/components/socials";
import Projects from "@/components/projects";
import Timeline from "@/components/timeline";
import GithubGraph from "@/components/githubgraph";
import { proofOfWorkDescription } from "@/components/open-source-summary";
import LazySkills from "@/components/lazy-skills";
import { BlogList } from "@/components/blog-list";
import { getGithubData } from "@/lib/github";
import { getAllBlogs } from "@/util/mdx_clean";
import { PROOF_OF_WORK_ANCHOR, SITE_AVATAR, SITE_LOCATION, SITE_NAME, SITE_ROLE } from "@/lib/site";
import { SOCIAL_LINKS } from "@/lib/social-links";

const LATEST_POSTS = 2;

export default async function Home() {
  const [githubData, posts] = await Promise.all([getGithubData(), getAllBlogs()]);
  const proofItems = proofOfWorkDescription(githubData.repositories, githubData.inReview);

  return (
    <PageShell>
      <header className="mb-10">
        <div className="flex items-start gap-4 md:gap-5">
          <Image
            src={SITE_AVATAR}
            width={160}
            height={160}
            priority
            alt={SITE_NAME}
            className="ring-line size-16 shrink-0 rounded-2xl object-cover ring-1 md:size-20"
          />
          <div className="flex min-w-0 flex-1 flex-wrap items-start justify-between gap-x-4 gap-y-2">
            <div className="min-w-0">
              <Heading as="h1">{SITE_NAME}</Heading>
              <p className="font-custom2 text-fg-muted mt-1.5 text-sm">
                <InlineList>
                  {SITE_ROLE}
                  {SITE_LOCATION}
                  <a
                    href={SOCIAL_LINKS.booking}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hit-44 decoration-line-strong hover:text-fg inline-flex items-center gap-1.5 underline decoration-dashed underline-offset-4 transition-colors"
                  >
                    <span aria-hidden="true" className="bg-accent size-1.5 rounded-full" />
                    Open to work, book a call
                  </a>
                </InlineList>
              </p>
            </div>
            <Socials />
          </div>
        </div>
      </header>

      <Section title="Projects">
        <Projects />
      </Section>

      <Section title="Experience">
        <Timeline />
      </Section>

      <Section
        id={PROOF_OF_WORK_ANCHOR}
        title="Proof of work"
        description={proofItems && <InlineList>{proofItems}</InlineList>}
      >
        <GithubGraph data={githubData} />
      </Section>

      <Section title="Writing" action={<Link href="/blog" className="text-toggle hit-44 shrink-0 gap-1.5">All posts<ArrowRight aria-hidden="true" className="size-3.5" /></Link>}>
        <BlogList posts={posts.slice(0, LATEST_POSTS)} as="h3" />
      </Section>

      <Section title="Skills">
        <LazySkills />
      </Section>
    </PageShell>
  );
}
