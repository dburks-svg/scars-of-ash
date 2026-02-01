# Poke Souls

A browser-based game that fuses Pokemon-style creature collecting with Dark Souls-inspired mechanics. Cute monsters. Grim consequences.

## How to Play

Open `index.html` in a modern browser. No build step required.

## Controls

| Key | Action |
|-----|--------|
| W / Arrow Up | Move up |
| A / Arrow Left | Move left |
| S / Arrow Down | Move down |
| D / Arrow Right | Move right |
| E / Enter | Interact (bonfire menu) |

Click buttons in battle to select moves.

## Game Systems

### Creatures

Choose from three starters, each with a unique type:

| Creature | Type | HP | Stamina | Signature Move |
|----------|------|-----|---------|----------------|
| Cindrath | Fire | 45 | 20 | Ember Slash (12 DMG) |
| Marshveil | Water | 50 | 18 | Tide Crash (14 DMG) |
| Thornwick | Grass | 40 | 24 | Vine Lash (10 DMG) |

### Type Effectiveness

- Fire > Grass (1.5x damage)
- Grass > Water (1.5x damage)
- Water > Fire (1.5x damage)
- Reverse matchups deal 0.5x damage

### Stamina System

Every move costs stamina. Manage it carefully:

| Move | Cost | Effect |
|------|------|--------|
| Signature Attack | 5-7 SP | High damage |
| Quick Strike | 3 SP | Low damage, priority (goes first) |
| Guard | 2 SP | Take 50% damage until next turn |
| Rest | 0 SP | Recover 12 stamina, skip turn |

- Stamina regenerates 4 points at the start of each turn
- Dropping below 5 stamina causes **Winded** status (+25% damage taken)

### Soul Binding (Capture System)

Capture wild creatures to build your team:

- **Cost**: 20 souls per attempt
- **Max Team Size**: 3 creatures
- **Capture Chance** (based on enemy HP):
  - Below 10% HP: 90% chance
  - Below 25% HP: 60% chance
  - At or below 50% HP: 30% chance
  - Above 50% HP: 10% chance
- **On Success**: Creature joins your team with current HP and any scars
- **On Failure**: Lose the souls, enemy attacks

Wild creatures have stat variance (+/- 5 HP, +/- 2 stamina) and a 10% chance to already have a scar.

### Scarring System

When a creature faints, it gains a permanent scar:

| Scar | Effect |
|------|--------|
| Fractured | -5 max HP |
| Hesitant | -2 max Stamina |
| Flinching | Quick Strike loses priority |

A creature with **3+ scars** becomes **Hollowed**:
- All stats reduced by 25%
- Damage dealt reduced by 25%

Scars are permanent. Choose your battles wisely.

### Souls Economy

- Defeat wild creatures: +12 souls
- Defeat the boss: +100 souls
- **Death**: Drop all carried souls at death location
- **Recovery**: Return to the spot to reclaim dropped souls
- **Banking**: Rest at a bonfire to bank souls safely

Banked souls are never lost.

### Bonfires

Bonfires are checkpoints and rest points. Press E to open the menu:

- **Rest**: Fully heal all creatures, bank souls, respawn enemies
- **Switch Active**: Change which creature leads in battle
- **Leave**: Close menu and continue exploring

You respawn at the last bonfire used after death.

## Maps

### Ashen Path
The starting area. Tall grass hides wild creatures. Find the gate to the Fallen Keep.

```
W W W W W W W W
W B P G G P P W    B = Bonfire (start)
W P W W G W P W    G = Grass (encounters)
W P P P P P G W    P = Path
W W W W P W P W    W = Wall
W W W W X W W W    X = Gate to Keep
```

### Fallen Keep
The boss dungeon. Navigate the corridors to reach Keeper Varek.

```
W W W W W W
W P P P P W
W P W W P W
W P W P P W
W P P P W W
W W W P W W
W K P P P W    K = Boss room
W W E W W W    E = Exit to Ashen Path
```

## Boss Fight: Keeper Varek

*"Another challenger... They all fall the same."*

The Obsidian Hound guards the keep. A two-phase fight:

### Phase 1
- HP: 60
- Moves: Ember Slash, Flame Wall (burn), Guard
- Trigger Phase 2 at 30% HP

### Phase 2
- Gains +20 HP
- **Scorched Earth**: Arena deals 2 damage per turn to non-Fire types
- New move: **Desperation Fang** (20 damage, 5 recoil)
- More aggressive AI targets low-HP players

## Audio

Click the speaker icon to toggle chiptune music:

- **Exploration**: Melancholic 8-bit melody (Am-Em-F-G progression)
- **Bonfire**: Peaceful arpeggios, the only safe place
- **Battle**: Driving C minor theme, high stakes
- **Boss Phase 2**: Frantic chromatic tension, dissonant harmonies
- **Victory/Game Over**: Somber resolution

Music is muted by default. Click to enable.

## Visual Style

Inspired by Game Boy Color Pokemon games:
- 56x56 pixel tiles
- Pixel art sprites (player, creatures, environment)
- Press Start 2P font
- GBC color palette
- Animated bonfires with flickering flames

## Technical Details

- **Framework**: React 18 (via CDN)
- **Audio**: Tone.js for procedural chiptune synthesis
- **Rendering**: Inline SVG for pixel art sprites
- **State Management**: useReducer for game state
- **Single File**: Everything in index.html, no build required

## Tips

1. **Bank often** - Rest at bonfires to save souls before risky fights
2. **Type advantage matters** - 1.5x damage is significant
3. **Watch stamina** - Being Winded makes you vulnerable
4. **Weaken before binding** - Low HP means high capture chance
5. **Guard the big hits** - Half damage can save your creature
6. **Build a balanced team** - Cover your type weaknesses
7. **Scars are forever** - Sometimes running is the right call

## Credits

Created with React, Tone.js, and determination.

*"The path ahead grows darker."*
