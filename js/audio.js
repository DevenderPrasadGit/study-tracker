/**
 * Web Audio API Ambient Sound Synthesizer & Modern Streaming Music Station
 * Generates realistic rain, vinyl crackle, cozy fire, white noise, and retro sound FX
 * + Plays custom YouTube and Spotify URLs with smart embed transformation!
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

  startRain(volume = 0.4) {
    this.init();
    if (this.ambientNodes.rain) return;

    const noiseBuffer = this.createNoiseBuffer('pink', 4);
    const noiseSource = this.ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;

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

  startFire(volume = 0.3) {
    this.init();
    if (this.ambientNodes.fire) return;

    const noiseBuffer = this.createNoiseBuffer('brown', 3);
    const noiseSource = this.ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(250, this.ctx.currentTime);
    filter.Q.setValueAtTime(2.0, this.ctx.currentTime);

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

  startLofi(volume = 0.35) {
    this.init();
    if (this.ambientNodes.lofi) return;

    const chordNotes = [261.63, 329.63, 392.00, 493.88]; // Cmaj7 chord
    const oscillators = [];

    const gainNode = this.ctx.createGain();
    gainNode.gain.setValueAtTime(volume * 0.3, this.ctx.currentTime);

    chordNotes.forEach((freq) => {
      const osc = this.ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      osc.connect(gainNode);
      osc.start();
      oscillators.push(osc);
    });

    gainNode.connect(this.masterGain);
    this.ambientNodes.lofi = { oscillators, gain: gainNode };
  }

  stopLofi() {
    if (this.ambientNodes.lofi) {
      this.ambientNodes.lofi.oscillators.forEach((osc) => {
        try {
          osc.stop();
          osc.disconnect();
        } catch (e) {}
      });
      delete this.ambientNodes.lofi;
    }
  }

  setLofiVolume(val) {
    if (this.ambientNodes.lofi) {
      this.ambientNodes.lofi.gain.gain.setValueAtTime(val * 0.3, this.ctx.currentTime);
    }
  }

  playTimerCompleteChime() {
    this.init();
    const notes = [523.25, 659.25, 783.99, 1046.50];
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

  playBellSound() {
    this.init();
    const frequencies = [587.33, 880.00, 1174.66, 1760.00]; // Harmonic Bell (D5, A5, D6, A6)
    frequencies.forEach((f, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, this.ctx.currentTime);

      const amp = 0.15 / (i + 1);
      gain.gain.setValueAtTime(amp, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 1.8);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start();
      osc.stop(this.ctx.currentTime + 1.85);
    });
  }

  playGongSound() {
    this.init();
    const freqs = [110.0, 164.81, 220.0, 293.66]; // Deep resonance (A2, E3, A3, D4)
    freqs.forEach((f, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(f, this.ctx.currentTime);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, this.ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 2.5);

      gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 2.8);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);
      osc.start();
      osc.stop(this.ctx.currentTime + 2.85);
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
}

window.soundEngine = new SoundEngine();

// ============================================================================
// Music Station Manager (YouTube & Spotify Streaming Integration)
// ============================================================================
class MusicStationManager {
  constructor() {
    this.currentSource = 'youtube'; // 'youtube' or 'spotify'
    this.currentUrl = 'https://www.youtube-nocookie.com/embed/jfKfPfyJRdk?enablejsapi=1&autoplay=1';
    this.currentTitle = 'Lofi Girl - 24/7 Relaxing Study Stream';
    this.presets = [
      {
        name: '🎧 Lofi Girl 24/7',
        tag: 'Live Study Beats',
        type: 'youtube',
        url: 'https://www.youtube.com/watch?v=jfKfPfyJRdk'
      },
      {
        name: '⚔️ Gladiator Tavern',
        tag: 'Medieval Focus',
        type: 'youtube',
        url: 'https://www.youtube.com/watch?v=5r3B7ydkgH8'
      },
      {
        name: '🪄 Sorcerer Archives',
        tag: 'Mystic Rain & Magic',
        type: 'youtube',
        url: 'https://www.youtube.com/watch?v=8Vz9aP2eJbE'
      },
      {
        name: '🌿 Zelda & Chill',
        tag: 'Cozy Nostalgia',
        type: 'spotify',
        url: 'https://open.spotify.com/playlist/37i9dQZF1DXdLEN7aqioXM'
      }
    ];
  }

  init() {
    this.bindEvents();
    this.renderPresets();
  }

  parseMediaUrl(inputUrl) {
    if (!inputUrl) return null;
    inputUrl = inputUrl.trim();

    // Spotify track / playlist / album / episode
    if (inputUrl.includes('spotify.com')) {
      const match = inputUrl.match(/open\.spotify\.com\/(track|playlist|album|artist|episode)\/([a-zA-Z0-9]+)/);
      if (match) {
        const type = match[1];
        const id = match[2];
        return {
          type: 'spotify',
          embedUrl: `https://open.spotify.com/embed/${type}/${id}?utm_source=generator&theme=0`,
          title: `Spotify ${type.charAt(0).toUpperCase() + type.slice(1)}`
        };
      }
    }

    // YouTube - Check for specific Video ID FIRST (e.g., watch?v=..., youtu.be/..., shorts/..., live/...)
    // This is crucial: Many YouTube video links include &list= (mixes/radios) which would otherwise play random songs!
    let videoId = null;
    const vParamMatch = inputUrl.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
    if (vParamMatch) {
      videoId = vParamMatch[1];
    } else {
      const shortMatch = inputUrl.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
      if (shortMatch) {
        videoId = shortMatch[1];
      } else {
        const pathMatch = inputUrl.match(/(?:youtube(?:-nocookie)?\.com\/(?:embed|shorts|live)\/)([a-zA-Z0-9_-]{11})/);
        if (pathMatch) {
          videoId = pathMatch[1];
        }
      }
    }

    if (videoId) {
      return {
        type: 'youtube',
        embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&enablejsapi=1`,
        title: 'Custom YouTube Track'
      };
    }

    // YouTube Playlist ONLY if no specific video ID was found (e.g. youtube.com/playlist?list=...)
    if (inputUrl.includes('list=')) {
      const listMatch = inputUrl.match(/[?&]list=([a-zA-Z0-9_-]+)/);
      if (listMatch) {
        return {
          type: 'youtube',
          embedUrl: `https://www.youtube-nocookie.com/embed/videoseries?list=${listMatch[1]}&autoplay=1`,
          title: 'YouTube Study Playlist'
        };
      }
    }

    return null;
  }

  loadUrl(url, customTitle = null) {
    const parsed = this.parseMediaUrl(url);
    if (!parsed) {
      alert('Please enter a valid YouTube or Spotify link.\nExamples:\n• https://www.youtube.com/watch?v=...\n• https://open.spotify.com/playlist/...');
      return;
    }

    this.currentSource = parsed.type;
    this.currentUrl = parsed.embedUrl;
    this.currentTitle = customTitle || parsed.title;

    const iframe = document.getElementById('music-stream-iframe');
    const container = document.getElementById('music-iframe-container');
    const nowPlayingEl = document.getElementById('music-now-playing-title');
    const badgeEl = document.getElementById('music-source-badge');

    if (iframe) {
      iframe.src = parsed.embedUrl;
    }
    if (container) {
      container.style.height = parsed.type === 'spotify' ? '152px' : '170px';
    }
    if (nowPlayingEl) {
      nowPlayingEl.textContent = this.currentTitle;
    }
    if (badgeEl) {
      badgeEl.textContent = parsed.type === 'spotify' ? 'SPOTIFY' : 'YOUTUBE';
      badgeEl.style.color = parsed.type === 'spotify' ? '#1db954' : '#ff4444';
    }

    // Save recent
    try {
      localStorage.setItem('timylabs_last_music_url', url);
    } catch (e) {}

    if (window.soundEngine) {
      window.soundEngine.playClickSound();
    }
  }

  renderPresets() {
    const container = document.getElementById('music-presets-list');
    if (!container) return;

    container.innerHTML = '';
    this.presets.forEach((p) => {
      const chip = document.createElement('div');
      chip.className = 'music-preset-chip';
      chip.innerHTML = `
        <div style="font-weight: 700; color: #fff; font-size: 12px;">${p.name}</div>
        <div style="font-size: 10px; color: var(--text-dim);">${p.tag}</div>
      `;
      chip.onclick = () => this.loadUrl(p.url, p.name);
      container.appendChild(chip);
    });
  }

  bindEvents() {
    const loadBtn = document.getElementById('btn-load-custom-music');
    const input = document.getElementById('input-custom-music-url');
    if (loadBtn && input) {
      loadBtn.addEventListener('click', () => {
        if (input.value) {
          this.loadUrl(input.value);
        }
      });
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          if (input.value) this.loadUrl(input.value);
        }
      });
    }
  }
}

window.musicStationManager = new MusicStationManager();
