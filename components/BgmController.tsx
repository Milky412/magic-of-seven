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

const CHORDS = [
  [220.0, 261.63, 329.63, 392.0],
  [196.0, 246.94, 293.66, 369.99],
  [174.61, 220.0, 261.63, 329.63],
  [196.0, 246.94, 329.63, 392.0],
];

const MELODY = [
  659.25, 0, 523.25, 587.33,
  0, 493.88, 523.25, 0,
  659.25, 0, 783.99, 698.46,
  0, 587.33, 523.25, 0,
];

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
  const [bgmVolume, setBgmVolume] = useState(0.18);
  const [seVolume, setSeVolume] = useState(0.3);
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);

  const ctxRef = useRef<AudioContext | null>(null);
  const bgmGainRef = useRef<GainNode | null>(null);
  const seGainRef = useRef<GainNode | null>(null);
  const timerRef = useRef<number | null>(null);
  const stepRef = useRef(0);

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
      if (Number.isFinite(parsed)) setSeVolume(Math.min(0.65, Math.max(0, parsed)));
    }
    setReady(true);
  }, []);

  const stopScheduler = () => {
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const scheduleStep = (ctx: AudioContext, master: GainNode) => {
    const step = stepRef.current++;
    const now = ctx.currentTime + 0.025;
    const chord = CHORDS[Math.floor(step / 8) % CHORDS.length];

    if (step % 8 === 0) {
      chord.forEach((freq, i) => {
        tone(ctx, master, freq / 2, now, 4.1, 0.023 - i * 0.0025, "sine", 0.12);
      });
      tone(ctx, master, chord[0] / 4, now, 2.5, 0.03, "triangle", 0.08);
    }

    const melodyFreq = MELODY[step % MELODY.length];
    if (melodyFreq) {
      tone(ctx, master, melodyFreq, now, 0.82, 0.022, "sine", 0.03);
      tone(ctx, master, melodyFreq * 2, now + 0.015, 0.38, 0.004, "sine", 0.02);
    }

    if (step % 2 === 0) {
      const arp = chord[Math.floor(step / 2) % chord.length] * 2;
      tone(ctx, master, arp, now + 0.06, 0.46, 0.009, "triangle", 0.02);
    }
  };

  const ensureAudio = async () => {
    let ctx = ctxRef.current;
    let bgmGain = bgmGainRef.current;
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

      bgmGain = ctx.createGain();
      seGain = ctx.createGain();
      bgmGain.gain.value = bgmEnabled ? bgmVolume : 0;
      seGain.gain.value = seEnabled ? seVolume : 0;
      bgmGain.connect(compressor);
      seGain.connect(compressor);

      ctxRef.current = ctx;
      bgmGainRef.current = bgmGain;
      seGainRef.current = seGain;
    }

    if (ctx.state === "suspended") await ctx.resume();

    if (bgmGain) bgmGain.gain.setTargetAtTime(bgmEnabled ? bgmVolume : 0, ctx.currentTime, 0.06);
    if (seGain) seGain.gain.setTargetAtTime(seEnabled ? seVolume : 0, ctx.currentTime, 0.035);

    if (bgmEnabled && timerRef.current === null && bgmGain) {
      scheduleStep(ctx, bgmGain);
      timerRef.current = window.setInterval(() => {
        const currentCtx = ctxRef.current;
        const currentGain = bgmGainRef.current;
        if (currentCtx && currentGain && currentCtx.state === "running") {
          scheduleStep(currentCtx, currentGain);
        }
      }, 600);
    }

    return ctx;
  };

  const playSfx = async (name: GameSfxName) => {
    if (!seEnabled) return;
    const ctx = await ensureAudio();
    const out = seGainRef.current;
    if (!ctx || !out) return;
    const now = ctx.currentTime + 0.008;

    if (name === "click") {
      tone(ctx, out, 760, now, 0.075, 0.055, "sine", 0.005);
      tone(ctx, out, 1160, now + 0.012, 0.055, 0.025, "sine", 0.004);
    } else if (name === "card") {
      noise(ctx, out, now, 0.13, 0.04, 1500);
      tone(ctx, out, 390, now, 0.14, 0.032, "triangle", 0.006);
      tone(ctx, out, 520, now + 0.045, 0.12, 0.022, "sine", 0.006);
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

    const firstGesture = () => void ensureAudio();
    const delegatedPointer = (event: PointerEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;
      const sfxTarget = target.closest<HTMLElement>("[data-sfx]");
      if (sfxTarget?.dataset.sfx === "card") void playSfx("card");
      else if (target.closest("button")) void playSfx("click");
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
    window.localStorage.setItem(STORAGE_BGM_ENABLED, String(bgmEnabled));
    window.localStorage.setItem(STORAGE_BGM_VOLUME, String(bgmVolume));
    const ctx = ctxRef.current;
    const gain = bgmGainRef.current;
    if (ctx && gain) gain.gain.setTargetAtTime(bgmEnabled ? bgmVolume : 0, ctx.currentTime, 0.06);
    if (!bgmEnabled) stopScheduler();
    else if (ctx?.state === "running") void ensureAudio();
  }, [bgmEnabled, bgmVolume]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_SE_ENABLED, String(seEnabled));
    window.localStorage.setItem(STORAGE_SE_VOLUME, String(seVolume));
    const ctx = ctxRef.current;
    const gain = seGainRef.current;
    if (ctx && gain) gain.gain.setTargetAtTime(seEnabled ? seVolume : 0, ctx.currentTime, 0.035);
  }, [seEnabled, seVolume]);

  useEffect(() => () => {
    stopScheduler();
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
            max="0.65"
            step="0.01"
            value={seVolume}
            onChange={(e) => setSeVolume(Number(e.target.value))}
            style={{ width: "100%", margin: "6px 0 4px" }}
          />
          <div style={{ marginTop: 8, fontSize: 10, color: "#968A77", lineHeight: 1.55 }}>
            幻想的なBGMとカード・魔法・開示音。設定はこの端末に保存されます。
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
