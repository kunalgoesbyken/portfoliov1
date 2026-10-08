import Link from 'next/link'
import GithubIcon from "@/components/ui/github-icon";
import LinkedinIcon from "@/components/ui/linkedin-icon";
import TwitterXIcon from "@/components/ui/twitter-x-icon";
import Container from './containers'
import { SOCIAL_LINKS } from '@/lib/social-links';

const Footer = () => {
  const socialLinks = [
    {
      name: 'GitHub',
      url: SOCIAL_LINKS.github,
      icon: GithubIcon
    },
    {
      name: 'X',
      url: SOCIAL_LINKS.x,
      icon: TwitterXIcon
    },
    {
      name: 'LinkedIn',
      url: SOCIAL_LINKS.linkedin,
      icon: LinkedinIcon
    },
  ]

  return (
    <footer className="w-full bg-neutral-50 dark:bg-neutral-950">
      <Container className="flex items-center justify-between py-2 max-md:py-0 max-md:pb-[env(safe-area-inset-bottom)] border border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center gap-4 max-md:gap-0 max-md:-ml-3">
          {socialLinks.map((link) => {
            const IconComponent = link.icon
            return (
              <Link
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="max-md:p-3.5 text-neutral-700 dark:text-neutral-50 opacity-70 hover:opacity-100 transition cursor-pointer"
                aria-label={`Visit ${link.name} profile`}
              >
                <IconComponent size={15} />
              </Link>
            )
          })}
        </div>
      </Container>
    </footer>
  )
}

export default Footer;