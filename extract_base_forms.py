#!/usr/bin/env python3
"""Extract Gen 1-3 base form Pokemon from Foul Play data."""

import json
from collections import defaultdict

# Load Foul Play pokedex
with open('/home/jason/clawd/projects/pokemon-roguelike/foul-play/data/pokedex.json') as f:
    fp_data = json.load(f)

# Group by num, pick shortest key (base form) for each
by_num = defaultdict(list)
for k, v in fp_data.items():
    num = v.get('num', 0)
    if 1 <= num <= 386:
        by_num[num].append((k, v))

# Extract base forms (shortest key name)
base_forms = {}
for num, entries in by_num.items():
    # Sort by key length, pick shortest (base form)
    entries.sort(key=lambda x: len(x[0]))
    base_name, base_data = entries[0]
    base_forms[base_name] = base_data

print(f"Base forms extracted: {len(base_forms)}")

# Convert to game format
game_mons = {}
for name, mon in base_forms.items():
    stats = mon['baseStats']
    
    # Evolution data
    evolves = None
    if mon.get('evos'):
        evo_target = mon['evos'][0].lower()
        if mon.get('evoLevel'):
            evolves = {'level': mon['evoLevel'], 'into': evo_target}
        elif mon.get('evoType') == 'trade':
            evolves = {'trade': True, 'into': evo_target}
        elif mon.get('evoType') == 'useItem':
            stone_map = {
                'Fire Stone': 'fire_stone',
                'Water Stone': 'water_stone', 
                'Thunder Stone': 'thunder_stone',
                'Leaf Stone': 'leaf_stone',
                'Moon Stone': 'moon_stone',
                'Sun Stone': 'sun_stone'
            }
            stone = stone_map.get(mon.get('evoItem'))
            if stone:
                evolves = {'stone': stone, 'into': evo_target}
    
    game_mon = {
        'name': mon['name'],
        'type': mon['types'][0].capitalize(),
        'baseStats': {
            'hp': stats['hp'],
            'atk': stats['attack'],
            'def': stats['defense'],
            'spd': stats['speed']
        },
        'spa': stats['special-attack'],
        'spd_def': stats['special-defense']
    }
    
    if len(mon['types']) > 1:
        game_mon['type2'] = mon['types'][1].capitalize()
    
    if evolves:
        game_mon['evolves'] = evolves
    
    game_mons[name] = game_mon

# Save
with open('/home/jason/clawd/projects/pokemon-web/gen1-3_pokemon.json', 'w') as f:
    json.dump(game_mons, f, indent=4)

print(f"Saved to gen1-3_pokemon.json")
print(f"Sample: {list(game_mons.keys())[:5]}")
print(f"Last few: {list(game_mons.keys())[-5:]}")
