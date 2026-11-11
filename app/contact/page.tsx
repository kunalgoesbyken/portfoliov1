import type { Metadata } from "next";
import PageShell from "@/components/ui/page-shell";
import { Heading, Lede } from "@/components/ui/heading";
import { ContactForm } from "@/components/contact/contact-form";
import { LazyDisplacementText } from "@/components/contact/lazy-displacement-text";
import { SOCIALS, SocialLinks } from "@/components/social-icons";
import { SITE_SHORT_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Kunal Roy Choudhury",
};

const CONTACT_SOCIALS = [SOCIALS.x, SOCIALS.linkedin, SOCIALS.github];

export default function Contact() {
  return (
    <PageShell>
      <Heading as="h1">Contact</Heading>
      <Lede className="mt-2 mb-8 md:mb-12">Hi there, I&apos;m currently open to meaningful work.</Lede>

      <div className="relative z-10 w-full max-w-2xl md:max-lg:pr-4">
        <ContactForm />

        <div className="mt-8 flex items-center justify-between gap-4 font-custom2 text-xs text-fg-subtle md:mt-10">
          <p>{SITE_SHORT_NAME}</p>
          <SocialLinks
            socials={CONTACT_SOCIALS}
            size={14}
            className="flex items-center gap-4"
            itemClassName="transition-colors hover:text-fg max-md:p-[15px]"
          />
        </div>
      </div>

      <LazyDisplacementText text="KUNAL" />
    </PageShell>
  );
}
