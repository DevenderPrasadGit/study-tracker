/**
 * Habits Tracker Module
 * Manages daily/weekly habits, streaks, and flame status
 */

class HabitsManager {
  constructor() {
    this.daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  }

  init() {
    this.bindEvents();
    this.renderHabits();
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
      days: [false, false, false, false, false, false, false]
    };

    if (window.appStore) {
      window.appStore.addHabit(newHabit);
    }

    this.closeModal();
    this.renderHabits();

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
  }

  deleteHabit(id) {
    if (confirm('Delete this habit?')) {
      if (window.appStore) {
        window.appStore.deleteHabit(id);
      }
      this.renderHabits();
    }
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
          </div>
          <div class="habit-actions-right">
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
