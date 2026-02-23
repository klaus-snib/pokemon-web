// Pokemon Data for Roguelike Web Version

const POKEMON_DATA = {
    // Gen 1 Starters
    bulbasaur: { name: "Bulbasaur", type: "Grass", baseStats: { hp: 45, atk: 49, def: 49, spd: 45 }, evolves: { level: 16, into: "ivysaur" } },
    ivysaur: { name: "Ivysaur", type: "Grass", baseStats: { hp: 60, atk: 62, def: 63, spd: 60 }, evolves: { level: 32, into: "venusaur" } },
    venusaur: { name: "Venusaur", type: "Grass", baseStats: { hp: 80, atk: 82, def: 83, spd: 80 }, evolves: null },
    
    charmander: { name: "Charmander", type: "Fire", baseStats: { hp: 39, atk: 52, def: 43, spd: 65 }, evolves: { level: 16, into: "charmeleon" } },
    charmeleon: { name: "Charmeleon", type: "Fire", baseStats: { hp: 58, atk: 64, def: 58, spd: 80 }, evolves: { level: 36, into: "charizard" } },
    charizard: { name: "Charizard", type: "Fire", baseStats: { hp: 78, atk: 84, def: 78, spd: 100 }, evolves: null },
    
    squirtle: { name: "Squirtle", type: "Water", baseStats: { hp: 44, atk: 48, def: 65, spd: 43 }, evolves: { level: 16, into: "wartortle" } },
    wartortle: { name: "Wartortle", type: "Water", baseStats: { hp: 59, atk: 63, def: 80, spd: 58 }, evolves: { level: 36, into: "blastoise" } },
    blastoise: { name: "Blastoise", type: "Water", baseStats: { hp: 79, atk: 83, def: 100, spd: 78 }, evolves: null },
    
    // Gen 2 Starters
    chikorita: { name: "Chikorita", type: "Grass", baseStats: { hp: 45, atk: 49, def: 65, spd: 45 }, evolves: { level: 16, into: "bayleef" } },
    bayleef: { name: "Bayleef", type: "Grass", baseStats: { hp: 60, atk: 62, def: 80, spd: 60 }, evolves: { level: 32, into: "meganium" } },
    meganium: { name: "Meganium", type: "Grass", baseStats: { hp: 80, atk: 82, def: 100, spd: 80 }, evolves: null },
    
    cyndaquil: { name: "Cyndaquil", type: "Fire", baseStats: { hp: 39, atk: 52, def: 43, spd: 65 }, evolves: { level: 14, into: "quilava" } },
    quilava: { name: "Quilava", type: "Fire", baseStats: { hp: 58, atk: 64, def: 58, spd: 80 }, evolves: { level: 36, into: "typhlosion" } },
    typhlosion: { name: "Typhlosion", type: "Fire", baseStats: { hp: 78, atk: 84, def: 78, spd: 100 }, evolves: null },
    
    totodile: { name: "Totodile", type: "Water", baseStats: { hp: 50, atk: 65, def: 64, spd: 43 }, evolves: { level: 18, into: "croconaw" } },
    croconaw: { name: "Croconaw", type: "Water", baseStats: { hp: 65, atk: 80, def: 80, spd: 58 }, evolves: { level: 30, into: "feraligatr" } },
    feraligatr: { name: "Feraligatr", type: "Water", baseStats: { hp: 85, atk: 105, def: 100, spd: 78 }, evolves: null },
    
    // Special Starters
    pikachu: { name: "Pikachu", type: "Electric", baseStats: { hp: 35, atk: 55, def: 40, spd: 90 }, evolves: null },
    eevee: { name: "Eevee", type: "Normal", baseStats: { hp: 55, atk: 55, def: 50, spd: 55 }, evolves: null },
    
    // Wild Pokemon - Common
    rattata: { name: "Rattata", type: "Normal", baseStats: { hp: 30, atk: 56, def: 35, spd: 72 }, evolves: { level: 20, into: "raticate" } },
    raticate: { name: "Raticate", type: "Normal", baseStats: { hp: 55, atk: 81, def: 60, spd: 97 }, evolves: null },
    pidgey: { name: "Pidgey", type: "Flying", baseStats: { hp: 40, atk: 45, def: 40, spd: 56 }, evolves: { level: 18, into: "pidgeotto" } },
    pidgeotto: { name: "Pidgeotto", type: "Flying", baseStats: { hp: 63, atk: 60, def: 55, spd: 71 }, evolves: { level: 36, into: "pidgeot" } },
    pidgeot: { name: "Pidgeot", type: "Flying", baseStats: { hp: 83, atk: 80, def: 75, spd: 101 }, evolves: null },
    caterpie: { name: "Caterpie", type: "Bug", baseStats: { hp: 45, atk: 30, def: 35, spd: 45 }, evolves: { level: 7, into: "metapod" } },
    metapod: { name: "Metapod", type: "Bug", baseStats: { hp: 50, atk: 20, def: 55, spd: 30 }, evolves: { level: 10, into: "butterfree" } },
    butterfree: { name: "Butterfree", type: "Bug", baseStats: { hp: 60, atk: 45, def: 50, spd: 70 }, evolves: null },
    weedle: { name: "Weedle", type: "Bug", baseStats: { hp: 40, atk: 35, def: 30, spd: 50 }, evolves: { level: 7, into: "kakuna" } },
    kakuna: { name: "Kakuna", type: "Bug", baseStats: { hp: 45, atk: 25, def: 50, spd: 35 }, evolves: { level: 10, into: "beedrill" } },
    beedrill: { name: "Beedrill", type: "Bug", baseStats: { hp: 65, atk: 90, def: 40, spd: 75 }, evolves: null },
    
    // Wild Pokemon - Uncommon
    nidoran_m: { name: "Nidoran♂", type: "Poison", baseStats: { hp: 46, atk: 57, def: 40, spd: 50 }, evolves: { level: 16, into: "nidorino" } },
    nidorino: { name: "Nidorino", type: "Poison", baseStats: { hp: 61, atk: 72, def: 57, spd: 65 }, evolves: null },
    geodude: { name: "Geodude", type: "Rock", baseStats: { hp: 40, atk: 80, def: 100, spd: 20 }, evolves: { level: 25, into: "graveler" } },
    graveler: { name: "Graveler", type: "Rock", baseStats: { hp: 55, atk: 95, def: 115, spd: 35 }, evolves: null },
    machop: { name: "Machop", type: "Fighting", baseStats: { hp: 70, atk: 80, def: 50, spd: 35 }, evolves: { level: 28, into: "machoke" } },
    machoke: { name: "Machoke", type: "Fighting", baseStats: { hp: 80, atk: 100, def: 70, spd: 45 }, evolves: null },
    abra: { name: "Abra", type: "Psychic", baseStats: { hp: 25, atk: 20, def: 15, spd: 90 }, evolves: { level: 16, into: "kadabra" } },
    kadabra: { name: "Kadabra", type: "Psychic", baseStats: { hp: 40, atk: 35, def: 30, spd: 105 }, evolves: null },
    gastly: { name: "Gastly", type: "Ghost", baseStats: { hp: 30, atk: 35, def: 30, spd: 80 }, evolves: { level: 25, into: "haunter" } },
    haunter: { name: "Haunter", type: "Ghost", baseStats: { hp: 45, atk: 50, def: 45, spd: 95 }, evolves: null },
    
    // Water Pokemon (Fishing)
    magikarp: { name: "Magikarp", type: "Water", baseStats: { hp: 20, atk: 10, def: 55, spd: 80 }, evolves: { level: 20, into: "gyarados" } },
    gyarados: { name: "Gyarados", type: "Water", baseStats: { hp: 95, atk: 125, def: 79, spd: 81 }, evolves: null },
    goldeen: { name: "Goldeen", type: "Water", baseStats: { hp: 45, atk: 67, def: 60, spd: 63 }, evolves: { level: 33, into: "seaking" } },
    seaking: { name: "Seaking", type: "Water", baseStats: { hp: 80, atk: 92, def: 65, spd: 68 }, evolves: null },
    psyduck: { name: "Psyduck", type: "Water", baseStats: { hp: 50, atk: 52, def: 48, spd: 55 }, evolves: { level: 33, into: "golduck" } },
    golduck: { name: "Golduck", type: "Water", baseStats: { hp: 80, atk: 82, def: 78, spd: 85 }, evolves: null },
    tentacool: { name: "Tentacool", type: "Water", baseStats: { hp: 40, atk: 40, def: 35, spd: 70 }, evolves: { level: 30, into: "tentacruel" } },
    tentacruel: { name: "Tentacruel", type: "Water", baseStats: { hp: 80, atk: 70, def: 65, spd: 100 }, evolves: null },
    staryu: { name: "Staryu", type: "Water", baseStats: { hp: 30, atk: 45, def: 55, spd: 85 }, evolves: null },
    poliwag: { name: "Poliwag", type: "Water", baseStats: { hp: 40, atk: 50, def: 40, spd: 90 }, evolves: { level: 25, into: "poliwhirl" } },
    poliwhirl: { name: "Poliwhirl", type: "Water", baseStats: { hp: 65, atk: 65, def: 65, spd: 90 }, evolves: null },
    
    // Fossils
    omanyte: { name: "Omanyte", type: "Rock", baseStats: { hp: 35, atk: 40, def: 100, spd: 35 }, evolves: { level: 40, into: "omastar" } },
    omastar: { name: "Omastar", type: "Rock", baseStats: { hp: 70, atk: 60, def: 125, spd: 55 }, evolves: null },
    kabuto: { name: "Kabuto", type: "Rock", baseStats: { hp: 30, atk: 80, def: 90, spd: 55 }, evolves: { level: 40, into: "kabutops" } },
    kabutops: { name: "Kabutops", type: "Rock", baseStats: { hp: 60, atk: 115, def: 105, spd: 80 }, evolves: null },
    aerodactyl: { name: "Aerodactyl", type: "Rock", baseStats: { hp: 80, atk: 105, def: 65, spd: 130 }, evolves: null },
};

const STARTERS = ['bulbasaur', 'charmander', 'squirtle', 'chikorita', 'cyndaquil', 'totodile', 'pikachu', 'eevee'];

const WILD_POKEMON = {
    common: ['rattata', 'pidgey', 'caterpie', 'weedle'],
    uncommon: ['nidoran_m', 'geodude', 'machop', 'abra', 'gastly'],
    rare: ['pikachu', 'eevee'],
    fishing: ['magikarp', 'goldeen', 'psyduck', 'tentacool', 'staryu', 'poliwag']
};

const GYM_LEADERS = [
    { name: "Brock", type: "Rock", badge: "Boulder Badge", level: 14 },
    { name: "Misty", type: "Water", badge: "Cascade Badge", level: 21 },
    { name: "Lt. Surge", type: "Electric", badge: "Thunder Badge", level: 28 },
    { name: "Erika", type: "Grass", badge: "Rainbow Badge", level: 35 },
    { name: "Koga", type: "Poison", badge: "Soul Badge", level: 43 },
    { name: "Sabrina", type: "Psychic", badge: "Marsh Badge", level: 50 },
    { name: "Blaine", type: "Fire", badge: "Volcano Badge", level: 54 },
    { name: "Giovanni", type: "Ground", badge: "Earth Badge", level: 58 }
];

const ITEMS = {
    potion: { name: "Potion", desc: "Heals 20 HP", effect: "heal", value: 20, price: 200 },
    super_potion: { name: "Super Potion", desc: "Heals 50 HP", effect: "heal", value: 50, price: 700 },
    full_restore: { name: "Full Restore", desc: "Fully heals HP", effect: "heal", value: 999, price: 3000 },
    pokeball: { name: "Poke Ball", desc: "Catches wild Pokemon", effect: "catch", value: 1, price: 200 },
    great_ball: { name: "Great Ball", desc: "Better catch rate", effect: "catch", value: 1.5, price: 600 },
    rare_candy: { name: "Rare Candy", desc: "Raises level by 1", effect: "levelup", value: 1, price: 4800 },
    revive: { name: "Revive", desc: "Revives fainted Pokemon", effect: "revive", value: 0.5, price: 1500 }
};

const DIFFICULTY_SETTINGS = {
    easy: { startMoney: 2000, startItems: ['potion', 'potion', 'pokeball', 'pokeball', 'pokeball'], strikes: 5, badgesNeeded: 6 },
    normal: { startMoney: 1000, startItems: ['potion', 'pokeball', 'pokeball'], strikes: 3, badgesNeeded: 8 },
    hard: { startMoney: 500, startItems: ['potion'], strikes: 2, badgesNeeded: 8 },
    nightmare: { startMoney: 0, startItems: [], strikes: 1, badgesNeeded: 8 }
};

const TYPE_EFFECTIVENESS = {
    normal: { rock: 0.5, ghost: 0, steel: 0.5 },
    fire: { fire: 0.5, water: 0.5, grass: 2, ice: 2, bug: 2, rock: 0.5, dragon: 0.5, steel: 2 },
    water: { fire: 2, water: 0.5, grass: 0.5, ground: 2, rock: 2, dragon: 0.5 },
    grass: { fire: 0.5, water: 2, grass: 0.5, poison: 0.5, ground: 2, flying: 0.5, bug: 0.5, rock: 2, dragon: 0.5, steel: 0.5 },
    electric: { water: 2, grass: 0.5, electric: 0.5, ground: 0, flying: 2, dragon: 0.5 },
    ice: { fire: 0.5, water: 0.5, grass: 2, ice: 0.5, ground: 2, flying: 2, dragon: 2, steel: 0.5 },
    fighting: { normal: 2, ice: 2, poison: 0.5, flying: 0.5, psychic: 0.5, bug: 0.5, rock: 2, ghost: 0, dark: 2, steel: 2, fairy: 0.5 },
    poison: { grass: 2, poison: 0.5, ground: 0.5, rock: 0.5, ghost: 0.5, steel: 0, fairy: 2 },
    ground: { fire: 2, electric: 2, grass: 0.5, poison: 2, flying: 0, bug: 0.5, rock: 2, steel: 2 },
    flying: { grass: 2, electric: 0.5, fighting: 2, bug: 2, rock: 0.5, steel: 0.5 },
    psychic: { fighting: 2, poison: 2, psychic: 0.5, dark: 0, steel: 0.5 },
    bug: { fire: 0.5, grass: 2, fighting: 0.5, poison: 0.5, flying: 0.5, psychic: 2, ghost: 0.5, dark: 2, steel: 0.5, fairy: 0.5 },
    rock: { fire: 2, ice: 2, fighting: 0.5, ground: 0.5, flying: 2, bug: 2, steel: 0.5 },
    ghost: { normal: 0, psychic: 2, ghost: 2, dark: 0.5 },
    dragon: { dragon: 2, steel: 0.5, fairy: 0 },
    dark: { fighting: 0.5, psychic: 2, ghost: 2, dark: 0.5, fairy: 0.5 },
    steel: { fire: 0.5, water: 0.5, electric: 0.5, ice: 2, rock: 2, steel: 0.5, fairy: 2 },
    fairy: { fire: 0.5, fighting: 2, poison: 0.5, dragon: 2, dark: 2, steel: 0.5 }
};

// Get sprite URL from PokeAPI
function getSpriteUrl(pokemonId) {
    // Use pokemon name to ID mapping or just use showdown sprites
    const name = pokemonId.replace('_m', '-m').replace('_f', '-f');
    return `https://play.pokemonshowdown.com/sprites/gen5/${name}.png`;
}

function getBackSpriteUrl(pokemonId) {
    const name = pokemonId.replace('_m', '-m').replace('_f', '-f');
    return `https://play.pokemonshowdown.com/sprites/gen5-back/${name}.png`;
}
