/**
 * Python Lab — Exercise Data
 *
 * Each year group has topics, and each topic has exercises.
 * Exercise types:
 *   - "predict"     — Read code and predict the output (PRIMM: Predict)
 *   - "run"         — Run given code and observe (PRIMM: Run)
 *   - "investigate" — Answer questions about given code (PRIMM: Investigate)
 *   - "modify"      — Change existing code to do something new (PRIMM: Modify)
 *   - "make"        — Write code from scratch (PRIMM: Make)
 */

var EXERCISES = {

    "7": {
        label: "Year 7",
        colour: "emerald",
        topics: [
            {
                id: "y7-hello",
                title: "Hello, Python!",
                description: "Your very first Python programs — printing text to the screen.",
                icon: "wave",
                exercises: [
                    {
                        id: "y7-hello-1",
                        title: "What will it print?",
                        type: "predict",
                        instructions: "Look at this code carefully. What do you think it will print? Type your prediction in the output box, then run the code to check.",
                        starterCode: 'print("Hello, World!")',
                        expectedOutput: "Hello, World!",
                        hint: "The print() function displays whatever is inside the brackets on the screen."
                    },
                    {
                        id: "y7-hello-2",
                        title: "Run and observe",
                        type: "run",
                        instructions: "Press the Run button to see what this code does. Notice how each print() creates a new line.",
                        starterCode: 'print("My name is Python.")\nprint("I am a programming language.")\nprint("Nice to meet you!")',
                        expectedOutput: "My name is Python.\nI am a programming language.\nNice to meet you!",
                        hint: "Each print() statement outputs text on its own line."
                    },
                    {
                        id: "y7-hello-3",
                        title: "Change the message",
                        type: "modify",
                        instructions: "Change the code below so it prints YOUR name instead of 'Python'. For example: Hello, my name is Alex!",
                        starterCode: 'print("Hello, my name is Python!")',
                        expectedOutput: null,
                        checkFn: "output.startsWith('Hello, my name is') && output !== 'Hello, my name is Python!'",
                        hint: "Change the text inside the speech marks to include your own name."
                    },
                    {
                        id: "y7-hello-4",
                        title: "Write your own",
                        type: "make",
                        instructions: "Write a program that prints three lines:\n1. Your name\n2. Your favourite colour\n3. Your favourite food\n\nEach should be on a separate line.",
                        starterCode: "# Write your program below\n",
                        expectedOutput: null,
                        checkFn: "output.trim().split('\\n').length >= 3",
                        hint: "Use three separate print() statements, one for each line."
                    }
                ]
            },
            {
                id: "y7-variables",
                title: "Variables",
                description: "Storing information in your programs using variables.",
                icon: "box",
                exercises: [
                    {
                        id: "y7-var-1",
                        title: "What will it print?",
                        type: "predict",
                        instructions: "Look at this code. What value is stored in the variable, and what will be printed?",
                        starterCode: 'name = "Kirsty"\nprint(name)',
                        expectedOutput: "Kirsty",
                        hint: "A variable stores a value. When you print a variable, it shows the value inside it."
                    },
                    {
                        id: "y7-var-2",
                        title: "Numbers in variables",
                        type: "predict",
                        instructions: "Predict what this code will print. Pay attention to the maths!",
                        starterCode: 'age = 12\nnew_age = age + 1\nprint(new_age)',
                        expectedOutput: "13",
                        hint: "The variable age stores 12. Then new_age stores age + 1, which is 12 + 1 = 13."
                    },
                    {
                        id: "y7-var-3",
                        title: "Investigate variables",
                        type: "investigate",
                        instructions: "Run this code, then change the value of 'score' to 100 and run it again. What changes?",
                        starterCode: 'score = 50\nbonus = 10\ntotal = score + bonus\nprint("Your total score is:")\nprint(total)',
                        expectedOutput: "Your total score is:\n60",
                        hint: "When you change score to 100, the total becomes 100 + 10 = 110."
                    },
                    {
                        id: "y7-var-4",
                        title: "Fix the code",
                        type: "modify",
                        instructions: "This code has a bug! The programmer wanted to print 'I am 12 years old' but something is wrong. Fix it.",
                        starterCode: 'age = 12\nprint("I am " + age + " years old")',
                        expectedOutput: "I am 12 years old",
                        hint: "You can't join a number directly to text. Try using str(age) to convert the number to text, or use an f-string: f\"I am {age} years old\""
                    },
                    {
                        id: "y7-var-5",
                        title: "Create your own variables",
                        type: "make",
                        instructions: "Create variables for:\n- Your first name\n- Your age\n- Your favourite number\n\nThen print a sentence using all three variables.",
                        starterCode: "# Create your variables here\n\n# Print a sentence using them\n",
                        expectedOutput: null,
                        checkFn: "output.trim().length > 10",
                        hint: "Create variables like: name = \"Alex\" then use print() with f-strings or + to join them together."
                    }
                ]
            },
            {
                id: "y7-input",
                title: "Input & Output",
                description: "Making interactive programs that ask the user questions.",
                icon: "chat",
                exercises: [
                    {
                        id: "y7-input-1",
                        title: "What does input() do?",
                        type: "predict",
                        instructions: "Look at this code. What do you think will happen when it runs? (Note: in this environment, input() will use a popup box.)",
                        starterCode: 'name = input("What is your name? ")\nprint("Hello, " + name + "!")',
                        expectedOutput: null,
                        checkFn: "output.includes('Hello,')",
                        hint: "input() asks the user to type something. Whatever they type gets stored in the variable."
                    },
                    {
                        id: "y7-input-2",
                        title: "Numbers from input",
                        type: "investigate",
                        instructions: "Run this code and enter a number when asked. Then try entering text instead of a number — what happens?",
                        starterCode: 'age = input("How old are you? ")\nnext_year = int(age) + 1\nprint("Next year you will be " + str(next_year))',
                        expectedOutput: null,
                        checkFn: "output.includes('Next year')",
                        hint: "input() always gives you text. You need int() to convert it to a number for maths."
                    },
                    {
                        id: "y7-input-3",
                        title: "Build a greeting program",
                        type: "make",
                        instructions: "Write a program that:\n1. Asks the user for their name\n2. Asks the user for their favourite colour\n3. Prints: '[Name] likes [colour]!'\n\nFor example: Alex likes blue!",
                        starterCode: "# Ask for the user's name\n\n# Ask for their favourite colour\n\n# Print the result\n",
                        expectedOutput: null,
                        checkFn: "output.includes('likes')",
                        hint: "Use input() twice to get two pieces of information, store them in variables, then print them together."
                    }
                ]
            }
        ]
    },

    "8": {
        label: "Year 8",
        colour: "blue",
        topics: [
            {
                id: "y8-selection",
                title: "Selection (if/elif/else)",
                description: "Making decisions in your programs using conditions.",
                icon: "fork",
                exercises: [
                    {
                        id: "y8-sel-1",
                        title: "Predict the output",
                        type: "predict",
                        instructions: "What will this code print? Think about whether the condition is true or false.",
                        starterCode: 'temperature = 30\n\nif temperature > 25:\n    print("It is hot today!")\nelse:\n    print("It is not hot today.")',
                        expectedOutput: "It is hot today!",
                        hint: "30 is greater than 25, so the condition temperature > 25 is True."
                    },
                    {
                        id: "y8-sel-2",
                        title: "Multiple conditions",
                        type: "predict",
                        instructions: "This code uses elif (else if) to check multiple conditions. Predict the output.",
                        starterCode: 'score = 72\n\nif score >= 90:\n    print("Grade: A*")\nelif score >= 70:\n    print("Grade: A")\nelif score >= 60:\n    print("Grade: B")\nelse:\n    print("Grade: C or below")',
                        expectedOutput: "Grade: A",
                        hint: "Python checks conditions in order. 72 is not >= 90, but it IS >= 70, so it prints Grade: A."
                    },
                    {
                        id: "y8-sel-3",
                        title: "Fix the grade calculator",
                        type: "modify",
                        instructions: "This grade calculator has the conditions in the wrong order. Fix it so it gives the correct grade. Test with score = 95 (should be A*) and score = 45 (should be C or below).",
                        starterCode: 'score = 95\n\nif score >= 60:\n    print("Grade: B")\nelif score >= 70:\n    print("Grade: A")\nelif score >= 90:\n    print("Grade: A*")\nelse:\n    print("Grade: C or below")',
                        expectedOutput: "Grade: A*",
                        hint: "Check the highest grade first! If you check score >= 60 first, a score of 95 will match that and never reach the A* check."
                    },
                    {
                        id: "y8-sel-4",
                        title: "Build a quiz question",
                        type: "make",
                        instructions: "Write a program that:\n1. Asks 'What is the capital of France?'\n2. If the answer is 'Paris', print 'Correct!'\n3. Otherwise, print 'Wrong! The answer is Paris.'",
                        starterCode: "# Ask the question\n\n# Check the answer\n",
                        expectedOutput: null,
                        checkFn: "output.includes('Correct') || output.includes('Wrong')",
                        hint: "Use input() to get the answer, then use if/else to check if it equals 'Paris'."
                    }
                ]
            },
            {
                id: "y8-loops",
                title: "Loops (for & while)",
                description: "Repeating actions with for loops and while loops.",
                icon: "repeat",
                exercises: [
                    {
                        id: "y8-loop-1",
                        title: "Predict the loop",
                        type: "predict",
                        instructions: "How many times will this loop run? What numbers will it print?",
                        starterCode: 'for i in range(5):\n    print(i)',
                        expectedOutput: "0\n1\n2\n3\n4",
                        hint: "range(5) produces the numbers 0, 1, 2, 3, 4. That's 5 numbers, starting from 0."
                    },
                    {
                        id: "y8-loop-2",
                        title: "Countdown timer",
                        type: "modify",
                        instructions: "Change this code so it counts DOWN from 10 to 1, then prints 'Blast off!'",
                        starterCode: 'for i in range(1, 11):\n    print(i)\nprint("Blast off!")',
                        expectedOutput: "10\n9\n8\n7\n6\n5\n4\n3\n2\n1\nBlast off!",
                        hint: "Use range(10, 0, -1) to count backwards. The -1 is the step — it means 'go down by 1 each time'."
                    },
                    {
                        id: "y8-loop-3",
                        title: "Times tables",
                        type: "make",
                        instructions: "Write a program that prints the 7 times table from 7 x 1 up to 7 x 12.\n\nOutput should look like:\n7 x 1 = 7\n7 x 2 = 14\n...and so on.",
                        starterCode: "# Print the 7 times table\n",
                        expectedOutput: null,
                        checkFn: "output.includes('7 x 1 = 7') && output.includes('7 x 12 = 84')",
                        hint: "Use a for loop: for i in range(1, 13) and print(f\"7 x {i} = {7 * i}\")"
                    }
                ]
            }
        ]
    },

    "9": {
        label: "Year 9",
        colour: "violet",
        topics: [
            {
                id: "y9-functions",
                title: "Functions",
                description: "Organising code into reusable blocks with def.",
                icon: "puzzle",
                exercises: [
                    {
                        id: "y9-fn-1",
                        title: "Predict the function",
                        type: "predict",
                        instructions: "What will this code print? Pay attention to when the function is called.",
                        starterCode: 'def greet(name):\n    return "Hello, " + name + "!"\n\nmessage = greet("Kirsty")\nprint(message)',
                        expectedOutput: "Hello, Kirsty!",
                        hint: "The function greet takes a name and returns a greeting string. It's called with 'Kirsty'."
                    },
                    {
                        id: "y9-fn-2",
                        title: "Write a function",
                        type: "make",
                        instructions: "Write a function called 'area_of_rectangle' that takes width and height as parameters and returns the area. Then call it with width=5 and height=3 and print the result.",
                        starterCode: "# Define your function here\n\n# Call it and print the result\n",
                        expectedOutput: "15",
                        hint: "def area_of_rectangle(width, height): then return width * height"
                    }
                ]
            },
            {
                id: "y9-lists",
                title: "Lists & Arrays",
                description: "Working with collections of data.",
                icon: "list",
                exercises: [
                    {
                        id: "y9-list-1",
                        title: "Predict list operations",
                        type: "predict",
                        instructions: "What will each print statement output?",
                        starterCode: 'fruits = ["apple", "banana", "cherry"]\nprint(fruits[0])\nprint(fruits[-1])\nprint(len(fruits))',
                        expectedOutput: "apple\ncherry\n3",
                        hint: "Index 0 is the first item, index -1 is the last item, and len() gives the total count."
                    },
                    {
                        id: "y9-list-2",
                        title: "Find the highest score",
                        type: "make",
                        instructions: "Write a program that has a list of 5 test scores, then finds and prints the highest score. Don't use the built-in max() function — use a loop instead.",
                        starterCode: 'scores = [67, 89, 45, 92, 73]\n\n# Find the highest score using a loop\n',
                        expectedOutput: "92",
                        hint: "Set highest = scores[0], then loop through each score — if it's bigger than highest, update highest."
                    }
                ]
            }
        ]
    },

    "gcse": {
        label: "GCSE",
        colour: "amber",
        topics: [
            {
                id: "gcse-validation",
                title: "Input Validation",
                description: "Making programs robust with range, type, and presence checks. (AQA 3.2.7)",
                icon: "shield",
                exercises: [
                    {
                        id: "gcse-val-1",
                        title: "Range check",
                        type: "predict",
                        instructions: "This code validates that a mark is between 0 and 100. Predict what happens if you enter 150.",
                        starterCode: 'mark = int(input("Enter a mark (0-100): "))\n\nwhile mark < 0 or mark > 100:\n    print("Invalid! Must be between 0 and 100.")\n    mark = int(input("Enter a mark (0-100): "))\n\nprint("Mark accepted:", mark)',
                        expectedOutput: null,
                        checkFn: "output.includes('Mark accepted')",
                        hint: "If you enter 150, the while condition (150 < 0 or 150 > 100) is True, so it asks again."
                    },
                    {
                        id: "gcse-val-2",
                        title: "Build a password checker",
                        type: "make",
                        instructions: "Write a program that:\n1. Asks for a password\n2. Checks it is at least 8 characters long\n3. Checks it contains at least one number\n4. Prints 'Strong password' or 'Weak password'\n\n(AQA spec ref: 3.2.7 — Input validation & authentication)",
                        starterCode: "# Get the password\n\n# Check length and if it contains a number\n\n# Print the result\n",
                        expectedOutput: null,
                        checkFn: "output.includes('password')",
                        hint: "Use len() for length. To check for a number, loop through each character and use .isdigit()"
                    }
                ]
            },
            {
                id: "gcse-filehandling",
                title: "File Handling",
                description: "Reading from and writing to text files. (AQA 3.2.6)",
                icon: "file",
                exercises: [
                    {
                        id: "gcse-file-1",
                        title: "Predict file operations",
                        type: "predict",
                        instructions: "This code writes to a file then reads it back. Predict the output. (Note: file operations are simulated in this environment.)",
                        starterCode: '# Writing to a file\nwith open("scores.txt", "w") as f:\n    f.write("Alice,85\\n")\n    f.write("Bob,92\\n")\n\n# Reading from the file\nwith open("scores.txt", "r") as f:\n    for line in f:\n        print(line.strip())',
                        expectedOutput: "Alice,85\nBob,92",
                        hint: "The code writes two lines, then reads and prints each line. strip() removes the extra newline."
                    }
                ]
            }
        ]
    }
};
