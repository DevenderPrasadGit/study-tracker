/**
 * Tasks & Deadlines Manager
 * Handles dashboard task list (To-Do, In Progress, Done) and Countdown Deadlines
 */

class TasksManager {
  constructor() {
    this.currentTab = 'todo'; // 'todo', 'inprogress', 'done'
  }

  init() {
    this.bindEvents();
    this.renderTasks();
    this.renderCountdowns();
  }

  bindEvents() {
    // Task tabs
    const tabs = document.querySelectorAll('[data-task-tab]');
    tabs.forEach((tab) => {
      tab.addEventListener('click', (e) => {
        tabs.forEach((t) => t.classList.remove('active'));
        e.currentTarget.classList.add('active');
        this.currentTab = e.currentTarget.getAttribute('data-task-tab');
        this.renderTasks();
      });
    });

    // Add Task
    const addTaskBtn = document.getElementById('btn-add-task-modal');
    if (addTaskBtn) {
      addTaskBtn.addEventListener('click', () => this.openAddTaskModal());
    }

    const formTask = document.getElementById('form-add-task');
    if (formTask) {
      formTask.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleAddTask();
      });
    }

    // Add Countdown
    const addCountdownBtn = document.getElementById('btn-add-countdown-modal');
    if (addCountdownBtn) {
      addCountdownBtn.addEventListener('click', () => this.openAddCountdownModal());
    }

    const formCountdown = document.getElementById('form-add-countdown');
    if (formCountdown) {
      formCountdown.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleAddCountdown();
      });
    }
  }

  openAddTaskModal() {
    const modal = document.getElementById('modal-add-task');
    if (modal) modal.classList.add('open');
  }

  openAddCountdownModal() {
    const modal = document.getElementById('modal-add-countdown');
    if (modal) modal.classList.add('open');
  }

  handleAddTask() {
    const title = document.getElementById('task-input-title').value.trim();
    const priority = document.getElementById('task-input-priority').value;
    if (!title) return;

    const newTask = {
      id: 'tsk_' + Date.now(),
      title,
      priority,
      status: 'todo',
      completed: false
    };

    if (window.appStore) {
      window.appStore.addTask(newTask);
    }

    document.getElementById('modal-add-task').classList.remove('open');
    this.renderTasks();

    if (window.soundEngine) {
      window.soundEngine.playClickSound();
    }
  }

  handleAddCountdown() {
    const title = document.getElementById('countdown-input-title').value.trim();
    const date = document.getElementById('countdown-input-date').value;
    if (!title || !date) return;

    const newCountdown = {
      id: 'cnt_' + Date.now(),
      title,
      targetDate: date
    };

    if (window.appStore) {
      window.appStore.addCountdown(newCountdown);
    }

    document.getElementById('modal-add-countdown').classList.remove('open');
    this.renderCountdowns();

    if (window.soundEngine) {
      window.soundEngine.playClickSound();
    }
  }

  toggleTask(taskId) {
    if (window.appStore) {
      window.appStore.toggleTask(taskId);
    }
    if (window.soundEngine) {
      window.soundEngine.playClickSound();
    }
    this.renderTasks();
  }

  renderTasks() {
    const containers = [
      document.getElementById('tasks-items-list'),
      document.getElementById('tasks-expanded-list')
    ].filter(Boolean);

    if (!containers.length) return;

    containers.forEach((container) => {
      container.innerHTML = '';
    });

    const tasks = window.appStore ? window.appStore.getTasks() : [];

    const filtered = tasks.filter((t) => {
      if (this.currentTab === 'todo') return !t.completed && t.status !== 'inprogress';
      if (this.currentTab === 'inprogress') return !t.completed && t.status === 'inprogress';
      if (this.currentTab === 'done') return t.completed;
      return true;
    });

    if (filtered.length === 0) {
      containers.forEach((container) => {
        container.innerHTML = `
          <div style="font-size: 12px; color: var(--text-muted); text-align: center; padding: 12px 0;">
            No tasks in this tab. Click "+ Add" to create one!
          </div>
        `;
      });
      return;
    }

    filtered.forEach((task) => {
      containers.forEach((container) => {
        const item = document.createElement('div');
        item.className = `task-checkbox-item ${task.completed ? 'checked' : ''}`;
        item.onclick = () => this.toggleTask(task.id);

        item.innerHTML = `
          <div class="custom-checkbox">
            ${task.completed ? '✓' : ''}
          </div>
          <span style="flex: 1;">${task.title}</span>
          ${task.priority ? `<span class="category-tag tag-education" style="font-size: 10px;">${task.priority}</span>` : ''}
        `;
        container.appendChild(item);
      });
    });
  }

  renderCountdowns() {
    const list = document.getElementById('countdowns-list-container');
    if (!list) return;

    list.innerHTML = '';
    const countdowns = window.appStore ? window.appStore.getCountdowns() : [];

    if (countdowns.length === 0) {
      list.innerHTML = `
        <div style="font-size: 12px; color: var(--text-muted); text-align: center; padding: 10px 0;">
          No countdowns set.
        </div>
      `;
      return;
    }

    countdowns.forEach((item) => {
      const targetTime = new Date(item.targetDate).getTime();
      const diffMs = targetTime - Date.now();

      let diffStr = 'Expired';
      if (diffMs > 0) {
        const d = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const h = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        diffStr = `${d}d ${h}h`;
      }

      const row = document.createElement('div');
      row.className = 'countdown-item';
      row.innerHTML = `
        <div class="countdown-info">
          <div class="countdown-name">${item.title}</div>
          <div class="countdown-date">${new Date(item.targetDate).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}</div>
        </div>
        <div class="countdown-badge">${diffStr}</div>
      `;
      list.appendChild(row);
    });
  }
}

window.tasksManager = new TasksManager();
