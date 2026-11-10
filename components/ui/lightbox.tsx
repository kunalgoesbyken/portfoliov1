"use client";

import { useEffect, useRef, type TouchEvent } from "react";
import Image from "next/image";
import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { MediaItem } from "@/lib/media";

interface LightboxProps {
  items: MediaItem[];
  index: number | null;
  onIndexChange: (index: number | null) => void;
}

const ROUND_BUTTON_CLASS =
  "inline-flex items-center justify-center size-11 md:size-10 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer";

const wrap = (index: number, length: number) => (index + length) % length;

function useLightboxKeys(index: number | null, length: number, onIndexChange: LightboxProps["onIndexChange"]) {
  useEffect(() => {
    if (index === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onIndexChange(null);
      if (e.key === "ArrowRight") onIndexChange(wrap(index + 1, length));
      if (e.key === "ArrowLeft") onIndexChange(wrap(index - 1, length));
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [index, length, onIndexChange]);
}

const SWIPE_DISTANCE = 50;

function useScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [locked]);
}

export function Lightbox({ items, index, onIndexChange }: LightboxProps) {
  useLightboxKeys(index, items.length, onIndexChange);
  useScrollLock(index !== null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const media = index === null ? null : items[index];
  const position = (index ?? 0) + 1;
  const hasMany = items.length > 1;
  const close = () => onIndexChange(null);
  const step = (delta: number) => index !== null && onIndexChange(wrap(index + delta, items.length));
  const onTouchStart = (e: TouchEvent) => {
    const touch = e.touches[0];
    touchStart.current = e.touches.length === 1 && touch ? { x: touch.clientX, y: touch.clientY } : null;
  };
  const onTouchEnd = (e: TouchEvent) => {
    const start = touchStart.current;
    const touch = e.changedTouches[0];
    touchStart.current = null;
    if (!start || !touch || !hasMany) return;
    const dx = touch.clientX - start.x;
    const dy = touch.clientY - start.y;
    if (Math.abs(dx) > SWIPE_DISTANCE && Math.abs(dx) > Math.abs(dy) * 1.5) step(dx < 0 ? 1 : -1);
  };

  return (
    <AnimatePresence>
      {media && (
        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onClick={close}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          role="dialog"
          aria-modal="true"
          aria-label={media.caption}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-black/90 p-4 md:p-10"
        >
          <button onClick={close} className={`${ROUND_BUTTON_CLASS} absolute top-4 right-4`} aria-label="Close preview">
            <X size={20} />
          </button>
          <figure onClick={(e) => e.stopPropagation()} className="flex max-h-full flex-col items-center gap-3">
            <Image
              key={media.src}
              src={media.src}
              alt={media.caption}
              width={0}
              height={0}
              sizes="(max-width: 768px) 100vw, 90vw"
              quality={85}
              className="h-auto max-h-[80dvh] w-auto max-w-full rounded-md"
            />
            <figcaption className="font-custom2 text-sm text-neutral-300">
              {media.caption}
              {hasMany && <span className="ml-2 text-neutral-500">{position} / {items.length}</span>}
            </figcaption>
          </figure>
          {hasMany && (
            <div onClick={(e) => e.stopPropagation()} className="flex gap-3">
              <button onClick={() => step(-1)} className={ROUND_BUTTON_CLASS} aria-label="Previous screenshot">
                <ChevronLeft size={20} />
              </button>
              <button onClick={() => step(1)} className={ROUND_BUTTON_CLASS} aria-label="Next screenshot">
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </m.div>
      )}
    </AnimatePresence>
  );
}
