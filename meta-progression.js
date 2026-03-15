// Meta-Progression System for Pokemon Roguelike
// Persistence between runs - inspired by Slay the Spire's Ascension system

const META_PROGRESSION_KEY = 'pokemon_roguelike_meta';

// Ascension modifiers that make runs harder (Slay the Spire style)
// Each level adds one modifier, stacking cumulatively
const ASCENSION_MODIFIERS = {
    1: { name: 'Tougher Wilds', description: 'Wild Pokemon have +2 levels', effect: 'wildLevelBonus', value: 2 },
    2: { name: 'Elite Trainers', description: 'Trainers have +10% stats', effect: 'trainerStatMult', value: 1.1 },
    3: { name: 'Scarce Items', description: 'Shop items cost 25% more', effect: 'shopPriceMult', value: 1.25 },
    4: { name: 'Harsh Conditions', description: 'Start with only 2 strikes', effect: 'startStrikes', value: 2 },
    5: { name: 'Rare Candy', description: 'XP gain reduced by 20%', effect: 'xpMult', value: 0.8 },
    6: { name: 'Gym Leaders', description: 'Gym Leaders have +15% stats', effect: 'gymStatMult', value: 1.15 },
    7: { name: 'Limited Recovery', description: 'Healing items are 50% less effective', effect: 'healMult', value: 0.5 },
    8: { name: 'Elite Four', description: 'Elite Four have +20% stats', effect: 'e4StatMult', value: 1.2 },
    9: { name: 'Champion Challenge', description: 'Champion has +25% stats', effect: 'championStatMult', value: 1.25 },
    10: { name: 'Nightmare Mode', description: 'All enemies have +2 levels and +10% stats', effect: 'nightmare', value: true }
};

// Unlockable content purchased with meta-currency
const META_UNLOCKS = {
    // Starter Pokemon unlocks
    starters: {
        eevee: { name: 'Eevee', cost: 50, speciesId: 'eevee', description: 'Unlock Eevee as a starter option' },
        scyther: { name: 'Scyther', cost: 100, speciesId: 'scyther', description: 'Unlock Scyther as a starter option' },
        ralts: { name: 'Ralts', cost: 75, speciesId: 'ralts', description: 'Unlock Ralts as a starter option' },
        magikarp: { name: 'Magikarp', cost: 25, speciesId: 'magikarp', description: 'Unlock Magikarp as a starter option (hard mode!)' },
        ditto: { name: 'Ditto', cost: 150, speciesId: 'ditto', description: 'Unlock Ditto as a starter option' },
        dratini: { name: 'Dratini', cost: 200, speciesId: 'dratini', description: 'Unlock Dratini as a starter option' }
    },
    
    // Starting item unlocks
    items: {
        lucky_egg: { name: 'Lucky Egg Start', cost: 100, item: 'lucky_egg', description: 'Start with a Lucky Egg (+50% XP for holder)', quantity: 1 },
        soothe_bell: { name: 'Soothe Bell Start', cost: 75, item: 'soothe_bell', description: 'Start with a Soothe Bell (faster friendship)', quantity: 1 },
        choice_scarf: { name: 'Choice Scarf Start', cost: 150, item: 'choice_scarf', description: 'Start with a Choice Scarf (+Speed, lock move)', quantity: 1 },
        leftovers: { name: 'Leftovers Start', cost: 125, item: 'leftovers', description: 'Start with Leftovers (heal each turn)', quantity: 1 },
        focus_sash: { name: 'Focus Sash Start', cost: 200, item: 'focus_sash', description: 'Start with Focus Sash (survive OHKO once)', quantity: 1 }
    },
    
    // Starting money bonuses
    money: {
        wealthy: { name: 'Well-Funded', cost: 50, bonus: 200, description: 'Start with +200 PokeDollars' },
        rich: { name: 'Rich', cost: 100, bonus: 500, description: 'Start with +500 PokeDollars' },
        loaded: { name: 'Loaded', cost: 200, bonus: 1000, description: 'Start with +1000 PokeDollars' }
    },
    
    // Permanent quality-of-life upgrades
    upgrades: {
        extra_strikes: { name: 'Extra Strikes', cost: 150, bonus: 1, description: '+1 strike per run (max 3)', maxLevel: 3 },
        better_shops: { name: 'Better Shops', cost: 100, description: 'Shops have 1 extra item option' },
        rare_spawns: { name: 'Rare Spawns', cost: 125, description: 'Slightly higher chance of rare Pokemon encounters' },
        exp_share: { name: 'EXP Share', cost: 200, description: 'All team members gain 25% EXP from battles' }
    }
};

// Calculate rewards based on run performance
function calculateMetaRewards(runData) {
    let shinies = 0;
    
    // Base reward for completing the run
    if (runData.victory) {
        shinies += 10;
    }
    
    // Bonus for difficulty
    const difficultyMultipliers = {
        easy: 0.5,
        normal: 1.0,
        hard: 1.5,
        nightmare: 2.0
    };
    shinies = Math.floor(shinies * (difficultyMultipliers[runData.difficulty] || 1.0));
    
    // Bonus for badges earned
    shinies += runData.badges * 2;
    
    // Bonus for Pokemon caught
    shinies += Math.floor(runData.catches / 5);
    
    // Bonus for achievements unlocked this run
    shinies += (runData.newAchievements || 0) * 3;
    
    // Bonus for low strikes used (survival bonus)
    if (runData.strikesUsed === 0) {
        shinies += 5; // Flawless run
    }
    
    // Bonus for speed (if under 2 hours)
    if (runData.duration && runData.duration < 7200000) {
        shinies += 3;
    }
    
    return shinies;
}

class MetaProgression {
    constructor() {
        this.shinies = 0;
        this.ascensionLevel = 0;
        this.maxAscensionBeaten = 0;
        this.unlocks = {
            starters: new Set(),
            items: new Set(),
            money: new Set(),
            upgrades: new Set()
        };
        this.upgradeLevels = {}; // For upgrade levels (e.g., extra_strikes: 2)
        this.totalRuns = 0;
        this.totalVictories = 0;
        this.load();
    }
    
    load() {
        const raw = localStorage.getItem(META_PROGRESSION_KEY);
        if (!raw) return;
        
        try {
            const data = JSON.parse(raw);
            this.shinies = data.shinies || 0;
            this.ascensionLevel = data.ascensionLevel || 0;
            this.maxAscensionBeaten = data.maxAscensionBeaten || 0;
            this.unlocks.starters = new Set(data.unlocks?.starters || []);
            this.unlocks.items = new Set(data.unlocks?.items || []);
            this.unlocks.money = new Set(data.unlocks?.money || []);
            this.unlocks.upgrades = new Set(data.unlocks?.upgrades || []);
            this.upgradeLevels = data.upgradeLevels || {};
            this.totalRuns = data.totalRuns || 0;
            this.totalVictories = data.totalVictories || 0;
        } catch (e) {
            console.error('Failed to load meta-progression:', e);
        }
    }
    
    save() {
        const data = {
            shinies: this.shinies,
            ascensionLevel: this.ascensionLevel,
            maxAscensionBeaten: this.maxAscensionBeaten,
            unlocks: {
                starters: [...this.unlocks.starters],
                items: [...this.unlocks.items],
                money: [...this.unlocks.money],
                upgrades: [...this.unlocks.upgrades]
            },
            upgradeLevels: this.upgradeLevels,
            totalRuns: this.totalRuns,
            totalVictories: this.totalVictories
        };
        localStorage.setItem(META_PROGRESSION_KEY, JSON.stringify(data));
    }
    
    // Award shinies after a run
    awardShinies(runData) {
        const earned = calculateMetaRewards(runData);
        this.shinies += earned;
        this.totalRuns++;
        
        if (runData.victory) {
            this.totalVictories++;
            
            // Check if we beat a higher ascension
            const runAscension = runData.ascensionLevel || 0;
            if (runAscension > this.maxAscensionBeaten) {
                this.maxAscensionBeaten = runAscension;
                // Unlock next ascension level
                if (this.ascensionLevel < 10) {
                    this.ascensionLevel = Math.min(10, this.maxAscensionBeaten + 1);
                }
            }
        }
        
        this.save();
        return earned;
    }
    
    // Purchase an unlock
    purchaseUnlock(category, key) {
        const unlockData = META_UNLOCKS[category]?.[key];
        if (!unlockData) return { success: false, message: 'Invalid unlock' };
        
        // Check if already owned
        if (this.unlocks[category].has(key)) {
            // For upgrades with levels, check if we can upgrade further
            if (unlockData.maxLevel) {
                const currentLevel = this.upgradeLevels[key] || 0;
                if (currentLevel >= unlockData.maxLevel) {
                    return { success: false, message: 'Already at max level' };
                }
            } else {
                return { success: false, message: 'Already purchased' };
            }
        }
        
        // Check cost
        const cost = unlockData.cost * ((this.upgradeLevels[key] || 0) + 1);
        if (this.shinies < cost) {
            return { success: false, message: `Need ${cost} shinies, have ${this.shinies}` };
        }
        
        // Purchase
        this.shinies -= cost;
        this.unlocks[category].add(key);
        
        if (unlockData.maxLevel) {
            this.upgradeLevels[key] = (this.upgradeLevels[key] || 0) + 1;
        }
        
        this.save();
        return { success: true, message: `Purchased ${unlockData.name}!` };
    }
    
    // Get ascension modifiers for current ascension level
    getAscensionModifiers(level = null) {
        const targetLevel = level !== null ? level : this.ascensionLevel;
        const modifiers = [];
        
        for (let i = 1; i <= targetLevel; i++) {
            if (ASCENSION_MODIFIERS[i]) {
                modifiers.push(ASCENSION_MODIFIERS[i]);
            }
        }
        
        return modifiers;
    }
    
    // Get unlocked starters
    getUnlockedStarters() {
        const starters = [];
        for (const key of this.unlocks.starters) {
            const unlock = META_UNLOCKS.starters[key];
            if (unlock) starters.push(unlock);
        }
        return starters;
    }
    
    // Get starting items from unlocks
    getStartingItems() {
        const items = [];
        for (const key of this.unlocks.items) {
            const unlock = META_UNLOCKS.items[key];
            if (unlock) {
                items.push({ item: unlock.item, quantity: unlock.quantity });
            }
        }
        return items;
    }
    
    // Get starting money bonus
    getStartingMoneyBonus() {
        let bonus = 0;
        for (const key of this.unlocks.money) {
            const unlock = META_UNLOCKS.money[key];
            if (unlock) bonus += unlock.bonus;
        }
        return bonus;
    }
    
    // Get upgrade effects
    getUpgradeEffects() {
        const effects = {
            extraStrikes: 0,
            betterShops: false,
            rareSpawns: false,
            expShare: false
        };
        
        if (this.upgradeLevels.extra_strikes) {
            effects.extraStrikes = this.upgradeLevels.extra_strikes;
        }
        if (this.unlocks.upgrades.has('better_shops')) {
            effects.betterShops = true;
        }
        if (this.unlocks.upgrades.has('rare_spawns')) {
            effects.rareSpawns = true;
        }
        if (this.unlocks.upgrades.has('exp_share')) {
            effects.expShare = true;
        }
        
        return effects;
    }
    
    // Reset all meta-progression (for testing/debugging)
    reset() {
        this.shinies = 0;
        this.ascensionLevel = 0;
        this.maxAscensionBeaten = 0;
        this.unlocks = {
            starters: new Set(),
            items: new Set(),
            money: new Set(),
            upgrades: new Set()
        };
        this.upgradeLevels = {};
        this.totalRuns = 0;
        this.totalVictories = 0;
        this.save();
    }
}

// Export for use in game
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { MetaProgression, META_UNLOCKS, ASCENSION_MODIFIERS, calculateMetaRewards };
}
