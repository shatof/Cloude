/**
 * Bruitages 8 bits générés à la volée (WebAudio, aucun fichier son).
 * Désactivés par défaut ; activables depuis la barre du haut ou les réglages.
 */

export type SfxName = 'click' | 'good' | 'bad' | 'unlock' | 'victory' | 'defeat' | 'page';

type Note = [frequency: number, duration: number];

const SOUNDS: Record<SfxName, { wave: OscillatorType; notes: Note[]; volume: number }> = {
  click: { wave: 'square', notes: [[660, 0.04]], volume: 0.05 },
  page: { wave: 'square', notes: [[520, 0.03], [780, 0.04]], volume: 0.04 },
  good: { wave: 'square', notes: [[660, 0.07], [990, 0.1]], volume: 0.06 },
  bad: { wave: 'sawtooth', notes: [[220, 0.12], [165, 0.16]], volume: 0.05 },
  unlock: { wave: 'triangle', notes: [[523, 0.08], [659, 0.08], [784, 0.08], [1047, 0.18]], volume: 0.09 },
  victory: { wave: 'square', notes: [[523, 0.1], [659, 0.1], [784, 0.1], [1047, 0.12], [784, 0.08], [1047, 0.25]], volume: 0.06 },
  defeat: { wave: 'triangle', notes: [[392, 0.15], [330, 0.15], [262, 0.3]], volume: 0.08 },
};

let context: AudioContext | null = null;

function audio(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  try {
    context ??= new Ctor();
    if (context.state === 'suspended') void context.resume();
    return context;
  } catch {
    return null;
  }
}

export function playSfx(name: SfxName): void {
  const ctx = audio();
  if (!ctx) return;
  const sound = SOUNDS[name];
  let t = ctx.currentTime;
  for (const [frequency, duration] of sound.notes) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = sound.wave;
    osc.frequency.setValueAtTime(frequency, t);
    gain.gain.setValueAtTime(sound.volume, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);
    osc.connect(gain).connect(ctx.destination);
    osc.start(t);
    osc.stop(t + duration);
    t += duration;
  }
}
