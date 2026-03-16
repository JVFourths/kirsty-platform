/**
 * Python Lab — Gamification Engine
 *
 * Handles XP, levels, streaks, badges, and weekly leaderboard.
 * All data stored in localStorage — no server required.
 */

var Gamification = (function () {

    var STORAGE_KEY = "pythonlab_game";

    /* ═══════════════════════════════════════════
       LEVEL & XP CONFIGURATION
       ═══════════════════════════════════════════ */

    var LEVELS = [
        { level: 1,  title: "Python Beginner",     xpRequired: 0,    icon: "🐣" },
        { level: 2,  title: "Code Explorer",       xpRequired: 50,   icon: "🔍" },
        { level: 3,  title: "Script Starter",      xpRequired: 120,  icon: "📝" },
        { level: 4,  title: "Bug Spotter",         xpRequired: 220,  icon: "🐛" },
        { level: 5,  title: "Loop Learner",        xpRequired: 350,  icon: "🔄" },
        { level: 6,  title: "Function Fan",        xpRequired: 500,  icon: "⚡" },
        { level: 7,  title: "Data Wrangler",       xpRequired: 700,  icon: "📊" },
        { level: 8,  title: "Algorithm Ace",        xpRequired: 950,  icon: "🧩" },
        { level: 9,  title: "Python Pro",           xpRequired: 1250, icon: "🏆" },
        { level: 10, title: "Python Master",        xpRequired: 1600, icon: "👑" }
    ];

    // XP awarded per action
    var XP_REWARDS = {
        exercise_complete:   10,   // Any exercise completed
        predict_correct:     15,   // Prediction matched exactly
        challenge_first_try: 20,   // Got it right first attempt
        investigate_deep:    12,   // Investigated + changed + explained
        make_from_scratch:   25,   // Wrote code from scratch (make type)
        daily_login:          5,   // Just opening the platform
        streak_bonus_7:      30,   // 7-day streak bonus
        streak_bonus_14:     50,   // 14-day streak bonus
        streak_bonus_30:    100,   // 30-day streak bonus
    };

    /* ═══════════════════════════════════════════
       BADGES / ACHIEVEMENTS
       ═══════════════════════════════════════════ */

    var BADGES = [
        // Getting started
        { id: "first-run",        title: "Hello World!",    desc: "Run your first program",              icon: "👋",  check: function(d){ return d.totalExercises >= 1; } },
        { id: "five-done",        title: "High Five",       desc: "Complete 5 exercises",                icon: "🖐️",  check: function(d){ return d.totalExercises >= 5; } },
        { id: "ten-done",         title: "Perfect 10",      desc: "Complete 10 exercises",               icon: "🔟",  check: function(d){ return d.totalExercises >= 10; } },
        { id: "twenty-five-done", title: "Quarter Century",  desc: "Complete 25 exercises",              icon: "🎯",  check: function(d){ return d.totalExercises >= 25; } },

        // Streaks
        { id: "streak-3",   title: "On a Roll",       desc: "3-day streak",                             icon: "🔥",  check: function(d){ return d.currentStreak >= 3; } },
        { id: "streak-7",   title: "Week Warrior",    desc: "7-day streak",                             icon: "⚔️",  check: function(d){ return d.currentStreak >= 7; } },
        { id: "streak-14",  title: "Fortnight Force",  desc: "14-day streak",                           icon: "💪",  check: function(d){ return d.currentStreak >= 14; } },
        { id: "streak-30",  title: "Monthly Master",   desc: "30-day streak",                           icon: "🌟",  check: function(d){ return d.currentStreak >= 30; } },

        // PRIMM stages
        { id: "predictor",    title: "Crystal Ball",     desc: "Get 5 predictions right",               icon: "🔮",  check: function(d){ return d.correctPredictions >= 5; } },
        { id: "investigator", title: "Code Detective",   desc: "Complete 5 investigate exercises",       icon: "🕵️",  check: function(d){ return d.investigateCount >= 5; } },
        { id: "modifier",     title: "Remix Artist",     desc: "Complete 5 modify exercises",            icon: "🎨",  check: function(d){ return d.modifyCount >= 5; } },
        { id: "maker",        title: "Code Creator",     desc: "Complete 5 make exercises",              icon: "🚀",  check: function(d){ return d.makeCount >= 5; } },

        // Bug fixing
        { id: "bug-squasher",  title: "Bug Squasher",    desc: "Fix 3 errors in your code",             icon: "🐛",  check: function(d){ return d.errorsFixed >= 3; } },

        // Speed
        { id: "speedster",     title: "Speed Coder",      desc: "Complete an exercise in under 60 secs", icon: "⚡",  check: function(d){ return d.fastCompletions >= 1; } },

        // Year group completion
        { id: "y7-complete",   title: "Year 7 Champion",   desc: "Finish all Year 7 exercises",          icon: "🥇",  check: function(d){ return d.y7Complete; } },
        { id: "y8-complete",   title: "Year 8 Champion",   desc: "Finish all Year 8 exercises",          icon: "🥈",  check: function(d){ return d.y8Complete; } },
        { id: "y9-complete",   title: "Year 9 Champion",   desc: "Finish all Year 9 exercises",          icon: "🥉",  check: function(d){ return d.y9Complete; } },
        { id: "gcse-complete", title: "GCSE Legend",        desc: "Finish all GCSE exercises",            icon: "🏆",  check: function(d){ return d.gcseComplete; } },

        // Mystery badges (hidden until earned)
        { id: "night-owl", title: "Night Owl", desc: "Complete an exercise after 6pm", icon: "🦉", hidden: true, check: function() { return false; } },
        { id: "early-bird", title: "Early Bird", desc: "Complete an exercise before 8am", icon: "🐦", hidden: true, check: function() { return false; } },
        { id: "speed-demon", title: "Speed Demon", desc: "Complete 5 exercises in one session", icon: "⚡", hidden: true, check: function() { return false; } },
        { id: "perfectionist", title: "Perfectionist", desc: "10 correct predictions in a row", icon: "💎", hidden: true, check: function() { return false; } },
        { id: "marathon-runner", title: "Marathon Runner", desc: "Spend 60+ minutes in one session", icon: "🏃", hidden: true, check: function() { return false; } },

        // Weekly Champion badges
        { id: "weekly-champion-bronze", title: "Weekly Champion", desc: "Earned your first Weekly Chest", icon: "🥉", check: function(d) { return d.weeklyChestsEarned >= 1; } },
        { id: "weekly-champion-silver", title: "Weekly Champion II", desc: "Earned 3 Weekly Chests", icon: "🥈", check: function(d) { return d.weeklyChestsEarned >= 3; } },
        { id: "weekly-champion-gold", title: "Weekly Champion III", desc: "Earned 5 Weekly Chests", icon: "🥇", check: function(d) { return d.weeklyChestsEarned >= 5; } }
    ];

    /* ═══════════════════════════════════════════
       DATA MANAGEMENT
       ═══════════════════════════════════════════ */

    function _defaultData() {
        return {
            nickname: "",
            totalXP: 0,
            totalExercises: 0,
            currentStreak: 0,
            longestStreak: 0,
            lastActivityDate: null,
            correctPredictions: 0,
            investigateCount: 0,
            modifyCount: 0,
            makeCount: 0,
            errorsFixed: 0,
            fastCompletions: 0,
            exerciseStartTime: null,
            completedExercises: {},     // { exerciseId: { xp, timestamp } }
            earnedBadges: {},           // { badgeId: timestamp }
            weeklyXP: 0,
            weekStartDate: null,
            dailyLoginClaimed: null,    // date string
            y7Complete: false,
            y8Complete: false,
            y9Complete: false,
            gcseComplete: false,
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
        };
    }

    function _load() {
        try {
            var raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return _defaultData();
            var data = JSON.parse(raw);
            // Merge with defaults for any new fields
            var defaults = _defaultData();
            for (var key in defaults) {
                if (!(key in data)) data[key] = defaults[key];
            }
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
            return data;
        } catch (e) {
            return _defaultData();
        }
    }

    function _save(data) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } catch (e) {}
    }

    /* ═══════════════════════════════════════════
       DATE HELPERS
       ═══════════════════════════════════════════ */

    function _today() {
        return new Date().toISOString().split("T")[0]; // "2026-03-15"
    }

    function _yesterday() {
        var d = new Date();
        d.setDate(d.getDate() - 1);
        return d.toISOString().split("T")[0];
    }

    function _thisMonth() {
        return new Date().toISOString().slice(0, 7); // "2026-03"
    }

    function _weekStart() {
        // Monday of the current week
        var d = new Date();
        var day = d.getDay();
        var diff = d.getDate() - day + (day === 0 ? -6 : 1);
        var monday = new Date(d.setDate(diff));
        return monday.toISOString().split("T")[0];
    }

    /* ═══════════════════════════════════════════
       STREAK MANAGEMENT
       ═══════════════════════════════════════════ */

    function _updateStreak(data) {
        var today = _today();
        var yesterday = _yesterday();

        // IMPORTANT: Preserve the existing weekly XP reset logic
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
        } else if (data.lastActivityDate !== "" && data.lastActivityDate !== null) {
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

    /* ═══════════════════════════════════════════
       LEVEL CALCULATION
       ═══════════════════════════════════════════ */

    function getLevel(totalXP) {
        var current = LEVELS[0];
        for (var i = 0; i < LEVELS.length; i++) {
            if (totalXP >= LEVELS[i].xpRequired) {
                current = LEVELS[i];
            } else {
                break;
            }
        }
        // Calculate progress to next level
        var nextIndex = Math.min(current.level, LEVELS.length - 1);
        var next = LEVELS[nextIndex];
        var xpIntoLevel = totalXP - current.xpRequired;
        var xpForNextLevel = next.xpRequired - current.xpRequired;
        var progress = xpForNextLevel > 0 ? Math.min(xpIntoLevel / xpForNextLevel, 1) : 1;

        return {
            level: current.level,
            title: current.title,
            icon: current.icon,
            totalXP: totalXP,
            xpIntoLevel: xpIntoLevel,
            xpForNextLevel: xpForNextLevel,
            progress: progress,
            isMaxLevel: current.level === LEVELS[LEVELS.length - 1].level
        };
    }

    /* ═══════════════════════════════════════════
       BADGE CHECKING
       ═══════════════════════════════════════════ */

    function _checkBadges(data) {
        var newBadges = [];
        for (var i = 0; i < BADGES.length; i++) {
            var badge = BADGES[i];
            if (!data.earnedBadges[badge.id] && badge.check(data)) {
                data.earnedBadges[badge.id] = Date.now();
                newBadges.push(badge);
            }
        }
        return newBadges;
    }

    /* ═══════════════════════════════════════════
       YEAR COMPLETION CHECKING
       ═══════════════════════════════════════════ */

    function _checkYearCompletion(data) {
        if (typeof EXERCISES === "undefined") return;
        var yearKeys = { "7": "y7Complete", "8": "y8Complete", "9": "y9Complete", "gcse": "gcseComplete" };

        for (var yearKey in yearKeys) {
            var yearData = EXERCISES[yearKey];
            if (!yearData) continue;

            var allDone = true;
            var topics = yearData.topics || [];
            for (var t = 0; t < topics.length; t++) {
                var exs = topics[t].exercises || [];
                for (var e = 0; e < exs.length; e++) {
                    if (!data.completedExercises[exs[e].id]) {
                        allDone = false;
                        break;
                    }
                }
                if (!allDone) break;
            }
            data[yearKeys[yearKey]] = allDone;
        }
    }

    /* ═══════════════════════════════════════════
       PUBLIC API
       ═══════════════════════════════════════════ */

    /** Call when the student opens any page — handles daily login XP and streaks. */
    function recordVisit() {
        var data = _load();
        var oldStreak = data.currentStreak;
        data = _updateStreak(data);

        var result = { streakChange: data.currentStreak - oldStreak, xpGained: 0, newBadges: [] };

        // Daily login XP (once per day)
        if (data.dailyLoginClaimed !== _today()) {
            data.totalXP += XP_REWARDS.daily_login;
            data.weeklyXP += XP_REWARDS.daily_login;
            data.dailyLoginClaimed = _today();
            result.xpGained += XP_REWARDS.daily_login;
        }

        // Streak milestone bonuses
        if (data.currentStreak === 7 && !data.earnedBadges["streak-7"]) {
            data.totalXP += XP_REWARDS.streak_bonus_7;
            data.weeklyXP += XP_REWARDS.streak_bonus_7;
            result.xpGained += XP_REWARDS.streak_bonus_7;
        }
        if (data.currentStreak === 14 && !data.earnedBadges["streak-14"]) {
            data.totalXP += XP_REWARDS.streak_bonus_14;
            data.weeklyXP += XP_REWARDS.streak_bonus_14;
            result.xpGained += XP_REWARDS.streak_bonus_14;
        }
        if (data.currentStreak === 30 && !data.earnedBadges["streak-30"]) {
            data.totalXP += XP_REWARDS.streak_bonus_30;
            data.weeklyXP += XP_REWARDS.streak_bonus_30;
            result.xpGained += XP_REWARDS.streak_bonus_30;
        }

        result.newBadges = _checkBadges(data);
        _save(data);
        return result;
    }

    /** Start timing an exercise (for speed badge). */
    function startExerciseTimer() {
        var data = _load();
        data.exerciseStartTime = Date.now();
        _save(data);
    }

    /**
     * Record exercise completion.
     * @param {string} exerciseId
     * @param {string} exerciseType - "predict"|"run"|"investigate"|"modify"|"make"
     * @param {object} opts - { firstTry: bool, predictionCorrect: bool }
     * @returns {object} { xpGained, newLevel, newBadges, totalXP }
     */
    function completeExercise(exerciseId, exerciseType, opts) {
        opts = opts || {};
        var data = _load();
        data = _updateStreak(data);

        // Don't double-count
        if (data.completedExercises[exerciseId]) {
            _save(data);
            return { xpGained: 0, newLevel: false, newBadges: [], totalXP: data.totalXP };
        }

        var oldLevel = getLevel(data.totalXP).level;
        var xp = XP_REWARDS.exercise_complete;

        // Bonus XP per type
        if (exerciseType === "predict" && opts.predictionCorrect) {
            xp = XP_REWARDS.predict_correct;
            data.correctPredictions += 1;
        } else if (exerciseType === "make") {
            xp = XP_REWARDS.make_from_scratch;
            data.makeCount += 1;
        } else if (exerciseType === "investigate") {
            xp = XP_REWARDS.investigate_deep;
            data.investigateCount += 1;
        } else if (exerciseType === "modify") {
            xp += 5; // Small bonus
            data.modifyCount += 1;
        }

        // First try bonus
        if (opts.firstTry) {
            xp += 5;
        }

        // Speed bonus (under 60 seconds)
        if (data.exerciseStartTime) {
            var elapsed = (Date.now() - data.exerciseStartTime) / 1000;
            if (elapsed < 60) {
                data.fastCompletions += 1;
            }
        }

        // Random bonus (20% chance, +3-8 XP) — variable reward for engagement
        var bonusXP = 0;
        if (Math.random() < 0.20) {
            bonusXP = Math.floor(Math.random() * 6) + 3;
            xp += bonusXP;
        }

        // Double XP multiplier (teacher-controlled)
        if (opts && opts.doubleXP) {
            xp = xp * 2;
        }

        data.totalXP += xp;
        data.weeklyXP += xp;
        data.totalExercises += 1;
        data.completedExercises[exerciseId] = { xp: xp, timestamp: Date.now() };

        // Check year completion
        _checkYearCompletion(data);

        // Check badges
        var newBadges = _checkBadges(data);

        // Session tracking and mystery badges
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

        // Update weekly mission progress
        _updateMissionProgress(data, exerciseType, xp);

        var newLevelData = getLevel(data.totalXP);
        var leveledUp = newLevelData.level > oldLevel;

        // When leveling up, find the perk for that level
        var newLevel = leveledUp ? newLevelData : false;
        if (newLevel) {
            for (var lp = 0; lp < LEVEL_PERKS.length; lp++) {
                if (LEVEL_PERKS[lp].level === newLevel.level) {
                    newLevel.perk = LEVEL_PERKS[lp].label;
                    break;
                }
            }
        }

        _save(data);

        return {
            xpGained: xp,
            bonusXP: bonusXP,
            newLevel: newLevel,
            newBadges: newBadges,
            totalXP: data.totalXP,
            level: newLevelData
        };
    }

    /** Record that the student fixed an error. */
    function recordErrorFixed() {
        var data = _load();
        data.errorsFixed = (data.errorsFixed || 0) + 1;
        var newBadges = _checkBadges(data);
        _save(data);
        return newBadges;
    }

    /** Get full player profile for display. */
    function getProfile() {
        var data = _load();
        data = _updateStreak(data);
        _save(data);

        var level = getLevel(data.totalXP);
        return {
            nickname: data.nickname || "Student",
            totalXP: data.totalXP,
            weeklyXP: data.weeklyXP,
            level: level,
            currentStreak: data.currentStreak,
            longestStreak: data.longestStreak,
            totalExercises: data.totalExercises,
            dailyChallengeStreak: data.dailyChallengeStreak,
            longestChallengeStreak: data.longestChallengeStreak,
            dailyChallengesCompleted: data.dailyChallengesCompleted,
            streakRecoveryAvailable: data.streakRecoveryAvailable,
            activityHistory: data.activityHistory || [],
            weekStartDate: data.weekStartDate || "",
            earnedBadges: data.earnedBadges,
            completedExercises: data.completedExercises,
            allBadges: (function() {
                var filtered = [];
                for (var i = 0; i < BADGES.length; i++) {
                    var b = BADGES[i];
                    if (b.hidden && !data.earnedBadges[b.id]) {
                        continue; // Don't show unearned mystery badges
                    }
                    filtered.push(b);
                }
                return filtered;
            })(),
            allLevels: LEVELS
        };
    }

    /** Set student nickname. */
    function setNickname(name) {
        var data = _load();
        data.nickname = (name || "").trim().slice(0, 20);
        _save(data);
    }

    /** Check if an exercise is completed. */
    function isExerciseComplete(exerciseId) {
        var data = _load();
        return !!data.completedExercises[exerciseId];
    }

    /** Get exercise completion count for a year group. */
    function countForYear(yearKey) {
        if (typeof EXERCISES === "undefined" || !EXERCISES[yearKey]) {
            return { done: 0, total: 0 };
        }
        var data = _load();
        var total = 0, done = 0;
        var topics = EXERCISES[yearKey].topics || [];
        for (var t = 0; t < topics.length; t++) {
            var exs = topics[t].exercises || [];
            for (var e = 0; e < exs.length; e++) {
                total++;
                if (data.completedExercises[exs[e].id]) done++;
            }
        }
        return { done: done, total: total };
    }

    /** Get exercise completion count for a single topic. */
    function countForTopic(yearKey, topicId) {
        if (typeof EXERCISES === "undefined" || !EXERCISES[yearKey]) {
            return { done: 0, total: 0 };
        }
        var data = _load();
        var topics = EXERCISES[yearKey].topics || [];
        for (var t = 0; t < topics.length; t++) {
            if (topics[t].id === topicId) {
                var exs = topics[t].exercises || [];
                var done = 0;
                for (var e = 0; e < exs.length; e++) {
                    if (data.completedExercises[exs[e].id]) done++;
                }
                return { done: done, total: exs.length };
            }
        }
        return { done: 0, total: 0 };
    }

    /** Full reset (for testing). */
    function resetAll() {
        _save(_defaultData());
    }

    /* ═══════════════════════════════════════════
       SESSION TRACKING & MYSTERY BADGES
       ═══════════════════════════════════════════ */

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

    /* ═══════════════════════════════════════════
       WEEKLY MISSIONS
       ═══════════════════════════════════════════ */

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
            // Track weekly count using startCount delta
            m.progress = data.dailyChallengesCompleted - (m.startCount || 0);
            break;
          case "topic":
            // Checked separately via topic completion
            break;
        }
        // Cap progress at target
        if (m.progress > m.target) m.progress = m.target;
      }

      // Check if all missions just completed (award weekly chest)
      if (!wereAllComplete && _allMissionsComplete(data.weeklyMissions)) {
        data.weeklyChestsEarned = data.weeklyChestsEarned + 1;
        data.totalXP = data.totalXP + 50;

        // Award Weekly Champion badges
        if (data.weeklyChestsEarned >= 1 && !data.earnedBadges["weekly-champion-bronze"]) {
          data.earnedBadges["weekly-champion-bronze"] = Date.now();
        }
        if (data.weeklyChestsEarned >= 3 && !data.earnedBadges["weekly-champion-silver"]) {
          data.earnedBadges["weekly-champion-silver"] = Date.now();
        }
        if (data.weeklyChestsEarned >= 5 && !data.earnedBadges["weekly-champion-gold"]) {
          data.earnedBadges["weekly-champion-gold"] = Date.now();
        }
      }
    }

    /* ═══════════════════════════════════════════
       DAILY CHALLENGE
       ═══════════════════════════════════════════ */

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

    /* ═══════════════════════════════════════════
       STREAK RECOVERY
       ═══════════════════════════════════════════ */

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

    /* ═══════════════════════════════════════════
       FLAME CLASS
       ═══════════════════════════════════════════ */

    function getFlameClass(streakCount) {
        if (streakCount >= 30) return "streak-flame-purple";
        if (streakCount >= 14) return "streak-flame-blue";
        if (streakCount >= 7) return "streak-flame-lg";
        if (streakCount >= 3) return "streak-flame-md";
        return "streak-flame-sm";
    }

    /* ═══════════════════════════════════════════
       LEVEL PERKS
       ═══════════════════════════════════════════ */

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

    function applyPerks() {
        var perks = getSelectedPerks();

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

    /* ═══════════════════════════════════════════
       EXPORT
       ═══════════════════════════════════════════ */

    return {
        recordVisit: recordVisit,
        startExerciseTimer: startExerciseTimer,
        completeExercise: completeExercise,
        recordErrorFixed: recordErrorFixed,
        getProfile: getProfile,
        setNickname: setNickname,
        getLevel: getLevel,
        isExerciseComplete: isExerciseComplete,
        countForYear: countForYear,
        countForTopic: countForTopic,
        resetAll: resetAll,
        getTodaysChallenge: getTodaysChallenge,
        isDailyChallengeComplete: isDailyChallengeComplete,
        completeDailyChallenge: completeDailyChallenge,
        getWeeklyMissions: getWeeklyMissions,
        getStreakRecoveryStatus: getStreakRecoveryStatus,
        completeStreakRecovery: completeStreakRecovery,
        getFlameClass: getFlameClass,
        getLevelPerks: getLevelPerks,
        selectPerk: selectPerk,
        getSelectedPerks: getSelectedPerks,
        applyPerks: applyPerks,
        BADGES: BADGES,
        LEVELS: LEVELS,
        XP_REWARDS: XP_REWARDS
    };

})();
