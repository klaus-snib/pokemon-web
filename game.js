// Pokemon Roguelike - Game Logic

class Pokemon {
    constructor(speciesId, level) {
        this.speciesId = speciesId;
        this.species = POKEMON_DATA[speciesId];
        this.name = this.species.name;
        this.nickname = null;
        this.type = this.species.type;
        this.level = level;
        this.xp = 0;
        this.xpToNext = this.calcXpToNext();

        // Calculate stats based on level
        const base = this.species.baseStats;
        this.maxHp = Math.floor((base.hp * 2 * level) / 100) + level + 10;
        this.hp = this.maxHp;
        this.attack = Math.floor((base.atk * 2 * level) / 100) + 5;
        this.defense = Math.floor((base.def * 2 * level) / 100) + 5;
        this.speed = Math.floor((base.spd * 2 * level) / 100) + 5;
        // specialAttack and specialDefense are calculated via getters

        // Get canonical moves from learnset
        this.moves = this.generateStartingMoves();

        // Status conditions
        this.status = null; // 'burn', 'poison', 'paralyze', 'sleep', 'freeze'
        this.statusTurns = 0; // For sleep/freeze duration

        // Stat stages (-6 to +6, default 0)
        this.statStages = {
            attack: 0,
            defense: 0,
            specialAttack: 0,
            specialDefense: 0,
            speed: 0,
            accuracy: 0,
            evasion: 0
        };

        // Ability
        this.ability = this.species.ability || null;
    }

    // Apply stat boosts from a move
    applyStatBoosts(boosts, clauseTracker, isPlayer) {
        if (!boosts) return [];
        const changes = [];
        const statNames = {
            attack: 'Atk',
            defense: 'Def',
            specialAttack: 'SpA',
            specialDefense: 'SpD',
            speed: 'Spe',
            accuracy: 'Acc',
            evasion: 'Eva'
        };

        for (const [stat, change] of Object.entries(boosts)) {
            if (this.statStages[stat] !== undefined) {
                // Check evasion clause
                if (stat === 'evasion' && clauseTracker && change > 0) {
                    if (!clauseTracker.canBoostEvasion(isPlayer)) {
                        // Evasion clause would be violated - skip this boost
                        continue;
                    }
                    clauseTracker.incrementClause(SMGON_CLAUSES.EVASION, isPlayer);
                }

                const oldStage = this.statStages[stat];
                this.statStages[stat] = Math.max(-6, Math.min(6, this.statStages[stat] + change));
                const actualChange = this.statStages[stat] - oldStage;
                if (actualChange !== 0) {
                    changes.push({
                        stat: statNames[stat] || stat,
                        change: actualChange,
                        stage: this.statStages[stat]
                    });
                }
            }
        }
        return changes;
    }

    // Get modified stat with stage multiplier
    getStatWithStage(statName, baseValue) {
        const stage = this.statStages[statName] || 0;
        if (stage === 0) return baseValue;
        // Gen 3+ formula: multiplier = (2 + stage) / 2 for positive, 2 / (2 - stage) for negative
        const multiplier = stage > 0 ? (2 + stage) / 2 : 2 / (2 - stage);
        return Math.floor(baseValue * multiplier);
    }

    // Apply status damage (burn/poison) at end of turn
    applyStatusDamage() {
        if (!this.status || this.hp <= 0) return 0;

        let damage = 0;
        if (this.status === 'poison') {
            damage = Math.floor(this.maxHp * 0.125); // 1/8 max HP
            this.hp = Math.max(1, this.hp - damage);
        } else if (this.status === 'burn') {
            damage = Math.floor(this.maxHp * 0.0625); // 1/16 max HP
            this.hp = Math.max(1, this.hp - damage);
        }

        return damage;
    }

    // Check if can move (paralysis, sleep, freeze)
    canMove() {
        if (this.status === 'sleep') {
            this.statusTurns--;
            if (this.statusTurns <= 0) {
                this.status = null;
                return { canMove: true, message: `${this.displayName} woke up!` };
            }
            return { canMove: false, message: `${this.displayName} is fast asleep!` };
        }

        if (this.status === 'freeze') {
            // 20% chance to thaw
            if (Math.random() < 0.2) {
                this.status = null;
                return { canMove: true, message: `${this.displayName} thawed out!` };
            }
            return { canMove: false, message: `${this.displayName} is frozen solid!` };
        }

        if (this.status === 'paralyze') {
            // 25% chance to be fully paralyzed
            if (Math.random() < 0.25) {
                return { canMove: false, message: `${this.displayName} is paralyzed! It can't move!` };
            }
        }

        return { canMove: true };
    }

    // Apply stat modifiers from status
    getModifiedAttack() {
        if (this.status === 'burn') {
            return Math.floor(this.attack * 0.5); // Burn halves attack
        }
        return this.attack;
    }

    getModifiedSpeed() {
        if (this.status === 'paralyze') {
            return Math.floor(this.speed * 0.25); // Paralysis quarters speed
        }
        return this.speed;
    }

    // Generate starting moves from learnset (up to 4 moves available at current level)
    generateStartingMoves() {
        // Check if canonical learnset exists
        if (typeof LEARNSETS !== 'undefined' && LEARNSETS[this.speciesId]) {
            const learnset = LEARNSETS[this.speciesId];
            // Get moves available at current level or below
            const availableMoves = learnset
                .filter(entry => entry.level <= this.level)
                .slice(-4); // Take last 4 (most recent)

            // Map to move data
            return availableMoves.map(entry => {
                const moveData = (typeof CANONICAL_MOVES !== 'undefined' && CANONICAL_MOVES[entry.move])
                    ? CANONICAL_MOVES[entry.move]
                    : null;
                if (moveData) {
                    return {
                        id: entry.move,
                        name: moveData.name,
                        type: moveData.type,
                        power: moveData.power,
                        fixedDamage: moveData.fixedDamage,
                        pp: moveData.pp,
                        maxPp: moveData.pp,
                        accuracy: moveData.accuracy,
                        category: moveData.category,
                        boosts: moveData.boosts,
                        secondary: moveData.secondary
                    };
                }
                // Fallback if move not in database
                return {
                    id: entry.move,
                    name: entry.move.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
                    type: this.type,
                    power: 50,
                    pp: 15,
                    maxPp: 15,
                    accuracy: 100,
                    category: 'physical'
                };
            });
        }

        // Fallback to old system if no learnset
        return getMovesForPokemon(this.type);
    }

    calcXpToNext() {
        return Math.floor(this.level * 15 + 40);
    }

    get displayName() {
        return this.nickname || this.name;
    }

    get hpPercent() {
        return (this.hp / this.maxHp) * 100;
    }

    get isAlive() {
        return this.hp > 0;
    }

    takeDamage(amount) {
        this.hp = Math.max(0, this.hp - amount);
        return this.hp === 0;
    }

    heal(amount) {
        this.hp = Math.min(this.maxHp, this.hp + amount);
    }

    // Special Attack and Special Defense getters for physical/special split
    // Uses real Foul Play dataset values
    get specialAttack() {
        const base = this.species;
        // Try various property names for special attack
        const spa = base.spa !== undefined ? base.spa :
                    base['special-attack'] !== undefined ? base['special-attack'] :
                    50; // Default fallback
        return Math.floor((spa * 2 * this.level) / 100) + 5;
    }

    get specialDefense() {
        const base = this.species;
        // Try various property names for special defense
        const spd = base.spd_def !== undefined ? base.spd_def :
                    base['special-defense'] !== undefined ? base['special-defense'] :
                    50; // Default fallback
        return Math.floor((spd * 2 * this.level) / 100) + 5;
    }

    addXp(amount, levelCap) {
        this.xp += amount;
        const evolutions = [];
        while (this.xp >= this.xpToNext) {
            // Stop leveling at cap
            if (levelCap && this.level >= levelCap) {
                this.xp = this.xpToNext - 1; // Freeze XP just under threshold
                break;
            }
            this.xp -= this.xpToNext;
            const evo = this.levelUp();
            this.xpToNext = this.calcXpToNext();
            if (evo) {
                const oldName = this.name;
                this.evolve(evo);
                evolutions.push({ from: oldName, to: this.name, speciesId: this.speciesId });
            }
        }
        return evolutions;
    }

    levelUp() {
        this.level++;
        const base = this.species.baseStats;
        const oldMaxHp = this.maxHp;
        this.maxHp = Math.floor((base.hp * 2 * this.level) / 100) + this.level + 10;
        this.hp += (this.maxHp - oldMaxHp);
        this.attack = Math.floor((base.atk * 2 * this.level) / 100) + 5;
        this.defense = Math.floor((base.def * 2 * this.level) / 100) + 5;
        this.speed = Math.floor((base.spd * 2 * this.level) / 100) + 5;

        // Check for new moves to learn
        this.checkAndLearnNewMoves();

        // Check evolution - probabilistic system
        const evo = this.species.evolves;
        if (evo) {
            // Stone and trade (with Link Cable) evolutions are immediate
            if (evo.stone || evo.trade) {
                // These are handled by item use, not level-up
                return null;
            }

            // Level-based evolution with probability
            if (evo.level) {
                const canonicalLevel = evo.level;
                const rollStartLevel = canonicalLevel - 5;

                // Start rolling 5 levels before canonical
                if (this.level >= rollStartLevel) {
                    // Base 20% chance, +1% per level above roll start
                    const levelsPastStart = this.level - rollStartLevel;
                    const evolutionChance = 20 + levelsPastStart;

                    // Roll for evolution
                    if (Math.random() * 100 < evolutionChance) {
                        return evo.into;
                    }
                }
            }
        }
        return null;
    }

    // Check for new moves at current level and learn them
    checkAndLearnNewMoves() {
        if (typeof LEARNSETS === 'undefined' || !LEARNSETS[this.speciesId]) {
            return; // No learnset available
        }

        const learnset = LEARNSETS[this.speciesId];
        const newMoves = learnset.filter(entry => entry.level === this.level);

        for (const entry of newMoves) {
            // Check if already knows this move
            if (this.moves.some(m => m.id === entry.move)) {
                continue;
            }

            // Get move data
            const moveData = (typeof CANONICAL_MOVES !== 'undefined' && CANONICAL_MOVES[entry.move])
                ? CANONICAL_MOVES[entry.move]
                : null;

            const newMove = moveData ? {
                id: entry.move,
                name: moveData.name,
                type: moveData.type,
                power: moveData.power,
                pp: moveData.pp,
                maxPp: moveData.pp,
                accuracy: moveData.accuracy,
                category: moveData.category,
                boosts: moveData.boosts,
                secondary: moveData.secondary,
                fixedDamage: moveData.fixedDamage
            } : {
                id: entry.move,
                name: entry.move.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
                type: this.type,
                power: 50,
                pp: 15,
                maxPp: 15,
                accuracy: 100,
                category: 'physical'
            };

            // If less than 4 moves, just add it
            if (this.moves.length < 4) {
                this.moves.push(newMove);
                // Store for notification (game will handle displaying this)
                if (typeof game !== 'undefined' && game.addMessage) {
                    game.addMessage(`${this.displayName} learned ${newMove.name}!`, 'success');
                }
            } else {
                // At 4 moves - would need to forget one (simplified: auto-replace last move)
                // In future: prompt player which move to forget
                const oldMove = this.moves[3];
                this.moves[3] = newMove;
                if (typeof game !== 'undefined' && game.addMessage) {
                    game.addMessage(`${this.displayName} learned ${newMove.name}! Forgot ${oldMove.name}.`, 'warning');
                }
            }
        }
    }

    evolve(newSpeciesId) {
        this.speciesId = newSpeciesId;
        this.species = POKEMON_DATA[newSpeciesId];
        this.name = this.species.name;
        this.type = this.species.type;

        // Recalculate stats with new base stats
        const base = this.species.baseStats;
        const hpRatio = this.hp / this.maxHp;
        this.maxHp = Math.floor((base.hp * 2 * this.level) / 100) + this.level + 10;
        this.hp = Math.max(1, Math.floor(this.maxHp * hpRatio));
        this.attack = Math.floor((base.atk * 2 * this.level) / 100) + 5;
        this.defense = Math.floor((base.def * 2 * this.level) / 100) + 5;
        this.speed = Math.floor((base.spd * 2 * this.level) / 100) + 5;
    }

    toJSON() {
        return {
            speciesId: this.speciesId,
            nickname: this.nickname,
            level: this.level,
            xp: this.xp,
            hp: this.hp,
            maxHp: this.maxHp,
            attack: this.attack,
            defense: this.defense,
            speed: this.speed,
            moves: this.moves
        };
    }

    static fromJSON(data) {
        const p = new Pokemon(data.speciesId, data.level);
        p.nickname = data.nickname;
        p.xp = data.xp || 0;
        p.hp = data.hp;
        p.maxHp = data.maxHp;
        p.attack = data.attack;
        p.defense = data.defense;
        p.speed = data.speed;
        // Restore moves or generate fresh (backward compat)
        p.moves = data.moves || getMovesForPokemon(p.type);
        return p;
    }
}

// ===== ACHIEVEMENT DEFINITIONS =====
const ACHIEVEMENTS = {
    champion: { name: "Champion", desc: "Beat the game", icon: "👑" },
    flawless: { name: "Flawless", desc: "Win without losing a strike", icon: "💎" },
    survivor: { name: "Survivor", desc: "Win with 1 strike remaining", icon: "🩹" },
    speedrunner: { name: "Speedrunner", desc: "Win in under 50 events", icon: "⚡" },
    first_catch: { name: "First Catch", desc: "Catch your first Pokemon", icon: "🔴" },
    squad_goals: { name: "Squad Goals", desc: "Have a full team of 6", icon: "👥" },
    master_angler: { name: "Master Angler", desc: "Catch 3 fishing Pokemon", icon: "🎣" },
    evolution: { name: "Evolution", desc: "Evolve a Pokemon", icon: "🧬" },
    loaded: { name: "Loaded", desc: "Have $10,000 at once", icon: "💰" },
    fossil_hunter: { name: "Fossil Hunter", desc: "Obtain a fossil Pokemon", icon: "🦴" },
    high_roller: { name: "High Roller", desc: "Win the gambler's game", icon: "🎰" },
    starter_collector: { name: "Starter Collector", desc: "Have 3+ different starters", icon: "🌟" },
    underdog: { name: "Underdog", desc: "Beat a gym with lower-level Pokemon", icon: "💪" },
    lucky: { name: "Lucky", desc: "Find a legendary Pokemon", icon: "🍀" },
    tower_5: { name: "Tower Climber", desc: "Reach Battle Tower floor 5", icon: "🗼" },
    tower_10: { name: "Tower Master", desc: "Reach Battle Tower floor 10", icon: "🏆" },
    safari_catch: { name: "Safari Pro", desc: "Catch a Pokemon in Safari Zone", icon: "🦒" },
    rocket_buster: { name: "Rocket Buster", desc: "Defeat Team Rocket", icon: "🚀" },
    type_master: { name: "Type Master", desc: "Have 5+ different types on your team", icon: "🌈" },
    nightmare_clear: { name: "Nightmare Survivor", desc: "Beat the game on Nightmare", icon: "💀" },
    hard_clear: { name: "Hard Mode", desc: "Beat the game on Hard", icon: "🔥" }
};

// ===== TRAINER DATA =====
const NPC_TRAINERS = [
    // Early game (no badge req)
    { name: "Bug Catcher Doug", team: ['caterpie', 'weedle'], levelMod: -2, reward: 200 },
    { name: "Bug Catcher Sam", team: ['spinarak', 'caterpie'], levelMod: -2, reward: 200 },
    { name: "Youngster Joey", team: ['rattata'], levelMod: -1, reward: 150 },
    { name: "Youngster Mikey", team: ['sentret', 'pidgey'], levelMod: -1, reward: 200 },
    { name: "Lass Jenny", team: ['nidoran_m', 'pidgey'], levelMod: -1, reward: 300 },
    { name: "Lass Dana", team: ['oddish', 'clefairy'], levelMod: -1, reward: 300 },
    { name: "Hiker Marcus", team: ['geodude', 'machop'], levelMod: 0, reward: 400 },
    { name: "Hiker Trent", team: ['geodude', 'geodude', 'machop'], levelMod: 0, reward: 450 },
    { name: "Swimmer Lisa", team: ['staryu', 'psyduck'], levelMod: 0, reward: 400 },
    { name: "Swimmer Brian", team: ['tentacool', 'poliwag'], levelMod: 0, reward: 400 },
    { name: "Picnicker Liz", team: ['oddish', 'hoppip'], levelMod: -1, reward: 250 },
    { name: "Camper Todd", team: ['sentret', 'hoothoot'], levelMod: -1, reward: 250 },
    { name: "Firebreather Walt", team: ['growlithe', 'vulpix'], levelMod: 0, reward: 450 },
    // Mid game (1-2 badges)
    { name: "Psychic Frank", team: ['abra', 'gastly'], levelMod: 1, reward: 500 },
    { name: "Psychic Jenna", team: ['abra', 'misdreavus'], levelMod: 1, reward: 500 },
    { name: "Pokefan Ruth", team: ['clefairy', 'snubbull'], levelMod: 0, reward: 400, minBadges: 1 },
    { name: "Sailor Duncan", team: ['machop', 'tentacool', 'poliwag'], levelMod: 1, reward: 500, minBadges: 1 },
    { name: "Super Nerd Pat", team: ['mareep', 'gastly'], levelMod: 1, reward: 500, minBadges: 1 },
    { name: "Medium Martha", team: ['gastly', 'misdreavus'], levelMod: 1, reward: 550, minBadges: 1 },
    // Late game (2+ badges)
    { name: "Ace Trainer Zoe", team: ['pidgeotto', 'machoke', 'kadabra'], levelMod: 2, reward: 800, minBadges: 2 },
    { name: "Ace Trainer Gaven", team: ['flaaffy', 'nidorino', 'houndour'], levelMod: 2, reward: 800, minBadges: 2 },
    { name: "Cooltrainer Rex", team: ['graveler', 'haunter', 'charmeleon'], levelMod: 3, reward: 1000, minBadges: 2 },
    { name: "Cooltrainer Beth", team: ['ariados', 'granbull', 'quilava'], levelMod: 3, reward: 1000, minBadges: 2 },
    { name: "Blackbelt Kenji", team: ['machoke', 'machop', 'machoke'], levelMod: 2, reward: 700, minBadges: 2 },
    // Endgame (3+ badges)
    { name: "Veteran Hana", team: ['gyarados', 'pidgeot', 'machoke'], levelMod: 4, reward: 1200, minBadges: 3 },
    { name: "Veteran Knox", team: ['arcanine', 'nidoking', 'kadabra'], levelMod: 4, reward: 1200, minBadges: 3 },
    { name: "Dragon Tamer Clair", team: ['gyarados', 'gyarados'], levelMod: 5, reward: 1500, minBadges: 4 },
    { name: "Team Rocket Grunt", team: ['houndour', 'murkrow', 'rattata'], levelMod: 1, reward: 600, minBadges: 1 },
    { name: "Team Rocket Admin", team: ['houndoom', 'nidoking', 'murkrow'], levelMod: 4, reward: 1400, minBadges: 4 },
];

const RIVAL_NAMES = ["Blue", "Silver", "Gary", "Damian", "Brendan", "May", "Barry", "Hugh"];

// Drag and Drop Manager for Mobile UX
class DragDropManager {
    constructor(container, onReorder) {
        this.container = container;
        this.onReorder = onReorder;
        this.draggedElement = null;
        this.ghostElement = null;
        this.startIndex = -1;
        this.currentIndex = -1;
        this.touchStartY = 0;
        this.touchCurrentY = 0;
        this.isDragging = false;
        this.dragThreshold = 10;
        this.longPressDelay = 200;
        this.longPressTimer = null;

        this.init();
    }

    init() {
        this.container.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: false });
        this.container.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
        this.container.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: true });
        this.container.addEventListener('touchcancel', this.handleTouchEnd.bind(this), { passive: true });

        // Mouse fallback for desktop testing
        this.container.addEventListener('mousedown', this.handleMouseDown.bind(this));
        document.addEventListener('mousemove', this.handleMouseMove.bind(this));
        document.addEventListener('mouseup', this.handleMouseUp.bind(this));
    }

    getCardIndex(element) {
        const cards = Array.from(this.container.querySelectorAll('.team-card'));
        return cards.indexOf(element.closest('.team-card'));
    }

    handleTouchStart(e) {
        const card = e.target.closest('.team-card');
        if (!card) return;

        this.touchStartY = e.touches[0].clientY;
        this.startIndex = this.getCardIndex(card);
        this.currentIndex = this.startIndex;
        this.isDragging = false;

        // Start long press timer
        this.longPressTimer = setTimeout(() => {
            this.startDrag(card, e.touches[0].clientY);
        }, this.longPressDelay);
    }

    handleTouchMove(e) {
        if (this.startIndex === -1) return;

        this.touchCurrentY = e.touches[0].clientY;
        const deltaY = Math.abs(this.touchCurrentY - this.touchStartY);

        // If moved beyond threshold, cancel long press and start drag immediately
        if (deltaY > this.dragThreshold && !this.isDragging) {
            clearTimeout(this.longPressTimer);
            const card = this.container.querySelectorAll('.team-card')[this.startIndex];
            this.startDrag(card, this.touchCurrentY);
        }

        if (this.isDragging) {
            e.preventDefault();
            this.updateGhostPosition(this.touchCurrentY);
            this.updateDropIndicator(this.touchCurrentY);
        }
    }

    handleTouchEnd(e) {
        clearTimeout(this.longPressTimer);

        if (!this.isDragging) {
            this.reset();
            return;
        }

        if (this.currentIndex !== -1 && this.currentIndex !== this.startIndex) {
            this.onReorder(this.startIndex, this.currentIndex);
            if (navigator.vibrate) navigator.vibrate(10);
        }

        this.endDrag();
    }

    handleMouseDown(e) {
        const card = e.target.closest('.team-card');
        if (!card) return;

        this.isMouse = true;
        this.startIndex = this.getCardIndex(card);
        this.currentIndex = this.startIndex;
        this.startDrag(card, e.clientY);
    }

    handleMouseMove(e) {
        if (!this.isDragging || !this.isMouse) return;
        this.updateGhostPosition(e.clientY);
        this.updateDropIndicator(e.clientY);
    }

    handleMouseUp(e) {
        if (!this.isDragging || !this.isMouse) return;

        if (this.currentIndex !== -1 && this.currentIndex !== this.startIndex) {
            this.onReorder(this.startIndex, this.currentIndex);
        }

        this.endDrag();
        this.isMouse = false;
    }

    startDrag(card, y) {
        this.isDragging = true;
        this.draggedElement = card;

        // Create ghost element
        this.ghostElement = card.cloneNode(true);
        this.ghostElement.classList.add('ghost');
        this.ghostElement.style.width = `${card.offsetWidth}px`;
        this.ghostElement.style.position = 'fixed';
        this.ghostElement.style.zIndex = '1000';
        this.ghostElement.style.pointerEvents = 'none';
        document.body.appendChild(this.ghostElement);

        // Add dragging class to original
        card.classList.add('dragging');

        // Create drop indicators between cards
        this.createDropIndicators();

        // Initial position
        this.updateGhostPosition(y);
    }

    updateGhostPosition(y) {
        if (!this.ghostElement) return;
        const rect = this.draggedElement.getBoundingClientRect();
        this.ghostElement.style.top = `${y - rect.height / 2}px`;
        this.ghostElement.style.left = `${rect.left}px`;
    }

    createDropIndicators() {
        const cards = this.container.querySelectorAll('.team-card');
        cards.forEach((card, i) => {
            if (i === this.startIndex) return;

            const indicator = document.createElement('div');
            indicator.className = 'drop-indicator';
            indicator.dataset.index = i;
            card.parentNode.insertBefore(indicator, card);
        });

        // Add final indicator
        const lastIndicator = document.createElement('div');
        lastIndicator.className = 'drop-indicator';
        lastIndicator.dataset.index = cards.length;
        this.container.appendChild(lastIndicator);
    }

    updateDropIndicator(y) {
        const indicators = this.container.querySelectorAll('.drop-indicator');
        let closestIndex = -1;
        let closestDistance = Infinity;

        indicators.forEach(indicator => {
            const rect = indicator.getBoundingClientRect();
            const distance = Math.abs(rect.top - y);

            if (distance < closestDistance) {
                closestDistance = distance;
                closestIndex = parseInt(indicator.dataset.index);
            }
        });

        // Adjust for the removed card
        if (closestIndex > this.startIndex) {
            closestIndex--;
        }

        this.currentIndex = Math.max(0, Math.min(closestIndex, this.container.querySelectorAll('.team-card').length - 1));

        // Visual feedback
        indicators.forEach(ind => ind.classList.remove('active'));
        const activeIndicator = Array.from(indicators).find(ind => {
            let idx = parseInt(ind.dataset.index);
            if (idx > this.startIndex) idx--;
            return idx === this.currentIndex;
        });
        if (activeIndicator) activeIndicator.classList.add('active');
    }

    endDrag() {
        this.draggedElement?.classList.remove('dragging');
        this.ghostElement?.remove();
        this.container.querySelectorAll('.drop-indicator').forEach(el => el.remove());
        this.reset();
    }

    reset() {
        this.draggedElement = null;
        this.ghostElement = null;
        this.isDragging = false;
        this.startIndex = -1;
        this.currentIndex = -1;
        clearTimeout(this.longPressTimer);
    }

    destroy() {
        // Remove ghost element from body if it exists
        if (this.ghostElement) {
            this.ghostElement.remove();
        }
        // Remove any lingering drop indicators
        this.container?.querySelectorAll('.drop-indicator').forEach(el => el.remove());
        this.reset();
        // Event listeners are automatically cleaned up when container is removed
    }
}

// ===== ABILITY SYSTEM =====
// Passive abilities that trigger during battle
const ABILITY_EFFECTS = {
    intimidate: {
        name: "Intimidate",
        desc: "Lowers foe's Attack on switch-in",
        trigger: 'switchIn',
        effect: (user, foe, battle) => {
            if (foe && foe.statStages) {
                foe.statStages.attack = Math.max(-6, foe.statStages.attack - 1);
                battle.addBattleLog(`${foe.displayName}'s Attack fell!`, 'warning');
                return true;
            }
            return false;
        }
    },
    levitate: {
        name: "Levitate",
        desc: "Immune to Ground-type moves",
        trigger: 'damageCalc',
        effect: (user, attacker, move, battle) => {
            if (move && move.type === 'ground') {
                battle.addBattleLog(`${user.displayName} levitated away!`, 'info');
                return 0; // No damage
            }
            return null; // Normal damage calc
        }
    },
    blaze: {
        name: "Blaze",
        desc: "Boosts Fire moves when HP is low",
        trigger: 'damageCalc',
        effect: (user, attacker, move, battle) => {
            if (move && move.type === 'fire' && user.hp <= user.maxHp * 0.33) {
                battle.addBattleLog(`${user.displayName}'s Blaze boosted the attack!`, 'success');
                return 1.5; // 1.5x multiplier
            }
            return null;
        }
    },
    overgrow: {
        name: "Overgrow",
        desc: "Boosts Grass moves when HP is low",
        trigger: 'damageCalc',
        effect: (user, attacker, move, battle) => {
            if (move && move.type === 'grass' && user.hp <= user.maxHp * 0.33) {
                battle.addBattleLog(`${user.displayName}'s Overgrow boosted the attack!`, 'success');
                return 1.5;
            }
            return null;
        }
    },
    torrent: {
        name: "Torrent",
        desc: "Boosts Water moves when HP is low",
        trigger: 'damageCalc',
        effect: (user, attacker, move, battle) => {
            if (move && move.type === 'water' && user.hp <= user.maxHp * 0.33) {
                battle.addBattleLog(`${user.displayName}'s Torrent boosted the attack!`, 'success');
                return 1.5;
            }
            return null;
        }
    },
    static: {
        name: "Static",
        desc: "May paralyze on contact",
        trigger: 'onHit',
        effect: (user, attacker, move, battle) => {
            if (move && move.category === 'physical' && Math.random() < 0.3) {
                if (!attacker.status && battle.clauseTracker.canApplySleep(battle.team[0] === attacker)) {
                    attacker.status = 'paralyze';
                    battle.addBattleLog(`${attacker.displayName} was paralyzed by Static!`, 'warning');
                    return true;
                }
            }
            return false;
        }
    },
    guts: {
        name: "Guts",
        desc: "Boosts Attack when statused",
        trigger: 'damageCalc',
        effect: (user, attacker, move, battle) => {
            if (user.status && move && move.category === 'physical') {
                return 1.5; // 1.5x physical damage when statused
            }
            return null;
        }
    },
    swiftswim: {
        name: "Swift Swim",
        desc: "Doubles Speed in rain (simulated as always active for now)",
        trigger: 'speedCalc',
        effect: (user) => {
            return 2.0; // 2x speed multiplier
        }
    },
    clearbody: {
        name: "Clear Body",
        desc: "Prevents stat drops from foe moves",
        trigger: 'statDrop',
        effect: (user, stat, battle) => {
            battle.addBattleLog(`${user.displayName}'s Clear Body prevented stat drop!`, 'info');
            return false; // Prevent the drop
        }
    },
    sturdy: {
        name: "Sturdy",
        desc: "Survives a 1HKO with 1 HP",
        trigger: 'onDamage',
        effect: (user, damage, battle) => {
            if (user.hp === user.maxHp && damage >= user.hp) {
                battle.addBattleLog(`${user.displayName} hung on with Sturdy!`, 'success');
                return user.hp - 1; // Leave 1 HP
            }
            return damage;
        }
    }
};

class Game {
    constructor() {
        this.state = 'start';
        this.team = [];
        this.bag = {};
        this.tmBag = [];  // Technical Machines inventory
        this.money = 1000;
        this.badges = 0;
        this.strikes = 3;
        this.maxStrikes = 3;
        this.difficulty = 'normal';
        this.currentGym = 0;
        this.badgesNeeded = 8;
        this.selectedStarter = null;

        // Battle state
        this.battleEnemy = null;
        this.battleEnemyTeam = [];
        this.battleType = null;
        this.battleReward = null;
        this.activePokemonIndex = 0;
        this.battleTurnInProgress = false;
        this.awaitingFaintSwitch = false;
        this.battleWon = false; // Prevents player fainting after victory

        // Stats
        this.catches = 0;
        this.fishCatches = 0;
        this.battlesWon = 0;
        this.eventsExplored = 0;
        this.evolutionCount = 0;
        this.startTime = Date.now();

        // Achievements
        this.achievements = new Set();

        // Rival
        this.rivalName = RIVAL_NAMES[Math.floor(Math.random() * RIVAL_NAMES.length)];
        this.rivalStarter = null;
        this.lastRivalBadge = 0;

        // Hall of Fame
        this.hallOfFame = this.loadHallOfFame();

        // Post-game
        this.postGame = false;
        this.towerWins = 0;

        // Elite Four + Champion gauntlet
        this.eliteFour = typeof shuffleEliteFour === 'function' ? shuffleEliteFour() : [];
        this.champion = typeof shuffleChampion === 'function' ? shuffleChampion() : null;
        this.e4Progress = 0; // 0-3 = E4 members, 4 = champion
        this.inE4 = false;

        // Route environments - shuffled per run, rotate every 2 badges
        this.routes = typeof shuffleRoutes === 'function' ? shuffleRoutes() : [];
        this.currentRouteIndex = 0;

        this.init();
    }

    // ===== SPECIES CLAUSE VALIDATION =====
    // Check if a species can be added to the team (Species Clause enforcement)
    canAddSpeciesToTeam(speciesId) {
        // Species Clause: No duplicate species per team
        return !this.team.some(p => p.speciesId === speciesId);
    }

    // Get list of duplicate species in a team array (for validation)
    getDuplicateSpecies(teamArray) {
        const seen = new Set();
        const duplicates = [];
        for (const pokemon of teamArray) {
            const id = pokemon.speciesId || pokemon;
            if (seen.has(id)) {
                duplicates.push(id);
            } else {
                seen.add(id);
            }
        }
        return duplicates;
    }

    // Validate team against Species Clause (for tournament teams)
    validateTeamSpeciesClause(teamArray, teamName = 'Team') {
        const duplicates = this.getDuplicateSpecies(teamArray);
        if (duplicates.length > 0) {
            const uniqueDups = [...new Set(duplicates)];
            console.warn(`${teamName} violates Species Clause: duplicate ${uniqueDups.join(', ')}`);
            return false;
        }
        return true;
    }

    // Helper to generate type badge HTML (supports dual typing)
    getTypeBadges(pokemon) {
        const types = [pokemon.type];
        if (pokemon.species && pokemon.species.type2) {
            types.push(pokemon.species.type2);
        }
        return types.map(t => 
            `<span class="type-badge type-bg-${t.toLowerCase()}">${t}</span>`
        ).join('');
    }
    saveGame() {
        if (this.state === 'start' || this.state === 'gameover') return;
        const data = {
            state: this.state,
            team: this.team.map(p => p.toJSON()),
            bag: this.bag,
            money: this.money,
            badges: this.badges,
            strikes: this.strikes,
            maxStrikes: this.maxStrikes,
            difficulty: this.difficulty,
            currentGym: this.currentGym,
            badgesNeeded: this.badgesNeeded,
            maxEvents: this.maxEvents,
            catches: this.catches,
            fishCatches: this.fishCatches,
            battlesWon: this.battlesWon,
            eventsExplored: this.eventsExplored,
            evolutionCount: this.evolutionCount,
            startTime: this.startTime,
            achievements: [...this.achievements],
            rivalName: this.rivalName,
            rivalStarter: this.rivalStarter,
            lastRivalBadge: this.lastRivalBadge,
            activePokemonIndex: this.activePokemonIndex,
            postGame: this.postGame,
            towerWins: this.towerWins,
            e4Progress: this.e4Progress,
            inE4: this.inE4,
            gymLeaders: GYM_LEADERS.map(g => ({ name: g.name, type: g.type, badge: g.badge, earlyTeam: g.earlyTeam, lateTeam: g.lateTeam, region: g.region, level: g.level })),
            eliteFour: this.eliteFour,
            champion: this.champion,
            routes: this.routes,
            currentRouteIndex: this.currentRouteIndex
        };
        localStorage.setItem('pokemon_roguelike_save', JSON.stringify(data));
    }

    loadGame() {
        const raw = localStorage.getItem('pokemon_roguelike_save');
        if (!raw) return false;
        try {
            const data = JSON.parse(raw);
            this.team = data.team.map(p => Pokemon.fromJSON(p));
            this.bag = data.bag;
            this.money = data.money;
            this.badges = data.badges;
            this.strikes = data.strikes;
            this.maxStrikes = data.maxStrikes;
            this.difficulty = data.difficulty;
            this.currentGym = data.currentGym;
            this.badgesNeeded = data.badgesNeeded;
            this.maxEvents = data.maxEvents || 35;
            this.catches = data.catches || 0;
            this.fishCatches = data.fishCatches || 0;
            this.battlesWon = data.battlesWon || 0;
            this.eventsExplored = data.eventsExplored || 0;
            this.evolutionCount = data.evolutionCount || 0;
            this.startTime = data.startTime || Date.now();
            this.achievements = new Set(data.achievements || []);
            this.rivalName = data.rivalName || this.rivalName;
            this.rivalStarter = data.rivalStarter;
            this.lastRivalBadge = data.lastRivalBadge || 0;
            this.activePokemonIndex = data.activePokemonIndex || 0;
            // Ensure active Pokemon is alive
            if (!this.team[this.activePokemonIndex] || !this.team[this.activePokemonIndex].isAlive) {
                const alive = this.team.findIndex(p => p.isAlive);
                this.activePokemonIndex = alive >= 0 ? alive : 0;
            }
            this.postGame = data.postGame || false;
            this.towerWins = data.towerWins || 0;
            this.e4Progress = data.e4Progress || 0;
            this.inE4 = data.inE4 || false;
            // Restore shuffled leaders from save so refresh doesn't reshuffle
            if (data.gymLeaders && data.gymLeaders.length === 8) {
                GYM_LEADERS.length = 0;
                data.gymLeaders.forEach(g => GYM_LEADERS.push(g));
            }
            if (data.eliteFour) this.eliteFour = data.eliteFour;
            if (data.champion) this.champion = data.champion;
            if (data.routes) this.routes = data.routes;
            if (data.currentRouteIndex !== undefined) this.currentRouteIndex = data.currentRouteIndex;
            this.state = 'playing';
            return true;
        } catch (e) {
            console.error('Failed to load save:', e);
            return false;
        }
    }

    deleteSave() {
        localStorage.removeItem('pokemon_roguelike_save');
    }

    // Get current route environment (rotates every 2 badges)
    getCurrentRoute() {
        if (!this.routes || this.routes.length === 0) return null;
        return this.routes[this.currentRouteIndex % this.routes.length];
    }

    // Get wild encounter pool - route-biased if route exists, else fallback to global
    getWildPool(tier) {
        const route = this.getCurrentRoute();
        if (route && route[tier] && route[tier].length > 0) {
            return route[tier];
        }
        return WILD_POKEMON[tier] || WILD_POKEMON.common;
    }

    loadHallOfFame() {
        try {
            return JSON.parse(localStorage.getItem('pokemon_roguelike_hof') || '[]');
        } catch { return []; }
    }

    saveHallOfFame() {
        localStorage.setItem('pokemon_roguelike_hof', JSON.stringify(this.hallOfFame.slice(0, 10)));
    }

    hasSaveFile() {
        return !!localStorage.getItem('pokemon_roguelike_save');
    }

    // ===== INIT =====
    init() {
        this.renderStartScreen();
        this.bindEvents();
    }

    bindEvents() {
        document.getElementById('difficulty').addEventListener('change', (e) => {
            this.difficulty = e.target.value;
        });

        document.querySelector('.close-btn').addEventListener('click', () => {
            document.getElementById('modal').classList.add('hidden');
            // Clean up drag manager if active
            if (this.dragManager) {
                this.dragManager.destroy();
                this.dragManager = null;
            }
        });

        document.getElementById('modal').addEventListener('click', (e) => {
            if (e.target === document.getElementById('modal')) {
                document.getElementById('modal').classList.add('hidden');
                // Clean up drag manager if active
                if (this.dragManager) {
                    this.dragManager.destroy();
                    this.dragManager = null;
                }
            }
        });

        document.getElementById('bag-btn').addEventListener('click', () => this.showBag());
        document.getElementById('team-btn').addEventListener('click', () => this.showTeamManagement());
        document.getElementById('stats-btn').addEventListener('click', () => this.showStats());
        document.getElementById('achievements-btn').addEventListener('click', () => this.showAchievements());

        document.getElementById('restart-btn').addEventListener('click', () => this.restart());
        document.getElementById('sound-btn').addEventListener('click', () => {
            const on = gameAudio.toggle();
            document.getElementById('sound-btn').textContent = on ? '🔊' : '🔇';
        });

        document.querySelectorAll('.action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.currentTarget.dataset.action;
                this.handleBattleAction(action);
            });
        });

        // Dev menu initialization
        this.initDevMenu();
    }

    // ===== DEV MENU =====
    initDevMenu() {
        // Check for ?dev in URL
        const urlParams = new URLSearchParams(window.location.search);
        const isDevMode = urlParams.has('dev');
        
        if (isDevMode) {
            const devBtn = document.getElementById('dev-menu-btn');
            if (devBtn) {
                devBtn.classList.remove('hidden');
                devBtn.addEventListener('click', () => this.showDevMenu());
            }
            
            // Populate route select
            const routeSelect = document.getElementById('dev-route-select');
            if (routeSelect) {
                for (let i = 0; i < 20; i++) {
                    const option = document.createElement('option');
                    option.value = i;
                    option.textContent = `Route ${i + 1}`;
                    routeSelect.appendChild(option);
                }
            }
            
            // Bind dev menu buttons
            this.bindDevMenuButtons();
        }
    }

    bindDevMenuButtons() {
        // Close button
        document.getElementById('dev-close-btn')?.addEventListener('click', () => {
            document.getElementById('dev-modal').classList.add('hidden');
        });
        
        document.getElementById('dev-modal')?.addEventListener('click', (e) => {
            if (e.target === document.getElementById('dev-modal')) {
                document.getElementById('dev-modal').classList.add('hidden');
            }
        });

        // Route teleport
        document.getElementById('dev-teleport-route')?.addEventListener('click', () => {
            const routeIndex = parseInt(document.getElementById('dev-route-select').value);
            this.currentRouteIndex = routeIndex;
            this.updateRouteDisplay();
            this.addMessage(`[DEV] Teleported to Route ${routeIndex + 1}`, 'info');
            document.getElementById('dev-modal').classList.add('hidden');
        });

        // Event triggers
        document.getElementById('dev-trigger-safari')?.addEventListener('click', () => {
            document.getElementById('dev-modal').classList.add('hidden');
            this.safariZone();
        });

        document.getElementById('dev-trigger-cave')?.addEventListener('click', () => {
            document.getElementById('dev-modal').classList.add('hidden');
            this.mysteryCave();
        });

        document.getElementById('dev-trigger-shop')?.addEventListener('click', () => {
            document.getElementById('dev-modal').classList.add('hidden');
            this.pokemonMart();
        });

        document.getElementById('dev-trigger-heal')?.addEventListener('click', () => {
            document.getElementById('dev-modal').classList.add('hidden');
            this.pokemonCenter();
        });

        // Battle triggers
        document.getElementById('dev-trigger-wild')?.addEventListener('click', () => {
            document.getElementById('dev-modal').classList.add('hidden');
            this.wildBattle();
        });

        document.getElementById('dev-trigger-trainer')?.addEventListener('click', () => {
            document.getElementById('dev-modal').classList.add('hidden');
            this.trainerBattle();
        });

        document.getElementById('dev-trigger-gym')?.addEventListener('click', () => {
            document.getElementById('dev-modal').classList.add('hidden');
            this.gymBattle();
        });

        document.getElementById('dev-trigger-e4')?.addEventListener('click', () => {
            document.getElementById('dev-modal').classList.add('hidden');
            this.e4Battle();
        });

        // Cheats
        document.getElementById('dev-cheat-money')?.addEventListener('click', () => {
            this.money += 5000;
            this.addMessage('[DEV] Added $5000', 'success');
            this.updateUI();
        });

        document.getElementById('dev-cheat-candy')?.addEventListener('click', () => {
            this.bag['rare_candy'] = (this.bag['rare_candy'] || 0) + 10;
            this.addMessage('[DEV] Added 10 Rare Candies', 'success');
        });

        document.getElementById('dev-cheat-balls')?.addEventListener('click', () => {
            this.bag['poke_ball'] = (this.bag['poke_ball'] || 0) + 50;
            this.addMessage('[DEV] Added 50 Poke Balls', 'success');
        });

        document.getElementById('dev-cheat-level')?.addEventListener('click', () => {
            this.team.forEach(p => {
                p.level = Math.min(100, p.level + 5);
                p.recalculateStats?.() || this.recalcStats(p);
            });
            this.addMessage('[DEV] Team leveled up +5', 'success');
            this.updateUI();
        });

        // Progress
        document.getElementById('dev-unlock-badges')?.addEventListener('click', () => {
            this.badges = this.badgesNeeded;
            this.addMessage('[DEV] All badges unlocked', 'success');
            this.updateUI();
        });

        document.getElementById('dev-enable-postgame')?.addEventListener('click', () => {
            this.postGame = true;
            this.badges = this.badgesNeeded;
            this.addMessage('[DEV] Post-game enabled', 'success');
            this.updateUI();
        });
    }

    showDevMenu() {
        document.getElementById('dev-modal').classList.remove('hidden');
    }

    recalcStats(pokemon) {
        // Recalculate stats based on new level
        const base = pokemon.species.baseStats;
        const level = pokemon.level;
        pokemon.maxHp = Math.floor((base.hp * 2 * level) / 100) + level + 10;
        pokemon.attack = Math.floor((base.atk * 2 * level) / 100) + 5;
        pokemon.defense = Math.floor((base.def * 2 * level) / 100) + 5;
        pokemon.specialAttack = Math.floor(((pokemon.species.spa || base.atk) * 2 * level) / 100) + 5;
        pokemon.specialDefense = Math.floor(((pokemon.species.spd_def || base.def) * 2 * level) / 100) + 5;
        pokemon.speed = Math.floor((base.spd * 2 * level) / 100) + 5;
        pokemon.hp = pokemon.maxHp;
    }

    renderStartScreen() {
        const grid = document.getElementById('starter-selection');
        grid.innerHTML = '';

        // Get 3 random starters
        const starterPool = typeof getRandomStarterPool === 'function' ?
            getRandomStarterPool(3) : STARTERS.slice(0, 3);

        starterPool.forEach(id => {
            const pokemon = POKEMON_DATA[id];
            if (!pokemon) return;
            const div = document.createElement('div');
            div.className = 'starter-option';
            div.dataset.pokemon = id;
            const typeBadges = pokemon.type2 ? 
                `<span class="type-badge type-bg-${pokemon.type.toLowerCase()}">${pokemon.type}</span><span class="type-badge type-bg-${pokemon.type2.toLowerCase()}">${pokemon.type2}</span>` :
                `<span class="type-badge type-bg-${pokemon.type.toLowerCase()}">${pokemon.type}</span>`;
            div.innerHTML = `
                <img src="${getSpriteUrl(id)}" alt="${pokemon.name}">
                <span class="name">${pokemon.name}</span>
                ${typeBadges}
            `;
            div.addEventListener('click', () => this.selectStarter(id));
            grid.appendChild(div);
        });

        // Continue button if save exists
        const existingBtns = document.querySelectorAll('.start-btn, .continue-btn');
        existingBtns.forEach(b => b.remove());

        if (this.hasSaveFile()) {
            const continueBtn = document.createElement('button');
            continueBtn.className = 'start-btn continue-btn';
            continueBtn.textContent = 'Continue Adventure';
            continueBtn.addEventListener('click', () => this.continueGame());
            grid.parentElement.appendChild(continueBtn);
        }

        const btn = document.createElement('button');
        btn.className = 'start-btn';
        btn.id = 'start-btn';
        btn.textContent = 'New Game';
        btn.disabled = true;
        btn.addEventListener('click', () => this.startGame());
        grid.parentElement.appendChild(btn);
    }

    continueGame() {
        if (this.loadGame()) {
            this.showScreen('game-screen');
            this.updateUI();
            this.addMessage('Welcome back! Your adventure continues.', 'success');
            this.generateChoices();
        }
    }

    selectStarter(id) {
        document.querySelectorAll('.starter-option').forEach(el => {
            el.classList.remove('selected');
        });
        document.querySelector(`[data-pokemon="${id}"]`).classList.add('selected');
        this.selectedStarter = id;
        document.getElementById('start-btn').disabled = false;
    }

    startGame() {
        this.deleteSave();

        // Reset all state
        this.achievements = new Set();
        this.catches = 0;
        this.fishCatches = 0;
        this.battlesWon = 0;
        this.eventsExplored = 0;
        this.evolutionCount = 0;
        this.startTime = Date.now();
        this.currentGym = 0;
        this.badges = 0;
        this.postGame = false;
        this.towerWins = 0;
        this.lastRivalBadge = 0;
        this.rivalName = RIVAL_NAMES[Math.floor(Math.random() * RIVAL_NAMES.length)];

        // Shuffle gym leaders, E4, and champion for this run
        // Reassign the global GYM_LEADERS so rest of code picks it up
        const newGyms = shuffleGymLeaders();
        GYM_LEADERS.length = 0;
        newGyms.forEach(g => GYM_LEADERS.push(g));
        this.eliteFour = shuffleEliteFour();
        this.champion = shuffleChampion();
        this.e4Progress = 0;
        this.inE4 = false;

        // Apply difficulty settings
        const settings = DIFFICULTY_SETTINGS[this.difficulty];
        this.money = settings.startMoney;
        this.strikes = settings.strikes;
        this.maxStrikes = settings.strikes;
        this.badgesNeeded = settings.badgesNeeded;
        this.maxEvents = settings.maxEvents || 35;

        // Initialize bag
        this.bag = {};
        settings.startItems.forEach(item => {
            this.bag[item] = (this.bag[item] || 0) + 1;
        });

        // Rival gets type-advantage starter
        const advantage = { Grass: 'Fire', Fire: 'Water', Water: 'Grass', Electric: 'Grass', Normal: 'Fighting', Bug: 'Fire', Poison: 'Ground' };
        const myData = POKEMON_DATA[this.selectedStarter];
        const myType = myData ? myData.type : 'Normal';
        const rivalType = advantage[myType] || 'Fire';

        // Find rival options from all Pokemon with the advantage type
        const rivalOptions = Object.keys(POKEMON_DATA).filter(id => {
            const data = POKEMON_DATA[id];
            return data && data.name && data.type === rivalType && data.baseStats;
        });

        // Pick random from options, fallback to charmander
        this.rivalStarter = rivalOptions.length > 0 ?
            rivalOptions[Math.floor(Math.random() * rivalOptions.length)] :
            'charmander';

        // Create starter Pokemon
        const starter = new Pokemon(this.selectedStarter, 5);
        this.team = [starter];

        this.state = 'playing';
        this.showScreen('game-screen');
        this.updateUI();
        this.addMessage(`You chose ${starter.name}! Your adventure begins!`, 'success');
        this.addMessage(`Your rival ${this.rivalName} chose ${POKEMON_DATA[this.rivalStarter].name}!`, 'warning');
        const startRoute = this.getCurrentRoute();
        if (startRoute) {
            this.addMessage(`${startRoute.icon} ${startRoute.name} - ${startRoute.desc}`, 'success');
        }
        this.generateChoices();
        this.saveGame();
    }

    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(s => {
            s.classList.remove('active');
            s.classList.remove('screen-enter');
        });
        const screen = document.getElementById(screenId);
        screen.classList.add('active', 'screen-enter');
    }

    updateUI() {
        const lvlCap = this.getLevelCap();
        const capText = lvlCap < 100 ? ` (Lv.Cap: ${lvlCap})` : '';
        document.getElementById('badges').textContent = `Badges: ${this.badges}/${this.badgesNeeded}${capText}`;
        document.getElementById('money').textContent = `$${this.money}`;
        document.getElementById('strikes').textContent = '❤️'.repeat(this.strikes) + '🖤'.repeat(this.maxStrikes - this.strikes);
        const eventsLeft = this.maxEvents ? this.maxEvents - this.eventsExplored : '∞';
        document.getElementById('events-count').textContent = `Events: ${eventsLeft} left`;

        // Route display
        const route = this.getCurrentRoute();
        const routeEl = document.getElementById('route-name');
        if (routeEl && route) {
            routeEl.textContent = `${route.icon} ${route.name}`;
            routeEl.title = route.desc;
        } else if (routeEl) {
            routeEl.textContent = '';
        }

        const totalBalls = (this.bag['pokeball'] || 0) + (this.bag['great_ball'] || 0) + (this.bag['ultra_ball'] || 0) + (this.bag['master_ball'] || 0);
        document.getElementById('balls-count').textContent = `🔴 ${totalBalls}`;

        const teamDiv = document.getElementById('team-pokemon');
        teamDiv.innerHTML = '';
        this.team.forEach((poke, i) => {
            const div = document.createElement('div');
            div.className = `team-slot ${!poke.isAlive ? 'fainted' : ''} ${i === this.activePokemonIndex ? 'active-slot' : ''}`;
            div.innerHTML = `
                <img src="${getSpriteUrl(poke.speciesId)}" alt="${poke.displayName}">
                <div class="team-slot-info">
                    <div class="team-slot-name">${poke.displayName} <span class="team-slot-level">Lv.${poke.level}</span></div>
                    <div class="mini-hp">
                        <div class="mini-hp-fill" style="width: ${poke.hpPercent}%; background: ${poke.hpPercent < 20 ? 'var(--danger)' : poke.hpPercent < 50 ? 'var(--warning)' : 'var(--success)'}"></div>
                    </div>
                    <div class="team-slot-hp">${poke.hp}/${poke.maxHp}</div>
                </div>
            `;
            div.style.cursor = 'pointer';
            div.addEventListener('click', () => this.showTeamManagement());
            teamDiv.appendChild(div);
        });

        // Check money achievement
        if (this.money >= 10000) this.unlockAchievement('loaded');
        if (this.team.length >= 6) this.unlockAchievement('squad_goals');
        // Check type diversity
        const teamTypes = new Set(this.team.map(p => p.type));
        if (teamTypes.size >= 5) this.unlockAchievement('type_master');

        // Check starter collector
        const starterSet = new Set(this.team.map(p => p.speciesId).filter(id => STARTERS.includes(id)));
        if (starterSet.size >= 3) this.unlockAchievement('starter_collector');
    }

    addMessage(text, type = '') {
        const log = document.getElementById('message-log');
        const msg = document.createElement('div');
        msg.className = `message ${type} fade-in`;
        msg.textContent = text;
        log.insertBefore(msg, log.firstChild);

        while (log.children.length > 15) {
            log.removeChild(log.lastChild);
        }
    }

    // Show a prominent event result banner (auto-dismisses after 3s)
    showEventResult(text, type = 'info') {
        let banner = document.getElementById('event-result-banner');
        if (!banner) {
            banner = document.createElement('div');
            banner.id = 'event-result-banner';
            const target = document.getElementById('game-screen') || document.querySelector('.screen:not(.hidden)') || document.body;
            target.insertBefore(banner, target.firstChild);
        }
        banner.textContent = text;
        banner.className = `event-banner event-banner-${type} fade-in`;
        banner.style.display = 'block';
        clearTimeout(this._bannerTimeout);
        this._bannerTimeout = setTimeout(() => {
            banner.style.display = 'none';
        }, 4000);
    }

    // ===== EVENT GENERATION =====
    generateChoices() {
        const choices = [];
        const outOfEvents = this.maxEvents && this.eventsExplored >= this.maxEvents;

        if (outOfEvents) {
            this.addMessage('No more time to explore - gym battles only!', 'warning');
        }

        // Wild battle (not available if out of events)
        const currentRoute = this.getCurrentRoute();
        if (!outOfEvents) {
            choices.push({
                icon: currentRoute ? currentRoute.icon : '🌿',
                text: currentRoute ? `Explore ${currentRoute.name}` : 'Explore Tall Grass',
                desc: currentRoute ? currentRoute.desc : 'Encounter wild Pokemon',
                action: () => this.wildBattle()
            });
        }

        // E4/Champion gauntlet
        if (this.inE4) {
            if (this.e4Progress < 4 && this.eliteFour[this.e4Progress]) {
                const e4 = this.eliteFour[this.e4Progress];
                const e4Region = e4.region ? ` (${e4.region})` : '';
                choices.push({
                    icon: '⭐',
                    text: `Elite Four: ${e4.name}${e4Region}`,
                    desc: `${e4.type} type - Lv.${e4.level}`,
                    action: () => this.e4Battle()
                });
            } else if (this.e4Progress >= 4 && this.champion) {
                const champRegion = this.champion.region ? ` (${this.champion.region})` : '';
                choices.push({
                    icon: '👑',
                    text: `Champion ${this.champion.name}${champRegion}`,
                    desc: `The final battle! Lv.${this.champion.level}`,
                    action: () => this.championBattle()
                });
            }
            // Only heal + E4/champ during gauntlet
            choices.push({ icon: '🏥', text: 'Pokemon Center', desc: 'Heal before the next fight', action: () => this.healTeam() });
            return choices;
        }

        // Gym challenge if ready
        if (this.currentGym < GYM_LEADERS.length && !this.postGame) {
            const gym = GYM_LEADERS[this.currentGym];
            const regionTag = gym.region ? ` (${gym.region})` : '';
            choices.push({
                icon: '🏛️',
                text: `Challenge ${gym.name}${regionTag}`,
                desc: `${gym.type} type - Lv.${gym.level} - ${gym.badge}`,
                action: () => this.gymBattle()
            });
        }

        // Legendary encounter check (6+ badges, rare)
        if (this.badges >= 6 && Math.random() < 0.08) {
            choices.push({
                icon: '✨',
                text: 'Strange Energy...',
                desc: 'A powerful presence nearby!',
                action: () => this.legendaryEncounter()
            });
        }

        // Rival check (every 2-3 badges)
        if (!this.postGame && this.badges > 0 && this.badges - this.lastRivalBadge >= 2 && Math.random() < 0.35) {
            choices.push({
                icon: '😤',
                text: `Rival ${this.rivalName}!`,
                desc: 'Your rival wants to battle!',
                action: () => this.rivalBattle()
            });
        }

        // Random events with rarity tiers (visual + weight)
        const earlyGame = this.eventsExplored < 5;
        const eventPool = [
            // Common (green border)
            { icon: '🌿', text: 'Wild Grass', desc: 'Encounter wild Pokemon', action: () => this.wildBattle(), weight: earlyGame ? 18 : 14, rarity: 'common' },
            { icon: '🏥', text: 'Pokemon Center', desc: 'Heal your team', action: () => this.healTeam(), weight: earlyGame ? 18 : 12, rarity: 'common' },
            { icon: '🏕️', text: 'Campsite', desc: 'Rest, train, or forage', action: () => this.campsite(), weight: earlyGame ? 16 : 10, rarity: 'common' },
            { icon: '⚔️', text: 'Trainer Battle', desc: 'An NPC trainer challenges you!', action: () => this.trainerBattle(), weight: earlyGame ? 6 : 12, rarity: 'common' },
            // Uncommon (blue border)
            { icon: '🏪', text: 'PokeMart', desc: 'Buy items', action: () => this.visitShop(), weight: 12, rarity: 'uncommon' },
            { icon: '🎣', text: 'Go Fishing', desc: 'Find water Pokemon', action: () => this.goFishing(), weight: 10, rarity: 'uncommon' },
            ...(!earlyGame ? [{ icon: '🗻', text: 'Mystery Cave', desc: 'Risk vs reward...', action: () => this.mysteryCave(), weight: 10, rarity: 'uncommon' }] : []),
            ...(this.badges >= 2 ? [{ icon: '🏠', text: 'Daycare', desc: 'Leave a Pokemon to train', action: () => this.daycare(), weight: 7, rarity: 'uncommon' }] : []),
            // Rare (purple border)
            ...(!earlyGame ? [{ icon: '🦒', text: 'Safari Zone', desc: 'Catch rare Pokemon ($500)', action: () => this.safariZone(), weight: 5, rarity: 'rare' }] : []),
            ...(this.badges >= 3 ? [{ icon: '🏬', text: 'Celadon Dept. Store', desc: 'Premium items at premium prices', action: () => this.celadonStore(), weight: 4, rarity: 'rare' }] : []),
            ...(this.badges >= 4 ? [{ icon: '🎰', text: 'Game Corner', desc: 'Gamble for prizes', action: () => this.gameCorner(), weight: 4, rarity: 'rare' }] : []),
            // Legendary (gold border)
            ...(this.badges >= 5 ? [{ icon: '🔮', text: 'Move Tutor', desc: 'Teach a powerful new move', action: () => this.moveTutor(), weight: 2, rarity: 'legendary' }] : []),
            ...(this.badges >= 6 && Math.random() < 0.3 ? [{ icon: '💎', text: 'Master Ball!', desc: 'Guaranteed catch on any Pokemon', action: () => this.findMasterBall(), weight: 1, rarity: 'legendary' }] : []),
            // Ghost Rival - encounter past champions (requires saved ghost rivals)
            ...(this.badges >= 5 && typeof getGhostRivals === 'function' && getGhostRivals().length > 0 ? [{ 
                icon: '👻', 
                text: 'Ghost Rival', 
                desc: 'Battle a shadow from your past...', 
                action: () => this.ghostRivalBattle(), 
                weight: 3, 
                rarity: 'legendary' 
            }] : []),
        ];

        // Battle Tower in post-game
        if (this.postGame) {
            choices.push({
                icon: '🗼',
                text: 'Battle Tower',
                desc: `Win streak: ${this.towerWins}`,
                action: () => this.battleTower()
            });
        }

        // Pick 1-2 random events (always allow healing even when out of events)
        if (outOfEvents) {
            // Heal + train when out of exploration events (free - don't block gym progression)
            choices.push({ icon: '🏥', text: 'Pokemon Center', desc: 'Heal your team', action: () => this.healTeam() });
            choices.push({ icon: '🏕️', text: 'Campsite', desc: 'Rest, train, or forage', action: () => this.campsite() });
            choices.push({ icon: '🌿', text: 'Grind Wild Pokemon', desc: 'Train for the next gym', action: () => this.wildBattle() });
        } else {
            // Weighted random selection - rarer events actually appear less often
            const numEvents = Math.random() < 0.4 ? 2 : 1;
            const pool = [...eventPool];
            for (let i = 0; i < numEvents && pool.length > 0; i++) {
                const totalWeight = pool.reduce((sum, e) => sum + (e.weight || 10), 0);
                let roll = Math.random() * totalWeight;
                let picked = pool.length - 1;
                for (let j = 0; j < pool.length; j++) {
                    roll -= (pool[j].weight || 10);
                    if (roll <= 0) { picked = j; break; }
                }
                choices.push(pool[picked]);
                pool.splice(picked, 1); // Don't pick same event twice
            }
        }

        this.renderChoices(choices);
    }

    renderChoices(choices) {
        const container = document.getElementById('choices');
        container.innerHTML = '';

        choices.forEach(choice => {
            const btn = document.createElement('button');
            const rarityClass = choice.rarity ? ` rarity-${choice.rarity}` : '';
            btn.className = `choice-btn fade-in${rarityClass}`;
            const rarityLabel = choice.rarity && choice.rarity !== 'common' ?
                `<span class="rarity-badge rarity-badge-${choice.rarity}">${choice.rarity}</span>` : '';
            btn.innerHTML = `
                <span class="choice-icon">${choice.icon}</span>
                <span class="choice-text">${choice.text}${rarityLabel}</span>
                <div class="choice-desc">${choice.desc}</div>
            `;
            btn.addEventListener('click', () => {
                const outOfEvts = this.maxEvents && this.eventsExplored >= this.maxEvents;
                if (!outOfEvts) this.eventsExplored++;
                // Warn when events running low
                if (this.maxEvents && !outOfEvts) {
                    const left = this.maxEvents - this.eventsExplored;
                    if (left === 10) this.showEventResult('⚠️ 10 events remaining - choose wisely!', 'info');
                    else if (left === 5) this.showEventResult('⚠️ Only 5 events left!', 'danger');
                    else if (left === 0) this.showEventResult('🏁 No more exploration - gym battles only!', 'danger');
                }
                choice.action();
            });
            container.appendChild(btn);
        });
    }

    // ===== WILD BATTLES =====
    wildBattle() {
        const tier = Math.random() < 0.65 ? 'common' :
                     Math.random() < 0.85 ? 'uncommon' : 'rare';
        const pool = this.getWildPool(tier);
        const speciesId = pool[Math.floor(Math.random() * pool.length)];

        const avgLevel = this.team.reduce((sum, p) => sum + p.level, 0) / this.team.length;
        // Tighter level range early game (0-1 badges), wider later
        const spread = this.badges <= 1 ? 4 : 6;
        const offset = this.badges <= 1 ? -2 : -3;
        let level = Math.max(2, Math.floor(avgLevel + (Math.random() * spread) + offset));
        
        // Hardcore early game relief: reduce wild levels by 2 until first badge
        if (this.difficulty === 'hard' && this.badges < 1) {
            level = Math.max(2, level - 2);
        }

        this.battleEnemy = new Pokemon(speciesId, level);
        this.battleEnemyTeam = [];
        this.battleType = 'wild';
        this.battleReward = { money: level * 10 };
        this.addMessage(`A wild ${this.battleEnemy.name} appeared!`);
        this.startBattle();
    }

    // ===== FISHING =====
    goFishing() {
        this.showFishingMinigame();
    }

    showFishingMinigame() {
        const modal = document.getElementById('modal');
        const body = document.getElementById('modal-body');

        body.innerHTML = `
            <h3>🎣 Fishing!</h3>
            <p class="fishing-instruction">Click when the bar is in the green zone!</p>
            <div class="fishing-game">
                <div class="fishing-bar">
                    <div class="fishing-zone"></div>
                    <div class="fishing-needle"></div>
                </div>
                <button class="start-btn fishing-cast-btn">Cast!</button>
            </div>
        `;

        modal.classList.remove('hidden');

        let needlePos = 0;
        let direction = 1;
        let speed = 3;
        let animFrame = null;
        let gameActive = false;
        let cleaned = false;

        const needle = body.querySelector('.fishing-needle');
        const zone = body.querySelector('.fishing-zone');
        const castBtn = body.querySelector('.fishing-cast-btn');

        const cleanup = () => {
            if (cleaned) return;
            cleaned = true;
            if (animFrame) cancelAnimationFrame(animFrame);
        };

        // Clean up if modal is closed via X button
        const closeHandler = () => {
            cleanup();
            modal.classList.add('hidden');
            this.generateChoices();
        };
        body.closest('.modal-content').querySelector('.close-btn').onclick = closeHandler;

        // Random zone position (30% width, random start)
        const zoneStart = 10 + Math.random() * 50;
        zone.style.left = zoneStart + '%';
        zone.style.width = '30%';

        const animate = () => {
            needlePos += direction * speed;
            if (needlePos >= 95) direction = -1;
            if (needlePos <= 0) direction = 1;
            needle.style.left = needlePos + '%';
            animFrame = requestAnimationFrame(animate);
        };

        castBtn.addEventListener('click', () => {
            if (!gameActive) {
                gameActive = true;
                castBtn.textContent = 'Reel In!';
                animate();
            } else {
                cleanup();
                modal.classList.add('hidden');

                // Check if in zone
                const inZone = needlePos >= zoneStart && needlePos <= zoneStart + 30;
                if (inZone) {
                    const fishPool = this.getWildPool('fishing');
                    const speciesId = fishPool[Math.floor(Math.random() * fishPool.length)];
                    const avgLevel = this.team.reduce((sum, p) => sum + p.level, 0) / this.team.length;
                    const level = Math.max(5, Math.floor(avgLevel + (Math.random() * 6) - 3));

                    this.battleEnemy = new Pokemon(speciesId, level);
                    this.battleEnemyTeam = [];
                    this.battleType = 'wild';
                    this.battleReward = { money: level * 10, fishing: true };
                    this.addMessage(`You reeled in a ${this.battleEnemy.name}!`, 'success');
                    this.startBattle();
                } else {
                    this.addMessage("The Pokemon got away! Bad timing...", 'warning');
                    this.generateChoices();
                }
            }
        });
    }

    // ===== GYM BATTLES =====
    gymBattle() {
        const gym = GYM_LEADERS[this.currentGym];

        // Cash payout for unused events
        if (this.maxEvents && this.eventsExplored < this.maxEvents) {
            const remainingEvents = this.maxEvents - this.eventsExplored;
            const payout = remainingEvents * 50; // $50 per unused event
            this.money += payout;
            this.showEventResult(`💰 Skipped ${remainingEvents} events! Bonus: $${payout}!`, 'success');
        }

        // Pick team based on tier - early gyms (0-3) use pre-evos, late (4-7) use evolved
        const isLate = this.currentGym >= 4;
        const team = isLate ? (gym.lateTeam || gym.pokemon || [this.getGymPokemonFallback(gym)])
                            : (gym.earlyTeam || gym.pokemon || [this.getGymPokemonFallback(gym)]);
        this.battleEnemy = new Pokemon(team[0], gym.level);
        this.battleEnemyTeam = [];

        // Give gym leaders extra Pokemon at higher gyms
        if (this.currentGym >= 3 && team.length > 1) {
            this.battleEnemyTeam.push(new Pokemon(team[1] || team[0], gym.level - 2));
        }
        if (this.currentGym >= 6 && team.length > 1) {
            const extra = team[2] || team[1] || team[0];
            this.battleEnemyTeam.push(new Pokemon(extra, gym.level - 1));
        }

        this.battleType = 'gym';
        this.battleReward = { money: 1000 + this.currentGym * 500 };
        const regionTag = gym.region ? ` (${gym.region})` : '';
        this.addMessage(`Gym Leader ${gym.name}${regionTag} wants to battle!`, 'warning');
        this.startBattle();
    }

    getGymPokemonFallback(gym) {
        const typeMap = {
            'Rock': ['geodude', 'graveler'], 'Water': ['staryu', 'starmie'],
            'Electric': ['pikachu', 'raichu'], 'Grass': ['oddish', 'vileplume'],
            'Poison': ['nidoran_m', 'nidoking'], 'Psychic': ['abra', 'kadabra'],
            'Fire': ['growlithe', 'arcanine'], 'Ground': ['geodude', 'graveler'],
            'Flying': ['pidgey', 'pidgeot'], 'Bug': ['caterpie', 'butterfree'],
            'Ghost': ['gastly', 'haunter'], 'Fighting': ['machop', 'machoke'],
            'Normal': ['raticate', 'clefable'], 'Dragon': ['gyarados'],
            'Ice': ['tentacruel'], 'Steel': ['graveler'], 'Dark': ['haunter', 'nidoking'],
            'Fairy': ['clefairy', 'clefable']
        };
        const pool = typeMap[gym.type] || ['rattata'];
        return pool[Math.floor(Math.random() * pool.length)];
    }

    // ===== ELITE FOUR BATTLES =====
    e4Battle() {
        const e4 = this.eliteFour[this.e4Progress];
        if (!e4) return;

        this.battleEnemy = new Pokemon(e4.pokemon[0], e4.level);
        this.battleEnemyTeam = e4.pokemon.slice(1).map((id, i) => new Pokemon(id, e4.level - 1 + i));

        this.battleType = 'e4';
        this.battleReward = { money: 3000 + this.e4Progress * 1000, e4: true };
        this.addMessage(`Elite Four ${e4.name} (${e4.region}) wants to battle!`, 'warning');
        this.startBattle();
    }

    // ===== CHAMPION BATTLE =====
    championBattle() {
        if (!this.champion) return;

        this.battleEnemy = new Pokemon(this.champion.pokemon[0], this.champion.level);
        this.battleEnemyTeam = this.champion.pokemon.slice(1).map((id, i) =>
            new Pokemon(id, this.champion.level - 2 + i)
        );

        this.battleType = 'champion';
        this.battleReward = { money: 10000, champion: true };
        this.addMessage(`Champion ${this.champion.name} (${this.champion.region}) challenges you!`, 'warning');
        this.startBattle();
    }

    // ===== GHOST RIVAL BATTLES =====
    ghostRivalBattle() {
        const ghostRivals = typeof getGhostRivals === 'function' ? getGhostRivals() : [];
        if (ghostRivals.length === 0) {
            this.addMessage('No ghost rivals found...', 'warning');
            return;
        }
        
        // Pick a random ghost rival
        const rival = ghostRivals[Math.floor(Math.random() * ghostRivals.length)];
        const avgLevel = this.team.reduce((sum, p) => sum + p.level, 0) / this.team.length;
        
        // Scale rival team to current level
        const level = Math.max(20, Math.floor(avgLevel));
        this.battleEnemy = new Pokemon(rival.team[0].speciesId, level);
        this.battleEnemyTeam = rival.team.slice(1).map(p => new Pokemon(p.speciesId, level - 2));
        this.battleType = 'ghost_rival';
        this.battleReward = { money: 5000, trainerName: rival.name };
        this.addMessage('👻 Ghost Rival ' + rival.name + ' appears!', 'danger');
        this.addMessage('The shadow of your past challenges you...', 'warning');
        this.startBattle();
    }

    // ===== TRAINER BATTLES =====
    trainerBattle() {
        const avgLevel = this.team.reduce((sum, p) => sum + p.level, 0) / this.team.length;
        // Filter trainers appropriate for current level
        const suitable = NPC_TRAINERS.filter(t => {
            const trainerLvl = avgLevel + t.levelMod;
            if (t.minBadges && this.badges < t.minBadges) return false;
            return trainerLvl >= 3 && trainerLvl <= avgLevel + 3;
        });
        const trainer = suitable.length > 0 ? suitable[Math.floor(Math.random() * suitable.length)] : NPC_TRAINERS[0];

        const level = Math.max(3, Math.floor(avgLevel + trainer.levelMod));
        this.battleEnemy = new Pokemon(trainer.team[0], level);
        this.battleEnemyTeam = trainer.team.slice(1).map(id => new Pokemon(id, level));
        this.battleType = 'trainer';
        this.battleReward = { money: trainer.reward, trainerName: trainer.name };
        this.addMessage(`${trainer.name} wants to battle!`, 'warning');
        this.startBattle();
    }

    // ===== RIVAL BATTLES =====
    rivalBattle() {
        this.lastRivalBadge = this.badges;
        const avgLevel = this.team.reduce((sum, p) => sum + p.level, 0) / this.team.length;
        const rivalLevel = Math.max(8, Math.floor(avgLevel + 2));

        // Rival's team grows over time
        let rivalStarter = this.rivalStarter;
        // Evolve rival's starter based on level
        let rivalSpecies = rivalStarter;
        const checkEvo = (id) => {
            const data = POKEMON_DATA[id];
            if (data.evolves && data.evolves.level && rivalLevel >= data.evolves.level) {
                return checkEvo(data.evolves.into);
            }
            return id;
        };
        rivalSpecies = checkEvo(rivalStarter);

        this.battleEnemy = new Pokemon(rivalSpecies, rivalLevel);
        this.battleEnemyTeam = [];

        // Rival gets extra Pokemon based on badges
        if (this.badges >= 3) {
            this.battleEnemyTeam.push(new Pokemon('pidgeotto', rivalLevel - 2));
        }
        if (this.badges >= 5) {
            this.battleEnemyTeam.push(new Pokemon('kadabra', rivalLevel - 1));
        }

        this.battleType = 'rival';
        this.battleReward = { money: 500 + this.badges * 200, rareCandy: true };
        this.addMessage(`Your rival ${this.rivalName} appeared!`, 'danger');
        this.addMessage(`"I'll show you how it's done!"`, 'warning');
        this.startBattle();
    }

    // ===== LEGENDARY ENCOUNTERS =====
    legendaryEncounter() {
        const legendaries = LEGENDARY_POKEMON.filter(id => {
            // Don't encounter ones already on team
            return !this.team.some(p => p.speciesId === id);
        });
        if (legendaries.length === 0) {
            this.addMessage("The energy fades away...");
            this.generateChoices();
            return;
        }

        const speciesId = legendaries[Math.floor(Math.random() * legendaries.length)];
        const level = Math.max(50, Math.floor(this.team.reduce((s, p) => s + p.level, 0) / this.team.length + 10));

        this.battleEnemy = new Pokemon(speciesId, level);
        this.battleEnemyTeam = [];
        this.battleType = 'wild';
        this.battleReward = { money: 0, legendary: true };
        this.unlockAchievement('lucky');
        this.addMessage(`A legendary ${this.battleEnemy.name} appeared!`, 'danger');
        this.startBattle();
    }

    // ===== CAMPSITE =====
    campsite() {
        const modal = document.getElementById('modal');
        const body = document.getElementById('modal-body');

        body.innerHTML = `
            <h3>🏕️ Campsite</h3>
            <p>Your team takes a break. What would you like to do?</p>
            <div class="campsite-choices"></div>
        `;

        const choices = body.querySelector('.campsite-choices');

        const makeBtn = (text, desc, action) => {
            const btn = document.createElement('button');
            btn.className = 'choice-btn';
            btn.innerHTML = `<span class="choice-text">${text}</span><div class="choice-desc">${desc}</div>`;
            btn.onclick = () => {
                modal.classList.add('hidden');
                action();
                this.updateUI();
                this.generateChoices();
                this.saveGame();
            };
            choices.appendChild(btn);
        };

        makeBtn('💤 Rest', 'Heal 30% HP for all Pokemon', () => {
            this.team.forEach(p => {
                if (p.isAlive) p.heal(Math.floor(p.maxHp * 0.3));
            });
            this.addMessage('Your team rested and recovered some HP!', 'success');
        });

        makeBtn('🏋️ Train', 'Active Pokemon gains some XP', () => {
            const active = this.team.find(p => p.isAlive);
            if (active) {
                const xp = Math.floor(active.level * 15 + 30);
                this.giveExp(xp, active);
                this.addMessage(`${active.displayName} trained and gained ${xp} XP!`, 'success');
            } else {
                this.addMessage('All your Pokemon are too tired to train...', 'warning');
            }
        });

        makeBtn('🌿 Forage', 'Find a random item', () => {
            const finds = [
                { id: 'potion', chance: 0.4 },
                { id: 'pokeball', chance: 0.3 },
                { id: 'super_potion', chance: 0.15 },
                { id: 'great_ball', chance: 0.1 },
                { id: 'rare_candy', chance: 0.05 }
            ];
            const roll = Math.random();
            let cumulative = 0;
            for (const find of finds) {
                cumulative += find.chance;
                if (roll < cumulative) {
                    this.bag[find.id] = (this.bag[find.id] || 0) + 1;
                    this.addMessage(`Found a ${ITEMS[find.id].name}!`, 'success');
                    return;
                }
            }
            this.addMessage('Found nothing useful...', 'warning');
        });

        modal.classList.remove('hidden');
    }

    // ===== MYSTERY CAVE (Expanded) =====
    mysteryCave() {
        const avgLevel = this.team.reduce((s, p) => s + p.level, 0) / this.team.length;
        const roll = Math.random();

        // Show cave entry
        this.showEventResult(roll < 0.50 ? '🗻 You explore the cave and find...' : roll < 0.70 ? '🗻 Something stirs in the cave...' : '🗻 Danger in the cave!', roll < 0.50 ? 'success' : roll < 0.70 ? 'info' : 'danger');

        // Good outcomes (50%)
        if (roll < 0.50) {
            const rewardMult = DIFFICULTY_SETTINGS[this.difficulty]?.eventRewardMult || 1.0;
            const goodEvents = [
                () => { // Treasure
                    const amount = Math.floor((Math.floor(Math.random() * 500) + 200) * rewardMult);
                    this.money += amount;
                    this.showEventResult(`💰 You found a treasure chest with $${amount}!`, 'success');
                },
                () => { // Rare candy
                    this.bag['rare_candy'] = (this.bag['rare_candy'] || 0) + 1;
                    this.showEventResult('🍬 You found a Rare Candy deep in the cave!', 'success');
                },
                () => { // Wild Pokemon joins
                    if (this.team.length < 6) {
                        const pool = [...WILD_POKEMON.uncommon, ...WILD_POKEMON.rare];
                        const id = pool[Math.floor(Math.random() * pool.length)];
                        // Species Clause check
                        if (!this.canAddSpeciesToTeam(id)) {
                            this.money += Math.floor(400 * rewardMult);
                            this.showEventResult('💰 A friendly Pokemon showed you its treasure stash! Found $' + Math.floor(400 * rewardMult) + '!', 'success');
                            return;
                        }
                        const level = Math.max(5, Math.floor(avgLevel));
                        const pokemon = new Pokemon(id, level);
                        this.team.push(pokemon);
                        this.catches++;
                        this.showEventResult(`🎉 A wild ${pokemon.name} decided to join you!`, 'success');
                    } else {
                        this.money += Math.floor(400 * rewardMult);
                        this.showEventResult('💰 A friendly Pokemon showed you its treasure stash! Found $' + Math.floor(400 * rewardMult) + '!', 'success');
                    }
                },
                () => { // Level boost
                    const active = this.team.find(p => p.isAlive);
                    if (active) {
                        this.giveExp(active.level * 20, active);
                        this.addMessage(`${active.displayName} found a training ground and gained XP!`, 'success');
                    }
                },
                () => { // Berry bush
                    this.bag['potion'] = (this.bag['potion'] || 0) + 2;
                    this.bag['super_potion'] = (this.bag['super_potion'] || 0) + 1;
                    this.addMessage('You found a berry bush! Turned berries into potions!', 'success');
                },
                () => { // Fossil Pokemon
                    if (this.team.length < 6) {
                        const fossils = ['omanyte', 'kabuto', 'aerodactyl'];
                        const id = fossils[Math.floor(Math.random() * fossils.length)];
                        // Species Clause check
                        if (!this.canAddSpeciesToTeam(id)) {
                            this.money += Math.floor(800 * rewardMult);
                            this.showEventResult('💰 You found a rare fossil and sold it for $' + Math.floor(800 * rewardMult) + '!', 'success');
                            return;
                        }
                        const level = Math.max(10, Math.floor(avgLevel));
                        const pokemon = new Pokemon(id, level);
                        this.team.push(pokemon);
                        this.catches++;
                        this.unlockAchievement('fossil_hunter');
                        this.showEventResult(`🦴 You revived a fossil! ${pokemon.name} joined your team!`, 'success');
                    } else {
                        this.money += Math.floor(800 * rewardMult);
                        this.showEventResult('💰 You found a rare fossil and sold it for $' + Math.floor(800 * rewardMult) + '!', 'success');
                    }
                },
                () => { // Move tutor (stat boost)
                    const active = this.team.find(p => p.isAlive);
                    if (active) {
                        active.attack += 3;
                        active.speed += 3;
                        this.addMessage(`A move tutor trained ${active.displayName}! ATK and SPD +3!`, 'success');
                    }
                },
                () => { // Shrine blessing
                    this.team.forEach(p => { p.hp = p.maxHp; });
                    this.addMessage('A shrine blessed your team! All Pokemon fully healed!', 'success');
                },
                () => { // Ancient TM cache
                    const tms = ['tm_thunderbolt', 'tm_icebeam', 'tm_flamethrower', 'tm_shadowball', 'tm_sludgebomb'];
                    const tm = tms[Math.floor(Math.random() * tms.length)];
                    this.tmBag.push({ id: tm, ...TM_DATA[tm] });
                    this.addMessage(`📀 You discovered an ancient cache! Found ${TM_DATA[tm].name}!`, 'success');
                },
                () => { // Pokemon egg
                    if (this.team.length < 6) {
                        const eggSpecies = ['pichu', 'cleffa', 'igglybuff', 'togepi', 'magby', 'elekid', 'smoochum'];
                        const speciesId = eggSpecies[Math.floor(Math.random() * eggSpecies.length)];
                        // Species Clause check
                        if (!this.canAddSpeciesToTeam(speciesId)) {
                            this.money += Math.floor(300 * rewardMult);
                            this.showEventResult('💰 You found a rare egg and sold it for $' + Math.floor(300 * rewardMult) + '!', 'success');
                            return;
                        }
                        const pokemon = new Pokemon(speciesId, 5);
                        pokemon.hp = pokemon.maxHp;
                        this.team.push(pokemon);
                        this.catches++;
                        this.showEventResult(`🥚 A mysterious egg hatched into ${pokemon.name}!`, 'success');
                    } else {
                        this.money += Math.floor(300 * rewardMult);
                        this.showEventResult('💰 You found a rare egg and sold it for $' + Math.floor(300 * rewardMult) + '!', 'success');
                    }
                },
                () => { // Treasure map
                        const mapReward = Math.floor((Math.floor(Math.random() * 1000) + 500) * rewardMult);
                        this.money += mapReward;
                        this.showEventResult(`🗺️ You followed an ancient map to hidden treasure! +$${mapReward}!`, 'success');
                },
                () => { // PP Up find
                    const ppUps = ['pp_up', 'pp_max'];
                    const item = ppUps[Math.floor(Math.random() * ppUps.length)];
                    this.bag[item] = (this.bag[item] || 0) + 1;
                    const itemName = ITEMS[item]?.name || (item === 'pp_up' ? 'PP Up' : 'PP Max');
                    this.addMessage(`You found a ${itemName}! It restores move PP!`, 'success');
                },
                () => { // Eviolite discovery
                    this.bag['eviolite'] = (this.bag['eviolite'] || 0) + 1;
                    this.addMessage('You found a shimmering Eviolite! Boosts unevolved Pokemon defenses!', 'success');
                },
                () => { // Move relearner
                    const eligible = this.team.filter(p => p.moves.length >= 2);
                    if (eligible.length > 0) {
                        const pokemon = eligible[Math.floor(Math.random() * eligible.length)];
                        const moveToReplace = pokemon.moves[Math.floor(Math.random() * pokemon.moves.length)];
                        const availableMoves = Object.keys(CANONICAL_MOVES).filter(m => 
                            !pokemon.moves.some(pm => pm.id === m) &&
                            CANONICAL_MOVES[m].type
                        );
                        if (availableMoves.length > 0) {
                            const newMoveId = availableMoves[Math.floor(Math.random() * availableMoves.length)];
                            const newMove = CANONICAL_MOVES[newMoveId];
                            const oldMoveName = moveToReplace.name;
                            moveToReplace.id = newMoveId;
                            moveToReplace.name = newMove.name;
                            moveToReplace.type = newMove.type;
                            moveToReplace.power = newMove.power || 0;
                            moveToReplace.pp = newMove.pp;
                            moveToReplace.maxPp = newMove.pp;
                            moveToReplace.accuracy = newMove.accuracy;
                            moveToReplace.category = newMove.category;
                            this.addMessage(`A sage taught ${pokemon.displayName} ${newMove.name} (replacing ${oldMoveName})!`, 'success');
                        }
                    }
                }
            ];
            goodEvents[Math.floor(Math.random() * goodEvents.length)]();
        }
        // Neutral outcomes (20%)
        else if (roll < 0.70) {
            const rewardMult = DIFFICULTY_SETTINGS[this.difficulty]?.eventRewardMult || 1.0;
            const neutralEvents = [
                () => { // Trade offer
                    if (this.team.length >= 2) {
                        const pool = [...WILD_POKEMON.uncommon, ...WILD_POKEMON.rare];
                        const offerId = pool[Math.floor(Math.random() * pool.length)];
                        const offered = POKEMON_DATA[offerId];
                        this.addMessage(`A hiker offers to trade a ${offered.name}... but you decline for now.`);
                    } else {
                        this.addMessage('A lost hiker wanders by but has nothing to trade.');
                    }
                },
                () => { // Lost hiker
                    this.money += Math.floor(300 * rewardMult);
                    this.addMessage('You helped a lost hiker find the exit! Reward: $' + Math.floor(300 * rewardMult) + '!', 'success');
                },
                () => { // Gambler
                    if (this.money >= 500) {
                        const win = Math.random() < 0.45;
                        if (win) {
                            this.money += 500;
                            this.unlockAchievement('high_roller');
                            this.addMessage('You won the gamble! +$500!', 'success');
                        } else {
                            this.money -= 500;
                            this.addMessage('You lost the gamble! -$500!', 'danger');
                        }
                    } else {
                        this.addMessage('A gambler challenged you but you don\'t have $500 to bet.');
                    }
                },
                () => { // Evolution stone find
                    const stones = ['fire_stone', 'water_stone', 'thunder_stone', 'leaf_stone', 'moon_stone'];
                    const stone = stones[Math.floor(Math.random() * stones.length)];
                    this.bag[stone] = (this.bag[stone] || 0) + 1;
                    this.addMessage(`You found a ${ITEMS[stone].name} in the cave!`, 'success');
                },
                () => { // Rest stop
                    const healAmount = Math.floor(this.team[0].maxHp * 0.3);
                    this.team.forEach(p => {
                        if (p.isAlive) p.hp = Math.min(p.maxHp, p.hp + healAmount);
                    });
                    this.addMessage('You found a peaceful rest stop. Team recovered some HP.', 'info');
                },
                () => { // Quiz master
                    const quizzes = [
                        { q: 'What type is super effective against Water?', a: 'Electric', correct: true },
                        { q: 'What level does Charmander evolve?', a: '16', correct: true },
                        { q: 'Is Ice weak to Fire?', a: 'Yes', correct: true }
                    ];
                    const quiz = quizzes[Math.floor(Math.random() * quizzes.length)];
                    this.money += 200;
                    this.addMessage(`A quiz master asks: "${quiz.q}" You answer correctly! +$200!`, 'success');
                },
                () => { // Item merchant
                    const discount = Math.random() < 0.5;
                    if (discount) {
                        this.bag['hyper_potion'] = (this.bag['hyper_potion'] || 0) + 1;
                        this.addMessage('A traveling merchant gave you a Hyper Potion as thanks for directions!', 'success');
                    } else {
                        this.addMessage('You met a traveling merchant but had nothing to trade.');
                    }
                },
                () => { // Type memory game
                    this.money += 150;
                    this.addMessage('You played a memory game with cave drawings! Won $150!', 'success');
                }
            ];
            neutralEvents[Math.floor(Math.random() * neutralEvents.length)]();
        }
        // Bad outcomes (30%)
        else {
            const badEvents = [
                () => { // Ambush
                    const pool = WILD_POKEMON.uncommon;
                    const id = pool[Math.floor(Math.random() * pool.length)];
                    const level = Math.max(5, Math.floor(avgLevel + 2));
                    this.battleEnemy = new Pokemon(id, level);
                    this.battleEnemyTeam = [];
                    this.battleType = 'wild';
                    this.battleReward = { money: level * 15 };
                    this.addMessage(`Ambush! A wild ${this.battleEnemy.name} attacked!`, 'danger');
                    this.startBattle();
                    return false; // Don't generate choices
                },
                () => { // Team Rocket
                    const rocketPokemon = ['rattata', 'geodude', 'machop', 'gastly'];
                    const id = rocketPokemon[Math.floor(Math.random() * rocketPokemon.length)];
                    const level = Math.max(8, Math.floor(avgLevel + 3));
                    this.battleEnemy = new Pokemon(id, level);
                    this.battleEnemyTeam = [new Pokemon(rocketPokemon[Math.floor(Math.random() * rocketPokemon.length)], level - 2)];
                    this.battleType = 'trainer';
                    this.battleReward = { money: 600, trainerName: 'Team Rocket Grunt' };
                    this.addMessage('Team Rocket Grunt appeared!', 'danger');
                    this.addMessage('"Prepare for trouble!"', 'warning');
                    this.startBattle();
                    return false;
                },
                () => { // Curse
                    const damage = Math.floor(this.team[0].maxHp * 0.2);
                    this.team.forEach(p => {
                        if (p.isAlive) p.takeDamage(Math.floor(p.maxHp * 0.15));
                    });
                    this.showEventResult('💀 A cave curse drains your team\'s energy!', 'danger');
                },
                () => { // Shrine curse
                    const loss = Math.floor(this.money * 0.15);
                    this.money = Math.max(0, this.money - loss);
                    this.showEventResult(`💀 A cursed shrine stole $${loss}!`, 'danger');
                },
                () => { // Pit trap
                    const active = this.team.find(p => p.isAlive);
                    if (active) {
                        const damage = Math.floor(active.maxHp * 0.25);
                        active.takeDamage(damage);
                        this.showEventResult(`🕳️ ${active.displayName} fell into a pit trap!`, 'danger');
                    }
                },
                () => { // Wild swarm
                    const active = this.team.find(p => p.isAlive);
                    if (active) {
                        active.takeDamage(Math.floor(active.maxHp * 0.2));
                        this.addMessage('A swarm of wild Pokemon attacked!', 'danger');
                        this.addMessage(`${active.displayName} fought them off but took damage!`, 'warning');
                    }
                },
                () => { // Equipment failure
                    if (this.bag['poke_ball'] > 0) {
                        const lost = Math.min(this.bag['poke_ball'], 5);
                        this.bag['poke_ball'] -= lost;
                        this.showEventResult(`💨 A gust of wind blew away ${lost} Poke Balls!`, 'danger');
                    } else {
                        this.money = Math.max(0, this.money - 100);
                        this.showEventResult('💨 Strong winds scattered your belongings! Lost $100!', 'danger');
                    }
                },
                () => { // Confusing mist
                    const confused = this.team.filter(p => p.isAlive);
                    if (confused.length > 0) {
                        const target = confused[Math.floor(Math.random() * confused.length)];
                        target.takeDamage(Math.floor(target.maxHp * 0.1));
                        this.showEventResult('🌫️ Confusing mist caused ${target.displayName} to hurt itself!', 'danger');
                    }
                }
            ];
            const event = badEvents[Math.floor(Math.random() * badEvents.length)];
            const result = event();
            if (result === false) return; // Battle started, don't generate choices
        }

        this.updateUI();
        this.generateChoices();
        this.saveGame();
    }

    // ===== SAFARI ZONE =====
    safariZone() {
        const entryFee = 1000; // Increased from $500
        if (this.money < entryFee) {
            this.addMessage(`You can't afford the $${entryFee} entry fee!`, 'danger');
            this.generateChoices();
            return;
        }
        this.money -= entryFee;
        this.addMessage('Welcome to the Safari Zone! You get 1 Safari Ball!', 'success');

        const avgLevel = this.team.reduce((s, p) => s + p.level, 0) / this.team.length;
        const safariPool = [...WILD_POKEMON.uncommon, ...WILD_POKEMON.rare, 'nidorino', 'gloom', 'pidgeotto', 'flaaffy', 'ariados', 'noctowl'];
        let ballsLeft = 1; // Reduced from 3 to 1
        let caught = 0;

        const modal = document.getElementById('modal');
        const body = document.getElementById('modal-body');

        const throwBall = () => {
            if (ballsLeft <= 0) {
                modal.classList.add('hidden');
                this.addMessage(`Safari Zone over! Caught ${caught} Pokemon.`, caught > 0 ? 'success' : 'warning');
                this.updateUI();
                this.generateChoices();
                this.saveGame();
                return;
            }

            const speciesId = safariPool[Math.floor(Math.random() * safariPool.length)];
            const species = POKEMON_DATA[speciesId];
            if (!species) { ballsLeft--; throwBall(); return; }

            const level = Math.max(5, Math.floor(avgLevel + (Math.random() * 4) - 2));

            body.innerHTML = `
                <h3>🦒 Safari Zone</h3>
                <p>A wild <strong>${species.name}</strong> (Lv.${level}) appeared!</p>
                <p>Safari Balls left: <strong>${ballsLeft}</strong> | Caught: <strong>${caught}</strong></p>
                <div class="safari-actions"></div>
            `;
            const actions = body.querySelector('.safari-actions');

            const throwBtn = document.createElement('button');
            throwBtn.className = 'choice-btn';
            throwBtn.innerHTML = '<span class="choice-text">🔴 Throw Safari Ball</span>';
            throwBtn.onclick = () => {
                ballsLeft--;
                if (Math.random() < 0.40 && this.team.length < 6) {
                    // Species Clause check
                    if (!this.canAddSpeciesToTeam(speciesId)) {
                        this.addMessage(`${species.name} was caught but released due to Species Clause!`, 'warning');
                        throwBall();
                        return;
                    }
                    const pokemon = new Pokemon(speciesId, level);
                    this.team.push(pokemon);
                    this.catches++;
                    caught++;
                    this.unlockAchievement('safari_catch');
                    this.addMessage(`Gotcha! ${pokemon.name} was caught!`, 'success');
                } else if (this.team.length >= 6) {
                    this.addMessage(`${species.name} was caught but your team is full!`, 'warning');
                } else {
                    this.addMessage(`${species.name} broke free!`, 'danger');
                }
                throwBall();
            };
            actions.appendChild(throwBtn);

            const skipBtn = document.createElement('button');
            skipBtn.className = 'choice-btn';
            skipBtn.innerHTML = '<span class="choice-text">🏃 Skip</span>';
            skipBtn.onclick = () => {
                this.addMessage(`${species.name} fled!`, 'warning');
                ballsLeft = 0;
                throwBall();
            };
            actions.appendChild(skipBtn);

            const leaveBtn = document.createElement('button');
            leaveBtn.className = 'choice-btn';
            leaveBtn.innerHTML = '<span class="choice-text">🚪 Leave Safari Zone</span>';
            leaveBtn.onclick = () => {
                ballsLeft = 0;
                throwBall();
            };
            actions.appendChild(leaveBtn);

            modal.classList.remove('hidden');
        };

        throwBall();
    }

    // ===== DAYCARE =====
    daycare() {
        if (this.team.length < 2) {
            this.addMessage("You need at least 2 Pokemon to use the Daycare!", 'warning');
            this.generateChoices();
            return;
        }

        const cost = 300 + this.badges * 100;
        if (this.money < cost) {
            this.addMessage(`The Daycare costs $${cost}. You can't afford it!`, 'danger');
            this.generateChoices();
            return;
        }

        // Show Pokemon picker
        const modal = document.getElementById('modal');
        const body = document.getElementById('modal-body');
        body.innerHTML = `
            <h3>🏠 Daycare - $${cost}</h3>
            <p>Leave a Pokemon for intensive training. It gains XP equal to 2 wild battles.</p>
            <div class="daycare-choices"></div>
        `;
        const container = body.querySelector('.daycare-choices');

        this.team.forEach((poke, i) => {
            const btn = document.createElement('button');
            btn.className = 'choice-btn';
            btn.innerHTML = `<span class="choice-text">${poke.displayName} Lv.${poke.level}</span>`;
            btn.onclick = () => {
                this.money -= cost;
                const xpGain = Math.floor(poke.level * 25 + 40) * 2;
                this.giveExp(xpGain, poke);
                this.addMessage(`${poke.displayName} trained at the Daycare and gained XP!`, 'success');
                modal.classList.add('hidden');
                this.updateUI();
                this.generateChoices();
                this.saveGame();
            };
            container.appendChild(btn);
        });

        const cancelBtn = document.createElement('button');
        cancelBtn.className = 'choice-btn';
        cancelBtn.innerHTML = '<span class="choice-text">Never mind</span>';
        cancelBtn.onclick = () => {
            modal.classList.add('hidden');
            this.generateChoices();
        };
        container.appendChild(cancelBtn);
        modal.classList.remove('hidden');
    }

    // ===== CELADON DEPT. STORE (rare event) =====
    celadonStore() {
        const modal = document.getElementById('modal');
        const body = document.getElementById('modal-body');
        const premiumItems = [
            { id: 'ultra_ball', name: 'Ultra Ball', price: 1200 },
            { id: 'full_restore', name: 'Full Restore', price: 3000 },
            { id: 'rare_candy', name: 'Rare Candy', price: 4800 },
            { id: 'revive', name: 'Revive', price: 1500 },
            { id: 'fire_stone', name: 'Fire Stone', price: 3000 },
            { id: 'water_stone', name: 'Water Stone', price: 3000 },
            { id: 'thunder_stone', name: 'Thunder Stone', price: 3000 },
            { id: 'leaf_stone', name: 'Leaf Stone', price: 3000 },
            { id: 'moon_stone', name: 'Moon Stone', price: 3000 },
            { id: 'link_cable', name: 'Link Cable', price: 8000 },
            { id: 'moon_stone', name: 'Moon Stone', price: 3000 },
        ];
        body.innerHTML = `
            <h3>🏬 Celadon Dept. Store</h3>
            <p>Premium items! You have $${this.money}</p>
            <div class="shop-items"></div>
        `;
        const container = body.querySelector('.shop-items');
        premiumItems.forEach(item => {
            const btn = document.createElement('button');
            btn.className = 'choice-btn';
            const canAfford = this.money >= item.price;
            btn.innerHTML = `<span class="choice-text">${item.name} - $${item.price}</span>`;
            btn.disabled = !canAfford;
            btn.style.opacity = canAfford ? 1 : 0.5;
            btn.onclick = () => {
                if (this.money >= item.price) {
                    this.money -= item.price;
                    this.bag[item.id] = (this.bag[item.id] || 0) + 1;
                    this.addMessage(`Bought ${item.name}!`, 'success');
                    body.querySelector('p').textContent = `Premium items! You have $${this.money}`;
                    if (this.money < item.price) { btn.disabled = true; btn.style.opacity = 0.5; }
                    this.updateUI();
                    this.saveGame();
                }
            };
            container.appendChild(btn);
        });
        const leaveBtn = document.createElement('button');
        leaveBtn.className = 'choice-btn';
        leaveBtn.innerHTML = '<span class="choice-text">Leave store</span>';
        leaveBtn.onclick = () => { modal.classList.add('hidden'); this.generateChoices(); };
        container.appendChild(leaveBtn);
        modal.classList.remove('hidden');
    }

    // ===== GAME CORNER (rare event) =====
    gameCorner() {
        const modal = document.getElementById('modal');
        const body = document.getElementById('modal-body');
        body.innerHTML = `
            <h3>🎰 Game Corner</h3>
            <p>Try your luck! You have $${this.money}</p>
            <div class="game-corner-options"></div>
        `;
        const container = body.querySelector('.game-corner-options');

        // Slot machine - $200 per spin
        const slotBtn = document.createElement('button');
        slotBtn.className = 'choice-btn';
        slotBtn.innerHTML = '<span class="choice-text">🎰 Slots - $200</span><div class="choice-desc">Win big or lose it all!</div>';
        slotBtn.onclick = () => {
            if (this.money < 200) { this.addMessage("Not enough money!", 'danger'); return; }
            this.money -= 200;
            const roll = Math.random();
            if (roll < 0.10) { // 10% jackpot
                this.money += 2000;
                this.unlockAchievement('high_roller');
                this.addMessage('🎰 JACKPOT! +$2000!', 'success');
            } else if (roll < 0.35) { // 25% small win
                this.money += 400;
                this.addMessage('🎰 Winner! +$400!', 'success');
            } else { // 65% lose
                this.addMessage('🎰 No luck this time...', 'warning');
            }
            body.querySelector('p').textContent = `Try your luck! You have $${this.money}`;
            this.updateUI();
            this.saveGame();
        };
        container.appendChild(slotBtn);

        // Prize exchange - spend $1000 for a random good item
        const prizeBtn = document.createElement('button');
        prizeBtn.className = 'choice-btn';
        prizeBtn.innerHTML = '<span class="choice-text">🎁 Prize Exchange - $1000</span><div class="choice-desc">Random rare prize</div>';
        prizeBtn.onclick = () => {
            if (this.money < 1000) { this.addMessage("Not enough money!", 'danger'); return; }
            this.money -= 1000;
            const prizes = ['rare_candy', 'revive', 'full_restore', 'ultra_ball', 'ultra_ball'];
            const prize = prizes[Math.floor(Math.random() * prizes.length)];
            this.bag[prize] = (this.bag[prize] || 0) + 1;
            this.addMessage(`Won a ${ITEMS[prize].name}!`, 'success');
            body.querySelector('p').textContent = `Try your luck! You have $${this.money}`;
            this.updateUI();
            this.saveGame();
        };
        container.appendChild(prizeBtn);

        const leaveBtn = document.createElement('button');
        leaveBtn.className = 'choice-btn';
        leaveBtn.innerHTML = '<span class="choice-text">Leave</span>';
        leaveBtn.onclick = () => { modal.classList.add('hidden'); this.generateChoices(); };
        container.appendChild(leaveBtn);
        modal.classList.remove('hidden');
    }

    // ===== MOVE TUTOR (legendary event) =====
    moveTutor() {
        if (this.team.length === 0) { this.generateChoices(); return; }
        const modal = document.getElementById('modal');
        const body = document.getElementById('modal-body');
        body.innerHTML = `
            <h3>🔮 Move Tutor</h3>
            <p>A master trainer offers to teach one Pokemon a powerful move!</p>
            <div class="tutor-choices"></div>
        `;
        const container = body.querySelector('.tutor-choices');

        this.team.forEach((poke, i) => {
            const btn = document.createElement('button');
            btn.className = 'choice-btn';
            btn.innerHTML = `<span class="choice-text">${poke.displayName} Lv.${poke.level}</span>`;
            btn.onclick = () => {
                // Boost stats significantly
                poke.attack += 5;
                poke.defense += 5;
                poke.speed += 5;
                poke.maxHp += 10;
                poke.hp = Math.min(poke.hp + 10, poke.maxHp);
                this.addMessage(`${poke.displayName} learned secret techniques! All stats boosted!`, 'success');
                modal.classList.add('hidden');
                this.updateUI();
                this.generateChoices();
                this.saveGame();
            };
            container.appendChild(btn);
        });

        const skipBtn = document.createElement('button');
        skipBtn.className = 'choice-btn';
        skipBtn.innerHTML = '<span class="choice-text">Decline</span>';
        skipBtn.onclick = () => { modal.classList.add('hidden'); this.generateChoices(); };
        container.appendChild(skipBtn);
        modal.classList.remove('hidden');
    }

    // ===== MASTER BALL (legendary event) =====
    findMasterBall() {
        this.addMessage('You found a Master Ball! It guarantees a catch on any Pokemon!', 'success');
        this.bag['master_ball'] = (this.bag['master_ball'] || 0) + 1;
        this.updateUI();
        this.generateChoices();
        this.saveGame();
    }

    // ===== BATTLE TOWER (Post-game) =====
    battleTower() {
        const baseLevel = Math.max(...this.team.map(p => p.level));
        const towerLevel = baseLevel + Math.floor(this.towerWins / 2);

        // Scale difficulty with win streak
        const basicPool = [...WILD_POKEMON.uncommon, 'pidgeotto', 'machoke', 'kadabra', 'graveler', 'haunter'];
        const evolvedPool = ['arcanine', 'nidoking', 'starmie', 'gyarados', 'machoke', 'kadabra', 'pidgeot', 'vileplume', 'houndoom', 'ampharos', 'piloswine', 'ursaring'];
        const pool = this.towerWins >= 7 ? evolvedPool : this.towerWins >= 3 ? [...basicPool, ...evolvedPool] : basicPool;

        const teamSize = this.towerWins >= 10 ? 3 : this.towerWins >= 5 ? 3 : 2;
        const ids = [];
        for (let i = 0; i < teamSize; i++) {
            ids.push(pool[Math.floor(Math.random() * pool.length)]);
        }

        this.battleEnemy = new Pokemon(ids[0], towerLevel);
        this.battleEnemyTeam = ids.slice(1).map((id, i) => new Pokemon(id, towerLevel - 1 + i));
        this.battleType = 'tower';
        this.battleReward = { money: 500 + this.towerWins * 200 };

        // Milestone flavor text
        const fight = this.towerWins + 1;
        if (fight === 1) this.addMessage('Battle Tower - Floor 1! How far can you go?', 'warning');
        else if (fight % 10 === 0) this.addMessage(`Battle Tower - Floor ${fight}! The crowd roars!`, 'warning');
        else if (fight % 5 === 0) this.addMessage(`Battle Tower - Floor ${fight}! Getting serious now.`, 'warning');
        else this.addMessage(`Battle Tower - Floor ${fight}!`, 'warning');

        this.startBattle();
    }

    // ===== BATTLE SYSTEM =====
    startBattle() {
        this.state = 'battle';
        this.activePokemonIndex = this.team.findIndex(p => p.isAlive);
        if (this.activePokemonIndex === -1) {
            // All fainted before battle could start (e.g. cave curse)
            this.strikes--;
            this.addMessage('All your Pokemon fainted!', 'danger');
            this.addMessage(`You lost a life! ${this.strikes} remaining. Your team has been healed.`, 'warning');
            this.showEventResult(`💔 Life lost! ${this.strikes}/${this.maxStrikes} remaining`, 'danger');
            if (this.strikes <= 0) { this.gameOver(); } else {
                this.team.forEach(p => p.hp = p.maxHp);
                this.activePokemonIndex = 0;
                this.state = 'playing';
                this.showScreen('game-screen');
                this.updateUI();
                this.generateChoices();
                this.saveGame();
            }
            return;
        }
        this.battleTurnInProgress = false;
        this.awaitingFaintSwitch = false;
        this.battleWon = false; // Reset battle won flag

        // Reset stat stages for all player Pokémon at start of each battle
        this.team.forEach(p => {
            p.statStages = { attack: 0, defense: 0, specialAttack: 0, specialDefense: 0, speed: 0, accuracy: 0, evasion: 0 };
        });

        // Clear battle log
        document.getElementById('battle-log').innerHTML = '';

        this.showScreen('battle-screen');
        this.restoreBattleActions();
        this.updateBattleUI();
        this.updateBattleButtons();

        const enemy = this.battleEnemy;
        this.addBattleLog(`${enemy.name} (Lv.${enemy.level}) appeared!`);
        gameAudio.wildEncounter();
        if (this.battleEnemyTeam.length > 0) {
            this.addBattleLog(`Opponent has ${this.battleEnemyTeam.length + 1} Pokemon!`, 'warning');
        }

        // Ability: Intimidate — lower player's active Pokémon Attack on battle start
        if (enemy.ability === 'intimidate') {
            const player = this.team[this.activePokemonIndex];
            if (player && player.statStages) {
                player.statStages.attack = Math.max(-6, (player.statStages.attack || 0) - 1);
                this.addBattleLog(`${enemy.name}'s Intimidate lowered ${player.displayName}'s Attack!`, 'warning');
            }
        }
        // Ability: Intimidate — lower enemy Attack if player has it
        const playerPoke = this.team[this.activePokemonIndex];
        if (playerPoke && playerPoke.ability === 'intimidate') {
            if (enemy.statStages) {
                enemy.statStages.attack = Math.max(-6, (enemy.statStages.attack || 0) - 1);
                this.addBattleLog(`${playerPoke.displayName}'s Intimidate lowered ${enemy.name}'s Attack!`, 'warning');
            }
        }
    }

    // Get status icon for UI
    getStatusIcon(status) {
        const icons = {
            'burn': '🔥',
            'poison': '☠️',
            'paralyze': '⚡',
            'sleep': '💤',
            'freeze': '❄️'
        };
        return icons[status] || '';
    }

    // Format stat stages for UI display
    formatStatStages(statStages) {
        if (!statStages) return '';
        const abbrev = { attack: 'Atk', defense: 'Def', specialAttack: 'SpA', specialDefense: 'SpD', speed: 'Spe', accuracy: 'Acc', evasion: 'Eva' };
        const activeStages = Object.entries(statStages).filter(([_, v]) => v !== 0);
        if (activeStages.length === 0) return '';
        const stageText = activeStages.map(([stat, val]) => {
            const arrows = val > 0 ? '↑'.repeat(Math.min(val, 3)) : '↓'.repeat(Math.min(Math.abs(val), 3));
            return `${abbrev[stat]}${arrows}`;
        }).join(' ');
        return `<span class="stat-stages">${stageText}</span>`;
    }

    updateBattleUI() {
        const player = this.team[this.activePokemonIndex];
        const enemy = this.battleEnemy;

        // Player Pokemon
        const playerSprite = document.getElementById('player-sprite');
        playerSprite.src = getBackSpriteUrl(player.speciesId);
        const statusIconPlayer = player.status ? this.getStatusIcon(player.status) : '';
        const statStagesPlayer = this.formatStatStages(player.statStages);
        const playerTypes = [player.type];
        if (player.species && player.species.type2) {
            playerTypes.push(player.species.type2);
        }
        const playerTypeBadges = playerTypes.map(t =>
            `<span class="type-badge type-bg-${t.toLowerCase()}">${t}</span>`
        ).join('');
        document.getElementById('player-name').innerHTML = `
            ${player.displayName} Lv.${player.level}${statusIconPlayer}
            ${playerTypeBadges}
            ${statStagesPlayer}
        `;
        const playerHpText = document.getElementById('player-hp-text');
        if (playerHpText) playerHpText.textContent = `${player.hp}/${player.maxHp}`;

        // Animate HP bar
        const playerHp = document.getElementById('player-hp');
        requestAnimationFrame(() => {
            playerHp.style.width = `${player.hpPercent}%`;
            playerHp.className = `hp-fill ${player.hpPercent < 20 ? 'critical' : player.hpPercent < 50 ? 'low' : ''}`;
        });

        // Enemy Pokemon
        const enemySprite = document.getElementById('enemy-sprite');
        enemySprite.src = getSpriteUrl(enemy.speciesId);
        const statusIconEnemy = enemy.status ? this.getStatusIcon(enemy.status) : '';
        const statStagesEnemy = this.formatStatStages(enemy.statStages);
        const enemyTypes = [enemy.type];
        if (enemy.species && enemy.species.type2) {
            enemyTypes.push(enemy.species.type2);
        }
        const enemyTypeBadges = enemyTypes.map(t =>
            `<span class="type-badge type-bg-${t.toLowerCase()}">${t}</span>`
        ).join('');
        document.getElementById('enemy-name').innerHTML = `
            ${enemy.name} Lv.${enemy.level}${statusIconEnemy}
            ${enemyTypeBadges}
            ${statStagesEnemy}
        `;

        // Speed indicator
        const speedIndicator = document.getElementById('enemy-speed');
        if (speedIndicator) {
            const playerSpeed = player.speed;
            const enemySpeed = enemy.speed;
            if (playerSpeed > enemySpeed) {
                speedIndicator.innerHTML = '🐇 You move first';
                speedIndicator.className = 'speed-indicator speed-fast';
            } else if (playerSpeed < enemySpeed) {
                speedIndicator.innerHTML = '🐢 They move first';
                speedIndicator.className = 'speed-indicator speed-slow';
            } else {
                speedIndicator.innerHTML = '⚖️ Same speed';
                speedIndicator.className = 'speed-indicator speed-even';
            }
        }

        const enemyHpText = document.getElementById('enemy-hp-text');
        if (enemyHpText) enemyHpText.textContent = `${enemy.hp}/${enemy.maxHp}`;

        const enemyHp = document.getElementById('enemy-hp');
        requestAnimationFrame(() => {
            enemyHp.style.width = `${enemy.hpPercent}%`;
            enemyHp.className = `hp-fill ${enemy.hpPercent < 20 ? 'critical' : enemy.hpPercent < 50 ? 'low' : ''}`;
        });
    }

    updateBattleButtons() {
        const catchBtn = document.querySelector('[data-action="catch"]');
        const itemBtn = document.querySelector('[data-action="item"]');
        const runBtn = document.querySelector('[data-action="run"]');

        if (catchBtn) {
            const balls = (this.bag['pokeball'] || 0) + (this.bag['great_ball'] || 0) + (this.bag['ultra_ball'] || 0) + (this.bag['master_ball'] || 0);
            catchBtn.disabled = this.battleType !== 'wild' || balls === 0;
            catchBtn.style.opacity = (this.battleType !== 'wild' || balls === 0) ? '0.5' : '1';
            catchBtn.textContent = `🔴 Catch (${balls})`;
        }
        if (runBtn) {
            const canRun = this.battleType === 'wild';
            runBtn.disabled = !canRun;
            runBtn.style.opacity = canRun ? '1' : '0.5';
        }
    }

    addBattleLog(text, type = '') {
        const log = document.getElementById('battle-log');
        const div = document.createElement('div');
        div.className = `battle-log-entry ${type} fade-in`;
        div.textContent = text;
        log.appendChild(div);
        log.scrollTop = log.scrollHeight;
    }

    handleBattleAction(action) {
        if (this.battleTurnInProgress) return;
        if (this.awaitingFaintSwitch && action !== 'switch') return;

        switch(action) {
            case 'fight': this.showMoveSelection(); break;
            case 'fight0': this.doBattleRound(0); break;
            case 'fight1': this.doBattleRound(1); break;
            case 'catch': this.tryCatch(); break;
            case 'switch': this.showSwitchMenu(); break;
            case 'item': this.showBattleItems(); break;
            case 'run': this.tryRun(); break;
        }
    }

    calculateDamage(attacker, defender, move = null) {
        // Fixed-damage moves (Dragon Rage always 40, Sonic Boom always 20)
        if (move && move.fixedDamage) {
            return { damage: move.fixedDamage, effectiveness: 1, crit: false, moveName: move.name };
        }

        // Status moves deal no damage
        if (move && (move.category === 'status' || move.power === 0)) {
            return { damage: 0, effectiveness: 1, crit: false, moveName: move.name };
        }

        // Move power scales damage (default 60 for enemies without moves)
        const movePower = move ? move.power : 60;

        // Physical/Special split - use appropriate stats
        const category = move ? move.category : 'physical';
        let attackStat, defenseStat;

        if (category === 'special') {
            // Special moves use special attack / special defense
            attackStat = attacker.specialAttack;
            defenseStat = defender.specialDefense;
        } else {
            // Physical moves (or status with damage) use attack / defense
            attackStat = attacker.getModifiedAttack ? attacker.getModifiedAttack() : attacker.attack;
            defenseStat = defender.defense;
        }

        // Ensure minimum defense of 1 to prevent division by zero
        defenseStat = Math.max(1, defenseStat);
        const base = Math.floor(((2 * attacker.level / 5 + 2) * movePower * attackStat / defenseStat) / 50) + 2;
        const variance = 0.85 + Math.random() * 0.15;

        // Type effectiveness - use move type if provided, else attacker type
        const attackType = move ? move.type : attacker.type.toLowerCase();
        
        // Get defender types (dual typing support)
        const defenseTypes = [defender.type.toLowerCase()];
        if (defender.species && defender.species.type2) {
            defenseTypes.push(defender.species.type2.toLowerCase());
        }
        
        // Calculate effectiveness against all defender types
        let effectiveness = 1;
        for (const defenseType of defenseTypes) {
            if (TYPE_EFFECTIVENESS[attackType] && TYPE_EFFECTIVENESS[attackType][defenseType] !== undefined) {
                effectiveness *= TYPE_EFFECTIVENESS[attackType][defenseType];
            }
        }

        // STAB bonus (1.5x if move type matches either attacker type)
        let stab = 1;
        if (move) {
            const attackerTypes = [attacker.type.toLowerCase()];
            if (attacker.species && attacker.species.type2) {
                attackerTypes.push(attacker.species.type2.toLowerCase());
            }
            if (attackerTypes.includes(move.type)) {
                stab = 1.5;
            }
        }

        // Critical hit (6.25% chance)
        let crit = 1;
        if (Math.random() < 0.0625) {
            crit = 1.5;
        }

        // Ability hooks in damage calc
        // Levitate: Ground immunity
        if (move && move.type === 'ground' && defender.ability === 'levitate') {
            this.addBattleLog(`${defender.displayName} floats above the attack! (Levitate)`, 'info');
            return { damage: 0, effectiveness: 0, crit: false, moveName: move ? move.name : 'Attack' };
        }

        // Blaze/Overgrow/Torrent: Low HP STAB boost for attacker
        let abilityMult = 1;
        if (attacker.ability === 'blaze' && move && move.type === 'fire' && attacker.hp <= attacker.maxHp * 0.33) {
            abilityMult = 1.5;
            this.addBattleLog(`${attacker.displayName}'s Blaze flares up!`, 'success');
        } else if (attacker.ability === 'overgrow' && move && move.type === 'grass' && attacker.hp <= attacker.maxHp * 0.33) {
            abilityMult = 1.5;
            this.addBattleLog(`${attacker.displayName}'s Overgrow surges!`, 'success');
        } else if (attacker.ability === 'torrent' && move && move.type === 'water' && attacker.hp <= attacker.maxHp * 0.33) {
            abilityMult = 1.5;
            this.addBattleLog(`${attacker.displayName}'s Torrent rages!`, 'success');
        }

        // Guts: 1.5x physical damage when statused
        if (attacker.ability === 'guts' && attacker.status && move && move.category === 'physical') {
            abilityMult *= 1.5;
        }

        // Sturdy: Survive OHKO at full HP
        let finalDamage = Math.max(1, Math.floor(base * variance * effectiveness * stab * crit * abilityMult));
        if (defender.ability === 'sturdy' && defender.hp === defender.maxHp && finalDamage >= defender.hp) {
            finalDamage = defender.hp - 1;
            this.addBattleLog(`${defender.displayName} hung on with Sturdy!`, 'success');
        }

        return {
            damage: finalDamage,
            effectiveness,
            crit: crit > 1,
            moveName: move ? move.name : 'Attack'
        };
    }

    // Apply status damage at end of battle turn
    applyEndOfTurnStatusDamage() {
        const player = this.team[this.activePokemonIndex];
        const enemy = this.battleEnemy;

        // Player status damage
        if (player && player.status) {
            const damage = player.applyStatusDamage();
            if (damage > 0) {
                const statusName = player.status === 'poison' ? 'Poison' : 'Burn';
                this.addBattleLog(`${player.displayName} is hurt by ${statusName}! ${damage} damage!`, 'warning');

                // Check if player fainted from status
                if (player.hp <= 0) {
                    setTimeout(() => this.playerPokemonFainted(), 600);
                    return;
                }
            }
        }

        // Enemy status damage
        if (enemy && enemy.status) {
            const damage = enemy.applyStatusDamage();
            if (damage > 0) {
                const statusName = enemy.status === 'poison' ? 'Poison' : 'Burn';
                this.addBattleLog(`${enemy.name} is hurt by ${statusName}! ${damage} damage!`, 'warning');

                // Check if enemy fainted from status
                if (enemy.hp <= 0) {
                    setTimeout(() => this.enemyFainted(), 600);
                    return;
                }
            }
        }

        this.updateBattleUI();
    }

    showMoveSelection() {
        if (this.battleTurnInProgress) return;
        const player = this.team[this.activePokemonIndex];
        const actions = document.getElementById('battle-actions');
        actions.innerHTML = '';

        // Check if all moves have 0 PP
        const allMovesExhausted = player.moves.every(m => m.pp !== undefined && m.pp <= 0);

        if (allMovesExhausted) {
            // Show Struggle button
            const struggleBtn = document.createElement('button');
            struggleBtn.className = 'action-btn move-btn type-bg-normal';
            struggleBtn.innerHTML = `Struggle<br><small>NORMAL · 50 · No PP</small>`;
            struggleBtn.addEventListener('click', () => {
                // Create a struggle move
                const struggleMove = {
                    name: 'Struggle',
                    type: 'normal',
                    power: 50,
                    pp: 999, // Won't decrement
                    maxPp: 999
                };
                this.selectedMove = struggleMove;
                // Override the move for this round
                player.moves.push(struggleMove);
                this.doBattleRound(player.moves.length - 1);
                player.moves.pop(); // Remove after use
            });
            actions.appendChild(struggleBtn);
        } else {
            player.moves.forEach((move, i) => {
                const btn = document.createElement('button');
                const moveType = move.type;
                const ppText = move.pp !== undefined ? `${move.pp}/${move.maxPp || move.pp}` : '';
                const disabled = move.pp !== undefined && move.pp <= 0;
                btn.className = `action-btn move-btn type-bg-${moveType}${disabled ? ' disabled' : ''}`;
                btn.innerHTML = `${move.name}<br><small>${move.type.toUpperCase()} · ${move.power}${move.isStab ? ' · STAB' : ''}${ppText ? ' · ' + ppText : ''}</small>`;
                btn.disabled = disabled;
                if (!disabled) {
                    const moveHandler = () => {
                        this.selectedMove = move;
                        this.doBattleRound(i);
                    };
                    btn.addEventListener('click', moveHandler);
                    btn.addEventListener('touchend', (e) => { e.preventDefault(); moveHandler(); });
                }
                actions.appendChild(btn);
            });
        }

        // Back button
        const backBtn = document.createElement('button');
        backBtn.className = 'action-btn';
        backBtn.textContent = '← Back';
        backBtn.addEventListener('click', () => this.restoreBattleActions());
        actions.appendChild(backBtn);
    }

    restoreBattleActions() {
        const actions = document.getElementById('battle-actions');
        const player = this.team[this.activePokemonIndex];

        // Show moves directly (no Fight button needed)
        let movesHtml = '';
        player.moves.forEach((move, i) => {
            const ppText = move.pp !== undefined ? `${move.pp}/${move.maxPp || move.pp}` : '';
            const disabled = move.pp !== undefined && move.pp <= 0 ? 'disabled' : '';
            const powerText = move.power > 0 ? ` · ${move.power}` : '';
            movesHtml += `
                <button class="action-btn move-btn type-bg-${move.type.toLowerCase()}" data-action="fight${i}" data-move-idx="${i}" ${disabled}>
                    ${move.name}${powerText}<br><small>${move.type.toUpperCase()}${ppText ? ' · ' + ppText : ''}</small>
                </button>
            `;
        });

        actions.innerHTML = `
            ${movesHtml}
            <button class="action-btn" data-action="catch">🔴 Catch</button>
            <button class="action-btn" data-action="switch">🔄 Switch</button>
            <button class="action-btn" data-action="item">💊 Item</button>
            <button class="action-btn" data-action="run">🏃 Run</button>
        `;

        // Add event listeners with long-press for move details
        actions.querySelectorAll('.move-btn').forEach((btn, i) => {
            let pressTimer;
            const move = player.moves[i];

            const showTooltip = () => {
                const tooltip = document.createElement('div');
                tooltip.className = 'move-tooltip';
                tooltip.innerHTML = `
                    <div class="type">${move.type}</div>
                    <div>Power: <span class="power">${move.power || '-'}</span></div>
                    <div>Acc: <span class="accuracy">${move.accuracy}%</span></div>
                `;
                btn.appendChild(tooltip);
            };

            const hideTooltip = () => {
                const tooltip = btn.querySelector('.move-tooltip');
                if (tooltip) tooltip.remove();
            };

            btn.addEventListener('mousedown', () => { pressTimer = setTimeout(showTooltip, 500); });
            btn.addEventListener('mouseup', () => { clearTimeout(pressTimer); hideTooltip(); });
            btn.addEventListener('mouseleave', () => { clearTimeout(pressTimer); hideTooltip(); });
            btn.addEventListener('touchstart', (e) => { e.preventDefault(); pressTimer = setTimeout(showTooltip, 500); });
            btn.addEventListener('touchend', (e) => { e.preventDefault(); clearTimeout(pressTimer); hideTooltip(); this.doBattleRound(i); });
            btn.addEventListener('click', () => { clearTimeout(pressTimer); hideTooltip(); this.doBattleRound(i); });
        });

        // Non-move buttons
        actions.querySelectorAll('.action-btn:not(.move-btn)').forEach(btn => {
            const action = btn.dataset.action;
            btn.addEventListener('click', () => this.handleBattleAction(action));
            btn.addEventListener('touchend', (e) => { e.preventDefault(); this.handleBattleAction(action); });
        });

        this.updateBattleButtons();
    }

    doBattleRound(moveIndex = 0) {
        this.battleTurnInProgress = true;
        const player = this.team[this.activePokemonIndex];
        const enemy = this.battleEnemy;
        const playerMove = player.moves[moveIndex] || player.moves[0];
        // Enemy picks random move (or uses default attack)
        const enemyMove = enemy.moves && enemy.moves.length > 0 ? enemy.moves[Math.floor(Math.random() * enemy.moves.length)] : null;

        // Restore battle action buttons
        this.restoreBattleActions();

        const playerFirst = player.speed >= enemy.speed;

        const doAttack = (attacker, defender, isPlayer) => {
            // Check if attacker can move (paralysis, sleep, freeze)
            const moveCheck = attacker.canMove();
            if (!moveCheck.canMove) {
                this.addBattleLog(moveCheck.message);
                this.updateBattleUI();
                return false;
            }

            const move = isPlayer ? playerMove : enemyMove;

            // Decrement PP for player moves
            if (isPlayer && move && move.pp !== undefined) {
                move.pp = Math.max(0, move.pp - 1);
            }

            // Accuracy check (default 100 if not specified)
            const accuracy = move && move.accuracy !== undefined ? move.accuracy : 100;
            const hitRoll = Math.random() * 100;

            if (hitRoll > accuracy) {
                // Miss
                this.addBattleLog(`${attacker.displayName} used ${move ? move.name : 'Attack'}! It missed!`);
                gameAudio.miss?.() || gameAudio.attack(); // Fallback to attack sound if miss sound doesn't exist
                this.updateBattleUI();
                return false; // Didn't faint
            }

            // Handle status moves (no damage, just effects)
            if (move && move.category === 'status') {
                this.addBattleLog(`${attacker.displayName} used ${move.name}!`);

                // Apply stat boosts
                if (move.boosts) {
                    // Self-targeting boosts (all positive) go to attacker; debuffs go to defender
                    const allPositive = Object.values(move.boosts).every(v => v > 0);
                    const boostTarget = (move.target === 'self' || allPositive) ? attacker : defender;
                    const changes = boostTarget.applyStatBoosts(move.boosts);
                    if (changes.length > 0) {
                        const changeText = changes.map(c => `${c.stat} ${c.change > 0 ? '↑' : '↓'}`).join(', ');
                        this.addBattleLog(`${boostTarget.displayName}'s ${changeText}!`);
                    }
                }

                // Apply secondary status effects
                if (move.secondary) {
                    applyMoveStatusEffect(move, defender);
                }

                this.updateBattleUI();
                return false; // Status moves don't faint
            }

            const result = this.calculateDamage(attacker, defender, move);
            const fainted = defender.takeDamage(result.damage);

            this.addBattleLog(`${attacker.displayName} used ${result.moveName}! ${result.damage} damage!`);
            gameAudio.attack();

            if (result.crit) {
                this.addBattleLog('Critical hit!', 'warning');
                gameAudio.crit();
                // Screen shake on crit
                const field = document.getElementById('battle-field');
                field.classList.add('screen-shake');
                setTimeout(() => field.classList.remove('screen-shake'), 400);
            }

            if (result.effectiveness > 1) {
                this.addBattleLog("It's super effective!", 'success');
                gameAudio.superEffective();
                // Flash effect
                const target = isPlayer ? 'enemy-pokemon' : 'player-pokemon';
                document.getElementById(target).classList.add('super-effective-flash');
                setTimeout(() => document.getElementById(target).classList.remove('super-effective-flash'), 400);
            } else if (result.effectiveness < 1 && result.effectiveness > 0) {
                this.addBattleLog("It's not very effective...", 'warning');
            } else if (result.effectiveness === 0) {
                this.addBattleLog("It had no effect!", 'danger');
            }

            // Sprite animation
            const attackerId = isPlayer ? 'player-sprite' : 'enemy-sprite';
            const defenderId = isPlayer ? 'enemy-sprite' : 'player-sprite';
            document.getElementById(attackerId).classList.add('attack-bounce');
            setTimeout(() => {
                document.getElementById(attackerId).classList.remove('attack-bounce');
                document.getElementById(defenderId).classList.add('damage-shake');
                setTimeout(() => document.getElementById(defenderId).classList.remove('damage-shake'), 300);
            }, 200);

            // Apply status effects from move secondary
            if (!fainted && move && move.secondary) {
                applyMoveStatusEffect(move, defender, this.clauseTracker, isPlayer);
            }

            // Apply stat boosts from move
            if (!fainted && move && move.boosts) {
                // Self-targeting boosts (all positive) go to attacker; debuffs go to defender
                const allPositive = Object.values(move.boosts).every(v => v > 0);
                const boostTarget = (move.target === 'self' || allPositive) ? attacker : defender;
                const changes = boostTarget.applyStatBoosts(move.boosts, this.clauseTracker, isPlayer);
                if (changes.length > 0) {
                    const changeText = changes.map(c => `${c.stat} ${c.change > 0 ? '↑' : '↓'}`).join(', ');
                    this.addBattleLog(`${boostTarget.displayName}'s ${changeText}!`);
                }
            }

            this.updateBattleUI();
            return fainted;
        };

        // Apply status effect from move
        const applyMoveStatusEffect = (move, target) => {
            const secondary = move.secondary;
            if (!secondary) return;

            // Handle different secondary effect structures
            let status = null;
            let chance = 0;

            if (secondary.status) {
                // Direct status with chance
                status = secondary.status;
                chance = secondary.chance || 10;
            } else if (typeof secondary === 'object' && !Array.isArray(secondary)) {
                // Object with status and chance keys
                if (secondary.status) {
                    status = secondary.status;
                    chance = secondary.chance || secondary.odds || 10;
                }
            }

            if (status && Math.random() * 100 < chance) {
                // Apply status if target doesn't have one
                if (!target.status) {
                    target.status = status;

                    // Set status duration for sleep (1-3 turns)
                    if (status === 'sleep') {
                        target.statusTurns = Math.floor(Math.random() * 3) + 1;
                    }

                    const statusName = status.charAt(0).toUpperCase() + status.slice(1);
                    this.addBattleLog(`${target.displayName || target.name} was ${status === 'paralyze' ? 'paralyzed' : status + 'ed'}!`, 'warning');
                }
            }
        };

        const processFirst = () => {
            const first = playerFirst ? { a: player, d: enemy, isP: true } : { a: enemy, d: player, isP: false };
            if (doAttack(first.a, first.d, first.isP)) {
                if (first.isP) {
                    setTimeout(() => this.enemyFainted(), 600);
                } else {
                    setTimeout(() => this.playerPokemonFainted(), 600);
                }
                return;
            }

            setTimeout(() => {
                const second = playerFirst ? { a: enemy, d: player, isP: false } : { a: player, d: enemy, isP: true };
                if (doAttack(second.a, second.d, second.isP)) {
                    if (second.isP) {
                        setTimeout(() => this.enemyFainted(), 600);
                    } else {
                        setTimeout(() => this.playerPokemonFainted(), 600);
                    }
                    return;
                }

                // Apply status damage (burn/poison) after both attacks
                setTimeout(() => {
                    this.applyEndOfTurnStatusDamage();
                }, 300);

                this.battleTurnInProgress = false;
            }, 700);
        };

        processFirst();
    }

    enemyFainted() {
        const enemy = this.battleEnemy;
        this.addBattleLog(`${enemy.name} fainted!`, 'success');

        // Check for more enemy Pokemon
        if (this.battleEnemyTeam.length > 0) {
            this.battleEnemy = this.battleEnemyTeam.shift();
            this.addBattleLog(`Opponent sent out ${this.battleEnemy.name}!`, 'warning');
            this.updateBattleUI();
            this.battleTurnInProgress = false;
            return;
        }

        // Battle is won - set flag to prevent player fainting
        this.battleWon = true;

        // Give EXP - active Pokemon gets full, team gets 40%
        const expGain = Math.floor(enemy.level * 25 + 40);
        const active = this.team[this.activePokemonIndex];
        this.giveExp(expGain, active);
        // Team-wide XP share (roguelike pacing - keeps backline viable)
        this.team.forEach((p, i) => {
            if (i !== this.activePokemonIndex && p.isAlive) {
                this.giveExp(Math.floor(expGain * 0.4), p);
            }
        });

        // Battle rewards
        this.battlesWon++;
        if (this.battleReward) {
            this.money += this.battleReward.money || 0;
        }

        if (this.battleType === 'gym') {
            this.badges++;

            // Award TM for gym victory
            if (typeof GYM_TM_REWARDS !== 'undefined' && GYM_TM_REWARDS[this.currentGym]) {
                const tmId = GYM_TM_REWARDS[this.currentGym];
                if (!this.tmBag.includes(tmId)) {
                    this.tmBag.push(tmId);
                    const tm = TMS[tmId];
                    if (tm) {
                        this.addMessage(`Received TM: ${tm.name}!`, 'success');
                    }
                }
            }

            this.currentGym++;
            this.addMessage(`You defeated the Gym Leader and earned a badge!`, 'success');
            this.addBattleLog('Badge earned!', 'success');
            gameAudio.badgeEarned();
            // Big XP reward for gym victory - whole team benefits
            const gymXp = Math.floor(enemy.level * 30 + 50);
            this.team.forEach(p => { if (p.isAlive) this.giveExp(gymXp, p); });

            // Replenish event budget - each badge unlocks a new exploration phase
            const eventsPerPhase = Math.floor(this.maxEvents / this.badgesNeeded);
            this.eventsExplored = Math.max(0, this.eventsExplored - eventsPerPhase);
            this.addMessage(`New area unlocked! +${eventsPerPhase} exploration events!`, 'success');
            // Advance route every 2 badges
            if (this.routes && this.routes.length > 0 && this.badges % 2 === 0) {
                this.currentRouteIndex = Math.min(this.currentRouteIndex + 1, this.routes.length - 1);
                const newRoute = this.getCurrentRoute();
                if (newRoute) {
                    this.addMessage(`Arrived at ${newRoute.icon} ${newRoute.name}!`, 'success');
                }
            }

            this.showEventResult(`🏅 Badge earned! +${eventsPerPhase} events to explore!`, 'success');

            // Check underdog achievement
            if (active.level < enemy.level) {
                this.unlockAchievement('underdog');
            }

            if (this.badges >= this.badgesNeeded) {
                if (this.eliteFour.length > 0 && !this.inE4) {
                    this.inE4 = true;
                    this.e4Progress = 0;
                    this.addMessage('All badges collected! The Elite Four awaits!', 'success');
                    setTimeout(() => this.generateChoices(), 1500);
                    return;
                }
                setTimeout(() => this.victory(), 1500);
                return;
            }
        } else if (this.battleType === 'rival') {
            this.addMessage(`You defeated your rival ${this.rivalName}!`, 'success');
            if (this.battleReward.rareCandy) {
                this.bag['rare_candy'] = (this.bag['rare_candy'] || 0) + 1;
                this.addMessage('Rival dropped a Rare Candy!', 'success');
            }
        } else if (this.battleType === 'trainer') {
            const name = this.battleReward.trainerName || 'Trainer';
            this.addMessage(`You defeated ${name}!`, 'success');
            if (name.includes('Team Rocket')) this.unlockAchievement('rocket_buster');
        } else if (this.battleType === 'tower') {
            this.towerWins++;
            this.addMessage(`Battle Tower win #${this.towerWins}!`, 'success');
            if (this.towerWins >= 5) this.unlockAchievement('tower_5');
            if (this.towerWins >= 10) this.unlockAchievement('tower_10');
            // Milestone rewards every 5 wins
            if (this.towerWins % 5 === 0) {
                this.bag['rare_candy'] = (this.bag['rare_candy'] || 0) + 1;
                this.bag['full_restore'] = (this.bag['full_restore'] || 0) + 1;
                const bonus = this.towerWins * 100;
                this.money += bonus;
                this.addMessage(`🏆 Milestone ${this.towerWins}! Rare Candy + Full Restore + $${bonus}!`, 'success');
            }
        } else if (this.battleType === 'e4') {
            this.e4Progress++;
            const remaining = 4 - this.e4Progress;
            if (remaining > 0) {
                this.addMessage(`Elite Four member defeated! ${remaining} more to go!`, 'success');
            } else {
                this.addMessage('All Elite Four defeated! The Champion awaits!', 'success');
            }
        } else if (this.battleType === 'champion') {
            this.unlockAchievement('champion');
            this.addMessage(`You defeated Champion ${this.champion.name}!`, 'success');
            this.inE4 = false;
            setTimeout(() => this.victory(), 1500);
            return; // Don't continue to normal flow - victory handles it
        }

        // Fishing catch tracking
        if (this.battleReward && this.battleReward.fishing) {
            // Will count on catch
        }

        this.addMessage(`Earned $${this.battleReward ? this.battleReward.money : 0}!`);

        this.battleTurnInProgress = false;
        setTimeout(() => {
            this.state = 'playing';
            this.showScreen('game-screen');
            this.updateUI();
            this.generateChoices();
            this.saveGame();
        }, 1200);
    }

    playerPokemonFainted() {
        // If battle was already won, don't process player fainting
        if (this.battleWon) return;

        const player = this.team[this.activePokemonIndex];
        this.addBattleLog(`${player.displayName} fainted!`, 'danger');

        // Check for other alive Pokemon - prompt switch instead of auto
        const aliveIndices = this.team.reduce((arr, p, i) => {
            if (p.isAlive && i !== this.activePokemonIndex) arr.push(i);
            return arr;
        }, []);

        if (aliveIndices.length > 0) {
            this.awaitingFaintSwitch = true;
            this.battleTurnInProgress = false;
            this.addBattleLog('Choose a Pokemon to send out!', 'warning');
            this.showFaintSwitchMenu();
            return;
        }

        // All fainted - team wipe
        this.strikes--;
        this.addMessage('All your Pokemon fainted!', 'danger');
        this.addMessage(`You lost a life! ${this.strikes} remaining. Your team has been healed.`, 'warning');
        this.showEventResult(`💔 Life lost! ${this.strikes}/${this.maxStrikes} remaining`, 'danger');

        if (this.strikes <= 0) {
            setTimeout(() => this.gameOver(), 1000);
            return;
        }

        this.team.forEach(p => p.hp = p.maxHp);

        this.battleTurnInProgress = false;
        setTimeout(() => {
            this.state = 'playing';
            this.showScreen('game-screen');
            this.updateUI();
            this.generateChoices();
            this.saveGame();
        }, 1500);
    }

    showFaintSwitchMenu() {
        const log = document.getElementById('battle-log');
        const switchDiv = document.createElement('div');
        switchDiv.className = 'faint-switch-menu';

        this.team.forEach((poke, i) => {
            if (!poke.isAlive || i === this.activePokemonIndex) return;
            const btn = document.createElement('button');
            btn.className = 'switch-btn';
            btn.innerHTML = `
                <img src="${getSpriteUrl(poke.speciesId)}" style="width:24px;height:24px;image-rendering:pixelated;">
                ${poke.displayName} Lv.${poke.level} (${poke.hp}/${poke.maxHp})
            `;
            btn.onclick = () => {
                this.activePokemonIndex = i;
                this.awaitingFaintSwitch = false;
                switchDiv.remove();
                this.addBattleLog(`Go, ${poke.displayName}!`);
                this.updateBattleUI();
                this.battleTurnInProgress = false;
            };
            switchDiv.appendChild(btn);
        });

        log.appendChild(switchDiv);
        log.scrollTop = log.scrollHeight;
    }

    getLevelCap() {
        // Level cap based on badges + difficulty - prevents grinding past the next gym
        // Bonus varies by difficulty: Easy +3, Normal +1, Hard/Nightmare +0
        const nextGymIndex = this.currentGym;
        if (nextGymIndex >= GYM_LEADERS.length) return 100; // No cap after all badges
        const bonus = DIFFICULTY_SETTINGS[this.difficulty]?.levelCapBonus ?? 2;
        return GYM_LEADERS[nextGymIndex].level + bonus;
    }

    giveExp(amount, pokemon) {
        if (!pokemon) pokemon = this.team[this.activePokemonIndex];

        // Check level cap before giving XP
        const levelCap = this.getLevelCap();
        if (pokemon.level >= levelCap) {
            this.addMessage(`${pokemon.displayName} is at the level cap (${levelCap}) - beat the next gym to raise it!`, 'warning');
            return;
        }

        const oldLevel = pokemon.level;
        const evolutions = pokemon.addXp(amount, levelCap);

        for (const evo of evolutions) {
            this.evolutionCount++;
            this.unlockAchievement('evolution');
            this.addMessage(`${evo.from} evolved into ${evo.to}!`, 'success');
            this.showEvolutionAnimation(evo.from, evo.to, evo.speciesId);
        }

        if (pokemon.level > oldLevel) {
            this.addMessage(`${pokemon.displayName} grew to level ${pokemon.level}!`, 'success');
            gameAudio.levelUp();
        }
    }

    showEvolutionAnimation(oldName, newName, newSpeciesId) {
        const overlay = document.createElement('div');
        overlay.className = 'evolution-overlay';
        overlay.innerHTML = `
            <div class="evolution-content">
                <h2>Evolution!</h2>
                <img src="${getSpriteUrl(newSpeciesId)}" class="evolution-sprite" alt="${newName}">
                <p>${oldName} evolved into<br><strong>${newName}</strong>!</p>
            </div>
        `;
        document.body.appendChild(overlay);
        setTimeout(() => overlay.remove(), 2500);
    }

    tryRun() {
        if (this.battleType !== 'wild') {
            this.addBattleLog("Can't run from this battle!");
            return;
        }

        this.battleTurnInProgress = true;
        if (Math.random() < 0.7) {
            this.addBattleLog('Got away safely!');
            this.addMessage('Got away safely!');
            this.battleTurnInProgress = false;
            setTimeout(() => {
                this.state = 'playing';
                this.showScreen('game-screen');
                this.updateUI();
                this.generateChoices();
                this.saveGame();
            }, 500);
        } else {
            this.addBattleLog("Couldn't escape!");
            const enemy = this.battleEnemy;
            const player = this.team[this.activePokemonIndex];
            const result = this.calculateDamage(enemy, player);
            this.addBattleLog(`${enemy.name} attacked for ${result.damage}!`);
            if (player.takeDamage(result.damage)) {
                this.playerPokemonFainted();
            } else {
                this.updateBattleUI();
                this.battleTurnInProgress = false;
            }
        }
    }

    tryCatch() {
        if (this.battleType !== 'wild') {
            this.addBattleLog("Can't catch trainer Pokemon!");
            return;
        }

        const hasMasterball = (this.bag['master_ball'] || 0) > 0;
        const hasPokeball = (this.bag['pokeball'] || 0) > 0;
        const hasGreatball = (this.bag['great_ball'] || 0) > 0;
        const hasUltraball = (this.bag['ultra_ball'] || 0) > 0;

        if (!hasPokeball && !hasGreatball && !hasUltraball && !hasMasterball) {
            this.addBattleLog('No Poke Balls!');
            return;
        }

        this.battleTurnInProgress = true;

        let ballType, catchMod;
        if (hasMasterball) {
            this.bag['master_ball']--;
            ballType = 'Master Ball';
            catchMod = 999; // Guaranteed catch
        } else if (hasUltraball) {
            this.bag['ultra_ball']--;
            ballType = 'Ultra Ball';
            catchMod = 2.0;
        } else if (hasGreatball) {
            this.bag['great_ball']--;
            ballType = 'Great Ball';
            catchMod = 1.5;
        } else {
            this.bag['pokeball']--;
            ballType = 'Poke Ball';
            catchMod = 1.0;
        }

        const enemy = this.battleEnemy;
        this.addBattleLog(`You threw a ${ballType}!`);

        const hpFactor = 1 - (enemy.hp / enemy.maxHp) * 0.5;
        const levelFactor = Math.max(0.3, 1 - (enemy.level / 100));
        // Legendaries are much harder to catch
        const legendaryMod = (this.battleReward && this.battleReward.legendary) ? 0.3 : 1;
        const catchRate = 0.4 * hpFactor * levelFactor * catchMod * legendaryMod;

        // Catch rate hint
        const pct = Math.min(99, Math.floor(catchRate * 100));
        const hint = pct >= 70 ? 'Looking good!' : pct >= 40 ? 'Decent chance...' : pct >= 20 ? 'This might be tough.' : 'Very hard to catch!';
        this.addBattleLog(`${hint} (~${pct}% chance)`);

        if (Math.random() < catchRate) {
            if (this.team.length < 6) {
                // Species Clause check
                if (!this.canAddSpeciesToTeam(enemy.speciesId)) {
                    this.addBattleLog(`${enemy.name} was caught!`, 'success');
                    this.addBattleLog('But Species Clause prevents duplicates! Released.');
                    this.catches++;
                    this.battleTurnInProgress = false;
                    // Continue battle or end
                    if (this.battleEnemyTeam.length > 0) {
                        setTimeout(() => this.nextEnemyPokemon(), 1500);
                    } else {
                        this.winBattle();
                    }
                    return;
                }
                this.team.push(enemy);
                this.catches++;
                if (this.battleReward && this.battleReward.fishing) this.fishCatches++;
                this.addBattleLog(`Gotcha! ${enemy.name} was caught!`, 'success');
                gameAudio.catch();
                this.addMessage(`${enemy.name} joined your team!`, 'success');

                if (this.catches === 1) this.unlockAchievement('first_catch');
                if (this.fishCatches >= 3) this.unlockAchievement('master_angler');
            } else {
                this.addBattleLog(`${enemy.name} was caught!`, 'success');
                this.addBattleLog('But your team is full! Released.');
                this.catches++;
            }

            this.battleTurnInProgress = false;
            setTimeout(() => {
                this.state = 'playing';
                this.showScreen('game-screen');
                this.updateUI();
                this.generateChoices();
                this.saveGame();
            }, 1200);
        } else {
            this.addBattleLog(`Oh no! ${enemy.name} broke free!`);
            gameAudio.catchFail();
            this.addBattleLog(`${enemy.name} retaliates while you recover the ball!`, 'warning');
            const player = this.team[this.activePokemonIndex];
            const result = this.calculateDamage(enemy, player);
            this.addBattleLog(`${enemy.name} attacked for ${result.damage}!`);
            if (player.takeDamage(result.damage)) {
                this.playerPokemonFainted();
            } else {
                this.updateBattleUI();
                this.restoreBattleActions();
                this.battleTurnInProgress = false;
            }
        }
    }

    // ===== BATTLE ITEMS =====
    showBattleItems() {
        if (this.battleTurnInProgress) return;

        const modal = document.getElementById('modal');
        const body = document.getElementById('modal-body');

        const healItems = Object.entries(this.bag).filter(([id, count]) => {
            return count > 0 && ITEMS[id] && (ITEMS[id].effect === 'heal' || ITEMS[id].effect === 'revive');
        });

        if (healItems.length === 0) {
            this.addBattleLog('No usable items!');
            return;
        }

        body.innerHTML = '<h3>Use Item</h3>';

        healItems.forEach(([id, count]) => {
            const item = ITEMS[id];
            const btn = document.createElement('button');
            btn.className = 'choice-btn';
            btn.innerHTML = `${item.name} x${count}<br><small>${item.desc}</small>`;
            btn.onclick = () => {
                modal.classList.add('hidden');
                this.useBattleItem(id);
            };
            body.appendChild(btn);
        });

        modal.classList.remove('hidden');
    }

    useBattleItem(itemId) {
        const item = ITEMS[itemId];
        const player = this.team[this.activePokemonIndex];

        if (item.effect === 'heal') {
            const healAmount = item.value >= 999 ? player.maxHp : item.value;
            player.heal(healAmount);
            this.bag[itemId]--;
            this.addBattleLog(`Used ${item.name}! Healed ${Math.min(healAmount, player.maxHp - player.hp + healAmount)} HP!`);
            this.updateBattleUI();

            // Enemy gets a free attack
            this.battleTurnInProgress = true;
            setTimeout(() => {
                const enemy = this.battleEnemy;
                const result = this.calculateDamage(enemy, player);
                this.addBattleLog(`${enemy.name} attacked for ${result.damage}!`);
                if (player.takeDamage(result.damage)) {
                    this.playerPokemonFainted();
                } else {
                    this.updateBattleUI();
                    this.battleTurnInProgress = false;
                }
            }, 500);
        } else if (item.effect === 'revive') {
            // Show revive target selection
            const modal = document.getElementById('modal');
            const body = document.getElementById('modal-body');
            body.innerHTML = '<h3>Revive Which Pokemon?</h3>';

            this.team.forEach((poke, i) => {
                if (poke.isAlive) return;
                const btn = document.createElement('button');
                btn.className = 'choice-btn';
                btn.innerHTML = `${poke.displayName} Lv.${poke.level} (Fainted)`;
                btn.onclick = () => {
                    modal.classList.add('hidden');
                    poke.hp = Math.floor(poke.maxHp * 0.5);
                    this.bag[itemId]--;
                    this.addBattleLog(`Revived ${poke.displayName}!`, 'success');
                    this.updateBattleUI();

                    // Enemy free attack
                    this.battleTurnInProgress = true;
                    setTimeout(() => {
                        const enemy = this.battleEnemy;
                        const active = this.team[this.activePokemonIndex];
                        if (active.isAlive) {
                            const result = this.calculateDamage(enemy, active);
                            this.addBattleLog(`${enemy.name} attacked for ${result.damage}!`);
                            if (active.takeDamage(result.damage)) {
                                this.playerPokemonFainted();
                            } else {
                                this.updateBattleUI();
                                this.battleTurnInProgress = false;
                            }
                        }
                    }, 500);
                };
                body.appendChild(btn);
            });

            modal.classList.remove('hidden');
        } else if (item.effect === 'vitamin') {
            // Permanent stat boost
            const stat = item.stat;
            const boost = item.value;
            if (player.baseStats) {
                player.baseStats[stat] = (player.baseStats[stat] || 0) + boost;
                player.recalculateStats();
            } else {
                // Fallback: boost current stat directly
                if (stat === 'hp') {
                    player.maxHp += boost;
                    player.hp += boost;
                } else {
                    player[stat] += boost;
                }
            }
            this.bag[itemId]--;
            this.addBattleLog(`${player.displayName} used ${item.name}! ${stat.toUpperCase()} increased by ${boost}!`, 'success');
            this.updateBattleUI();
        }
    }

    // ===== EVOLUTION STONES =====
    useStone(stoneId, pokemonIndex) {
        const pokemon = this.team[pokemonIndex];
        if (!pokemon) return false;

        const stoneEvolutions = STONE_EVOLUTIONS[stoneId];
        if (!stoneEvolutions) return false;

        const target = stoneEvolutions[pokemon.speciesId];
        if (!target) return false;

        const oldName = pokemon.name;
        pokemon.evolve(target);
        this.bag[stoneId]--;
        this.evolutionCount++;
        this.unlockAchievement('evolution');
        this.addMessage(`${oldName} evolved into ${pokemon.name}!`, 'success');
        this.showEvolutionAnimation(oldName, pokemon.name, pokemon.speciesId);
        this.updateUI();
        this.saveGame();
        return true;
    }

    useLinkCable(pokemonIndex) {
        const pokemon = this.team[pokemonIndex];
        if (!pokemon) return false;

        if (typeof TRADE_EVOLUTIONS === 'undefined') return false;

        const target = TRADE_EVOLUTIONS[pokemon.speciesId];
        if (!target) return false;

        const oldName = pokemon.name;
        pokemon.evolve(target);
        this.bag['link_cable']--;
        this.evolutionCount++;
        this.unlockAchievement('evolution');
        this.addMessage(`${oldName} evolved into ${pokemon.name} via trade!`, 'success');
        this.showEvolutionAnimation(oldName, pokemon.name, pokemon.speciesId);
        this.updateUI();
        this.saveGame();
        return true;
    }

    // ===== SWITCH MENU =====
    showSwitchMenu() {
        const modal = document.getElementById('modal');
        const body = document.getElementById('modal-body');

        body.innerHTML = '<h3>Switch Pokemon</h3>';
        this.team.forEach((poke, i) => {
            if (i === this.activePokemonIndex) return;
            const btn = document.createElement('button');
            btn.className = 'choice-btn';
            btn.disabled = !poke.isAlive;
            btn.style.opacity = poke.isAlive ? '1' : '0.5';
            const pokeTypes = [poke.type];
            if (poke.species && poke.species.type2) {
                pokeTypes.push(poke.species.type2);
            }
            const typeBadges = pokeTypes.map(t =>
                `<span class="type-badge type-bg-${t.toLowerCase()}">${t}</span>`
            ).join('');
            btn.innerHTML = `
                <img src="${getSpriteUrl(poke.speciesId)}" style="width:32px;height:32px;image-rendering:pixelated;vertical-align:middle;margin-right:8px;">
                ${poke.displayName} Lv.${poke.level} (${poke.hp}/${poke.maxHp} HP)
                ${typeBadges}
            `;
            btn.onclick = () => {
                this.activePokemonIndex = i;
                modal.classList.add('hidden');
                this.addBattleLog(`Go, ${poke.displayName}!`);
                this.updateBattleUI();
                this.restoreBattleActions();

                if (this.awaitingFaintSwitch) {
                    this.awaitingFaintSwitch = false;
                    document.querySelector('.faint-switch-menu')?.remove();
                    return;
                }

                // Enemy gets free attack on switch
                this.battleTurnInProgress = true;
                setTimeout(() => {
                    const enemy = this.battleEnemy;
                    const player = this.team[this.activePokemonIndex];
                    const result = this.calculateDamage(enemy, player);
                    this.addBattleLog(`${enemy.name} attacked for ${result.damage}!`);
                    if (player.takeDamage(result.damage)) {
                        this.playerPokemonFainted();
                    } else {
                        this.updateBattleUI();
                        this.battleTurnInProgress = false;
                    }
                }, 300);
            };
            body.appendChild(btn);
        });

        modal.classList.remove('hidden');
    }

    // ===== SHOP =====
    visitShop() {
        const modal = document.getElementById('modal');
        const body = document.getElementById('modal-body');

        body.innerHTML = `<h3>🏪 PokeMart</h3><p class="shop-money">Money: $${this.money}</p>`;

        Object.entries(ITEMS).forEach(([id, item]) => {
            if (!item.price) return; // Skip non-purchasable items
            // Check badge requirement
            if (item.badgeReq && this.badges < item.badgeReq) return;
            const btn = document.createElement('button');
            btn.className = 'choice-btn shop-item';
            btn.innerHTML = `
                <div class="shop-item-name">${item.name} - $${item.price}</div>
                <div class="choice-desc">${item.desc}</div>
                <div class="shop-item-owned">Owned: ${this.bag[id] || 0}</div>
            `;
            btn.onclick = () => {
                if (this.money >= item.price) {
                    this.money -= item.price;
                    this.bag[id] = (this.bag[id] || 0) + 1;
                    this.addMessage(`Bought ${item.name}!`, 'success');
                    this.updateUI();
                    body.querySelector('.shop-money').textContent = `Money: $${this.money}`;
                    btn.querySelector('.shop-item-owned').textContent = `Owned: ${this.bag[id]}`;
                    this.saveGame();
                } else {
                    this.addMessage("Not enough money!", 'warning');
                }
            };
            body.appendChild(btn);
        });

        modal.classList.remove('hidden');
        this.generateChoices();
    }

    // ===== HEAL =====
    healTeam() {
        this.team.forEach(p => p.hp = p.maxHp);
        this.addMessage('Your Pokemon are fully healed!', 'success');
        gameAudio.heal();
        this.updateUI();
        this.generateChoices();
        this.saveGame();
    }

    // ===== BAG =====
    showBag() {
        const modal = document.getElementById('modal');
        const body = document.getElementById('modal-body');

        body.innerHTML = '<h3>🎒 Bag</h3>';

        const items = Object.entries(this.bag).filter(([_, count]) => count > 0);
        if (items.length === 0) {
            body.innerHTML += '<p>Your bag is empty!</p>';
        } else {
            items.forEach(([id, count]) => {
                const item = ITEMS[id];
                if (!item) return;
                const div = document.createElement('div');
                div.className = 'bag-item';

                // Check if usable outside battle
                const usable = item.effect === 'heal' || item.effect === 'levelup' || item.effect === 'revive' ||
                               id.includes('_stone');

                // For stones, show compatible Pokemon
                let compatInfo = '';
                if (id.includes('_stone') && typeof STONE_EVOLUTIONS !== 'undefined') {
                    const stoneEvos = STONE_EVOLUTIONS[id];
                    if (stoneEvos) {
                        const compat = this.team.filter(p => stoneEvos[p.speciesId]).map(p => {
                            const evoTarget = stoneEvos[p.speciesId];
                            const evoData = POKEMON_DATA[evoTarget];
                            return `${p.displayName} → ${evoData ? evoData.name : evoTarget}`;
                        });
                        if (compat.length > 0) {
                            compatInfo = `<div class="compat-list" style="color:#4CAF50;font-size:0.85em;margin-top:4px;">✓ Can evolve: ${compat.join(', ')}</div>`;
                        } else {
                            compatInfo = `<div class="compat-list" style="color:#999;font-size:0.85em;margin-top:4px;">○ No compatible Pokemon</div>`;
                        }
                    }
                }

                // For Link Cable, show trade evolution compatibility
                if (id === 'link_cable' && typeof TRADE_EVOLUTIONS !== 'undefined') {
                    const compat = this.team.filter(p => TRADE_EVOLUTIONS[p.speciesId]).map(p => {
                        const evoTarget = TRADE_EVOLUTIONS[p.speciesId];
                        const evoData = POKEMON_DATA[evoTarget];
                        return `${p.displayName} → ${evoData ? evoData.name : evoTarget}`;
                    });
                    if (compat.length > 0) {
                        compatInfo = `<div class="compat-list" style="color:#4CAF50;font-size:0.85em;margin-top:4px;">✓ Trade evo: ${compat.join(', ')}</div>`;
                    } else {
                        compatInfo = `<div class="compat-list" style="color:#999;font-size:0.85em;margin-top:4px;">○ No trade evolutions</div>`;
                    }
                }

                div.innerHTML = `
                    <div class="bag-item-info">
                        <strong>${item.name}</strong> x${count}
                        <div class="choice-desc">${item.desc}</div>
                        ${compatInfo}
                    </div>
                    ${usable ? '<button class="bag-use-btn">Use</button>' : ''}
                `;

                if (usable) {
                    div.querySelector('.bag-use-btn').onclick = () => {
                        modal.classList.add('hidden');
                        this.useItemFromBag(id);
                    };
                }

                body.appendChild(div);
            });
        }

        // Display TMs
        if (this.tmBag && this.tmBag.length > 0) {
            body.innerHTML += '<hr><h4>📀 Technical Machines</h4>';
            this.tmBag.forEach(tmId => {
                const tm = TMS[tmId];
                if (!tm) return;
                const div = document.createElement('div');
                div.className = 'bag-item';
                div.innerHTML = `
                    <div class="bag-item-info">
                        <strong>${tm.name}</strong>
                        <div class="choice-desc">${tm.type} · ${tm.power ? tm.power + ' PWR' : 'Status'} · ${tm.description ? tm.description.substring(0, 40) + '...' : ''}</div>
                    </div>
                    <button class="bag-use-btn">Teach</button>
                `;
                div.querySelector('.bag-use-btn').onclick = () => {
                    this.showTMTeach(tmId);
                };
                body.appendChild(div);
            });
        }

        modal.classList.remove('hidden');
    }

    useItemFromBag(itemId) {
        const item = ITEMS[itemId];

        // Show Pokemon selection
        const modal = document.getElementById('modal');
        const body = document.getElementById('modal-body');
        body.innerHTML = `<h3>Use ${item.name} on which Pokemon?</h3>`;

        this.team.forEach((poke, i) => {
            const btn = document.createElement('button');
            btn.className = 'choice-btn';

            // Determine if valid target
            let valid = true;
            if (item.effect === 'heal' && (!poke.isAlive || poke.hp === poke.maxHp)) valid = false;
            if (item.effect === 'revive' && poke.isAlive) valid = false;
            if (itemId.includes('_stone')) {
                const stoneEvos = STONE_EVOLUTIONS[itemId];
                if (!stoneEvos || !stoneEvos[poke.speciesId]) valid = false;
            }
            if (itemId === 'link_cable') {
                if (typeof TRADE_EVOLUTIONS === 'undefined' || !TRADE_EVOLUTIONS[poke.speciesId]) valid = false;
            }

            btn.disabled = !valid;
            btn.style.opacity = valid ? '1' : '0.5';
            btn.innerHTML = `
                <img src="${getSpriteUrl(poke.speciesId)}" style="width:32px;height:32px;image-rendering:pixelated;vertical-align:middle;margin-right:8px;">
                ${poke.displayName} Lv.${poke.level} ${poke.isAlive ? `(${poke.hp}/${poke.maxHp} HP)` : '(Fainted)'}
            `;
            btn.onclick = () => {
                if (!valid) return;
                modal.classList.add('hidden');

                if (item.effect === 'heal') {
                    const healAmount = item.value >= 999 ? poke.maxHp : item.value;
                    poke.heal(healAmount);
                    this.bag[itemId]--;
                    this.addMessage(`Used ${item.name} on ${poke.displayName}!`, 'success');
                } else if (item.effect === 'levelup') {
                    this.bag[itemId]--;
                    this.giveExp(poke.xpToNext + 1, poke);
                    this.addMessage(`${poke.displayName} grew to level ${poke.level}!`, 'success');
                } else if (item.effect === 'revive') {
                    poke.hp = Math.floor(poke.maxHp * 0.5);
                    this.bag[itemId]--;
                    this.addMessage(`Revived ${poke.displayName}!`, 'success');
                } else if (itemId.includes('_stone')) {
                    this.useStone(itemId, i);
                } else if (itemId === 'link_cable') {
                    this.useLinkCable(i);
                }

                this.updateUI();
                this.saveGame();
            };
            body.appendChild(btn);
        });

        modal.classList.remove('hidden');
    }

    // ===== TEAM MANAGEMENT =====
    // Build evolution chain for a Pokemon
    getEvolutionChain(speciesId) {
        const chain = [];
        const species = POKEMON_DATA[speciesId];
        if (!species) return chain;

        // Find pre-evolution (if any)
        let preEvo = null;
        for (const [id, data] of Object.entries(POKEMON_DATA)) {
            if (data.evolves && data.evolves.into === speciesId) {
                preEvo = { id, ...data };
                break;
            }
        }

        // Find next evolution (if any)
        let nextEvo = null;
        if (species.evolves) {
            const nextData = POKEMON_DATA[species.evolves.into];
            if (nextData) {
                nextEvo = { id: species.evolves.into, ...nextData, level: species.evolves.level };
            }
        }

        return { preEvo, current: { id: speciesId, ...species }, nextEvo };
    }

    // Show evolution path modal
    showEvolutionPath(pokemon) {
        const modal = document.getElementById('modal');
        const body = document.getElementById('modal-body');
        const chain = this.getEvolutionChain(pokemon.speciesId);

        let evolutionHTML = '';
        
        if (chain.preEvo) {
            evolutionHTML += `
                <div class="evo-stage">
                    <img src="${getSpriteUrl(chain.preEvo.id)}" class="evo-sprite" alt="${chain.preEvo.name}">
                    <div class="evo-name">${chain.preEvo.name}</div>
                    <div class="evo-arrow">↑</div>
                </div>
            `;
        }

        evolutionHTML += `
            <div class="evo-stage current">
                <img src="${getSpriteUrl(chain.current.id)}" class="evo-sprite" alt="${chain.current.name}">
                <div class="evo-name">${chain.current.name}</div>
                <div class="evo-label">Current</div>
            </div>
        `;

        if (chain.nextEvo) {
            const isLevelEvo = chain.nextEvo.level !== undefined;
            const condition = isLevelEvo ? `Lv.${chain.nextEvo.level}` : 'Stone/Trade';
            evolutionHTML += `
                <div class="evo-stage">
                    <div class="evo-arrow">↓</div>
                    <img src="${getSpriteUrl(chain.nextEvo.id)}" class="evo-sprite" alt="${chain.nextEvo.name}">
                    <div class="evo-name">${chain.nextEvo.name}</div>
                    <div class="evo-condition">${condition}</div>
                </div>
            `;
        } else {
            evolutionHTML += `
                <div class="evo-stage final">
                    <div class="evo-arrow">↓</div>
                    <div class="evo-label">Fully Evolved</div>
                </div>
            `;
        }

        body.innerHTML = `
            <h3>🧬 Evolution Path</h3>
            <div class="evolution-chain">
                ${evolutionHTML}
            </div>
            <div class="evo-stats">
                <p><strong>${pokemon.displayName}</strong> — Lv.${pokemon.level}</p>
                ${chain.nextEvo && chain.nextEvo.level ? `<p>Evolution at: Lv.${chain.nextEvo.level}</p>` : ''}
            </div>
            <button class="btn btn-primary" onclick="game.showTeamManagement()">← Back to Team</button>
        `;

        modal.classList.remove('hidden');
    }

    showTeamManagement() {
        const modal = document.getElementById('modal');
        const body = document.getElementById('modal-body');

        body.innerHTML = '<h3>👥 Team Management</h3><p class="drag-hint">👆 Long-press or drag handles to reorder</p>';

        // Create container for drag-drop
        const teamList = document.createElement('div');
        teamList.className = 'team-list';
        teamList.id = 'team-list';

        // Initialize drag manager if not exists or recreate
        if (this.dragManager) {
            this.dragManager.destroy();
        }

        this.team.forEach((poke, i) => {
            const card = document.createElement('div');
            card.className = `team-card ${!poke.isAlive ? 'fainted' : ''}`;
            const pokeTypes = [poke.type];
            if (poke.species && poke.species.type2) {
                pokeTypes.push(poke.species.type2);
            }
            const typeBadges = pokeTypes.map(t =>
                `<span class="type-badge type-bg-${t.toLowerCase()}">${t}</span>`
            ).join('');
            card.innerHTML = `
                <div class="drag-handle" aria-label="Drag to reorder">⋮⋮</div>
                <div class="team-card-header">
                    <img src="${getSpriteUrl(poke.speciesId)}" class="team-card-sprite" alt="${poke.displayName}">
                    <div class="team-card-info">
                        <div class="team-card-name">
                            ${poke.displayName}
                            ${typeBadges}
                        </div>
                        <div class="team-card-level">Lv.${poke.level} (XP: ${poke.xp}/${poke.xpToNext})</div>
                        <div class="team-card-hp">
                            HP: ${poke.hp}/${poke.maxHp}
                            <div class="mini-hp" style="width:80px">
                                <div class="mini-hp-fill" style="width:${poke.hpPercent}%;background:${poke.hpPercent < 20 ? 'var(--danger)' : poke.hpPercent < 50 ? 'var(--warning)' : 'var(--success)'}"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="team-card-stats">
                    <span>HP: ${poke.maxHp}</span>
                    <span>ATK: ${poke.attack}</span>
                    <span>DEF: ${poke.defense}</span>
                    <span>SPA: ${poke.specialAttack || poke.spa || '-'}</span>
                    <span>SPD: ${poke.specialDefense || poke.spd_def || '-'}</span>
                    <span>SPE: ${poke.speed}</span>
                </div>
                <div class="team-card-moves">
                    ${poke.moves.map(m => `<span class="move-tag type-bg-${m.type}">${m.name}${m.power > 0 ? ` (${m.power})` : ''}</span>`).join(' ')}
                </div>

                <div class="team-card-actions">
                    <button class="team-action-btn nickname-btn" title="Nickname">✏️</button>
                    ${this.team.length > 1 ? '<button class="team-action-btn release-btn" title="Release">🔓</button>' : ''}
                </div>
            `;

            // Nickname
            card.querySelector('.nickname-btn').onclick = () => {
                const newName = prompt(`Nickname for ${poke.name}:`, poke.nickname || '');
                if (newName !== null) {
                    poke.nickname = newName.trim() || null;
                    this.showTeamManagement();
                    this.updateUI();
                    this.saveGame();
                }
            };

            // Evolution path — click on sprite or header
            card.querySelector('.team-card-header').onclick = (e) => {
                // Don't trigger if clicking buttons
                if (e.target.closest('.team-action-btn')) return;
                this.showEvolutionPath(poke);
            };

            // Release
            const releaseBtn = card.querySelector('.release-btn');
            if (releaseBtn) {
                releaseBtn.onclick = () => {
                    if (confirm(`Release ${poke.displayName}? This cannot be undone!`)) {
                        this.team.splice(i, 1);
                        this.addMessage(`${poke.displayName} was released. Bye bye!`, 'warning');
                        this.showTeamManagement();
                        this.updateUI();
                        this.saveGame();
                    }
                };
            }

            teamList.appendChild(card);
        });

        body.appendChild(teamList);

        // Initialize drag-drop manager
        this.dragManager = new DragDropManager(teamList, (fromIndex, toIndex) => {
            // Reorder team array
            const [moved] = this.team.splice(fromIndex, 1);
            this.team.splice(toIndex, 0, moved);

            // Update active index if needed
            if (this.activePokemonIndex === fromIndex) {
                this.activePokemonIndex = toIndex;
            } else if (fromIndex < this.activePokemonIndex && toIndex >= this.activePokemonIndex) {
                this.activePokemonIndex--;
            } else if (fromIndex > this.activePokemonIndex && toIndex <= this.activePokemonIndex) {
                this.activePokemonIndex++;
            }

            this.saveGame();
            this.updateUI();
            // Re-render to show new order
            this.showTeamManagement();
        });

        modal.classList.remove('hidden');
    }

    // ===== STATS =====
    showStats() {
        const modal = document.getElementById('modal');
        const body = document.getElementById('modal-body');

        const elapsed = Date.now() - this.startTime;
        const minutes = Math.floor(elapsed / 60000);
        const seconds = Math.floor((elapsed % 60000) / 1000);

        body.innerHTML = `
            <h3>📊 Stats</h3>
            <div class="stats-grid">
                <div class="stat-item"><span class="stat-label">Badges</span><span class="stat-value">${this.badges}/${this.badgesNeeded}</span></div>
                <div class="stat-item"><span class="stat-label">Money</span><span class="stat-value">$${this.money}</span></div>
                <div class="stat-item"><span class="stat-label">Strikes</span><span class="stat-value">${this.strikes}/${this.maxStrikes}</span></div>
                <div class="stat-item"><span class="stat-label">Battles Won</span><span class="stat-value">${this.battlesWon}</span></div>
                <div class="stat-item"><span class="stat-label">Pokemon Caught</span><span class="stat-value">${this.catches}</span></div>
                <div class="stat-item"><span class="stat-label">Evolutions</span><span class="stat-value">${this.evolutionCount}</span></div>
                <div class="stat-item"><span class="stat-label">Events</span><span class="stat-value">${this.eventsExplored}</span></div>
                <div class="stat-item"><span class="stat-label">Time</span><span class="stat-value">${minutes}m ${seconds}s</span></div>
                <div class="stat-item"><span class="stat-label">Difficulty</span><span class="stat-value">${this.difficulty}</span></div>
                ${this.postGame ? `<div class="stat-item"><span class="stat-label">Tower Wins</span><span class="stat-value">${this.towerWins}</span></div>` : ''}
            </div>
        `;

        modal.classList.remove('hidden');
    }

    // ===== ACHIEVEMENTS =====
    unlockAchievement(id) {
        if (this.achievements.has(id)) return;
        if (!ACHIEVEMENTS[id]) return;

        this.achievements.add(id);
        const ach = ACHIEVEMENTS[id];
        this.addMessage(`${ach.icon} Achievement: ${ach.name}!`, 'success');

        // Show popup
        const popup = document.createElement('div');
        popup.className = 'achievement-popup fade-in';
        popup.innerHTML = `
            <div class="achievement-icon">${ach.icon}</div>
            <div class="achievement-info">
                <div class="achievement-title">Achievement Unlocked!</div>
                <div class="achievement-name">${ach.name}</div>
                <div class="achievement-desc">${ach.desc}</div>
            </div>
        `;
        document.body.appendChild(popup);
        setTimeout(() => {
            popup.classList.add('fade-out');
            setTimeout(() => popup.remove(), 500);
        }, 3000);

        this.saveGame();
    }

    showAchievements() {
        const modal = document.getElementById('modal');
        const body = document.getElementById('modal-body');

        body.innerHTML = '<h3>🏆 Achievements</h3>';

        const grid = document.createElement('div');
        grid.className = 'achievements-grid';

        Object.entries(ACHIEVEMENTS).forEach(([id, ach]) => {
            const unlocked = this.achievements.has(id);
            const div = document.createElement('div');
            div.className = `achievement-card ${unlocked ? 'unlocked' : 'locked'}`;
            div.innerHTML = `
                <div class="achievement-card-icon">${unlocked ? ach.icon : '🔒'}</div>
                <div class="achievement-card-name">${unlocked ? ach.name : '???'}</div>
                <div class="achievement-card-desc">${unlocked ? ach.desc : 'Keep playing to unlock!'}</div>
            `;
            grid.appendChild(div);
        });

        body.appendChild(grid);
        modal.classList.remove('hidden');
    }

    // ===== VICTORY / GAME OVER =====
    victory() {
        this.state = 'victory';
        this.updateUI();
        this.unlockAchievement('champion');
        gameAudio.victory();

        if (this.strikes === this.maxStrikes) this.unlockAchievement('flawless');
        if (this.strikes === 1) this.unlockAchievement('survivor');
        if (this.eventsExplored < 50) this.unlockAchievement('speedrunner');
        if (this.difficulty === 'nightmare') this.unlockAchievement('nightmare_clear');
        if (this.difficulty === 'hard') this.unlockAchievement('hard_clear');

        const elapsed = Date.now() - this.startTime;
        const minutes = Math.floor(elapsed / 60000);
        const seconds = Math.floor((elapsed % 60000) / 1000);

        // Save to Hall of Fame
        const entry = {
            date: new Date().toLocaleDateString(),
            difficulty: this.difficulty,
            time: `${minutes}m ${seconds}s`,
            team: this.team.map(p => ({ name: p.displayName, level: p.level, speciesId: p.speciesId })),
            badges: this.badges,
            catches: this.catches,
            events: this.eventsExplored,
            battlesWon: this.battlesWon,
            evolutions: this.evolutionCount,
            towerWins: this.towerWins
        };
        this.hallOfFame.push(entry);
        this.hallOfFame.sort((a, b) => {
            const diffOrder = { nightmare: 0, hard: 1, normal: 2, easy: 3 };
            return (diffOrder[a.difficulty] || 2) - (diffOrder[b.difficulty] || 2);
        });
        this.saveHallOfFame();

        // Save ghost rival for future encounters
        if (typeof saveGhostRival === 'function') {
            saveGhostRival(this.team, this.playerName);
            this.addMessage('👻 Your team has been recorded in the Ghost Rival Hall of Fame!', 'success');
        }

        this.showScreen('gameover-screen');
        document.getElementById('gameover-title').textContent = '🎉 Victory!';
        document.getElementById('gameover-title').className = 'victory';
        const champName = this.champion ? this.champion.name : 'the Champion';
        document.getElementById('gameover-message').textContent = `You defeated ${champName} and became the new Champion!`;

        const teamHtml = this.team.map(p => `
            <div class="victory-pokemon">
                <img src="${getSpriteUrl(p.speciesId)}" alt="${p.displayName}">
                <span>${p.displayName} Lv.${p.level}</span>
            </div>
        `).join('');

        // Build gym leader lineup display
        const gymHtml = GYM_LEADERS.map((g, i) => {
            const defeated = i < this.currentGym;
            return `<span class="gym-tag ${defeated ? 'gym-defeated' : 'gym-undefeated'}" title="${g.badge} - ${g.region}">${g.name} (${g.type})</span>`;
        }).join(' ');

        // E4 lineup
        const e4Html = this.eliteFour.map(e => `<span class="gym-tag gym-defeated" title="${e.region}">${e.name}</span>`).join(' ');
        const champHtml = this.champion ? `<span class="gym-tag gym-defeated" title="${this.champion.region}">👑 ${this.champion.name}</span>` : '';

        document.getElementById('run-stats').innerHTML = `
            <h3>Run Summary</h3>
            <div class="victory-team">${teamHtml}</div>
            <div class="stats-grid">
                <div class="stat-item"><span class="stat-label">Time</span><span class="stat-value">${minutes}m ${seconds}s</span></div>
                <div class="stat-item"><span class="stat-label">Events Used</span><span class="stat-value">${this.eventsExplored}/${this.maxEvents || '∞'}</span></div>
                <div class="stat-item"><span class="stat-label">Caught</span><span class="stat-value">${this.catches}</span></div>
                <div class="stat-item"><span class="stat-label">Evolutions</span><span class="stat-value">${this.evolutionCount}</span></div>
                <div class="stat-item"><span class="stat-label">Battles Won</span><span class="stat-value">${this.battlesWon}</span></div>
                <div class="stat-item"><span class="stat-label">Strikes Left</span><span class="stat-value">${this.strikes}/${this.maxStrikes}</span></div>
                <div class="stat-item"><span class="stat-label">Difficulty</span><span class="stat-value">${this.difficulty}</span></div>
                <div class="stat-item"><span class="stat-label">Money</span><span class="stat-value">$${this.money}</span></div>
            </div>
            <h4 style="margin-top:1rem">Gym Leaders Faced</h4>
            <div class="gym-lineup">${gymHtml}</div>
            ${e4Html ? `<h4 style="margin-top:0.5rem">Elite Four</h4><div class="gym-lineup">${e4Html} ${champHtml}</div>` : ''}
        `;

        // Add continue exploring button
        const continueBtn = document.createElement('button');
        continueBtn.id = 'continue-postgame-btn';
        continueBtn.className = 'start-btn';
        continueBtn.textContent = 'Continue Exploring (Battle Tower)';
        continueBtn.style.marginTop = '1rem';
        continueBtn.onclick = () => {
            this.postGame = true;
            this.state = 'playing';
            this.showScreen('game-screen');
            this.updateUI();
            this.addMessage('Welcome to the post-game! Try the Battle Tower!', 'success');
            this.generateChoices();
            this.saveGame();
        };
        document.getElementById('run-stats').appendChild(continueBtn);

        // Show Hall of Fame button
        const hofBtn = document.createElement('button');
        hofBtn.className = 'start-btn';
        hofBtn.textContent = 'Hall of Fame';
        hofBtn.style.marginTop = '0.5rem';
        hofBtn.style.background = 'var(--bg-light)';
        hofBtn.onclick = () => this.showHallOfFame();
        document.getElementById('run-stats').appendChild(hofBtn);

        this.deleteSave();
    }

    showHallOfFame() {
        const modal = document.getElementById('modal');
        const body = document.getElementById('modal-body');

        body.innerHTML = '<h3>🏆 Hall of Fame</h3>';

        if (this.hallOfFame.length === 0) {
            body.innerHTML += '<p>No entries yet. Beat the game to be immortalized!</p>';
        } else {
            this.hallOfFame.forEach((entry, i) => {
                const div = document.createElement('div');
                div.className = 'hof-entry';
                const teamImgs = entry.team.map(p => `<img src="${getSpriteUrl(p.speciesId)}" title="${p.name} Lv.${p.level}" style="width:32px;height:32px;image-rendering:pixelated;">`).join('');
                div.innerHTML = `
                    <div class="hof-rank">#${i + 1}</div>
                    <div class="hof-info">
                        <div>${entry.difficulty.toUpperCase()} - ${entry.time} - ${entry.date}</div>
                        <div class="hof-team">${teamImgs}</div>
                        <div class="choice-desc">Badges: ${entry.badges} | Caught: ${entry.catches} | Events: ${entry.events}</div>
                    </div>
                `;
                body.appendChild(div);
            });
        }

        modal.classList.remove('hidden');
    }

    gameOver() {
        this.state = 'gameover';
        this.deleteSave();
        gameAudio.gameOver();

        const elapsed = Date.now() - this.startTime;
        const minutes = Math.floor(elapsed / 60000);
        const seconds = Math.floor((elapsed % 60000) / 1000);

        this.showScreen('gameover-screen');
        document.getElementById('gameover-title').textContent = '💀 Game Over';
        document.getElementById('gameover-title').className = 'defeat';
        document.getElementById('gameover-message').textContent = 'You ran out of strikes!';
        const goGymHtml = GYM_LEADERS.map((g, i) => {
            const defeated = i < this.currentGym;
            return `<span class="gym-tag ${defeated ? 'gym-defeated' : 'gym-undefeated'}" title="${g.badge} - ${g.region}">${g.name} (${g.type})</span>`;
        }).join(' ');

        document.getElementById('run-stats').innerHTML = `
            <div class="stats-grid">
                <div class="stat-item"><span class="stat-label">Badges</span><span class="stat-value">${this.badges}/${this.badgesNeeded}</span></div>
                <div class="stat-item"><span class="stat-label">Time</span><span class="stat-value">${minutes}m ${seconds}s</span></div>
                <div class="stat-item"><span class="stat-label">Events Used</span><span class="stat-value">${this.eventsExplored}/${this.maxEvents || '∞'}</span></div>
                <div class="stat-item"><span class="stat-label">Battles Won</span><span class="stat-value">${this.battlesWon}</span></div>
                <div class="stat-item"><span class="stat-label">Caught</span><span class="stat-value">${this.catches}</span></div>
                <div class="stat-item"><span class="stat-label">Difficulty</span><span class="stat-value">${this.difficulty}</span></div>
            </div>
            <h4 style="margin-top:1rem">Gym Leaders</h4>
            <div class="gym-lineup">${goGymHtml}</div>
        `;
    }

    restart() {
        this.state = 'start';
        this.team = [];
        this.bag = {};
        this.money = 1000;
        this.badges = 0;
        this.strikes = 3;
        this.maxStrikes = 3;
        this.currentGym = 0;
        this.catches = 0;
        this.fishCatches = 0;
        this.battlesWon = 0;
        this.eventsExplored = 0;
        this.evolutionCount = 0;
        this.selectedStarter = null;
        this.achievements = new Set();
        this.postGame = false;
        this.towerWins = 0;
        this.lastRivalBadge = 0;
        this.deleteSave();

        this.showScreen('start-screen');
        this.renderStartScreen();
        document.getElementById('message-log').innerHTML = '<div class="message">Welcome to Pokemon Roguelike!</div>';
    }

    // ===== TM TEACHING =====
    showTMTeach(tmId) {
        const tm = TMS[tmId];
        if (!tm) return;

        const modal = document.getElementById('modal');
        const body = document.getElementById('modal-body');

        body.innerHTML = `<h3>📀 Teach ${tm.name}</h3>
            <p><strong>Type:</strong> ${tm.type} · <strong>Power:</strong> ${tm.power || '-'} · <strong>Accuracy:</strong> ${tm.accuracy}%</p>
            <p>${tm.description}</p>
            <hr>
            <h4>Select Pokemon to teach:</h4>
        `;

        this.team.forEach((poke, i) => {
            const isCompatible = typeof canLearnTM === "function" ? canLearnTM(poke.speciesId, tmId) : true;
            const alreadyKnows = poke.moves.some(m => m.id === tm.move);

            const btn = document.createElement('button');
            btn.className = 'choice-btn';
            btn.disabled = !isCompatible || alreadyKnows;
            btn.style.opacity = (!isCompatible || alreadyKnows) ? '0.5' : '1';

            let status = '';
            if (alreadyKnows) status = ' (already knows)';
            else if (!isCompatible) status = ' (incompatible)';

            btn.innerHTML = `
                <img src="${getSpriteUrl(poke.speciesId)}" style="width:32px;height:32px;image-rendering:pixelated;vertical-align:middle;margin-right:8px;">
                ${poke.displayName} Lv.${poke.level}${status}
            `;

            btn.onclick = () => {
                if (poke.moves.length >= 4) {
                    this.showMoveReplacementPrompt(tmId, i);
                } else {
                    this.teachMoveToPokemon(tmId, i);
                    modal.classList.add('hidden');
                }
            };

            body.appendChild(btn);
        });

        const cancelBtn = document.createElement('button');
        cancelBtn.className = 'choice-btn';
        cancelBtn.textContent = 'Cancel';
        cancelBtn.onclick = () => this.showBag();
        body.appendChild(cancelBtn);

        modal.classList.remove('hidden');
    }

    showMoveReplacementPrompt(tmId, pokemonIndex) {
        const tm = TMS[tmId];
        const pokemon = this.team[pokemonIndex];

        const modal = document.getElementById('modal');
        const body = document.getElementById('modal-body');

        body.innerHTML = `
            <h3>📀 ${pokemon.displayName} wants to learn ${tm.name}</h3>
            <p>${tm.description}</p>
            <p><strong>Type:</strong> ${tm.type} · <strong>Power:</strong> ${tm.power || '-'} · <strong>PP:</strong> ${tm.pp}</p>
            <hr>
            <h4>But ${pokemon.displayName} already knows 4 moves.</h4>
            <p>Which move should be forgotten?</p>
        `;

        pokemon.moves.forEach((move, index) => {
            const moveBtn = document.createElement('button');
            moveBtn.className = 'choice-btn';
            moveBtn.style.marginBottom = '0.5rem';
            moveBtn.innerHTML = `
                <strong>${move.name}</strong><br>
                <small>${move.type.toUpperCase()} · ${move.power ? move.power + ' PWR' : 'Status'} · PP: ${move.pp}/${move.maxPp}</small>
            `;
            moveBtn.onclick = () => this.confirmMoveReplace(tmId, pokemonIndex, index);
            body.appendChild(moveBtn);
        });

        const cancelBtn = document.createElement('button');
        cancelBtn.className = 'choice-btn';
        cancelBtn.textContent = 'Cancel';
        cancelBtn.onclick = () => this.showBag();
        body.appendChild(cancelBtn);

        modal.classList.remove('hidden');
    }

    confirmMoveReplace(tmId, pokemonIndex, moveIndex) {
        const tm = TMS[tmId];
        const pokemon = this.team[pokemonIndex];

        // Bounds check to prevent crash on invalid move index
        if (moveIndex < 0 || moveIndex >= pokemon.moves.length) {
            console.error('Invalid move index:', moveIndex, 'for pokemon', pokemon.displayName);
            this.addMessage('Error: Invalid move selection.', 'danger');
            return;
        }

        const oldMoveName = pokemon.moves[moveIndex].name;

        pokemon.moves[moveIndex] = {
            id: tm.move,
            name: tm.name.replace('TM: ', ''),
            type: tm.type,
            power: tm.power,
            pp: tm.pp,
            maxPp: tm.pp,
            accuracy: tm.accuracy,
            category: tm.category
        };

        this.addMessage(`${pokemon.displayName} learned ${tm.name}! Forgot ${oldMoveName}.`, 'success');
        this.saveGame();
        this.updateUI();
        document.getElementById('modal').classList.add('hidden');
    }

    teachMoveToPokemon(tmId, pokemonIndex) {
        const tm = TMS[tmId];
        const pokemon = this.team[pokemonIndex];

        const tmMoveData = (typeof CANONICAL_MOVES !== 'undefined' && CANONICAL_MOVES[tm.move]) ? CANONICAL_MOVES[tm.move] : null;
        pokemon.moves.push({
            id: tm.move,
            name: tm.name.replace('TM: ', ''),
            type: tm.type,
            power: tm.power,
            pp: tm.pp,
            maxPp: tm.pp,
            accuracy: tm.accuracy,
            category: tm.category,
            fixedDamage: tmMoveData ? tmMoveData.fixedDamage : undefined
        });

        this.addMessage(`${pokemon.displayName} learned ${tm.name}!`, 'success');
        this.saveGame();
        this.updateUI();
    }
}

// Start the game
const game = new Game();