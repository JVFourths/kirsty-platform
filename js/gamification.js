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
            streakFreezes: 1,          // 1 free freeze per month
            lastFreezeMonth: null,
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

        if (data.lastActivityDate === today) {
            // Already logged in today, no change
            return data;
        }

        if (data.lastActivityDate === yesterday) {
            // Consecutive day — extend streak
            data.currentStreak += 1;
        } else if (data.lastActivityDate && data.lastActivityDate !== today) {
            // Missed a day — check for streak freeze
            var daysMissed = Math.floor(
                (new Date(today) - new Date(data.lastActivityDate)) / (1000 * 60 * 60 * 24)
            );

            if (daysMissed === 2 && data.streakFreezes > 0) {
                // Missed exactly 1 day, use a freeze
                data.streakFreezes -= 1;
                data.currentStreak += 1; // Keep the streak going
            } else {
                // Streak broken
                data.currentStreak = 1;
            }
        } else {
            // First ever visit
            data.currentStreak = 1;
        }

        // Update longest streak
        if (data.currentStreak > data.longestStreak) {
            data.longestStreak = data.currentStreak;
        }

        data.lastActivityDate = today;

        // Reset streak freeze monthly
        if (data.lastFreezeMonth !== _thisMonth()) {
            data.streakFreezes = 1;
            data.lastFreezeMonth = _thisMonth();
        }

        // Weekly XP reset
        var weekStart = _weekStart();
        if (data.weekStartDate !== weekStart) {
            data.weeklyXP = 0;
            data.weekStartDate = weekStart;
        }

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

        data.totalXP += xp;
        data.weeklyXP += xp;
        data.totalExercises += 1;
        data.completedExercises[exerciseId] = { xp: xp, timestamp: Date.now() };

        // Check year completion
        _checkYearCompletion(data);

        // Check badges
        var newBadges = _checkBadges(data);

        var newLevelData = getLevel(data.totalXP);
        var leveledUp = newLevelData.level > oldLevel;

        _save(data);

        return {
            xpGained: xp,
            bonusXP: bonusXP,
            newLevel: leveledUp ? newLevelData : false,
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
            streakFreezes: data.streakFreezes,
            totalExercises: data.totalExercises,
            earnedBadges: data.earnedBadges,
            completedExercises: data.completedExercises,
            allBadges: BADGES,
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
        BADGES: BADGES,
        LEVELS: LEVELS,
        XP_REWARDS: XP_REWARDS
    };

})();
