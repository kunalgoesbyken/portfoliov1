"use client";

import { useId, useState } from "react";
import Image from "next/image";
import { ChevronDown, Star } from "lucide-react";
import { Collapse } from "@/components/ui/collapse";
import { Section } from "@/components/ui/section";
import { ShowMore } from "@/components/ui/show-more";
import { mergedCount, type RepositoryContribution } from "@/lib/github";
import { OPEN_SOURCE_ANCHOR } from "@/lib/site";
import { cn, countOf, formatCompact } from "@/lib/utils";

const VISIBLE_REPOSITORIES = 5;

const ROW_CLASS = "group flex w-full items-start gap-3 py-3 text-left max-md:min-h-12";

function RepositorySummary({ repository }: { repository: RepositoryContribution }) {
  const [latest] = repository.merged;
  return (
    <>
      <Image src={repository.avatarUrl} alt="" width={20} height={20} className="mt-0.5 size-5 shrink-0 rounded-sm" />
      <span className="min-w-0 flex-1">
        <span className="flex items-baseline justify-between gap-3">
          <span className="title-link truncate text-sm font-medium text-fg">
            <span className="md:hidden">{repository.name}</span>
            <span className="max-md:hidden">{repository.nameWithOwner}</span>
          </span>
          <span className="flex shrink-0 items-center gap-1.5 font-custom2 text-xs text-fg-subtle tabular-nums">
            <Star aria-hidden="true" className="size-3" />
            <span className="sr-only">stars</span>
            {formatCompact(repository.stars)}
            <span aria-hidden="true" className="text-fg-faint">
              ·
            </span>
            <span className="text-fg-body">{repository.merged.length} merged</span>
          </span>
        </span>
        <span className="mt-0.5 block truncate font-custom2 text-xs text-fg-muted">{latest.title}</span>
      </span>
    </>
  );
}

function SingleMergeRow({ repository }: { repository: RepositoryContribution }) {
  return (
    <a href={repository.merged[0].url} target="_blank" rel="noopener noreferrer" className={cn(ROW_CLASS, "pr-7")}>
      <RepositorySummary repository={repository} />
    </a>
  );
}

function MultiMergeRow({ repository }: { repository: RepositoryContribution }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const [, ...earlier] = repository.merged;
  return (
    <>
      <button type="button" aria-expanded={open} aria-controls={panelId} onClick={() => setOpen((value) => !value)} className={cn(ROW_CLASS, "cursor-pointer")}>
        <RepositorySummary repository={repository} />
        <ChevronDown
          size={16}
          aria-hidden="true"
          className={cn("mt-0.5 shrink-0 text-fg-faint transition-transform motion-reduce:transition-none", open && "rotate-180")}
        />
      </button>
      <Collapse open={open} id={panelId} label={`Earlier merged pull requests in ${repository.nameWithOwner}`} className="duration-200">
        <ul className="mb-3 ml-8 space-y-2 border-l border-dashed border-line pl-4">
          {earlier.map((pr) => (
            <li key={pr.id}>
              <a href={pr.url} target="_blank" rel="noopener noreferrer" className="group block font-custom2 text-xs text-fg-body hover:text-fg max-md:py-1">
                <span className="title-link">{pr.title}</span>
              </a>
            </li>
          ))}
        </ul>
      </Collapse>
    </>
  );
}

const summaryOf = (repositories: RepositoryContribution[], inReview: number) =>
  [
    `${countOf(mergedCount(repositories), "merged pull request", "merged pull requests")} across ${countOf(repositories.length, "repository", "repositories")}`,
    inReview > 0 ? `${inReview} in review` : "",
  ]
    .filter(Boolean)
    .join(" · ");

export default function OpenSource({ repositories, inReview }: { repositories: RepositoryContribution[]; inReview: number }) {
  const [expanded, setExpanded] = useState(false);

  if (repositories.length === 0) return null;

  const visible = expanded ? repositories : repositories.slice(0, VISIBLE_REPOSITORIES);

  return (
    <Section id={OPEN_SOURCE_ANCHOR} as="h3" size="md" title="Open source" description={summaryOf(repositories, inReview)} className="mt-10">
      <ul className="divide-y divide-dashed divide-line [&>:first-child>*:first-child]:pt-0">
        {visible.map((repository) => (
          <li key={repository.nameWithOwner}>
            {repository.merged.length > 1 ? <MultiMergeRow repository={repository} /> : <SingleMergeRow repository={repository} />}
          </li>
        ))}
      </ul>
      <ShowMore
        expanded={expanded}
        hiddenCount={repositories.length - VISIBLE_REPOSITORIES}
        noun="repo"
        onToggle={() => setExpanded((value) => !value)}
        className="mt-6"
      />
    </Section>
  );
}
