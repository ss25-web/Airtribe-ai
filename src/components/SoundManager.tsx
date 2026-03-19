'use client';

import { useRef, useCallback } from 'react';

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  }
  return audioCtx;
}

function playTone(
  freq1: number,
  freq2: number,
  duration: number,
  volume: number,
  waveType: OscillatorType = 'sine'
) {
  try {
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') ctx.resume();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const now = ctx.currentTime;

    osc.type = waveType;
    osc.frequency.setValueAtTime(freq1, now);
    osc.frequency.exponentialRampToValueAtTime(freq2, now + duration);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(volume, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + duration);
  } catch { /* Web Audio blocked */ }
}

export function useSound() {
  const enabledRef = useRef(true);

  const playCorrect = useCallback(() => {
    if (!enabledRef.current) return;
    // Ascending perfect fifth - "success" sound
    playTone(440, 660, 0.15, 0.08);
    setTimeout(() => playTone(660, 880, 0.1, 0.06), 120);
  }, []);

  const playWrong = useCallback(() => {
    if (!enabledRef.current) return;
    // Descending minor second - "error" sound
    playTone(300, 220, 0.2, 0.06, 'sawtooth');
  }, []);

  const playClick = useCallback(() => {
    if (!enabledRef.current) return;
    playTone(600, 400, 0.08, 0.04, 'square');
  }, []);

  const playReveal = useCallback(() => {
    if (!enabledRef.current) return;
    // Soft chord reveal
    playTone(220, 220, 0.3, 0.04);
    setTimeout(() => playTone(330, 330, 0.3, 0.03), 50);
    setTimeout(() => playTone(440, 440, 0.3, 0.02), 100);
  }, []);

  const playComplete = useCallback(() => {
    if (!enabledRef.current) return;
    // Triumphant ascending arpeggio
    const notes = [261, 329, 392, 523];
    notes.forEach((freq, i) => {
      setTimeout(() => playTone(freq, freq * 1.02, 0.25, 0.07), i * 100);
    });
  }, []);

  const toggleSound = useCallback(() => {
    enabledRef.current = !enabledRef.current;
    return enabledRef.current;
  }, []);

  return { playCorrect, playWrong, playClick, playReveal, playComplete, toggleSound };
}

export default function SoundManager() {
  return null;
}
