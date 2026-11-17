"use client";

import { cloneElement } from "react";
import dynamic from "next/dynamic";
import type { Activity, BlockElement } from "react-activity-calendar";
import MountOnVisible from "@/components/ui/mount-on-visible";
import OpenSource from "@/components/open-source";
import type { GithubData } from "@/lib/github";

const ActivityCalendar = dynamic(() => import("react-activity-calendar").then((mod) => ({ default: mod.ActivityCalendar })), { ssr: false });
const Tooltip = dynamic(() => import("react-tooltip").then((mod) => ({ default: mod.Tooltip })), { ssr: false });

interface GithubGraphProps {
  data: GithubData;
}

const CONTRIBUTION_COLORS = ["var(--contrib-0)", "var(--contrib-1)", "var(--contrib-2)", "var(--contrib-3)", "var(--contrib-4)"];
const CALENDAR_THEME = { light: CONTRIBUTION_COLORS, dark: CONTRIBUTION_COLORS };
const CALENDAR_HEIGHT = 140;
const CALENDAR_LABELS = { totalCount: "{{count}} contributions in the last year" };

const withTooltip = (block: BlockElement, activity: Activity) =>
  cloneElement(block, {
    "data-tooltip-id": "github-tooltip",
    "data-tooltip-content": `${activity.count} contributions on ${activity.date}`,
  });

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

const GithubGraph = ({ data }: GithubGraphProps) => (
  <>
    {data.contributions.length > 0 && <ContributionCalendar contributions={data.contributions} />}
    <OpenSource repositories={data.repositories} inReview={data.inReview} />
  </>
);

export default GithubGraph;
