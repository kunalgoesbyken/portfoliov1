import { ArrowDown } from "lucide-react";
import { mergedCount, type RepositoryContribution } from "@/lib/github";
import { OPEN_SOURCE_ANCHOR } from "@/lib/site";
import { countOf, listParts } from "@/lib/utils";

const HEADLINE_REPOSITORIES = 4;

const headlineNames = (repositories: RepositoryContribution[]) => {
  const names = [...repositories]
    .sort((a, b) => b.stars - a.stars)
    .slice(0, HEADLINE_REPOSITORIES)
    .map((repository) => repository.name);
  const rest = repositories.length - names.length;
  return rest > 0 ? [...names, `${rest} more`] : names;
};

export default function OpenSourceSummary({ repositories }: { repositories: RepositoryContribution[] }) {
  if (repositories.length === 0) return null;

  return (
    <a
      href={`#${OPEN_SOURCE_ANCHOR}`}
      className="group font-custom2 text-fg-muted hover:text-fg-body mt-4 inline-flex items-center gap-1.5 text-sm transition-colors max-md:min-h-11"
    >
      <span>
        {countOf(mergedCount(repositories), "pull request", "pull requests")} merged into{" "}
        {listParts(headlineNames(repositories)).map((part, index) =>
          part.type === "element" ? (
            <span key={index} className="text-fg">
              {part.value}
            </span>
          ) : (
            part.value
          ),
        )}
      </span>
      <ArrowDown aria-hidden="true" className="size-3.5 shrink-0 transition-transform group-hover:translate-y-0.5 motion-reduce:transition-none" />
    </a>
  );
}
