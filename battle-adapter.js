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
        const speciesName = pokemon.species?.name || pokemon.species || pokemon.name;
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
        
        // DEBUG: Log state BEFORE turn
        console.log('[BattleAdapter DEBUG] BEFORE turn:', JSON.stringify({
            p1_hp: this.battle.p1.active[0]?.hp,
            p2_hp: this.battle.p2.active[0]?.hp,
            p2_exists: !!this.battle.p2.active[0],
            p2_moveSlots: !!this.battle.p2.active[0]?.moveSlots
        }));
        
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
                enemy: { damage: 0, moveName: 'Error', effectiveness: 1, crit: false, flinched: false, targetFainted: false }
            };
        }
        
        const moveCount = enemy.moveSlots.filter(m => m.pp > 0).length;
        const randomSlot = Math.floor(Math.random() * moveCount) + 1;
        this.battle.choose('p2', `move ${randomSlot}`);
        
        // Calculate results after both moves resolve
        const enemyAfter = this.battle.p2.active[0]?.hp || 0;
        const playerAfter = this.battle.p1.active[0]?.hp || 0;
        
        // DEBUG: Log state AFTER turn
        console.log('[BattleAdapter DEBUG] AFTER turn:', JSON.stringify({
            p1_hp: playerAfter,
            p2_hp: enemyAfter,
            p2_exists: !!this.battle.p2.active[0],
            p2_moveSlots: !!this.battle.p2.active[0]?.moveSlots,
            damage_to_p2: enemyBefore - enemyAfter,
            damage_to_p1: playerBefore - playerAfter
        }));
        
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
            }
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
        
        // Return player move result for immediate application
        return results.player;
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
        
        // Return the cached enemy result
        const result = this.pendingEnemyMove;
        this.pendingEnemyMove = null; // Clear after use
        this.pendingPlayerMove = null;
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
        if (!attackType || !defender) return 1;
        
        // PS stores species as an object — extract the name string
        const speciesName = typeof defender.species === 'string' 
            ? defender.species 
            : (defender.species?.name || defender.species?.id || '');
        
        const typeChart = Dex.data.TypeChart;
        const species = Dex.species.get(speciesName);
        
        let effectiveness = 1;
        
        // Check against both types
        [species?.types?.[0], species?.types?.[1]].filter(Boolean).forEach(defType => {
            if (typeChart[attackType]?.damageTaken?.[defType] !== undefined) {
                effectiveness *= typeChart[attackType].damageTaken[defType];
            }
        });
        
        return effectiveness;
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
    }
}

// Expose globally for use from non-module game.js
window.BattleAdapter = BattleAdapter;
