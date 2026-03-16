# Student Retention & Engagement Improvements — Design Spec

## Problem

Students engage with Python Lab during their first session but drop off by the end of week one. The platform is primarily used in-class, and students lack compelling reasons to return between lessons or maintain engagement across weeks.

Root causes identified:
- **No daily variety** — Every session feels the same
- **No social motivation** — Students are unaware of classmates' activity
- **Nothing new to unlock** — Progression (levels, badges) doesn't feel rewarding enough
- **Streaks feel invisible** — The streak system exists but students don't notice or care about it

## Constraints & Principles

- **All year groups (Year 7 through GCSE)** — Improvements must work universally
- **No features removed** — Everything is purely additive; existing features stay untouched
- **Teacher-controlled social features** — Social/competitive features are off by default; teachers opt in per class
- **CSS-only cosmetics** — No art assets or external images required for visual unlocks
- **Existing tech stack** — Vanilla ES5 JavaScript (no `let`/`const`/arrow functions/classes), localStorage + Firestore, no new dependencies
- **Existing data patterns** — New data stored in the same `pythonlab_game` / `pythonlab_progress` localStorage objects and synced to Firestore using existing patterns

## Solution Overview

Three phases, each addressing a different retention lever:

| Phase | Features | Retention lever |
|-------|----------|-----------------|
| 1 | Daily Challenge, Surprise Rewards, Weekly Missions | "Something new today" |
| 2 | Locked Content, Streak Overhaul, Level Perks | "I want to unlock the next thing" |
| 3 | Activity Feed, Class Goals, Leaderboard | "My class is counting on me" |

---

## Phase 1: Daily Variety + Weekly Missions

### 1.1 Daily Challenge

A single standalone exercise appears on the landing page each day, separate from topic progression.

**Behaviour:**
- A curated pool of ~30 standalone exercises stored in a new file `data/daily-challenges.js` as a `DAILY_CHALLENGES` array (loaded via `<script>` tag)
- One exercise is selected per day using `dayOfYear % pool.length` (deterministic — all students see the same challenge)
- Displayed as a prominent card on `index.html` above the year group icons, with the title "Today's Challenge" and a countdown showing hours remaining until the next one
- Completing the daily challenge awards 15 bonus XP on top of the normal exercise XP
- A separate "challenge streak" counter tracks consecutive days the student completes the daily challenge (independent of the regular activity streak, giving students two streaks to maintain)
- If already completed, the card shows a checkmark and "Come back tomorrow for a new one"

**Data model additions to `pythonlab_game`:**
```javascript
{
  dailyChallengeStreak: 5,
  longestChallengeStreak: 8,
  lastChallengeDate: "2026-03-16",
  dailyChallengesCompleted: 12
}
```

**UI placement:** Top of `index.html`, above existing year group icons.

### 1.2 Surprise Rewards

Small random bonuses that make each session feel unpredictable.

**Lucky XP (enhancement to existing feature):**
- The existing 20% chance of 3-8 bonus XP per exercise is kept as-is
- When it triggers, a distinct "Lucky Bonus!" animation plays (visually different from the normal XP popup — e.g. golden colour, sparkle effect) so students notice and talk about it
- Implementation: New animation variant in `celebrations.js`

**Double XP events (teacher-controlled):**
- Teachers toggle "Double XP" for their class from the teacher dashboard
- Stored on the class Firestore document as `doubleXP: true/false` and `doubleXPExpiry: <timestamp|null>`
- When active, a banner appears on the student's landing page: "Double XP active!"
- All XP earned during a Double XP event is doubled
- Teacher can set a duration (1 hour, rest of lesson, rest of day) or manually toggle off
- Duration-based events auto-expire: client checks `doubleXPExpiry` timestamp before applying the multiplier. If current time > expiry, Double XP is inactive regardless of the `doubleXP` flag

**Mystery badges (automatic):**
- 3-5 hidden badges with secret unlock conditions, not visible in the badge gallery until earned
- Students discover them by accident and share with classmates, creating organic social buzz
- Examples:
  - "Night Owl" — complete an exercise after 6pm local time
  - "Speed Demon" — complete 5 exercises in a single session (within 30 minutes)
  - "Perfectionist" — get 10 predictions correct in a row (cumulative, not necessarily in one session)
  - "Early Bird" — complete an exercise before 8am local time
  - "Marathon Runner" — spend 60+ minutes on exercises in one session

**Session definition for mystery badges:**
A "session" starts when the student opens any exercise page (sets `sessionStartTime` if null) and resets when the browser tab is closed or after 2 hours of inactivity (no exercise completions). Since these values are in localStorage, a page refresh preserves the session. The `sessionStartTime` is set on first exercise completion if currently null, and `sessionExerciseCount` increments on each completion. Both are cleared when `Date.now() - sessionStartTime > 2 hours`.

**Data model additions to `pythonlab_game`:**
```javascript
{
  // Mystery badge tracking (in addition to existing earnedBadges)
  sessionExerciseCount: 0,
  sessionStartTime: null,
  consecutiveCorrectPredictions: 0
}
```

### 1.3 Weekly Missions

Three small goals each week that give students a concrete checklist.

**Behaviour:**
- Every Monday (based on local time), three missions are generated from a template pool
- Mission templates with values scaled to the student's current level:
  - **XP mission**: "Earn {50-150} XP this week"
  - **Exercise count mission**: "Complete {3-8} exercises this week"
  - **Type-specific mission**: "Finish {2-4} {Investigate/Modify/Make} exercises"
  - **Streak mission**: "Maintain a {3-5} day streak"
  - **Topic mission**: "Complete all exercises in one topic"
  - **Daily challenge mission**: "Complete {2-4} daily challenges this week"
- 3 missions are randomly selected each week (no duplicates of the same category)
- Mission selection validates feasibility: "topic mission" is only offered if the student has a topic with at least 50% progress but not yet complete; "streak mission" targets never exceed the remaining days in the week (e.g. a mission generated on Wednesday can target at most a 5-day streak). If fewer than 3 feasible missions are available, fill remaining slots with XP or exercise count missions (always feasible)
- Targets scale with the student's level: Level 1-3 gets easier targets, Level 7-10 gets harder ones
- Each mission shows a progress indicator (e.g. "2/3 complete") and fills in as progress is made
- Completing all 3 missions awards a **Weekly Chest**: 50 bonus XP + a "Weekly Champion" badge variant:
  - Bronze: first weekly chest
  - Silver: 3 cumulative weekly chests
  - Gold: 5 cumulative weekly chests
- Missions that aren't completed simply expire — no penalty. Fresh set next Monday.

**Data model additions to `pythonlab_game`:**
```javascript
{
  weeklyMissions: [
    { type: "xp", target: 80, progress: 45 },
    { type: "exercise_count", target: 5, progress: 3 },
    { type: "type_specific", subtype: "investigate", target: 3, progress: 1 }
  ],
  weeklyMissionsGeneratedDate: "2026-03-16",
  weeklyChestsEarned: 2
}
```

**UI placement:** "This Week's Missions" section on `index.html`, between the daily challenge card and the year group icons. Three compact rows with icon, description, and progress bar.

---

## Phase 2: Unlock & Progression

### 2.1 Locked Content

Later topics appear locked to create curiosity and forward momentum.

**Behaviour:**
- Within each year group, only the first topic is unlocked by default
- Subsequent topics unlock when the student completes at least 50% of exercises in the previous topic
- Locked topics on `topics.html` show:
  - Dimmed card with a lock icon overlay
  - Topic title visible but exercises hidden
  - Label: "Complete {N} more exercises in {previous topic} to unlock"
- When a topic unlocks: lock-breaking animation plays, card brightens, toast notification appears
- On `index.html`, year group cards get a "{N}/{total} topics unlocked" label beneath the existing progress bar

**Edge cases:**
- **Existing progress preserved**: Any exercises a student has already completed in "locked" topics remain completed. The lock only affects the topic listing UI
- **Direct URL access**: If a student navigates directly to an exercise URL in a locked topic, it still works. The lock is a motivational UI element, not a hard gate
- **Teacher override**: Teachers can unlock all topics for a student or entire class from the dashboard, for cases where they want to jump to a specific topic during a lesson

**Data model:** No new data needed — unlock state is derived from existing completion data. The derivation checks `pythonlab_progress` (the primary completion store) and falls back to `pythonlab_game.completedExercises` if a discrepancy is found, treating an exercise as complete if either store records it. This handles edge cases where one store is cleared or corrupted. Teacher overrides stored as a field on the class/student Firestore document:
```javascript
// On class document
{ topicUnlockOverride: "all" }  // or null

// On student document (per-student override)
{ topicUnlockOverride: "all" }  // or null
```

### 2.2 Streak Overhaul

Make streaks more visible, rewarding, and recoverable.

**Evolving streak flame icon:**
The existing streak counter in the header gets a visual upgrade. The flame icon evolves based on streak length:
- Days 1-2: Small flame (existing)
- Days 3-6: Medium flame (slightly larger, warmer colour)
- Days 7-13: Large flame with subtle CSS glow
- Days 14-29: Blue flame
- Days 30+: Purple flame with CSS particle effect

Implementation: CSS classes applied to the streak icon element based on current streak value. All done with CSS gradients, box-shadows, and animations — no images.

**Streak milestone celebrations:**
The existing streak badges (3, 7, 14, 30 days) remain. Milestones now also trigger a celebration animation (reusing the existing level-up modal style) with a message: "7 Day Streak! You're unstoppable!"

**Streak recovery mission:**
Replaces the current silent streak freeze mechanic (same frequency: once per month):
- When a streak breaks, the student sees on next visit: "Your {N}-day streak ended yesterday. Complete 2 exercises today to recover it!"
- If they complete the recovery mission, the streak is restored to its previous value
- One recovery allowed per month (same as the existing freeze limit)
- If they don't complete the recovery, the streak resets as normal
- The recovery offer expires at the end of the day it's shown

**Migration from streak freeze:** The existing `streakFreezes` and `lastFreezeMonth` fields in `pythonlab_game` are replaced by the new recovery fields. On first load after the update, if `streakFreezes > 0` and `lastFreezeMonth` equals the current month, set `streakRecoveryAvailable: false` (freeze already used this month); otherwise set `streakRecoveryAvailable: true`. The `getProfile()` function in `gamification.js` must return the new recovery fields instead of `streakFreezes`. UI references to `streakFreezes` in `index.html` and `profile.html` must be replaced with recovery status display (e.g. "Recovery available" / "Recovery used this month").

**Streak calendar on profile:**
A 30-day grid on the profile page showing recent activity:
- Filled dot = active day
- Empty dot = missed day
- Gold dot = milestone day
- Similar to GitHub's contribution graph but simpler (single row of 30 dots)

**Data model additions to `pythonlab_game`:**
```javascript
{
  // Replaces existing streakFreezes / lastFreezeMonth
  streakRecoveryAvailable: true,
  streakRecoveryMonth: "2026-03",
  streakBrokenValue: 5,          // streak value before it broke
  streakRecoveryExpiry: "2026-03-16", // recovery offer expires end of this day
  activityHistory: ["2026-03-14", "2026-03-15", "2026-03-16"]  // last 30 active days, trimmed to 30 entries on each update
}
```

### 2.3 Level Perks

Each level (2-10) unlocks a tangible cosmetic perk.

**Perk list:**
| Level | Perk | Implementation |
|-------|------|----------------|
| 2 | Profile border colour choice (5 colours) | CSS border-color on profile card |
| 3 | Dark editor theme | CodeMirror theme toggle (built-in dark theme) |
| 4 | Custom streak flame colour (4 options) | CSS filter/colour on streak icon |
| 5 | Animated profile badge — highest badge gently pulses | CSS animation on badge element |
| 6 | Landing page gradient background (3 options) | CSS gradient on body |
| 7 | Editor font choice (Fira Code, Source Code Pro) | CSS font-family on CodeMirror |
| 8 | "Pro" label next to name on leaderboard | CSS badge/label element |
| 9 | Confetti colour customisation (choose celebration colours) | Pass colours to confetti function |
| 10 | All of the above + unique "Python Master" profile frame | CSS border/shadow on profile |

**Behaviour:**
- Perks are selected on the profile page in a new "Customise" section
- Shows all perks with locked/unlocked state
- Locked perks show the level required to unlock and a preview of what it looks like
- When leveling up, the existing level-up modal shows what was just unlocked: "You reached Level 3! You unlocked: Dark Editor Theme" with a preview
- All perks are CSS classes or CSS custom properties toggled on `<body>` or specific elements

**Data model additions to `pythonlab_game`:**
```javascript
{
  selectedPerks: {
    profileBorder: "blue",      // Level 2
    editorTheme: "dark",        // Level 3
    flameColour: "green",       // Level 4
    landingGradient: "sunset",  // Level 6
    editorFont: "fira-code",    // Level 7
    confettiColours: ["gold", "purple"]  // Level 9
  }
}
```

---

## Phase 3: Teacher-Controlled Social Layer

All features in this phase are **off by default**. Teachers opt in per class from the dashboard.

### 3.1 Class Activity Feed

A live feed of class achievements visible to students.

**Behaviour:**
- A collapsible "Class Activity" panel on the landing page (sidebar on desktop, below missions on mobile)
- Shows the last 10-15 milestone events from classmates:
  - "Alex earned the Code Detective badge"
  - "3 students completed Variables today"
  - "Sam reached Level 5!"
  - "Your class completed 47 exercises this week"
- Events are aggregated — only milestones (badges, levels, topic completions), not individual exercise completions. This keeps it positive and avoids exposing who's struggling
- Students only see events from their own class (filtered by class code)

**Teacher control:**
- On/off toggle per class from the teacher dashboard
- Off by default

**Data model:**
- Milestone events written as entries in a `feed` subcollection on the class Firestore document
- Each entry: `{ type: "badge"|"level"|"topic", studentNickname: "Alex", detail: "Code Detective", timestamp: <serverTimestamp> }`
- Feed entries written by the client when milestones occur (during `Gamification.completeExercise`)
- Old entries (>7 days) are cleaned up client-side: when a student loads the feed, the query filters to entries from the last 7 days only (`where("timestamp", ">", sevenDaysAgo)`). Stale entries remain in Firestore but are never displayed. If the collection grows too large over time, a teacher can manually clear old entries from the dashboard, or a Cloud Function can be added later as an optimisation

**Teacher dashboard addition:**
- "Class Feed" toggle in class settings
- Preview of recent feed entries

### 3.2 Class Goals

Collective targets that the whole class works toward together.

**Behaviour:**
- Teachers create a class goal from the dashboard by picking a metric and target:
  - Metrics: total exercises completed, total XP earned, number of students who reached a specific level, number of topics completed across the class
  - Example: "Class 7A: Complete 100 exercises by Friday"
- A shared progress bar appears on every student's landing page for that class, showing current class total vs. target
- When the goal is hit:
  - All students in the class get a celebration animation
  - "Team Player" badge awarded (first time only)
  - 25 bonus XP per student
- One active goal per class at a time
- When a goal is completed or its deadline passes, the teacher can set a new one

**Why collective:** Every student's contribution matters equally. A struggling student completing 2 exercises helps just as much as an advanced student completing 2. No one is singled out or ranked.

**Data model:**
```javascript
// On class Firestore document
{
  currentGoal: {
    metric: "exercises_completed",
    target: 100,
    current: 67,
    deadline: "2026-03-20",
    createdAt: <serverTimestamp>
  },
  // When null, no active goal
}
```

- Progress updates as students complete exercises. For `exercises_completed` and `xp_earned` metrics, use `firebase.firestore.FieldValue.increment(1)` (or the XP amount) to safely handle concurrent updates from multiple students. For `students_at_level` and `topics_completed` metrics, the counter is recalculated by querying student documents in the class (these change infrequently enough that a read-then-write is acceptable)

**Teacher dashboard addition:**
- "Set Class Goal" form: metric dropdown, target number, optional deadline
- Current goal progress display
- History of past goals

### 3.3 Optional Leaderboard

A weekly competitive view for classes where healthy competition works.

**Behaviour:**
- Teacher toggles "Show Leaderboard" per class from the dashboard. Off by default
- When enabled, a "This Week's Top 5" card appears on the student's landing page
- Shows top 5 students in the class by weekly XP (reuses the existing `weeklyXP` tracking in `gamification.js`; `weeklyXP` and `weekStartDate` must be added to the `syncProgress()` Firestore payload in `firebase-sync.js` — they are currently only in localStorage)
- Resets every Monday — a new week is a fresh start, so no one is permanently behind
- Students outside the top 5 see their own rank below the list: "You're #8 this week"
- Ties show the same rank

**Anonymity option:**
- Teacher chooses between two modes:
  - **Named**: Shows nicknames (e.g. "1. Alex — 120 XP")
  - **Anonymous**: Shows positions only (e.g. "1st — 120 XP") with only the student's own position highlighted
- This lets teachers use competition without public shaming

**Data model:**
```javascript
// On class Firestore document
{
  leaderboardEnabled: false,
  leaderboardAnonymous: false
}
```

- Leaderboard data is derived from student documents in the class (reading `weeklyXP` from each student). No separate leaderboard collection needed.

**Teacher dashboard addition:**
- "Leaderboard" toggle in class settings
- "Anonymous mode" checkbox (visible when leaderboard is enabled)

---

## Landing Page Layout (Updated)

After all three phases, the `index.html` landing page has this structure (top to bottom):

1. **Header** — Logo, streak flame (enhanced), XP/level indicator, profile link (existing, enhanced)
2. **Daily Challenge card** — Today's exercise, countdown, challenge streak (Phase 1)
3. **Class Goal progress bar** — If teacher has set one (Phase 3, conditional)
4. **Weekly Missions** — Three mission rows with progress (Phase 1)
5. **Year group icons** — With progress bars and topic unlock counts (existing, enhanced)
6. **Sidebar / below on mobile:**
   - Class Activity Feed (Phase 3, conditional)
   - This Week's Top 5 leaderboard (Phase 3, conditional)

---

## Files Affected

### New files:
- `data/daily-challenges.js` — Daily challenge exercise pool (~30 exercises)

### Modified files:
- `index.html` — Daily challenge card, weekly missions section, class goal bar, activity feed, leaderboard, topic unlock counts
- `exercise.html` — Double XP multiplier, mystery badge triggers, session tracking
- `topics.html` — Locked topic UI, unlock animations
- `profile.html` — Streak calendar, customise section for level perks, perk previews
- `teacher.html` — Double XP toggle, class goal form, feed toggle, leaderboard toggle, topic unlock override
- `js/gamification.js` — Daily challenge streak, weekly missions logic, mystery badges, streak recovery, level perks, session tracking
- `js/progress.js` — Topic unlock state derivation
- `js/celebrations.js` — Lucky XP animation variant, streak milestone celebration, topic unlock animation, goal completion celebration
- `js/firebase-sync.js` — Sync new data fields (including `weeklyXP` and `weekStartDate` which must be added to `syncProgress()` payload), feed writes, class goal increments via `FieldValue.increment()`, leaderboard reads, Double XP reads
- `data/exercises.js` — No changes to existing exercises
- `css/platform.css` — Locked topic styles, streak flame variants, level perk CSS classes
- `css/gamification.css` — Lucky XP animation, streak calendar, weekly mission styles, perk preview styles
