import { GoogleGenAI } from "@google/genai";
import { NextRequest } from "next/server";
import { getSystemInstruction } from "@/lib/context";
import { CHAT_MAX_MESSAGES, CHAT_MESSAGE_MAX_LENGTH } from "@/lib/chat";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const MODEL = "gemini-2.5-flash";

if (!GEMINI_API_KEY) {
  console.warn("GEMINI_API_KEY is not set in environment variables");
}

interface Message {
  role: "user" | "model";
  content: string;
}

const json = (body: object, status: number) => Response.json(body, { status });

const isMessage = (value: unknown): value is Message => {
  if (typeof value !== "object" || value === null) return false;
  const { role, content } = value as Record<string, unknown>;
  return (
    (role === "user" || role === "model") &&
    typeof content === "string" &&
    content.trim().length > 0 &&
    content.length <= CHAT_MESSAGE_MAX_LENGTH
  );
};

interface Conversation {
  history: Message[];
  latest: string;
}

const parseConversation = (body: unknown): Conversation | null => {
  const messages = (body as { messages?: unknown } | null)?.messages;
  if (!Array.isArray(messages) || messages.length > CHAT_MAX_MESSAGES || !messages.every(isMessage)) return null;
  const history = messages.map(({ role, content }) => ({ role, content }));
  const latest = history.pop();
  if (latest?.role !== "user" || history[0]?.role === "model") return null;
  return { history, latest: latest.content };
};

const toTextStream = (chunks: AsyncIterable<{ text?: string }>) => {
  const encoder = new TextEncoder();
  return new ReadableStream({
    async start(controller) {
      try {
        for await (const { text } of chunks) {
          if (text) controller.enqueue(encoder.encode(text));
        }
        controller.close();
      } catch (error) {
        console.error("Streaming error:", error);
        controller.error(error);
      }
    },
  });
};

export async function POST(req: NextRequest) {
  const conversation = parseConversation(await req.json().catch(() => null));
  if (!conversation) return json({ error: "Invalid request" }, 400);
  if (!GEMINI_API_KEY) return json({ error: "Chat is not configured" }, 500);

  try {
    const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
    const chat = ai.chats.create({
      model: MODEL,
      config: { systemInstruction: await getSystemInstruction() },
      history: conversation.history.map(({ role, content }) => ({ role, parts: [{ text: content }] })),
    });
    const stream = await chat.sendMessageStream({ message: conversation.latest });

    return new Response(toTextStream(stream), {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return json({ error: "Internal server error" }, 500);
  }
}
