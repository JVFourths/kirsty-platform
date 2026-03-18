var CHALLENGES = [
  {
    id: "ctf-caesar-1",
    title: "Caesar's Secret",
    tier: "script-kiddie",
    type: "python",
    instructions: "This message was encoded by shifting each letter forward by 3 positions in the alphabet. Write Python to decode it and print the result.\n\nEncoded message: KHOOR ZRUOG",
    starterCode: "# Decode the Caesar cipher\nencoded = 'KHOOR ZRUOG'\n\n# Shift each letter back by 3\n",
    expectedOutput: "HELLO WORLD",
    expectedAnswer: null,
    hint: "Loop through each character. If it's a letter, subtract 3 from its ASCII value using ord() and chr().",
    xp: 15
  },
  {
    id: "ctf-base64-1",
    title: "Base64 Basics",
    tier: "script-kiddie",
    type: "python",
    instructions: "This string is encoded in base64: UHl0aG9uIExhYg==\n\nUse Python's base64 module to decode it and print the result.",
    starterCode: "import base64\n\nencoded = 'UHl0aG9uIExhYg=='\n\n# Decode and print\n",
    expectedOutput: "Python Lab",
    expectedAnswer: null,
    hint: "Use base64.b64decode(encoded).decode('utf-8') to decode and convert bytes to string.",
    xp: 15
  },
  {
    id: "ctf-page-inspector",
    title: "Page Inspector",
    tier: "script-kiddie",
    type: "discovery",
    instructions: "Every web page has a <title> tag in its HTML source code. Your mission: find the exact title of the Python Lab login page.\n\nHint: open the login page and view its source code (right-click > View Page Source).",
    starterCode: null,
    expectedOutput: null,
    expectedAnswer: "join \u2014 python lab",
    hint: "Look for <title>...</title> near the top of the HTML source.",
    xp: 15
  },
  {
    id: "ctf-reverse-1",
    title: "Reverse Engineer",
    tier: "hacker",
    type: "python",
    instructions: "A secret program produced this output:\n\n1: *\n2: **\n3: ***\n4: ****\n5: *****\n\nWrite a program that produces exactly this output.",
    starterCode: "# Reproduce the exact output above\n",
    expectedOutput: "1: *\n2: **\n3: ***\n4: ****\n5: *****",
    expectedAnswer: null,
    hint: "Use a for loop with range(1, 6). Multiply '*' by the loop number. Use str() to convert the number.",
    xp: 25
  },
  {
    id: "ctf-hex-1",
    title: "Hex Decoder",
    tier: "hacker",
    type: "python",
    instructions: "This secret message is encoded in hexadecimal:\n\n48 65 6C 6C 6F\n\nEach pair of hex digits represents one character's ASCII code. Write Python to convert each hex value to a character and print the message.",
    starterCode: "# Decode the hex message\nhex_values = '48 65 6C 6C 6F'\n\n# Convert and print\n",
    expectedOutput: "Hello",
    expectedAnswer: null,
    hint: "Split the string by spaces, use int(h, 16) to convert hex to a number, then chr() to get the character.",
    xp: 25
  },
  {
    id: "ctf-cookie-monster",
    title: "Cookie Monster",
    tier: "hacker",
    type: "discovery",
    instructions: "Websites store data in your browser using something called localStorage. Open the browser console on Python Lab (F12 > Console) and look at what's stored.\n\nWhat is the name of the localStorage key that stores your game progress (XP, streaks, badges)?",
    starterCode: null,
    expectedOutput: null,
    expectedAnswer: "pythonlab_game",
    hint: "Type localStorage in the console to see all stored keys. Look for one related to your game data.",
    xp: 25
  },
  {
    id: "ctf-cipher-chain",
    title: "Cipher Chain",
    tier: "elite",
    type: "python",
    instructions: "This message was encrypted in 3 steps:\n1. The original text was reversed\n2. Then each letter was shifted forward by 5 (Caesar cipher)\n3. Then the result was encoded in base64\n\nThe final encoded string is: YnFxdXkgcnF3bnNm\n\nWrite Python to undo all three steps (decode base64, shift back by 5, reverse) and print the original message.",
    starterCode: "import base64\n\nencoded = 'YnFxdXkgcnF3bnNm'\n\n# Step 1: Decode base64\n# Step 2: Shift each letter back by 5\n# Step 3: Reverse the string\n",
    expectedOutput: "hacker mode",
    expectedAnswer: null,
    hint: "Do the steps in reverse order: base64.b64decode first, then subtract 5 from each letter's ASCII value, then reverse with [::-1].",
    xp: 50
  },
  {
    id: "ctf-pattern-1",
    title: "Pattern Cracker",
    tier: "elite",
    type: "python",
    instructions: "A password generator produced these outputs:\n\nPW1: a1b2\nPW2: c3d4\nPW3: e5f6\nPW4: g7h8\nPW5: i9j0\n\nFigure out the pattern and write a program that prints the NEXT 3 passwords (PW6, PW7, PW8), each on a new line.",
    starterCode: "# Figure out the pattern and predict the next 3\n",
    expectedOutput: "k1l2\nm3n4\no5p6",
    expectedAnswer: null,
    hint: "Letters advance by 2 each time (a,c,e,g,i,k,m,o). Digits cycle through pairs: 1-2, 3-4, 5-6, 7-8, 9-0, 1-2, 3-4, 5-6.",
    xp: 50
  }
];
