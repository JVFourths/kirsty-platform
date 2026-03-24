/**
 * Python Lab — Glossary Data
 *
 * Key term definitions per topic, shown in the glossary panel during exercises.
 */
var GLOSSARY = {
    "y7-hello": [
        { term: "print()", definition: "A function that displays text on the screen." },
        { term: "String", definition: "Text data enclosed in quotes, like \"hello\" or 'world'." },
        { term: "Syntax", definition: "The rules for how code must be written so Python can understand it." },
        { term: "Output", definition: "What your program displays on the screen when it runs." }
    ],
    "y7-variables": [
        { term: "Variable", definition: "A named container that stores a value, like name = \"Alex\"." },
        { term: "Assignment", definition: "Giving a variable a value using the = sign." },
        { term: "Integer (int)", definition: "A whole number without a decimal point, like 42." },
        { term: "String (str)", definition: "Text data enclosed in quotes." },
        { term: "f-string", definition: "A string starting with f that lets you insert variables: f\"Hello {name}\"." },
        { term: "str()", definition: "Converts a value to text so it can be joined with other text." }
    ],
    "y7-input": [
        { term: "input()", definition: "Asks the user to type something and returns it as text." },
        { term: "int()", definition: "Converts text to a whole number so you can do maths with it." },
        { term: "Concatenation", definition: "Joining strings together using the + operator." },
        { term: "Type conversion", definition: "Changing data from one type to another, like str(42) or int(\"7\")." }
    ],
    "y8-selection": [
        { term: "if", definition: "Checks a condition. Runs the indented code only if the condition is True." },
        { term: "elif", definition: "Short for 'else if' — checks another condition if the previous one was False." },
        { term: "else", definition: "Runs if none of the if/elif conditions were True." },
        { term: "Condition", definition: "An expression that evaluates to True or False, like age > 18." },
        { term: "Comparison operators", definition: "Symbols that compare values: == (equal), != (not equal), >, <, >=, <=." },
        { term: "Boolean", definition: "A data type with only two values: True or False." }
    ],
    "y8-loops": [
        { term: "for loop", definition: "Repeats code a set number of times, e.g. for i in range(5)." },
        { term: "while loop", definition: "Repeats code as long as a condition is True." },
        { term: "range()", definition: "Generates a sequence of numbers. range(5) gives 0, 1, 2, 3, 4." },
        { term: "Iteration", definition: "One pass through a loop. A loop with range(5) has 5 iterations." },
        { term: "Infinite loop", definition: "A loop that never ends because its condition is always True." },
        { term: "Loop variable", definition: "The variable that changes each iteration, like i in for i in range(5)." }
    ],
    "y9-functions": [
        { term: "Function", definition: "A reusable block of code defined with def that performs a specific task." },
        { term: "def", definition: "The keyword used to define (create) a new function." },
        { term: "Parameter", definition: "A variable in a function definition that receives a value when called." },
        { term: "Argument", definition: "The actual value passed to a function when you call it." },
        { term: "return", definition: "Sends a value back from a function to where it was called." },
        { term: "Calling a function", definition: "Running a function by writing its name followed by brackets: greet(\"Alex\")." }
    ],
    "y9-lists": [
        { term: "List", definition: "An ordered collection of items in square brackets: [1, 2, 3]." },
        { term: "Index", definition: "The position of an item in a list, starting from 0." },
        { term: "len()", definition: "Returns the number of items in a list or characters in a string." },
        { term: "append()", definition: "Adds an item to the end of a list." },
        { term: "Negative index", definition: "Counts from the end: list[-1] is the last item." },
        { term: "Slicing", definition: "Getting a portion of a list or string: list[1:3]." }
    ],
    "gcse-validation": [
        { term: "Validation", definition: "Checking that input data meets certain rules before using it." },
        { term: "Range check", definition: "Ensuring a value falls within an acceptable range (e.g. 0-100)." },
        { term: "Length check", definition: "Ensuring input has an acceptable number of characters." },
        { term: "Presence check", definition: "Ensuring a required field is not left empty." },
        { term: "Type check", definition: "Ensuring input is the correct data type (number, text, etc.)." },
        { term: "Authentication", definition: "Verifying a user's identity, usually with a username and password." }
    ],
    "gcse-filehandling": [
        { term: "open()", definition: "Opens a file for reading or writing. Use with 'with' for safety." },
        { term: "with", definition: "Automatically closes the file when the indented block finishes." },
        { term: "Read mode (\"r\")", definition: "Opens a file for reading only. The file must already exist." },
        { term: "Write mode (\"w\")", definition: "Opens a file for writing. Creates the file or overwrites existing content." },
        { term: "Append mode (\"a\")", definition: "Opens a file for writing at the end without erasing existing content." },
        { term: "strip()", definition: "Removes whitespace (spaces, newlines) from the start and end of a string." }
    ]
};
