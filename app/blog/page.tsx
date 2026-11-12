import type { Metadata } from "next";
import PageShell from "@/components/ui/page-shell";
import { Heading } from "@/components/ui/heading";
import { Section } from "@/components/ui/section";
import { BlogList } from "@/components/blog-list";
import { getAllBlogs } from "@/util/mdx_clean";

export const metadata: Metadata = {
  title: "Blog",
  description: "What I write about software engineering, web development and tech",
};

export default async function BlogIndex() {
  const posts = await getAllBlogs();

  return (
    <PageShell>
      <Heading as="h1" className="mb-10">
        Blog
      </Heading>

      <Section>
        <BlogList posts={posts} />
      </Section>
    </PageShell>
  );
}
