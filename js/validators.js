/**
 * Python Lab — Exercise Validators
 *
 * Named validation functions that replace the old `new Function()` eval pattern.
 * Each validator receives the trimmed Python output string and returns true/false.
 */

var VALIDATORS = {

    // ── Year 7: Hello, Python! ──
    "starts_with_hello_not_python": function (output) {
        return output.startsWith("Hello, my name is") && output !== "Hello, my name is Python!";
    },
    "at_least_3_lines": function (output) {
        return output.trim().split("\n").length >= 3;
    },

    // ── Year 7: Variables ──
    "output_longer_than_10": function (output) {
        return output.trim().length > 10;
    },

    // ── Year 7: Input & Output ──
    "includes_hello_comma": function (output) {
        return output.includes("Hello,");
    },
    "includes_next_year": function (output) {
        return output.includes("Next year");
    },
    "includes_likes": function (output) {
        return output.includes("likes");
    },

    // ── Year 8: Selection ──
    "includes_correct_or_wrong": function (output) {
        return output.includes("Correct") || output.includes("Wrong");
    },

    // ── Year 8: Loops ──
    "times_table_7": function (output) {
        return output.includes("7 x 1 = 7") && output.includes("7 x 12 = 84");
    },

    // ── GCSE: Validation ──
    "includes_mark_accepted": function (output) {
        return output.includes("Mark accepted");
    },
    "includes_password": function (output) {
        return output.includes("password");
    },

    // ── Daily Challenges ──
    "is_palindrome_output": function (output) {
        return output.length > 0 && output === output.split("").reverse().join("");
    }
};
