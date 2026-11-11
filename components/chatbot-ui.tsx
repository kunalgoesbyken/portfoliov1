"use client";

import { useState, useRef, useEffect } from "react";
import { Send, X, Minimize2, Maximize2, User } from "lucide-react";
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
  "Skills & tech stack",
  "What is Kunal building at FinStocks AI?",
  "How to reach Kunal",
];

const ICON_BUTTON_CLASS =
  "rounded-lg p-1.5 text-fg-muted transition-colors hover:bg-line";

const MARKDOWN_COMPONENTS: Components = {
  p: ({ children }) => <p className="mb-1 last:mb-0">{children}</p>,
  ul: ({ children }) => <ul className="my-1 ml-4 list-disc">{children}</ul>,
  ol: ({ children }) => <ol className="my-1 ml-4 list-decimal">{children}</ol>,
  li: ({ children }) => <li className="my-0.5">{children}</li>,
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-accent hover:underline"
    >
      {children}
    </a>
  ),
  code: ({ children }) => (
    <code className="bg-surface-alt rounded px-1 py-0.5 font-mono text-xs">
      {children}
    </code>
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
        size === "lg" ? "size-12" : "size-8",
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
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={cn("flex gap-3", isUser ? "justify-end" : "justify-start")}
    >
      {!isUser && <Avatar />}
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm",
          isUser
            ? "bg-inverse text-on-inverse rounded-br-md"
            : "border-line bg-surface-raised text-fg rounded-bl-md border",
        )}
      >
        {children}
      </div>
      {isUser && (
        <span className="bg-muted flex size-8 shrink-0 items-center justify-center rounded-full">
          <User className="text-fg-muted size-4" aria-hidden="true" />
        </span>
      )}
    </m.div>
  );
}

const Markdown = ({ children }: { children: string }) => (
  <div className="prose prose-sm font-custom2 dark:prose-invert max-w-none">
    <ReactMarkdown components={MARKDOWN_COMPONENTS}>{children}</ReactMarkdown>
  </div>
);

export default function ChatbotUI({ isOpen, onClose }: ChatbotUIProps) {
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [streamedResponse, setStreamedResponse] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamedResponse]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, isMinimized]);

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
          content:
            "Sorry, I'm having trouble connecting. Please make sure the GEMINI_API_KEY is configured.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "i") {
        e.preventDefault();
        onClose();
      }
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
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.2 }}
          role="dialog"
          aria-label="Ask about Kunal"
          className={cn(
            "border-line bg-surface-raised fixed right-6 bottom-6 z-50 flex max-h-[calc(100dvh-3rem)] w-[calc(100%-2rem)] flex-col overflow-hidden rounded-2xl border shadow-2xl transition-[height] duration-300 sm:w-96 md:w-[28rem]",
            isMinimized ? "h-14" : "h-[32rem]",
          )}
        >
          <div className="border-line bg-muted flex flex-none items-center justify-between border-b px-4 py-3">
            <div className="flex items-center gap-2">
              <Avatar />
              <h2 className="text-fg text-sm font-semibold">
                Ask about Kunal
              </h2>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setIsMinimized(!isMinimized)}
                className={ICON_BUTTON_CLASS}
                aria-label={isMinimized ? "Maximize" : "Minimize"}
              >
                {isMinimized ? (
                  <Maximize2 className="size-4" />
                ) : (
                  <Minimize2 className="size-4" />
                )}
              </button>
              <button
                type="button"
                onClick={onClose}
                className={ICON_BUTTON_CLASS}
                aria-label="Close"
              >
                <X className="size-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              <div
                className="bg-surface/50 min-h-0 flex-1 space-y-4 overflow-y-auto p-4"
                aria-live="polite"
              >
                {messages.length === 0 && (
                  <div className="flex h-full flex-col items-center justify-center space-y-3 text-center">
                    <Avatar size="lg" />
                    <div>
                      <p className="text-fg text-sm font-medium">
                        Hey, I&apos;m Kunal&apos;s AI assistant
                      </p>
                      <p className="font-custom2 text-fg-subtle mt-1 max-w-[200px] text-xs">
                        Ask about skills, projects, experience, anything on the
                        site.
                      </p>
                    </div>
                    <div className="mt-2 flex flex-wrap justify-center gap-2">
                      {SUGGESTIONS.map((suggestion) => (
                        <button
                          key={suggestion}
                          type="button"
                          onClick={() => setInput(suggestion)}
                          className="border-line bg-surface-raised font-custom2 text-fg-muted hover:border-line-hover rounded-lg border px-3 py-1.5 text-xs transition-colors"
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
                      <p className="font-custom2">{msg.content}</p>
                    )}
                  </MessageRow>
                ))}

                {isLoading && (
                  <MessageRow role="model">
                    {streamedResponse ? (
                      <Markdown>{streamedResponse}</Markdown>
                    ) : (
                      <span
                        className="flex gap-1 py-1"
                        role="status"
                        aria-label="Thinking"
                      >
                        <span className="bg-fg-faint size-2 animate-pulse rounded-full motion-reduce:animate-none [animation-delay:-0.3s]" />
                        <span className="bg-fg-faint size-2 animate-pulse rounded-full motion-reduce:animate-none [animation-delay:-0.15s]" />
                        <span className="bg-fg-faint size-2 animate-pulse rounded-full motion-reduce:animate-none" />
                      </span>
                    )}
                  </MessageRow>
                )}

                <div ref={messagesEndRef} />
              </div>

              <form
                onSubmit={sendMessage}
                className="border-line bg-surface-raised flex-none border-t p-3"
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
                    className="bg-muted font-custom2 text-fg placeholder:text-fg-subtle focus:ring-line-strong flex-1 rounded-xl border-0 px-4 py-2.5 text-sm focus:ring-2 focus:outline-none disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className="btn-solid rounded-xl px-4 py-2.5"
                    aria-label="Send message"
                  >
                    <Send className="size-4" />
                  </button>
                </div>
                <p className="font-custom2 text-fg-subtle mt-2 text-center text-2xs">
                  Press <kbd className="kbd">⌘</kbd> +{" "}
                  <kbd className="kbd">I</kbd> to toggle
                </p>
              </form>
            </>
          )}
        </m.div>
      )}
    </AnimatePresence>
  );
}
