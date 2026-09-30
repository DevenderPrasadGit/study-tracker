/**
 * Events & Study Schedule Manager
 * Allows scheduling study blocks, exams, assignment deadlines, skill mastery milestones, and custom reminders
 */

class EventsManager {
  constructor() {
    this.currentFilter = 'all';
  }

  init() {
    this.bindEvents();
    this.renderEvents();
  }

  bindEvents() {
    const chips = document.querySelectorAll('[data-event-filter]');
    chips.forEach((chip) => {
      chip.addEventListener('click', (e) => {
        chips.forEach((c) => c.classList.remove('active'));
        e.currentTarget.classList.add('active');
        this.currentFilter = e.currentTarget.getAttribute('data-event-filter');
        this.renderEvents();
      });
    });

    const addBtn = document.getElementById('btn-add-event-modal');
    if (addBtn) {
      addBtn.addEventListener('click', () => this.openAddModal());
    }

    const form = document.getElementById('form-add-event');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleCreateEvent();
      });
    }

    // Toggle skill-specific input fields when skill type is chosen
    const typeSelect = document.getElementById('event-input-type');
    if (typeSelect) {
      typeSelect.addEventListener('change', (e) => {
        const skillGroup = document.getElementById('event-skill-custom-fields');
        if (skillGroup) {
          skillGroup.style.display = e.target.value === 'skill' ? 'block' : 'none';
        }
      });
    }
  }

  openAddModal(prefillType = null) {
    const modal = document.getElementById('modal-add-event');
    if (modal) {
      modal.classList.add('open');
      const dateInput = document.getElementById('event-input-date');
      if (dateInput) {
        dateInput.value = new Date().toISOString().split('T')[0];
      }
      if (prefillType) {
        const typeSelect = document.getElementById('event-input-type');
        if (typeSelect) {
          typeSelect.value = prefillType;
          typeSelect.dispatchEvent(new Event('change'));
        }
      }
    }
  }

  closeModal() {
    const modal = document.getElementById('modal-add-event');
    if (modal) {
      modal.classList.remove('open');
      delete modal.dataset.editId;
      const header = modal.querySelector('.modal-title');
      if (header) header.textContent = '📅 Add Study Event / Deadline';
      const submitBtn = modal.querySelector('button[type="submit"]');
      if (submitBtn) submitBtn.textContent = 'Save Event';
      document.getElementById('form-add-event').reset();
    }
  }

  openEditModal(id) {
    const events = window.appStore ? window.appStore.getEvents() : [];
    const evt = events.find((e) => e.id === id);
    if (!evt) return;
    const modal = document.getElementById('modal-add-event');
    if (!modal) return;
    // Pre-fill fields
    document.getElementById('event-input-title').value = evt.title || '';
    document.getElementById('event-input-type').value = evt.type || 'study';
    document.getElementById('event-input-date').value = evt.date || '';
    document.getElementById('event-input-time').value = evt.time || '10:00';
    document.getElementById('event-input-duration').value = evt.durationMinutes || 60;
    document.getElementById('event-input-notes').value = evt.notes || '';
    // Skill fields
    const skDl = document.getElementById('event-input-skill-deadline');
    const skRem = document.getElementById('event-input-reminder');
    const skLvl = document.getElementById('event-input-skill-level');
    const skHrs = document.getElementById('event-input-skill-hours');
    if (skDl) skDl.value = evt.skillDeadline || '';
    if (skRem) skRem.value = evt.reminder || '1 day before';
    if (skLvl) skLvl.value = evt.skillLevel || 'Intermediate';
    if (skHrs) skHrs.value = evt.skillTargetHours || 20;
    // Trigger skill fields visibility
    const skillGroup = document.getElementById('event-skill-custom-fields');
    if (skillGroup) skillGroup.style.display = evt.type === 'skill' ? 'block' : 'none';
    // Switch modal to edit mode
    modal.dataset.editId = id;
    modal.querySelector('.modal-title').textContent = '✏️ Edit Event';
    modal.querySelector('button[type="submit"]').textContent = 'Save Changes';
    modal.classList.add('open');
  }

  handleCreateEvent() {
    const title = document.getElementById('event-input-title').value.trim();
    const type = document.getElementById('event-input-type').value;
    const date = document.getElementById('event-input-date').value;
    const time = document.getElementById('event-input-time').value || '10:00';
    const duration = parseInt(document.getElementById('event-input-duration').value || '60', 10);
    const notes = document.getElementById('event-input-notes').value.trim();
    
    // Skill & Reminder specific inputs
    const skillDeadline = document.getElementById('event-input-skill-deadline') 
      ? document.getElementById('event-input-skill-deadline').value 
      : '';
    const reminder = document.getElementById('event-input-reminder') 
      ? document.getElementById('event-input-reminder').value 
      : '1 day before';
    const skillLevel = document.getElementById('event-input-skill-level')
      ? document.getElementById('event-input-skill-level').value
      : 'Intermediate';
    const skillTargetHours = document.getElementById('event-input-skill-hours')
      ? parseInt(document.getElementById('event-input-skill-hours').value || '20', 10)
      : 20;

    if (!title || !date) {
      alert('Please enter an event title and date.');
      return;
    }

    const changes = { title, type, date, time, durationMinutes: duration, notes, skillDeadline, reminder, skillLevel, skillTargetHours };

    const modal = document.getElementById('modal-add-event');
    const editId = modal ? modal.dataset.editId : null;

    if (editId) {
      if (window.appStore) window.appStore.updateEvent(editId, changes);
    } else {
      const newEvent = { id: 'evt_' + Date.now(), ...changes, completed: false };
      if (window.appStore) window.appStore.addEvent(newEvent);
    }

    this.closeModal();
    this.renderEvents();

    if (window.soundEngine) {
      window.soundEngine.playClickSound();
    }
  }

  deleteEvent(id) {
    if (confirm('Delete this event?')) {
      if (window.appStore) {
        window.appStore.deleteEvent(id);
      }
      this.renderEvents();
    }
  }

  renderEvents() {
    const grid = document.getElementById('events-cards-grid');
    if (!grid) return;

    grid.innerHTML = '';
    const events = window.appStore ? window.appStore.getEvents() : [];

    // Filter events
    const filtered = events.filter((e) => {
      if (this.currentFilter === 'all') return true;
      return e.type === this.currentFilter;
    });

    // Update nav counter
    const countBadge = document.getElementById('nav-events-count');
    if (countBadge) {
      countBadge.textContent = events.length;
    }

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--text-dim);">
          <div style="font-size: 32px; margin-bottom: 8px;">📅</div>
          <p>No events found for this filter. Click "+ Add Event" to plan your next milestone or skill!</p>
        </div>
      `;
      return;
    }

    filtered.forEach((evt) => {
      const card = document.createElement('div');
      card.className = 'glass-card event-card';

      let typeBadge = '';
      let typeBorder = 'rgba(245, 166, 35, 0.2)';
      let icon = '📖';

      switch (evt.type) {
        case 'exam':
          icon = '🎯';
          typeBadge = '<span class="event-type-badge exam">EXAM</span>';
          typeBorder = 'rgba(239, 68, 68, 0.4)';
          break;
        case 'assignment':
          icon = '📝';
          typeBadge = '<span class="event-type-badge assignment">ASSIGNMENT</span>';
          typeBorder = 'rgba(192, 132, 252, 0.4)';
          break;
        case 'skill':
          icon = '🌟';
          typeBadge = '<span class="event-type-badge skill" style="background: rgba(45, 212, 191, 0.2); color: var(--accent-teal); border: 1px solid var(--accent-teal);">SKILL MASTERY</span>';
          typeBorder = 'rgba(45, 212, 191, 0.4)';
          break;
        case 'lecture':
          icon = '🎓';
          typeBadge = '<span class="event-type-badge lecture">LECTURE</span>';
          typeBorder = 'rgba(59, 130, 246, 0.4)';
          break;
        default:
          icon = '📖';
          typeBadge = '<span class="event-type-badge study">STUDY BLOCK</span>';
          typeBorder = 'rgba(245, 166, 35, 0.4)';
      }

      card.style.borderColor = typeBorder;

      // Skill extra badge
      let skillInfoHtml = '';
      if (evt.type === 'skill' || evt.skillDeadline) {
        let deadlineNotice = '';
        if (evt.skillDeadline) {
          const daysLeft = Math.ceil((new Date(evt.skillDeadline) - new Date()) / (1000 * 60 * 60 * 24));
          const dlText = daysLeft > 0 ? `${daysLeft} days remaining` : (daysLeft === 0 ? 'Due Today!' : 'Target Passed');
          deadlineNotice = `<div style="font-size: 11px; color: var(--accent-teal);"><span style="color: var(--accent-gold);">⏳ Target Deadline:</span> ${evt.skillDeadline} (${dlText})</div>`;
        }
        skillInfoHtml = `
          <div style="margin-top: 10px; padding: 8px 12px; background: rgba(45, 212, 191, 0.08); border-radius: 8px; border: 1px dashed rgba(45, 212, 191, 0.25);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
              <span style="font-size: 11px; font-weight: 700; color: #fff;">Skill Goal: ${evt.skillLevel || 'Proficiency'}</span>
              <span style="font-size: 11px; color: var(--accent-teal); font-family: var(--font-digital);">${evt.skillTargetHours || 20}h Target</span>
            </div>
            ${deadlineNotice}
          </div>
        `;
      }

      // Reminder badge
      const reminderPill = evt.reminder 
        ? `<span class="reminder-tag-pill" title="Dedicated alert: ${evt.reminder}">🔔 Reminder: ${evt.reminder}</span>` 
        : '';

      card.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
          <div style="display: flex; gap: 8px; align-items: center;">
            <span style="font-size: 20px;">${icon}</span>
            ${typeBadge}
          </div>
          <div style="display: flex; gap: 6px;">
            <button class="btn-icon-subtle" title="Edit Event" onclick="window.eventsManager.openEditModal('${evt.id}')">
              ✏️
            </button>
            <button class="btn-icon-subtle" title="Add Note for this Event" onclick="window.openNotesForEvent('${evt.id}', '${encodeURIComponent(evt.title)}')">
              📝
            </button>
            <button class="btn-icon-subtle" title="Delete Event" onclick="window.eventsManager.deleteEvent('${evt.id}')">
              🗑
            </button>
          </div>
        </div>

        <h4 style="font-size: 15px; font-weight: 700; color: #fff; margin-bottom: 8px; line-height: 1.4;">${evt.title}</h4>

        <div style="display: flex; flex-wrap: wrap; gap: 10px; font-size: 12px; color: var(--text-dim); margin-bottom: 8px;">
          <span>📅 ${evt.date}</span>
          <span>⏰ ${evt.time}</span>
          <span>⏱ ${evt.durationMinutes} mins</span>
        </div>

        <div style="margin-bottom: 8px;">
          ${reminderPill}
        </div>

        ${skillInfoHtml}

        ${evt.notes ? `<div style="font-size: 12px; color: var(--text-muted); line-height: 1.5; margin-top: 8px; padding-top: 8px; border-top: 1px solid var(--card-border-subtle);">${evt.notes}</div>` : ''}

        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 14px; padding-top: 10px; border-top: 1px solid var(--card-border-subtle);">
          <button class="btn-pill-amber" onclick="window.focusTimer.setSubject('${evt.title.replace(/'/g, "\\'")}'); window.switchView('focus');" style="font-size: 11px; padding: 4px 10px;">
            ▶ Start Focus Block
          </button>
          <button class="btn-icon-subtle" onclick="window.eventsManager.exportSingleToGoogleCal('${evt.id}')" title="Add to Google Calendar" style="font-size: 11px; color: var(--accent-gold);">
            + Google Cal
          </button>
        </div>
      `;

      grid.appendChild(card);
    });
  }

  exportSingleToGoogleCal(eventId) {
    const events = window.appStore ? window.appStore.getEvents() : [];
    const evt = events.find((e) => e.id === eventId);
    if (!evt) return;

    const startDateTime = new Date(`${evt.date}T${evt.time}:00`);
    const endDateTime = new Date(startDateTime.getTime() + (evt.durationMinutes || 60) * 60 * 1000);

    const formatGCal = (d) => d.toISOString().replace(/-|:|\.\d\d\d/g, '');
    const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(evt.title)}&dates=${formatGCal(startDateTime)}/${formatGCal(endDateTime)}&details=${encodeURIComponent(evt.notes || 'Timylabs Focus Session')}&location=Study%20Sanctuary`;

    window.open(gcalUrl, '_blank');
  }

  exportAllToICal() {
    const events = window.appStore ? window.appStore.getEvents() : [];
    if (!events.length) {
      alert('No events to export!');
      return;
    }

    let icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Timylabs//Nostalgic Study Tracker//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH'
    ];

    events.forEach((evt) => {
      const startDateTime = new Date(`${evt.date}T${evt.time}:00`);
      const endDateTime = new Date(startDateTime.getTime() + (evt.durationMinutes || 60) * 60 * 1000);
      const formatICS = (d) => d.toISOString().replace(/-|:|\.\d\d\d/g, '').slice(0, 15) + 'Z';

      icsContent.push('BEGIN:VEVENT');
      icsContent.push(`UID:${evt.id}@timylabs.local`);
      icsContent.push(`DTSTAMP:${formatICS(new Date())}`);
      icsContent.push(`DTSTART:${formatICS(startDateTime)}`);
      icsContent.push(`DTEND:${formatICS(endDateTime)}`);
      icsContent.push(`SUMMARY:${evt.title}`);
      icsContent.push(`DESCRIPTION:${(evt.notes || 'Timylabs Focus Session').replace(/\n/g, '\\n')}`);
      icsContent.push('END:VEVENT');
    });

    icsContent.push('END:VCALENDAR');

    const blob = new Blob([icsContent.join('\r\n')], { type: 'text/calendar;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `study_schedule_${new Date().toISOString().split('T')[0]}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

window.eventsManager = new EventsManager();
