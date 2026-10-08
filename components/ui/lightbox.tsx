"use client";

import Image from "next/image";
import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { X } from "lucide-react";

export interface MediaItem {
  type: "image" | "video";
  src: string;
}

interface LightboxProps {
  media: MediaItem | null;
  onClose: () => void;
}

export function Lightbox({ media, onClose }: LightboxProps) {
  return (
    <AnimatePresence>
      {media && (
        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 cursor-pointer"
        >
          <m.div
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.92, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="relative bg-black rounded-xl overflow-hidden w-[90%] max-w-5xl shadow-xl"
          >
            <button
              onClick={onClose}
              className="absolute top-3 right-3 p-2 bg-neutral-200 dark:bg-neutral-700 rounded-full cursor-pointer hover:bg-neutral-300 dark:hover:bg-neutral-600 transition-colors z-10"
              aria-label="Close modal"
            >
              <X size={20} className="text-neutral-900 dark:text-neutral-100" />
            </button>

            {media.type === "video" ? (
              <video
                src={media.src}
                className="w-full h-auto"
                controls
                autoPlay
                muted
                playsInline
              />
            ) : (
              <div className="relative w-full" style={{ aspectRatio: "16/9" }}>
                <Image
                  src={media.src}
                  alt="Project preview"
                  fill
                  className="object-contain"
                />
              </div>
            )}
          </m.div>
        </m.div>
      )}
    </AnimatePresence>
  );
}