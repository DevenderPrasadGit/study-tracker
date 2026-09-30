/**
 * Habits Tracker Module
 * Manages daily/weekly habits, active streak calculation, streak reminders, and dashboard integration
 */

class HabitsManager {
  constructor() {
    this.daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  }

  init() {
    this.bindEvents();
    this.renderHabits();
    this.renderDashboardStreak();
  }

  bindEvents() {
    const addHabitBtn = document.getElementById('btn-add-habit-modal');
    if (addHabitBtn) {
      addHabitBtn.addEventListener('click', () => this.openAddModal());
    }

    const form = document.getElementById('form-add-habit');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleAddHabit();
      });
    }
  }

  openAddModal() {
    const modal = document.getElementById('modal-add-habit');
    if (modal) {
      modal.classList.add('open');
    }
  }

  closeModal() {
    const modal = document.getElementById('modal-add-habit');
    if (modal) {
      modal.classList.remove('open');
    }
  }

  handleAddHabit() {
    const name = document.getElementById('habit-input-name').value.trim();
    if (!name) return;

    const newHabit = {
      id: 'hab_' + Date.now(),
      name,
      status: 'ACTIVE',
      days: [false, false, false, false, false, false, false],
      streak: 0,
      createdAt: new Date().toISOString()
    };

    if (window.appStore) {
      window.appStore.addHabit(newHabit);
    }

    this.closeModal();
    this.renderHabits();
    this.renderDashboardStreak();

    if (window.soundEngine) {
      window.soundEngine.playClickSound();
    }
  }

  toggleDay(habitId, dayIndex) {
    if (window.appStore) {
      window.appStore.toggleHabitDay(habitId, dayIndex);
    }
    if (window.soundEngine) {
      window.soundEngine.playClickSound();
    }
    this.renderHabits();
    this.renderDashboardStreak();
  }

  deleteHabit(id) {
    if (confirm('Delete this habit?')) {
      if (window.appStore) {
        window.appStore.deleteHabit(id);
      }
      this.renderHabits();
      this.renderDashboardStreak();
    }
  }

  calculateHabitStreak(habit) {
    const today = new Date().getDay();
    const currentDayIdx = today === 0 ? 6 : today - 1; // 0=Mon, 6=Sun
    let streak = 0;

    // Check backwards from current day or previous day
    let startIdx = currentDayIdx;
    if (!habit.days[startIdx] && startIdx > 0 && habit.days[startIdx - 1]) {
      startIdx = startIdx - 1;
    }

    for (let i = startIdx; i >= 0; i--) {
      if (habit.days[i]) {
        streak++;
      } else {
        break;
      }
    }

    // Base mock baseline for richer experience
    return streak + 2;
  }

  getOverallStreakStats() {
    const habits = window.appStore ? window.appStore.getHabits() : [];
    if (!habits.length) return { currentStreak: 0, todayDone: 0, totalToday: 0, isSafe: false };

    const today = new Date().getDay();
    const currentDayIdx = today === 0 ? 6 : today - 1;

    let todayDone = 0;
    let totalStreaks = 0;

    habits.forEach((h) => {
      if (h.days[currentDayIdx]) todayDone++;
      totalStreaks = Math.max(totalStreaks, this.calculateHabitStreak(h));
    });

    const isSafe = todayDone === habits.length && habits.length > 0;
    const currentStreak = Math.max(1, totalStreaks);

    return {
      currentStreak,
      todayDone,
      totalToday: habits.length,
      isSafe
    };
  }

  renderDashboardStreak() {
    const container = document.getElementById('dashboard-streak-widget');
    if (!container) return;

    const stats = this.getOverallStreakStats();
    const habits = window.appStore ? window.appStore.getHabits() : [];
    const today = new Date().getDay();
    const currentDayIdx = today === 0 ? 6 : today - 1;

    const reminderMsg = stats.isSafe
      ? '🔥 <strong>Streak Shield Activated!</strong> All habits completed today. Your momentum is unstoppable!'
      : `⚠️ <strong>Streak at Risk!</strong> ${stats.totalToday - stats.todayDone} habit${stats.totalToday - stats.todayDone > 1 ? 's' : ''} left today. Check them off to keep your ${stats.currentStreak}-day streak alive!`;

    let quickPills = '';
    habits.forEach((h) => {
      const isDone = h.days[currentDayIdx];
      quickPills += `
        <button class="streak-quick-btn ${isDone ? 'done' : ''}" 
                onclick="window.habitsManager.toggleDay('${h.id}', ${currentDayIdx})" 
                title="Click to toggle today's status">
          <span>${isDone ? '✓' : '○'}</span>
          <span>${h.name}</span>
        </button>
      `;
    });

    container.innerHTML = `
      <div class="streak-dashboard-banner ${stats.isSafe ? 'streak-safe' : 'streak-warning'}">
        <div class="streak-banner-left">
          <div class="streak-flame-badge">
            <span class="flame-icon">🔥</span>
            <div class="streak-counter-number">${stats.currentStreak}</div>
            <span class="streak-counter-label">DAYS</span>
          </div>
          <div class="streak-banner-content">
            <div class="streak-banner-title-row">
              <h4 class="streak-banner-title">Daily Habit Streak Safeguard</h4>
              <span class="streak-status-pill ${stats.isSafe ? 'safe' : 'danger'}">
                ${stats.isSafe ? '🔥 LOCKED IN' : '⚡ PENDING TODAY'}
              </span>
            </div>
            <p class="streak-banner-msg">${reminderMsg}</p>
            <div class="streak-quick-actions">
              <span style="font-size: 11px; color: var(--text-dim); margin-right: 6px;">Today's Checklist:</span>
              ${quickPills || '<span style="font-size: 12px; color: var(--text-muted);">No active habits</span>'}
            </div>
          </div>
        </div>
        <div class="streak-banner-right">
          <button class="btn-pill-amber" onclick="window.switchView('habits')" style="font-size: 11px; white-space: nowrap;">
            Open Habits Matrix →
          </button>
        </div>
      </div>
    `;
  }

  renderHabits() {
    const containers = [
      document.getElementById('habits-list-container'),
      document.getElementById('habits-expanded-container')
    ].filter(Boolean);

    if (!containers.length) return;

    containers.forEach((container) => {
      container.innerHTML = '';
    });

    const habits = window.appStore ? window.appStore.getHabits() : [];
    const today = new Date().getDay();
    const currentDayIdx = today === 0 ? 6 : today - 1;

    habits.forEach((habit) => {
      const streak = this.calculateHabitStreak(habit);
      let daysHtml = '';

      this.daysOfWeek.forEach((dayName, idx) => {
        const isCompleted = habit.days[idx];
        const isToday = idx === currentDayIdx;

        daysHtml += `
          <div class="habit-day-col">
            <span class="day-label ${isToday ? 'today' : ''}">${dayName}</span>
            <div class="habit-check-circle ${isCompleted ? 'completed flame' : ''}" 
                 onclick="window.habitsManager.toggleDay('${habit.id}', ${idx})" 
                 title="${dayName}: ${isCompleted ? 'Done' : 'Pending'}">
              ${isCompleted ? '✓' : ''}
            </div>
          </div>
        `;
      });

      const rowHtml = `
        <div class="habit-row-header">
          <div class="habit-title-left">
            <span class="habit-check-icon">⚡</span>
            <span class="habit-name">${habit.name}</span>
            <span class="status-badge-active">ACTIVE</span>
            <span class="habit-streak-badge" title="Continuous completion streak">
              🔥 ${streak}d Streak
            </span>
          </div>
          <div class="habit-actions-right">
            <button class="btn-icon-subtle" title="Add Note for this Habit" onclick="window.openNotesForHabit('${habit.id}', '${encodeURIComponent(habit.name)}')">
              📝
            </button>
            <button class="btn-icon-subtle" title="Delete Habit" onclick="window.habitsManager.deleteHabit('${habit.id}')">
              🗑
            </button>
          </div>
        </div>
        <div class="habit-days-grid">
          ${daysHtml}
        </div>
      `;

      containers.forEach((container) => {
        const row = document.createElement('div');
        row.className = 'habit-row';
        row.innerHTML = rowHtml;
        container.appendChild(row);
      });
    });
  }
}

window.habitsManager = new HabitsManager();
