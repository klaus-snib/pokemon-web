#!/usr/bin/env node
/**
 * Automated Pokemon Roguelike Playtest v2
 * Directly manipulates game state via page.evaluate instead of clicking DOM.
 */
const { chromium } = require('playwright');

const DIFFICULTY = process.argv[2] || 'Normal';
const STARTER = process.argv[3] || 'squirtle';
const RUNS = parseInt(process.argv[4] || '5');

async function playGame(page, difficulty, starter) {
  await page.goto('https://klaus-snib.github.io/pokemon-web/?v=9&t=' + Date.now());
  await page.waitForSelector('.starter-option', { timeout: 10000 });
  await page.waitForTimeout(500);

  // Start game by clicking through DOM
  await page.evaluate(({diff, start}) => {
    // Set difficulty
    const select = document.querySelector('select');
    if (select) {
      for (const opt of select.options) {
        if (opt.text.toLowerCase().includes(diff.toLowerCase())) {
          select.value = opt.value;
          select.dispatchEvent(new Event('change'));
          break;
        }
      }
    }
    // Click starter
    document.querySelectorAll('.starter-option').forEach(el => {
      if (el.textContent.toLowerCase().includes(start.toLowerCase())) el.click();
    });
  }, {diff: difficulty, start: starter});

  await page.waitForTimeout(300);

  // Click New Game if available
  await page.evaluate(() => {
    document.querySelectorAll('button').forEach(b => {
      if (b.textContent.includes('New Game') && !b.disabled) b.click();
    });
  });
  await page.waitForTimeout(500);

  // Verify game started
  const started = await page.evaluate(() => typeof game !== 'undefined' && game.state === 'playing');
  if (!started) {
    return { victory: false, badges: 0, events: 0, maxEvents: 35, strikes: 3, money: 1000, team: [], error: 'Game did not start' };
  }

  let turns = 0;
  const maxTurns = 1000;

  while (turns < maxTurns) {
    turns++;

    const result = await page.evaluate(() => {
      const g = game;
      if (!g) return { action: 'wait' };

      if (g.state === 'gameover') {
        const won = g.badges >= (g.badgesNeeded || 8);
        return { done: true, victory: won };
      }

      const info = () => ({
        team: g.team.map(p => ({ name: p.name, level: p.level, hp: p.hp, maxHp: p.maxHp })),
        badges: g.badges, events: g.eventsExplored, maxEvents: g.maxEvents,
        strikes: g.strikes, money: g.money
      });

      if (g.state === 'playing') {
        // Find and click path buttons
        const btns = document.querySelectorAll('button');
        const choices = [];
        btns.forEach(b => {
          if (b.closest('.footer-bar') || b.closest('footer') || b.closest('nav')) return;
          const t = b.textContent.toLowerCase();
          if (t.includes('explore') || t.includes('tall grass')) choices.push({ btn: b, type: 'grass' });
          else if (t.includes('challenge') || t.includes('gym')) choices.push({ btn: b, type: 'gym', text: t });
          else if (t.includes('campsite') || t.includes('rest')) choices.push({ btn: b, type: 'heal' });
          else if (t.includes('pokemon center')) choices.push({ btn: b, type: 'center' });
          else if (t.includes('pokemart') || t.includes('mart')) choices.push({ btn: b, type: 'shop' });
          else if (t.includes('mystery cave')) choices.push({ btn: b, type: 'cave' });
          else if (t.includes('fishing')) choices.push({ btn: b, type: 'fish' });
          else if (t.includes('trainer')) choices.push({ btn: b, type: 'trainer' });
          else if (t.includes('grind')) choices.push({ btn: b, type: 'grind' });
        });

        if (choices.length === 0) return { action: 'wait', state: 'playing-no-choices', ...info() };

        const avgLevel = g.team.reduce((s, p) => s + p.level, 0) / g.team.length;
        const totalHpPct = g.team.reduce((s, p) => s + p.hp, 0) / g.team.reduce((s, p) => s + p.maxHp, 0);
        const alive = g.team.filter(p => p.hp > 0).length;

        // Extract gym level
        const gymChoice = choices.find(c => c.type === 'gym');
        let gymLevel = 99;
        if (gymChoice) {
          const m = gymChoice.text.match(/lv\.?\s*(\d+)/i);
          if (m) gymLevel = parseInt(m[1]);
        }

        // Decision tree
        const healChoice = choices.find(c => c.type === 'heal' || c.type === 'center');
        const grassChoice = choices.find(c => c.type === 'grass' || c.type === 'grind');

        if (totalHpPct < 0.35 && healChoice) {
          healChoice.btn.click();
          return { action: 'heal', ...info() };
        }

        if (gymChoice && avgLevel >= gymLevel - 2 && totalHpPct > 0.5) {
          gymChoice.btn.click();
          return { action: 'gym', gymLevel, ...info() };
        }

        if (grassChoice) {
          grassChoice.btn.click();
          return { action: 'grass', ...info() };
        }

        // Fallback
        choices[0].btn.click();
        return { action: 'fallback-' + choices[0].type, ...info() };
      }

      if (g.state === 'battle') {
        const enemy = g.battleEnemy;
        const active = g.activePokemon || g.team.find(p => p.hp > 0);

        // Check for fainted switch prompt
        if (!active || active.hp <= 0) {
          const switchBtns = document.querySelectorAll('button');
          for (const btn of switchBtns) {
            const t = btn.textContent;
            if (t.includes('Lv.') && t.includes('/') && !btn.disabled) {
              btn.click();
              return { action: 'switch', ...info() };
            }
          }
          return { action: 'wait-switch', ...info() };
        }

        // Look at what buttons are available
        const allBtns = [...document.querySelectorAll('button')].filter(b => {
          const parent = b.closest('.footer-bar, footer, nav');
          return !parent;
        });

        const moveButtons = allBtns.filter(b => b.textContent.includes('·'));
        const fightBtn = allBtns.find(b => b.textContent.includes('Fight'));
        const catchBtn = allBtns.find(b => b.textContent.includes('Catch') && !b.disabled);
        const runBtn = allBtns.find(b => b.textContent.includes('Run') && !b.disabled);

        // If move buttons visible, pick best
        if (moveButtons.length > 0) {
          const typeChart = {
            water: { fire: 2, rock: 2, ground: 2, water: 0.5, grass: 0.5, dragon: 0.5 },
            fire: { grass: 2, ice: 2, bug: 2, steel: 2, fire: 0.5, water: 0.5, rock: 0.5, dragon: 0.5 },
            grass: { water: 2, rock: 2, ground: 2, grass: 0.5, fire: 0.5, flying: 0.5, bug: 0.5 },
            psychic: { fighting: 2, poison: 2, psychic: 0.5, steel: 0.5, dark: 0 },
            ground: { fire: 2, electric: 2, poison: 2, rock: 2, steel: 2, grass: 0.5, bug: 0.5, flying: 0 },
            electric: { water: 2, flying: 2, electric: 0.5, grass: 0.5, ground: 0 },
            fairy: { fighting: 2, dragon: 2, dark: 2, fire: 0.5, poison: 0.5, steel: 0.5 },
            ice: { grass: 2, ground: 2, flying: 2, dragon: 2, fire: 0.5, water: 0.5, ice: 0.5 },
            normal: { rock: 0.5, steel: 0.5, ghost: 0 },
            fighting: { normal: 2, rock: 2, ice: 2, dark: 2, steel: 2, flying: 0.5, poison: 0.5, bug: 0.5, fairy: 0.5, ghost: 0 },
            ghost: { psychic: 2, ghost: 2, dark: 0.5, normal: 0 },
            dark: { psychic: 2, ghost: 2, fighting: 0.5, dark: 0.5, fairy: 0.5 },
            bug: { grass: 2, psychic: 2, dark: 2, fire: 0.5, fighting: 0.5, flying: 0.5, ghost: 0.5, steel: 0.5 },
            rock: { fire: 2, ice: 2, flying: 2, bug: 2, fighting: 0.5, ground: 0.5, steel: 0.5 },
            flying: { grass: 2, fighting: 2, bug: 2, electric: 0.5, rock: 0.5, steel: 0.5 },
            poison: { grass: 2, fairy: 2, poison: 0.5, ground: 0.5, rock: 0.5, ghost: 0.5, steel: 0 },
            dragon: { dragon: 2, steel: 0.5, fairy: 0 },
            steel: { ice: 2, rock: 2, fairy: 2, fire: 0.5, water: 0.5, electric: 0.5, steel: 0.5 }
          };

          let bestBtn = moveButtons[0];
          let bestScore = -1;
          const enemyType = (enemy.type || '').toLowerCase();

          moveButtons.forEach(btn => {
            const text = btn.textContent.toLowerCase();
            const moveType = text.match(/water|fire|grass|psychic|ground|electric|ice|dragon|fairy|normal|fighting|poison|ghost|dark|steel|rock|bug|flying/)?.[0];
            const power = parseInt(text.match(/(\d+)/)?.[1] || '50');
            const isStab = text.includes('stab');

            let eff = 1;
            if (moveType && typeChart[moveType]?.[enemyType] !== undefined) {
              eff = typeChart[moveType][enemyType];
            }
            const score = power * eff * (isStab ? 1.5 : 1);
            if (score > bestScore) { bestScore = score; bestBtn = btn; }
          });

          bestBtn.click();
          return { action: 'move', ...info() };
        }

        // Click Fight to open moves
        if (fightBtn) {
          fightBtn.click();
          return { action: 'fight-open', ...info() };
        }

        // Fallback: click first available button
        const fallback = allBtns.find(b => !b.disabled && b.textContent.trim().length > 0);
        if (fallback) {
          fallback.click();
          return { action: 'btn-fallback', ...info() };
        }

        return { action: 'battle-stuck', ...info() };
      }

      // Handle campsite modal
      const modal = document.getElementById('modal');
      if (modal && modal.style.display !== 'none') {
        const modalBtns = modal.querySelectorAll('button');
        // Prefer rest/heal
        for (const btn of modalBtns) {
          if (btn.textContent.toLowerCase().includes('rest')) { btn.click(); return { action: 'camp-rest' }; }
        }
        for (const btn of modalBtns) {
          if (btn.textContent.toLowerCase().includes('train')) { btn.click(); return { action: 'camp-train' }; }
        }
        if (modalBtns.length > 0) { modalBtns[0].click(); return { action: 'modal-click' }; }
      }

      return { action: 'unknown-state', state: g.state };
    });

    if (result.done) {
      const finalState = await page.evaluate(() => ({
        team: game.team.map(p => ({ name: p.name, level: p.level, hp: p.hp, maxHp: p.maxHp })),
        badges: game.badges, events: game.eventsExplored, maxEvents: game.maxEvents,
        strikes: game.strikes, money: game.money
      }));
      return { victory: result.victory, ...finalState };
    }

    await page.waitForTimeout(100);
  }

  const finalState = await page.evaluate(() => ({
    team: game.team.map(p => ({ name: p.name, level: p.level })),
    badges: game.badges, events: game.eventsExplored, maxEvents: game.maxEvents,
    strikes: game.strikes, money: game.money
  }));
  return { victory: false, timeout: true, ...finalState };
}

(async () => {
  console.log(`\n🎮 Pokemon Roguelike Auto-Playtest v2`);
  console.log(`   Difficulty: ${DIFFICULTY} | Starter: ${STARTER} | Runs: ${RUNS}\n`);

  const browser = await chromium.launch({ headless: true });
  const results = [];

  for (let i = 0; i < RUNS; i++) {
    const context = await browser.newContext();
    const page = await context.newPage();
    page.setDefaultTimeout(10000);

    console.log(`--- Run ${i + 1}/${RUNS} ---`);
    try {
      const result = await playGame(page, DIFFICULTY, STARTER);
      results.push(result);
      const teamStr = result.team?.map(p => `${p.name} Lv.${p.level}`).join(', ') || '?';
      console.log(`  ${result.victory ? '🏆 VICTORY' : result.timeout ? '⏱️ TIMEOUT' : '💀 GAME OVER'}`);
      console.log(`  Badges: ${result.badges || 0} | Lives: ${result.strikes} | $${result.money}`);
      console.log(`  Team: ${teamStr} | Events: ${result.events}/${result.maxEvents}`);
    } catch (err) {
      console.log(`  ERROR: ${err.message.split('\n')[0]}`);
      results.push({ victory: false, error: true, badges: 0 });
    }
    await context.close();
  }

  await browser.close();

  console.log(`\n========== SUMMARY ==========`);
  const wins = results.filter(r => r.victory).length;
  const avgBadges = results.reduce((s, r) => s + (r.badges || 0), 0) / results.length;
  const maxBadges = Math.max(...results.map(r => r.badges || 0));
  const badgeDist = {};
  results.forEach(r => { const b = r.badges || 0; badgeDist[b] = (badgeDist[b] || 0) + 1; });

  console.log(`Win rate: ${wins}/${RUNS} (${(wins/RUNS*100).toFixed(0)}%)`);
  console.log(`Avg badges: ${avgBadges.toFixed(1)} | Max: ${maxBadges}`);
  console.log(`Badge dist: ${JSON.stringify(badgeDist)}`);
  console.log(`==============================\n`);
})();
