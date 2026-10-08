"use client";

import * as React from "react";

interface MountOnVisibleProps {
    children: React.ReactNode;
    /** Height (px) reserved until the children mount, to avoid layout shift. */
    minHeight?: number;
    /** How far outside the viewport to start mounting. Default: 400px */
    rootMargin?: string;
}

/**
 * Renders children only once the placeholder is near the viewport.
 * Falls back to rendering immediately when IntersectionObserver is missing.
 */
export default function MountOnVisible({
    children,
    minHeight = 300,
    rootMargin = "400px",
}: MountOnVisibleProps) {
    const ref = React.useRef<HTMLDivElement>(null);
    const [visible, setVisible] = React.useState(false);

    React.useEffect(() => {
        const el = ref.current;
        if (!el) return;
        if (typeof IntersectionObserver === "undefined") {
            setVisible(true);
            return;
        }
        const io = new IntersectionObserver(
            (entries) => {
                if (entries.some((e) => e.isIntersecting)) {
                    setVisible(true);
                    io.disconnect();
                }
            },
            { rootMargin }
        );
        io.observe(el);
        return () => io.disconnect();
    }, [rootMargin]);

    if (visible) return <>{children}</>;
    return <div ref={ref} aria-hidden="true" style={{ minHeight }} />;
}
