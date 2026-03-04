# Pokemon Roguelike Code Review - 2026-03-04

## Findings

### 1. Potential Crash: TM Move Replacement (Line 4036)
**File:** game.js
**Issue:** `const oldMoveName = pokemon.moves[moveIndex].name;` - if moveIndex is invalid or moves[moveIndex] is undefined, this will crash.
**Impact:** High - user-facing crash when replacing moves
**Fix:** Add bounds check before accessing moves[moveIndex]

### 2. Potential Issue: Enemy Move Selection (Line 2553)
**File:** game.js  
**Issue:** `enemy.moves[Math.floor(Math.random() * enemy.moves.length)]` - if enemy.moves is empty, this returns undefined
**Impact:** Medium - battle could hang or crash
**Fix:** Check if moves.length > 0 before selecting

### 3. Missing Save Field: statStages
**File:** game.js (saveGame/loadGame)
**Issue:** Pokemon statStages are not saved/restored
**Impact:** Medium - stat changes lost on save/load
**Fix:** Add statStages to Pokemon.toJSON() and fromJSON()

### 4. Division by Zero Risk (Line 2360)
**File:** game.js (calculateDamage)
**Issue:** `attackStat / defenseStat` - if defenseStat is 0, could cause issues
**Impact:** Low - unlikely but possible
**Fix:** Add minimum defense value check

### 5. Missing Null Check: TM Compatibility
**File:** tm-data.js
**Issue:** No validation that TM.move exists in MOVES
**Impact:** Low - would cause issues when teaching moves
**Fix:** Validate TM moves against MOVES database

### 6. Save/Load: route data not fully persisted
**File:** game.js
**Issue:** Route environment data saved but Gym Leader shuffle state may not persist correctly
**Impact:** Low - cosmetic issue

## Recommendations

1. **High Priority:** Fix TM move replacement bounds check
2. **Medium Priority:** Fix enemy move selection for empty arrays
3. **Medium Priority:** Persist statStages in save/load
4. **Low Priority:** Add defensive checks for division operations

## No Critical Issues Found

- All JS files pass syntax validation
- No undefined global variable references
- Battle logic handles all-fainted case correctly
- Type effectiveness calculations look correct
