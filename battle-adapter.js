/**
 * BattleAdapter - Wrapper for @pkmn/sim Pokemon Showdown battle engine
 * Uses synchronous Battle API instead of streams
 */

import { Battle, Teams } from '@pkmn/sim';
import { Dex } from '@pkmn/dex';
import { toPSName } from './species-mapping.js';

export class BattleAdapter {
    constructor() {
        this.battle = null;
        this.turnInProgress = false;
        this.pendingPlayerMove = null;
        this.pendingEnemyMove = null;
        this.pendingBattleLog = null;
    }

    /**
     * Initialize a new battle between player and enemy
     * @param {Object} playerPokemon - Our Pokemon object
     * @param {Object} enemyPokemon - Enemy Pokemon object  
     * @returns {Battle} PS Battle instance
     */
    initBattle(playerPokemon, enemyPokemon) {
        // Convert our Pokemon to PS format and pack for Battle constructor
        const p1TeamSet = this.toPSSet(playerPokemon, 'p1');
        const p2TeamSet = this.toPSSet(enemyPokemon, 'p2');
        
        // Pack teams for Battle constructor (activates Pokemon on field)
        const p1Team = Teams.pack(p1TeamSet);
        const p2Team = Teams.pack(p2TeamSet);

        // Create battle directly (synchronous)
        this.battle = new Battle({
            formatid: 'gen5customgame',
            p1: { name: 'Player', team: p1Team },
            p2: { name: 'Enemy', team: p2Team }
        });

        // Send out lead Pokemon for each side (required to populate active slots)
        this.battle.choose('p1', 'team 1');
        this.battle.choose('p2', 'team 1');

        // Reset turn tracking
        this.turnInProgress = false;
        this.pendingPlayerMove = null;
        this.pendingEnemyMove = null;
        
        return this.battle;
    }

    /**
     * Convert our Pokemon to a PS PokemonSet
     */
    toPSSet(pokemon, side) {
        // Extract species name - handle both string and object cases
        let speciesName = pokemon.species?.name || pokemon.species || pokemon.name;
        // Ensure speciesName is a string (not an object)
        if (typeof speciesName === 'object') {
            speciesName = speciesName?.name || speciesName?.id || 'Rattata';
        }
        const psSpeciesName = toPSName(speciesName);
        const dex = Dex.species.get(psSpeciesName);
        
        // Get move names in PS format - ensure all are strings
        const moves = pokemon.moves.map(m => {
            const moveId = typeof m === 'string' ? m : (m.id || m.name);
            const moveDex = Dex.moves.get(moveId);
            return String(moveDex?.name || moveId || 'Tackle');
        }).filter(m => m && typeof m === 'string').slice(0, 4);

        return [{
            species: String(dex.name || psSpeciesName || 'Rattata'),
            level: pokemon.level || 5,
            moves: moves,
            ability: String(pokemon.ability || 'No Ability'),
            item: '',
            nature: 'Hardy',
            ivs: { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 },
            evs: { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 }
        }];
    }

    /**
     * Execute a full turn with both moves
     * Call this once per turn from game.js, then apply results to both Pokemon
     * @param {string} playerMoveId - Player's move ID
     * @returns {Object} Turn results with both player and enemy damage
     */
    executeTurn(playerMoveId) {
        if (!this.battle) throw new Error('Battle not initialized');

        // Store HP before turn
        const enemyBefore = this.battle.p2.active[0]?.hp || 0;
        const playerBefore = this.battle.p1.active[0]?.hp || 0;

        // Track log index before turn
        const logStartIndex = this.battle.log?.length || 0;

        // Execute player move
        const playerSlot = this.findMoveSlot('p1', playerMoveId);
        this.battle.choose('p1', `move ${playerSlot}`);

        // Execute enemy move (random selection)
        const enemy = this.battle.p2.active[0];
        if (!enemy || !enemy.moveSlots) {
            console.log('[BattleAdapter DEBUG] Cannot execute enemy move in executeTurn:', { enemy: !!enemy, moveSlots: !!enemy?.moveSlots });
            // Return partial results
            return {
                player: { damage: 0, moveName: 'Error', effectiveness: 1, crit: false, flinched: false, targetFainted: false },
                enemy: { damage: 0, moveName: 'Error', effectiveness: 1, crit: false, flinched: false, targetFainted: false },
                battleLog: []
            };
        }

        const moveCount = enemy.moveSlots.filter(m => m.pp > 0).length;
        const randomSlot = Math.floor(Math.random() * moveCount) + 1;
        this.battle.choose('p2', `move ${randomSlot}`);

        // Calculate results after both moves resolve
        const enemyAfter = this.battle.p2.active[0]?.hp || 0;
        const playerAfter = this.battle.p1.active[0]?.hp || 0;

        // Parse PS battle log events
        const battleLog = this.parsePSEvents(logStartIndex);

        const playerDexMove = Dex.moves.get(playerMoveId);
        const enemyMoveName = enemy.moveSlots[randomSlot - 1]?.move || 'Attack';

        const results = {
            player: {
                damage: enemyBefore - enemyAfter,
                moveName: playerDexMove?.name || playerMoveId,
                effectiveness: this.calculateEffectiveness(playerDexMove?.type, this.battle.p2.active[0]),
                crit: false,
                flinched: false,
                targetFainted: enemyAfter <= 0
            },
            enemy: {
                damage: playerBefore - playerAfter,
                moveName: enemyMoveName,
                effectiveness: 1,
                crit: false,
                flinched: false,
                targetFainted: playerAfter <= 0
            },
            battleLog
        };

        this.lastTurnResults = results;
        return results;
    }

    /**
     * Execute player move - wrapper for game.js compatibility
     * Executes full turn and returns player move result
     * @param {string} moveId - Move ID (e.g., 'tackle', 'ember')
     * @returns {Object} Player's battle result
     */
    executePlayerMove(moveId) {
        if (!this.battle) throw new Error('Battle not initialized');

        // Execute full turn and store results
        const results = this.executeTurn(moveId);
        this.pendingPlayerMove = results.player;
        this.pendingEnemyMove = results.enemy;
        this.pendingBattleLog = results.battleLog;

        // Return player move result with battleLog for immediate application
        return { ...results.player, battleLog: results.battleLog };
    }

    /**
     * Execute enemy move - wrapper for game.js compatibility
     * Returns pending enemy result from previous executeTurn call
     * MUST be called after executePlayerMove() which populates the cache
     * @returns {Object} Enemy's battle result
     */
    executeEnemyMove() {
        if (!this.battle) throw new Error('Battle not initialized');

        // MUST already have cached result from executePlayerMove()
        if (!this.pendingEnemyMove) {
            throw new Error('executeEnemyMove called without cached result. Call executePlayerMove() first.');
        }

        // Return the cached enemy result with battleLog
        const result = { ...this.pendingEnemyMove, battleLog: this.pendingBattleLog || [] };
        this.pendingEnemyMove = null; // Clear after use
        this.pendingPlayerMove = null;
        this.pendingBattleLog = null;
        return result;
    }

    /**
     * Find which slot a move is in
     */
    findMoveSlot(side, moveId) {
        const pokemon = side === 'p1' ? this.battle.p1.active[0] : this.battle.p2.active[0];
        const dexMove = Dex.moves.get(moveId);
        
        for (let i = 0; i < pokemon.moveSlots.length; i++) {
            if (pokemon.moveSlots[i].id === moveId || 
                pokemon.moveSlots[i].move === dexMove?.name) {
                return i + 1; // PS uses 1-indexed slots
            }
        }
        return 1; // Default to first move
    }

    /**
     * Calculate type effectiveness
     */
    calculateEffectiveness(attackType, defender) {
        try {
            if (!attackType || !defender) return 1;
            const atkType = String(attackType);

            // Get defender types from PS species object or fallback
            const rawSpecies = defender.species;
            let defTypes;
            if (rawSpecies && typeof rawSpecies === 'object' && rawSpecies.types) {
                defTypes = rawSpecies.types;
            } else {
                return 1; // can't determine types, assume neutral
            }

            // Static Gen 1-5 type chart (damageTaken values: 1=2x, 2=0.5x, 3=0x, missing=1x)
            // Generated from @pkmn/sim Dex.forGen(5).types.get(defType).damageTaken[atkType]
            const TYPE_CHART = {
                Normal:   {Rock:2,Ghost:3,Steel:2},
                Fire:     {Fire:2,Water:2,Grass:1,Ice:1,Bug:1,Rock:2,Dragon:2,Steel:1},
                Water:    {Fire:1,Water:2,Grass:2,Ground:1,Rock:1,Dragon:2},
                Electric: {Water:1,Electric:2,Grass:2,Ground:3,Flying:1,Dragon:2},
                Grass:    {Fire:2,Water:1,Grass:2,Poison:2,Ground:1,Flying:2,Bug:2,Rock:1,Dragon:2,Steel:2},
                Ice:      {Fire:2,Water:2,Grass:1,Ice:2,Ground:1,Flying:1,Dragon:1,Steel:2},
                Fighting: {Normal:1,Ice:1,Poison:2,Flying:2,Psychic:2,Bug:2,Rock:1,Ghost:3,Dark:1,Steel:1},
                Poison:   {Grass:1,Poison:2,Ground:2,Rock:2,Ghost:2,Steel:3},
                Ground:   {Fire:1,Electric:1,Grass:2,Poison:1,Flying:3,Bug:2,Rock:1,Steel:1},
                Flying:   {Electric:2,Grass:1,Fighting:1,Bug:1,Rock:2,Steel:2},
                Psychic:  {Fighting:1,Poison:1,Psychic:2,Dark:3,Steel:2},
                Bug:      {Fire:2,Grass:1,Fighting:2,Poison:2,Flying:2,Psychic:1,Ghost:2,Dark:1,Steel:2},
                Rock:     {Fire:1,Ice:1,Fighting:2,Ground:2,Flying:1,Bug:1,Steel:2},
                Ghost:    {Normal:3,Psychic:1,Ghost:1,Dark:2,Steel:2},
                Dragon:   {Dragon:1,Steel:2},
                Dark:     {Fighting:2,Psychic:1,Ghost:1,Dark:2,Steel:2},
                Steel:    {Fire:2,Water:2,Electric:2,Ice:1,Rock:1,Steel:2}
            };
            const multipliers = { 1: 2, 2: 0.5, 3: 0 };

            let effectiveness = 1;
            for (const defType of defTypes) {
                if (!defType || typeof defType !== 'string') continue;
                const taken = TYPE_CHART[atkType]?.[defType];
                if (taken !== undefined) {
                    effectiveness *= (multipliers[taken] ?? 1);
                }
            }
            return effectiveness;
        } catch (e) {
            console.warn('[BattleAdapter] calculateEffectiveness failed:', e?.message,
                'attackType:', typeof attackType, attackType);
            return 1;
        }
    }

    /**
     * Parse PS battle log events into human-readable log entries
     * @param {number} startIndex - Index in battle.log to start parsing from
     * @returns {Array} Array of {message, type} log entries
     */
    parsePSEvents(startIndex = 0) {
        if (!this.battle || !this.battle.log) return [];
        
        const entries = [];
        const log = this.battle.log;
        let skipNext = false;
        
        for (let i = startIndex; i < log.length; i++) {
            const line = log[i];
            
            // Skip split markers and their duplicates
            if (line.startsWith('|split|')) {
                skipNext = true;
                continue;
            }
            if (skipNext) {
                skipNext = false;
                continue;
            }
            
            // Parse move: |move|SIDE: Name|MoveName|TARGET
            const moveMatch = line.match(/^\|move\|[^:]*:\s*([^|]+)\|([^|]+)/);
            if (moveMatch) {
                const pokemonName = moveMatch[1].trim();
                const moveName = moveMatch[2].trim();
                entries.push({ message: `${pokemonName} used ${moveName}!`, type: 'move' });
                continue;
            }
            
            // Parse super effective
            if (line.startsWith('|-supereffective|')) {
                entries.push({ message: "It's super effective!", type: 'effectiveness' });
                continue;
            }
            
            // Parse resisted (not very effective)
            if (line.startsWith('|-resisted|')) {
                entries.push({ message: "It's not very effective...", type: 'effectiveness' });
                continue;
            }
            
            // Parse immune
            if (line.startsWith('|-immune|')) {
                const match = line.match(/^\|-immune\|[^:]*:\s*([^|]+)/);
                const name = match ? match[1].trim() : 'the target';
                entries.push({ message: `It doesn't affect ${name}...`, type: 'effectiveness' });
                continue;
            }
            
            // Parse status
            const statusMatch = line.match(/^\|-status\|[^:]*:\s*([^|]+)\|(\w+)/);
            if (statusMatch) {
                const name = statusMatch[1].trim();
                const status = statusMatch[2];
                const statusNames = { brn: 'burned', psn: 'poisoned', tox: 'badly poisoned', par: 'paralyzed', slp: 'asleep', frz: 'frozen' };
                entries.push({ message: `${name} was ${statusNames[status] || status}!`, type: 'status' });
                continue;
            }
            
            // Parse flinch
            if (line.startsWith('|-flinch|')) {
                const match = line.match(/^\|-flinch\|[^:]*:\s*([^|]+)/);
                const name = match ? match[1].trim() : 'The Pokemon';
                entries.push({ message: `${name} flinched!`, type: 'flinch' });
                continue;
            }
            
            // Parse faint
            const faintMatch = line.match(/^\|faint\|[^:]*:\s*([^|]+)/);
            if (faintMatch) {
                const name = faintMatch[1].trim();
                entries.push({ message: `${name} fainted!`, type: 'faint' });
                continue;
            }
        }
        
        return entries;
    }

    /**
     * Get current battle state for UI updates
     */
    getBattleState() {
        if (!this.battle) return null;
        
        return {
            p1: {
                hp: this.battle.p1.active[0]?.hp || 0,
                maxHp: this.battle.p1.active[0]?.maxhp || 0,
                status: this.battle.p1.active[0]?.status || null
            },
            p2: {
                hp: this.battle.p2.active[0]?.hp || 0,
                maxHp: this.battle.p2.active[0]?.maxhp || 0,
                status: this.battle.p2.active[0]?.status || null
            },
            turn: this.battle.turn
        };
    }

    /**
     * End battle and cleanup
     */
    endBattle() {
        if (this.battle) {
            this.battle.destroy();
        }
        this.battle = null;
        this.turnInProgress = false;
        this.pendingPlayerMove = null;
        this.pendingEnemyMove = null;
        this.pendingBattleLog = null;
    }
}

// Expose globally for use from non-module game.js
window.BattleAdapter = BattleAdapter;
