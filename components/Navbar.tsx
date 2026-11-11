"use client";

import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Container from "@/components/containers";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { CommandMenuTrigger } from "@/components/command-menu-trigger";
import { cn } from "@/lib/utils";
import { useScrolledPast } from "@/lib/hooks";
import { SITE_SHORT_NAME } from "@/lib/site";

const NAV_ITEMS = [
  { title: "Projects", href: "/projects" },
  { title: "Blog", href: "/blog" },
  { title: "Contact", href: "/contact" },
];

const SCROLL_THRESHOLD = 20;

const isActive = (pathname: string | null, href: string) =>
  !!pathname && (pathname === href || (href !== "/" && pathname.startsWith(href)));

export default function Navbar() {
  const pathname = usePathname();
  const scrolled = useScrolledPast(SCROLL_THRESHOLD);

  return (
    <Container>
      <nav
        aria-label="Main navigation"
        className={cn(
          "fixed top-0 right-0 left-0 z-50 mx-auto flex max-w-4xl origin-top items-center justify-between gap-4 rounded-[2.5rem] bg-surface/80 px-4 py-3 font-custom text-fg backdrop-blur-lg transition-[translate,scale] duration-300 ease-out motion-reduce:transition-none md:gap-8 md:px-6",
          "max-md:rounded-none max-md:border-b max-md:border-line max-md:bg-surface/90 max-md:px-3 max-md:py-1.5 max-md:pt-[max(0.375rem,env(safe-area-inset-top))]",
          scrolled && "md:-translate-y-1 md:scale-y-95 motion-reduce:!translate-y-0 motion-reduce:!scale-y-100",
        )}
      >
        <div
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-0 -z-10 rounded-[2.5rem] shadow-[var(--shadow-input)] transition-opacity duration-300 ease-out max-md:hidden motion-reduce:hidden",
            scrolled ? "opacity-100" : "opacity-0",
          )}
        />

        <Link href="/" aria-label={pathname === "/" ? "Home" : `${SITE_SHORT_NAME}, home`} className="group/home flex items-center gap-2.5 outline-none max-md:p-1">
          <Image
            className="size-9 rounded-full ring-1 ring-line transition-[scale,box-shadow] duration-200 ease-out group-hover/home:scale-105 group-hover/home:ring-2 group-hover/home:ring-fg-faint group-focus-visible/home:ring-2 group-focus-visible/home:ring-fg-faint motion-reduce:transition-none md:size-10"
            src="/images/kunal-sm.jpg"
            width={100}
            height={100}
            alt=""
          />
          {pathname !== "/" && (
            <span className="title-link text-sm font-medium text-fg-muted transition-colors group-hover/home:text-fg group-hover/home:underline group-focus-visible/home:underline max-[359px]:hidden">
              {SITE_SHORT_NAME}
            </span>
          )}
        </Link>

        <div className="relative ml-auto flex items-center justify-end gap-2 max-md:gap-0">
          {NAV_ITEMS.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "group/nav relative px-3 py-1.5 text-sm font-medium transition-colors max-md:min-w-11 max-md:px-2.5 max-md:py-3 max-md:text-center",
                  active ? "text-fg" : "text-fg-muted hover:text-fg",
                )}
              >
                {item.title}
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute right-3 -bottom-1 left-3 h-px transition-opacity duration-200 motion-reduce:transition-none max-md:right-2.5 max-md:bottom-1.5 max-md:left-2.5",
                    active ? "bg-fg" : "bg-fg-faint opacity-0 group-hover/nav:opacity-100",
                  )}
                />
              </Link>
            );
          })}

          <div aria-hidden="true" className="mx-1 h-5 w-px bg-line-strong/50 max-md:mx-0.5" />

          <div className="relative p-1 max-md:p-0">
            <ThemeToggle className="max-md:size-11" />
          </div>

          <div className="relative hidden p-1 sm:block">
            <CommandMenuTrigger />
          </div>
        </div>
      </nav>
    </Container>
  );
}
