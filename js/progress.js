/**
 * Python Lab — Progress Tracking (localStorage)
 *
 * Tracks which exercises each student has completed and renders
 * progress bars on the landing page and topic pages.
 */

var Progress = (function () {
    var STORAGE_KEY = "pythonlab_progress";

    /** Load the full progress object from localStorage. */
    function _load() {
        try {
            var raw = localStorage.getItem(STORAGE_KEY);
            return raw ? JSON.parse(raw) : {};
        } catch (e) {
            return {};
        }
    }

    /** Save the full progress object to localStorage. */
    function _save(data) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } catch (e) {
            // Silently fail if storage is full
        }
    }

    /** Mark an exercise as completed. */
    function complete(exerciseId) {
        var data = _load();
        data[exerciseId] = { completed: true, timestamp: Date.now() };
        _save(data);
    }

    /** Check whether an exercise has been completed. */
    function isComplete(exerciseId) {
        var data = _load();
        return !!(data[exerciseId] && data[exerciseId].completed);
    }

    /** Reset a single exercise. */
    function reset(exerciseId) {
        var data = _load();
        delete data[exerciseId];
        _save(data);
    }

    /** Reset all progress (with confirmation). */
    function resetAll() {
        _save({});
    }

    /**
     * Count completed exercises for a given year group.
     * Returns { done: Number, total: Number }
     */
    function countForYear(yearKey) {
        if (typeof EXERCISES === "undefined" || !EXERCISES[yearKey]) {
            return { done: 0, total: 0 };
        }
        var data = _load();
        var total = 0;
        var done = 0;
        var topics = EXERCISES[yearKey].topics || [];
        for (var t = 0; t < topics.length; t++) {
            var exs = topics[t].exercises || [];
            for (var e = 0; e < exs.length; e++) {
                total++;
                if (data[exs[e].id] && data[exs[e].id].completed) {
                    done++;
                }
            }
        }
        return { done: done, total: total };
    }

    /**
     * Count completed exercises for a single topic.
     * Returns { done: Number, total: Number }
     */
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
                    if (data[exs[e].id] && data[exs[e].id].completed) done++;
                }
                return { done: done, total: exs.length };
            }
        }
        return { done: 0, total: 0 };
    }

    /** Update all progress bars on the current page (landing page). */
    function renderLandingBars() {
        var years = ["7", "8", "9", "gcse"];
        var totalDone = 0;
        var totalAll = 0;

        for (var i = 0; i < years.length; i++) {
            var y = years[i];
            var stats = countForYear(y);
            totalDone += stats.done;
            totalAll += stats.total;

            // Update bar width
            var bar = document.querySelector('.progress-bar[data-year="' + y + '"]');
            if (bar) {
                var pct = stats.total > 0 ? Math.round((stats.done / stats.total) * 100) : 0;
                bar.style.width = pct + "%";
            }

            // Update label
            var label = document.querySelector('.progress-bar-label[data-year="' + y + '"]');
            if (label) {
                label.textContent = stats.done + " / " + stats.total + " complete";
            }
        }

        // Header summary
        var summary = document.getElementById("progress-summary");
        if (summary && totalAll > 0) {
            summary.textContent = totalDone + " of " + totalAll + " exercises done";
        }
    }

    return {
        complete: complete,
        isComplete: isComplete,
        reset: reset,
        resetAll: resetAll,
        countForYear: countForYear,
        countForTopic: countForTopic,
        renderLandingBars: renderLandingBars
    };
})();

// Auto-render on landing page
document.addEventListener("DOMContentLoaded", function () {
    if (document.querySelector(".progress-bar")) {
        Progress.renderLandingBars();
    }
});
