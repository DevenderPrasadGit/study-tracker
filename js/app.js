/**
 * App State Management, Router, and Main Application Controller
 */

class AppStore {
  constructor() {
    this.STORAGE_KEY = 'timylabs_study_tracker_data_v1';
    this.state = this.loadState();
  }

  getDefaultState() {
    return {
      user: {
        name: 'Scholar',
        rank: 'Bronze III',
        level: 3,
        xpPercent: 53.06,
        currentHours: '28h 57m',
        targetHours: '54h',
        quote: 'Discipline today, freedom tomorrow.'
      },
      settings: {
        wallpaper: 'assets/images/pixel_ship.jpg',
        crtScanlines: false,
        ambientVolume: 0.5,
        studyGoalHoursWeek: 20
      },
      focusStats: {
        todaySeconds: 0,
        weekSeconds: 14 * 3600 + 15 * 60, // 14h 15m
        monthSeconds: 56 * 3600 + 42 * 60, // 56h 42m
        weeklyGoalPercent: 82
      },
      plans: [
        {
          id: 'plan_1',
          title: 'Timylabs Development',
          category: 'Education',
          tagClass: 'tag-education',
          created: '06.05.2026',
          totalFocusStr: '14h 15m',
          todayStr: '0s',
          lastActive: 'Yesterday',
          sessionsCount: 11
        },
        {
          id: 'plan_2',
          title: 'Reading',
          category: 'Experimental',
          tagClass: 'tag-reading',
          created: '12.05.2026',
          totalFocusStr: '4h 30m',
          todayStr: '0s',
          lastActive: '2 days ago',
          sessionsCount: 4
        },
        {
          id: 'plan_3',
          title: 'Mathematics & System Design',
          category: 'STEM',
          tagClass: 'tag-education',
          created: '18.05.2026',
          totalFocusStr: '9h 50m',
          todayStr: '0s',
          lastActive: '3 days ago',
          sessionsCount: 6
        }
      ],
      habits: [
        {
          id: 'hab_1',
          name: 'Sport',
          status: 'ACTIVE',
          days: [false, true, true, false, false, false, false]
        },
        {
          id: 'hab_2',
          name: 'Reading',
          status: 'ACTIVE',
          days: [true, true, false, false, false, false, false]
        },
        {
          id: 'hab_3',
          name: 'Algorithm Practice',
          status: 'ACTIVE',
          days: [true, true, true, false, false, false, false]
        }
      ],
      countdowns: [
        {
          id: 'cnt_1',
          title: 'Final Project',
          targetDate: new Date(Date.now() + 18 * 24 * 3600 * 1000 + 17 * 3600 * 1000).toISOString()
        },
        {
          id: 'cnt_2',
          title: 'Project Presentation',
          targetDate: new Date(Date.now() + 9 * 24 * 3600 * 1000 + 17 * 3600 * 1000).toISOString()
        },
        {
          id: 'cnt_3',
          title: 'Midterm Exam',
          targetDate: new Date(Date.now() + 24 * 24 * 3600 * 1000 + 8 * 3600 * 1000).toISOString()
        }
      ],
      tasks: [
        { id: 'tsk_1', title: 'Review chapter 5', status: 'todo', priority: 'High', completed: false },
        { id: 'tsk_2', title: 'Build study dashboard', status: 'done', priority: 'Done', completed: true },
        { id: 'tsk_3', title: 'Read research papers', status: 'todo', priority: 'Medium', completed: false },
        { id: 'tsk_4', title: 'Calculus problem set #4', status: 'inprogress', priority: 'High', completed: false }
      ],
      events: [
        {
          id: 'evt_1',
          title: 'Midterm Examination: Computer Systems',
          type: 'exam',
          date: '2026-10-15',
          time: '09:00',
          durationMinutes: 120,
          notes: 'Chapters 1-7, cover memory hierarchy and cache architecture.'
        },
        {
          id: 'evt_2',
          title: 'Software Architecture Final Deliverable',
          type: 'assignment',
          date: '2026-10-22',
          time: '23:59',
          durationMinutes: 180,
          notes: 'Submit GitHub repository link & architecture document.'
        },
        {
          id: 'evt_3',
          title: 'Deep Focus Sprint: Algorithm Review',
          type: 'study',
          date: '2026-10-02',
          time: '14:00',
          durationMinutes: 90,
          notes: 'Dynamic programming & graph traversal problem set.'
        },
        {
          id: 'evt_4',
          title: 'Distributed Systems Guest Lecture',
          type: 'lecture',
          date: '2026-10-05',
          time: '11:00',
          durationMinutes: 60,
          notes: 'Live lecture on Paxos and Raft consensus protocols.'
        }
      ],
      sessions: [
        {
          id: 'sess_1',
          subject: 'Timylabs Development',
          durationSeconds: 10260, // 2h 51m
          date: '2026-06-12T16:30:00.000Z',
          notes: 'Core frontend implementation & dashboard layout'
        },
        {
          id: 'sess_2',
          subject: 'Reading',
          durationSeconds: 6720, // 1h 52m
          date: '2026-06-11T14:15:00.000Z',
          notes: 'Chapter 4 & 5 review notes'
        },
        {
          id: 'sess_3',
          subject: 'Timylabs Development',
          durationSeconds: 7200,
          date: '2026-06-08T19:00:00.000Z',
          notes: 'Analytics module and heatmaps'
        },
        {
          id: 'sess_4',
          subject: 'Reading',
          durationSeconds: 3600,
          date: '2026-05-28T18:00:00.000Z',
          notes: 'Research papers'
        }
      ],
      heatmapData: {
        '2026-05-20': 45,
        '2026-05-24': 90,
        '2026-05-28': 130,
        '2026-06-02': 180,
        '2026-06-04': 75,
        '2026-06-08': 150,
        '2026-06-10': 210,
        '2026-06-11': 112,
        '2026-06-12': 171,
        '2026-06-14': 80,
        '2026-06-15': 120
      },
      notes: '# My Study Notes & Goals\n\n- [x] Complete system design fundamentals\n- [ ] Master dynamic programming patterns\n- [ ] Review discrete mathematics lecture notes\n\n*"Discipline today, freedom tomorrow."*'
    };
  }

  loadState() {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch (e) {
      console.warn('Failed to parse state from localStorage, using default state.', e);
    }
    const def = this.getDefaultState();
    this.saveState(def);
    return def;
  }

  saveState(state = this.state) {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Failed to save state to localStorage', e);
    }
  }

  // Getters
  getUser() { return this.state.user; }
  getSettings() { return this.state.settings; }
  getFocusStats() { return this.state.focusStats; }
  getPlans() { return this.state.plans; }
  getHabits() { return this.state.habits; }
  getCountdowns() { return this.state.countdowns; }
  getTasks() { return this.state.tasks; }
  getEvents() { return this.state.events; }
  getSessions() { return this.state.sessions; }
  getHeatmapData() { return this.state.heatmapData; }
  getNotes() { return this.state.notes; }

  // Actions
  addFocusSeconds(seconds, subject) {
    this.state.focusStats.todaySeconds += seconds;
    this.state.focusStats.weekSeconds += seconds;
    this.state.focusStats.monthSeconds += seconds;

    const todayKey = new Date().toISOString().split('T')[0];
    this.state.heatmapData[todayKey] = (this.state.heatmapData[todayKey] || 0) + Math.round(seconds / 60);

    // Update plan total if matching
    const plan = this.state.plans.find((p) => p.title.toLowerCase() === subject.toLowerCase());
    if (plan) {
      plan.sessionsCount = (plan.sessionsCount || 0) + 1;
      plan.lastActive = 'Just now';
    }

    this.saveState();
    this.notifyUpdates();
  }

  logStudySession(session) {
    this.state.sessions.unshift(session);
    this.addFocusSeconds(session.durationSeconds, session.subject);
    this.saveState();
    this.notifyUpdates();
  }

  deleteSession(id) {
    this.state.sessions = this.state.sessions.filter((s) => s.id !== id);
    this.saveState();
    this.notifyUpdates();
  }

  addEvent(event) {
    this.state.events.push(event);
    this.saveState();
  }

  deleteEvent(id) {
    this.state.events = this.state.events.filter((e) => e.id !== id);
    this.saveState();
  }

  addHabit(habit) {
    this.state.habits.push(habit);
    this.saveState();
  }

  toggleHabitDay(habitId, dayIndex) {
    const habit = this.state.habits.find((h) => h.id === habitId);
    if (habit) {
      habit.days[dayIndex] = !habit.days[dayIndex];
      this.saveState();
    }
  }

  deleteHabit(id) {
    this.state.habits = this.state.habits.filter((h) => h.id !== id);
    this.saveState();
  }

  addTask(task) {
    this.state.tasks.push(task);
    this.saveState();
  }

  toggleTask(taskId) {
    const task = this.state.tasks.find((t) => t.id === taskId);
    if (task) {
      task.completed = !task.completed;
      task.status = task.completed ? 'done' : 'todo';
      this.saveState();
    }
  }

  addCountdown(item) {
    this.state.countdowns.push(item);
    this.saveState();
  }

  addPlan(plan) {
    this.state.plans.push(plan);
    this.saveState();
    this.notifyUpdates();
  }

  saveNotes(content) {
    this.state.notes = content;
    this.saveState();
  }

  updateSettings(newSettings) {
    this.state.settings = { ...this.state.settings, ...newSettings };
    this.saveState();
  }

  notifyUpdates() {
    window.renderDashboardPlans();
    window.renderFocusOverview();
    if (window.analyticsEngine) {
      window.analyticsEngine.renderAll();
    }
  }
}

window.appStore = new AppStore();

// ==========================================================================
// Ambient Particles Canvas (Floating Warm Dust Motes / Pixel Stars)
// ==========================================================================
function initAmbientParticles() {
  const canvas = document.getElementById('ambient-particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particleCount = 45;
  const particles = [];

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2 + 1,
      speedY: -0.2 - Math.random() * 0.4,
      speedX: (Math.random() - 0.5) * 0.3,
      alpha: Math.random() * 0.7 + 0.2,
      pulse: Math.random() * 0.02
    });
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach((p) => {
      p.y += p.speedY;
      p.x += p.speedX;
      p.alpha += Math.sin(Date.now() * p.pulse) * 0.01;

      if (p.y < 0) {
        p.y = height + 5;
        p.x = Math.random() * width;
      }
      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;

      ctx.fillStyle = `rgba(245, 166, 35, ${Math.max(0.1, Math.min(0.8, p.alpha))})`;
      ctx.fillRect(Math.floor(p.x), Math.floor(p.y), p.size, p.size);
    });

    requestAnimationFrame(animate);
  }

  animate();
}

// ==========================================================================
// View Router
// ==========================================================================
window.switchView = function (viewName) {
  const views = document.querySelectorAll('.app-view');
  views.forEach((v) => v.classList.remove('active'));

  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach((n) => n.classList.remove('active'));

  const targetView = document.getElementById(`view-${viewName}`);
  const targetNav = document.querySelector(`[data-nav-view="${viewName}"]`);

  if (targetView) targetView.classList.add('active');
  if (targetNav) targetNav.classList.add('active');

  if (window.soundEngine) {
    window.soundEngine.playClickSound();
  }

  if (viewName === 'stats' && window.analyticsEngine) {
    window.analyticsEngine.renderAll();
  } else if (viewName === 'events' && window.eventsManager) {
    window.eventsManager.renderEvents();
  } else if (viewName === 'notes') {
    const editor = document.getElementById('notes-textarea');
    if (editor) {
      editor.value = window.appStore.getNotes();
    }
  }
};

// ==========================================================================
// Dashboard Renderers
// ==========================================================================
window.renderDashboardPlans = function () {
  const list = document.getElementById('plans-cards-list');
  if (!list) return;

  list.innerHTML = '';
  const plans = window.appStore.getPlans();

  plans.forEach((plan) => {
    const card = document.createElement('div');
    card.className = 'plan-item-card';

    card.innerHTML = `
      <div class="plan-item-header">
        <div class="plan-item-title-row">
          <span class="folder-icon">📁</span>
          <span class="plan-title">${plan.title}</span>
          <span class="category-tag ${plan.tagClass || 'tag-education'}">${plan.category}</span>
        </div>
        <button class="btn-icon-subtle" title="Options">•••</button>
      </div>
      <div class="plan-created-meta">📅 Created ${plan.created}</div>
      <div class="plan-stats-grid">
        <div class="stat-cell">
          <span class="stat-label">Total Focus</span>
          <span class="stat-value">${plan.totalFocusStr}</span>
        </div>
        <div class="stat-cell">
          <span class="stat-label">Today</span>
          <span class="stat-value">${plan.todayStr}</span>
        </div>
        <div class="stat-cell">
          <span class="stat-label">Last Active</span>
          <span class="stat-value" style="font-family: inherit;">${plan.lastActive}</span>
        </div>
        <div class="stat-cell">
          <span class="stat-label">Sessions</span>
          <span class="stat-value">${plan.sessionsCount}</span>
        </div>
        <button class="btn-start-focus" onclick="window.startFocusWithSubject('${plan.title}')">
          ▶ Start
        </button>
      </div>
    `;
    list.appendChild(card);
  });
};

window.startFocusWithSubject = function (subjName) {
  if (window.focusTimer) {
    window.focusTimer.setSubject(subjName);
    window.focusTimer.setMode('pomodoro');
    window.focusTimer.start();
  }
  // Scroll to timer on mobile or small screens
  const timerCard = document.querySelector('.dash-col-right');
  if (timerCard) {
    timerCard.scrollIntoView({ behavior: 'smooth' });
  }
};

window.renderFocusOverview = function () {
  const stats = window.appStore.getFocusStats();

  const todaySecs = stats.todaySeconds;
  const todayH = Math.floor(todaySecs / 3600);
  const todayM = Math.floor((todaySecs % 3600) / 60);
  const todayS = todaySecs % 60;
  const todayStr = todayH > 0 ? `${todayH}h ${todayM}m` : todayM > 0 ? `${todayM}m ${todayS}s` : `${todayS}s`;

  const elToday = document.getElementById('stat-today-focus');
  if (elToday) elToday.textContent = todayStr;

  const elWeek = document.getElementById('stat-week-focus');
  if (elWeek) {
    const wH = Math.floor(stats.weekSeconds / 3600);
    const wM = Math.floor((stats.weekSeconds % 3600) / 60);
    elWeek.textContent = `${wH}h ${wM}m`;
  }

  const elMonth = document.getElementById('stat-month-focus');
  if (elMonth) {
    const mH = Math.floor(stats.monthSeconds / 3600);
    const mM = Math.floor((stats.monthSeconds % 3600) / 60);
    elMonth.textContent = `${mH}h ${mM}m`;
  }

  const elPercent = document.getElementById('radial-goal-percent');
  if (elPercent) elPercent.textContent = `${stats.weeklyGoalPercent}%`;

  const circle = document.getElementById('radial-circle-bar');
  if (circle) {
    const radius = 38;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (stats.weeklyGoalPercent / 100) * circumference;
    circle.style.strokeDasharray = `${circumference} ${circumference}`;
    circle.style.strokeDashoffset = offset;
  }
};

// ==========================================================================
// Wallpaper & Theme Switcher
// ==========================================================================
window.switchWallpaper = function (wallpaperUrl) {
  const bg = document.getElementById('app-wallpaper');
  if (bg) {
    bg.style.backgroundImage = `url('${wallpaperUrl}')`;
  }
  window.appStore.updateSettings({ wallpaper: wallpaperUrl });
};

window.toggleCRTScanlines = function () {
  const isActive = document.body.classList.toggle('crt-active');
  const btn = document.getElementById('btn-toggle-crt');
  if (btn) btn.classList.toggle('active', isActive);
  window.appStore.updateSettings({ crtScanlines: isActive });
};

// ==========================================================================
// Quote Editor & Randomizer
// ==========================================================================
const quotes = [
  'Discipline today, freedom tomorrow.',
  'Deep work is the superpower of the 21st century.',
  'Small daily improvements over time lead to stunning results.',
  'The secret of getting ahead is getting started.',
  'One step, one page, one concept at a time.',
  'Focus is a muscle. Train it with intention.'
];

window.randomizeQuote = function () {
  const quoteEl = document.getElementById('header-daily-quote');
  if (!quoteEl) return;
  const current = quoteEl.textContent.trim();
  const options = quotes.filter((q) => q !== current);
  const picked = options[Math.floor(Math.random() * options.length)];
  quoteEl.textContent = picked;
};

// ==========================================================================
// Notification Modal
// ==========================================================================
window.showNotificationModal = function (title, body) {
  const modal = document.getElementById('modal-generic-alert');
  if (!modal) return;
  document.getElementById('modal-alert-title').textContent = title;
  document.getElementById('modal-alert-body').textContent = body;
  modal.classList.add('open');
};

// ==========================================================================
// Initialization on DOMContentLoaded
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  // Init Wallpaper from settings
  const settings = window.appStore.getSettings();
  if (settings.wallpaper) {
    window.switchWallpaper(settings.wallpaper);
  }
  if (settings.crtScanlines) {
    document.body.classList.add('crt-active');
    const btn = document.getElementById('btn-toggle-crt');
    if (btn) btn.classList.add('active');
  }

  initAmbientParticles();

  // Navigation click listeners
  document.querySelectorAll('[data-nav-view]').forEach((item) => {
    item.addEventListener('click', (e) => {
      const view = e.currentTarget.getAttribute('data-nav-view');
      window.switchView(view);
    });
  });

  // Render Dashboard
  window.renderDashboardPlans();
  window.renderFocusOverview();

  // Init Modules
  if (window.focusTimer) window.focusTimer.init();
  if (window.habitsManager) window.habitsManager.init();
  if (window.tasksManager) window.tasksManager.init();
  if (window.eventsManager) window.eventsManager.init();
  if (window.analyticsEngine) window.analyticsEngine.init();
  if (window.gamificationEngine) window.gamificationEngine.init();

  // Music popover toggle
  const musicBtn = document.getElementById('btn-music-toggle');
  const musicPopover = document.getElementById('music-popover');
  if (musicBtn && musicPopover) {
    musicBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      musicPopover.classList.toggle('open');
      musicBtn.classList.toggle('active', musicPopover.classList.contains('open'));
    });

    document.addEventListener('click', (e) => {
      if (!musicPopover.contains(e.target) && e.target !== musicBtn) {
        musicPopover.classList.remove('open');
        musicBtn.classList.remove('active');
      }
    });
  }

  // Ambient sound button & popover toggle
  const soundBtn = document.getElementById('btn-ambient-sound-toggle');
  const soundPopover = document.getElementById('ambient-sound-popover');
  if (soundBtn && soundPopover) {
    soundBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      soundPopover.classList.toggle('open');
      soundBtn.classList.toggle('active', soundPopover.classList.contains('open'));
    });

    document.addEventListener('click', (e) => {
      if (!soundPopover.contains(e.target) && e.target !== soundBtn) {
        soundPopover.classList.remove('open');
        soundBtn.classList.remove('active');
      }
    });
  }

  // Audio sliders
  const rainSlider = document.getElementById('slider-rain-volume');
  const rainToggle = document.getElementById('chk-rain-enable');
  if (rainSlider && rainToggle) {
    rainToggle.addEventListener('change', (e) => {
      if (e.target.checked) {
        window.soundEngine.startRain(parseFloat(rainSlider.value));
      } else {
        window.soundEngine.stopRain();
      }
    });
    rainSlider.addEventListener('input', (e) => {
      window.soundEngine.setRainVolume(parseFloat(e.target.value));
    });
  }

  const fireSlider = document.getElementById('slider-fire-volume');
  const fireToggle = document.getElementById('chk-fire-enable');
  if (fireSlider && fireToggle) {
    fireToggle.addEventListener('change', (e) => {
      if (e.target.checked) {
        window.soundEngine.startFire(parseFloat(fireSlider.value));
      } else {
        window.soundEngine.stopFire();
      }
    });
    fireSlider.addEventListener('input', (e) => {
      window.soundEngine.setFireVolume(parseFloat(e.target.value));
    });
  }

  const lofiSlider = document.getElementById('slider-lofi-volume');
  const lofiToggle = document.getElementById('chk-lofi-enable');
  if (lofiSlider && lofiToggle) {
    lofiToggle.addEventListener('change', (e) => {
      if (e.target.checked) {
        window.soundEngine.startLofi(parseFloat(lofiSlider.value));
      } else {
        window.soundEngine.stopLofi();
      }
    });
    lofiSlider.addEventListener('input', (e) => {
      window.soundEngine.setLofiVolume(parseFloat(e.target.value));
    });
  }

  // Modal close handlers (click on backdrop or close buttons)
  document.querySelectorAll('.modal-backdrop').forEach((backdrop) => {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) {
        backdrop.classList.remove('open');
      }
    });
  });

  document.querySelectorAll('[data-close-modal]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const modalId = e.currentTarget.getAttribute('data-close-modal');
      const m = document.getElementById(modalId);
      if (m) m.classList.remove('open');
    });
  });

  // Notes editor autosave
  const notesText = document.getElementById('notes-textarea');
  if (notesText) {
    notesText.value = window.appStore.getNotes();
    notesText.addEventListener('input', (e) => {
      window.appStore.saveNotes(e.target.value);
    });
  }

  // Add Plan Modal
  const btnOpenAddPlan = document.getElementById('btn-add-plan-modal');
  if (btnOpenAddPlan) {
    btnOpenAddPlan.addEventListener('click', () => {
      document.getElementById('modal-add-plan').classList.add('open');
    });
  }

  const formAddPlan = document.getElementById('form-add-plan');
  if (formAddPlan) {
    formAddPlan.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = document.getElementById('plan-input-title').value.trim();
      const cat = document.getElementById('plan-input-category').value.trim();
      if (!title) return;

      window.appStore.addPlan({
        id: 'plan_' + Date.now(),
        title,
        category: cat || 'General',
        tagClass: 'tag-education',
        created: new Date().toLocaleDateString('en-GB'),
        totalFocusStr: '0s',
        todayStr: '0s',
        lastActive: 'Just created',
        sessionsCount: 0
      });

      // Update timer subject options
      const sel = document.getElementById('timer-active-subject');
      if (sel) {
        const opt = document.createElement('option');
        opt.value = title;
        opt.textContent = title;
        sel.appendChild(opt);
      }

      document.getElementById('modal-add-plan').classList.remove('open');
      if (window.soundEngine) window.soundEngine.playClickSound();
    });
  }
});
