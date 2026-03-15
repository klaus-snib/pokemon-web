// Meta-Progression Integration for Game Class
// Add these methods to the Game class in game.js

// Initialize meta-progression on game start
initMetaProgression() {
    this.meta = new MetaProgression();
    this.updateMetaDisplay();
    this.setupMetaShop();
}

// Update meta stats display on start screen
updateMetaDisplay() {
    const shiniesEl = document.getElementById('meta-shinies');
    const ascensionEl = document.getElementById('meta-ascension');
    const runsEl = document.getElementById('meta-runs');
    
    if (shiniesEl) shiniesEl.textContent = `✨ ${this.meta.shinies} Shinies`;
    if (ascensionEl) ascensionEl.textContent = `🏆 Ascension ${this.meta.maxAscensionBeaten}`;
    if (runsEl) runsEl.textContent = `📊 ${this.meta.totalRuns} Runs`;
    
    this.populateAscensionSelect();
}

// Populate ascension level dropdown
populateAscensionSelect() {
    const select = document.getElementById('ascension-level');
    if (!select) return;
    
    // Clear existing options except first
    while (select.options.length > 1) {
        select.remove(1);
    }
    
    // Add available ascension levels
    for (let i = 1; i <= this.meta.ascensionLevel; i++) {
        const modifier = ASCENSION_MODIFIERS[i];
        if (modifier) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = `Ascension ${i} — ${modifier.name}`;
            select.appendChild(option);
        }
    }
    
    // Show modifiers on change
    select.addEventListener('change', () => {
        this.showAscensionModifiers(parseInt(select.value));
    });
}

// Display ascension modifiers
showAscensionModifiers(level) {
    const container = document.getElementById('ascension-modifiers');
    if (!container) return;
    
    const modifiers = this.meta.getAscensionModifiers(level);
    if (modifiers.length === 0) {
        container.innerHTML = '<p>No modifiers at this level.</p>';
        return;
    }
    
    container.innerHTML = modifiers.map(m => 
        `\u003cdiv class="modifier">\u003cstrong>${m.name}:\u003c/strong> ${m.description}\u003c/div>`
    ).join('');
}

// Setup meta shop UI
setupMetaShop() {
    const shopBtn = document.getElementById('meta-shop-btn');
    const closeBtn = document.getElementById('close-meta-shop');
    const modal = document.getElementById('meta-shop-modal');
    
    if (shopBtn) {
        shopBtn.addEventListener('click', () => {
            this.openMetaShop();
        });
    }
    
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.classList.add('hidden');
        });
    }
    
    // Tab switching
    document.querySelectorAll('.shop-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.shop-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.shop-panel').forEach(p => p.classList.remove('active'));
            tab.classList.add('active');
            document.getElementById(`shop-${tab.dataset.tab}`).classList.add('active');
        });
    });
}

// Open meta shop
openMetaShop() {
    const modal = document.getElementById('meta-shop-modal');
    const shiniesEl = document.getElementById('meta-shop-shinies');
    
    if (shiniesEl) shiniesEl.textContent = `✨ ${this.meta.shinies} Shinies`;
    
    this.populateShopItems('starters');
    this.populateShopItems('items');
    this.populateShopItems('money');
    this.populateShopItems('upgrades');
    
    modal.classList.remove('hidden');
}

// Populate shop items for a category
populateShopItems(category) {
    const container = document.getElementById(`shop-${category}-list`);
    if (!container) return;
    
    container.innerHTML = '';
    const items = META_UNLOCKS[category];
    
    for (const [key, item] of Object.entries(items)) {
        const isOwned = this.meta.unlocks[category].has(key);
        const currentLevel = this.meta.upgradeLevels[key] || 0;
        const isMaxed = item.maxLevel && currentLevel >= item.maxLevel;
        const cost = item.cost * (currentLevel + 1);
        const canAfford = this.meta.shinies >= cost;
        
        const div = document.createElement('div');
        div.className = `shop-item ${isOwned ? 'owned' : ''} ${isMaxed ? 'maxed' : ''}`;
        
        let buttonText = isMaxed ? 'Maxed' : (isOwned && !item.maxLevel ? 'Owned' : `Buy (${cost} ✨)`);
        if (item.maxLevel && !isMaxed) {
            buttonText = `Upgrade (${cost} ✨) — Level ${currentLevel}/${item.maxLevel}`;
        }
        
        div.innerHTML = `
            <h4>${item.name}</h4>
            <p class="description">${item.description}</p>
            <button ${(!canAfford || isMaxed) ? 'disabled' : ''}>${buttonText}</button>
        `;
        
        const button = div.querySelector('button');
        if (!isMaxed && canAfford) {
            button.addEventListener('click', () => {
                const result = this.meta.purchaseUnlock(category, key);
                if (result.success) {
                    this.addMessage(result.message, 'success');
                    this.openMetaShop(); // Refresh
                    this.updateMetaDisplay();
                } else {
                    this.addMessage(result.message, 'error');
                }
            });
        }
        
        container.appendChild(div);
    }
}

// Award meta rewards on game over
awardMetaRewards(victory) {
    const runData = {
        victory: victory,
        difficulty: this.difficulty,
        badges: this.badges,
        catches: this.catches,
        newAchievements: 0, // Calculated below
        strikesUsed: this.maxStrikes - this.strikes,
        duration: Date.now() - this.startTime,
        ascensionLevel: this.currentAscension || 0
    };
    
    // Count new achievements
    const previousAchievements = this.meta.totalRuns === 0 ? 0 : this.meta.totalVictories; // Approximation
    runData.newAchievements = this.achievements.size - previousAchievements;
    
    const earned = this.meta.awardShinies(runData);
    return earned;
}

// Apply meta unlocks at game start
applyMetaUnlocks() {
    // Apply starting money bonus
    const moneyBonus = this.meta.getStartingMoneyBonus();
    if (moneyBonus > 0) {
        this.money += moneyBonus;
    }
    
    // Apply starting items
    const startingItems = this.meta.getStartingItems();
    for (const { item, quantity } of startingItems) {
        this.bag[item] = (this.bag[item] || 0) + quantity;
    }
    
    // Apply extra strikes upgrade
    const upgradeEffects = this.meta.getUpgradeEffects();
    this.maxStrikes += upgradeEffects.extraStrikes;
    this.strikes = this.maxStrikes;
    
    // Apply ascension modifiers
    this.applyAscensionModifiers();
}

// Apply ascension modifiers for current run
applyAscensionModifiers() {
    const ascensionLevel = parseInt(document.getElementById('ascension-level')?.value || 0);
    this.currentAscension = ascensionLevel;
    
    if (ascensionLevel <= 0) return;
    
    const modifiers = this.meta.getAscensionModifiers(ascensionLevel);
    this.ascensionModifiers = modifiers;
    
    // Apply effects
    for (const mod of modifiers) {
        switch (mod.effect) {
            case 'startStrikes':
                this.maxStrikes = Math.min(mod.value, this.maxStrikes);
                this.strikes = this.maxStrikes;
                break;
            // Other effects are applied dynamically during gameplay
        }
    }
}

// Get unlocked starters for display
getUnlockedStarters() {
    const baseStarters = ['bulbasaur', 'charmander', 'squirtle', 'pikachu'];
    const unlocked = this.meta.getUnlockedStarters();
    return [...baseStarters, ...unlocked.map(u => u.speciesId)];
}
