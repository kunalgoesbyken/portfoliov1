import { ALL_SOCIALS, SocialLinks } from "@/components/social-icons";
import { TooltipBubble } from "@/components/ui/tooltip-bubble";

export default function Socials() {
  return (
    <SocialLinks
      socials={ALL_SOCIALS}
      size={20}
      className="flex flex-wrap items-center gap-0 max-md:-ml-3 max-md:w-full sm:justify-end md:gap-1"
      itemClassName="group/tip relative inline-flex size-8 items-center justify-center rounded-full text-fg opacity-70 transition-opacity duration-200 hover:opacity-100 focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-line-hover focus-visible:ring-offset-2 focus-visible:ring-offset-surface focus-visible:outline-none max-md:size-11"
      renderExtra={(social) => <TooltipBubble side="bottom">{social.name}</TooltipBubble>}
    />
  );
}
