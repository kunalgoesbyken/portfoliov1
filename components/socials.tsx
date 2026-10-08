import GithubIcon from "@/components/ui/github-icon";
import LinkedinIcon from "@/components/ui/linkedin-icon";
import MailFilledIcon from "@/components/ui/mail-filled-icon";
import FileDescriptionIcon from "@/components/ui/file-description-icon";
import TwitterXIcon from "@/components/ui/twitter-x-icon";
import { SOCIAL_LINKS } from "@/lib/social-links";

const ICON_SIZE = 20;

const socials = [
    { name: "GitHub", icon: GithubIcon, href: SOCIAL_LINKS.github, external: true },
    { name: "LinkedIn", icon: LinkedinIcon, href: SOCIAL_LINKS.linkedin, external: true },
    { name: "X", icon: TwitterXIcon, href: SOCIAL_LINKS.x, external: true },
    { name: "Email", icon: MailFilledIcon, href: "mailto:kunalrc.workmail7@gmail.com", external: false },
    { name: "Resume", icon: FileDescriptionIcon, href: "/resume.pdf", external: true },
];

export default function Socials() {
    return (
        <div className="flex flex-wrap md:gap-4 gap-0 sm:justify-end max-md:-ml-3 max-md:w-full">
            {socials.map((social) => (
                <a
                    key={social.name}
                    href={social.href}
                    aria-label={social.name}
                    {...(social.external ? { target: "_blank", rel: "noopener" } : {})}
                    className="relative cursor-pointer group bg-transparent border-0 p-0 rounded-full max-md:size-11 max-md:grid max-md:place-items-center focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:dark:ring-neutral-600 focus-visible:ring-offset-2 focus-visible:outline-none"
                >
                    <social.icon
                        size={ICON_SIZE}
                        className="text-neutral-900 dark:text-neutral-50 opacity-70 hover:opacity-100 transition-opacity duration-200 ease-in-out"
                    />
                    <div className="absolute top-8 left-1/2 -translate-x-1/2 z-20 hidden group-hover:block" aria-hidden="true">
                        <div className="relative bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-[10px] font-medium px-2 py-1 rounded-md shadow-lg whitespace-nowrap border border-neutral-200 dark:border-neutral-700">
                            {social.name}
                            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-neutral-100 dark:bg-neutral-800 rotate-45 border-t border-l border-neutral-200 dark:border-neutral-700"></div>
                        </div>
                    </div>
                </a>
            ))}
        </div>
    );
}
