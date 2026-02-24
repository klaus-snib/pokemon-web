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

    addXp(amount) {
        this.xp += amount;
        const evolutions = [];
        while (this.xp >= this.xpToNext) {
            this.xp -= this.xpToNext;
            const evo = this.levelUp();
            this.xpToNext = this.calcXpToNext();
            if (evo) evolutions.push(evo);
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

        // Check evolution
        const evo = this.species.evolves;
        if (evo && evo.level && this.level >= evo.level) {
            return evo.into;
        }
        return null;
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
            speed: this.speed
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
    lucky: { name: "Lucky", desc: "Find a legendary Pokemon", icon: "🍀" }
};

// ===== TRAINER DATA =====
const NPC_TRAINERS = [
    { name: "Bug Catcher Doug", team: ['caterpie', 'weedle'], levelMod: -2, reward: 200 },
    { name: "Lass Jenny", team: ['nidoran_m', 'pidgey'], levelMod: -1, reward: 300 },
    { name: "Hiker Marcus", team: ['geodude', 'machop'], levelMod: 0, reward: 400 },
    { name: "Swimmer Lisa", team: ['staryu', 'psyduck'], levelMod: 0, reward: 400 },
    { name: "Psychic Frank", team: ['abra', 'gastly'], levelMod: 1, reward: 500 },
    { name: "Ace Trainer Zoe", team: ['pidgeotto', 'machoke', 'kadabra'], levelMod: 2, reward: 800 },
    { name: "Cooltrainer Rex", team: ['graveler', 'haunter', 'charmeleon'], levelMod: 3, reward: 1000 },
    { name: "Veteran Hana", team: ['gyarados', 'pidgeot', 'machoke'], levelMod: 4, reward: 1200 }
];

const RIVAL_NAMES = ["Blue", "Silver", "Gary", "Damian"];

class Game {
    constructor() {
        this.state = 'start';
        this.team = [];
        this.bag = {};
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

        this.init();
    }

    // ===== SAVE/LOAD =====
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
            towerWins: this.towerWins
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
        });

        document.getElementById('modal').addEventListener('click', (e) => {
            if (e.target === document.getElementById('modal')) {
                document.getElementById('modal').classList.add('hidden');
            }
        });

        document.getElementById('bag-btn').addEventListener('click', () => this.showBag());
        document.getElementById('team-btn').addEventListener('click', () => this.showTeamManagement());
        document.getElementById('stats-btn').addEventListener('click', () => this.showStats());
        document.getElementById('achievements-btn').addEventListener('click', () => this.showAchievements());

        document.getElementById('restart-btn').addEventListener('click', () => this.restart());

        document.querySelectorAll('.action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.currentTarget.dataset.action;
                this.handleBattleAction(action);
            });
        });
    }

    renderStartScreen() {
        const grid = document.getElementById('starter-selection');
        grid.innerHTML = '';

        STARTERS.forEach(id => {
            const pokemon = POKEMON_DATA[id];
            const div = document.createElement('div');
            div.className = 'starter-option';
            div.dataset.pokemon = id;
            div.innerHTML = `
                <img src="${getSpriteUrl(id)}" alt="${pokemon.name}">
                <span class="name">${pokemon.name}</span>
                <span class="type-badge type-bg-${pokemon.type.toLowerCase()}">${pokemon.type}</span>
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
        const starterTypes = { bulbasaur: 'Grass', charmander: 'Fire', squirtle: 'Water', chikorita: 'Grass', cyndaquil: 'Fire', totodile: 'Water', pikachu: 'Electric', eevee: 'Normal' };
        const advantage = { Grass: 'Fire', Fire: 'Water', Water: 'Grass', Electric: 'Grass', Normal: 'Fighting' };
        const myType = starterTypes[this.selectedStarter];
        const rivalType = advantage[myType] || 'Fire';
        const rivalOptions = STARTERS.filter(s => POKEMON_DATA[s].type === rivalType);
        this.rivalStarter = rivalOptions.length > 0 ? rivalOptions[0] : 'charmander';

        // Create starter Pokemon
        const starter = new Pokemon(this.selectedStarter, 5);
        this.team = [starter];

        this.state = 'playing';
        this.showScreen('game-screen');
        this.updateUI();
        this.addMessage(`You chose ${starter.name}! Your adventure begins!`, 'success');
        this.addMessage(`Your rival ${this.rivalName} chose ${POKEMON_DATA[this.rivalStarter].name}!`, 'warning');
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
        document.getElementById('badges').textContent = `Badges: ${this.badges}/${this.badgesNeeded}`;
        document.getElementById('money').textContent = `$${this.money}`;
        document.getElementById('strikes').textContent = '❤️'.repeat(this.strikes) + '🖤'.repeat(this.maxStrikes - this.strikes);
        const eventsLeft = this.maxEvents ? this.maxEvents - this.eventsExplored : '∞';
        document.getElementById('events-count').textContent = `Events: ${eventsLeft} left`;

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
            const gameArea = document.getElementById('game-area');
            gameArea.insertBefore(banner, gameArea.firstChild);
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
            this.addMessage('No more time to explore — gym battles only!', 'warning');
        }

        // Wild battle (not available if out of events)
        if (!outOfEvents) {
            choices.push({
                icon: '🌿',
                text: 'Explore Tall Grass',
                desc: 'Encounter wild Pokemon',
                action: () => this.wildBattle()
            });
        }

        // Gym challenge if ready
        if (this.currentGym < GYM_LEADERS.length && !this.postGame) {
            const gym = GYM_LEADERS[this.currentGym];
            choices.push({
                icon: '🏛️',
                text: `Challenge ${gym.name}`,
                desc: `${gym.type} type - Lv.${gym.level}`,
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

        // Random events (pick 1-2)
        const eventPool = [
            { icon: '🏪', text: 'PokeMart', desc: 'Buy items', action: () => this.visitShop(), weight: 15 },
            { icon: '🏥', text: 'Pokemon Center', desc: 'Heal your team', action: () => this.healTeam(), weight: 15 },
            { icon: '🎣', text: 'Go Fishing', desc: 'Find water Pokemon', action: () => this.goFishing(), weight: 12 },
            { icon: '🗻', text: 'Mystery Cave', desc: 'Something interesting...', action: () => this.mysteryCave(), weight: 12 },
            { icon: '⚔️', text: 'Trainer Battle', desc: 'An NPC trainer challenges you!', action: () => this.trainerBattle(), weight: 14 },
            { icon: '🏕️', text: 'Campsite', desc: 'Rest, train, or forage', action: () => this.campsite(), weight: 12 },
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
            // Only Pokemon Center when out of events
            choices.push({ icon: '🏥', text: 'Pokemon Center', desc: 'Heal your team', action: () => this.healTeam() });
        } else {
            const shuffled = eventPool.sort(() => Math.random() - 0.5);
            const numEvents = Math.random() < 0.4 ? 2 : 1;
            for (let i = 0; i < numEvents && i < shuffled.length; i++) {
                choices.push(shuffled[i]);
            }
        }

        this.renderChoices(choices);
    }

    renderChoices(choices) {
        const container = document.getElementById('choices');
        container.innerHTML = '';

        choices.forEach(choice => {
            const btn = document.createElement('button');
            btn.className = 'choice-btn fade-in';
            btn.innerHTML = `
                <span class="choice-icon">${choice.icon}</span>
                <span class="choice-text">${choice.text}</span>
                <div class="choice-desc">${choice.desc}</div>
            `;
            btn.addEventListener('click', () => {
                this.eventsExplored++;
                // Warn when events running low
                if (this.maxEvents) {
                    const left = this.maxEvents - this.eventsExplored;
                    if (left === 10) this.showEventResult('⚠️ 10 events remaining — choose wisely!', 'info');
                    else if (left === 5) this.showEventResult('⚠️ Only 5 events left!', 'danger');
                    else if (left === 0) this.showEventResult('🏁 No more exploration — gym battles only!', 'danger');
                }
                choice.action();
            });
            container.appendChild(btn);
        });
    }

    // ===== WILD BATTLES =====
    wildBattle() {
        const pool = Math.random() < 0.65 ? WILD_POKEMON.common :
                     Math.random() < 0.85 ? WILD_POKEMON.uncommon : WILD_POKEMON.rare;
        const speciesId = pool[Math.floor(Math.random() * pool.length)];

        const avgLevel = this.team.reduce((sum, p) => sum + p.level, 0) / this.team.length;
        const level = Math.max(2, Math.floor(avgLevel + (Math.random() * 6) - 3));

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
                    const speciesId = WILD_POKEMON.fishing[Math.floor(Math.random() * WILD_POKEMON.fishing.length)];
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
        const gymPokemon = this.getGymPokemon(gym);
        this.battleEnemy = new Pokemon(gymPokemon, gym.level);
        this.battleEnemyTeam = [];

        // Give gym leaders 2-3 Pokemon at higher gyms
        if (this.currentGym >= 3) {
            const extraId = this.getGymPokemon(gym);
            this.battleEnemyTeam.push(new Pokemon(extraId, gym.level - 2));
        }
        if (this.currentGym >= 6) {
            const extraId = this.getGymPokemon(gym);
            this.battleEnemyTeam.push(new Pokemon(extraId, gym.level - 1));
        }

        this.battleType = 'gym';
        this.battleReward = { money: 1000 + this.currentGym * 500 };
        this.addMessage(`Gym Leader ${gym.name} wants to battle!`, 'warning');
        this.startBattle();
    }

    getGymPokemon(gym) {
        const typeMap = {
            'Rock': ['geodude', 'geodude', 'omanyte'],
            'Water': ['staryu', 'psyduck', 'goldeen'],
            'Electric': ['pikachu', 'pikachu'],
            'Grass': ['bulbasaur', 'chikorita', 'bayleef'],
            'Poison': ['gastly', 'nidoran_m', 'nidorino'],
            'Psychic': ['kadabra', 'abra', 'kadabra'],
            'Fire': ['charmeleon', 'cyndaquil', 'quilava'],
            'Ground': ['geodude', 'graveler', 'geodude']
        };
        const pool = typeMap[gym.type] || ['rattata'];
        return pool[Math.floor(Math.random() * pool.length)];
    }

    // ===== TRAINER BATTLES =====
    trainerBattle() {
        const avgLevel = this.team.reduce((sum, p) => sum + p.level, 0) / this.team.length;
        // Filter trainers appropriate for current level
        const suitable = NPC_TRAINERS.filter(t => {
            const trainerLvl = avgLevel + t.levelMod;
            return trainerLvl >= 3 && trainerLvl <= avgLevel + 5;
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
            const goodEvents = [
                () => { // Treasure
                    const amount = Math.floor(Math.random() * 500) + 200;
                    this.money += amount;
                    this.addMessage(`You found a treasure chest with $${amount}!`, 'success');
                },
                () => { // Rare candy
                    this.bag['rare_candy'] = (this.bag['rare_candy'] || 0) + 1;
                    this.addMessage('You found a Rare Candy deep in the cave!', 'success');
                },
                () => { // Wild Pokemon joins
                    if (this.team.length < 6) {
                        const pool = [...WILD_POKEMON.uncommon, ...WILD_POKEMON.rare];
                        const id = pool[Math.floor(Math.random() * pool.length)];
                        const level = Math.max(5, Math.floor(avgLevel));
                        const pokemon = new Pokemon(id, level);
                        this.team.push(pokemon);
                        this.catches++;
                        this.addMessage(`A wild ${pokemon.name} decided to join you!`, 'success');
                    } else {
                        this.money += 400;
                        this.addMessage('A friendly Pokemon showed you its treasure stash! Found $400!', 'success');
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
                        const level = Math.max(10, Math.floor(avgLevel));
                        const pokemon = new Pokemon(id, level);
                        this.team.push(pokemon);
                        this.catches++;
                        this.unlockAchievement('fossil_hunter');
                        this.addMessage(`You revived a fossil! ${pokemon.name} joined your team!`, 'success');
                    } else {
                        this.money += 800;
                        this.addMessage('You found a rare fossil and sold it for $800!', 'success');
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
                }
            ];
            goodEvents[Math.floor(Math.random() * goodEvents.length)]();
        }
        // Neutral outcomes (20%)
        else if (roll < 0.70) {
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
                    this.money += 300;
                    this.addMessage('You helped a lost hiker find the exit! Reward: $300!', 'success');
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
                    this.addMessage('A cave curse drains your team\'s energy!', 'danger');
                },
                () => { // Shrine curse
                    const loss = Math.floor(this.money * 0.15);
                    this.money = Math.max(0, this.money - loss);
                    this.addMessage(`A cursed shrine stole $${loss}!`, 'danger');
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

    // ===== BATTLE TOWER (Post-game) =====
    battleTower() {
        const baseLevel = Math.max(...this.team.map(p => p.level));
        const towerLevel = baseLevel + Math.floor(this.towerWins / 2);

        const pool = [...WILD_POKEMON.uncommon, ...WILD_POKEMON.rare, 'pidgeotto', 'machoke', 'kadabra', 'graveler', 'haunter'];
        const id1 = pool[Math.floor(Math.random() * pool.length)];
        const id2 = pool[Math.floor(Math.random() * pool.length)];

        this.battleEnemy = new Pokemon(id1, towerLevel);
        this.battleEnemyTeam = [new Pokemon(id2, towerLevel)];
        this.battleType = 'tower';
        this.battleReward = { money: 500 + this.towerWins * 200 };
        this.addMessage(`Battle Tower - Fight ${this.towerWins + 1}!`, 'warning');
        this.startBattle();
    }

    // ===== BATTLE SYSTEM =====
    startBattle() {
        this.state = 'battle';
        this.activePokemonIndex = this.team.findIndex(p => p.isAlive);
        if (this.activePokemonIndex === -1) {
            // All fainted, shouldn't happen but handle gracefully
            this.strikes--;
            if (this.strikes <= 0) { this.gameOver(); } else {
                this.team.forEach(p => p.hp = p.maxHp);
                this.activePokemonIndex = 0;
                this.state = 'playing';
                this.showScreen('game-screen');
                this.updateUI();
                this.generateChoices();
            }
            return;
        }
        this.battleTurnInProgress = false;
        this.awaitingFaintSwitch = false;

        // Clear battle log
        document.getElementById('battle-log').innerHTML = '';

        this.showScreen('battle-screen');
        this.updateBattleUI();
        this.updateBattleButtons();

        const enemy = this.battleEnemy;
        this.addBattleLog(`${enemy.name} (Lv.${enemy.level}) appeared!`);
        if (this.battleEnemyTeam.length > 0) {
            this.addBattleLog(`Opponent has ${this.battleEnemyTeam.length + 1} Pokemon!`, 'warning');
        }
    }

    updateBattleUI() {
        const player = this.team[this.activePokemonIndex];
        const enemy = this.battleEnemy;

        // Player Pokemon
        const playerSprite = document.getElementById('player-sprite');
        playerSprite.src = getBackSpriteUrl(player.speciesId);
        document.getElementById('player-name').innerHTML = `
            ${player.displayName} Lv.${player.level}
            <span class="type-badge type-bg-${player.type.toLowerCase()}">${player.type}</span>
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
        document.getElementById('enemy-name').innerHTML = `
            ${enemy.name} Lv.${enemy.level}
            <span class="type-badge type-bg-${enemy.type.toLowerCase()}">${enemy.type}</span>
        `;
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
            const balls = (this.bag['pokeball'] || 0) + (this.bag['great_ball'] || 0);
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
            case 'fight': this.doBattleRound(); break;
            case 'catch': this.tryCatch(); break;
            case 'switch': this.showSwitchMenu(); break;
            case 'item': this.showBattleItems(); break;
            case 'run': this.tryRun(); break;
        }
    }

    calculateDamage(attacker, defender) {
        const base = Math.floor(((2 * attacker.level / 5 + 2) * 50 * attacker.attack / defender.defense) / 50) + 2;
        const variance = 0.85 + Math.random() * 0.15;

        // Type effectiveness
        const attackType = attacker.type.toLowerCase();
        const defenseType = defender.type.toLowerCase();
        let effectiveness = 1;
        if (TYPE_EFFECTIVENESS[attackType] && TYPE_EFFECTIVENESS[attackType][defenseType] !== undefined) {
            effectiveness = TYPE_EFFECTIVENESS[attackType][defenseType];
        }

        // Critical hit (6.25% chance)
        let crit = 1;
        if (Math.random() < 0.0625) {
            crit = 1.5;
        }

        return {
            damage: Math.max(1, Math.floor(base * variance * effectiveness * crit)),
            effectiveness,
            crit: crit > 1
        };
    }

    doBattleRound() {
        this.battleTurnInProgress = true;
        const player = this.team[this.activePokemonIndex];
        const enemy = this.battleEnemy;

        const playerFirst = player.speed >= enemy.speed;

        const doAttack = (attacker, defender, isPlayer) => {
            const result = this.calculateDamage(attacker, defender);
            const fainted = defender.takeDamage(result.damage);

            this.addBattleLog(`${attacker.displayName} dealt ${result.damage} damage!`);

            if (result.crit) {
                this.addBattleLog('Critical hit!', 'warning');
                // Screen shake on crit
                const field = document.getElementById('battle-field');
                field.classList.add('screen-shake');
                setTimeout(() => field.classList.remove('screen-shake'), 400);
            }

            if (result.effectiveness > 1) {
                this.addBattleLog("It's super effective!", 'success');
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

            this.updateBattleUI();
            return fainted;
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

        // Give EXP
        const expGain = Math.floor(enemy.level * 12 + 20);
        const active = this.team[this.activePokemonIndex];
        this.giveExp(expGain, active);

        // Battle rewards
        this.battlesWon++;
        if (this.battleReward) {
            this.money += this.battleReward.money || 0;
        }

        if (this.battleType === 'gym') {
            this.badges++;
            this.currentGym++;
            this.addMessage(`You defeated the Gym Leader and earned a badge!`, 'success');
            this.addBattleLog('Badge earned!', 'success');

            // Check underdog achievement
            if (active.level < enemy.level) {
                this.unlockAchievement('underdog');
            }

            if (this.badges >= this.badgesNeeded) {
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
        } else if (this.battleType === 'tower') {
            this.towerWins++;
            this.addMessage(`Battle Tower win #${this.towerWins}!`, 'success');
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

        // All fainted
        this.strikes--;
        this.addMessage('All your Pokemon fainted!', 'danger');
        this.addMessage(`You lost a life! ${this.strikes} remaining. Your team has been healed.`, 'warning');

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

    giveExp(amount, pokemon) {
        if (!pokemon) pokemon = this.team[this.activePokemonIndex];
        const oldLevel = pokemon.level;
        const evolutions = pokemon.addXp(amount);

        for (const evoTarget of evolutions) {
            const oldName = pokemon.name;
            pokemon.evolve(evoTarget);
            this.evolutionCount++;
            this.unlockAchievement('evolution');
            this.addMessage(`${oldName} evolved into ${pokemon.name}!`, 'success');
            this.showEvolutionAnimation(oldName, pokemon.name, pokemon.speciesId);
        }

        if (pokemon.level > oldLevel) {
            this.addMessage(`${pokemon.displayName} grew to level ${pokemon.level}!`, 'success');
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

        const hasPokeball = (this.bag['pokeball'] || 0) > 0;
        const hasGreatball = (this.bag['great_ball'] || 0) > 0;
        const hasUltraball = (this.bag['ultra_ball'] || 0) > 0;

        if (!hasPokeball && !hasGreatball && !hasUltraball) {
            this.addBattleLog('No Poke Balls!');
            return;
        }

        this.battleTurnInProgress = true;

        let ballType, catchMod;
        if (hasUltraball) {
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
                this.team.push(enemy);
                this.catches++;
                if (this.battleReward && this.battleReward.fishing) this.fishCatches++;
                this.addBattleLog(`Gotcha! ${enemy.name} was caught!`, 'success');
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
            btn.innerHTML = `
                <img src="${getSpriteUrl(poke.speciesId)}" style="width:32px;height:32px;image-rendering:pixelated;vertical-align:middle;margin-right:8px;">
                ${poke.displayName} Lv.${poke.level} (${poke.hp}/${poke.maxHp} HP)
                <span class="type-badge type-bg-${poke.type.toLowerCase()}">${poke.type}</span>
            `;
            btn.onclick = () => {
                this.activePokemonIndex = i;
                modal.classList.add('hidden');
                this.addBattleLog(`Go, ${poke.displayName}!`);
                this.updateBattleUI();

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

                div.innerHTML = `
                    <div class="bag-item-info">
                        <strong>${item.name}</strong> x${count}
                        <div class="choice-desc">${item.desc}</div>
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
                }

                this.updateUI();
                this.saveGame();
            };
            body.appendChild(btn);
        });

        modal.classList.remove('hidden');
    }

    // ===== TEAM MANAGEMENT =====
    showTeamManagement() {
        const modal = document.getElementById('modal');
        const body = document.getElementById('modal-body');

        body.innerHTML = '<h3>👥 Team Management</h3>';

        this.team.forEach((poke, i) => {
            const card = document.createElement('div');
            card.className = `team-card ${!poke.isAlive ? 'fainted' : ''}`;
            card.innerHTML = `
                <div class="team-card-header">
                    <img src="${getSpriteUrl(poke.speciesId)}" class="team-card-sprite" alt="${poke.displayName}">
                    <div class="team-card-info">
                        <div class="team-card-name">
                            ${poke.displayName}
                            <span class="type-badge type-bg-${poke.type.toLowerCase()}">${poke.type}</span>
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
                    <span>ATK: ${poke.attack}</span>
                    <span>DEF: ${poke.defense}</span>
                    <span>SPD: ${poke.speed}</span>
                </div>
                <div class="team-card-actions">
                    ${i > 0 ? '<button class="team-action-btn move-up-btn" title="Move up">▲</button>' : ''}
                    ${i < this.team.length - 1 ? '<button class="team-action-btn move-down-btn" title="Move down">▼</button>' : ''}
                    <button class="team-action-btn nickname-btn" title="Nickname">✏️</button>
                    ${this.team.length > 1 ? '<button class="team-action-btn release-btn" title="Release">🔓</button>' : ''}
                </div>
            `;

            // Move up
            const moveUp = card.querySelector('.move-up-btn');
            if (moveUp) {
                moveUp.onclick = () => {
                    [this.team[i-1], this.team[i]] = [this.team[i], this.team[i-1]];
                    this.showTeamManagement();
                    this.updateUI();
                    this.saveGame();
                };
            }

            // Move down
            const moveDown = card.querySelector('.move-down-btn');
            if (moveDown) {
                moveDown.onclick = () => {
                    [this.team[i], this.team[i+1]] = [this.team[i+1], this.team[i]];
                    this.showTeamManagement();
                    this.updateUI();
                    this.saveGame();
                };
            }

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

            body.appendChild(card);
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
        this.state = 'gameover';
        this.unlockAchievement('champion');

        if (this.strikes === this.maxStrikes) this.unlockAchievement('flawless');
        if (this.strikes === 1) this.unlockAchievement('survivor');
        if (this.eventsExplored < 50) this.unlockAchievement('speedrunner');

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

        this.showScreen('gameover-screen');
        document.getElementById('gameover-title').textContent = '🎉 Victory!';
        document.getElementById('gameover-title').className = 'victory';
        document.getElementById('gameover-message').textContent = `You collected all ${this.badgesNeeded} badges and became the Champion!`;

        const teamHtml = this.team.map(p => `
            <div class="victory-pokemon">
                <img src="${getSpriteUrl(p.speciesId)}" alt="${p.displayName}">
                <span>${p.displayName} Lv.${p.level}</span>
            </div>
        `).join('');

        document.getElementById('run-stats').innerHTML = `
            <h3>Run Summary</h3>
            <div class="victory-team">${teamHtml}</div>
            <div class="stats-grid">
                <div class="stat-item"><span class="stat-label">Time</span><span class="stat-value">${minutes}m ${seconds}s</span></div>
                <div class="stat-item"><span class="stat-label">Events</span><span class="stat-value">${this.eventsExplored}</span></div>
                <div class="stat-item"><span class="stat-label">Caught</span><span class="stat-value">${this.catches}</span></div>
                <div class="stat-item"><span class="stat-label">Evolutions</span><span class="stat-value">${this.evolutionCount}</span></div>
                <div class="stat-item"><span class="stat-label">Battles Won</span><span class="stat-value">${this.battlesWon}</span></div>
                <div class="stat-item"><span class="stat-label">Strikes Left</span><span class="stat-value">${this.strikes}/${this.maxStrikes}</span></div>
                <div class="stat-item"><span class="stat-label">Difficulty</span><span class="stat-value">${this.difficulty}</span></div>
                <div class="stat-item"><span class="stat-label">Money</span><span class="stat-value">$${this.money}</span></div>
            </div>
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

        const elapsed = Date.now() - this.startTime;
        const minutes = Math.floor(elapsed / 60000);
        const seconds = Math.floor((elapsed % 60000) / 1000);

        this.showScreen('gameover-screen');
        document.getElementById('gameover-title').textContent = '💀 Game Over';
        document.getElementById('gameover-title').className = 'defeat';
        document.getElementById('gameover-message').textContent = 'You ran out of strikes!';
        document.getElementById('run-stats').innerHTML = `
            <div class="stats-grid">
                <div class="stat-item"><span class="stat-label">Badges</span><span class="stat-value">${this.badges}/${this.badgesNeeded}</span></div>
                <div class="stat-item"><span class="stat-label">Time</span><span class="stat-value">${minutes}m ${seconds}s</span></div>
                <div class="stat-item"><span class="stat-label">Events</span><span class="stat-value">${this.eventsExplored}</span></div>
                <div class="stat-item"><span class="stat-label">Battles Won</span><span class="stat-value">${this.battlesWon}</span></div>
                <div class="stat-item"><span class="stat-label">Caught</span><span class="stat-value">${this.catches}</span></div>
                <div class="stat-item"><span class="stat-label">Difficulty</span><span class="stat-value">${this.difficulty}</span></div>
            </div>
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
}

// Start the game
const game = new Game();
