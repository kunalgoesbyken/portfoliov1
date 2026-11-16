"use client";

import { useEffect, useState } from "react";
import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { pop } from "@/components/motion-presets";
import { ChatComposer } from "@/components/chat/chat-composer";
import { ChatHeader } from "@/components/chat/chat-header";
import { ChatThread } from "@/components/chat/chat-thread";
import { useChat } from "@/components/chat/use-chat";
import { useMediaQuery } from "@/lib/hooks";
import { SITE_SHORT_NAME } from "@/lib/site";

interface ChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

function useCloseOnEscape(active: boolean, onClose: () => void) {
  useEffect(() => {
    if (!active) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [active, onClose]);
}

export default function ChatPanel({ isOpen, onClose }: ChatPanelProps) {
  const chat = useChat();
  const [draft, setDraft] = useState("");
  const finePointer = useMediaQuery("(pointer: fine)");
  useCloseOnEscape(isOpen, onClose);

  return (
    <AnimatePresence>
      {isOpen && (
        <m.div
          {...pop}
          role="dialog"
          aria-label={`Ask about ${SITE_SHORT_NAME}`}
          className="border-line bg-surface-raised fixed right-4 bottom-4 z-50 flex h-[36rem] max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] origin-bottom-right flex-col overflow-hidden rounded-2xl border shadow-2xl sm:right-6 sm:bottom-6 sm:w-[26rem]"
        >
          <ChatHeader canReset={chat.messages.length > 0} onReset={chat.reset} onClose={onClose} />
          <ChatThread messages={chat.messages} isStreaming={chat.isStreaming} onPick={chat.send} onRetry={chat.retry} />
          <ChatComposer
            value={draft}
            onChange={setDraft}
            onSend={chat.send}
            onStop={chat.stop}
            isStreaming={chat.isStreaming}
            autoFocus={finePointer}
          />
        </m.div>
      )}
    </AnimatePresence>
  );
}
