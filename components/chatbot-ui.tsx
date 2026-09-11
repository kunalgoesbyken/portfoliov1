"use client";

import { useState, useRef, useEffect } from "react";
import { Send, X, Minimize2, Maximize2, User } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { motion, AnimatePresence } from "motion/react";
import { PORTFOLIO_CONTEXT } from "@/lib/context";

interface ChatMessage {
  id: string;
  role: "user" | "model";
  content: string;
}

interface ChatbotUIProps {
  isOpen: boolean;
  onClose: () => void;
}

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

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, isMinimized]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { id: Date.now().toString(), role: "user", content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);
    setStreamedResponse("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages,
          context: PORTFOLIO_CONTEXT,
        }),
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
          content: "Sorry, I'm having trouble connecting. Please make sure the GEMINI_API_KEY is configured.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + I to toggle chat
      if ((e.metaKey || e.ctrlKey) && e.key === "i") {
        e.preventDefault();
        onClose();
      }
      // Escape to close
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
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.2 }}
          className={`
            fixed bottom-6 right-6 z-50
            w-[calc(100%-2rem)] sm:w-96 md:w-[28rem]
            max-h-[calc(100vh-3rem)]
            bg-white dark:bg-neutral-900
            rounded-2xl shadow-2xl
            border border-neutral-200 dark:border-neutral-800
            overflow-hidden flex flex-col
            ${isMinimized ? "h-14" : "h-[32rem]"}
            transition-all duration-300
          `}
        >
          {/* Header */}
          <div className="flex-none flex items-center justify-between px-4 py-3 bg-neutral-100 dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full overflow-hidden bg-neutral-200 dark:bg-neutral-800">
                <img
                  src="/images/kunal.jpg"
                  alt="Kunal"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
<h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 font-custom">
                  Ask about Kunal
                </h3>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1.5 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                aria-label={isMinimized ? "Maximize" : "Minimize"}
              >
                {isMinimized ? (
                  <Maximize2 className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                ) : (
                  <Minimize2 className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                )}
              </button>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          {!isMinimized && (
            <>
              <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4 bg-neutral-50/50 dark:bg-neutral-950/50">
                {messages.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-full text-center space-y-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-neutral-200 dark:bg-neutral-800">
                      <img
                        src="/images/kunal.jpg"
                        alt="Kunal"
                        className="w-full h-full object-cover"
                      />
                    </div>
<div>
                       <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100 font-custom">
                         Hey, I'm Kunal's AI assistant
                       </p>
                       <p className="text-xs text-neutral-500 dark:text-neutral-400 font-custom2 mt-1 max-w-[200px]">
                         Ask about skills, projects, experience — anything on the site.
                       </p>
                    </div>
                    <div className="flex flex-wrap gap-2 justify-center mt-2">
                      {["Skills & tech stack", "What is Kunal building at FinStocks AI?", "How to reach Kunal"].map((suggestion) => (
                        <button
                          key={suggestion}
                          onClick={() => setInput(suggestion)}
                          aria-label={`Send: ${suggestion}`}
                          className="px-3 py-1.5 text-xs bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-600 dark:text-neutral-400 hover:border-neutral-400 dark:hover:border-neutral-500 transition-colors font-custom2"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {msg.role === "model" && (
                      <div className="flex-shrink-0 w-8 h-8 rounded-full overflow-hidden bg-neutral-200 dark:bg-neutral-800">
                        <img
                          src="/images/kunal.jpg"
                          alt="Kunal"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div
                      className={`
                        max-w-[80%] px-4 py-2.5 rounded-2xl text-sm
                        ${msg.role === "user"
                          ? "bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 rounded-br-md"
                          : "bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700 rounded-bl-md"
                        }
                      `}
                    >
                      {msg.role === "model" ? (
                        <div className="prose prose-sm dark:prose-invert max-w-none font-custom2">
                          <ReactMarkdown
                            components={{
                              p: ({ children }) => <p className="mb-1 last:mb-0">{children}</p>,
                              ul: ({ children }) => <ul className="my-1 ml-4 list-disc">{children}</ul>,
                              ol: ({ children }) => <ol className="my-1 ml-4 list-decimal">{children}</ol>,
                              li: ({ children }) => <li className="my-0.5">{children}</li>,
                              a: ({ href, children }) => (
                                <a href={href} className="text-blue-600 dark:text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">
                                  {children}
                                </a>
                              ),
                              code: ({ children }) => (
                                <code className="bg-neutral-100 dark:bg-neutral-900 px-1 py-0.5 rounded text-xs font-mono">
                                  {children}
                                </code>
                              ),
                              strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                            }}
                          >
                            {msg.content}
                          </ReactMarkdown>
                        </div>
                      ) : (
                        <p className="font-custom2">{msg.content}</p>
                      )}
                    </div>
                    {msg.role === "user" && (
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center">
                        <User className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                      </div>
                    )}
                  </motion.div>
                ))}

                {/* Streaming Response */}
                {isLoading && streamedResponse && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-3 justify-start"
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded-full overflow-hidden bg-neutral-200 dark:bg-neutral-800">
                      <img
                        src="/images/kunal.jpg"
                        alt="Kunal"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="max-w-[80%] px-4 py-2.5 rounded-2xl rounded-bl-md bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700">
                      <div className="prose prose-sm dark:prose-invert max-w-none font-custom2">
                        <ReactMarkdown
                          components={{
                            p: ({ children }) => <p className="mb-1 last:mb-0">{children}</p>,
                            a: ({ href, children }) => (
                              <a href={href} className="text-blue-600 dark:text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">
                                {children}
                              </a>
                            ),
                          }}
                        >
                          {streamedResponse}
                        </ReactMarkdown>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Loading Indicator */}
                {isLoading && !streamedResponse && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex gap-3 justify-start"
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded-full overflow-hidden bg-neutral-200 dark:bg-neutral-800">
                      <img
                        src="/images/kunal.jpg"
                        alt="Kunal"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="px-4 py-2.5 rounded-2xl rounded-bl-md bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                        <span className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                        <span className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce"></span>
                      </div>
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <form onSubmit={sendMessage} className="flex-none p-3 bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-700">
                <div className="flex gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask anything..."
                    disabled={isLoading}
                    className="flex-1 px-4 py-2.5 bg-neutral-100 dark:bg-neutral-800 border-0 rounded-xl text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-500 dark:placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-300 dark:focus:ring-neutral-600 disabled:opacity-50 font-custom2"
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className="px-4 py-2.5 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 rounded-xl hover:bg-neutral-800 dark:hover:bg-neutral-200 disabled:opacity-50 disabled:hover:bg-neutral-900 dark:disabled:hover:bg-neutral-100 transition-colors flex items-center justify-center"
                    aria-label="Send message"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-[10px] text-neutral-400 dark:text-neutral-500 mt-2 text-center font-custom2">
                  Press <kbd className="px-1 py-0.5 bg-neutral-100 dark:bg-neutral-800 rounded text-neutral-500">⌘</kbd> + <kbd className="px-1 py-0.5 bg-neutral-100 dark:bg-neutral-800 rounded text-neutral-500">I</kbd> to toggle
                </p>
              </form>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
