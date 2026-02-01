import React, { useState, useReducer, useEffect, useCallback } from 'react';

// ============= GAME DATA =============

const STARTERS = {
  cindrath: {
    id: 'cindrath',
    name: 'Cindrath',
    type: 'fire',
    maxHp: 45,
    maxStamina: 20,
    moves: [
      { name: 'Ember Slash', cost: 6, damage: 12, priority: false },
      { name: 'Quick Strike', cost: 3, damage: 5, priority: true },
      { name: 'Guard', cost: 2, damage: 0, effect: 'guard' },
      { name: 'Rest', cost: 0, damage: 0, effect: 'rest' }
    ]
  },
  marshveil: {
    id: 'marshveil',
    name: 'Marshveil',
    type: 'water',
    maxHp: 50,
    maxStamina: 18,
    moves: [
      { name: 'Tide Crash', cost: 7, damage: 14, priority: false },
      { name: 'Quick Strike', cost: 3, damage: 5, priority: true },
      { name: 'Guard', cost: 2, damage: 0, effect: 'guard' },
      { name: 'Rest', cost: 0, damage: 0, effect: 'rest' }
    ]
  },
  thornwick: {
    id: 'thornwick',
    name: 'Thornwick',
    type: 'grass',
    maxHp: 40,
    maxStamina: 24,
    moves: [
      { name: 'Vine Lash', cost: 5, damage: 10, priority: false },
      { name: 'Quick Strike', cost: 3, damage: 5, priority: true },
      { name: 'Guard', cost: 2, damage: 0, effect: 'guard' },
      { name: 'Rest', cost: 0, damage: 0, effect: 'rest' }
    ]
  }
};

const WILD_CREATURES = {
  wildCindrath: {
    id: 'wildCindrath',
    name: 'Wild Cindrath',
    type: 'fire',
    maxHp: 30,
    maxStamina: 15,
    souls: 12,
    moves: [
      { name: 'Ember Slash', cost: 6, damage: 12, priority: false },
      { name: 'Quick Strike', cost: 3, damage: 5, priority: true },
      { name: 'Rest', cost: 0, damage: 0, effect: 'rest' }
    ]
  },
  wildMarshveil: {
    id: 'wildMarshveil',
    name: 'Wild Marshveil',
    type: 'water',
    maxHp: 30,
    maxStamina: 15,
    souls: 12,
    moves: [
      { name: 'Tide Crash', cost: 7, damage: 14, priority: false },
      { name: 'Quick Strike', cost: 3, damage: 5, priority: true },
      { name: 'Rest', cost: 0, damage: 0, effect: 'rest' }
    ]
  },
  wildThornwick: {
    id: 'wildThornwick',
    name: 'Wild Thornwick',
    type: 'grass',
    maxHp: 30,
    maxStamina: 15,
    souls: 12,
    moves: [
      { name: 'Vine Lash', cost: 5, damage: 10, priority: false },
      { name: 'Quick Strike', cost: 3, damage: 5, priority: true },
      { name: 'Rest', cost: 0, damage: 0, effect: 'rest' }
    ]
  }
};

const BOSS = {
  obsidianHound: {
    id: 'obsidianHound',
    name: 'Obsidian Hound',
    type: 'fire',
    maxHp: 60,
    maxStamina: 22,
    souls: 100,
    moves: [
      { name: 'Ember Slash', cost: 6, damage: 12, priority: false },
      { name: 'Flame Wall', cost: 8, damage: 10, effect: 'burn' },
      { name: 'Guard', cost: 2, damage: 0, effect: 'guard' }
    ],
    phase2Moves: [
      { name: 'Ember Slash', cost: 6, damage: 12, priority: false },
      { name: 'Flame Wall', cost: 8, damage: 10, effect: 'burn' },
      { name: 'Desperation Fang', cost: 10, damage: 20, effect: 'recoil', recoilDamage: 5 },
      { name: 'Guard', cost: 2, damage: 0, effect: 'guard' }
    ]
  }
};

const TYPE_CHART = {
  fire: { fire: 1, water: 0.5, grass: 1.5 },
  water: { fire: 1.5, water: 1, grass: 0.5 },
  grass: { fire: 0.5, water: 1.5, grass: 1 }
};

const SCAR_TYPES = [
  { id: 'fractured', name: 'Fractured', effect: 'maxHp', value: -5, description: '-5 max HP' },
  { id: 'hesitant', name: 'Hesitant', effect: 'maxStamina', value: -2, description: '-2 max Stamina' },
  { id: 'flinching', name: 'Flinching', effect: 'noPriority', description: 'Quick Strike no longer goes first' }
];

// Ashen Path map (8x6)
const ASHEN_PATH = [
  ['W', 'W', 'W', 'W', 'W', 'W', 'W', 'W'],
  ['W', 'B', 'P', 'G', 'G', 'P', 'P', 'W'],
  ['W', 'P', 'W', 'W', 'G', 'W', 'P', 'W'],
  ['W', 'P', 'P', 'P', 'P', 'P', 'G', 'W'],
  ['W', 'W', 'W', 'W', 'P', 'W', 'P', 'W'],
  ['W', 'W', 'W', 'W', 'X', 'W', 'W', 'W']
];

// Fallen Keep map (6x8)
const FALLEN_KEEP = [
  ['W', 'W', 'W', 'W', 'W', 'W'],
  ['W', 'P', 'P', 'P', 'P', 'W'],
  ['W', 'P', 'W', 'W', 'P', 'W'],
  ['W', 'P', 'W', 'P', 'P', 'W'],
  ['W', 'P', 'P', 'P', 'W', 'W'],
  ['W', 'W', 'W', 'P', 'W', 'W'],
  ['W', 'K', 'P', 'P', 'P', 'W'],
  ['W', 'W', 'E', 'W', 'W', 'W']
];

// ============= STYLES =============

const styles = {
  container: {
    fontFamily: '"Courier New", monospace',
    backgroundColor: '#1a1a1a',
    color: '#d4d4d4',
    minHeight: '100vh',
    padding: '10px',
    boxSizing: 'border-box'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px 15px',
    backgroundColor: '#2a2a2a',
    borderBottom: '2px solid #444',
    marginBottom: '10px'
  },
  souls: {
    color: '#ffd700',
    fontWeight: 'bold'
  },
  mapContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '10px'
  },
  grid: {
    display: 'grid',
    gap: '2px',
    backgroundColor: '#333',
    padding: '2px',
    border: '3px solid #555'
  },
  tile: {
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    position: 'relative'
  },
  teamStatus: {
    backgroundColor: '#2a2a2a',
    padding: '10px',
    border: '2px solid #444'
  },
  creatureStatus: {
    marginBottom: '8px',
    padding: '8px',
    backgroundColor: '#333',
    border: '1px solid #555'
  },
  hpBar: {
    height: '12px',
    backgroundColor: '#444',
    marginTop: '4px',
    position: 'relative'
  },
  hpFill: {
    height: '100%',
    transition: 'width 0.3s'
  },
  staminaBar: {
    height: '8px',
    backgroundColor: '#444',
    marginTop: '4px'
  },
  staminaFill: {
    height: '100%',
    backgroundColor: '#4a9',
    transition: 'width 0.3s'
  },
  battleContainer: {
    padding: '15px',
    backgroundColor: '#1a1a1a'
  },
  battleCreature: {
    padding: '15px',
    backgroundColor: '#2a2a2a',
    border: '2px solid #444',
    marginBottom: '10px'
  },
  battleAnimation: {
    height: '100px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#222',
    margin: '10px 0',
    border: '2px solid #333',
    fontSize: '14px',
    textAlign: 'center',
    padding: '10px'
  },
  moveButtons: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '8px',
    marginTop: '10px'
  },
  moveButton: {
    padding: '12px',
    backgroundColor: '#3a3a3a',
    border: '2px solid #555',
    color: '#d4d4d4',
    cursor: 'pointer',
    fontFamily: '"Courier New", monospace',
    fontSize: '12px',
    textAlign: 'left'
  },
  moveButtonDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed'
  },
  starterSelect: {
    textAlign: 'center',
    padding: '40px 20px'
  },
  starterCard: {
    display: 'inline-block',
    width: '140px',
    padding: '20px 15px',
    margin: '10px',
    backgroundColor: '#2a2a2a',
    border: '3px solid #444',
    cursor: 'pointer',
    verticalAlign: 'top'
  },
  scar: {
    display: 'inline-block',
    padding: '2px 6px',
    backgroundColor: '#5a2a2a',
    color: '#ff6b6b',
    fontSize: '10px',
    marginLeft: '4px',
    border: '1px solid #833'
  },
  status: {
    display: 'inline-block',
    padding: '2px 6px',
    fontSize: '10px',
    marginLeft: '4px'
  },
  winded: {
    backgroundColor: '#5a4a2a',
    color: '#ffaa00',
    border: '1px solid #a83'
  },
  burn: {
    backgroundColor: '#5a2a1a',
    color: '#ff6600',
    border: '1px solid #a63'
  },
  victory: {
    textAlign: 'center',
    padding: '60px 20px',
    backgroundColor: '#1a2a1a'
  },
  gameOver: {
    textAlign: 'center',
    padding: '60px 20px',
    backgroundColor: '#2a1a1a'
  },
  button: {
    padding: '15px 30px',
    backgroundColor: '#3a3a3a',
    border: '3px solid #666',
    color: '#d4d4d4',
    cursor: 'pointer',
    fontFamily: '"Courier New", monospace',
    fontSize: '14px',
    marginTop: '20px'
  },
  typeIcon: {
    fontSize: '24px'
  },
  log: {
    backgroundColor: '#222',
    padding: '10px',
    marginTop: '10px',
    border: '1px solid #444',
    maxHeight: '80px',
    overflowY: 'auto',
    fontSize: '11px'
  }
};

// ============= HELPER FUNCTIONS =============

const getTypeColor = (type) => {
  switch (type) {
    case 'fire': return '#e63';
    case 'water': return '#38c';
    case 'grass': return '#4a4';
    default: return '#888';
  }
};

const getTypeIcon = (type) => {
  switch (type) {
    case 'fire': return '🔥';
    case 'water': return '💧';
    case 'grass': return '🌿';
    default: return '⚪';
  }
};

const getTileColor = (tile) => {
  switch (tile) {
    case 'W': return '#2a2a2a';
    case 'P': return '#4a4a4a';
    case 'G': return '#3a4a3a';
    case 'B': return '#5a4a3a';
    case 'X': return '#4a4a5a';
    case 'K': return '#5a3a3a';
    case 'E': return '#4a4a5a';
    default: return '#333';
  }
};

const getTileSymbol = (tile) => {
  switch (tile) {
    case 'W': return '';
    case 'P': return '';
    case 'G': return '~';
    case 'B': return '🔥';
    case 'X': return '⛩';
    case 'K': return '💀';
    case 'E': return '⛩';
    default: return '';
  }
};

const calculateDamage = (move, attacker, defender, attackerCreature, defenderCreature) => {
  if (move.damage === 0) return 0;
  let damage = move.damage;
  const effectiveness = TYPE_CHART[attackerCreature.type][defenderCreature.type];
  damage = Math.floor(damage * effectiveness);

  if (defender.isGuarding) {
    damage = Math.floor(damage * 0.5);
  }

  if (attacker.winded) {
    damage = Math.floor(damage * 1.25);
  }

  // Hollowed penalty
  if (attacker.scars && attacker.scars.length >= 3) {
    damage = Math.floor(damage * 0.75);
  }

  return Math.max(1, damage);
};

const getRandomWild = () => {
  const wilds = Object.values(WILD_CREATURES);
  return wilds[Math.floor(Math.random() * wilds.length)];
};

const getRandomScar = () => {
  return SCAR_TYPES[Math.floor(Math.random() * SCAR_TYPES.length)];
};

const applyScars = (creature, baseData) => {
  let maxHp = baseData.maxHp;
  let maxStamina = baseData.maxStamina;
  let hasFlinching = false;

  if (creature.scars) {
    creature.scars.forEach(scar => {
      if (scar.effect === 'maxHp') maxHp += scar.value;
      if (scar.effect === 'maxStamina') maxStamina += scar.value;
      if (scar.effect === 'noPriority') hasFlinching = true;
    });
  }

  // Hollowed penalty
  if (creature.scars && creature.scars.length >= 3) {
    maxHp = Math.floor(maxHp * 0.75);
    maxStamina = Math.floor(maxStamina * 0.75);
  }

  return { maxHp: Math.max(1, maxHp), maxStamina: Math.max(1, maxStamina), hasFlinching };
};

// ============= INITIAL STATE =============

const initialState = {
  screen: 'starter', // starter, exploration, battle, victory, gameOver
  currentMap: 'ashenPath',
  playerPos: { x: 1, y: 1 },
  team: [],
  activeCreatureIndex: 0,
  souls: 0,
  bankedSouls: 0,
  droppedSouls: null,
  enemy: null,
  enemyCreature: null,
  battleLog: [],
  turnPhase: 'player', // player, enemy, result
  shortcutUnlocked: false,
  bossDefeated: false,
  bossPhase: 1,
  arenaEffect: null,
  grassEncounters: [
    { x: 3, y: 1, active: true },
    { x: 4, y: 1, active: true },
    { x: 4, y: 2, active: true },
    { x: 6, y: 3, active: true }
  ],
  lastBonfire: { map: 'ashenPath', pos: { x: 1, y: 1 } }
};

// ============= REDUCER =============

function gameReducer(state, action) {
  switch (action.type) {
    case 'SELECT_STARTER': {
      const starterData = STARTERS[action.starter];
      const newCreature = {
        ...starterData,
        hp: starterData.maxHp,
        stamina: starterData.maxStamina,
        scars: [],
        winded: false,
        isGuarding: false,
        burnTurns: 0
      };
      return {
        ...state,
        screen: 'exploration',
        team: [newCreature]
      };
    }

    case 'MOVE_PLAYER': {
      const map = state.currentMap === 'ashenPath' ? ASHEN_PATH : FALLEN_KEEP;
      const newX = state.playerPos.x + action.dx;
      const newY = state.playerPos.y + action.dy;

      if (newY < 0 || newY >= map.length || newX < 0 || newX >= map[0].length) {
        return state;
      }

      const tile = map[newY][newX];

      if (tile === 'W') return state;

      let newState = { ...state, playerPos: { x: newX, y: newY } };

      // Check for grass encounter
      if (tile === 'G' && state.currentMap === 'ashenPath') {
        const encounter = state.grassEncounters.find(
          e => e.x === newX && e.y === newY && e.active
        );
        if (encounter && Math.random() < 0.6) {
          const wildData = getRandomWild();
          newState = {
            ...newState,
            screen: 'battle',
            enemy: {
              ...wildData,
              hp: wildData.maxHp,
              stamina: wildData.maxStamina,
              winded: false,
              isGuarding: false
            },
            enemyCreature: wildData,
            battleLog: [`A ${wildData.name} appeared!`],
            turnPhase: 'player',
            currentEncounter: { x: newX, y: newY }
          };
        }
      }

      // Check for gate/entrance
      if (tile === 'X') {
        newState = {
          ...newState,
          currentMap: 'fallenKeep',
          playerPos: { x: 2, y: 7 }
        };
      }

      if (tile === 'E' && state.currentMap === 'fallenKeep') {
        newState = {
          ...newState,
          currentMap: 'ashenPath',
          playerPos: { x: 4, y: 4 }
        };
      }

      // Check for boss room
      if (tile === 'K' && !state.bossDefeated) {
        const bossData = BOSS.obsidianHound;
        newState = {
          ...newState,
          screen: 'battle',
          enemy: {
            ...bossData,
            hp: bossData.maxHp,
            stamina: bossData.maxStamina,
            winded: false,
            isGuarding: false
          },
          enemyCreature: bossData,
          battleLog: ['Keeper Varek blocks your path!', '"Another challenger... They all fall the same."'],
          turnPhase: 'player',
          bossPhase: 1,
          arenaEffect: null,
          isBossFight: true
        };
      }

      // Check for soul pickup
      if (state.droppedSouls &&
          state.droppedSouls.map === state.currentMap &&
          state.droppedSouls.pos.x === newX &&
          state.droppedSouls.pos.y === newY) {
        newState = {
          ...newState,
          souls: state.souls + state.droppedSouls.amount,
          droppedSouls: null,
          battleLog: [`Recovered ${state.droppedSouls.amount} souls!`]
        };
      }

      // Unlock shortcut at midpoint
      if (state.currentMap === 'fallenKeep' && newY <= 3) {
        newState.shortcutUnlocked = true;
      }

      return newState;
    }

    case 'INTERACT_BONFIRE': {
      const team = state.team.map(creature => {
        const baseData = STARTERS[creature.id];
        const { maxHp, maxStamina } = applyScars(creature, baseData);
        return {
          ...creature,
          hp: creature.hp === 0 ? 1 : maxHp,
          stamina: maxStamina,
          winded: false,
          burnTurns: 0
        };
      });

      const grassEncounters = state.grassEncounters.map(e => ({ ...e, active: true }));

      return {
        ...state,
        team,
        grassEncounters,
        bankedSouls: state.bankedSouls + state.souls,
        souls: 0,
        lastBonfire: { map: state.currentMap, pos: { ...state.playerPos } }
      };
    }

    case 'SELECT_MOVE': {
      const activeCreature = state.team[state.activeCreatureIndex];
      const move = action.move;

      if (move.cost > activeCreature.stamina) return state;

      let newTeam = [...state.team];
      let newEnemy = { ...state.enemy };
      let log = [...state.battleLog];
      let turnPhase = 'enemy';

      // Handle Rest
      if (move.effect === 'rest') {
        newTeam[state.activeCreatureIndex] = {
          ...activeCreature,
          stamina: Math.min(activeCreature.stamina + 8 + 4,
            applyScars(activeCreature, STARTERS[activeCreature.id]).maxStamina),
          winded: false,
          isGuarding: false
        };
        log.push(`${activeCreature.name} rests and recovers stamina.`);
        return { ...state, team: newTeam, battleLog: log, turnPhase };
      }

      // Handle Guard
      if (move.effect === 'guard') {
        newTeam[state.activeCreatureIndex] = {
          ...activeCreature,
          stamina: activeCreature.stamina - move.cost,
          isGuarding: true
        };
        log.push(`${activeCreature.name} takes a defensive stance.`);

        // Check winded
        if (activeCreature.stamina - move.cost < 5) {
          newTeam[state.activeCreatureIndex].winded = true;
          log.push(`${activeCreature.name} is winded!`);
        }

        return { ...state, team: newTeam, battleLog: log, turnPhase };
      }

      // Handle Attack
      const damage = calculateDamage(move, activeCreature, newEnemy,
        STARTERS[activeCreature.id], state.enemyCreature);

      newEnemy.hp = Math.max(0, newEnemy.hp - damage);
      newEnemy.isGuarding = false;

      const effectiveness = TYPE_CHART[STARTERS[activeCreature.id].type][state.enemyCreature.type];
      let effectText = '';
      if (effectiveness > 1) effectText = " It's super effective!";
      if (effectiveness < 1) effectText = " It's not very effective...";

      log.push(`${activeCreature.name} used ${move.name}! ${damage} damage.${effectText}`);

      // Burn effect
      if (move.effect === 'burn') {
        newTeam[state.activeCreatureIndex] = {
          ...activeCreature,
          burnTurns: 2
        };
        log.push(`${activeCreature.name} is burning!`);
      }

      newTeam[state.activeCreatureIndex] = {
        ...newTeam[state.activeCreatureIndex],
        stamina: activeCreature.stamina - move.cost,
        isGuarding: false
      };

      // Check winded
      if (newTeam[state.activeCreatureIndex].stamina < 5) {
        newTeam[state.activeCreatureIndex].winded = true;
        log.push(`${activeCreature.name} is winded!`);
      }

      // Check boss phase transition
      if (state.isBossFight && state.bossPhase === 1 &&
          newEnemy.hp <= state.enemyCreature.maxHp * 0.3 && newEnemy.hp > 0) {
        newEnemy.hp += 20;
        log.push('"You fight like the ones before. They all fell too."');
        log.push('Obsidian Hound transforms! The arena ignites with scorched earth!');
        return {
          ...state,
          team: newTeam,
          enemy: newEnemy,
          battleLog: log,
          bossPhase: 2,
          arenaEffect: 'scorchedEarth',
          turnPhase
        };
      }

      // Check enemy defeated
      if (newEnemy.hp <= 0) {
        const soulsEarned = state.enemyCreature.souls || 10;
        log.push(`${state.enemyCreature.name} defeated! Gained ${soulsEarned} souls.`);

        if (state.isBossFight) {
          return {
            ...state,
            screen: 'victory',
            souls: state.souls + soulsEarned,
            bossDefeated: true,
            team: newTeam,
            battleLog: log
          };
        }

        // Disable this encounter
        const grassEncounters = state.grassEncounters.map(e =>
          e.x === state.currentEncounter?.x && e.y === state.currentEncounter?.y
            ? { ...e, active: false }
            : e
        );

        return {
          ...state,
          screen: 'exploration',
          souls: state.souls + soulsEarned,
          enemy: null,
          enemyCreature: null,
          team: newTeam,
          battleLog: log,
          grassEncounters
        };
      }

      return { ...state, team: newTeam, enemy: newEnemy, battleLog: log, turnPhase };
    }

    case 'ENEMY_TURN': {
      let newTeam = [...state.team];
      let newEnemy = { ...state.enemy };
      let log = [...state.battleLog];
      let activeCreature = newTeam[state.activeCreatureIndex];
      const activeBase = STARTERS[activeCreature.id];
      const { maxHp, maxStamina } = applyScars(activeCreature, activeBase);

      // Passive stamina recovery for player
      activeCreature = {
        ...activeCreature,
        stamina: Math.min(activeCreature.stamina + 4, maxStamina)
      };

      // Apply burn damage to player
      if (activeCreature.burnTurns > 0) {
        activeCreature.hp = Math.max(0, activeCreature.hp - 3);
        activeCreature.burnTurns--;
        log.push(`${activeCreature.name} takes 3 burn damage!`);
      }

      // Apply scorched earth damage
      if (state.arenaEffect === 'scorchedEarth' && activeBase.type !== 'fire') {
        activeCreature.hp = Math.max(0, activeCreature.hp - 2);
        log.push(`Scorched Earth burns ${activeCreature.name} for 2 damage!`);
      }

      newTeam[state.activeCreatureIndex] = activeCreature;

      // Check if player creature fainted from DOT
      if (activeCreature.hp <= 0) {
        return handleCreatureFaint(state, newTeam, newEnemy, log);
      }

      // Enemy stamina recovery
      newEnemy.stamina = Math.min(newEnemy.stamina + 4, state.enemyCreature.maxStamina);
      newEnemy.winded = false;

      // Enemy AI
      let availableMoves = (state.bossPhase === 2 ?
        BOSS.obsidianHound.phase2Moves : state.enemyCreature.moves)
        .filter(m => m.cost <= newEnemy.stamina);

      if (availableMoves.length === 0) {
        availableMoves = [{ name: 'Rest', cost: 0, damage: 0, effect: 'rest' }];
      }

      // Boss AI logic
      let selectedMove;
      if (state.isBossFight) {
        const playerHpPercent = activeCreature.hp / maxHp;
        if (state.bossPhase === 2 && playerHpPercent < 0.4) {
          const despFang = availableMoves.find(m => m.name === 'Desperation Fang');
          if (despFang) selectedMove = despFang;
        }
        if (!selectedMove && playerHpPercent > 0.7) {
          const flameWall = availableMoves.find(m => m.name === 'Flame Wall');
          if (flameWall) selectedMove = flameWall;
        }
      }

      if (!selectedMove) {
        const attackMoves = availableMoves.filter(m => m.damage > 0);
        selectedMove = attackMoves.length > 0
          ? attackMoves[Math.floor(Math.random() * attackMoves.length)]
          : availableMoves[0];
      }

      // Execute enemy move
      if (selectedMove.effect === 'rest') {
        newEnemy.stamina = Math.min(newEnemy.stamina + 8, state.enemyCreature.maxStamina);
        log.push(`${state.enemyCreature.name} rests.`);
      } else if (selectedMove.effect === 'guard') {
        newEnemy.isGuarding = true;
        newEnemy.stamina -= selectedMove.cost;
        log.push(`${state.enemyCreature.name} guards.`);
      } else {
        const damage = calculateDamage(selectedMove, newEnemy, activeCreature,
          state.enemyCreature, activeBase);

        activeCreature.hp = Math.max(0, activeCreature.hp - damage);
        activeCreature.isGuarding = false;
        newEnemy.stamina -= selectedMove.cost;

        log.push(`${state.enemyCreature.name} used ${selectedMove.name}! ${damage} damage.`);

        if (selectedMove.effect === 'burn' && activeCreature.burnTurns === 0) {
          activeCreature.burnTurns = 2;
          log.push(`${activeCreature.name} is burning!`);
        }

        if (selectedMove.effect === 'recoil') {
          newEnemy.hp = Math.max(0, newEnemy.hp - selectedMove.recoilDamage);
          log.push(`${state.enemyCreature.name} takes ${selectedMove.recoilDamage} recoil!`);
        }

        if (newEnemy.stamina < 5) {
          newEnemy.winded = true;
          log.push(`${state.enemyCreature.name} is winded!`);
        }
      }

      newTeam[state.activeCreatureIndex] = activeCreature;

      // Check enemy defeated from recoil
      if (newEnemy.hp <= 0) {
        const soulsEarned = state.enemyCreature.souls || 10;
        log.push(`${state.enemyCreature.name} defeated! Gained ${soulsEarned} souls.`);

        if (state.isBossFight) {
          return {
            ...state,
            screen: 'victory',
            souls: state.souls + soulsEarned,
            bossDefeated: true,
            team: newTeam,
            battleLog: log
          };
        }

        return {
          ...state,
          screen: 'exploration',
          souls: state.souls + soulsEarned,
          enemy: null,
          team: newTeam,
          battleLog: log
        };
      }

      // Check player creature fainted
      if (activeCreature.hp <= 0) {
        return handleCreatureFaint(state, newTeam, newEnemy, log);
      }

      return {
        ...state,
        team: newTeam,
        enemy: newEnemy,
        battleLog: log,
        turnPhase: 'player'
      };
    }

    case 'SWITCH_CREATURE': {
      if (state.team[action.index].hp <= 0) return state;
      return {
        ...state,
        activeCreatureIndex: action.index,
        battleLog: [...state.battleLog, `Go, ${state.team[action.index].name}!`]
      };
    }

    case 'RESPAWN': {
      const team = state.team.map(creature => {
        const baseData = STARTERS[creature.id];
        const { maxHp, maxStamina } = applyScars(creature, baseData);
        return {
          ...creature,
          hp: creature.hp === 0 ? 1 : Math.max(creature.hp, 1),
          stamina: maxStamina,
          winded: false,
          burnTurns: 0,
          isGuarding: false
        };
      });

      return {
        ...state,
        screen: 'exploration',
        currentMap: state.lastBonfire.map,
        playerPos: { ...state.lastBonfire.pos },
        team,
        activeCreatureIndex: team.findIndex(c => c.hp > 0) || 0,
        enemy: null,
        enemyCreature: null,
        battleLog: [],
        turnPhase: 'player',
        bossPhase: 1,
        arenaEffect: null,
        isBossFight: false
      };
    }

    case 'RESTART': {
      return initialState;
    }

    default:
      return state;
  }
}

function handleCreatureFaint(state, team, enemy, log) {
  const activeCreature = team[state.activeCreatureIndex];
  const scar = getRandomScar();

  activeCreature.hp = 0;
  activeCreature.scars = [...(activeCreature.scars || []), scar];

  log.push(`${activeCreature.name} has fallen!`);
  log.push(`${activeCreature.name} gained scar: ${scar.name} (${scar.description})`);

  if (activeCreature.scars.length >= 3) {
    log.push(`${activeCreature.name} has become Hollowed...`);
  }

  team[state.activeCreatureIndex] = activeCreature;

  // Check for available creatures
  const availableIndex = team.findIndex((c, i) => i !== state.activeCreatureIndex && c.hp > 0);

  if (availableIndex === -1) {
    // Party wipe
    const droppedSouls = state.souls > 0 ? {
      map: state.currentMap,
      pos: { ...state.playerPos },
      amount: state.souls
    } : state.droppedSouls;

    return {
      ...state,
      screen: 'gameOver',
      team,
      enemy,
      battleLog: log,
      souls: 0,
      droppedSouls
    };
  }

  return {
    ...state,
    team,
    enemy,
    battleLog: log,
    activeCreatureIndex: availableIndex,
    turnPhase: 'player'
  };
}

// ============= COMPONENTS =============

function StarterSelect({ dispatch }) {
  return (
    <div style={styles.starterSelect}>
      <h1 style={{ color: '#888', marginBottom: '10px' }}>POKE SOULS</h1>
      <p style={{ color: '#666', marginBottom: '30px' }}>Choose your survivor</p>
      <div>
        {Object.values(STARTERS).map(starter => (
          <div
            key={starter.id}
            style={styles.starterCard}
            onClick={() => dispatch({ type: 'SELECT_STARTER', starter: starter.id })}
            onMouseOver={e => e.currentTarget.style.borderColor = getTypeColor(starter.type)}
            onMouseOut={e => e.currentTarget.style.borderColor = '#444'}
          >
            <div style={{ ...styles.typeIcon, color: getTypeColor(starter.type) }}>
              {getTypeIcon(starter.type)}
            </div>
            <h3 style={{ margin: '10px 0 5px', color: '#ccc' }}>{starter.name}</h3>
            <p style={{ fontSize: '11px', color: '#888', margin: '5px 0' }}>
              {starter.type.toUpperCase()}
            </p>
            <p style={{ fontSize: '10px', color: '#666' }}>
              HP: {starter.maxHp} | STA: {starter.maxStamina}
            </p>
            <p style={{ fontSize: '10px', color: getTypeColor(starter.type), marginTop: '8px' }}>
              {starter.moves[0].name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function Exploration({ state, dispatch }) {
  const map = state.currentMap === 'ashenPath' ? ASHEN_PATH : FALLEN_KEEP;
  const mapName = state.currentMap === 'ashenPath' ? 'Ashen Path' : 'Fallen Keep';

  const handleKeyDown = useCallback((e) => {
    const key = e.key.toLowerCase();
    let dx = 0, dy = 0;

    if (key === 'arrowup' || key === 'w') dy = -1;
    else if (key === 'arrowdown' || key === 's') dy = 1;
    else if (key === 'arrowleft' || key === 'a') dx = -1;
    else if (key === 'arrowright' || key === 'd') dx = 1;
    else if (key === 'e' || key === 'enter') {
      const tile = map[state.playerPos.y][state.playerPos.x];
      if (tile === 'B') {
        dispatch({ type: 'INTERACT_BONFIRE' });
      }
      return;
    }

    if (dx !== 0 || dy !== 0) {
      dispatch({ type: 'MOVE_PLAYER', dx, dy });
    }
  }, [dispatch, map, state.playerPos]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const currentTile = map[state.playerPos.y][state.playerPos.x];

  return (
    <div>
      <div style={styles.header}>
        <span style={styles.souls}>SOULS: {state.souls} (Banked: {state.bankedSouls})</span>
        <span>{mapName}</span>
      </div>

      <div style={styles.mapContainer}>
        <div style={{
          ...styles.grid,
          gridTemplateColumns: `repeat(${map[0].length}, 40px)`
        }}>
          {map.map((row, y) =>
            row.map((tile, x) => {
              const isPlayer = x === state.playerPos.x && y === state.playerPos.y;
              const hasSouls = state.droppedSouls &&
                state.droppedSouls.map === state.currentMap &&
                state.droppedSouls.pos.x === x &&
                state.droppedSouls.pos.y === y;

              return (
                <div
                  key={`${x}-${y}`}
                  style={{
                    ...styles.tile,
                    backgroundColor: getTileColor(tile),
                    color: tile === 'G' ? '#5a6a5a' : '#888'
                  }}
                >
                  {isPlayer ? (
                    <span style={{ color: '#fff', fontSize: '18px' }}>@</span>
                  ) : hasSouls ? (
                    <span style={{ color: '#ffd700', fontSize: '16px' }}>$</span>
                  ) : (
                    getTileSymbol(tile)
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {currentTile === 'B' && (
        <div style={{ textAlign: 'center', color: '#a84', marginBottom: '10px' }}>
          Press E to rest at bonfire
        </div>
      )}

      <TeamStatus team={state.team} activeIndex={state.activeCreatureIndex} />

      <div style={{
        padding: '10px',
        backgroundColor: '#222',
        marginTop: '10px',
        fontSize: '11px',
        color: '#666'
      }}>
        WASD/Arrows: Move | E: Interact | ~: Tall Grass | 🔥: Bonfire | ⛩: Gate
      </div>
    </div>
  );
}

function TeamStatus({ team, activeIndex }) {
  return (
    <div style={styles.teamStatus}>
      <h4 style={{ margin: '0 0 8px', color: '#888' }}>TEAM</h4>
      {team.map((creature, i) => {
        const baseData = STARTERS[creature.id];
        const { maxHp, maxStamina } = applyScars(creature, baseData);
        const hpPercent = (creature.hp / maxHp) * 100;
        const staminaPercent = (creature.stamina / maxStamina) * 100;
        const isActive = i === activeIndex;
        const isHollowed = creature.scars && creature.scars.length >= 3;

        return (
          <div
            key={i}
            style={{
              ...styles.creatureStatus,
              borderColor: isActive ? getTypeColor(creature.type) : '#555'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>
                {getTypeIcon(creature.type)} {creature.name}
                {isHollowed && <span style={styles.scar}>HOLLOWED</span>}
                {creature.winded && <span style={{ ...styles.status, ...styles.winded }}>WINDED</span>}
                {creature.burnTurns > 0 && (
                  <span style={{ ...styles.status, ...styles.burn }}>BURN {creature.burnTurns}</span>
                )}
              </span>
              <span style={{ fontSize: '11px', color: '#888' }}>
                {creature.hp}/{maxHp} HP
              </span>
            </div>
            <div style={styles.hpBar}>
              <div style={{
                ...styles.hpFill,
                width: `${hpPercent}%`,
                backgroundColor: hpPercent > 50 ? '#4a4' : hpPercent > 25 ? '#aa4' : '#a44'
              }} />
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '4px'
            }}>
              <span style={{ fontSize: '10px', color: '#666' }}>
                Stamina: {creature.stamina}/{maxStamina}
              </span>
              {creature.scars && creature.scars.length > 0 && (
                <span>
                  {creature.scars.map((scar, j) => (
                    <span key={j} style={styles.scar}>{scar.name}</span>
                  ))}
                </span>
              )}
            </div>
            <div style={styles.staminaBar}>
              <div style={{
                ...styles.staminaFill,
                width: `${staminaPercent}%`
              }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Battle({ state, dispatch }) {
  const activeCreature = state.team[state.activeCreatureIndex];
  const activeBase = STARTERS[activeCreature.id];
  const { maxHp, maxStamina, hasFlinching } = applyScars(activeCreature, activeBase);

  const enemyHpPercent = (state.enemy.hp / state.enemyCreature.maxHp) * 100;
  const playerHpPercent = (activeCreature.hp / maxHp) * 100;

  useEffect(() => {
    if (state.turnPhase === 'enemy') {
      const timer = setTimeout(() => {
        dispatch({ type: 'ENEMY_TURN' });
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [state.turnPhase, dispatch]);

  const getMoveWithPriority = (move) => {
    if (move.priority && hasFlinching) {
      return { ...move, priority: false };
    }
    return move;
  };

  return (
    <div style={styles.battleContainer}>
      <div style={styles.header}>
        <span style={styles.souls}>SOULS: {state.souls}</span>
        <span>{state.isBossFight ? 'BOSS BATTLE' : 'WILD ENCOUNTER'}</span>
      </div>

      {state.arenaEffect === 'scorchedEarth' && (
        <div style={{
          textAlign: 'center',
          padding: '8px',
          backgroundColor: '#3a2a1a',
          color: '#f84',
          marginBottom: '10px',
          border: '1px solid #a63'
        }}>
          SCORCHED EARTH - Non-Fire types take 2 damage per turn
        </div>
      )}

      <div style={styles.battleCreature}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>
            {getTypeIcon(state.enemyCreature.type)} {state.enemyCreature.name}
            {state.bossPhase === 2 && <span style={{ color: '#f84', marginLeft: '8px' }}>PHASE 2</span>}
          </span>
          <span style={{ fontSize: '12px', color: '#888' }}>
            {state.enemy.hp}/{state.enemyCreature.maxHp} HP
          </span>
        </div>
        <div style={styles.hpBar}>
          <div style={{
            ...styles.hpFill,
            width: `${enemyHpPercent}%`,
            backgroundColor: '#a44'
          }} />
        </div>
        <div style={{ fontSize: '10px', color: '#666', marginTop: '4px' }}>
          Stamina: {state.enemy.stamina}/{state.enemyCreature.maxStamina}
          {state.enemy.winded && <span style={{ ...styles.status, ...styles.winded }}>WINDED</span>}
          {state.enemy.isGuarding && <span style={{ ...styles.status, backgroundColor: '#336', border: '1px solid #66a' }}>GUARD</span>}
        </div>
      </div>

      <div style={styles.battleAnimation}>
        {state.battleLog.slice(-2).map((log, i) => (
          <div key={i}>{log}</div>
        ))}
      </div>

      <div style={styles.battleCreature}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>
            {getTypeIcon(activeCreature.type)} {activeCreature.name}
            {activeCreature.winded && <span style={{ ...styles.status, ...styles.winded }}>WINDED</span>}
            {activeCreature.burnTurns > 0 && (
              <span style={{ ...styles.status, ...styles.burn }}>BURN {activeCreature.burnTurns}</span>
            )}
            {activeCreature.isGuarding && <span style={{ ...styles.status, backgroundColor: '#336', border: '1px solid #66a' }}>GUARD</span>}
          </span>
          <span style={{ fontSize: '12px', color: '#888' }}>
            {activeCreature.hp}/{maxHp} HP
          </span>
        </div>
        <div style={styles.hpBar}>
          <div style={{
            ...styles.hpFill,
            width: `${playerHpPercent}%`,
            backgroundColor: playerHpPercent > 50 ? '#4a4' : playerHpPercent > 25 ? '#aa4' : '#a44'
          }} />
        </div>
        <div style={{ fontSize: '10px', color: '#666', marginTop: '4px' }}>
          Stamina: {activeCreature.stamina}/{maxStamina}
          {activeCreature.scars && activeCreature.scars.length > 0 && (
            <span style={{ marginLeft: '10px' }}>
              {activeCreature.scars.map((scar, j) => (
                <span key={j} style={styles.scar}>{scar.name}</span>
              ))}
            </span>
          )}
        </div>
        <div style={styles.staminaBar}>
          <div style={{
            ...styles.staminaFill,
            width: `${(activeCreature.stamina / maxStamina) * 100}%`
          }} />
        </div>
      </div>

      <div style={styles.moveButtons}>
        {activeBase.moves.map((move, i) => {
          const adjustedMove = getMoveWithPriority(move);
          const canUse = adjustedMove.cost <= activeCreature.stamina && state.turnPhase === 'player';

          return (
            <button
              key={i}
              style={{
                ...styles.moveButton,
                ...(canUse ? {} : styles.moveButtonDisabled)
              }}
              disabled={!canUse}
              onClick={() => dispatch({ type: 'SELECT_MOVE', move: adjustedMove })}
            >
              <div style={{ fontWeight: 'bold' }}>{adjustedMove.name}</div>
              <div style={{ fontSize: '10px', color: '#888', marginTop: '4px' }}>
                Cost: {adjustedMove.cost} |
                {adjustedMove.damage > 0 ? ` DMG: ${adjustedMove.damage}` : ` ${adjustedMove.effect?.toUpperCase()}`}
                {adjustedMove.priority && !hasFlinching && ' | PRIORITY'}
              </div>
            </button>
          );
        })}
      </div>

      {state.team.length > 1 && (
        <div style={{ marginTop: '10px' }}>
          <div style={{ fontSize: '11px', color: '#666', marginBottom: '5px' }}>SWITCH:</div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {state.team.map((creature, i) => {
              if (i === state.activeCreatureIndex) return null;
              const base = STARTERS[creature.id];
              const stats = applyScars(creature, base);
              return (
                <button
                  key={i}
                  style={{
                    ...styles.moveButton,
                    flex: 1,
                    opacity: creature.hp <= 0 ? 0.5 : 1
                  }}
                  disabled={creature.hp <= 0 || state.turnPhase !== 'player'}
                  onClick={() => dispatch({ type: 'SWITCH_CREATURE', index: i })}
                >
                  {getTypeIcon(creature.type)} {creature.name} ({creature.hp}/{stats.maxHp})
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div style={styles.log}>
        {state.battleLog.map((log, i) => (
          <div key={i} style={{ marginBottom: '2px' }}>{log}</div>
        ))}
      </div>
    </div>
  );
}

function Victory({ state, dispatch }) {
  const totalScars = state.team.reduce((sum, c) => sum + (c.scars?.length || 0), 0);
  const survivingCreatures = state.team.filter(c => c.hp > 0).length;

  return (
    <div style={styles.victory}>
      <h1 style={{ color: '#4a4', marginBottom: '20px' }}>VICTORY</h1>
      <h2 style={{ color: '#888', fontWeight: 'normal' }}>Keeper Varek Defeated</h2>

      <div style={{ margin: '30px 0', textAlign: 'left', display: 'inline-block' }}>
        <p style={{ color: '#ffd700', marginBottom: '10px' }}>
          Souls Earned: {BOSS.obsidianHound.souls}
        </p>
        <p style={{ color: '#a66', marginBottom: '10px' }}>
          Scars Accumulated: {totalScars}
        </p>
        <p style={{ color: '#6a6', marginBottom: '10px' }}>
          Creatures Remaining: {survivingCreatures}/{state.team.length}
        </p>
        <p style={{ color: '#888', marginBottom: '10px' }}>
          Total Souls: {state.souls + state.bankedSouls}
        </p>
      </div>

      <p style={{ color: '#888', fontStyle: 'italic', marginTop: '30px' }}>
        "You have proven yourself. The path ahead grows darker."
      </p>

      <button
        style={styles.button}
        onClick={() => dispatch({ type: 'RESTART' })}
      >
        NEW JOURNEY
      </button>
    </div>
  );
}

function GameOver({ state, dispatch }) {
  return (
    <div style={styles.gameOver}>
      <h1 style={{ color: '#a44', marginBottom: '20px' }}>YOU DIED</h1>

      {state.droppedSouls && (
        <p style={{ color: '#ffd700', marginBottom: '20px' }}>
          {state.droppedSouls.amount} souls dropped at {state.droppedSouls.map === 'ashenPath' ? 'Ashen Path' : 'Fallen Keep'}
        </p>
      )}

      <p style={{ color: '#666', marginBottom: '30px' }}>
        Your creatures will revive at the last bonfire, scarred but not broken.
      </p>

      <button
        style={styles.button}
        onClick={() => dispatch({ type: 'RESPAWN' })}
      >
        RETURN TO BONFIRE
      </button>
    </div>
  );
}

// ============= MAIN APP =============

export default function PokeSouls() {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  return (
    <div style={styles.container}>
      {state.screen === 'starter' && (
        <StarterSelect dispatch={dispatch} />
      )}
      {state.screen === 'exploration' && (
        <Exploration state={state} dispatch={dispatch} />
      )}
      {state.screen === 'battle' && (
        <Battle state={state} dispatch={dispatch} />
      )}
      {state.screen === 'victory' && (
        <Victory state={state} dispatch={dispatch} />
      )}
      {state.screen === 'gameOver' && (
        <GameOver state={state} dispatch={dispatch} />
      )}
    </div>
  );
}
