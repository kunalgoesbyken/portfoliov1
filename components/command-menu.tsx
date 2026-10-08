"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import {
    LayoutDashboard,
    FileText,
    Moon,
    Sun,
    Laptop,
    Search,
    Code,
    ArrowUp,
    ArrowDown,
    CornerDownLeft,
    Copy
} from "lucide-react"
import GithubIcon from "@/components/ui/github-icon"
import LinkedinIcon from "@/components/ui/linkedin-icon"
import TwitterXIcon from "@/components/ui/twitter-x-icon"
import MailFilledIcon from "@/components/ui/mail-filled-icon"
import { SOCIAL_LINKS } from "@/lib/social-links"

import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
} from "@/components/ui/command"

// Heavy part (cmdk + radix dialog). Loaded lazily by `command-menu-trigger.tsx`,
// which owns the open state and the ⌘K listener.
export function CommandMenu({
    open,
    onOpenChange: setOpen,
}: {
    open: boolean
    onOpenChange: (open: boolean) => void
}) {
    const router = useRouter()
    const { setTheme } = useTheme()

    const runCommand = React.useCallback((command: () => unknown) => {
        setOpen(false)
        command()
    }, [])

    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            const target = e.target as HTMLElement;
            if (target.isContentEditable || target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') {
                return;
            }

            if (e.shiftKey) {
                const key = e.key.toLowerCase()

                // Navigation
                if (key === 'h') {
                    e.preventDefault()
                    runCommand(() => router.push("/"))
                } else if (key === 'p') {
                    e.preventDefault()
                    runCommand(() => router.push("/projects"))
                } else if (key === 'w') {
                    e.preventDefault()
                    runCommand(() => router.push("/blog"))
                }

                // Links
                else if (key === 'x') {
                    e.preventDefault()
                    runCommand(() => window.open(SOCIAL_LINKS.x, "_blank"))
                } else if (key === 'l') {
                    e.preventDefault()
                    runCommand(() => window.open(SOCIAL_LINKS.linkedin, "_blank"))
                } else if (key === 'g') {
                    e.preventDefault()
                    runCommand(() => window.open(SOCIAL_LINKS.github, "_blank"))
                } else if (key === 'e') {
                    e.preventDefault()
                    runCommand(() => router.push("/contact"))
                }

                // General
                else if (key === 'c') {
                    e.preventDefault()
                    runCommand(() => navigator.clipboard.writeText(window.location.href))
                }

                // Theme
                else if (key === 't') {
                    e.preventDefault()
                    runCommand(() => setTheme("light"))
                } else if (key === 'd') {
                    e.preventDefault()
                    runCommand(() => setTheme("dark"))
                } else if (key === 's') {
                    e.preventDefault()
                    runCommand(() => setTheme("system"))
                }
            }
        }

        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, [open, runCommand, router, setTheme])

    return (
        <>
            <CommandDialog open={open} onOpenChange={setOpen} className="font-custom2">
                {/* Header Section */}
                <div className="flex items-center gap-4 p-4 border-b border-neutral-100 dark:border-neutral-800">
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400">
                        <LayoutDashboard className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Home</h3>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">About me and what I'm up to</p>
                    </div>
                </div>

                <CommandInput placeholder="Search for actions..." className="font-custom2 border-none focus:ring-0" />

                <CommandList className="font-custom2 p-2">
                    <CommandEmpty>No results found.</CommandEmpty>

                    <CommandGroup heading="Navigation">
                        <CommandItem onSelect={() => runCommand(() => router.push("/"))} className="rounded-lg py-3">
                            <LayoutDashboard className="mr-2 h-4 w-4 text-neutral-500" />
                            <span>Go to Home</span>
                            <CommandShortcut className="font-mono text-[10px] bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded border border-neutral-200 dark:border-neutral-700">shift + H</CommandShortcut>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => router.push("/projects"))} className="rounded-lg py-3">
                            <Code className="mr-2 h-4 w-4 text-neutral-500" />
                            <span>Go to Projects</span>
                            <CommandShortcut className="font-mono text-[10px] bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded border border-neutral-200 dark:border-neutral-700">shift + P</CommandShortcut>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => router.push("/blog"))} className="rounded-lg py-3">
                            <FileText className="mr-2 h-4 w-4 text-neutral-500" />
                            <span>Go to Writing</span>
                            <CommandShortcut className="font-mono text-[10px] bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded border border-neutral-200 dark:border-neutral-700">shift + W</CommandShortcut>
                        </CommandItem>
                    </CommandGroup>

                    <CommandSeparator className="my-2" />

                    <CommandGroup heading="Links">
                        <CommandItem onSelect={() => runCommand(() => window.open(SOCIAL_LINKS.x, "_blank"))} className="rounded-lg py-3">
                            <TwitterXIcon className="mr-2 h-4 w-4 text-neutral-500" />
                            <span>X Profile</span>
                            <CommandShortcut className="font-mono text-[10px] bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded border border-neutral-200 dark:border-neutral-700">shift + X</CommandShortcut>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => window.open(SOCIAL_LINKS.linkedin, "_blank"))} className="rounded-lg py-3">
                            <LinkedinIcon className="mr-2 h-4 w-4 text-neutral-500" />
                            <span>LinkedIn Profile</span>
                            <CommandShortcut className="font-mono text-[10px] bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded border border-neutral-200 dark:border-neutral-700">shift + L</CommandShortcut>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => window.open(SOCIAL_LINKS.github, "_blank"))} className="rounded-lg py-3">
                            <GithubIcon className="mr-2 h-4 w-4 text-neutral-500" />
                            <span>GitHub Profile</span>
                            <CommandShortcut className="font-mono text-[10px] bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded border border-neutral-200 dark:border-neutral-700">shift + G</CommandShortcut>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => router.push("/contact"))} className="rounded-lg py-3">
                            <MailFilledIcon className="mr-2 h-4 w-4 text-neutral-500" />
                            <span>Email</span>
                            <CommandShortcut className="font-mono text-[10px] bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded border border-neutral-200 dark:border-neutral-700">shift + E</CommandShortcut>
                        </CommandItem>
                    </CommandGroup>

                    <CommandSeparator className="my-2" />

                    <CommandGroup heading="General">
                        <CommandItem onSelect={() => runCommand(() => {
                            navigator.clipboard.writeText(window.location.href)
                        })} className="rounded-lg py-3">
                            <Copy className="mr-2 h-4 w-4 text-neutral-500" />
                            <span>Copy Link</span>
                            <CommandShortcut className="font-mono text-[10px] bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded border border-neutral-200 dark:border-neutral-700">shift + C</CommandShortcut>
                        </CommandItem>
                    </CommandGroup>

                    <CommandSeparator className="my-2" />

                    <CommandGroup heading="Theme">
                        <CommandItem onSelect={() => runCommand(() => setTheme("light"))} className="rounded-lg py-3">
                            <Sun className="mr-2 h-4 w-4 text-neutral-500" />
                            <span>Light Mode</span>
                            <CommandShortcut className="font-mono text-[10px] bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded border border-neutral-200 dark:border-neutral-700">shift + T</CommandShortcut>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => setTheme("dark"))} className="rounded-lg py-3">
                            <Moon className="mr-2 h-4 w-4 text-neutral-500" />
                            <span>Dark Mode</span>
                            <CommandShortcut className="font-mono text-[10px] bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded border border-neutral-200 dark:border-neutral-700">shift + D</CommandShortcut>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => setTheme("system"))} className="rounded-lg py-3">
                            <Laptop className="mr-2 h-4 w-4 text-neutral-500" />
                            <span>System</span>
                            <CommandShortcut className="font-mono text-[10px] bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded border border-neutral-200 dark:border-neutral-700">shift + S</CommandShortcut>
                        </CommandItem>
                    </CommandGroup>
                </CommandList>

                {/* Footer */}
                <div className="flex items-center justify-between px-4 py-3 border-t border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50">
                    <div className="flex items-center gap-4 text-[10px] text-neutral-500">
                        <div className="flex items-center gap-1">
                            <ArrowUp className="w-3 h-3" />
                            <ArrowDown className="w-3 h-3" />
                            <span>to navigate</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <CornerDownLeft className="w-3 h-3" />
                            <span>to select</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-neutral-500">
                        <kbd className="font-mono">esc</kbd>
                        <span>to close</span>
                    </div>
                </div>
            </CommandDialog>
        </>
    )
}
