#!/usr/bin/env node
/**
 * Starter Pool Runtime Test
 * Verifies getRandomStarterPool() returns exactly 3 valid Pokemon
 */

const fs = require('fs');
const path = require('path');

// Load all data files
const pokemonDataJs = fs.readFileSync(path.join(__dirname, 'pokemon-data.js'), 'utf8');
const learnsetsJs = fs.readFileSync(path.join(__dirname, 'learnsets-data.js'), 'utf8');
const movesJs = fs.readFileSync(path.join(__dirname, 'moves-data.js'), 'utf8');

// Extract data objects
const POKEMON_DATA = eval('({' + pokemonDataJs.match(/const POKEMON_DATA = \\{([\\s\\S]*?)\\n};/)[1] + '})');
const LEARNSETS = eval('({' + learnsetsJs.match(/const LEARNSETS = \\{([\\s\\S]*?)\\n};/)[1] + '})');
const CANONICAL_MOVES = eval('({' + movesJs.match(/const CANONICAL_MOVES = \\{([\\s\\S]*?)\\n};/)[1] + '})');

// Copy of the starter pool function for testing
function getRandomStarterPool(count = 3) {
    const canonical = ['bulbasaur', 'charmander', 'squirtle', 'chikorita', 'cyndaquil', 'totodile', 'pikachu', 'eevee', 'treecko', 'torchic', 'mudkip'];
    const eligible = [...canonical];
    
    const evolutionTargets = new Set();
    for (const [id, data] of Object.entries(POKEMON_DATA)) {
        if (data.evolves && data.evolves.into) {
            evolutionTargets.add(data.evolves.into);
        }
    }
    
    function hasDamagingMoveAtLevel1(pokemonId) {
        const learnset = LEARNSETS[pokemonId];
        if (!learnset) return false;
        
        const earlyMoves = learnset.filter(entry => entry.level <= 5).map(entry => entry.move);
        if (earlyMoves.length === 0) return false;
        
        for (const moveId of earlyMoves) {
            const move = CANONICAL_MOVES[moveId];
            if (move && move.power > 0) {
                return true;
            }
        }
        return false;
    }
    
    for (const [id, data] of Object.entries(POKEMON_DATA)) {
        if (!data.baseStats) continue;
        if (canonical.includes(id)) continue;
        if (evolutionTargets.has(id)) continue;
        if (!data.evolves || !data.evolves.into) continue;
        if (!hasDamagingMoveAtLevel1(id)) continue;
        
        const bst = data.baseStats.hp + data.baseStats.atk + data.baseStats.def + data.baseStats.spd + (data.spa || 0) + (data.spd_def || 0);
        if (bst <= 320) {
            eligible.push(id);
        }
    }
    
    const shuffled = [...eligible].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
}

// Run tests
console.log("=== Starter Pool Runtime Test ===\n");

let pass = 0;
let fail = 0;

function test(name, condition) {
    if (condition) {
        console.log(`✓ ${name}`);
        pass++;
    } else {
        console.log(`✗ ${name}`);
        fail++;
    }
}

// Test 1: Returns exactly 3
for (let i = 0; i < 10; i++) {
    const pool = getRandomStarterPool(3);
    test(`Run ${i+1}: Returns 3 starters`, pool.length === 3);
}

// Test 2: All returned IDs are valid Pokemon
const pool = getRandomStarterPool(3);
for (const id of pool) {
    test(`'${id}' is valid Pokemon`, POKEMON_DATA[id] && POKEMON_DATA[id].name);
}

// Test 3: Check for Gen 4-5 presence over multiple runs
let foundGen45 = false;
const gen45Starters = ['turtwig', 'chimchar', 'piplup', 'snivy', 'tepig', 'oshawott'];
for (let i = 0; i < 20; i++) {
    const p = getRandomStarterPool(3);
    if (p.some(id => gen45Starters.includes(id))) {
        foundGen45 = true;
        break;
    }
}
test("Gen 4-5 starters appear in pool (20 runs)", foundGen45);

// Summary
console.log("\n=== Summary ===");
console.log(`Passed: ${pass}`);
console.log(`Failed: ${fail}`);
console.log(`Total: ${pass + fail}`);

process.exit(fail > 0 ? 1 : 0);
