"use client";

import type { FormEvent, KeyboardEvent } from "react";
import { ArrowUp, Square } from "lucide-react";
import { CHAT_MESSAGE_MAX_LENGTH } from "@/lib/chat";

interface ChatComposerProps {
  value: string;
  onChange: (value: string) => void;
  onSend: (value: string) => boolean;
  onStop: () => void;
  isStreaming: boolean;
  autoFocus: boolean;
}

const ACTION_CLASS = "btn-solid size-9 shrink-0 rounded-lg";

export function ChatComposer({ value, onChange, onSend, onStop, isStreaming, autoFocus }: ChatComposerProps) {
  const submit = () => {
    if (onSend(value)) onChange("");
  };
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    submit();
  };
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key !== "Enter" || e.shiftKey || e.nativeEvent.isComposing) return;
    e.preventDefault();
    submit();
  };

  return (
    <form onSubmit={handleSubmit} className="border-line flex-none border-t p-3">
      <div className="border-line-strong bg-surface focus-within:border-line-hover flex items-end gap-2 rounded-xl border py-1.5 pr-1.5 pl-3.5 transition-colors">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus={autoFocus}
          rows={1}
          maxLength={CHAT_MESSAGE_MAX_LENGTH}
          placeholder="Ask a question…"
          aria-label="Message"
          className="text-fg placeholder:text-fg-subtle field-sizing-content max-h-36 min-h-9 flex-1 resize-none bg-transparent py-1.5 text-base leading-6 focus:outline-none sm:text-sm"
        />
        {isStreaming ? (
          <button type="button" onClick={onStop} className={ACTION_CLASS} aria-label="Stop answering">
            <Square className="size-3 fill-current" />
          </button>
        ) : (
          <button type="submit" disabled={!value.trim()} className={ACTION_CLASS} aria-label="Send message">
            <ArrowUp className="size-4" />
          </button>
        )}
      </div>
      <p className="font-custom2 text-fg-subtle text-2xs mt-2 text-center max-sm:hidden">
        <kbd className="kbd">Enter</kbd> to send, <kbd className="kbd">Shift</kbd> <kbd className="kbd">Enter</kbd> for a new line
      </p>
    </form>
  );
}
