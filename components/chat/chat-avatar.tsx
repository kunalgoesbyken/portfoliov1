import Image from "next/image";
import { SITE_AVATAR } from "@/lib/site";
import { cn } from "@/lib/utils";

const SIZES = {
  sm: { px: 24, className: "size-6" },
  md: { px: 32, className: "size-8" },
  lg: { px: 48, className: "size-12" },
} as const;

export function ChatAvatar({ size = "sm", className }: { size?: keyof typeof SIZES; className?: string }) {
  const { px, className: sizeClass } = SIZES[size];
  return (
    <Image
      src={SITE_AVATAR}
      alt=""
      width={px}
      height={px}
      loading="eager"
      className={cn("bg-muted ring-line shrink-0 rounded-full object-cover ring-1", sizeClass, className)}
    />
  );
}
