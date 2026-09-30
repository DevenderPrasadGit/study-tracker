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

  updateEvent(id, changes) {
    const idx = this.state.events.findIndex((e) => e.id === id);
    if (idx !== -1) {
      this.state.events[idx] = { ...this.state.events[idx], ...changes };
      this.saveState();
    }
  }

  deletePlan(id) {
    this.state.plans = this.state.plans.filter((p) => p.id !== id);
    this.saveState();
    this.notifyUpdates();
  }

  updatePlan(id, changes) {
    const idx = this.state.plans.findIndex((p) => p.id === id);
    if (idx !== -1) {
      this.state.plans[idx] = { ...this.state.plans[idx], ...changes };
      this.saveState();
      this.notifyUpdates();
    }
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

  deleteTask(taskId) {
    this.state.tasks = this.state.tasks.filter((t) => t.id !== taskId);
    this.saveState();
  }

  updateTask(taskId, changes) {
    const idx = this.state.tasks.findIndex((t) => t.id === taskId);
    if (idx !== -1) {
      this.state.tasks[idx] = { ...this.state.tasks[idx], ...changes };
      this.saveState();
    }
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

  deleteCountdown(id) {
    this.state.countdowns = this.state.countdowns.filter((c) => c.id !== id);
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
// View Router & Theme Engine
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
  } else if (viewName === 'habits' && window.habitsManager) {
    window.habitsManager.renderHabits();
  } else if (viewName === 'notes' && window.notesManager) {
    window.notesManager.populateLinkDropdowns();
    window.notesManager.renderNotesList();
    window.notesManager.renderActiveNoteEditor();
  } else if (viewName === 'themes') {
    window.syncThemeCardsUI();
  } else if (viewName === 'focus') {
    if (window.gamificationEngine && window.appStore) {
      const u = window.appStore.getUser();
      window.gamificationEngine.selectCompanion(u.companion || 'cat', false);
    }
  }
};

window.setGuiTheme = function (themeName, notify = true) {
  if (!['default', 'gladiator', 'sorcerer'].includes(themeName)) {
    themeName = 'default';
  }
  document.body.setAttribute('data-theme', themeName);
  document.documentElement.setAttribute('data-theme', themeName);
  try {
    localStorage.setItem('timylabs_gui_theme', themeName);
  } catch (e) {}

  window.syncThemeCardsUI();
  window.spawnThemeParticles(themeName);

  if (notify && window.showNotificationModal) {
    const names = {
      default: 'Sunset Sanctuary (Pixel Anime)',
      gladiator: 'Medieval Gladiator (Swords & Shields)',
      sorcerer: 'Sorcerer Magic Academy (Arcane Archives)'
    };
    window.showNotificationModal('Theme Equipped! 🎨', `Sanctuary appearance updated to ${names[themeName] || themeName}.`);
  }
};

window.syncThemeCardsUI = function () {
  let curTheme = 'default';
  try {
    curTheme = localStorage.getItem('timylabs_gui_theme') || 'default';
  } catch (e) {}

  document.querySelectorAll('.theme-card-showcase').forEach((card) => {
    const tid = card.getAttribute('data-theme-id');
    const btn = card.querySelector('.btn-pill-amber');
    if (tid === curTheme) {
      card.classList.add('active');
      if (btn) {
        btn.textContent = '✓ Active Theme';
        btn.style.opacity = '1';
      }
    } else {
      card.classList.remove('active');
      if (btn) {
        btn.textContent = 'Equip Theme';
        btn.style.opacity = '0.85';
      }
    }
  });
};

// Particle spawner for immersive themed effects
window._themeParticleInterval = null;
window.spawnThemeParticles = function (themeName) {
  // Clear existing particles
  const existing = document.querySelector('.theme-particles-overlay');
  if (existing) existing.remove();
  if (window._themeParticleInterval) {
    clearInterval(window._themeParticleInterval);
    window._themeParticleInterval = null;
  }

  if (themeName === 'default') return;

  const overlay = document.createElement('div');
  overlay.className = 'theme-particles-overlay';
  document.body.appendChild(overlay);

  const particleClass = themeName === 'gladiator' ? 'theme-particle--ember' : 'theme-particle--orb';
  const maxParticles = 12;

  function spawnParticle() {
    if (overlay.children.length >= maxParticles) return;
    const p = document.createElement('div');
    p.className = `theme-particle ${particleClass}`;
    p.style.left = `${Math.random() * 100}%`;
    const duration = 6 + Math.random() * 8;
    p.style.animationDuration = `${duration}s`;
    p.style.animationDelay = `${Math.random() * 2}s`;
    if (themeName === 'gladiator') {
      const size = 2 + Math.random() * 4;
      p.style.width = `${size}px`;
      p.style.height = `${size}px`;
    } else {
      const size = 3 + Math.random() * 5;
      p.style.width = `${size}px`;
      p.style.height = `${size}px`;
    }
    overlay.appendChild(p);
    setTimeout(() => { if (p.parentNode) p.remove(); }, duration * 1000);
  }

  // Initial burst
  for (let i = 0; i < 6; i++) {
    setTimeout(spawnParticle, i * 400);
  }
  // Continuous spawning
  window._themeParticleInterval = setInterval(spawnParticle, 1500);
};

window.initGuiThemes = function () {
  let saved = 'default';
  try {
    saved = localStorage.getItem('timylabs_gui_theme') || 'default';
  } catch (e) {}
  window.setGuiTheme(saved, false);
};


// ==========================================================================
// Dashboard Renderers
// ==========================================================================
window.renderDashboardPlans = function () {
  const list = document.getElementById('plans-cards-list');
  if (!list) return;

  list.innerHTML = '';
  const plans = window.appStore.getPlans();

  if (plans.length === 0) {
    list.innerHTML = `<div style="text-align:center;padding:30px;color:var(--text-dim);grid-column:1/-1">
      <div style="font-size:32px;margin-bottom:8px">📁</div>
      <p>No plans yet. Click "+ New Plan" to add your first study subject!</p>
    </div>`;
    return;
  }

  plans.forEach((plan) => {
    const card = document.createElement('div');
    card.className = 'plan-item-card';
    const safeTitle = (plan.title || '').replace(/'/g, "\\'");
    const safeCat = (plan.category || '').replace(/'/g, "\\'");

    card.innerHTML = `
      <div class="plan-item-header">
        <div class="plan-item-title-row">
          <span class="folder-icon">📁</span>
          <span class="plan-title">${plan.title}</span>
          <span class="category-tag ${plan.tagClass || 'tag-education'}">${plan.category}</span>
        </div>
        <div style="display:flex;gap:4px;">
          <button class="btn-icon-subtle" title="Edit Plan" onclick="window.openEditPlanModal('${plan.id}','${safeTitle}','${safeCat}')" style="font-size:13px;">✏️</button>
          <button class="btn-icon-subtle" title="Delete Plan" onclick="window.deletePlan('${plan.id}')" style="font-size:13px;">🗑</button>
        </div>
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
          <span class="stat-value" style="font-family:inherit">${plan.lastActive}</span>
        </div>
        <div class="stat-cell">
          <span class="stat-label">Sessions</span>
          <span class="stat-value">${plan.sessionsCount}</span>
        </div>
        <button class="btn-start-focus" onclick="window.startFocusWithSubject('${safeTitle}')">
          ▶ Start
        </button>
      </div>
    `;
    list.appendChild(card);
  });
};

// Edit plan modal helper
window.openEditPlanModal = function(id, title, category) {
  const modal = document.getElementById('modal-add-plan');
  const titleInput = document.getElementById('plan-input-title');
  const catInput = document.getElementById('plan-input-category');
  const modalTitle = modal.querySelector('.modal-title');
  const submitBtn = modal.querySelector('button[type="submit"]');
  if (!modal) return;
  titleInput.value = title;
  catInput.value = category;
  modalTitle.textContent = '✏️ Edit Study Plan';
  submitBtn.textContent = 'Save Changes';
  modal.dataset.editId = id;
  modal.classList.add('open');
};

window.deletePlan = function(id) {
  if (confirm('Delete this study plan?')) {
    window.appStore.deletePlan(id);
  }
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
    if (wallpaperUrl.startsWith('linear-gradient') || wallpaperUrl.startsWith('radial-gradient')) {
      bg.style.backgroundImage = wallpaperUrl;
    } else {
      bg.style.backgroundImage = `url('${wallpaperUrl}')`;
    }
  }
  window.appStore.updateSettings({ wallpaper: wallpaperUrl });
  
  // Highlight active wallpaper card in gallery
  document.querySelectorAll('.wallpaper-card').forEach((card) => {
    const cardUrl = card.getAttribute('data-wallpaper-url');
    if (cardUrl === wallpaperUrl) {
      card.classList.add('active');
    } else {
      card.classList.remove('active');
    }
  });

  if (window.soundEngine) {
    window.soundEngine.playClickSound();
  }
};

window.selectWallpaperCard = function (cardEl) {
  const url = cardEl.getAttribute('data-wallpaper-url');
  if (url) {
    window.switchWallpaper(url);
  }
};

window.handleWallpaperFileUpload = function (e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (event) {
    const dataUrl = event.target.result;
    
    // Create new custom wallpaper card in grid
    const grid = document.getElementById('wallpaper-preset-grid');
    const customCard = document.createElement('div');
    customCard.className = 'wallpaper-card active';
    customCard.setAttribute('data-wallpaper-url', dataUrl);
    customCard.onclick = function() { window.selectWallpaperCard(this); };
    customCard.innerHTML = `
      <div class="wallpaper-thumb" style="background-image: url('${dataUrl}');">
        <span class="wallpaper-active-badge">✓ Active</span>
      </div>
      <div class="wallpaper-info">
        <div class="wallpaper-name">Custom Upload</div>
        <div class="wallpaper-tag">User File</div>
      </div>
    `;
    
    if (grid) {
      grid.prepend(customCard);
    }
    
    window.switchWallpaper(dataUrl);
    window.showNotificationModal('✨ Wallpaper Updated!', 'Your custom wallpaper has been applied successfully.');
  };
  reader.readAsDataURL(file);
};

window.applyCustomWallpaperUrl = function () {
  const input = document.getElementById('custom-wallpaper-url-input');
  if (!input || !input.value.trim()) return;

  const url = input.value.trim();
  const grid = document.getElementById('wallpaper-preset-grid');
  const customCard = document.createElement('div');
  customCard.className = 'wallpaper-card active';
  customCard.setAttribute('data-wallpaper-url', url);
  customCard.onclick = function() { window.selectWallpaperCard(this); };
  customCard.innerHTML = `
    <div class="wallpaper-thumb" style="background-image: url('${url}');">
      <span class="wallpaper-active-badge">✓ Active</span>
    </div>
    <div class="wallpaper-info">
      <div class="wallpaper-name">Custom Web Image</div>
      <div class="wallpaper-tag">Direct URL</div>
    </div>
  `;
  
  if (grid) {
    grid.prepend(customCard);
  }

  window.switchWallpaper(url);
  input.value = '';
  window.showNotificationModal('✨ Custom Wallpaper Applied!', 'Custom background image URL loaded!');
};

window.updateWallpaperFilters = function () {
  const bg = document.getElementById('app-wallpaper');
  if (!bg) return;

  const brightness = document.getElementById('slider-wallpaper-brightness')?.value || '0.65';
  const blur = document.getElementById('slider-wallpaper-blur')?.value || '0';
  const saturation = document.getElementById('slider-wallpaper-saturation')?.value || '1.15';

  bg.style.filter = `brightness(${brightness}) blur(${blur}px) saturate(${saturation}) contrast(1.05)`;

  const lBright = document.getElementById('label-val-brightness');
  const lBlur = document.getElementById('label-val-blur');
  const lSat = document.getElementById('label-val-saturation');

  if (lBright) lBright.textContent = `${Math.round(brightness * 100)}%`;
  if (lBlur) lBlur.textContent = `${blur}px`;
  if (lSat) lSat.textContent = `${Math.round(saturation * 100)}%`;
};

window.resetWallpaperSettings = function () {
  const sBright = document.getElementById('slider-wallpaper-brightness');
  const sBlur = document.getElementById('slider-wallpaper-blur');
  const sSat = document.getElementById('slider-wallpaper-saturation');

  if (sBright) sBright.value = 0.65;
  if (sBlur) sBlur.value = 0;
  if (sSat) sSat.value = 1.15;

  window.updateWallpaperFilters();
  window.switchWallpaper('assets/images/pixel_ship.jpg');
};

// ==========================================================================
// Interactive Flashcard Engine
// ==========================================================================
const flashcardDecks = {
  cs: [
    {
      label: "COMPUTER SCIENCE 101 • CARD 1 OF 3",
      q: "What is the time complexity of searching in a balanced Binary Search Tree (BST)?",
      ansTitle: "O(log N)",
      ansText: "In a balanced BST, each comparison eliminates half of the remaining nodes, yielding a logarithmic time complexity."
    },
    {
      label: "COMPUTER SCIENCE 101 • CARD 2 OF 3",
      q: "What is the difference between Process and Thread?",
      ansTitle: "Memory Isolation vs Shared Space",
      ansText: "A process has its own separate virtual address memory space. Threads share the memory space of their parent process."
    },
    {
      label: "COMPUTER SCIENCE 101 • CARD 3 OF 3",
      q: "Explain how a Hash Table achieves O(1) average lookup time.",
      ansTitle: "Hash Function & Array Indexing",
      ansText: "A hash function maps keys directly to array bucket indices, providing near instantaneous direct array access."
    }
  ],
  kanji: [
    {
      label: "JAPANESE KANJI • CARD 1 OF 3",
      q: "What is the meaning and reading of the kanji: 夢 ?",
      ansTitle: "Dream (Yume / ム)",
      ansText: "Representing aspirations and vision. Onyomi: MU (ム), Kunyomi: yume (ゆめ)."
    },
    {
      label: "JAPANESE KANJI • CARD 2 OF 3",
      q: "What is the meaning and reading of the kanji: 学 ?",
      ansTitle: "Study / Learning (Gaku / Manabu)",
      ansText: "Used in Gakkou (School), Gakusei (Student). Onyomi: GAKU (ガク), Kunyomi: mana(bu)."
    },
    {
      label: "JAPANESE KANJI • CARD 3 OF 3",
      q: "What is the meaning and reading of the kanji: 光 ?",
      ansTitle: "Light / Ray (Hikari / Kou)",
      ansText: "Used in Hikari (Light) and Koukourou (Beam). Onyomi: KOU (コウ), Kunyomi: hikari."
    }
  ],
  sysdesign: [
    {
      label: "SYSTEM DESIGN • CARD 1 OF 3",
      q: "What is the CAP Theorem in Distributed Systems?",
      ansTitle: "Consistency, Availability, Partition Tolerance",
      ansText: "A distributed system can guarantee at most two of the three properties simultaneously in the presence of network partitions."
    },
    {
      label: "SYSTEM DESIGN • CARD 2 OF 3",
      q: "What is Consistent Hashing and why is it useful?",
      ansTitle: "Minimizes Key Remapping during Resizing",
      ansText: "Consistently hashes nodes and keys onto a ring structure so adding or removing servers only affects k/N keys."
    },
    {
      label: "SYSTEM DESIGN • CARD 3 OF 3",
      q: "What is the difference between Vertical & Horizontal Scaling?",
      ansTitle: "Scale Up vs Scale Out",
      ansText: "Vertical adding RAM/CPU to single server. Horizontal adding more commodity machines behind load balancer."
    }
  ],
  math: [
    {
      label: "MATH & LOGIC • CARD 1 OF 3",
      q: "What is Euler's Identity formula?",
      ansTitle: "e^(iπ) + 1 = 0",
      ansText: "Linking 5 fundamental mathematical constants: e, i, π, 1, and 0 in an elegant equation."
    },
    {
      label: "MATH & LOGIC • CARD 2 OF 3",
      q: "What is the derivative of f(x) = e^(2x)?",
      ansTitle: "f'(x) = 2e^(2x)",
      ansText: "Using the chain rule: derivative of e^u is u' * e^u, where u = 2x and u' = 2."
    },
    {
      label: "MATH & LOGIC • CARD 3 OF 3",
      q: "What is De Morgan's Law in Boolean Logic?",
      ansTitle: "¬(A ∧ B) = ¬A ∨ ¬B",
      ansText: "The negation of a conjunction is the disjunction of the negations."
    }
  ]
};

let activeDeckKey = 'cs';
let activeDeckIndex = 0;

window.renderCurrentFlashcard = function () {
  const deck = flashcardDecks[activeDeckKey] || flashcardDecks.cs;
  const card = deck[activeDeckIndex % deck.length];

  const wrapper = document.querySelector('.flashcard-3d-wrapper');
  if (wrapper) wrapper.classList.remove('flipped');

  const labelEl = document.getElementById('fc-deck-label');
  const qEl = document.getElementById('fc-question-text');
  const ansTitleEl = document.getElementById('fc-answer-title');
  const ansTextEl = document.getElementById('fc-answer-text');

  if (labelEl) labelEl.textContent = card.label;
  if (qEl) qEl.textContent = card.q;
  if (ansTitleEl) ansTitleEl.textContent = card.ansTitle;
  if (ansTextEl) ansTextEl.textContent = card.ansText;
};

window.switchFlashcardDeck = function (deckKey) {
  activeDeckKey = deckKey;
  activeDeckIndex = 0;

  document.querySelectorAll('#view-flashcards .events-filter-chips .event-chip').forEach(chip => chip.classList.remove('active'));
  const activeChip = document.getElementById(`chip-deck-${deckKey}`);
  if (activeChip) activeChip.classList.add('active');

  window.renderCurrentFlashcard();
  if (window.soundEngine) window.soundEngine.playClickSound();
};

window.prevFlashcard = function () {
  const deck = flashcardDecks[activeDeckKey] || flashcardDecks.cs;
  activeDeckIndex = (activeDeckIndex - 1 + deck.length) % deck.length;
  window.renderCurrentFlashcard();
  if (window.soundEngine) window.soundEngine.playClickSound();
};

window.nextFlashcard = function () {
  const deck = flashcardDecks[activeDeckKey] || flashcardDecks.cs;
  activeDeckIndex = (activeDeckIndex + 1) % deck.length;
  window.renderCurrentFlashcard();
  if (window.soundEngine) window.soundEngine.playClickSound();
};

// ==========================================================================
// Interactive AI Study Assistant Simulation
// ==========================================================================
window.sendAiUserMessage = function () {
  const input = document.getElementById('ai-chat-input');
  if (!input || !input.value.trim()) return;

  const text = input.value.trim();
  input.value = '';

  window.appendChatMessage('user', text);
  window.triggerAiResponse(text);
};

window.sendAiPresetPrompt = function (promptText) {
  window.appendChatMessage('user', promptText);
  window.triggerAiResponse(promptText);
};

window.appendChatMessage = function (sender, text) {
  const container = document.getElementById('ai-chat-messages');
  if (!container) return;

  const msgDiv = document.createElement('div');
  msgDiv.className = `chat-msg ${sender === 'user' ? 'user-msg' : 'ai-msg'}`;
  
  const avatar = sender === 'user' ? '👤' : '🤖';
  const name = sender === 'user' ? 'You' : 'TimyAI Companion';

  msgDiv.innerHTML = `
    <div class="chat-avatar">${avatar}</div>
    <div class="chat-bubble">
      <div style="font-weight: 700; color: ${sender === 'user' ? '#fff' : 'var(--accent-gold-light)'}; font-size: 11px; margin-bottom: 4px;">${name}</div>
      ${text}
    </div>
  `;

  container.appendChild(msgDiv);
  container.scrollTop = container.scrollHeight;
};

window.triggerAiResponse = function (userQuery) {
  const container = document.getElementById('ai-chat-messages');
  
  // Add temporary typing indicator
  const typingDiv = document.createElement('div');
  typingDiv.className = 'chat-msg ai-msg';
  typingDiv.id = 'ai-typing-indicator';
  typingDiv.innerHTML = `
    <div class="chat-avatar">🤖</div>
    <div class="chat-bubble" style="font-style: italic; color: var(--text-dim);">
      TimyAI is formulating response... ✨
    </div>
  `;
  if (container) {
    container.appendChild(typingDiv);
    container.scrollTop = container.scrollHeight;
  }

  setTimeout(() => {
    const indicator = document.getElementById('ai-typing-indicator');
    if (indicator) indicator.remove();

    let response = "That's an excellent study question! Focusing on deep comprehension, breaking down topics into bite-sized concepts, and reviewing actively with Pomodoro cycles will maximize your retention.";

    const q = userQuery.toLowerCase();
    if (q.includes('pomodoro')) {
      response = "<strong>Pomodoro Strategy:</strong><br/>1. Work for 25 mins with zero distractions.<br/>2. Take a 5-min break (stretch, hydrate).<br/>3. After 4 cycles, reward yourself with a long 20-30 min break!";
    } else if (q.includes('spaced repetition')) {
      response = "<strong>Spaced Repetition Key Points:</strong><br/>• Review material right before you are likely to forget it.<br/>• Intervals increase: Day 1 → Day 3 → Day 7 → Day 14 → Day 30.<br/>• Maximizes long-term memory consolidation!";
    } else if (q.includes('quiz')) {
      response = "<strong>System Design Quiz Time:</strong><br/>1. What is the main difference between SQL (relational) and NoSQL (document/key-value) databases?<br/>2. How does a CDN improve latency for static media assets?<br/>3. What is a Reverse Proxy?";
    } else if (q.includes('motivation')) {
      response = "🌟 <em>'Action creates momentum. You don't need to feel ready to begin—start with 5 focused minutes today!'</em> You've got this, Scholar!";
    }

    window.appendChatMessage('ai', response);
  }, 750);
};

// ==========================================================================
// Resource Filter Engine
// ==========================================================================
window.filterResources = function (query) {
  const cards = document.querySelectorAll('#resources-grid .resource-card');
  const q = query.toLowerCase();

  cards.forEach(card => {
    const title = card.querySelector('h4')?.textContent.toLowerCase() || '';
    const desc = card.querySelector('p')?.textContent.toLowerCase() || '';
    if (title.includes(q) || desc.includes(q)) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
};

window.filterResourcesCategory = function (cat) {
  const cards = document.querySelectorAll('#resources-grid .resource-card');
  cards.forEach(card => {
    if (cat === 'all') {
      card.style.display = 'block';
    } else {
      const tag = card.querySelector('.user-premium-tag')?.textContent.toLowerCase() || '';
      if ((cat === 'cs' && tag.includes('handbook')) ||
          (cat === 'math' && tag.includes('video')) ||
          (cat === 'notes' && tag.includes('article'))) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    }
  });
};

window.toggleCRTScanlines = function () {
  const isActive = document.body.classList.toggle('crt-active');
  const btn = document.getElementById('btn-toggle-crt');
  if (btn) btn.classList.toggle('active', isActive);
  const btnWallpaper = document.getElementById('btn-wallpaper-crt-toggle');
  if (btnWallpaper) btnWallpaper.classList.toggle('active', isActive);
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
  if (window.initGuiThemes) window.initGuiThemes();
  if (window.focusTimer) window.focusTimer.init();
  if (window.habitsManager) window.habitsManager.init();
  if (window.tasksManager) window.tasksManager.init();
  if (window.eventsManager) window.eventsManager.init();
  if (window.notesManager) window.notesManager.init();
  if (window.musicStationManager) window.musicStationManager.init();
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
      const modal = document.getElementById('modal-add-plan');
      const editId = modal.dataset.editId;

      if (editId) {
        // Edit mode
        window.appStore.updatePlan(editId, { title, category: cat || 'General' });
        delete modal.dataset.editId;
        modal.querySelector('.modal-title').textContent = '📁 Add New Study Plan / Subject';
        modal.querySelector('button[type="submit"]').textContent = 'Create Plan';
      } else {
        // Create mode
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
      }

      formAddPlan.reset();
      modal.classList.remove('open');
      if (window.soundEngine) window.soundEngine.playClickSound();
    });
  }

  // Reset plan modal state when closed via cancel/X
  document.querySelectorAll('[data-close-modal="modal-add-plan"]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const modal = document.getElementById('modal-add-plan');
      if (modal.dataset.editId) {
        delete modal.dataset.editId;
        modal.querySelector('.modal-title').textContent = '📁 Add New Study Plan / Subject';
        modal.querySelector('button[type="submit"]').textContent = 'Create Plan';
        document.getElementById('form-add-plan').reset();
      }
    });
  });

  // ==========================================================================
  // Collapsible Sidebar & Drag-to-Expand System
  // ==========================================================================
  function initSidebarToggle() {
    const sidebar = document.querySelector('.sidebar');
    const collapseBtn = document.getElementById('btn-sidebar-collapse');
    const revealHandle = document.getElementById('sidebar-reveal-handle');
    const expandBtn = document.getElementById('btn-sidebar-expand');
    if (!sidebar) return;

    const setCollapsed = (collapsed, animate = true) => {
      if (!animate) {
        sidebar.style.transition = 'none';
        if (revealHandle) revealHandle.style.transition = 'none';
      }

      if (collapsed) {
        sidebar.classList.add('collapsed');
        document.body.classList.add('sidebar-is-collapsed');
        try {
          localStorage.setItem('timylabs_sidebar_collapsed', 'true');
        } catch (e) {}
      } else {
        sidebar.classList.remove('collapsed');
        document.body.classList.remove('sidebar-is-collapsed');
        try {
          localStorage.setItem('timylabs_sidebar_collapsed', 'false');
        } catch (e) {}
      }

      if (!animate) {
        sidebar.offsetHeight; // force reflow
        sidebar.style.transition = '';
        if (revealHandle) {
          revealHandle.offsetHeight;
          revealHandle.style.transition = '';
        }
      }

      if (window.soundEngine && animate) {
        window.soundEngine.playClickSound();
      }
    };

    // Restore saved state (default to false if not set)
    try {
      const saved = localStorage.getItem('timylabs_sidebar_collapsed');
      if (saved === 'true') {
        setCollapsed(true, false);
      }
    } catch (e) {}

    // Collapse button click (slides left)
    if (collapseBtn) {
      collapseBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        setCollapsed(true, true);
      });
    }

    // Expand button click (slides back in)
    if (expandBtn) {
      expandBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        setCollapsed(false, true);
      });
    }

    // Drag interaction on top-left reveal handle to pull sidebar onto screen
    if (revealHandle) {
      let isDragging = false;
      let startX = 0;
      let currentDeltaX = 0;

      revealHandle.addEventListener('pointerdown', (e) => {
        isDragging = true;
        startX = e.clientX;
        currentDeltaX = 0;
        sidebar.style.transition = 'none';
        revealHandle.style.transition = 'none';
        try {
          revealHandle.setPointerCapture(e.pointerId);
        } catch (err) {}
      });

      revealHandle.addEventListener('pointermove', (e) => {
        if (!isDragging) return;
        currentDeltaX = Math.max(0, Math.min(260, e.clientX - startX));
        sidebar.style.transform = `translateX(calc(-100% + ${currentDeltaX}px))`;
        revealHandle.style.transform = `translateX(${currentDeltaX}px)`;
      });

      const endDrag = (e) => {
        if (!isDragging) return;
        isDragging = false;
        try {
          revealHandle.releasePointerCapture(e.pointerId);
        } catch (err) {}

        sidebar.style.transition = '';
        sidebar.style.transform = '';
        revealHandle.style.transition = '';
        revealHandle.style.transform = '';

        // If dragged more than 40px to the right, open the sidebar!
        if (currentDeltaX > 40) {
          setCollapsed(false, true);
        } else {
          // If pure click/tap without drag, open it
          if (currentDeltaX <= 5) {
            setCollapsed(false, true);
          }
        }
        currentDeltaX = 0;
      };

      revealHandle.addEventListener('pointerup', endDrag);
      revealHandle.addEventListener('pointercancel', endDrag);
    }

    // Left screen edge drag (0-25px) when collapsed
    window.addEventListener('pointerdown', (e) => {
      if (document.body.classList.contains('sidebar-is-collapsed') && e.clientX <= 25) {
        let isEdgeDragging = true;
        let startX = e.clientX;
        sidebar.style.transition = 'none';

        const onEdgeMove = (moveEvt) => {
          if (!isEdgeDragging) return;
          const delta = Math.max(0, Math.min(260, moveEvt.clientX - startX));
          sidebar.style.transform = `translateX(calc(-100% + ${delta}px))`;
        };

        const onEdgeUp = (upEvt) => {
          isEdgeDragging = false;
          window.removeEventListener('pointermove', onEdgeMove);
          window.removeEventListener('pointerup', onEdgeUp);
          sidebar.style.transition = '';
          sidebar.style.transform = '';
          if (upEvt.clientX - startX > 50) {
            setCollapsed(false, true);
          }
        };

        window.addEventListener('pointermove', onEdgeMove);
        window.addEventListener('pointerup', onEdgeUp);
      }
    });

    window.toggleSidebar = (forceState) => {
      const isCurrentlyCollapsed = document.body.classList.contains('sidebar-is-collapsed');
      const target = forceState !== undefined ? forceState : !isCurrentlyCollapsed;
      setCollapsed(target, true);
    };
  }

  initSidebarToggle();
});

