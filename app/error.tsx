"use client";

import { useEffect } from "react";

const RELOAD_KEY = "chunk-reload-at";
const RELOAD_WINDOW_MS = 10_000;

const isChunkLoadError = (error: Error) =>
  error.name === "ChunkLoadError" || error.message.includes("Failed to load chunk");

const reloadPage = () => window.location.reload();

const reloadOnce = () => {
  try {
    if (Date.now() - Number(sessionStorage.getItem(RELOAD_KEY)) < RELOAD_WINDOW_MS) return;
    sessionStorage.setItem(RELOAD_KEY, String(Date.now()));
  } catch {}
  reloadPage();
};

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const isStaleBuild = isChunkLoadError(error);

  useEffect(() => {
    if (isStaleBuild) reloadOnce();
  }, [isStaleBuild]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="text-2xl font-custom font-bold text-neutral-900 dark:text-neutral-50">
        Something went wrong
      </h1>
      <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400 font-custom2 max-w-md">
        {isStaleBuild
          ? "The site was just updated. Reload to get the latest version."
          : error.message || "An unexpected error occurred. Please try again."}
      </p>
      <button
        onClick={isStaleBuild ? reloadPage : reset}
        className="mt-6 rounded-lg bg-neutral-900 dark:bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-100 dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors"
      >
        {isStaleBuild ? "Reload" : "Try again"}
      </button>
    </div>
  );
}
