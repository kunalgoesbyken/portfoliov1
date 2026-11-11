import Container from "@/components/containers";
import { PROFILE_SOCIALS, SocialLinks } from "@/components/social-icons";

export default function Footer() {
  return (
    <footer className="w-full bg-surface">
      <Container className="flex items-center justify-between border border-line py-2 max-md:py-0 max-md:pb-[env(safe-area-inset-bottom)]">
        <SocialLinks
          socials={PROFILE_SOCIALS}
          size={15}
          className="flex items-center gap-4 max-md:-ml-3 max-md:gap-0"
          itemClassName="text-fg-body opacity-70 transition-opacity hover:opacity-100 max-md:p-3.5"
        />
      </Container>
    </footer>
  );
}
