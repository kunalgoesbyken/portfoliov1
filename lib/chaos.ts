export const CHAOS_EVENT = "portfolio:chaos";

export const triggerChaos = () => window.dispatchEvent(new Event(CHAOS_EVENT));
