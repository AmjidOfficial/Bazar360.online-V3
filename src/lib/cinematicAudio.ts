/**
 * Bazar360 Cinematic Audio Synthesizer
 * 
 * Generates pristine, zero-latency acoustic micro-interactions using native Web Audio API.
 * Inspired by luxury automotive cockpit haptics (Porsche, Rolls-Royce, Bentley).
 * Requires zero external audio files and runs completely client-side.
 */

class CinematicAudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  constructor() {
    // Check localStorage preference (default: enabled)
    try {
      const saved = localStorage.getItem('bazar360_cinematic_sound');
      this.isMuted = saved === 'disabled';
    } catch {
      this.isMuted = false;
    }
  }

  private initContext(): AudioContext | null {
    if (this.isMuted || typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public setMuted(muted: boolean): void {
    this.isMuted = muted;
    try {
      localStorage.setItem('bazar360_cinematic_sound', muted ? 'disabled' : 'enabled');
    } catch {}
  }

  public toggleMute(): boolean {
    this.setMuted(!this.isMuted);
    return this.isMuted;
  }

  /**
   * Crisp acoustic tick (subtle 18ms transient)
   * Ideal for card hovering, carousel pagination, and small filter toggles.
   */
  public playTick(): void {
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1400, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(450, ctx.currentTime + 0.018);

      gain.gain.setValueAtTime(0.045, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.018);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.02);
    } catch {}
  }

  /**
   * Warm luxury dial click (35ms dampened wooden/aluminum transient)
   * Ideal for button presses, tab switching, and modal triggers.
   */
  public playClick(): void {
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(650, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 0.035);

      gain.gain.setValueAtTime(0.07, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.035);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.04);
    } catch {}
  }

  /**
   * High-end champagne dual-tone chord
   * Ideal for verified badge clicks, bookmarking, and bargain offer submission.
   */
  public playLuxuryChime(): void {
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      [880, 1320].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.04);

        gain.gain.setValueAtTime(0.035, now + i * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.04 + 0.22);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + i * 0.04);
        osc.stop(now + i * 0.04 + 0.25);
      });
    } catch {}
  }

  /**
   * Deep harmonic cockpit pulse
   * Ideal for Hero vehicle rotation & 3D showroom stage activation.
   */
  public playStagePulse(): void {
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(120, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(75, ctx.currentTime + 0.12);

      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.14);
    } catch {}
  }
}

export const cinematicAudio = new CinematicAudioEngine();
