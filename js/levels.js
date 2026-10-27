/* 
  Water Sort Puzzle - 10 Progressive Levels (Gallon Edition)
  - Each level starts with EXACTLY 1 empty gallon.
  - Stage 1 starts with 6 gallons total (5 filled + 1 empty).
  - Subsequent stages increase in gallon count and color randomness.
  - Includes timeLimit in seconds for countdown timer.
*/

const levels = [
    // Level 1: 6 gallons (5 filled, 1 empty, 5 colors)
    {
        level: 1,
        timeLimit: 90,
        bottles: [
            ['red', 'blue', 'yellow', 'green'],
            ['green', 'yellow', 'blue', 'red'],
            ['blue', 'red', 'green', 'yellow'],
            ['yellow', 'green', 'red', 'blue'],
            ['red', 'green', 'yellow', 'blue'], // mixed colors
            [] // exactly 1 empty gallon
        ]
    },
    // Level 2: 8 gallons (7 filled, 1 empty, 6 colors)
    {
        level: 2,
        timeLimit: 120,
        bottles: [
            ['purple', 'orange', 'cyan', 'pink'],
            ['pink', 'cyan', 'orange', 'purple'],
            ['orange', 'purple', 'pink', 'cyan'],
            ['cyan', 'pink', 'purple', 'orange'],
            ['purple', 'cyan', 'orange', 'pink'],
            ['orange', 'pink', 'cyan', 'purple'],
            ['pink', 'orange', 'purple', 'cyan'],
            []
        ]
    },
    // Level 3: 8 gallons (7 filled, 1 empty, 6 colors - tighter mix)
    {
        level: 3,
        timeLimit: 135,
        bottles: [
            ['red', 'purple', 'blue', 'orange'],
            ['orange', 'blue', 'purple', 'red'],
            ['blue', 'red', 'orange', 'purple'],
            ['purple', 'orange', 'red', 'blue'],
            ['red', 'orange', 'blue', 'purple'],
            ['blue', 'purple', 'orange', 'red'],
            ['orange', 'red', 'purple', 'blue'],
            []
        ]
    },
    // Level 4: 10 gallons (9 filled, 1 empty, 7 colors)
    {
        level: 4,
        timeLimit: 160,
        bottles: [
            ['indigo', 'teal', 'green', 'yellow'],
            ['yellow', 'green', 'teal', 'indigo'],
            ['teal', 'indigo', 'yellow', 'green'],
            ['green', 'yellow', 'indigo', 'teal'],
            ['indigo', 'green', 'teal', 'yellow'],
            ['yellow', 'teal', 'green', 'indigo'],
            ['teal', 'yellow', 'indigo', 'green'],
            ['green', 'indigo', 'yellow', 'teal'],
            ['indigo', 'yellow', 'green', 'teal'],
            []
        ]
    },
    // Level 5: 10 gallons (9 filled, 1 empty, 7 colors - expert mix)
    {
        level: 5,
        timeLimit: 180,
        bottles: [
            ['red', 'pink', 'blue', 'cyan'],
            ['cyan', 'blue', 'pink', 'red'],
            ['pink', 'red', 'cyan', 'blue'],
            ['blue', 'cyan', 'red', 'pink'],
            ['red', 'cyan', 'blue', 'pink'],
            ['pink', 'blue', 'cyan', 'red'],
            ['cyan', 'pink', 'red', 'blue'],
            ['blue', 'red', 'pink', 'cyan'],
            ['red', 'blue', 'cyan', 'pink'],
            []
        ]
    },
    // Level 6: 12 gallons (11 filled, 1 empty, 8 colors)
    {
        level: 6,
        timeLimit: 210,
        bottles: [
            ['purple', 'yellow', 'green', 'orange'],
            ['orange', 'green', 'yellow', 'purple'],
            ['yellow', 'purple', 'orange', 'green'],
            ['green', 'orange', 'purple', 'yellow'],
            ['purple', 'green', 'orange', 'yellow'],
            ['yellow', 'orange', 'green', 'purple'],
            ['orange', 'yellow', 'purple', 'green'],
            ['green', 'purple', 'yellow', 'orange'],
            ['purple', 'orange', 'yellow', 'green'],
            ['yellow', 'green', 'purple', 'orange'],
            ['orange', 'purple', 'green', 'yellow'],
            []
        ]
    },
    // Level 7: 12 gallons (11 filled, 1 empty, 8 colors - master mix)
    {
        level: 7,
        timeLimit: 240,
        bottles: [
            ['indigo', 'red', 'teal', 'pink'],
            ['pink', 'teal', 'red', 'indigo'],
            ['teal', 'indigo', 'pink', 'red'],
            ['red', 'pink', 'indigo', 'teal'],
            ['indigo', 'teal', 'red', 'pink'],
            ['pink', 'red', 'teal', 'indigo'],
            ['teal', 'pink', 'indigo', 'red'],
            ['red', 'indigo', 'pink', 'teal'],
            ['indigo', 'pink', 'teal', 'red'],
            ['teal', 'red', 'pink', 'indigo'],
            ['pink', 'indigo', 'red', 'teal'],
            []
        ]
    },
    // Level 8: 14 gallons (13 filled, 1 empty, 9 colors)
    {
        level: 8,
        timeLimit: 270,
        bottles: [
            ['blue', 'yellow', 'green', 'orange'],
            ['orange', 'green', 'yellow', 'blue'],
            ['yellow', 'blue', 'orange', 'green'],
            ['green', 'orange', 'blue', 'yellow'],
            ['blue', 'green', 'orange', 'yellow'],
            ['yellow', 'orange', 'green', 'blue'],
            ['orange', 'yellow', 'blue', 'green'],
            ['green', 'blue', 'yellow', 'orange'],
            ['blue', 'orange', 'yellow', 'green'],
            ['yellow', 'green', 'blue', 'orange'],
            ['orange', 'blue', 'green', 'yellow'],
            ['green', 'yellow', 'orange', 'blue'],
            ['blue', 'yellow', 'green', 'orange'],
            []
        ]
    },
    // Level 9: 14 gallons (13 filled, 1 empty, 9 colors - grandmaster)
    {
        level: 9,
        timeLimit: 300,
        bottles: [
            ['purple', 'cyan', 'indigo', 'red'],
            ['red', 'indigo', 'cyan', 'purple'],
            ['cyan', 'purple', 'red', 'indigo'],
            ['indigo', 'red', 'purple', 'cyan'],
            ['purple', 'indigo', 'red', 'cyan'],
            ['cyan', 'red', 'indigo', 'purple'],
            ['red', 'cyan', 'purple', 'indigo'],
            ['indigo', 'purple', 'cyan', 'red'],
            ['purple', 'red', 'cyan', 'indigo'],
            ['indigo', 'cyan', 'purple', 'red'],
            ['red', 'purple', 'indigo', 'cyan'],
            ['cyan', 'indigo', 'red', 'purple'],
            ['purple', 'cyan', 'red', 'indigo'],
            []
        ]
    },
    // Level 10: 16 gallons (15 filled, 1 empty, 10 colors - ultimate legend)
    {
        level: 10,
        timeLimit: 360,
        bottles: [
            ['red', 'blue', 'yellow', 'green'],
            ['green', 'yellow', 'blue', 'red'],
            ['blue', 'red', 'green', 'yellow'],
            ['yellow', 'green', 'red', 'blue'],
            ['purple', 'orange', 'cyan', 'pink'],
            ['pink', 'cyan', 'orange', 'purple'],
            ['orange', 'purple', 'pink', 'cyan'],
            ['cyan', 'pink', 'purple', 'orange'],
            ['indigo', 'teal', 'red', 'blue'],
            ['blue', 'red', 'teal', 'indigo'],
            ['teal', 'indigo', 'blue', 'red'],
            ['red', 'blue', 'indigo', 'teal'],
            ['pink', 'green', 'yellow', 'orange'],
            ['orange', 'yellow', 'green', 'pink'],
            ['green', 'pink', 'orange', 'yellow'],
            []
        ]
    }
];
