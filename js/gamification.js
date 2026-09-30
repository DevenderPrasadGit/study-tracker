/**
 * Gamification, Quests & Achievement Engine
 * Features unlockable pixel badges, daily study quests, avatar customizer, and XP rank progression
 */

class GamificationEngine {
  constructor() {
    this.achievements = [
      {
        id: 'ach_first_step',
        title: 'First Voyage',
        description: 'Complete your first focus session',
        icon: '⛵',
        unlocked: true,
        xp: 150
      },
      {
        id: 'ach_deep_diver',
        title: 'Deep Flow',
        description: 'Log over 2 hours of focus in a single day',
        icon: '🌊',
        unlocked: true,
        xp: 300
      },
      {
        id: 'ach_night_owl',
        title: 'Midnight Scholar',
        description: 'Study between 10:00 PM and 4:00 AM',
        icon: '🌙',
        unlocked: true,
        xp: 250
      },
      {
        id: 'ach_habit_master',
        title: 'Iron Discipline',
        description: 'Maintain a 5-day habit streak',
        icon: '🔥',
        unlocked: false,
        xp: 500
      },
      {
        id: 'ach_century',
        title: 'Century Scholar',
        description: 'Reach 100 total hours of focus',
        icon: '👑',
        unlocked: false,
        xp: 1000
      }
    ];

    this.dailyQuests = [
      { id: 'q_1', title: 'Complete 2 Pomodoro sessions', rewardXP: 100, completed: true },
      { id: 'q_2', title: 'Check off at least 2 habits today', rewardXP: 80, completed: true },
      { id: 'q_3', title: 'Log a study session for Reading', rewardXP: 120, completed: false }
    ];

    this.avatars = [
      { id: 'cat', name: 'Cosmic Cat', src: 'assets/images/pixel_cat.jpg' },
      { id: 'fox', name: 'Twilight Kitsune', icon: '🦊' },
      { id: 'owl', name: 'Wisdom Owl', icon: '🦉' },
      { id: 'scholar', name: 'Astral Scholar', icon: '🧙' }
    ];
  }

  init() {
    this.bindEvents();
    this.renderQuests();
    this.renderAchievements();
  }

  bindEvents() {
    // Nav to achievements
    const achBtn = document.getElementById('btn-open-achievements');
    if (achBtn) {
      achBtn.addEventListener('click', () => {
        const modal = document.getElementById('modal-achievements');
        if (modal) modal.classList.add('open');
      });
    }

    // Avatar customizer trigger
    const profileBadge = document.querySelector('.user-profile-badge');
    if (profileBadge) {
      profileBadge.addEventListener('click', () => {
        const modal = document.getElementById('modal-avatar-picker');
        if (modal) modal.classList.add('open');
      });
    }
  }

  renderQuests() {
    const container = document.getElementById('daily-quests-container');
    if (!container) return;

    container.innerHTML = '';
    this.dailyQuests.forEach((q) => {
      const row = document.createElement('div');
      row.className = `quest-item-row ${q.completed ? 'completed' : ''}`;
      row.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
          <div class="custom-checkbox">${q.completed ? '✓' : ''}</div>
          <span style="font-size: 13px; color: ${q.completed ? 'var(--text-muted)' : '#fff'}; ${q.completed ? 'text-decoration: line-through;' : ''}">
            ${q.title}
          </span>
        </div>
        <span class="category-tag tag-education" style="font-size: 10px; font-family: var(--font-digital);">
          +${q.rewardXP} XP
        </span>
      `;
      container.appendChild(row);
    });
  }

  renderAchievements() {
    const grid = document.getElementById('achievements-grid');
    if (!grid) return;

    grid.innerHTML = '';
    this.achievements.forEach((ach) => {
      const card = document.createElement('div');
      card.className = `achievement-badge-card ${ach.unlocked ? 'unlocked' : 'locked'}`;
      card.innerHTML = `
        <div class="ach-icon-circle">${ach.icon}</div>
        <div class="ach-info">
          <div class="ach-title">${ach.title}</div>
          <div class="ach-desc">${ach.description}</div>
          <div class="ach-reward">+${ach.xp} XP ${ach.unlocked ? '• UNLOCKED' : '• LOCKED'}</div>
        </div>
      `;
      grid.appendChild(card);
    });
  }

  unlockAchievement(id) {
    const ach = this.achievements.find((a) => a.id === id);
    if (ach && !ach.unlocked) {
      ach.unlocked = true;
      if (window.soundEngine) {
        window.soundEngine.playLevelUpFanfare();
      }
      if (window.showNotificationModal) {
        window.showNotificationModal('Achievement Unlocked! 🏆', `You earned the "${ach.title}" badge (+${ach.xp} XP)!`);
      }
      this.renderAchievements();
    }
  }
}

window.gamificationEngine = new GamificationEngine();
