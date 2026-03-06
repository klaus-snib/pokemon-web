// Pokemon Data for Roguelike Web Version

const POKEMON_DATA = {
    // Gen 1 Starters
    bulbasaur: { name: "Bulbasaur", type: "Grass", type2: 'Poison', baseStats: { hp: 45, atk: 49, def: 49, spd: 45 }, spa: 65, spd_def: 65, evolves: { level: 16, into: "ivysaur" } },
    ivysaur: { name: "Ivysaur", type: "Grass", type2: 'Poison', baseStats: { hp: 60, atk: 62, def: 63, spd: 60 }, spa: 65, spd_def: 65, evolves: { level: 32, into: "venusaur" } },
    venusaur: { name: "Venusaur", type: "Grass", type2: 'Poison', baseStats: { hp: 80, atk: 82, def: 83, spd: 80 }, spa: 80, spd_def: 80, evolves: null },

    charmander: { name: "Charmander", type: "Fire", baseStats: { hp: 39, atk: 52, def: 43, spd: 65 }, spa: 100, spd_def: 100, evolves: { level: 16, into: "charmeleon" } },
    charmeleon: { name: "Charmeleon", type: "Fire", baseStats: { hp: 58, atk: 64, def: 58, spd: 80 }, spa: 60, spd_def: 50, evolves: { level: 36, into: "charizard" } },
    charizard: { name: "Charizard", type: "Fire", type2: 'Flying', baseStats: { hp: 78, atk: 84, def: 78, spd: 100 }, spa: 80, spd_def: 65, evolves: null },

    squirtle: { name: "Squirtle", type: "Water", baseStats: { hp: 44, atk: 48, def: 65, spd: 43 }, spa: 109, spd_def: 85, evolves: { level: 16, into: "wartortle" } },
    wartortle: { name: "Wartortle", type: "Water", baseStats: { hp: 59, atk: 63, def: 80, spd: 58 }, spa: 50, spd_def: 64, evolves: { level: 36, into: "blastoise" } },
    blastoise: { name: "Blastoise", type: "Water", baseStats: { hp: 79, atk: 83, def: 100, spd: 78 }, spa: 65, spd_def: 80, evolves: null },

    // Gen 2 Starters
    chikorita: { name: "Chikorita", type: "Grass", baseStats: { hp: 45, atk: 49, def: 65, spd: 45 }, spa: 85, spd_def: 105, evolves: { level: 16, into: "bayleef" } },
    bayleef: { name: "Bayleef", type: "Grass", baseStats: { hp: 60, atk: 62, def: 80, spd: 60 }, spa: 49, spd_def: 65, evolves: { level: 32, into: "meganium" } },
    meganium: { name: "Meganium", type: "Grass", baseStats: { hp: 80, atk: 82, def: 100, spd: 80 }, spa: 63, spd_def: 80, evolves: null },

    cyndaquil: { name: "Cyndaquil", type: "Fire", baseStats: { hp: 39, atk: 52, def: 43, spd: 65 }, spa: 83, spd_def: 100, evolves: { level: 14, into: "quilava" } },
    quilava: { name: "Quilava", type: "Fire", baseStats: { hp: 58, atk: 64, def: 58, spd: 80 }, spa: 60, spd_def: 50, evolves: { level: 36, into: "typhlosion" } },
    typhlosion: { name: "Typhlosion", type: "Fire", baseStats: { hp: 78, atk: 84, def: 78, spd: 100 }, spa: 80, spd_def: 65, evolves: null },

    totodile: { name: "Totodile", type: "Water", baseStats: { hp: 50, atk: 65, def: 64, spd: 43 }, spa: 109, spd_def: 85, evolves: { level: 18, into: "croconaw" } },
    croconaw: { name: "Croconaw", type: "Water", baseStats: { hp: 65, atk: 80, def: 80, spd: 58 }, spa: 44, spd_def: 48, evolves: { level: 30, into: "feraligatr" } },
    feraligatr: { name: "Feraligatr", type: "Water", baseStats: { hp: 85, atk: 105, def: 100, spd: 78 }, spa: 59, spd_def: 63, evolves: null },

    // Special Starters
    pikachu: { name: "Pikachu", type: "Electric", baseStats: { hp: 35, atk: 55, def: 40, spd: 90 }, spa: 79, spd_def: 83, evolves: null },
    eevee: { name: "Eevee", type: "Normal", baseStats: { hp: 55, atk: 55, def: 50, spd: 55 }, spa: 50, spd_def: 50, evolves: null },

    // Eevee Evolutions (stone-based)
    vaporeon: { name: "Vaporeon", type: "Water", baseStats: { hp: 130, atk: 65, def: 60, spd: 65 }, spa: 45, spd_def: 65, evolves: null },
    jolteon: { name: "Jolteon", type: "Electric", baseStats: { hp: 65, atk: 65, def: 60, spd: 130 }, spa: 110, spd_def: 95, evolves: null },
    flareon: { name: "Flareon", type: "Fire", baseStats: { hp: 65, atk: 130, def: 60, spd: 65 }, spa: 110, spd_def: 95, evolves: null },

    // Wild Pokemon - Common
    rattata: { name: "Rattata", type: "Normal", baseStats: { hp: 30, atk: 56, def: 35, spd: 72 }, spa: 95, spd_def: 110, evolves: { level: 20, into: "raticate" } },
    raticate: { name: "Raticate", type: "Normal", baseStats: { hp: 55, atk: 81, def: 60, spd: 97 }, spa: 25, spd_def: 35, evolves: null },
    pidgey: { name: "Pidgey", type: "Flying", type2: 'Flying', baseStats: { hp: 40, atk: 45, def: 40, spd: 56 }, spa: 50, spd_def: 70, evolves: { level: 18, into: "pidgeotto" } },
    pidgeotto: { name: "Pidgeotto", type: "Flying", type2: 'Flying', baseStats: { hp: 63, atk: 60, def: 55, spd: 71 }, spa: 35, spd_def: 35, evolves: { level: 36, into: "pidgeot" } },
    pidgeot: { name: "Pidgeot", type: "Flying", type2: 'Flying', baseStats: { hp: 83, atk: 80, def: 75, spd: 101 }, spa: 50, spd_def: 50, evolves: null },
    caterpie: { name: "Caterpie", type: "Bug", baseStats: { hp: 45, atk: 30, def: 35, spd: 45 }, spa: 70, spd_def: 70, evolves: { level: 7, into: "metapod" } },
    metapod: { name: "Metapod", type: "Bug", baseStats: { hp: 50, atk: 20, def: 55, spd: 30 }, spa: 20, spd_def: 20, evolves: { level: 10, into: "butterfree" } },
    butterfree: { name: "Butterfree", type: "Bug", type2: 'Flying', baseStats: { hp: 60, atk: 45, def: 50, spd: 70 }, spa: 25, spd_def: 25, evolves: null },
    weedle: { name: "Weedle", type: "Bug", type2: 'Poison', baseStats: { hp: 40, atk: 35, def: 30, spd: 50 }, spa: 90, spd_def: 80, evolves: { level: 7, into: "kakuna" } },
    kakuna: { name: "Kakuna", type: "Bug", type2: 'Poison', baseStats: { hp: 45, atk: 25, def: 50, spd: 35 }, spa: 20, spd_def: 20, evolves: { level: 10, into: "beedrill" } },
    beedrill: { name: "Beedrill", type: "Bug", type2: 'Poison', baseStats: { hp: 65, atk: 90, def: 40, spd: 75 }, spa: 25, spd_def: 25, evolves: null },

    // Wild Pokemon - Uncommon
    nidoran_m: { name: "Nidoran♂", type: "Poison", baseStats: { hp: 46, atk: 57, def: 40, spd: 50 }, spa: 45, spd_def: 80, evolves: { level: 16, into: "nidorino" } },
    nidorino: { name: "Nidorino", type: "Poison", baseStats: { hp: 61, atk: 72, def: 57, spd: 65 }, evolves: null },
    geodude: { name: "Geodude", type: "Rock", type2: 'Ground', baseStats: { hp: 40, atk: 80, def: 100, spd: 20 }, spa: 55, spd_def: 55, evolves: { level: 25, into: "graveler" } },
    graveler: { name: "Graveler", type: "Rock", type2: 'Ground', baseStats: { hp: 55, atk: 95, def: 115, spd: 35 }, spa: 30, spd_def: 30, evolves: null },
    machop: { name: "Machop", type: "Fighting", baseStats: { hp: 70, atk: 80, def: 50, spd: 35 }, spa: 45, spd_def: 45, evolves: { level: 28, into: "machoke" } },
    machoke: { name: "Machoke", type: "Fighting", baseStats: { hp: 80, atk: 100, def: 70, spd: 45 }, spa: 35, spd_def: 35, evolves: null },
    abra: { name: "Abra", type: "Psychic", baseStats: { hp: 25, atk: 20, def: 15, spd: 90 }, spa: 50, spd_def: 60, evolves: { level: 16, into: "kadabra" } },
    kadabra: { name: "Kadabra", type: "Psychic", baseStats: { hp: 40, atk: 35, def: 30, spd: 105 }, spa: 105, spd_def: 55, evolves: null },
    gastly: { name: "Gastly", type: "Ghost", type2: 'Poison', baseStats: { hp: 30, atk: 35, def: 30, spd: 80 }, spa: 120, spd_def: 70, evolves: { level: 25, into: "haunter" } },
    haunter: { name: "Haunter", type: "Ghost", type2: 'Poison', baseStats: { hp: 45, atk: 50, def: 45, spd: 95 }, spa: 100, spd_def: 35, evolves: null },
    growlithe: { name: "Growlithe", type: "Fire", baseStats: { hp: 55, atk: 70, def: 45, spd: 60 }, spa: 115, spd_def: 55, evolves: null },
    vulpix: { name: "Vulpix", type: "Fire", baseStats: { hp: 38, atk: 41, def: 40, spd: 65 }, spa: 70, spd_def: 50, evolves: null },

    // Stone evolution targets
    arcanine: { name: "Arcanine", type: "Fire", baseStats: { hp: 90, atk: 110, def: 80, spd: 95 }, spa: 50, spd_def: 65, evolves: null },
    ninetales: { name: "Ninetales", type: "Fire", baseStats: { hp: 73, atk: 76, def: 75, spd: 100 }, spa: 100, spd_def: 80, evolves: null },
    raichu: { name: "Raichu", type: "Electric", baseStats: { hp: 60, atk: 90, def: 55, spd: 110 }, spa: 81, spd_def: 100, evolves: null },
    clefairy: { name: "Clefairy", type: "Fairy", baseStats: { hp: 70, atk: 45, def: 48, spd: 35 }, spa: 90, spd_def: 80, evolves: null },
    clefable: { name: "Clefable", type: "Fairy", baseStats: { hp: 95, atk: 70, def: 73, spd: 60 }, spa: 60, spd_def: 65, evolves: null },
    nidoking: { name: "Nidoking", type: "Poison", type2: 'Ground', baseStats: { hp: 81, atk: 102, def: 77, spd: 85 }, spa: 95, spd_def: 90, evolves: null },
    vileplume: { name: "Vileplume", type: "Grass", type2: 'Poison', baseStats: { hp: 75, atk: 80, def: 85, spd: 50 }, spa: 85, spd_def: 75, evolves: null },
    oddish: { name: "Oddish", type: "Grass", type2: 'Poison', baseStats: { hp: 45, atk: 50, def: 55, spd: 30 }, spa: 110, spd_def: 90, evolves: { level: 21, into: "gloom" } },
    gloom: { name: "Gloom", type: "Grass", type2: 'Poison', baseStats: { hp: 60, atk: 65, def: 70, spd: 40 }, spa: 75, spd_def: 65, evolves: null },
    poliwrath: { name: "Poliwrath", type: "Water", type2: 'Fighting', baseStats: { hp: 90, atk: 95, def: 95, spd: 70 }, spa: 85, spd_def: 75, evolves: null },
    starmie: { name: "Starmie", type: "Water", type2: 'Psychic', baseStats: { hp: 60, atk: 75, def: 85, spd: 115 }, spa: 70, spd_def: 90, evolves: null },

    // Water Pokemon (Fishing)
    magikarp: { name: "Magikarp", type: "Water", baseStats: { hp: 20, atk: 10, def: 55, spd: 80 }, spa: 100, spd_def: 85, evolves: { level: 20, into: "gyarados" } },
    gyarados: { name: "Gyarados", type: "Water", type2: 'Flying', baseStats: { hp: 95, atk: 125, def: 79, spd: 81 }, spa: 15, spd_def: 20, evolves: null },
    goldeen: { name: "Goldeen", type: "Water", baseStats: { hp: 45, atk: 67, def: 60, spd: 63 }, spa: 60, spd_def: 100, evolves: { level: 33, into: "seaking" } },
    seaking: { name: "Seaking", type: "Water", baseStats: { hp: 80, atk: 92, def: 65, spd: 68 }, spa: 35, spd_def: 50, evolves: null },
    psyduck: { name: "Psyduck", type: "Water", baseStats: { hp: 50, atk: 52, def: 48, spd: 55 }, spa: 65, spd_def: 80, evolves: { level: 33, into: "golduck" } },
    golduck: { name: "Golduck", type: "Water", baseStats: { hp: 80, atk: 82, def: 78, spd: 85 }, spa: 65, spd_def: 50, evolves: null },
    tentacool: { name: "Tentacool", type: "Water", type2: 'Poison', baseStats: { hp: 40, atk: 40, def: 35, spd: 70 }, spa: 95, spd_def: 80, evolves: { level: 30, into: "tentacruel" } },
    tentacruel: { name: "Tentacruel", type: "Water", type2: 'Poison', baseStats: { hp: 80, atk: 70, def: 65, spd: 100 }, spa: 50, spd_def: 100, evolves: null },
    staryu: { name: "Staryu", type: "Water", baseStats: { hp: 30, atk: 45, def: 55, spd: 85 }, spa: 80, spd_def: 120, evolves: null },
    poliwag: { name: "Poliwag", type: "Water", baseStats: { hp: 40, atk: 50, def: 40, spd: 90 }, spa: 70, spd_def: 55, evolves: { level: 25, into: "poliwhirl" } },
    poliwhirl: { name: "Poliwhirl", type: "Water", baseStats: { hp: 65, atk: 65, def: 65, spd: 90 }, spa: 40, spd_def: 40, evolves: null },

    // Fossils
    omanyte: { name: "Omanyte", type: "Rock", type2: 'Water', baseStats: { hp: 35, atk: 40, def: 100, spd: 35 }, spa: 50, spd_def: 50, evolves: { level: 40, into: "omastar" } },
    omastar: { name: "Omastar", type: "Rock", type2: 'Water', baseStats: { hp: 70, atk: 60, def: 125, spd: 55 }, spa: 90, spd_def: 55, evolves: null },
    kabuto: { name: "Kabuto", type: "Rock", type2: 'Water', baseStats: { hp: 30, atk: 80, def: 90, spd: 55 }, spa: 115, spd_def: 70, evolves: { level: 40, into: "kabutops" } },
    kabutops: { name: "Kabutops", type: "Rock", type2: 'Water', baseStats: { hp: 60, atk: 115, def: 105, spd: 80 }, spa: 55, spd_def: 45, evolves: null },
    aerodactyl: { name: "Aerodactyl", type: "Rock", type2: 'Flying', baseStats: { hp: 80, atk: 105, def: 65, spd: 130 }, spa: 65, spd_def: 70, evolves: null },

    // Gen 2 Wild Pokemon
    sentret: { name: "Sentret", type: "Normal", baseStats: { hp: 35, atk: 46, def: 34, spd: 20 }, spa: 60, spd_def: 75, evolves: { level: 15, into: "furret" } },
    furret: { name: "Furret", type: "Normal", baseStats: { hp: 85, atk: 76, def: 64, spd: 90 }, spa: 35, spd_def: 45, evolves: null },
    hoothoot: { name: "Hoothoot", type: "Flying", type2: 'Flying', baseStats: { hp: 60, atk: 30, def: 30, spd: 50 }, spa: 45, spd_def: 55, evolves: { level: 20, into: "noctowl" } },
    noctowl: { name: "Noctowl", type: "Flying", type2: 'Flying', baseStats: { hp: 100, atk: 50, def: 50, spd: 70 }, spa: 36, spd_def: 56, evolves: null },
    spinarak: { name: "Spinarak", type: "Bug", type2: 'Poison', baseStats: { hp: 40, atk: 60, def: 40, spd: 30 }, spa: 86, spd_def: 96, evolves: { level: 22, into: "ariados" } },
    ariados: { name: "Ariados", type: "Bug", type2: 'Poison', baseStats: { hp: 70, atk: 90, def: 70, spd: 40 }, spa: 40, spd_def: 40, evolves: null },
    mareep: { name: "Mareep", type: "Electric", baseStats: { hp: 55, atk: 40, def: 40, spd: 35 }, spa: 60, spd_def: 70, evolves: { level: 15, into: "flaaffy" } },
    flaaffy: { name: "Flaaffy", type: "Electric", baseStats: { hp: 70, atk: 55, def: 55, spd: 45 }, spa: 65, spd_def: 45, evolves: { level: 30, into: "ampharos" } },
    ampharos: { name: "Ampharos", type: "Electric", baseStats: { hp: 90, atk: 75, def: 85, spd: 55 }, spa: 80, spd_def: 60, evolves: null },
    hoppip: { name: "Hoppip", type: "Grass", type2: 'Flying', baseStats: { hp: 35, atk: 35, def: 40, spd: 50 }, spa: 115, spd_def: 90, evolves: { level: 18, into: "skiploom" } },
    skiploom: { name: "Skiploom", type: "Grass", type2: 'Flying', baseStats: { hp: 55, atk: 45, def: 50, spd: 80 }, spa: 35, spd_def: 55, evolves: null },
    wooper: { name: "Wooper", type: "Water", type2: 'Ground', baseStats: { hp: 55, atk: 45, def: 45, spd: 15 }, spa: 45, spd_def: 65, evolves: { level: 20, into: "quagsire" } },
    quagsire: { name: "Quagsire", type: "Water", type2: 'Ground', baseStats: { hp: 95, atk: 85, def: 85, spd: 35 }, spa: 25, spd_def: 25, evolves: null },
    murkrow: { name: "Murkrow", type: "Dark", type2: 'Flying', baseStats: { hp: 60, atk: 85, def: 42, spd: 91 }, spa: 65, spd_def: 65, evolves: null },
    misdreavus: { name: "Misdreavus", type: "Ghost", baseStats: { hp: 60, atk: 60, def: 60, spd: 85 }, spa: 85, spd_def: 42, evolves: null },
    snubbull: { name: "Snubbull", type: "Fairy", baseStats: { hp: 60, atk: 80, def: 50, spd: 30 }, spa: 85, spd_def: 85, evolves: { level: 23, into: "granbull" } },
    granbull: { name: "Granbull", type: "Fairy", baseStats: { hp: 90, atk: 120, def: 75, spd: 45 }, spa: 40, spd_def: 40, evolves: null },
    teddiursa: { name: "Teddiursa", type: "Normal", baseStats: { hp: 60, atk: 80, def: 50, spd: 40 }, spa: 60, spd_def: 60, evolves: { level: 30, into: "ursaring" } },
    ursaring: { name: "Ursaring", type: "Normal", baseStats: { hp: 90, atk: 130, def: 75, spd: 55 }, spa: 50, spd_def: 50, evolves: null },
    swinub: { name: "Swinub", type: "Ice", type2: 'Ground', baseStats: { hp: 50, atk: 50, def: 40, spd: 50 }, spa: 75, spd_def: 75, evolves: { level: 33, into: "piloswine" } },
    piloswine: { name: "Piloswine", type: "Ice", type2: 'Ground', baseStats: { hp: 100, atk: 100, def: 80, spd: 50 }, spa: 30, spd_def: 30, evolves: null },
    houndour: { name: "Houndour", type: "Dark", type2: 'Fire', baseStats: { hp: 45, atk: 60, def: 30, spd: 65 }, spa: 60, spd_def: 60, evolves: { level: 24, into: "houndoom" } },
    houndoom: { name: "Houndoom", type: "Dark", type2: 'Fire', baseStats: { hp: 75, atk: 90, def: 50, spd: 95 }, spa: 80, spd_def: 50, evolves: null },
    larvitar: { name: "Larvitar", type: "Rock", type2: 'Ground', baseStats: { hp: 50, atk: 64, def: 50, spd: 41 }, spa: 110, spd_def: 80, evolves: { level: 30, into: "pupitar" } },
    pupitar: { name: "Pupitar", type: "Rock", type2: 'Ground', baseStats: { hp: 70, atk: 84, def: 70, spd: 51 }, spa: 45, spd_def: 50, evolves: null },

    // Gen 3 Wild Pokemon
    zigzagoon: { name: "Zigzagoon", type: "Normal", baseStats: { hp: 38, atk: 30, def: 41, spd: 60 }, spa: 65, spd_def: 70, evolves: { level: 20, into: "linoone" } },
    linoone: { name: "Linoone", type: "Normal", baseStats: { hp: 78, atk: 70, def: 61, spd: 100 }, spa: 30, spd_def: 41, evolves: null },
    lotad: { name: "Lotad", type: "Water", type2: 'Grass', baseStats: { hp: 40, atk: 30, def: 30, spd: 30 }, spa: 50, spd_def: 61, evolves: { level: 14, into: "lombre" } },
    lombre: { name: "Lombre", type: "Water", type2: 'Grass', baseStats: { hp: 60, atk: 50, def: 50, spd: 50 }, spa: 40, spd_def: 50, evolves: null },
    seedot: { name: "Seedot", type: "Grass", baseStats: { hp: 40, atk: 40, def: 50, spd: 30 }, spa: 60, spd_def: 70, evolves: { level: 14, into: "nuzleaf" } },
    nuzleaf: { name: "Nuzleaf", type: "Grass", type2: 'Dark', baseStats: { hp: 70, atk: 70, def: 40, spd: 60 }, spa: 30, spd_def: 30, evolves: null },
    ralts: { name: "Ralts", type: "Psychic", type2: 'Fairy', baseStats: { hp: 28, atk: 25, def: 25, spd: 40 }, spa: 60, spd_def: 40, evolves: { level: 20, into: "kirlia" } },
    kirlia: { name: "Kirlia", type: "Psychic", type2: 'Fairy', baseStats: { hp: 38, atk: 35, def: 35, spd: 50 }, spa: 45, spd_def: 35, evolves: { level: 30, into: "gardevoir" } },
    gardevoir: { name: "Gardevoir", type: "Psychic", type2: 'Fairy', baseStats: { hp: 68, atk: 65, def: 65, spd: 80 }, spa: 65, spd_def: 55, evolves: null },
    shroomish: { name: "Shroomish", type: "Grass", baseStats: { hp: 60, atk: 40, def: 60, spd: 35 }, spa: 125, spd_def: 115, evolves: { level: 23, into: "breloom" } },
    breloom: { name: "Breloom", type: "Fighting", type2: 'Fighting', baseStats: { hp: 60, atk: 130, def: 80, spd: 70 }, spa: 40, spd_def: 60, evolves: null },
    aron: { name: "Aron", type: "Rock", type2: 'Rock', baseStats: { hp: 50, atk: 70, def: 100, spd: 30 }, spa: 60, spd_def: 60, evolves: { level: 32, into: "lairon" } },
    lairon: { name: "Lairon", type: "Rock", type2: 'Rock', baseStats: { hp: 60, atk: 90, def: 140, spd: 40 }, spa: 40, spd_def: 40, evolves: null },
    electrike: { name: "Electrike", type: "Electric", baseStats: { hp: 40, atk: 45, def: 40, spd: 65 }, spa: 50, spd_def: 50, evolves: { level: 26, into: "manectric" } },
    manectric: { name: "Manectric", type: "Electric", baseStats: { hp: 70, atk: 75, def: 60, spd: 105 }, spa: 65, spd_def: 40, evolves: null },
    carvanha: { name: "Carvanha", type: "Water", type2: 'Dark', baseStats: { hp: 45, atk: 90, def: 20, spd: 65 }, spa: 105, spd_def: 60, evolves: { level: 30, into: "sharpedo" } },
    sharpedo: { name: "Sharpedo", type: "Water", type2: 'Dark', baseStats: { hp: 70, atk: 120, def: 40, spd: 95 }, spa: 65, spd_def: 20, evolves: null },
    trapinch: { name: "Trapinch", type: "Ground", baseStats: { hp: 45, atk: 100, def: 45, spd: 10 }, spa: 95, spd_def: 40, evolves: { level: 35, into: "vibrava" } },
    vibrava: { name: "Vibrava", type: "Ground", type2: 'Dragon', baseStats: { hp: 50, atk: 70, def: 50, spd: 70 }, spa: 45, spd_def: 45, evolves: null },
    swablu: { name: "Swablu", type: "Flying", type2: 'Flying', baseStats: { hp: 45, atk: 40, def: 60, spd: 50 }, spa: 50, spd_def: 50, evolves: { level: 35, into: "altaria" } },
    altaria: { name: "Altaria", type: "Flying", type2: 'Flying', baseStats: { hp: 75, atk: 70, def: 105, spd: 80 }, spa: 40, spd_def: 75, evolves: null },
    absol: { name: "Absol", type: "Dark", baseStats: { hp: 65, atk: 130, def: 60, spd: 75 }, spa: 70, spd_def: 105, evolves: null },
    snorunt: { name: "Snorunt", type: "Ice", baseStats: { hp: 50, atk: 50, def: 50, spd: 50 }, spa: 75, spd_def: 60, evolves: { level: 42, into: "glalie" } },
    glalie: { name: "Glalie", type: "Ice", baseStats: { hp: 80, atk: 80, def: 80, spd: 80 }, spa: 50, spd_def: 50, evolves: null },
    bagon: { name: "Bagon", type: "Dragon", baseStats: { hp: 45, atk: 75, def: 60, spd: 50 }, spa: 80, spd_def: 80, evolves: { level: 30, into: "shelgon" } },
    shelgon: { name: "Shelgon", type: "Dragon", baseStats: { hp: 65, atk: 95, def: 100, spd: 50 }, spa: 40, spd_def: 30, evolves: null },
    beldum: { name: "Beldum", type: "Psychic", type2: 'Psychic', baseStats: { hp: 40, atk: 55, def: 80, spd: 30 }, spa: 60, spd_def: 50, evolves: { level: 20, into: "metang" } },
    metang: { name: "Metang", type: "Psychic", type2: 'Psychic', baseStats: { hp: 60, atk: 75, def: 100, spd: 50 }, spa: 35, spd_def: 60, evolves: null },

    // Legendaries
    articuno: { name: "Articuno", type: "Ice", type2: 'Flying', baseStats: { hp: 90, atk: 85, def: 100, spd: 85 }, spa: 55, spd_def: 80, evolves: null },
    zapdos: { name: "Zapdos", type: "Electric", type2: 'Flying', baseStats: { hp: 90, atk: 90, def: 85, spd: 100 }, spa: 95, spd_def: 125, evolves: null },
    moltres: { name: "Moltres", type: "Fire", type2: 'Flying', baseStats: { hp: 90, atk: 100, def: 90, spd: 90 }, spa: 125, spd_def: 90, evolves: null },
    mewtwo: { name: "Mewtwo", type: "Psychic", baseStats: { hp: 106, atk: 110, def: 90, spd: 130 }, spa: 125, spd_def: 85, evolves: null },

    // Gen 1-3 Expansion Pokemon
    aggron: { name: "Aggron", type: "Steel", type2: \'Rock\', baseStats: { hp: 70, atk: 110, def: 180, spd: 50 }, spa: 60, spd_def: 60, type2: 'Rock' },
    aipom: { name: "Aipom", type: "Normal", baseStats: { hp: 55, atk: 70, def: 55, spd: 85 }, spa: 40, spd_def: 55 },
    alakazam: { name: "Alakazam", type: "Psychic", baseStats: { hp: 55, atk: 50, def: 45, spd: 120 }, spa: 135, spd_def: 95 },
    anorith: { name: "Anorith", type: "Rock", type2: \'Bug\', baseStats: { hp: 45, atk: 95, def: 50, spd: 75 }, spa: 40, spd_def: 50, type2: 'Bug' },
    arbok: { name: "Arbok", type: "Poison", baseStats: { hp: 60, atk: 95, def: 69, spd: 80 }, spa: 65, spd_def: 79 },
    armaldo: { name: "Armaldo", type: "Rock", type2: \'Bug\', baseStats: { hp: 75, atk: 125, def: 100, spd: 45 }, spa: 70, spd_def: 80, type2: 'Bug' },
    azumarill: { name: "Azumarill", type: "Water", type2: \'Fairy\', baseStats: { hp: 100, atk: 50, def: 80, spd: 50 }, spa: 60, spd_def: 80, type2: 'Fairy' },
    azurill: { name: "Azurill", type: "Normal", type2: \'Fairy\', baseStats: { hp: 50, atk: 20, def: 40, spd: 20 }, spa: 20, spd_def: 40, type2: 'Fairy' },
    baltoy: { name: "Baltoy", type: "Ground", type2: \'Psychic\', baseStats: { hp: 40, atk: 40, def: 55, spd: 55 }, spa: 40, spd_def: 70, type2: 'Psychic' },
    banette: { name: "Banette", type: "Ghost", baseStats: { hp: 64, atk: 115, def: 65, spd: 65 }, spa: 83, spd_def: 63 },
    barboach: { name: "Barboach", type: "Water", type2: \'Ground\', baseStats: { hp: 50, atk: 48, def: 43, spd: 60 }, spa: 46, spd_def: 41, type2: 'Ground' },
    beautifly: { name: "Beautifly", type: "Bug", type2: \'Flying\', baseStats: { hp: 60, atk: 70, def: 50, spd: 65 }, spa: 100, spd_def: 50, type2: 'Flying' },
    bellossom: { name: "Bellossom", type: "Grass", baseStats: { hp: 75, atk: 80, def: 95, spd: 50 }, spa: 90, spd_def: 100 },
    bellsprout: { name: "Bellsprout", type: "Grass", type2: \'Poison\', baseStats: { hp: 50, atk: 75, def: 35, spd: 40 }, spa: 70, spd_def: 30, type2: 'Poison' },
    blaziken: { name: "Blaziken", type: "Fire", type2: \'Fighting\', baseStats: { hp: 80, atk: 120, def: 70, spd: 80 }, spa: 110, spd_def: 70, type2: 'Fighting' },
    blissey: { name: "Blissey", type: "Normal", baseStats: { hp: 255, atk: 10, def: 10, spd: 55 }, spa: 75, spd_def: 135 },
    cacnea: { name: "Cacnea", type: "Grass", baseStats: { hp: 50, atk: 85, def: 40, spd: 35 }, spa: 85, spd_def: 40 },
    cacturne: { name: "Cacturne", type: "Grass", type2: \'Dark\', baseStats: { hp: 70, atk: 115, def: 60, spd: 55 }, spa: 115, spd_def: 60, type2: 'Dark' },
    camerupt: { name: "Camerupt", type: "Fire", type2: \'Ground\', baseStats: { hp: 70, atk: 100, def: 70, spd: 40 }, spa: 105, spd_def: 75, type2: 'Ground' },
    cascoon: { name: "Cascoon", type: "Bug", baseStats: { hp: 50, atk: 35, def: 55, spd: 15 }, spa: 25, spd_def: 25, evolves: { level: 7, into: 'dustox' } },
    castform: { name: "Castform", type: "Normal", baseStats: { hp: 70, atk: 70, def: 70, spd: 70 }, spa: 70, spd_def: 70 },
    celebi: { name: "Celebi", type: "Psychic", type2: \'Grass\', baseStats: { hp: 100, atk: 100, def: 100, spd: 100 }, spa: 100, spd_def: 100, type2: 'Grass' },
    chansey: { name: "Chansey", type: "Normal", baseStats: { hp: 250, atk: 5, def: 5, spd: 50 }, spa: 35, spd_def: 105 },
    chimecho: { name: "Chimecho", type: "Psychic", baseStats: { hp: 75, atk: 50, def: 80, spd: 65 }, spa: 95, spd_def: 90 },
    chinchou: { name: "Chinchou", type: "Water", type2: \'Electric\', baseStats: { hp: 75, atk: 38, def: 38, spd: 67 }, spa: 56, spd_def: 56, type2: 'Electric' },
    clamperl: { name: "Clamperl", type: "Water", baseStats: { hp: 35, atk: 64, def: 85, spd: 32 }, spa: 74, spd_def: 55 },
    claydol: { name: "Claydol", type: "Ground", type2: \'Psychic\', baseStats: { hp: 60, atk: 70, def: 105, spd: 75 }, spa: 70, spd_def: 120, type2: 'Psychic' },
    cleffa: { name: "Cleffa", type: "Fairy", baseStats: { hp: 50, atk: 25, def: 28, spd: 15 }, spa: 45, spd_def: 55 },
    cloyster: { name: "Cloyster", type: "Water", type2: \'Ice\', baseStats: { hp: 50, atk: 95, def: 180, spd: 70 }, spa: 85, spd_def: 45, type2: 'Ice' },
    combusken: { name: "Combusken", type: "Fire", type2: \'Fighting\', baseStats: { hp: 60, atk: 85, def: 60, spd: 55 }, spa: 85, spd_def: 60, type2: 'Fighting', evolves: { level: 16, into: 'blaziken' } },
    corphish: { name: "Corphish", type: "Water", baseStats: { hp: 43, atk: 80, def: 65, spd: 35 }, spa: 50, spd_def: 35 },
    corsola: { name: "Corsola", type: "Water", type2: \'Rock\', baseStats: { hp: 65, atk: 55, def: 95, spd: 35 }, spa: 65, spd_def: 95, type2: 'Rock' },
    cradily: { name: "Cradily", type: "Rock", type2: \'Grass\', baseStats: { hp: 86, atk: 81, def: 97, spd: 43 }, spa: 81, spd_def: 107, type2: 'Grass' },
    crawdaunt: { name: "Crawdaunt", type: "Water", type2: \'Dark\', baseStats: { hp: 63, atk: 120, def: 85, spd: 55 }, spa: 90, spd_def: 55, type2: 'Dark' },
    crobat: { name: "Crobat", type: "Poison", type2: \'Flying\', baseStats: { hp: 85, atk: 90, def: 80, spd: 130 }, spa: 70, spd_def: 80, type2: 'Flying' },
    cubone: { name: "Cubone", type: "Ground", baseStats: { hp: 50, atk: 50, def: 95, spd: 35 }, spa: 40, spd_def: 50 },
    delcatty: { name: "Delcatty", type: "Normal", baseStats: { hp: 70, atk: 65, def: 65, spd: 90 }, spa: 55, spd_def: 55 },
    delibird: { name: "Delibird", type: "Ice", type2: \'Flying\', baseStats: { hp: 45, atk: 55, def: 45, spd: 75 }, spa: 65, spd_def: 45, type2: 'Flying' },
    deoxys: { name: "Deoxys", type: "Psychic", baseStats: { hp: 50, atk: 150, def: 50, spd: 150 }, spa: 150, spd_def: 50 },
    dewgong: { name: "Dewgong", type: "Water", type2: \'Ice\', baseStats: { hp: 90, atk: 70, def: 80, spd: 70 }, spa: 70, spd_def: 95, type2: 'Ice' },
    diglett: { name: "Diglett", type: "Ground", baseStats: { hp: 10, atk: 55, def: 25, spd: 95 }, spa: 35, spd_def: 45 },
    ditto: { name: "Ditto", type: "Normal", baseStats: { hp: 48, atk: 48, def: 48, spd: 48 }, spa: 48, spd_def: 48 },
    dodrio: { name: "Dodrio", type: "Normal", type2: \'Flying\', baseStats: { hp: 60, atk: 110, def: 70, spd: 110 }, spa: 60, spd_def: 60, type2: 'Flying' },
    doduo: { name: "Doduo", type: "Normal", type2: \'Flying\', baseStats: { hp: 35, atk: 85, def: 45, spd: 75 }, spa: 35, spd_def: 35, type2: 'Flying' },
    donphan: { name: "Donphan", type: "Ground", baseStats: { hp: 90, atk: 120, def: 120, spd: 50 }, spa: 60, spd_def: 60 },
    dragonair: { name: "Dragonair", type: "Dragon", baseStats: { hp: 61, atk: 84, def: 65, spd: 70 }, spa: 70, spd_def: 70, evolves: { level: 30, into: 'dragonite' } },
    dragonite: { name: "Dragonite", type: "Dragon", type2: \'Flying\', baseStats: { hp: 91, atk: 134, def: 95, spd: 80 }, spa: 100, spd_def: 100, type2: 'Flying' },
    dratini: { name: "Dratini", type: "Dragon", baseStats: { hp: 41, atk: 64, def: 45, spd: 50 }, spa: 50, spd_def: 50 },
    drowzee: { name: "Drowzee", type: "Psychic", baseStats: { hp: 60, atk: 48, def: 45, spd: 42 }, spa: 43, spd_def: 90 },
    dugtrio: { name: "Dugtrio", type: "Ground", baseStats: { hp: 35, atk: 100, def: 50, spd: 120 }, spa: 50, spd_def: 70 },
    dunsparce: { name: "Dunsparce", type: "Normal", baseStats: { hp: 100, atk: 70, def: 70, spd: 45 }, spa: 65, spd_def: 65 },
    dusclops: { name: "Dusclops", type: "Ghost", baseStats: { hp: 40, atk: 70, def: 130, spd: 25 }, spa: 60, spd_def: 130, evolves: { level: 37, into: 'dusknoir' } },
    duskull: { name: "Duskull", type: "Ghost", baseStats: { hp: 20, atk: 40, def: 90, spd: 25 }, spa: 30, spd_def: 90 },
    dustox: { name: "Dustox", type: "Bug", type2: \'Poison\', baseStats: { hp: 60, atk: 50, def: 70, spd: 65 }, spa: 50, spd_def: 90, type2: 'Poison' },
    ekans: { name: "Ekans", type: "Poison", baseStats: { hp: 35, atk: 60, def: 44, spd: 55 }, spa: 40, spd_def: 54 },
    electabuzz: { name: "Electabuzz", type: "Electric", baseStats: { hp: 65, atk: 83, def: 57, spd: 105 }, spa: 95, spd_def: 85, evolves: { level: 30, into: 'electivire' } },
    electrode: { name: "Electrode", type: "Electric", baseStats: { hp: 60, atk: 50, def: 70, spd: 150 }, spa: 80, spd_def: 80 },
    elekid: { name: "Elekid", type: "Electric", baseStats: { hp: 45, atk: 63, def: 37, spd: 95 }, spa: 65, spd_def: 55 },
    entei: { name: "Entei", type: "Fire", baseStats: { hp: 115, atk: 115, def: 85, spd: 100 }, spa: 90, spd_def: 75 },
    espeon: { name: "Espeon", type: "Psychic", baseStats: { hp: 65, atk: 65, def: 60, spd: 110 }, spa: 130, spd_def: 95 },
    exeggcute: { name: "Exeggcute", type: "Grass", type2: \'Psychic\', baseStats: { hp: 60, atk: 40, def: 80, spd: 40 }, spa: 60, spd_def: 45, type2: 'Psychic' },
    exeggutor: { name: "Exeggutor", type: "Grass", type2: \'Psychic\', baseStats: { hp: 95, atk: 95, def: 85, spd: 55 }, spa: 125, spd_def: 75, type2: 'Psychic' },
    exploud: { name: "Exploud", type: "Normal", baseStats: { hp: 104, atk: 91, def: 63, spd: 68 }, spa: 91, spd_def: 73 },
    farfetchd: { name: "farfetch’d", type: "Normal", type2: \'Flying\', baseStats: { hp: 52, atk: 90, def: 55, spd: 60 }, spa: 58, spd_def: 62, type2: 'Flying' },
    fearow: { name: "Fearow", type: "Normal", type2: \'Flying\', baseStats: { hp: 65, atk: 90, def: 65, spd: 100 }, spa: 61, spd_def: 61, type2: 'Flying' },
    feebas: { name: "Feebas", type: "Water", baseStats: { hp: 20, atk: 15, def: 20, spd: 80 }, spa: 10, spd_def: 55 },
    flygon: { name: "Flygon", type: "Ground", type2: \'Dragon\', baseStats: { hp: 80, atk: 100, def: 80, spd: 100 }, spa: 80, spd_def: 80, type2: 'Dragon' },
    forretress: { name: "Forretress", type: "Bug", type2: \'Steel\', baseStats: { hp: 75, atk: 90, def: 140, spd: 40 }, spa: 60, spd_def: 60, type2: 'Steel' },
    gengar: { name: "Gengar", type: "Ghost", type2: \'Poison\', baseStats: { hp: 60, atk: 65, def: 60, spd: 110 }, spa: 130, spd_def: 75, type2: 'Poison' },
    girafarig: { name: "Girafarig", type: "Normal", type2: \'Psychic\', baseStats: { hp: 70, atk: 80, def: 65, spd: 85 }, spa: 90, spd_def: 65, type2: 'Psychic' },
    gligar: { name: "Gligar", type: "Ground", type2: \'Flying\', baseStats: { hp: 65, atk: 75, def: 105, spd: 85 }, spa: 35, spd_def: 65, type2: 'Flying' },
    golbat: { name: "Golbat", type: "Poison", type2: \'Flying\', baseStats: { hp: 75, atk: 80, def: 70, spd: 90 }, spa: 65, spd_def: 75, type2: 'Flying', evolves: { level: 22, into: 'crobat' } },
    golem: { name: "Golem", type: "Rock", type2: \'Ground\', baseStats: { hp: 80, atk: 120, def: 130, spd: 45 }, spa: 55, spd_def: 65, type2: 'Ground' },
    gorebyss: { name: "Gorebyss", type: "Water", baseStats: { hp: 55, atk: 84, def: 105, spd: 52 }, spa: 114, spd_def: 75 },
    grimer: { name: "Grimer", type: "Poison", baseStats: { hp: 80, atk: 80, def: 50, spd: 25 }, spa: 40, spd_def: 50 },
    groudon: { name: "Groudon", type: "Ground", baseStats: { hp: 100, atk: 150, def: 140, spd: 90 }, spa: 100, spd_def: 90 },
    grovyle: { name: "Grovyle", type: "Grass", baseStats: { hp: 50, atk: 65, def: 45, spd: 95 }, spa: 85, spd_def: 65, evolves: { level: 16, into: 'sceptile' } },
    grumpig: { name: "Grumpig", type: "Psychic", baseStats: { hp: 80, atk: 45, def: 65, spd: 80 }, spa: 90, spd_def: 110 },
    gulpin: { name: "Gulpin", type: "Poison", baseStats: { hp: 70, atk: 43, def: 53, spd: 40 }, spa: 43, spd_def: 53 },
    hariyama: { name: "Hariyama", type: "Fighting", baseStats: { hp: 144, atk: 120, def: 60, spd: 50 }, spa: 40, spd_def: 60 },
    heracross: { name: "Heracross", type: "Bug", type2: \'Fighting\', baseStats: { hp: 80, atk: 125, def: 75, spd: 85 }, spa: 40, spd_def: 95, type2: 'Fighting' },
    hitmonchan: { name: "Hitmonchan", type: "Fighting", baseStats: { hp: 50, atk: 105, def: 79, spd: 76 }, spa: 35, spd_def: 110 },
    hitmonlee: { name: "Hitmonlee", type: "Fighting", baseStats: { hp: 50, atk: 120, def: 53, spd: 87 }, spa: 35, spd_def: 110 },
    hitmontop: { name: "Hitmontop", type: "Fighting", baseStats: { hp: 50, atk: 95, def: 95, spd: 70 }, spa: 35, spd_def: 110 },
    hooh: { name: "Ho-Oh", type: "Fire", type2: \'Flying\', baseStats: { hp: 106, atk: 130, def: 90, spd: 90 }, spa: 110, spd_def: 154, type2: 'Flying' },
    horsea: { name: "Horsea", type: "Water", baseStats: { hp: 30, atk: 40, def: 70, spd: 60 }, spa: 70, spd_def: 25 },
    huntail: { name: "Huntail", type: "Water", baseStats: { hp: 55, atk: 104, def: 105, spd: 52 }, spa: 94, spd_def: 75 },
    hypno: { name: "Hypno", type: "Psychic", baseStats: { hp: 85, atk: 73, def: 70, spd: 67 }, spa: 73, spd_def: 115 },
    igglybuff: { name: "Igglybuff", type: "Normal", type2: \'Fairy\', baseStats: { hp: 90, atk: 30, def: 15, spd: 15 }, spa: 40, spd_def: 20, type2: 'Fairy' },
    illumise: { name: "Illumise", type: "Bug", baseStats: { hp: 65, atk: 47, def: 75, spd: 85 }, spa: 73, spd_def: 85 },
    jigglypuff: { name: "Jigglypuff", type: "Normal", type2: \'Fairy\', baseStats: { hp: 115, atk: 45, def: 20, spd: 20 }, spa: 45, spd_def: 25, type2: 'Fairy' },
    jirachi: { name: "Jirachi", type: "Steel", type2: \'Psychic\', baseStats: { hp: 100, atk: 100, def: 100, spd: 100 }, spa: 100, spd_def: 100, type2: 'Psychic' },
    jumpluff: { name: "Jumpluff", type: "Grass", type2: \'Flying\', baseStats: { hp: 75, atk: 55, def: 70, spd: 110 }, spa: 55, spd_def: 95, type2: 'Flying' },
    jynx: { name: "Jynx", type: "Ice", type2: \'Psychic\', baseStats: { hp: 65, atk: 50, def: 35, spd: 95 }, spa: 115, spd_def: 95, type2: 'Psychic' },
    kangaskhan: { name: "Kangaskhan", type: "Normal", baseStats: { hp: 105, atk: 95, def: 80, spd: 90 }, spa: 40, spd_def: 80 },
    kecleon: { name: "Kecleon", type: "Normal", baseStats: { hp: 60, atk: 90, def: 70, spd: 40 }, spa: 60, spd_def: 120 },
    kingdra: { name: "Kingdra", type: "Water", type2: \'Dragon\', baseStats: { hp: 75, atk: 95, def: 95, spd: 85 }, spa: 95, spd_def: 95, type2: 'Dragon' },
    kingler: { name: "Kingler", type: "Water", baseStats: { hp: 55, atk: 130, def: 115, spd: 75 }, spa: 50, spd_def: 50 },
    koffing: { name: "Koffing", type: "Poison", baseStats: { hp: 40, atk: 65, def: 95, spd: 35 }, spa: 60, spd_def: 45 },
    krabby: { name: "Krabby", type: "Water", baseStats: { hp: 30, atk: 105, def: 90, spd: 50 }, spa: 25, spd_def: 25 },
    kyogre: { name: "Kyogre", type: "Water", baseStats: { hp: 100, atk: 100, def: 90, spd: 90 }, spa: 150, spd_def: 140 },
    lanturn: { name: "Lanturn", type: "Water", type2: \'Electric\', baseStats: { hp: 125, atk: 58, def: 58, spd: 67 }, spa: 76, spd_def: 76, type2: 'Electric' },
    lapras: { name: "Lapras", type: "Water", type2: \'Ice\', baseStats: { hp: 130, atk: 85, def: 80, spd: 60 }, spa: 85, spd_def: 95, type2: 'Ice' },
    latias: { name: "Latias", type: "Dragon", type2: \'Psychic\', baseStats: { hp: 80, atk: 80, def: 90, spd: 110 }, spa: 110, spd_def: 130, type2: 'Psychic' },
    latios: { name: "Latios", type: "Dragon", type2: \'Psychic\', baseStats: { hp: 80, atk: 90, def: 80, spd: 110 }, spa: 130, spd_def: 110, type2: 'Psychic' },
    ledian: { name: "Ledian", type: "Bug", type2: \'Flying\', baseStats: { hp: 55, atk: 35, def: 50, spd: 85 }, spa: 55, spd_def: 110, type2: 'Flying' },
    ledyba: { name: "Ledyba", type: "Bug", type2: \'Flying\', baseStats: { hp: 40, atk: 20, def: 30, spd: 55 }, spa: 40, spd_def: 80, type2: 'Flying' },
    lickitung: { name: "Lickitung", type: "Normal", baseStats: { hp: 90, atk: 55, def: 75, spd: 30 }, spa: 60, spd_def: 75 },
    lileep: { name: "Lileep", type: "Rock", type2: \'Grass\', baseStats: { hp: 66, atk: 41, def: 77, spd: 23 }, spa: 61, spd_def: 87, type2: 'Grass' },
    loudred: { name: "Loudred", type: "Normal", baseStats: { hp: 84, atk: 71, def: 43, spd: 48 }, spa: 71, spd_def: 43, evolves: { level: 20, into: 'exploud' } },
    ludicolo: { name: "Ludicolo", type: "Water", type2: \'Grass\', baseStats: { hp: 80, atk: 70, def: 70, spd: 70 }, spa: 90, spd_def: 100, type2: 'Grass' },
    lugia: { name: "Lugia", type: "Psychic", type2: \'Flying\', baseStats: { hp: 106, atk: 90, def: 130, spd: 110 }, spa: 90, spd_def: 154, type2: 'Flying' },
    lunatone: { name: "Lunatone", type: "Rock", type2: \'Psychic\', baseStats: { hp: 90, atk: 55, def: 65, spd: 70 }, spa: 95, spd_def: 85, type2: 'Psychic' },
    luvdisc: { name: "Luvdisc", type: "Water", baseStats: { hp: 43, atk: 30, def: 55, spd: 97 }, spa: 40, spd_def: 65 },
    machamp: { name: "Machamp", type: "Fighting", baseStats: { hp: 90, atk: 130, def: 80, spd: 55 }, spa: 65, spd_def: 85 },
    magby: { name: "Magby", type: "Fire", baseStats: { hp: 45, atk: 75, def: 37, spd: 83 }, spa: 70, spd_def: 55 },
    magcargo: { name: "Magcargo", type: "Fire", type2: \'Rock\', baseStats: { hp: 60, atk: 50, def: 120, spd: 30 }, spa: 90, spd_def: 80, type2: 'Rock' },
    magmar: { name: "Magmar", type: "Fire", baseStats: { hp: 65, atk: 95, def: 57, spd: 93 }, spa: 100, spd_def: 85, evolves: { level: 30, into: 'magmortar' } },
    magnemite: { name: "Magnemite", type: "Electric", type2: \'Steel\', baseStats: { hp: 25, atk: 35, def: 70, spd: 45 }, spa: 95, spd_def: 55, type2: 'Steel' },
    magneton: { name: "Magneton", type: "Electric", type2: \'Steel\', baseStats: { hp: 50, atk: 60, def: 95, spd: 70 }, spa: 120, spd_def: 70, type2: 'Steel', evolves: { level: 30, into: 'magnezone' } },
    makuhita: { name: "Makuhita", type: "Fighting", baseStats: { hp: 72, atk: 60, def: 30, spd: 25 }, spa: 20, spd_def: 30 },
    mankey: { name: "Mankey", type: "Fighting", baseStats: { hp: 40, atk: 80, def: 35, spd: 70 }, spa: 35, spd_def: 45 },
    mantine: { name: "Mantine", type: "Water", type2: \'Flying\', baseStats: { hp: 85, atk: 40, def: 70, spd: 70 }, spa: 80, spd_def: 140, type2: 'Flying' },
    marill: { name: "Marill", type: "Water", type2: \'Fairy\', baseStats: { hp: 70, atk: 20, def: 50, spd: 40 }, spa: 20, spd_def: 50, type2: 'Fairy' },
    marowak: { name: "Marowak", type: "Ground", baseStats: { hp: 60, atk: 80, def: 110, spd: 45 }, spa: 50, spd_def: 80 },
    marshtomp: { name: "Marshtomp", type: "Water", type2: \'Ground\', baseStats: { hp: 70, atk: 85, def: 70, spd: 50 }, spa: 60, spd_def: 70, type2: 'Ground', evolves: { level: 16, into: 'swampert' } },
    masquerain: { name: "Masquerain", type: "Bug", type2: \'Flying\', baseStats: { hp: 70, atk: 60, def: 62, spd: 80 }, spa: 100, spd_def: 82, type2: 'Flying' },
    mawile: { name: "Mawile", type: "Steel", type2: \'Fairy\', baseStats: { hp: 50, atk: 85, def: 85, spd: 50 }, spa: 55, spd_def: 55, type2: 'Fairy' },
    medicham: { name: "Medicham", type: "Fighting", type2: \'Psychic\', baseStats: { hp: 60, atk: 60, def: 75, spd: 80 }, spa: 60, spd_def: 75, type2: 'Psychic' },
    meditite: { name: "Meditite", type: "Fighting", type2: \'Psychic\', baseStats: { hp: 30, atk: 40, def: 55, spd: 60 }, spa: 40, spd_def: 55, type2: 'Psychic' },
    meowth: { name: "Meowth", type: "Normal", baseStats: { hp: 40, atk: 45, def: 35, spd: 90 }, spa: 40, spd_def: 40 },
    metagross: { name: "Metagross", type: "Steel", type2: \'Psychic\', baseStats: { hp: 80, atk: 135, def: 130, spd: 70 }, spa: 95, spd_def: 90, type2: 'Psychic' },
    mew: { name: "Mew", type: "Psychic", baseStats: { hp: 100, atk: 100, def: 100, spd: 100 }, spa: 100, spd_def: 100 },
    mightyena: { name: "Mightyena", type: "Dark", baseStats: { hp: 70, atk: 90, def: 70, spd: 70 }, spa: 60, spd_def: 60 },
    milotic: { name: "Milotic", type: "Water", baseStats: { hp: 95, atk: 60, def: 79, spd: 81 }, spa: 100, spd_def: 125 },
    miltank: { name: "Miltank", type: "Normal", baseStats: { hp: 95, atk: 80, def: 105, spd: 100 }, spa: 40, spd_def: 70 },
    minun: { name: "Minun", type: "Electric", baseStats: { hp: 60, atk: 40, def: 50, spd: 95 }, spa: 75, spd_def: 85 },
    mrmime: { name: "mr. mime", type: "Psychic", type2: \'Fairy\', baseStats: { hp: 40, atk: 45, def: 65, spd: 90 }, spa: 100, spd_def: 120, type2: 'Fairy' },
    mudkip: { name: "Mudkip", type: "Water", baseStats: { hp: 50, atk: 70, def: 50, spd: 40 }, spa: 50, spd_def: 50 },
    muk: { name: "Muk", type: "Poison", baseStats: { hp: 105, atk: 105, def: 75, spd: 50 }, spa: 65, spd_def: 100 },
    natu: { name: "Natu", type: "Psychic", type2: \'Flying\', baseStats: { hp: 40, atk: 50, def: 45, spd: 70 }, spa: 70, spd_def: 45, type2: 'Flying' },
    nidoqueen: { name: "Nidoqueen", type: "Poison", type2: \'Ground\', baseStats: { hp: 90, atk: 92, def: 87, spd: 76 }, spa: 75, spd_def: 85, type2: 'Ground' },
    nidoranf: { name: "Nidoran-F", type: "Poison", baseStats: { hp: 55, atk: 47, def: 52, spd: 41 }, spa: 40, spd_def: 40 },
    nidoranm: { name: "Nidoran-M", type: "Poison", baseStats: { hp: 46, atk: 57, def: 40, spd: 50 }, spa: 40, spd_def: 40 },
    nidorina: { name: "Nidorina", type: "Poison", baseStats: { hp: 70, atk: 62, def: 67, spd: 56 }, spa: 55, spd_def: 55, evolves: { level: 16, into: 'nidoqueen' } },
    nincada: { name: "Nincada", type: "Bug", type2: \'Ground\', baseStats: { hp: 31, atk: 45, def: 90, spd: 40 }, spa: 30, spd_def: 30, type2: 'Ground' },
    ninjask: { name: "Ninjask", type: "Bug", type2: \'Flying\', baseStats: { hp: 61, atk: 90, def: 45, spd: 160 }, spa: 50, spd_def: 50, type2: 'Flying' },
    nosepass: { name: "Nosepass", type: "Rock", baseStats: { hp: 30, atk: 45, def: 135, spd: 30 }, spa: 45, spd_def: 90 },
    numel: { name: "Numel", type: "Fire", type2: \'Ground\', baseStats: { hp: 60, atk: 60, def: 40, spd: 35 }, spa: 65, spd_def: 45, type2: 'Ground' },
    octillery: { name: "Octillery", type: "Water", baseStats: { hp: 75, atk: 105, def: 75, spd: 45 }, spa: 105, spd_def: 75 },
    onix: { name: "Onix", type: "Rock", type2: \'Ground\', baseStats: { hp: 35, atk: 45, def: 160, spd: 70 }, spa: 30, spd_def: 45, type2: 'Ground' },
    paras: { name: "Paras", type: "Bug", type2: \'Grass\', baseStats: { hp: 35, atk: 70, def: 55, spd: 25 }, spa: 45, spd_def: 55, type2: 'Grass' },
    parasect: { name: "Parasect", type: "Bug", type2: \'Grass\', baseStats: { hp: 60, atk: 95, def: 80, spd: 30 }, spa: 60, spd_def: 80, type2: 'Grass' },
    pelipper: { name: "Pelipper", type: "Water", type2: \'Flying\', baseStats: { hp: 60, atk: 50, def: 100, spd: 65 }, spa: 95, spd_def: 70, type2: 'Flying' },
    persian: { name: "Persian", type: "Normal", baseStats: { hp: 65, atk: 70, def: 60, spd: 115 }, spa: 65, spd_def: 65 },
    phanpy: { name: "Phanpy", type: "Ground", baseStats: { hp: 90, atk: 60, def: 60, spd: 40 }, spa: 40, spd_def: 40 },
    pichu: { name: "Pichu", type: "Electric", baseStats: { hp: 20, atk: 40, def: 15, spd: 60 }, spa: 35, spd_def: 35 },
    pineco: { name: "Pineco", type: "Bug", baseStats: { hp: 50, atk: 65, def: 90, spd: 15 }, spa: 35, spd_def: 35 },
    pinsir: { name: "Pinsir", type: "Bug", baseStats: { hp: 65, atk: 125, def: 100, spd: 85 }, spa: 55, spd_def: 70 },
    plusle: { name: "Plusle", type: "Electric", baseStats: { hp: 60, atk: 50, def: 40, spd: 95 }, spa: 85, spd_def: 75 },
    politoed: { name: "Politoed", type: "Water", baseStats: { hp: 90, atk: 75, def: 75, spd: 70 }, spa: 90, spd_def: 100 },
    ponyta: { name: "Ponyta", type: "Fire", baseStats: { hp: 50, atk: 85, def: 55, spd: 90 }, spa: 65, spd_def: 65 },
    poochyena: { name: "Poochyena", type: "Dark", baseStats: { hp: 35, atk: 55, def: 35, spd: 35 }, spa: 30, spd_def: 30 },
    porygon: { name: "Porygon", type: "Normal", baseStats: { hp: 65, atk: 60, def: 70, spd: 40 }, spa: 85, spd_def: 75 },
    porygon2: { name: "Porygon2", type: "Normal", baseStats: { hp: 85, atk: 80, def: 90, spd: 60 }, spa: 105, spd_def: 95, evolves: { trade: true, into: 'porygon-z' } },
    primeape: { name: "Primeape", type: "Fighting", baseStats: { hp: 65, atk: 105, def: 60, spd: 95 }, spa: 60, spd_def: 70, evolves: { level: 28, into: 'annihilape' } },
    qwilfish: { name: "Qwilfish", type: "Water", type2: \'Poison\', baseStats: { hp: 65, atk: 95, def: 85, spd: 85 }, spa: 55, spd_def: 55, type2: 'Poison' },
    raikou: { name: "Raikou", type: "Electric", baseStats: { hp: 90, atk: 85, def: 75, spd: 115 }, spa: 115, spd_def: 100 },
    rapidash: { name: "Rapidash", type: "Fire", baseStats: { hp: 65, atk: 100, def: 70, spd: 105 }, spa: 80, spd_def: 80 },
    rayquaza: { name: "Rayquaza", type: "Dragon", type2: \'Flying\', baseStats: { hp: 105, atk: 150, def: 90, spd: 95 }, spa: 150, spd_def: 90, type2: 'Flying' },
    regice: { name: "Regice", type: "Ice", baseStats: { hp: 80, atk: 50, def: 100, spd: 50 }, spa: 100, spd_def: 200 },
    regirock: { name: "Regirock", type: "Rock", baseStats: { hp: 80, atk: 100, def: 200, spd: 50 }, spa: 50, spd_def: 100 },
    registeel: { name: "Registeel", type: "Steel", baseStats: { hp: 80, atk: 75, def: 150, spd: 50 }, spa: 75, spd_def: 150 },
    relicanth: { name: "Relicanth", type: "Water", type2: \'Rock\', baseStats: { hp: 100, atk: 90, def: 130, spd: 55 }, spa: 45, spd_def: 65, type2: 'Rock' },
    remoraid: { name: "Remoraid", type: "Water", baseStats: { hp: 35, atk: 65, def: 35, spd: 65 }, spa: 65, spd_def: 35 },
    rhydon: { name: "Rhydon", type: "Ground", type2: \'Rock\', baseStats: { hp: 105, atk: 130, def: 120, spd: 40 }, spa: 45, spd_def: 45, type2: 'Rock', evolves: { level: 42, into: 'rhyperior' } },
    rhyhorn: { name: "Rhyhorn", type: "Ground", type2: \'Rock\', baseStats: { hp: 80, atk: 85, def: 95, spd: 25 }, spa: 30, spd_def: 30, type2: 'Rock' },
    roselia: { name: "Roselia", type: "Grass", type2: \'Poison\', baseStats: { hp: 50, atk: 60, def: 45, spd: 65 }, spa: 100, spd_def: 80, type2: 'Poison' },
    sableye: { name: "Sableye", type: "Dark", type2: \'Ghost\', baseStats: { hp: 50, atk: 75, def: 75, spd: 50 }, spa: 65, spd_def: 65, type2: 'Ghost' },
    salamence: { name: "Salamence", type: "Dragon", type2: \'Flying\', baseStats: { hp: 95, atk: 135, def: 80, spd: 100 }, spa: 110, spd_def: 80, type2: 'Flying' },
    sandshrew: { name: "Sandshrew", type: "Ground", baseStats: { hp: 50, atk: 75, def: 85, spd: 40 }, spa: 20, spd_def: 30 },
    sandslash: { name: "Sandslash", type: "Ground", baseStats: { hp: 75, atk: 100, def: 110, spd: 65 }, spa: 45, spd_def: 55 },
    sceptile: { name: "Sceptile", type: "Grass", baseStats: { hp: 70, atk: 85, def: 65, spd: 120 }, spa: 105, spd_def: 85 },
    scizor: { name: "Scizor", type: "Bug", type2: \'Steel\', baseStats: { hp: 70, atk: 130, def: 100, spd: 65 }, spa: 55, spd_def: 80, type2: 'Steel' },
    scyther: { name: "Scyther", type: "Bug", type2: \'Flying\', baseStats: { hp: 70, atk: 110, def: 80, spd: 105 }, spa: 55, spd_def: 80, type2: 'Flying' },
    seadra: { name: "Seadra", type: "Water", baseStats: { hp: 55, atk: 65, def: 95, spd: 85 }, spa: 95, spd_def: 45, evolves: { level: 32, into: 'kingdra' } },
    sealeo: { name: "Sealeo", type: "Ice", type2: \'Water\', baseStats: { hp: 90, atk: 60, def: 70, spd: 45 }, spa: 75, spd_def: 70, type2: 'Water', evolves: { level: 32, into: 'walrein' } },
    seel: { name: "Seel", type: "Water", baseStats: { hp: 65, atk: 45, def: 55, spd: 45 }, spa: 45, spd_def: 70 },
    seviper: { name: "Seviper", type: "Poison", baseStats: { hp: 73, atk: 100, def: 60, spd: 65 }, spa: 100, spd_def: 60 },
    shedinja: { name: "Shedinja", type: "Bug", type2: \'Ghost\', baseStats: { hp: 1, atk: 90, def: 45, spd: 40 }, spa: 30, spd_def: 30, type2: 'Ghost' },
    shellder: { name: "Shellder", type: "Water", baseStats: { hp: 30, atk: 65, def: 100, spd: 40 }, spa: 45, spd_def: 25 },
    shiftry: { name: "Shiftry", type: "Grass", type2: \'Dark\', baseStats: { hp: 90, atk: 100, def: 60, spd: 80 }, spa: 90, spd_def: 60, type2: 'Dark' },
    shuckle: { name: "Shuckle", type: "Bug", type2: \'Rock\', baseStats: { hp: 20, atk: 10, def: 230, spd: 5 }, spa: 10, spd_def: 230, type2: 'Rock' },
    shuppet: { name: "Shuppet", type: "Ghost", baseStats: { hp: 44, atk: 75, def: 35, spd: 45 }, spa: 63, spd_def: 33 },
    silcoon: { name: "Silcoon", type: "Bug", baseStats: { hp: 50, atk: 35, def: 55, spd: 15 }, spa: 25, spd_def: 25, evolves: { level: 7, into: 'beautifly' } },
    skarmory: { name: "Skarmory", type: "Steel", type2: \'Flying\', baseStats: { hp: 65, atk: 80, def: 140, spd: 70 }, spa: 40, spd_def: 70, type2: 'Flying' },
    skitty: { name: "Skitty", type: "Normal", baseStats: { hp: 50, atk: 45, def: 45, spd: 50 }, spa: 35, spd_def: 35 },
    slaking: { name: "Slaking", type: "Normal", baseStats: { hp: 150, atk: 160, def: 100, spd: 100 }, spa: 95, spd_def: 65 },
    slakoth: { name: "Slakoth", type: "Normal", baseStats: { hp: 60, atk: 60, def: 60, spd: 30 }, spa: 35, spd_def: 35 },
    slowbro: { name: "Slowbro", type: "Water", type2: \'Psychic\', baseStats: { hp: 95, atk: 75, def: 110, spd: 30 }, spa: 100, spd_def: 80, type2: 'Psychic' },
    slowking: { name: "Slowking", type: "Water", type2: \'Psychic\', baseStats: { hp: 95, atk: 75, def: 80, spd: 30 }, spa: 100, spd_def: 110, type2: 'Psychic' },
    slowpoke: { name: "Slowpoke", type: "Water", type2: \'Psychic\', baseStats: { hp: 90, atk: 65, def: 65, spd: 15 }, spa: 40, spd_def: 40, type2: 'Psychic' },
    slugma: { name: "Slugma", type: "Fire", baseStats: { hp: 40, atk: 40, def: 40, spd: 20 }, spa: 70, spd_def: 40 },
    smeargle: { name: "Smeargle", type: "Normal", baseStats: { hp: 55, atk: 20, def: 35, spd: 75 }, spa: 20, spd_def: 45 },
    smoochum: { name: "Smoochum", type: "Ice", type2: \'Psychic\', baseStats: { hp: 45, atk: 30, def: 15, spd: 65 }, spa: 85, spd_def: 65, type2: 'Psychic' },
    sneasel: { name: "Sneasel", type: "Dark", type2: \'Ice\', baseStats: { hp: 55, atk: 95, def: 55, spd: 115 }, spa: 35, spd_def: 75, type2: 'Ice' },
    snorlax: { name: "Snorlax", type: "Normal", baseStats: { hp: 160, atk: 110, def: 65, spd: 30 }, spa: 65, spd_def: 110 },
    solrock: { name: "Solrock", type: "Rock", type2: \'Psychic\', baseStats: { hp: 90, atk: 95, def: 85, spd: 70 }, spa: 55, spd_def: 65, type2: 'Psychic' },
    spearow: { name: "Spearow", type: "Normal", type2: \'Flying\', baseStats: { hp: 40, atk: 60, def: 30, spd: 70 }, spa: 31, spd_def: 31, type2: 'Flying' },
    spheal: { name: "Spheal", type: "Ice", type2: \'Water\', baseStats: { hp: 70, atk: 40, def: 50, spd: 25 }, spa: 55, spd_def: 50, type2: 'Water' },
    spinda: { name: "Spinda", type: "Normal", baseStats: { hp: 60, atk: 60, def: 60, spd: 60 }, spa: 60, spd_def: 60 },
    spoink: { name: "Spoink", type: "Psychic", baseStats: { hp: 60, atk: 25, def: 35, spd: 60 }, spa: 70, spd_def: 80 },
    stantler: { name: "Stantler", type: "Normal", baseStats: { hp: 73, atk: 95, def: 62, spd: 85 }, spa: 85, spd_def: 65 },
    steelix: { name: "Steelix", type: "Steel", type2: \'Ground\', baseStats: { hp: 75, atk: 85, def: 200, spd: 30 }, spa: 55, spd_def: 65, type2: 'Ground' },
    sudowoodo: { name: "Sudowoodo", type: "Rock", baseStats: { hp: 70, atk: 100, def: 115, spd: 30 }, spa: 30, spd_def: 65 },
    suicune: { name: "Suicune", type: "Water", baseStats: { hp: 100, atk: 75, def: 115, spd: 85 }, spa: 90, spd_def: 115 },
    sunflora: { name: "Sunflora", type: "Grass", baseStats: { hp: 75, atk: 75, def: 55, spd: 30 }, spa: 105, spd_def: 85 },
    sunkern: { name: "Sunkern", type: "Grass", baseStats: { hp: 30, atk: 30, def: 30, spd: 30 }, spa: 30, spd_def: 30 },
    surskit: { name: "Surskit", type: "Bug", type2: \'Water\', baseStats: { hp: 40, atk: 30, def: 32, spd: 65 }, spa: 50, spd_def: 52, type2: 'Water' },
    swalot: { name: "Swalot", type: "Poison", baseStats: { hp: 100, atk: 73, def: 83, spd: 55 }, spa: 73, spd_def: 83 },
    swampert: { name: "Swampert", type: "Water", type2: \'Ground\', baseStats: { hp: 100, atk: 110, def: 90, spd: 60 }, spa: 85, spd_def: 90, type2: 'Ground' },
    swellow: { name: "Swellow", type: "Normal", type2: \'Flying\', baseStats: { hp: 60, atk: 85, def: 60, spd: 125 }, spa: 75, spd_def: 50, type2: 'Flying' },
    taillow: { name: "Taillow", type: "Normal", type2: \'Flying\', baseStats: { hp: 40, atk: 55, def: 30, spd: 85 }, spa: 30, spd_def: 30, type2: 'Flying' },
    tangela: { name: "Tangela", type: "Grass", baseStats: { hp: 65, atk: 55, def: 115, spd: 60 }, spa: 100, spd_def: 40 },
    tauros: { name: "Tauros", type: "Normal", baseStats: { hp: 75, atk: 100, def: 95, spd: 110 }, spa: 40, spd_def: 70 },
    togepi: { name: "Togepi", type: "Fairy", baseStats: { hp: 35, atk: 20, def: 65, spd: 20 }, spa: 40, spd_def: 65 },
    togetic: { name: "Togetic", type: "Fairy", type2: \'Flying\', baseStats: { hp: 55, atk: 40, def: 85, spd: 40 }, spa: 80, spd_def: 105, type2: 'Flying' },
    torchic: { name: "Torchic", type: "Fire", baseStats: { hp: 45, atk: 60, def: 40, spd: 45 }, spa: 70, spd_def: 50 },
    torkoal: { name: "Torkoal", type: "Fire", baseStats: { hp: 70, atk: 85, def: 140, spd: 20 }, spa: 85, spd_def: 70 },
    treecko: { name: "Treecko", type: "Grass", baseStats: { hp: 40, atk: 45, def: 35, spd: 70 }, spa: 65, spd_def: 55 },
    tropius: { name: "Tropius", type: "Grass", type2: \'Flying\', baseStats: { hp: 99, atk: 68, def: 83, spd: 51 }, spa: 72, spd_def: 87, type2: 'Flying' },
    tyranitar: { name: "Tyranitar", type: "Rock", type2: \'Dark\', baseStats: { hp: 100, atk: 134, def: 110, spd: 61 }, spa: 95, spd_def: 100, type2: 'Dark' },
    tyrogue: { name: "Tyrogue", type: "Fighting", baseStats: { hp: 35, atk: 35, def: 35, spd: 35 }, spa: 35, spd_def: 35 },
    umbreon: { name: "Umbreon", type: "Dark", baseStats: { hp: 95, atk: 65, def: 110, spd: 65 }, spa: 60, spd_def: 130 },
    unown: { name: "Unown", type: "Psychic", baseStats: { hp: 48, atk: 72, def: 48, spd: 48 }, spa: 72, spd_def: 48 },
    venomoth: { name: "Venomoth", type: "Bug", type2: \'Poison\', baseStats: { hp: 70, atk: 65, def: 60, spd: 90 }, spa: 90, spd_def: 75, type2: 'Poison' },
    venonat: { name: "Venonat", type: "Bug", type2: \'Poison\', baseStats: { hp: 60, atk: 55, def: 50, spd: 45 }, spa: 40, spd_def: 55, type2: 'Poison' },
    victreebel: { name: "Victreebel", type: "Grass", type2: \'Poison\', baseStats: { hp: 80, atk: 105, def: 65, spd: 70 }, spa: 100, spd_def: 70, type2: 'Poison' },
    vigoroth: { name: "Vigoroth", type: "Normal", baseStats: { hp: 80, atk: 80, def: 80, spd: 90 }, spa: 55, spd_def: 55, evolves: { level: 18, into: 'slaking' } },
    volbeat: { name: "Volbeat", type: "Bug", baseStats: { hp: 65, atk: 73, def: 75, spd: 85 }, spa: 47, spd_def: 85 },
    voltorb: { name: "Voltorb", type: "Electric", baseStats: { hp: 40, atk: 30, def: 50, spd: 100 }, spa: 55, spd_def: 55 },
    wailmer: { name: "Wailmer", type: "Water", baseStats: { hp: 130, atk: 70, def: 35, spd: 60 }, spa: 70, spd_def: 35 },
    wailord: { name: "Wailord", type: "Water", baseStats: { hp: 170, atk: 90, def: 45, spd: 60 }, spa: 90, spd_def: 45 },
    walrein: { name: "Walrein", type: "Ice", type2: \'Water\', baseStats: { hp: 110, atk: 80, def: 90, spd: 65 }, spa: 95, spd_def: 90, type2: 'Water' },
    weepinbell: { name: "Weepinbell", type: "Grass", type2: \'Poison\', baseStats: { hp: 65, atk: 90, def: 50, spd: 55 }, spa: 85, spd_def: 45, type2: 'Poison', evolves: { level: 21, into: 'victreebel' } },
    weezing: { name: "Weezing", type: "Poison", baseStats: { hp: 65, atk: 90, def: 120, spd: 60 }, spa: 85, spd_def: 70 },
    whiscash: { name: "Whiscash", type: "Water", type2: \'Ground\', baseStats: { hp: 110, atk: 78, def: 73, spd: 60 }, spa: 76, spd_def: 71, type2: 'Ground' },
    whismur: { name: "Whismur", type: "Normal", baseStats: { hp: 64, atk: 51, def: 23, spd: 28 }, spa: 51, spd_def: 23 },
    wigglytuff: { name: "Wigglytuff", type: "Normal", type2: \'Fairy\', baseStats: { hp: 140, atk: 70, def: 45, spd: 45 }, spa: 85, spd_def: 50, type2: 'Fairy' },
    wingull: { name: "Wingull", type: "Water", type2: \'Flying\', baseStats: { hp: 40, atk: 30, def: 30, spd: 85 }, spa: 55, spd_def: 30, type2: 'Flying' },
    wobbuffet: { name: "Wobbuffet", type: "Psychic", baseStats: { hp: 190, atk: 33, def: 58, spd: 33 }, spa: 33, spd_def: 58 },
    wurmple: { name: "Wurmple", type: "Bug", baseStats: { hp: 45, atk: 45, def: 35, spd: 20 }, spa: 20, spd_def: 30 },
    wynaut: { name: "Wynaut", type: "Psychic", baseStats: { hp: 95, atk: 23, def: 48, spd: 23 }, spa: 23, spd_def: 48 },
    xatu: { name: "Xatu", type: "Psychic", type2: \'Flying\', baseStats: { hp: 65, atk: 75, def: 70, spd: 95 }, spa: 95, spd_def: 70, type2: 'Flying' },
    yanma: { name: "Yanma", type: "Bug", type2: \'Flying\', baseStats: { hp: 65, atk: 65, def: 45, spd: 95 }, spa: 75, spd_def: 45, type2: 'Flying' },
    zangoose: { name: "Zangoose", type: "Normal", baseStats: { hp: 73, atk: 115, def: 60, spd: 90 }, spa: 60, spd_def: 60 },
    zubat: { name: "Zubat", type: "Poison", type2: \'Flying\', baseStats: { hp: 40, atk: 45, def: 35, spd: 55 }, spa: 30, spd_def: 40, type2: 'Flying' },
};

const STARTERS = ['bulbasaur', 'charmander', 'squirtle', 'chikorita', 'cyndaquil', 'totodile', 'pikachu', 'eevee', 'treecko', 'torchic', 'mudkip'];

// Get random starter pool: canonical starters + Stage 1 Pokemon with BST <= 320
function getRandomStarterPool(count = 3) {
    const canonical = ['bulbasaur', 'charmander', 'squirtle', 'chikorita', 'cyndaquil', 'totodile', 'pikachu', 'eevee', 'treecko', 'torchic', 'mudkip'];
    const eligible = [...canonical];
    
    // Build set of all evolution targets (Stage 2+ Pokemon)
    const evolutionTargets = new Set();
    for (const [id, data] of Object.entries(POKEMON_DATA)) {
        if (data.evolves && data.evolves.into) {
            evolutionTargets.add(data.evolves.into);
        }
    }
    
    // Check if Pokemon has at least one level-1 damaging move
    function hasDamagingMoveAtLevel1(pokemonId) {
        const learnset = LEARNSETS[pokemonId];
        if (!learnset) return false;
        
        // Get all level-1 moves
        const level1Moves = learnset.filter(entry => entry.level === 1).map(entry => entry.move);
        if (level1Moves.length === 0) return false;
        
        // Check if any level-1 move has power > 0
        for (const moveId of level1Moves) {
            const move = MOVES[moveId];
            if (move && move.power > 0) {
                return true;
            }
        }
        return false;
    }
    
    // Add Stage 1 Pokemon with BST <= 320
    for (const [id, data] of Object.entries(POKEMON_DATA)) {
        if (!data.baseStats) continue;
        if (canonical.includes(id)) continue;
        
        // Skip if anything evolves into this (it's Stage 2+)
        if (evolutionTargets.has(id)) continue;
        
        // Must have an evolution (Stage 1, not fully evolved)
        if (!data.evolves || !data.evolves.into) continue;
        
        // Must have at least one damaging move at level 1
        if (!hasDamagingMoveAtLevel1(id)) continue;
        
        const bst = data.baseStats.hp + data.baseStats.atk + data.baseStats.def + data.baseStats.spd + (data.spa || 0) + (data.spd_def || 0);
        if (bst <= 320) {
            eligible.push(id);
        }
    }
    
    // Shuffle and pick
    const shuffled = [...eligible].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
}

const LEGENDARY_POKEMON = ['articuno', 'zapdos', 'moltres', 'mewtwo'];

const WILD_POKEMON = {
    common: ['rattata', 'pidgey', 'caterpie', 'weedle', 'oddish', 'sentret', 'hoothoot', 'spinarak', 'hoppip', 'mareep', 'zigzagoon', 'lotad', 'seedot', 'shroomish', 'ledyba', 'venonat', 'paras', 'bellsprout', 'dunsparce'],
    uncommon: ['nidoran_m', 'geodude', 'machop', 'abra', 'gastly', 'growlithe', 'vulpix', 'clefairy', 'wooper', 'snubbull', 'teddiursa', 'swinub', 'houndour', 'murkrow', 'misdreavus', 'electrike', 'aron', 'swablu', 'trapinch', 'phanpy', 'girafarig', 'jigglypuff', 'ekans', 'sandshrew', 'zubat'],
    rare: ['pikachu', 'eevee', 'larvitar', 'ralts', 'bagon', 'beldum', 'absol', 'sneasel', 'miltank', 'chansey', 'heracross', 'doduo', 'ponyta', 'shellder', 'kangaskhan', 'pinsir', 'scyther', 'onix'],
    fishing: ['magikarp', 'goldeen', 'psyduck', 'tentacool', 'staryu', 'poliwag', 'wooper', 'lotad', 'carvanha', 'corphish', 'barboach', 'feebas', 'horsea', 'krabby', 'surskit']
};

// Route environments — shuffled per run, rotate every 2 badges
// Each route biases wild encounters toward its themed species
const ROUTE_ENVIRONMENTS = [
    {
        name: "Viridian Forest", icon: "🌲", desc: "Dense woodland buzzing with life",
        common: ['caterpie', 'weedle', 'oddish', 'hoppip', 'spinarak', 'shroomish', 'ledyba', 'venonat'],
        uncommon: ['pikachu', 'clefairy', 'abra', 'ralts', 'paras', 'bellsprout'],
        rare: ['eevee', 'scyther', 'pinsir'],
        fishing: ['poliwag', 'goldeen', 'magikarp', 'surskit']
    },
    {
        name: "Mt. Moon", icon: "⛰️", desc: "Dark tunnels echo with strange cries",
        common: ['geodude', 'rattata', 'machop', 'swinub', 'aron', 'zubat'],
        uncommon: ['clefairy', 'gastly', 'misdreavus', 'beldum', 'shellder', 'onix'],
        rare: ['larvitar', 'dunsparce'],
        fishing: ['wooper', 'magikarp', 'psyduck', 'barboach']
    },
    {
        name: "Cerulean Coast", icon: "🏖️", desc: "Waves crash against sandy shores",
        common: ['tentacool', 'staryu', 'psyduck', 'wooper', 'poliwag', 'lotad', 'surskit'],
        uncommon: ['growlithe', 'vulpix', 'mareep', 'swablu', 'krabby', 'horsea'],
        rare: ['pikachu', 'shellder', 'corphish'],
        fishing: ['magikarp', 'goldeen', 'tentacool', 'staryu', 'carvanha', 'lotad', 'corphish', 'barboach']
    },
    {
        name: "Lavender Ruins", icon: "👻", desc: "A chill runs down your spine...",
        common: ['gastly', 'murkrow', 'hoothoot', 'rattata', 'spinarak', 'duskull'],
        uncommon: ['misdreavus', 'houndour', 'abra', 'absol', 'girafarig'],
        rare: ['ralts', 'sneasel'],
        fishing: ['magikarp', 'goldeen', 'psyduck']
    },
    {
        name: "Safari Grasslands", icon: "🦒", desc: "Wide open plains teeming with Pokemon",
        common: ['sentret', 'pidgey', 'oddish', 'mareep', 'hoppip', 'zigzagoon', 'doduo', 'phanpy'],
        uncommon: ['nidoran_m', 'teddiursa', 'snubbull', 'wooper', 'swablu', 'girafarig'],
        rare: ['pikachu', 'eevee', 'kangaskhan', 'tauros'],
        fishing: ['poliwag', 'magikarp', 'wooper', 'psyduck']
    },
    {
        name: "Volcanic Path", icon: "🌋", desc: "The ground radiates intense heat",
        common: ['growlithe', 'geodude', 'machop', 'houndour', 'trapinch', 'numel'],
        uncommon: ['vulpix', 'nidoran_m', 'gastly', 'aron', 'slugma'],
        rare: ['larvitar', 'bagon', 'torkoal'],
        fishing: ['magikarp', 'goldeen', 'tentacool']
    },
    {
        name: "Frosty Cavern", icon: "❄️", desc: "Icicles glitter in the dim light",
        common: ['swinub', 'geodude', 'rattata', 'hoothoot', 'snorunt', 'smoochum'],
        uncommon: ['clefairy', 'misdreavus', 'snubbull', 'aron', 'sneasel'],
        rare: ['absol', 'lapras'],
        fishing: ['magikarp', 'psyduck', 'poliwag', 'feebas']
    },
    {
        name: "Power Plant", icon: "⚡", desc: "Sparks fly from rusted machinery",
        common: ['mareep', 'rattata', 'geodude', 'machop', 'electrike', 'magnemite'],
        uncommon: ['pikachu', 'abra', 'gastly', 'beldum', 'voltorb'],
        rare: ['eevee', 'electabuzz', 'magmar'],
        fishing: ['magikarp', 'goldeen', 'tentacool', 'chinchou']
    },
    {
        name: "Dark Forest", icon: "🌑", desc: "Shadows move between ancient trees",
        common: ['murkrow', 'spinarak', 'hoothoot', 'oddish', 'seedot', 'shuppet'],
        uncommon: ['misdreavus', 'houndour', 'gastly', 'teddiursa', 'absol', 'sableye'],
        rare: ['larvitar', 'dunsparce'],
        fishing: ['poliwag', 'wooper', 'magikarp']
    },
    {
        name: "Meadow Fields", icon: "🌻", desc: "Flowers sway in a gentle breeze",
        common: ['oddish', 'hoppip', 'sentret', 'pidgey', 'zigzagoon', 'shroomish', 'marill'],
        uncommon: ['clefairy', 'vulpix', 'mareep', 'snubbull', 'ralts', 'jigglypuff'],
        rare: ['pikachu', 'eevee', 'chansey', 'miltank'],
        fishing: ['goldeen', 'poliwag', 'magikarp', 'marill']
    }
];

// Shuffle and pick route sequence for a run
function shuffleRoutes() {
    const shuffled = [...ROUTE_ENVIRONMENTS].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 5); // 5 routes per run
}

// Master gym leader pool — 8 picked per run, scaled to tier levels
// earlyTeam = used for tiers 1-4 (pre-evos), lateTeam = tiers 5-8 (evolved)
const GYM_LEADER_POOL = [
    // Kanto
    { name: "Brock", type: "Rock", badge: "Boulder Badge", earlyTeam: ['geodude'], lateTeam: ['graveler', 'geodude'], region: "Kanto" },
    { name: "Misty", type: "Water", badge: "Cascade Badge", earlyTeam: ['staryu'], lateTeam: ['starmie', 'staryu'], region: "Kanto" },
    { name: "Lt. Surge", type: "Electric", badge: "Thunder Badge", earlyTeam: ['pikachu'], lateTeam: ['raichu', 'pikachu'], region: "Kanto" },
    { name: "Erika", type: "Grass", badge: "Rainbow Badge", earlyTeam: ['oddish', 'oddish'], lateTeam: ['vileplume', 'gloom'], region: "Kanto" },
    { name: "Koga", type: "Poison", badge: "Soul Badge", earlyTeam: ['nidoran_m'], lateTeam: ['nidoking', 'nidorino'], region: "Kanto" },
    { name: "Sabrina", type: "Psychic", badge: "Marsh Badge", earlyTeam: ['abra', 'ralts'], lateTeam: ['kadabra', 'gardevoir'], region: "Kanto" },
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
    { name: "Roxanne", type: "Rock", badge: "Stone Badge", earlyTeam: ['geodude', 'aron'], lateTeam: ['graveler', 'lairon'], region: "Hoenn" },
    { name: "Brawly", type: "Fighting", badge: "Knuckle Badge", earlyTeam: ['machop', 'shroomish'], lateTeam: ['machoke', 'breloom'], region: "Hoenn" },
    { name: "Wattson", type: "Electric", badge: "Dynamo Badge", earlyTeam: ['electrike'], lateTeam: ['manectric', 'ampharos'], region: "Hoenn" },
    { name: "Flannery", type: "Fire", badge: "Heat Badge", earlyTeam: ['vulpix'], lateTeam: ['ninetales', 'growlithe'], region: "Hoenn" },
    { name: "Norman", type: "Normal", badge: "Balance Badge", earlyTeam: ['rattata', 'clefairy'], lateTeam: ['raticate', 'clefable'], region: "Hoenn" },
    { name: "Winona", type: "Flying", badge: "Feather Badge", earlyTeam: ['swablu', 'pidgey'], lateTeam: ['altaria', 'pidgeot'], region: "Hoenn" },
    { name: "Wallace", type: "Water", badge: "Rain Badge", earlyTeam: ['staryu', 'poliwag'], lateTeam: ['starmie', 'gyarados'], region: "Hoenn" },
    // Sinnoh
    { name: "Roark", type: "Rock", badge: "Coal Badge", earlyTeam: ['geodude'], lateTeam: ['graveler', 'geodude'], region: "Sinnoh" },
    { name: "Gardenia", type: "Grass", badge: "Forest Badge", earlyTeam: ['oddish'], lateTeam: ['vileplume', 'gloom'], region: "Sinnoh" },
    { name: "Maylene", type: "Fighting", badge: "Cobble Badge", earlyTeam: ['machop'], lateTeam: ['machoke', 'machop'], region: "Sinnoh" },
    { name: "Crasher Wake", type: "Water", badge: "Fen Badge", earlyTeam: ['poliwag'], lateTeam: ['poliwrath', 'poliwhirl'], region: "Sinnoh" },
    { name: "Fantina", type: "Ghost", badge: "Relic Badge", earlyTeam: ['gastly'], lateTeam: ['haunter', 'gastly'], region: "Sinnoh" },
    { name: "Volkner", type: "Electric", badge: "Beacon Badge", earlyTeam: ['mareep'], lateTeam: ['ampharos', 'jolteon'], region: "Sinnoh" },
    // Extra leaders for type variety
    { name: "Candice", type: "Ice", badge: "Icicle Badge", earlyTeam: ['swinub', 'snorunt'], lateTeam: ['piloswine', 'glalie'], region: "Sinnoh" },
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
    { name: "Drake", type: "Dragon", pokemon: ['shelgon', 'altaria', 'gyarados'], region: "Hoenn" },
    { name: "Flint", type: "Fire", pokemon: ['arcanine', 'ninetales', 'charizard'], region: "Sinnoh" },
    { name: "Lucian", type: "Psychic", pokemon: ['kadabra', 'starmie', 'kadabra'], region: "Sinnoh" },
];

// Champion pool — 1 picked per run
const CHAMPION_POOL = [
    { name: "Blue", pokemon: ['blastoise', 'arcanine', 'pidgeot', 'machoke', 'kadabra', 'raichu'], region: "Kanto" },
    { name: "Lance", pokemon: ['gyarados', 'aerodactyl', 'charizard', 'nidoking', 'machoke'], region: "Johto" },
    { name: "Steven", pokemon: ['lairon', 'metang', 'aerodactyl', 'gardevoir', 'sharpedo'], region: "Hoenn" },
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

// Shuffle E4 — pick 4 unique, scale to levels 50-56
function shuffleEliteFour() {
    const pool = [...ELITE_FOUR_POOL];
    for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    return pool.slice(0, 4).map((e, i) => ({ ...e, level: 50 + i * 2 }));
}

// Pick random champion, scale to level 60
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
    master_ball: { name: "Master Ball", desc: "Never fails!", effect: "catch", value: 999, price: 0 },
    rare_candy: { name: "Rare Candy", desc: "Raises level by 1", effect: "levelup", value: 1, price: 4800 },
    revive: { name: "Revive", desc: "Revives fainted Pokemon", effect: "revive", value: 0.5, price: 1500 },
    fire_stone: { name: "Fire Stone", desc: "Evolves certain Fire Pokemon", effect: "stone", value: 0, price: 5000 },
    water_stone: { name: "Water Stone", desc: "Evolves certain Water Pokemon", effect: "stone", value: 0, price: 5000 },
    thunder_stone: { name: "Thunder Stone", desc: "Evolves certain Electric Pokemon", effect: "stone", value: 0, price: 5000 },
    leaf_stone: { name: "Leaf Stone", desc: "Evolves certain Grass Pokemon", effect: "stone", value: 0, price: 5000 },
    moon_stone: { name: "Moon Stone", desc: "Evolves certain Pokemon", effect: "stone", value: 0, price: 5000 },
    link_cable: { name: "Link Cable", desc: "Triggers trade evolution", effect: "trade", value: 0, price: 8000 },
};

// Stone evolution mappings
const STONE_EVOLUTIONS = {
    fire_stone: {
        eevee: 'flareon',
        growlithe: 'arcanine',
        vulpix: 'ninetales',
        pansear: 'simisear'
    },
    water_stone: {
        eevee: 'vaporeon',
        poliwhirl: 'poliwrath',
        staryu: 'starmie',
        panpour: 'simipour',
        shellder: 'cloyster',
        lombre: 'ludicolo',
        nuzleaf: 'shiftry'
    },
    thunder_stone: {
        eevee: 'jolteon',
        pikachu: 'raichu',
        panpour: 'simipour'
    },
    leaf_stone: {
        gloom: 'vileplume',
        oddish: 'vileplume',
        pansage: 'simisage',
        nuzleaf: 'shiftry',
        lombre: 'ludicolo',
        weepinbell: 'victreebel'
    },
    moon_stone: {
        clefairy: 'clefable',
        nidorino: 'nidoking',
        nidorina: 'nidoqueen',
        jigglypuff: 'wigglytuff',
        skitty: 'delcatty',
        munna: 'musharna'
    },
    sun_stone: {
        gloom: 'bellossom',
        sunkern: 'sunflora',
        cottonee: 'whimsicott',
        petilil: 'lilligant'
    }
};

// Trade evolution mappings (for Link Cable)
const TRADE_EVOLUTIONS = {
    kadabra: 'alakazam',
    machoke: 'machamp',
    graveler: 'golem',
    haunter: 'gengar',
    onix: 'steelix',
    scyther: 'scizor',
    poliwhirl: 'politoed',
    slowpoke: 'slowking',
    seadra: 'kingdra',
    porygon: 'porygon2',
    clamperl: 'huntail',
    duskull: 'dusclops',
    clampearl: 'gorebyss'
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
