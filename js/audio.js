/**
 * Web Audio API Ambient Sound Synthesizer & Retro Chimes
 * Generates realistic rain, vinyl crackle, cozy fire, white noise, and 8-bit retro sound FX
 * completely in code - 100% offline, zero network assets required!
 */

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.ambientNodes = {};
    this.masterGain = null;
    this.isPlaying = false;
    this.currentThemeSound = null;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.7, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Generate pink/white noise buffer for rain/wind/noise
  createNoiseBuffer(type = 'white', duration = 5) {
    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    if (type === 'white') {
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
    } else if (type === 'pink') {
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
        b6 = white * 0.115926;
      }
    } else if (type === 'brown') {
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        data[i] = (lastOut + (0.02 * white)) / 1.02;
        lastOut = data[i];
        data[i] *= 3.5;
      }
    }
    return buffer;
  }

  // Start Rain Synthesizer
  startRain(volume = 0.4) {
    this.init();
    if (this.ambientNodes.rain) return;

    const noiseBuffer = this.createNoiseBuffer('pink', 4);
    const noiseSource = this.ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;

    // Filter to make it sound like gentle rain outside the window
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, this.ctx.currentTime);

    const gainNode = this.ctx.createGain();
    gainNode.gain.setValueAtTime(volume, this.ctx.currentTime);

    noiseSource.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.masterGain);
    noiseSource.start();

    this.ambientNodes.rain = { source: noiseSource, gain: gainNode, filter: filter };
  }

  stopRain() {
    if (this.ambientNodes.rain) {
      try {
        this.ambientNodes.rain.source.stop();
        this.ambientNodes.rain.source.disconnect();
      } catch (e) {}
      delete this.ambientNodes.rain;
    }
  }

  setRainVolume(val) {
    if (this.ambientNodes.rain) {
      this.ambientNodes.rain.gain.gain.setValueAtTime(val, this.ctx.currentTime);
    }
  }

  // Start Cozy Lo-Fi Fireplace Crackle
  startFire(volume = 0.3) {
    this.init();
    if (this.ambientNodes.fire) return;

    const noiseBuffer = this.createNoiseBuffer('brown', 3);
    const noiseSource = this.ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, this.ctx.currentTime);

    const gainNode = this.ctx.createGain();
    gainNode.gain.setValueAtTime(volume, this.ctx.currentTime);

    noiseSource.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.masterGain);
    noiseSource.start();

    this.ambientNodes.fire = { source: noiseSource, gain: gainNode };
  }

  stopFire() {
    if (this.ambientNodes.fire) {
      try {
        this.ambientNodes.fire.source.stop();
        this.ambientNodes.fire.source.disconnect();
      } catch (e) {}
      delete this.ambientNodes.fire;
    }
  }

  setFireVolume(val) {
    if (this.ambientNodes.fire) {
      this.ambientNodes.fire.gain.gain.setValueAtTime(val, this.ctx.currentTime);
    }
  }

  // Start Lo-Fi Vinyl Warm Hum & Chords
  startLofi(volume = 0.35) {
    this.init();
    if (this.ambientNodes.lofi) return;

    // Dual soothing sine oscillators in pleasant fifths/minor chord (Lo-Fi chord pad)
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const oscFilter = this.ctx.createBiquadFilter();

    osc1.type = 'triangle';
    osc2.type = 'sine';

    osc1.frequency.setValueAtTime(130.81, this.ctx.currentTime); // C3
    osc2.frequency.setValueAtTime(196.00, this.ctx.currentTime); // G3

    oscFilter.type = 'lowpass';
    oscFilter.frequency.setValueAtTime(320, this.ctx.currentTime);

    const gainNode = this.ctx.createGain();
    gainNode.gain.setValueAtTime(volume * 0.4, this.ctx.currentTime);

    osc1.connect(oscFilter);
    osc2.connect(oscFilter);
    oscFilter.connect(gainNode);
    gainNode.connect(this.masterGain);

    osc1.start();
    osc2.start();

    this.ambientNodes.lofi = { osc1, osc2, gain: gainNode };
  }

  stopLofi() {
    if (this.ambientNodes.lofi) {
      try {
        this.ambientNodes.lofi.osc1.stop();
        this.ambientNodes.lofi.osc2.stop();
        this.ambientNodes.lofi.osc1.disconnect();
        this.ambientNodes.lofi.osc2.disconnect();
      } catch (e) {}
      delete this.ambientNodes.lofi;
    }
  }

  setLofiVolume(val) {
    if (this.ambientNodes.lofi) {
      this.ambientNodes.lofi.gain.gain.setValueAtTime(val * 0.4, this.ctx.currentTime);
    }
  }

  // Retro 8-bit Notification Chimes
  playTimerCompleteChime() {
    this.init();
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 arpeggio
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.12);

      gain.gain.setValueAtTime(0.12, this.ctx.currentTime + idx * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.12 + 0.35);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(this.ctx.currentTime + idx * 0.12);
      osc.stop(this.ctx.currentTime + idx * 0.12 + 0.36);
    });
  }

  playClickSound() {
    this.init();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(400, this.ctx.currentTime + 0.04);

    gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.04);
  }

  playLevelUpFanfare() {
    this.init();
    const notes = [440, 554.37, 659.25, 880, 1108.73, 1318.51];
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.09);

      gain.gain.setValueAtTime(0.15, this.ctx.currentTime + idx * 0.09);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.09 + 0.4);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(this.ctx.currentTime + idx * 0.09);
      osc.stop(this.ctx.currentTime + idx * 0.09 + 0.42);
    });
  }
}

window.soundEngine = new SoundEngine();
