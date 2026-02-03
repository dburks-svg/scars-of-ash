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

- **Single file:** Everything in index.html, no build step
- **Framework:** React 18 via CDN
- **Audio:** Tone.js for procedural chiptune synthesis
- **Rendering:** Inline SVG for pixel art sprites
- **State:** useReducer for game state
- **Storage:** localStorage for saves, preferences, statistics
- **Deployment:** Vercel (auto-deploy from main branch)

---

## Core Systems

### Battle System

- Turn-based state machine (player turn → enemy turn → resolution)
- Stamina is battle-only (does NOT affect exploration)
- Actions cost stamina (2-8 SP per move)
- Guard: Reduce incoming damage, recover +4 SP
- Rest: Skip turn, recover +12 SP
- Stamina below 5 = "Winded" (+25% damage taken)
- Fleeing: Available once per encounter

### Type Chart (8 Types)

| Type | Strong Against | Weak Against |
|------|----------------|--------------|
| Fire | Grass, Steel | Water |
| Water | Fire | Grass, Light |
| Grass | Water | Fire |
| Dark | Light, Spirit | Light |
| Light | Dark | Dark, Water |
| Steel | Spirit | Fire |
| Spirit | Beast | Dark, Steel |
| Beast | Grass | Spirit |

- Super effective: 1.5x damage
- Not very effective: 0.5x damage

### Scar System (Core Differentiator)

When a creature faints (0 HP), it gains a permanent scar based on how it died:

| Scar | Effect | Trigger |
|------|--------|---------|
| Fractured | Max HP reduced | Any KO |
| Hesitant | Max Stamina reduced | KO while exhausted |
| Flinching | Loses priority | KO'd by faster enemy |
| Burned | Fire vulnerability +25% | KO'd by fire |
| Frostbitten | Speed reduced | KO'd by ice/water |
| Cursed | Dark DoT each turn | KO'd by dark type |
| Blinded | Accuracy reduced | KO'd by light type |
| Cracked | Defense reduced | KO'd by physical move |
| Withered | Healing received reduced | KO'd while poisoned |
| Haunted | Random flinch chance | KO'd by spirit type |

**Scar Thresholds:**
- 3-4 scars: "Scarred" (cosmetic indicator)
- 5-6 scars: "Hollowed" (all stats at 75%, visual change)

Hollowed creatures remain usable. They are trophies of failure, not trash.

### Souls Economy

- **Earn:** Defeating creatures (more from bosses)
- **Carried souls:** At risk, drop on death
- **Banked souls:** Safe at bonfire
- **Deposit:** At bonfire, move carried → banked (presets: 20, 50, KEEP 20, ALL)
- **Withdraw:** At bonfire, move banked → carried (presets: 20, 50, KEEP 20, ALL)
- **Soul Bind:** Capture costs 20 carried souls, low HP = higher success
- **Die before recovery:** Carried souls lost forever

### Bonfire Mechanics

- Rest: Full heal, full stamina, enemies respawn
- Save: Auto-save on rest
- Bank: Deposit carried souls (safe)
- Withdraw: Pull banked souls to carried (at risk)
- Warp: Fast travel to unlocked bonfires (future)

### Exploration

- Tile-based movement (WASD or tap adjacent tile on mobile)
- Random encounters on grass tiles
- Fixed encounters (visible enemies on map)
- Lore pickups: Environmental storytelling via examine
- Shortcuts: One-way unlocks that persist

---

## Content (Browser Prototype)

### Creatures
- Cindrath (Fire) - Starter
- Thornwick (Grass) - Starter
- Marshveil (Water) - Wild
- Umbravine (Dark) - Wild
- Solrath (Light) - Wild

### Areas
- Ashen Path (starter)
- Fallen Keep (dungeon)
- The Hollow Deep (post-game)

### Bosses
- Keeper Varek (Fire, Act 1)
- Hollow Warden (Dark/Light, post-game)

### Difficulty Modes
- Ashen (normal)
- Scarred (hard)
- Hollowed (very hard)
- Broken (permadeath)

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

## Constants (Keep in Sync)

```javascript
const SOUL_BIND_COST = 20;
const WINDED_THRESHOLD = 5;
const WINDED_DAMAGE_BONUS = 0.25;
const SUPER_EFFECTIVE = 1.5;
const NOT_EFFECTIVE = 0.5;
const HOLLOWED_STAT_MULT = 0.75;
const SCAR_THRESHOLD_SCARRED = 3;
const SCAR_THRESHOLD_HOLLOWED = 5;
```

If SOUL_BIND_COST changes, update withdraw/deposit preset buttons.

---

## Architecture Decisions

| Decision | Rationale |
|----------|-----------|
| Single HTML file | No build step = anyone can fork and run |
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
├── index.html      # THE ENTIRE GAME
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