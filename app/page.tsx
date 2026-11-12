import { Fragment } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays } from "lucide-react";
import PageShell from "@/components/ui/page-shell";
import { Heading } from "@/components/ui/heading";
import { Section } from "@/components/ui/section";
import Socials from "@/components/socials";
import Projects from "@/components/projects";
import Timeline from "@/components/timeline";
import GithubGraph from "@/components/githubgraph";
import LazySkills from "@/components/lazy-skills";
import { BlogList } from "@/components/blog-list";
import { getGithubData } from "@/lib/github";
import { getAllBlogs } from "@/util/mdx_clean";
import { SITE_LOCATION, SITE_NAME, SITE_ROLE, SITE_TAGLINES } from "@/lib/site";
import { SOCIAL_LINKS } from "@/lib/social-links";

const LATEST_POSTS = 2;

export default async function Home() {
  const [githubData, posts] = await Promise.all([getGithubData(), getAllBlogs()]);

  return (
    <PageShell>
      <header className="mb-10">
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
              <p className="font-custom2 text-fg-muted mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
                {[SITE_ROLE, SITE_LOCATION, "Open to work"].map((item, i) => (
                  <Fragment key={item}>
                    {i > 0 && (
                      <span aria-hidden="true" className="text-fg-faint">
                        ·
                      </span>
                    )}
                    <span>{item}</span>
                  </Fragment>
                ))}
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
            className="frame-dashed font-custom2 text-fg-body hover:border-line-hover hover:text-fg inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm transition-colors max-md:min-h-11"
          >
            <CalendarDays aria-hidden="true" className="size-3.5" />
            Book an intro call
          </a>
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

      <Section title="Writing" className="defer-render" action={<Link href="/blog" className="text-toggle gap-1.5">All posts<ArrowRight aria-hidden="true" className="size-3.5" /></Link>}>
        <BlogList posts={posts.slice(0, LATEST_POSTS)} as="h3" />
      </Section>

      <Section title="Skills" className="defer-render">
        <LazySkills />
      </Section>
    </PageShell>
  );
}
