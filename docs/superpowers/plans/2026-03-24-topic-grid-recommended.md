# Slice 2: Topic Grid + Recommended — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the linear single-column topic list with a responsive grid, add an "Up Next" badge to the first incomplete topic, add PRIMM type chips to topic cards, add exercise step indicator dots, and add a Quick Practice card on the home view.

**Architecture:** All changes are pure HTML/CSS/JS. Topic rendering in `index.html` SPA view and `topics.html` standalone page. Exercise step indicator in `exercise.html` and `index.html`. New CSS classes in `platform.css`. No new JS files — logic added inline where topics/exercises are rendered.

**Tech Stack:** Vanilla HTML/CSS/JS, Tailwind CSS (CDN), no build step.

**Spec:** `docs/superpowers/specs/2026-03-24-visual-refresh-learning-depth-design.md` (Slice 2 section)

---

## Task 1: Topic Grid Layout CSS

**Files:**
- Modify: `css/platform.css`

- [ ] **Step 1: Add topic grid and "Up Next" styles**

Add before the reduced motion media query in `platform.css`:

```css
/* ── Topic Grid ── */
.topic-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}
@media (min-width: 640px) {
  .topic-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (min-width: 1024px) {
  .topic-grid { grid-template-columns: repeat(3, 1fr); }
}

/* "Up Next" badge on recommended topic */
.topic-up-next {
  border-color: var(--brand-600) !important;
  box-shadow: 0 0 0 1px var(--brand-600), 0 4px 12px rgba(99, 102, 241, 0.15);
}
.up-next-badge {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  font-size: 0.625rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
  background: var(--brand-600);
  color: var(--text-inverse);
}

/* PRIMM type chips */
.primm-chip {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
}
.primm-chip-predict { background: #3b82f6; }
.primm-chip-run { background: #22c55e; }
.primm-chip-investigate { background: #f59e0b; }
.primm-chip-modify { background: #8b5cf6; }
.primm-chip-make { background: #ec4899; }

/* Exercise step indicator */
.step-dots {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}
.step-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 2px solid var(--border-strong);
  background: transparent;
  cursor: pointer;
  transition: all 0.2s ease;
}
.step-dot:hover {
  border-color: var(--brand-600);
}
.step-dot.step-current {
  background: var(--brand-600);
  border-color: var(--brand-600);
}
.step-dot.step-complete {
  background: var(--accent-success);
  border-color: var(--accent-success);
}

/* Quick Practice card */
.quick-practice-card {
  background: linear-gradient(135deg, var(--brand-50), var(--surface-raised));
  border: 1px solid var(--border);
  border-radius: 1rem;
  padding: 1.25rem;
  transition: all 0.2s ease;
}
.quick-practice-card:hover {
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.1);
}
```

- [ ] **Step 2: Commit**

```bash
git add css/platform.css
git commit -m "feat: add topic grid, step dots, quick practice CSS"
```

---

## Task 2: Topic Grid in index.html SPA View

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Change topic list rendering to use grid**

Find the JS function that renders topics in `view-topics` (search for `topics-topic-list` or the code that creates topic cards). Change the container from `space-y-5` to use class `topic-grid`.

- [ ] **Step 2: Add PRIMM type chips to topic cards**

When rendering each topic card, after the description text, add a row of PRIMM chips showing which exercise types are in that topic:

```javascript
// Build PRIMM chips
var types = {};
for (var e = 0; e < topic.exercises.length; e++) {
    types[topic.exercises[e].type] = true;
}
var chipsHtml = '<div class="flex gap-1 mt-2" aria-label="Exercise types">';
var typeNames = { predict: 'Predict', run: 'Run', investigate: 'Investigate', modify: 'Modify', make: 'Make' };
for (var t in types) {
    chipsHtml += '<span class="primm-chip primm-chip-' + t + '" title="' + (typeNames[t] || t) + '"></span>';
}
chipsHtml += '</div>';
```

Insert this chips HTML into each topic card.

- [ ] **Step 3: Add "Up Next" badge to first incomplete topic**

After rendering all topic cards, find the first topic where not all exercises are completed (check `Progress.isComplete(exerciseId)` for each exercise). Add class `topic-up-next` to that card and insert the `<span class="up-next-badge">Up Next</span>` element.

- [ ] **Step 4: Add progress fraction text**

Show "3/5 complete" text on each topic card below the PRIMM chips:

```javascript
var done = 0;
for (var e = 0; e < topic.exercises.length; e++) {
    if (Progress.isComplete(topic.exercises[e].id)) done++;
}
var progressHtml = '<p class="text-xs text-slate-400 dark:text-slate-500 mt-1">' + done + '/' + topic.exercises.length + ' complete</p>';
```

- [ ] **Step 5: Commit**

```bash
git add index.html
git commit -m "feat: topic grid layout with PRIMM chips and Up Next badge"
```

---

## Task 3: Topic Grid in topics.html

**Files:**
- Modify: `topics.html`

- [ ] **Step 1: Apply same grid layout**

Find the topic list container in `topics.html` and change from vertical stack to `topic-grid` class.

- [ ] **Step 2: Add PRIMM chips and progress fraction**

Same pattern as index.html — add type chips and "X/Y complete" text to each topic card.

- [ ] **Step 3: Commit**

```bash
git add topics.html
git commit -m "feat: topic grid layout with PRIMM chips on topics.html"
```

---

## Task 4: Exercise Step Indicator

**Files:**
- Modify: `exercise.html`, `index.html`

- [ ] **Step 1: Add step dots HTML to exercise.html**

Find the exercise header area (near the PRIMM badge and exercise number). After the exercise number span, add:

```html
<div id="step-dots" class="step-dots mt-3"></div>
```

- [ ] **Step 2: Render step dots in exercise.html JS**

In the JS that sets up the exercise view, after setting the exercise number text, add code to render the step dots:

```javascript
// Render step indicator dots
var dotsContainer = document.getElementById("step-dots");
if (dotsContainer && allExercises) {
    var dotsHtml = "";
    for (var d = 0; d < allExercises.length; d++) {
        var ex = allExercises[d];
        var isCurrent = d === exerciseIndex;
        var isComplete = Progress.isComplete(ex.id);
        var cls = "step-dot";
        if (isCurrent) cls += " step-current";
        else if (isComplete) cls += " step-complete";
        dotsHtml += '<a href="exercise.html?year=' + yearKey + '&topic=' + topicId + '&ex=' + ex.id + '" class="' + cls + '" title="' + ex.title + '" aria-label="Exercise ' + (d + 1) + ': ' + ex.title + '"></a>';
    }
    dotsContainer.innerHTML = dotsHtml;
}
```

- [ ] **Step 3: Add same step dots to index.html exercise view**

Same pattern in the `view-exercise` section of index.html. Add the `step-dots` container div and render dots in the exercise setup JS.

- [ ] **Step 4: Commit**

```bash
git add exercise.html index.html
git commit -m "feat: add exercise step indicator dots"
```

---

## Task 5: Quick Practice Card

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Add Quick Practice card HTML to home view**

In `view-home`, after the year-group cards grid, add:

```html
<!-- Quick Practice -->
<div id="quick-practice" class="hidden mt-6">
    <a id="quick-practice-link" href="#" class="quick-practice-card block">
        <div class="flex items-center gap-3">
            <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 text-lg">
                <span role="img" aria-label="lightning">&#x26A1;</span>
            </div>
            <div>
                <p class="text-sm font-bold text-slate-900 dark:text-slate-100">Quick Practice</p>
                <p id="quick-practice-desc" class="text-xs text-slate-500 dark:text-slate-400">Revise a random exercise</p>
            </div>
            <svg class="h-5 w-5 ml-auto text-slate-400" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
        </div>
    </a>
</div>
```

- [ ] **Step 2: Add Quick Practice JS logic**

In the home view initialisation code, after rendering year-group stats, add logic to pick a random exercise from any topic that has at least one completion:

```javascript
// Quick Practice — pick random exercise from a started topic
function setupQuickPractice() {
    if (typeof EXERCISES === 'undefined' || typeof Progress === 'undefined') return;
    var candidates = [];
    for (var yearKey in EXERCISES) {
        var topics = EXERCISES[yearKey].topics || [];
        for (var t = 0; t < topics.length; t++) {
            var topic = topics[t];
            var hasCompletion = false;
            for (var e = 0; e < topic.exercises.length; e++) {
                if (Progress.isComplete(topic.exercises[e].id)) {
                    hasCompletion = true;
                    break;
                }
            }
            if (hasCompletion) {
                for (var e2 = 0; e2 < topic.exercises.length; e2++) {
                    candidates.push({ exercise: topic.exercises[e2], year: yearKey, topic: topic.id });
                }
            }
        }
    }
    if (candidates.length === 0) return;
    var pick = candidates[Math.floor(Math.random() * candidates.length)];
    var card = document.getElementById('quick-practice');
    var link = document.getElementById('quick-practice-link');
    var desc = document.getElementById('quick-practice-desc');
    card.classList.remove('hidden');
    desc.textContent = pick.exercise.title + ' \u2014 ' + pick.exercise.type;
    link.onclick = function () { App.navigate('exercise', { year: pick.year, topic: pick.topic, ex: pick.exercise.id }); return false; };
}
setupQuickPractice();
```

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: add Quick Practice card to home view"
```

---

## Task 6: Push and Verify

- [ ] **Step 1: Push**

```bash
git push origin master
```

- [ ] **Step 2: Verify on live site**

Check:
- Topics display in 2-3 column grid on desktop
- PRIMM coloured dots visible on topic cards
- "Up Next" badge on first incomplete topic
- Step dots at top of exercise view, clickable
- Quick Practice card appears on home view (if student has completions)
