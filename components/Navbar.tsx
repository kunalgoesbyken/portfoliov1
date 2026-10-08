"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect, useRef, type MouseEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import Container from "@/components/containers";
import { ThemeToggleButton } from "@/components/ui/skiper-ui/skiper26";
import { CommandMenuTrigger } from "@/components/command-menu-trigger";

const NAV_ITEMS = [
  { title: "Projects", href: "/projects" },
  { title: "Blog", href: "/blog" },
  { title: "Contact", href: "/contact" },
];

type Pill = { left: number; top: number; width: number; height: number } | null;

const PILL_CLASS =
  "absolute rounded-md bg-neutral-300/25 dark:bg-neutral-800/50 -z-10 pointer-events-none motion-reduce:transition-none";

const Navbar = () => {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [pill, setPill] = useState<Pill>(null);
  const [pillVisible, setPillVisible] = useState(false);
  const rowRef = useRef<HTMLDivElement>(null);

  // Tiny passive scroll listener; only touches React state when the threshold flips.
  useEffect(() => {
    let last = window.scrollY > 20;
    setScrolled(last);
    const onScroll = () => {
      const next = window.scrollY > 20;
      if (next !== last) {
        last = next;
        setScrolled(next);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActiveLink = (href: string) => {
    if (!pathname) return false;
    return pathname === href || (href !== "/" && pathname.startsWith(href));
  };

  // CSS-driven sliding hover pill (replaces framer layoutId).
  const showPill = (e: MouseEvent<HTMLElement>) => {
    const el = e.currentTarget;
    setPill({ left: el.offsetLeft, top: el.offsetTop, width: el.offsetWidth, height: el.offsetHeight });
    setPillVisible(true);
  };

  return (
    <Container>
      <nav
        aria-label="Main navigation"
        className={`fixed left-0 right-0 top-0 z-50 mx-auto flex max-w-4xl origin-top items-center justify-between gap-4 rounded-[2.5rem] bg-neutral-50/80 px-4 py-3 max-md:rounded-none max-md:border-b max-md:border-neutral-200/80 max-md:dark:border-neutral-800 max-md:bg-neutral-50/90 max-md:dark:bg-neutral-950/90 max-md:px-3 max-md:py-1.5 max-md:pt-[max(0.375rem,env(safe-area-inset-top))] font-custom text-neutral-900 backdrop-blur-lg transition-[transform,translate,scale] duration-300 ease-out motion-reduce:transition-none dark:bg-neutral-950/70 dark:text-neutral-50 md:gap-8 md:px-6 ${
          scrolled ? "md:-translate-y-1 md:scale-y-95 motion-reduce:!translate-y-0 motion-reduce:!scale-y-100" : ""
        }`}
      >
        {/* Shadow overlay, faded via opacity */}
        <div
          aria-hidden="true"
          className={`absolute inset-0 rounded-[2.5rem] max-md:hidden motion-reduce:hidden shadow-[var(--shadow-input)] pointer-events-none -z-10 transition-opacity duration-300 ease-out ${
            scrolled ? "opacity-100" : "opacity-0"
          }`}
        />

        <Link href="/" aria-label="Home" className="hover:opacity-75 transition-opacity duration-300 max-md:p-1">
          <Image
            className="w-9 h-9 rounded-full shadow-sm"
            src="/images/kunal-sm.jpg"
            width={100}
            height={100}
            alt="Kunal Roy Choudhury"
          />
        </Link>

        {/* Navigation links on the right */}
        <div
          ref={rowRef}
          className="relative ml-auto flex items-center justify-end gap-2 max-md:gap-0"
          onMouseLeave={() => setPillVisible(false)}
        >
          <span
            aria-hidden="true"
            className={`${PILL_CLASS} max-md:hidden transition-[left,top,width,height,opacity] duration-200 ease-out ${
              pillVisible ? "opacity-100" : "opacity-0"
            }`}
            style={pill ?? { left: 0, top: 0, width: 0, height: 0 }}
          />
          {NAV_ITEMS.map((item) => {
            const isActive = isActiveLink(item.href);
            return (
              <Link
                className={`relative px-3 py-1.5 max-md:px-2.5 max-md:py-3 text-sm font-medium transition-colors ${isActive
                    ? "text-neutral-900 dark:text-neutral-50"
                    : "text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-50"
                  }`}
                href={item.href}
                key={item.href}
                onMouseEnter={showPill}
              >
                {item.title}
                {isActive && (
                  <span className="absolute left-3 right-3 -bottom-1 max-md:left-2.5 max-md:right-2.5 max-md:bottom-1.5 h-px bg-neutral-900 dark:bg-neutral-50" />
                )}
              </Link>
            );
          })}

          {/* Separator */}
          <div className="h-5 w-px bg-neutral-300/40 dark:bg-neutral-700/50 mx-1 max-md:mx-0.5" />

          {/* Theme Toggle */}
          <div className="relative px-1 py-1 max-md:p-2" onMouseEnter={showPill}>
            <div className="transition-transform duration-200 ease-out hover:scale-[1.08]">
              <ThemeToggleButton variant="circle" start="top-right" />
            </div>
          </div>

          {/* Command Menu */}
          <div className="relative px-1 py-1 hidden sm:block" onMouseEnter={showPill}>
            <CommandMenuTrigger />
          </div>
        </div>
      </nav>
    </Container>
  );
};

export default Navbar;
