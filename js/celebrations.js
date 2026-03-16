/**
 * Python Lab — Celebration Animations
 *
 * XP popups, confetti bursts, level-up modals, badge unlocks.
 */

var Celebrations = (function () {

    /* ── XP Popup (floats up from where the action happened) ── */
    function showXP(xp, bonusXP, targetEl) {
        var rect = targetEl
            ? targetEl.getBoundingClientRect()
            : { left: window.innerWidth / 2, top: window.innerHeight / 2 };

        var popup = document.createElement("div");
        popup.className = "xp-popup";
        popup.innerHTML = "+{xp} XP".replace("{xp}", xp);
        if (bonusXP > 0) {
            popup.innerHTML += ' <span class="xp-bonus">+' + bonusXP + ' bonus!</span>';
        }
        popup.style.left = rect.left + "px";
        popup.style.top = (rect.top - 10) + "px";
        document.body.appendChild(popup);

        // Trigger animation
        requestAnimationFrame(function () {
            popup.classList.add("xp-popup-animate");
        });

        setTimeout(function () { popup.remove(); }, 1500);
    }

    /* ── Confetti Burst ── */
    function confetti() {
        var colours = ["#22c55e", "#6366f1", "#f59e0b", "#ef4444", "#06b6d4", "#ec4899"];
        var container = document.createElement("div");
        container.className = "confetti-container";
        container.setAttribute("aria-hidden", "true");
        document.body.appendChild(container);

        for (var i = 0; i < 50; i++) {
            var piece = document.createElement("div");
            piece.className = "confetti-piece";
            piece.style.backgroundColor = colours[Math.floor(Math.random() * colours.length)];
            piece.style.left = Math.random() * 100 + "%";
            piece.style.animationDelay = Math.random() * 0.5 + "s";
            piece.style.animationDuration = (Math.random() * 1 + 1.5) + "s";
            // Random shapes
            if (Math.random() > 0.5) {
                piece.style.borderRadius = "50%";
            }
            container.appendChild(piece);
        }

        setTimeout(function () { container.remove(); }, 3000);
    }

    /* ── Level Up Modal ── */
    function showLevelUp(levelData) {
        var overlay = document.createElement("div");
        overlay.className = "level-up-overlay";
        overlay.innerHTML =
            '<div class="level-up-modal">' +
                '<div class="level-up-icon">' + levelData.icon + '</div>' +
                '<h2 class="level-up-title">Level Up!</h2>' +
                '<p class="level-up-level">Level ' + levelData.level + '</p>' +
                '<p class="level-up-name">' + levelData.title + '</p>' +
                '<button class="level-up-btn" onclick="this.closest(\'.level-up-overlay\').remove()">Brilliant!</button>' +
            '</div>';
        document.body.appendChild(overlay);

        // Show perk if unlocked at this level
        if (levelData.perk) {
            var perkEl = document.createElement("p");
            perkEl.className = "level-up-perk";
            perkEl.textContent = "Unlocked: " + levelData.perk;
            overlay.querySelector(".level-up-modal").appendChild(perkEl);
        }

        // Trigger entrance animation
        requestAnimationFrame(function () {
            overlay.classList.add("level-up-visible");
        });

        // Also fire confetti
        setTimeout(confetti, 200);
    }

    /* ── Badge Unlock Toast ── */
    function showBadge(badge) {
        var toast = document.createElement("div");
        toast.className = "badge-toast";
        toast.innerHTML =
            '<div class="badge-toast-icon">' + badge.icon + '</div>' +
            '<div class="badge-toast-text">' +
                '<span class="badge-toast-label">Badge Unlocked!</span>' +
                '<span class="badge-toast-title">' + badge.title + '</span>' +
                '<span class="badge-toast-desc">' + badge.desc + '</span>' +
            '</div>';
        document.body.appendChild(toast);

        requestAnimationFrame(function () {
            toast.classList.add("badge-toast-visible");
        });

        setTimeout(function () {
            toast.classList.add("badge-toast-exit");
            setTimeout(function () { toast.remove(); }, 500);
        }, 3500);
    }

    /* ── Streak Animation (fire emoji + counter) ── */
    function showStreak(count) {
        var el = document.createElement("div");
        el.className = "streak-toast";
        el.innerHTML =
            '<span class="streak-fire">🔥</span>' +
            '<span class="streak-count">' + count + ' day streak!</span>';
        document.body.appendChild(el);

        requestAnimationFrame(function () {
            el.classList.add("streak-toast-visible");
        });

        setTimeout(function () {
            el.classList.remove("streak-toast-visible");
            setTimeout(function () { el.remove(); }, 400);
        }, 2500);
    }

    /* ── Lucky XP Bonus Animation ── */
    function showLuckyXP(xp, targetEl) {
      var popup = document.createElement("div");
      popup.className = "xp-popup lucky-xp";
      popup.innerHTML = "\u2728 Lucky +" + xp + " XP! \u2728";

      var rect = targetEl
          ? targetEl.getBoundingClientRect()
          : { left: window.innerWidth / 2, top: window.innerHeight / 2, width: 0 };
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

    /* ── Process all rewards from a completion event ── */
    function celebrate(result, targetEl) {
        // XP popup
        if (result.xpGained > 0) {
            showXP(result.xpGained, result.bonusXP || 0, targetEl);
        }

        // Level up
        if (result.newLevel) {
            setTimeout(function () { showLevelUp(result.newLevel); }, 600);
        }

        // Badges
        if (result.newBadges && result.newBadges.length > 0) {
            for (var i = 0; i < result.newBadges.length; i++) {
                (function (badge, delay) {
                    setTimeout(function () { showBadge(badge); }, delay);
                })(result.newBadges[i], 800 + i * 600);
            }
        }

        // Lucky XP bonus animation
        if (result.bonusXP && result.bonusXP > 0) {
            setTimeout(function() {
                showLuckyXP(result.bonusXP, targetEl);
            }, 500);
        }

        // Streak milestone celebration
        if (result.streakMilestone) {
            var messages = { 3: "On a Roll!", 7: "Week Warrior!", 14: "Unstoppable!", 30: "Monthly Legend!" };
            var msg = messages[result.streakMilestone] || (result.streakMilestone + " Day Streak!");
            showStreak(result.streakMilestone);
        }

        // Confetti for first-try or special moments
        if (result.xpGained >= 20) {
            setTimeout(confetti, 300);
        }
    }

    return {
        showXP: showXP,
        confetti: confetti,
        showLevelUp: showLevelUp,
        showBadge: showBadge,
        showStreak: showStreak,
        showLuckyXP: showLuckyXP,
        celebrate: celebrate
    };

})();
