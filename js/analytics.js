/**
 * Study Insights & Analytics Engine
 * Faithfully recreates the Donut Focus Share chart, 52-Week Heatmap, and Session Logs
 * based on Reference Image 2
 */

class AnalyticsEngine {
  constructor() {
    this.currentFilter = '7D'; // '7D', '14D', '30D', 'Year', 'All', 'Custom'
    this.tooltipEl = null;
  }

  init() {
    this.createTooltipElement();
    this.bindFilterEvents();
    this.renderAll();
  }

  createTooltipElement() {
    let tip = document.getElementById('heatmap-tooltip');
    if (!tip) {
      tip = document.createElement('div');
      tip.id = 'heatmap-tooltip';
      tip.className = 'heatmap-tooltip';
      document.body.appendChild(tip);
    }
    this.tooltipEl = tip;
  }

  bindFilterEvents() {
    const filterButtons = document.querySelectorAll('[data-analytics-filter]');
    filterButtons.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        filterButtons.forEach((b) => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        this.currentFilter = e.currentTarget.getAttribute('data-analytics-filter');
        this.renderAll();
      });
    });

    const exportBtn = document.getElementById('btn-export-sessions-csv');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => this.exportSessionsCSV());
    }
  }

  renderAll() {
    this.renderDonutShare();
    this.renderYearlyHeatmap();
    this.renderWeeklyReportCard();
    this.renderSessionLogs();
  }

  // 0. Render Weekly Study Report Card
  renderWeeklyReportCard() {
    const container = document.getElementById('weekly-report-card-container');
    if (!container) return;

    const stats = window.appStore ? window.appStore.getFocusStats() : { weekSeconds: 14 * 3600 + 15 * 60, weeklyGoalPercent: 82 };
    const sessions = window.appStore ? window.appStore.getSessions() : [];

    const weekHours = (stats.weekSeconds / 3600).toFixed(1);
    let grade = 'A+';
    let gradeTitle = 'Deep Flow Master';
    if (stats.weeklyGoalPercent >= 90) {
      grade = 'S-Rank';
      gradeTitle = 'Legendary Scholar';
    } else if (stats.weeklyGoalPercent >= 75) {
      grade = 'A+';
      gradeTitle = 'Consistent Flow';
    } else if (stats.weeklyGoalPercent >= 50) {
      grade = 'B';
      gradeTitle = 'Solid Momentum';
    } else {
      grade = 'C';
      gradeTitle = 'Warming Up';
    }

    container.innerHTML = `
      <div style="display: grid; grid-template-columns: 140px 1fr; gap: 24px; align-items: center;">
        <div style="text-align: center; padding: 18px; border-radius: 12px; background: rgba(245, 166, 35, 0.1); border: 2px solid var(--accent-gold); box-shadow: 0 0 20px rgba(245, 166, 35, 0.2);">
          <div style="font-size: 34px; font-weight: 800; color: var(--accent-gold); font-family: var(--font-digital);">${grade}</div>
          <div style="font-size: 11px; font-weight: 700; color: #fff; text-transform: uppercase; margin-top: 4px;">${gradeTitle}</div>
        </div>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;">
          <div class="stat-cell">
            <span class="stat-label">This Week's Focus</span>
            <span class="stat-value" style="font-size: 17px; color: var(--accent-gold);">${weekHours} hrs</span>
          </div>
          <div class="stat-cell">
            <span class="stat-label">Peak Focus Window</span>
            <span class="stat-value" style="font-size: 17px; color: #fff;">14:00 - 18:00</span>
          </div>
          <div class="stat-cell">
            <span class="stat-label">Goal Completion</span>
            <span class="stat-value" style="font-size: 17px; color: var(--accent-teal);">${stats.weeklyGoalPercent}%</span>
          </div>
        </div>
      </div>
    `;
  }

  // Filter sessions based on current active period
  getFilteredSessions() {
    const allSessions = window.appStore ? window.appStore.getSessions() : [];
    const now = new Date().getTime();

    if (this.currentFilter === 'All') return allSessions;

    let days = 7;
    if (this.currentFilter === '14D') days = 14;
    else if (this.currentFilter === '30D') days = 30;
    else if (this.currentFilter === 'Year') days = 365;

    const cutoff = now - days * 24 * 60 * 60 * 1000;
    return allSessions.filter((s) => new Date(s.date).getTime() >= cutoff);
  }

  // 1. Render Donut Chart & Event Share Bars
  renderDonutShare() {
    const canvas = document.getElementById('donutChartCanvas');
    const barsContainer = document.getElementById('donut-bars-container');
    if (!canvas || !barsContainer) return;

    const ctx = canvas.getContext('2d');
    const sessions = this.getFilteredSessions();

    // Group duration by subject
    const subjectMap = {};
    let totalSecs = 0;

    sessions.forEach((s) => {
      subjectMap[s.subject] = (subjectMap[s.subject] || 0) + s.durationSeconds;
      totalSecs += s.durationSeconds;
    });

    // Default fallback sample if no sessions in filter window
    if (totalSecs === 0) {
      subjectMap['Timylabs Development'] = 10260; // 2h 51m
      subjectMap['Reading'] = 6720; // 1h 52m
      totalSecs = 10260 + 6720;
    }

    // Color palette
    const colors = [
      '#f5a623', // Amber Gold (Timylabs)
      '#94a3b8', // Slate Light (Reading)
      '#2dd4bf', // Teal
      '#c084fc', // Purple
      '#38bdf8', // Sky Blue
      '#f43f5e'  // Coral
    ];

    // Clear canvas
    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    const centerX = width / 2;
    const centerY = height / 2;
    const outerRadius = 80;
    const innerRadius = 52;

    let startAngle = -0.5 * Math.PI;
    const entries = Object.entries(subjectMap).sort((a, b) => b[1] - a[1]);

    barsContainer.innerHTML = '';

    entries.forEach(([subj, secs], idx) => {
      const sliceAngle = (secs / totalSecs) * 2 * Math.PI;
      const color = colors[idx % colors.length];

      // Draw Arc
      ctx.beginPath();
      ctx.arc(centerX, centerY, outerRadius, startAngle, startAngle + sliceAngle, false);
      ctx.arc(centerX, centerY, innerRadius, startAngle + sliceAngle, startAngle, true);
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.shadowColor = color;
      ctx.shadowBlur = 6;
      ctx.fill();
      ctx.shadowBlur = 0;

      startAngle += sliceAngle;

      // Render Progress Bar Row
      const percent = ((secs / totalSecs) * 100).toFixed(1);
      const hours = Math.floor(secs / 3600);
      const mins = Math.floor((secs % 3600) / 60);
      const durStr = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;

      const barRow = document.createElement('div');
      barRow.className = 'donut-share-item';
      barRow.innerHTML = `
        <div class="donut-share-row">
          <div class="donut-share-label">
            <span class="legend-dot" style="background: ${color}; box-shadow: 0 0 8px ${color}"></span>
            <span>${subj}</span>
          </div>
          <div class="donut-share-stats">
            <span>% ${percent}%</span>
            <span>⏱ ${durStr}</span>
          </div>
        </div>
        <div class="donut-progress-track">
          <div class="donut-progress-fill" style="width: ${percent}%; background: ${color}"></div>
        </div>
      `;
      barsContainer.appendChild(barRow);
    });
  }

  // 2. Render Yearly Heatmap (Mon, Wed, Fri rows with 52 Weeks)
  renderYearlyHeatmap() {
    const gridContainer = document.getElementById('heatmap-weeks-columns');
    const activeDaysEl = document.getElementById('heatmap-active-days');
    const totalFocusEl = document.getElementById('heatmap-total-focus');
    if (!gridContainer) return;

    gridContainer.innerHTML = '';
    const heatmapData = window.appStore ? window.appStore.getHeatmapData() : {};

    // 52 weeks x 7 days
    const totalWeeks = 52;
    let activeDaysCount = 0;
    let totalFocusSeconds = 0;

    // Helper: calculate date string for year 2026
    const startDate = new Date(2026, 0, 1); // Jan 1 2026
    const daysOffset = (startDate.getDay() + 6) % 7; // Align to Monday

    for (let w = 0; w < totalWeeks; w++) {
      const col = document.createElement('div');
      col.className = 'heatmap-week-col';

      for (let d = 0; d < 7; d++) {
        const dayIndex = w * 7 + d - daysOffset;
        const cellDate = new Date(2026, 0, 1 + dayIndex);
        const dateKey = cellDate.toISOString().split('T')[0];

        const cell = document.createElement('div');
        cell.className = 'heatmap-cell';

        // Check if day has recorded focus
        const minutes = heatmapData[dateKey] || 0;
        let level = 0;

        if (minutes > 0) {
          activeDaysCount++;
          totalFocusSeconds += minutes * 60;
          if (minutes < 30) level = 1;
          else if (minutes < 60) level = 2;
          else if (minutes < 120) level = 3;
          else if (minutes < 180) level = 4;
          else level = 5;
        }

        cell.classList.add(`level-${level}`);
        cell.setAttribute('data-date', dateKey);
        cell.setAttribute('data-minutes', minutes);

        // Tooltip listeners
        cell.addEventListener('mouseenter', (e) => {
          const date = e.currentTarget.getAttribute('data-date');
          const mins = parseInt(e.currentTarget.getAttribute('data-minutes') || '0', 10);
          const hrs = (mins / 60).toFixed(1);
          this.showTooltip(e, `${date}: ${mins > 0 ? `${hrs}h (${mins}m)` : 'No focus recorded'}`);
        });

        cell.addEventListener('mouseleave', () => {
          this.hideTooltip();
        });

        col.appendChild(cell);
      }

      gridContainer.appendChild(col);
    }

    if (activeDaysEl) {
      activeDaysEl.textContent = `${activeDaysCount} active days`;
    }
    if (totalFocusEl) {
      const h = Math.floor(totalFocusSeconds / 3600);
      const m = Math.floor((totalFocusSeconds % 3600) / 60);
      totalFocusEl.textContent = `${h}h ${m}m total focus`;
    }
  }

  showTooltip(e, text) {
    if (!this.tooltipEl) return;
    this.tooltipEl.textContent = text;
    this.tooltipEl.style.display = 'block';

    const rect = e.currentTarget.getBoundingClientRect();
    this.tooltipEl.style.left = `${rect.left + rect.width / 2}px`;
    this.tooltipEl.style.top = `${rect.top - 32}px`;
    this.tooltipEl.style.transform = 'translateX(-50%)';
  }

  hideTooltip() {
    if (this.tooltipEl) {
      this.tooltipEl.style.display = 'none';
    }
  }

  // 3. Render Session Logs Table
  renderSessionLogs() {
    const tbody = document.getElementById('session-logs-tbody');
    if (!tbody) return;

    tbody.innerHTML = '';
    const sessions = this.getFilteredSessions().sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    if (sessions.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="5" style="text-align: center; color: var(--text-muted); padding: 24px;">
            No sessions found in this period. Start the timer to log your first session!
          </td>
        </tr>
      `;
      return;
    }

    sessions.forEach((s) => {
      const dateObj = new Date(s.date);
      const dateStr = dateObj.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
      const timeStr = dateObj.toLocaleTimeString(undefined, {
        hour: '2-digit',
        minute: '2-digit'
      });

      const hours = Math.floor(s.durationSeconds / 3600);
      const mins = Math.floor((s.durationSeconds % 3600) / 60);
      const secs = s.durationSeconds % 60;
      let durText = '';
      if (hours > 0) durText += `${hours}h `;
      if (mins > 0 || hours > 0) durText += `${mins}m `;
      durText += `${secs}s`;

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>
          <div style="font-weight: 600; color: #fff;">${dateStr}</div>
          <div style="font-size: 11px; color: var(--text-muted);">${timeStr}</div>
        </td>
        <td>
          <div style="font-weight: 700; color: #fff;">${s.subject}</div>
        </td>
        <td>
          <span class="category-tag tag-education">Focus</span>
        </td>
        <td style="font-family: var(--font-digital); font-weight: 700; color: var(--accent-gold);">
          ${durText}
        </td>
        <td>
          <button class="btn-icon-subtle" title="Delete Session" onclick="window.appStore.deleteSession('${s.id}')">
            🗑
          </button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  exportSessionsCSV() {
    const sessions = window.appStore ? window.appStore.getSessions() : [];
    if (!sessions.length) {
      alert('No sessions to export.');
      return;
    }

    let csv = 'ID,Date,Subject,DurationSeconds,Notes\n';
    sessions.forEach((s) => {
      csv += `"${s.id}","${s.date}","${s.subject}","${s.durationSeconds}","${(s.notes || '').replace(/"/g, '""')}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `timylabs_sessions_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }
}

window.analyticsEngine = new AnalyticsEngine();
