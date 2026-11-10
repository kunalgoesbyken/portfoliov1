"use client";

import { useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Screenshot } from "@/lib/case-studies";

const Lightbox = dynamic(() => import("@/components/ui/lightbox").then((m) => ({ default: m.Lightbox })), { ssr: false });

const SLIDE_HEIGHT = { mobile: 220, desktop: 420 };
const MAX_SLIDE_WIDTH = 768;
const SCROLL_EPSILON = 4;

const TRACK_STYLE = {
  "--slide-h-mobile": `${SLIDE_HEIGHT.mobile}px`,
  "--slide-h-desktop": `${SLIDE_HEIGHT.desktop}px`,
} as CSSProperties;

const ARROW_CLASS =
  "inline-flex size-8 items-center justify-center rounded-full border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 transition-colors enabled:cursor-pointer enabled:hover:border-neutral-500 enabled:hover:text-neutral-900 dark:enabled:hover:border-neutral-400 dark:enabled:hover:text-neutral-100 disabled:opacity-30";

const ratioOf = ({ width, height }: Screenshot) => width / height;

const slideSizes = (shot: Screenshot) => {
  const at = (height: number) => Math.min(Math.round(height * ratioOf(shot)), MAX_SLIDE_WIDTH);
  return `(max-width: 768px) ${at(SLIDE_HEIGHT.mobile)}px, ${at(SLIDE_HEIGHT.desktop)}px`;
};

const neighbourOffset = (track: HTMLElement, direction: 1 | -1) => {
  const offsets = Array.from(track.children, (child) => (child as HTMLElement).offsetLeft - track.offsetLeft);
  const current = track.scrollLeft;
  if (direction === 1) return offsets.find((offset) => offset > current + SCROLL_EPSILON);
  return offsets.findLast((offset) => offset < current - SCROLL_EPSILON);
};

function useTrackEdges() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ atStart: true, atEnd: false });

  const update = () => {
    const track = trackRef.current;
    if (!track) return;
    setEdges({
      atStart: track.scrollLeft <= SCROLL_EPSILON,
      atEnd: track.scrollLeft + track.clientWidth >= track.scrollWidth - SCROLL_EPSILON,
    });
  };

  const step = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const left = neighbourOffset(track, direction);
    if (left !== undefined) track.scrollTo({ left, behavior: "smooth" });
  };

  return { trackRef, edges, update, step };
}

function Slide({ shot, index, onOpen }: { shot: Screenshot; index: number; onOpen: () => void }) {
  return (
    <figure
      className="m-0 shrink-0 snap-start [width:min(100%,calc(var(--slide-h)*var(--ratio)))]"
      style={{ "--ratio": ratioOf(shot) } as CSSProperties}
    >
      <button
        type="button"
        onClick={onOpen}
        aria-label={`View full screen: ${shot.caption}`}
        className="block w-full cursor-zoom-in overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-800"
      >
        <Image
          src={shot.src}
          alt={shot.caption}
          width={shot.width}
          height={shot.height}
          sizes={slideSizes(shot)}
          quality={80}
          priority={index === 0}
          className="block h-auto w-full"
        />
      </button>
      <figcaption className="mt-2 font-custom2 text-sm leading-snug text-neutral-600 dark:text-neutral-400">{shot.caption}</figcaption>
    </figure>
  );
}

export function Gallery({ items }: { items: Screenshot[] }) {
  const { trackRef, edges, update, step } = useTrackEdges();
  const [open, setOpen] = useState<number | null>(null);
  const [hasLightbox, setHasLightbox] = useState(false);
  if (items.length === 0) return null;

  const openAt = (index: number) => {
    setHasLightbox(true);
    setOpen(index);
  };

  return (
    <section aria-label="Screenshots" className="mt-10">
      <div className="mb-3 flex items-center justify-between">
        <p className="font-custom2 text-xs uppercase tracking-[0.14em] text-neutral-600 dark:text-neutral-400">
          Screenshots <span className="text-neutral-400 dark:text-neutral-500">{items.length}</span>
        </p>
        {items.length > 1 && (
          <div className="flex gap-2">
            <button type="button" onClick={() => step(-1)} disabled={edges.atStart} className={ARROW_CLASS} aria-label="Previous screenshot">
              <ChevronLeft size={16} />
            </button>
            <button type="button" onClick={() => step(1)} disabled={edges.atEnd} className={ARROW_CLASS} aria-label="Next screenshot">
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
      <div
        ref={trackRef}
        onScroll={update}
        style={TRACK_STYLE}
        className="scrollbar-subtle flex snap-x snap-mandatory items-start gap-4 overflow-x-auto pb-3 [--slide-h:var(--slide-h-mobile)] md:[--slide-h:var(--slide-h-desktop)]"
      >
        {items.map((shot, i) => (
          <Slide key={shot.src} shot={shot} index={i} onOpen={() => openAt(i)} />
        ))}
      </div>
      {hasLightbox && <Lightbox items={items} index={open} onIndexChange={setOpen} />}
    </section>
  );
}
