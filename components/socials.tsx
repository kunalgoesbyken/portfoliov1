"use client";

import { useState } from "react";
import GithubIcon from "@/components/ui/github-icon";
import LinkedinIcon from "@/components/ui/linkedin-icon";
import MailFilledIcon from "@/components/ui/mail-filled-icon";
import FileDescriptionIcon from "@/components/ui/file-description-icon";
import TwitterXIcon from "@/components/ui/twitter-x-icon";
import { SOCIAL_LINKS } from "@/lib/social-links";

const ICON_SIZE = 20;

export default function Socials() {
    const [hoveredSocial, setHoveredSocial] = useState<string | null>(null);

    const socials = [
        {
            name: "GitHub",
            icon: GithubIcon,
            action: () => window.open(SOCIAL_LINKS.github, "_blank"),
        },
        {
            name: "LinkedIn",
            icon: LinkedinIcon,
            action: () => window.open(SOCIAL_LINKS.linkedin, "_blank"),
        },
        {
            name: "X",
            icon: TwitterXIcon,
            action: () => window.open(SOCIAL_LINKS.x, "_blank"),
        },
        {
            name: "Email",
            icon: MailFilledIcon,
            action: () => (window.location.href = "mailto:kunalrc.workmail7@gmail.com"),
        },
        {
            name: "Resume",
            icon: FileDescriptionIcon,
            action: () => window.open("/resume.pdf", "_blank"),
        },
    ];

    return (
        <div className="flex flex-wrap md:gap-4 gap-0 sm:justify-end max-md:-ml-3 max-md:w-full">
            {socials.map((social) => (
                <button
                    key={social.name}
                    aria-label={social.name}
                    className="relative cursor-pointer group bg-transparent border-0 p-0 rounded-full max-md:size-11 max-md:grid max-md:place-items-center focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:dark:ring-neutral-600 focus-visible:ring-offset-2 focus-visible:outline-none"
                    onMouseEnter={() => setHoveredSocial(social.name)}
                    onMouseLeave={() => setHoveredSocial(null)}
                    onClick={social.action}
                >
                    <social.icon
                        size={ICON_SIZE}
                        className="text-neutral-900 dark:text-neutral-50 opacity-70 hover:opacity-100 transition-opacity duration-200 ease-in-out"
                    />
                    {hoveredSocial === social.name && (
                        <div className="absolute top-8 left-1/2 -translate-x-1/2 z-20">
                            <div className="relative bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-[10px] font-medium px-2 py-1 rounded-md shadow-lg whitespace-nowrap border border-neutral-200 dark:border-neutral-700">
                                {social.name}
                                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-neutral-100 dark:bg-neutral-800 rotate-45 border-t border-l border-neutral-200 dark:border-neutral-700"></div>
                            </div>
                        </div>
                    )}
                </button>
            ))}
        </div>
    );
}
