"use client";

import { useState, useRef, useEffect } from "react";
import { Send, X } from "lucide-react";
import ReactMarkdown, { type Components } from "react-markdown";
import * as m from "motion/react-m";
import { AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

interface ChatMessage {
  id: string;
  role: "user" | "model";
  content: string;
}

interface ChatbotUIProps {
  isOpen: boolean;
  onClose: () => void;
}

const SUGGESTIONS = [
  "What does Kunal work with?",
  "What's Kunal building at FinStocks AI?",
  "How do I reach Kunal?",
];

const Heading = ({ children }: { children?: React.ReactNode }) => (
  <p className="mb-1 font-semibold last:mb-0">{children}</p>
);

const MARKDOWN_COMPONENTS: Components = {
  p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
  h1: Heading,
  h2: Heading,
  h3: Heading,
  h4: Heading,
  ul: ({ children }) => (
    <ul className="mb-2 ml-5 list-disc space-y-1 last:mb-0">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="mb-2 ml-5 list-decimal space-y-1 last:mb-0">{children}</ol>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-accent decoration-accent/30 hover:decoration-accent underline underline-offset-2"
    >
      {children}
    </a>
  ),
  pre: ({ children }) => (
    <pre className="bg-surface-raised border-line mb-2 overflow-x-auto rounded-md border p-2 text-xs last:mb-0">
      {children}
    </pre>
  ),
  code: ({ children }) => (
    <code className="font-mono text-xs break-all">{children}</code>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold">{children}</strong>
  ),
};

function Avatar({ size = "sm" }: { size?: "sm" | "lg" }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- tiny avatar inside a lazily loaded widget
    <img
      src="/images/kunal-sm.jpg"
      alt=""
      className={cn(
        "bg-muted shrink-0 rounded-full object-cover",
        size === "lg" ? "size-12" : "size-6",
      )}
    />
  );
}

function MessageRow({
  role,
  children,
}: {
  role: ChatMessage["role"];
  children: React.ReactNode;
}) {
  const isUser = role === "user";
  return (
    <m.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={cn("flex", isUser ? "justify-end" : "justify-start")}
    >
      <div
        className={cn(
          "max-w-[85%] min-w-0 rounded-lg px-3 py-2 text-sm leading-relaxed break-words",
          isUser ? "bg-inverse text-on-inverse" : "bg-muted text-fg",
        )}
      >
        {children}
      </div>
    </m.div>
  );
}

const Markdown = ({ children }: { children: string }) => (
  <ReactMarkdown components={MARKDOWN_COMPONENTS}>{children}</ReactMarkdown>
);

export default function ChatbotUI({ isOpen, onClose }: ChatbotUIProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [streamedResponse, setStreamedResponse] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ block: "end" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamedResponse]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);
    setStreamedResponse("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to get response");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullResponse = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          fullResponse += chunk;
          setStreamedResponse(fullResponse);
        }
      }

      setMessages([
        ...newMessages,
        { id: Date.now().toString(), role: "model", content: fullResponse },
      ]);
      setStreamedResponse("");
    } catch (error) {
      console.error("Chat error:", error);
      setMessages([
        ...newMessages,
        {
          id: Date.now().toString(),
          role: "model",
          content: "Sorry, something broke on my end. Try again?",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <m.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.2 }}
          role="dialog"
          aria-label="Ask about Kunal"
          className="border-line bg-surface-raised fixed right-4 bottom-4 z-50 flex h-[32rem] max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] flex-col overflow-hidden rounded-xl border shadow-2xl sm:right-6 sm:bottom-6 sm:w-96 md:w-[28rem]"
        >
          <div className="border-line flex flex-none items-center justify-between border-b py-1 pr-2 pl-4 sm:py-2">
            <div className="flex items-center gap-2">
              <Avatar />
              <h2 className="font-custom text-fg text-base font-bold">
                Ask about Kunal
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-fg-muted hover:bg-muted hover:text-fg flex size-11 items-center justify-center rounded-lg transition-colors sm:size-8"
              aria-label="Close"
            >
              <X className="size-4" />
            </button>
          </div>

          <div
            className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4"
            aria-live="polite"
          >
            {messages.length === 0 && (
              <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
                <Avatar size="lg" />
                <div>
                  <p className="font-custom text-fg text-base font-bold">
                    Hey, I&apos;m Kunal&apos;s AI assistant
                  </p>
                  <p className="text-fg-subtle mt-1 text-sm">
                    Ask about skills, projects, or experience.
                  </p>
                </div>
                <div className="flex w-full max-w-xs flex-col gap-2">
                  {SUGGESTIONS.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => {
                        setInput(suggestion);
                        inputRef.current?.focus();
                      }}
                      className="border-line text-fg-muted hover:border-line-hover hover:text-fg min-h-11 rounded-lg border px-3 text-left text-sm transition-colors sm:min-h-9"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg) => (
              <MessageRow key={msg.id} role={msg.role}>
                {msg.role === "model" ? (
                  <Markdown>{msg.content}</Markdown>
                ) : (
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                )}
              </MessageRow>
            ))}

            {isLoading && (
              <MessageRow role="model">
                {streamedResponse ? (
                  <Markdown>{streamedResponse}</Markdown>
                ) : (
                  <span
                    className="flex gap-1 py-1.5"
                    role="status"
                    aria-label="Thinking"
                  >
                    <span className="bg-fg-faint size-1.5 animate-pulse rounded-full [animation-delay:-0.3s] motion-reduce:animate-none" />
                    <span className="bg-fg-faint size-1.5 animate-pulse rounded-full [animation-delay:-0.15s] motion-reduce:animate-none" />
                    <span className="bg-fg-faint size-1.5 animate-pulse rounded-full motion-reduce:animate-none" />
                  </span>
                )}
              </MessageRow>
            )}

            <div ref={messagesEndRef} />
          </div>

          <form
            onSubmit={sendMessage}
            className="border-line flex-none border-t p-3"
          >
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask anything…"
                aria-label="Message"
                disabled={isLoading}
                className="bg-muted text-fg placeholder:text-fg-subtle focus:border-line-hover h-11 min-w-0 flex-1 rounded-lg border border-transparent px-3 text-base focus:outline-none disabled:opacity-50 sm:h-10 sm:text-sm"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="btn-solid size-11 flex-none sm:size-10"
                aria-label="Send message"
              >
                <Send className="size-4" />
              </button>
            </div>
            <p className="text-fg-subtle text-2xs mt-2 text-center max-sm:hidden">
              Press <kbd className="kbd">⌘</kbd> <kbd className="kbd">I</kbd> to
              toggle
            </p>
          </form>
        </m.div>
      )}
    </AnimatePresence>
  );
}
