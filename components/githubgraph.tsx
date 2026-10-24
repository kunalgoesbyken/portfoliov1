"use client"

import { useEffect, useRef, useState, cloneElement } from "react";
import Separator from "@/components/separator";
import MountOnVisible from "@/components/ui/mount-on-visible";
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";
import Image from "next/image";
import { GithubData, Organization, PR } from "@/lib/github";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { GITHUB_USERNAME } from "@/lib/social-links";

const GitHubCalendar = dynamic(() => import("react-github-calendar").then(mod => ({ default: mod.GitHubCalendar })), {
  loading: () => <div className="w-full flex justify-center p-8">Loading GitHub activity...</div>,
  ssr: false
});

const Tooltip = dynamic(() => import("react-tooltip").then(mod => ({ default: mod.Tooltip })), {
  ssr: false
});

interface GithubGraphProps {
  data: GithubData;
}

const useScrollToLatestWeek = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const scrollToEnd = () => {
      const scroller = root.querySelector<HTMLElement>(".react-activity-calendar__scroll-container");
      if (scroller) scroller.scrollLeft = scroller.scrollWidth;
    };
    const observer = new MutationObserver(scrollToEnd);
    observer.observe(root, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  return ref;
};

type PRFilter = "merged" | "open" | "closed";

const PR_FILTERS: Record<PRFilter, { label: string; description: string; dotClass: string }> = {
  merged: { label: "Merged", description: "Merged contributions to open source", dotClass: "from-purple-400 to-pink-400" },
  open: { label: "Open", description: "Active pull requests", dotClass: "from-green-400 to-emerald-400" },
  closed: { label: "Closed", description: "Closed pull requests", dotClass: "from-red-400 to-rose-400" },
};

const PR_FILTER_OPTIONS = (Object.keys(PR_FILTERS) as PRFilter[]).map((value) => ({ value, label: PR_FILTERS[value].label }));

const OrganizationChips = ({ organizations }: { organizations: Organization[] }) => {
  if (organizations.length === 0) return null;

  return (
    <div className="mt-6">
      <p className="text-xs text-neutral-600 dark:text-neutral-400 font-custom2 mb-2">Contributed to</p>
      <ul className="flex flex-wrap gap-2 list-none m-0 p-0">
        {organizations.map((org) => (
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
    </div>
  );
};

const GithubGraph = ({ data }: GithubGraphProps) => {
  const { theme } = useTheme();

  const [showAll, setShowAll] = useState(false);
  const [filterType, setFilterType] = useState<PRFilter>("merged");
  const [isMobile, setIsMobile] = useState(false);
  const calendarRef = useScrollToLatestWeek();

  const initialCount = 2;

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const prs: PR[] = data[filterType] || [];
  const activeFilter = PR_FILTERS[filterType];

  return (
    <div>
      <Separator fullWidth />


      <h1 className="text-neutral-900 dark:text-neutral-50 font-custom font-bold  text-3xl tracking-tight  py-2"><span className="link--elara">Proof Of Work</span></h1>
      <Separator className="my-0.5" />
      <p className=" font-custom2 text-neutral-700 dark:text-neutral-300 mt-3 px-4 py-[7px]
           text-sm inline-block
          bg-neutral-100 dark:bg-neutral-900 frame-dashed mb-6"> building real tools, solving real problems, and leaving a trail of commits to prove it.</p>




      <div className="w-full flex justify-center">
        <div ref={calendarRef} className="flex w-full justify-center">
          <MountOnVisible minHeight={isMobile ? 120 : 160} rootMargin="300px">
            <>
              <GitHubCalendar
                username={GITHUB_USERNAME}
                colorScheme={theme === "dark" ? "dark" : "light"}
                blockSize={isMobile ? 6 : 10}
                blockMargin={isMobile ? 2 : 3}
                fontSize={isMobile ? 10 : 12}
                style={{
                  color: theme === "dark" ? "#e5e5e5" : "#171717",
                }}
                renderBlock={(block: any, activity: any) =>
                  cloneElement(block, {
                    "data-tooltip-id": "github-tooltip",
                    "data-tooltip-content": `${activity.count} contributions on ${activity.date}`,
                  })
                }
              />
              <Tooltip
                id="github-tooltip"
                style={{
                  backgroundColor: theme === "dark" ? "#171717" : "#ffffff",
                  color: theme === "dark" ? "#e5e5e5" : "#171717",
                  borderRadius: "8px",
                  padding: "8px 12px",
                  fontSize: "12px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                }}
                opacity={1}
                border={theme === "dark" ? "1px solid #404040" : "1px solid #e5e5e5"}
              />
            </>
          </MountOnVisible>
        </div>
      </div>

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
                {prs.slice(0, showAll ? prs.length : initialCount).map((pr, index) => (
                  <div key={pr.id} className="group flex items-start gap-3 py-3">
                    <div className="shrink-0 mt-0.5">
                      <div className={`w-1 h-1 rounded-full bg-gradient-to-r ${activeFilter.dotClass}`} />
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
