# Move Mechanics Audit - Pokemon Web Game

**Date:** 2026-03-09
**Auditor:** Ib
**Scope:** All move mechanics defined in moves-data.js vs implemented in game.js

---

## ✅ FULLY IMPLEMENTED

| Mechanic | Status | Notes |
|----------|--------|-------|
| **Damage calculation** | ✅ Working | Physical/special split, type effectiveness, STAB, base damage |
| **Type effectiveness** | ✅ Working | All 18 types with proper multipliers |
| **STAB** | ✅ Working | 1.5x multiplier for matching types |
| **Critical hits** | ✅ Working | 6.25% base chance, 2x damage |
| **Accuracy/Evasion** | ✅ Working | Hit/miss based on accuracy stat and random roll |
| **Status effects** | ✅ Working | Burn, paralysis, poison, sleep, freeze applied via secondary.status |
| **Stat stage boosts/drops** | ✅ Working | Attack, Defense, Speed, etc. with proper multipliers (-6 to +6) |
| **Fixed damage** | ✅ Working | Dragon Rage (40), Sonic Boom (20) - recently fixed |
| **Weather** | ⚠️ Partial | Rain, Sun, Sand defined but minimal battle impact |
| **Abilities** | ✅ Working | 10 abilities implemented with proper triggers |
| **Priority (data only)** | ⚠️ Partial | Priority values defined but not used in turn order |

---

## ⚠️ DATA DEFINED BUT NOT FUNCTIONAL

Moves have these properties in `moves-data.js` but battle logic ignores them:

| Mechanic | Affected Moves | Issue |
|----------|---------------|-------|
| **Priority** | Quick Attack, Extreme Speed, Sucker Punch, etc. | `priority` field exists but turn order is speed-only |
| **Protect/Detect** | Protect, Detect, King's Shield, etc. | `volatileStatus: "protect"` defined but no invulnerability logic |
| **Encore** | Encore | `volatileStatus: "encore"` defined but no forced move repetition |
| **Destiny Bond** | Destiny Bond | `volatileStatus: "destinybond"` defined but no KO-link logic |
| **Counter/Mirror Coat** | Counter, Mirror Coat | Power 0 with priority -5, but no damage reflection logic |
| **Focus Punch** | Focus Punch | `priority: -3`, `volatileStatus` defined, but no charge/fail logic |
| **Volatile status** | Charge, Defense Curl, etc. | Flags set but effects not implemented |

---

## ❌ NOT IMPLEMENTED (Missing from data and code)

| Mechanic | Examples | Impact |
|----------|----------|--------|
| **Flinch** | Iron Head, Rock Slide, Waterfall, Air Slash | 41 moves should flinch but don't |
| **High crit ratio** | Slash, Night Slash, Psycho Cut | Should have ~12.5% crit vs 6.25% |
| **Two-turn moves** | Fly, Dig, Dive, Solar Beam, Skull Bash | No charging or semi-invulnerable state |
| **Recoil** | Double-Edge, Brave Bird, Flare Blitz, Head Smash | User takes damage after attacking |
| **Drain healing** | Giga Drain, Mega Drain, Leech Life | Should heal user for % of damage dealt |
| **Multi-hit** | Bullet Seed, Icicle Spear, Rock Blast | Should hit 2-5 times |
| **Recharge** | Hyper Beam, Giga Impact | Should skip next turn |
| **Sucker Punch condition** | Sucker Punch | Should only work if opponent attacking |
| **Minimize + Stomp interaction** | Minimize, Stomp | Stomp always hits minimized foe |
| **Solar Beam in sun** | Solar Beam | Should skip charge in sun |

---

## BATCH 1 IMPLEMENTATION (Assigned to Snib)

Priority order based on gameplay impact:

1. **Priority system** - Quick Attack users feel wrong going last
2. **Flinch** - 41 moves affected, significant battle dynamic  
3. **High crit ratio** - Affects many popular moves
4. **Recoil** - Risk/reward for powerful moves
5. **Drain healing** - Sustainability for many Pokemon

---

## COMPLEX FEATURES (Future consideration)

| Feature | Complexity | Notes |
|---------|-----------|-------|
| **Two-turn moves** | High | Needs semi-invulnerable state, charge tracking |
| **Protect consecutive use** | Medium | Success rate drops with repeated use |
| **Multi-hit moves** | Medium | Multiple damage calculations, hit count randomization |
| **Weather full implementation** | Medium | Damage modifiers, ability interactions, duration |
| **Counter/Mirror Coat** | Medium | Needs damage tracking from last turn |

---

## RECOMMENDATION

**Short-term:** Complete Batch 1 (priority, flinch, high crit, recoil, drain) - ~2-3 days work

**Long-term:** Consider migrating to `poke-engine` (Rust-based) if implementing complex features like two-turn moves, multi-hit, or full weather system. poke-engine has all mechanics implemented but requires significant refactoring.

---

## FILES TO MODIFY

For Batch 1 implementation:
- `moves-data.js` - Add `flinch`, `highCrit`, `recoil`, `drain` fields
- `game.js` - Add priority turn ordering, flinch application, high crit threshold, recoil damage, drain healing

---

*Last updated: 2026-03-09 00:39 GMT*
