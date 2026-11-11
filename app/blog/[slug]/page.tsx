import type { Metadata } from "next";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import { MDXRemote, type MDXRemoteProps } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypePrettyCode from "rehype-pretty-code";
import PageShell from "@/components/ui/page-shell";
import { getMDXComponents } from "@/mdx-components";
import { getAllBlogs, getSingleBlog, type Blog } from "@/util/mdx_clean";
import { formatDate } from "@/lib/utils";
import { LCP_IMAGE_PROPS } from "@/lib/image";

type PageProps = { params: Promise<{ slug: string }> };

const MDX_OPTIONS: MDXRemoteProps["options"] = {
  mdxOptions: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [[rehypePrettyCode, { theme: "github-dark-dimmed", keepBackground: true }]],
  },
};

export const generateStaticParams = async () =>
  (await getAllBlogs()).filter((post) => !post.externalUrl && post.slug).map((post) => ({ slug: post.slug! }));

const loadBlog = async (slug: string): Promise<Blog | null> => getSingleBlog(slug).catch(() => null);

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const blog = await loadBlog(slug);
  return {
    title: blog?.data.title ?? "Blog",
    description: blog?.data.description ?? "Reading a blog...",
  };
}

export default async function SingleBlogPage({ params }: PageProps) {
  const { slug } = await params;
  const blog = await loadBlog(slug);
  if (!blog) notFound();

  const { content, data } = blog;
  if (data.externalUrl) redirect(data.externalUrl);

  return (
    <PageShell className="font-custom2 tracking-tight">
      <h1 className="font-custom text-4xl font-bold text-fg md:text-5xl">{data.title ?? slug}</h1>

      {data.date && (
        <time dateTime={data.date} className="mt-2 block text-right text-sm text-fg-muted">
          {formatDate(data.date)}
        </time>
      )}

      {data.image && (
        <div className="mx-auto my-6 max-w-3xl">
          <Image
            src={data.image.replace(/^\/public/, "")}
            alt={data.title ?? ""}
            width={1200}
            height={600}
            {...LCP_IMAGE_PROPS}
            sizes="(max-width: 768px) 100vw, 768px"
            className="h-auto w-full rounded-xl object-cover shadow-xl"
          />
        </div>
      )}

      <div className="prose mx-auto font-custom2 tracking-normal">
        <MDXRemote source={content} components={getMDXComponents({})} options={MDX_OPTIONS} />
      </div>
    </PageShell>
  );
}
