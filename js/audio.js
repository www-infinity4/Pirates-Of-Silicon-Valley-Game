/* ==========================================================
   PIRATES OF SILICON VALLEY — AUDIO
   Web Audio API chiptune / NES-style sounds
   ========================================================== */

'use strict';

const Audio = (() => {
  let ctx = null;
  let enabled = true;

  function init() {
    try {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
      enabled = false;
    }
  }

  function resume() {
    if (ctx && ctx.state === 'suspended') ctx.resume();
  }

  /* Play a simple tone */
  function tone(freq, duration, type, volume, delay) {
    if (!enabled || !ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = type || 'square';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + (delay || 0));
      gain.gain.setValueAtTime((volume || 0.2), ctx.currentTime + (delay || 0));
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + (delay || 0) + duration);
      osc.start(ctx.currentTime + (delay || 0));
      osc.stop(ctx.currentTime + (delay || 0) + duration + 0.01);
    } catch (e) { /* ignore */ }
  }

  /* Play a chord / arpeggio */
  function arpeggio(freqs, noteDur, type, vol) {
    freqs.forEach((f, i) => tone(f, noteDur, type, vol, i * noteDur * 0.95));
  }

  /* ---- Sound Effects ---- */

  function playMenuBlip() {
    tone(440, 0.06, 'square', 0.15);
  }

  function playCorrect() {
    // Happy ascending chord
    arpeggio([523, 659, 784, 1047], 0.1, 'square', 0.18);
  }

  function playWrong() {
    // Descending sad tones
    arpeggio([200, 160, 120], 0.12, 'sawtooth', 0.18);
  }

  function playLevelStart() {
    // Fanfare
    const notes = [392, 392, 523, 392, 523, 659, 784];
    notes.forEach((f, i) => tone(f, 0.12, 'square', 0.2, i * 0.14));
  }

  function playLevelComplete() {
    // Victory fanfare
    const notes = [523, 659, 784, 1047, 784, 1047, 1319];
    notes.forEach((f, i) => tone(f, 0.15, 'square', 0.2, i * 0.16));
  }

  function playGameOver() {
    // Descending death march
    const notes = [392, 330, 294, 247, 220, 196, 175, 147];
    notes.forEach((f, i) => tone(f, 0.18, 'sawtooth', 0.22, i * 0.2));
  }

  function playVictory() {
    // Full victory theme
    const notes = [523, 659, 784, 1047, 1175, 1047, 784, 659,
                   523, 659, 784, 1047, 1175, 1319, 1568];
    notes.forEach((f, i) => tone(f, 0.14, 'square', 0.2, i * 0.15));
  }

  function playFireAlert() {
    // Urgent beeping
    for (let i = 0; i < 4; i++) tone(880, 0.08, 'square', 0.2, i * 0.18);
  }

  function playCooled() {
    // Satisfying click + tone
    tone(1200, 0.05, 'square', 0.15);
    tone(1500, 0.05, 'square', 0.12, 0.06);
  }

  function playExplosion() {
    // Noise burst
    if (!enabled || !ctx) return;
    try {
      const buf = ctx.createBuffer(1, ctx.sampleRate * 0.3, ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
      const src = ctx.createBufferSource();
      src.buffer = buf;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      src.connect(gain);
      gain.connect(ctx.destination);
      src.start();
    } catch (e) { /* ignore */ }
  }

  function playClick() {
    // Debug click
    tone(1000, 0.03, 'square', 0.1);
    tone(800, 0.03, 'square', 0.1, 0.04);
  }

  function playBugFound() {
    // Code bug found sound
    arpeggio([440, 550, 660, 880], 0.08, 'triangle', 0.18);
  }

  function playCountdown() {
    tone(880, 0.1, 'square', 0.2);
  }

  function playPowerUp() {
    const notes = [262, 330, 392, 523, 659, 784, 1047];
    notes.forEach((f, i) => tone(f, 0.08, 'triangle', 0.15, i * 0.08));
  }

  return {
    init, resume,
    playMenuBlip, playCorrect, playWrong,
    playLevelStart, playLevelComplete, playGameOver, playVictory,
    playFireAlert, playCooled, playExplosion, playClick,
    playBugFound, playCountdown, playPowerUp
  };
})();
