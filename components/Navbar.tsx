"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import Container from "@/components/containers";
import { motion, useScroll, useMotionValueEvent, type Variants } from "motion/react";
import { ThemeToggleButton } from "@/components/ui/skiper-ui/skiper26";

const CommandMenu = dynamic(() => import("@/components/command-menu").then(mod => ({ default: mod.CommandMenu })), {
  ssr: false,
});

const Navbar = () => {
  const pathname = usePathname();
  const navItems = [
    { title: "Projects", href: "/projects" },
    { title: "Blog", href: "/blog" },
    { title: "Contact", href: "/contact" }

  ];

  const [hovered, setHovered] = useState<number | null>(null);
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 20);
  });

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const isActiveLink = (href: string) => {
    if (!pathname) return false;
    return pathname === href || (href !== "/" && pathname.startsWith(href));
  };

  const THEME_TOGGLE_INDEX = 3;
  const COMMAND_MENU_INDEX = 4;

  // Animation variants based on motion preference
  const navVariants: Variants | undefined = prefersReducedMotion
    ? undefined
    : {
        scrolled: {
          scaleY: 0.95,
          translateY: -4,
          transition: {
            duration: 0.3,
            ease: "easeOut",
          },
        },
        top: {
          scaleY: 1,
          translateY: 0,
          transition: {
            duration: 0.3,
            ease: "easeOut",
          },
        },
      };

  return (
    <Container>
      <motion.nav
        aria-label="Main navigation"
        initial={false}
        animate={scrolled ? "scrolled" : "top"}
        variants={navVariants}
        className="fixed left-0 right-0 top-0 z-50 mx-auto flex max-w-4xl items-center justify-between gap-4 rounded-[2.5rem] bg-neutral-50/80 px-4 py-3 font-custom text-neutral-900 backdrop-blur-lg transition-opacity duration-300 dark:bg-neutral-950/70 dark:text-neutral-50 md:gap-8 md:px-6"
        style={{
          // Use transform-origin for scale animation to anchor from top
          transformOrigin: "top center",
          // Use will-change to hint browser for optimization
          willChange: prefersReducedMotion ? "auto" : "transform"
        }}
      >
        {/* Box shadow overlay - animated via opacity instead of box-shadow property */}
        {!prefersReducedMotion && (
          <motion.div
            className="absolute inset-0 rounded-[2.5rem] shadow-[var(--shadow-input)] pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: scrolled ? 1 : 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            style={{ zIndex: -1 }}
          />
        )}

        <Link href="/" className="hover:opacity-75 transition-opacity duration-300">
          <Image
            className="w-9 h-9 rounded-full shadow-sm"
            src="/images/kunal-sm.jpg"
            width={100}
            height={100}
            alt="Kunal Roy Choudhury"
          />
        </Link>

        {/* Navigation links on the right */}
        <div className="ml-auto flex items-center justify-end gap-2" onMouseLeave={() => setHovered(null)}>
          {navItems.map((item, idx) => {
            const isActive = isActiveLink(item.href);
            return (
              <Link
                className={`relative px-3 py-1.5 text-sm font-medium transition-colors ${isActive
                    ? "text-neutral-900 dark:text-neutral-50"
                    : "text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-50"
                  }`}
                href={item.href}
                key={idx}
                onMouseEnter={() => setHovered(idx)}
              >
                {hovered === idx && (
                  <motion.span
                    layoutId="nav-item-pill"
                    className="absolute inset-0 rounded-md bg-neutral-300/25 dark:bg-neutral-800/50 -z-10"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                {item.title}
                {isActive && (
                  <motion.span
                    layoutId="nav-active-underline"
                    className="absolute left-3 right-3 -bottom-1 h-px bg-neutral-900 dark:bg-neutral-50"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}

          {/* Separator */}
          <div className="h-5 w-px bg-neutral-300/40 dark:bg-neutral-700/50 mx-1" />

          {/* Theme Toggle */}
          <div
            className="relative px-1 py-1"
            onMouseEnter={() => setHovered(THEME_TOGGLE_INDEX)}
          >
            {hovered === THEME_TOGGLE_INDEX && (
              <motion.span
                layoutId="nav-item-pill"
                className="absolute inset-0 rounded-md bg-neutral-300/25 dark:bg-neutral-800/50 -z-10"
                transition={{ type: "spring", stiffness: 350, damping: 30 }}
              />
            )}
            <motion.div
              animate={{ scale: 1 }}
              whileHover={{ scale: 1.08 }}
              transition={{ duration: 0.2, type: "spring", stiffness: 300 }}
            >
              <ThemeToggleButton variant="circle" start="top-right" />
            </motion.div>
          </div>

          {/* Command Menu */}
          <div
            className="relative px-1 py-1 hidden sm:block"
            onMouseEnter={() => setHovered(COMMAND_MENU_INDEX)}
          >
            {hovered === COMMAND_MENU_INDEX && (
              <motion.span
                layoutId="nav-item-pill"
                className="absolute inset-0 rounded-md bg-neutral-300/25 dark:bg-neutral-800/50 -z-10"
                transition={{ type: "spring", stiffness: 350, damping: 30 }}
              />
            )}
            <CommandMenu />
          </div>
        </div>
      </motion.nav>

    </Container>
  );
};

export default Navbar;
