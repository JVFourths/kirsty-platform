# Python Lab - Interactive Learning Platform

An interactive web-based educational platform for teaching Python programming to secondary school students (Years 7-9 and GCSE). Built around the **PRIMM pedagogical framework** (Predict, Run, Investigate, Modify, Make).

## Features

- **Interactive code editor** (CodeMirror) with Python syntax highlighting
- **In-browser Python execution** via Pyodide (no server required)
- **50+ exercises** across 4 year groups and 8 topics
- **Gamification**: XP, 10 levels, 20+ badges, streak tracking, leaderboards
- **Teacher dashboard** for monitoring student progress
- **Firebase integration** for cloud sync and passwordless authentication
- **Mobile-responsive** design with Tailwind CSS

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | HTML5, Tailwind CSS, Vanilla JS (ES5) |
| Code Editor | CodeMirror 5.65 |
| Python Runtime | Pyodide v0.24.1 (WebAssembly) |
| Backend | Firebase (Firestore + Auth) |
| Hosting | Cloudflare Pages |

## Project Structure

```
kirsty-platform/
├── index.html          # Landing page (year group & topic selection)
├── exercise.html       # Exercise runner (code editor + Pyodide)
├── topics.html         # Topic listing per year group
├── profile.html        # Student profile & progress
├── teacher.html        # Teacher dashboard
├── login.html          # Authentication (magic link)
├── css/
│   ├── platform.css    # Base styles
│   └── gamification.css # Animation & gamification styles
├── js/
│   ├── gamification.js # XP, levels, badges, streaks
│   ├── progress.js     # Exercise completion tracking
│   ├── celebrations.js # Confetti, toasts, level-up animations
│   └── firebase-sync.js # Firestore sync & auth
├── data/
│   └── exercises.js    # All exercise definitions
└── img/                # (empty - placeholder for assets)
```

## Getting Started

1. Clone this repository
2. Serve the files with any static server (e.g. `npx serve .` or Cloudflare Pages)
3. Open `login.html` to authenticate, or go directly to `index.html`

No build step required - this is a vanilla HTML/CSS/JS project.

## Suggested Improvements

### Critical (Security)

- **Code injection via `new Function()`** - `exercise.html:699` and `index.html:1374` use `new Function("output", "return (" + exercise.checkFn + ");")` to validate answers. Replace with a map of named validation functions to eliminate eval-like behavior.
- **Add Firestore security rules** - Currently no server-side validation that the authenticated user matches the student writing data. Add rules like `allow write: if request.auth.uid == resource.data.userId`.

### High Priority (Reliability)

- **Timezone bug in streak tracking** - `gamification.js:137-158` uses `new Date().toISOString().split("T")[0]` (UTC) instead of local date. Students in non-UTC timezones see incorrect streak resets. Fix: use local date strings.
- **Week reset algorithm** - Same file, lines 151-158. Monday calculation uses UTC `getDay()`, causing weekly leaderboard to be off by a day in some timezones.
- **Silent Firebase error handling** - `firebase-sync.js` has many `.catch(function () {})` blocks that swallow errors. Add `console.error` logging at minimum.

### Medium Priority (Performance)

- **Pyodide load time** - The ~40MB Pyodide runtime loads on first exercise open. Consider pre-warming on the landing page or showing an accurate loading estimate.
- **Large bundle** - `index.html` is 103KB with all logic inline. Split exercises by year group and lazy-load.
- **No offline support** - Add a service worker to cache exercises for offline use.

### Medium Priority (Accessibility)

- **Missing aria-labels on emoji** - Emoji like `🔥` (streak) and `🔮` (XP) are used as meaningful UI but lack `aria-label` attributes for screen readers.
- **No `prefers-reduced-motion`** - Confetti and celebration animations should be disabled for users who prefer reduced motion:
  ```css
  @media (prefers-reduced-motion: reduce) {
    .confetti-piece { animation: none; }
  }
  ```
- **Color-only PRIMM badges** - Exercise type badges rely solely on background color. Add icons or text labels for colorblind users.
- **Modal focus trapping** - The nickname modal in `profile.html` doesn't trap focus; keyboard users can tab behind it.
- **Insufficient contrast** - Some gray text in `gamification.css` (e.g. `#94a3b8` on white) falls below WCAG AA 4.5:1 ratio.

### Low Priority (Maintainability)

- **Duplicate header code** - `index.html`, `exercise.html`, and `topics.html` repeat ~100 lines of header HTML/JS. Extract to a shared template or web component.
- **Magic strings** - Exercise types (`"predict"`, `"run"`, `"make"`) are repeated across 5+ files. Define constants in one place.
- **Global variable pollution** - `EXERCISES`, `Gamification`, `Progress`, etc. are all global. Wrap in a single namespace.
- **exercise.html complexity** - 784 lines of inline JS. Extract into separate modules (`exercise-controller.js`, `exercise-validator.js`, `pyodide-runner.js`).
- **No automated tests** - No unit tests exist. Extract pure logic (level calculation, badge checking, streak math) into testable modules.

### Nice to Have

- **Teacher dashboard real-time updates** via Firestore listeners
- **CSV export** for teacher records
- **Analytics/error tracking** (Sentry or Firebase Crashlytics)
- **Content Security Policy headers** to prevent inline eval
- **Service worker** for caching and offline support
