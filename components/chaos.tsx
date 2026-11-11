"use client";

import { useEffect, useRef, useState } from "react";
import { Unplug } from "lucide-react";
import { TooltipBubble } from "@/components/ui/tooltip-bubble";
import { CHAOS_EVENT, triggerChaos } from "@/lib/chaos";
import { cn } from "@/lib/utils";

type Tone = "muted" | "danger" | "success";

interface LogLine {
  at: number;
  code: string;
  text: string;
  tone: Tone;
}

const TARGETS = "main section, [data-chaos]";
const CHAOS_PROPS = ["--chaos-o", "--chaos-r", "--chaos-y", "--chaos-d", "--chaos-rd"];

const OUTAGE_MS = 120;
const FAILOVER_MS = 900;
const RECOVER_MS = 1500;
const SWEEP_MS = 800;
const REHINGE_MS = 520;
const DISMISS_MS = 7000;

const TONE_CLASS: Record<Tone, string> = {
  muted: "text-fg-subtle",
  danger: "text-danger",
  success: "text-success",
};

const random = (min: number, max: number) => min + Math.random() * (max - min);

function unhinge(el: HTMLElement) {
  const pivotLeft = Math.random() < 0.5;
  const width = Math.max(el.getBoundingClientRect().width, 1);
  const angle = (Math.atan2(random(30, 90), width) * 180) / Math.PI;
  el.style.setProperty("--chaos-o", pivotLeft ? "top left" : "top right");
  el.style.setProperty("--chaos-r", `${(pivotLeft ? angle : -angle).toFixed(2)}deg`);
  el.style.setProperty("--chaos-y", `${Math.round(random(4, 16))}px`);
  el.style.setProperty("--chaos-d", `${Math.round(random(80, 320))}ms`);
}

function queueRehinge(el: HTMLElement) {
  const progress = Math.min(Math.max(el.getBoundingClientRect().top / window.innerHeight, 0), 1);
  el.style.setProperty("--chaos-rd", `${Math.round(progress * SWEEP_MS)}ms`);
}

function resetTarget(el: HTMLElement) {
  CHAOS_PROPS.forEach((prop) => el.style.removeProperty(prop));
}

export function ChaosButton() {
  return (
    <button
      type="button"
      onClick={triggerChaos}
      aria-label="Pull the plug on this site"
      className="group/tip icon-btn-ghost relative size-9 rounded-lg text-fg-faint hover:text-fg focus-visible:ring-2 focus-visible:ring-line-hover focus-visible:outline-none max-md:size-11"
    >
      <Unplug size={16} aria-hidden="true" />
      <TooltipBubble>Don&apos;t press this</TooltipBubble>
    </button>
  );
}

export default function ChaosController() {
  const [lines, setLines] = useState<LogLine[]>([]);
  const [incident, setIncident] = useState(0);
  const [sweeping, setSweeping] = useState(false);
  const running = useRef(false);

  useEffect(() => {
    const root = document.documentElement;
    const timers: number[] = [];
    const at = (ms: number, fn: () => void) => timers.push(window.setTimeout(fn, ms));

    const run = () => {
      if (running.current) return;
      running.current = true;

      const animate = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const targets = Array.from(document.querySelectorAll<HTMLElement>(TARGETS));
      const start = performance.now();
      const log = (code: string, text: string, tone: Tone) =>
        setLines((prev) => [...prev, { at: performance.now() - start, code, text, tone }]);

      setIncident(Math.floor(random(1000, 10000)));
      setLines([]);
      log("$", "kill -9 primary", "muted");

      if (animate) {
        targets.forEach(unhinge);
        root.dataset.chaosPhase = "down";
      }

      at(OUTAGE_MS, () => log("503", "primary is down", "danger"));
      at(FAILOVER_MS, () => log("...", "failing over to replica-2", "muted"));
      at(RECOVER_MS, () => {
        if (!animate) return;
        targets.forEach(queueRehinge);
        root.dataset.chaosPhase = "up";
        setSweeping(true);
      });
      at(RECOVER_MS + SWEEP_MS, () => log("200", "recovered, 0 requests dropped", "success"));
      at(RECOVER_MS + SWEEP_MS + REHINGE_MS, () => {
        delete root.dataset.chaosPhase;
        targets.forEach(resetTarget);
        setSweeping(false);
      });
      at(DISMISS_MS, () => {
        setLines([]);
        running.current = false;
      });
    };

    window.addEventListener(CHAOS_EVENT, run);
    return () => {
      window.removeEventListener(CHAOS_EVENT, run);
      timers.forEach(clearTimeout);
      delete root.dataset.chaosPhase;
    };
  }, []);

  const visible = lines.length > 0;

  return (
    <>
      {sweeping && (
        <div
          aria-hidden="true"
          className="chaos-sweep pointer-events-none fixed inset-x-0 top-0 z-[60] h-px bg-success shadow-[0_0_14px_2px_var(--success)]"
        />
      )}
      <div
        role="status"
        aria-live="polite"
        aria-hidden={!visible}
        className={cn(
          "fixed bottom-4 left-4 z-[60] w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-lg border border-line-strong bg-surface-raised font-mono text-xs shadow-lg transition-[opacity,translate] duration-300 motion-reduce:transition-none",
          visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0",
        )}
      >
        <div className="flex justify-between border-b border-line px-3 py-2 text-2xs text-fg-subtle">
          <span>incident.log</span>
          <span>#{incident}</span>
        </div>
        <ul className="space-y-1 p-3">
          {lines.map((line, i) => (
            <li key={i} className="chaos-line grid grid-cols-[3rem_2rem_1fr] gap-2">
              <span className="text-fg-faint tabular-nums">{(line.at / 1000).toFixed(2)}s</span>
              <span className={TONE_CLASS[line.tone]}>{line.code}</span>
              <span className="text-fg-body">{line.text}</span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
