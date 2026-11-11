"use client";

import { useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";

export const FOLD_BUTTON_CLASS =
  "md:hidden not-prose mt-3 inline-flex min-h-11 cursor-pointer items-center gap-1.5 font-custom2 text-sm text-fg link-underline";

export function MobileFold({ children, openLabel = "Read the full story" }: { children: ReactNode; openLabel?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="mobile-fold" data-open={open}>
        {children}
      </div>
      <button type="button" aria-expanded={open} onClick={() => setOpen((value) => !value)} className={FOLD_BUTTON_CLASS}>
        {open ? "Show less" : openLabel}
        <ChevronDown size={14} aria-hidden="true" className={`transition-transform motion-reduce:transition-none ${open ? "rotate-180" : ""}`} />
      </button>
    </>
  );
}
