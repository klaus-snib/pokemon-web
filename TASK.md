# Task: Pokemon Roguelike Web Game — Full Build

You are building a browser-based Pokemon roguelike game. There's already a working stub with basic game loop, battles, and Pokemon data. Your job is to massively expand it into a polished, fully playable game.

## What Exists
- `index.html` — basic layout with screens (start, game, battle, gameover)
- `styles.css` — basic styling
- `pokemon-data.js` — Pokemon data, starters, gym leaders, items, type effectiveness, sprites from Showdown
- `game.js` — Game class with starter selection, exploration, wild/gym battles, catching, shop, healing, mystery events

## What To Build

### 1. Save/Load System
- Save game state to localStorage on every state change
- Load on page open if save exists
- "Continue" button on start screen if save exists
- "New Game" clears save

### 2. Expanded Events (port from CLI adventure engine)
- **Trainer Battles** — NPC trainers with themed teams, money reward on win
- **Rival Battles** — Tougher, appear every 2-3 badges, rare candy reward
- **Campsite** — Choose: rest (heal 30% HP), train (gain some XP), or forage (random item)
- **Fishing Spot** — Already exists but improve: show a fishing minigame (timing-based click)
- **Mystery Cave** — Expand to 15+ outcomes (good, neutral, bad) matching the CLI version:
  - Good: treasure, rare candy, Pokemon joins, level boost, berry bush, fossil (rare Pokemon), move tutor, shrine blessing
  - Neutral: trade offer, lost hiker (help for reward), gambler (risk $500)
  - Bad: ambush (wild battle), Team Rocket (tough battle), curse (lose HP), shrine curse

### 3. Evolution System
- Level-based evolution (check after XP gain, show animation/message)
- Stone evolution: fire/water/thunder/leaf/moon stones
- Stones available in shop (expensive) and as rare mystery cave finds
- Eevee evolves based on which stone is used

### 4. Legendary Encounters
- After 6+ badges, rare chance of legendary encounter during exploration
- Articuno, Zapdos, Moltres, Mewtwo
- Very hard to catch, high level
- Add these to pokemon-data.js

### 5. Better Battle System
- Show type effectiveness messages ("It's super effective!", "Not very effective...")
- Critical hits (6.25% chance, 1.5x damage)
- Battle log should scroll and show turn-by-turn action
- Items usable in battle (potions to heal active Pokemon)
- When a Pokemon faints, prompt to switch (don't auto-switch)

### 6. Team Management Screen
- Reorder team by drag or swap buttons
- View detailed stats for each Pokemon
- Use items from bag on specific Pokemon (rare candy, potions outside battle)
- Release Pokemon
- Nickname Pokemon

### 7. Achievement System  
- Track and display achievements (14 from the CLI version):
  - Champion, Flawless, Survivor, Speedrunner, First Catch, Squad Goals, Master Angler, Evolution, Loaded ($10k), Fossil Hunter, High Roller, Starter Collector, Underdog, Lucky
- Show achievement popup when unlocked
- Achievements page accessible from footer

### 8. Polish & UX
- Smooth screen transitions (CSS animations)
- Pokemon sprite animations (bounce on attack, shake on damage)
- HP bars animate smoothly (not instant)
- Sound-free but visual feedback for actions (screen shake on crit, flash on super effective)
- Mobile-first responsive design (game should work well on phone)
- Dark theme (the default — no light theme needed)
- Show Pokemon types with colored badges
- Event counter in stats bar (how many events explored)

### 9. Difficulty Balance
- Easy: $2000 start, 5 strikes, need 6 badges, 5 pokeballs
- Normal: $1000 start, 3 strikes, need 8 badges, 3 pokeballs  
- Hard: $500 start, 2 strikes, need 8 badges, 1 pokeball
- Nightmare: $0 start, 1 strike, need 8 badges, 0 pokeballs

### 10. Post-Game / Victory Screen
- Show full run summary: time played, events explored, Pokemon caught, evolutions, badges earned
- "Hall of Fame" — save best runs to localStorage, show leaderboard
- Option to continue exploring after victory (Battle Tower concept — endless trainer battles for high scores)

## Technical Constraints
- **Pure vanilla JS** — no frameworks, no build step
- **No backend** — everything client-side, localStorage for persistence
- **Sprites from Pokemon Showdown** — `https://play.pokemonshowdown.com/sprites/gen5/{name}.png`
- **Keep it in 3-4 files** — index.html, styles.css, pokemon-data.js, game.js (can split game.js if it gets huge)
- **Must work on mobile** — touch-friendly buttons, responsive layout

## Style Guide
- Dark background (#1a1a2e or similar)
- Pokemon type colors for badges (Fire=red, Water=blue, etc.)
- Clean, readable fonts
- Card-style layouts for Pokemon display
- Generous padding/spacing for touch targets

## Commit Often
Make small, meaningful commits as you complete each feature. Don't do one giant commit at the end.

When completely finished, run this command to notify me:
openclaw system event --text "Done: Pokemon web roguelike fully built" --mode now
