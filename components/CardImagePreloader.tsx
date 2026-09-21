"use client";

import { useEffect } from "react";
import { MAGIC_TYPES } from "@/game/cards";

const PRELOAD_MARKER = "seven-magic-card-images-preloaded-v2";
const IMMEDIATE_BATCH_SIZE = 14;
const DEFERRED_BATCH_SIZE = 8;

function getBasePath() {
  return process.env.NEXT_PUBLIC_BASE_PATH ?? "";
}

function createCardUrls() {
  const basePath = getBasePath();
  return [
    `${basePath}/cards/card-back.png`,
    ...MAGIC_TYPES.flatMap((magic) =>
      Array.from({ length: 7 }, (_, index) =>
        `${basePath}/cards/${magic}/${index + 1}.png`
      )
    ),
  ];
}

function preloadImage(src: string, priority: "high" | "low" = "low") {
  return new Promise<void>((resolve) => {
    const image = new window.Image();
    if ("fetchPriority" in image) {
      image.fetchPriority = priority;
    }
    image.decoding = priority === "high" ? "sync" : "async";
    image.onload = () => resolve();
    image.onerror = () => resolve();
    image.src = src;
  });
}

function waitForIdle() {
  return new Promise<void>((resolve) => {
    const requestIdleCallback = (window as unknown as {
      requestIdleCallback?: (
        callback: () => void,
        options?: { timeout: number }
      ) => number;
    }).requestIdleCallback;

    if (typeof requestIdleCallback === "function") {
      requestIdleCallback(() => resolve(), { timeout: 220 });
      return;
    }

    window.setTimeout(resolve, 24);
  });
}

export default function CardImagePreloader() {
  useEffect(() => {
    let cancelled = false;
    const urls = createCardUrls();

    const run = async () => {
      const firstWave = urls.slice(0, IMMEDIATE_BATCH_SIZE);
      await Promise.all(firstWave.map((src, index) => preloadImage(src, index < 6 ? "high" : "low")));
      if (cancelled) return;

      const remaining = urls.slice(IMMEDIATE_BATCH_SIZE);
      for (let index = 0; index < remaining.length; index += DEFERRED_BATCH_SIZE) {
        if (cancelled) return;
        await waitForIdle();
        if (cancelled) return;

        const batch = remaining.slice(index, index + DEFERRED_BATCH_SIZE);
        await Promise.all(batch.map((src) => preloadImage(src)));
      }

      if (!cancelled) {
        try {
          window.sessionStorage.setItem(PRELOAD_MARKER, "1");
        } catch {
          // ignore
        }
      }
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}
