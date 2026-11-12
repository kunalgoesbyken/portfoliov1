"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
  ArrowDown,
  ArrowUp,
  Code,
  Copy,
  CornerDownLeft,
  FileText,
  Laptop,
  LayoutDashboard,
  Moon,
  Sun,
  type LucideIcon,
} from "lucide-react";
import GithubIcon from "@/components/ui/github-icon";
import LinkedinIcon from "@/components/ui/linkedin-icon";
import TwitterXIcon from "@/components/ui/twitter-x-icon";
import MailFilledIcon from "@/components/ui/mail-filled-icon";
import type { AnimatedIconProps } from "@/components/ui/types";
import { SOCIAL_LINKS } from "@/lib/social-links";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";

interface Actions {
  go: (href: string) => void;
  open: (href: string) => void;
  setTheme: (theme: string) => void;
}

interface CommandDef {
  label: string;
  key: string;
  icon: LucideIcon | React.ComponentType<AnimatedIconProps>;
  run: (actions: Actions) => void;
}

const COMMAND_GROUPS: { heading: string; commands: CommandDef[] }[] = [
  {
    heading: "Navigation",
    commands: [
      { label: "Go to home", key: "h", icon: LayoutDashboard, run: ({ go }) => go("/") },
      { label: "Go to projects", key: "p", icon: Code, run: ({ go }) => go("/projects") },
      { label: "Go to blog", key: "b", icon: FileText, run: ({ go }) => go("/blog") },
    ],
  },
  {
    heading: "Links",
    commands: [
      { label: "X profile", key: "x", icon: TwitterXIcon, run: ({ open }) => open(SOCIAL_LINKS.x) },
      { label: "LinkedIn profile", key: "l", icon: LinkedinIcon, run: ({ open }) => open(SOCIAL_LINKS.linkedin) },
      { label: "GitHub profile", key: "g", icon: GithubIcon, run: ({ open }) => open(SOCIAL_LINKS.github) },
      { label: "Send an email", key: "e", icon: MailFilledIcon, run: () => { window.location.href = SOCIAL_LINKS.email; } },
    ],
  },
  {
    heading: "General",
    commands: [
      { label: "Copy link", key: "c", icon: Copy, run: () => navigator.clipboard.writeText(window.location.href) },
    ],
  },
  {
    heading: "Theme",
    commands: [
      { label: "Light mode", key: "t", icon: Sun, run: ({ setTheme }) => setTheme("light") },
      { label: "Dark mode", key: "d", icon: Moon, run: ({ setTheme }) => setTheme("dark") },
      { label: "System theme", key: "s", icon: Laptop, run: ({ setTheme }) => setTheme("system") },
    ],
  },
];

const COMMANDS_BY_KEY = new Map(COMMAND_GROUPS.flatMap((group) => group.commands.map((c) => [c.key, c] as const)));

const isTyping = (target: EventTarget | null) =>
  target instanceof HTMLElement &&
  (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName));

export function CommandMenu({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const router = useRouter();
  const { setTheme } = useTheme();

  const run = React.useCallback(
    (command: CommandDef) => {
      onOpenChange(false);
      command.run({ go: (href) => router.push(href), open: (href) => window.open(href, "_blank"), setTheme });
    },
    [onOpenChange, router, setTheme],
  );

  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (!e.shiftKey || e.metaKey || e.ctrlKey || e.altKey || isTyping(e.target)) return;
      const command = COMMANDS_BY_KEY.get(e.key.toLowerCase());
      if (!command) return;
      e.preventDefault();
      run(command);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [run]);

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange} className="font-custom2">
      <div className="flex items-center gap-4 border-b border-line p-4">
        <div className="flex size-10 items-center justify-center rounded-xl bg-muted text-fg-subtle">
          <LayoutDashboard className="size-5" />
        </div>
        <div>
          <p className="text-sm font-semibold text-fg">Home</p>
          <p className="text-xs text-fg-subtle">About me and what I&apos;m up to</p>
        </div>
      </div>

      <CommandInput placeholder="Search actions…" className="border-none font-custom2 focus:ring-0" />

      <CommandList className="p-2 font-custom2">
        <CommandEmpty>No results found.</CommandEmpty>
        {COMMAND_GROUPS.map((group, index) => (
          <React.Fragment key={group.heading}>
            {index > 0 && <CommandSeparator className="my-2" />}
            <CommandGroup heading={group.heading}>
              {group.commands.map((command) => (
                <CommandItem key={command.key} onSelect={() => run(command)} className="rounded-lg py-3">
                  <command.icon className="mr-2 size-4 text-fg-subtle" />
                  <span>{command.label}</span>
                  <CommandShortcut className="kbd tracking-normal">shift + {command.key.toUpperCase()}</CommandShortcut>
                </CommandItem>
              ))}
            </CommandGroup>
          </React.Fragment>
        ))}
      </CommandList>

      <div className="flex items-center justify-between border-t border-line bg-surface/50 px-4 py-3 text-2xs text-fg-subtle">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <ArrowUp className="size-3" />
            <ArrowDown className="size-3" />
            to navigate
          </span>
          <span className="flex items-center gap-1">
            <CornerDownLeft className="size-3" />
            to select
          </span>
        </div>
        <span className="flex items-center gap-1">
          <kbd className="font-mono">esc</kbd> to close
        </span>
      </div>
    </CommandDialog>
  );
}
