// data/daily-challenges.js
var DAILY_CHALLENGES = [
  {
    id: "daily-1",
    title: "Backwards Name",
    type: "make",
    instructions: "Write a program that stores your name in a variable and prints it backwards. For example, if name = \"Python\", print \"nohtyP\".",
    starterCode: "# Write your code here\n",
    expectedOutput: null,
    checkFn: "is_palindrome_output",
    hint: "Use slicing: name[::-1]"
  },
  {
    id: "daily-2",
    title: "Sum to 100",
    type: "predict",
    instructions: "What will this code print?",
    starterCode: "total = 0\nfor i in range(1, 101):\n    total = total + i\nprint(total)",
    expectedOutput: "5050",
    hint: "The range goes from 1 to 100 inclusive."
  },
  {
    id: "daily-3",
    title: "Star Triangle",
    type: "make",
    instructions: "Write a program that prints a triangle of stars with 5 rows:\n*\n**\n***\n****\n*****",
    starterCode: "# Write your code here\n",
    expectedOutput: "*\n**\n***\n****\n*****",
    hint: "Use a for loop with range(1, 6) and multiply '*' by the loop variable."
  },
  {
    id: "daily-4",
    title: "Even or Odd",
    type: "predict",
    instructions: "What will this code print?",
    starterCode: "for num in [3, 8, 15, 22, 7]:\n    if num % 2 == 0:\n        print(str(num) + \" is even\")\n    else:\n        print(str(num) + \" is odd\")",
    expectedOutput: "3 is odd\n8 is even\n15 is odd\n22 is even\n7 is odd",
    hint: "The % operator gives the remainder after division."
  },
  {
    id: "daily-5",
    title: "Word Counter",
    type: "make",
    instructions: "Write a program that counts how many words are in the sentence \"the quick brown fox jumps over the lazy dog\" and prints the count.",
    starterCode: "# Write your code here\n",
    expectedOutput: "9",
    hint: "Use .split() to break the string into a list of words, then use len()."
  },
  {
    id: "daily-6",
    title: "Mystery Output",
    type: "predict",
    instructions: "What will this code print?",
    starterCode: "x = 1\nfor i in range(4):\n    x = x * 2\nprint(x)",
    expectedOutput: "16",
    hint: "Track the value of x after each loop: 2, 4, 8, 16."
  },
  {
    id: "daily-7",
    title: "Vowel Counter",
    type: "make",
    instructions: "Write a program that counts the number of vowels (a, e, i, o, u) in the word \"programming\" and prints the count.",
    starterCode: "# Write your code here\n",
    expectedOutput: "3",
    hint: "Loop through each letter and check if it is in \"aeiou\"."
  },
  {
    id: "daily-8",
    title: "List Maximum",
    type: "predict",
    instructions: "What will this code print?",
    starterCode: "numbers = [4, 7, 2, 9, 1, 5]\nbiggest = numbers[0]\nfor n in numbers:\n    if n > biggest:\n        biggest = n\nprint(biggest)",
    expectedOutput: "9",
    hint: "The loop checks each number against the current biggest."
  },
  {
    id: "daily-9",
    title: "FizzBuzz Lite",
    type: "make",
    instructions: "Print the numbers 1 to 15. But for multiples of 3, print \"Fizz\" instead of the number. For multiples of 5, print \"Buzz\". For multiples of both, print \"FizzBuzz\".",
    starterCode: "# Write your code here\n",
    expectedOutput: "1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz",
    hint: "Check divisible by both 3 AND 5 first, then 3, then 5, then just print the number."
  },
  {
    id: "daily-10",
    title: "String Repeater",
    type: "predict",
    instructions: "What will this code print?",
    starterCode: "word = \"ab\"\nresult = \"\"\nfor i in range(3):\n    result = result + word\n    print(result)",
    expectedOutput: "ab\nabab\nababab",
    hint: "Each loop iteration adds \"ab\" to what we already have."
  },
  {
    id: "daily-11",
    title: "Temperature Converter",
    type: "make",
    instructions: "Write a program that converts 98.6 degrees Fahrenheit to Celsius and prints the result rounded to 1 decimal place. Formula: C = (F - 32) * 5/9",
    starterCode: "# Write your code here\n",
    expectedOutput: "37.0",
    hint: "Use round(value, 1) to round to 1 decimal place."
  },
  {
    id: "daily-12",
    title: "Countdown",
    type: "predict",
    instructions: "What will this code print?",
    starterCode: "for i in range(5, 0, -1):\n    print(i)\nprint(\"Go!\")",
    expectedOutput: "5\n4\n3\n2\n1\nGo!",
    hint: "range(5, 0, -1) counts down from 5 to 1."
  },
  {
    id: "daily-13",
    title: "Initials Maker",
    type: "make",
    instructions: "Write a program that takes the name \"Ada Lovelace\" and prints just the initials \"A.L.\"",
    starterCode: "# Write your code here\n",
    expectedOutput: "A.L.",
    hint: "Split the name by spaces, take the first character of each part."
  },
  {
    id: "daily-14",
    title: "Pattern Spotter",
    type: "predict",
    instructions: "What will this code print?",
    starterCode: "for i in range(1, 6):\n    print(str(i) + \" x \" + str(i) + \" = \" + str(i * i))",
    expectedOutput: "1 x 1 = 1\n2 x 2 = 4\n3 x 3 = 9\n4 x 4 = 16\n5 x 5 = 25",
    hint: "It prints the square of each number from 1 to 5."
  },
  {
    id: "daily-15",
    title: "Password Checker",
    type: "make",
    instructions: "Write a program that checks if the password \"Secure123\" is valid. A valid password must be at least 8 characters long and contain at least one digit. Print \"Valid\" or \"Invalid\".",
    starterCode: "# Write your code here\n",
    expectedOutput: "Valid",
    hint: "Use len() to check length. Loop through characters and check .isdigit()."
  },
  {
    id: "daily-16",
    title: "List Reversal",
    type: "predict",
    instructions: "What will this code print?",
    starterCode: "fruits = [\"apple\", \"banana\", \"cherry\"]\nfruits.reverse()\nfor f in fruits:\n    print(f)",
    expectedOutput: "cherry\nbanana\napple",
    hint: ".reverse() changes the list in place."
  },
  {
    id: "daily-17",
    title: "Number Guesser",
    type: "modify",
    instructions: "This program checks guesses against a secret number, but it only checks one guess. Modify it to check ALL the guesses in the list and print whether each is 'Too low', 'Too high', or 'Correct!'.",
    starterCode: "secret = 7\nguesses = [3, 9, 7]\n\n# Currently only checks the first guess\nguess = guesses[0]\nif guess < secret:\n    print(\"Too low\")\nelif guess > secret:\n    print(\"Too high\")\nelse:\n    print(\"Correct!\")",
    expectedOutput: "Too low\nToo high\nCorrect!",
    hint: "Replace the single guess line with a for loop over all guesses."
  },
  {
    id: "daily-18",
    title: "Dictionary Lookup",
    type: "predict",
    instructions: "What will this code print?",
    starterCode: "scores = {\"Alice\": 85, \"Bob\": 92, \"Charlie\": 78}\nfor name in scores:\n    if scores[name] >= 80:\n        print(name + \" passed\")",
    expectedOutput: "Alice passed\nBob passed",
    hint: "Only Alice (85) and Bob (92) have scores >= 80."
  },
  {
    id: "daily-19",
    title: "Average Calculator",
    type: "make",
    instructions: "Write a program that calculates the average of the numbers [12, 45, 78, 23, 56] and prints the result as a whole number (integer).",
    starterCode: "# Write your code here\n",
    expectedOutput: "42",
    hint: "Use sum() and len(), then convert to int() or use // for integer division."
  },
  {
    id: "daily-20",
    title: "String Slicing",
    type: "predict",
    instructions: "What will this code print?",
    starterCode: "message = \"Hello World\"\nprint(message[0:5])\nprint(message[6:])\nprint(message[-5:])",
    expectedOutput: "Hello\nWorld\nWorld",
    hint: "Slicing: [start:end] extracts characters. Negative indices count from the end."
  },
  {
    id: "daily-21",
    title: "Multiplication Table",
    type: "make",
    instructions: "Write a program that prints the 9 times table from 9 x 1 to 9 x 5 in the format: \"9 x 1 = 9\"",
    starterCode: "# Write your code here\n",
    expectedOutput: "9 x 1 = 9\n9 x 2 = 18\n9 x 3 = 27\n9 x 4 = 36\n9 x 5 = 45",
    hint: "Use a for loop with range(1, 6) and string concatenation."
  },
  {
    id: "daily-22",
    title: "Nested Loop",
    type: "predict",
    instructions: "What will this code print?",
    starterCode: "for i in range(3):\n    for j in range(2):\n        print(str(i) + \",\" + str(j))",
    expectedOutput: "0,0\n0,1\n1,0\n1,1\n2,0\n2,1",
    hint: "The inner loop runs fully for each iteration of the outer loop."
  },
  {
    id: "daily-23",
    title: "Unique Letters",
    type: "make",
    instructions: "Write a program that finds and prints the number of unique letters in the word \"mississippi\" (case-insensitive).",
    starterCode: "# Write your code here\n",
    expectedOutput: "4",
    hint: "Convert to a set to get unique characters, then use len()."
  },
  {
    id: "daily-24",
    title: "Boolean Logic",
    type: "predict",
    instructions: "What will this code print?",
    starterCode: "a = True\nb = False\nprint(a and b)\nprint(a or b)\nprint(not b)",
    expectedOutput: "False\nTrue\nTrue",
    hint: "AND needs both True. OR needs at least one True. NOT flips the value."
  },
  {
    id: "daily-25",
    title: "List Filtering",
    type: "make",
    instructions: "Write a program that takes the list [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] and prints only the even numbers, each on a new line.",
    starterCode: "# Write your code here\n",
    expectedOutput: "2\n4\n6\n8\n10",
    hint: "Loop through the list and use if num % 2 == 0 to check for even."
  },
  {
    id: "daily-26",
    title: "Function Call",
    type: "predict",
    instructions: "What will this code print?",
    starterCode: "def greet(name, times):\n    for i in range(times):\n        print(\"Hi \" + name)\n\ngreet(\"Sam\", 3)",
    expectedOutput: "Hi Sam\nHi Sam\nHi Sam",
    hint: "The function prints the greeting 'times' number of times."
  },
  {
    id: "daily-27",
    title: "Palindrome Check",
    type: "make",
    instructions: "Write a program that checks if the word \"racecar\" is a palindrome (reads the same forwards and backwards). Print \"Yes\" if it is, \"No\" if it isn't.",
    starterCode: "# Write your code here\n",
    expectedOutput: "Yes",
    hint: "Compare the word to its reverse using slicing [::-1]."
  },
  {
    id: "daily-28",
    title: "While Loop",
    type: "predict",
    instructions: "What will this code print?",
    starterCode: "n = 1\nwhile n < 20:\n    n = n * 3\nprint(n)",
    expectedOutput: "27",
    hint: "Track n: starts at 1, then 3, then 9, then 27 (which is >= 20, so loop stops)."
  },
  {
    id: "daily-29",
    title: "Character Frequency",
    type: "make",
    instructions: "Write a program that counts how many times the letter 'a' appears in \"banana\" and prints the count.",
    starterCode: "# Write your code here\n",
    expectedOutput: "3",
    hint: "Use .count('a') or loop through and count manually."
  },
  {
    id: "daily-30",
    title: "Swap Variables",
    type: "predict",
    instructions: "What will this code print?",
    starterCode: "a = 10\nb = 20\na, b = b, a\nprint(a)\nprint(b)",
    expectedOutput: "20\n10",
    hint: "Python allows swapping with a, b = b, a in one line."
  }
];
