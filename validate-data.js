#!/usr/bin/env node
// Pokemon data validation script
// Checks all Pokemon entries have required fields

const fs = require('fs');
const path = require('path');

let errors = 0;
let warnings = 0;

function error(msg) { console.error('❌ ERROR:', msg); errors++; }
function warn(msg) { console.warn('⚠️  WARN:', msg); warnings++; }
function ok(msg) { console.log('✅', msg); }

const pdCode = fs.readFileSync(path.join(__dirname, 'pokemon-data.js'), 'utf8');

// Extract POKEMON_DATA block
const pdStart = pdCode.indexOf('const POKEMON_DATA = {');
const pdEnd = pdCode.indexOf('\n};\n\nconst STARTERS', pdStart);
if (pdStart < 0 || pdEnd < 0) { error('Could not find POKEMON_DATA block'); process.exit(1); }
const pdBlock = pdCode.slice(pdStart + 'const POKEMON_DATA = {'.length, pdEnd);

// Item keys (not Pokemon)
const itemKeys = new Set(['fire_stone','water_stone','thunder_stone','leaf_stone','moon_stone','sun_stone','shiny_stone','dusk_stone','dawn_stone','oval_stone','link_cable','potion','super_potion','hyper_potion','full_restore','pokeball','great_ball','ultra_ball','master_ball','revive','max_revive','rare_candy','pp_restore','max_pp_restore','ether','max_ether','elixir','max_elixir','repel','super_repel','max_repel','lure','super_lure','max_lure','old_rod','good_rod','super_rod','escape_rope','bicycle','coin_case','itemfinder','silph_scope','lift_key','card_key','dome_fossil','helix_fossil','old_amber','berry']);

// Parse entries
const entryRegex = /^\s{4}(\w+):\s*\{([^{}]+(?:\{[^{}]*\}[^{}]*)*)\}/gm;
let match;
const pokemon = {};

while ((match = entryRegex.exec(pdBlock)) !== null) {
    const id = match[1];
    const body = match[2];
    if (itemKeys.has(id)) continue;
    if (!body.includes('baseStats')) continue; // skip non-pokemon
    pokemon[id] = body;
}

const ids = Object.keys(pokemon);
ok(`Found ${ids.length} Pokemon entries`);

// Required fields for all Pokemon
const missingName = [], missingType = [], missingBaseStats = [];
for (const [id, body] of Object.entries(pokemon)) {
    if (!body.includes('name:')) missingName.push(id);
    if (!body.match(/type:\s*['"][A-Za-z]/)) missingType.push(id);
    if (!body.includes('baseStats:')) missingBaseStats.push(id);
}

if (missingName.length > 0) warn(`${missingName.length} Pokemon missing name: ${missingName.slice(0,5).join(', ')}`);
else ok('All Pokemon have name field');

if (missingType.length > 0) warn(`${missingType.length} Pokemon missing type: ${missingType.slice(0,5).join(', ')}`);
else ok('All Pokemon have type field');

// Canonical starters must all be present and have name+type
const canonical = ['bulbasaur','charmander','squirtle','chikorita','cyndaquil','totodile','pikachu','eevee','treecko','torchic','mudkip','turtwig','chimchar','piplup','snivy','tepig','oshawott'];
for (const s of canonical) {
    if (!pokemon[s]) error(`Canonical starter missing from POKEMON_DATA: ${s}`);
    else if (!pokemon[s].includes('name:') || !pokemon[s].match(/type:\s*['"][A-Za-z]/)) {
        error(`Canonical starter ${s} missing name or type field`);
    }
}
if (errors === 0) ok('All canonical starters valid');

// Check rival filter won't crash: all Pokemon with baseStats must have name + type
const rivalCrashRisk = [];
for (const [id, body] of Object.entries(pokemon)) {
    if (body.includes('baseStats:') && !body.includes('name:')) {
        rivalCrashRisk.push(id);
    }
}
if (rivalCrashRisk.length > 0) error('Pokemon with baseStats but no name (rival filter crash risk): ' + rivalCrashRisk.join(', '));
else ok('Rival filter crash check passed');

// Check Pokemon count sanity
if (ids.length < 400) error(`Too few Pokemon: ${ids.length} (expected 700+)`);
else ok(`Pokemon count: ${ids.length}`);

// JS syntax check
const { execSync } = require('child_process');
const jsFiles = ['game.js', 'pokemon-data.js', 'moves-data.js', 'learnsets-data.js', 'tm-data.js', 'championship-tournament.js'];
for (const f of jsFiles) {
    try {
        execSync(`node --check ${f}`, { cwd: __dirname, stdio: 'pipe' });
        ok(`Syntax OK: ${f}`);
    } catch (e) {
        error(`Syntax error in ${f}: ${e.stderr?.toString().split('\n')[0]}`);
    }
}

// Check known dual-type Pokemon have correct type2
const knownTypes = {
    aron: ['Rock', 'Steel'],
    bulbasaur: ['Grass', 'Poison'],
    geodude: ['Rock', 'Ground'],
    magnemite: ['Electric', 'Steel'],
};
for (const [id, [t1, t2]] of Object.entries(knownTypes)) {
    const body = pokemon[id];
    if (!body) { warn('Known Pokemon missing from data: ' + id); continue; }
    if (!body.includes("type: '" + t1 + "'") && !body.includes('type: "' + t1 + '"')) warn(id + ' expected type ' + t1);
    if (t2 && !body.includes("type2: '" + t2 + "'") && !body.includes('type2: "' + t2 + '"')) error(id + ' has wrong type2 (expected ' + t2 + ')');
}

// Check fixed-damage moves have fixedDamage field (dragonrage, sonicboom, etc.)
// Read moves-data.js
const movesCode = fs.readFileSync(path.join(__dirname, 'moves-data.js'), 'utf8');
const fixedDamageMoves = ['dragonrage', 'sonicboom'];
for (const moveId of fixedDamageMoves) {
    const movePattern = new RegExp(moveId + ':\s*\{[^}]+\}');
    const m = movesCode.match(movePattern);
    if (m && !m[0].includes('fixedDamage') && !m[0].includes('power: 40') && !m[0].includes('power: 20')) {
        warn('Fixed-damage move ' + moveId + ' may not deal correct damage (check fixedDamage field)');
    }
}

console.log('');
console.log(`Result: ${errors} errors, ${warnings} warnings`);
if (errors > 0) {
    console.error('VALIDATION FAILED');
    process.exit(1);
} else {
    console.log('VALIDATION PASSED');
}
