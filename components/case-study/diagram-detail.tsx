import type { ElementType, ReactNode } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type {
  DiagramLink,
  DiagramNode,
  DiagramSelection,
} from "@/components/case-study/diagram-graph";

function LinkList({
  heading,
  links,
  icon,
  onSelect,
}: {
  heading: string;
  links: DiagramLink[];
  icon: ReactNode;
  onSelect: (key: string) => void;
}) {
  if (links.length === 0) return null;
  return (
    <div className="mt-5">
      <p className="eyebrow">{heading}</p>
      <ul className="divide-line border-line mt-1 divide-y border-y">
        {links.map(({ node, label }) => (
          <li key={node.key}>
            <button
              type="button"
              onClick={() => onSelect(node.key)}
              className="font-custom2 text-fg hover:text-fg-subtle flex min-h-11 w-full cursor-pointer items-center gap-3 py-2 text-left text-sm transition-colors"
            >
              <span className="text-fg-faint" aria-hidden="true">
                {icon}
              </span>
              <span className="min-w-0 flex-1 break-words">{node.label}</span>
              {label && (
                <span className="text-fg-subtle max-w-[40%] shrink-0 text-right text-xs break-words">
                  {label}
                </span>
              )}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function DiagramNodeDetail({
  node,
  selection,
  onSelect,
  detailAs: Detail = "p",
}: {
  node: DiagramNode;
  selection: DiagramSelection | null;
  onSelect: (key: string) => void;
  detailAs?: ElementType;
}) {
  return (
    <>
      <Detail className="font-custom2 text-fg-body text-sm leading-relaxed">
        {node.detail}
      </Detail>
      {node.why && (
        <div className="border-accent mt-5 border-l-2 pl-4">
          <p className="eyebrow text-accent">Why this choice</p>
          <p className="font-custom2 text-fg mt-2 text-sm leading-relaxed">
            {node.why}
          </p>
        </div>
      )}
      {selection && (
        <>
          <LinkList
            heading="Receives from"
            links={selection.inputs}
            icon={<ArrowLeft size={14} />}
            onSelect={onSelect}
          />
          <LinkList
            heading="Sends to"
            links={selection.outputs}
            icon={<ArrowRight size={14} />}
            onSelect={onSelect}
          />
        </>
      )}
    </>
  );
}
