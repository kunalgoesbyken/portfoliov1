"use client";

import { useCallback, useEffect, useState } from "react";
import { MessageSquare } from "lucide-react";
import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import MotionScope from "@/components/motion-scope";
import { pop, rise } from "@/components/motion-presets";
import { Spinner } from "@/components/ui/spinner";
import { whenIdle } from "@/lib/idle";

type ChatPanelComponent = typeof import("@/components/chat/chat-panel").default;

const REVEAL_DELAY_MS = 3000;
const REVEAL_SCROLL_PX = 500;
const HINT_DELAY_MS = 1000;
const HINT_DURATION_MS = 4000;
const HINT_SEEN_KEY = "chatbot-tooltip-shown";

const LAUNCHER_CLASS =
  "bg-inverse text-on-inverse flex size-14 items-center justify-center rounded-full shadow-lg";

function useRevealed() {
  const [revealed, setRevealed] = useState(false);
  useEffect(() => {
    if (revealed) return;
    const reveal = () => setRevealed(true);
    const onScroll = () => {
      if (window.scrollY > REVEAL_SCROLL_PX) reveal();
    };
    const timer = setTimeout(reveal, REVEAL_DELAY_MS);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, [revealed]);
  return revealed;
}

function useFirstVisitHint(active: boolean) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!active || localStorage.getItem(HINT_SEEN_KEY) !== null) return;
    const show = setTimeout(() => {
      localStorage.setItem(HINT_SEEN_KEY, "true");
      setVisible(true);
    }, HINT_DELAY_MS);
    const hide = setTimeout(() => setVisible(false), HINT_DELAY_MS + HINT_DURATION_MS);
    return () => {
      clearTimeout(show);
      clearTimeout(hide);
    };
  }, [active]);
  return visible;
}

function useChatPanel(preload: boolean) {
  const [Panel, setPanel] = useState<ChatPanelComponent | null>(null);
  const load = useCallback(() => {
    import("@/components/chat/chat-panel").then((mod) => setPanel(() => mod.default));
  }, []);
  useEffect(() => (preload ? whenIdle(load) : undefined), [preload, load]);
  return { Panel, load };
}

function useToggleShortcut(toggle: () => void) {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (!(e.metaKey || e.ctrlKey) || e.key.toLowerCase() !== "i") return;
      e.preventDefault();
      toggle();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [toggle]);
}

export default function ChatLauncher() {
  const [isOpen, setIsOpen] = useState(false);
  const revealed = useRevealed();
  const hint = useFirstVisitHint(revealed);
  const { Panel, load } = useChatPanel(revealed);

  const open = useCallback(() => {
    load();
    setIsOpen(true);
  }, [load]);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => (isOpen ? close() : open()), [isOpen, open, close]);
  useToggleShortcut(toggle);

  return (
    <MotionScope>
      <AnimatePresence>
        {revealed && !isOpen && (
          <m.div {...pop} className="fixed right-6 bottom-6 z-40 origin-bottom-right">
            <AnimatePresence>
              {hint && (
                <m.div {...rise} className="absolute top-1/2 right-full mr-3 -translate-y-1/2 whitespace-nowrap">
                  <div className="bg-inverse font-custom2 text-on-inverse rounded-lg px-4 py-2 text-sm shadow-lg">
                    Ask me anything
                  </div>
                </m.div>
              )}
            </AnimatePresence>
            <button
              type="button"
              onClick={open}
              aria-label="Open chat"
              className={`${LAUNCHER_CLASS} cursor-pointer transition-[scale,box-shadow] duration-300 hover:scale-110 hover:shadow-xl active:scale-95`}
            >
              <MessageSquare className="size-6" />
            </button>
          </m.div>
        )}
      </AnimatePresence>

      {Panel ? (
        <Panel isOpen={isOpen} onClose={close} />
      ) : (
        isOpen && (
          <div className={`${LAUNCHER_CLASS} fixed right-6 bottom-6 z-50`}>
            <Spinner className="size-6" />
          </div>
        )
      )}
    </MotionScope>
  );
}
