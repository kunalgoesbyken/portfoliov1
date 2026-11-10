"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { FOLD_BUTTON_CLASS } from "@/components/case-study/mobile-fold";

export function HighlightBody({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [clipped, setClipped] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const body = bodyRef.current;
    if (!body || open) return;
    const measure = () => setClipped(body.scrollHeight > body.clientHeight + 1);
    const observer = new ResizeObserver(measure);
    observer.observe(body);
    return () => observer.disconnect();
  }, [open]);

  return (
    <div>
      <div
        ref={bodyRef}
        className={`font-custom2 text-[0.95rem] leading-relaxed text-neutral-700 dark:text-neutral-300 [&_code]:font-mono [&_code]:text-[0.8rem] ${open ? "" : "max-md:line-clamp-3"}`}
      >
        {children}
      </div>
      {(clipped || open) && (
        <button type="button" aria-expanded={open} onClick={() => setOpen((value) => !value)} className={`${FOLD_BUTTON_CLASS} !mt-1`}>
          {open ? "Show less" : "Read more"}
        </button>
      )}
    </div>
  );
}
