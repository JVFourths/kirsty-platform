/**
 * Python Lab — Firebase Sync + Magic Link Authentication
 *
 * Uses Firebase Authentication (email link / magic link) for passwordless
 * student sign-in, and Firestore for progress tracking.
 *
 * HOW IT WORKS:
 * 1. Student enters their school email + class code
 * 2. Firebase sends a magic link to their email
 * 3. Student clicks the link → signs in automatically
 * 4. Progress is synced to Firestore under their verified email
 *
 * SETUP: Replace the firebaseConfig object below with your own
 * Firebase project config from console.firebase.google.com
 *
 * FIREBASE SETUP STEPS:
 * 1. Go to Firebase Console → Authentication → Sign-in method
 * 2. Enable "Email/Password" provider
 * 3. Under Email/Password, also enable "Email link (passwordless sign-in)"
 * 4. Go to Authentication → Settings → Authorized domains
 * 5. Add your Cloudflare Pages domain (e.g. python-lab.pages.dev)
 */

var FirebaseSync = (function () {

    /* ═══════════════════════════════════════════
       FIREBASE CONFIGURATION
       Replace this with your own config from:
       Firebase Console → Project Settings → Your apps → Web app
       ═══════════════════════════════════════════ */
    var firebaseConfig = {
        apiKey: "AIzaSyCJ72OVEz5QUlrlxRycQqovQFGb3LZz0Bo",
        authDomain: "kirstlab.firebaseapp.com",
        projectId: "kirstlab",
        storageBucket: "kirstlab.firebasestorage.app",
        messagingSenderId: "116970250286",
        appId: "1:116970250286:web:1a549e220f3c18f99b7fbf"
    };

    /* ═══════════════════════════════════════════
       MAGIC LINK SETTINGS
       Update SITE_URL to your deployed Cloudflare Pages URL
       ═══════════════════════════════════════════ */
    var SITE_URL = window.location.origin || "https://jkmv.co.uk";

    var db = null;
    var auth = null;
    var _enabled = false;
    var _currentUser = null;

    var STUDENT_KEY = "pythonlab_student";
    var PENDING_EMAIL_KEY = "pythonlab_pending_email";
    var PENDING_CLASS_KEY = "pythonlab_pending_class";

    /* ── Initialise Firebase ── */
    function init() {
        try {
            // Check if config has been set up
            if (firebaseConfig.apiKey === "YOUR_API_KEY") {
                console.log("Python Lab: Firebase not configured — running in local-only mode.");
                return false;
            }

            // Check if Firebase SDK is loaded
            if (typeof firebase === "undefined") {
                console.log("Python Lab: Firebase SDK not loaded — running in local-only mode.");
                return false;
            }

            // Initialise Firebase
            if (!firebase.apps.length) {
                firebase.initializeApp(firebaseConfig);
            }
            db = firebase.firestore();
            auth = firebase.auth();
            _enabled = true;

            // Listen for auth state changes
            auth.onAuthStateChanged(function (user) {
                if (user) {
                    _currentUser = user;
                    console.log("Python Lab: Signed in as", user.email);
                    // Update local student data
                    _updateStudentFromAuth(user);
                } else {
                    _currentUser = null;
                    console.log("Python Lab: Not signed in.");
                }
            });

            console.log("Python Lab: Firebase connected.");
            return true;
        } catch (e) {
            console.warn("Python Lab: Firebase init failed —", e.message);
            return false;
        }
    }

    /* ── Magic Link: Send sign-in email ── */

    /**
     * Send a magic link email to the student.
     * @param {string} email - Student's school email
     * @param {string} classCode - Teacher's class code
     * @returns {Promise<boolean>}
     */
    function sendMagicLink(email, classCode) {
        if (!_enabled || !auth) {
            return Promise.reject(new Error("Firebase not configured"));
        }

        email = (email || "").trim().toLowerCase();
        classCode = (classCode || "").trim().toUpperCase();

        if (!email || !classCode) {
            return Promise.reject(new Error("Email and class code are required"));
        }

        var actionCodeSettings = {
            // URL to redirect back to after clicking the link
            url: SITE_URL + "/#magic-callback",
            handleCodeInApp: true
        };

        // Add a timeout wrapper around Firebase call using Promise.race()
        // If Firebase doesn't respond in 6 seconds, fail and let fallback auth handle it
        var timeoutPromise = new Promise(function(_, reject) {
            setTimeout(function() {
                console.warn("Python Lab: Magic link send timed out (Firebase not responding after 6 seconds)");
                reject(new Error("Magic link service is not responding. Using simple authentication instead."));
            }, 6000);
        });

        return Promise.race([
            auth.sendSignInLinkToEmail(email, actionCodeSettings)
                .then(function () {
                    // Save the email & class code locally so we can complete sign-in
                    // when the student clicks the link and returns to the app
                    try {
                        localStorage.setItem(PENDING_EMAIL_KEY, email);
                        localStorage.setItem(PENDING_CLASS_KEY, classCode);
                    } catch (e) {}

                    console.log("Python Lab: Magic link sent to", email);
                    return true;
                }),
            timeoutPromise
        ]);
    }

    /**
     * Complete sign-in when the student arrives via a magic link.
     * Call this on page load to check if the current URL is a magic link callback.
     * @returns {Promise<object|null>} - The signed-in user or null
     */
    function completeMagicLinkSignIn() {
        if (!_enabled || !auth) return Promise.resolve(null);

        // Check if this URL is a sign-in link
        if (!auth.isSignInWithEmailLink(window.location.href)) {
            return Promise.resolve(null);
        }

        // Get the email that was saved when we sent the link
        var email = null;
        try {
            email = localStorage.getItem(PENDING_EMAIL_KEY);
        } catch (e) {}

        if (!email) {
            // If the student is on a different device/browser, ask for email
            email = prompt("Please enter your school email to confirm sign-in:");
            if (!email) return Promise.resolve(null);
        }

        return auth.signInWithEmailLink(email, window.location.href)
            .then(function (result) {
                var user = result.user;
                _currentUser = user;

                // Get the class code that was saved
                var classCode = "";
                try {
                    classCode = localStorage.getItem(PENDING_CLASS_KEY) || "";
                    // Clean up pending data
                    localStorage.removeItem(PENDING_EMAIL_KEY);
                    localStorage.removeItem(PENDING_CLASS_KEY);
                } catch (e) {}

                // Save student identity
                var student = {
                    id: user.uid,
                    email: user.email,
                    nickname: _extractName(user.email),
                    classCode: classCode,
                    createdAt: new Date().toISOString()
                };

                // Check if student already exists in Firestore (returning student)
                return db.collection("students").doc(user.uid).get()
                    .then(function (doc) {
                        if (doc.exists) {
                            // Returning student — keep their existing data
                            var existing = doc.data();
                            student.nickname = existing.nickname || student.nickname;
                            student.classCode = existing.classCode || student.classCode;
                        }
                        saveStudent(student);

                        // Set nickname in gamification
                        if (typeof Gamification !== "undefined") {
                            Gamification.setNickname(student.nickname);
                        }

                        // Sync progress
                        syncProgress();

                        // Clean up the URL (remove the magic link params)
                        if (window.history && window.history.replaceState) {
                            window.history.replaceState({}, document.title, SITE_URL);
                        }

                        return user;
                    });
            })
            .catch(function (err) {
                console.warn("Python Lab: Magic link sign-in failed —", err.message);
                return null;
            });
    }

    /**
     * Extract a display name from a school email.
     * e.g. "alex.smith@school.ac.uk" → "Alex Smith"
     */
    function _extractName(email) {
        if (!email) return "Student";
        var local = email.split("@")[0];
        // Replace dots, underscores, hyphens with spaces
        var parts = local.replace(/[._-]/g, " ").split(" ");
        var name = "";
        for (var i = 0; i < parts.length; i++) {
            if (parts[i].length > 0) {
                // Filter out pure numbers (like student IDs)
                if (/^\d+$/.test(parts[i])) continue;
                name += parts[i].charAt(0).toUpperCase() + parts[i].slice(1).toLowerCase() + " ";
            }
        }
        return name.trim() || "Student";
    }

    /**
     * Update local student data from Firebase Auth user.
     */
    function _updateStudentFromAuth(user) {
        var student = getStudent();
        if (student && student.id === user.uid) return; // Already up to date

        // If we have a student but with old ID format, migrate
        if (!student) {
            student = {
                id: user.uid,
                email: user.email,
                nickname: _extractName(user.email),
                classCode: "",
                createdAt: new Date().toISOString()
            };
        } else {
            student.id = user.uid;
            student.email = user.email;
        }

        saveStudent(student);
    }

    /* ── Student Identity ── */
    function getStudent() {
        try {
            var raw = localStorage.getItem(STUDENT_KEY);
            return raw ? JSON.parse(raw) : null;
        } catch (e) {
            return null;
        }
    }

    function saveStudent(data) {
        try {
            localStorage.setItem(STUDENT_KEY, JSON.stringify(data));
        } catch (e) {}
    }

    function isLoggedIn() {
        // Check Firebase Auth state first
        if (_currentUser) return true;
        // Fall back to localStorage
        var student = getStudent();
        return student && student.email;
    }

    /**
     * Legacy login (nickname + class code, no auth).
     * Still works for offline/unconfigured mode.
     */
    function login(nickname, classCode) {
        nickname = (nickname || "").trim().slice(0, 20);
        classCode = (classCode || "").trim().toUpperCase().slice(0, 10);

        if (!nickname || !classCode) return false;

        var student = getStudent();
        if (!student || student.nickname !== nickname || student.classCode !== classCode) {
            student = {
                id: classCode + "_" + nickname.toLowerCase().replace(/[^a-z0-9]/g, "") + "_" + Date.now().toString(36),
                nickname: nickname,
                classCode: classCode,
                createdAt: new Date().toISOString()
            };
        }

        saveStudent(student);

        if (typeof Gamification !== "undefined") {
            Gamification.setNickname(nickname);
        }

        syncProgress();
        return true;
    }

    function logout() {
        localStorage.removeItem(STUDENT_KEY);
        localStorage.removeItem(PENDING_EMAIL_KEY);
        localStorage.removeItem(PENDING_CLASS_KEY);
        _currentUser = null;

        if (_enabled && auth) {
            auth.signOut().catch(function () {});
        }
    }

    /* ── Progress Sync ── */

    function syncProgress() {
        if (!_enabled || !db) return;

        var student = getStudent();
        if (!student) return;

        var profile = typeof Gamification !== "undefined"
            ? Gamification.getProfile()
            : null;

        if (!profile) return;

        var docData = {
            nickname: student.nickname,
            email: student.email || "",
            classCode: student.classCode || "",
            totalXP: profile.totalXP,
            level: profile.level.level,
            levelTitle: profile.level.title,
            currentStreak: profile.currentStreak,
            longestStreak: profile.longestStreak,
            totalExercises: profile.totalExercises,
            earnedBadges: Object.keys(profile.earnedBadges),
            completedExerciseIds: Object.keys(profile.completedExercises),
            weeklyXP: profile.weeklyXP || 0,
            weekStartDate: profile.weekStartDate || "",
            lastSynced: firebase.firestore.FieldValue.serverTimestamp(),
            updatedAt: new Date().toISOString()
        };

        db.collection("students").doc(student.id).set(docData, { merge: true })
            .then(function () {
                console.log("Python Lab: Progress synced.");
            })
            .catch(function (err) {
                console.warn("Python Lab: Sync failed —", err.message);
            });
    }

    /**
     * Update the student's class code (e.g. if they entered it after sign-in).
     */
    function updateClassCode(classCode) {
        classCode = (classCode || "").trim().toUpperCase();
        var student = getStudent();
        if (student) {
            student.classCode = classCode;
            saveStudent(student);
            syncProgress();
        }
    }

    /**
     * Get all students for a given class code (for teacher dashboard).
     */
    function getClassStudents(classCode) {
        if (!_enabled || !db) {
            return Promise.resolve([]);
        }
        return db.collection("students")
            .where("classCode", "==", classCode.toUpperCase())
            .orderBy("totalXP", "desc")
            .get()
            .then(function (snapshot) {
                var students = [];
                snapshot.forEach(function (doc) {
                    students.push(doc.data());
                });
                return students;
            })
            .catch(function (err) {
                console.warn("Python Lab: Failed to fetch class data —", err.message);
                return [];
            });
    }

    /**
     * Get all class codes that have students.
     */
    function getAllClasses() {
        if (!_enabled || !db) return Promise.resolve([]);
        return db.collection("students")
            .get()
            .then(function (snapshot) {
                var codes = {};
                snapshot.forEach(function (doc) {
                    var data = doc.data();
                    if (data.classCode) {
                        if (!codes[data.classCode]) {
                            codes[data.classCode] = { code: data.classCode, count: 0 };
                        }
                        codes[data.classCode].count++;
                    }
                });
                return Object.values(codes);
            });
    }

    /* ── Real-time listener for class students ── */

    /**
     * Subscribe to real-time updates for a class.
     * @param {string} classCode
     * @param {function} callback - Called with array of students on each change
     * @returns {function} Unsubscribe function
     */
    function onClassStudents(classCode, callback) {
        if (!_enabled || !db) {
            callback([]);
            return function () {};
        }
        return db.collection("students")
            .where("classCode", "==", classCode.toUpperCase())
            .orderBy("totalXP", "desc")
            .onSnapshot(function (snapshot) {
                var students = [];
                snapshot.forEach(function (doc) {
                    var data = doc.data();
                    data._id = doc.id;
                    students.push(data);
                });
                callback(students);
            }, function (err) {
                console.warn("Python Lab: Listener error —", err.message);
                callback([]);
            });
    }

    /* ── Class code management ── */

    /**
     * Create a new managed class code.
     */
    function createClassCode(code, label) {
        if (!_enabled || !db) return Promise.reject(new Error("Firebase not configured"));
        code = (code || "").trim().toUpperCase();
        if (!code) return Promise.reject(new Error("Code is required"));
        return db.collection("classes").doc(code).set({
            code: code,
            label: label || code,
            createdAt: new Date().toISOString()
        }, { merge: true });
    }

    /**
     * Delete a managed class code.
     */
    function deleteClassCode(code) {
        if (!_enabled || !db) return Promise.reject(new Error("Firebase not configured"));
        return db.collection("classes").doc(code).delete();
    }

    /**
     * Get all managed class codes.
     */
    function getManagedClasses() {
        if (!_enabled || !db) return Promise.resolve([]);
        return db.collection("classes").get().then(function (snapshot) {
            var classes = [];
            snapshot.forEach(function (doc) { classes.push(doc.data()); });
            return classes;
        });
    }

    /* ── Assignments / Goals ── */

    /**
     * Save an assignment/goal for a class.
     */
    function saveAssignment(assignment) {
        if (!_enabled || !db) return Promise.reject(new Error("Firebase not configured"));
        var id = assignment.id || (assignment.classCode + "_" + Date.now().toString(36));
        assignment.id = id;
        return db.collection("assignments").doc(id).set(assignment, { merge: true });
    }

    /**
     * Delete an assignment.
     */
    function deleteAssignment(id) {
        if (!_enabled || !db) return Promise.reject(new Error("Firebase not configured"));
        return db.collection("assignments").doc(id).delete();
    }

    /**
     * Get assignments for a class code.
     */
    function getAssignments(classCode) {
        if (!_enabled || !db) return Promise.resolve([]);
        return db.collection("assignments")
            .where("classCode", "==", classCode.toUpperCase())
            .get()
            .then(function (snapshot) {
                var assignments = [];
                snapshot.forEach(function (doc) { assignments.push(doc.data()); });
                return assignments;
            });
    }

    /* ── Double XP ── */
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

    /* ── Topic Unlock Override ── */
    function setTopicUnlockOverride(classCode, override) {
        if (!_enabled || !db) return Promise.resolve();
        return db.collection("classes").doc(classCode).update({ topicUnlockOverride: override });
    }

    function setStudentTopicUnlockOverride(studentId, override) {
        if (!_enabled || !db) return Promise.resolve();
        return db.collection("students").doc(studentId).update({ topicUnlockOverride: override });
    }

    /* ── Feed ── */

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

    /* ── Class Goals ── */

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

    /* ── Leaderboard & Class Settings ── */

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

    /* ── Export ── */
    return {
        init: init,
        sendMagicLink: sendMagicLink,
        completeMagicLinkSignIn: completeMagicLinkSignIn,
        getStudent: getStudent,
        isLoggedIn: isLoggedIn,
        login: login,
        logout: logout,
        updateClassCode: updateClassCode,
        syncProgress: syncProgress,
        getClassStudents: getClassStudents,
        getAllClasses: getAllClasses,
        onClassStudents: onClassStudents,
        createClassCode: createClassCode,
        deleteClassCode: deleteClassCode,
        getManagedClasses: getManagedClasses,
        saveAssignment: saveAssignment,
        deleteAssignment: deleteAssignment,
        getAssignments: getAssignments,
        setDoubleXP: setDoubleXP,
        getDoubleXPStatus: getDoubleXPStatus,
        setTopicUnlockOverride: setTopicUnlockOverride,
        setStudentTopicUnlockOverride: setStudentTopicUnlockOverride,
        writeFeedEntry: writeFeedEntry,
        getFeed: getFeed,
        setClassGoal: setClassGoal,
        incrementClassGoal: incrementClassGoal,
        getClassGoal: getClassGoal,
        clearClassGoal: clearClassGoal,
        getClassSettings: getClassSettings,
        updateClassSettings: updateClassSettings,
        getLeaderboard: getLeaderboard,
        get enabled() { return _enabled; },
        get currentUser() { return _currentUser; },
        get db() { return db; }
    };

})();

// Auto-init on load
document.addEventListener("DOMContentLoaded", function () {
    FirebaseSync.init();
});
