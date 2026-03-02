#!/usr/bin/env python3
"""Extract Gen 1-3 Pokemon and learnsets for game integration."""

import json
import requests
import re

# Load extracted Pokemon
with open('/home/jason/clawd/projects/pokemon-web/gen1-3_extracted.json') as f:
    pokemon = json.load(f)

print(f"Processing {len(pokemon)} Pokemon...")

# Fetch learnsets from Showdown
learnsets_url = "https://raw.githubusercontent.com/smogon/pokemon-showdown/master/data/learnsets.ts"
response = requests.get(learnsets_url, timeout=30)
learnsets_data = response.text

# Parse TypeScript to extract learnsets (simplified)
learnsets = {}
for name in pokemon.keys():
    # Try to find learnset in the raw data
    pattern = rf'{name}: \{{[^}}]+learnset: \{{([^}}]+)\}}'
    match = re.search(pattern, learnsets_data)
    if match:
        # Extract level-up moves
        moves_text = match.group(1)
        level_moves = []
        for line in moves_text.split(','):
            if 'L' in line and ':' in line:
                parts = line.strip().split(':')
                if len(parts) == 2:
                    move = parts[0].strip().strip('"')
                    level_str = parts[1].strip()
                    if level_str.startswith('L'):
                        try:
                            level = int(level_str[1:3])
                            level_moves.append({'level': level, 'move': move})
                        except:
                            pass
        if level_moves:
            learnsets[name] = sorted(level_moves, key=lambda x: x['level'])

print(f"Found learnsets for {len(learnsets)} Pokemon")

# Save learnsets
with open('/home/jason/clawd/projects/pokemon-web/gen1-3_learnsets.json', 'w') as f:
    json.dump(learnsets, f, indent=4)

print("Done!")
