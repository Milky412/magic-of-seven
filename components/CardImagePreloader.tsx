"use client";

import { useEffect } from "react";
import { MAGIC_TYPES } from "@/game/cards";

const PRELOAD_MARKER = "seven-magic-card-images-preloaded-v1";
const BATCH_SIZE = 7;

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
    const image = new Image();
    if ("fetchPriority" in image) {
      image.fetchPriority = priority;
    }
    image.decoding = "async";
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
      requestIdleCallback(() => resolve(), { timeout: 700 });
      return;
    }

    setTimeout(resolve, 80);
  });
}


export default function CardImagePreloader() {
  useEffect(() => {
    let cancelled = false;
    const urls = createCardUrls();

    const run = async () => {
      // カード裏面はドラフト・伏せ札で頻繁に使うため最優先。
      await preloadImage(urls[0], "high");
      if (cancelled) return;

      // 以前この端末で読み込み済みでも、HTTPキャッシュの確認は軽いので
      // 全カードを再度 Image に通してブラウザへ利用を促す。
      const remaining = urls.slice(1);
      for (let index = 0; index < remaining.length; index += BATCH_SIZE) {
        if (cancelled) return;
        await waitForIdle();
        if (cancelled) return;

        const batch = remaining.slice(index, index + BATCH_SIZE);
        await Promise.all(batch.map((src) => preloadImage(src)));
      }

      if (!cancelled) {
        try {
          window.sessionStorage.setItem(PRELOAD_MARKER, "1");
        } catch {
          // Storageが使えない環境でも先読み自体は継続できる。
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
