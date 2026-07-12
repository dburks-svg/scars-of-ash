# Scars of Ash

*The flame remembers.*

A browser-based game that fuses creature collecting with Dark Souls-inspired mechanics. Cute monsters. Grim consequences.

**[Play Now](https://scars-of-ash.vercel.app)**

## How to Play

No build step required. Click the above link and enjoy. If you have any issues or comments leave them below.

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
| 1-5 | Select move (shown on buttons) |
| B | Soul Bind attempt |
| Tab | Cycle through team members |

Click buttons in battle to select moves. Every creature carries a 5-move kit.

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

### Team Management (No Storage, No Mercy)
- **5 creature maximum** - Your active team is your only team
- **Full team capture** - Must release one creature permanently to make room
- **No take-backs** - Released creatures are gone. Like your 401k in 2008.
- **Let it escape** - Can't choose? The new capture flees. Souls wasted. Classic.

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
- Character name and appearance
- Current map and position
- Team creatures (HP, stamina, scars, kindled stats, nicknames)
- Souls (carried and banked)
- Boss and Hollow Warden defeated status
- Dropped souls location
- Labyrinth clues found and secret door state
- Titles earned and active title
- Difficulty and play time

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

**The Labyrinth:**
- A stone sentinel pointing at something
- An inscription that trails off mid-thought
- Bones arranged with intent
- A torch that burns without wind
- Read them all. The maze is listening.

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

### Character Creation

Every run begins by forging a survivor:

- **Name**: Appears in battle logs, boss dialogue, your ghost, and the memorial
- **Appearance**: MALE, FEMALE, or OTHER, each with its own sprite

Then choose a difficulty and one of three starters. The prologue plays on your first run.

### Creatures

Choose from three starters, with two more available in the post-game:

| Creature | Type | HP | Stamina | Speed | Signature Move |
|----------|------|-----|---------|-------|----------------|
| Cindrath | Fire | 45 | 20 | 8 | Ember Slash (12 DMG, can burn) |
| Marshveil | Water | 50 | 18 | 5 | Tide Crash (14 DMG, can chill) |
| Thornwick | Grass | 40 | 24 | 9 | Vine Lash (10 DMG, can poison) |
| Umbravine | Dark | 42 | 22 | 7 | Shadow Lash (12 DMG) |
| Solrath | Light | 48 | 18 | 6 | Radiant Burst (11 DMG) |

**Dark/Light creatures appear in The Hollow Deep; all five species roam The Labyrinth.**

### Special Moves

Every kit is 5 moves: signature attack, Quick Strike, a unique move, Guard, and Rest.

| Creature | Unique Move | Effect |
|----------|-------------|--------|
| Cindrath | Immolate | 22 DMG, 6 recoil self-damage. Fire pays in blood |
| Marshveil | Tidal Mend | Removes all status effects, heals 12 HP |
| Thornwick | Thornwall | 9 DMG, +12 bonus if the enemy is guarding or winding up a telegraph |
| Umbravine | Void Drain | 8 DMG, drains 4 stamina, heals 4 HP |
| Solrath | Purifying Light | Removes all status effects, heals 10 HP |

Immolate's recoil can knock out your own creature. If the enemy survives, that death earns a scar like any other.

### Speed and Initiative

Every creature has a speed stat. When you pick a move:

- **Priority moves** (Quick Strike, Guard) always resolve first, no matter what
- For everything else, speeds are compared: **a faster enemy acts before your move resolves**
- Ties go to you
- Scars shift speed: Frostbitten is -2, Flinching's upside is +2

Slow, tanky Marshveil (speed 5) eats hits before it swings. Thornwick (speed 9) outruns everything on the surface.

### Type Effectiveness

Five types, plus a sixth (DarkLight) worn only by the Hollow Warden in its final phase:

|  | Fire | Water | Grass | Dark | Light | DarkLight |
|--|------|-------|-------|------|-------|-----------|
| **Fire** | 1.0 | 0.5 | 1.5 | 1.0 | 0.5 | 0.75 |
| **Water** | 1.5 | 1.0 | 0.5 | 1.0 | 1.0 | 1.0 |
| **Grass** | 0.5 | 1.5 | 1.0 | 0.5 | 1.0 | 0.75 |
| **Dark** | 1.0 | 1.0 | 1.5 | 1.0 | 1.5 | 1.25 |
| **Light** | 1.5 | 1.0 | 1.0 | 0.5 | 1.0 | 1.25 |
| **DarkLight** | 1.25 | 1.0 | 1.25 | 0.75 | 0.75 | 1.0 |

Rows are the attacker, columns the defender.

### Stamina System

Every move costs stamina. Manage it carefully:

| Move | Cost | Effect |
|------|------|--------|
| Signature Attack | 5-7 SP | High damage, chance of status |
| Unique Move | 6-8 SP | See Special Moves above |
| Quick Strike | 3 SP | Low damage, priority (goes first) |
| Guard | 2 SP | Take 50% damage, priority |
| Rest | 0 SP | Recover 12 stamina, skip turn |

- Both sides regenerate 4 stamina at the start of each round
- Dropping below 5 stamina causes **Winded** status (damage taken x1.25); a warning shows below 8

### Soul Binding (Capture System)

Capture wild creatures to build your team:

- **Cost**: 20 souls per attempt
- **Max Team Size**: 5 creatures
- **Capture Chance** (based on enemy HP):
  - Below 10% HP: 90% chance
  - Below 25% HP: 60% chance
  - At or below 50% HP: 30% chance
  - Above 50% HP: 10% chance
- Difficulty modifies capture chance (+20% Ashen, -20% Hollowed/Broken)
- **On Success**: Creature joins your team with current HP and any scars; you can name it
- **On Failure**: Lose the souls, enemy attacks

Wild creatures have stat variance (+/- 5 HP, +/- 2 stamina) and a 10% chance to already have a scar. Hollow Deep creatures have +5 HP, +2 Stamina base and a 20% pre-scar chance. Labyrinth creatures have +8 HP, +4 Stamina and a 30% pre-scar chance.

### The Release Mechanic (Sophie's Choice, Monster Edition)

Your team maxes out at 5 creatures. No storage. No PC boxes. No "I'll come back for you later." This isn't a daycare.

When you capture a creature with a full team:

- **Release Screen**: Choose which creature to release *forever*
- **Confirmation**: "Release [Name] forever? They will not return."
- **Let It Escape**: Can't decide? The new capture escapes. Souls already spent. Thanks for playing.

There's no storage system. Your active team IS your only team. When that Marshveil with three scars stares at you from the release screen, remember: you did this. Every scar. Every choice. Every goodbye.

*"This is a game that breaks you."* We meant it.

### Scarring System

When a creature faints, it gains a permanent scar chosen by **how it died**. Ten scars exist, and every one carries a wound and an upside. The flame takes, but the flame remembers.

| Scar | Earned By | Wound | Upside |
|------|-----------|-------|--------|
| Haunted | KO'd by a boss | 10% chance to freeze in fear | +15% damage vs bosses |
| Withered | KO'd while poisoned | Healing received halved | Immune to poison |
| Burned | KO'd by fire or burn damage | +25% damage taken from fire | Immune to burn |
| Frostbitten | KO'd by water or while chilled | -2 speed | Immune to chill |
| Cursed | KO'd by dark | Loses 1 HP each round | +25% damage vs dark |
| Blinded | KO'd by light | 15% chance to miss | +25% damage vs light |
| Hesitant | KO'd while winded | -2 max Stamina (-3 on Hollowed/Broken) | Rest recovers +2 more |
| Flinching | KO'd by a faster enemy | Attacks lose priority (Guard keeps it) | +2 speed |
| Cracked | KO'd by a plain physical blow | +10% damage taken | +10% damage dealt |
| Fractured | Any KO (the fallback) | -5 max HP (-7 on Hollowed/Broken) | +15% souls earned |

A death can match several causes; the most story-specific scar wins, and duplicates fall through to the next. Fractured is the only scar that stacks.

A creature with **3+ scars** becomes **Hollowed** (1 scar on Broken difficulty):
- Max HP and Stamina reduced by 25%
- Damage dealt reduced by 25%

But look at that upside column again. A Hollowed creature with Cracked, Haunted, and Cursed is a build, not a corpse. Trophies of failure, not trash.

Scars are permanent (except on Ashen difficulty where they heal at bonfires).

### Souls Economy

- Defeat wild creatures: +12 to 28 souls (deeper areas pay more; Fractured creatures earn +15% each)
- Defeat Keeper Varek: +100 souls
- Defeat Hollow Warden: +200 souls
- **Death**: Drop carried souls at death location (50% on Ashen, all of them otherwise; Hollowed/Broken drop banked souls too)
- **Recovery**: Return to the spot to reclaim dropped souls (visible SOULS marker)
- **Banking**: Deposit at a bonfire to keep souls safe

Banked souls are safe (except on Hollowed/Broken difficulty). Die again before recovering a drop and the old stash is gone.

### Ghosts and the Fallen

- **Your ghost**: The site of your last death is haunted. A faded figure bearing the fallen player's name lingers on that tile in later runs (never on permadeath).
- **Hall of the Fallen**: Runs that end on Broken difficulty are carved into a permanent memorial: name, appearance, play time, where they fell, and the scars their team carried. The last 20 fallen are remembered. View it from the difficulty screen.

### Kindle (Permanent Growth)

The bonfire gives as well as takes. **KINDLE** spends carried souls to permanently strengthen a creature:

- **+2 max HP** or **+1 max Stamina** per kindle
- First kindle costs **25 souls**; each purchase on that creature raises the price by **15** (25, 40, 55, ...)
- **10 kindles maximum** per creature (HP and Stamina share the cap)
- Gains apply immediately and persist through saves, scars, and Hollowing

Kindle is the game's only upward progression and the main reason to carry souls besides Soul Bind. Carried souls fund it, and carried souls drop when you die. Choose your moment.

### Titles

Deeds are remembered. Earned titles display beside your name:

| Title | Earned By |
|-------|-----------|
| Ashen Seeker | Finding the hidden chamber in The Labyrinth |
| Unscarred | Completing a run with zero scars |
| First Flame | Playing during the demo period |

### Bonfires

Bonfires are checkpoints and rest points. Press E to open the menu:

- **Rest**: Heal and cleanse (no healing on Broken), respawn enemies, auto-save
- **Deposit**: Move carried souls to the bank (presets: 20, 50, KEEP 20, ALL)
- **Withdraw**: Pull banked souls back into your pockets (at risk again)
- **Kindle**: Spend carried souls on permanent stat growth
- **Switch Active**: Change which creature leads in battle
- **Leave**: Close menu and continue exploring

You respawn at the last bonfire used after death.

## Maps

Four areas, each larger and meaner than the last.

### Ashen Path (6x8)
The starting area. Tall grass hides wild creatures. Find the gate to the Fallen Keep.

```
W W W W W W
W B P P G W    B = Bonfire (start)
W P W P P W    G = Grass (encounters)
W G P P W W    P = Path
W P W G P W    W = Wall
W P P P P W    X = Gate to Keep
W W P W W W
W W X W W W
```

### Fallen Keep (8x12)
The boss dungeon. Navigate the torchlit corridors to reach Keeper Varek.

```
W W W W W W W W
W T P P P P T W    T = Torch (decoration)
W P P W W P P W    B = Bonfire
W P W W W W P W    K = Boss room (becomes the
W P P P P P P W        Hollow Deep entrance
W W W P P W W W        after victory)
W T P P P P T W    E = Exit to Ashen Path
W P P B P P P W
W P W W W W P W
W P P P K P P W
W W W P P W W W
W W W E W W W W
```

Reaching the upper halls unlocks a shortcut that persists.

### The Hollow Deep (10x16, Post-Game)
Unlocks after defeating Keeper Varek. A void dungeon holding Dark and Light creatures only, six grass patches, a bonfire, the Hollow Warden (K), and, in the far corner, a gate (X) to The Labyrinth. Entrance (E) leads back to the Fallen Keep.

### The Labyrinth (20x20, Post-Hollow Deep)
A sprawling maze beyond the Hollow Deep's final gate. The deepest and cruelest area:

- All five creature species roam its grass, stronger (+8 HP, +4 Stamina) and more often pre-scarred (30%)
- A bonfire burns at its heart
- Four lore objects hide in its corridors. Examine all four and something shifts: a **secret door** grinds open in a wall that was never quite solid
- Step through the hidden chamber to earn the **Ashen Seeker** title
- The sealed Ashen Gate at the top of the maze waits for a future chapter

## Boss Fights

### Telegraphed Attacks (Learn or Bleed)

Every boss has a signature attack it announces one turn early. The boss winds up, a warning flashes on screen, and the next turn the blow lands at **2x damage**. **Guard during the wind-up** and it's blunted to a quarter instead. Three-turn cooldown, so you always get room to breathe between verdicts.

This is the fight you can learn. Ignore the warning once, and only once.

### Keeper Varek (Obsidian Hound)

*"Another walks the ash. Another seeks the flame beyond."*

The Obsidian Hound guards the keep. Speed 7. A two-phase fight:

#### Phase 1
- HP: 60 (75 on Hollowed/Broken)
- Moves: Ember Slash, Flame Wall (burn), Guard
- **Telegraph: CINDER MAW** (16 base damage, doubled on release). *"The Obsidian Hound rears back, flame building in its throat..."*
- Trigger Phase 2 at 30% HP

#### Phase 2
- Gains +20 HP (none on Broken)
- **Scorched Earth**: Arena deals 2 damage per turn to non-Fire types
- New move: **Desperation Fang** (20 damage, 5 recoil)
- More aggressive AI targets low-HP players

### The Hollow Warden (Post-Game Boss)

*"You carry his flame. But flames die in the deep."*

A corrupted guardian that merges light and dark. Speed 6. Harder than Varek.

#### Phase 1 (Dark type)
- HP: 70 (87 on Hollowed/Broken)
- Moves: Shadow Lash, Void Grasp (drains 4 stamina), Guard
- **Telegraph: HOLLOW VERDICT** (18 base damage, doubled on release). *"The Hollow Warden raises its broken blade. The air goes silent..."*
- Trigger Phase 2 at 30% HP

#### Phase 2 (DarkLight hybrid)
- Gains +25 HP (none on Broken)
- Type shifts to DarkLight (check the type chart; your resistances change mid-fight)
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

- **Keyboard controls** for all battle actions (1-5, B, Tab)
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
- **No Build Step**: Three static files (index.html, gamedata.js, styles.css)

### Dev Dashboard (For Tinkerers)

Add `?dev=true` to the URL, then press the backtick key to open a live balance dashboard. Every tunable value in the game (combat math, scars, souls, kindle costs, boss telegraphs, creature stats, the type chart itself) can be adjusted in real time, exported to JSON, imported back, or reset. A DEV badge appears whenever values have been modified.

## Tips

1. **Bank often** - Rest at bonfires to save souls before risky fights
2. **Type advantage matters** - 1.5x damage is significant
3. **Watch stamina** - Being Winded makes you vulnerable
4. **Weaken before binding** - Low HP means high capture chance
5. **Guard the big hits** - Half damage can save your creature
6. **Build a balanced team** - Cover your type weaknesses (you've got 5 slots, use them)
7. **Scars are forever** - Sometimes running is the right call
8. **Examine everything** - The world has stories to tell
9. **Save at bonfires** - Auto-save protects your progress
10. **Choose your difficulty** - No shame in Ashen mode
11. **Check the type preview** - You can flee encounters once
12. **Use keyboard shortcuts** - 1-5 for moves, B for bind
13. **Name your creatures** - Makes the goodbye harder. You're welcome.
14. **Explore The Hollow Deep** - Dark/Light types await post-game
15. **Think before you capture** - Full team means someone's getting voted off the island
16. **Respect the wind-up** - When the warning flashes, GUARD. 2x becomes 0.25x
17. **Mind the speed stat** - A faster enemy hits before your slow move lands. Quick Strike ignores that
18. **Kindle your veterans** - Permanent HP and stamina beats souls rotting in your pocket
19. **Read every scar** - The upside might be the build you were missing
20. **Examine everything in The Labyrinth** - Four clues, one wall that lies

## Credits

Created by **BBADAHS Games**
*🍺🔥 We build games that break you. 🔥🍺*
