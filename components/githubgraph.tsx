"use client";

import { useState, cloneElement } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import type { Activity, BlockElement } from "react-activity-calendar";
import Separator from "@/components/separator";
import MountOnVisible from "@/components/ui/mount-on-visible";
import { Heading } from "@/components/ui/heading";
import { ShowMore } from "@/components/ui/show-more";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { GithubData, Organization, PRState } from "@/lib/github";

const ActivityCalendar = dynamic(() => import("react-activity-calendar").then((mod) => ({ default: mod.ActivityCalendar })), { ssr: false });
const Tooltip = dynamic(() => import("react-tooltip").then((mod) => ({ default: mod.Tooltip })), { ssr: false });

interface GithubGraphProps {
  data: GithubData;
}

const CONTRIBUTION_COLORS = ["var(--contrib-0)", "var(--contrib-1)", "var(--contrib-2)", "var(--contrib-3)", "var(--contrib-4)"];
const CALENDAR_THEME = { light: CONTRIBUTION_COLORS, dark: CONTRIBUTION_COLORS };
const CALENDAR_HEIGHT = 140;
const CALENDAR_LABELS = { totalCount: "{{count}} contributions in the last year" };

interface PRFilterConfig {
  label: string;
  description: string;
  state?: PRState;
}

const PR_FILTERS = {
  all: { label: "All", description: "Every pull request, latest first" },
  merged: { label: "Merged", description: "Merged contributions to open source", state: "MERGED" },
  open: { label: "Open", description: "Active pull requests", state: "OPEN" },
  closed: { label: "Closed", description: "Closed pull requests", state: "CLOSED" },
} satisfies Record<string, PRFilterConfig>;

type PRFilter = keyof typeof PR_FILTERS;

const PR_FILTER_OPTIONS = (Object.keys(PR_FILTERS) as PRFilter[]).map((value) => ({ value, label: PR_FILTERS[value].label }));

const PR_STATE_DOT: Record<PRState, string> = {
  MERGED: "from-purple-400 to-pink-400",
  OPEN: "from-green-400 to-emerald-400",
  CLOSED: "from-red-400 to-rose-400",
};

const withTooltip = (block: BlockElement, activity: Activity) =>
  cloneElement(block, {
    "data-tooltip-id": "github-tooltip",
    "data-tooltip-content": `${activity.count} contributions on ${activity.date}`,
  });

const VISIBLE_ORGANIZATIONS = 10;

const OrganizationChips = ({ organizations }: { organizations: Organization[] }) => {
  const [expanded, setExpanded] = useState(false);

  if (organizations.length === 0) return null;

  const hiddenCount = organizations.length - VISIBLE_ORGANIZATIONS;
  const visible = expanded ? organizations : organizations.slice(0, VISIBLE_ORGANIZATIONS);

  return (
    <div className="mt-6">
      <p className="mb-2 font-custom2 text-xs text-fg-muted">Contributed to</p>
      <ul className="flex flex-wrap gap-2">
        {visible.map((org) => (
          <li key={org.login}>
            <a
              href={org.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hit-44 frame-dashed inline-flex h-8 items-center gap-2 px-2.5 font-custom2 text-xs font-medium text-fg-body transition-colors hover:border-line-hover"
            >
              <Image src={org.avatarUrl} alt="" width={18} height={18} className="rounded-sm" />
              @{org.login}
            </a>
          </li>
        ))}
      </ul>
      <ShowMore expanded={expanded} hiddenCount={hiddenCount} onToggle={() => setExpanded((value) => !value)} className="mt-4" />
    </div>
  );
};

const PR_PREVIEW_COUNT = 2;

const ContributionCalendar = ({ contributions }: { contributions: Activity[] }) => (
  <MountOnVisible minHeight={CALENDAR_HEIGHT}>
    <div className="contribution-calendar flex w-full justify-center text-fg" style={{ minHeight: CALENDAR_HEIGHT }}>
      <ActivityCalendar
        data={contributions}
        theme={CALENDAR_THEME}
        colorScheme="light"
        labels={CALENDAR_LABELS}
        blockSize={10}
        blockMargin={3}
        fontSize={12}
        renderBlock={withTooltip}
      />
      <Tooltip
        id="github-tooltip"
        noArrow
        opacity={1}
        className="!rounded-lg border border-line !bg-surface-raised !px-3 !py-2 !text-xs !text-fg shadow-md"
      />
    </div>
  </MountOnVisible>
);

const PullRequests = ({ prs }: { prs: GithubData["prs"] }) => {
  const [showAll, setShowAll] = useState(false);
  const [filterType, setFilterType] = useState<PRFilter>("all");
  const activeFilter: PRFilterConfig = PR_FILTERS[filterType];
  const filtered = activeFilter.state ? prs.filter((pr) => pr.state === activeFilter.state) : prs;
  const visible = showAll ? filtered : filtered.slice(0, PR_PREVIEW_COUNT);

  return (
    <div className="mt-4">
      <div className="mb-1 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Heading as="h3" size="md">
          Pull Requests
        </Heading>
        <SegmentedControl label="Filter pull requests by status" options={PR_FILTER_OPTIONS} value={filterType} onChange={setFilterType} />
      </div>
      <p className="mb-4 font-custom2 text-xs text-fg-muted">{activeFilter.description}</p>
      <Separator fullWidth />

      {filtered.length === 0 ? (
        <p className="mt-4 font-custom2 text-sm text-fg-muted">No pull requests found</p>
      ) : (
        <>
          <ul className="mt-3 divide-y divide-dashed divide-line">
            {visible.map((pr) => (
              <li key={pr.id} className="group flex items-start gap-3 py-3">
                <span aria-hidden="true" className={`mt-2 size-1 shrink-0 rounded-full bg-gradient-to-r ${PR_STATE_DOT[pr.state]}`} />
                <a href={pr.url} target="_blank" rel="noopener noreferrer" className="min-w-0 flex-1 max-md:py-1">
                  <span className="title-link block truncate text-sm font-medium text-fg">{pr.title}</span>
                  <span className="mt-0.5 block font-custom2 text-xs text-fg-subtle">{pr.repository.nameWithOwner}</span>
                </a>
              </li>
            ))}
          </ul>
          <ShowMore
            expanded={showAll}
            hiddenCount={filtered.length - PR_PREVIEW_COUNT}
            onToggle={() => setShowAll((value) => !value)}
            className="mt-6"
          />
        </>
      )}
    </div>
  );
};

const GithubGraph = ({ data }: GithubGraphProps) => (
  <section>
    <Separator fullWidth />
    <Heading className="py-2">Proof Of Work</Heading>
    <Separator className="my-0.5" />
    <p className="callout mt-3 mb-6">building real tools, solving real problems, and leaving a trail of commits to prove it.</p>

    {data.contributions.length > 0 && <ContributionCalendar contributions={data.contributions} />}
    <OrganizationChips organizations={data.organizations} />
    <PullRequests prs={data.prs} />
  </section>
);

export default GithubGraph;
