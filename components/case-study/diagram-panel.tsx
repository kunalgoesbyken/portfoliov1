"use client";

import type { ReactNode } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import type { DiagramLink, DiagramSelection } from "@/components/case-study/diagram-graph";

interface DiagramPanelProps {
  title: string;
  selection: DiagramSelection | null;
  onSelect: (key: string) => void;
  onClose: () => void;
  keepOpenWithin: (target: EventTarget | null) => boolean;
}

function LinkList({ heading, links, icon, onSelect }: { heading: string; links: DiagramLink[]; icon: ReactNode; onSelect: (key: string) => void }) {
  if (links.length === 0) return null;
  return (
    <div className="mt-6">
      <p className="font-custom2 text-xs uppercase tracking-[0.14em] text-neutral-500">{heading}</p>
      <ul className="mt-2 divide-y divide-neutral-200 dark:divide-neutral-800 border-y border-neutral-200 dark:border-neutral-800">
        {links.map(({ node, label }) => (
          <li key={node.key}>
            <button
              type="button"
              onClick={() => onSelect(node.key)}
              className="flex w-full cursor-pointer items-center gap-3 py-2.5 text-left font-custom2 text-sm text-neutral-800 dark:text-neutral-200 transition-colors hover:text-neutral-500 dark:hover:text-neutral-400"
            >
              <span className="text-neutral-400" aria-hidden="true">{icon}</span>
              <span className="min-w-0 flex-1">{node.label}</span>
              {label && <span className="shrink-0 text-xs text-neutral-500">{label}</span>}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function DiagramPanel({ title, selection, onSelect, onClose, keepOpenWithin }: DiagramPanelProps) {
  return (
    <Dialog.Root open={!!selection} onOpenChange={(open) => !open && onClose()} modal={false}>
      <Dialog.Portal>
        <Dialog.Content
          onInteractOutside={(e) => keepOpenWithin(e.target) && e.preventDefault()}
          onOpenAutoFocus={(e) => e.preventDefault()}
          className="fixed inset-x-0 bottom-0 z-50 flex max-h-[60vh] flex-col overflow-y-auto rounded-t-xl border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-6 shadow-xl duration-200 data-[state=open]:animate-in data-[state=open]:slide-in-from-bottom data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom md:inset-y-0 md:left-auto md:right-0 md:max-h-none md:w-full md:max-w-sm md:rounded-none md:border-t-0 md:border-l md:data-[state=open]:slide-in-from-right md:data-[state=closed]:slide-out-to-right motion-reduce:animate-none"
        >
          {selection && (
            <>
              <p className="font-custom2 text-xs uppercase tracking-[0.14em] text-neutral-500">{title}</p>
              <Dialog.Title className="mt-2 pr-8 font-custom text-xl font-semibold text-neutral-900 dark:text-neutral-50">
                {selection.node.label}
              </Dialog.Title>
              <Dialog.Description className="mt-3 font-custom2 text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
                {selection.node.detail}
              </Dialog.Description>
              {selection.node.why && (
                <div className="mt-6 border-l-2 border-amber-700 dark:border-amber-400 pl-4">
                  <p className="font-custom2 text-xs uppercase tracking-[0.14em] text-amber-700 dark:text-amber-400">Why this choice</p>
                  <p className="mt-2 font-custom2 text-sm leading-relaxed text-neutral-800 dark:text-neutral-200">{selection.node.why}</p>
                </div>
              )}
              <LinkList heading="Receives from" links={selection.inputs} icon={<ArrowLeft size={14} />} onSelect={onSelect} />
              <LinkList heading="Sends to" links={selection.outputs} icon={<ArrowRight size={14} />} onSelect={onSelect} />
            </>
          )}
          <Dialog.Close
            aria-label="Close details"
            className="absolute right-5 top-5 cursor-pointer text-neutral-500 transition-colors hover:text-neutral-900 dark:hover:text-neutral-100"
          >
            <X size={18} />
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
