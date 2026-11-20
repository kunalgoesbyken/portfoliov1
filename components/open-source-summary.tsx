import Image from "next/image";
import { byStars, mergedCount, type RepositoryContribution } from "@/lib/github";
import { PROOF_OF_WORK_ANCHOR } from "@/lib/site";
import { countOf, formatList } from "@/lib/utils";

const HEADLINE_REPOSITORIES = 4;

const contributedTo = (headline: RepositoryContribution[], total: number) => {
  const names = headline.map((repository) => repository.name);
  const rest = total - headline.length;
  return formatList(rest > 0 ? [...names, `${rest} more`] : names);
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

  const headline = byStars(repositories).slice(0, HEADLINE_REPOSITORIES);

  return (
    <a href={`#${PROOF_OF_WORK_ANCHOR}`} className="action-chip">
      <span className="flex gap-1">
        {headline.map((repository) => (
          <Image
            key={repository.nameWithOwner}
            src={repository.avatarUrl}
            alt=""
            title={repository.nameWithOwner}
            width={16}
            height={16}
            className="size-4 rounded-sm"
          />
        ))}
      </span>
      <span>
        {countOf(mergedCount(repositories), "PR merged", "PRs merged")}
        <span className="sr-only"> into {contributedTo(headline, repositories.length)}</span>
      </span>
    </a>
  );
}
