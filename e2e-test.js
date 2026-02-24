// End-to-end test: Play a full Normal run and report results
const vm = require('vm');
const fs = require('fs');
const ctx = vm.createContext({});
vm.runInContext(fs.readFileSync('pokemon-data.js', 'utf8').replace(/\bconst\b/g, 'var'), ctx);
const { POKEMON_DATA, STARTERS, WILD_POKEMON, GYM_LEADERS, TYPE_EFFECTIVENESS, MOVES, COVERAGE_POOLS, DIFFICULTY_SETTINGS, getMovesForPokemon } = ctx;

class SimPokemon {
    constructor(id, lv) {
        this.speciesId = id; this.name = POKEMON_DATA[id].name;
        this.type = POKEMON_DATA[id].type; this.level = lv;
        const b = POKEMON_DATA[id].baseStats;
        this.maxHp = Math.floor((b.hp*2*lv)/100)+lv+10;
        this.hp = this.maxHp;
        this.attack = Math.floor((b.atk*2*lv)/100)+5;
        this.defense = Math.floor((b.def*2*lv)/100)+5;
        this.speed = Math.floor((b.spd*2*lv)/100)+5;
        this.moves = getMovesForPokemon(this.type);
        this.xp = 0; this.xpToNext = lv*15+40;
    }
    get isAlive() { return this.hp > 0; }
    heal() { this.hp = this.maxHp; }
    takeDamage(d) { this.hp = Math.max(0, this.hp-d); return !this.isAlive; }
    addXp(xp) {
        this.xp += xp;
        while (this.xp >= this.xpToNext) {
            this.xp -= this.xpToNext; this.level++;
            const b = POKEMON_DATA[this.speciesId].baseStats;
            this.maxHp = Math.floor((b.hp*2*this.level)/100)+this.level+10;
            this.hp = this.maxHp;
            this.attack = Math.floor((b.atk*2*this.level)/100)+5;
            this.defense = Math.floor((b.def*2*this.level)/100)+5;
            this.speed = Math.floor((b.spd*2*this.level)/100)+5;
            this.xpToNext = this.level*15+40;
        }
    }
}

function calcDmg(atk, def, move) {
    const p = move ? move.power : 60;
    const base = Math.floor(((2*atk.level/5+2)*p*atk.attack/def.defense)/50)+2;
    const v = 0.85+Math.random()*0.15;
    const at = move ? move.type : atk.type.toLowerCase();
    const dt = def.type.toLowerCase();
    let eff = 1;
    if (TYPE_EFFECTIVENESS[at]?.[dt] !== undefined) eff = TYPE_EFFECTIVENESS[at][dt];
    const stab = (move && move.type === atk.type.toLowerCase()) ? 1.5 : 1;
    const crit = Math.random()<0.0625 ? 1.5 : 1;
    return { dmg: Math.max(1, Math.floor(base*v*eff*stab*crit)), eff };
}

function battle(team, enemy) {
    let ai = team.findIndex(p=>p.isAlive);
    if (ai===-1) return false;
    while (enemy.isAlive && ai !== -1) {
        const p = team[ai];
        // Pick best move (highest effective damage)
        const m0 = calcDmg(p, enemy, p.moves[0]);
        const m1 = calcDmg(p, enemy, p.moves[1]);
        const bestMove = m0.dmg >= m1.dmg ? p.moves[0] : p.moves[1];
        const pr = calcDmg(p, enemy, bestMove);
        enemy.takeDamage(pr.dmg);
        if (!enemy.isAlive) break;
        const em = enemy.moves[Math.floor(Math.random()*2)];
        const er = calcDmg(enemy, p, em);
        if (p.takeDamage(er.dmg)) ai = team.findIndex(pp=>pp.isAlive);
    }
    return !enemy.isAlive;
}

function fullRun() {
    const starter = STARTERS[Math.floor(Math.random()*STARTERS.length)];
    const team = [new SimPokemon(starter, 5)];
    let events = 0, maxEvents = 35, strikes = 3, badges = 0, gymIdx = 0;
    const log = [];
    const eventsPerPhase = Math.floor(maxEvents / 8);
    
    for (let turn = 0; turn < 200 && strikes > 0 && badges < 8; turn++) {
        const eventsLeft = maxEvents - events;
        const avgLv = team.reduce((s,p)=>s+p.level,0)/team.length;
        
        // Strategy: fight if we have events, try gym when ready
        if (gymIdx < 8 && avgLv >= GYM_LEADERS[gymIdx].level - 2) {
            // Try gym
            const gym = GYM_LEADERS[gymIdx];
            const gymTeam = [];
            // Gym leader has 2 pokemon
            const typePool = Object.keys(POKEMON_DATA).filter(k=>POKEMON_DATA[k].type===gym.type);
            const gp1 = typePool[Math.floor(Math.random()*typePool.length)] || 'geodude';
            const gp2 = typePool[Math.floor(Math.random()*typePool.length)] || 'geodude';
            const enemy1 = new SimPokemon(gp1, gym.level);
            const enemy2 = new SimPokemon(gp2, gym.level - 2);
            
            let won = battle(team, enemy1);
            if (won) won = battle(team, enemy2);
            
            if (won) {
                badges++; gymIdx++;
                const gymXp = Math.floor(gym.level*30+50);
                team.forEach(p=>{if(p.isAlive)p.addXp(gymXp)});
                events = Math.max(0, events - eventsPerPhase); // Replenish
                team.forEach(p=>p.heal());
                log.push(`Badge ${badges}: ${gym.name} (Lv${gym.level}) — team avg Lv${Math.floor(avgLv)}`);
            } else {
                if (!team.some(p=>p.isAlive)) { strikes--; team.forEach(p=>p.heal()); }
                else team.forEach(p=>p.heal()); // heal after failed gym too
            }
            continue;
        }
        
        if (eventsLeft <= 0) {
            // Grind free wild battles
            const pool = [...WILD_POKEMON.common, ...WILD_POKEMON.uncommon];
            const wid = pool[Math.floor(Math.random()*pool.length)];
            const wlv = Math.max(2, Math.floor(avgLv + Math.random()*4 - 2));
            const enemy = new SimPokemon(wid, wlv);
            if (battle(team, enemy)) {
                const xp = Math.floor(enemy.level*25+40);
                const ai = team.findIndex(p=>p.isAlive);
                if (ai!==-1) { team[ai].addXp(xp); team.forEach((p,i)=>{if(i!==ai&&p.isAlive)p.addXp(Math.floor(xp*0.4))}); }
            } else {
                if (!team.some(p=>p.isAlive)) { strikes--; team.forEach(p=>p.heal()); }
            }
            continue;
        }
        
        events++;
        const roll = Math.random();
        if (roll < 0.55) {
            // Wild battle
            const pool = [...WILD_POKEMON.common, ...WILD_POKEMON.uncommon];
            const wid = pool[Math.floor(Math.random()*pool.length)];
            const wlv = Math.max(2, Math.floor(avgLv + Math.random()*4 - 2));
            const enemy = new SimPokemon(wid, wlv);
            if (battle(team, enemy)) {
                const xp = Math.floor(enemy.level*25+40);
                const ai = team.findIndex(p=>p.isAlive);
                if (ai!==-1) { team[ai].addXp(xp); team.forEach((p,i)=>{if(i!==ai&&p.isAlive)p.addXp(Math.floor(xp*0.4))}); }
                if (team.length < 6 && Math.random() < 0.4) team.push(new SimPokemon(wid, wlv));
            } else {
                if (!team.some(p=>p.isAlive)) { strikes--; team.forEach(p=>p.heal()); }
            }
        } else if (roll < 0.70) {
            team.forEach(p=>p.heal());
        } else {
            // Cave/training
            const alive = team.find(p=>p.isAlive);
            if (alive) alive.addXp(Math.floor(alive.level*15+30));
        }
    }
    
    return { won: badges>=8, badges, strikes, teamSize: team.length, 
             avgLevel: Math.floor(team.reduce((s,p)=>s+p.level,0)/team.length),
             log, starter: POKEMON_DATA[starter].name };
}

// Run 500 sims
const results = [];
for (let i = 0; i < 500; i++) results.push(fullRun());

const wins = results.filter(r=>r.won).length;
console.log(`=== E2E Balance Test (500 runs, Normal, with gym replenish) ===`);
console.log(`Win rate: ${wins}/500 (${(wins/5).toFixed(1)}%)`);
console.log(`Avg badges: ${(results.reduce((s,r)=>s+r.badges,0)/500).toFixed(1)}/8`);
console.log(`Avg team level: ${(results.reduce((s,r)=>s+r.avgLevel,0)/500).toFixed(1)}`);
console.log(`Avg team size: ${(results.reduce((s,r)=>s+r.teamSize,0)/500).toFixed(1)}`);
console.log(`\nBadge distribution:`);
for (let b=0;b<=8;b++){const c=results.filter(r=>r.badges===b).length;if(c>0)console.log(`  ${b}: ${c} (${(c/5).toFixed(1)}%)`)}
// Show a winning run's log
const winRun = results.find(r=>r.won);
if (winRun) { console.log(`\nSample winning run (${winRun.starter}):`); winRun.log.forEach(l=>console.log(`  ${l}`)); }
