"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Screenshot } from "@/lib/case-studies";
import { IMAGE_QUALITY, LCP_IMAGE_PROPS } from "@/lib/image";

const Lightbox = dynamic(() => import("@/components/ui/lightbox").then((m) => ({ default: m.Lightbox })), { ssr: false });

const SCROLL_EPSILON = 4;

const ARROW_CLASS =
  "inline-flex size-8 max-md:size-11 items-center justify-center rounded-full border border-line-strong text-fg-body transition-colors enabled:cursor-pointer enabled:hover:border-line-hover enabled:hover:text-fg disabled:opacity-30";

const SLIDE_SIZES = "(max-width: 768px) 92vw, 640px";

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
    <figure className="m-0 w-[92%] shrink-0 snap-start md:w-[640px]">
      <button
        type="button"
        onClick={onOpen}
        aria-label={`View full screen: ${shot.caption}`}
        className="block w-full cursor-zoom-in overflow-hidden rounded-lg border border-line bg-surface-alt"
      >
        <Image
          src={shot.src}
          alt={shot.caption}
          width={shot.width}
          height={shot.height}
          sizes={SLIDE_SIZES}
          quality={IMAGE_QUALITY.card}
          {...(index === 0 ? LCP_IMAGE_PROPS : {})}
          className="block h-auto w-full"
        />
      </button>
      <figcaption className="mt-2 font-custom2 text-sm leading-snug text-fg-muted">{shot.caption}</figcaption>
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
        <p className="eyebrow text-fg-muted">
          Screenshots <span className="text-fg-faint">{items.length}</span>
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
        className="scrollbar-subtle flex snap-x snap-mandatory items-start gap-4 overflow-x-auto pb-3"
      >
        {items.map((shot, i) => (
          <Slide key={shot.src} shot={shot} index={i} onOpen={() => openAt(i)} />
        ))}
      </div>
      {hasLightbox && <Lightbox items={items} index={open} onIndexChange={setOpen} />}
    </section>
  );
}
