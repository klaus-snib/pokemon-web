// Championship Tournament System
// Post-game tournament with ghost rivals, regional champions, and custom champions

const CHAMPIONSHIP_TOURNAMENT = {
    // Tournament format: 2 groups of 5, top 2 advance to knockouts
    GROUP_SIZE: 5,
    GROUP_COUNT: 2,
    ADVANCING_COUNT: 2,
    
    // Regional Champions from games (Gen 1-5)
    REGIONAL_CHAMPIONS: [
        // Kanto Champions
        {
            name: "Blue",
            region: "Kanto",
            team: [
                { speciesId: 'pidgeot', level: 70, moves: ['wingattack', 'agility', 'mirrormove'] },
                { speciesId: 'alakazam', level: 70, moves: ['psychic', 'psybeam', 'recover', 'reflect'] },
                { speciesId: 'rhydon', level: 70, moves: ['earthquake', 'rockslide', 'takedown'] },
                { speciesId: 'gyarados', level: 70, moves: ['hydropump', 'dragonrage', 'bite', 'thrash'] },
                { speciesId: 'exeggutor', level: 70, moves: ['eggbomb', 'stunspore', 'psychic', 'leechseed'] },
                { speciesId: 'charizard', level: 72, moves: ['flamethrower', 'slash', 'fly', 'firespin'] }
            ]
        },
        {
            name: "Silver",
            region: "Johto (Rival)",
            team: [
                { speciesId: 'sneasel', level: 68, moves: ['faintattack', 'metalclaw', 'iceshard', 'quickattack'] },
                { speciesId: 'golbat', level: 68, moves: ['poisonfang', 'airslash', 'confuseray', 'bite'] },
                { speciesId: 'magneton', level: 68, moves: ['thunderbolt', 'sonicboom', 'thunderwave', 'supersonic'] },
                { speciesId: 'alakazam', level: 68, moves: ['psychic', 'recover', 'reflect', 'calmmind'] },
                { speciesId: 'typhlosion', level: 70, moves: ['eruption', 'flamethrower', 'swift', 'smokescreen'] }
            ]
        },
        // Johto Champions
        {
            name: "Lance (Champion)",
            region: "Johto",
            team: [
                { speciesId: 'gyarados', level: 68, moves: ['flail', 'dragonrage', 'raindance', 'surf'] },
                { speciesId: 'dragonite', level: 68, moves: ['thunderwave', 'twister', 'thunder', 'hyperbeam'] },
                { speciesId: 'aerodactyl', level: 70, moves: ['rockslide', 'wingattack', 'hyperbeam', 'scaryface'] },
                { speciesId: 'charizard', level: 70, moves: ['flamethrower', 'wingattack', 'slash', 'hyperbeam'] },
                { speciesId: 'dragonite', level: 75, moves: ['hyperbeam', 'safeguard', 'outrage', 'wingattack'] }
            ]
        },
        // Hoenn Champions
        {
            name: "Steven",
            region: "Hoenn",
            team: [
                { speciesId: 'skarmory', level: 75, moves: ['steelwing', 'aerialace', 'spikes', 'roar'] },
                { speciesId: 'claydol', level: 75, moves: ['earthquake', 'ancientpower', 'psychic', 'lightscreen'] },
                { speciesId: 'aggron', level: 75, moves: ['earthquake', 'irontail', 'dragonclaw', 'thunder'] },
                { speciesId: 'cradily', level: 75, moves: ['gigadrain', 'ancientpower', 'confuseray', 'ingrain'] },
                { speciesId: 'armaldo', level: 75, moves: ['waterpulse', 'ancientpower', 'aerialace', 'slash'] },
                { speciesId: 'metagross', level: 78, moves: ['earthquake', 'psychic', 'meteormash', 'shadowball'] }
            ]
        },
        // Sinnoh Champions
        {
            name: "Cynthia",
            region: "Sinnoh",
            team: [
                { speciesId: 'spiritomb', level: 75, moves: ['darkpulse', 'shadowball', 'doubleteam', 'suckerpunch'] },
                { speciesId: 'roserade', level: 75, moves: ['energyball', 'sludgebomb', 'extrasensory', 'toxic'] },
                { speciesId: 'togekiss', level: 76, moves: ['airslash', 'aurasphere', 'psychic', 'thunderwave'] },
                { speciesId: 'lucario', level: 76, moves: ['aurasphere', 'dragonpulse', 'psychic', 'earthquake'] },
                { speciesId: 'milotic', level: 76, moves: ['surf', 'icebeam', 'mirrorcoat', 'aquaring'] },
                { speciesId: 'garchomp', level: 78, moves: ['dragonrush', 'earthquake', 'brickbreak', 'gigaimpact'] }
            ]
        },
        {
            name: "Barry",
            region: "Sinnoh (Rival)",
            team: [
                { speciesId: 'staraptor', level: 68, moves: ['bravebird', 'closecombat', 'quickattack', 'endeavor'] },
                { speciesId: 'floatzel', level: 68, moves: ['aquajet', 'crunch', 'icefang', 'swift'] },
                { speciesId: 'heracross', level: 68, moves: ['closecombat', 'megahorn', 'stoneedge', 'nightslash'] },
                { speciesId: 'snorlax', level: 68, moves: ['bodyslam', 'crunch', 'earthquake', 'rest'] },
                { speciesId: 'infernape', level: 70, moves: ['closecombat', 'flareblitz', 'machpunch', 'uturn'] }
            ]
        },
        // Unova Champions
        {
            name: "Alder",
            region: "Unova",
            team: [
                { speciesId: 'accelgor', level: 75, moves: ['bugbuzz', 'focusblast', 'swift', 'megadrain'] },
                { speciesId: 'bouffalant', level: 75, moves: ['headcharge', 'megahorn', 'stoneedge', 'earthquake'] },
                { speciesId: 'escavalier', level: 75, moves: ['xscissor', 'ironhead', 'reversal', 'swordsdance'] },
                { speciesId: 'druddigon', level: 75, moves: ['crunch', 'dragonclaw', 'rockslide', 'firefang'] },
                { speciesId: 'vanilluxe', level: 75, moves: ['blizzard', 'flashcannon', 'lightscreen', 'explosion'] },
                { speciesId: 'volcarona', level: 77, moves: ['bugbuzz', 'heatwave', 'psychic', 'quiverdance'] }
            ]
        }
    ],
    
    // Custom Champion Teams (filled by players)
    CUSTOM_CHAMPIONS: {
        nsilver: {
            name: "NSilver",
            team: [
                { speciesId: 'feraligatr', level: 75, moves: ['waterfall', 'crunch', 'icepunch', 'dragondance'] },
                { speciesId: 'gengar', level: 75, moves: ['shadowball', 'sludgebomb', 'thunderbolt', 'focusblast'] },
                { speciesId: 'whimsicott', level: 75, moves: ['gigadrain', 'hurricane', 'leechseed', 'substitute'] },
                { speciesId: 'gliscor', level: 75, moves: ['earthquake', 'stoneedge', 'knockoff', 'roost'] },
                { speciesId: 'scizor', level: 75, moves: ['bulletpunch', 'uturn', 'superpower', 'roost'] },
                { speciesId: 'umbreon', level: 75, moves: ['foulplay', 'wish', 'protect', 'toxic'] }
            ]
        },
        nib: {
            name: "Nib",
            team: [
                { speciesId: 'alakazam', level: 75, moves: ['psychic', 'shadowball', 'focusblast', 'calmmind'] },
                { speciesId: 'starmie', level: 75, moves: ['surf', 'thunderbolt', 'icebeam', 'recover'] },
                { speciesId: 'tyranitar', level: 75, moves: ['stoneedge', 'crunch', 'earthquake', 'dragondance'] },
                { speciesId: 'flygon', level: 75, moves: ['earthquake', 'outrage', 'fireblast', 'uturn'] },
                { speciesId: 'heracross', level: 75, moves: ['closecombat', 'megahorn', 'stoneedge', 'facade'] },
                { speciesId: 'jolteon', level: 75, moves: ['thunderbolt', 'voltswitch', 'shadowball', 'hiddenpower'] }
            ]
        },
        snib: {
            name: "Snib",
            team: [
                { speciesId: 'blaziken', level: 75, moves: ['flareblitz', 'closecombat', 'stoneedge', 'protect'] },
                { speciesId: 'metagross', level: 75, moves: ['meteormash', 'earthquake', 'bulletpunch', 'zenheadbutt'] },
                { speciesId: 'salamence', level: 75, moves: ['outrage', 'earthquake', 'fireblast', 'dragondance'] },
                { speciesId: 'gardevoir', level: 75, moves: ['moonblast', 'psychic', 'shadowball', 'calmmind'] },
                { speciesId: 'lucario', level: 75, moves: ['closecombat', 'meteormash', 'extremespeed', 'stoneedge'] },
                { speciesId: 'garchomp', level: 75, moves: ['earthquake', 'outrage', 'stoneedge', 'swordsdance'] }
            ]
        },
        ib: {
            name: "Ib",
            team: [
                { speciesId: 'alakazam', level: 75, moves: ['psychic', 'focusblast', 'shadowball', 'calmmind'] },
                { speciesId: 'metagross', level: 75, moves: ['meteormash', 'earthquake', 'zenheadbutt', 'bulletpunch'] },
                { speciesId: 'porygonz', level: 75, moves: ['triattack', 'icebeam', 'thunderbolt', 'recover'] },
                { speciesId: 'claydol', level: 75, moves: ['earthpower', 'psychic', 'icebeam', 'rapidspin'] },
                { speciesId: 'bronzong', level: 75, moves: ['gyroball', 'earthquake', 'zenheadbutt', 'stealthrock'] },
                { speciesId: 'chandelure', level: 75, moves: ['shadowball', 'fireblast', 'energyball', 'calmmind'] }
            ]
        }
    }
};

// Ghost Rivals - teams from successful runs
// Stored in localStorage as 'pokemon_ghost_rivals'
function saveGhostRival(team, playerName) {
    const ghostRivals = JSON.parse(localStorage.getItem('pokemon_ghost_rivals') || '[]');
    
    // Save team snapshot with timestamp
    const rival = {
        name: playerName || 'Champion ' + (ghostRivals.length + 1),
        team: team.map(p => ({
            speciesId: p.speciesId,
            level: p.level,
            moves: p.moves.map(m => ({ id: m.id, name: m.name, type: m.type, pp: m.pp, maxPp: m.maxPp }))
        })),
        timestamp: Date.now(),
        wins: 1
    };
    
    // Add to front, keep max 20 ghost rivals
    ghostRivals.unshift(rival);
    if (ghostRivals.length > 20) {
        ghostRivals.pop();
    }
    
    localStorage.setItem('pokemon_ghost_rivals', JSON.stringify(ghostRivals));
    return rival;
}

function getGhostRivals() {
    return JSON.parse(localStorage.getItem('pokemon_ghost_rivals') || '[]');
}

// Generate tournament bracket
function generateTournament() {
    const ghostRivals = getGhostRivals();
    const regionalChampions = CHAMPIONSHIP_TOURNAMENT.REGIONAL_CHAMPIONS;
    const customChampions = Object.values(CHAMPIONSHIP_TOURNAMENT.CUSTOM_CHAMPIONS);
    
    // Build pool of all challengers
    let pool = [];
    
    // Add ghost rivals (up to 5 recent ones)
    pool.push(...ghostRivals.slice(0, 5).map(r => ({ ...r, type: 'ghost' })));
    
    // Add regional champions
    pool.push(...regionalChampions.map(c => ({ ...c, type: 'regional' })));
    
    // Add custom champions
    pool.push(...customChampions.map(c => ({ ...c, type: 'custom' })));
    
    // Shuffle pool
    pool = shuffleArray(pool);
    
    // Split into 2 groups of 5
    const groupA = pool.slice(0, 5);
    const groupB = pool.slice(5, 10);
    
    return {
        groupA,
        groupB,
        stage: 'group', // 'group', 'semifinal', 'final'
        groupResults: { a: [], b: [] },
        knockoutResults: { semifinal: [], final: null }
    };
}

// Fisher-Yates shuffle
function shuffleArray(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

// Export for use in game
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CHAMPIONSHIP_TOURNAMENT, saveGhostRival, getGhostRivals, generateTournament };
}
