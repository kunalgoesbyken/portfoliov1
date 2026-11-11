import type { ComponentType, ReactNode } from "react";
import GithubIcon from "@/components/ui/github-icon";
import LinkedinIcon from "@/components/ui/linkedin-icon";
import TwitterXIcon from "@/components/ui/twitter-x-icon";
import MailFilledIcon from "@/components/ui/mail-filled-icon";
import FileDescriptionIcon from "@/components/ui/file-description-icon";
import type { AnimatedIconProps } from "@/components/ui/types";
import { SOCIAL_LINKS } from "@/lib/social-links";

export interface Social {
  name: string;
  href: string;
  icon: ComponentType<AnimatedIconProps>;
  external: boolean;
}

export const SOCIALS = {
  github: {
    name: "GitHub",
    href: SOCIAL_LINKS.github,
    icon: GithubIcon,
    external: true,
  },
  linkedin: {
    name: "LinkedIn",
    href: SOCIAL_LINKS.linkedin,
    icon: LinkedinIcon,
    external: true,
  },
  x: { name: "X", href: SOCIAL_LINKS.x, icon: TwitterXIcon, external: true },
  email: {
    name: "Email",
    href: SOCIAL_LINKS.email,
    icon: MailFilledIcon,
    external: false,
  },
  resume: {
    name: "Resume",
    href: SOCIAL_LINKS.resume,
    icon: FileDescriptionIcon,
    external: true,
  },
} satisfies Record<string, Social>;

export const ALL_SOCIALS: Social[] = Object.values(SOCIALS);

export const PROFILE_SOCIALS: Social[] = [SOCIALS.github, SOCIALS.linkedin, SOCIALS.x];

const externalProps = { target: "_blank", rel: "noopener noreferrer" } as const;

export function SocialLinks({
  socials,
  size,
  className,
  itemClassName,
  renderExtra,
}: {
  socials: Social[];
  size: number;
  className?: string;
  itemClassName?: string;
  renderExtra?: (social: Social) => ReactNode;
}) {
  return (
    <div className={className}>
      {socials.map((social) => (
        <a
          key={social.name}
          href={social.href}
          aria-label={social.name}
          className={itemClassName}
          {...(social.external ? externalProps : {})}
        >
          <social.icon size={size} />
          {renderExtra?.(social)}
        </a>
      ))}
    </div>
  );
}
