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

    // Eevee Evolutions (stone-based)
    vaporeon: { name: "Vaporeon", type: "Water", baseStats: { hp: 130, atk: 65, def: 60, spd: 65 }, evolves: null },
    jolteon: { name: "Jolteon", type: "Electric", baseStats: { hp: 65, atk: 65, def: 60, spd: 130 }, evolves: null },
    flareon: { name: "Flareon", type: "Fire", baseStats: { hp: 65, atk: 130, def: 60, spd: 65 }, evolves: null },

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
    growlithe: { name: "Growlithe", type: "Fire", baseStats: { hp: 55, atk: 70, def: 45, spd: 60 }, evolves: null },
    vulpix: { name: "Vulpix", type: "Fire", baseStats: { hp: 38, atk: 41, def: 40, spd: 65 }, evolves: null },

    // Stone evolution targets
    arcanine: { name: "Arcanine", type: "Fire", baseStats: { hp: 90, atk: 110, def: 80, spd: 95 }, evolves: null },
    ninetales: { name: "Ninetales", type: "Fire", baseStats: { hp: 73, atk: 76, def: 75, spd: 100 }, evolves: null },
    raichu: { name: "Raichu", type: "Electric", baseStats: { hp: 60, atk: 90, def: 55, spd: 110 }, evolves: null },
    clefairy: { name: "Clefairy", type: "Fairy", baseStats: { hp: 70, atk: 45, def: 48, spd: 35 }, evolves: null },
    clefable: { name: "Clefable", type: "Fairy", baseStats: { hp: 95, atk: 70, def: 73, spd: 60 }, evolves: null },
    nidoking: { name: "Nidoking", type: "Poison", baseStats: { hp: 81, atk: 102, def: 77, spd: 85 }, evolves: null },
    vileplume: { name: "Vileplume", type: "Grass", baseStats: { hp: 75, atk: 80, def: 85, spd: 50 }, evolves: null },
    oddish: { name: "Oddish", type: "Grass", baseStats: { hp: 45, atk: 50, def: 55, spd: 30 }, evolves: { level: 21, into: "gloom" } },
    gloom: { name: "Gloom", type: "Grass", baseStats: { hp: 60, atk: 65, def: 70, spd: 40 }, evolves: null },
    poliwrath: { name: "Poliwrath", type: "Water", baseStats: { hp: 90, atk: 95, def: 95, spd: 70 }, evolves: null },
    starmie: { name: "Starmie", type: "Water", baseStats: { hp: 60, atk: 75, def: 85, spd: 115 }, evolves: null },

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

    // Gen 2 Wild Pokemon
    sentret: { name: "Sentret", type: "Normal", baseStats: { hp: 35, atk: 46, def: 34, spd: 20 }, evolves: { level: 15, into: "furret" } },
    furret: { name: "Furret", type: "Normal", baseStats: { hp: 85, atk: 76, def: 64, spd: 90 }, evolves: null },
    hoothoot: { name: "Hoothoot", type: "Flying", baseStats: { hp: 60, atk: 30, def: 30, spd: 50 }, evolves: { level: 20, into: "noctowl" } },
    noctowl: { name: "Noctowl", type: "Flying", baseStats: { hp: 100, atk: 50, def: 50, spd: 70 }, evolves: null },
    spinarak: { name: "Spinarak", type: "Bug", baseStats: { hp: 40, atk: 60, def: 40, spd: 30 }, evolves: { level: 22, into: "ariados" } },
    ariados: { name: "Ariados", type: "Bug", baseStats: { hp: 70, atk: 90, def: 70, spd: 40 }, evolves: null },
    mareep: { name: "Mareep", type: "Electric", baseStats: { hp: 55, atk: 40, def: 40, spd: 35 }, evolves: { level: 15, into: "flaaffy" } },
    flaaffy: { name: "Flaaffy", type: "Electric", baseStats: { hp: 70, atk: 55, def: 55, spd: 45 }, evolves: { level: 30, into: "ampharos" } },
    ampharos: { name: "Ampharos", type: "Electric", baseStats: { hp: 90, atk: 75, def: 85, spd: 55 }, evolves: null },
    hoppip: { name: "Hoppip", type: "Grass", baseStats: { hp: 35, atk: 35, def: 40, spd: 50 }, evolves: { level: 18, into: "skiploom" } },
    skiploom: { name: "Skiploom", type: "Grass", baseStats: { hp: 55, atk: 45, def: 50, spd: 80 }, evolves: null },
    wooper: { name: "Wooper", type: "Water", baseStats: { hp: 55, atk: 45, def: 45, spd: 15 }, evolves: { level: 20, into: "quagsire" } },
    quagsire: { name: "Quagsire", type: "Water", baseStats: { hp: 95, atk: 85, def: 85, spd: 35 }, evolves: null },
    murkrow: { name: "Murkrow", type: "Dark", baseStats: { hp: 60, atk: 85, def: 42, spd: 91 }, evolves: null },
    misdreavus: { name: "Misdreavus", type: "Ghost", baseStats: { hp: 60, atk: 60, def: 60, spd: 85 }, evolves: null },
    snubbull: { name: "Snubbull", type: "Fairy", baseStats: { hp: 60, atk: 80, def: 50, spd: 30 }, evolves: { level: 23, into: "granbull" } },
    granbull: { name: "Granbull", type: "Fairy", baseStats: { hp: 90, atk: 120, def: 75, spd: 45 }, evolves: null },
    teddiursa: { name: "Teddiursa", type: "Normal", baseStats: { hp: 60, atk: 80, def: 50, spd: 40 }, evolves: { level: 30, into: "ursaring" } },
    ursaring: { name: "Ursaring", type: "Normal", baseStats: { hp: 90, atk: 130, def: 75, spd: 55 }, evolves: null },
    swinub: { name: "Swinub", type: "Ice", baseStats: { hp: 50, atk: 50, def: 40, spd: 50 }, evolves: { level: 33, into: "piloswine" } },
    piloswine: { name: "Piloswine", type: "Ice", baseStats: { hp: 100, atk: 100, def: 80, spd: 50 }, evolves: null },
    houndour: { name: "Houndour", type: "Dark", baseStats: { hp: 45, atk: 60, def: 30, spd: 65 }, evolves: { level: 24, into: "houndoom" } },
    houndoom: { name: "Houndoom", type: "Dark", baseStats: { hp: 75, atk: 90, def: 50, spd: 95 }, evolves: null },
    larvitar: { name: "Larvitar", type: "Rock", baseStats: { hp: 50, atk: 64, def: 50, spd: 41 }, evolves: { level: 30, into: "pupitar" } },
    pupitar: { name: "Pupitar", type: "Rock", baseStats: { hp: 70, atk: 84, def: 70, spd: 51 }, evolves: null },

    // Legendaries
    articuno: { name: "Articuno", type: "Ice", baseStats: { hp: 90, atk: 85, def: 100, spd: 85 }, evolves: null },
    zapdos: { name: "Zapdos", type: "Electric", baseStats: { hp: 90, atk: 90, def: 85, spd: 100 }, evolves: null },
    moltres: { name: "Moltres", type: "Fire", baseStats: { hp: 90, atk: 100, def: 90, spd: 90 }, evolves: null },
    mewtwo: { name: "Mewtwo", type: "Psychic", baseStats: { hp: 106, atk: 110, def: 90, spd: 130 }, evolves: null },
};

const STARTERS = ['bulbasaur', 'charmander', 'squirtle', 'chikorita', 'cyndaquil', 'totodile', 'pikachu', 'eevee'];

const LEGENDARY_POKEMON = ['articuno', 'zapdos', 'moltres', 'mewtwo'];

const WILD_POKEMON = {
    common: ['rattata', 'pidgey', 'caterpie', 'weedle', 'oddish', 'sentret', 'hoothoot', 'spinarak', 'hoppip', 'mareep'],
    uncommon: ['nidoran_m', 'geodude', 'machop', 'abra', 'gastly', 'growlithe', 'vulpix', 'clefairy', 'wooper', 'snubbull', 'teddiursa', 'swinub', 'houndour', 'murkrow', 'misdreavus'],
    rare: ['pikachu', 'eevee', 'larvitar'],
    fishing: ['magikarp', 'goldeen', 'psyduck', 'tentacool', 'staryu', 'poliwag', 'wooper']
};

// Master gym leader pool — 8 picked per run, scaled to tier levels
// earlyTeam = used for tiers 1-4 (pre-evos), lateTeam = tiers 5-8 (evolved)
const GYM_LEADER_POOL = [
    // Kanto
    { name: "Brock", type: "Rock", badge: "Boulder Badge", earlyTeam: ['geodude'], lateTeam: ['graveler', 'geodude'], region: "Kanto" },
    { name: "Misty", type: "Water", badge: "Cascade Badge", earlyTeam: ['staryu'], lateTeam: ['starmie', 'staryu'], region: "Kanto" },
    { name: "Lt. Surge", type: "Electric", badge: "Thunder Badge", earlyTeam: ['pikachu'], lateTeam: ['raichu', 'pikachu'], region: "Kanto" },
    { name: "Erika", type: "Grass", badge: "Rainbow Badge", earlyTeam: ['oddish', 'oddish'], lateTeam: ['vileplume', 'gloom'], region: "Kanto" },
    { name: "Koga", type: "Poison", badge: "Soul Badge", earlyTeam: ['nidoran_m'], lateTeam: ['nidoking', 'nidorino'], region: "Kanto" },
    { name: "Sabrina", type: "Psychic", badge: "Marsh Badge", earlyTeam: ['abra'], lateTeam: ['kadabra', 'abra'], region: "Kanto" },
    { name: "Blaine", type: "Fire", badge: "Volcano Badge", earlyTeam: ['growlithe', 'vulpix'], lateTeam: ['arcanine', 'ninetales'], region: "Kanto" },
    { name: "Giovanni", type: "Ground", badge: "Earth Badge", earlyTeam: ['geodude', 'nidoran_m'], lateTeam: ['nidoking', 'graveler', 'graveler'], region: "Kanto" },
    // Johto
    { name: "Falkner", type: "Flying", badge: "Zephyr Badge", earlyTeam: ['pidgey'], lateTeam: ['pidgeot', 'pidgeotto'], region: "Johto" },
    { name: "Bugsy", type: "Bug", badge: "Hive Badge", earlyTeam: ['caterpie', 'weedle'], lateTeam: ['butterfree', 'beedrill'], region: "Johto" },
    { name: "Whitney", type: "Normal", badge: "Plain Badge", earlyTeam: ['clefairy'], lateTeam: ['clefable', 'raticate'], region: "Johto" },
    { name: "Morty", type: "Ghost", badge: "Fog Badge", earlyTeam: ['gastly'], lateTeam: ['haunter', 'haunter'], region: "Johto" },
    { name: "Chuck", type: "Fighting", badge: "Storm Badge", earlyTeam: ['machop'], lateTeam: ['machoke', 'poliwrath'], region: "Johto" },
    { name: "Jasmine", type: "Steel", badge: "Mineral Badge", earlyTeam: ['geodude'], lateTeam: ['graveler', 'graveler'], region: "Johto" },
    { name: "Pryce", type: "Ice", badge: "Glacier Badge", earlyTeam: ['swinub'], lateTeam: ['piloswine', 'swinub'], region: "Johto" },
    { name: "Clair", type: "Dragon", badge: "Rising Badge", earlyTeam: ['gyarados'], lateTeam: ['gyarados', 'gyarados'], region: "Johto" },
    // Hoenn
    { name: "Roxanne", type: "Rock", badge: "Stone Badge", earlyTeam: ['geodude'], lateTeam: ['graveler', 'geodude'], region: "Hoenn" },
    { name: "Brawly", type: "Fighting", badge: "Knuckle Badge", earlyTeam: ['machop'], lateTeam: ['machoke', 'machop'], region: "Hoenn" },
    { name: "Wattson", type: "Electric", badge: "Dynamo Badge", earlyTeam: ['mareep'], lateTeam: ['ampharos', 'flaaffy'], region: "Hoenn" },
    { name: "Flannery", type: "Fire", badge: "Heat Badge", earlyTeam: ['vulpix'], lateTeam: ['ninetales', 'growlithe'], region: "Hoenn" },
    { name: "Norman", type: "Normal", badge: "Balance Badge", earlyTeam: ['rattata', 'clefairy'], lateTeam: ['raticate', 'clefable'], region: "Hoenn" },
    { name: "Winona", type: "Flying", badge: "Feather Badge", earlyTeam: ['pidgey', 'pidgeotto'], lateTeam: ['pidgeot', 'pidgeotto'], region: "Hoenn" },
    { name: "Wallace", type: "Water", badge: "Rain Badge", earlyTeam: ['staryu', 'poliwag'], lateTeam: ['starmie', 'gyarados'], region: "Hoenn" },
    // Sinnoh
    { name: "Roark", type: "Rock", badge: "Coal Badge", earlyTeam: ['geodude'], lateTeam: ['graveler', 'geodude'], region: "Sinnoh" },
    { name: "Gardenia", type: "Grass", badge: "Forest Badge", earlyTeam: ['oddish'], lateTeam: ['vileplume', 'gloom'], region: "Sinnoh" },
    { name: "Maylene", type: "Fighting", badge: "Cobble Badge", earlyTeam: ['machop'], lateTeam: ['machoke', 'machop'], region: "Sinnoh" },
    { name: "Crasher Wake", type: "Water", badge: "Fen Badge", earlyTeam: ['poliwag'], lateTeam: ['poliwrath', 'poliwhirl'], region: "Sinnoh" },
    { name: "Fantina", type: "Ghost", badge: "Relic Badge", earlyTeam: ['gastly'], lateTeam: ['haunter', 'gastly'], region: "Sinnoh" },
    { name: "Volkner", type: "Electric", badge: "Beacon Badge", earlyTeam: ['mareep'], lateTeam: ['ampharos', 'jolteon'], region: "Sinnoh" },
    // Extra leaders for type variety
    { name: "Candice", type: "Ice", badge: "Icicle Badge", earlyTeam: ['swinub'], lateTeam: ['piloswine', 'swinub'], region: "Sinnoh" },
    { name: "Byron", type: "Rock", badge: "Mine Badge", earlyTeam: ['geodude', 'omanyte'], lateTeam: ['graveler', 'omastar'], region: "Sinnoh" },
];

// Tier levels — gym leaders are scaled to these regardless of who they are
const GYM_TIER_LEVELS = [10, 14, 18, 22, 26, 30, 34, 38];

// Elite Four pool — 4 picked per run
const ELITE_FOUR_POOL = [
    { name: "Lorelei", type: "Ice", pokemon: ['tentacruel', 'starmie', 'gyarados'], region: "Kanto" },
    { name: "Bruno", type: "Fighting", pokemon: ['machoke', 'machoke', 'poliwrath'], region: "Kanto" },
    { name: "Agatha", type: "Ghost", pokemon: ['haunter', 'haunter', 'nidoking'], region: "Kanto" },
    { name: "Lance", type: "Dragon", pokemon: ['gyarados', 'aerodactyl', 'charizard'], region: "Kanto" },
    { name: "Will", type: "Psychic", pokemon: ['kadabra', 'starmie', 'kadabra'], region: "Johto" },
    { name: "Karen", type: "Dark", pokemon: ['houndoom', 'murkrow', 'nidoking'], region: "Johto" },
    { name: "Sidney", type: "Dark", pokemon: ['houndoom', 'murkrow', 'ursaring'], region: "Hoenn" },
    { name: "Phoebe", type: "Ghost", pokemon: ['haunter', 'haunter', 'kadabra'], region: "Hoenn" },
    { name: "Drake", type: "Dragon", pokemon: ['gyarados', 'aerodactyl', 'arcanine'], region: "Hoenn" },
    { name: "Flint", type: "Fire", pokemon: ['arcanine', 'ninetales', 'charizard'], region: "Sinnoh" },
    { name: "Lucian", type: "Psychic", pokemon: ['kadabra', 'starmie', 'kadabra'], region: "Sinnoh" },
];

// Champion pool — 1 picked per run
const CHAMPION_POOL = [
    { name: "Blue", pokemon: ['blastoise', 'arcanine', 'pidgeot', 'machoke', 'kadabra', 'raichu'], region: "Kanto" },
    { name: "Lance", pokemon: ['gyarados', 'aerodactyl', 'charizard', 'nidoking', 'machoke'], region: "Johto" },
    { name: "Steven", pokemon: ['graveler', 'starmie', 'aerodactyl', 'kadabra', 'machoke'], region: "Hoenn" },
    { name: "Cynthia", pokemon: ['gyarados', 'arcanine', 'starmie', 'machoke', 'haunter', 'vileplume'], region: "Sinnoh" },
    { name: "Red", pokemon: ['pikachu', 'venusaur', 'charizard', 'blastoise', 'kadabra'], region: "Kanto" },
];

// Shuffled gym selection for a run — picks 8 unique leaders, avoids duplicate types
function shuffleGymLeaders() {
    const pool = [...GYM_LEADER_POOL];
    const selected = [];
    const usedTypes = new Set();

    // Shuffle pool
    for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
    }

    // Pick 8, preferring unique types
    for (const leader of pool) {
        if (selected.length >= 8) break;
        if (!usedTypes.has(leader.type)) {
            selected.push({ ...leader, level: GYM_TIER_LEVELS[selected.length] });
            usedTypes.add(leader.type);
        }
    }

    // If we don't have 8 unique types, fill with remaining (allow type repeats)
    if (selected.length < 8) {
        for (const leader of pool) {
            if (selected.length >= 8) break;
            if (!selected.find(s => s.name === leader.name)) {
                selected.push({ ...leader, level: GYM_TIER_LEVELS[selected.length] });
            }
        }
    }

    return selected;
}

// Shuffle E4 — pick 4 unique, scale to levels 40-46
function shuffleEliteFour() {
    const pool = [...ELITE_FOUR_POOL];
    for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    return pool.slice(0, 4).map((e, i) => ({ ...e, level: 40 + i * 2 }));
}

// Pick random champion, scale to level 50
function shuffleChampion() {
    const champ = CHAMPION_POOL[Math.floor(Math.random() * CHAMPION_POOL.length)];
    return { ...champ, level: 50 };
}

// Legacy constant for backward compatibility
const GYM_LEADERS = shuffleGymLeaders();

const ITEMS = {
    potion: { name: "Potion", desc: "Heals 20 HP", effect: "heal", value: 20, price: 200 },
    super_potion: { name: "Super Potion", desc: "Heals 50 HP", effect: "heal", value: 50, price: 700 },
    full_restore: { name: "Full Restore", desc: "Fully heals HP", effect: "heal", value: 999, price: 3000 },
    pokeball: { name: "Poke Ball", desc: "Catches wild Pokemon", effect: "catch", value: 1, price: 200 },
    great_ball: { name: "Great Ball", desc: "Better catch rate", effect: "catch", value: 1.5, price: 600 },
    ultra_ball: { name: "Ultra Ball", desc: "Best catch rate", effect: "catch", value: 2, price: 1200 },
    rare_candy: { name: "Rare Candy", desc: "Raises level by 1", effect: "levelup", value: 1, price: 4800 },
    revive: { name: "Revive", desc: "Revives fainted Pokemon", effect: "revive", value: 0.5, price: 1500 },
    fire_stone: { name: "Fire Stone", desc: "Evolves certain Fire Pokemon", effect: "stone", value: 0, price: 5000 },
    water_stone: { name: "Water Stone", desc: "Evolves certain Water Pokemon", effect: "stone", value: 0, price: 5000 },
    thunder_stone: { name: "Thunder Stone", desc: "Evolves certain Electric Pokemon", effect: "stone", value: 0, price: 5000 },
    leaf_stone: { name: "Leaf Stone", desc: "Evolves certain Grass Pokemon", effect: "stone", value: 0, price: 5000 },
    moon_stone: { name: "Moon Stone", desc: "Evolves certain Pokemon", effect: "stone", value: 0, price: 5000 },
};

// Stone evolution mappings
const STONE_EVOLUTIONS = {
    fire_stone: {
        eevee: 'flareon',
        growlithe: 'arcanine',
        vulpix: 'ninetales'
    },
    water_stone: {
        eevee: 'vaporeon',
        poliwhirl: 'poliwrath',
        staryu: 'starmie'
    },
    thunder_stone: {
        eevee: 'jolteon',
        pikachu: 'raichu'
    },
    leaf_stone: {
        gloom: 'vileplume',
        oddish: 'vileplume'
    },
    moon_stone: {
        clefairy: 'clefable',
        nidorino: 'nidoking'
    }
};

const DIFFICULTY_SETTINGS = {
    easy: { startMoney: 2000, startItems: ['potion', 'potion', 'pokeball', 'pokeball', 'pokeball', 'pokeball', 'pokeball'], strikes: 5, badgesNeeded: 6, maxEvents: 50, levelCapBonus: 3 },
    normal: { startMoney: 1000, startItems: ['potion', 'pokeball', 'pokeball', 'pokeball'], strikes: 3, badgesNeeded: 8, maxEvents: 35, levelCapBonus: 1 },
    hard: { startMoney: 500, startItems: ['pokeball'], strikes: 2, badgesNeeded: 8, maxEvents: 28, levelCapBonus: 0 },
    nightmare: { startMoney: 0, startItems: [], strikes: 1, badgesNeeded: 8, maxEvents: 22, levelCapBonus: 0 }
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

// Move pool — each type has signature moves + coverage options
const MOVES = {
    // STAB moves (one per type, power ~60-80)
    normal:   { name: "Tackle",       type: "normal",   power: 60 },
    fire:     { name: "Flamethrower", type: "fire",     power: 75 },
    water:    { name: "Surf",         type: "water",    power: 75 },
    grass:    { name: "Razor Leaf",   type: "grass",    power: 70 },
    electric: { name: "Thunderbolt",  type: "electric", power: 75 },
    ice:      { name: "Ice Beam",     type: "ice",      power: 75 },
    fighting: { name: "Karate Chop",  type: "fighting", power: 65 },
    poison:   { name: "Sludge Bomb",  type: "poison",   power: 70 },
    ground:   { name: "Earthquake",   type: "ground",   power: 80 },
    flying:   { name: "Air Slash",    type: "flying",   power: 70 },
    psychic:  { name: "Psychic",      type: "psychic",  power: 75 },
    bug:      { name: "X-Scissor",    type: "bug",      power: 70 },
    rock:     { name: "Rock Slide",   type: "rock",     power: 70 },
    ghost:    { name: "Shadow Ball",  type: "ghost",    power: 70 },
    dragon:   { name: "Dragon Pulse", type: "dragon",   power: 75 },
    dark:     { name: "Dark Pulse",   type: "dark",     power: 70 },
    steel:    { name: "Iron Tail",    type: "steel",    power: 70 },
    fairy:    { name: "Moonblast",    type: "fairy",    power: 75 },
};

// Coverage move pools — types that make good secondary coverage
const COVERAGE_POOLS = {
    fire:     ['ground', 'rock', 'fighting', 'dragon'],
    water:    ['ice', 'ground', 'psychic', 'fairy'],
    grass:    ['poison', 'ground', 'psychic', 'fairy'],
    electric: ['ice', 'grass', 'psychic', 'fighting'],
    normal:   ['fighting', 'ground', 'rock', 'ghost'],
    ice:      ['water', 'ground', 'psychic', 'fighting'],
    fighting: ['rock', 'ground', 'dark', 'steel'],
    poison:   ['ground', 'psychic', 'dark', 'fighting'],
    ground:   ['rock', 'fighting', 'ice', 'fire'],
    flying:   ['fighting', 'rock', 'steel', 'fire'],
    psychic:  ['fairy', 'fighting', 'ice', 'electric'],
    bug:      ['flying', 'rock', 'poison', 'fighting'],
    rock:     ['ground', 'fighting', 'water', 'steel'],
    ghost:    ['dark', 'psychic', 'fighting', 'poison'],
    dragon:   ['fire', 'ice', 'ground', 'steel'],
    dark:     ['fighting', 'ghost', 'poison', 'psychic'],
    steel:    ['rock', 'ground', 'fighting', 'fire'],
    fairy:    ['psychic', 'fire', 'steel', 'ice'],
};

// Get two moves for a Pokemon: STAB + coverage
function getMovesForPokemon(type) {
    const typeKey = type.toLowerCase();
    const stab = MOVES[typeKey] || MOVES.normal;
    const pool = COVERAGE_POOLS[typeKey] || ['normal', 'fighting', 'ground'];
    const coverageType = pool[Math.floor(Math.random() * pool.length)];
    const coverage = MOVES[coverageType] || MOVES.normal;
    return [
        { ...stab, isStab: true },
        { ...coverage, isStab: false }
    ];
}

function getSpriteUrl(pokemonId) {
    const name = pokemonId.replace('nidoran_m', 'nidoranm').replace('nidoran_f', 'nidoranf').replace('_', '-');
    return `https://play.pokemonshowdown.com/sprites/gen5/${name}.png`;
}

function getBackSpriteUrl(pokemonId) {
    const name = pokemonId.replace('nidoran_m', 'nidoranm').replace('nidoran_f', 'nidoranf').replace('_', '-');
    return `https://play.pokemonshowdown.com/sprites/gen5-back/${name}.png`;
}
