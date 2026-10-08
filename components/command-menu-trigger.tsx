"use client";

import { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";

// cmdk + radix dialog are only fetched on first interaction (hover/focus/click
// on the button, ⌘K / Ctrl+K, a shift-shortcut keypress) or after a long idle
// delay so the shift shortcuts keep working without any user input first.
const CommandMenu = dynamic(
  () => import("@/components/command-menu").then((mod) => ({ default: mod.CommandMenu })),
  { ssr: false },
);

export function CommandMenuTrigger() {
  const [loaded, setLoaded] = useState(false);
  const [open, setOpen] = useState(false);

  const load = useCallback(() => setLoaded(true), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setLoaded(true);
        setOpen((o) => !o);
      } else if (e.shiftKey) {
        setLoaded(true);
      }
    };
    document.addEventListener("keydown", onKey);

    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    let idleId: number | undefined;
    const timer = setTimeout(() => {
      if (w.requestIdleCallback) idleId = w.requestIdleCallback(load, { timeout: 5000 });
      else load();
    }, 6000);

    return () => {
      document.removeEventListener("keydown", onKey);
      clearTimeout(timer);
      if (idleId !== undefined) w.cancelIdleCallback?.(idleId);
    };
  }, [load]);

  return (
    <>
      <button
        onClick={() => {
          setLoaded(true);
          setOpen(true);
        }}
        onPointerEnter={load}
        onFocus={load}
        aria-label="Open command menu"
        className="hidden sm:flex group items-center gap-2 px-2 py-1.5 text-sm font-medium text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
      >
        <span className="inline-block text-xs text-neutral-400 dark:text-neutral-500 group-hover:text-neutral-600 dark:group-hover:text-neutral-300 transition-colors">
          <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 px-1.5 font-mono text-[10px] font-medium opacity-100">
            <span className="text-xs">⌘</span>K
          </kbd>
        </span>
      </button>
      {loaded && <CommandMenu open={open} onOpenChange={setOpen} />}
    </>
  );
}
