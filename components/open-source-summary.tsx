import { mergedCount, type RepositoryContribution } from "@/lib/github";
import { countOf } from "@/lib/utils";

export const proofOfWorkDescription = (repositories: RepositoryContribution[], inReview: number) => {
  if (repositories.length === 0) return undefined;
  return [
    `${countOf(mergedCount(repositories), "merged pull request", "merged pull requests")} across ${countOf(repositories.length, "repository", "repositories")}`,
    inReview > 0 ? `${inReview} in review` : "",
  ].filter(Boolean);
};
