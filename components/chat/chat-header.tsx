import { RotateCcw, X } from "lucide-react";
import { ChatAvatar } from "@/components/chat/chat-avatar";
import { SITE_SHORT_NAME } from "@/lib/site";

const BUTTON_CLASS =
  "text-fg-muted hover:bg-muted hover:text-fg flex size-11 cursor-pointer items-center justify-center rounded-lg transition-colors sm:size-8";

interface ChatHeaderProps {
  canReset: boolean;
  onReset: () => void;
  onClose: () => void;
}

export function ChatHeader({ canReset, onReset, onClose }: ChatHeaderProps) {
  return (
    <header className="border-line flex flex-none items-center gap-3 border-b py-2 pr-2 pl-4">
      <ChatAvatar size="md" />
      <div className="min-w-0 flex-1">
        <h2 className="font-custom text-fg truncate text-lg leading-tight">Ask about {SITE_SHORT_NAME}</h2>
        <p className="font-custom2 text-fg-subtle truncate text-xs">Answers from his work and writing</p>
      </div>
      {canReset && (
        <button type="button" onClick={onReset} className={BUTTON_CLASS} aria-label="Start a new chat">
          <RotateCcw className="size-4" />
        </button>
      )}
      <button type="button" onClick={onClose} className={BUTTON_CLASS} aria-label="Close chat">
        <X className="size-4" />
      </button>
    </header>
  );
}
