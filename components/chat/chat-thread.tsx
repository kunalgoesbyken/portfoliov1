"use client";

import { ChatEmptyState } from "@/components/chat/chat-empty-state";
import { ChatMessage } from "@/components/chat/chat-message";
import { useFollowScroll } from "@/components/chat/use-follow-scroll";
import type { ChatMessage as Message } from "@/components/chat/use-chat";

interface ChatThreadProps {
  messages: Message[];
  isStreaming: boolean;
  onPick: (question: string) => void;
  onRetry: () => void;
}

export function ChatThread({ messages, isStreaming, onPick, onRetry }: ChatThreadProps) {
  const { viewportRef, contentRef, onScroll } = useFollowScroll<HTMLDivElement, HTMLDivElement>(messages.length);
  const lastId = messages.at(-1)?.id;

  return (
    <div ref={viewportRef} onScroll={onScroll} className="scrollbar-subtle min-h-0 flex-1 overflow-y-auto overscroll-contain">
      <div ref={contentRef} className="flex min-h-full flex-col px-4 py-5">
        {messages.length === 0 ? (
          <ChatEmptyState onPick={onPick} />
        ) : (
          <ol aria-live="polite" aria-busy={isStreaming} className="flex flex-col gap-5">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} onRetry={message.id === lastId ? onRetry : undefined} />
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}
