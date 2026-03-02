#!/usr/bin/env python3
"""Parse Showdown learnsets.ts to extract level-up moves for Gen 1-3."""

import json
import re

# Load the TypeScript file
with open('/home/jason/clawd/projects/pokemon-web/learnsets.ts', 'r') as f:
    ts_data = f.read()

# Load our extracted Pokemon
with open('/home/jason/clawd/projects/pokemon-web/gen1-3_pokemon.json') as f:
    pokemon = json.load(f)

print(f"Extracting learnsets for {len(pokemon)} Pokemon...")

learnsets = {}

for name in pokemon.keys():
    # Find this Pokemon's learnset in the TS data
    # Pattern: pokemonname: { learnset: { ... } }
    pattern = rf'{name}: \{{[^}}]*learnset: \{{([^}}]+)\}}'
    match = re.search(pattern, ts_data, re.DOTALL)
    
    if match:
        moves_block = match.group(1)
        level_moves = []
        
        # Find all level-up moves (format: moveName: ["L##"])
        for line in moves_block.split(','):
            line = line.strip()
            if ':' in line:
                parts = line.split(':')
                if len(parts) == 2:
                    move_name = parts[0].strip().strip('"')
                    levels_part = parts[1].strip()
                    
                    # Extract L## patterns
                    level_matches = re.findall(r'L(\d+)', levels_part)
                    for lvl in level_matches:
                        try:
                            level = int(lvl)
                            if level > 0:
                                level_moves.append({'level': level, 'move': move_name})
                                break  # Only take first level
                        except:
                            pass
        
        if level_moves:
            # Sort by level and remove duplicates
            seen = set()
            unique_moves = []
            for m in sorted(level_moves, key=lambda x: x['level']):
                if m['move'] not in seen:
                    seen.add(m['move'])
                    unique_moves.append(m)
            learnsets[name] = unique_moves

print(f"Found learnsets for {len(learnsets)} Pokemon")

# Save
with open('/home/jason/clawd/projects/pokemon-web/gen1-3_learnsets.json', 'w') as f:
    json.dump(learnsets, f, indent=4)

print("Saved to gen1-3_learnsets.json")
