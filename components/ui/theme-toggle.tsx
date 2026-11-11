"use client";

import { useRef } from "react";
import { useTheme } from "next-themes";
import { flushSync } from "react-dom";
import { cn } from "@/lib/utils";

const ICON_CLASS =
  "origin-center transition-[rotate,opacity] duration-300 ease-in-out motion-reduce:transition-none";

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playClick = () => {
    audioRef.current ??= Object.assign(new Audio("/sounds/switch.mp3"), {
      volume: 0.5,
    });
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(() => {});
  };

  const toggle = () => {
    playClick();
    const next = resolvedTheme === "dark" ? "light" : "dark";
    if (!document.startViewTransition) {
      setTheme(next);
      return;
    }
    document.startViewTransition(() => flushSync(() => setTheme(next)));
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle theme"
      className={cn(
        "text-fg flex size-9 cursor-pointer items-center justify-center rounded-full transition-transform duration-200 ease-out hover:scale-[1.08] active:scale-95",
        className,
      )}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="size-5"
      >
        <g className={cn(ICON_CLASS, "dark:rotate-180 dark:opacity-0")}>
          <circle cx="12" cy="12" r="5" />
          <path d="M12 2V4M12 20V22M4 12H2M22 12H20M4.22 4.22L5.64 5.64M18.36 18.36L19.78 19.78M19.78 4.22L18.36 5.64M5.64 18.36L4.22 19.78" />
        </g>
        <g
          className={cn(
            ICON_CLASS,
            "-rotate-180 opacity-0 dark:rotate-0 dark:opacity-100",
          )}
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
        </g>
      </svg>
    </button>
  );
}
