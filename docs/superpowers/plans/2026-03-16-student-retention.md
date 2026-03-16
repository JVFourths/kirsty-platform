# Student Retention & Engagement Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add daily challenges, surprise rewards, weekly missions, locked content, streak overhaul, level perks, and a teacher-controlled social layer to improve student retention after week one.

**Architecture:** All features are additive to the existing vanilla ES5 codebase. Logic additions go into the existing IIFE modules (`Gamification`, `Progress`, `FirebaseSync`, `Celebrations`). New UI sections are added to existing HTML pages via innerHTML generation. CSS additions use the existing stylesheet files. No new dependencies, no build step.

**Tech Stack:** Vanilla ES5 JavaScript, localStorage, Firebase/Firestore, Tailwind CSS (CDN), CodeMirror 5, Pyodide

**Spec:** `docs/superpowers/specs/2026-03-16-student-retention-design.md`

**Important conventions:**
- All JS must be ES5: use `var`, `function(){}`, no arrow functions, no `let`/`const`, no template literals, no classes
- All modules use the IIFE singleton pattern (e.g. `var Module = (function() { ... })();`)
- localStorage keys: `pythonlab_game`, `pythonlab_progress`, `pythonlab_student`
- Firestore collections: `students`, `classes`, `assignments`
- Use Tailwind utility classes for styling; custom CSS goes in `css/platform.css` or `css/gamification.css`

---

## Chunk 1: Phase 1 — Daily Variety + Weekly Missions

### Task 1: Daily Challenge Exercise Pool

**Files:**
- Create: `data/daily-challenges.js`

This file defines a global `DAILY_CHALLENGES` array with ~30 standalone exercises. These are not tied to any year group or topic — they're standalone puzzles for the daily challenge feature.

- [ ] **Step 1: Create `data/daily-challenges.js` with 10 initial challenges**

```javascript
// data/daily-challenges.js
var DAILY_CHALLENGES = [
  {
    id: "daily-1",
    title: "Backwards Name",
    type: "make",
    instructions: "Write a program that stores your name in a variable and prints it backwards. For example, if name = \"Python\", print \"nohtyP\".",
    starterCode: "# Write your code here\n",
    expectedOutput: null,
    checkFn: "output.length > 0 && output === output.split('').reverse().join('')",
    hint: "Use slicing: name[::-1]"
  },
  {
    id: "daily-2",
    title: "Sum to 100",
    type: "predict",
    instructions: "What will this code print?",
    starterCode: "total = 0\nfor i in range(1, 101):\n    total = total + i\nprint(total)",
    expectedOutput: "5050",
    hint: "The range goes from 1 to 100 inclusive."
  },
  {
    id: "daily-3",
    title: "Star Triangle",
    type: "make",
    instructions: "Write a program that prints a triangle of stars with 5 rows:\n*\n**\n***\n****\n*****",
    starterCode: "# Write your code here\n",
    expectedOutput: "*\n**\n***\n****\n*****",
    hint: "Use a for loop with range(1, 6) and multiply '*' by the loop variable."
  },
  {
    id: "daily-4",
    title: "Even or Odd",
    type: "predict",
    instructions: "What will this code print?",
    starterCode: "for num in [3, 8, 15, 22, 7]:\n    if num % 2 == 0:\n        print(str(num) + \" is even\")\n    else:\n        print(str(num) + \" is odd\")",
    expectedOutput: "3 is odd\n8 is even\n15 is odd\n22 is even\n7 is odd",
    hint: "The % operator gives the remainder after division."
  },
  {
    id: "daily-5",
    title: "Word Counter",
    type: "make",
    instructions: "Write a program that counts how many words are in the sentence \"the quick brown fox jumps over the lazy dog\" and prints the count.",
    starterCode: "# Write your code here\n",
    expectedOutput: "9",
    hint: "Use .split() to break the string into a list of words, then use len()."
  },
  {
    id: "daily-6",
    title: "Mystery Output",
    type: "predict",
    instructions: "What will this code print?",
    starterCode: "x = 1\nfor i in range(4):\n    x = x * 2\nprint(x)",
    expectedOutput: "16",
    hint: "Track the value of x after each loop: 2, 4, 8, 16."
  },
  {
    id: "daily-7",
    title: "Vowel Counter",
    type: "make",
    instructions: "Write a program that counts the number of vowels (a, e, i, o, u) in the word \"programming\" and prints the count.",
    starterCode: "# Write your code here\n",
    expectedOutput: "3",
    hint: "Loop through each letter and check if it is in \"aeiou\"."
  },
  {
    id: "daily-8",
    title: "List Maximum",
    type: "predict",
    instructions: "What will this code print?",
    starterCode: "numbers = [4, 7, 2, 9, 1, 5]\nbiggest = numbers[0]\nfor n in numbers:\n    if n > biggest:\n        biggest = n\nprint(biggest)",
    expectedOutput: "9",
    hint: "The loop checks each number against the current biggest."
  },
  {
    id: "daily-9",
    title: "FizzBuzz Lite",
    type: "make",
    instructions: "Print the numbers 1 to 15. But for multiples of 3, print \"Fizz\" instead of the number. For multiples of 5, print \"Buzz\". For multiples of both, print \"FizzBuzz\".",
    starterCode: "# Write your code here\n",
    expectedOutput: "1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz",
    hint: "Check divisible by both 3 AND 5 first, then 3, then 5, then just print the number."
  },
  {
    id: "daily-10",
    title: "String Repeater",
    type: "predict",
    instructions: "What will this code print?",
    starterCode: "word = \"ab\"\nresult = \"\"\nfor i in range(3):\n    result = result + word\n    print(result)",
    expectedOutput: "ab\nabab\nababab",
    hint: "Each loop iteration adds \"ab\" to what we already have."
  },
  {
    id: "daily-11",
    title: "Temperature Converter",
    type: "make",
    instructions: "Write a program that converts 98.6 degrees Fahrenheit to Celsius and prints the result rounded to 1 decimal place. Formula: C = (F - 32) * 5/9",
    starterCode: "# Write your code here\n",
    expectedOutput: "37.0",
    hint: "Use round(value, 1) to round to 1 decimal place."
  },
  {
    id: "daily-12",
    title: "Countdown",
    type: "predict",
    instructions: "What will this code print?",
    starterCode: "for i in range(5, 0, -1):\n    print(i)\nprint(\"Go!\")",
    expectedOutput: "5\n4\n3\n2\n1\nGo!",
    hint: "range(5, 0, -1) counts down from 5 to 1."
  },
  {
    id: "daily-13",
    title: "Initials Maker",
    type: "make",
    instructions: "Write a program that takes the name \"Ada Lovelace\" and prints just the initials \"A.L.\"",
    starterCode: "# Write your code here\n",
    expectedOutput: "A.L.",
    hint: "Split the name by spaces, take the first character of each part."
  },
  {
    id: "daily-14",
    title: "Pattern Spotter",
    type: "predict",
    instructions: "What will this code print?",
    starterCode: "for i in range(1, 6):\n    print(str(i) + \" x \" + str(i) + \" = \" + str(i * i))",
    expectedOutput: "1 x 1 = 1\n2 x 2 = 4\n3 x 3 = 9\n4 x 4 = 16\n5 x 5 = 25",
    hint: "It prints the square of each number from 1 to 5."
  },
  {
    id: "daily-15",
    title: "Password Checker",
    type: "make",
    instructions: "Write a program that checks if the password \"Secure123\" is valid. A valid password must be at least 8 characters long and contain at least one digit. Print \"Valid\" or \"Invalid\".",
    starterCode: "# Write your code here\n",
    expectedOutput: "Valid",
    hint: "Use len() to check length. Loop through characters and check .isdigit()."
  },
  {
    id: "daily-16",
    title: "List Reversal",
    type: "predict",
    instructions: "What will this code print?",
    starterCode: "fruits = [\"apple\", \"banana\", \"cherry\"]\nfruits.reverse()\nfor f in fruits:\n    print(f)",
    expectedOutput: "cherry\nbanana\napple",
    hint: ".reverse() changes the list in place."
  },
  {
    id: "daily-17",
    title: "Number Guesser",
    type: "modify",
    instructions: "This program checks guesses against a secret number, but it only checks one guess. Modify it to check ALL the guesses in the list and print whether each is 'Too low', 'Too high', or 'Correct!'.",
    starterCode: "secret = 7\nguesses = [3, 9, 7]\n\n# Currently only checks the first guess\nguess = guesses[0]\nif guess < secret:\n    print(\"Too low\")\nelif guess > secret:\n    print(\"Too high\")\nelse:\n    print(\"Correct!\")",
    expectedOutput: "Too low\nToo high\nCorrect!",
    hint: "Replace the single guess line with a for loop over all guesses."
  },
  {
    id: "daily-18",
    title: "Dictionary Lookup",
    type: "predict",
    instructions: "What will this code print?",
    starterCode: "scores = {\"Alice\": 85, \"Bob\": 92, \"Charlie\": 78}\nfor name in scores:\n    if scores[name] >= 80:\n        print(name + \" passed\")",
    expectedOutput: "Alice passed\nBob passed",
    hint: "Only Alice (85) and Bob (92) have scores >= 80."
  },
  {
    id: "daily-19",
    title: "Average Calculator",
    type: "make",
    instructions: "Write a program that calculates the average of the numbers [12, 45, 78, 23, 56] and prints the result as a whole number (integer).",
    starterCode: "# Write your code here\n",
    expectedOutput: "42",
    hint: "Use sum() and len(), then convert to int() or use // for integer division."
  },
  {
    id: "daily-20",
    title: "String Slicing",
    type: "predict",
    instructions: "What will this code print?",
    starterCode: "message = \"Hello World\"\nprint(message[0:5])\nprint(message[6:])\nprint(message[-5:])",
    expectedOutput: "Hello\nWorld\nWorld",
    hint: "Slicing: [start:end] extracts characters. Negative indices count from the end."
  },
  {
    id: "daily-21",
    title: "Multiplication Table",
    type: "make",
    instructions: "Write a program that prints the 9 times table from 9 x 1 to 9 x 5 in the format: \"9 x 1 = 9\"",
    starterCode: "# Write your code here\n",
    expectedOutput: "9 x 1 = 9\n9 x 2 = 18\n9 x 3 = 27\n9 x 4 = 36\n9 x 5 = 45",
    hint: "Use a for loop with range(1, 6) and string concatenation."
  },
  {
    id: "daily-22",
    title: "Nested Loop",
    type: "predict",
    instructions: "What will this code print?",
    starterCode: "for i in range(3):\n    for j in range(2):\n        print(str(i) + \",\" + str(j))",
    expectedOutput: "0,0\n0,1\n1,0\n1,1\n2,0\n2,1",
    hint: "The inner loop runs fully for each iteration of the outer loop."
  },
  {
    id: "daily-23",
    title: "Unique Letters",
    type: "make",
    instructions: "Write a program that finds and prints the number of unique letters in the word \"mississippi\" (case-insensitive).",
    starterCode: "# Write your code here\n",
    expectedOutput: "4",
    hint: "Convert to a set to get unique characters, then use len()."
  },
  {
    id: "daily-24",
    title: "Boolean Logic",
    type: "predict",
    instructions: "What will this code print?",
    starterCode: "a = True\nb = False\nprint(a and b)\nprint(a or b)\nprint(not b)",
    expectedOutput: "False\nTrue\nTrue",
    hint: "AND needs both True. OR needs at least one True. NOT flips the value."
  },
  {
    id: "daily-25",
    title: "List Filtering",
    type: "make",
    instructions: "Write a program that takes the list [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] and prints only the even numbers, each on a new line.",
    starterCode: "# Write your code here\n",
    expectedOutput: "2\n4\n6\n8\n10",
    hint: "Loop through the list and use if num % 2 == 0 to check for even."
  },
  {
    id: "daily-26",
    title: "Function Call",
    type: "predict",
    instructions: "What will this code print?",
    starterCode: "def greet(name, times):\n    for i in range(times):\n        print(\"Hi \" + name)\n\ngreet(\"Sam\", 3)",
    expectedOutput: "Hi Sam\nHi Sam\nHi Sam",
    hint: "The function prints the greeting 'times' number of times."
  },
  {
    id: "daily-27",
    title: "Palindrome Check",
    type: "make",
    instructions: "Write a program that checks if the word \"racecar\" is a palindrome (reads the same forwards and backwards). Print \"Yes\" if it is, \"No\" if it isn't.",
    starterCode: "# Write your code here\n",
    expectedOutput: "Yes",
    hint: "Compare the word to its reverse using slicing [::-1]."
  },
  {
    id: "daily-28",
    title: "While Loop",
    type: "predict",
    instructions: "What will this code print?",
    starterCode: "n = 1\nwhile n < 20:\n    n = n * 3\nprint(n)",
    expectedOutput: "27",
    hint: "Track n: starts at 1, then 3, then 9, then 27 (which is >= 20, so loop stops)."
  },
  {
    id: "daily-29",
    title: "Character Frequency",
    type: "make",
    instructions: "Write a program that counts how many times the letter 'a' appears in \"banana\" and prints the count.",
    starterCode: "# Write your code here\n",
    expectedOutput: "3",
    hint: "Use .count('a') or loop through and count manually."
  },
  {
    id: "daily-30",
    title: "Swap Variables",
    type: "predict",
    instructions: "What will this code print?",
    starterCode: "a = 10\nb = 20\na, b = b, a\nprint(a)\nprint(b)",
    expectedOutput: "20\n10",
    hint: "Python allows swapping with a, b = b, a in one line."
  }
];
```

- [ ] **Step 2: Verify the file loads correctly**

Open `index.html` in a browser with the script tag added temporarily. Open the console and type `DAILY_CHALLENGES.length` — should return `30`.

- [ ] **Step 3: Commit**

```bash
git add data/daily-challenges.js
git commit -m "feat: add 30 daily challenge exercises"
```

---

### Task 2: Gamification Module — Daily Challenge Tracking

**Files:**
- Modify: `js/gamification.js`

Add daily challenge tracking fields to the default data, and add functions to record daily challenge completion and get today's challenge.

- [ ] **Step 1: Add daily challenge fields to `_defaultData()`**

In `js/gamification.js`, find the `_defaultData` function (around line 82). Add the new fields AND remove the old `streakFreezes`/`lastFreezeMonth` fields (to prevent migration loop — see Task 12):

```javascript
// REMOVE these two lines from _defaultData():
//   streakFreezes: 1,
//   lastFreezeMonth: null,

// ADD these new fields after the existing fields, before the closing brace:
    dailyChallengeStreak: 0,
    longestChallengeStreak: 0,
    lastChallengeDate: "",
    dailyChallengesCompleted: 0,
    sessionExerciseCount: 0,
    sessionStartTime: null,
    consecutiveCorrectPredictions: 0,
    weeklyMissions: [],
    weeklyMissionsGeneratedDate: "",
    weeklyChestsEarned: 0,
    streakRecoveryAvailable: true,
    streakRecoveryMonth: "",
    streakBrokenValue: 0,
    streakRecoveryExpiry: "",
    activityHistory: [],
    selectedPerks: {}
```

- [ ] **Step 2: Add `getTodaysChallenge()` function**

Add this function to the public API of the Gamification IIFE (before the `return` statement):

```javascript
function getTodaysChallenge() {
  if (typeof DAILY_CHALLENGES === "undefined" || !DAILY_CHALLENGES.length) {
    return null;
  }
  var now = new Date();
  var start = new Date(now.getFullYear(), 0, 0);
  var diff = now - start;
  var oneDay = 1000 * 60 * 60 * 24;
  var dayOfYear = Math.floor(diff / oneDay);
  var index = dayOfYear % DAILY_CHALLENGES.length;
  return DAILY_CHALLENGES[index];
}

function isDailyChallengeComplete() {
  var data = _load();
  return data.lastChallengeDate === _today();
}

function completeDailyChallenge() {
  var data = _load();
  if (data.lastChallengeDate === _today()) {
    return { xpGained: 0, alreadyDone: true };
  }

  var yesterday = _yesterday();
  if (data.lastChallengeDate === yesterday) {
    data.dailyChallengeStreak = data.dailyChallengeStreak + 1;
  } else {
    data.dailyChallengeStreak = 1;
  }

  if (data.dailyChallengeStreak > data.longestChallengeStreak) {
    data.longestChallengeStreak = data.dailyChallengeStreak;
  }

  data.lastChallengeDate = _today();
  data.dailyChallengesCompleted = data.dailyChallengesCompleted + 1;
  data.totalXP = data.totalXP + 15;

  _save(data);
  return { xpGained: 15, alreadyDone: false, challengeStreak: data.dailyChallengeStreak };
}
```

- [ ] **Step 3: Expose new functions in the return object**

Add to the `return` statement of the Gamification IIFE:

```javascript
    getTodaysChallenge: getTodaysChallenge,
    isDailyChallengeComplete: isDailyChallengeComplete,
    completeDailyChallenge: completeDailyChallenge,
```

- [ ] **Step 4: Verify in browser console**

Open `index.html` (with `data/daily-challenges.js` script tag added). Run in console:
```javascript
Gamification.getTodaysChallenge() // should return an exercise object
Gamification.isDailyChallengeComplete() // should return false
```

- [ ] **Step 5: Commit**

```bash
git add js/gamification.js
git commit -m "feat: add daily challenge tracking to gamification module"
```

---

### Task 3: Gamification Module — Session Tracking & Mystery Badges

**Files:**
- Modify: `js/gamification.js`

Add session tracking for mystery badges and the mystery badge definitions.

- [ ] **Step 1: Add mystery badge definitions to the BADGES array**

In `js/gamification.js`, find the `BADGES` array (around line 46). Add these entries at the end of the array:

```javascript
  { id: "night-owl", title: "Night Owl", desc: "Complete an exercise after 6pm", icon: "🦉", hidden: true, check: function() { return false; } },
  { id: "early-bird", title: "Early Bird", desc: "Complete an exercise before 8am", icon: "🐦", hidden: true, check: function() { return false; } },
  { id: "speed-demon", title: "Speed Demon", desc: "Complete 5 exercises in one session", icon: "⚡", hidden: true, check: function() { return false; } },
  { id: "perfectionist", title: "Perfectionist", desc: "10 correct predictions in a row", icon: "💎", hidden: true, check: function() { return false; } },
  { id: "marathon-runner", title: "Marathon Runner", desc: "Spend 60+ minutes in one session", icon: "🏃", hidden: true, check: function() { return false; } }
```

- [ ] **Step 2: Add session management and mystery badge checking**

Add these functions inside the Gamification IIFE, before the return statement:

```javascript
function _updateSession(data) {
  var now = Date.now();
  // Reset session if > 2 hours since last activity
  if (data.sessionStartTime && (now - data.sessionStartTime > 2 * 60 * 60 * 1000)) {
    data.sessionExerciseCount = 0;
    data.sessionStartTime = null;
  }
  // Start session on first exercise completion
  if (!data.sessionStartTime) {
    data.sessionStartTime = now;
    data.sessionExerciseCount = 0;
  }
  data.sessionExerciseCount = data.sessionExerciseCount + 1;
  return data;
}

function _checkMysteryBadges(data) {
  var newBadges = [];
  var hour = new Date().getHours();

  // Night Owl: exercise after 6pm
  if (hour >= 18 && !data.earnedBadges["night-owl"]) {
    data.earnedBadges["night-owl"] = Date.now();
    newBadges.push(_findBadge("night-owl"));
  }

  // Early Bird: exercise before 8am
  if (hour < 8 && !data.earnedBadges["early-bird"]) {
    data.earnedBadges["early-bird"] = Date.now();
    newBadges.push(_findBadge("early-bird"));
  }

  // Speed Demon: 5 exercises in one session (within 30 min)
  if (data.sessionExerciseCount >= 5 && !data.earnedBadges["speed-demon"]) {
    var sessionDuration = Date.now() - data.sessionStartTime;
    if (sessionDuration <= 30 * 60 * 1000) {
      data.earnedBadges["speed-demon"] = Date.now();
      newBadges.push(_findBadge("speed-demon"));
    }
  }

  // Perfectionist: 10 correct predictions in a row
  if (data.consecutiveCorrectPredictions >= 10 && !data.earnedBadges["perfectionist"]) {
    data.earnedBadges["perfectionist"] = Date.now();
    newBadges.push(_findBadge("perfectionist"));
  }

  // Marathon Runner: 60+ minutes in one session
  if (data.sessionStartTime && !data.earnedBadges["marathon-runner"]) {
    var duration = Date.now() - data.sessionStartTime;
    if (duration >= 60 * 60 * 1000) {
      data.earnedBadges["marathon-runner"] = Date.now();
      newBadges.push(_findBadge("marathon-runner"));
    }
  }

  return newBadges;
}

function _findBadge(id) {
  for (var i = 0; i < BADGES.length; i++) {
    if (BADGES[i].id === id) return BADGES[i];
  }
  return null;
}
```

- [ ] **Step 3: Integrate session tracking into `completeExercise()`**

In the existing `completeExercise` function (around line 350), add these calls after the existing XP calculation and badge checking but before `_save(data)`:

```javascript
  // Add after existing badge checks, before _save(data):
  data = _updateSession(data);

  // Track prediction accuracy for Perfectionist badge
  if (exerciseType === "predict") {
    if (opts && opts.predictionCorrect) {
      data.consecutiveCorrectPredictions = data.consecutiveCorrectPredictions + 1;
    } else {
      data.consecutiveCorrectPredictions = 0;
    }
  }

  var mysteryBadges = _checkMysteryBadges(data);
  for (var m = 0; m < mysteryBadges.length; m++) {
    newBadges.push(mysteryBadges[m]);
  }
```

- [ ] **Step 4: Update `getProfile()` to filter hidden badges from the gallery**

In `getProfile()` (around line 435), update the `allBadges` return to include a `hidden` flag:

```javascript
  // In getProfile(), change the allBadges mapping to include hidden flag:
  // Existing badges are returned with hidden: false
  // Mystery badges with hidden: true are only included if earned
  var allBadges = [];
  for (var i = 0; i < BADGES.length; i++) {
    var b = BADGES[i];
    if (b.hidden && !data.earnedBadges[b.id]) {
      continue; // Don't show unearned mystery badges
    }
    allBadges.push(b);
  }
```

- [ ] **Step 5: Verify in browser console**

```javascript
Gamification.getProfile().allBadges // should NOT include hidden unearned badges
```

- [ ] **Step 6: Commit**

```bash
git add js/gamification.js
git commit -m "feat: add mystery badges and session tracking"
```

---

### Task 4: Gamification Module — Weekly Missions

**Files:**
- Modify: `js/gamification.js`

Add weekly mission generation, progress tracking, and completion logic.

- [ ] **Step 1: Add mission generation logic**

Add inside the Gamification IIFE, before the return statement:

```javascript
var MISSION_TEMPLATES = [
  { type: "xp", label: "Earn {target} XP this week", minTarget: 50, maxTarget: 150 },
  { type: "exercise_count", label: "Complete {target} exercises this week", minTarget: 3, maxTarget: 8 },
  { type: "type_specific", label: "Finish {target} {subtype} exercises", minTarget: 2, maxTarget: 4, subtypes: ["Investigate", "Modify", "Make"] },
  { type: "streak", label: "Maintain a {target} day streak", minTarget: 3, maxTarget: 5 },
  { type: "topic", label: "Complete all exercises in one topic", minTarget: 1, maxTarget: 1 },
  { type: "daily_challenge", label: "Complete {target} daily challenges", minTarget: 2, maxTarget: 4 }
];

function _scaleTarget(min, max, level) {
  // Levels 1-3: lower third, 4-6: middle, 7-10: upper
  var range = max - min;
  var scale = Math.min(level / 10, 1);
  return Math.round(min + range * scale);
}

function _isMissionFeasible(template, data) {
  if (template.type === "topic") {
    // Only offer if student has a topic with >= 50% but not 100%
    if (typeof EXERCISES === "undefined") return false;
    var years = ["7", "8", "9", "gcse"];
    for (var y = 0; y < years.length; y++) {
      var yearData = EXERCISES[years[y]];
      if (!yearData) continue;
      for (var t = 0; t < yearData.topics.length; t++) {
        var topic = yearData.topics[t];
        var done = 0;
        for (var e = 0; e < topic.exercises.length; e++) {
          if (data.completedExercises[topic.exercises[e].id]) done++;
        }
        var pct = topic.exercises.length > 0 ? done / topic.exercises.length : 0;
        if (pct >= 0.5 && pct < 1) return true;
      }
    }
    return false;
  }
  if (template.type === "streak") {
    // Remaining days in the week (Mon=1 to Sun=7)
    var today = new Date().getDay(); // 0=Sun, 1=Mon...
    var remaining = today === 0 ? 1 : 7 - today + 1;
    if (remaining < template.minTarget) return false;
  }
  return true;
}

function _generateMissions(data) {
  var level = getLevel(data.totalXP).level;
  var feasible = [];
  for (var i = 0; i < MISSION_TEMPLATES.length; i++) {
    if (_isMissionFeasible(MISSION_TEMPLATES[i], data)) {
      feasible.push(MISSION_TEMPLATES[i]);
    }
  }

  // Shuffle feasible missions
  for (var s = feasible.length - 1; s > 0; s--) {
    var j = Math.floor(Math.random() * (s + 1));
    var temp = feasible[s];
    feasible[s] = feasible[j];
    feasible[j] = temp;
  }

  var selected = [];
  var usedTypes = {};
  for (var f = 0; f < feasible.length && selected.length < 3; f++) {
    if (!usedTypes[feasible[f].type]) {
      usedTypes[feasible[f].type] = true;
      var tmpl = feasible[f];
      var mission = { type: tmpl.type, target: _scaleTarget(tmpl.minTarget, tmpl.maxTarget, level), progress: 0 };

      // Build label
      var label = tmpl.label.replace("{target}", mission.target);
      if (tmpl.type === "type_specific") {
        var subIdx = Math.floor(Math.random() * tmpl.subtypes.length);
        mission.subtype = tmpl.subtypes[subIdx].toLowerCase();
        label = label.replace("{subtype}", tmpl.subtypes[subIdx]);
      }
      mission.label = label;

      // For daily_challenge missions, store the starting count so progress is weekly not cumulative
      if (tmpl.type === "daily_challenge") {
        mission.startCount = data.dailyChallengesCompleted || 0;
      }

      selected.push(mission);
    }
  }

  // Fill remaining slots with XP or exercise_count if needed
  while (selected.length < 3) {
    var fillType = selected.length % 2 === 0 ? "xp" : "exercise_count";
    var fillTmpl = null;
    for (var ft = 0; ft < MISSION_TEMPLATES.length; ft++) {
      if (MISSION_TEMPLATES[ft].type === fillType) { fillTmpl = MISSION_TEMPLATES[ft]; break; }
    }
    if (fillTmpl) {
      var fillMission = {
        type: fillTmpl.type,
        target: _scaleTarget(fillTmpl.minTarget, fillTmpl.maxTarget, level),
        progress: 0,
        label: fillTmpl.label.replace("{target}", _scaleTarget(fillTmpl.minTarget, fillTmpl.maxTarget, level))
      };
      selected.push(fillMission);
    } else {
      break;
    }
  }

  return selected;
}

function getWeeklyMissions() {
  var data = _load();
  var mondayDate = _weekStart();

  // Generate new missions if it's a new week
  if (data.weeklyMissionsGeneratedDate !== mondayDate) {
    data.weeklyMissions = _generateMissions(data);
    data.weeklyMissionsGeneratedDate = mondayDate;
    _save(data);
  }

  return {
    missions: data.weeklyMissions,
    chestsEarned: data.weeklyChestsEarned,
    allComplete: _allMissionsComplete(data.weeklyMissions)
  };
}

function _allMissionsComplete(missions) {
  if (!missions || missions.length === 0) return false;
  for (var i = 0; i < missions.length; i++) {
    if (missions[i].progress < missions[i].target) return false;
  }
  return true;
}

function _updateMissionProgress(data, exerciseType, xpGained) {
  if (!data.weeklyMissions || data.weeklyMissions.length === 0) return;
  var wereAllComplete = _allMissionsComplete(data.weeklyMissions);

  for (var i = 0; i < data.weeklyMissions.length; i++) {
    var m = data.weeklyMissions[i];
    switch (m.type) {
      case "xp":
        m.progress = m.progress + xpGained;
        break;
      case "exercise_count":
        m.progress = m.progress + 1;
        break;
      case "type_specific":
        if (exerciseType === m.subtype) {
          m.progress = m.progress + 1;
        }
        break;
      case "streak":
        m.progress = data.currentStreak;
        break;
      case "daily_challenge":
        // Track weekly count: store the starting count when mission is generated
        // m.startCount is set during _generateMissions (see below)
        m.progress = data.dailyChallengesCompleted - (m.startCount || 0);
        break;
      case "topic":
        // Checked separately via _checkTopicMission
        break;
    }
    // Cap progress at target
    if (m.progress > m.target) m.progress = m.target;
  }

  // Check if all missions just completed (award weekly chest)
  if (!wereAllComplete && _allMissionsComplete(data.weeklyMissions)) {
    data.weeklyChestsEarned = data.weeklyChestsEarned + 1;
    data.totalXP = data.totalXP + 50;
  }
}
```

- [ ] **Step 2: Integrate mission progress into `completeExercise()`**

In the existing `completeExercise` function, add after the mystery badge check section:

```javascript
  // Update weekly mission progress
  _updateMissionProgress(data, exerciseType, xpGained);
```

Where `xpGained` is the total XP earned for this exercise (already calculated earlier in the function).

- [ ] **Step 3: Expose `getWeeklyMissions` in the return object**

```javascript
    getWeeklyMissions: getWeeklyMissions,
```

- [ ] **Step 4: Verify in browser console**

```javascript
Gamification.getWeeklyMissions() // should return { missions: [...], chestsEarned: 0, allComplete: false }
```

- [ ] **Step 5: Commit**

```bash
git add js/gamification.js
git commit -m "feat: add weekly missions generation and progress tracking"
```

---

### Task 5: Celebrations Module — Lucky XP Animation

**Files:**
- Modify: `js/celebrations.js`
- Modify: `css/gamification.css`

Add a distinct "Lucky Bonus!" animation for the existing random XP bonus.

- [ ] **Step 1: Add `showLuckyXP` function to celebrations.js**

Add this function inside the Celebrations IIFE, before the return statement:

```javascript
function showLuckyXP(xp, targetEl) {
  var popup = document.createElement("div");
  popup.className = "xp-popup lucky-xp";
  popup.innerHTML = "✨ Lucky +" + xp + " XP! ✨";

  var rect = targetEl.getBoundingClientRect();
  popup.style.left = rect.left + rect.width / 2 + "px";
  popup.style.top = rect.top + "px";
  document.body.appendChild(popup);

  requestAnimationFrame(function() {
    popup.classList.add("xp-popup-animate");
  });

  setTimeout(function() {
    if (popup.parentNode) popup.parentNode.removeChild(popup);
  }, 2000);
}
```

- [ ] **Step 2: Expose in return object**

```javascript
    showLuckyXP: showLuckyXP,
```

- [ ] **Step 3: Add CSS for lucky XP animation**

Add to the end of `css/gamification.css`:

```css
/* Lucky XP bonus animation */
.lucky-xp {
  color: #f59e0b;
  font-size: 1.25rem;
  font-weight: 800;
  text-shadow: 0 0 10px rgba(245, 158, 11, 0.6), 0 0 20px rgba(245, 158, 11, 0.3);
}

.lucky-xp.xp-popup-animate {
  animation: lucky-fade 2s ease-out forwards;
}

@keyframes lucky-fade {
  0% { opacity: 1; transform: translateY(0) scale(1); }
  30% { transform: translateY(-20px) scale(1.3); }
  100% { opacity: 0; transform: translateY(-60px) scale(0.8); }
}
```

- [ ] **Step 4: Integrate into `celebrate()` function**

In the existing `celebrate` function (around line 124 of celebrations.js), add a check for the bonus XP flag. The `result` object from `completeExercise` will need a `luckyBonus` field. Modify the `celebrate` function to call `showLuckyXP` when `result.luckyBonus` is set:

```javascript
  // Add inside celebrate(), after the existing showXP call:
  if (result.luckyBonus && result.luckyBonus > 0) {
    setTimeout(function() {
      showLuckyXP(result.luckyBonus, targetEl);
    }, 500);
  }
```

- [ ] **Step 5: Reuse existing `bonusXP` variable for lucky bonus detection**

The existing `completeExercise` function already has `var bonusXP = 0; if (Math.random() < 0.20) { bonusXP = ...; xp += bonusXP; }` and returns `bonusXP: bonusXP`. No new variable is needed — just use the existing `bonusXP` field in the celebrate call. Update the `celebrate` function check (Step 4) to use `result.bonusXP` instead of `result.luckyBonus`:

```javascript
  // In celebrate(), change the lucky bonus check to:
  if (result.bonusXP && result.bonusXP > 0) {
    setTimeout(function() {
      showLuckyXP(result.bonusXP, targetEl);
    }, 500);
  }
```

- [ ] **Step 6: Verify visually**

Complete an exercise multiple times. Approximately 1 in 5 should show the golden "Lucky Bonus" animation.

- [ ] **Step 7: Commit**

```bash
git add js/celebrations.js js/gamification.js css/gamification.css
git commit -m "feat: add lucky XP bonus animation"
```

---

### Task 6: Daily Challenge UI on Landing Page

**Files:**
- Modify: `index.html`

Add the daily challenge card above the year group icons, and load the `data/daily-challenges.js` script.

- [ ] **Step 1: Add script tag for daily challenges**

In `index.html`, find the existing `<script src="data/exercises.js"></script>` tag and add after it:

```html
<script src="data/daily-challenges.js"></script>
```

- [ ] **Step 2: Add daily challenge card HTML container**

In `index.html`, find the year group icons section (the desktop grid with year group cards). Add this container ABOVE it:

```html
<!-- Daily Challenge -->
<div id="daily-challenge-section" class="max-w-2xl mx-auto mb-8 hidden">
  <div id="daily-challenge-card" class="bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-200 rounded-2xl p-6 shadow-sm">
    <div class="flex items-center justify-between mb-3">
      <div class="flex items-center gap-2">
        <span class="text-2xl">🎯</span>
        <h2 class="text-lg font-bold text-gray-800">Today's Challenge</h2>
      </div>
      <div id="daily-challenge-timer" class="text-sm text-gray-500"></div>
    </div>
    <p id="daily-challenge-title" class="font-semibold text-gray-700 mb-1"></p>
    <p id="daily-challenge-type" class="text-sm text-gray-500 mb-3"></p>
    <div class="flex items-center justify-between">
      <a id="daily-challenge-link" href="#" class="inline-flex items-center gap-1 bg-amber-500 hover:bg-amber-600 text-white font-semibold px-4 py-2 rounded-lg text-sm transition">
        Start Challenge
      </a>
      <div id="daily-challenge-streak" class="text-sm text-amber-700 font-medium"></div>
    </div>
    <div id="daily-challenge-done" class="hidden text-center py-2">
      <span class="text-green-600 font-semibold">✅ Completed! Come back tomorrow for a new one</span>
    </div>
  </div>
</div>
```

- [ ] **Step 3: Add daily challenge rendering logic**

In the `<script>` section of `index.html`, add the daily challenge rendering function and call it on page load:

```javascript
function renderDailyChallenge() {
  var challenge = Gamification.getTodaysChallenge();
  var section = document.getElementById("daily-challenge-section");
  if (!challenge || !section) return;

  section.classList.remove("hidden");

  document.getElementById("daily-challenge-title").textContent = challenge.title;
  document.getElementById("daily-challenge-type").textContent = challenge.type.charAt(0).toUpperCase() + challenge.type.slice(1) + " exercise";
  document.getElementById("daily-challenge-link").href = "exercise.html?daily=" + challenge.id;

  // Countdown to midnight
  var now = new Date();
  var midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  var hoursLeft = Math.ceil((midnight - now) / (1000 * 60 * 60));
  document.getElementById("daily-challenge-timer").textContent = hoursLeft + "h remaining";

  // Challenge streak
  var profile = Gamification.getProfile();
  var streakText = profile.dailyChallengeStreak > 0 ? "🔥 " + profile.dailyChallengeStreak + " day challenge streak" : "";
  document.getElementById("daily-challenge-streak").textContent = streakText;

  // Show completed state if already done
  if (Gamification.isDailyChallengeComplete()) {
    document.getElementById("daily-challenge-link").classList.add("hidden");
    document.getElementById("daily-challenge-done").classList.remove("hidden");
  }
}
```

Call `renderDailyChallenge()` inside the existing page load / init function.

- [ ] **Step 4: Update `getProfile()` in gamification.js to include daily challenge streak**

In `getProfile()`, add to the returned object:

```javascript
    dailyChallengeStreak: data.dailyChallengeStreak,
    longestChallengeStreak: data.longestChallengeStreak,
    dailyChallengesCompleted: data.dailyChallengesCompleted
```

- [ ] **Step 5: Handle daily challenge completion in exercise.html**

In `exercise.html`, in the `markComplete` function (around line 716), add a check for the `daily` URL parameter. If present, also call `Gamification.completeDailyChallenge()`:

```javascript
  // After existing Progress.complete() and Gamification.completeExercise() calls:
  // Reuse the existing `params` variable (already declared at line 305)
  if (params.get("daily")) {
    Gamification.completeDailyChallenge();
  }
```

- [ ] **Step 6: Handle loading daily challenge exercises in exercise.html**

In `exercise.html`, in the exercise loading logic, add support for the `daily` parameter. When `daily` is set, load the exercise from `DAILY_CHALLENGES` instead of `EXERCISES`:

```javascript
  // Insert BEFORE the existing yearData/topic/exercise lookup logic (before line 310).
  // This block must set `exercise` and skip the normal lookup entirely.
  var dailyId = params.get("daily");
  if (dailyId && typeof DAILY_CHALLENGES !== "undefined") {
    for (var d = 0; d < DAILY_CHALLENGES.length; d++) {
      if (DAILY_CHALLENGES[d].id === dailyId) {
        exercise = DAILY_CHALLENGES[d];
        break;
      }
    }
    if (exercise) {
      // Skip the normal year/topic/exercise lookup — jump straight to rendering.
      // Wrap the remaining init code (from the line that sets exercise title onwards)
      // in a function like `renderExercise(exercise)` and call it here, then return.
      // This avoids the yearData redirect at line 310-311.
      renderExercise(exercise);
      return;
    }
  }
  // --- existing yearData lookup continues below ---
```

Also add the script tag `<script src="data/daily-challenges.js"></script>` to `exercise.html`.

- [ ] **Step 7: Verify the daily challenge card appears and links work**

Open `index.html` — the daily challenge card should appear above year groups. Click "Start Challenge" — should load the exercise.

- [ ] **Step 8: Commit**

```bash
git add index.html exercise.html js/gamification.js
git commit -m "feat: add daily challenge card to landing page"
```

---

### Task 7: Weekly Missions UI on Landing Page

**Files:**
- Modify: `index.html`

Add the weekly missions section between the daily challenge and year group icons.

- [ ] **Step 1: Add weekly missions HTML container**

In `index.html`, add this container AFTER the daily challenge section and BEFORE the year group icons:

```html
<!-- Weekly Missions -->
<div id="weekly-missions-section" class="max-w-2xl mx-auto mb-8 hidden">
  <div class="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-2">
        <span class="text-2xl">📋</span>
        <h2 class="text-lg font-bold text-gray-800">This Week's Missions</h2>
      </div>
      <div id="weekly-chest-badge" class="hidden">
        <span class="bg-amber-100 text-amber-800 text-xs font-semibold px-2 py-1 rounded-full">🎁 Weekly Chest!</span>
      </div>
    </div>
    <div id="weekly-missions-list" class="space-y-3"></div>
  </div>
</div>
```

- [ ] **Step 2: Add weekly missions rendering function**

In the `<script>` section of `index.html`:

```javascript
function renderWeeklyMissions() {
  var result = Gamification.getWeeklyMissions();
  var section = document.getElementById("weekly-missions-section");
  if (!section || !result.missions || result.missions.length === 0) return;

  section.classList.remove("hidden");
  var list = document.getElementById("weekly-missions-list");
  list.innerHTML = "";

  var icons = { xp: "⭐", exercise_count: "📝", type_specific: "🔬", streak: "🔥", topic: "📚", daily_challenge: "🎯" };

  for (var i = 0; i < result.missions.length; i++) {
    var m = result.missions[i];
    var pct = Math.min(Math.round((m.progress / m.target) * 100), 100);
    var done = m.progress >= m.target;
    var icon = icons[m.type] || "📋";

    var row = document.createElement("div");
    row.className = "flex items-center gap-3";
    row.innerHTML =
      '<span class="text-lg w-8 text-center">' + (done ? "✅" : icon) + '</span>' +
      '<div class="flex-1">' +
        '<div class="flex justify-between items-center mb-1">' +
          '<span class="text-sm font-medium text-gray-700">' + m.label + '</span>' +
          '<span class="text-xs text-gray-500">' + Math.min(m.progress, m.target) + '/' + m.target + '</span>' +
        '</div>' +
        '<div class="h-1.5 bg-gray-100 rounded-full overflow-hidden">' +
          '<div class="h-full rounded-full transition-all ' + (done ? 'bg-green-500' : 'bg-blue-500') + '" style="width: ' + pct + '%"></div>' +
        '</div>' +
      '</div>';
    list.appendChild(row);
  }

  // Show chest badge if all complete
  if (result.allComplete) {
    document.getElementById("weekly-chest-badge").classList.remove("hidden");
  }
}
```

Call `renderWeeklyMissions()` inside the existing page load / init function, after `renderDailyChallenge()`.

- [ ] **Step 3: Verify the weekly missions appear**

Open `index.html` — the weekly missions section should appear with 3 missions.

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "feat: add weekly missions UI to landing page"
```

---

### Task 8: Double XP — Firebase & Teacher Dashboard

**Files:**
- Modify: `js/firebase-sync.js`
- Modify: `teacher.html`
- Modify: `js/gamification.js`
- Modify: `index.html`

- [ ] **Step 1: Add Double XP functions to firebase-sync.js**

Add inside the FirebaseSync IIFE, before the return statement:

```javascript
function setDoubleXP(classCode, enabled, durationMinutes) {
  if (!_enabled || !db) return Promise.resolve();
  var update = { doubleXP: enabled };
  if (enabled && durationMinutes) {
    update.doubleXPExpiry = new Date(Date.now() + durationMinutes * 60 * 1000).toISOString();
  } else {
    update.doubleXPExpiry = null;
  }
  return db.collection("classes").doc(classCode).update(update);
}

function getDoubleXPStatus(classCode) {
  if (!_enabled || !db) return Promise.resolve(false);
  return db.collection("classes").doc(classCode).get().then(function(doc) {
    if (!doc.exists) return false;
    var data = doc.data();
    if (!data.doubleXP) return false;
    if (data.doubleXPExpiry) {
      var expiry = new Date(data.doubleXPExpiry);
      if (Date.now() > expiry.getTime()) return false;
    }
    return true;
  });
}
```

Expose in the return object:

```javascript
    setDoubleXP: setDoubleXP,
    getDoubleXPStatus: getDoubleXPStatus,
```

- [ ] **Step 2: Add Double XP multiplier to `completeExercise` in gamification.js**

Add an optional `doubleXP` flag to the opts parameter of `completeExercise`. When true, double the XP before saving:

```javascript
  // After XP calculation, before _save(data):
  if (opts && opts.doubleXP) {
    xpGained = xpGained * 2;
  }
```

- [ ] **Step 3: Add Double XP toggle to teacher.html**

In the class management section of `teacher.html`, add a toggle UI:

```html
<!-- Double XP Toggle (add in class settings area) -->
<div id="double-xp-section" class="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl">
  <div class="flex items-center justify-between">
    <div>
      <h4 class="font-semibold text-gray-800">⚡ Double XP</h4>
      <p class="text-sm text-gray-600">All students earn double XP</p>
    </div>
    <div class="flex items-center gap-2">
      <select id="double-xp-duration" class="text-sm border rounded px-2 py-1">
        <option value="60">1 hour</option>
        <option value="45">Rest of lesson (45m)</option>
        <option value="0">Until I turn it off</option>
      </select>
      <button id="double-xp-toggle" onclick="toggleDoubleXP()" class="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-sm font-semibold transition">
        Enable
      </button>
    </div>
  </div>
</div>
```

Add the toggle function in `teacher.html`'s script section:

```javascript
function toggleDoubleXP() {
  var btn = document.getElementById("double-xp-toggle");
  var select = document.getElementById("double-xp-duration");
  var classCode = document.getElementById("class-select").value;
  if (!classCode) return;

  var isEnabled = btn.textContent.trim() === "Disable";
  var duration = isEnabled ? 0 : parseInt(select.value);
  FirebaseSync.setDoubleXP(classCode, !isEnabled, duration || null).then(function() {
    btn.textContent = isEnabled ? "Enable" : "Disable";
    btn.className = isEnabled
      ? "px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-sm font-semibold transition"
      : "px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-semibold transition";
  });
}
```

- [ ] **Step 4: Add Double XP banner to index.html**

Add above the daily challenge section:

```html
<div id="double-xp-banner" class="hidden max-w-2xl mx-auto mb-4">
  <div class="bg-gradient-to-r from-amber-400 to-yellow-400 text-white font-bold text-center py-3 rounded-xl shadow-sm text-lg">
    ⚡ Double XP Active! ⚡
  </div>
</div>
```

Add rendering logic in the script section:

```javascript
function checkDoubleXP() {
  var student = FirebaseSync.getStudent();
  if (!student || !student.classCode) return;
  FirebaseSync.getDoubleXPStatus(student.classCode).then(function(active) {
    var banner = document.getElementById("double-xp-banner");
    if (banner) {
      if (active) {
        banner.classList.remove("hidden");
      } else {
        banner.classList.add("hidden");
      }
    }
    window._doubleXPActive = active;
  });
}
```

Call `checkDoubleXP()` on page load.

- [ ] **Step 5: Pass doubleXP flag through exercise.html**

In `exercise.html`, when calling `Gamification.completeExercise`, check the global `_doubleXPActive` flag:

```javascript
  // In markComplete():
  var result = Gamification.completeExercise(exercise.id, exercise.type, {
    firstTry: firstTry,
    predictionCorrect: predictionCorrect,
    doubleXP: window._doubleXPActive || false
  });
```

Also add the Double XP check to `exercise.html` on load:

```javascript
function checkDoubleXP() {
  var student = FirebaseSync.getStudent();
  if (!student || !student.classCode) return;
  FirebaseSync.getDoubleXPStatus(student.classCode).then(function(active) {
    window._doubleXPActive = active;
  });
}
// Call on page load
checkDoubleXP();
```

- [ ] **Step 6: Verify Double XP works end-to-end**

1. In teacher dashboard, enable Double XP for a class
2. Open student landing page — banner should appear
3. Complete an exercise — XP should be doubled

- [ ] **Step 7: Commit**

```bash
git add js/firebase-sync.js js/gamification.js teacher.html index.html exercise.html
git commit -m "feat: add teacher-controlled Double XP events"
```

---

### Task 9: Weekly Missions Badge Definitions

**Files:**
- Modify: `js/gamification.js`

Add the Weekly Champion badge variants (bronze, silver, gold).

- [ ] **Step 1: Add badge definitions**

Add to the BADGES array in gamification.js:

```javascript
  { id: "weekly-champion-bronze", title: "Weekly Champion", desc: "Earned your first Weekly Chest", icon: "🥉" },
  { id: "weekly-champion-silver", title: "Weekly Champion II", desc: "Earned 3 Weekly Chests", icon: "🥈" },
  { id: "weekly-champion-gold", title: "Weekly Champion III", desc: "Earned 5 Weekly Chests", icon: "🥇" }
```

- [ ] **Step 2: Add badge checks in `_updateMissionProgress`**

In the `_updateMissionProgress` function, after the weekly chest XP award:

```javascript
  // After data.totalXP = data.totalXP + 50:
  if (data.weeklyChestsEarned >= 1 && !data.earnedBadges["weekly-champion-bronze"]) {
    data.earnedBadges["weekly-champion-bronze"] = Date.now();
  }
  if (data.weeklyChestsEarned >= 3 && !data.earnedBadges["weekly-champion-silver"]) {
    data.earnedBadges["weekly-champion-silver"] = Date.now();
  }
  if (data.weeklyChestsEarned >= 5 && !data.earnedBadges["weekly-champion-gold"]) {
    data.earnedBadges["weekly-champion-gold"] = Date.now();
  }
```

- [ ] **Step 3: Commit**

```bash
git add js/gamification.js
git commit -m "feat: add Weekly Champion badge variants"
```

---

## Chunk 2: Phase 2 — Unlock & Progression

### Task 10: Topic Unlock Logic in Progress Module

**Files:**
- Modify: `js/progress.js`

Add a function to determine which topics are unlocked based on completion.

- [ ] **Step 1: Add `isTopicUnlocked` function**

Add inside the Progress IIFE, before the return statement:

```javascript
function isTopicUnlocked(yearKey, topicIndex) {
  // First topic is always unlocked
  if (topicIndex === 0) return true;

  if (typeof EXERCISES === "undefined") return true;
  var yearData = EXERCISES[yearKey];
  if (!yearData || !yearData.topics) return true;

  // Check previous topic has >= 50% completion
  var prevTopic = yearData.topics[topicIndex - 1];
  if (!prevTopic) return true;

  var progressData = _load();
  var gameData = null;
  try {
    gameData = JSON.parse(localStorage.getItem("pythonlab_game") || "{}");
  } catch (e) {
    gameData = {};
  }

  var done = 0;
  for (var i = 0; i < prevTopic.exercises.length; i++) {
    var exId = prevTopic.exercises[i].id;
    // Check both stores (spec requirement: treat as complete if either records it)
    var inProgress = progressData[exId] && progressData[exId].completed;
    var inGame = gameData.completedExercises && gameData.completedExercises[exId];
    if (inProgress || inGame) done++;
  }

  var pct = prevTopic.exercises.length > 0 ? done / prevTopic.exercises.length : 0;
  return pct >= 0.5;
}

function getUnlockCount(yearKey) {
  if (typeof EXERCISES === "undefined") return { unlocked: 0, total: 0 };
  var yearData = EXERCISES[yearKey];
  if (!yearData || !yearData.topics) return { unlocked: 0, total: 0 };

  var unlocked = 0;
  for (var i = 0; i < yearData.topics.length; i++) {
    if (isTopicUnlocked(yearKey, i)) unlocked++;
  }
  return { unlocked: unlocked, total: yearData.topics.length };
}
```

Expose in the return object:

```javascript
    isTopicUnlocked: isTopicUnlocked,
    getUnlockCount: getUnlockCount,
```

- [ ] **Step 2: Verify in console**

```javascript
Progress.isTopicUnlocked("7", 0) // true (first topic always unlocked)
Progress.isTopicUnlocked("7", 1) // depends on completion of first topic
Progress.getUnlockCount("7") // { unlocked: N, total: 3 }
```

- [ ] **Step 3: Commit**

```bash
git add js/progress.js
git commit -m "feat: add topic unlock logic to progress module"
```

---

### Task 11: Locked Topic UI on Topics Page

**Files:**
- Modify: `topics.html`
- Modify: `css/platform.css`

- [ ] **Step 1: Update topic rendering in topics.html**

In `topics.html`, find the topic card rendering loop (around line 148). Wrap the exercise list and modify styling based on lock state:

```javascript
  // Inside the topic rendering loop, after getting stats:
  var isUnlocked = Progress.isTopicUnlocked(yearKey, topicIndex);

  // Check for teacher override
  var topicOverride = window._topicUnlockOverride || false;
  if (topicOverride === "all") isUnlocked = true;
```

For locked topics, apply a different card style:

```javascript
  // Modify the card HTML based on lock state:
  if (!isUnlocked) {
    // Locked card: dimmed with lock overlay
    card.className = card.className + " topic-locked";
    // Hide exercise list
    exerciseList.style.display = "none";
    // Add lock overlay
    var lockLabel = document.createElement("div");
    lockLabel.className = "text-sm text-gray-500 mt-2 flex items-center gap-1";
    var prevTopic = EXERCISES[yearKey].topics[topicIndex - 1];
    var prevStats = Gamification.countForTopic(yearKey, prevTopic.id);
    var needed = Math.ceil(prevTopic.exercises.length * 0.5) - prevStats.done;
    lockLabel.innerHTML = "🔒 Complete " + needed + " more in " + prevTopic.title + " to unlock";
    card.appendChild(lockLabel);
  }
```

- [ ] **Step 2: Add locked topic CSS to platform.css**

```css
/* Locked topic card */
.topic-locked {
  opacity: 0.6;
  filter: grayscale(30%);
  pointer-events: none;
  position: relative;
}

.topic-locked::after {
  content: "";
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.3);
  border-radius: inherit;
}

/* Topic unlock animation */
.topic-unlocking {
  animation: topic-unlock 0.6s ease-out forwards;
}

@keyframes topic-unlock {
  0% { opacity: 0.6; filter: grayscale(30%); }
  50% { transform: scale(1.02); }
  100% { opacity: 1; filter: grayscale(0%); transform: scale(1); }
}
```

- [ ] **Step 3: Add topic unlock override check from Firestore**

In `topics.html`, add a check for teacher override on page load:

```javascript
function checkTopicOverride() {
  var student = FirebaseSync.getStudent();
  if (!student || !student.classCode) return;
  if (!FirebaseSync.enabled) return;

  // Check class-level override
  db.collection("classes").doc(student.classCode).get().then(function(doc) {
    if (doc.exists && doc.data().topicUnlockOverride === "all") {
      window._topicUnlockOverride = "all";
      renderTopics(); // Re-render with everything unlocked
    }
  });

  // Check student-level override
  if (student.id) {
    db.collection("students").doc(student.id).get().then(function(doc) {
      if (doc.exists && doc.data().topicUnlockOverride === "all") {
        window._topicUnlockOverride = "all";
        renderTopics();
      }
    });
  }
}
```

- [ ] **Step 4: Add unlock count label to index.html**

In `index.html`, update the year group card rendering to show topic unlock count. In the existing progress bar area, add below it:

```javascript
  // After progress bar rendering for each year:
  var unlockInfo = Progress.getUnlockCount(yearKey);
  var unlockLabel = document.createElement("p");
  unlockLabel.className = "text-xs text-gray-500 mt-1";
  unlockLabel.textContent = unlockInfo.unlocked + "/" + unlockInfo.total + " topics unlocked";
  // Append after progress bar
```

- [ ] **Step 5: Verify locked topics appear correctly**

Open `topics.html` with a fresh profile — only the first topic should be interactive, others should be dimmed with lock messages.

- [ ] **Step 6: Commit**

```bash
git add topics.html css/platform.css index.html
git commit -m "feat: add locked topic UI with unlock progression"
```

---

### Task 12: Streak Overhaul — Recovery, Flames, Calendar

**Files:**
- Modify: `js/gamification.js`
- Modify: `css/gamification.css`
- Modify: `profile.html`
- Modify: `index.html`

- [ ] **Step 1: Migrate streak freeze to recovery in gamification.js**

In the `_load` function (around line 111), add migration logic after loading data:

```javascript
  // Add after var data = JSON.parse(... ):
  // Migration: streak freeze -> streak recovery
  if (data.streakFreezes !== undefined && data.streakRecoveryAvailable === undefined) {
    var currentMonth = _thisMonth();
    if (data.streakFreezes > 0 && data.lastFreezeMonth === currentMonth) {
      data.streakRecoveryAvailable = false;
    } else {
      data.streakRecoveryAvailable = true;
    }
    data.streakRecoveryMonth = currentMonth;
    data.streakBrokenValue = 0;
    data.streakRecoveryExpiry = "";
    data.activityHistory = [];
    // Clean up old fields
    delete data.streakFreezes;
    delete data.lastFreezeMonth;
    _save(data);
  }
```

- [ ] **Step 2: Update `_updateStreak` to use recovery instead of freeze**

Replace the freeze logic in `_updateStreak` (around line 164) with recovery logic:

```javascript
function _updateStreak(data) {
  var today = _today();
  var yesterday = _yesterday();

  // IMPORTANT: Preserve the existing weekly XP reset logic from the original function
  var weekStart = _weekStart();
  if (data.weekStartDate !== weekStart) {
    data.weeklyXP = 0;
    data.weekStartDate = weekStart;
  }

  // Track activity history (trimmed to 30 entries)
  if (!data.activityHistory) data.activityHistory = [];
  if (data.activityHistory.indexOf(today) === -1) {
    data.activityHistory.push(today);
    if (data.activityHistory.length > 30) {
      data.activityHistory = data.activityHistory.slice(data.activityHistory.length - 30);
    }
  }

  // Reset recovery availability monthly
  var currentMonth = _thisMonth();
  if (data.streakRecoveryMonth !== currentMonth) {
    data.streakRecoveryAvailable = true;
    data.streakRecoveryMonth = currentMonth;
  }

  if (data.lastActivityDate === today) {
    return data; // Already recorded today
  }

  if (data.lastActivityDate === yesterday) {
    // Consecutive day — increment streak
    data.currentStreak = data.currentStreak + 1;
    data.streakBrokenValue = 0;
    data.streakRecoveryExpiry = "";
  } else if (data.lastActivityDate !== "") {
    // Missed a day
    if (data.streakRecoveryExpiry === today && data.streakBrokenValue > 0) {
      // Recovery is active — will be resolved when they complete 2 exercises
      // Don't reset streak yet
    } else if (data.currentStreak > 0 && data.streakRecoveryAvailable) {
      // Offer recovery
      data.streakBrokenValue = data.currentStreak;
      data.streakRecoveryExpiry = today;
      data.currentStreak = 0;
    } else {
      // No recovery available — full reset
      data.currentStreak = 1;
      data.streakBrokenValue = 0;
      data.streakRecoveryExpiry = "";
    }
  } else {
    data.currentStreak = 1;
  }

  if (data.currentStreak > data.longestStreak) {
    data.longestStreak = data.currentStreak;
  }

  data.lastActivityDate = today;
  return data;
}
```

- [ ] **Step 3: Add streak recovery completion logic**

Add inside the Gamification IIFE:

```javascript
function getStreakRecoveryStatus() {
  var data = _load();
  return {
    recoveryAvailable: data.streakRecoveryAvailable,
    brokenValue: data.streakBrokenValue,
    recoveryExpiry: data.streakRecoveryExpiry,
    recoveryActive: data.streakRecoveryExpiry === _today() && data.streakBrokenValue > 0
  };
}

function completeStreakRecovery() {
  var data = _load();
  if (data.streakRecoveryExpiry !== _today() || data.streakBrokenValue === 0) {
    return false;
  }
  // Check if 2 exercises completed today
  var todayExercises = 0;
  for (var id in data.completedExercises) {
    var ex = data.completedExercises[id];
    if (ex.timestamp) {
      var exDate = new Date(ex.timestamp).toISOString().split("T")[0];
      if (exDate === _today()) todayExercises++;
    }
  }
  if (todayExercises >= 2) {
    data.currentStreak = data.streakBrokenValue;
    data.streakBrokenValue = 0;
    data.streakRecoveryExpiry = "";
    data.streakRecoveryAvailable = false;
    _save(data);
    return true;
  }
  return false;
}
```

Expose in return object:

```javascript
    getStreakRecoveryStatus: getStreakRecoveryStatus,
    completeStreakRecovery: completeStreakRecovery,
```

- [ ] **Step 4: Add streak flame CSS classes**

Add to `css/gamification.css`:

```css
/* Evolving streak flame */
.streak-flame-sm { font-size: 1rem; }
.streak-flame-md { font-size: 1.25rem; }
.streak-flame-lg { font-size: 1.5rem; filter: drop-shadow(0 0 4px rgba(245, 158, 11, 0.5)); }
.streak-flame-blue { font-size: 1.5rem; filter: hue-rotate(200deg) drop-shadow(0 0 6px rgba(59, 130, 246, 0.5)); }
.streak-flame-purple { font-size: 1.75rem; filter: hue-rotate(260deg) drop-shadow(0 0 8px rgba(139, 92, 246, 0.5)); animation: fire-pulse 1.5s ease-in-out infinite alternate; }
```

- [ ] **Step 5: Update header streak rendering to use flame classes**

Add `getFlameClass` inside the Gamification IIFE (to avoid duplication across pages) and expose it:

```javascript
function getFlameClass(streakCount) {
  if (streakCount >= 30) return "streak-flame-purple";
  if (streakCount >= 14) return "streak-flame-blue";
  if (streakCount >= 7) return "streak-flame-lg";
  if (streakCount >= 3) return "streak-flame-md";
  return "streak-flame-sm";
}
```

Add to the Gamification return object: `getFlameClass: getFlameClass,`

Then in `exercise.html` and `index.html`, update the header streak rendering to use it:

```javascript
// In the header update function, apply the class to the fire emoji:
var streakIcon = document.getElementById("header-streak-icon");
if (streakIcon) {
  streakIcon.className = Gamification.getFlameClass(profile.currentStreak);
}
```

Add `id="header-streak-icon"` to the fire emoji span in the header HTML.

- [ ] **Step 6: Add streak calendar to profile.html**

In `profile.html`, find the streak info section (around line 123). Replace the `#streak-freezes` reference with recovery status, and add the calendar:

```html
<!-- Streak Calendar (add after streak info card) -->
<div class="mt-4">
  <h4 class="text-sm font-semibold text-gray-600 mb-2">Last 30 Days</h4>
  <div id="streak-calendar" class="flex gap-1 flex-wrap"></div>
</div>
```

Add rendering logic:

```javascript
function renderStreakCalendar() {
  var container = document.getElementById("streak-calendar");
  if (!container) return;
  var profile = Gamification.getProfile();
  var history = profile.activityHistory || [];
  container.innerHTML = "";

  var today = new Date();
  var milestones = [3, 7, 14, 30];

  for (var i = 29; i >= 0; i--) {
    var d = new Date(today);
    d.setDate(d.getDate() - i);
    var dateStr = d.toISOString().split("T")[0];
    var dot = document.createElement("div");
    dot.className = "w-3 h-3 rounded-full ";
    dot.title = dateStr;

    if (history.indexOf(dateStr) !== -1) {
      // Check if milestone day (streak reached 3, 7, 14, or 30 on this day)
      // Count consecutive days ending on this date
      var consecutiveDays = 0;
      for (var c = 0; c <= 29 - i; c++) {
        var checkDate = new Date(today);
        checkDate.setDate(checkDate.getDate() - i - c);
        if (history.indexOf(checkDate.toISOString().split("T")[0]) !== -1) {
          consecutiveDays++;
        } else {
          break;
        }
      }
      var isMilestone = milestones.indexOf(consecutiveDays) !== -1;
      dot.className += isMilestone ? "bg-amber-400" : "bg-green-500";
    } else {
      dot.className += "bg-gray-200";
    }
    container.appendChild(dot);
  }
}
```

- [ ] **Step 7: Update `getProfile()` to include recovery and activity history fields**

In gamification.js `getProfile()`, replace the old `streakFreezes` field:

```javascript
    // Replace: streakFreezes: data.streakFreezes,
    streakRecoveryAvailable: data.streakRecoveryAvailable,
    activityHistory: data.activityHistory || [],
    weekStartDate: data.weekStartDate || "",
```

- [ ] **Step 8: Update profile.html to show recovery status instead of freeze count**

Find the `#streak-freezes` element reference in `profile.html` (around line 132/198) and change:

```javascript
  // Replace: document.getElementById("streak-freezes").textContent = profile.streakFreezes;
  var recoveryEl = document.getElementById("streak-recovery");
  if (recoveryEl) {
    recoveryEl.textContent = profile.streakRecoveryAvailable ? "Recovery available" : "Recovery used this month";
  }
```

Update the HTML from `id="streak-freezes"` to `id="streak-recovery"`.

- [ ] **Step 9: Add streak recovery banner to index.html**

Add after the Double XP banner:

```html
<div id="streak-recovery-banner" class="hidden max-w-2xl mx-auto mb-4">
  <div class="bg-orange-50 border-2 border-orange-300 rounded-xl p-4">
    <p id="streak-recovery-message" class="font-semibold text-orange-800"></p>
    <p class="text-sm text-orange-600 mt-1">Complete 2 exercises today to recover it!</p>
  </div>
</div>
```

Add rendering logic:

```javascript
function checkStreakRecovery() {
  var recovery = Gamification.getStreakRecoveryStatus();
  var banner = document.getElementById("streak-recovery-banner");
  if (!banner) return;
  if (recovery.recoveryActive) {
    banner.classList.remove("hidden");
    document.getElementById("streak-recovery-message").textContent =
      "Your " + recovery.brokenValue + "-day streak ended yesterday!";
  }
}
```

- [ ] **Step 10: Add streak milestone celebration to celebrations.js**

In the existing `celebrate` function, add a check for streak milestones:

```javascript
  // Add to the celebrate function:
  if (result.streakMilestone) {
    var messages = { 3: "On a Roll!", 7: "Week Warrior!", 14: "Unstoppable!", 30: "Monthly Legend!" };
    var msg = messages[result.streakMilestone] || (result.streakMilestone + " Day Streak!");
    showStreak(result.streakMilestone);
  }
```

- [ ] **Step 11: Verify streak features**

1. Check profile page shows calendar and recovery status
2. Check header shows appropriate flame class
3. Simulate a broken streak and verify recovery banner

- [ ] **Step 12: Commit**

```bash
git add js/gamification.js js/celebrations.js css/gamification.css profile.html index.html exercise.html
git commit -m "feat: streak overhaul — recovery missions, flame evolution, calendar"
```

---

### Task 13: Level Perks — CSS & Data

**Files:**
- Modify: `js/gamification.js`
- Modify: `css/gamification.css`
- Modify: `profile.html`

- [ ] **Step 1: Add perk definitions to gamification.js**

Add inside the Gamification IIFE:

```javascript
var LEVEL_PERKS = [
  { level: 2, id: "profileBorder", label: "Profile Border Colour", options: ["blue", "green", "purple", "red", "gold"] },
  { level: 3, id: "editorTheme", label: "Dark Editor Theme", options: ["dark"] },
  { level: 4, id: "flameColour", label: "Custom Streak Flame", options: ["green", "blue", "pink", "gold"] },
  { level: 5, id: "animatedBadge", label: "Animated Profile Badge", options: ["enabled"] },
  { level: 6, id: "landingGradient", label: "Landing Page Theme", options: ["sunset", "ocean", "forest"] },
  { level: 7, id: "editorFont", label: "Editor Font Choice", options: ["fira-code", "source-code-pro"] },
  { level: 8, id: "proLabel", label: "Pro Label", options: ["enabled"] },
  { level: 9, id: "confettiColours", label: "Confetti Colours", options: ["gold-purple", "blue-green", "red-orange"] },
  { level: 10, id: "masterFrame", label: "Python Master Frame", options: ["enabled"] }
];

function getLevelPerks() {
  var data = _load();
  var currentLevel = getLevel(data.totalXP).level;
  var perks = [];
  for (var i = 0; i < LEVEL_PERKS.length; i++) {
    var p = LEVEL_PERKS[i];
    perks.push({
      level: p.level,
      id: p.id,
      label: p.label,
      options: p.options,
      unlocked: currentLevel >= p.level,
      selected: data.selectedPerks[p.id] || null
    });
  }
  return perks;
}

function selectPerk(perkId, value) {
  var data = _load();
  if (!data.selectedPerks) data.selectedPerks = {};
  data.selectedPerks[perkId] = value;
  _save(data);
}

function getSelectedPerks() {
  var data = _load();
  return data.selectedPerks || {};
}
```

Expose in return object:

```javascript
    getLevelPerks: getLevelPerks,
    selectPerk: selectPerk,
    getSelectedPerks: getSelectedPerks,
```

- [ ] **Step 2: Add perk CSS classes**

Add to `css/gamification.css`:

```css
/* Level Perks */
/* Profile border colours (Level 2) */
.perk-border-blue { border-color: #3b82f6 !important; border-width: 3px !important; }
.perk-border-green { border-color: #22c55e !important; border-width: 3px !important; }
.perk-border-purple { border-color: #8b5cf6 !important; border-width: 3px !important; }
.perk-border-red { border-color: #ef4444 !important; border-width: 3px !important; }
.perk-border-gold { border-color: #f59e0b !important; border-width: 3px !important; }

/* Flame colour overrides (Level 4) */
.perk-flame-green { filter: hue-rotate(80deg) !important; }
.perk-flame-blue { filter: hue-rotate(200deg) !important; }
.perk-flame-pink { filter: hue-rotate(300deg) !important; }
.perk-flame-gold { filter: saturate(2) brightness(1.2) !important; }

/* Animated badge pulse (Level 5) */
.perk-badge-animate { animation: badge-pulse 2s ease-in-out infinite; }
@keyframes badge-pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.08); } }

/* Landing page gradients (Level 6) */
.perk-gradient-sunset { background: linear-gradient(135deg, #fff7ed, #fef3c7, #fce7f3) !important; }
.perk-gradient-ocean { background: linear-gradient(135deg, #eff6ff, #e0f2fe, #f0f9ff) !important; }
.perk-gradient-forest { background: linear-gradient(135deg, #f0fdf4, #ecfdf5, #f7fee7) !important; }

/* Python Master frame (Level 10) */
.perk-master-frame {
  border: 3px solid transparent !important;
  background-clip: padding-box !important;
  box-shadow: 0 0 0 3px #f59e0b, 0 0 15px rgba(245, 158, 11, 0.3) !important;
}
```

- [ ] **Step 3: Add Customise section to profile.html**

In `profile.html`, add after the badge grid section (around line 142):

```html
<!-- Customise Section -->
<div class="mt-8">
  <h3 class="text-lg font-bold text-gray-800 mb-4">🎨 Customise</h3>
  <div id="perk-list" class="space-y-3"></div>
</div>
```

Add rendering logic:

```javascript
function renderPerks() {
  var perks = Gamification.getLevelPerks();
  var container = document.getElementById("perk-list");
  if (!container) return;
  container.innerHTML = "";

  for (var i = 0; i < perks.length; i++) {
    var p = perks[i];
    var card = document.createElement("div");
    card.className = "p-4 border rounded-xl " + (p.unlocked ? "bg-white" : "bg-gray-50 opacity-60");
    var html = '<div class="flex items-center justify-between">' +
      '<div>' +
        '<span class="font-semibold text-gray-800">' + p.label + '</span>' +
        '<span class="text-xs text-gray-500 ml-2">Level ' + p.level + '</span>' +
      '</div>';

    if (p.unlocked) {
      html += '<select class="text-sm border rounded px-2 py-1" onchange="Gamification.selectPerk(\'' + p.id + '\', this.value); applyPerks()">';
      html += '<option value="">Default</option>';
      for (var o = 0; o < p.options.length; o++) {
        var sel = p.selected === p.options[o] ? " selected" : "";
        html += '<option value="' + p.options[o] + '"' + sel + '>' + p.options[o] + '</option>';
      }
      html += '</select>';
    } else {
      html += '<span class="text-sm text-gray-400">🔒 Locked</span>';
    }

    html += '</div>';
    card.innerHTML = html;
    container.appendChild(card);
  }
}
```

- [ ] **Step 4: Add `applyPerks()` function (shared across pages)**

This function reads selected perks and applies CSS classes. Define inside the Gamification IIFE and expose via the return object (`applyPerks: applyPerks`):

```javascript
function applyPerks() {
  var perks = Gamification.getSelectedPerks();

  // Landing page gradient (Level 6)
  if (perks.landingGradient) {
    document.body.classList.add("perk-gradient-" + perks.landingGradient);
  }

  // Profile border (Level 2)
  var profileCard = document.querySelector(".profile-card");
  if (profileCard && perks.profileBorder) {
    profileCard.classList.add("perk-border-" + perks.profileBorder);
  }

  // Flame colour (Level 4)
  var flameIcon = document.getElementById("header-streak-icon");
  if (flameIcon && perks.flameColour) {
    flameIcon.classList.add("perk-flame-" + perks.flameColour);
  }

  // Master frame (Level 10)
  if (profileCard && perks.masterFrame === "enabled") {
    profileCard.classList.add("perk-master-frame");
  }
}
```

Call `Gamification.applyPerks()` on page load in each HTML file (index.html, exercise.html, profile.html, topics.html).

- [ ] **Step 5: Update level-up modal to show unlocked perk**

In `celebrations.js`, update `showLevelUp` to accept and display the perk info:

```javascript
  // In showLevelUp, after the overlay is appended to the body:
  if (levelData.perk) {
    var perkEl = document.createElement("p");
    perkEl.className = "level-up-perk";
    perkEl.textContent = "Unlocked: " + levelData.perk;
    overlay.querySelector(".level-up-modal").appendChild(perkEl);
  }
```

In gamification.js `completeExercise`, when a new level is reached, include the perk:

```javascript
  // When calculating newLevel, find the perk for that level:
  if (newLevel) {
    for (var lp = 0; lp < LEVEL_PERKS.length; lp++) {
      if (LEVEL_PERKS[lp].level === newLevel.level) {
        newLevel.perk = LEVEL_PERKS[lp].label;
        break;
      }
    }
  }
```

- [ ] **Step 6: Add perk CSS for level-up modal**

Add to `css/gamification.css`:

```css
.level-up-perk {
  color: #f59e0b;
  font-size: 0.95rem;
  font-weight: 600;
  margin-top: 0.5rem;
}
```

- [ ] **Step 7: Verify perks**

1. Profile page shows Customise section with locked/unlocked perks
2. Selecting a perk applies the CSS class immediately
3. Level-up modal shows unlocked perk name

- [ ] **Step 8: Commit**

```bash
git add js/gamification.js js/celebrations.js css/gamification.css profile.html
git commit -m "feat: add level perks — CSS cosmetics unlocked per level"
```

---

### Task 14: Topic Unlock Override in Teacher Dashboard

**Files:**
- Modify: `teacher.html`
- Modify: `js/firebase-sync.js`

- [ ] **Step 1: Add unlock override functions to firebase-sync.js**

```javascript
function setTopicUnlockOverride(classCode, override) {
  if (!_enabled || !db) return Promise.resolve();
  return db.collection("classes").doc(classCode).update({ topicUnlockOverride: override });
}

function setStudentTopicUnlockOverride(studentId, override) {
  if (!_enabled || !db) return Promise.resolve();
  return db.collection("students").doc(studentId).update({ topicUnlockOverride: override });
}
```

Expose in return object:

```javascript
    setTopicUnlockOverride: setTopicUnlockOverride,
    setStudentTopicUnlockOverride: setStudentTopicUnlockOverride,
```

- [ ] **Step 2: Add unlock toggle to teacher.html**

In the class management section, add:

```html
<div class="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
  <div class="flex items-center justify-between">
    <div>
      <h4 class="font-semibold text-gray-800">🔓 Topic Unlock Override</h4>
      <p class="text-sm text-gray-600">Unlock all topics for the entire class</p>
    </div>
    <button id="unlock-override-btn" onclick="toggleTopicOverride()" class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-semibold transition">
      Unlock All
    </button>
  </div>
</div>
```

Add script logic:

```javascript
function toggleTopicOverride() {
  var btn = document.getElementById("unlock-override-btn");
  var classCode = document.getElementById("class-select").value;
  if (!classCode) return;

  var isUnlocked = btn.textContent.trim() === "Lock Topics";
  var override = isUnlocked ? null : "all";
  FirebaseSync.setTopicUnlockOverride(classCode, override).then(function() {
    btn.textContent = isUnlocked ? "Unlock All" : "Lock Topics";
  });
}
```

- [ ] **Step 3: Commit**

```bash
git add teacher.html js/firebase-sync.js
git commit -m "feat: add topic unlock override for teachers"
```

---

## Chunk 3: Phase 3 — Teacher-Controlled Social Layer

### Task 15: Firebase Sync — weeklyXP, Feed, Class Goals

**Files:**
- Modify: `js/firebase-sync.js`

- [ ] **Step 1: Add weeklyXP to syncProgress payload**

In `syncProgress()` (around line 331 of firebase-sync.js), the existing function builds a payload from `Gamification.getProfile()` stored in a `profile` variable. Add `weeklyXP` and `weekStartDate` to that payload (note: `weekStartDate` was added to `getProfile()` in Task 12 Step 7):

```javascript
  // Add to the existing update object in syncProgress(), using the `profile` variable:
  weeklyXP: profile.weeklyXP || 0,
  weekStartDate: profile.weekStartDate || ""
```

- [ ] **Step 2: Add feed writing functions**

```javascript
function writeFeedEntry(classCode, entry) {
  if (!_enabled || !db) return Promise.resolve();
  return db.collection("classes").doc(classCode).collection("feed").add({
    type: entry.type,
    studentNickname: entry.studentNickname,
    detail: entry.detail,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  });
}

function getFeed(classCode) {
  if (!_enabled || !db) return Promise.resolve([]);
  var sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  return db.collection("classes").doc(classCode).collection("feed")
    .where("timestamp", ">", sevenDaysAgo)
    .orderBy("timestamp", "desc")
    .limit(15)
    .get()
    .then(function(snapshot) {
      var entries = [];
      snapshot.forEach(function(doc) {
        entries.push(doc.data());
      });
      return entries;
    });
}
```

- [ ] **Step 3: Add class goal functions**

```javascript
function setClassGoal(classCode, goal) {
  if (!_enabled || !db) return Promise.resolve();
  return db.collection("classes").doc(classCode).update({
    currentGoal: {
      metric: goal.metric,
      target: goal.target,
      current: 0,
      deadline: goal.deadline || null,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    }
  });
}

function incrementClassGoal(classCode, metric, amount) {
  if (!_enabled || !db) return Promise.resolve();
  // Only use increment for exercises_completed and xp_earned
  if (metric === "exercises_completed" || metric === "xp_earned") {
    return db.collection("classes").doc(classCode).update({
      "currentGoal.current": firebase.firestore.FieldValue.increment(amount)
    });
  }
  return Promise.resolve();
}

function getClassGoal(classCode) {
  if (!_enabled || !db) return Promise.resolve(null);
  return db.collection("classes").doc(classCode).get().then(function(doc) {
    if (!doc.exists) return null;
    return doc.data().currentGoal || null;
  });
}

function clearClassGoal(classCode) {
  if (!_enabled || !db) return Promise.resolve();
  return db.collection("classes").doc(classCode).update({ currentGoal: null });
}
```

- [ ] **Step 4: Add leaderboard and class settings functions**

```javascript
function getClassSettings(classCode) {
  if (!_enabled || !db) return Promise.resolve({});
  return db.collection("classes").doc(classCode).get().then(function(doc) {
    if (!doc.exists) return {};
    var data = doc.data();
    return {
      feedEnabled: data.feedEnabled || false,
      leaderboardEnabled: data.leaderboardEnabled || false,
      leaderboardAnonymous: data.leaderboardAnonymous || false,
      doubleXP: data.doubleXP || false,
      topicUnlockOverride: data.topicUnlockOverride || null
    };
  });
}

function updateClassSettings(classCode, settings) {
  if (!_enabled || !db) return Promise.resolve();
  // Use set with merge to handle cases where class doc may not have all fields yet
  return db.collection("classes").doc(classCode).set(settings, { merge: true });
}

function getLeaderboard(classCode) {
  if (!_enabled || !db) return Promise.resolve([]);

  // Calculate current week start to filter out stale data
  var now = new Date();
  var day = now.getDay();
  var diff = now.getDate() - day + (day === 0 ? -6 : 1);
  var monday = new Date(now.getFullYear(), now.getMonth(), diff);
  var currentWeekStart = monday.toISOString().split("T")[0];

  return db.collection("students")
    .where("classCode", "==", classCode)
    .orderBy("weeklyXP", "desc")
    .limit(10)
    .get()
    .then(function(snapshot) {
      var students = [];
      snapshot.forEach(function(doc) {
        var data = doc.data();
        // Only count XP from the current week; treat stale data as 0
        var xp = (data.weekStartDate === currentWeekStart) ? (data.weeklyXP || 0) : 0;
        students.push({
          id: doc.id,
          nickname: data.nickname,
          weeklyXP: xp
        });
      });
      // Re-sort since stale entries may have been zeroed out
      students.sort(function(a, b) { return b.weeklyXP - a.weeklyXP; });
      return students;
    });
}
```

- [ ] **Step 5: Expose all new functions**

```javascript
    writeFeedEntry: writeFeedEntry,
    getFeed: getFeed,
    setClassGoal: setClassGoal,
    incrementClassGoal: incrementClassGoal,
    getClassGoal: getClassGoal,
    clearClassGoal: clearClassGoal,
    getClassSettings: getClassSettings,
    updateClassSettings: updateClassSettings,
    getLeaderboard: getLeaderboard,
```

- [ ] **Step 6: Commit**

```bash
git add js/firebase-sync.js
git commit -m "feat: add Firebase functions for feed, class goals, leaderboard"
```

---

### Task 16: Feed Entry Writing on Milestones

**Files:**
- Modify: `js/gamification.js`

When a student earns a badge, reaches a new level, or completes a topic, write to the class feed.

- [ ] **Step 1: Add feed writing to `completeExercise()`**

After badges and level checks, add feed entries:

```javascript
  // After badge and level checks in completeExercise(), before return:
  var student = null;
  if (typeof FirebaseSync !== "undefined") {
    student = FirebaseSync.getStudent();
  }
  if (student && student.classCode) {
    // Write feed entries for milestones
    for (var fb = 0; fb < newBadges.length; fb++) {
      FirebaseSync.writeFeedEntry(student.classCode, {
        type: "badge",
        studentNickname: student.nickname || "A student",
        detail: newBadges[fb].title
      });
    }
    if (newLevel) {
      FirebaseSync.writeFeedEntry(student.classCode, {
        type: "level",
        studentNickname: student.nickname || "A student",
        detail: "Level " + newLevel.level
      });
    }

    // Check if a topic was just completed and write feed entry
    if (typeof EXERCISES !== "undefined") {
      var years = ["7", "8", "9", "gcse"];
      for (var fy = 0; fy < years.length; fy++) {
        var fyData = EXERCISES[years[fy]];
        if (!fyData) continue;
        for (var ft = 0; ft < fyData.topics.length; ft++) {
          var fTopic = fyData.topics[ft];
          var allDone = true;
          for (var fe = 0; fe < fTopic.exercises.length; fe++) {
            if (!data.completedExercises[fTopic.exercises[fe].id]) { allDone = false; break; }
          }
          // Check if this exercise was the one that completed the topic
          if (allDone && fTopic.exercises.length > 0) {
            var wasJustCompleted = false;
            for (var fex = 0; fex < fTopic.exercises.length; fex++) {
              if (fTopic.exercises[fex].id === exerciseId) { wasJustCompleted = true; break; }
            }
            if (wasJustCompleted) {
              FirebaseSync.writeFeedEntry(student.classCode, {
                type: "topic",
                studentNickname: student.nickname || "A student",
                detail: fTopic.title
              });
            }
          }
        }
      }
    }

    // Increment class goal if active
    // Note: the local variable for XP in completeExercise is `xp`, not `xpGained`
    // (xpGained is only used as a key in the return object)
    FirebaseSync.incrementClassGoal(student.classCode, "exercises_completed", 1);
    FirebaseSync.incrementClassGoal(student.classCode, "xp_earned", xp);
  }
```

- [ ] **Step 2: Commit**

```bash
git add js/gamification.js
git commit -m "feat: write feed entries and increment class goals on milestones"
```

---

### Task 17: Class Activity Feed UI

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Add activity feed container to index.html**

Add at the bottom of the main content area (after year group icons):

```html
<!-- Class Activity Feed -->
<div id="class-feed-section" class="hidden max-w-2xl mx-auto mt-8">
  <div class="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
    <div class="flex items-center justify-between mb-4 cursor-pointer" onclick="toggleFeed()">
      <div class="flex items-center gap-2">
        <span class="text-2xl">📣</span>
        <h2 class="text-lg font-bold text-gray-800">Class Activity</h2>
      </div>
      <span id="feed-toggle-icon" class="text-gray-400">▼</span>
    </div>
    <div id="class-feed-list" class="space-y-2"></div>
  </div>
</div>
```

- [ ] **Step 2: Add feed rendering logic**

```javascript
function renderClassFeed() {
  var student = FirebaseSync.getStudent();
  if (!student || !student.classCode) return;

  FirebaseSync.getClassSettings(student.classCode).then(function(settings) {
    if (!settings.feedEnabled) return;

    var section = document.getElementById("class-feed-section");
    if (section) section.classList.remove("hidden");

    FirebaseSync.getFeed(student.classCode).then(function(entries) {
      var list = document.getElementById("class-feed-list");
      if (!list) return;
      list.innerHTML = "";

      if (entries.length === 0) {
        list.innerHTML = '<p class="text-sm text-gray-400">No recent activity</p>';
        return;
      }

      var icons = { badge: "🏅", level: "⬆️", topic: "📚" };
      for (var i = 0; i < entries.length; i++) {
        var e = entries[i];
        var icon = icons[e.type] || "📌";
        var row = document.createElement("div");
        row.className = "flex items-center gap-2 text-sm text-gray-600 py-1";
        // Use textContent to avoid XSS from user-controlled nicknames
        var iconSpan = document.createElement("span");
        iconSpan.textContent = icon;
        var textSpan = document.createElement("span");
        var nickname = e.studentNickname || "Someone";
        var action = e.type === "badge" ? "earned " : e.type === "level" ? "reached " : "completed ";
        var detail = e.detail || "";
        var bold = document.createElement("strong");
        bold.textContent = nickname;
        textSpan.appendChild(bold);
        textSpan.appendChild(document.createTextNode(" " + action + detail));
        row.appendChild(iconSpan);
        row.appendChild(textSpan);
        list.appendChild(row);
      }
    });
  });
}

function toggleFeed() {
  var list = document.getElementById("class-feed-list");
  var icon = document.getElementById("feed-toggle-icon");
  if (list.style.display === "none") {
    list.style.display = "";
    icon.textContent = "▼";
  } else {
    list.style.display = "none";
    icon.textContent = "▶";
  }
}
```

Call `renderClassFeed()` on page load.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: add class activity feed to landing page"
```

---

### Task 18: Class Goal UI — Student View

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Add class goal progress bar to index.html**

Add between the daily challenge and weekly missions sections:

```html
<!-- Class Goal -->
<div id="class-goal-section" class="hidden max-w-2xl mx-auto mb-6">
  <div class="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-5">
    <div class="flex items-center gap-2 mb-2">
      <span class="text-xl">🎯</span>
      <h3 id="class-goal-title" class="font-bold text-gray-800"></h3>
    </div>
    <div class="h-3 bg-blue-100 rounded-full overflow-hidden mb-2">
      <div id="class-goal-bar" class="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all" style="width: 0%"></div>
    </div>
    <p id="class-goal-progress" class="text-sm text-gray-600 text-right"></p>
  </div>
</div>
```

- [ ] **Step 2: Add rendering logic**

```javascript
function renderClassGoal() {
  var student = FirebaseSync.getStudent();
  if (!student || !student.classCode) return;

  FirebaseSync.getClassGoal(student.classCode).then(function(goal) {
    if (!goal) return;

    // Check deadline
    if (goal.deadline) {
      var deadline = new Date(goal.deadline);
      if (Date.now() > deadline.getTime()) return; // Expired
    }

    var section = document.getElementById("class-goal-section");
    if (!section) return;
    section.classList.remove("hidden");

    var metricLabels = {
      exercises_completed: "exercises",
      xp_earned: "XP",
      students_at_level: "students",
      topics_completed: "topics"
    };

    var label = metricLabels[goal.metric] || goal.metric;
    document.getElementById("class-goal-title").textContent =
      "Class Goal: " + goal.target + " " + label;

    var current = Math.min(goal.current || 0, goal.target);
    var pct = Math.round((current / goal.target) * 100);
    document.getElementById("class-goal-bar").style.width = pct + "%";
    document.getElementById("class-goal-progress").textContent = current + " / " + goal.target;

    // Check if goal just completed
    if (current >= goal.target) {
      document.getElementById("class-goal-title").textContent += " — Completed! 🎉";
    }
  });
}
```

Call `renderClassGoal()` on page load.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: add class goal progress bar to landing page"
```

---

### Task 19: Leaderboard UI — Student View

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Add leaderboard container**

Add after the class feed section:

```html
<!-- Weekly Leaderboard -->
<div id="leaderboard-section" class="hidden max-w-2xl mx-auto mt-6">
  <div class="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
    <div class="flex items-center gap-2 mb-4">
      <span class="text-2xl">🏆</span>
      <h2 class="text-lg font-bold text-gray-800">This Week's Top 5</h2>
    </div>
    <div id="leaderboard-list" class="space-y-2"></div>
    <div id="leaderboard-own-rank" class="mt-3 pt-3 border-t text-sm text-gray-500"></div>
  </div>
</div>
```

- [ ] **Step 2: Add rendering logic**

```javascript
function renderLeaderboard() {
  var student = FirebaseSync.getStudent();
  if (!student || !student.classCode) return;

  FirebaseSync.getClassSettings(student.classCode).then(function(settings) {
    if (!settings.leaderboardEnabled) return;

    var section = document.getElementById("leaderboard-section");
    if (section) section.classList.remove("hidden");

    FirebaseSync.getLeaderboard(student.classCode).then(function(students) {
      var list = document.getElementById("leaderboard-list");
      if (!list) return;
      list.innerHTML = "";

      var isAnonymous = settings.leaderboardAnonymous;
      var medals = ["🥇", "🥈", "🥉", "4.", "5."];
      var ownRank = -1;
      var prevXP = -1;
      var rank = 0;

      for (var i = 0; i < students.length; i++) {
        // Handle ties
        if (students[i].weeklyXP !== prevXP) {
          rank = i + 1;
          prevXP = students[i].weeklyXP;
        }

        if (students[i].id === student.id) {
          ownRank = rank;
        }

        if (i < 5) {
          var row = document.createElement("div");
          var isMe = students[i].id === student.id;
          row.className = "flex items-center justify-between py-2 px-3 rounded-lg " + (isMe ? "bg-blue-50" : "");

          var name = isAnonymous ? (isMe ? student.nickname : "---") : students[i].nickname;
          var medal = rank <= 3 ? medals[rank - 1] : (rank + ".");

          // Use textContent to avoid XSS from user-controlled nicknames
          var left = document.createElement("div");
          left.className = "flex items-center gap-3";
          var medalSpan = document.createElement("span");
          medalSpan.className = "text-lg w-8";
          medalSpan.textContent = medal;
          var nameSpan = document.createElement("span");
          nameSpan.className = "font-medium text-gray-700";
          nameSpan.textContent = name;
          left.appendChild(medalSpan);
          left.appendChild(nameSpan);
          var xpSpan = document.createElement("span");
          xpSpan.className = "text-sm font-semibold text-gray-500";
          xpSpan.textContent = students[i].weeklyXP + " XP";
          row.appendChild(left);
          row.appendChild(xpSpan);
          list.appendChild(row);
        }
      }

      // Show own rank if outside top 5
      var ownRankEl = document.getElementById("leaderboard-own-rank");
      if (ownRankEl && ownRank > 5) {
        ownRankEl.textContent = "You're #" + ownRank + " this week";
      } else if (ownRankEl && ownRank <= 5 && ownRank > 0) {
        ownRankEl.textContent = "";
      }
    });
  });
}
```

Call `renderLeaderboard()` on page load.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: add weekly leaderboard to landing page"
```

---

### Task 20: Teacher Dashboard — Social Feature Controls

**Files:**
- Modify: `teacher.html`

- [ ] **Step 1: Add class settings panel to teacher.html**

In the class management tab or settings area, add:

```html
<!-- Class Social Settings -->
<div id="class-settings-section" class="mt-6 space-y-4">
  <h3 class="text-lg font-bold text-gray-800">Class Settings</h3>

  <!-- Feed Toggle -->
  <div class="p-4 bg-white border rounded-xl flex items-center justify-between">
    <div>
      <h4 class="font-semibold text-gray-800">📣 Class Activity Feed</h4>
      <p class="text-sm text-gray-600">Students see classmates' achievements</p>
    </div>
    <label class="relative inline-flex items-center cursor-pointer">
      <input type="checkbox" id="feed-toggle" onchange="updateClassSetting('feedEnabled', this.checked)" class="sr-only peer">
      <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
    </label>
  </div>

  <!-- Leaderboard Toggle -->
  <div class="p-4 bg-white border rounded-xl">
    <div class="flex items-center justify-between">
      <div>
        <h4 class="font-semibold text-gray-800">🏆 Weekly Leaderboard</h4>
        <p class="text-sm text-gray-600">Top 5 students by weekly XP</p>
      </div>
      <label class="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" id="leaderboard-toggle" onchange="updateClassSetting('leaderboardEnabled', this.checked)" class="sr-only peer">
        <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
      </label>
    </div>
    <div id="leaderboard-anon-option" class="mt-3 hidden">
      <label class="flex items-center gap-2 text-sm text-gray-600">
        <input type="checkbox" id="leaderboard-anon" onchange="updateClassSetting('leaderboardAnonymous', this.checked)">
        Anonymous mode (hide student names)
      </label>
    </div>
  </div>

  <!-- Class Goal -->
  <div class="p-4 bg-white border rounded-xl">
    <h4 class="font-semibold text-gray-800 mb-3">🎯 Class Goal</h4>
    <div id="current-goal-display" class="hidden mb-4 p-3 bg-blue-50 rounded-lg">
      <p id="current-goal-text" class="font-medium text-gray-700"></p>
      <div class="h-2 bg-blue-100 rounded-full mt-2 overflow-hidden">
        <div id="current-goal-bar" class="h-full bg-blue-500 rounded-full" style="width: 0%"></div>
      </div>
      <div class="flex justify-between mt-1">
        <span id="current-goal-progress-text" class="text-xs text-gray-500"></span>
        <button onclick="clearGoal()" class="text-xs text-red-500 hover:underline">Clear Goal</button>
      </div>
    </div>
    <div id="goal-form">
      <div class="flex gap-2 mb-2">
        <select id="goal-metric" class="flex-1 border rounded px-3 py-2 text-sm">
          <option value="exercises_completed">Exercises completed</option>
          <option value="xp_earned">XP earned</option>
        </select>
        <input type="number" id="goal-target" placeholder="Target" class="w-24 border rounded px-3 py-2 text-sm">
      </div>
      <div class="flex gap-2">
        <input type="date" id="goal-deadline" class="flex-1 border rounded px-3 py-2 text-sm">
        <button onclick="setGoal()" class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition">Set Goal</button>
      </div>
    </div>
  </div>
</div>
```

- [ ] **Step 2: Add teacher dashboard script functions**

```javascript
function updateClassSetting(key, value) {
  var classCode = document.getElementById("class-select").value;
  if (!classCode) return;
  var update = {};
  update[key] = value;
  FirebaseSync.updateClassSettings(classCode, update).then(function() {
    // Show/hide anonymous option when leaderboard toggled
    if (key === "leaderboardEnabled") {
      var anonOption = document.getElementById("leaderboard-anon-option");
      if (anonOption) {
        anonOption.classList.toggle("hidden", !value);
      }
    }
  });
}

function loadClassSettings() {
  var classCode = document.getElementById("class-select").value;
  if (!classCode) return;
  FirebaseSync.getClassSettings(classCode).then(function(settings) {
    document.getElementById("feed-toggle").checked = settings.feedEnabled || false;
    document.getElementById("leaderboard-toggle").checked = settings.leaderboardEnabled || false;
    document.getElementById("leaderboard-anon").checked = settings.leaderboardAnonymous || false;
    var anonOption = document.getElementById("leaderboard-anon-option");
    if (anonOption) {
      anonOption.classList.toggle("hidden", !settings.leaderboardEnabled);
    }
  });

  // Load current goal
  FirebaseSync.getClassGoal(classCode).then(function(goal) {
    var display = document.getElementById("current-goal-display");
    if (!display) return;
    if (goal) {
      display.classList.remove("hidden");
      document.getElementById("goal-form").classList.add("hidden");
      var labels = { exercises_completed: "exercises", xp_earned: "XP" };
      document.getElementById("current-goal-text").textContent =
        "Goal: " + goal.target + " " + (labels[goal.metric] || goal.metric);
      var pct = Math.round(((goal.current || 0) / goal.target) * 100);
      document.getElementById("current-goal-bar").style.width = Math.min(pct, 100) + "%";
      document.getElementById("current-goal-progress-text").textContent =
        (goal.current || 0) + " / " + goal.target;
    } else {
      display.classList.add("hidden");
      document.getElementById("goal-form").classList.remove("hidden");
    }
  });
}

function setGoal() {
  var classCode = document.getElementById("class-select").value;
  var metric = document.getElementById("goal-metric").value;
  var target = parseInt(document.getElementById("goal-target").value);
  var deadline = document.getElementById("goal-deadline").value;
  if (!classCode || !target) return;

  FirebaseSync.setClassGoal(classCode, { metric: metric, target: target, deadline: deadline || null }).then(function() {
    loadClassSettings();
  });
}

function clearGoal() {
  var classCode = document.getElementById("class-select").value;
  if (!classCode) return;
  FirebaseSync.clearClassGoal(classCode).then(function() {
    loadClassSettings();
  });
}
```

Call `loadClassSettings()` whenever the class selector changes (hook into the existing class change handler).

- [ ] **Step 3: Verify teacher controls**

1. Select a class in teacher dashboard
2. Toggle feed on/off
3. Toggle leaderboard + anonymous mode
4. Set and clear a class goal

- [ ] **Step 4: Commit**

```bash
git add teacher.html
git commit -m "feat: add social feature controls to teacher dashboard"
```

---

### Task 21: Team Player Badge & Class Goal Completion

**Files:**
- Modify: `js/gamification.js`
- Modify: `index.html`

- [ ] **Step 1: Add Team Player badge definition**

Add to the BADGES array in gamification.js:

```javascript
  { id: "team-player", title: "Team Player", desc: "Class goal completed together!", icon: "🤝" }
```

- [ ] **Step 1b: Add `awardBadge` function to gamification.js**

Add inside the Gamification IIFE and expose via return object (`awardBadge: awardBadge`):

```javascript
function awardBadge(badgeId) {
  var data = _load();
  if (data.earnedBadges[badgeId]) return null; // Already earned
  data.earnedBadges[badgeId] = Date.now();
  data.totalXP = data.totalXP + 25; // Bonus XP for Team Player
  _save(data);
  return _findBadge(badgeId);
}
```

- [ ] **Step 2: Add class goal completion check on landing page**

In `index.html`, add to the `renderClassGoal` function when goal is complete:

```javascript
  // When current >= goal.target:
  if (current >= goal.target) {
    // Award Team Player badge + bonus XP (once)
    var badge = Gamification.awardBadge("team-player");
    if (badge) {
      // Only celebrate on first time seeing the completion
      Celebrations.confetti();
      Celebrations.showBadge(badge);
    }
  }
```

- [ ] **Step 3: Commit**

```bash
git add js/gamification.js index.html
git commit -m "feat: add Team Player badge for class goal completion"
```

---

### Task 22: Final Integration & Smoke Test

**Files:**
- All modified files

- [ ] **Step 1: Ensure all script tags are present in all HTML files**

Verify each HTML file has the required script tags:

- `index.html`: `data/exercises.js`, `data/daily-challenges.js`, `js/progress.js`, `js/gamification.js`, `js/celebrations.js`, `js/firebase-sync.js`
- `exercise.html`: same as above
- `topics.html`: same as above
- `profile.html`: `js/progress.js`, `js/gamification.js`, `js/celebrations.js`, `js/firebase-sync.js`
- `teacher.html`: `data/exercises.js`, `js/firebase-sync.js`

- [ ] **Step 2: Verify page load order**

Each page should call on load (in order):
1. `Gamification.recordVisit()`
2. `applyPerks()`
3. Page-specific rendering functions

- [ ] **Step 3: Manual smoke test checklist**

Test each feature:
- [ ] Daily challenge card appears on index.html
- [ ] Daily challenge links to exercise.html with `?daily=` param
- [ ] Completing a daily challenge shows completion state
- [ ] Weekly missions appear with 3 missions
- [ ] Mission progress updates after completing exercises
- [ ] Lucky XP shows golden animation (run ~5 exercises)
- [ ] Topics page shows locked topics
- [ ] Completing exercises unlocks next topic
- [ ] Profile page shows streak calendar
- [ ] Profile page shows Customise section with perks
- [ ] Selecting a perk applies CSS
- [ ] Streak flame evolves with streak count
- [ ] Streak recovery banner appears after broken streak
- [ ] Teacher dashboard: Double XP toggle works
- [ ] Teacher dashboard: Feed toggle works
- [ ] Teacher dashboard: Leaderboard toggle works
- [ ] Teacher dashboard: Class goal can be set/cleared
- [ ] Teacher dashboard: Topic unlock override works
- [ ] Class feed appears on student landing page when enabled
- [ ] Class goal bar appears on student landing page
- [ ] Leaderboard appears when enabled
- [ ] Level-up modal shows unlocked perk

- [ ] **Step 4: Commit all remaining changes**

```bash
git add index.html exercise.html topics.html profile.html teacher.html login.html js/ css/ data/
git commit -m "feat: complete student retention & engagement system

Three-phase implementation:
- Phase 1: Daily challenges, surprise rewards, weekly missions
- Phase 2: Locked content, streak overhaul, level perks
- Phase 3: Teacher-controlled social layer (feed, goals, leaderboard)"
```
