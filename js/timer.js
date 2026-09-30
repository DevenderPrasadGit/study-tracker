/**
 * Focus Timer Engine (Pomodoro, Stopwatch, Breaks, Custom Timer)
 * Tracks active focus sessions, handles custom durations, preferences and UI sync
 */

class FocusTimer {
  constructor() {
    this.mode = 'pomodoro'; // 'pomodoro', 'shortBreak', 'longBreak', 'deepFocus', 'stopwatch', 'custom'
    this.status = 'paused'; // 'running', 'paused', 'idle'
    this.preferences = this.loadPreferences();
    this.customMinutes = 35;
    this.totalSeconds = this.preferences.pomodoroMinutes * 60;
    this.remainingSeconds = this.totalSeconds;
    this.elapsedSecondsInSession = 0;
    this.currentSubject = 'Timylabs Development';
    this.timerInterval = null;
    this.callbacks = [];
  }

  loadPreferences() {
    try {
      const saved = localStorage.getItem('timylabs_timer_preferences');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Could not load timer preferences', e);
    }
    return {
      pomodoroMinutes: 25,
      shortBreakMinutes: 5,
      longBreakMinutes: 15,
      deepFocusMinutes: 50,
      autoStartBreaks: false,
      soundChime: 'chime'
    };
  }

  savePreferences(prefs) {
    this.preferences = { ...this.preferences, ...prefs };
    try {
      localStorage.setItem('timylabs_timer_preferences', JSON.stringify(this.preferences));
    } catch (e) {}
    this.updatePreferencesUI();
  }

  init() {
    this.bindEvents();
    this.updatePreferencesUI();
    this.updateDisplay();
  }

  setMode(mode, customMins = null) {
    this.pause();
    this.mode = mode;
    this.elapsedSecondsInSession = 0;

    if (customMins !== null) {
      this.customMinutes = Math.max(1, parseInt(customMins, 10) || 25);
    }

    switch (mode) {
      case 'pomodoro':
        this.totalSeconds = (this.preferences.pomodoroMinutes || 25) * 60;
        break;
      case 'shortBreak':
        this.totalSeconds = (this.preferences.shortBreakMinutes || 5) * 60;
        break;
      case 'longBreak':
        this.totalSeconds = (this.preferences.longBreakMinutes || 15) * 60;
        break;
      case 'deepFocus':
        this.totalSeconds = (this.preferences.deepFocusMinutes || 50) * 60;
        break;
      case 'stopwatch':
        this.totalSeconds = 0;
        this.remainingSeconds = 0;
        this.updateDisplay();
        this.syncModePills();
        return;
      case 'custom':
        this.totalSeconds = this.customMinutes * 60;
        break;
      default:
        this.totalSeconds = 25 * 60;
    }

    this.remainingSeconds = this.totalSeconds;
    this.updateDisplay();
    this.syncModePills();
  }

  syncModePills() {
    document.querySelectorAll('[data-timer-mode]').forEach((tab) => {
      if (tab.getAttribute('data-timer-mode') === this.mode) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });

    const customInputBox = document.getElementById('custom-timer-input-group');
    if (customInputBox) {
      customInputBox.style.display = this.mode === 'custom' ? 'flex' : 'none';
    }
  }

  setSubject(subjectName) {
    this.currentSubject = subjectName;
    const subjSelect = document.getElementById('timer-active-subject');
    if (subjSelect) {
      subjSelect.value = subjectName;
    }
    const zenSubj = document.getElementById('zen-active-subject');
    if (zenSubj) {
      zenSubj.textContent = subjectName;
    }
  }

  toggle() {
    if (this.status === 'running') {
      this.pause();
    } else {
      this.start();
    }
  }

  start() {
    if (this.status === 'running') return;
    this.status = 'running';

    if (window.soundEngine) {
      window.soundEngine.playClickSound();
    }

    this.timerInterval = setInterval(() => {
      this.tick();
    }, 1000);

    this.updatePlayPauseButton();
  }

  pause() {
    if (this.status !== 'running') return;
    this.status = 'paused';
    clearInterval(this.timerInterval);
    this.timerInterval = null;
    this.updatePlayPauseButton();
  }

  reset() {
    this.pause();
    if (this.elapsedSecondsInSession >= 30) {
      this.recordSession(this.elapsedSecondsInSession);
    }
    this.elapsedSecondsInSession = 0;
    if (this.mode === 'stopwatch') {
      this.remainingSeconds = 0;
    } else {
      this.remainingSeconds = this.totalSeconds;
    }
    this.updateDisplay();
  }

  tick() {
    this.elapsedSecondsInSession++;

    if (this.mode === 'stopwatch') {
      this.remainingSeconds++;
    } else {
      this.remainingSeconds--;
      if (this.remainingSeconds <= 0) {
        this.completeSession();
        return;
      }
    }

    this.updateDisplay();

    // Increment live today's focus stat every minute
    if (this.elapsedSecondsInSession % 60 === 0) {
      if (window.appStore) {
        window.appStore.addFocusSeconds(60, this.currentSubject);
      }
    }
  }

  completeSession() {
    this.pause();
    this.remainingSeconds = 0;
    this.updateDisplay();

    if (window.soundEngine) {
      if (this.preferences.soundChime === 'gong' && window.soundEngine.playGongSound) {
        window.soundEngine.playGongSound();
      } else if (this.preferences.soundChime === 'bell' && window.soundEngine.playBellSound) {
        window.soundEngine.playBellSound();
      } else {
        window.soundEngine.playTimerCompleteChime();
      }
    }

    const completedSeconds = this.totalSeconds;
    this.recordSession(completedSeconds);
    this.elapsedSecondsInSession = 0;

    const mins = Math.max(1, Math.round(completedSeconds / 60));
    if (window.showNotificationModal) {
      window.showNotificationModal(
        'Session Completed! 🎉',
        `Spectacular focus! You conquered a ${mins}-minute session on "${this.currentSubject}". Time to recharge!`
      );
    }

    if (this.mode === 'pomodoro' || this.mode === 'deepFocus') {
      this.setMode('shortBreak');
      if (this.preferences.autoStartBreaks) {
        this.start();
      }
    } else {
      this.setMode('pomodoro');
    }
  }

  recordSession(seconds) {
    if (seconds < 10) return;
    if (window.appStore) {
      window.appStore.logStudySession({
        id: 'sess_' + Date.now(),
        subject: this.currentSubject,
        durationSeconds: seconds,
        date: new Date().toISOString(),
        notes: `Focus block - ${this.mode}`
      });
    }
  }

  updateDisplay() {
    const sec = this.remainingSeconds;
    const hrs = Math.floor(sec / 3600);
    const mins = Math.floor((sec % 3600) / 60);
    const secs = sec % 60;

    const pad = (n) => String(n).padStart(2, '0');

    // Update main dashboard timer digits
    const hrsEl = document.getElementById('timer-hours');
    const minsEl = document.getElementById('timer-minutes');
    const secsEl = document.getElementById('timer-seconds');

    if (hrsEl && minsEl && secsEl) {
      hrsEl.textContent = pad(hrs);
      minsEl.textContent = pad(mins);
      secsEl.textContent = pad(secs);
    }

    // Update Zen / Focus mode timer digits
    const zenHrs = document.getElementById('zen-hours');
    const zenMins = document.getElementById('zen-minutes');
    const zenSecs = document.getElementById('zen-seconds');
    const zenSubj = document.getElementById('zen-active-subject');

    if (zenHrs && zenMins && zenSecs) {
      zenHrs.textContent = pad(hrs);
      zenMins.textContent = pad(mins);
      zenSecs.textContent = pad(secs);
    }
    if (zenSubj) {
      zenSubj.textContent = this.currentSubject;
    }

    // Update browser title
    document.title = `${pad(hrs)}:${pad(mins)}:${pad(secs)} - Timylabs Focus`;

    // Notify listeners
    this.callbacks.forEach((cb) => cb({ hours: hrs, minutes: mins, seconds: secs, status: this.status }));
  }

  updatePlayPauseButton() {
    const btns = [
      document.getElementById('btn-timer-play'),
      document.getElementById('btn-zen-timer-play')
    ].filter(Boolean);

    btns.forEach((btn) => {
      if (this.status === 'running') {
        btn.innerHTML = `<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>`;
        btn.title = 'Pause Timer';
      } else {
        btn.innerHTML = `<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg>`;
        btn.title = 'Start Timer';
      }
    });
  }

  updatePreferencesUI() {
    const pomoInput = document.getElementById('pref-pomo-minutes');
    const shortInput = document.getElementById('pref-short-break');
    const longInput = document.getElementById('pref-long-break');
    const deepInput = document.getElementById('pref-deep-focus');
    const autoBreak = document.getElementById('pref-auto-break');
    const soundSelect = document.getElementById('pref-sound-select');

    if (pomoInput) pomoInput.value = this.preferences.pomodoroMinutes || 25;
    if (shortInput) shortInput.value = this.preferences.shortBreakMinutes || 5;
    if (longInput) longInput.value = this.preferences.longBreakMinutes || 15;
    if (deepInput) deepInput.value = this.preferences.deepFocusMinutes || 50;
    if (autoBreak) autoBreak.checked = !!this.preferences.autoStartBreaks;
    if (soundSelect) soundSelect.value = this.preferences.soundChime || 'chime';
  }

  bindEvents() {
    const playBtn = document.getElementById('btn-timer-play');
    if (playBtn) {
      playBtn.addEventListener('click', () => this.toggle());
    }

    const resetBtn = document.getElementById('btn-timer-reset');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => this.reset());
    }

    // Mode tabs across the app
    document.querySelectorAll('[data-timer-mode]').forEach((tab) => {
      tab.addEventListener('click', (e) => {
        const mode = e.currentTarget.getAttribute('data-timer-mode');
        const customVal = e.currentTarget.getAttribute('data-timer-custom');
        this.setMode(mode, customVal ? parseInt(customVal, 10) : null);
      });
    });

    // Subject dropdown
    const subjSelect = document.getElementById('timer-active-subject');
    if (subjSelect) {
      subjSelect.addEventListener('change', (e) => {
        this.setSubject(e.target.value);
      });
    }

    // Custom timer input & quick chips
    const customMinutesInput = document.getElementById('custom-timer-minutes-input');
    const btnApplyCustomTimer = document.getElementById('btn-apply-custom-timer');
    if (btnApplyCustomTimer && customMinutesInput) {
      btnApplyCustomTimer.addEventListener('click', () => {
        const mins = parseInt(customMinutesInput.value, 10);
        if (mins && mins > 0) {
          this.setMode('custom', mins);
        }
      });
    }

    document.querySelectorAll('[data-quick-minutes]').forEach((chip) => {
      chip.addEventListener('click', (e) => {
        const mins = parseInt(e.currentTarget.getAttribute('data-quick-minutes'), 10);
        if (mins) {
          if (customMinutesInput) customMinutesInput.value = mins;
          this.setMode('custom', mins);
        }
      });
    });

    // Preferences form
    const prefForm = document.getElementById('form-focus-preferences');
    if (prefForm) {
      prefForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const pomo = parseInt(document.getElementById('pref-pomo-minutes').value, 10) || 25;
        const shortB = parseInt(document.getElementById('pref-short-break').value, 10) || 5;
        const longB = parseInt(document.getElementById('pref-long-break').value, 10) || 15;
        const deepF = parseInt(document.getElementById('pref-deep-focus').value, 10) || 50;
        const autoB = document.getElementById('pref-auto-break').checked;
        const snd = document.getElementById('pref-sound-select').value;

        this.savePreferences({
          pomodoroMinutes: pomo,
          shortBreakMinutes: shortB,
          longBreakMinutes: longB,
          deepFocusMinutes: deepF,
          autoStartBreaks: autoB,
          soundChime: snd
        });

        // If currently in pomodoro mode, refresh
        if (this.mode === 'pomodoro') {
          this.setMode('pomodoro');
        }

        if (window.showNotificationModal) {
          window.showNotificationModal('Preferences Saved! ⚙️', 'Your custom focus and break settings have been updated.');
        }
      });
    }

    // Keyboard shortcut: Spacebar to toggle timer
    document.addEventListener('keydown', (e) => {
      if (e.code === 'Space' && !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) {
        e.preventDefault();
        this.toggle();
      }
    });
  }
}

window.focusTimer = new FocusTimer();
