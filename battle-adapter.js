/**
 * BattleAdapter - Wrapper for @pkmn/sim Pokemon Showdown battle engine
 * Translates between our game state and PS battle format
 */

import { Battle } from '@pkmn/sim';
import { Dex } from '@pkmn/dex';

export class BattleAdapter {
    constructor() {
        this.battle = null;
        this.stream = null;
    }

    /**
     * Initialize a new battle between player and enemy
     * @param {Object} playerPokemon - Our Pokemon object
     * @param {Object} enemyPokemon - Enemy Pokemon object  
     * @returns {Battle} PS Battle instance
     */
    initBattle(playerPokemon, enemyPokemon) {
        // Convert our Pokemon to PS format
        const p1 = this.toPSSpecies(playerPokemon, 'p1');
        const p2 = this.toPSSpecies(enemyPokemon, 'p2');

        // Create battle stream
        this.stream = new Battle({
            formatid: 'gen9customgame',
            p1: { name: 'Player', team: [p1] },
            p2: { name: 'Enemy', team: [p2] }
        });

        this.battle = this.stream.battle;
        return this.battle;
    }

    /**
     * Convert our Pokemon format to PS species format
     */
    toPSSpecies(pokemon, side) {
        const dex = Dex.species.get(pokemon.species.name || pokemon.species);
        
        return {
            species: dex.name,
            level: pokemon.level,
            moves: pokemon.moves.map(m => {
                const moveDex = Dex.moves.get(m.id);
                return moveDex.name;
            }),
            ability: pokemon.ability || 'none',
            // Calculate stats from base stats and level
            hp: pokemon.maxHp,
            atk: pokemon.attack,
            def: pokemon.defense,
            spa: pokemon.specialAttack,
            spd: pokemon.specialDefense,
            spe: pokemon.speed
        };
    }

    /**
     * Execute player move through PS engine
     * @param {string} moveId - Move ID (e.g., 'tackle', 'ember')
     * @returns {Object} Battle result with damage, effects, etc.
     */
    executePlayerMove(moveId) {
        if (!this.battle) throw new Error('Battle not initialized');

        // Find move slot
        const moveSlot = this.findMoveSlot('p1', moveId);
        
        // Send command to PS
        this.stream.write(`>p1 move ${moveSlot}`);
        
        // Get battle output
        const output = this.stream.read();
        
        // Parse PS output into our result format
        return this.parsePSOutput(output, 'p1');
    }

    /**
     * Execute enemy move (AI choice)
     * @returns {Object} Battle result
     */
    executeEnemyMove() {
        if (!this.battle) throw new Error('Battle not initialized');

        // Get enemy's active Pokemon
        const enemy = this.battle.p2.active[0];
        
        // Random move selection (keep our existing AI)
        const moveCount = enemy.moveSlots.filter(m => m.pp > 0).length;
        const randomSlot = Math.floor(Math.random() * moveCount) + 1;
        
        // Send command
        this.stream.write(`>p2 move ${randomSlot}`);
        
        // Get output
        const output = this.stream.read();
        
        return this.parsePSOutput(output, 'p2');
    }

    /**
     * Find which slot a move is in
     */
    findMoveSlot(side, moveId) {
        const pokemon = side === 'p1' ? this.battle.p1.active[0] : this.battle.p2.active[0];
        const dexMove = Dex.moves.get(moveId);
        
        for (let i = 0; i < pokemon.moveSlots.length; i++) {
            if (pokemon.moveSlots[i].id === moveId || 
                pokemon.moveSlots[i].move === dexMove.name) {
                return i + 1; // PS uses 1-indexed slots
            }
        }
        return 1; // Default to first move
    }

    /**
     * Parse Pokemon Showdown output into our result format
     */
    parsePSOutput(output, attackerSide) {
        const result = {
            damage: 0,
            effectiveness: 1, // Will calculate from type matchup
            crit: false,
            moveName: '',
            flinched: false,
            recoil: 0,
            drain: 0,
            statusApplied: null,
            targetFainted: false,
            logs: []
        };

        // Parse PS protocol messages
        for (const line of output.split('\n')) {
            if (!line) continue;
            
            const parts = line.split('|');
            const cmd = parts[1];
            
            switch (cmd) {
                case 'move':
                    result.moveName = parts[3];
                    break;
                    
                case 'damage':
                    // Parse damage amount
                    const damageMatch = line.match(/\[.*?\] (\d+)/);
                    if (damageMatch) {
                        result.damage = parseInt(damageMatch[1]);
                    }
                    break;
                    
                case 'crit':
                    result.crit = true;
                    break;
                    
                case 'flinch':
                    result.flinched = true;
                    break;
                    
                case 'status':
                    result.statusApplied = parts[3];
                    break;
                    
                case 'faint':
                    result.targetFainted = true;
                    break;
                    
                case 'heal':
                    // Drain healing
                    if (parts[2].includes(attackerSide)) {
                        const healMatch = line.match(/\[.*?\] (\d+)/);
                        if (healMatch) {
                            result.drain = parseInt(healMatch[1]);
                        }
                    }
                    break;
                    
                case 'damage':
                    // Recoil damage to self
                    if (parts[2].includes(attackerSide)) {
                        const recoilMatch = line.match(/\[from\] Recoil/);
                        if (recoilMatch) {
                            const dmgMatch = line.match(/\[.*?\] (\d+)/);
                            if (dmgMatch) {
                                result.recoil = parseInt(dmgMatch[1]);
                            }
                        }
                    }
                    break;
                    
                case 'supereffective':
                    result.effectiveness = 2;
                    break;
                    
                case 'resisted':
                    result.effectiveness = 0.5;
                    break;
                    
                case 'immune':
                    result.effectiveness = 0;
                    break;
            }
            
            result.logs.push(line);
        }

        return result;
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
        if (this.stream) {
            this.stream.end();
        }
        this.battle = null;
        this.stream = null;
    }
}

export default BattleAdapter;
