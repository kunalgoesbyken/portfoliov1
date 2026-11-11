import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Heading } from "@/components/ui/heading";

const GRID_LINES =
  "bg-[linear-gradient(to_right,var(--line-strong)_1px,transparent_1px),linear-gradient(to_bottom,var(--line-strong)_1px,transparent_1px)] bg-[size:24px_24px] bg-right-bottom";

export default function GetInTouch() {
  return (
    <section className="relative z-10 mt-14 mb-10 w-full md:mt-8">
      <div className="flex flex-col items-start space-y-4 md:space-y-6">
        <Heading>Get in touch</Heading>
        <p className="callout py-1">Hi there, I&apos;m currently open to meaningful work.</p>
        <Link href="/contact" className="btn-solid group px-6 py-2.5 max-md:min-h-12">
          Send Enquiry
          <ArrowRight
            aria-hidden="true"
            className="size-3.5 opacity-70 transition-transform duration-300 group-hover:translate-x-1 group-hover:opacity-100"
          />
        </Link>
      </div>

      <div
        aria-hidden="true"
        className={`pointer-events-none absolute -right-2 -bottom-12 -z-10 h-40 w-80 opacity-60 [mask-image:radial-gradient(circle_at_bottom_right,black,transparent_70%)] md:-right-14 md:-bottom-20 dark:opacity-40 ${GRID_LINES}`}
      />
    </section>
  );
}
