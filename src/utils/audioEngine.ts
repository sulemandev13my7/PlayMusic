/**
 * Audio Engine utilizing Web Audio API for interactive musical playback
 * Features synthesized harmonic progressions, basslines, percussion,
 * and an AnalyserNode for real-time visualizers.
 */

import { Track } from '../types';

class AudioEngine {
  private ctx: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private masterGain: GainNode | null = null;
  private isPlaying = false;
  private intervalId: number | null = null;
  private step = 0;
  private currentTrack: Track | null = null;
  private volume = 0.8;

  // Initialize Audio Context on user gesture
  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 64;
      this.analyser.smoothingTimeConstant = 0.8;

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.analyser);
      this.analyser.connect(this.ctx.destination);
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.05);
    }
  }

  public getAnalyser(): AnalyserNode | null {
    return this.analyser;
  }

  public getVisualizerData(): Uint8Array {
    if (!this.analyser) {
      return new Uint8Array(16).fill(0);
    }
    const bufferLength = this.analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    this.analyser.getByteFrequencyData(dataArray);
    return dataArray;
  }

  public playTrack(track: Track, startTimeOffset = 0) {
    this.initContext();
    this.currentTrack = track;
    this.isPlaying = true;

    if (this.intervalId) {
      window.clearInterval(this.intervalId);
    }

    const bpm = track.bpm || 110;
    const stepDurationMs = (60 / bpm / 4) * 1000; // 16th note step
    this.step = Math.floor((startTimeOffset * 1000) / stepDurationMs) % 32;

    this.intervalId = window.setInterval(() => {
      if (!this.isPlaying || !this.ctx) return;
      this.synthesizeStep(this.step, track);
      this.step = (this.step + 1) % 32;
    }, stepDurationMs);
  }

  private synthesizeStep(step: number, track: Track) {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    // Pitch frequencies for modern synth scales (pentatonic / minor)
    const baseFrequencies = [130.81, 146.83, 164.81, 174.61, 196.0, 220.0, 246.94, 261.63];
    const trackHash = track.title.length + track.artist.length;
    const rootIndex = trackHash % baseFrequencies.length;
    const rootFreq = baseFrequencies[rootIndex];

    // 1. Kick Drum (Steps 0, 4, 8, 12, 16, 20, 24, 28)
    if (step % 4 === 0) {
      const kickOsc = this.ctx.createOscillator();
      const kickGain = this.ctx.createGain();
      kickOsc.frequency.setValueAtTime(140, now);
      kickOsc.frequency.exponentialRampToValueAtTime(35, now + 0.09);

      kickGain.gain.setValueAtTime(0.4, now);
      kickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      kickOsc.connect(kickGain);
      kickGain.connect(this.masterGain);
      kickOsc.start(now);
      kickOsc.stop(now + 0.13);
    }

    // 2. Snare / Clack (Steps 4, 12, 20, 28)
    if (step % 8 === 4) {
      const snareOsc = this.ctx.createOscillator();
      const snareGain = this.ctx.createGain();
      snareOsc.type = 'triangle';
      snareOsc.frequency.setValueAtTime(220, now);
      snareGain.gain.setValueAtTime(0.18, now);
      snareGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      snareOsc.connect(snareGain);
      snareGain.connect(this.masterGain);
      snareOsc.start(now);
      snareOsc.stop(now + 0.09);
    }

    // 3. Hi-Hat (Every odd 16th note)
    if (step % 2 === 1) {
      const hatOsc = this.ctx.createOscillator();
      const hatGain = this.ctx.createGain();
      hatOsc.type = 'highpass' as unknown as OscillatorType;
      try {
        hatOsc.frequency.setValueAtTime(8000, now);
      } catch {
        hatOsc.frequency.setValueAtTime(3000, now);
      }
      hatGain.gain.setValueAtTime(0.05, now);
      hatGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      hatOsc.connect(hatGain);
      hatGain.connect(this.masterGain);
      hatOsc.start(now);
      hatOsc.stop(now + 0.05);
    }

    // 4. Bass Line (Sub bass on every 2 beats, shifting note)
    if (step % 4 === 0 || step % 4 === 2) {
      const bassOffsets = [0, 0, 3, 5, 0, -2, 3, 2];
      const offset = bassOffsets[Math.floor(step / 4) % bassOffsets.length];
      const bassFreq = (rootFreq / 2) * Math.pow(2, offset / 12);

      const bassOsc = this.ctx.createOscillator();
      const bassGain = this.ctx.createGain();
      bassOsc.type = 'sawtooth';
      bassOsc.frequency.setValueAtTime(bassFreq, now);

      // Low pass filter for rich round bass
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(280, now);

      bassGain.gain.setValueAtTime(0.2, now);
      bassGain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      bassOsc.connect(filter);
      filter.connect(bassGain);
      bassGain.connect(this.masterGain);

      bassOsc.start(now);
      bassOsc.stop(now + 0.24);
    }

    // 5. Synth Arpeggios & Chords (Melody notes)
    if (step % 2 === 0) {
      const arpOffsets = [0, 4, 7, 11, 12, 14, 16, 19];
      const arpNote = arpOffsets[(step + rootIndex) % arpOffsets.length];
      const melodyFreq = rootFreq * Math.pow(2, arpNote / 12);

      const synthOsc = this.ctx.createOscillator();
      const synthGain = this.ctx.createGain();
      synthOsc.type = 'sine';
      synthOsc.frequency.setValueAtTime(melodyFreq, now);

      synthGain.gain.setValueAtTime(0.12, now);
      synthGain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

      synthOsc.connect(synthGain);
      synthGain.connect(this.masterGain);
      synthOsc.start(now);
      synthOsc.stop(now + 0.18);
    }
  }

  public pause() {
    this.isPlaying = false;
    if (this.intervalId) {
      window.clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  public resume() {
    if (this.currentTrack) {
      this.isPlaying = true;
      this.playTrack(this.currentTrack);
    }
  }

  public stop() {
    this.pause();
    this.currentTrack = null;
    this.step = 0;
  }
}

export const audioEngine = new AudioEngine();
