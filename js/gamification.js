/**
 * Gamification, Quests, Achievement Engine & Animated Companion Sanctuary
 * Features unlockable pixel badges, daily study quests, and 4 animated companions: Cat, Dog, Elephant, Hamster
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
        unlocked: true,
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

    this.companions = {
      cat: {
        id: 'cat',
        name: 'Mochi',
        species: 'Cosmic Cat',
        tagline: 'Purrs of deep focus and quiet midnight companionship.',
        color: '#ffbe53'
      },
      dog: {
        id: 'dog',
        name: 'Barnaby',
        species: 'Golden Pup',
        tagline: 'Boundless enthusiasm, tail wags, and study motivation!',
        color: '#f59e0b'
      },
      elephant: {
        id: 'elephant',
        name: 'Ganesh',
        species: 'Wise Elephant',
        tagline: 'Unshakable memory, calm patience, and obstacle removal.',
        color: '#60a5fa'
      },
      hamster: {
        id: 'hamster',
        name: 'Peanut',
        species: 'Focus Hamster',
        tagline: 'Tiny steps add up to monumental academic triumphs.',
        color: '#fb923c'
      }
    };
  }

  init() {
    this.bindEvents();
    this.renderQuests();
    this.renderAchievements();
    this.initCurrentCompanion();
  }

  getCompanionSvg(type, size = 64) {
    switch (type) {
      case 'cat':
        return `
          <svg class="anim-companion anim-cat" width="${size}" height="${size}" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="50" cy="58" rx="26" ry="24" fill="#f59e0b" />
            <!-- Ears -->
            <polygon class="cat-ear-left" points="26,42 34,16 46,38" fill="#d97706" />
            <polygon points="29,40 35,22 43,37" fill="#fde68a" />
            <polygon class="cat-ear-right" points="74,42 66,16 54,38" fill="#d97706" />
            <polygon points="71,40 65,22 57,37" fill="#fde68a" />
            <!-- Head -->
            <circle cx="50" cy="46" r="24" fill="#fbbf24" />
            <!-- Eyes -->
            <ellipse class="cat-eye" cx="40" cy="44" rx="3.5" ry="4.5" fill="#1e1b4b" />
            <ellipse class="cat-eye" cx="60" cy="44" rx="3.5" ry="4.5" fill="#1e1b4b" />
            <circle cx="41" cy="42.5" r="1.2" fill="#ffffff" />
            <circle cx="61" cy="42.5" r="1.2" fill="#ffffff" />
            <!-- Nose & Mouth -->
            <polygon points="48,51 52,51 50,54" fill="#f43f5e" />
            <path d="M46 55 Q50 58 54 55" stroke="#78350f" stroke-width="1.8" stroke-linecap="round" fill="none" />
            <!-- Whiskers -->
            <line x1="28" y1="49" x2="16" y2="47" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" />
            <line x1="28" y1="53" x2="15" y2="55" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" />
            <line x1="72" y1="49" x2="84" y2="47" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" />
            <line x1="72" y1="53" x2="85" y2="55" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" />
            <!-- Collar & Bell -->
            <rect x="36" y="66" width="28" height="5" rx="2.5" fill="#ef4444" />
            <circle cx="50" cy="73" r="4.5" fill="#fbbf24" stroke="#d97706" stroke-width="1" />
            <!-- Tail -->
            <path class="cat-tail" d="M72 70 Q88 64 85 48" stroke="#d97706" stroke-width="6" stroke-linecap="round" fill="none" />
          </svg>
        `;

      case 'dog':
        return `
          <svg class="anim-companion anim-dog" width="${size}" height="${size}" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="50" cy="62" rx="26" ry="22" fill="#b45309" />
            <!-- Tail -->
            <path class="dog-tail" d="M74 65 Q92 56 88 42" stroke="#92400e" stroke-width="6.5" stroke-linecap="round" fill="none" />
            <!-- Ears -->
            <ellipse class="dog-ear-left" cx="24" cy="46" rx="9" ry="18" fill="#78350f" transform="rotate(-15 24 46)" />
            <ellipse class="dog-ear-right" cx="76" cy="46" rx="9" ry="18" fill="#78350f" transform="rotate(15 76 46)" />
            <!-- Head -->
            <circle cx="50" cy="44" r="23" fill="#d97706" />
            <!-- Snout -->
            <ellipse cx="50" cy="52" rx="14" ry="10" fill="#fef3c7" />
            <ellipse cx="50" cy="48" rx="5" ry="3.5" fill="#1e1b4b" />
            <path d="M50 51.5 L50 55 M46 55 Q50 58 54 55" stroke="#1e1b4b" stroke-width="1.8" stroke-linecap="round" fill="none" />
            <!-- Tongue -->
            <path class="dog-tongue" d="M48 57 Q50 63 52 57 Z" fill="#f43f5e" />
            <!-- Eyes -->
            <circle class="dog-eye" cx="39" cy="39" r="3.8" fill="#1e1b4b" />
            <circle class="dog-eye" cx="61" cy="39" r="3.8" fill="#1e1b4b" />
            <circle cx="40" cy="37.5" r="1.3" fill="#ffffff" />
            <circle cx="62" cy="37.5" r="1.3" fill="#ffffff" />
            <!-- Bandana -->
            <polygon points="34,64 66,64 50,76" fill="#3b82f6" />
            <circle cx="50" cy="67" r="2" fill="#ffffff" />
          </svg>
        `;

      case 'elephant':
        return `
          <svg class="anim-companion anim-elephant" width="${size}" height="${size}" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="50" cy="62" rx="28" ry="24" fill="#64748b" />
            <!-- Huge Ears -->
            <ellipse class="elephant-ear-left" cx="20" cy="44" rx="16" ry="22" fill="#94a3b8" />
            <ellipse cx="22" cy="44" rx="10" ry="15" fill="#fbcfe8" opacity="0.6" />
            <ellipse class="elephant-ear-right" cx="80" cy="44" rx="16" ry="22" fill="#94a3b8" />
            <ellipse cx="78" cy="44" rx="10" ry="15" fill="#fbcfe8" opacity="0.6" />
            <!-- Head -->
            <circle cx="50" cy="44" r="22" fill="#94a3b8" />
            <!-- Eyes -->
            <ellipse class="elephant-eye" cx="39" cy="40" rx="3" ry="3.5" fill="#0f172a" />
            <ellipse class="elephant-eye" cx="61" cy="40" rx="3" ry="3.5" fill="#0f172a" />
            <circle cx="40" cy="39" r="1" fill="#ffffff" />
            <circle cx="62" cy="39" r="1" fill="#ffffff" />
            <!-- Tusks -->
            <path d="M42 54 Q40 60 36 60" stroke="#fef08a" stroke-width="3" stroke-linecap="round" fill="none" />
            <path d="M58 54 Q60 60 64 60" stroke="#fef08a" stroke-width="3" stroke-linecap="round" fill="none" />
            <!-- Trunk -->
            <path class="elephant-trunk" d="M50 48 Q50 66 54 74 Q58 80 64 74" stroke="#64748b" stroke-width="7" stroke-linecap="round" fill="none" />
            <!-- Crown / Headband -->
            <rect x="42" y="24" width="16" height="4" rx="2" fill="#f59e0b" />
            <circle cx="50" cy="22" r="3" fill="#ef4444" />
          </svg>
        `;

      case 'hamster':
        return `
          <svg class="anim-companion anim-hamster" width="${size}" height="${size}" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="50" cy="62" rx="27" ry="24" fill="#ea580c" />
            <!-- White belly -->
            <ellipse cx="50" cy="66" rx="17" ry="18" fill="#fff7ed" />
            <!-- Round Ears -->
            <circle class="hamster-ear-left" cx="28" cy="28" r="9" fill="#ea580c" />
            <circle cx="28" cy="28" r="5.5" fill="#fda4af" />
            <circle class="hamster-ear-right" cx="72" cy="28" r="9" fill="#ea580c" />
            <circle cx="72" cy="28" r="5.5" fill="#fda4af" />
            <!-- Head & Puffy Cheeks -->
            <circle cx="50" cy="46" r="22" fill="#f97316" />
            <ellipse class="hamster-cheek-left" cx="34" cy="52" rx="10" ry="9" fill="#ffedd5" />
            <ellipse class="hamster-cheek-right" cx="66" cy="52" rx="10" ry="9" fill="#ffedd5" />
            <!-- Eyes -->
            <circle class="hamster-eye" cx="40" cy="41" r="3.8" fill="#18181b" />
            <circle class="hamster-eye" cx="60" cy="41" r="3.8" fill="#18181b" />
            <circle cx="41" cy="39.5" r="1.4" fill="#ffffff" />
            <circle cx="61" cy="39.5" r="1.4" fill="#ffffff" />
            <!-- Pink Nose & Cute Teeth -->
            <ellipse cx="50" cy="48" rx="2.5" ry="2" fill="#f43f5e" />
            <path d="M47 51 Q50 54 53 51" stroke="#431407" stroke-width="1.5" stroke-linecap="round" fill="none" />
            <!-- Little Paws & Study Sunflower Seed -->
            <ellipse cx="40" cy="68" rx="4.5" ry="4" fill="#ffedd5" />
            <ellipse cx="60" cy="68" rx="4.5" ry="4" fill="#ffedd5" />
            <!-- Sunflower Seed / Study Crystal -->
            <polygon class="hamster-seed" points="50,62 55,70 50,75 45,70" fill="#f59e0b" stroke="#78350f" stroke-width="1" />
          </svg>
        `;
      default:
        return this.getCompanionSvg('cat', size);
    }
  }

  initCurrentCompanion() {
    let compId = 'cat';
    if (window.appStore) {
      const user = window.appStore.getUser();
      if (user && user.companion) {
        compId = user.companion;
      }
    }
    this.selectCompanion(compId, false);
  }

  selectCompanion(type, notify = true) {
    if (!this.companions[type]) type = 'cat';

    if (window.appStore) {
      const user = window.appStore.getUser();
      user.companion = type;
      window.appStore.saveState();
    }

    // Update brand avatar in sidebar
    const brandAvatar = document.querySelector('.brand-avatar');
    if (brandAvatar) {
      brandAvatar.innerHTML = this.getCompanionSvg(type, 44);
    }

    // Update top header user profile
    const userProfileBadge = document.querySelector('.user-profile-badge');
    const existingAvatarImg = document.getElementById('user-avatar-img');
    if (userProfileBadge && existingAvatarImg) {
      const wrapper = document.createElement('div');
      wrapper.id = 'user-avatar-img';
      wrapper.className = 'user-profile-avatar-svg';
      wrapper.innerHTML = this.getCompanionSvg(type, 28);
      existingAvatarImg.replaceWith(wrapper);
    } else {
      const avatarSvg = document.querySelector('.user-profile-avatar-svg');
      if (avatarSvg) {
        avatarSvg.innerHTML = this.getCompanionSvg(type, 28);
      }
    }

    // Update Focus View companion widget
    const focusCompanion = document.getElementById('focus-view-companion-avatar');
    if (focusCompanion) {
      focusCompanion.innerHTML = this.getCompanionSvg(type, 84);
      const nameEl = document.getElementById('focus-companion-name');
      if (nameEl) nameEl.textContent = this.companions[type].name;
      const tagEl = document.getElementById('focus-companion-tag');
      if (tagEl) tagEl.textContent = this.companions[type].species;
    }

    // Update Modal active card highlight
    document.querySelectorAll('.companion-select-card').forEach((card) => {
      if (card.getAttribute('data-companion-id') === type) {
        card.classList.add('active');
      } else {
        card.classList.remove('active');
      }
    });

    if (notify && window.showNotificationModal) {
      const c = this.companions[type];
      window.showNotificationModal(
        `Companion Selected! ✨`,
        `${c.name} the ${c.species} is now by your side for your study voyage!`
      );
    }
  }

  renderCompanionPickerModal() {
    const container = document.getElementById('companion-picker-cards-grid');
    if (!container) return;

    let currentComp = 'cat';
    if (window.appStore && window.appStore.getUser()) {
      currentComp = window.appStore.getUser().companion || 'cat';
    }

    container.innerHTML = '';
    ['cat', 'dog', 'elephant', 'hamster'].forEach((id) => {
      const c = this.companions[id];
      const isSelected = id === currentComp;

      const card = document.createElement('div');
      card.className = `glass-card companion-select-card ${isSelected ? 'active' : ''}`;
      card.setAttribute('data-companion-id', id);
      card.onclick = () => {
        this.selectCompanion(id, true);
        const modal = document.getElementById('modal-avatar-picker');
        if (modal) modal.classList.remove('open');
      };

      card.innerHTML = `
        <div class="companion-svg-preview">
          ${this.getCompanionSvg(id, 72)}
        </div>
        <div class="companion-info-box">
          <div class="companion-name-row">
            <h4 class="companion-title">${c.name}</h4>
            <span class="companion-species-tag">${c.species}</span>
          </div>
          <p class="companion-desc">${c.tagline}</p>
          <div class="companion-choose-btn">
            ${isSelected ? '✓ Active Companion' : 'Choose Companion'}
          </div>
        </div>
      `;
      container.appendChild(card);
    });
  }

  bindEvents() {
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
        this.renderCompanionPickerModal();
        const modal = document.getElementById('modal-avatar-picker');
        if (modal) modal.classList.add('open');
      });
    }

    const brandAvatar = document.querySelector('.brand-section');
    if (brandAvatar) {
      brandAvatar.style.cursor = 'pointer';
      brandAvatar.addEventListener('click', () => {
        this.renderCompanionPickerModal();
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
          <span style="font-size: 16px;">${q.completed ? '✅' : '⏳'}</span>
          <div>
            <div style="font-size: 13px; font-weight: 600; color: #fff;">${q.title}</div>
            <div style="font-size: 11px; color: var(--accent-gold);">+${q.rewardXP} XP</div>
          </div>
        </div>
        <button class="btn-pill-amber" style="font-size: 11px; padding: 4px 10px;" ${q.completed ? 'disabled' : ''}>
          ${q.completed ? 'Claimed' : 'Progressing'}
        </button>
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
        <div class="achievement-icon">${ach.icon}</div>
        <div class="achievement-title">${ach.title}</div>
        <div class="achievement-desc">${ach.description}</div>
        <div class="achievement-xp">+${ach.xp} XP</div>
      `;
      grid.appendChild(card);
    });
  }
}

window.gamificationEngine = new GamificationEngine();
