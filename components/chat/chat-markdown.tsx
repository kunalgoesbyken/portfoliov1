"use client";

import { memo } from "react";
import ReactMarkdown, { type Components } from "react-markdown";

const Heading = ({ children }: { children?: React.ReactNode }) => (
  <p className="text-fg mt-3 mb-1 font-semibold first:mt-0">{children}</p>
);

const COMPONENTS: Components = {
  p: ({ children }) => <p className="mb-3 last:mb-0">{children}</p>,
  h1: Heading,
  h2: Heading,
  h3: Heading,
  h4: Heading,
  ul: ({ children }) => <ul className="marker:text-fg-faint mb-3 ml-4 list-disc space-y-1.5 last:mb-0">{children}</ul>,
  ol: ({ children }) => <ol className="marker:text-fg-faint mb-3 ml-4 list-decimal space-y-1.5 last:mb-0">{children}</ol>,
  li: ({ children }) => <li className="pl-1">{children}</li>,
  a: ({ href, children }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-fg link-underline font-medium">
      {children}
    </a>
  ),
  pre: ({ children }) => (
    <pre className="border-line bg-surface-alt mb-3 overflow-x-auto rounded-lg border p-3 text-xs last:mb-0 [&_code]:bg-transparent [&_code]:p-0">{children}</pre>
  ),
  code: ({ children }) => <code className="bg-muted rounded px-1 py-0.5 font-mono text-[0.85em]">{children}</code>,
  strong: ({ children }) => <strong className="text-fg font-semibold">{children}</strong>,
  hr: () => <hr className="border-line my-3" />,
};

export const ChatMarkdown = memo(function ChatMarkdown({ children }: { children: string }) {
  return <ReactMarkdown components={COMPONENTS}>{children}</ReactMarkdown>;
});
