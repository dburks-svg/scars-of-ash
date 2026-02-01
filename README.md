# Poke Souls

A browser-based game that fuses creature collecting with Dark Souls-inspired mechanics. Cute monsters. Grim consequences.

## How to Play

Open `index.html` in a modern browser. No build step required.

A help overlay appears on first launch with all game mechanics. Click the **?** button anytime to review.

## Controls

| Key | Action |
|-----|--------|
| W / Arrow Up | Move up |
| A / Arrow Left | Move left |
| S / Arrow Down | Move down |
| D / Arrow Right | Move right |
| E / Enter | Interact (bonfire menu) |
| X | Examine surroundings |
| ESC | Pause menu |
| ? button | Show help overlay |

Click buttons in battle to select moves.

## Difficulty Levels

Choose your fate at the start of each run:

### 🔥 ASHEN (Easy)
*"For those who wish to explore."*
- Wild damage reduced 50%
- Scars heal at bonfire
- Souls only drop 50% on death
- Capture chance +20%

### 💀 SCARRED (Normal)
*"The path as intended."*
- Standard damage (wild -25%)
- Permanent scars
- Full soul drop on death
- Standard capture rates

### 👁 HOLLOWED (Hard)
*"For those who seek true suffering."*
- Full damage from all enemies
- Worse scar penalties (-7 HP, -3 stamina)
- Drop ALL souls including banked on death
- Capture chance -20%
- Boss has 25% more HP

### ☠ BROKEN (Nightmare)
*"You will not survive."*
- All Hollowed settings plus:
- No bonfire healing (save only)
- One scar = Hollowed status
- Boss has no phase transition pause
- **PERMADEATH**: Save deleted on wipe

The difficulty icon appears in the top-left corner during gameplay.

## Save System

### Auto-Save
- Game automatically saves when resting at a bonfire
- "Bonfire lit. Progress saved." notification appears

### Manual Save
- Open pause menu (ESC or gear icon)
- Select SAVE GAME

### Loading
- On return, existing saves show "Continue your journey?" prompt
- Save slot displays: lead creature, location, souls, scars, time played, difficulty

### What's Saved
- Current map and position
- Team creatures (HP, stamina, scars)
- Souls (carried and banked)
- Boss defeated status
- Dropped souls location
- Play time

## Pause Menu

Press **ESC** or click the **gear icon** to pause:

- **RESUME** - Continue playing
- **SAVE GAME** - Manual save
- **LOAD GAME** - Restore saved state (with confirmation)
- **NEW GAME** - Start over (with confirmation)
- **HELP** - View game mechanics

## Story

### The Prologue
*"The bonfire wars ended long ago. Binders and their companions fell, one by one. The creatures that survived... changed. Now they wander the ashen paths, feral and scarred."*

### Environmental Storytelling
Press **X** to examine points of interest:
- Old signposts pointing to places that no longer exist
- Collapsed Healer's Sanctuary signs faded to gray
- Scratched warnings about the keeper
- Broken Soul Spheres, dozens of them

### Keeper Varek
The boss has expanded dialogue:
- **Phase 1**: *"Another walks the ash. I was a guardian once. Now I am a door."*
- **Phase 2**: *"You fight like the ones before... Let me show you why they stopped coming."*
- **On Death**: *"Rest now. The bonfire remembers you."*

### Victory Ending
Defeating Varek reveals his final words about the endless cycle, and a gate opens to whatever lies beyond.

## Game Systems

### Creatures

Choose from three starters, each with a unique type:

| Creature | Type | HP | Stamina | Signature Move |
|----------|------|-----|---------|----------------|
| Cindrath | Fire | 45 | 20 | Ember Slash (12 DMG) |
| Marshveil | Water | 50 | 18 | Tide Crash (14 DMG) |
| Thornwick | Grass | 40 | 24 | Vine Lash (10 DMG) |

### Wild vs Boss Balance

Wild creatures deal **25% less damage** than their tamed counterparts (on Scarred difficulty):

| Wild Move | Damage |
|-----------|--------|
| Ember Slash | 9 |
| Tide Crash | 10 |
| Vine Lash | 8 |
| Quick Strike | 4 |

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
- Difficulty modifies capture chance (+20% Ashen, -20% Hollowed/Broken)
- **On Success**: Creature joins your team with current HP and any scars
- **On Failure**: Lose the souls, enemy attacks

Wild creatures have stat variance (+/- 5 HP, +/- 2 stamina) and a 10% chance to already have a scar.

### Scarring System

When a creature faints, it gains a permanent scar:

| Scar | Normal | Hard |
|------|--------|------|
| Fractured | -5 max HP | -7 max HP |
| Hesitant | -2 max Stamina | -3 max Stamina |
| Flinching | Quick Strike loses priority | Same |

A creature with **3+ scars** becomes **Hollowed** (1 scar on Broken difficulty):
- All stats reduced by 25%
- Damage dealt reduced by 25%

Scars are permanent (except on Ashen difficulty where they heal at bonfires).

### Souls Economy

- Defeat wild creatures: +12 souls
- Defeat the boss: +100 souls
- **Death**: Drop souls at death location (amount varies by difficulty)
- **Recovery**: Return to the spot to reclaim dropped souls
- **Banking**: Rest at a bonfire to bank souls safely

Banked souls are safe (except on Hollowed/Broken difficulty).

### Bonfires

Bonfires are checkpoints and rest points. Press E to open the menu:

- **Rest**: Heal (except Broken), bank souls, respawn enemies, auto-save
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

*"Another walks the ash. Another seeks the flame beyond."*

The Obsidian Hound guards the keep. A two-phase fight:

### Phase 1
- HP: 60 (75 on Hollowed/Broken)
- Moves: Ember Slash, Flame Wall (burn), Guard
- Trigger Phase 2 at 30% HP

### Phase 2
- Gains +20 HP (none on Broken)
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

Inspired by classic handheld era games:
- 56x56 pixel tiles
- Pixel art sprites (player, creatures, environment)
- Press Start 2P font
- GBC color palette
- Animated bonfires with flickering flames

## UI Elements

- **Difficulty icon** (top left): Shows current difficulty during gameplay
- **Gear button** (top right): Opens pause menu
- **? button** (top right): Opens help overlay
- **Speaker button** (top right): Toggle chiptune music on/off

## Technical Details

- **Framework**: React 18 (via CDN)
- **Audio**: Tone.js for procedural chiptune synthesis
- **Rendering**: Inline SVG for pixel art sprites
- **State Management**: useReducer for game state
- **Storage**: localStorage for saves and preferences
- **Single File**: Everything in index.html, no build required

## Tips

1. **Bank often** - Rest at bonfires to save souls before risky fights
2. **Type advantage matters** - 1.5x damage is significant
3. **Watch stamina** - Being Winded makes you vulnerable
4. **Weaken before binding** - Low HP means high capture chance
5. **Guard the big hits** - Half damage can save your creature
6. **Build a balanced team** - Cover your type weaknesses
7. **Scars are forever** - Sometimes running is the right call
8. **Examine everything** - The world has stories to tell
9. **Save at bonfires** - Auto-save protects your progress
10. **Choose your difficulty** - No shame in Ashen mode

## Credits

Created by **Zamphere**

Built with **Claude Code**, React, and Tone.js

*"The bonfire wars are over. But the flames still burn. And someone must carry them forward."*
