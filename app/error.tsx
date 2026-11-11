"use client";

import { useEffect } from "react";
import { StatusScreen } from "@/components/ui/status-screen";

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
    <StatusScreen
      title={<span className="text-2xl">Something went wrong</span>}
      message={
        isStaleBuild
          ? "The site was just updated. Reload to get the latest version."
          : error.message || "An unexpected error occurred. Please try again."
      }
      action={
        <button type="button" onClick={isStaleBuild ? reloadPage : reset} className="btn-solid px-4 py-2">
          {isStaleBuild ? "Reload" : "Try again"}
        </button>
      }
    />
  );
}
