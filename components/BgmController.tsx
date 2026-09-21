"use client";

import { useEffect, useRef, useState } from "react";

export type GameSfxName = "click" | "card" | "magic" | "mystery" | "reveal" | "success";

export function playGameSfx(name: GameSfxName) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("seven-magic-sfx", { detail: name }));
}

const STORAGE_BGM_ENABLED = "seven-magic-bgm-enabled";
const STORAGE_BGM_VOLUME = "seven-magic-bgm-volume";
const STORAGE_SE_ENABLED = "seven-magic-se-enabled";
const STORAGE_SE_VOLUME = "seven-magic-se-volume";

function tone(
  ctx: AudioContext,
  destination: AudioNode,
  frequency: number,
  when: number,
  duration: number,
  gainValue: number,
  type: OscillatorType = "sine",
  attack = 0.012,
) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(frequency, when);
  gain.gain.setValueAtTime(0.0001, when);
  gain.gain.exponentialRampToValueAtTime(Math.max(gainValue, 0.0002), when + attack);
  gain.gain.exponentialRampToValueAtTime(0.0001, when + duration);
  osc.connect(gain);
  gain.connect(destination);
  osc.start(when);
  osc.stop(when + duration + 0.04);
}

function noise(
  ctx: AudioContext,
  destination: AudioNode,
  when: number,
  duration: number,
  gainValue: number,
  highpass = 1200,
) {
  const length = Math.max(1, Math.floor(ctx.sampleRate * duration));
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i += 1) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / length);
  }
  const source = ctx.createBufferSource();
  const filter = ctx.createBiquadFilter();
  const gain = ctx.createGain();
  filter.type = "highpass";
  filter.frequency.value = highpass;
  gain.gain.setValueAtTime(gainValue, when);
  gain.gain.exponentialRampToValueAtTime(0.0001, when + duration);
  source.buffer = buffer;
  source.connect(filter);
  filter.connect(gain);
  gain.connect(destination);
  source.start(when);
}

export default function BgmController() {
  const [bgmEnabled, setBgmEnabled] = useState(true);
  const [seEnabled, setSeEnabled] = useState(true);
  const [bgmVolume, setBgmVolume] = useState(0.2);
  const [seVolume, setSeVolume] = useState(0.42);
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);

  const ctxRef = useRef<AudioContext | null>(null);
  const seGainRef = useRef<GainNode | null>(null);
  const bgmAudioRef = useRef<HTMLAudioElement | null>(null);
  const cardSeAudioRef = useRef<HTMLAudioElement | null>(null);

  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

  useEffect(() => {
    const savedBgm = window.localStorage.getItem(STORAGE_BGM_ENABLED);
    const savedBgmVolume = window.localStorage.getItem(STORAGE_BGM_VOLUME);
    const savedSe = window.localStorage.getItem(STORAGE_SE_ENABLED);
    const savedSeVolume = window.localStorage.getItem(STORAGE_SE_VOLUME);

    if (savedBgm !== null) setBgmEnabled(savedBgm === "true");
    if (savedSe !== null) setSeEnabled(savedSe === "true");
    if (savedBgmVolume !== null) {
      const parsed = Number(savedBgmVolume);
      if (Number.isFinite(parsed)) setBgmVolume(Math.min(0.5, Math.max(0, parsed)));
    }
    if (savedSeVolume !== null) {
      const parsed = Number(savedSeVolume);
      if (Number.isFinite(parsed)) setSeVolume(Math.min(0.8, Math.max(0, parsed)));
    }

    const bgm = new Audio(`${basePath}/audio/bgm/BGM.mp3`);
    bgm.loop = true;
    bgm.preload = "auto";
    bgmAudioRef.current = bgm;

    const cardSe = new Audio(`${basePath}/audio/se/Card_SE.mp3`);
    cardSe.preload = "auto";
    cardSeAudioRef.current = cardSe;

    setReady(true);

    return () => {
      bgm.pause();
      bgm.src = "";
      cardSe.pause();
      cardSe.src = "";
      bgmAudioRef.current = null;
      cardSeAudioRef.current = null;
    };
  }, [basePath]);

  const ensureAudioContext = async () => {
    let ctx = ctxRef.current;
    let seGain = seGainRef.current;

    if (!ctx) {
      const AudioContextCtor =
        window.AudioContext ||
        (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextCtor) return null;

      ctx = new AudioContextCtor();
      const compressor = ctx.createDynamicsCompressor();
      compressor.threshold.value = -18;
      compressor.knee.value = 18;
      compressor.ratio.value = 5;
      compressor.attack.value = 0.004;
      compressor.release.value = 0.2;
      compressor.connect(ctx.destination);

      seGain = ctx.createGain();
      seGain.gain.value = seEnabled ? seVolume : 0;
      seGain.connect(compressor);

      ctxRef.current = ctx;
      seGainRef.current = seGain;
    }

    if (ctx.state === "suspended") await ctx.resume();
    if (seGain) seGain.gain.setTargetAtTime(seEnabled ? seVolume : 0, ctx.currentTime, 0.035);
    return ctx;
  };

  const startBgm = async () => {
    const bgm = bgmAudioRef.current;
    if (!bgm || !bgmEnabled) return;
    bgm.volume = Math.min(1, bgmVolume * 2);
    try {
      await bgm.play();
    } catch {
      // モバイルの自動再生制限時は、次のユーザー操作で再試行する。
    }
  };

  const playCardSe = () => {
    if (!seEnabled) return;
    const template = cardSeAudioRef.current;
    if (!template) return;

    const player = template.cloneNode(true) as HTMLAudioElement;
    player.volume = Math.min(1, Math.max(0, seVolume * 1.35));
    player.currentTime = 0;
    void player.play().catch(() => undefined);
  };

  const playSfx = async (name: GameSfxName) => {
    if (!seEnabled) return;

    // アップロードされたカードSEをカード操作に使う。
    if (name === "card") {
      playCardSe();
      return;
    }

    const ctx = await ensureAudioContext();
    const out = seGainRef.current;
    if (!ctx || !out) return;
    const now = ctx.currentTime + 0.008;

    if (name === "click") {
      tone(ctx, out, 760, now, 0.075, 0.055, "sine", 0.005);
      tone(ctx, out, 1160, now + 0.012, 0.055, 0.025, "sine", 0.004);
    } else if (name === "magic") {
      [523.25, 659.25, 783.99, 1046.5].forEach((f, i) =>
        tone(ctx, out, f, now + i * 0.055, 0.5 - i * 0.035, 0.038 - i * 0.004, "sine", 0.012),
      );
      noise(ctx, out, now, 0.28, 0.015, 2600);
    } else if (name === "mystery") {
      tone(ctx, out, 246.94, now, 0.65, 0.04, "triangle", 0.03);
      tone(ctx, out, 185.0, now + 0.08, 0.72, 0.027, "sine", 0.04);
      tone(ctx, out, 739.99, now + 0.16, 0.24, 0.018, "sine", 0.01);
    } else if (name === "reveal") {
      noise(ctx, out, now, 0.11, 0.025, 2100);
      tone(ctx, out, 659.25, now, 0.38, 0.033, "sine", 0.009);
      tone(ctx, out, 987.77, now + 0.055, 0.36, 0.025, "sine", 0.009);
    } else if (name === "success") {
      [523.25, 659.25, 783.99, 1046.5, 1318.51].forEach((f, i) =>
        tone(ctx, out, f, now + i * 0.08, 0.62, 0.038, i < 2 ? "triangle" : "sine", 0.012),
      );
    }
  };

  useEffect(() => {
    if (!ready) return;

    const firstGesture = () => {
      void startBgm();
      void ensureAudioContext();
    };
    const delegatedPointer = (event: PointerEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;
      const sfxTarget = target.closest<HTMLElement>("[data-sfx]");
      if (sfxTarget?.dataset.sfx === "card") void playSfx("card");
      else if (target.closest("button")) void playSfx("click");
      void startBgm();
    };
    const customSfx = (event: Event) => {
      const name = (event as CustomEvent<GameSfxName>).detail;
      if (name) void playSfx(name);
    };

    window.addEventListener("pointerdown", firstGesture, { once: true });
    document.addEventListener("pointerdown", delegatedPointer, true);
    window.addEventListener("seven-magic-sfx", customSfx as EventListener);
    return () => {
      window.removeEventListener("pointerdown", firstGesture);
      document.removeEventListener("pointerdown", delegatedPointer, true);
      window.removeEventListener("seven-magic-sfx", customSfx as EventListener);
    };
  }, [ready, seEnabled, bgmEnabled, bgmVolume, seVolume]);

  useEffect(() => {
    if (!ready) return;
    window.localStorage.setItem(STORAGE_BGM_ENABLED, String(bgmEnabled));
    window.localStorage.setItem(STORAGE_BGM_VOLUME, String(bgmVolume));

    const bgm = bgmAudioRef.current;
    if (!bgm) return;
    bgm.volume = Math.min(1, bgmVolume * 2);
    if (!bgmEnabled) {
      bgm.pause();
    } else {
      void startBgm();
    }
  }, [ready, bgmEnabled, bgmVolume]);

  useEffect(() => {
    if (!ready) return;
    window.localStorage.setItem(STORAGE_SE_ENABLED, String(seEnabled));
    window.localStorage.setItem(STORAGE_SE_VOLUME, String(seVolume));
    const ctx = ctxRef.current;
    const gain = seGainRef.current;
    if (ctx && gain) gain.gain.setTargetAtTime(seEnabled ? seVolume : 0, ctx.currentTime, 0.035);
  }, [ready, seEnabled, seVolume]);

  useEffect(() => () => {
    void ctxRef.current?.close();
  }, []);

  if (!ready) return null;

  return (
    <div style={{ position: "fixed", right: 14, bottom: 14, zIndex: 9999, fontFamily: "inherit" }}>
      {open && (
        <div
          style={{
            width: 255,
            marginBottom: 8,
            padding: "14px 15px",
            borderRadius: 12,
            border: "1px solid rgba(215,181,109,.45)",
            background: "rgba(8,9,12,.95)",
            boxShadow: "0 12px 36px rgba(0,0,0,.48)",
            color: "#F3E5BF",
            backdropFilter: "blur(10px)",
          }}
        >
          <div style={{ fontSize: 11, letterSpacing: ".18em", color: "#B89758", marginBottom: 11 }}>
            SOUND SETTINGS
          </div>

          <SoundRow label="BGM" enabled={bgmEnabled} onToggle={() => setBgmEnabled((v) => !v)} />
          <input
            aria-label="BGM音量"
            type="range"
            min="0"
            max="0.5"
            step="0.01"
            value={bgmVolume}
            onChange={(e) => setBgmVolume(Number(e.target.value))}
            style={{ width: "100%", margin: "6px 0 12px" }}
          />

          <SoundRow label="SE" enabled={seEnabled} onToggle={() => setSeEnabled((v) => !v)} />
          <input
            aria-label="SE音量"
            type="range"
            min="0"
            max="0.8"
            step="0.01"
            value={seVolume}
            onChange={(e) => setSeVolume(Number(e.target.value))}
            style={{ width: "100%", margin: "6px 0 4px" }}
          />
          <div style={{ marginTop: 8, fontSize: 10, color: "#968A77", lineHeight: 1.55 }}>
            BGM.mp3をループ再生し、カード操作にはCard_SE.mp3を使用します。魔法・開示などのSEは既存の演出音を残しています。
          </div>
        </div>
      )}

      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label="サウンド設定"
          style={roundButtonStyle}
        >
          ♪
        </button>
        <button
          type="button"
          onClick={() => setBgmEnabled((v) => !v)}
          aria-label={bgmEnabled ? "BGMをオフ" : "BGMをオン"}
          style={{
            ...roundButtonStyle,
            minWidth: 66,
            width: "auto",
            padding: "0 12px",
            background: bgmEnabled ? "linear-gradient(180deg, #392A16, #171008)" : "rgba(11,12,16,.9)",
            color: bgmEnabled ? "#F3E3B9" : "#8F8370",
            fontSize: 11,
            fontWeight: 700,
          }}
        >
          BGM {bgmEnabled ? "ON" : "OFF"}
        </button>
      </div>
    </div>
  );
}

function SoundRow({
  label,
  enabled,
  onToggle,
}: {
  label: string;
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
      <span style={{ fontSize: 12, color: "#E8D7B2" }}>{label}</span>
      <button
        type="button"
        onClick={onToggle}
        style={{
          border: "1px solid rgba(215,181,109,.38)",
          background: enabled ? "rgba(215,181,109,.14)" : "rgba(255,255,255,.035)",
          color: enabled ? "#F3D48A" : "#8F8370",
          borderRadius: 999,
          padding: "4px 9px",
          fontSize: 10,
          cursor: "pointer",
        }}
      >
        {enabled ? "ON" : "OFF"}
      </button>
    </div>
  );
}

const roundButtonStyle: React.CSSProperties = {
  width: 42,
  height: 42,
  borderRadius: 999,
  border: "1px solid rgba(215,181,109,.52)",
  background: "rgba(11,12,16,.92)",
  color: "#D7B56D",
  fontSize: 18,
  cursor: "pointer",
  boxShadow: "0 8px 22px rgba(0,0,0,.35)",
};
