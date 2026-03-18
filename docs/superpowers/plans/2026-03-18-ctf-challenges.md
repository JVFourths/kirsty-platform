# CTF Challenges & Easter Eggs Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add hacker-themed CTF challenges, Easter eggs, and a teacher-controlled "Hacker Mode" to channel students' curiosity about security and discovery into Python learning.

**Architecture:** All features are additive. CTF logic (flag claiming, challenge completion, badge checking) is added to the Gamification IIFE. A new `challenges.html` page with dark terminal theme hosts the challenge track. Easter eggs are scattered across existing pages. Teacher toggles Hacker Mode per class from the dashboard.

**Tech Stack:** Vanilla ES5 JavaScript, localStorage, Firebase/Firestore, Tailwind CSS (CDN), CodeMirror 5, Pyodide

**Spec:** `docs/superpowers/specs/2026-03-18-ctf-challenges-design.md`

**Important conventions:**
- All JS must be ES5: use `var`, `function(){}`, no arrow functions, no `let`/`const`, no template literals, no classes
- All modules use the IIFE singleton pattern
- localStorage key: `pythonlab_game`
- Firestore collections: `students`, `classes`

---

## Chunk 1: Gamification Core + Data

### Task 1: Challenge Data File

**Files:**
- Create: `data/challenges.js`

- [ ] **Step 1: Create `data/challenges.js` with 8 challenges**

```javascript
var CHALLENGES = [
  {
    id: "ctf-caesar-1",
    title: "Caesar's Secret",
    tier: "script-kiddie",
    type: "python",
    instructions: "This message was encoded by shifting each letter forward by 3 positions in the alphabet. Write Python to decode it and print the result.\n\nEncoded message: KHOOR ZRUOG",
    starterCode: "# Decode the Caesar cipher\nencoded = 'KHOOR ZRUOG'\n\n# Shift each letter back by 3\n",
    expectedOutput: "HELLO WORLD",
    expectedAnswer: null,
    hint: "Loop through each character. If it's a letter, subtract 3 from its ASCII value using ord() and chr().",
    xp: 15
  },
  {
    id: "ctf-base64-1",
    title: "Base64 Basics",
    tier: "script-kiddie",
    type: "python",
    instructions: "This string is encoded in base64: UHl0aG9uIExhYg==\n\nUse Python's base64 module to decode it and print the result.",
    starterCode: "import base64\n\nencoded = 'UHl0aG9uIExhYg=='\n\n# Decode and print\n",
    expectedOutput: "Python Lab",
    expectedAnswer: null,
    hint: "Use base64.b64decode(encoded).decode('utf-8') to decode and convert bytes to string.",
    xp: 15
  },
  {
    id: "ctf-page-inspector",
    title: "Page Inspector",
    tier: "script-kiddie",
    type: "discovery",
    instructions: "Every web page has a <title> tag in its HTML source code. Your mission: find the exact title of the Python Lab login page.\n\nHint: open the login page and view its source code (right-click > View Page Source).",
    starterCode: null,
    expectedOutput: null,
    expectedAnswer: "join \u2014 python lab",
    hint: "Look for <title>...</title> near the top of the HTML source.",
    xp: 15
  },
  {
    id: "ctf-reverse-1",
    title: "Reverse Engineer",
    tier: "hacker",
    type: "python",
    instructions: "A secret program produced this output:\n\n1: *\n2: **\n3: ***\n4: ****\n5: *****\n\nWrite a program that produces exactly this output.",
    starterCode: "# Reproduce the exact output above\n",
    expectedOutput: "1: *\n2: **\n3: ***\n4: ****\n5: *****",
    expectedAnswer: null,
    hint: "Use a for loop with range(1, 6). Multiply '*' by the loop number. Use str() to convert the number.",
    xp: 25
  },
  {
    id: "ctf-hex-1",
    title: "Hex Decoder",
    tier: "hacker",
    type: "python",
    instructions: "This secret message is encoded in hexadecimal:\n\n48 65 6C 6C 6F\n\nEach pair of hex digits represents one character's ASCII code. Write Python to convert each hex value to a character and print the message.",
    starterCode: "# Decode the hex message\nhex_values = '48 65 6C 6C 6F'\n\n# Convert and print\n",
    expectedOutput: "Hello",
    expectedAnswer: null,
    hint: "Split the string by spaces, use int(h, 16) to convert hex to a number, then chr() to get the character.",
    xp: 25
  },
  {
    id: "ctf-cookie-monster",
    title: "Cookie Monster",
    tier: "hacker",
    type: "discovery",
    instructions: "Websites store data in your browser using something called localStorage. Open the browser console on Python Lab (F12 > Console) and look at what's stored.\n\nWhat is the name of the localStorage key that stores your game progress (XP, streaks, badges)?",
    starterCode: null,
    expectedOutput: null,
    expectedAnswer: "pythonlab_game",
    hint: "Type localStorage in the console to see all stored keys. Look for one related to your game data.",
    xp: 25
  },
  {
    id: "ctf-cipher-chain",
    title: "Cipher Chain",
    tier: "elite",
    type: "python",
    instructions: "This message was encrypted in 3 steps:\n1. The original text was reversed\n2. Then each letter was shifted forward by 5 (Caesar cipher)\n3. Then the result was encoded in base64\n\nThe final encoded string is: YnFxdXkgcnF3bnNm\n\nWrite Python to undo all three steps (decode base64, shift back by 5, reverse) and print the original message.",
    starterCode: "import base64\n\nencoded = 'YnFxdXkgcnF3bnNm'\n\n# Step 1: Decode base64\n# Step 2: Shift each letter back by 5\n# Step 3: Reverse the string\n",
    expectedOutput: "hacker mode",
    expectedAnswer: null,
    hint: "Do the steps in reverse order: base64.b64decode first, then subtract 5 from each letter's ASCII value, then reverse with [::-1].",
    xp: 50
  },
  {
    id: "ctf-pattern-1",
    title: "Pattern Cracker",
    tier: "elite",
    type: "python",
    instructions: "A password generator produced these outputs:\n\nPW1: a1b2\nPW2: c3d4\nPW3: e5f6\nPW4: g7h8\nPW5: i9j0\n\nFigure out the pattern and write a program that prints the NEXT 3 passwords (PW6, PW7, PW8), each on a new line.",
    starterCode: "# Figure out the pattern and predict the next 3\n",
    expectedOutput: "k1l2\nm3n4\no5p6",
    expectedAnswer: null,
    hint: "Letters advance by 2 each time (a,c,e,g,i,k,m,o). Digits cycle through pairs: 1-2, 3-4, 5-6, 7-8, 9-0, 1-2, 3-4, 5-6.",
    xp: 50
  }
];
```

- [ ] **Step 2: Commit**

```bash
git add data/challenges.js
git commit -m "feat: add 8 CTF challenge definitions"
```

---

### Task 2: Gamification — CTF Data Fields, Flags, and Badges

**Files:**
- Modify: `js/gamification.js`

Add CTF fields to `_defaultData()`, CTF badge definitions, flag map, `claimFlag()`, `secret()`, `completeChallenge()`, and `_checkCtfBadges()`.

- [ ] **Step 1: Add CTF fields to `_defaultData()`**

In `js/gamification.js`, find `_defaultData()` (line 97). Add after the existing `selectedPerks: {}` field (around line 136):

```javascript
    claimedFlags: [],
    completedChallenges: {}
```

- [ ] **Step 2: Add CTF badge definitions to BADGES array**

Find the BADGES array (ends around line 91). Add before the closing bracket:

```javascript
  { id: "ctf-script-kiddie", title: "Script Kiddie", desc: "Complete your first CTF challenge", icon: "\uD83D\uDCBB", ctf: true, check: function() { return false; } },
  { id: "ctf-white-hat", title: "White Hat", desc: "Complete 3 CTF challenges", icon: "\uD83C\uDFA9", ctf: true, check: function() { return false; } },
  { id: "ctf-code-breaker", title: "Code Breaker", desc: "Complete a cipher challenge", icon: "\uD83D\uDD13", ctf: true, check: function() { return false; } },
  { id: "ctf-packet-sniffer", title: "Packet Sniffer", desc: "Complete a discovery challenge", icon: "\uD83D\uDD0D", ctf: true, check: function() { return false; } },
  { id: "ctf-zero-day", title: "Zero Day", desc: "Complete all CTF challenges", icon: "\uD83C\uDFF4", ctf: true, check: function() { return false; } },
  { id: "ctf-egg-hunter", title: "Easter Egg Hunter", desc: "Find 3 Easter eggs", icon: "\uD83E\uDD5A", ctf: true, check: function() { return false; } },
  { id: "ctf-full-recon", title: "Full Recon", desc: "Find all Easter eggs", icon: "\uD83D\uDD75\uFE0F", ctf: true, check: function() { return false; } }
```

- [ ] **Step 3: Add flag map and claimFlag function**

Add inside the Gamification IIFE, before the return statement (before line 1142):

```javascript
// Flag map: XP values for each Easter egg flag
// Badges are awarded separately by _checkCtfBadges based on claimedFlags count
var FLAG_MAP = {
  "PYLAB{view_source_master}": { xp: 20 },
  "PYLAB{console_hacker}": { xp: 20 },
  "PYLAB{konami_coder}": { xp: 20 },
  "PYLAB{hidden_path_finder}": { xp: 25 },
  "PYLAB{robots_txt_reader}": { xp: 25 }
};

function claimFlag(flagText) {
  if (!flagText) return { success: false, message: "No flag provided" };
  var normalized = flagText.trim().toUpperCase();
  // Try case-insensitive match
  var matchedKey = null;
  for (var key in FLAG_MAP) {
    if (key.toUpperCase() === normalized) {
      matchedKey = key;
      break;
    }
  }
  if (!matchedKey) return { success: false, message: "Invalid flag" };

  var data = _load();
  if (!data.claimedFlags) data.claimedFlags = [];
  for (var i = 0; i < data.claimedFlags.length; i++) {
    if (data.claimedFlags[i].toUpperCase() === normalized) {
      return { success: false, message: "Already claimed" };
    }
  }

  var reward = FLAG_MAP[matchedKey];
  data.claimedFlags.push(matchedKey);
  data.totalXP = data.totalXP + reward.xp;
  data.weeklyXP = (data.weeklyXP || 0) + reward.xp;

  // Check CTF badges
  var newBadges = _checkCtfBadges(data);

  _save(data);

  if (typeof FirebaseSync !== "undefined" && FirebaseSync.syncProgress) {
    FirebaseSync.syncProgress();
  }

  return { success: true, xp: reward.xp, flag: matchedKey, newBadges: newBadges };
}

function secret() {
  var result = claimFlag("PYLAB{console_hacker}");
  if (result.success) {
    return "PYLAB{console_hacker} — Flag claimed! +" + result.xp + " XP";
  }
  return "Flag already claimed!";
}
```

- [ ] **Step 4: Add completeChallenge function**

```javascript
function completeChallenge(challengeId, xp) {
  var data = _load();
  if (!data.completedChallenges) data.completedChallenges = {};
  if (data.completedChallenges[challengeId]) {
    return { xpGained: 0, alreadyDone: true, newBadges: [] };
  }

  data.completedChallenges[challengeId] = { xp: xp, timestamp: Date.now() };
  data.totalXP = data.totalXP + xp;
  data.weeklyXP = (data.weeklyXP || 0) + xp;
  data.totalExercises = data.totalExercises + 1;

  var newBadges = _checkCtfBadges(data);

  _save(data);

  if (typeof FirebaseSync !== "undefined" && FirebaseSync.syncProgress) {
    FirebaseSync.syncProgress();
  }

  return { xpGained: xp, alreadyDone: false, newBadges: newBadges };
}

function isChallengeComplete(challengeId) {
  var data = _load();
  return !!(data.completedChallenges && data.completedChallenges[challengeId]);
}
```

- [ ] **Step 5: Add _checkCtfBadges function**

```javascript
function _checkCtfBadges(data) {
  var newBadges = [];
  if (!data.completedChallenges) data.completedChallenges = {};
  if (!data.claimedFlags) data.claimedFlags = [];

  var challengeCount = 0;
  var challengeKeys = [];
  for (var key in data.completedChallenges) {
    if (data.completedChallenges.hasOwnProperty(key)) {
      challengeCount++;
      challengeKeys.push(key);
    }
  }
  var flagCount = data.claimedFlags.length;

  // Script Kiddie: first challenge
  if (challengeCount >= 1 && !data.earnedBadges["ctf-script-kiddie"]) {
    data.earnedBadges["ctf-script-kiddie"] = Date.now();
    newBadges.push(_findBadge("ctf-script-kiddie"));
  }

  // White Hat: 3 challenges
  if (challengeCount >= 3 && !data.earnedBadges["ctf-white-hat"]) {
    data.earnedBadges["ctf-white-hat"] = Date.now();
    newBadges.push(_findBadge("ctf-white-hat"));
  }

  // Code Breaker: cipher challenge (ids contain caesar, hex, or cipher-chain)
  var hasCipher = false;
  for (var c = 0; c < challengeKeys.length; c++) {
    if (challengeKeys[c].indexOf("caesar") !== -1 || challengeKeys[c].indexOf("hex") !== -1 || challengeKeys[c].indexOf("cipher-chain") !== -1) {
      hasCipher = true;
      break;
    }
  }
  if (hasCipher && !data.earnedBadges["ctf-code-breaker"]) {
    data.earnedBadges["ctf-code-breaker"] = Date.now();
    newBadges.push(_findBadge("ctf-code-breaker"));
  }

  // Packet Sniffer: discovery challenge
  // Note: CHALLENGES global is only available on challenges.html.
  // On other pages (index.html, profile.html), this block is safely skipped.
  // These badges will be awarded next time the student visits challenges.html.
  var hasDiscovery = false;
  if (typeof CHALLENGES !== "undefined") {
    for (var d = 0; d < challengeKeys.length; d++) {
      for (var ch = 0; ch < CHALLENGES.length; ch++) {
        if (CHALLENGES[ch].id === challengeKeys[d] && CHALLENGES[ch].type === "discovery") {
          hasDiscovery = true;
          break;
        }
      }
      if (hasDiscovery) break;
    }
  }
  if (hasDiscovery && !data.earnedBadges["ctf-packet-sniffer"]) {
    data.earnedBadges["ctf-packet-sniffer"] = Date.now();
    newBadges.push(_findBadge("ctf-packet-sniffer"));
  }

  // Zero Day: all challenges complete
  if (typeof CHALLENGES !== "undefined" && challengeCount >= CHALLENGES.length && !data.earnedBadges["ctf-zero-day"]) {
    data.earnedBadges["ctf-zero-day"] = Date.now();
    newBadges.push(_findBadge("ctf-zero-day"));
  }

  // Easter Egg Hunter: 3 flags
  if (flagCount >= 3 && !data.earnedBadges["ctf-egg-hunter"]) {
    data.earnedBadges["ctf-egg-hunter"] = Date.now();
    newBadges.push(_findBadge("ctf-egg-hunter"));
  }

  // Full Recon: all 5 flags
  var totalFlags = 0;
  for (var fk in FLAG_MAP) {
    if (FLAG_MAP.hasOwnProperty(fk)) totalFlags++;
  }
  if (flagCount >= totalFlags && !data.earnedBadges["ctf-full-recon"]) {
    data.earnedBadges["ctf-full-recon"] = Date.now();
    newBadges.push(_findBadge("ctf-full-recon"));
  }

  return newBadges;
}
```

- [ ] **Step 6: Expose new functions in the IIFE return object**

Add to the return statement (after line 1168):

```javascript
    claimFlag: claimFlag,
    secret: secret,
    completeChallenge: completeChallenge,
    isChallengeComplete: isChallengeComplete,
```

- [ ] **Step 7: Commit**

```bash
git add js/gamification.js
git commit -m "feat: add CTF flags, challenges, and badge system to gamification"
```

---

### Task 3: Firebase Sync Updates

**Files:**
- Modify: `js/firebase-sync.js`

Update `getClassSettings()`, `syncProgress()`, and `loginWithCode()` for CTF data.

- [ ] **Step 1: Add `hackerModeEnabled` to `getClassSettings()`**

In `js/firebase-sync.js`, find `getClassSettings()` return object (around line 654-660). Add after `topicUnlockOverride`:

```javascript
      hackerModeEnabled: data.hackerModeEnabled || false
```

- [ ] **Step 2: Add CTF fields to `syncProgress()` payload**

Find `syncProgress()` (around line 342). The function builds a `docData` object. BEFORE the `docData` definition (around line 353), add a raw localStorage read:

```javascript
      var rawGameData = JSON.parse(localStorage.getItem("pythonlab_game") || "{}");
```

Then inside the `docData` object literal, after the `weekStartDate` line (around line 370), add these two properties:

```javascript
      claimedFlags: rawGameData.claimedFlags || [],
      completedChallenges: rawGameData.completedChallenges || {},
```

- [ ] **Step 3: Restore CTF data in `loginWithCode()`**

Find `loginWithCode()` data restoration section (around line 832-898). The existing code builds a `gameData` object and writes it to localStorage at line ~875. Add the CTF fields to `gameData` BEFORE the existing `localStorage.setItem("pythonlab_game", ...)` call:

```javascript
      // Restore CTF data (add before the existing localStorage.setItem call)
      gameData.claimedFlags = data.claimedFlags || [];
      gameData.completedChallenges = data.completedChallenges || {};
```

- [ ] **Step 4: Commit**

```bash
git add js/firebase-sync.js
git commit -m "feat: sync CTF data to Firestore and restore on login"
```

---

### Task 4: CTF CSS Styles

**Files:**
- Modify: `css/gamification.css`

- [ ] **Step 1: Add CTF badge, terminal, and animation styles**

Append to the end of `css/gamification.css`:

```css
/* ═══════════════════════════════════════
   CTF / HACKER MODE STYLES
   ═══════════════════════════════════════ */

/* CTF badge card variant */
.badge-card.ctf-badge {
  background: #0a0a0a;
  border-color: #22c55e;
  color: #22c55e;
}
.badge-card.ctf-badge.earned {
  background: #0a0a0a;
  border-color: #22c55e;
  box-shadow: 0 0 12px rgba(34, 197, 94, 0.3);
}
.badge-card.ctf-badge.locked {
  background: #111;
  border-color: #333;
  color: #555;
}
.badge-card.ctf-badge .badge-card-title,
.badge-card.ctf-badge .badge-card-desc {
  color: inherit;
}

/* Terminal card on landing page */
.hacker-card {
  background: #0a0a0a;
  border: 2px solid #22c55e;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  animation: hacker-pulse 3s ease-in-out infinite;
}
@keyframes hacker-pulse {
  0%, 100% { border-color: #22c55e; box-shadow: 0 0 5px rgba(34, 197, 94, 0.2); }
  50% { border-color: #4ade80; box-shadow: 0 0 15px rgba(34, 197, 94, 0.4); }
}

/* Scanline overlay for challenges page */
.scanline-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  pointer-events: none;
  z-index: 9999;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0, 0, 0, 0.05) 2px,
    rgba(0, 0, 0, 0.05) 4px
  );
}

/* Matrix rain animation */
.matrix-rain {
  position: fixed;
  top: 0; left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  z-index: 10000;
  overflow: hidden;
}
.matrix-char {
  position: absolute;
  top: -20px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 16px;
  color: #22c55e;
  text-shadow: 0 0 8px #22c55e;
  animation: matrix-fall linear forwards;
}
@keyframes matrix-fall {
  0% { top: -20px; opacity: 1; }
  80% { opacity: 1; }
  100% { top: 100vh; opacity: 0; }
}

/* Secrets section terminal style */
.secrets-section {
  background: #0a0a0a;
  border: 1px solid #22c55e;
  border-radius: 12px;
  padding: 1.5rem;
  font-family: 'JetBrains Mono', monospace;
  color: #22c55e;
}
.secrets-section input {
  background: #111;
  border: 1px solid #333;
  color: #22c55e;
  font-family: 'JetBrains Mono', monospace;
}
.secrets-section input:focus {
  border-color: #22c55e;
  outline: none;
  box-shadow: 0 0 6px rgba(34, 197, 94, 0.3);
}

/* Challenge cards */
.challenge-card {
  background: #111;
  border: 1px solid #222;
  border-radius: 12px;
  transition: border-color 0.2s;
}
.challenge-card:hover {
  border-color: #333;
}
.challenge-card.completed {
  border-color: #22c55e;
}
.tier-badge {
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  padding: 2px 8px;
  border-radius: 4px;
}
.tier-script-kiddie { background: #22c55e20; color: #22c55e; }
.tier-hacker { background: #f59e0b20; color: #f59e0b; }
.tier-elite { background: #ef444420; color: #ef4444; }
```

- [ ] **Step 2: Commit**

```bash
git add css/gamification.css
git commit -m "feat: add CTF terminal theme and badge styles"
```

---

## Chunk 2: Pages & UI

### Task 5: Easter Egg Files

**Files:**
- Create: `secret.html`
- Create: `robots.txt`

- [ ] **Step 1: Create `secret.html`**

```html
<!DOCTYPE html>
<html lang="en-GB">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>???</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            background: #0a0a0a;
            color: #22c55e;
            font-family: 'JetBrains Mono', 'Courier New', monospace;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            padding: 2rem;
        }
        .terminal {
            max-width: 600px;
            text-align: center;
        }
        h1 {
            font-size: 2rem;
            margin-bottom: 1rem;
            text-shadow: 0 0 20px rgba(34, 197, 94, 0.5);
        }
        .flag {
            background: #111;
            border: 2px solid #22c55e;
            border-radius: 8px;
            padding: 1rem 2rem;
            font-size: 1.25rem;
            font-weight: bold;
            margin: 1.5rem 0;
            display: inline-block;
            letter-spacing: 0.05em;
        }
        p { color: #4ade80; font-size: 0.9rem; line-height: 1.6; }
        a { color: #22c55e; }
        #claimed-msg { display: none; margin-top: 1rem; color: #f59e0b; }
    </style>
    <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
</head>
<body>
    <div class="terminal">
        <h1>> ACCESS GRANTED</h1>
        <p>You found the hidden page. Not many make it here.</p>
        <div class="flag">PYLAB{hidden_path_finder}</div>
        <p>Copy the flag above and enter it in the Secrets section on your profile page to claim your XP.</p>
        <p id="claimed-msg">Flag auto-claimed! Check your profile.</p>
        <p style="margin-top: 2rem"><a href="index.html">&lt; Return to base</a></p>
    </div>

    <script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-auth-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore-compat.js"></script>
    <script src="js/gamification.js"></script>
    <script src="js/firebase-sync.js"></script>
    <script>
        // Auto-claim the flag
        var result = Gamification.claimFlag("PYLAB{hidden_path_finder}");
        if (result.success) {
            document.getElementById("claimed-msg").style.display = "block";
        }
    </script>
</body>
</html>
```

- [ ] **Step 2: Create `robots.txt`**

```
User-agent: *
Allow: /

# Nothing to see here... or is there?
# Flag: PYLAB{robots_txt_reader}
# Enter this flag in the Secrets section on your profile page.
```

- [ ] **Step 3: Commit**

```bash
git add secret.html robots.txt
git commit -m "feat: add Easter egg hidden page and robots.txt"
```

---

### Task 6: Easter Eggs in Existing Pages

**Files:**
- Modify: `index.html`

Add the source code comment, console message, and konami code listener.

- [ ] **Step 1: Add source code comment Easter egg**

In `index.html`, add this HTML comment near the top of the `<body>` tag (right after `<body>`):

```html
<!-- flag: PYLAB{view_source_master} -->
```

- [ ] **Step 2: Add console message Easter egg**

In the `<script>` section of `index.html`, add at the start of the app initialisation:

```javascript
// Easter egg: console message
console.log("%c\n  _____       _   _                   _           _     \n |  __ \\     | | | |                 | |         | |    \n | |__) |   _| |_| |__   ___  _ __   | |     __ _| |__  \n |  ___/ | | | __| '_ \\ / _ \\| '_ \\  | |    / _` | '_ \\ \n | |   | |_| | |_| | | | (_) | | | | | |___| (_| | |_) |\n |_|    \\__, |\\__|_| |_|\\___/|_| |_| |______\\__,_|_.__/ \n         __/ |                                          \n        |___/                                           \n\n Looking for secrets? Try typing Gamification.secret() in this console.\n", "color: #22c55e; font-family: monospace");
```

- [ ] **Step 3: Add konami code listener**

Add inside the `<script>` section of `index.html`:

```javascript
// Easter egg: Konami code
(function() {
  var konamiSequence = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
  var konamiPos = 0;

  document.addEventListener("keydown", function(e) {
    if (e.keyCode === konamiSequence[konamiPos]) {
      konamiPos++;
      if (konamiPos === konamiSequence.length) {
        konamiPos = 0;
        // Auto-claim the flag
        var result = Gamification.claimFlag("PYLAB{konami_coder}");

        // Matrix rain animation
        var rain = document.createElement("div");
        rain.className = "matrix-rain";
        document.body.appendChild(rain);

        var chars = "01PYLAB{}HACK";
        for (var i = 0; i < 60; i++) {
          var span = document.createElement("span");
          span.className = "matrix-char";
          span.textContent = chars.charAt(Math.floor(Math.random() * chars.length));
          span.style.left = Math.random() * 100 + "vw";
          span.style.animationDuration = (1 + Math.random() * 2) + "s";
          span.style.animationDelay = Math.random() * 2 + "s";
          rain.appendChild(span);
        }

        // Show flag claimed message
        var msg = document.createElement("div");
        msg.style.cssText = "position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);z-index:10001;background:#0a0a0a;border:2px solid #22c55e;border-radius:12px;padding:2rem;text-align:center;font-family:monospace;color:#22c55e;";
        msg.innerHTML = '<div style="font-size:1.5rem;font-weight:bold;margin-bottom:1rem">PYLAB{konami_coder}</div>' +
          '<div style="color:#4ade80">' + (result.success ? "Flag claimed! +" + result.xp + " XP" : "Flag already claimed!") + '</div>';
        document.body.appendChild(msg);

        // Clean up after 4 seconds
        setTimeout(function() {
          if (rain.parentNode) rain.parentNode.removeChild(rain);
          if (msg.parentNode) msg.parentNode.removeChild(msg);
        }, 4000);
      }
    } else {
      konamiPos = 0;
    }
  });
})();
```

- [ ] **Step 4: Add Hacker Mode card on landing page**

Find the year group cards section. The GCSE card ends around line 451, followed by closing `</div>` tags. Add the hacker card HTML after the year group grid's closing div but still inside the main content area:

```html
<!-- Hacker Mode Card -->
<div id="hacker-mode-card" class="hidden mt-8 max-w-2xl mx-auto">
  <a href="challenges.html" class="block hacker-card rounded-2xl p-6 text-center no-underline">
    <p style="color: #22c55e; font-size: 0.85rem; margin-bottom: 0.5rem;">> hacker_mode_enabled</p>
    <p style="color: #4ade80; font-size: 1.25rem; font-weight: 700;">Enter the Lab</p>
    <p style="color: #555; font-size: 0.75rem; margin-top: 0.5rem;">CTF challenges await</p>
  </a>
</div>
```

Add rendering logic to check Hacker Mode:

```javascript
function checkHackerMode() {
  var student = FirebaseSync.getStudent();
  if (!student || !student.classCode) return;
  FirebaseSync.getClassSettings(student.classCode).then(function(settings) {
    var card = document.getElementById("hacker-mode-card");
    if (card && settings.hackerModeEnabled) {
      card.classList.remove("hidden");
    }
  });
}
```

Add `checkHackerMode()` inside the existing app init function in `index.html`'s `<script>` section (where `renderDailyChallenge()`, `renderWeeklyMissions()`, etc. are called). Call it after the other render functions.

- [ ] **Step 5: Commit**

```bash
git add index.html
git commit -m "feat: add Easter eggs and Hacker Mode card to landing page"
```

---

### Task 7: Challenges Page

**Files:**
- Create: `challenges.html`

- [ ] **Step 1: Create `challenges.html`**

A full page with dark terminal theme, challenge cards, CodeMirror editor for Python challenges, text input for discovery challenges, and Pyodide runtime.

```html
<!DOCTYPE html>
<html lang="en-GB">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hacker Mode — Python Lab</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/codemirror.min.css">
    <link rel="stylesheet" href="css/gamification.css">
    <style>
        body { background: #0a0a0a; color: #e2e8f0; font-family: 'JetBrains Mono', monospace; }
        .cm-editor, .CodeMirror { background: #111 !important; color: #22c55e !important; border-radius: 8px; font-size: 14px; }
        .CodeMirror-gutters { background: #111 !important; border-right: 1px solid #222 !important; }
        .CodeMirror-linenumber { color: #444 !important; }
    </style>
</head>
<body class="min-h-screen">
    <div class="scanline-overlay"></div>

    <!-- Header -->
    <header class="border-b border-gray-800 px-6 py-4">
        <div class="max-w-4xl mx-auto flex items-center justify-between">
            <div>
                <a href="index.html" class="text-gray-500 hover:text-green-500 text-sm no-underline">&lt; back</a>
                <h1 class="text-green-500 text-xl font-bold mt-1">> python_lab // hacker_mode</h1>
            </div>
            <div id="challenge-progress" class="text-green-400 text-sm"></div>
        </div>
    </header>

    <!-- Access Denied -->
    <div id="access-denied" class="hidden max-w-4xl mx-auto px-6 py-20 text-center">
        <p class="text-red-500 text-xl font-bold mb-4">> ACCESS DENIED</p>
        <p class="text-gray-500">Hacker Mode is not enabled for your class.</p>
        <p class="text-gray-600 text-sm mt-2">Ask your teacher to enable it from the dashboard.</p>
        <a href="index.html" class="inline-block mt-6 text-green-500 hover:text-green-400 text-sm">&lt; Return to base</a>
    </div>

    <!-- Challenge List -->
    <main id="challenge-list" class="hidden max-w-4xl mx-auto px-6 py-8 space-y-4">
    </main>

    <!-- CTF Badge Gallery -->
    <div id="ctf-badges" class="hidden max-w-4xl mx-auto px-6 pb-12">
        <h3 class="text-green-500 text-sm font-bold mb-3">> badges</h3>
        <div id="ctf-badge-grid" class="grid grid-cols-2 sm:grid-cols-4 gap-3"></div>
    </div>

    <!-- Scripts -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/codemirror.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/mode/python/python.min.js"></script>
    <script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-auth-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore-compat.js"></script>
    <script src="data/challenges.js"></script>
    <script src="js/gamification.js"></script>
    <script src="js/celebrations.js"></script>
    <script src="js/firebase-sync.js"></script>

    <script>
    (function() {
      var pyodide = null;
      var editors = {};

      // Check access
      function init() {
        Gamification.recordVisit();
        var student = FirebaseSync.getStudent();
        if (!student || !student.classCode) {
          document.getElementById("access-denied").classList.remove("hidden");
          return;
        }
        FirebaseSync.getClassSettings(student.classCode).then(function(settings) {
          if (!settings.hackerModeEnabled) {
            document.getElementById("access-denied").classList.remove("hidden");
            return;
          }
          renderChallenges();
        }).catch(function() {
          document.getElementById("access-denied").classList.remove("hidden");
        });
      }

      function renderChallenges() {
        var list = document.getElementById("challenge-list");
        var badgesSection = document.getElementById("ctf-badges");
        list.classList.remove("hidden");
        badgesSection.classList.remove("hidden");
        list.innerHTML = "";

        // Progress counter
        var doneCount = 0;
        for (var p = 0; p < CHALLENGES.length; p++) {
          if (Gamification.isChallengeComplete(CHALLENGES[p].id)) doneCount++;
        }
        document.getElementById("challenge-progress").textContent = "> " + doneCount + "/" + CHALLENGES.length + " challenges complete";

        // Render each challenge
        for (var i = 0; i < CHALLENGES.length; i++) {
          var ch = CHALLENGES[i];
          var isDone = Gamification.isChallengeComplete(ch.id);
          var tierClass = "tier-" + ch.tier;

          var card = document.createElement("div");
          card.className = "challenge-card p-5" + (isDone ? " completed" : "");
          card.setAttribute("data-id", ch.id);
          card.setAttribute("data-index", i);

          // Header (always visible)
          var header = document.createElement("div");
          header.className = "flex items-center justify-between cursor-pointer";
          header.innerHTML =
            '<div class="flex items-center gap-3">' +
              '<span class="tier-badge ' + tierClass + '">' + ch.tier.replace("-", " ") + '</span>' +
              '<span class="font-semibold text-gray-200">' + escHtml(ch.title) + '</span>' +
            '</div>' +
            '<div class="flex items-center gap-2">' +
              '<span class="text-xs text-gray-500">' + ch.xp + ' XP</span>' +
              (isDone ? '<span class="text-green-500">&#10003;</span>' : '<span class="text-gray-600">&#9656;</span>') +
            '</div>';
          card.appendChild(header);

          // Body (expandable)
          var body = document.createElement("div");
          body.className = "hidden mt-4";
          body.setAttribute("id", "challenge-body-" + i);

          // Instructions
          var instructions = document.createElement("div");
          instructions.className = "text-sm text-gray-400 mb-4 whitespace-pre-line";
          instructions.textContent = ch.instructions;
          body.appendChild(instructions);

          if (ch.type === "python") {
            // Code editor
            var editorWrap = document.createElement("div");
            editorWrap.className = "mb-3";
            var textarea = document.createElement("textarea");
            textarea.setAttribute("id", "editor-" + i);
            textarea.value = ch.starterCode || "";
            editorWrap.appendChild(textarea);
            body.appendChild(editorWrap);

            // Output panel
            var output = document.createElement("div");
            output.className = "bg-black rounded-lg p-3 mb-3 text-sm min-h-[40px] font-mono";
            output.setAttribute("id", "output-" + i);
            output.textContent = "> output will appear here";
            output.style.color = "#666";
            body.appendChild(output);
          } else {
            // Discovery text input
            var inputWrap = document.createElement("div");
            inputWrap.className = "mb-3";
            var input = document.createElement("input");
            input.type = "text";
            input.className = "w-full rounded-lg px-4 py-2.5 text-sm";
            input.style.cssText = "background:#111;border:1px solid #333;color:#22c55e;font-family:monospace;";
            input.placeholder = "Type your answer here...";
            input.setAttribute("id", "answer-" + i);
            inputWrap.appendChild(input);
            body.appendChild(inputWrap);
          }

          // Buttons row
          var btnRow = document.createElement("div");
          btnRow.className = "flex items-center gap-3";

          if (ch.type === "python") {
            var runBtn = document.createElement("button");
            runBtn.className = "px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg transition";
            runBtn.textContent = "Run Code";
            runBtn.setAttribute("data-index", String(i));
            runBtn.addEventListener("click", function() { runChallenge(parseInt(this.getAttribute("data-index"))); });
            btnRow.appendChild(runBtn);

            var submitBtn = document.createElement("button");
            submitBtn.className = "px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold rounded-lg transition";
            submitBtn.textContent = "Submit";
            submitBtn.setAttribute("data-index", String(i));
            submitBtn.addEventListener("click", function() { submitChallenge(parseInt(this.getAttribute("data-index"))); });
            btnRow.appendChild(submitBtn);
          } else {
            var submitDiscovery = document.createElement("button");
            submitDiscovery.className = "px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold rounded-lg transition";
            submitDiscovery.textContent = "Submit Answer";
            submitDiscovery.setAttribute("data-index", String(i));
            submitDiscovery.addEventListener("click", function() { submitDiscovery2(parseInt(this.getAttribute("data-index"))); });
            btnRow.appendChild(submitDiscovery);
          }

          var hintBtn = document.createElement("button");
          hintBtn.className = "px-3 py-2 text-gray-500 hover:text-gray-300 text-sm transition";
          hintBtn.textContent = "Hint";
          hintBtn.setAttribute("data-index", String(i));
          hintBtn.addEventListener("click", function() {
            var idx = parseInt(this.getAttribute("data-index"));
            var hintEl = document.getElementById("hint-" + idx);
            if (hintEl) hintEl.classList.toggle("hidden");
          });
          btnRow.appendChild(hintBtn);

          body.appendChild(btnRow);

          // Hint panel
          var hintPanel = document.createElement("div");
          hintPanel.className = "hidden mt-3 text-sm text-amber-400 bg-amber-900/20 rounded-lg p-3";
          hintPanel.setAttribute("id", "hint-" + i);
          hintPanel.textContent = ch.hint;
          body.appendChild(hintPanel);

          // Feedback
          var feedback = document.createElement("div");
          feedback.className = "hidden mt-3 text-sm rounded-lg p-3";
          feedback.setAttribute("id", "feedback-" + i);
          body.appendChild(feedback);

          card.appendChild(body);

          // Toggle expand
          header.addEventListener("click", (function(idx) {
            return function() {
              var bodyEl = document.getElementById("challenge-body-" + idx);
              if (bodyEl) {
                bodyEl.classList.toggle("hidden");
                // Init CodeMirror if needed
                if (!editors[idx] && CHALLENGES[idx].type === "python") {
                  var ta = document.getElementById("editor-" + idx);
                  if (ta) {
                    editors[idx] = CodeMirror.fromTextArea(ta, {
                      mode: "python",
                      theme: "default",
                      lineNumbers: true,
                      indentUnit: 4
                    });
                  }
                }
              }
            };
          })(i));

          list.appendChild(card);
        }

        renderCtfBadges();
      }

      function loadPyodide() {
        if (pyodide) return Promise.resolve(pyodide);
        return new Promise(function(resolve, reject) {
          var script = document.createElement("script");
          script.src = "https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js";
          script.onload = function() {
            window.loadPyodide().then(function(py) {
              pyodide = py;
              resolve(pyodide);
            }).catch(reject);
          };
          document.head.appendChild(script);
        });
      }

      function runChallenge(idx) {
        var ch = CHALLENGES[idx];
        var code = editors[idx] ? editors[idx].getValue() : "";
        var outputEl = document.getElementById("output-" + idx);
        outputEl.textContent = "> running...";
        outputEl.style.color = "#666";

        loadPyodide().then(function(py) {
          py.runPython("import sys; from io import StringIO; sys.stdout = StringIO(); sys.stderr = StringIO()");
          try {
            py.runPython(code);
            var stdout = py.runPython("sys.stdout.getvalue()");
            outputEl.textContent = stdout.trim() || "(no output)";
            outputEl.style.color = "#22c55e";
          } catch (err) {
            var stderr = "";
            try { stderr = py.runPython("sys.stderr.getvalue()"); } catch(e) {}
            var errMsg = stderr || err.message || String(err);
            // Extract clean error
            var lines = errMsg.split("\n");
            outputEl.textContent = lines[lines.length - 1] || errMsg;
            outputEl.style.color = "#ef4444";
          }
        }).catch(function(err) {
          outputEl.textContent = "Failed to load Python: " + err.message;
          outputEl.style.color = "#ef4444";
        });
      }

      function submitChallenge(idx) {
        var ch = CHALLENGES[idx];
        var outputEl = document.getElementById("output-" + idx);
        var feedbackEl = document.getElementById("feedback-" + idx);
        var output = outputEl.textContent.trim();

        if (output === ch.expectedOutput.trim()) {
          onCorrect(idx, ch, feedbackEl);
        } else {
          feedbackEl.className = "mt-3 text-sm rounded-lg p-3 bg-red-900/30 text-red-400";
          feedbackEl.textContent = "Not quite right. Check your output and try again.";
          feedbackEl.classList.remove("hidden");
        }
      }

      function submitDiscovery2(idx) {
        var ch = CHALLENGES[idx];
        var answerEl = document.getElementById("answer-" + idx);
        var feedbackEl = document.getElementById("feedback-" + idx);
        var answer = answerEl.value.trim().toLowerCase();

        if (answer === ch.expectedAnswer) {
          onCorrect(idx, ch, feedbackEl);
        } else {
          feedbackEl.className = "mt-3 text-sm rounded-lg p-3 bg-red-900/30 text-red-400";
          feedbackEl.textContent = "Not quite right. Try again.";
          feedbackEl.classList.remove("hidden");
        }
      }

      function onCorrect(idx, ch, feedbackEl) {
        var result = Gamification.completeChallenge(ch.id, ch.xp);
        if (result.alreadyDone) {
          feedbackEl.className = "mt-3 text-sm rounded-lg p-3 bg-green-900/30 text-green-400";
          feedbackEl.textContent = "Already completed!";
          feedbackEl.classList.remove("hidden");
          return;
        }

        feedbackEl.className = "mt-3 text-sm rounded-lg p-3 bg-green-900/30 text-green-400";
        feedbackEl.textContent = "CORRECT! +" + result.xpGained + " XP";
        feedbackEl.classList.remove("hidden");

        // Mark card as completed
        var cards = document.querySelectorAll(".challenge-card");
        if (cards[idx]) cards[idx].classList.add("completed");

        // Show celebrations
        if (result.newBadges && result.newBadges.length > 0) {
          for (var b = 0; b < result.newBadges.length; b++) {
            Celebrations.showBadge(result.newBadges[b]);
          }
        }

        // Update progress counter
        var doneCount = 0;
        for (var p = 0; p < CHALLENGES.length; p++) {
          if (Gamification.isChallengeComplete(CHALLENGES[p].id)) doneCount++;
        }
        document.getElementById("challenge-progress").textContent = "> " + doneCount + "/" + CHALLENGES.length + " challenges complete";

        renderCtfBadges();
      }

      function renderCtfBadges() {
        var grid = document.getElementById("ctf-badge-grid");
        if (!grid) return;
        grid.innerHTML = "";
        var profile = Gamification.getProfile();
        var allBadges = profile.allBadges || [];

        for (var i = 0; i < allBadges.length; i++) {
          var b = allBadges[i];
          if (!b.ctf) continue;
          var isEarned = profile.earnedBadges && profile.earnedBadges[b.id];
          var card = document.createElement("div");
          card.className = "badge-card ctf-badge " + (isEarned ? "earned" : "locked");
          card.innerHTML =
            '<div class="badge-card-icon text-2xl">' + b.icon + '</div>' +
            '<div class="badge-card-title text-xs font-bold mt-1">' + escHtml(b.title) + '</div>' +
            '<div class="badge-card-desc text-xs mt-0.5" style="color:#666">' + escHtml(b.desc) + '</div>';
          grid.appendChild(card);
        }
      }

      function escHtml(str) {
        var div = document.createElement("div");
        div.textContent = str || "";
        return div.innerHTML;
      }

      // Boot
      init();
    })();
    </script>
</body>
</html>
```

- [ ] **Step 2: Commit**

```bash
git add challenges.html
git commit -m "feat: add CTF challenges page with terminal theme"
```

---

### Task 8: Profile Page — Secrets Section

**Files:**
- Modify: `profile.html`

- [ ] **Step 1: Add Secrets section HTML**

In `profile.html`, find the badge grid section (around line 149). Add AFTER it (before the customise section):

```html
<!-- Secrets Section -->
<div id="secrets-section" class="hidden mt-8">
    <h3 class="text-lg font-bold text-gray-800 mb-4">Secrets</h3>
    <div class="secrets-section">
        <div class="flex gap-2 mb-4">
            <input type="text" id="flag-input" placeholder="Enter flag code..." class="flex-1 rounded-lg px-3 py-2 text-sm">
            <button id="flag-submit-btn" class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg transition" style="font-family: monospace;">Submit</button>
        </div>
        <div id="flag-result" class="hidden text-sm mb-3"></div>
        <div id="claimed-flags-list"></div>
    </div>
</div>
```

- [ ] **Step 2: Add secrets rendering logic**

In the `<script>` section of `profile.html`, add:

```javascript
function renderSecrets() {
  var section = document.getElementById("secrets-section");
  if (!section) return;

  var profile = Gamification.getProfile();
  var claimedFlags = profile.claimedFlags || [];

  // Show section if hacker mode enabled or flags claimed
  var student = FirebaseSync.getStudent();
  if (claimedFlags.length > 0) {
    section.classList.remove("hidden");
  } else if (student && student.classCode) {
    FirebaseSync.getClassSettings(student.classCode).then(function(settings) {
      if (settings.hackerModeEnabled) {
        section.classList.remove("hidden");
      }
    });
  }

  // Render claimed flags
  var list = document.getElementById("claimed-flags-list");
  if (list) {
    list.innerHTML = "";
    if (claimedFlags.length === 0) {
      list.innerHTML = '<p style="color: #555; font-size: 0.8rem;">No flags claimed yet. Explore the platform...</p>';
    } else {
      for (var i = 0; i < claimedFlags.length; i++) {
        var item = document.createElement("div");
        item.style.cssText = "padding: 0.25rem 0; font-size: 0.8rem; border-bottom: 1px solid #222;";
        item.textContent = claimedFlags[i];
        list.appendChild(item);
      }
    }
  }
}

// Flag submission
document.getElementById("flag-submit-btn").addEventListener("click", function() {
  var input = document.getElementById("flag-input");
  var resultEl = document.getElementById("flag-result");
  var flag = input.value.trim();
  if (!flag) return;

  var result = Gamification.claimFlag(flag);
  resultEl.classList.remove("hidden");
  if (result.success) {
    resultEl.style.color = "#22c55e";
    resultEl.textContent = "Flag claimed! +" + result.xp + " XP";
    input.value = "";
    renderSecrets();
    // Show badge if earned
    if (result.newBadges) {
      for (var b = 0; b < result.newBadges.length; b++) {
        if (result.newBadges[b]) Celebrations.showBadge(result.newBadges[b]);
      }
    }
  } else {
    resultEl.style.color = "#ef4444";
    resultEl.textContent = result.message || "Invalid flag";
  }
});
```

Call `renderSecrets()` on page load (in the existing init function).

- [ ] **Step 3: Update `getProfile()` in gamification.js to return `claimedFlags`**

In `js/gamification.js`, find `getProfile()` return object (around line 590-618). Add:

```javascript
    claimedFlags: data.claimedFlags || [],
    completedChallenges: data.completedChallenges || {}
```

- [ ] **Step 4: Commit**

```bash
git add profile.html js/gamification.js
git commit -m "feat: add Secrets section to profile page"
```

---

### Task 9: Teacher Dashboard — Hacker Mode Toggle

**Files:**
- Modify: `teacher.html`

- [ ] **Step 1: Add Hacker Mode toggle**

In `teacher.html`, find the class settings section (after the leaderboard toggle, around line 230). Add:

```html
  <!-- Hacker Mode Toggle -->
  <div class="p-4 bg-white border rounded-xl">
    <div class="flex items-center justify-between">
      <div>
        <h4 class="font-semibold text-gray-800">💻 Hacker Mode</h4>
        <p class="text-sm text-gray-600">Enable CTF challenges and Easter eggs</p>
      </div>
      <label class="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" id="hacker-mode-toggle" onchange="updateClassSetting('hackerModeEnabled', this.checked)" class="sr-only peer">
        <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
      </label>
    </div>
  </div>
```

- [ ] **Step 2: Update `loadClassSettings()` to include Hacker Mode**

In the existing `loadClassSettings()` function in `teacher.html`, add after the leaderboard toggle state is set:

```javascript
    document.getElementById("hacker-mode-toggle").checked = settings.hackerModeEnabled || false;
```

- [ ] **Step 3: Commit**

```bash
git add teacher.html
git commit -m "feat: add Hacker Mode toggle to teacher dashboard"
```

---

### Task 10: Final Integration

**Files:**
- Multiple files

- [ ] **Step 1: Verify CTF badges appear with ctf flag in getProfile**

In `js/gamification.js`, ensure the `allBadges` filtering in `getProfile()` includes CTF badges (they have `ctf: true` and are not hidden, so they pass the existing filter). Verify CTF badges with `ctf: true` property are included.

- [ ] **Step 2: Verify all script tags**

Ensure `challenges.html` loads: `data/challenges.js`, `js/gamification.js`, `js/celebrations.js`, `js/firebase-sync.js`
Ensure `secret.html` loads: `js/gamification.js`, `js/firebase-sync.js`

- [ ] **Step 3: Manual smoke test**

- [ ] Open `index.html` — verify source comment `<!-- flag: PYLAB{view_source_master} -->` is present
- [ ] Open console — verify ASCII art message and `Gamification.secret()` works
- [ ] Enter konami code (↑↑↓↓←→←→BA) — verify Matrix rain + flag popup
- [ ] Navigate to `/secret.html` — verify terminal page and auto-claim
- [ ] Navigate to `/robots.txt` — verify flag is visible
- [ ] Enable Hacker Mode in teacher dashboard for a class
- [ ] Verify hacker card appears on student landing page
- [ ] Open `challenges.html` — verify access check works
- [ ] Complete a Python challenge (Caesar cipher) — verify XP and badge award
- [ ] Complete a discovery challenge (Page Inspector) — verify text input validation
- [ ] Open profile page — verify Secrets section, submit a manual flag
- [ ] Verify CTF badges appear in badge gallery

- [ ] **Step 4: Commit any final fixes**

```bash
git add index.html exercise.html topics.html profile.html teacher.html js/ css/ data/ challenges.html secret.html robots.txt
git commit -m "feat: complete CTF challenges and Easter eggs system"
```
