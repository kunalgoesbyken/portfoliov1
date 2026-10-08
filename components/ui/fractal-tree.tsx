"use client";

import React, { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";

export default function FractalTree() {
    const el = useRef<HTMLCanvasElement>(null);
    const { theme } = useTheme();
    // Stroke color lives in a ref so a theme change updates the color live
    // instead of tearing down and rebuilding the whole canvas animation.
    const colorRef = useRef(theme === "dark" ? "#88888825" : "#33333325");
    const [size, setSize] = useState({ width: 0, height: 0 });
    const [shouldAnimate, setShouldAnimate] = useState(true);
    const [isLargeScreen, setIsLargeScreen] = useState(false);
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
    const [isVisible, setIsVisible] = useState(true);

    // Track if component is mounted on large screens only (md breakpoint: 768px)
    useEffect(() => {
        const checkScreenSize = () => {
            const isLarge = window.innerWidth >= 768;
            setIsLargeScreen(isLarge);
        };

        checkScreenSize();
        const mediaQuery = window.matchMedia("(min-width: 768px)");

        const handleChange = (e: MediaQueryListEvent) => {
            setIsLargeScreen(e.matches);
        };

        mediaQuery.addEventListener("change", handleChange);
        return () => mediaQuery.removeEventListener("change", handleChange);
    }, []);

    // Check for reduced motion preference
    useEffect(() => {
        const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
        setPrefersReducedMotion(mediaQuery.matches);

        const handleChange = (e: MediaQueryListEvent) => {
            setPrefersReducedMotion(e.matches);
        };

        mediaQuery.addEventListener("change", handleChange);
        return () => mediaQuery.removeEventListener("change", handleChange);
    }, []);

    // Keep the stroke color in sync with the theme without restarting the animation
    useEffect(() => {
        colorRef.current = theme === "dark" ? "#88888825" : "#33333325";
    }, [theme]);

    // Pause animation when canvas is off-screen
    useEffect(() => {
        const canvasEl = el.current;
        if (!canvasEl) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const entry = entries[0];
                if (entry) {
                    setIsVisible(entry.isIntersecting);
                }
            },
            { rootMargin: "100px" }
        );

        observer.observe(canvasEl);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        let timeoutId: NodeJS.Timeout;
        const updateSize = () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                setSize({ width: window.innerWidth, height: window.innerHeight });
            }, 100);
        };
        updateSize();
        window.addEventListener("resize", updateSize);
        return () => {
            window.removeEventListener("resize", updateSize);
            clearTimeout(timeoutId);
        };
    }, []);

    useEffect(() => {
        const canvas = el.current;
        if (!canvas || size.width === 0 || size.height === 0) return;

        // Don't render if on small screen
        if (!isLargeScreen) return;

        const ctx = canvas.getContext("2d")!;

        // High DPI handling
        const dpr = window.devicePixelRatio || 1;
        // @ts-ignore
        const bsr = ctx.webkitBackingStorePixelRatio || ctx.mozBackingStorePixelRatio || ctx.msBackingStorePixelRatio || ctx.oBackingStorePixelRatio || ctx.backingStorePixelRatio || 1;
        const dpi = dpr / bsr;

        canvas.style.width = `${size.width}px`;
        canvas.style.height = `${size.height}px`;
        canvas.width = dpi * size.width;
        canvas.height = dpi * size.height;
        ctx.scale(dpi, dpi);

        const r180 = Math.PI;
        const r90 = Math.PI / 2;
        const r15 = Math.PI / 12;

        const { random } = Math;
        const MIN_BRANCH = 30;
        const len = 6;

        let steps: (() => void)[] = [];
        let prevSteps: (() => void)[] = [];
        let animationId: number;

        const polar2cart = (x = 0, y = 0, r = 0, theta = 0): [number, number] => {
            const dx = r * Math.cos(theta);
            const dy = r * Math.sin(theta);
            return [x + dx, y + dy];
        };

        const step = (x: number, y: number, rad: number, counter: { value: number } = { value: 0 }) => {
            const length = random() * len;
            counter.value += 1;

            const [nx, ny] = polar2cart(x, y, length, rad);

            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(nx, ny);
            ctx.stroke();

            const rad1 = rad + random() * r15;
            const rad2 = rad - random() * r15;

            // out of bounds
            if (nx < -100 || nx > size.width + 100 || ny < -100 || ny > size.height + 100)
                return;

            const rate = counter.value <= MIN_BRANCH ? 0.8 : 0.5;

            // left branch
            if (random() < rate)
                steps.push(() => step(nx, ny, rad1, counter));

            // right branch
            if (random() < rate)
                steps.push(() => step(nx, ny, rad2, counter));
        };

        const randomMiddle = () => random() * 0.6 + 0.2;

        // For reduced motion, render static version only
        const drawStatic = () => {
            ctx.clearRect(0, 0, size.width, size.height);
            ctx.lineWidth = 1;
            ctx.strokeStyle = colorRef.current;

            // Draw a few static fractal branches
            const drawStaticBranch = (x: number, y: number, rad: number, depth: number = 0) => {
                if (depth > 8) return;

                const length = random() * len * 2;
                const [nx, ny] = polar2cart(x, y, length, rad);

                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.lineTo(nx, ny);
                ctx.stroke();

                if (nx < -100 || nx > size.width + 100 || ny < -100 || ny > size.height + 100)
                    return;

                const rad1 = rad + random() * r15;
                const rad2 = rad - random() * r15;

                drawStaticBranch(nx, ny, rad1, depth + 1);
                if (random() < 0.7) {
                    drawStaticBranch(nx, ny, rad2, depth + 1);
                }
            };

            if (size.width < 500) {
                drawStaticBranch(randomMiddle() * size.width, -5, r90);
                drawStaticBranch(randomMiddle() * size.width, size.height + 5, -r90);
            } else {
                drawStaticBranch(randomMiddle() * size.width, -5, r90);
                drawStaticBranch(randomMiddle() * size.width, size.height + 5, -r90);
                drawStaticBranch(-5, randomMiddle() * size.height, 0);
                drawStaticBranch(size.width + 5, randomMiddle() * size.height, r180);
            }
        };

        // If reduced motion is preferred, just draw static once and return
        if (prefersReducedMotion) {
            drawStatic();
            return;
        }

        let lastTime = performance.now();
        const interval = 1000 / 40; // 50fps

        const randomRoot = () => {
            const type = random() > 0.5 ? 'vertical' : 'horizontal';
            if (type === 'vertical') {
                const x = randomMiddle() * size.width;
                const y = random() > 0.5 ? -5 : size.height + 5;
                const angle = y === -5 ? r90 : -r90;
                steps.push(() => step(x, y, angle));
            } else {
                const x = random() > 0.5 ? -5 : size.width + 5;
                const y = randomMiddle() * size.height;
                const angle = x === -5 ? 0 : r180;
                steps.push(() => step(x, y, angle));
            }
        };

        // Freeze the drawing after a while: an endless full-screen canvas loop
        // with a CSS mask keeps the main thread and compositor busy forever.
        const stopAt = performance.now() + 10000;

        const frame = () => {
            if (performance.now() > stopAt) return;
            // Stop animation if shouldAnimate is false, prefers reduced motion, or not visible
            if (!shouldAnimate || prefersReducedMotion || !isVisible) {
                return;
            }

            if (performance.now() - lastTime < interval) {
                animationId = requestAnimationFrame(frame);
                return;
            }

            prevSteps = steps;
            steps = [];
            lastTime = performance.now();

            if (!prevSteps.length) {
                // If no active branches, spawn a new root with some probability to keep it alive
                if (Math.random() < 0.05) {
                    randomRoot();
                }
            }

            // Adopt the current theme color for new segments (no rebuild needed)
            ctx.strokeStyle = colorRef.current;
            prevSteps.forEach((i) => {
                if (random() < 0.5)
                    steps.push(i);
                else
                    i();
            });

            animationId = requestAnimationFrame(frame);
        };

        const start = () => {
            ctx.clearRect(0, 0, size.width, size.height);
            ctx.lineWidth = 1;
            ctx.strokeStyle = colorRef.current;
            prevSteps = [];
            steps = [];

            // Initial roots
            if (size.width < 500) {
                steps.push(() => step(randomMiddle() * size.width, -5, r90));
                steps.push(() => step(randomMiddle() * size.width, size.height + 5, -r90));
            } else {
                steps.push(() => step(randomMiddle() * size.width, -5, r90));
                steps.push(() => step(randomMiddle() * size.width, size.height + 5, -r90));
                steps.push(() => step(-5, randomMiddle() * size.height, 0));
                steps.push(() => step(size.width + 5, randomMiddle() * size.height, r180));
            }

            cancelAnimationFrame(animationId);
            frame();
        };

        start();

        // Handle visibility change to stop/start animation
        const handleVisibilityChange = () => {
            if (document.hidden) {
                setShouldAnimate(false);
                cancelAnimationFrame(animationId);
            } else if (isVisible) {
                setShouldAnimate(true);
                if (!prefersReducedMotion) {
                    start();
                }
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            cancelAnimationFrame(animationId);
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, [size, shouldAnimate, prefersReducedMotion, isLargeScreen, isVisible]);

    // Don't render anything on small screens
    if (!isLargeScreen) {
        return null;
    }

    const mask = "radial-gradient(circle, transparent, black)";

    return (
        <div
            className="fixed top-0 bottom-0 left-0 right-0 pointer-events-none print:hidden z-[-1]"
            aria-hidden="true"
            style={{
                maskImage: mask,
                WebkitMaskImage: mask,
            }}
        >
            <canvas ref={el} />
        </div>
    );
}
