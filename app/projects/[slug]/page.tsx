import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import Container from "@/components/containers";
import PageBorder from "@/components/ui/page-border";
import { getMDXComponents } from "@/mdx-components";
import { CaseStudyHeader } from "@/components/case-study/header";
import { StatStrip } from "@/components/case-study/stat-strip";
import { Gallery } from "@/components/case-study/gallery";
import { Section } from "@/components/case-study/section";
import { Highlight, Highlights } from "@/components/case-study/highlights";
import { Diagram } from "@/components/case-study/diagram";
import { ProjectPager } from "@/components/case-study/pager";
import { getCaseStudy } from "@/lib/case-studies";
import { ALL_PROJECTS } from "@/lib/projects-data";

type PageProps = { params: Promise<{ slug: string }> };

const CASE_STUDY_COMPONENTS = { ...getMDXComponents({}), Section, Highlights, Highlight, Diagram };

export const dynamicParams = false;

export const generateStaticParams = () => ALL_PROJECTS.map(({ slug }) => ({ slug }));

const findProject = (slug: string) => ALL_PROJECTS.find((p) => p.slug === slug) ?? notFound();

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = findProject(slug);
  const { meta } = await getCaseStudy(slug);
  return { title: `${project.title} | Kunal`, description: meta.summary };
}

export default async function CaseStudyPage({ params }: PageProps) {
  const { slug } = await params;
  const project = findProject(slug);
  const { meta, content } = await getCaseStudy(slug);

  return (
    <Container className="min-h-screen px-6 sm:px-10 pt-24 md:p-20 md:pb-10 mx-auto">
      <PageBorder side="right" />
      <PageBorder side="left" />
      <CaseStudyHeader project={project} category={meta.category} summary={meta.summary} />
      <StatStrip stats={meta.stats} />
      <Gallery items={meta.gallery} />
      <article className="prose max-w-none font-custom2 tracking-normal">
        <MDXRemote
          source={content}
          components={CASE_STUDY_COMPONENTS}
          options={{ blockJS: false, mdxOptions: { remarkPlugins: [remarkGfm] } }}
        />
      </article>
      <ProjectPager slug={slug} />
    </Container>
  );
}
