/**
 * Notes & Scratchpad Notebook Manager
 * Supports rich multi-notes, color tagging, habit/event linkage, markdown tools, and quick search
 */

class NotesManager {
  constructor() {
    this.activeNoteId = null;
    this.searchQuery = '';
    this.filterCategory = 'all';
    this.notes = this.loadNotes();
  }

  loadNotes() {
    try {
      const saved = localStorage.getItem('timylabs_study_notes_list_v2');
      if (saved) return JSON.parse(saved);
    } catch (e) {}

    // Fallback or migrate from older single note
    let initialText = '# My Study Notes & Goals\n\n- [x] Complete system design fundamentals\n- [ ] Master dynamic programming patterns\n- [ ] Review discrete mathematics lecture notes\n\n*"Discipline today, freedom tomorrow."*';
    try {
      const old = localStorage.getItem('timylabs_study_tracker_data_v1');
      if (old) {
        const parsed = JSON.parse(old);
        if (parsed.notes) initialText = parsed.notes;
      }
    } catch (e) {}

    return [
      {
        id: 'note_default',
        title: 'Master Study Roadmap & Goals',
        category: 'General',
        color: 'amber',
        linkedHabitId: '',
        linkedEventId: '',
        pinned: true,
        content: initialText,
        updatedAt: new Date().toLocaleDateString('en-GB')
      },
      {
        id: 'note_demo_event',
        title: 'Midterm Prep: Cache & Memory Architecture',
        category: 'Events',
        color: 'crimson',
        linkedHabitId: '',
        linkedEventId: 'evt_1',
        pinned: false,
        content: '### Key Areas to Master:\n- L1/L2/L3 cache coherence protocols (MESI)\n- Virtual memory page tables & TLB miss handling\n- Direct-mapped vs set-associative caches\n\n*Target: 2 review sessions before exam date.*',
        updatedAt: new Date().toLocaleDateString('en-GB')
      },
      {
        id: 'note_demo_habit',
        title: 'Daily Reading Reflections & Highlights',
        category: 'Habits',
        color: 'cyan',
        linkedHabitId: 'hab_2',
        linkedEventId: '',
        pinned: false,
        content: '### Reading Reflections:\n- Books read this week: Clean Code & Designing Data-Intensive Applications\n- Takeaway: Code is read 10x more often than it is written. Optimize for clarity over cleverness.',
        updatedAt: new Date().toLocaleDateString('en-GB')
      }
    ];
  }

  saveNotes() {
    try {
      localStorage.setItem('timylabs_study_notes_list_v2', JSON.stringify(this.notes));
    } catch (e) {
      console.error('Failed to save notes', e);
    }
  }

  init() {
    if (!this.notes.length) {
      this.createNote('New Study Note');
    } else {
      this.activeNoteId = this.notes[0].id;
    }
    this.bindEvents();
    this.populateLinkDropdowns();
    this.renderNotesList();
    this.renderActiveNoteEditor();
  }

  createNote(title = 'Untitled Note', category = 'General', color = 'amber', linkedHabitId = '', linkedEventId = '') {
    const newNote = {
      id: 'note_' + Date.now(),
      title,
      category,
      color,
      linkedHabitId,
      linkedEventId,
      pinned: false,
      content: '',
      updatedAt: new Date().toLocaleDateString('en-GB')
    };

    this.notes.unshift(newNote);
    this.activeNoteId = newNote.id;
    this.saveNotes();
    this.renderNotesList();
    this.renderActiveNoteEditor();

    const titleInput = document.getElementById('note-editor-title');
    if (titleInput) {
      titleInput.focus();
      titleInput.select();
    }
    return newNote;
  }

  deleteNote(id) {
    if (confirm('Delete this note?')) {
      this.notes = this.notes.filter((n) => n.id !== id);
      if (!this.notes.length) {
        this.createNote('Study Scratchpad');
      } else {
        this.activeNoteId = this.notes[0].id;
      }
      this.saveNotes();
      this.renderNotesList();
      this.renderActiveNoteEditor();
    }
  }

  togglePin(id) {
    const note = this.notes.find((n) => n.id === id);
    if (note) {
      note.pinned = !note.pinned;
      // Sort pinned to top
      this.notes.sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));
      this.saveNotes();
      this.renderNotesList();
    }
  }

  selectNote(id) {
    this.activeNoteId = id;
    this.renderNotesList();
    this.renderActiveNoteEditor();
  }

  getActiveNote() {
    return this.notes.find((n) => n.id === this.activeNoteId) || this.notes[0];
  }

  populateLinkDropdowns() {
    const habitSelect = document.getElementById('note-link-habit-select');
    const eventSelect = document.getElementById('note-link-event-select');

    if (habitSelect && window.appStore) {
      habitSelect.innerHTML = '<option value="">-- No Linked Habit --</option>';
      const habits = window.appStore.getHabits();
      habits.forEach((h) => {
        const opt = document.createElement('option');
        opt.value = h.id;
        opt.textContent = `⚡ ${h.name}`;
        habitSelect.appendChild(opt);
      });
    }

    if (eventSelect && window.appStore) {
      eventSelect.innerHTML = '<option value="">-- No Linked Event / Skill --</option>';
      const events = window.appStore.getEvents();
      events.forEach((e) => {
        const opt = document.createElement('option');
        opt.value = e.id;
        opt.textContent = `📅 ${e.title}`;
        eventSelect.appendChild(opt);
      });
    }
  }

  renderNotesList() {
    const container = document.getElementById('notes-cards-sidebar-list');
    if (!container) return;

    container.innerHTML = '';
    const query = this.searchQuery.toLowerCase();

    const filtered = this.notes.filter((n) => {
      const matchesSearch = n.title.toLowerCase().includes(query) || n.content.toLowerCase().includes(query);
      if (!matchesSearch) return false;

      if (this.filterCategory === 'all') return true;
      if (this.filterCategory === 'pinned') return n.pinned;
      if (this.filterCategory === 'habits') return !!n.linkedHabitId;
      if (this.filterCategory === 'events') return !!n.linkedEventId;
      return n.category.toLowerCase() === this.filterCategory.toLowerCase();
    });

    if (!filtered.length) {
      container.innerHTML = `
        <div style="padding: 24px; text-align: center; color: var(--text-dim); font-size: 12px;">
          No notes found. Click <strong>+ New Note</strong> to start jotting thoughts!
        </div>
      `;
      return;
    }

    filtered.forEach((note) => {
      const isActive = note.id === this.activeNoteId;
      const card = document.createElement('div');
      card.className = `note-sidebar-card color-${note.color || 'amber'} ${isActive ? 'active' : ''}`;
      card.onclick = () => this.selectNote(note.id);

      let linkBadge = '';
      if (note.linkedHabitId) {
        linkBadge = '<span class="note-chip-badge habit">⚡ Habit</span>';
      } else if (note.linkedEventId) {
        linkBadge = '<span class="note-chip-badge event">📅 Event</span>';
      }

      card.innerHTML = `
        <div class="note-card-top-row">
          <div style="display: flex; align-items: center; gap: 6px; overflow: hidden;">
            ${note.pinned ? '<span style="color: var(--accent-gold); font-size: 11px;">📌</span>' : ''}
            <span class="note-card-title">${note.title || 'Untitled'}</span>
          </div>
          <button class="btn-icon-subtle pin-btn" title="Toggle Pin" onclick="event.stopPropagation(); window.notesManager.togglePin('${note.id}')">
            ${note.pinned ? '★' : '☆'}
          </button>
        </div>
        <div class="note-card-preview">
          ${note.content.replace(/[#*`_]/g, '').slice(0, 75) || 'Empty note...'}
        </div>
        <div class="note-card-meta-row">
          <span style="font-size: 10px; color: var(--text-muted);">${note.updatedAt}</span>
          <div style="display: flex; gap: 4px;">
            ${linkBadge}
            <span class="note-chip-badge cat">${note.category}</span>
          </div>
        </div>
      `;

      container.appendChild(card);
    });
  }

  renderActiveNoteEditor() {
    const note = this.getActiveNote();
    if (!note) return;

    this.populateLinkDropdowns();

    const titleInput = document.getElementById('note-editor-title');
    const catSelect = document.getElementById('note-editor-category');
    const habitSelect = document.getElementById('note-link-habit-select');
    const eventSelect = document.getElementById('note-link-event-select');
    const contentText = document.getElementById('note-editor-textarea');
    const wordCountEl = document.getElementById('note-word-count');

    if (titleInput) titleInput.value = note.title;
    if (catSelect) catSelect.value = note.category;
    if (habitSelect) habitSelect.value = note.linkedHabitId || '';
    if (eventSelect) eventSelect.value = note.linkedEventId || '';
    if (contentText) contentText.value = note.content;

    // Set color dots
    document.querySelectorAll('.note-color-dot').forEach((dot) => {
      if (dot.getAttribute('data-color') === (note.color || 'amber')) {
        dot.classList.add('selected');
      } else {
        dot.classList.remove('selected');
      }
    });

    if (wordCountEl) {
      const words = note.content.trim() ? note.content.trim().split(/\s+/).length : 0;
      wordCountEl.textContent = `${words} words · ${note.content.length} chars`;
    }
  }

  updateActiveNoteFields() {
    const note = this.getActiveNote();
    if (!note) return;

    const titleInput = document.getElementById('note-editor-title');
    const catSelect = document.getElementById('note-editor-category');
    const habitSelect = document.getElementById('note-link-habit-select');
    const eventSelect = document.getElementById('note-link-event-select');
    const contentText = document.getElementById('note-editor-textarea');

    if (titleInput) note.title = titleInput.value.trim() || 'Untitled Note';
    if (catSelect) note.category = catSelect.value;
    if (habitSelect) note.linkedHabitId = habitSelect.value;
    if (eventSelect) note.linkedEventId = eventSelect.value;
    if (contentText) note.content = contentText.value;

    note.updatedAt = new Date().toLocaleDateString('en-GB');

    this.saveNotes();
    this.renderNotesList();

    const wordCountEl = document.getElementById('note-word-count');
    if (wordCountEl) {
      const words = note.content.trim() ? note.content.trim().split(/\s+/).length : 0;
      wordCountEl.textContent = `${words} words · ${note.content.length} chars`;
    }
  }

  setColor(color) {
    const note = this.getActiveNote();
    if (!note) return;
    note.color = color;
    this.saveNotes();
    this.renderNotesList();
    this.renderActiveNoteEditor();
  }

  insertMarkdown(prefix, suffix = '') {
    const textarea = document.getElementById('note-editor-textarea');
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = textarea.value.substring(start, end);
    const replacement = prefix + (selected || 'text') + suffix;

    textarea.value = textarea.value.substring(0, start) + replacement + textarea.value.substring(end);
    textarea.selectionStart = start + prefix.length;
    textarea.selectionEnd = start + prefix.length + (selected ? selected.length : 4);
    textarea.focus();

    this.updateActiveNoteFields();
  }

  exportCurrentNote() {
    const note = this.getActiveNote();
    if (!note) return;

    const text = `# ${note.title}\nCategory: ${note.category}\nDate: ${note.updatedAt}\n\n${note.content}`;
    const blob = new Blob([text], { type: 'text/markdown;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `${note.title.toLowerCase().replace(/[^a-z0-9]+/g, '_')}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  bindEvents() {
    const btnNew = document.getElementById('btn-add-new-note');
    if (btnNew) {
      btnNew.addEventListener('click', () => this.createNote('New Study Note'));
    }

    const btnDelete = document.getElementById('btn-delete-active-note');
    if (btnDelete) {
      btnDelete.addEventListener('click', () => {
        if (this.activeNoteId) this.deleteNote(this.activeNoteId);
      });
    }

    const btnExport = document.getElementById('btn-export-active-note');
    if (btnExport) {
      btnExport.addEventListener('click', () => this.exportCurrentNote());
    }

    const searchInput = document.getElementById('notes-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value;
        this.renderNotesList();
      });
    }

    // Filter pills
    document.querySelectorAll('[data-note-filter]').forEach((pill) => {
      pill.addEventListener('click', (e) => {
        document.querySelectorAll('[data-note-filter]').forEach((p) => p.classList.remove('active'));
        e.currentTarget.classList.add('active');
        this.filterCategory = e.currentTarget.getAttribute('data-note-filter');
        this.renderNotesList();
      });
    });

    // Inputs update
    ['note-editor-title', 'note-editor-category', 'note-link-habit-select', 'note-link-event-select'].forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('input', () => this.updateActiveNoteFields());
        el.addEventListener('change', () => this.updateActiveNoteFields());
      }
    });

    const textarea = document.getElementById('note-editor-textarea');
    if (textarea) {
      textarea.addEventListener('input', () => this.updateActiveNoteFields());
    }

    // Color dots
    document.querySelectorAll('.note-color-dot').forEach((dot) => {
      dot.addEventListener('click', (e) => {
        const c = e.currentTarget.getAttribute('data-color');
        this.setColor(c);
      });
    });

    // Markdown tool buttons
    document.querySelectorAll('[data-md-tool]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const tool = e.currentTarget.getAttribute('data-md-tool');
        switch (tool) {
          case 'bold': this.insertMarkdown('**', '**'); break;
          case 'italic': this.insertMarkdown('*', '*'); break;
          case 'h2': this.insertMarkdown('## '); break;
          case 'bullet': this.insertMarkdown('- '); break;
          case 'check': this.insertMarkdown('- [ ] '); break;
          case 'code': this.insertMarkdown('```\n', '\n```'); break;
          case 'quote': this.insertMarkdown('> '); break;
        }
      });
    });
  }
}

// Global helpers to link from habits & events
window.openNotesForHabit = function (habitId, habitName) {
  window.switchView('notes');
  if (window.notesManager) {
    const existing = window.notesManager.notes.find((n) => n.linkedHabitId === habitId);
    if (existing) {
      window.notesManager.selectNote(existing.id);
    } else {
      window.notesManager.createNote(`Habit Reflections: ${decodeURIComponent(habitName)}`, 'Habits', 'cyan', habitId, '');
    }
  }
};

window.openNotesForEvent = function (eventId, eventTitle) {
  window.switchView('notes');
  if (window.notesManager) {
    const existing = window.notesManager.notes.find((n) => n.linkedEventId === eventId);
    if (existing) {
      window.notesManager.selectNote(existing.id);
    } else {
      window.notesManager.createNote(`Study Plan: ${decodeURIComponent(eventTitle)}`, 'Events', 'crimson', '', eventId);
    }
  }
};

window.notesManager = new NotesManager();
