# 🏮 Timylabs — Nostalgic Pixel Anime Study Tracker

> A nostalgic, aesthetic focus & study management sanctuary inspired by retro 16-bit anime artwork, lo-fi beats, and dark amber glassmorphism.

![Nostalgic Sunset Galleon](assets/images/pixel_ship.jpg)

---

## ✨ Features

- 🌅 **16-bit Pixel Anime Atmosphere**:
  - Switchable backgrounds: *Sunset Galleon Exploration* and *Rainy Tokyo Study Room*.
  - CRT Scanlines & phosphor bloom screen effect toggle.
  - Floating ambient pixel dust particles.
- ⏱ **Focus Timer Suite**:
  - Retro digital display (`08:08:23`) with Pomodoro (25/5), Short Break (5m), Stopwatch (Count Up), and Custom modes.
  - Spacebar quick toggle, session logging, and retro 8-bit completion fanfare.
- 📁 **Active Subjects & Today's Plan**:
  - Track study hours across individual courses, subjects, or projects with 1-click timer launch.
- 📅 **Dedicated Events & Schedule**:
  - Schedule upcoming exams, assignment deadlines, lectures, and deep focus blocks.
  - **1-Click Google Calendar Sync** & **.ICS iCalendar Export** for Apple Calendar, Outlook, and Google Calendar.
- 📊 **Study Insights & Analytics**:
  - **Weekly Scholar Report Card**: Calculates study volume, flow score (`S-Rank` / `A+`), and peak focus window (`14:00 - 18:00`).
  - **Donut Chart**: Real-time percentage & hour breakdown of focus share by subject.
  - **52-Week Yearly Focus Heatmap**: GitHub-style activity grid with amber intensity shading and hover tooltips.
  - **Session History & CSV Export**: Complete log of all past focus blocks with 1-click CSV download.
- ⚡ **Weekly Habit Matrix**:
  - Interactive Mon–Sun streak tracker with flame animations and active status badges.
- ⏳ **Countdowns & Tasks**:
  - Live countdown timers for exams and project deadlines.
  - Categorized tasks (`To-Do`, `In Progress`, `Done`) with priority badges.
- 🎮 **Gamified Quests & Achievements**:
  - Unlockable milestone badges (*First Voyage*, *Deep Flow*, *Midnight Scholar*, *Iron Discipline*, *Century Scholar*).
  - Daily study quests with XP rewards to level up your Scholar Rank (`Bronze III` to `Master`).
  - Companion avatar customizer (*Cosmic Cat*, *Twilight Fox*).
- 🎧 **Ambient Audio & Lo-Fi Station**:
  - Built-in Web Audio API sound synthesizer (Rain, Fireplace, Lo-Fi Chords) — 100% offline with zero external audio files.
  - Integrated 24/7 Lo-Fi Girl study stream web player.

---

## 🚀 Getting Started

This project is built using modern standard web technologies (HTML5, CSS3, ES modules, Web Audio API, Canvas, LocalStorage) with **zero build steps** and **zero external runtime dependencies**. It runs instantly in any modern web browser.

### Option 1: Open Directly
Simply double-click `index.html` or open it in your browser:
```
file:///C:/projects/study-tracker/index.html
```

### Option 2: Run with Local Server (PowerShell)
```powershell
powershell -ExecutionPolicy Bypass -File serve.ps1 -Port 3000
```
Then navigate to `http://localhost:3000` in your browser.

---

## 📁 Repository Structure

```
├── index.html               # Main application shell & modular views
├── css/
│   └── styles.css           # Glassmorphism, pixel anime aesthetics, CRT scanlines
├── js/
│   ├── app.js               # State manager, LocalStorage persistence & particle canvas
│   ├── timer.js             # Pomodoro, stopwatch, and break focus engine
│   ├── analytics.js         # Donut chart, 52-week heatmap & weekly report card
│   ├── events.js            # Study schedule, Google Calendar sync & .ICS exporter
│   ├── habits.js            # Weekly habit streak matrix
│   ├── tasks.js             # Task manager and countdown widgets
│   ├── gamification.js      # Daily quests, milestone badges & avatars
│   └── audio.js             # Web Audio API ambient synthesizer & 8-bit sound effects
├── assets/images/
│   ├── pixel_ship.jpg       # 16-bit Sunset Galleon wallpaper
│   ├── pixel_room.jpg       # 16-bit Rainy Tokyo study room wallpaper
│   └── pixel_cat.jpg        # 16-bit Cosmic Cat mascot avatar
└── serve.ps1                # Lightweight local static preview server
```

---

## 💾 Data Persistence
All your focus logs, subject plans, habits, tasks, countdowns, and notes are automatically saved to your browser's `localStorage`. You can back up your sessions anytime using the **Export CSV** feature in the Stats view.

---

## 📜 License
MIT License. Feel free to use and customize for your own study sanctuary!
