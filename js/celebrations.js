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
                '<div class="level-up-icon"><span role="img" aria-label="' + (levelData.ariaLabel || levelData.title) + '">' + levelData.icon + '</span></div>' +
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
            '<div class="badge-toast-icon"><span role="img" aria-label="' + (badge.ariaLabel || badge.title) + '">' + badge.icon + '</span></div>' +
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
            '<span class="streak-fire" role="img" aria-label="fire">🔥</span>' +
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
      popup.innerHTML = '<span role="img" aria-label="sparkles">\u2728</span> Lucky +' + xp + ' XP! <span role="img" aria-label="sparkles">\u2728</span>';

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

    /* ── Spin the Wheel (topic completion bonus) ── */
    function showSpinWheel(topicId, onResult) {
        var segments = [
            { xp: 5, color: '#6366f1' },
            { xp: 10, color: '#22c55e' },
            { xp: 15, color: '#3b82f6' },
            { xp: 20, color: '#f59e0b' },
            { xp: 30, color: '#ec4899' },
            { xp: 50, color: '#ef4444' }
        ];
        var segAngle = 360 / segments.length;

        var overlay = document.createElement('div');
        overlay.className = 'wheel-overlay';

        // Build wheel segments using conic-gradient
        var gradientParts = [];
        for (var i = 0; i < segments.length; i++) {
            gradientParts.push(segments[i].color + ' ' + (i * segAngle) + 'deg ' + ((i + 1) * segAngle) + 'deg');
        }

        overlay.innerHTML =
            '<div class="wheel-container">' +
            '<p class="wheel-title">Spin for Bonus XP!</p>' +
            '<div class="wheel" style="position:relative">' +
            '<div class="wheel-pointer"></div>' +
            '<div class="wheel-inner" style="background:conic-gradient(' + gradientParts.join(',') + ');border-radius:50%;width:100%;height:100%;position:relative;">' +
            segments.map(function(seg, idx) {
                var angle = segAngle * idx + segAngle / 2;
                var rad = angle * Math.PI / 180;
                var x = 50 + 30 * Math.sin(rad);
                var y = 50 - 30 * Math.cos(rad);
                return '<span style="position:absolute;left:' + x + '%;top:' + y + '%;transform:translate(-50%,-50%);color:white;font-weight:800;font-size:0.8rem;text-shadow:0 1px 3px rgba(0,0,0,0.5)">+' + seg.xp + '</span>';
            }).join('') +
            '</div></div>' +
            '<button class="wheel-spin-btn" id="wheel-spin-btn">SPIN!</button>' +
            '<div class="wheel-result" id="wheel-result"></div>' +
            '</div>';

        document.body.appendChild(overlay);

        var inner = overlay.querySelector('.wheel-inner');
        var btn = document.getElementById('wheel-spin-btn');
        var result = document.getElementById('wheel-result');

        btn.addEventListener('click', function() {
            btn.disabled = true;
            // Pick random segment
            var winIdx = Math.floor(Math.random() * segments.length);
            // Calculate rotation: multiple full spins + land on winning segment
            var targetAngle = 360 * 5 + (360 - (segAngle * winIdx + segAngle / 2));
            inner.style.transform = 'rotate(' + targetAngle + 'deg)';

            setTimeout(function() {
                var won = segments[winIdx].xp;
                result.textContent = '+' + won + ' XP!';
                result.classList.add('visible');
                if (typeof onResult === 'function') onResult(won);
                confetti();

                // Auto-close after 3 seconds
                setTimeout(function() {
                    if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
                }, 3000);
            }, 4200);
        });
    }

    /* ── Loot Chest (weekly mission reward) ── */
    function showChestOpen(onResult) {
        var xpOptions = [20, 25, 30, 35, 40, 50, 60, 75, 100];
        var won = xpOptions[Math.floor(Math.random() * xpOptions.length)];

        var overlay = document.createElement('div');
        overlay.className = 'chest-overlay';
        overlay.innerHTML =
            '<div class="chest-container">' +
            '<div class="chest-icon" id="chest-icon" role="img" aria-label="treasure chest">\uD83C\uDF81</div>' +
            '<p class="chest-title">Weekly Chest!</p>' +
            '<div class="chest-result" id="chest-result" style="opacity:0"></div>' +
            '<button class="chest-close-btn" id="chest-close-btn" style="display:none">Brilliant!</button>' +
            '</div>';

        document.body.appendChild(overlay);

        // Open animation sequence
        setTimeout(function() {
            var icon = document.getElementById('chest-icon');
            icon.textContent = '\uD83D\uDCE6'; // open box
            icon.classList.add('opened');

            setTimeout(function() {
                document.getElementById('chest-result').textContent = '+' + won + ' XP!';
                document.getElementById('chest-result').style.opacity = '1';
                document.getElementById('chest-close-btn').style.display = 'inline-block';
                if (typeof onResult === 'function') onResult(won);
                confetti();
            }, 800);
        }, 600);

        // Close button
        overlay.addEventListener('click', function(e) {
            if (e.target.id === 'chest-close-btn' || e.target === overlay) {
                overlay.parentNode.removeChild(overlay);
            }
        });
    }

    return {
        showXP: showXP,
        confetti: confetti,
        showLevelUp: showLevelUp,
        showBadge: showBadge,
        showStreak: showStreak,
        showLuckyXP: showLuckyXP,
        celebrate: celebrate,
        showSpinWheel: showSpinWheel,
        showChestOpen: showChestOpen
    };

})();
