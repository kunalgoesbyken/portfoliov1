import { ArrowDown } from "lucide-react";
import { mergedCount, type RepositoryContribution } from "@/lib/github";
import { PROOF_OF_WORK_ANCHOR } from "@/lib/site";
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

export const proofOfWorkDescription = (repositories: RepositoryContribution[], inReview: number) => {
  if (repositories.length === 0) return undefined;
  return [
    `${countOf(mergedCount(repositories), "merged pull request", "merged pull requests")} across ${countOf(repositories.length, "repository", "repositories")}`,
    inReview > 0 ? `${inReview} in review` : "",
  ]
    .filter(Boolean)
    .join(" · ");
};

export default function OpenSourceSummary({ repositories }: { repositories: RepositoryContribution[] }) {
  if (repositories.length === 0) return null;

  return (
    <a
      href={`#${PROOF_OF_WORK_ANCHOR}`}
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
