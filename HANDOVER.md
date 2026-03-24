# Kirsty Platform — Project Handover

## What Is This?

**Python Lab** — an interactive web platform for teaching Python to secondary school students (Years 7–9 and GCSE). Built for Kirsty, a teacher. Uses the PRIMM pedagogical framework (Predict, Run, Investigate, Modify, Make).

Students log in, complete Python exercises in-browser (no installs), earn XP/badges, and compete on leaderboards. Kirsty manages everything from a teacher dashboard.

---

## Live Site

- **URL:** https://kirstylabs.jkmv.co.uk
- **Hosting:** Cloudflare Pages
- **Repo:** https://github.com/JVFourths/kirsty-platform.git (branch: `master`)

---

## Getting Started on a New Machine

```bash
git clone https://github.com/JVFourths/kirsty-platform.git
cd kirsty-platform
npx serve .
# Open http://localhost:3000
```

No build step. No dependencies. Pure HTML/CSS/JS.

To deploy, push to `master` or use:
```bash
npx wrangler login
npx wrangler pages deploy . --project-name=kirsty-platform
```

---

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | HTML5, Tailwind CSS (CDN), Vanilla JS (ES5) |
| Code Editor | CodeMirror 5.65 |
| Python Runtime | Pyodide v0.24.1 (WebAssembly, runs in browser) |
| Backend | Firebase Firestore + Auth |
| Hosting | Cloudflare Pages |

---

## Firebase

- **Project:** `kirstlab`
- **Console:** https://console.firebase.google.com/project/kirstlab
- **Auth:** Email link (passwordless magic link) + student code auth
- **Database:** Firestore
- **Config is in:** `js/firebase-sync.js` (lines 31–38)

### Firestore Collections (key ones)

- `students/` — student profiles, progress, XP, badges
- `classes/` — class settings (hacker mode, leaderboard, feed toggles)
- `classGoals/` — teacher-set class goals

### Auth Flow

1. Student enters email + class code on `login.html`
2. Firebase sends a magic link email
3. Student clicks link → auto signs in
4. Progress syncs to Firestore

---

## Key Pages

| File | Purpose |
|------|---------|
| `index.html` | Landing page — year group/topic selection, daily challenge, leaderboard, hacker mode card |
| `exercise.html` | Exercise runner — CodeMirror editor + Pyodide for in-browser Python |
| `login.html` | Student authentication (magic link / student codes) |
| `profile.html` | Student profile — XP, badges, streaks, secrets section |
| `teacher.html` | Teacher dashboard — class management, student progress, settings toggles |
| `challenges.html` | CTF challenges page (terminal theme) |
| `secret.html` | Hidden easter egg page with a CTF flag |

---

## Key JS Files

| File | Purpose |
|------|---------|
| `js/firebase-sync.js` | Firebase init, auth, Firestore CRUD, class settings |
| `js/gamification.js` | XP, levels (10), badges (20+), streaks, daily challenges, CTF flags |
| `js/progress.js` | Exercise completion tracking |
| `js/celebrations.js` | Confetti, toasts, level-up animations |
| `data/exercises.js` | All exercise definitions (50+) |
| `data/challenges.js` | CTF challenge definitions (8) |
| `data/daily-challenges.js` | Daily challenge exercises (30) |

---

## Features & How They Work

### Gamification
- XP earned per exercise, 10 levels, 20+ badges
- Streaks with recovery missions and flame evolution
- Weekly missions, daily challenges
- Lucky XP bonus animations

### Teacher Dashboard (`teacher.html`)
- View all students and their progress
- Toggle features per class: Activity Feed, Leaderboard, **Hacker Mode**
- Set class goals with progress bars
- Manage student codes
- Send notifications
- Double XP events
- Topic unlock override

### Hacker Mode / CTF (latest feature)
- Teacher toggles "Hacker Mode" on in dashboard → students see hacker card on landing page
- `challenges.html` — 8 CTF challenges with terminal theme
- `secret.html` — hidden page with a flag (`PYLAB{hidden_path_finder}`)
- CTF badges and flags sync to Firestore
- Easter eggs: console message, `Gamification.secret()` in browser console, `robots.txt` hint

---

## Known Issues / Open Items

See `README.md` for the full list. Key ones:

- **Security:** `new Function()` eval in exercise validation, Firestore rules need tightening
- **Timezone bug:** Streaks use UTC instead of local time
- **Silent error handling:** Firebase `.catch(function(){})` swallows errors
- **No tests:** No unit tests exist
- **Large inline JS:** `index.html` is 137KB with everything inline

---

## Cloudflare Setup

- Wrangler CLI: `npx wrangler login` then `npx wrangler pages deploy .`
- Custom domain `kirstylabs.jkmv.co.uk` is configured in Cloudflare DNS
- The Cloudflare account also has older projects (`domoricle`, `domricle`) — unrelated

---

## Current Status (as of March 2026)

- All code is committed and pushed to `master`
- Site is live at https://kirstylabs.jkmv.co.uk
- Latest features (Hacker Mode, CTF, secrets) are deployed
- Kirsty reported features "not showing" — likely needs to toggle Hacker Mode on in teacher dashboard (select class → flip the switch)
