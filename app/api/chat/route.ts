import { GoogleGenAI } from "@google/genai";
import { NextRequest } from "next/server";
import { PORTFOLIO_CONTEXT } from "@/lib/context";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.warn("GEMINI_API_KEY is not set in environment variables");
}

interface Message {
  role: "user" | "model";
  content: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages } = body;

    if (!Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: "Invalid request" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (messages.length > 50) {
      return new Response(JSON.stringify({ error: "Invalid request" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    for (const msg of messages) {
      if (
        typeof msg !== "object" ||
        msg === null ||
        typeof msg.role !== "string" ||
        (msg.role !== "user" && msg.role !== "model") ||
        typeof msg.content !== "string" ||
        msg.content.length > 10000
      ) {
        return new Response(JSON.stringify({ error: "Invalid request" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    if (!GEMINI_API_KEY) {
      return new Response(
        JSON.stringify({
          error: "API key not configured. Please add GEMINI_API_KEY to environment variables.",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

    const chat = ai.chats.create({
      model: "gemini-2.5-flash",
      history: messages
        .slice(0, -1)
        .map((msg: Message) => ({
          role: msg.role,
          parts: [{ text: msg.content }],
        })),
    });

    const lastMessage = messages[messages.length - 1];
    const userMessage = lastMessage?.content || "";

    const stream = await chat.sendMessageStream({
      message: `${PORTFOLIO_CONTEXT}

User: ${userMessage}`,
    });

    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const text = chunk.text;
            if (text) {
              controller.enqueue(encoder.encode(text));
            }
          }
          controller.close();
        } catch (error) {
          console.error("Streaming error:", error);
          controller.error(error);
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
