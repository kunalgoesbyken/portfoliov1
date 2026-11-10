"use client";

import { useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { Maximize2, Play } from "lucide-react";
import type { MediaItem } from "@/lib/media";

const Lightbox = dynamic(() => import("@/components/ui/lightbox").then((m) => ({ default: m.Lightbox })), { ssr: false });

const stillOf = (media: MediaItem) => (media.type === "video" ? media.poster : media.src);

function Featured({ media, onOpen }: { media: MediaItem; onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={`Open ${media.caption ?? "preview"} full screen`}
      className="group relative block w-full aspect-[16/10] overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 cursor-zoom-in"
    >
      <Image
        src={stillOf(media)}
        alt={media.caption ?? ""}
        fill
        priority
        sizes="(max-width: 896px) 100vw, 768px"
        className="object-contain transition-transform duration-500 ease-out group-hover:scale-[1.015]"
      />
      <span className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-black/65 px-2.5 py-1 font-custom2 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
        {media.type === "video" ? <Play size={12} fill="currentColor" /> : <Maximize2 size={12} />}
        {media.type === "video" ? "Play demo" : "Expand"}
      </span>
    </button>
  );
}

function Thumbs({ items, active, onSelect }: { items: MediaItem[]; active: number; onSelect: (index: number) => void }) {
  return (
    <div className="mt-3 flex gap-2 overflow-x-auto scrollbar-subtle pb-1">
      {items.map((media, i) => (
        <button
          key={media.src}
          type="button"
          onClick={() => onSelect(i)}
          aria-label={media.caption}
          aria-pressed={i === active}
          className={`relative h-16 w-26 shrink-0 overflow-hidden rounded-md border transition-opacity cursor-pointer ${
            i === active
              ? "border-neutral-900 dark:border-neutral-100 opacity-100"
              : "border-neutral-200 dark:border-neutral-800 opacity-60 hover:opacity-100"
          }`}
        >
          <Image src={stillOf(media)} alt="" fill sizes="104px" className="object-cover object-top" />
          {media.type === "video" && (
            <Play size={14} fill="currentColor" className="absolute inset-0 m-auto text-white drop-shadow" aria-hidden="true" />
          )}
        </button>
      ))}
    </div>
  );
}

export function Gallery({ items }: { items: MediaItem[] }) {
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState<number | null>(null);
  const [hasLightbox, setHasLightbox] = useState(false);
  const openAt = (index: number) => {
    setHasLightbox(true);
    setOpen(index);
  };
  const media = items[active];
  if (!media) return null;

  return (
    <div className="mt-8">
      <Featured media={media} onOpen={() => openAt(active)} />
      <p className="mt-2 font-custom2 text-sm text-neutral-500 dark:text-neutral-400">{media.caption}</p>
      {items.length > 1 && <Thumbs items={items} active={active} onSelect={setActive} />}
      {hasLightbox && <Lightbox items={items} index={open} onIndexChange={setOpen} />}
    </div>
  );
}
