#!/usr/bin/env node
/**
 * Pokemon Web - Regression Test Suite
 * Run with: node test.js
 */

const fs = require('fs');
const path = require('path');

let passed = 0;
let failed = 0;

function test(name, condition) {
    if (condition) {
        console.log(`✓ ${name}`);
        passed++;
    } else {
        console.log(`✗ ${name}`);
        failed++;
    }
}

function testSuite() {
    console.log("=== Pokemon Web Regression Tests ===\n");
    
    // Load data files
    const pokemonDataJs = fs.readFileSync(path.join(__dirname, 'pokemon-data.js'), 'utf8');
    const learnsetsJs = fs.readFileSync(path.join(__dirname, 'learnsets-data.js'), 'utf8');
    const movesJs = fs.readFileSync(path.join(__dirname, 'moves-data.js'), 'utf8');
    
    // Extract POKEMON_DATA
    const pokemonMatch = pokemonDataJs.match(/const POKEMON_DATA = \\{([\\s\\S]*?)\\n};/);
    const POKEMON_DATA = pokemonMatch ? eval('({' + pokemonMatch[1] + '})') : {};
    
    // Extract LEARNSETS
    const learnMatch = learnsetsJs.match(/const LEARNSETS = \\{([\\s\\S]*?)\\n};/);
    const LEARNSETS = learnMatch ? eval('({' + learnMatch[1] + '})') : {};
    
    // Extract CANONICAL_MOVES
    const movesMatch = movesJs.match(/const CANONICAL_MOVES = \\{([\\s\\S]*?)\\n};/);
    const CANONICAL_MOVES = movesMatch ? eval('({' + movesMatch[1] + '})') : {};
    
    // Extract MOVES alias
    const hasMovesAlias = movesJs.includes('const MOVES = CANONICAL_MOVES');
    
    console.log("Data Loading:");
    test(`POKEMON_DATA has ${Object.keys(POKEMON_DATA).length} entries`, Object.keys(POKEMON_DATA).length >= 700);
    test(`LEARNSETS has ${Object.keys(LEARNSETS).length} entries`, Object.keys(LEARNSETS).length >= 700);
    test(`CANONICAL_MOVES has ${Object.keys(CANONICAL_MOVES).length} entries`, Object.keys(CANONICAL_MOVES).length >= 100);
    test("MOVES alias exists", hasMovesAlias);
    
    console.log("\nMove Data:");
    test("tackle exists with power > 0", CANONICAL_MOVES.tackle && CANONICAL_MOVES.tackle.power > 0);
    test("ember exists with power > 0", CANONICAL_MOVES.ember && CANONICAL_MOVES.ember.power > 0);
    test("water_gun exists with power > 0", CANONICAL_MOVES.water_gun && CANONICAL_MOVES.water_gun.power > 0);
    
    console.log("\nGen 1 Starters:");
    test("bulbasaur has name", POKEMON_DATA.bulbasaur && POKEMON_DATA.bulbasaur.name);
    test("bulbasaur has type", POKEMON_DATA.bulbasaur && POKEMON_DATA.bulbasaur.type);
    test("bulbasaur has evolves", POKEMON_DATA.bulbasaur && POKEMON_DATA.bulbasaur.evolves);
    test("charmander has name", POKEMON_DATA.charmander && POKEMON_DATA.charmander.name);
    test("charmander has type", POKEMON_DATA.charmander && POKEMON_DATA.charmander.type);
    test("charmander has evolves", POKEMON_DATA.charmander && POKEMON_DATA.charmander.evolves);
    test("squirtle has name", POKEMON_DATA.squirtle && POKEMON_DATA.squirtle.name);
    test("squirtle has type", POKEMON_DATA.squirtle && POKEMON_DATA.squirtle.type);
    test("squirtle has evolves", POKEMON_DATA.squirtle && POKEMON_DATA.squirtle.evolves);
    
    console.log("\nGen 4-5 Starters:");
    test("turtwig has name", POKEMON_DATA.turtwig && POKEMON_DATA.turtwig.name);
    test("turtwig has type", POKEMON_DATA.turtwig && POKEMON_DATA.turtwig.type);
    test("turtwig has evolves", POKEMON_DATA.turtwig && POKEMON_DATA.turtwig.evolves);
    test("chimchar has name", POKEMON_DATA.chimchar && POKEMON_DATA.chimchar.name);
    test("chimchar has type", POKEMON_DATA.chimchar && POKEMON_DATA.chimchar.type);
    test("chimchar has evolves", POKEMON_DATA.chimchar && POKEMON_DATA.chimchar.evolves);
    test("piplup has name", POKEMON_DATA.piplup && POKEMON_DATA.piplup.name);
    test("piplup has type", POKEMON_DATA.piplup && POKEMON_DATA.piplup.type);
    test("piplup has evolves", POKEMON_DATA.piplup && POKEMON_DATA.piplup.evolves);
    
    console.log("\nGen 4-5 Evolution Chains:");
    test("turtwig evolves to grotle at 18", 
        POKEMON_DATA.turtwig && POKEMON_DATA.turtwig.evolves && 
        POKEMON_DATA.turtwig.evolves.into === 'grotle' && 
        POKEMON_DATA.turtwig.evolves.level === 18);
    test("grotle evolves to torterra at 32",
        POKEMON_DATA.grotle && POKEMON_DATA.grotle.evolves &&
        POKEMON_DATA.grotle.evolves.into === 'torterra' &&
        POKEMON_DATA.grotle.evolves.level === 32);
    test("chimchar evolves to monferno at 14",
        POKEMON_DATA.chimchar && POKEMON_DATA.chimchar.evolves &&
        POKEMON_DATA.chimchar.evolves.into === 'monferno' &&
        POKEMON_DATA.chimchar.evolves.level === 14);
    
    console.log("\nStarter Pool Simulation:");
    // Simulate the starter pool logic
    const canonical = ['bulbasaur', 'charmander', 'squirtle', 'chikorita', 'cyndaquil', 'totodile', 'pikachu', 'eevee', 'treecko', 'torchic', 'mudkip'];
    
    // Build evolution targets
    const evolutionTargets = new Set();
    for (const [id, data] of Object.entries(POKEMON_DATA)) {
        if (data.evolves && data.evolves.into) {
            evolutionTargets.add(data.evolves.into);
        }
    }
    test(`Evolution targets: ${evolutionTargets.size}`, evolutionTargets.size > 200);
    
    // Count eligible non-canonical starters
    let eligible = [];
    for (const [id, data] of Object.entries(POKEMON_DATA)) {
        if (!data.baseStats) continue;
        if (canonical.includes(id)) continue;
        if (evolutionTargets.has(id)) continue;
        if (!data.evolves || !data.evolves.into) continue;
        
        // Check for damaging move
        const learnset = LEARNSETS[id];
        if (!learnset) continue;
        const earlyMoves = learnset.filter(e => e.level <= 5).map(e => e.move);
        let hasDamaging = false;
        for (const moveId of earlyMoves) {
            const move = CANONICAL_MOVES[moveId];
            if (move && move.power > 0) {
                hasDamaging = true;
                break;
            }
        }
        if (!hasDamaging) continue;
        
        const bst = data.baseStats.hp + data.baseStats.atk + data.baseStats.def + data.baseStats.spd + (data.spa || 0) + (data.spd_def || 0);
        if (bst <= 320) {
            eligible.push(id);
        }
    }
    
    test(`Eligible non-canonical starters: ${eligible.length}`, eligible.length >= 20);
    test("Eligible includes Gen 4-5", eligible.some(id => ['turtwig', 'chimchar', 'piplup', 'snivy', 'tepig', 'oshawott'].includes(id)));
    
    // Test starter pool generation
    const allStarters = [...canonical, ...eligible];
    const shuffled = [...allStarters].sort(() => Math.random() - 0.5);
    const pool = shuffled.slice(0, 3);
    test(`Random pool always has 3: ${pool.length}`, pool.length === 3);
    
    console.log("\n=== Summary ===");
    console.log(`Passed: ${passed}`);
    console.log(`Failed: ${failed}`);
    console.log(`Total: ${passed + failed}`);
    
    process.exit(failed > 0 ? 1 : 0);
}

testSuite();
