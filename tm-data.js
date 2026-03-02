// TM (Technical Machine) Database
// Format: tmId: { name, move, description, rarity }
// Compatibility: Pokemon can learn if type matches or specific species list

const TMS = {
    // Gym Leader TMs (signature moves)
    'tm-rock-tomb': {
        name: 'Rock Tomb',
        move: 'rock-tomb',
        description: 'Boulders are hurled at the target. Lowers Speed.',
        power: 60,
        type: 'rock',
        rarity: 'gym'
    },
    'tm-water-pulse': {
        name: 'Water Pulse',
        move: 'water-pulse',
        description: 'A pulsing blast of water. May confuse the target.',
        power: 60,
        type: 'water',
        rarity: 'gym'
    },
    'tm-shock-wave': {
        name: 'Shock Wave',
        move: 'shock-wave',
        description: 'A fast electric shock. Never misses.',
        power: 60,
        type: 'electric',
        rarity: 'gym'
    },
    'tm-giga-drain': {
        name: 'Giga Drain',
        move: 'giga-drain',
        description: 'Drains HP from the target.',
        power: 75,
        type: 'grass',
        rarity: 'gym'
    },
    'tm-flamethrower': {
        name: 'Flamethrower',
        move: 'flamethrower',
        description: 'A powerful flame. May burn the target.',
        power: 90,
        type: 'fire',
        rarity: 'gym'
    },
    'tm-ice-beam': {
        name: 'Ice Beam',
        move: 'ice-beam',
        description: 'A chilling beam. May freeze the target.',
        power: 90,
        type: 'ice',
        rarity: 'gym'
    },
    'tm-thunderbolt': {
        name: 'Thunderbolt',
        move: 'thunderbolt',
        description: 'A strong electric blast. May paralyze.',
        power: 90,
        type: 'electric',
        rarity: 'gym'
    },
    'tm-earthquake': {
        name: 'Earthquake',
        move: 'earthquake',
        description: 'A powerful quake. Strong against diggers.',
        power: 100,
        type: 'ground',
        rarity: 'gym'
    },
    
    // Common TMs (shop rotation)
    'tm-toxic': {
        name: 'Toxic',
        move: 'toxic',
        description: 'Badly poisons the target. Damage worsens.',
        power: 0,
        type: 'poison',
        rarity: 'common',
        cost: 3000
    },
    'tm-hidden-power': {
        name: 'Hidden Power',
        move: 'hidden-power',
        description: 'Power varies by the user.',
        power: 60,
        type: 'normal',
        rarity: 'common',
        cost: 2000
    },
    'tm-protect': {
        name: 'Protect',
        move: 'protect',
        description: 'Evades all attacks. May fail if used in succession.',
        power: 0,
        type: 'normal',
        rarity: 'common',
        cost: 2500
    },
    'tm-return': {
        name: 'Return',
        move: 'return',
        description: 'Power increases with friendship.',
        power: 102,
        type: 'normal',
        rarity: 'common',
        cost: 1500
    },
    'tm-shadow-ball': {
        name: 'Shadow Ball',
        move: 'shadow-ball',
        description: 'Hurls a shadowy blob. May lower Sp. Def.',
        power: 80,
        type: 'ghost',
        rarity: 'common',
        cost: 3500
    },
    'tm-sludge-bomb': {
        name: 'Sludge Bomb',
        move: 'sludge-bomb',
        description: 'Unsanitary sludge. May poison.',
        power: 90,
        type: 'poison',
        rarity: 'common',
        cost: 3500
    },
    'tm-aerial-ace': {
        name: 'Aerial Ace',
        move: 'aerial-ace',
        description: 'An extremely fast attack. Never misses.',
        power: 60,
        type: 'flying',
        rarity: 'common',
        cost: 2500
    },
    'tm-thief': {
        name: 'Thief',
        move: 'thief',
        description: 'Attacks and steals the target\'s held item.',
        power: 60,
        type: 'dark',
        rarity: 'common',
        cost: 2000
    },
    
    // Rare TMs (wild drops)
    'tm-swords-dance': {
        name: 'Swords Dance',
        move: 'swords-dance',
        description: 'Sharply raises Attack.',
        power: 0,
        type: 'normal',
        rarity: 'rare',
        dropRate: 0.02 // 2% from wild encounters
    },
    'tm-dragon-claw': {
        name: 'Dragon Claw',
        move: 'dragon-claw',
        description: 'Slashes the target with sharp claws.',
        power: 80,
        type: 'dragon',
        rarity: 'rare',
        dropRate: 0.03
    },
    'tm-focus-blast': {
        name: 'Focus Blast',
        move: 'focus-blast',
        description: 'Fires a blast of aura. May lower Sp. Def.',
        power: 120,
        type: 'fighting',
        rarity: 'rare',
        dropRate: 0.01
    },
    'tm-psychic': {
        name: 'Psychic',
        move: 'psychic',
        description: 'A powerful psychic attack. May lower Sp. Def.',
        power: 90,
        type: 'psychic',
        rarity: 'rare',
        dropRate: 0.02
    }
};

// TM Compatibility — which Pokemon can learn which TM
// Format: tmId: [speciesIds] or type-based
const TM_COMPATIBILITY = {
    // Elemental beams (type-based primarily)
    'tm-flamethrower': ['fire', 'dragon', 'psychic'],
    'tm-ice-beam': ['water', 'ice', 'grass', 'flying', 'psychic'],
    'tm-thunderbolt': ['electric', 'water', 'flying', 'steel'],
    'tm-giga-drain': ['grass', 'bug', 'poison'],
    'tm-water-pulse': ['water', 'ice', 'grass', 'normal'],
    'tm-shock-wave': ['electric', 'water', 'flying', 'steel'],
    
    // Physical attackers
    'tm-rock-tomb': ['rock', 'ground', 'fighting', 'steel'],
    'tm-earthquake': ['ground', 'rock', 'fighting', 'normal'],
    'tm-aerial-ace': ['flying', 'bug', 'grass', 'fighting'],
    'tm-dragon-claw': ['dragon', 'flying', 'normal'],
    
    // Utility/status
    'tm-toxic': ['poison', 'grass', 'bug', 'dark', 'ghost'],
    'tm-protect': ['normal', 'fighting', 'psychic', 'steel', 'rock'],
    'tm-swords-dance': ['fighting', 'normal', 'ground', 'steel'],
    'tm-hidden-power': ['normal'], // All normal types, plus specific species below
    'tm-return': ['normal', 'fairy', 'psychic'],
    'tm-shadow-ball': ['ghost', 'psychic', 'dark', 'normal'],
    'tm-sludge-bomb': ['poison', 'grass', 'bug', 'dark'],
    'tm-thief': ['dark', 'normal', 'fighting', 'ghost'],
    'tm-focus-blast': ['fighting', 'normal', 'ground', 'rock'],
    'tm-psychic': ['psychic', 'normal', 'fairy', 'ghost']
};

// Specific species that can learn TMs outside their type
const TM_SPECIES_EXCEPTIONS = {
    'tm-hidden-power': ['pidgey', 'pidgeotto', 'pidgeot', 'spearow', 'fearow', 'clefairy', 'clefable', 'jigglypuff', 'wigglytuff'],
    'tm-toxic': ['bulbasaur', 'ivysaur', 'venusaur', 'bellsprout', 'weepinbell', 'victreebel'],
    'tm-ice-beam': ['lapras', 'slowpoke', 'slowbro', 'seel', 'dewgong'],
    'tm-thunderbolt': ['pikachu', 'raichu', 'magnemite', 'magneton'],
    'tm-psychic': ['abra', 'kadabra', 'alakazam', 'slowpoke', 'slowbro', 'drowzee', 'hypno', 'exeggcute', 'exeggutor']
};

// Check if Pokemon can learn a TM
function canLearnTM(speciesId, tmId) {
    const species = POKEMON_DATA[speciesId];
    if (!species) return false;
    
    // Check type-based compatibility
    const compatibleTypes = TM_COMPATIBILITY[tmId];
    if (compatibleTypes && compatibleTypes.includes(species.type.toLowerCase())) {
        return true;
    }
    
    // Check specific species exceptions
    const exceptions = TM_SPECIES_EXCEPTIONS[tmId];
    if (exceptions && exceptions.includes(speciesId)) {
        return true;
    }
    
    // Some TMs are universal
    if (tmId === 'tm-protect' || tmId === 'tm-return' || tmId === 'tm-toxic') {
        return true; // Most Pokemon can learn these
    }
    
    return false;
}

// Gym Leader TM rewards (gym index -> TM)
const GYM_TM_REWARDS = {
    0: 'tm-rock-tomb',      // Brock
    1: 'tm-water-pulse',    // Misty
    2: 'tm-shock-wave',     // Surge
    3: 'tm-giga-drain',     // Erika
    4: 'tm-flamethrower',   // Blaine
    5: 'tm-ice-beam',       // Lorelei (or Koga - poison)
    6: 'tm-thunderbolt',    // Sabrina or others
    7: 'tm-earthquake'      // Giovanni
};

// Shop TM rotation (changes daily or on game reset)
const SHOP_TM_POOL = [
    'tm-toxic',
    'tm-hidden-power',
    'tm-protect',
    'tm-return',
    'tm-shadow-ball',
    'tm-sludge-bomb',
    'tm-aerial-ace',
    'tm-thief'
];

// Get random TM drops from wild encounters
function getWildTMDrops() {
    const drops = [];
    const rareTMs = ['tm-swords-dance', 'tm-dragon-claw', 'tm-focus-blast', 'tm-psychic'];
    
    for (const tmId of rareTMs) {
        const tm = TMS[tmId];
        if (tm.dropRate && Math.random() < tm.dropRate) {
            drops.push(tmId);
        }
    }
    
    return drops;
}
