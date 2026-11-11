type IdleWindow = Window & {
  requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
  cancelIdleCallback?: (id: number) => void;
};

export function whenIdle(
  callback: () => void,
  { delay = 0, timeout = 2500 } = {},
) {
  const w = window as IdleWindow;
  let idleId: number | undefined;
  const timer = setTimeout(() => {
    if (w.requestIdleCallback)
      idleId = w.requestIdleCallback(callback, { timeout });
    else callback();
  }, delay);
  return () => {
    clearTimeout(timer);
    if (idleId !== undefined) w.cancelIdleCallback?.(idleId);
  };
}
