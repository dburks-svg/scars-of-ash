/**
 * Scars of Ash - PixelLab Sprite Generator
 *
 * Generates pixel art sprites for creatures, player, and bosses
 * using the PixelLab API.
 *
 * Usage: node scripts/generate-sprites.js
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// Load environment variables from .env file manually (no external dependencies)
function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env');
  console.log('Looking for .env at:', envPath);
  if (fs.existsSync(envPath)) {
    console.log('.env file found');
    const envContent = fs.readFileSync(envPath, 'utf-8');
    envContent.split('\n').forEach(line => {
      const trimmedLine = line.trim();
      if (!trimmedLine || trimmedLine.startsWith('#')) return;
      const eqIndex = trimmedLine.indexOf('=');
      if (eqIndex > 0) {
        const key = trimmedLine.slice(0, eqIndex).trim();
        const value = trimmedLine.slice(eqIndex + 1).trim();
        process.env[key] = value;
        console.log(`Loaded env: ${key}=${value.slice(0, 8)}...`);
      }
    });
  } else {
    console.log('.env file NOT found at:', envPath);
  }
}

loadEnv();

const API_KEY = process.env.PIXELLAB_API_KEY;
const API_BASE = 'https://api.pixellab.ai/v1';

if (!API_KEY) {
  console.error('Error: PIXELLAB_API_KEY not found in .env file');
  process.exit(1);
}

// Creature definitions with type-themed 4-color palettes
const CREATURES = {
  cindrath: {
    type: 'fire',
    prompt: 'Cindrath, small flame creature with fire on head, cute but fierce, 32x32 GBC pixel art, side view, game sprite',
    palette: ['#742a2a', '#c53030', '#ed8936', '#f6e05e']
  },
  marshveil: {
    type: 'water',
    prompt: 'Marshveil, rounded water blob creature with fins, shimmering blue, 32x32 GBC pixel art, side view, game sprite',
    palette: ['#2b6cb0', '#4299e1', '#63b3ed', '#90cdf4']
  },
  thornwick: {
    type: 'grass',
    prompt: 'Thornwick, thorny plant creature with leaves, red eyes, green body, 32x32 GBC pixel art, side view, game sprite',
    palette: ['#1c4532', '#276749', '#38a169', '#68d391']
  },
  umbravine: {
    type: 'dark',
    prompt: 'Umbravine, shadowy vine creature with glowing purple eyes, dark purple body, 32x32 GBC pixel art, side view, game sprite',
    palette: ['#1a1030', '#2d2040', '#553c9a', '#9f7aea']
  },
  solrath: {
    type: 'light',
    prompt: 'Solrath, radiant sun creature with warm golden glow, bright and warm, 32x32 GBC pixel art, side view, game sprite',
    palette: ['#b7791f', '#d69e2e', '#ecc94b', '#faf089']
  }
};

// Boss definitions
const BOSSES = {
  'obsidian-hound': {
    phase1: {
      prompt: 'Obsidian Hound, fierce dark wolf creature with fire markings, menacing pose, 32x32 GBC pixel art, boss monster, game sprite',
      palette: ['#1a1a2e', '#2d3748', '#ed8936', '#f56565']
    },
    phase2: {
      prompt: 'Obsidian Hound enraged, dark wolf with glowing flames erupting, red eyes blazing, 32x32 GBC pixel art, boss monster, game sprite',
      palette: ['#1a1a2e', '#c53030', '#ed8936', '#f6e05e']
    }
  },
  'hollow-warden': {
    phase1: {
      prompt: 'Hollow Warden, corrupted guardian with cracked body, one dark eye one light eye, ominous, 32x32 GBC pixel art, boss monster, game sprite',
      palette: ['#1a1020', '#2d2040', '#9f7aea', '#faf089']
    },
    phase2: {
      prompt: 'Hollow Warden corrupted, dark light hybrid creature splitting apart, chaotic energy, 32x32 GBC pixel art, boss monster, game sprite',
      palette: ['#1a1020', '#553c9a', '#f6e05e', '#ffffff']
    }
  }
};

// Player sprite definitions by appearance (32x32 minimum required by API)
// Each appearance is visually distinct at a glance
const PLAYER_APPEARANCES = {
  male: {
    // MALE: Short hair, blue/teal cloak, broader shoulders
    prompts: {
      down: 'Male warrior facing forward, short spiky brown hair, teal blue cloak, broad shoulders, simple 16x16 pixel art style, GBC game sprite, dark fantasy RPG character',
      up: 'Male warrior back view, short spiky brown hair, teal blue cloak, broad shoulders, simple 16x16 pixel art style, GBC game sprite, dark fantasy RPG character',
      left: 'Male warrior facing left, short spiky brown hair, teal blue cloak, broad shoulders, side profile, simple 16x16 pixel art style, GBC game sprite, dark fantasy RPG character',
      right: 'Male warrior facing right, short spiky brown hair, teal blue cloak, broad shoulders, side profile, simple 16x16 pixel art style, GBC game sprite, dark fantasy RPG character'
    },
    palette: ['#1a1a2e', '#4a3728', '#2b6cb0', '#4fd1c5'] // Dark, brown hair, blue, teal accent
  },
  female: {
    // FEMALE: Longer hair (ponytail), red/maroon cloak, smaller frame
    prompts: {
      down: 'Female warrior facing forward, long flowing auburn hair ponytail, deep red maroon cloak, slender frame, simple 16x16 pixel art style, GBC game sprite, dark fantasy RPG character',
      up: 'Female warrior back view, long flowing auburn hair ponytail visible, deep red maroon cloak, slender frame, simple 16x16 pixel art style, GBC game sprite, dark fantasy RPG character',
      left: 'Female warrior facing left, long flowing auburn hair ponytail, deep red maroon cloak, slender frame, side profile, simple 16x16 pixel art style, GBC game sprite, dark fantasy RPG character',
      right: 'Female warrior facing right, long flowing auburn hair ponytail, deep red maroon cloak, slender frame, side profile, simple 16x16 pixel art style, GBC game sprite, dark fantasy RPG character'
    },
    palette: ['#1a1a2e', '#9b2c2c', '#c53030', '#feb2b2'] // Dark, maroon, red, light accent
  },
  other: {
    // OTHER: Hooded (face obscured), purple/gray cloak, androgynous silhouette
    prompts: {
      down: 'Hooded mysterious figure facing forward, hood covering face partially shadowed, purple gray cloak, androgynous build, simple 16x16 pixel art style, GBC game sprite, dark fantasy RPG character',
      up: 'Hooded mysterious figure back view, large hood visible, purple gray cloak, androgynous build, simple 16x16 pixel art style, GBC game sprite, dark fantasy RPG character',
      left: 'Hooded mysterious figure facing left, hood covering face in shadow, purple gray cloak, androgynous build, side profile, simple 16x16 pixel art style, GBC game sprite, dark fantasy RPG character',
      right: 'Hooded mysterious figure facing right, hood covering face in shadow, purple gray cloak, androgynous build, side profile, simple 16x16 pixel art style, GBC game sprite, dark fantasy RPG character'
    },
    palette: ['#1a1a2e', '#4a5568', '#805ad5', '#b794f4'] // Dark, gray, purple, light purple accent
  }
};

const PLAYER_DIRECTIONS = ['down', 'up', 'left', 'right'];

// Animation frame counts
const ANIMATION_FRAMES = {
  player: {
    idle: 2,   // 2 frames for idle breathing animation
    walk: 4    // 4 frames for walk cycle
  },
  creature: {
    idle: 4    // 4 frames for idle animation
  },
  boss: {
    idle: 4    // 4 frames for boss idle animation
  }
};

// Frame variation prompts for walk cycles
const WALK_FRAME_PROMPTS = {
  0: 'standing ready position, weight centered',
  1: 'left foot stepping forward, mid-stride',
  2: 'both feet together, weight shifting',
  3: 'right foot stepping forward, mid-stride'
};

// Frame variation prompts for idle animations
const IDLE_FRAME_PROMPTS = {
  0: 'neutral pose, breathing in',
  1: 'slight movement, breathing out'
};

// Frame variation for creature/boss idle
const CREATURE_IDLE_PROMPTS = {
  0: 'idle pose frame 1, subtle movement',
  1: 'idle pose frame 2, slight shift',
  2: 'idle pose frame 3, breathing motion',
  3: 'idle pose frame 4, returning to start'
};

// Output directories
const OUTPUT_BASE = path.join(__dirname, '..', 'assets', 'sprites');
const CREATURE_DIR = path.join(OUTPUT_BASE, 'creatures');
const BOSS_DIR = path.join(OUTPUT_BASE, 'bosses');
const PLAYER_DIR = path.join(OUTPUT_BASE, 'player');

// Delay between API calls to avoid rate limits
const API_DELAY_MS = 1500;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Created directory: ${dir}`);
  }
}

function makeApiRequest(endpoint, body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);

    const options = {
      hostname: 'api.pixellab.ai',
      port: 443,
      path: `/v1${endpoint}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Length': Buffer.byteLength(data)
      }
    };

    const req = https.request(options, (res) => {
      let responseData = '';

      res.on('data', chunk => {
        responseData += chunk;
      });

      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            resolve(JSON.parse(responseData));
          } catch (e) {
            // Might be binary data
            resolve(responseData);
          }
        } else {
          reject(new Error(`API error ${res.statusCode}: ${responseData}`));
        }
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function generateSprite(prompt, palette, width, height) {
  // PixelLab PixFlux API for text-to-image generation
  const body = {
    description: prompt,
    image_size: { width, height },
    no_background: true,
    negative_description: 'blurry, high resolution, realistic, 3d, smooth, anti-aliased',
    text_guidance_scale: 8.0,
    outline: 'single color black outline',
    shading: 'flat shading',
    detail: 'low detail'
  };

  try {
    const response = await makeApiRequest('/generate-image-pixflux', body);

    if (response.image && response.image.base64) {
      return Buffer.from(response.image.base64, 'base64');
    } else if (response.image) {
      return Buffer.from(response.image, 'base64');
    } else if (response.url) {
      return await downloadImage(response.url);
    } else {
      throw new Error('No image data in response: ' + JSON.stringify(response).slice(0, 200));
    }
  } catch (error) {
    console.error(`  Failed to generate sprite: ${error.message}`);
    return null;
  }
}

function downloadImage(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => resolve(Buffer.concat(chunks)));
      res.on('error', reject);
    }).on('error', reject);
  });
}

async function generateHollowedVariant(baseImagePath, palette) {
  // For hollowed variant, we darken/desaturate the palette
  const hollowedPalette = palette.map(color => {
    // Shift colors toward grey/muted
    const hex = color.replace('#', '');
    const r = Math.floor(parseInt(hex.slice(0, 2), 16) * 0.6);
    const g = Math.floor(parseInt(hex.slice(2, 4), 16) * 0.6);
    const b = Math.floor(parseInt(hex.slice(4, 6), 16) * 0.6);
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  });

  // Read base image and generate hollowed version
  // For now, generate a separate sprite with "hollowed" prompt addition
  return hollowedPalette;
}

async function generateCreatureSprites() {
  console.log('\n=== Generating Creature Sprites ===\n');

  for (const [id, creature] of Object.entries(CREATURES)) {
    const creatureDir = path.join(CREATURE_DIR, id);
    ensureDir(creatureDir);

    // Generate base sprite animation frames
    console.log(`Generating ${id} (${creature.type})...`);
    for (let frame = 0; frame < ANIMATION_FRAMES.creature.idle; frame++) {
      const framePrompt = `${creature.prompt}, ${CREATURE_IDLE_PROMPTS[frame]}`;
      console.log(`  Generating base idle frame ${frame}...`);
      const baseSprite = await generateSprite(framePrompt, creature.palette, 32, 32);

      if (baseSprite) {
        const basePath = path.join(creatureDir, `base_idle_${frame}.png`);
        fs.writeFileSync(basePath, baseSprite);
        console.log(`    Saved: ${basePath}`);
      }

      await sleep(API_DELAY_MS);
    }

    // Generate hollowed variant animation frames
    console.log(`  Generating hollowed variant frames...`);
    const hollowedPalette = await generateHollowedVariant(null, creature.palette);
    for (let frame = 0; frame < ANIMATION_FRAMES.creature.idle; frame++) {
      const hollowedPrompt = creature.prompt.replace('32x32 GBC pixel art', 'faded, scarred, worn, 32x32 GBC pixel art') + `, ${CREATURE_IDLE_PROMPTS[frame]}`;
      console.log(`  Generating hollowed idle frame ${frame}...`);
      const hollowedSprite = await generateSprite(hollowedPrompt, hollowedPalette, 32, 32);

      if (hollowedSprite) {
        const hollowedPath = path.join(creatureDir, `hollowed_idle_${frame}.png`);
        fs.writeFileSync(hollowedPath, hollowedSprite);
        console.log(`    Saved: ${hollowedPath}`);
      }

      await sleep(API_DELAY_MS);
    }
  }
}

async function generateBossSprites() {
  console.log('\n=== Generating Boss Sprites ===\n');

  for (const [id, boss] of Object.entries(BOSSES)) {
    const bossDir = path.join(BOSS_DIR, id);
    ensureDir(bossDir);

    // Generate phase 1 animation frames
    console.log(`Generating ${id} phase 1...`);
    for (let frame = 0; frame < ANIMATION_FRAMES.boss.idle; frame++) {
      const framePrompt = `${boss.phase1.prompt}, ${CREATURE_IDLE_PROMPTS[frame]}`;
      console.log(`  Generating phase 1 idle frame ${frame}...`);
      const phase1Sprite = await generateSprite(framePrompt, boss.phase1.palette, 32, 32);

      if (phase1Sprite) {
        const phase1Path = path.join(bossDir, `phase1_idle_${frame}.png`);
        fs.writeFileSync(phase1Path, phase1Sprite);
        console.log(`    Saved: ${phase1Path}`);
      }

      await sleep(API_DELAY_MS);
    }

    // Generate phase 2 animation frames
    console.log(`Generating ${id} phase 2...`);
    for (let frame = 0; frame < ANIMATION_FRAMES.boss.idle; frame++) {
      const framePrompt = `${boss.phase2.prompt}, ${CREATURE_IDLE_PROMPTS[frame]}`;
      console.log(`  Generating phase 2 idle frame ${frame}...`);
      const phase2Sprite = await generateSprite(framePrompt, boss.phase2.palette, 32, 32);

      if (phase2Sprite) {
        const phase2Path = path.join(bossDir, `phase2_idle_${frame}.png`);
        fs.writeFileSync(phase2Path, phase2Sprite);
        console.log(`    Saved: ${phase2Path}`);
      }

      await sleep(API_DELAY_MS);
    }
  }
}

async function generatePlayerSprites() {
  console.log('\n=== Generating Player Sprites ===\n');

  for (const [appearance, config] of Object.entries(PLAYER_APPEARANCES)) {
    const appearanceDir = path.join(PLAYER_DIR, appearance);
    ensureDir(appearanceDir);

    console.log(`\nGenerating ${appearance} appearance sprites...`);

    for (const direction of PLAYER_DIRECTIONS) {
      // Generate idle animation frames (2 frames)
      console.log(`  Generating ${appearance} ${direction} idle frames...`);
      for (let frame = 0; frame < ANIMATION_FRAMES.player.idle; frame++) {
        const framePrompt = `${config.prompts[direction]}, ${IDLE_FRAME_PROMPTS[frame]}`;
        console.log(`    Generating idle frame ${frame}...`);
        const sprite = await generateSprite(framePrompt, config.palette, 32, 32);

        if (sprite) {
          const spritePath = path.join(appearanceDir, `${direction}_idle_${frame}.png`);
          fs.writeFileSync(spritePath, sprite);
          console.log(`      Saved: ${spritePath}`);
        }

        await sleep(API_DELAY_MS);
      }

      // Generate walk animation frames (4 frames)
      console.log(`  Generating ${appearance} ${direction} walk frames...`);
      for (let frame = 0; frame < ANIMATION_FRAMES.player.walk; frame++) {
        const framePrompt = `${config.prompts[direction]}, ${WALK_FRAME_PROMPTS[frame]}, walking animation`;
        console.log(`    Generating walk frame ${frame}...`);
        const sprite = await generateSprite(framePrompt, config.palette, 32, 32);

        if (sprite) {
          const spritePath = path.join(appearanceDir, `${direction}_walk_${frame}.png`);
          fs.writeFileSync(spritePath, sprite);
          console.log(`      Saved: ${spritePath}`);
        }

        await sleep(API_DELAY_MS);
      }
    }
  }
}

async function main() {
  const args = process.argv.slice(2);
  const generateOnly = args[0]; // 'creatures', 'bosses', 'player', or undefined for all

  console.log('========================================');
  console.log('  Scars of Ash - Sprite Generator');
  console.log('========================================');
  console.log(`\nAPI Key: ${API_KEY.slice(0, 8)}...${API_KEY.slice(-4)}`);
  console.log(`Output: ${OUTPUT_BASE}`);
  if (generateOnly) {
    console.log(`Mode: ${generateOnly} only`);
  }
  console.log('');

  // Ensure base output directories exist
  ensureDir(OUTPUT_BASE);
  ensureDir(CREATURE_DIR);
  ensureDir(BOSS_DIR);
  ensureDir(PLAYER_DIR);

  const startTime = Date.now();

  try {
    if (!generateOnly || generateOnly === 'creatures') {
      await generateCreatureSprites();
    }
    if (!generateOnly || generateOnly === 'bosses') {
      await generateBossSprites();
    }
    if (!generateOnly || generateOnly === 'player') {
      await generatePlayerSprites();
    }
  } catch (error) {
    console.error(`\nFatal error: ${error.message}`);
  }

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

  console.log('\n========================================');
  console.log('  Generation Complete');
  console.log('========================================');
  console.log(`Time: ${elapsed}s`);
  console.log(`\nSprites generated in: ${OUTPUT_BASE}`);
  console.log('\nNext steps:');
  console.log('1. Review generated sprites in assets/sprites/');
  console.log('2. Open index.html in browser to test');
  console.log('3. If sprites look wrong, adjust prompts and re-run');
}

// Usage: node scripts/generate-sprites.js [creatures|bosses|player]
main().catch(console.error);
