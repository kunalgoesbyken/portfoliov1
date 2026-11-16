"use client";

import { useCallback, useRef, useState } from "react";
import { CHAT_HISTORY_TURNS } from "@/lib/chat";

export type ChatRole = "user" | "model";

export type ChatStatus = "streaming" | "done" | "error";

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  status: ChatStatus;
}

interface Exchange {
  question: ChatMessage;
  answer: ChatMessage;
}

const toExchanges = (messages: ChatMessage[]): Exchange[] =>
  messages.flatMap((message, index) => {
    const answer = messages[index + 1];
    return message.role === "user" && answer ? [{ question: message, answer }] : [];
  });

const toRequestHistory = (messages: ChatMessage[], question: string) => [
  ...toExchanges(messages)
    .filter(({ answer }) => answer.status === "done" && answer.content.trim())
    .slice(-CHAT_HISTORY_TURNS)
    .flatMap(({ question, answer }) => [question, answer])
    .map(({ role, content }) => ({ role, content })),
  { role: "user" as const, content: question },
];

const streamReply = async (body: object, signal: AbortSignal, onText: (text: string) => void) => {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal,
  });
  if (!response.ok || !response.body) throw new Error(`Chat request failed with ${response.status}`);

  const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
  let text = "";
  for (;;) {
    const { done, value } = await reader.read();
    if (done) return text;
    text += value;
    onText(text);
  }
};

const message = (role: ChatRole, content: string, status: ChatStatus): ChatMessage => ({
  id: crypto.randomUUID(),
  role,
  content,
  status,
});

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const controllerRef = useRef<AbortController | null>(null);
  const isStreaming = messages.some((m) => m.status === "streaming");

  const updateAnswer = useCallback((id: string, patch: Partial<ChatMessage>) => {
    setMessages((current) => current.map((m) => (m.id === id ? { ...m, ...patch } : m)));
  }, []);

  const ask = useCallback(
    async (previous: ChatMessage[], text: string) => {
      const question = message("user", text, "done");
      const answer = message("model", "", "streaming");
      const controller = new AbortController();
      controllerRef.current = controller;
      setMessages([...previous, question, answer]);

      try {
        const reply = await streamReply({ messages: toRequestHistory(previous, text) }, controller.signal, (content) =>
          updateAnswer(answer.id, { content }),
        );
        updateAnswer(answer.id, { content: reply, status: reply.trim() ? "done" : "error" });
      } catch (error) {
        if (controller.signal.aborted) {
          setMessages((current) =>
            current.map((m) => (m.id === answer.id ? { ...m, status: m.content.trim() ? "done" : "error" } : m)),
          );
          return;
        }
        console.error("Chat error:", error);
        updateAnswer(answer.id, { status: "error" });
      } finally {
        if (controllerRef.current === controller) controllerRef.current = null;
      }
    },
    [updateAnswer],
  );

  const send = useCallback(
    (text: string) => {
      const content = text.trim();
      if (!content || isStreaming) return false;
      ask(messages, content);
      return true;
    },
    [ask, isStreaming, messages],
  );

  const retry = useCallback(() => {
    const last = toExchanges(messages).at(-1);
    if (!last || last.answer.status !== "error" || isStreaming) return;
    ask(messages.slice(0, -2), last.question.content);
  }, [ask, isStreaming, messages]);

  const stop = useCallback(() => controllerRef.current?.abort(), []);

  const reset = useCallback(() => {
    controllerRef.current?.abort();
    setMessages([]);
  }, []);

  return { messages, isStreaming, send, retry, stop, reset };
}
