/* 
  Water Sort Puzzle - Solvability Guaranteed Levels (10 Stages)
  - Rule: Every color appears EXACTLY 4 times across the filled gallons.
  - Each level starts with EXACTLY 1 empty gallon.
*/

const levels = [
    // Level 1: 4 colors (Red, Blue, Yellow, Green), 4 filled + 1 empty = 5 gallons
    {
        level: 1,
        timeLimit: 90,
        bottles: [
            ['red', 'blue', 'yellow', 'green'],
            ['green', 'yellow', 'blue', 'red'],
            ['blue', 'red', 'green', 'yellow'],
            ['yellow', 'green', 'red', 'blue'],
            []
        ]
    },
    // Level 2: 5 colors (Purple, Orange, Cyan, Pink, Red), 5 filled + 1 empty = 6 gallons
    {
        level: 2,
        timeLimit: 110,
        bottles: [
            ['purple', 'orange', 'cyan', 'pink'],
            ['pink', 'purple', 'orange', 'cyan'],
            ['cyan', 'pink', 'purple', 'orange'],
            ['orange', 'cyan', 'pink', 'purple'],
            ['red', 'red', 'red', 'red'],
            []
        ]
    },
    // Level 3: 5 colors mixed, 5 filled + 1 empty = 6 gallons
    {
        level: 3,
        timeLimit: 130,
        bottles: [
            ['purple', 'cyan', 'red', 'orange'],
            ['orange', 'purple', 'pink', 'cyan'],
            ['cyan', 'orange', 'purple', 'pink'],
            ['pink', 'red', 'cyan', 'purple'],
            ['red', 'pink', 'orange', 'red'],
            []
        ]
    },
    // Level 4: 6 colors (Indigo, Teal, Green, Yellow, Blue, Red), 6 filled + 1 empty = 7 gallons
    {
        level: 4,
        timeLimit: 150,
        bottles: [
            ['indigo', 'teal', 'green', 'yellow'],
            ['yellow', 'green', 'teal', 'indigo'],
            ['teal', 'indigo', 'yellow', 'green'],
            ['green', 'yellow', 'indigo', 'teal'],
            ['blue', 'red', 'blue', 'red'],
            ['red', 'blue', 'red', 'blue'],
            []
        ]
    },
    // Level 5: 6 colors mixed, 6 filled + 1 empty = 7 gallons
    {
        level: 5,
        timeLimit: 170,
        bottles: [
            ['indigo', 'green', 'red', 'teal'],
            ['teal', 'yellow', 'blue', 'indigo'],
            ['yellow', 'indigo', 'green', 'red'],
            ['red', 'blue', 'teal', 'yellow'],
            ['blue', 'teal', 'indigo', 'green'],
            ['green', 'red', 'yellow', 'blue'],
            []
        ]
    },
    // Level 6: 7 colors (Red, Blue, Yellow, Green, Purple, Orange, Cyan), 7 filled + 1 empty = 8 gallons
    {
        level: 6,
        timeLimit: 200,
        bottles: [
            ['red', 'blue', 'yellow', 'green'],
            ['green', 'yellow', 'blue', 'red'],
            ['purple', 'orange', 'cyan', 'purple'],
            ['cyan', 'purple', 'orange', 'cyan'],
            ['orange', 'cyan', 'purple', 'orange'],
            ['red', 'green', 'yellow', 'blue'],
            ['blue', 'red', 'green', 'yellow'],
            []
        ]
    },
    // Level 7: 7 colors mixed, 7 filled + 1 empty = 8 gallons
    {
        level: 7,
        timeLimit: 220,
        bottles: [
            ['red', 'purple', 'green', 'cyan'],
            ['cyan', 'orange', 'blue', 'yellow'],
            ['yellow', 'green', 'purple', 'red'],
            ['blue', 'cyan', 'orange', 'green'],
            ['purple', 'red', 'yellow', 'blue'],
            ['orange', 'blue', 'cyan', 'purple'],
            ['green', 'yellow', 'red', 'orange'],
            []
        ]
    },
    // Level 8: 8 colors (All 8 vibrant colors), 8 filled + 1 empty = 9 gallons
    {
        level: 8,
        timeLimit: 250,
        bottles: [
            ['red', 'blue', 'yellow', 'green'],
            ['green', 'yellow', 'blue', 'red'],
            ['purple', 'orange', 'cyan', 'pink'],
            ['pink', 'cyan', 'orange', 'purple'],
            ['red', 'purple', 'yellow', 'orange'],
            ['orange', 'yellow', 'purple', 'red'],
            ['blue', 'cyan', 'green', 'pink'],
            ['pink', 'green', 'cyan', 'blue'],
            []
        ]
    },
    // Level 9: 8 colors mixed, 8 filled + 1 empty = 9 gallons
    {
        level: 9,
        timeLimit: 280,
        bottles: [
            ['red', 'orange', 'yellow', 'pink'],
            ['pink', 'green', 'cyan', 'purple'],
            ['purple', 'blue', 'red', 'orange'],
            ['orange', 'yellow', 'green', 'cyan'],
            ['cyan', 'pink', 'purple', 'blue'],
            ['blue', 'red', 'orange', 'yellow'],
            ['yellow', 'purple', 'blue', 'green'],
            ['green', 'cyan', 'pink', 'red'],
            []
        ]
    },
    // Level 10: 9 colors (Red, Blue, Yellow, Green, Purple, Orange, Cyan, Pink, Indigo), 9 filled + 1 empty = 10 gallons
    {
        level: 10,
        timeLimit: 330,
        bottles: [
            ['red', 'blue', 'yellow', 'green'],
            ['green', 'yellow', 'blue', 'red'],
            ['purple', 'orange', 'cyan', 'pink'],
            ['pink', 'cyan', 'orange', 'purple'],
            ['indigo', 'indigo', 'indigo', 'indigo'],
            ['red', 'purple', 'green', 'cyan'],
            ['cyan', 'green', 'purple', 'red'],
            ['blue', 'orange', 'yellow', 'pink'],
            ['pink', 'yellow', 'orange', 'blue'],
            []
        ]
    }
];
