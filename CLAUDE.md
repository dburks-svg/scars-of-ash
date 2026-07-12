# Scars of Ash

*The flame remembers.*

A creature-collector RPG where death leaves permanent marks. Pokemon meets Dark Souls.

**Studio:** BBADAHS Games (Built By A Dad And His Son)  
**Tagline:** "We build games that break you."

---

## North Star

> "Ship a polished, single-player-first GBC creature RPG where scars matter, then expand only if players demand it."

**Priority Order (When Things Get Noisy):**
1. Battle system + scars feel amazing
2. Exploration feels deliberate and moody
3. One area feels complete
4. One boss is memorable
5. One demo earns trust

---

## Rail Receipt (Required Before Code)

Before writing any code, echo back in plain English:
- [ ] Which files will be touched
- [ ] Which constraints from this document apply
- [ ] What could break if done wrong
- [ ] How you will verify it worked

Keep it to 5-8 lines max. This kills "I forgot" bugs.

If the prompt is vague or ambiguous, ask for clarification. Do not guess. Do not "improve" things that were not requested.

---

## BBADAHS Games Engineering Principles

- "Build what is right, not what is easy"
- Clarity over chaos. If something is unclear, fix it.
- Digital Feng Shui required. Clean, readable, organized code.
- Long-term thinking. Build for decades, not quarters.
- Radical accountability. Own mistakes, fix them, learn.
- Document as you go. Future engineers must understand in seconds.
- No shortcuts. No hype chasing. No chaos shipped.
- No silent failures. Operations complete fully or fail loudly with user-visible feedback.
- Never let the user believe something worked when it didn't.
- TODO lists are a license for the lazy. See it. Fix it. Ship it.

---

## Team Structure

| Role | Who | Responsibilities |
|------|-----|------------------|
| Lead Dev / Architect | Dad | Systems design, project management, pixel art |
| Creative Director | Son | Defines "what done looks like", scope decisions, game feel |
| Composer / Audio | Son | Original chiptune OST, sound effects |
| Code Implementation | Claude Code | All code, systems, bug fixes |
| QA Council | Son's Squad | Playtests, bug reports, balance feedback |

---

## Tech Stack

- **No build step:** Three static files (index.html + gamedata.js + styles.css), open and play
- **Framework:** React 18 via CDN
- **Audio:** Tone.js for procedural chiptune synthesis
- **Rendering:** Inline SVG for pixel art sprites
- **State:** useReducer for game state
- **Storage:** localStorage for saves, preferences, statistics
- **Deployment:** Vercel (auto-deploy from main branch)

---

## Core Systems

## FILE ARCHITECTURE (Feb 2, 2026)
- styles.css: CSS only. Do not modify unless fixing a visual bug.
- gamedata.js: All game data, audio, sprites, utilities, save system. Regular script (not Babel).
- index.html: React components and game engine only. Babel-transpiled.
- NEVER combine these files. The split is intentional for context window management.

### Character Creation

First screen of every run. Both fields are required:

- **Name:** Free text, trimmed. Appears in battle logs, dialogue, ghosts, and the memorial.
- **Appearance:** MALE, FEMALE, or OTHER. Each has a distinct sprite silhouette.

Flow: character create → difficulty select → starter select (Cindrath, Marshveil, or Thornwick) → prologue (first run only) → exploration.

### Battle System

- Turn-based with speed initiative (see below)
- Stamina is battle-only (does NOT affect exploration)
- Player moves cost 0-8 SP; move kits are 5 moves, selected with keys 1-5 (B = Soul Bind, Tab = switch creature)
- Both sides recover +4 SP at the start of each round
- Guard: 2 SP, halves incoming damage, priority (always resolves first)
- Rest: 0 SP, skip turn, recover +12 SP (8 base + the 4 per-round tick; Hesitant scar adds +2)
- Stamina below 5 = "Winded" (damage taken x1.25); warning shown below 8
- Fleeing: Offered at the encounter preview (FIGHT or FLEE). Costs `souls.fleeCost` carried souls (5, capped at what you carry) and marks that grass tile as alerted, so you cannot flee the same spot twice

### Speed / Initiative

Every creature has a `speed` stat. When the player picks a non-priority move, effective speeds are compared: if the enemy is strictly faster, it acts BEFORE the player's chosen move resolves. Ties go to the player. Moves flagged `priority: true` (Quick Strike, Guard) always resolve first regardless of speed.

Effective speed = species speed + scar modifiers (Frostbitten -2, Flinching upside +2), minimum 1. Fallback for creatures with no speed: 5 (`combat.defaultSpeed`).

| Creature | Speed |
|----------|-------|
| Thornwick | 9 |
| Cindrath | 8 |
| Umbravine | 7 |
| Solrath | 6 |
| Marshveil | 5 |

Wild variants are each 1 slower than the starter version. Bosses: Obsidian Hound 7, Hollow Warden 6.

The Flinching scar strips priority from ATTACKS only. Guard always keeps priority, or telegraphed boss blows would become unbraceable.

### Type Chart (5 Types, Plus darklight)

Five real types: fire, water, grass, dark, light. A sixth type, `darklight`, is used ONLY by the Hollow Warden in phase 2. There is no Steel, Spirit, or Beast.

Multipliers from TYPE_CHART in gamedata.js (attacker row vs defender column):

| Attacker | vs Fire | vs Water | vs Grass | vs Dark | vs Light | vs DarkLight |
|----------|---------|----------|----------|---------|----------|--------------|
| Fire | 1.0 | 0.5 | 1.5 | 1.0 | 0.5 | 0.75 |
| Water | 1.5 | 1.0 | 0.5 | 1.0 | 1.0 | 1.0 |
| Grass | 0.5 | 1.5 | 1.0 | 0.5 | 1.0 | 0.75 |
| Dark | 1.0 | 1.0 | 1.5 | 1.0 | 1.5 | 1.25 |
| Light | 1.5 | 1.0 | 1.0 | 0.5 | 1.0 | 1.25 |
| DarkLight | 1.25 | 1.0 | 1.25 | 0.75 | 0.75 | 1.0 |

- Super effective: 1.5x. Not very effective: 0.5x. DarkLight matchups use the 0.75x and 1.25x steps.

### Scar System (Core Differentiator)

When a creature faints (0 HP), it gains a permanent scar chosen by HOW it died, not randomly. Every scar carries a wound AND an upside: Hollowed creatures are builds, not trash.

| Scar | Cause | Wound | Upside |
|------|-------|-------|--------|
| Haunted | KO'd by a boss | 10% chance to freeze in fear | +15% damage vs bosses |
| Withered | KO'd while poisoned | Healing received halved | Cannot be poisoned again |
| Burned | KO'd by fire or burn damage | +25% damage taken from fire | Cannot be burned again |
| Frostbitten | KO'd by water or while chilled | -2 speed | Cannot be chilled again |
| Cursed | KO'd by dark or darklight | Loses 1 HP each round | +25% damage vs dark |
| Blinded | KO'd by light or darklight | 15% chance to miss | +25% damage vs light |
| Hesitant | KO'd while winded | -2 max Stamina (-3 on Hollowed/Broken) | Rest recovers +2 more |
| Flinching | KO'd by a faster enemy | Attack priority moves lose priority | +2 speed |
| Cracked | KO'd by a plain physical blow | +10% damage taken | +10% damage dealt |
| Fractured | Any KO (universal fallback) | -5 max HP (-7 on Hollowed/Broken) | +15% souls earned |

Selection order (getScarForDeathCause): Haunted > Withered > Burned > Frostbitten > Cursed > Blinded > Hesitant > Flinching > Cracked > Fractured. A death can match several causes; duplicates fall through to the next cause. Fractured is the only scar that stacks.

**Scar Thresholds:**
- 3+ scars: damage dealt x0.75 (`combat.scarredDamageThreshold` / `scarredDamagePenalty`)
- Hollowed at `difficulty.hollowedThreshold` scars: 3 on Ashen/Scarred/Hollowed, 1 on Broken. Max HP and max Stamina x0.75, sprite changes.
- Scars heal at the bonfire ONLY on Ashen difficulty.

Wild creatures can spawn pre-scarred (10% surface, 20% Hollow Deep, 30% Labyrinth); those scars are random because the death that marked them is unknown.

### Souls Economy

- **Earn:** Defeating creatures (12-28 for wilds, 40/55/70 for sentinels, 100/200 for bosses; Fractured upside adds +15% each)
- **Carried souls:** At risk, drop on death
- **Banked souls:** Safe at bonfire (except Hollowed/Broken, where death drops banked too)
- **Deposit:** At bonfire, move carried → banked (presets: 20, 50, KEEP 20, ALL)
- **Withdraw:** At bonfire, move banked → carried (presets: 20, 50, KEEP 20, ALL)
- **Soul Bind:** Capture costs 20 carried souls, low HP = higher success
- **Kindle:** Permanent stat growth bought with carried souls (see below)
- **Door tolls:** Boss doors demand a one-time carried-souls payment (see Sentinels & Sealed Doors)
- **Fleeing:** Costs `souls.fleeCost` carried souls per flee
- **Die before recovery:** A new drop replaces the old one. The previous stash is lost forever

### Sentinels & Sealed Doors (Encounter Stakes)

Added July 2026 after playtests showed every fight was skippable, so the scar/souls loop never engaged. Avoidance stays possible for grass; it just stops being free.

**Sentinels** (`SENTINELS` in gamedata.js, one per wild area, standing on that map's `N` tile):

| Area | Sentinel | Type | HP/SP | Speed | Souls | Scar |
|------|----------|------|-------|-------|-------|------|
| Ashen Path (2,6) | Ember Sentinel | Fire | 34/16 | 7 | 40 | Cracked |
| Hollow Deep (3,12) | Hollow Sentinel | Dark | 44/18 | 6 | 55 | Cursed |
| Labyrinth (7,16) | Lumen Sentinel | Light | 50/18 | 6 | 70 | Blinded |

- Visible on the map (scarred sprite), blocks its tile; walking into it starts battle directly. No FIGHT/FLEE preview, so it cannot be fled
- Defeating OR soul-binding it marks it dead permanently (`state.sentinelsDefeated`, persisted); the tile then behaves as path
- Each sits on a true chokepoint (verified by BFS): Ashen gate, the only entry to the Hollow Deep boss row, and the Labyrinth's only route north of the spawn corridor
- Map edits sealed the old side routes; the Hollow Warden can no longer be bypassed to reach the Labyrinth (previously the gate at (8,14) had no boss check)
- Sentinel scars must NOT use maxHp/maxStamina effects (their stats are final values; those effects would double-apply)

**Sealed boss doors** (`souls.gateTolls`): stepping at the boss `K` tile with the toll unpaid blocks movement and shows a message. With enough carried souls the step pays the toll (once, persisted in `state.tollsPaid`, survives death); the NEXT step starts the fight, so paying and fighting are two deliberate moves. Fallen Keep 50, Hollow Deep 100. A toll of 0 disables the gate.

### Kindle (Permanent Progression)

New bonfire option. Spend CARRIED souls to permanently raise one creature's stats:

- +2 max HP or +1 max Stamina per kindle (`souls.kindle.hpPerKindle` / `staminaPerKindle`)
- Cost starts at 25 souls and rises 15 per purchase on that creature (25, 40, 55, ...)
- Capped at 10 kindles per creature (HP and Stamina share the counter)
- The gain applies immediately and is stored as raw values on the creature, so past purchases survive config changes

This is the game's only source of upward progression and the main souls sink besides capture.

### Boss Telegraphs

Each boss has a signature telegraphed attack:

| Boss | Telegraph | Base Damage |
|------|-----------|-------------|
| Obsidian Hound | Cinder Maw | 16 |
| Hollow Warden | Hollow Verdict | 18 |

- The boss winds up for one full turn: log text plus an on-screen warning banner ("INCOMING - GUARD!")
- Next enemy turn the blow lands at 2x damage (`bosses.telegraphDamageMult`)
- Guarding during the wind-up reduces it to 0.25x (`bosses.telegraphGuardReduction`); the standard guard halving is stripped so it does not double-dip
- 3-turn cooldown after release (`bosses.telegraphCooldown`); fights open at cooldown 2 so one normal exchange teaches the baseline first

### Death, Ghosts, and the Fallen

- **Dropped souls:** On a full team wipe, carried souls drop at the death tile (50% on Ashen, 100% otherwise; Hollowed/Broken add banked souls). A visible marker shows on the map. Walk over it to recover.
- **Ghost:** The last death (any non-permadeath run) is stored in localStorage. A faded figure with the fallen player's name appears at that tile if the name differs from the current run.
- **Hall of the Fallen:** Broken-difficulty deaths are recorded to a permanent memorial (last 20 runs: name, appearance, play time, final map, team, and scar count). Viewable from the difficulty screen.

### Titles

Unlockable titles, displayed next to the player name:

| Title | Unlock |
|-------|--------|
| Ashen Seeker | Found the hidden chamber in the Labyrinth |
| Unscarred | Completed a run with zero scars |
| First Flame | Played during the demo period |

Earned titles and the active title persist in the save.

### Bonfire Mechanics

- Rest: Full heal, full stamina, cleanse statuses, enemies respawn (Broken: no HP heal)
- Save: Auto-save on rest
- Bank: Deposit carried souls (safe)
- Withdraw: Pull banked souls to carried (at risk)
- Kindle: Spend carried souls on permanent stat growth
- Switch Active: Change which creature leads
- Warp: Fast travel to unlocked bonfires (future)

### Exploration

- Tile-based movement (WASD or tap a tile; BFS pathfinding walks multi-tile taps)
- Random encounters on grass tiles (60% chance, with a pre-battle FIGHT/FLEE preview; fleeing costs souls)
- One mandatory sentinel fight per wild area on an `N` tile (see Sentinels & Sealed Doors)
- Lore pickups: Environmental storytelling via examine (X key)
- Shortcuts: One-way unlocks that persist
- The Labyrinth hides a secret door (see Areas)

### Dev Dashboard

- Open the game with `?dev=true` in the URL, then toggle the dashboard with the backtick key
- Slide-in panel with tabs: COMBAT, STATUS, SCARS, DIFFICULTY, BOSSES, SOULS, ENCOUNTERS, CREATURES, TYPE CHART, SIMULATOR
- Live-tunes `window.GAME_CONFIG` and mutates STARTERS, WILD_CREATURES, BOSS, TYPE_CHART, SCAR_TYPES, and DIFFICULTIES in place. No reload needed
- Export copies the full tuning state to the clipboard as JSON; Import applies pasted JSON
- Reset per tab or reset all from startup snapshots; a DEV badge appears whenever values have been modified

---

## Content (Browser Prototype)

### Creatures
- Cindrath (Fire, speed 8) - Starter
- Marshveil (Water, speed 5) - Starter
- Thornwick (Grass, speed 9) - Starter
- Umbravine (Dark, speed 7) - Wild (Hollow Deep, Labyrinth)
- Solrath (Light, speed 6) - Wild (Hollow Deep, Labyrinth)

### Signature Moves (each kit is 5 moves: signature, Quick Strike, unique, Guard, Rest)
- Cindrath: Immolate (8 SP, 22 damage, 6 recoil self-damage; the recoil can KO you, and that death always scars, even on a trade kill. Trade with your last creature and you still lose the run.)
- Marshveil: Tidal Mend (6 SP, cleanse all statuses + heal 12; Withered halves the heal)
- Thornwick: Thornwall (6 SP, 9 damage, +12 bonus if the enemy is guarding or winding up a telegraph)
- Umbravine: Void Drain (8 SP, 8 damage, drains 4 enemy stamina, heals 4 HP)
- Solrath: Purifying Light (7 SP, cleanse all statuses + heal 10)

### Areas
- Ashen Path (6x8) - Starter area, tutorial
- Fallen Keep (8x12) - Boss dungeon
- The Hollow Deep (10x16) - Post-game, Dark/Light encounters only
- The Labyrinth (20x20) - Post-Hollow-Deep maze. Entered from the Hollow Deep's exit gate, which now sits behind the Hollow Warden (the old sentinel-free bypass is walled off). Contains its own bonfire, mixed encounters of all 5 species (+8 HP, +4 SP over base, 30% pre-scarred, 25 souls each), 4 lore clues, and a secret door at (15,9) that only opens after examining all 4 clues: Stone Sentinel (16,1), Faded Inscription (1,7), Scattered Remains (4,15), Restless Flame (17,17). Walking through the revealed door awards the Ashen Seeker title. The Ashen Gate at the top row is sealed (future content).

### Bosses
- Obsidian Hound (Fire, Fallen Keep) - The fight is introduced as "Keeper Varek blocks your path!"; telegraph: Cinder Maw
- Hollow Warden (Dark, shifts to DarkLight in phase 2; The Hollow Deep) - telegraph: Hollow Verdict

Both bosses transition at 30% HP (phase heal: Hound +20, Warden +25, skipped on Broken) and gain an arena effect (Scorched Earth / Fractured Aura, 2 damage per turn to off-type creatures).

### Difficulty Modes
- Ashen (easy)
- Scarred (normal, default)
- Hollowed (hard)
- Broken (nightmare, permadeath)

---

## Design Philosophy

- **Every battle matters:** Scars create stakes in random encounters
- **Failure is interesting:** Scarred roster tells a story
- **Difficulty is intentional, not tedious:** Challenging but fair
- **Story is environmental:** Lore through examine, not cutscenes
- **GBC aesthetic:** 16-32 colors, pixel art, chiptune audio
- **Dark but not edgy:** Melancholic, not grimdark
- **Fun for kids and adults:** No gore, just consequences

---

## UI/UX Rules

- Mobile-first touch controls (tap to move, tap to select)
- Keyboard still works on desktop
- Minimum touch target: 48x48px
- Show CARRIED and BANKED souls separately
- Battle header shows only CARRIED (what's at risk)
- Confirmation prompt for "ALL" withdraw/deposit
- Hide keyboard hints on touch devices

---

## Constants (Single Source of Truth: GAME_CONFIG)

All tunable balance values live in `window.GAME_CONFIG` at the top of gamedata.js. The Dev Dashboard mutates this object live at runtime, and `window.GAME_CONFIG_DEFAULTS` holds a frozen snapshot for reset. Do NOT scatter magic numbers; read from GAME_CONFIG.

```javascript
window.GAME_CONFIG = {
  combat: {
    guardDamageReduction: 0.5,   // Guard halves incoming damage
    windedDamageBonus: 1.25,     // Winded creatures take x1.25 damage
    windedThreshold: 5,          // SP below this = Winded
    windedWarningThreshold: 8,   // UI warning below this
    scarredDamagePenalty: 0.75,  // 3+ scars: damage dealt x0.75
    scarredDamageThreshold: 3,
    staminaPerTurnRecovery: 4,   // Both sides, every round
    restRecoveryBase: 8,         // Rest = base + per-turn tick = 12
    minimumDamage: 1,
    defaultSpeed: 5
  },
  statusFx: {
    burnDuration: 2, burnDamage: 3,
    poisonDuration: 3, poisonDamage: 2,
    chillDuration: 2, chillSkipChance: 0.25,
    scorchedEarthDamage: 2, fracturedAuraDamage: 2
  },
  scars: { hollowedStatMultiplier: 0.75 },
  souls: {
    bindCost: 20, maxTeamSize: 5,
    captureBrackets: { under10: 90, under25: 60, under50: 30, over50: 10 },
    captureCapMin: 5, captureCapMax: 95,
    fleeCost: 5,                 // Souls taken when fleeing an encounter preview
    gateTolls: { fallenKeep: 50, hollowDeep: 100 },  // One-time boss door tolls
    kindle: { baseCost: 25, costStep: 15, hpPerKindle: 2, staminaPerKindle: 1, maxKindles: 10 }
  },
  wildEncounters: {
    grassEncounterChance: 0.6,
    hpVarianceRange: 11, staminaVarianceRange: 5,
    surface:   { hpFloor: 20, staminaFloor: 10, preScarChance: 0.1 },
    deep:      { hpFloor: 25, staminaFloor: 12, preScarChance: 0.2, hpBonus: 5, staminaBonus: 2,
                 umbravineChance: 0.6, umbravineSouls: 25, solrathSouls: 28 },
    labyrinth: { hpFloor: 30, staminaFloor: 14, preScarChance: 0.3, hpBonus: 8, staminaBonus: 4, souls: 25 }
  },
  bosses: {
    phaseTransitionThreshold: 0.3,
    obsidianHoundPhaseHeal: 20, hollowWardenPhaseHeal: 25,
    telegraphDamageMult: 2.0, telegraphGuardReduction: 0.25, telegraphCooldown: 3
  },
  fallbacks: { drainHp: 4, drainStamina: 4, healAmount: 10 }
};
```

If `souls.bindCost` changes, update the withdraw/deposit preset buttons. Legacy aliases `MAX_TEAM_SIZE` and `BIND_COST` still exist in gamedata.js but GAME_CONFIG is authoritative. `SCAR_THRESHOLD_HOLLOWED = 5` in gamedata.js is used only for sprite selection; the gameplay Hollowed threshold comes from `difficulty.hollowedThreshold` (3, or 1 on Broken).

---

## Architecture Decisions

| Decision | Rationale |
|----------|-----------|
| No build step (3 static files) | Anyone can fork and run; the 3-file split manages context windows |
| Tone.js in-browser | AudioContext warnings are expected, fixed by tap-to-start |
| Babel in-browser | Console warning intentional, no-build simplicity |
| localStorage only | Saves are local, no cloud sync in prototype |
| Stamina is battle-only | Exploration is free, tension from encounters and scars |
| Tile-based movement | GBC aesthetic, simpler collision, faster implementation |

---

## Known Console Warnings (Ignore)

- `ScriptProcessorNode is deprecated` - Tone.js internal
- `AudioContext was not allowed to start` - Fixed by tap-to-start
- `In-browser Babel transformer` - Intentional, no build step

---

## File Structure

```
scars-of-ash/
├── index.html      # React components + game engine (Babel-transpiled)
├── gamedata.js     # Game data, GAME_CONFIG, audio, sprites, utilities, save system
├── styles.css      # CSS only
├── assets/         # Logo and sprite images
├── CLAUDE.md       # This file
├── README.md       # Public-facing docs
├── LICENSE         # BBADAHS Games license
└── docs/
    └── ROADMAP.md  # Production roadmap
```

---

## Commit Format

```
type: short description

- Detail 1
- Detail 2
```

**Types:** feat, fix, balance, ui, audio, docs, refactor

**Examples:**
- `feat: add soul deposit system at bonfires`
- `fix: scar not applying on fire KO`
- `balance: reduce Keeper Varek phase 2 damage`

---

## Before You Ship

- [ ] Playtest the change yourself
- [ ] Check mobile touch controls
- [ ] Verify save/load works
- [ ] Console has no new errors (warnings ok)
- [ ] Commit message follows format

---

## What This Is

A playable prototype to validate:
- Scar system feels meaningful
- Battle loop is engaging
- Souls economy creates tension
- GBC aesthetic works

## What This Is Not

- The final game (that's soa-godot)
- Fully balanced
- Content complete
- Multiplayer ready

---

*The flame remembers. So should this document.*