import { TechKey, iconMap, techNames } from "@/lib/tech-icons";
import { TooltipBubble } from "@/components/ui/tooltip-bubble";
import { cn } from "@/lib/utils";

const SIZES = {
  sm: { icon: "size-4", gap: "gap-2" },
  md: { icon: "size-5", gap: "gap-3" },
} as const;

export function TechIconTooltip({ tech, size = "md", scope }: { tech: TechKey[]; size?: keyof typeof SIZES; scope: string }) {
  return (
    <div className={cn("flex flex-wrap", SIZES[size].gap)}>
      {tech.map((key) => {
        const Icon = iconMap[key];
        return (
          <span key={`${scope}-${key}`} tabIndex={0} className="group/tip relative inline-flex outline-none">
            <Icon className={cn(SIZES[size].icon, "text-fg-subtle")} role="img" aria-label={techNames[key]} />
            <TooltipBubble>{techNames[key]}</TooltipBubble>
          </span>
        );
      })}
    </div>
  );
}
