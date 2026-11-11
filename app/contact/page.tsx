import type { Metadata } from "next";
import PageShell from "@/components/ui/page-shell";
import { Heading, Lede } from "@/components/ui/heading";
import { ContactForm } from "@/components/contact/contact-form";
import { LazyDisplacementText } from "@/components/contact/lazy-displacement-text";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Kunal Roy Choudhury",
};

export default function Contact() {
  return (
    <PageShell>
      <Heading as="h1">Contact</Heading>
      <Lede className="mt-3 mb-10 md:mb-12">Hi there, I&apos;m currently open to meaningful work.</Lede>

      <div className="relative z-10 w-full max-w-2xl md:max-lg:pr-4">
        <ContactForm />
      </div>

      <LazyDisplacementText text="KUNAL" />
    </PageShell>
  );
}
