"use client"

import { useEffect, useState, cloneElement } from "react";
import Separator from "@/components/separator";
import MountOnVisible from "@/components/ui/mount-on-visible";
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";
import { GithubData, PR } from "@/lib/github";
import { GITHUB_USERNAME } from "@/lib/social-links";

// Dynamic imports for code splitting - these load separately from the PR list
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

const GithubGraph = ({ data }: GithubGraphProps) => {
  const { theme } = useTheme();
  // Flatten data based on filter or keep it structured.
  // The original component had state `prs` and `filterType`.
  // We can derive `prs` from `data` and `filterType`.

  const [showAll, setShowAll] = useState(false);
  const [filterType, setFilterType] = useState<"merged" | "open" | "closed">("merged");
  const [isMobile, setIsMobile] = useState(false);

  const initialCount = 2;

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Determine which list to show based on filterType
  const prs: PR[] = data[filterType] || [];

  return (
    <div>
      <Separator fullWidth />


      <h1 className="text-neutral-900 dark:text-neutral-50 font-custom font-bold  text-3xl tracking-tight  py-2"><span className="link--elara">Proof Of Work</span></h1>
      <Separator className="my-0.5" />
      <p className=" font-custom2 text-neutral-700 dark:text-neutral-300 mt-3 px-4 py-[7px]
           text-sm inline-block
          bg-neutral-100 dark:bg-neutral-900 border-dashed border-neutral-300 dark:border-neutral-700 border mb-6"> building real tools, solving real problems, and leaving a trail of commits to prove it.</p>




      {/* Graph Component */}
      <div className="w-full flex justify-center">
        <div className="flex w-full justify-center">
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

      {/* PR Section - always shown */}
      <div className="mt-4">
          <div className="mb-1 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-neutral-900 dark:text-neutral-50 font-custom font-bold text-2xl tracking-tight">
              <span className="link--elara">Pull Requests</span>
            </h2>
            <div className="flex items-center gap-2">
              <div role="group" aria-label="Filter pull requests by status" className="flex gap-1 bg-black/5 dark:bg-white/5 rounded-lg p-1 border border-neutral-300/30 dark:border-neutral-700/30 ">
                <button
                  onClick={() => setFilterType("merged")}
                  className={`px-3 py-1.5 rounded text-xs font-medium transition-all duration-200 ${filterType === "merged"
                    ? "bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-50 shadow-sm"
                    : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
                    }`}
                  aria-pressed={filterType === "merged"}
                >
                  Merged
                </button>
                <button
                  onClick={() => setFilterType("open")}
                  className={`px-3 py-1.5 rounded text-xs font-medium transition-all duration-200 ${filterType === "open"
                    ? "bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-50 shadow-sm"
                    : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
                    }`}
                  aria-pressed={filterType === "open"}
                >
                  Open
                </button>
                <button
                  onClick={() => setFilterType("closed")}
                  className={`px-3 py-1.5 rounded text-xs font-medium transition-all duration-200 ${filterType === "closed"
                    ? "bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-50 shadow-sm"
                    : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
                    }`}
                  aria-pressed={filterType === "closed"}
                >
                  Closed
                </button>
              </div>


            </div>
          </div>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 font-custom2 mb-4">
            {filterType === "merged"
              ? "Merged contributions to open source"
              : filterType === "open"
                ? "Active pull requests"
                : "Closed pull requests"}
          </p>
          <Separator fullWidth />

          {prs.length > 0 ? (
            <div>
              <div className="mt-3 divide-y divide-dashed divide-neutral-200 dark:divide-neutral-800">
                {prs.slice(0, showAll ? prs.length : initialCount).map((pr, index) => (
                  <div key={pr.id} className="group flex items-start gap-3 py-3">
                    <div className="shrink-0 mt-0.5">
                      <div className={`w-1 h-1 rounded-full ${filterType === "merged"
                        ? "bg-gradient-to-r from-purple-400 to-pink-400"
                        : filterType === "open"
                          ? "bg-gradient-to-r from-green-400 to-emerald-400"
                          : "bg-gradient-to-r from-red-400 to-rose-400"
                        }`}></div>
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
                    className="max-md:min-h-12 max-md:px-6 font-custom2 text-xs text-neutral-500 dark:text-neutral-400 border-b border-dashed border-neutral-300 dark:border-neutral-700 pb-[2px] tracking-wide cursor-pointer bg-transparent hover:text-neutral-900 dark:hover:text-neutral-100 hover:border-neutral-500 dark:hover:border-neutral-400 transition-colors duration-200"
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
