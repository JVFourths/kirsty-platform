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
