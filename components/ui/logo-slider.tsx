"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface LogoSliderProps {
  logos: React.ReactNode[];
  speed?: number;
  direction?: "left" | "right";
  pauseOnHover?: boolean;
  className?: string;
}

export default function LogoSlider({ logos, speed = 60, direction = "left", pauseOnHover = false, className }: LogoSliderProps) {
  const trackRef = React.useRef<HTMLUListElement>(null);

  React.useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const clones = Array.from(track.children).map((el) => {
      const clone = el.cloneNode(true) as HTMLElement;
      clone.setAttribute("aria-hidden", "true");
      return clone;
    });
    clones.forEach((clone) => track.appendChild(clone));
    track.style.animationName = "";

    const io = new IntersectionObserver(([entry]) => {
      track.style.animationPlayState = entry?.isIntersecting ? "" : "paused";
    });
    io.observe(track);
    return () => {
      io.disconnect();
      clones.forEach((clone) => clone.remove());
    };
  }, []);

  return (
    <div className={cn("w-full overflow-hidden", className)} style={{ "--speed": speed } as React.CSSProperties}>
      <div className="logo-slider__container relative grid min-h-[80px] w-full" data-direction={direction} data-pause-on-hover={pauseOnHover}>
        <ul ref={trackRef} style={{ animationName: "none" }} className="logo-slider__track flex h-full w-fit items-center">
          {logos.map((logo, index) => (
            <li key={index} className="grid aspect-video h-4/5 w-[80px] shrink-0 place-items-center sm:w-[100px] lg:w-[120px]">
              {logo}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
