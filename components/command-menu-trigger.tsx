"use client";

import { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { whenIdle } from "@/lib/idle";
import { useMediaQuery } from "@/lib/hooks";

const CommandMenu = dynamic(() => import("@/components/command-menu").then((mod) => ({ default: mod.CommandMenu })), {
  ssr: false,
});

export function CommandMenuTrigger() {
  const [loaded, setLoaded] = useState(false);
  const [open, setOpen] = useState(false);
  const load = useCallback(() => setLoaded(true), []);
  const hasKeyboardLayout = useMediaQuery("(min-width: 640px)");

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
    const cancelIdle = hasKeyboardLayout ? whenIdle(load, { delay: 6000, timeout: 5000 }) : () => {};
    return () => {
      document.removeEventListener("keydown", onKey);
      cancelIdle();
    };
  }, [load, hasKeyboardLayout]);

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setLoaded(true);
          setOpen(true);
        }}
        onPointerEnter={load}
        onFocus={load}
        aria-label="Open command menu"
        className="group hidden items-center px-2 py-1.5 sm:flex"
      >
        <kbd className="kbd pointer-events-none transition-colors select-none group-hover:text-fg">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>
      {loaded && <CommandMenu open={open} onOpenChange={setOpen} />}
    </>
  );
}
