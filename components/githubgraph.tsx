"use client"

import { useState, cloneElement } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { ActivityCalendar, type Activity, type BlockElement } from "react-activity-calendar";
import Separator from "@/components/separator";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { GithubData, Organization, PRState } from "@/lib/github";

const Tooltip = dynamic(() => import("react-tooltip").then(mod => ({ default: mod.Tooltip })), {
  ssr: false
});

interface GithubGraphProps {
  data: GithubData;
}

const CONTRIBUTION_COLORS = ["var(--contrib-0)", "var(--contrib-1)", "var(--contrib-2)", "var(--contrib-3)", "var(--contrib-4)"];
const CALENDAR_THEME = { light: CONTRIBUTION_COLORS, dark: CONTRIBUTION_COLORS };
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
      <p className="text-xs text-neutral-600 dark:text-neutral-400 font-custom2 mb-2">Contributed to</p>
      <ul className="flex flex-wrap gap-2 list-none m-0 p-0">
        {visible.map((org) => (
          <li key={org.login}>
            <a
              href={org.url}
              target="_blank"
              rel="noopener noreferrer"
              className="frame-dashed inline-flex items-center gap-2 h-8 px-2.5 text-xs font-medium font-custom2 text-neutral-700 dark:text-neutral-300 hover:border-neutral-500 dark:hover:border-neutral-400 transition-colors"
            >
              <Image src={org.avatarUrl} alt="" width={18} height={18} className="rounded-sm" />
              @{org.login}
            </a>
          </li>
        ))}
      </ul>
      {hiddenCount > 0 && (
        <div className="flex justify-center mt-4">
          <button onClick={() => setExpanded(!expanded)} className="text-toggle">
            {expanded ? "↑ Show less" : `Show ${hiddenCount} more`}
          </button>
        </div>
      )}
    </div>
  );
};

const GithubGraph = ({ data }: GithubGraphProps) => {
  const [showAll, setShowAll] = useState(false);
  const [filterType, setFilterType] = useState<PRFilter>("all");

  const initialCount = 2;

  const activeFilter: PRFilterConfig = PR_FILTERS[filterType];
  const prs = activeFilter.state ? data.prs.filter((pr) => pr.state === activeFilter.state) : data.prs;

  return (
    <div>
      <Separator fullWidth />


      <h1 className="text-neutral-900 dark:text-neutral-50 font-custom font-bold  text-3xl tracking-tight  py-2"><span className="link--elara">Proof Of Work</span></h1>
      <Separator className="my-0.5" />
      <p className=" font-custom2 text-neutral-700 dark:text-neutral-300 mt-3 px-4 py-[7px]
           text-sm inline-block
          bg-neutral-100 dark:bg-neutral-900 frame-dashed mb-6"> building real tools, solving real problems, and leaving a trail of commits to prove it.</p>




      {data.contributions.length > 0 && (
        <div className="contribution-calendar flex w-full justify-center text-neutral-900 dark:text-neutral-200">
          <ActivityCalendar
            data={data.contributions}
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
            className="!rounded-lg !px-3 !py-2 !text-xs !bg-white !text-neutral-900 dark:!bg-neutral-900 dark:!text-neutral-200 border border-neutral-200 dark:border-neutral-700 shadow-md"
          />
        </div>
      )}

      <OrganizationChips organizations={data.organizations} />

      <div className="mt-4">
          <div className="mb-1 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-neutral-900 dark:text-neutral-50 font-custom font-bold text-2xl tracking-tight">
              <span className="link--elara">Pull Requests</span>
            </h2>
            <SegmentedControl
              label="Filter pull requests by status"
              options={PR_FILTER_OPTIONS}
              value={filterType}
              onChange={setFilterType}
            />
          </div>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 font-custom2 mb-4">
            {activeFilter.description}
          </p>
          <Separator fullWidth />

          {prs.length > 0 ? (
            <div>
              <div className="mt-3 divide-y divide-dashed divide-neutral-200 dark:divide-neutral-800">
                {prs.slice(0, showAll ? prs.length : initialCount).map((pr) => (
                  <div key={pr.id} className="group flex items-start gap-3 py-3">
                    <div className="shrink-0 mt-0.5">
                      <div className={`w-1 h-1 rounded-full bg-gradient-to-r ${PR_STATE_DOT[pr.state]}`} />
                    </div>
                    <a
                      href={pr.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 min-w-0 hover:no-underline"
                    >
                      <h3 className="title-link text-sm font-medium text-neutral-900 dark:text-neutral-50 truncate">
                        {pr.title}
                      </h3>
                      <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-0.5 font-custom2">
                        {pr.repository.nameWithOwner}
                      </p>
                    </a>
                  </div>
                ))}
              </div>
              {prs.length > initialCount && (
                <div className="flex justify-center mt-6">
                  <button
                    onClick={() => setShowAll(!showAll)}
                    className="text-toggle"
                  >
                    {showAll ? "↑ Show less" : `Show ${prs.length - initialCount} more`}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-secondary font-custom2 text-sm mt-4">No pull requests found</div>
          )}
        </div>
    </div>

  );
};

export default GithubGraph;
