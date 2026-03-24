# Python Lab — Visual Refresh + Learning Depth

**Date:** 2026-03-24
**Status:** Approved
**Source:** Student feedback session (2026-03-24) + UX expert review

## Context

Students described Python Lab as "quite plain" and "too linear." They want dark mode, more visual polish, more tasks per topic, definitions/glossary pages, worked examples, and reward mechanics like Seneca/Duolingo. The platform serves UK secondary school students across all year groups (Years 7-9 + GCSE).

## Approach

Four independent slices, each deployable on its own. Ordered by student impact: visual hook first, learning depth second, engagement mechanics last.

---

## Slice 1: Dark Mode + Visual Polish

### Theme System

Define CSS custom properties in `platform.css`:

```css
:root {
  --surface: #ffffff;
  --surface-raised: #f8fafc;
  --surface-sunken: #f1f5f9;
  --border: #e2e8f0;
  --text-primary: #0f172a;
  --text-secondary: #64748b;
  --text-muted: #94a3b8;
}

.dark {
  --surface: #0f172a;
  --surface-raised: #1e293b;
  --surface-sunken: #020617;
  --border: #334155;
  --text-primary: #f1f5f9;
  --text-secondary: #94a3b8;
  --text-muted: #475569;
}
```

Migrate all hardcoded hex values in `platform.css`, `gamification.css`, and inline `<style>` blocks in `index.html`/`exercise.html` to use these variables. The `.dark` class on `<html>` makes variables cascade automatically — no `dark:` Tailwind utility classes needed for elements styled via custom CSS. For elements using only Tailwind utilities directly in HTML (e.g. `bg-white`, `text-slate-900`), add `dark:` variants as a secondary layer.

**Toggle:** Button in header (sun/moon icon). JS reads `localStorage.getItem('pythonlab_theme')` on load, falls back to `prefers-color-scheme`, toggles `dark` class on `<html>`.

**Exceptions (stay dark in both modes):** `.output-panel` (terminal aesthetic), `.hacker-card`, `.secrets-section`, `.ctf-badge` (CTF aesthetic). `challenges.html` header/nav follow the theme but challenge content stays dark.

### Visual Polish

- **Background texture:** Subtle dot-grid pattern on home and topics views via CSS `radial-gradient`.
- **Year-group cards:** Themed top band — emerald (Y7), blue (Y8), violet (Y9), amber (GCSE). Larger icon area. Replace `h-1.5` progress bars with `xp-bar-fill` shimmer at `h-2.5`.
- **Pyodide loading:** Branded full-colour loading screen with gradient background, logo mark, and loading dots. Replace bare white screen.
- **XP header on mobile:** Show collapsed XP counter on mobile (icon + number) instead of `hidden sm:flex`.

### Accessibility Fixes (bundled)

| Issue | Fix |
|-------|-----|
| `#ef4444` error text fails contrast on dark panel | Change to `#f87171` in `platform.css` `.output-panel .error` only. Inline JS `style.color` uses on light backgrounds are acceptable. |
| `exercise.html` back link hardcodes `year=7` | Read year from URL params dynamically |
| Focus not managed on SPA navigation | Move focus to view heading on `App.navigate()` |
| Hidden views visible to screen readers | Add `aria-hidden="true"` to inactive views |
| Locked topic cards in keyboard tab order | Add `tabindex="-1"` and `aria-disabled="true"` |
| Nickname input has no label | Add `<label class="sr-only">` |
| `.badge-card.locked` at `opacity: 0.45` | Use `opacity: 0.55` + lock icon overlay |

### Files Changed

- `css/platform.css` — custom properties, dark mode overrides, dot-grid background
- `css/gamification.css` — migrate hardcoded colours to custom properties
- `index.html` — dark toggle button, `dark:` classes, themed cards, mobile XP, a11y fixes
- `exercise.html` — dark toggle, `dark:` classes, loading screen, back-link fix, a11y fixes
- `profile.html` — dark toggle, `dark:` classes
- `login.html` — dark toggle, `dark:` classes
- `topics.html` — dark toggle, `dark:` classes
- `challenges.html` — dark toggle (CTF pages stay dark-themed)
- `teacher.html` — dark toggle, `dark:` classes

---

## Slice 2: Topic Grid + Recommended

### Topic Layout

Replace single-column `space-y-5` topic list with responsive grid:
- Mobile: 1 column
- Tablet: 2 columns
- Desktop: 3 columns

Each topic card shows PRIMM type chips as small coloured dots indicating which exercise types are included (Predict=blue, Run=green, Investigate=amber, Modify=violet, Make=pink).

### "Up Next" Badge

The first incomplete topic gets:
- A pulsing border (reuse `hacker-pulse` pattern at lower intensity)
- An "Up Next" badge in the top-right corner
- Slightly larger card size via `scale-[1.02]`

All other unlocked topics are accessible but without the visual emphasis.

### Exercise Step Indicator

At the top of the exercise view, render a row of dots representing each exercise in the current topic. Current exercise is filled, completed exercises are checkmarked, future exercises are outlined. Dots are clickable links to navigate between exercises.

### Quick Practice Card

Single card on the home view (below year-group cards) that:
- Picks one random exercise from any topic that has at least one completion (for revision/practice)
- Shows exercise title, type badge, and topic name
- Links directly to that exercise
- Refreshes on each page load

**Note:** `topics.html` is a standalone legacy page. The primary topic view is `view-topics` inside `index.html` (SPA). Both must receive the grid layout changes for consistency.

### Files Changed

- `index.html` — topic grid layout, "Up Next" badge, PRIMM chips, quick practice card, step indicator
- `topics.html` — same grid layout and PRIMM chips for consistency
- `exercise.html` — step indicator dots
- `css/platform.css` — grid styles, step indicator styles, "Up Next" badge animation
- `data/exercises.js` — no changes (data structure already supports this)

---

## Slice 3: Learning Support

### Glossary Panel

A slide-out panel on the exercise page containing key term definitions relevant to the current topic.

**Data:** New file `data/glossary.js` with structure:
```javascript
var GLOSSARY = {
  "y7-hello": [
    { term: "print()", definition: "A function that displays text on the screen." },
    { term: "string", definition: "Text data enclosed in quotes, like \"hello\"." }
  ],
  "y8-selection": [
    { term: "if", definition: "Checks a condition. Runs the indented code only if the condition is True." },
    // ...
  ]
};
```

**UI:** Button in exercise header ("Glossary" with book icon). Opens a right-side slide-out panel listing terms for the current topic. Panel overlays content, doesn't push it. Close via X button or clicking outside.

### Worked Examples in Hints

Add optional `workedExample` field to exercise definitions:
```javascript
{
  id: "y7-var-5",
  // ... existing fields ...
  hint: "Create variables like: name = \"Alex\"...",
  workedExample: "name = \"Alex\"\nage = 13\nfav = 7\nprint(f\"My name is {name}, I am {age}, and my favourite number is {fav}\")"
}
```

When present, the hint panel shows two sections:
1. **Hint** (existing text)
2. **Worked Example** (syntax-highlighted code block using the existing `highlightPython()` function)

### End-of-Topic Summary

When a student completes the last exercise in a topic, show a summary modal (same pattern as level-up):
- Topic title + completion icon
- "Key concepts" list (from glossary terms for that topic)
- XP earned in this topic
- Badges unlocked
- Two buttons: "Keep Going" (next topic) and "Back to Topics"
- Confetti animation

### Files Changed

- New: `data/glossary.js` — glossary definitions per topic
- `data/exercises.js` — add `workedExample` field to select exercises
- `exercise.html` — glossary panel HTML, glossary button, worked example in hints
- `index.html` — glossary panel, worked example, topic-complete summary modal
- `js/celebrations.js` — add `showTopicComplete()` function
- `css/platform.css` — glossary panel slide-out styles
- `css/gamification.css` — topic-complete modal styles

---

## Slice 4: Reward Mechanics

### Spin-the-Wheel

On topic completion (after the summary modal), offer a wheel spin:
- 6 segments: +5 XP, +10 XP, +15 XP, +20 XP, +30 XP, +50 XP (jackpot)
- Pure CSS rotation animation with JS random stop angle
- Result added to total XP and synced to Firestore
- Visual: colourful wheel with pointer, 3-second spin animation

**Data:** `spinHistory` object added to gamification data (stored in `pythonlab_game` localStorage alongside `completedExercises`):
```javascript
spinHistory: {
  "y7-hello": { xp: 15, date: "2026-03-24" },
  "y8-selection": { xp: 50, date: "2026-03-25" }
}
// Key = topic ID, value = spin result. One spin per topic, ever.
```

### Topic-Complete Celebration

Triggered when last exercise in a topic is completed:
1. Summary modal appears (from Slice 3)
2. Confetti burst (existing)
3. "Spin the Wheel" button in modal
4. Wheel animation
5. XP result popup

### Loot Chest

When all weekly missions are complete, show a chest animation:
- Chest icon shakes, then opens
- Randomised bonus XP (20-100)
- Visual: CSS keyframe animation (shake → open → glow)
- Added to existing `getWeeklyMissions()` completion check

### Files Changed

- `js/gamification.js` — `spinHistory` data, `spinWheel()` function, chest reward logic
- `js/celebrations.js` — `showSpinWheel()`, `showChestOpen()` functions
- `css/gamification.css` — wheel styles, chest animation keyframes
- `index.html` — wheel and chest modal HTML
- `exercise.html` — wheel modal HTML
- `js/firebase-sync.js` — sync `spinHistory` to Firestore (add to `docData` in `syncProgress()`)

**Note:** All new animations (wheel spin, chest shake, pulsing border) must have `@media (prefers-reduced-motion: reduce)` overrides.

---

## Non-Goals

- Full Duolingo skill-path map (future evolution of Slice 2 if it works well)
- Avatars/character skins (nice-to-have, not in this round)
- Multiplayer/competitive quiz (requires real-time infrastructure)
- Mascot/companion (needs design work beyond code)
- Past paper questions (content creation task, not a platform feature)

## Risks

| Risk | Mitigation |
|------|------------|
| Dark mode breaks CTF/hacker aesthetic | CTF elements stay dark in both modes (explicit exception) |
| Glossary content creation is time-consuming | Start with Y7 topics only, expand incrementally |
| Spin-the-wheel feels "gambling" to parents | Frame as "bonus XP" not gambling, no real stakes, teacher-controlled |
| Large index.html gets bigger | Each slice adds minimal HTML; major JS stays in separate files |
