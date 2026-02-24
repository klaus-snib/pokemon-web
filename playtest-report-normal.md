# Normal Mode Playtest Report (Feb 24, 2026)

## Run 1 (v8 - pre-patch)
- **Result:** Game Over at 0 badges, 3 events
- Squirtle Lv.5 → never leveled
- Lost life 1: Pidgey Lv.7 (2 levels above, outsped and out-damaged)
- Lost life 2: Oddish Lv.4 (Grass super effective, Razor Leaf 16 dmg in one hit)
- Killed Oddish Lv.2 after 3 hits (Surf resisted), barely survived
- Lost life 3: Gastly Lv.6 crit with Psychic, went first

## Run 2 (v8 cached, should be v9 - CDN lag)
- **Status:** Ongoing, Squirtle Lv.7, 2 lives, 3 events used
- Beat Vulpix Lv.7 (Water SE → one-shot, leveled to 6)
- Beat Caterpie Lv.3 (2 hits, leveled to 7)
- Died to Gastly Lv.6 (crit Psychic 8 dmg, enemy went first at 4 HP)

## Key Balance Issues Found

### 1. Death Spiral (FIXED in 32a8e8e)
- At Lv.5, wild encounters range Lv.2-8 (old formula: avgLevel ±3)
- A Lv.7-8 encounter against Lv.5 starter is near-guaranteed death
- Dying gives 0 XP, so you stay Lv.5 and face the same odds
- **Fix:** 0-1 badges: range narrowed to avgLevel-1 to avgLevel+3

### 2. Type Matchup Lottery
- Grass encounters (Oddish) destroy Water starter with super effective
- Ground (Earthquake) AND Water (Surf) are both resisted by Grass
- Squirtle has no good answer to Grass types early
- This is partially intentional (roguelike variance) but feels punishing at 0 badges

### 3. Speed Determines Life or Death
- When both Pokemon are similar level, whoever attacks first often wins
- At 4 HP vs Gastly 9 HP, I needed to go first — didn't, died
- No speed stat visible to player, feels random

### 4. Pokeball Economy
- 3 balls isn't enough to reliably catch a team member
- Never got a safe chance to catch (always too low HP to risk failed catch + enemy attack)

## Recommendations
1. ✅ Tighter early encounter range (done)
2. Consider giving starter a neutral coverage move that's SE vs Grass (e.g., Ice Beam for Squirtle)
3. Show speed indicator ("You'll go first" / "Enemy is faster")
4. Start with 5 Pokeballs on Normal (or give 2 free from first event)
5. Consider partial XP on death (25%?) to prevent zero-progress loops
