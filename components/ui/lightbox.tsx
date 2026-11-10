"use client";

import { useEffect } from "react";
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

const NAV_BUTTON_CLASS =
  "absolute top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer z-10";

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

function MediaView({ media }: { media: MediaItem }) {
  if (media.type === "video") {
    return <video src={media.src} poster={media.poster} className="w-full h-auto" controls autoPlay muted playsInline />;
  }
  return (
    <div className="relative w-full aspect-[16/10]">
      <Image src={media.src} alt={media.caption ?? ""} fill sizes="90vw" className="object-contain" />
    </div>
  );
}

export function Lightbox({ items, index, onIndexChange }: LightboxProps) {
  useLightboxKeys(index, items.length, onIndexChange);
  const media = index === null ? null : items[index];
  const position = (index ?? 0) + 1;
  const close = () => onIndexChange(null);
  const step = (delta: number) => index !== null && onIndexChange(wrap(index + delta, items.length));

  return (
    <AnimatePresence>
      {media && (
        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-label={media.caption ?? "Media preview"}
          className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 cursor-pointer"
        >
          <m.figure
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.92, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-[92%] max-w-6xl cursor-default"
          >
            <div className="relative bg-black rounded-xl overflow-hidden shadow-xl">
              <button
                onClick={close}
                className="absolute top-3 right-3 p-2 bg-neutral-200 dark:bg-neutral-700 rounded-full cursor-pointer hover:bg-neutral-300 dark:hover:bg-neutral-600 transition-colors z-10"
                aria-label="Close preview"
              >
                <X size={20} className="text-neutral-900 dark:text-neutral-100" />
              </button>
              <MediaView key={media.src} media={media} />
            </div>
            {items.length > 1 && (
              <>
                <button onClick={() => step(-1)} className={`${NAV_BUTTON_CLASS} left-2 md:-left-14`} aria-label="Previous">
                  <ChevronLeft size={22} />
                </button>
                <button onClick={() => step(1)} className={`${NAV_BUTTON_CLASS} right-2 md:-right-14`} aria-label="Next">
                  <ChevronRight size={22} />
                </button>
              </>
            )}
            {media.caption && (
              <figcaption className="mt-3 text-center font-custom2 text-sm text-neutral-300">
                {media.caption}
                {items.length > 1 && <span className="ml-2 text-neutral-500">{position} / {items.length}</span>}
              </figcaption>
            )}
          </m.figure>
        </m.div>
      )}
    </AnimatePresence>
  );
}
