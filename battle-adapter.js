/**
 * BattleAdapter - Wrapper for @pkmn/sim Pokemon Showdown battle engine
 * Uses synchronous Battle API instead of streams
 */

import { Battle } from '@pkmn/sim';
import { Dex } from '@pkmn/dex';
import { toPSName } from './species-mapping.js';

export class BattleAdapter {
    constructor() {
        this.battle = null;
    }

    /**
     * Initialize a new battle between player and enemy
     * @param {Object} playerPokemon - Our Pokemon object
     * @param {Object} enemyPokemon - Enemy Pokemon object  
     * @returns {Battle} PS Battle instance
     */
    initBattle(playerPokemon, enemyPokemon) {
        // Convert our Pokemon to PS format
        const p1Team = this.toPSSet(playerPokemon, 'p1');
        const p2Team = this.toPSSet(enemyPokemon, 'p2');

        // Create battle directly (synchronous)
        this.battle = new Battle({
            formatid: 'gen5customgame',
            p1: { name: 'Player', team: p1Team },
            p2: { name: 'Enemy', team: p2Team }
        });

        // Start the battle
        this.battle.start();
        
        return this.battle;
    }

    /**
     * Convert our Pokemon to a PS PokemonSet
     */
    toPSSet(pokemon, side) {
        const speciesName = pokemon.species?.name || pokemon.species || pokemon.name;
        const psSpeciesName = toPSName(speciesName);
        const dex = Dex.species.get(psSpeciesName);
        
        // Get move names in PS format
        const moves = pokemon.moves.map(m => {
            const moveId = typeof m === 'string' ? m : (m.id || m.name);
            const moveDex = Dex.moves.get(moveId);
            return moveDex?.name || moveId;
        });

        return [{
            species: dex.name || psSpeciesName,
            level: pokemon.level || 5,
            moves: moves,
            ability: pokemon.ability || 'No Ability',
            nature: 'Hardy',
            ivs: { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 },
            evs: { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 }
        }];
    }

    /**
     * Execute player move through PS engine
     * @param {string} moveId - Move ID (e.g., 'tackle', 'ember')
     * @returns {Object} Battle result with damage, effects, etc.
     */
    executePlayerMove(moveId) {
        if (!this.battle) throw new Error('Battle not initialized');

        const moveSlot = this.findMoveSlot('p1', moveId);
        
        // Store HP before move for damage calculation
        const enemyBefore = this.battle.p2.active[0]?.hp || 0;
        const playerBefore = this.battle.p1.active[0]?.hp || 0;
        
        // Execute player move
        this.battle.choose('p1', `move ${moveSlot}`);
        
        // Execute enemy move (random)
        const enemy = this.battle.p2.active[0];
        const moveCount = enemy.moveSlots.filter(m => m.pp > 0).length;
        const randomSlot = Math.floor(Math.random() * moveCount) + 1;
        this.battle.choose('p2', `move ${randomSlot}`);
        
        // Commit the turn (synchronous)
        
        // Calculate results
        const enemyAfter = this.battle.p2.active[0]?.hp || 0;
        const playerAfter = this.battle.p1.active[0]?.hp || 0;
        
        const damage = enemyBefore - enemyAfter;
        const playerDamage = playerBefore - playerAfter;
        
        const dexMove = Dex.moves.get(moveId);
        
        return {
            damage: damage,
            moveName: dexMove?.name || moveId,
            effectiveness: this.calculateEffectiveness(dexMove?.type, this.battle.p2.active[0]),
            crit: false, // Would need deeper log inspection
            flinched: false,
            recoil: 0,
            drain: 0,
            statusApplied: this.battle.p2.active[0]?.status,
            targetFainted: enemyAfter <= 0,
            playerDamage: playerDamage,
            playerFainted: playerAfter <= 0
        };
    }

    /**
     * Execute enemy move (when player switches or uses item)
     * @returns {Object} Battle result
     */
    executeEnemyMove() {
        if (!this.battle) throw new Error('Battle not initialized');

        const playerBefore = this.battle.p1.active[0]?.hp || 0;
        
        // Enemy chooses move
        const enemy = this.battle.p2.active[0];
        const moveCount = enemy.moveSlots.filter(m => m.pp > 0).length;
        const randomSlot = Math.floor(Math.random() * moveCount) + 1;
        
        this.battle.choose('p2', `move ${randomSlot}`);
        this.battle.choose('p1', 'pass'); // Player passes turn
        
        const playerAfter = this.battle.p1.active[0]?.hp || 0;
        
        return {
            damage: playerBefore - playerAfter,
            moveName: enemy.moveSlots[randomSlot - 1]?.move || 'Attack',
            effectiveness: 1,
            crit: false,
            flinched: false,
            recoil: 0,
            drain: 0,
            statusApplied: this.battle.p1.active[0]?.status,
            targetFainted: playerAfter <= 0
        };
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
        
        const typeChart = Dex.data.TypeChart;
        const species = Dex.species.get(defender.species);
        
        let effectiveness = 1;
        
        // Check against both types
        [species.types[0], species.types[1]].filter(Boolean).forEach(defType => {
            if (typeChart[attackType]?.damageTaken?.[defType] !== undefined) {
                effectiveness *= typeChart[attackType].damageTaken[defType];
            }
        });
        
        return effectiveness;
    }

    /**
     * Update our Pokemon state from PS battle state
     */
    syncToOurPokemon(ourPokemon, side) {
        if (!this.battle) return;
        
        const psPokemon = side === 'p1' ? this.battle.p1.active[0] : this.battle.p2.active[0];
        if (!psPokemon) return;
        
        ourPokemon.hp = psPokemon.hp;
        ourPokemon.status = psPokemon.status;
        
        // Sync stat boosts
        for (const [stat, boost] of Object.entries(psPokemon.boosts)) {
            const ourStat = { 
                atk: 'attack', def: 'defense', spa: 'specialAttack', 
                spd: 'specialDefense', spe: 'speed', accuracy: 'accuracy', evasion: 'evasion'
            }[stat];
            if (ourStat) {
                ourPokemon.statStages[ourStat] = boost;
            }
        }
    }

    /**
     * End battle and cleanup
     */
    endBattle() {
        if (this.battle) {
            this.battle.destroy();
        }
        this.battle = null;
    }
}

// Expose globally for use from non-module game.js
window.BattleAdapter = BattleAdapter;
