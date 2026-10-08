"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/* =============================================================================
   LogoSlider Component
   
   A smooth, infinite marquee/slider component for displaying logos.
   Uses Tailwind CSS where possible, raw CSS only for animations/masks.
============================================================================= */

export interface LogoSliderProps {
    /** Array of React nodes (logos, icons, images) to display */
    logos: React.ReactNode[];
    /** Animation speed - higher = slower (default: 60) */
    speed?: number;
    /** Scroll direction. Default: "left" */
    direction?: "left" | "right";
    /** Whether to show blur overlays on edges. Default: true */
    showBlur?: boolean;
    /** Number of blur layers for progressive effect. Default: 8 */
    blurLayers?: number;
    /** Blur intensity multiplier. Default: 1 */
    blurIntensity?: number;
    /** Additional CSS classes */
    className?: string;
    /** Whether to pause animation on hover. Default: false */
    pauseOnHover?: boolean;
}

/**
 * LogoSlider Component
 *
 * A beautiful infinite marquee for showcasing logos, partners, or any content.
 * Uses per-item CSS animations for optimal performance.
 */


export const LogoSlider = ({
    logos,
    speed = 60,
    direction = "left",
    showBlur = true,
    blurLayers = 8,
    blurIntensity = 1,
    className,
    pauseOnHover = false,
}: LogoSliderProps) => {
    const trackRef = React.useRef<HTMLUListElement>(null);

    // Clone the item set on the client for the seamless loop instead of
    // shipping every inline SVG twice in the prerendered HTML.
    React.useEffect(() => {
        const track = trackRef.current;
        if (!track) return;
        const items = Array.from(track.children);
        const clones = items.map((el) => {
            const c = el.cloneNode(true) as HTMLElement;
            c.setAttribute("aria-hidden", "true");
            return c;
        });
        clones.forEach((c) => track.appendChild(c));
        track.style.animationName = "";

        // Only animate while on screen.
        const io = new IntersectionObserver(([entry]) => {
            track.style.animationPlayState = entry?.isIntersecting ? "" : "paused";
        });
        io.observe(track);
        return () => {
            io.disconnect();
            clones.forEach((c) => c.remove());
        };
    }, []);

    return (
        <div
            className={cn(
                "logo-slider w-full overflow-hidden",
                className
            )}
            style={
                {
                    "--speed": speed,
                    "--count": logos.length,
                    "--blurs": blurLayers,
                    "--blur": blurIntensity,
                } as React.CSSProperties
            }
        >
            <div
                className={cn(
                    "logo-slider__container",
                    "relative w-full min-h-[80px] grid"
                )}
                data-direction={direction}
                data-pause-on-hover={pauseOnHover}
            >
                {/* Progressive Blur Overlay - Left */}
                {showBlur && (
                    <div className="logo-slider__blur logo-slider__blur--left absolute top-0 bottom-0 left-0 w-1/4 z-10 pointer-events-none rotate-180">
                        {Array.from({ length: blurLayers }).map((_, i) => (
                            <div
                                key={`blur-left-${i}`}
                                className="absolute inset-0"
                                style={{ "--blur-index": i } as React.CSSProperties}
                            />
                        ))}
                    </div>
                )}

                {/* Progressive Blur Overlay - Right */}
                {showBlur && (
                    <div className="logo-slider__blur logo-slider__blur--right absolute top-0 bottom-0 right-0 w-1/4 z-10 pointer-events-none">
                        {Array.from({ length: blurLayers }).map((_, i) => (
                            <div
                                key={`blur-right-${i}`}
                                className="absolute inset-0"
                                style={{ "--blur-index": i } as React.CSSProperties}
                            />
                        ))}
                    </div>
                )}

                {/* Logo Track */}
                <ul ref={trackRef} style={{ animationName: "none" }} className="logo-slider__track flex items-center h-full w-fit m-0 p-0 list-none">
                    {/* First set of logos */}
                    {logos.map((logo, index) => (
                        <li
                            key={`original-${index}`}
                            className="logo-slider__item h-4/5 w-[80px] sm:w-[100px] lg:w-[120px] aspect-video grid place-items-center shrink-0"
                            style={{ "--item-index": index } as React.CSSProperties}
                        >
                            <div className="w-full h-full flex items-center justify-center [&>svg]:h-[65%] [&>svg]:w-auto [&>svg]:fill-zinc-800 dark:[&>svg]:fill-zinc-200 [&>img]:h-[65%] [&>img]:w-auto [&>img]:object-contain [&>img]:grayscale [&>img]:brightness-50 dark:[&>img]:brightness-125">
                                {logo}
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

LogoSlider.displayName = "LogoSlider";

export default LogoSlider;
