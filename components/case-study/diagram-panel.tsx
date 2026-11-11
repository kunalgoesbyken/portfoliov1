"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { DiagramNodeDetail } from "@/components/case-study/diagram-detail";
import type { DiagramSelection } from "@/components/case-study/diagram-graph";

interface DiagramPanelProps {
  title: string;
  selection: DiagramSelection | null;
  onSelect: (key: string) => void;
  onClose: () => void;
  keepOpenWithin: (target: EventTarget | null) => boolean;
}

export function DiagramPanel({ title, selection, onSelect, onClose, keepOpenWithin }: DiagramPanelProps) {
  return (
    <Dialog.Root open={!!selection} onOpenChange={(open) => !open && onClose()} modal={false}>
      <Dialog.Portal>
        <Dialog.Content
          onInteractOutside={(e) => keepOpenWithin(e.target) && e.preventDefault()}
          onOpenAutoFocus={(e) => e.preventDefault()}
          className="fixed inset-x-0 bottom-0 z-50 flex max-h-[60vh] flex-col overflow-y-auto rounded-t-xl border-t border-line bg-surface-raised p-6 shadow-xl duration-200 data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom data-[state=open]:animate-in data-[state=open]:slide-in-from-bottom motion-reduce:animate-none md:inset-y-0 md:right-0 md:left-auto md:max-h-none md:w-full md:max-w-sm md:rounded-none md:border-t-0 md:border-l md:data-[state=closed]:slide-out-to-right md:data-[state=open]:slide-in-from-right"
        >
          {selection && (
            <>
              <p className="eyebrow">{title}</p>
              <Dialog.Title className="mt-2 mb-3 pr-8 font-custom text-xl font-semibold text-fg">{selection.node.label}</Dialog.Title>
              <DiagramNodeDetail node={selection.node} selection={selection} onSelect={onSelect} detailAs={Dialog.Description} />
            </>
          )}
          <Dialog.Close aria-label="Close details" className="absolute top-5 right-5 cursor-pointer text-fg-subtle transition-colors hover:text-fg">
            <X size={18} />
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
