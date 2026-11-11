"use client";

import React, { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { useMediaQuery } from "@/lib/hooks";

const STROKE_COLORS = { dark: "#a3a3a33a", light: "#33333333" };

const strokeFor = (theme: string | undefined) => (theme === "dark" ? STROKE_COLORS.dark : STROKE_COLORS.light);

export default function FractalTree() {
    const el = useRef<HTMLCanvasElement>(null);
    const { resolvedTheme } = useTheme();
    const colorRef = useRef(strokeFor(resolvedTheme));
    const [size, setSize] = useState({ width: 0, height: 0 });
    const [shouldAnimate, setShouldAnimate] = useState(true);
    const isLargeScreen = useMediaQuery("(min-width: 768px)");
    const prefersReducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        colorRef.current = strokeFor(resolvedTheme);
    }, [resolvedTheme]);

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

        if (!isLargeScreen) return;

        const ctx = canvas.getContext("2d")!;

        const dpr = window.devicePixelRatio || 1;
        // @ts-expect-error -- legacy vendor-prefixed backing store ratios are not in the DOM typings
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

            if (nx < -100 || nx > size.width + 100 || ny < -100 || ny > size.height + 100)
                return;

            const rate = counter.value <= MIN_BRANCH ? 0.8 : 0.5;

            if (random() < rate)
                steps.push(() => step(nx, ny, rad1, counter));

            if (random() < rate)
                steps.push(() => step(nx, ny, rad2, counter));
        };

        const randomMiddle = () => random() * 0.6 + 0.2;

        const drawStatic = () => {
            ctx.clearRect(0, 0, size.width, size.height);
            ctx.lineWidth = 1;
            ctx.strokeStyle = colorRef.current;

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

        if (prefersReducedMotion) {
            drawStatic();
            return;
        }

        let lastTime = performance.now();
        const interval = 1000 / 24;

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

        const stopAt = performance.now() + 10000;

        const frame = () => {
            if (performance.now() > stopAt) return;
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
                if (Math.random() < 0.05) {
                    randomRoot();
                }
            }

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
