/**
 * Focus Timer Engine (Pomodoro, Stopwatch, Breaks)
 * Tracks active focus sessions and synchronizes with storage & UI
 */

class FocusTimer {
  constructor() {
    this.mode = 'pomodoro'; // 'pomodoro', 'shortBreak', 'longBreak', 'stopwatch', 'custom'
    this.status = 'paused'; // 'running', 'paused', 'idle'
    this.totalSeconds = 25 * 60;
    this.remainingSeconds = 25 * 60;
    this.elapsedSecondsInSession = 0;
    this.currentSubject = 'Timylabs Development';
    this.timerInterval = null;
    this.callbacks = [];
  }

  init() {
    this.bindEvents();
    this.updateDisplay();
  }

  setMode(mode, customMinutes = 25) {
    this.pause();
    this.mode = mode;
    this.elapsedSecondsInSession = 0;

    switch (mode) {
      case 'pomodoro':
        this.totalSeconds = 25 * 60;
        break;
      case 'shortBreak':
        this.totalSeconds = 5 * 60;
        break;
      case 'longBreak':
        this.totalSeconds = 15 * 60;
        break;
      case 'stopwatch':
        this.totalSeconds = 0;
        this.remainingSeconds = 0;
        this.updateDisplay();
        return;
      case 'custom':
        this.totalSeconds = Math.max(1, customMinutes) * 60;
        break;
      default:
        this.totalSeconds = 25 * 60;
    }

    this.remainingSeconds = this.totalSeconds;
    this.updateDisplay();
  }

  setSubject(subjectName) {
    this.currentSubject = subjectName;
    const subjSelect = document.getElementById('timer-active-subject');
    if (subjSelect) {
      subjSelect.value = subjectName;
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
      // Save partial session if more than 30 seconds were studied
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
      window.soundEngine.playTimerCompleteChime();
    }

    this.recordSession(this.totalSeconds);
    this.elapsedSecondsInSession = 0;

    // Show nice alert/notification
    if (window.showNotificationModal) {
      window.showNotificationModal(
        'Session Completed! 🎉',
        `Great job! You completed a ${Math.round(this.totalSeconds / 60)}-minute focus session on "${this.currentSubject}". Take a refreshing break!`
      );
    }

    // Auto-switch to break if Pomodoro
    if (this.mode === 'pomodoro') {
      this.setMode('shortBreak');
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

    // Update Zen mode timer digits
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
    const btn = document.getElementById('btn-timer-play');
    if (!btn) return;
    if (this.status === 'running') {
      btn.innerHTML = `<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>`;
      btn.title = 'Pause Timer';
    } else {
      btn.innerHTML = `<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg>`;
      btn.title = 'Start Timer';
    }
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

    // Mode tabs
    const modeTabs = document.querySelectorAll('[data-timer-mode]');
    modeTabs.forEach((tab) => {
      tab.addEventListener('click', (e) => {
        modeTabs.forEach((t) => t.classList.remove('active'));
        e.currentTarget.classList.add('active');
        const mode = e.currentTarget.getAttribute('data-timer-mode');
        this.setMode(mode);
      });
    });

    // Subject dropdown
    const subjSelect = document.getElementById('timer-active-subject');
    if (subjSelect) {
      subjSelect.addEventListener('change', (e) => {
        this.currentSubject = e.target.value;
      });
    }

    // Keyboard shortcut: Spacebar to toggle timer (if not typing in input)
    document.addEventListener('keydown', (e) => {
      if (e.code === 'Space' && !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) {
        e.preventDefault();
        this.toggle();
      }
    });
  }
}

window.focusTimer = new FocusTimer();
