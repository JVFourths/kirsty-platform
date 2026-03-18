# CTF Challenges & Easter Eggs — Design Spec

## Problem

Year 7-9 students engage with Python Lab in the first session but quickly lose interest in the standard exercises. When observed in class, their natural curiosity drives them toward exploring the platform itself — trying to find the server IP, inspecting source code, poking at URLs. This energy needs to be channelled into structured learning rather than fought against.

## Constraints & Principles

- **Year 7-9 students (11-14 year olds)** — Challenges must feel "hackery" and cool but be achievable without real security knowledge
- **Tightly coupled to Python curriculum** — Challenges require Python skills students are learning
- **Teacher-controlled access** — Teachers enable "Hacker Mode" per class from the dashboard, off by default
- **Integrated XP, separate badges** — CTF challenges award XP into the main pool but have their own unique badge set
- **Start small** — 5-8 challenges plus 5-6 Easter eggs for initial release, designed for easy expansion
- **Existing tech stack** — Vanilla ES5 JavaScript, localStorage + Firestore, Pyodide, Tailwind CSS, no new dependencies
- **Additive** — No existing features changed or removed

## Solution Overview

Two components:

| Component | Description | Entry point |
|-----------|-------------|-------------|
| Easter Eggs | 5-6 secrets hidden across existing pages | Discovery — no menu link |
| Challenge Track | 5-8 hacker-themed Python + discovery challenges on a dedicated dark-themed page | Landing page card (when Hacker Mode enabled) |

---

## Easter Eggs

5-6 Easter eggs hidden across the platform. Each awards bonus XP and a secret badge when discovered. Students claim them by entering flag codes (format: `PYLAB{flag_text}`) in a secrets section on the profile page.

### Egg 1: Source Code Secret
- An HTML comment in `index.html`: `<!-- flag: PYLAB{view_source_master} -->`
- Students who view source find it
- Awards 20 XP

### Egg 2: Console Message
- On page load, `console.log` prints a stylised message with ASCII art: "Looking for secrets? Try typing `Gamification.secret()` in this console"
- Calling `Gamification.secret()` returns the flag `PYLAB{console_hacker}` and awards 20 XP
- The function is added to the Gamification IIFE return object

### Egg 3: Konami Code
- Entering ↑↑↓↓←→←→BA on any page triggers a Matrix-style rain animation
- Displays the flag `PYLAB{konami_coder}` on screen
- Awards 20 XP

### Egg 4: Hidden Page
- Navigating to `/secret.html` shows a terminal-styled congratulations page
- Contains the flag `PYLAB{hidden_path_finder}`
- No links to this page anywhere in the platform
- Awards 25 XP

### Egg 5: Robot Trail
- A `robots.txt` file at the site root contains: `# Nothing to see here... or is there? Flag: PYLAB{robots_txt_reader}`
- Students who know to check robots.txt (or discover it through curiosity) find the flag
- Awards 25 XP

### Flag Claiming Mechanism
- `js/gamification.js` stores a map of valid flags to badge IDs and XP values
- A `claimFlag(flagText)` function validates the flag, awards XP directly to `totalXP` (bypassing `completeExercise` — flags are not exercises), updates `weeklyXP`, grants the corresponding badge, saves to localStorage, and calls `FirebaseSync.syncProgress()`
- Exposed as `Gamification.claimFlag(flag)` for the console egg and profile page submission
- The `Gamification.secret()` function internally calls `claimFlag` and returns the flag string on first call, or "Flag already claimed!" on subsequent calls
- Duplicate claims are rejected (flag already claimed) — `claimFlag` returns `{ success: false, message: "Already claimed" }`
- Claimed flags are stored in `pythonlab_game.claimedFlags` array

### Easter Egg Auto-Claiming
- **Egg 2 (Console):** Auto-claimed when `Gamification.secret()` is called — no manual flag entry needed
- **Egg 3 (Konami):** Auto-claimed when the code is entered — the animation includes a "Flag claimed!" message and the XP popup. No manual entry needed
- **Egg 4 (Hidden Page):** `secret.html` auto-claims on page load by calling `Gamification.claimFlag()` directly
- **Eggs 1 & 5 (Source Code, Robots.txt):** These require manual entry in the Secrets input on the profile page, since the student discovers a text flag they must type in

### Flag Submission UI
- Profile page: a "Secrets" section appears after the first flag is claimed OR after Hacker Mode is enabled for the student's class
- Contains a text input with placeholder "Enter flag code..." and a Submit button
- Shows a list of claimed flags with their badges below
- Styled with dark/green terminal aesthetic to match the CTF theme

---

## Challenge Track

### Page: `challenges.html`

A dedicated page with a dark terminal aesthetic:
- Near-black background (`#0a0a0a`)
- Green (`#22c55e`) and amber (`#f59e0b`) monospace text
- Subtle CSS scanline overlay effect
- Terminal-style header: `> python_lab // hacker_mode`

### Challenge Data: `data/challenges.js`

A global `CHALLENGES` array with challenge objects:

```javascript
{
  id: "ctf-caesar-1",
  title: "Caesar's Secret",
  tier: "script-kiddie",       // "script-kiddie" | "hacker" | "elite"
  type: "python",              // "python" | "discovery"
  instructions: "This message was encoded with a Caesar cipher...",
  starterCode: "# Decode the message\nencoded = 'KHOOR ZRUOG'\n",
  expectedOutput: "HELLO WORLD",  // for python type
  expectedAnswer: null,           // for discovery type (text match)
  hint: "Each letter has been shifted forward by 3 positions",
  xp: 15                         // 15 for script-kiddie, 25 for hacker, 50 for elite
}
```

### Initial Challenges (5-8)

**Script Kiddie tier (15 XP):**

1. **Caesar's Secret** (Python) — "This message was encoded by shifting each letter forward by 3. Write Python to decode: `KHOOR ZRUOG`"
   - Expected output: `HELLO WORLD`

2. **Base64 Basics** (Python) — "This string is encoded in base64: `UHl0aG9uIExhYg==`. Use Python's `base64` module to decode it"
   - Expected output: `Python Lab`

3. **Page Inspector** (Discovery) — "Every web page has a `<title>` tag. What is the exact title of the Python Lab login page? Hint: open the login page and view its source code."
   - Expected answer: hardcoded in `data/challenges.js` as the current login page title. Answer matching is case-insensitive and trimmed of whitespace. The `expectedAnswer` field stores the canonical answer as a lowercase trimmed string.

**Hacker tier (25 XP):**

4. **Reverse Engineer** (Python) — "This function produces the output below. Write the function." Given output of a pattern, student writes code that reproduces it exactly.
   - Expected output: specific pattern string

5. **Hex Decoder** (Python) — "This secret message is in hexadecimal: `48 65 6C 6C 6F`. Write Python to convert each hex value to a character and print the message"
   - Expected output: `Hello`

6. **Cookie Monster** (Discovery) — "Websites store data in your browser using localStorage. Open the browser console on Python Lab and find the key that stores your game progress. What is the key name?"
   - Expected answer: `pythonlab_game`

**Elite tier (50 XP):**

7. **Cipher Chain** (Python) — "This message was first reversed, then Caesar shifted by 5, then base64 encoded. Write Python to undo all three steps." Multi-step decoding challenge.
   - Expected output: the decoded plaintext

8. **Pattern Cracker** (Python) — "This function generates passwords. Given these 5 outputs, figure out the pattern and predict the next 3." Requires analysing the pattern and writing code.
   - Expected output: the next 3 passwords

### Challenge Completion

Challenge completion does NOT use `Gamification.completeExercise()`. Instead, a dedicated `Gamification.completeChallenge(challengeId, xp)` function is added that:
- Adds the challenge to `pythonlab_game.completedChallenges` with XP and timestamp
- Adds the exact XP amount from the challenge definition to `totalXP` and `weeklyXP` (no random bonus, no Double XP multiplier — CTF XP is fixed)
- Increments `totalExercises`
- Checks CTF badges via `_checkCtfBadges(data)`
- Saves to localStorage and calls `FirebaseSync.syncProgress()`
- Returns `{ xpGained, newBadges }`

Discovery challenge answers are validated by trimming whitespace, converting to lowercase, and comparing to `expectedAnswer` (also stored lowercase and trimmed).

### Challenge UI

Each challenge is displayed as a collapsible card:
- **Collapsed:** Tier badge (colour-coded), title, completion checkmark if done
- **Expanded:** Instructions, code editor (Python challenges use CodeMirror + Pyodide, same as main exercises) or text input (discovery challenges), hint button, submit button
- **On correct answer:** Green flash, XP popup, challenge marked complete
- **On wrong answer:** Red flash, "Try again" message, no penalty

### Progress Display
- Top of page: `> 3/8 challenges complete` in terminal style
- Below challenges: CTF badge gallery showing earned/locked badges

---

## CTF Badges

Separate badge set with hacker theme, displayed in the regular badge gallery on the profile page with a distinct dark/green colour scheme:

| Badge ID | Title | Condition | Icon |
|----------|-------|-----------|------|
| `ctf-script-kiddie` | Script Kiddie | Complete first challenge | 💻 |
| `ctf-white-hat` | White Hat | Complete 3 challenges | 🎩 |
| `ctf-code-breaker` | Code Breaker | Complete a cipher challenge (Caesar, hex, or chain) | 🔓 |
| `ctf-packet-sniffer` | Packet Sniffer | Complete a discovery challenge | 🔍 |
| `ctf-zero-day` | Zero Day | Complete all challenges | 🏴 |
| `ctf-egg-hunter` | Easter Egg Hunter | Find 3 Easter eggs | 🥚 |
| `ctf-full-recon` | Full Recon | Find all Easter eggs | 🕵️ |

Badge definitions are added to the existing `BADGES` array in `gamification.js` with a `ctf: true` flag to visually distinguish them in the gallery. CTF badges use `check: function() { return false; }` (same pattern as mystery badges) — they are awarded by the dedicated `_checkCtfBadges(data)` function which checks `completedChallenges` and `claimedFlags` fields, not the standard `_checkBadges` loop.

The `_checkCtfBadges(data)` function:
- Counts `Object.keys(data.completedChallenges).length` for challenge-based badges
- Counts `data.claimedFlags.length` for Easter egg badges
- Checks challenge types (cipher IDs contain "caesar", "hex", or "chain"; discovery IDs have `type: "discovery"` in challenge data) for type-specific badges
- Awards badges directly into `data.earnedBadges`

---

## Teacher Controls

### Hacker Mode Toggle
- Added to the Class Settings section in `teacher.html` (alongside existing Feed, Leaderboard, Double XP toggles)
- On/off toggle per class, off by default
- Stored on the class Firestore document as `hackerModeEnabled: true/false`
- When toggled on, all students in that class see the CTF entry point

### Teacher Dashboard Addition
```
Hacker Mode toggle:
  [icon] Hacker Mode
  "Enable CTF challenges and Easter eggs for this class"
  [toggle switch]
```

---

## UI Integration

### Landing Page (`index.html`)
When Hacker Mode is enabled for the student's class, a card appears below the year group icons:

- Dark background (`bg-gray-900`), green monospace text
- Terminal-style prompt: `> hacker_mode_enabled`
- "Enter the Lab" button linking to `challenges.html`
- Subtle pulsing border animation

When not enabled, nothing appears — no hint the feature exists.

### Profile Page (`profile.html`)
- CTF badges appear in the existing badge gallery with dark/green styling
- "Secrets" section (below badges):
  - Only visible when Hacker Mode is enabled for the student's class OR when at least one flag has been claimed
  - Flag input: text field + Submit button, terminal-styled
  - List of claimed flags with their corresponding badges

### Challenges Page (`challenges.html`)
- Full dark terminal theme
- Loads: `data/challenges.js`, `js/gamification.js`, `js/celebrations.js`, `js/firebase-sync.js` (does NOT need `data/exercises.js` or `data/daily-challenges.js` — challenges are self-contained)
- Challenge completion calls `Gamification.completeChallenge(challengeId, xp)` — NOT `completeExercise`
- CTF badge checks run automatically inside `completeChallenge`
- Progress syncs to Firestore inside `completeChallenge`

**Access control:** On page load, `challenges.html` checks if Hacker Mode is enabled for the student's class via `FirebaseSync.getClassSettings()`. If not enabled, the page shows a "Hacker Mode is not enabled for your class" message and a back link. Direct URL access without Hacker Mode does not reveal challenge content.

---

## Data Model

### Additions to `pythonlab_game` (localStorage)
```javascript
{
  claimedFlags: ["PYLAB{view_source_master}", "PYLAB{console_hacker}"],
  completedChallenges: {
    "ctf-caesar-1": { xp: 15, timestamp: 1234567890 },
    "ctf-base64-1": { xp: 15, timestamp: 1234567891 }
  }
}
```

### Additions to class Firestore document
```javascript
{
  hackerModeEnabled: false  // teacher toggle
}
```

---

## Files Affected

### New files
- `challenges.html` — CTF challenge page with dark terminal theme
- `data/challenges.js` — Challenge definitions (5-8 initial challenges)
- `secret.html` — Hidden Easter egg page
- `robots.txt` — Easter egg with flag in comment

### Modified files
- `js/gamification.js` — CTF badges, flag claiming, `secret()` function, `completeChallenge()` function, `_checkCtfBadges()`, `_defaultData()` updated with `claimedFlags: []` and `completedChallenges: {}`
- `js/firebase-sync.js` — (1) `getClassSettings()` updated to include `hackerModeEnabled` in its return object, (2) `syncProgress()` updated to include `claimedFlags` and `completedChallenges` in the Firestore payload, (3) `loginWithCode()` updated to restore `claimedFlags` and `completedChallenges` from Firestore on device switch
- `index.html` — Hacker Mode card, konami code listener, console Easter egg, source code comment Easter egg
- `profile.html` — Secrets section with flag input, CTF badge styling
- `teacher.html` — Hacker Mode toggle in class settings
- `css/gamification.css` — CTF badge dark/green styles, terminal card styles, scanline effect, Matrix rain animation
