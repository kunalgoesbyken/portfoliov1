"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { MessageSquare } from "lucide-react";
import * as m from "motion/react-m";
import { AnimatePresence } from "motion/react";
import dynamic from "next/dynamic";
import MotionScope from "@/components/motion-scope";
import { Spinner } from "@/components/ui/spinner";

const ChatbotUI = dynamic(() => import("./chatbot-ui"), {
  ssr: false,
  loading: () => (
    <div className="bg-inverse text-on-inverse fixed right-6 bottom-6 z-50 flex size-14 items-center justify-center rounded-full">
      <Spinner className="size-6" />
    </div>
  ),
});

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const hasShownTooltip = useRef(false);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const tooltipShown = localStorage.getItem("chatbot-tooltip-shown");
    if (!tooltipShown) {
      hasShownTooltip.current = false;
    }
  }, []);

  const revealButton = useCallback(() => {
    if (showButton) return;
    setShowButton(true);

    if (!hasShownTooltip.current) {
      scrollTimeoutRef.current = setTimeout(() => {
        setShowTooltip(true);
        hasShownTooltip.current = true;
        localStorage.setItem("chatbot-tooltip-shown", "true");

        setTimeout(() => {
          setShowTooltip(false);
        }, 4000);
      }, 1000);
    }
  }, [showButton]);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;

      rafRef.current = requestAnimationFrame(() => {
        if (window.scrollY > 500) {
          revealButton();
        }
        ticking = false;
      });
    };

    const timeTimeout = setTimeout(() => {
      revealButton();
    }, 3000);

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timeTimeout);
      cancelAnimationFrame(rafRef.current);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [revealButton]);

  const handleOpenChat = useCallback(() => {
    setHasOpened(true);
    setIsOpen(true);
    setShowTooltip(false);
  }, []);

  const handleCloseChat = useCallback(() => {
    setIsOpen(false);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "i") {
        e.preventDefault();
        if (isOpen) handleCloseChat();
        else handleOpenChat();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleOpenChat, handleCloseChat]);

  return (
    <MotionScope>
      <AnimatePresence>
        {showButton && !isOpen && (
          <m.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="fixed right-6 bottom-6 z-40"
          >
            <AnimatePresence>
              {showTooltip && (
                <m.div
                  initial={{ opacity: 0, y: 10, x: 50 }}
                  animate={{ opacity: 1, y: 0, x: 0 }}
                  exit={{ opacity: 0, y: 10, x: 50 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="absolute top-1/2 right-full mr-3 -translate-y-1/2 whitespace-nowrap"
                >
                  <div className="bg-inverse font-custom2 text-on-inverse relative rounded-lg px-4 py-2 text-sm shadow-lg">
                    Ask me anything
                    <span
                      aria-hidden="true"
                      className="bg-inverse absolute top-1/2 right-0 size-3 translate-x-1/2 -translate-y-1/2 rotate-45"
                    />
                  </div>
                </m.div>
              )}
            </AnimatePresence>

            <m.button
              onClick={handleOpenChat}
              className="bg-inverse text-on-inverse flex size-14 items-center justify-center rounded-full shadow-lg transition-[scale,box-shadow] duration-300 hover:scale-110 hover:shadow-xl active:scale-95"
              aria-label="Open chat"
            >
              <MessageSquare className="h-6 w-6" />
            </m.button>
          </m.div>
        )}
      </AnimatePresence>

      {hasOpened && <ChatbotUI isOpen={isOpen} onClose={handleCloseChat} />}
    </MotionScope>
  );
}
