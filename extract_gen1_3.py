#!/usr/bin/env python3
"""Extract Gen 1-3 Pokemon from Foul Play data to game format."""

import json
import re

# Load Foul Play pokedex
with open('/home/jason/clawd/projects/pokemon-roguelike/foul-play/data/pokedex.json') as f:
    fp_data = json.load(f)

# Filter for Gen 1-3 base forms (exclude forms like deoxysattack, unown variants)
# Keep only entries where num is unique (first occurrence)
seen_nums = set()
base_forms = {}

for name, mon in fp_data.items():
    num = mon.get('num', 0)
    if num < 1 or num > 386:
        continue
    if num in seen_nums:
        continue  # Skip alternate forms
    seen_nums.add(num)
    base_forms[name] = mon

print(f"Base forms extracted: {len(base_forms)}")

# Convert to game format
game_mons = {}
for name, mon in base_forms.items():
    # Stats
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
            stone = stone_map.get(mon.get('evoItem'), None)
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

# Save extracted data
with open('/home/jason/clawd/projects/pokemon-web/gen1-3_extracted.json', 'w') as f:
    json.dump(game_mons, f, indent=4)

print(f"Saved to gen1-3_extracted.json")
print(f"Sample: {list(game_mons.keys())[:5]}")
