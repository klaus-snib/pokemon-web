// Championship Tournament System
// Post-game tournament with ghost rivals, regional champions, and custom champions
//
// SMGON CLAUSES (Tournament Rules):
// - Sleep Clause: Only one Pokemon can be asleep at a time per team
// - Freeze Clause: Max 1 frozen at a time
// - Evasion Clause: Max +2 evasion (Double Team can only be used twice)
// - Species Clause: No duplicate species per team
// - OHKO Clause: Fissure, Sheer Cold, Horn Drill, Guillotine banned
// - AI respects clauses - won't spam evasion or sleep when clause is active
//

// Validate all tournament teams for Species Clause compliance
function validateTournamentTeams() {
    const allTrainers = [
        ...CHAMPIONSHIP_TOURNAMENT.REGIONAL_CHAMPIONS,
        ...CHAMPIONSHIP_TOURNAMENT.CUSTOM_CHAMPIONS
    ];
    
    const violations = [];
    
    for (const trainer of allTrainers) {
        const speciesIds = trainer.team.map(p => p.speciesId);
        const duplicates = speciesIds.filter((item, index) => speciesIds.indexOf(item) !== index);
        
        if (duplicates.length > 0) {
            const uniqueDups = [...new Set(duplicates)];
            violations.push(`${trainer.name} (${trainer.region}): duplicate ${uniqueDups.join(', ')}`);
        }
    }
    
    if (violations.length > 0) {
        console.warn('Species Clause violations in tournament teams:');
        violations.forEach(v => console.warn('  - ' + v));
        return false;
    }
    
    console.log('✓ All tournament teams pass Species Clause validation');
    return true;
}

const CHAMPIONSHIP_TOURNAMENT = {
    // Tournament format: 2 groups of 5, top 2 advance to knockouts
    GROUP_SIZE: 5,
    GROUP_COUNT: 2,
    ADVANCING_COUNT: 2,
    
    // Regional Champions from games (Gen 1-5) - all with Smogon-optimal movesets
    REGIONAL_CHAMPIONS: [
        // Kanto Champions
        {
            name: "Blue",
            region: "Kanto",
            team: [
                { speciesId: 'pidgeot', level: 80, moves: ['return', 'aerialace', 'steelwing', 'hiddenpower'] },
                { speciesId: 'alakazam', level: 82, moves: ['psychic', 'firepunch', 'icepunch', 'calmmind'] },
                { speciesId: 'rhydon', level: 80, moves: ['earthquake', 'rockslide', 'megahorn', 'doubleedge'] },
                { speciesId: 'gyarados', level: 82, moves: ['hydropump', 'earthquake', 'doubleedge', 'dragondance'] },
                { speciesId: 'exeggutor', level: 80, moves: ['psychic', 'gigadrain', 'sleeppowder', 'hiddenpower'] },
                { speciesId: 'charizard', level: 85, moves: ['fireblast', 'earthquake', 'bellydrum', 'rockslide'] }
            ]
        },
        {
            name: "Silver",
            region: "Johto (Rival)",
            team: [
                { speciesId: 'sneasel', level: 78, moves: ['shadowball', 'icebeam', 'brickbreak', 'return'] },
                { speciesId: 'crobat', level: 80, moves: ['sludgebomb', 'aerialace', 'gigadrain', 'hiddenpower'] },
                { speciesId: 'magneton', level: 78, moves: ['thunderbolt', 'hiddenpower', 'substitute', 'toxic'] },
                { speciesId: 'gengar', level: 80, moves: ['thunderbolt', 'icepunch', 'gigadrain', 'explosion'] },
                { speciesId: 'typhlosion', level: 82, moves: ['fireblast', 'hiddenpower', 'thunderpunch', 'earthquake'] }
            ]
        },
        // Johto Champions
        {
            name: "Lance",
            region: "Johto",
            team: [
                { speciesId: 'gyarados', level: 78, moves: ['hydropump', 'earthquake', 'doubleedge', 'dragondance'] },
                { speciesId: 'dragonite', level: 82, moves: ['outrage', 'wingattack', 'earthquake', 'healbell'] },
                { speciesId: 'aerodactyl', level: 80, moves: ['rockslide', 'earthquake', 'doubleedge', 'hiddenpower'] },
                { speciesId: 'charizard', level: 80, moves: ['fireblast', 'earthquake', 'bellydrum', 'rockslide'] },
                { speciesId: 'dragonite', level: 85, moves: ['outrage', 'icebeam', 'thunderbolt', 'healbell'] }
            ]
        },
        {
            name: "Red",
            region: "Johto (Mt. Silver)",
            team: [
                { speciesId: 'pikachu', level: 90, moves: ['thunderbolt', 'irontail', 'doubleteam', 'substitute'] },
                { speciesId: 'espeon', level: 82, moves: ['psychic', 'morningsun', 'calmmind', 'hiddenpower'] },
                { speciesId: 'snorlax', level: 82, moves: ['return', 'earthquake', 'shadowball', 'rest'] },
                { speciesId: 'venusaur', level: 84, moves: ['razorleaf', 'sludgebomb', 'sleeppowder', 'synthesis'] },
                { speciesId: 'charizard', level: 84, moves: ['fireblast', 'earthquake', 'bellydrum', 'rockslide'] },
                { speciesId: 'blastoise', level: 84, moves: ['surf', 'icebeam', 'earthquake', 'rest'] }
            ]
        },
        // Hoenn Champions
        {
            name: "Steven",
            region: "Hoenn",
            team: [
                { speciesId: 'skarmory', level: 80, moves: ['drillpeck', 'spikes', 'whirlwind', 'toxic'] },
                { speciesId: 'claydol', level: 80, moves: ['psychic', 'icebeam', 'earthquake', 'rapidspin'] },
                { speciesId: 'aggron', level: 82, moves: ['doubleedge', 'earthquake', 'rockslide', 'irontail'] },
                { speciesId: 'cradily', level: 80, moves: ['gigadrain', 'rockslide', 'mirrorcoat', 'recover'] },
                { speciesId: 'armaldo', level: 80, moves: ['rockslide', 'earthquake', 'swordsdance', 'hiddenpower'] },
                { speciesId: 'metagross', level: 85, moves: ['meteormash', 'earthquake', 'rockslide', 'explosion'] }
            ]
        },
        {
            name: "May",
            region: "Hoenn (Anime)",
            team: [
                { speciesId: 'blaziken', level: 82, moves: ['fireblast', 'skyuppercut', 'rockslide', 'swordsdance'] },
                { speciesId: 'beautifly', level: 82, moves: ['psychic', 'gigadrain', 'stunspore', 'hiddenpower'] },
                { speciesId: 'skitty', level: 85, moves: ['doubleedge', 'shadowball', 'thunderbolt', 'icebeam'] },
                { speciesId: 'bulbasaur', level: 88, moves: ['gigadrain', 'sludgebomb', 'sleeppowder', 'hiddenpower'] },
                { speciesId: 'munchlax', level: 85, moves: ['return', 'earthquake', 'shadowball', 'fireblast'] },
                { speciesId: 'squirtle', level: 85, moves: ['hydropump', 'icebeam', 'hiddenpower', 'protect'] }
            ]
        },
        {
            name: "Brendan",
            region: "Hoenn",
            team: [
                { speciesId: 'sceptile', level: 82, moves: ['leafblade', 'earthquake', 'rockslide', 'hiddenpower'] },
                { speciesId: 'swellow', level: 80, moves: ['return', 'aerialace', 'hiddenpower', 'endeavor'] },
                { speciesId: 'camerupt', level: 80, moves: ['fireblast', 'earthquake', 'rockslide', 'hiddenpower'] },
                { speciesId: 'sharpedo', level: 80, moves: ['hydropump', 'crunch', 'earthquake', 'hiddenpower'] },
                { speciesId: 'flygon', level: 82, moves: ['earthquake', 'rockslide', 'fireblast', 'hiddenpower'] },
                { speciesId: 'milotic', level: 82, moves: ['surf', 'icebeam', 'recover', 'hiddenpower'] }
            ]
        },
        {
            name: "Wally",
            region: "Hoenn (Rival)",
            team: [
                { speciesId: 'altaria', level: 78, moves: ['icebeam', 'earthquake', 'dragonclaw', 'sing'] },
                { speciesId: 'delcatty', level: 78, moves: ['return', 'shadowball', 'thunderbolt', 'icebeam'] },
                { speciesId: 'roserade', level: 80, moves: ['sludgebomb', 'gigadrain', 'hiddenpower', 'sleeppowder'] },
                { speciesId: 'magneton', level: 78, moves: ['thunderbolt', 'hiddenpower', 'substitute', 'toxic'] },
                { speciesId: 'gardevoir', level: 82, moves: ['psychic', 'thunderbolt', 'willowisp', 'memento'] }
            ]
        },
        // Sinnoh Champions
        {
            name: "Cynthia",
            region: "Sinnoh",
            team: [
                { speciesId: 'spiritomb', level: 82, moves: ['darkpulse', 'psychic', 'silverwind', 'shadowball'] },
                { speciesId: 'roserade', level: 82, moves: ['sludgebomb', 'gigadrain', 'hiddenpower', 'sleeppowder'] },
                { speciesId: 'togekiss', level: 84, moves: ['airslash', 'aurasphere', 'thunderwave', 'roost'] },
                { speciesId: 'lucario', level: 84, moves: ['aurasphere', 'dragonpulse', 'psychic', 'earthquake'] },
                { speciesId: 'milotic', level: 84, moves: ['surf', 'icebeam', 'mirrorcoat', 'recover'] },
                { speciesId: 'garchomp', level: 88, moves: ['dragonrush', 'earthquake', 'brickbreak', 'gigaimpact'] }
            ]
        },
        {
            name: "Barry",
            region: "Sinnoh (Rival)",
            team: [
                { speciesId: 'staraptor', level: 78, moves: ['return', 'aerialace', 'closecombat', 'quickattack'] },
                { speciesId: 'floatzel', level: 78, moves: ['waterfall', 'icepunch', 'crunch', 'brickbreak'] },
                { speciesId: 'heracross', level: 80, moves: ['closecombat', 'megahorn', 'stoneedge', 'nightslash'] },
                { speciesId: 'snorlax', level: 80, moves: ['return', 'earthquake', 'crunch', 'rest'] },
                { speciesId: 'infernape', level: 82, moves: ['closecombat', 'flareblitz', 'machpunch', 'uturn'] }
            ]
        },
        // Unova Champions
        {
            name: "Alder",
            region: "Unova",
            team: [
                { speciesId: 'accelgor', level: 80, moves: ['bugbuzz', 'focusblast', 'hiddenpower', 'spikes'] },
                { speciesId: 'bouffalant', level: 82, moves: ['return', 'earthquake', 'stoneedge', 'megahorn'] },
                { speciesId: 'escavalier', level: 80, moves: ['megahorn', 'ironhead', 'drillrun', 'swordsdance'] },
                { speciesId: 'druddigon', level: 80, moves: ['outrage', 'earthquake', 'suckerpunch', 'glare'] },
                { speciesId: 'vanilluxe', level: 80, moves: ['blizzard', 'flashcannon', 'hiddenpower', 'explosion'] },
                { speciesId: 'volcarona', level: 85, moves: ['bugbuzz', 'fierydance', 'gigadrain', 'quiverdance'] }
            ]
        }
    ],
    
    // Custom Champion Teams (filled by players) - all with Smogon-optimal movesets
    CUSTOM_CHAMPIONS: {
        nsilver: {
            name: "NSilver",
            team: [
                { speciesId: 'feraligatr', level: 85, moves: ['hydropump', 'icepunch', 'earthquake', 'dragondance'] },
                { speciesId: 'gengar', level: 85, moves: ['shadowball', 'thunderbolt', 'icepunch', 'explosion'] },
                { speciesId: 'whimsicott', level: 85, moves: ['gigadrain', 'hurricane', 'leechseed', 'encore'] },
                { speciesId: 'gliscor', level: 85, moves: ['earthquake', 'stoneedge', 'knockoff', 'roost'] },
                { speciesId: 'scizor', level: 85, moves: ['bulletpunch', 'uturn', 'superpower', 'knockoff'] },
                { speciesId: 'umbreon', level: 85, moves: ['foulplay', 'wish', 'protect', 'toxic'] }
            ]
        },
        nib: {
            name: "Nib",
            team: [
                { speciesId: 'alakazam', level: 85, moves: ['psychic', 'firepunch', 'icepunch', 'calmmind'] },
                { speciesId: 'starmie', level: 85, moves: ['surf', 'thunderbolt', 'icebeam', 'rapidspin'] },
                { speciesId: 'tyranitar', level: 85, moves: ['stoneedge', 'crunch', 'earthquake', 'dragondance'] },
                { speciesId: 'flygon', level: 85, moves: ['earthquake', 'rockslide', 'fireblast', 'hiddenpower'] },
                { speciesId: 'heracross', level: 85, moves: ['closecombat', 'megahorn', 'stoneedge', 'facade'] },
                { speciesId: 'jolteon', level: 85, moves: ['thunderbolt', 'hiddenpower', 'shadowball', 'batonpass'] }
            ]
        },
        snib: {
            name: "Snib",
            team: [
                { speciesId: 'blaziken', level: 85, moves: ['fireblast', 'skyuppercut', 'rockslide', 'swordsdance'] },
                { speciesId: 'metagross', level: 85, moves: ['meteormash', 'earthquake', 'rockslide', 'explosion'] },
                { speciesId: 'salamence', level: 85, moves: ['dragonclaw', 'earthquake', 'fireblast', 'dragondance'] },
                { speciesId: 'gardevoir', level: 85, moves: ['psychic', 'thunderbolt', 'willowisp', 'memento'] },
                { speciesId: 'lucario', level: 85, moves: ['closecombat', 'meteormash', 'extremespeed', 'stoneedge'] },
                { speciesId: 'garchomp', level: 85, moves: ['dragonclaw', 'earthquake', 'stoneedge', 'swordsdance'] }
            ]
        },
        ib: {
            name: "Ib",
            team: [
                { speciesId: 'alakazam', level: 85, moves: ['psychic', 'firepunch', 'icepunch', 'calmmind'] },
                { speciesId: 'metagross', level: 85, moves: ['meteormash', 'earthquake', 'rockslide', 'explosion'] },
                { speciesId: 'porygonz', level: 85, moves: ['triattack', 'icebeam', 'thunderbolt', 'recover'] },
                { speciesId: 'claydol', level: 85, moves: ['earthquake', 'icebeam', 'psychic', 'rapidspin'] },
                { speciesId: 'bronzong', level: 85, moves: ['gyroball', 'earthquake', 'hiddenpower', 'stealthrock'] },
                { speciesId: 'chandelure', level: 85, moves: ['shadowball', 'fireblast', 'energyball', 'calmmind'] }
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
