"use client";

import { useCallback, useEffect, useLayoutEffect, useRef } from "react";

const FOLLOW_THRESHOLD_PX = 48;

export function useFollowScroll<Viewport extends HTMLElement, Content extends HTMLElement>(resumeKey: unknown) {
  const viewportRef = useRef<Viewport>(null);
  const contentRef = useRef<Content>(null);
  const following = useRef(true);

  useLayoutEffect(() => {
    following.current = true;
  }, [resumeKey]);

  useEffect(() => {
    const viewport = viewportRef.current;
    const content = contentRef.current;
    if (!viewport || !content) return;
    const stick = () => {
      if (following.current) viewport.scrollTop = viewport.scrollHeight;
    };
    const observer = new ResizeObserver(stick);
    observer.observe(content);
    stick();
    return () => observer.disconnect();
  }, []);

  const onScroll = useCallback(() => {
    const viewport = viewportRef.current;
    if (viewport) following.current = viewport.scrollHeight - viewport.scrollTop - viewport.clientHeight < FOLLOW_THRESHOLD_PX;
  }, []);

  return { viewportRef, contentRef, onScroll };
}
