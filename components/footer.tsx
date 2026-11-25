import Container from "@/components/containers";
import { ALL_SOCIALS, SocialLinks } from "@/components/social-icons";
import { SITE_NAME } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="w-full bg-surface">
      <Container className="flex flex-wrap items-center justify-between gap-x-6 border-t px-6 sm:px-10 md:px-20 border-line py-4 max-md:pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        <p className="font-custom2 text-fg-subtle text-xs">
          © {new Date().getFullYear()} {SITE_NAME}
        </p>
        <SocialLinks
          socials={ALL_SOCIALS}
          size={20}
          className="flex items-center max-md:-ml-3 md:gap-1"
          itemClassName="inline-flex size-8 items-center justify-center rounded-full text-fg opacity-70 transition-opacity duration-200 hover:opacity-100 focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-line-hover focus-visible:ring-offset-2 focus-visible:ring-offset-surface focus-visible:outline-none max-[359px]:size-9 min-[360px]:max-md:size-11"
        />
      </Container>
    </footer>
  );
}
