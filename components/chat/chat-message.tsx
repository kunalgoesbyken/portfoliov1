"use client";

import { useState } from "react";
import * as m from "motion/react-m";
import { Check, Copy, RotateCcw } from "lucide-react";
import { rise } from "@/components/motion-presets";
import { ChatAvatar } from "@/components/chat/chat-avatar";
import { ChatMarkdown } from "@/components/chat/chat-markdown";
import { useSmoothText } from "@/components/chat/use-smooth-text";
import type { ChatMessage as Message } from "@/components/chat/use-chat";

const COPIED_MS = 1500;

const ACTION_CLASS =
  "inline-flex h-7 items-center gap-1.5 rounded-md px-2 text-xs text-fg-subtle transition-colors hover:bg-muted hover:text-fg cursor-pointer";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () =>
    navigator.clipboard.writeText(text).then(
      () => {
        setCopied(true);
        setTimeout(() => setCopied(false), COPIED_MS);
      },
      () => setCopied(false),
    );
  return (
    <button type="button" onClick={copy} className={ACTION_CLASS} aria-label={copied ? "Copied" : "Copy answer"}>
      {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

function ErrorNotice({ onRetry }: { onRetry?: () => void }) {
  return (
    <div className="text-fg-muted flex flex-wrap items-center gap-2 text-sm">
      <span>Couldn&apos;t get an answer just now.</span>
      {onRetry && (
        <button type="button" onClick={onRetry} className={ACTION_CLASS}>
          <RotateCcw className="size-3.5" />
          Try again
        </button>
      )}
    </div>
  );
}

function UserMessage({ content }: { content: string }) {
  return (
    <div className="flex justify-end">
      <p className="bg-muted text-fg max-w-[85%] rounded-2xl rounded-br-md px-3.5 py-2 text-sm leading-relaxed break-words whitespace-pre-wrap">
        {content}
      </p>
    </div>
  );
}

function AssistantMessage({ message, onRetry }: { message: Message; onRetry?: () => void }) {
  const { text, revealing } = useSmoothText(message.content);
  const settled = message.status === "done" && !revealing;

  return (
    <div className="flex gap-3">
      <ChatAvatar className="mt-0.5" />
      <div className="text-fg-body min-w-0 flex-1 text-sm leading-relaxed break-words">
        {text ? (
          <ChatMarkdown>{text}</ChatMarkdown>
        ) : (
          message.status === "streaming" && (
            <span role="status" className="text-shimmer inline-block py-0.5 font-medium">
              Thinking
            </span>
          )
        )}
        {message.status === "error" && <ErrorNotice onRetry={onRetry} />}
        {settled && (
          <div className="animate-in fade-in -ml-2 mt-1.5 duration-300">
            <CopyButton text={message.content} />
          </div>
        )}
      </div>
    </div>
  );
}

export function ChatMessage({ message, onRetry }: { message: Message; onRetry?: () => void }) {
  return (
    <m.li {...rise} className="list-none">
      {message.role === "user" ? (
        <UserMessage content={message.content} />
      ) : (
        <AssistantMessage message={message} onRetry={onRetry} />
      )}
    </m.li>
  );
}
