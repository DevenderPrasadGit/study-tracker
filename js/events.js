/**
 * Events & Study Schedule Manager
 * Allows scheduling study blocks, exams, assignment deadlines, and lectures
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
  }

  openAddModal() {
    const modal = document.getElementById('modal-add-event');
    if (modal) {
      modal.classList.add('open');
      // Set default date to today
      const dateInput = document.getElementById('event-input-date');
      if (dateInput) {
        dateInput.value = new Date().toISOString().split('T')[0];
      }
    }
  }

  closeModal() {
    const modal = document.getElementById('modal-add-event');
    if (modal) {
      modal.classList.remove('open');
    }
  }

  handleCreateEvent() {
    const title = document.getElementById('event-input-title').value.trim();
    const type = document.getElementById('event-input-type').value;
    const date = document.getElementById('event-input-date').value;
    const time = document.getElementById('event-input-time').value || '10:00';
    const duration = parseInt(document.getElementById('event-input-duration').value || '60', 10);
    const notes = document.getElementById('event-input-notes').value.trim();

    if (!title || !date) {
      alert('Please enter an event title and date.');
      return;
    }

    const newEvent = {
      id: 'evt_' + Date.now(),
      title,
      type,
      date,
      time,
      durationMinutes: duration,
      notes,
      completed: false
    };

    if (window.appStore) {
      window.appStore.addEvent(newEvent);
    }

    this.closeModal();
    this.renderEvents();

    if (window.soundEngine) {
      window.soundEngine.playClickSound();
    }
  }

  renderEvents() {
    const grid = document.getElementById('events-cards-grid');
    if (!grid) return;

    grid.innerHTML = '';
    const events = window.appStore ? window.appStore.getEvents() : [];

    const filtered = events.filter((ev) => {
      if (this.currentFilter === 'all') return true;
      return ev.type === this.currentFilter;
    });

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--text-muted); background: var(--card-bg); border-radius: var(--radius-md); border: 1px dashed var(--card-border-subtle);">
          <div style="font-size: 28px; margin-bottom: 8px;">📅</div>
          <div style="font-size: 15px; font-weight: 600; color: #fff; margin-bottom: 4px;">No upcoming events found</div>
          <div style="font-size: 13px;">Click "+ Add Event" to plan study blocks, exams, or assignment deadlines!</div>
        </div>
      `;
      return;
    }

    const badge = document.getElementById('nav-events-count');
    if (badge) {
      badge.textContent = events.length;
    }

    filtered.forEach((ev) => {
      const card = document.createElement('div');
      card.className = `event-card type-${ev.type}`;

      // Calculate countdown string
      const eventTime = new Date(`${ev.date}T${ev.time || '00:00'}`).getTime();
      const diffMs = eventTime - Date.now();
      let diffStr = '';
      if (diffMs > 0) {
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const diffHrs = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        diffStr = diffDays > 0 ? `${diffDays}d ${diffHrs}h away` : `${diffHrs}h away`;
      } else {
        diffStr = 'Today / Past';
      }

      const typeLabels = {
        exam: '🎯 Exam / Test',
        assignment: '📝 Assignment Deadline',
        study: '📖 Study Session Block',
        lecture: '🎓 Class / Lecture'
      };

      card.innerHTML = `
        <div class="event-top-row">
          <span class="category-tag tag-education">${typeLabels[ev.type] || ev.type}</span>
          <span style="font-size: 11px; font-family: var(--font-digital); color: var(--accent-gold); font-weight: 700;">
            ${diffStr}
          </span>
        </div>
        <div>
          <h4 class="event-title">${ev.title}</h4>
          ${ev.notes ? `<p style="font-size: 12px; color: var(--text-dim); margin-top: 4px;">${ev.notes}</p>` : ''}
        </div>
        <div class="event-datetime">
          <span>📅 ${ev.date}</span>
          <span>⏰ ${ev.time} (${ev.durationMinutes} mins)</span>
        </div>
        <div class="event-actions-bar">
          <button class="btn-pill-amber" onclick="window.eventsManager.startFocusOnEvent('${ev.id}')">
            ▶ Start Focus
          </button>
          <div style="display: flex; gap: 6px; align-items: center;">
            <a href="${this.getGoogleCalendarUrl(ev)}" target="_blank" class="btn-icon-subtle" title="Add to Google Calendar" style="text-decoration: none; font-size: 13px;">
              📅
            </a>
            <button class="btn-icon-subtle" title="Delete Event" onclick="window.eventsManager.deleteEvent('${ev.id}')">
              🗑
            </button>
          </div>
        </div>
      `;
      grid.appendChild(card);
    });
  }

  getGoogleCalendarUrl(ev) {
    const startIso = (ev.date + 'T' + (ev.time || '10:00') + ':00').replace(/[-:]/g, '');
    const startDateObj = new Date(`${ev.date}T${ev.time || '10:00'}`);
    const endDateObj = new Date(startDateObj.getTime() + (ev.durationMinutes || 60) * 60000);
    const endIso = endDateObj.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

    const title = encodeURIComponent(`[Study] ${ev.title}`);
    const details = encodeURIComponent(ev.notes || 'Focus session tracked via Timylabs');
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startIso}/${endIso}&details=${details}`;
  }

  exportAllToICal() {
    const events = window.appStore ? window.appStore.getEvents() : [];
    if (!events.length) {
      alert('No events to export.');
      return;
    }

    let ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Timylabs//Nostalgic Study Tracker//EN',
      'CALSCALE:GREGORIAN'
    ];

    events.forEach((ev) => {
      const startClean = (ev.date.replace(/-/g, '') + 'T' + (ev.time || '10:00').replace(/:/g, '') + '00');
      const startMs = new Date(`${ev.date}T${ev.time || '10:00'}`).getTime();
      const endMs = startMs + (ev.durationMinutes || 60) * 60000;
      const endClean = new Date(endMs).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

      ics.push('BEGIN:VEVENT');
      ics.push(`UID:${ev.id}@timylabs.local`);
      ics.push(`DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`);
      ics.push(`DTSTART:${startClean}`);
      ics.push(`DTEND:${endClean}`);
      ics.push(`SUMMARY:${ev.title}`);
      ics.push(`DESCRIPTION:${(ev.notes || '').replace(/\n/g, '\\n')}`);
      ics.push('END:VEVENT');
    });

    ics.push('END:VCALENDAR');
    const blob = new Blob([ics.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `timylabs_study_schedule_${new Date().toISOString().split('T')[0]}.ics`;
    a.click();
    URL.revokeObjectURL(url);
  }

  startFocusOnEvent(eventId) {
    const events = window.appStore ? window.appStore.getEvents() : [];
    const ev = events.find((e) => e.id === eventId);
    if (!ev) return;

    if (window.focusTimer) {
      window.focusTimer.setSubject(ev.title);
      window.focusTimer.setMode('pomodoro');
    }

    if (window.switchView) {
      window.switchView('dashboard');
    }

    if (window.focusTimer) {
      window.focusTimer.start();
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
}

window.eventsManager = new EventsManager();
