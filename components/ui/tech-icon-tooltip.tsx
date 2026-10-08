import { TechKey, iconMap, techNames } from "@/lib/tech-icons";

interface TechIconTooltipProps {
  tech: TechKey[];
  size?: "sm" | "md";
  scope: string;
}

export function TechIconTooltip({ tech, size = "md", scope }: TechIconTooltipProps) {
  const iconSize = size === "sm" ? "w-4 h-4" : "w-5 h-5";
  const gap = size === "sm" ? "gap-2" : "gap-3";

  return (
    <div className={`flex flex-wrap ${gap}`}>
      {tech.map((key) => {
        const Icon = iconMap[key];

        return (
          <button
            key={`${scope}-${key}`}
            type="button"
            className="group/tech relative cursor-pointer bg-transparent border-0 p-0"
          >
            <Icon
              className={`${iconSize} text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors`}
              aria-label={techNames[key]}
            />
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 z-20 hidden group-hover/tech:block group-focus/tech:block" role="tooltip">
              <div className="relative bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-[10px] font-medium px-2 py-1 rounded-md shadow-lg whitespace-nowrap border border-neutral-200 dark:border-neutral-700">
                {techNames[key]}
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-neutral-100 dark:bg-neutral-800 rotate-45 border-b border-r border-neutral-200 dark:border-neutral-700" />
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
