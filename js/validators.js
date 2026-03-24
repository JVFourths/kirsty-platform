/**
 * Python Lab — Exercise Validators
 *
 * Named validation functions that replace the old `new Function()` eval pattern.
 * Each validator receives the trimmed Python output string and returns true/false.
 *
 * Validators should ensure output looks like real program output, not trivial
 * single-character or copy-pasted text.
 */

var VALIDATORS = {

    // ── Year 7: Hello, Python! ──
    // "Change the code so it prints YOUR name instead of 'Python'"
    "starts_with_hello_not_python": function (output) {
        return output.startsWith("Hello, my name is") && output !== "Hello, my name is Python!" && output.length > 20;
    },

    // "Write a program that prints three lines (name, colour, food)"
    "at_least_3_lines": function (output) {
        var lines = output.trim().split("\n");
        if (lines.length < 3) return false;
        // Each line must have at least 2 characters (not just whitespace or single chars)
        for (var i = 0; i < 3; i++) {
            if (lines[i].trim().length < 2) return false;
        }
        return true;
    },

    // ── Year 7: Variables ──
    // "Create variables for name, age, favourite number and print a sentence"
    "output_longer_than_10": function (output) {
        var trimmed = output.trim();
        // Must be real sentence output, not just random characters
        return trimmed.length > 10 && trimmed.indexOf(" ") !== -1;
    },

    // ── Year 7: Input & Output ──
    // "Asks for name and prints Hello, [name]!"
    "includes_hello_comma": function (output) {
        return output.includes("Hello,") && output.length > 7;
    },

    // "Asks for age and prints Next year you will be [age+1]"
    "includes_next_year": function (output) {
        return output.includes("Next year") && output.length > 15;
    },

    // "Asks for name and colour, prints [Name] likes [colour]!"
    "includes_likes": function (output) {
        return output.includes("likes") && output.length > 8;
    },

    // ── Year 8: Selection ──
    // "If answer is Paris, print Correct!, otherwise Wrong!"
    "includes_correct_or_wrong": function (output) {
        return (output.includes("Correct") || output.includes("Wrong")) && output.length > 5;
    },

    // ── Year 8: Loops ──
    // "Print the 7 times table from 7x1 to 7x12"
    "times_table_7": function (output) {
        return output.includes("7 x 1 = 7") && output.includes("7 x 12 = 84");
    },

    // ── GCSE: Validation ──
    // "Validates mark is between 0-100, then prints Mark accepted: [value]"
    "includes_mark_accepted": function (output) {
        return output.includes("Mark accepted") && output.length > 14;
    },

    // "Check password length and digits, print Strong/Weak password"
    "includes_password": function (output) {
        return output.includes("password") && output.length > 10;
    },

    // ── Daily Challenges ──
    // "Print your name backwards"
    "is_palindrome_output": function (output) {
        return output.length > 1 && output === output.split("").reverse().join("");
    }
};
