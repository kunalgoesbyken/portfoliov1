import ReactMarkdown, { type Components } from "react-markdown";

const COMPONENTS: Components = {
  p: ({ children }) => <>{children}</>,
  a: ({ href, children }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="underline transition-colors hover:text-fg-muted">
      {children}
    </a>
  ),
};

export function InlineMarkdown({ children }: { children: string }) {
  return <ReactMarkdown components={COMPONENTS}>{children}</ReactMarkdown>;
}
