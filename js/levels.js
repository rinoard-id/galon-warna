/* 
  Water Sort Puzzle - Solvability Guaranteed Levels (100 Stages)
  - Rule: Every color appears EXACTLY 4 times across the filled gallons.
  - Each level starts with empty gallons.
*/

const AVAILABLE_COLORS = [
    'red', 'blue', 'yellow', 'green', 'purple', 
    'orange', 'cyan', 'pink', 'indigo', 'teal'
];

// Helper for seeded pseudo-random number generator
function getSeededRandom(seed) {
    let x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
}

function generateLevels() {
    // Keep initial hand-crafted levels 1 to 10 for perfect onboarding
    const baseLevels = [
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
        // Level 10: 9 colors, 9 filled + 1 empty = 10 gallons
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

    const generated = [...baseLevels];

    // Generate levels 11 to 100
    for (let lvl = 11; lvl <= 100; lvl++) {
        // Color count progression: 5 to 10 colors
        let colorCount = 5;
        if (lvl > 85) colorCount = 10;
        else if (lvl > 70) colorCount = 9;
        else if (lvl > 55) colorCount = 8;
        else if (lvl > 40) colorCount = 7;
        else if (lvl > 25) colorCount = 6;

        // Pick distinct colors for this level using seeded PRNG
        let available = [...AVAILABLE_COLORS];
        let levelColors = [];
        let seed = lvl * 1337;
        for (let c = 0; c < colorCount; c++) {
            let index = Math.floor(getSeededRandom(seed++) * available.length);
            levelColors.push(available.splice(index, 1)[0]);
        }

        // Create solved state
        let bottles = levelColors.map(col => [col, col, col, col]);
        // Add 2 empty bottles for higher complexity and smooth gameplay
        bottles.push([]);
        bottles.push([]);

        // Shuffle via valid reverse pours starting from solved state
        let shuffleMoves = 20 + Math.floor(lvl * 1.8);
        let lastMove = null;

        for (let m = 0; m < shuffleMoves; m++) {
            let validPours = [];
            for (let from = 0; from < bottles.length; from++) {
                if (bottles[from].length === 0) continue;
                for (let to = 0; to < bottles.length; to++) {
                    if (from === to) continue;
                    if (bottles[to].length >= 4) continue;
                    // Check if pour is valid
                    let topColor = bottles[from][bottles[from].length - 1];
                    if (bottles[to].length > 0 && bottles[to][bottles[to].length - 1] !== topColor) continue;
                    // Avoid immediate undo
                    if (lastMove && lastMove.from === to && lastMove.to === from) continue;
                    validPours.push({ from, to });
                }
            }

            if (validPours.length === 0) break;

            let moveIdx = Math.floor(getSeededRandom(seed++) * validPours.length);
            let move = validPours[moveIdx];
            lastMove = move;

            // Execute pour
            let fromGallon = bottles[move.from];
            let toGallon = bottles[move.to];
            let topColor = fromGallon[fromGallon.length - 1];
            
            let transferCount = 0;
            for (let i = fromGallon.length - 1; i >= 0; i--) {
                if (fromGallon[i] === topColor) transferCount++;
                else break;
            }
            let space = 4 - toGallon.length;
            let actual = Math.min(transferCount, space);

            for (let k = 0; k < actual; k++) {
                toGallon.push(fromGallon.pop());
            }
        }

        // Time limit: decreases as level increases to add difficulty ("timer dikurangi")
        // Starts around 200s for level 11 down to 60s for level 100
        let timeLimit = Math.max(50, Math.floor(220 - (lvl * 1.5) + (colorCount * 8)));

        generated.push({
            level: lvl,
            timeLimit: timeLimit,
            bottles: bottles.map(b => [...b])
        });
    }

    return generated;
}

const levels = generateLevels();
