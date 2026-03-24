# Slice 1: Dark Mode + Visual Polish — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add dark mode, visual polish, and accessibility fixes to Python Lab — making it look modern and engaging for secondary school students.

**Architecture:** CSS custom properties define a semantic colour system (`:root` for light, `.dark` for dark). A JS toggle switches the `dark` class on `<html>`, persisted in `localStorage`. Hardcoded hex values in custom CSS are migrated to variables. Tailwind `dark:` utility classes are added to HTML elements. Visual polish (dot-grid backgrounds, themed year cards, branded loading) uses pure CSS.

**Tech Stack:** Vanilla HTML/CSS/JS, Tailwind CSS (CDN with `darkMode: 'class'`), no build step.

**Spec:** `docs/superpowers/specs/2026-03-24-visual-refresh-learning-depth-design.md` (Slice 1 section)

---

## File Structure

| File | Role | Action |
|------|------|--------|
| `css/platform.css` | Base styles, custom properties, dark mode | Modify — add `:root`/`.dark` variables, dot-grid background, loading screen, migrate colours |
| `css/gamification.css` | Gamification styles | Modify — migrate hardcoded `white`, `#1e293b`, `#e2e8f0`, `#64748b`, `#94a3b8` to `var()` |
| `js/theme.js` | Theme toggle logic | Create — reads/writes `localStorage`, toggles `dark` class, respects `prefers-color-scheme` |
| `index.html` | Landing page / SPA shell | Modify — add theme toggle button, `dark:` classes, themed year cards, a11y fixes, `<script src="js/theme.js">` |
| `exercise.html` | Exercise runner | Modify — add theme toggle, `dark:` classes, branded loading, back-link fix, `<script src="js/theme.js">` |
| `profile.html` | Student profile | Modify — add theme toggle, `dark:` classes, `<script src="js/theme.js">` |
| `login.html` | Authentication | Modify — add theme toggle, `dark:` classes, `<script src="js/theme.js">` |
| `topics.html` | Topic listing | Modify — add theme toggle, `dark:` classes, `<script src="js/theme.js">` |
| `challenges.html` | CTF challenges | Modify — add `<script src="js/theme.js">` (stays dark-themed, minimal changes) |
| `teacher.html` | Teacher dashboard | Modify — add theme toggle, `dark:` classes, `<script src="js/theme.js">` |

---

## Task 1: CSS Custom Properties + Dark Mode Foundation

**Files:**
- Modify: `css/platform.css` (add at top, before existing rules)

- [ ] **Step 1: Add custom properties to platform.css**

Add at the very top of `css/platform.css`, before all existing rules:

```css
/* ═══════════════════════════════════════════
   THEME — Semantic colour tokens
   ═══════════════════════════════════════════ */
:root {
  --surface: #ffffff;
  --surface-raised: #f8fafc;
  --surface-sunken: #f1f5f9;
  --border: #e2e8f0;
  --border-strong: #cbd5e1;
  --text-primary: #0f172a;
  --text-secondary: #64748b;
  --text-muted: #94a3b8;
  --text-inverse: #ffffff;
  --brand-50: #eef2ff;
  --brand-600: #4f46e5;
  --accent-success: #22c55e;
  --accent-error: #f87171;
  --accent-warning: #f59e0b;
}

.dark {
  --surface: #0f172a;
  --surface-raised: #1e293b;
  --surface-sunken: #020617;
  --border: #334155;
  --border-strong: #475569;
  --text-primary: #f1f5f9;
  --text-secondary: #94a3b8;
  --text-muted: #475569;
  --text-inverse: #0f172a;
  --brand-50: #1e1b4b;
  --brand-600: #818cf8;
  --accent-success: #4ade80;
  --accent-error: #f87171;
  --accent-warning: #fbbf24;
}
```

- [ ] **Step 2: Verify no syntax errors**

Open any HTML page in browser, open DevTools → Elements → Computed. Check that `--surface` resolves to `#ffffff`. Add `class="dark"` to `<html>` temporarily and verify `--surface` resolves to `#0f172a`.

- [ ] **Step 3: Commit**

```bash
git add css/platform.css
git commit -m "feat: add CSS custom properties for theme system"
```

---

## Task 2: Create Theme Toggle JS

**Files:**
- Create: `js/theme.js`

- [ ] **Step 1: Write theme.js**

```javascript
/**
 * Python Lab — Theme Toggle
 *
 * Reads theme from localStorage, falls back to prefers-color-scheme,
 * toggles 'dark' class on <html>.
 */
(function () {
    var STORAGE_KEY = "pythonlab_theme";

    function getPreferred() {
        var stored = null;
        try { stored = localStorage.getItem(STORAGE_KEY); } catch (e) {}
        if (stored === "dark" || stored === "light") return stored;
        if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) return "dark";
        return "light";
    }

    function apply(theme) {
        if (theme === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
        // Update all toggle button icons on the page
        var icons = document.querySelectorAll(".theme-toggle-icon");
        for (var i = 0; i < icons.length; i++) {
            icons[i].textContent = theme === "dark" ? "\u2600\uFE0F" : "\uD83C\uDF19";
        }
    }

    function toggle() {
        var current = document.documentElement.classList.contains("dark") ? "dark" : "light";
        var next = current === "dark" ? "light" : "dark";
        try { localStorage.setItem(STORAGE_KEY, next); } catch (e) {}
        apply(next);
    }

    // Apply on load (before DOMContentLoaded to avoid flash)
    apply(getPreferred());

    // Expose toggle for button onclick
    window.ThemeToggle = { toggle: toggle };
})();
```

- [ ] **Step 2: Verify the file loads without errors**

Add `<script src="js/theme.js"></script>` temporarily to `index.html` before the closing `</body>`. Open in browser, check console for errors. Type `ThemeToggle.toggle()` in console — page should have no visual change yet (no dark styles defined), but `<html>` should get/lose the `dark` class.

- [ ] **Step 3: Commit**

```bash
git add js/theme.js
git commit -m "feat: add theme toggle JS (localStorage + prefers-color-scheme)"
```

---

## Task 3: Migrate Gamification CSS to Custom Properties

**Files:**
- Modify: `css/gamification.css`

- [ ] **Step 1: Replace hardcoded colours with CSS variables**

Apply these replacements throughout `css/gamification.css`:

| Find | Replace | Context |
|------|---------|---------|
| `background: white` | `background: var(--surface)` | `.level-up-modal`, `.badge-toast`, `.stat-card`, `.badge-card` |
| `border: 1px solid #e2e8f0` | `border: 1px solid var(--border)` | `.stat-card`, `.badge-card`, `.badge-toast` |
| `border: 2px solid #e2e8f0` | `border: 2px solid var(--border)` | `.badge-toast` |
| `color: #1e293b` | `color: var(--text-primary)` | `.badge-toast-title`, `.badge-card-title`, `.stat-value`, `.level-up-name` |
| `color: #64748b` | `color: var(--text-secondary)` | `.level-up-level`, `.badge-toast-desc` |
| `color: #94a3b8` | `color: var(--text-muted)` | `.stat-label`, `.badge-card-desc` |
| `background: #e2e8f0` | `background: var(--border)` | `.xp-bar-container` |

**Do NOT change:** `.output-panel` colours (stays dark), `.hacker-card` (stays dark), `.secrets-section` (stays dark), `.ctf-badge` (stays dark), any gradient colours, any brand/accent colours.

- [ ] **Step 2: Verify in browser**

Open `profile.html` in browser. Stat cards, badge cards should look identical (still light mode). Temporarily add `class="dark"` to `<html>` — cards should now have dark backgrounds with light text.

- [ ] **Step 3: Fix the error text contrast issue**

In `css/platform.css`, change:
```css
.output-panel .error {
    color: #ef4444;
}
```
to:
```css
.output-panel .error {
    color: #f87171;
}
```

- [ ] **Step 4: Commit**

```bash
git add css/gamification.css css/platform.css
git commit -m "feat: migrate gamification CSS to custom properties, fix error text contrast"
```

---

## Task 4: Add Dark Mode Classes to index.html

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Add theme.js script tag**

After the existing `<script src="js/firebase-sync.js"></script>` line, add:
```html
<script src="js/theme.js"></script>
```

- [ ] **Step 2: Add theme toggle button to header**

In the header's right-side controls (inside the `div` that contains streak and profile link), add before the streak display:

```html
<button onclick="ThemeToggle.toggle()" class="rounded-lg p-1.5 text-lg leading-none hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors" aria-label="Toggle dark mode" title="Toggle dark mode">
    <span class="theme-toggle-icon">\uD83C\uDF19</span>
</button>
```

- [ ] **Step 3: Add dark: classes to key structural elements**

Add these dark mode classes throughout `index.html`:

| Element | Add classes |
|---------|------------|
| `<header>` (app-header) | `dark:bg-slate-900/80 dark:border-slate-700` |
| `<body>` tag | `dark:bg-slate-900 dark:text-slate-100` |
| Year-group card links (`bg-white`) | `dark:bg-slate-800 dark:border-slate-700` |
| Welcome screen container | `dark:bg-slate-900` |
| View containers | `dark:bg-slate-900` |
| Footer | `dark:bg-slate-900 dark:border-slate-700 dark:text-slate-400` |
| All `text-slate-900` headings | `dark:text-slate-100` |
| All `text-slate-600` body text | `dark:text-slate-300` |
| All `text-slate-400` muted text | `dark:text-slate-500` |
| All `border-slate-200` borders | `dark:border-slate-700` |
| All `bg-slate-50` backgrounds | `dark:bg-slate-800` |
| All `bg-white` cards/panels | `dark:bg-slate-800` |
| All `hover:bg-slate-50` | `dark:hover:bg-slate-700` |
| Login form inputs | `dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100` |

- [ ] **Step 4: Add aria-hidden to inactive views in showView()**

In the `showView()` function (around line 873), after hiding all views add `aria-hidden`:

```javascript
function showView(name) {
    var views = document.querySelectorAll('.view');
    for (var i = 0; i < views.length; i++) {
        views[i].classList.remove('active');
        views[i].setAttribute('aria-hidden', 'true');
    }
    var target = document.getElementById('view-' + name);
    if (target) {
        target.classList.add('active');
        target.removeAttribute('aria-hidden');
    }
    // ... rest unchanged
```

- [ ] **Step 5: Add focus management to navigate()**

In the `navigate()` function (around line 933), after `showView(view)` add:

```javascript
// Move focus to the view for keyboard/screen reader users
var target = document.getElementById('view-' + view);
if (target) {
    var heading = target.querySelector('h1, h2, [tabindex="-1"]');
    if (heading) { heading.setAttribute('tabindex', '-1'); heading.focus(); }
}
```

- [ ] **Step 6: Add sr-only label for nickname input**

Find `<input id="first-login-nickname-input"` and add before it:
```html
<label for="first-login-nickname-input" class="sr-only">Your nickname</label>
```

- [ ] **Step 7: Verify in browser**

Open `index.html`. Click the moon icon — page should switch to dark mode. Click again — back to light. Reload — should persist. Check all views (welcome, home, topics, exercise) in both modes.

- [ ] **Step 8: Commit**

```bash
git add index.html
git commit -m "feat: add dark mode toggle and dark: classes to index.html"
```

---

## Task 5: Add Dark Mode to exercise.html

**Files:**
- Modify: `exercise.html`

- [ ] **Step 1: Add theme.js script and toggle button**

Add `<script src="js/theme.js"></script>` after the other script tags. Add the same theme toggle button in the header area.

- [ ] **Step 2: Add dark: classes to structural elements**

Same pattern as index.html: `dark:bg-slate-900` on body, `dark:bg-slate-800` on cards/panels, `dark:text-slate-100` on headings, `dark:border-slate-700` on borders. The output panel and code editor stay dark in both modes.

- [ ] **Step 3: Fix back-link year parameter**

Find the `#back-link` element. Replace the hardcoded `year=7` with a dynamic read from URL params:

```javascript
var urlParams = new URLSearchParams(window.location.search);
var yearKey = urlParams.get("year") || "7";
document.getElementById("back-link").href = "topics.html?year=" + yearKey;
```

- [ ] **Step 4: Verify in browser**

Open an exercise in dark mode. Code editor, output panel, feedback panels should all look correct. Back link should return to the correct year group.

- [ ] **Step 5: Commit**

```bash
git add exercise.html
git commit -m "feat: add dark mode to exercise.html, fix back-link year param"
```

---

## Task 6: Add Dark Mode to Remaining Pages

**Files:**
- Modify: `profile.html`, `login.html`, `topics.html`, `challenges.html`, `teacher.html`

- [ ] **Step 1: Add theme.js script tag to all 5 pages**

Add `<script src="js/theme.js"></script>` to each page.

- [ ] **Step 2: Add dark: classes to profile.html**

Body, cards, headings, borders — same pattern. Badge grid cards use custom CSS (already migrated in Task 3).

- [ ] **Step 3: Add dark: classes to login.html**

Body, form, inputs, buttons — same pattern.

- [ ] **Step 4: Add dark: classes to topics.html**

Body, topic cards, headings, borders — same pattern.

- [ ] **Step 5: Add dark: classes to teacher.html**

Body, dashboard panels, tables, inputs — same pattern. This is the largest page after index.html.

- [ ] **Step 6: challenges.html — minimal changes**

CTF page is already dark-themed. Just add the theme.js script tag. No visual changes needed.

- [ ] **Step 7: Verify all pages in both modes**

Open each page, toggle dark mode, check for visual issues.

- [ ] **Step 8: Commit**

```bash
git add profile.html login.html topics.html challenges.html teacher.html
git commit -m "feat: add dark mode to profile, login, topics, challenges, teacher pages"
```

---

## Task 7: Visual Polish — Backgrounds and Year Cards

**Files:**
- Modify: `css/platform.css`, `index.html`

- [ ] **Step 1: Add dot-grid background to platform.css**

```css
/* Subtle dot-grid background for main views */
.bg-dotgrid {
  background-image: radial-gradient(circle, var(--border) 1px, transparent 1px);
  background-size: 24px 24px;
}
```

- [ ] **Step 2: Apply dot-grid to home and topics views in index.html**

Add class `bg-dotgrid` to `view-home` and `view-topics` container divs.

- [ ] **Step 3: Add themed top bands to year-group cards**

Replace the small coloured icon squares on year-group cards with a coloured top band:

Each year-group card `<a>` gets a coloured top section:
- Y7: `bg-gradient-to-r from-emerald-500 to-emerald-600` top band
- Y8: `bg-gradient-to-r from-blue-500 to-blue-600` top band
- Y9: `bg-gradient-to-r from-violet-500 to-violet-600` top band
- GCSE: `bg-gradient-to-r from-amber-500 to-amber-600` top band

Restructure card HTML to have a `rounded-t-2xl h-2` coloured strip at the top of each card.

- [ ] **Step 4: Upgrade year-group progress bars**

Replace the `h-1.5 bg-emerald-500 rounded-full` progress bars with the `xp-bar-container` / `xp-bar-fill` classes from `gamification.css` (includes shimmer animation).

- [ ] **Step 5: Verify visual changes**

Open home view. Dot-grid should be subtle. Year cards should have coloured top bands. Progress bars should shimmer.

- [ ] **Step 6: Commit**

```bash
git add css/platform.css index.html
git commit -m "feat: add dot-grid background, themed year cards, shimmer progress bars"
```

---

## Task 8: Branded Pyodide Loading Screen

**Files:**
- Modify: `exercise.html`, `index.html`

- [ ] **Step 1: Style the Pyodide loading state**

In both `exercise.html` and `index.html`, find the Pyodide loading message. Replace the bare "Loading Python..." text with a branded loading screen:

```html
<div id="pyodide-loading" class="flex flex-col items-center justify-center py-12">
    <div class="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-mono font-bold text-2xl shadow-lg mb-4">
        Py
    </div>
    <p class="text-base font-semibold text-slate-700 dark:text-slate-200 mb-2">Loading Python Engine</p>
    <div class="flex gap-1.5">
        <span class="loading-dot"></span>
        <span class="loading-dot"></span>
        <span class="loading-dot"></span>
    </div>
    <p class="text-xs text-slate-400 dark:text-slate-500 mt-3">First load may take a few seconds</p>
</div>
```

- [ ] **Step 2: Verify loading screen**

Open an exercise page. The Pyodide loading screen should show the branded logo, loading dots, and helpful text.

- [ ] **Step 3: Show XP on mobile in exercise.html**

Find the header XP/level widget that has `hidden sm:flex`. Change to `flex` (always visible) but condense on mobile:

```html
<div class="flex items-center gap-1 sm:gap-2">
    <span id="header-level-icon" class="text-base leading-none"></span>
    <span id="header-xp-text" class="font-bold text-brand-600 text-xs sm:text-sm">0 XP</span>
</div>
```

- [ ] **Step 4: Commit**

```bash
git add exercise.html index.html
git commit -m "feat: branded Pyodide loading screen, show XP on mobile"
```

---

## Task 9: Final Accessibility Fixes

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Fix locked topic cards for keyboard users**

In the JS that renders topic cards, when a topic is locked, add to the card element:
```javascript
card.setAttribute('tabindex', '-1');
card.setAttribute('aria-disabled', 'true');
```

- [ ] **Step 2: Increase locked badge opacity**

In `css/gamification.css`, change:
```css
.badge-card.locked {
    opacity: 0.45;
    filter: grayscale(1);
}
```
to:
```css
.badge-card.locked {
    opacity: 0.55;
    filter: grayscale(1);
}
```

- [ ] **Step 3: Full visual QA pass**

Open every page in both light and dark mode. Check:
- All text is readable (no white-on-white or dark-on-dark)
- All borders are visible
- CTF/hacker elements stay dark in both modes
- Output panel stays dark in both modes
- Theme toggle persists across pages
- Theme toggle persists across page reload
- Focus ring visible on interactive elements in dark mode

- [ ] **Step 4: Commit**

```bash
git add index.html css/gamification.css
git commit -m "fix: locked card a11y (tabindex, aria-disabled, opacity)"
```

---

## Task 10: Push and Verify Deployment

- [ ] **Step 1: Push all commits**

```bash
git push origin master
```

- [ ] **Step 2: Verify on live site**

Wait 1-2 minutes for Cloudflare Pages auto-deploy. Open https://kirstylabs.jkmv.co.uk and verify:
- Dark mode toggle works
- Visual polish visible (dot-grid, themed cards, shimmer bars)
- Branded loading screen shows on exercise pages
- All pages work in both modes

---

## Summary

| Task | Commits | Scope |
|------|---------|-------|
| 1 | CSS custom properties | Foundation |
| 2 | theme.js | Toggle logic |
| 3 | Migrate gamification CSS | Dark mode support |
| 4 | index.html dark mode + a11y | Main page |
| 5 | exercise.html dark mode + back-link fix | Exercise runner |
| 6 | Remaining pages dark mode | profile, login, topics, challenges, teacher |
| 7 | Dot-grid, themed cards, shimmer bars | Visual polish |
| 8 | Branded loading, mobile XP | Visual polish |
| 9 | Locked cards a11y, final QA | Accessibility |
| 10 | Push and verify | Deployment |
