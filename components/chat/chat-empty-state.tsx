"use client";

import { ArrowUpRight } from "lucide-react";
import { ChatAvatar } from "@/components/chat/chat-avatar";
import { SITE_SHORT_NAME } from "@/lib/site";

const SUGGESTIONS = [
  `Why should I hire ${SITE_SHORT_NAME} for a backend role?`,
  "What's the hardest problem he has solved?",
  "Which project should I look at first?",
];

export function ChatEmptyState({ onPick }: { onPick: (question: string) => void }) {
  return (
    <div className="flex flex-1 flex-col justify-end gap-5">
      <div className="flex flex-col items-start gap-3">
        <ChatAvatar size="lg" />
        <div>
          <p className="font-custom text-fg text-xl">Hey, I&apos;m {SITE_SHORT_NAME}&apos;s assistant</p>
          <p className="text-fg-muted mt-1 text-sm leading-relaxed">
            Ask about his work, how he builds things, or whether he&apos;d fit your team.
          </p>
        </div>
      </div>
      <ul className="flex flex-col gap-2">
        {SUGGESTIONS.map((question) => (
          <li key={question}>
            <button
              type="button"
              onClick={() => onPick(question)}
              className="group frame-dashed text-fg-body hover:border-line-hover hover:text-fg flex min-h-11 w-full cursor-pointer items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors sm:min-h-10"
            >
              {question}
              <ArrowUpRight
                aria-hidden="true"
                className="text-fg-faint group-hover:text-fg size-4 shrink-0 transition-[color,translate] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none"
              />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
