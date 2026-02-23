// Pokemon Roguelike - Game Logic

class Pokemon {
    constructor(speciesId, level) {
        this.speciesId = speciesId;
        this.species = POKEMON_DATA[speciesId];
        this.name = this.species.name;
        this.nickname = null;
        this.type = this.species.type;
        this.level = level;
        
        // Calculate stats based on level
        const base = this.species.baseStats;
        this.maxHp = Math.floor((base.hp * 2 * level) / 100) + level + 10;
        this.hp = this.maxHp;
        this.attack = Math.floor((base.atk * 2 * level) / 100) + 5;
        this.defense = Math.floor((base.def * 2 * level) / 100) + 5;
        this.speed = Math.floor((base.spd * 2 * level) / 100) + 5;
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
        if (evo && this.level >= evo.level) {
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
        this.hp = Math.floor(this.maxHp * hpRatio);
        this.attack = Math.floor((base.atk * 2 * this.level) / 100) + 5;
        this.defense = Math.floor((base.def * 2 * this.level) / 100) + 5;
        this.speed = Math.floor((base.spd * 2 * this.level) / 100) + 5;
    }
}

class Game {
    constructor() {
        this.state = 'start'; // start, playing, battle, gameover
        this.team = [];
        this.bag = {};
        this.money = 1000;
        this.badges = 0;
        this.strikes = 3;
        this.maxStrikes = 3;
        this.difficulty = 'normal';
        this.currentGym = 0;
        
        // Battle state
        this.battleEnemy = null;
        this.battleType = null; // wild, gym, trainer
        this.activePokemonIndex = 0;
        
        // Stats
        this.catches = 0;
        this.battlesWon = 0;
        
        this.init();
    }
    
    init() {
        this.renderStartScreen();
        this.bindEvents();
    }
    
    bindEvents() {
        // Difficulty selection
        document.getElementById('difficulty').addEventListener('change', (e) => {
            this.difficulty = e.target.value;
        });
        
        // Modal close
        document.querySelector('.close-btn').addEventListener('click', () => {
            document.getElementById('modal').classList.add('hidden');
        });
        
        // Footer buttons
        document.getElementById('bag-btn').addEventListener('click', () => this.showBag());
        document.getElementById('team-btn').addEventListener('click', () => this.showTeam());
        document.getElementById('stats-btn').addEventListener('click', () => this.showStats());
        
        // Restart button
        document.getElementById('restart-btn').addEventListener('click', () => this.restart());
        
        // Battle actions
        document.querySelectorAll('.action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.target.dataset.action;
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
                <span class="type type-${pokemon.type.toLowerCase()}">${pokemon.type}</span>
            `;
            div.addEventListener('click', () => this.selectStarter(id));
            grid.appendChild(div);
        });
        
        // Add start button
        const btn = document.createElement('button');
        btn.className = 'start-btn';
        btn.id = 'start-btn';
        btn.textContent = 'Start Adventure!';
        btn.disabled = true;
        btn.addEventListener('click', () => this.startGame());
        grid.parentElement.appendChild(btn);
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
        // Apply difficulty settings
        const settings = DIFFICULTY_SETTINGS[this.difficulty];
        this.money = settings.startMoney;
        this.strikes = settings.strikes;
        this.maxStrikes = settings.strikes;
        this.badgesNeeded = settings.badgesNeeded;
        
        // Initialize bag
        this.bag = {};
        settings.startItems.forEach(item => {
            this.bag[item] = (this.bag[item] || 0) + 1;
        });
        
        // Create starter Pokemon
        const starter = new Pokemon(this.selectedStarter, 5);
        this.team = [starter];
        
        this.state = 'playing';
        this.showScreen('game-screen');
        this.updateUI();
        this.addMessage(`You chose ${starter.name}! Your adventure begins!`, 'success');
        this.generateChoices();
    }
    
    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        document.getElementById(screenId).classList.add('active');
    }
    
    updateUI() {
        // Update stats bar
        document.getElementById('badges').textContent = `Badges: ${this.badges}/${this.badgesNeeded}`;
        document.getElementById('money').textContent = `$${this.money}`;
        document.getElementById('strikes').textContent = '❤️'.repeat(this.strikes) + '🖤'.repeat(this.maxStrikes - this.strikes);
        
        // Update team display
        const teamDiv = document.getElementById('team-pokemon');
        teamDiv.innerHTML = '';
        this.team.forEach((poke, i) => {
            const div = document.createElement('div');
            div.className = 'team-slot';
            div.innerHTML = `
                <img src="${getSpriteUrl(poke.speciesId)}" alt="${poke.displayName}">
                <div>
                    <div>${poke.displayName} Lv.${poke.level}</div>
                    <div class="mini-hp">
                        <div class="mini-hp-fill" style="width: ${poke.hpPercent}%"></div>
                    </div>
                </div>
            `;
            teamDiv.appendChild(div);
        });
    }
    
    addMessage(text, type = '') {
        const log = document.getElementById('message-log');
        const msg = document.createElement('div');
        msg.className = `message ${type} fade-in`;
        msg.textContent = text;
        log.insertBefore(msg, log.firstChild);
        
        // Keep only last 10 messages
        while (log.children.length > 10) {
            log.removeChild(log.lastChild);
        }
    }
    
    generateChoices() {
        const choices = [];
        
        // Always offer wild battle
        choices.push({
            icon: '🌿',
            text: 'Explore Tall Grass',
            desc: 'Encounter wild Pokemon',
            action: () => this.wildBattle()
        });
        
        // Gym challenge if ready
        if (this.currentGym < GYM_LEADERS.length) {
            const gym = GYM_LEADERS[this.currentGym];
            choices.push({
                icon: '🏛️',
                text: `Challenge ${gym.name}`,
                desc: `${gym.type} type - Lv.${gym.level}`,
                action: () => this.gymBattle()
            });
        }
        
        // Random events
        const events = ['shop', 'heal', 'fishing', 'mystery'];
        const event = events[Math.floor(Math.random() * events.length)];
        
        switch(event) {
            case 'shop':
                choices.push({
                    icon: '🏪',
                    text: 'PokeMart',
                    desc: 'Buy items',
                    action: () => this.visitShop()
                });
                break;
            case 'heal':
                choices.push({
                    icon: '🏥',
                    text: 'Pokemon Center',
                    desc: 'Heal your team',
                    action: () => this.healTeam()
                });
                break;
            case 'fishing':
                choices.push({
                    icon: '🎣',
                    text: 'Go Fishing',
                    desc: 'Find water Pokemon',
                    action: () => this.goFishing()
                });
                break;
            case 'mystery':
                choices.push({
                    icon: '❓',
                    text: 'Mystery Event',
                    desc: 'Something interesting...',
                    action: () => this.mysteryEvent()
                });
                break;
        }
        
        this.renderChoices(choices);
    }
    
    renderChoices(choices) {
        const container = document.getElementById('choices');
        container.innerHTML = '';
        
        choices.forEach(choice => {
            const btn = document.createElement('button');
            btn.className = 'choice-btn';
            btn.innerHTML = `
                <span class="choice-icon">${choice.icon}</span>
                <span class="choice-text">${choice.text}</span>
                <div class="choice-desc">${choice.desc}</div>
            `;
            btn.addEventListener('click', choice.action);
            container.appendChild(btn);
        });
    }
    
    wildBattle() {
        const pool = Math.random() < 0.7 ? WILD_POKEMON.common : 
                     Math.random() < 0.9 ? WILD_POKEMON.uncommon : WILD_POKEMON.rare;
        const speciesId = pool[Math.floor(Math.random() * pool.length)];
        
        // Scale level to player's team
        const avgLevel = this.team.reduce((sum, p) => sum + p.level, 0) / this.team.length;
        const level = Math.max(2, Math.floor(avgLevel + (Math.random() * 4) - 2));
        
        this.battleEnemy = new Pokemon(speciesId, level);
        this.battleType = 'wild';
        this.startBattle();
    }
    
    goFishing() {
        if (Math.random() < 0.25) {
            this.addMessage("Nothing's biting...", 'warning');
            this.generateChoices();
            return;
        }
        
        const speciesId = WILD_POKEMON.fishing[Math.floor(Math.random() * WILD_POKEMON.fishing.length)];
        const avgLevel = this.team.reduce((sum, p) => sum + p.level, 0) / this.team.length;
        const level = Math.max(5, Math.floor(avgLevel + (Math.random() * 6) - 3));
        
        this.battleEnemy = new Pokemon(speciesId, level);
        this.battleType = 'wild';
        this.addMessage(`A wild ${this.battleEnemy.name} appeared from the water!`);
        this.startBattle();
    }
    
    gymBattle() {
        const gym = GYM_LEADERS[this.currentGym];
        // Simple gym Pokemon based on type
        const gymPokemon = this.getGymPokemon(gym);
        this.battleEnemy = new Pokemon(gymPokemon, gym.level);
        this.battleType = 'gym';
        this.addMessage(`Gym Leader ${gym.name} wants to battle!`, 'warning');
        this.startBattle();
    }
    
    getGymPokemon(gym) {
        const typeMap = {
            'Rock': 'geodude',
            'Water': 'staryu',
            'Electric': 'pikachu',
            'Grass': 'bulbasaur',
            'Poison': 'gastly',
            'Psychic': 'kadabra',
            'Fire': 'charmeleon',
            'Ground': 'geodude'
        };
        return typeMap[gym.type] || 'rattata';
    }
    
    startBattle() {
        this.state = 'battle';
        this.activePokemonIndex = this.team.findIndex(p => p.isAlive);
        this.showScreen('battle-screen');
        this.updateBattleUI();
    }
    
    updateBattleUI() {
        const player = this.team[this.activePokemonIndex];
        const enemy = this.battleEnemy;
        
        // Player Pokemon
        document.getElementById('player-sprite').src = getBackSpriteUrl(player.speciesId);
        document.getElementById('player-name').textContent = `${player.displayName} Lv.${player.level}`;
        const playerHp = document.getElementById('player-hp');
        playerHp.style.width = `${player.hpPercent}%`;
        playerHp.className = `hp-fill ${player.hpPercent < 20 ? 'critical' : player.hpPercent < 50 ? 'low' : ''}`;
        
        // Enemy Pokemon
        document.getElementById('enemy-sprite').src = getSpriteUrl(enemy.speciesId);
        document.getElementById('enemy-name').textContent = `${enemy.name} Lv.${enemy.level}`;
        const enemyHp = document.getElementById('enemy-hp');
        enemyHp.style.width = `${enemy.hpPercent}%`;
        enemyHp.className = `hp-fill ${enemy.hpPercent < 20 ? 'critical' : enemy.hpPercent < 50 ? 'low' : ''}`;
    }
    
    handleBattleAction(action) {
        switch(action) {
            case 'fight':
                this.doBattleRound();
                break;
            case 'catch':
                this.tryCatch();
                break;
            case 'switch':
                this.showSwitchMenu();
                break;
            case 'run':
                this.tryRun();
                break;
        }
    }
    
    doBattleRound() {
        const player = this.team[this.activePokemonIndex];
        const enemy = this.battleEnemy;
        const log = document.getElementById('battle-log');
        
        // Determine turn order
        const playerFirst = player.speed >= enemy.speed;
        
        const doAttack = (attacker, defender, isPlayer) => {
            const damage = this.calculateDamage(attacker, defender);
            const fainted = defender.takeDamage(damage);
            log.innerHTML += `<div>${attacker.displayName} dealt ${damage} damage!</div>`;
            return fainted;
        };
        
        if (playerFirst) {
            if (doAttack(player, enemy, true)) {
                this.enemyFainted();
                return;
            }
            if (doAttack(enemy, player, false)) {
                this.playerPokemonFainted();
                return;
            }
        } else {
            if (doAttack(enemy, player, false)) {
                this.playerPokemonFainted();
                return;
            }
            if (doAttack(player, enemy, true)) {
                this.enemyFainted();
                return;
            }
        }
        
        this.updateBattleUI();
    }
    
    calculateDamage(attacker, defender) {
        // Simplified damage formula
        const base = Math.floor(((2 * attacker.level / 5 + 2) * 50 * attacker.attack / defender.defense) / 50) + 2;
        const variance = 0.85 + Math.random() * 0.15;
        
        // Type effectiveness
        const attackType = attacker.type.toLowerCase();
        const defenseType = defender.type.toLowerCase();
        let effectiveness = 1;
        if (TYPE_EFFECTIVENESS[attackType] && TYPE_EFFECTIVENESS[attackType][defenseType] !== undefined) {
            effectiveness = TYPE_EFFECTIVENESS[attackType][defenseType];
        }
        
        return Math.max(1, Math.floor(base * variance * effectiveness));
    }
    
    enemyFainted() {
        const enemy = this.battleEnemy;
        document.getElementById('battle-log').innerHTML += `<div class="success">${enemy.name} fainted!</div>`;
        
        // Give EXP
        const expGain = Math.floor(enemy.level * 10);
        this.giveExp(expGain);
        
        // Battle type specific rewards
        if (this.battleType === 'gym') {
            this.badges++;
            this.currentGym++;
            this.money += 1000;
            this.addMessage(`You defeated the Gym Leader and earned a badge!`, 'success');
            
            // Check win condition
            if (this.badges >= this.badgesNeeded) {
                this.victory();
                return;
            }
        } else if (this.battleType === 'wild') {
            this.battlesWon++;
            this.money += enemy.level * 10;
        }
        
        setTimeout(() => {
            this.state = 'playing';
            this.showScreen('game-screen');
            this.updateUI();
            this.generateChoices();
        }, 1500);
    }
    
    playerPokemonFainted() {
        const player = this.team[this.activePokemonIndex];
        document.getElementById('battle-log').innerHTML += `<div class="danger">${player.displayName} fainted!</div>`;
        
        // Check for other alive Pokemon
        const nextAlive = this.team.findIndex((p, i) => p.isAlive && i !== this.activePokemonIndex);
        if (nextAlive >= 0) {
            this.activePokemonIndex = nextAlive;
            this.updateBattleUI();
            return;
        }
        
        // All Pokemon fainted - lose a strike
        this.strikes--;
        this.addMessage('All your Pokemon fainted!', 'danger');
        
        if (this.strikes <= 0) {
            this.gameOver();
            return;
        }
        
        // Heal team and continue
        this.team.forEach(p => p.hp = p.maxHp);
        
        setTimeout(() => {
            this.state = 'playing';
            this.showScreen('game-screen');
            this.updateUI();
            this.generateChoices();
        }, 1500);
    }
    
    giveExp(amount) {
        const pokemon = this.team[this.activePokemonIndex];
        // Simplified leveling - every 100 exp = 1 level
        const levelsGained = Math.floor(amount / 50);
        
        for (let i = 0; i < levelsGained; i++) {
            const evolution = pokemon.levelUp();
            if (evolution) {
                const oldName = pokemon.name;
                pokemon.evolve(evolution);
                this.addMessage(`${oldName} evolved into ${pokemon.name}!`, 'success');
            }
        }
        
        if (levelsGained > 0) {
            this.addMessage(`${pokemon.displayName} grew to level ${pokemon.level}!`, 'success');
        }
    }
    
    tryRun() {
        if (this.battleType === 'gym') {
            document.getElementById('battle-log').innerHTML += `<div>Can't run from a Gym battle!</div>`;
            return;
        }
        
        if (Math.random() < 0.7) {
            this.addMessage('Got away safely!');
            this.state = 'playing';
            this.showScreen('game-screen');
            this.generateChoices();
        } else {
            document.getElementById('battle-log').innerHTML += `<div>Couldn't escape!</div>`;
            // Enemy gets a free attack
            const enemy = this.battleEnemy;
            const player = this.team[this.activePokemonIndex];
            const damage = this.calculateDamage(enemy, player);
            if (player.takeDamage(damage)) {
                this.playerPokemonFainted();
            } else {
                this.updateBattleUI();
            }
        }
    }
    
    tryCatch() {
        if (this.battleType !== 'wild') {
            document.getElementById('battle-log').innerHTML += `<div>Can't catch trainer Pokemon!</div>`;
            return;
        }
        
        // Check for Poke Balls
        const hasPokeball = this.bag['pokeball'] > 0;
        const hasGreatball = this.bag['great_ball'] > 0;
        
        if (!hasPokeball && !hasGreatball) {
            document.getElementById('battle-log').innerHTML += `<div>No Poke Balls!</div>`;
            return;
        }
        
        // Use best available ball
        let ballType, catchMod;
        if (hasGreatball) {
            this.bag['great_ball']--;
            ballType = 'Great Ball';
            catchMod = 1.5;
        } else {
            this.bag['pokeball']--;
            ballType = 'Poke Ball';
            catchMod = 1.0;
        }
        
        const enemy = this.battleEnemy;
        const log = document.getElementById('battle-log');
        
        log.innerHTML += `<div>You threw a ${ballType}!</div>`;
        
        // Catch formula: lower HP = higher catch rate
        const hpFactor = 1 - (enemy.hp / enemy.maxHp) * 0.5; // 0.5 to 1.0
        const levelFactor = Math.max(0.3, 1 - (enemy.level / 100)); // higher level = harder
        const catchRate = 0.4 * hpFactor * levelFactor * catchMod;
        
        // Shake animation (simplified - just show result)
        if (Math.random() < catchRate) {
            // Caught!
            if (this.team.length < 6) {
                this.team.push(enemy);
                this.catches++;
                log.innerHTML += `<div class="success">Gotcha! ${enemy.name} was caught!</div>`;
                this.addMessage(`${enemy.name} joined your team!`, 'success');
                
                // Check for catch achievements
                if (this.catches === 1) this.unlockAchievement('first_catch');
                if (this.catches >= 10) this.unlockAchievement('collector');
            } else {
                log.innerHTML += `<div class="success">${enemy.name} was caught!</div>`;
                log.innerHTML += `<div>But your team is full! ${enemy.name} was released.</div>`;
            }
            
            setTimeout(() => {
                this.state = 'playing';
                this.showScreen('game-screen');
                this.updateUI();
                this.generateChoices();
            }, 1500);
        } else {
            // Failed
            log.innerHTML += `<div>Oh no! ${enemy.name} broke free!</div>`;
            
            // Enemy gets a free attack
            const player = this.team[this.activePokemonIndex];
            const damage = this.calculateDamage(enemy, player);
            log.innerHTML += `<div>${enemy.name} attacked for ${damage} damage!</div>`;
            if (player.takeDamage(damage)) {
                this.playerPokemonFainted();
            } else {
                this.updateBattleUI();
            }
        }
    }
    
    unlockAchievement(id) {
        // Simple achievement tracking
        if (!this.achievements) this.achievements = new Set();
        if (!this.achievements.has(id)) {
            this.achievements.add(id);
            this.addMessage(`🏆 Achievement unlocked: ${id}!`, 'success');
        }
    }
    
    showSwitchMenu() {
        const modal = document.getElementById('modal');
        const body = document.getElementById('modal-body');
        
        body.innerHTML = '<h3>Switch Pokemon</h3>';
        this.team.forEach((poke, i) => {
            if (i === this.activePokemonIndex) return;
            const btn = document.createElement('button');
            btn.className = 'choice-btn';
            btn.disabled = !poke.isAlive;
            btn.innerHTML = `
                <img src="${getSpriteUrl(poke.speciesId)}" style="width:32px;height:32px;">
                ${poke.displayName} Lv.${poke.level} (${poke.hp}/${poke.maxHp} HP)
            `;
            btn.onclick = () => {
                this.activePokemonIndex = i;
                modal.classList.add('hidden');
                this.updateBattleUI();
                // Enemy gets free attack
                const enemy = this.battleEnemy;
                const player = this.team[this.activePokemonIndex];
                const damage = this.calculateDamage(enemy, player);
                if (player.takeDamage(damage)) {
                    this.playerPokemonFainted();
                } else {
                    this.updateBattleUI();
                }
            };
            body.appendChild(btn);
        });
        
        modal.classList.remove('hidden');
    }
    
    showBattleItems() {
        // TODO: Implement battle item usage
        document.getElementById('battle-log').innerHTML += `<div>No items to use!</div>`;
    }
    
    visitShop() {
        const modal = document.getElementById('modal');
        const body = document.getElementById('modal-body');
        
        body.innerHTML = `<h3>PokeMart</h3><p>Money: $${this.money}</p>`;
        
        Object.entries(ITEMS).forEach(([id, item]) => {
            const btn = document.createElement('button');
            btn.className = 'choice-btn';
            btn.innerHTML = `${item.name} - $${item.price}<br><small>${item.desc}</small>`;
            btn.onclick = () => {
                if (this.money >= item.price) {
                    this.money -= item.price;
                    this.bag[id] = (this.bag[id] || 0) + 1;
                    this.addMessage(`Bought ${item.name}!`, 'success');
                    this.updateUI();
                    body.querySelector('p').textContent = `Money: $${this.money}`;
                } else {
                    this.addMessage("Not enough money!", 'warning');
                }
            };
            body.appendChild(btn);
        });
        
        modal.classList.remove('hidden');
        this.generateChoices();
    }
    
    healTeam() {
        this.team.forEach(p => p.hp = p.maxHp);
        this.addMessage('Your Pokemon are fully healed!', 'success');
        this.updateUI();
        this.generateChoices();
    }
    
    mysteryEvent() {
        const events = [
            () => {
                const amount = Math.floor(Math.random() * 300) + 100;
                this.money += amount;
                this.addMessage(`Found $${amount} on the ground!`, 'success');
            },
            () => {
                this.bag['rare_candy'] = (this.bag['rare_candy'] || 0) + 1;
                this.addMessage('Found a Rare Candy!', 'success');
            },
            () => {
                this.team.forEach(p => p.heal(20));
                this.addMessage('A kind stranger healed your team a little!', 'success');
            },
            () => {
                const loss = Math.floor(this.money * 0.1);
                this.money -= loss;
                this.addMessage(`A thief stole $${loss}!`, 'danger');
            }
        ];
        
        events[Math.floor(Math.random() * events.length)]();
        this.updateUI();
        this.generateChoices();
    }
    
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
                const div = document.createElement('div');
                div.className = 'choice-btn';
                div.innerHTML = `${item.name} x${count}<br><small>${item.desc}</small>`;
                body.appendChild(div);
            });
        }
        
        modal.classList.remove('hidden');
    }
    
    showTeam() {
        const modal = document.getElementById('modal');
        const body = document.getElementById('modal-body');
        
        body.innerHTML = '<h3>👥 Team</h3>';
        
        this.team.forEach(poke => {
            const div = document.createElement('div');
            div.className = 'choice-btn';
            div.innerHTML = `
                <img src="${getSpriteUrl(poke.speciesId)}" style="width:48px;height:48px;float:left;margin-right:10px;">
                <strong>${poke.displayName}</strong> Lv.${poke.level}<br>
                <small>Type: ${poke.type} | HP: ${poke.hp}/${poke.maxHp}</small><br>
                <small>ATK: ${poke.attack} | DEF: ${poke.defense} | SPD: ${poke.speed}</small>
            `;
            body.appendChild(div);
        });
        
        modal.classList.remove('hidden');
    }
    
    showStats() {
        const modal = document.getElementById('modal');
        const body = document.getElementById('modal-body');
        
        body.innerHTML = `
            <h3>📊 Stats</h3>
            <p>Badges: ${this.badges}/${this.badgesNeeded}</p>
            <p>Money: $${this.money}</p>
            <p>Strikes: ${this.strikes}/${this.maxStrikes}</p>
            <p>Battles Won: ${this.battlesWon}</p>
            <p>Pokemon Caught: ${this.catches}</p>
            <p>Difficulty: ${this.difficulty}</p>
        `;
        
        modal.classList.remove('hidden');
    }
    
    victory() {
        this.state = 'gameover';
        this.showScreen('gameover-screen');
        document.getElementById('gameover-title').textContent = '🎉 Victory!';
        document.getElementById('gameover-title').className = 'victory';
        document.getElementById('gameover-message').textContent = `You collected all ${this.badgesNeeded} badges and became the Champion!`;
        document.getElementById('run-stats').innerHTML = `
            <p>Final Team Level: ${Math.max(...this.team.map(p => p.level))}</p>
            <p>Money: $${this.money}</p>
            <p>Battles Won: ${this.battlesWon}</p>
            <p>Strikes Remaining: ${this.strikes}/${this.maxStrikes}</p>
        `;
    }
    
    gameOver() {
        this.state = 'gameover';
        this.showScreen('gameover-screen');
        document.getElementById('gameover-title').textContent = '💀 Game Over';
        document.getElementById('gameover-title').className = 'defeat';
        document.getElementById('gameover-message').textContent = 'You ran out of strikes!';
        document.getElementById('run-stats').innerHTML = `
            <p>Badges Earned: ${this.badges}</p>
            <p>Final Team Level: ${Math.max(...this.team.map(p => p.level))}</p>
            <p>Battles Won: ${this.battlesWon}</p>
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
        this.battlesWon = 0;
        this.selectedStarter = null;
        
        this.showScreen('start-screen');
        document.getElementById('start-btn').disabled = true;
        document.querySelectorAll('.starter-option').forEach(el => el.classList.remove('selected'));
    }
}

// Start the game
const game = new Game();
