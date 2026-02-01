# Scars of Ash

*The flame remembers.*

A browser-based game that fuses creature collecting with Dark Souls-inspired mechanics. Cute monsters. Grim consequences.

**[Play Now](https://ashbound.vercel.app)**

## How to Play

Open `index.html` in a modern browser. No build step required.

A help overlay appears on first launch with all game mechanics. Click the **?** button anytime to review.

## Controls

### Exploration

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

### Battle

| Key | Action |
|-----|--------|
| 1-4 | Select move (shown on buttons) |
| B | Soul Bind attempt |
| Tab | Cycle through team members |

Click buttons in battle to select moves.

## Features

### Sound Effects
Procedural chiptune effects powered by Tone.js:
- Hit sounds scale with damage (light/medium/heavy)
- Critical hit ascending arpeggio
- Creature faint descending tones
- Soul bind whoosh and success/fail sounds
- Status effect sounds (burn/poison/chill)
- Victory fanfare and death music

### Combat Juice
- **Damage numbers** float and fade above creatures
- **Screen shake** on heavy hits (15+ damage)
- **Critical flash** on type-effective attacks
- **HP bar pulse** when health is low
- **Stamina warnings** with color changes

### Status Effects

| Status | Inflicted By | Effect | Duration |
|--------|--------------|--------|----------|
| Burn | Fire moves | 3 damage/turn | 2 turns |
| Poison | Grass moves (Vine Lash) | 2 damage/turn | 3 turns |
| Chill | Water moves (Tide Crash) | 25% chance to skip turn | 2 turns |

### Creature Nicknames
After capturing a creature, you can give it a nickname. Names appear in battle logs and menus, making the experience more personal.

### Pre-Battle Preview
When encountering wild creatures in grass:
- See the creature's type before engaging
- Choose to **FIGHT** or **FLEE**
- Fleeing marks that grass as "alerted" - can't flee twice from the same spot

### Run Statistics
Access from the title screen's **STATS** button:
- Total runs, deaths, and scars
- Clears by difficulty with best times
- Creatures captured
- Achievements:
  - **Unscarred** - Beat the game with 0 scars
  - **Collector** - Capture all 5 creature types
  - **True Hollow** - Defeat the Hollow Warden on Broken
  - **Speedrunner** - Clear in under 20 minutes

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
- Boss has no phase transition HP recovery
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
- Team creatures (HP, stamina, scars, nicknames)
- Souls (carried and banked)
- Boss defeated status
- Hollow Warden defeated status
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
Press **X** to examine points of interest across all maps:

**Ashen Path:**
- Old signposts pointing to places that no longer exist
- Collapsed Healer's Sanctuary signs faded to gray
- Abandoned packs from those who didn't escape
- Scorched trees burned for purification

**Fallen Keep:**
- Scratched warnings about the keeper
- Broken Soul Spheres, dozens of them
- The Keeper's cold quarters
- A trophy wall with unfinished names

**The Hollow Deep:**
- Shattered altars where light faded
- Hollow roots drinking remaining light
- Echoes of keepers past
- The final gate between endings and beginnings

### Keeper Varek
The first boss has expanded dialogue:
- **Phase 1**: *"Another walks the ash. I was a guardian once. Now I am a door."*
- **Phase 2**: *"You fight like the ones before... Let me show you why they stopped coming."*
- **On Death**: *"Rest now. The bonfire remembers you."*

### The Hollow Warden
The post-game boss:
- **Phase 1**: *"You carry his flame. But flames die in the deep."*
- **Phase 2**: *"Light and dark... Let me show you what happens when they merge."*
- **Victory**: *"The cycle continues. You have walked through shadow and emerged."*

## Game Systems

### Creatures

Choose from three starters, with two more available in the post-game:

| Creature | Type | HP | Stamina | Signature Move |
|----------|------|-----|---------|----------------|
| Cindrath | Fire | 45 | 20 | Ember Slash (12 DMG) |
| Marshveil | Water | 50 | 18 | Tide Crash (14 DMG, can chill) |
| Thornwick | Grass | 40 | 24 | Vine Lash (10 DMG, can poison) |
| Umbravine | Dark | 42 | 22 | Shadow Lash (12 DMG) |
| Solrath | Light | 48 | 18 | Radiant Burst (11 DMG) |

**Dark/Light creatures only appear in The Hollow Deep.**

### Special Moves

| Creature | Unique Move | Effect |
|----------|-------------|--------|
| Umbravine | Void Drain | 8 DMG, drains 4 stamina, heals 4 HP |
| Solrath | Purifying Light | Removes all status effects, heals 10 HP |

### Type Effectiveness (5x5 Chart)

|  | Fire | Water | Grass | Dark | Light |
|--|------|-------|-------|------|-------|
| **Fire** | 1.0 | 0.5 | 1.5 | 1.0 | 0.5 |
| **Water** | 1.5 | 1.0 | 0.5 | 1.0 | 1.0 |
| **Grass** | 0.5 | 1.5 | 1.0 | 0.5 | 1.0 |
| **Dark** | 1.0 | 1.0 | 1.5 | 1.0 | 1.5 |
| **Light** | 1.5 | 1.0 | 1.0 | 0.5 | 1.0 |

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
- **On Success**: Creature joins your team with current HP and any scars; you can name it
- **On Failure**: Lose the souls, enemy attacks

Wild creatures have stat variance (+/- 5 HP, +/- 2 stamina) and a 10% chance to already have a scar. Deep creatures have +5 HP, +2 Stamina base and 20% pre-scar chance.

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
- Defeat Keeper Varek: +100 souls
- Defeat Hollow Warden: +200 souls
- **Death**: Drop souls at death location (amount varies by difficulty)
- **Recovery**: Return to the spot to reclaim dropped souls (now with visible SOULS label)
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
W K P P P W    K = Boss room (Hollow Deep entrance after victory)
W W E W W W    E = Exit to Ashen Path
```

### The Hollow Deep (Post-Game)
Unlocks after defeating Keeper Varek. Contains Dark and Light type creatures.

```
W W W W W W W W
W P P P G P P W    E = Entrance (from Fallen Keep)
W P W W W W P W    G = Grass (Dark/Light encounters)
W P W B W P P W    B = Bonfire
W P P P P W G W    K = Hollow Warden
W W W P W W P W    P = Path
W K P P P P P W    W = Wall
W W W E W W W W
```

## Boss Fights

### Keeper Varek (Obsidian Hound)

*"Another walks the ash. Another seeks the flame beyond."*

The Obsidian Hound guards the keep. A two-phase fight:

#### Phase 1
- HP: 60 (75 on Hollowed/Broken)
- Moves: Ember Slash, Flame Wall (burn), Guard
- Trigger Phase 2 at 30% HP

#### Phase 2
- Gains +20 HP (none on Broken)
- **Scorched Earth**: Arena deals 2 damage per turn to non-Fire types
- New move: **Desperation Fang** (20 damage, 5 recoil)
- More aggressive AI targets low-HP players

### The Hollow Warden (Post-Game Boss)

*"You carry his flame. But flames die in the deep."*

A corrupted guardian that merges light and dark. Harder than Varek.

#### Phase 1 (Dark type)
- HP: 70 (87 on Hollowed/Broken)
- Moves: Shadow Lash, Void Grasp (drains 4 stamina), Guard
- Trigger Phase 2 at 30% HP

#### Phase 2 (Dark/Light hybrid)
- Gains +25 HP (none on Broken)
- **Fractured Aura**: Arena deals 2 damage per turn to non-Dark and non-Light types
- New moves: **Shattered Light** (14 damage), **Desperate Void** (18 damage, 6 recoil)

## Audio

Click the speaker icon to toggle chiptune music:

- **Exploration**: Melancholic 8-bit melody (Am-Em-F-G progression)
- **Bonfire**: Peaceful arpeggios, the only safe place
- **Battle**: Driving C minor theme, high stakes
- **Boss Phase 2**: Frantic chromatic tension, dissonant harmonies
- **Victory/Game Over**: Somber resolution

Sound effects include:
- Hit sounds (light/medium/heavy based on damage)
- Critical hit arpeggio
- Status effect sounds (burn/poison/chill)
- Soul bind attempt and result sounds
- Bonfire crackling
- Menu clicks

Music is muted by default. Click to enable.

## Visual Style

Inspired by classic handheld era games:
- 56x56 pixel tiles (scales on larger screens)
- Pixel art sprites (player, creatures, environment)
- Press Start 2P font
- GBC color palette
- Animated bonfires with flickering flames
- Floating damage numbers
- Screen shake on heavy hits
- Status effect badges

## Accessibility

- **Keyboard controls** for all battle actions (1-4, B, Tab)
- **Focus rings** visible on keyboard navigation
- **Type icons** displayed alongside type names
- **Color-coded status effects** with text labels
- **Stamina warnings** with visual and color indicators

## UI Elements

- **Difficulty icon** (top left): Shows current difficulty during gameplay
- **Gear button** (top right): Opens pause menu
- **? button** (top right): Opens help overlay
- **Speaker button** (top right): Toggle chiptune music on/off
- **STATS button** (title screen): View run statistics and achievements

## Technical Details

- **Framework**: React 18 (via CDN)
- **Audio**: Tone.js for procedural chiptune synthesis
- **Rendering**: Inline SVG for pixel art sprites
- **State Management**: useReducer for game state
- **Storage**: localStorage for saves, preferences, and statistics
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
11. **Check the type preview** - You can flee encounters once
12. **Use keyboard shortcuts** - 1-4 for moves, B for bind
13. **Name your creatures** - Makes the journey more personal
14. **Explore The Hollow Deep** - Dark/Light types await post-game

## Credits

Created by **BBAD Games**

Built with **Claude Code**, React, and Tone.js

*"The flame remembers."*
