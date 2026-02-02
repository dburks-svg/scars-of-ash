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

// Player sprite definition (32x32 minimum required by API)
const PLAYER = {
  directions: ['down', 'up', 'left', 'right'],
  prompts: {
    down: 'Small RPG hero facing forward, red shirt, brown hair, simple design, 32x32 GBC pixel art, game sprite, centered',
    up: 'Small RPG hero facing away, red shirt, brown hair, back view, 32x32 GBC pixel art, game sprite, centered',
    left: 'Small RPG hero facing left, red shirt, brown hair, side view, 32x32 GBC pixel art, game sprite, centered',
    right: 'Small RPG hero facing right, red shirt, brown hair, side view, 32x32 GBC pixel art, game sprite, centered'
  },
  palette: ['#1a1a2e', '#4a3728', '#c53030', '#f6d5a8']
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

    // Generate base sprite
    console.log(`Generating ${id} (${creature.type})...`);
    const baseSprite = await generateSprite(creature.prompt, creature.palette, 32, 32);

    if (baseSprite) {
      const basePath = path.join(creatureDir, 'base.png');
      fs.writeFileSync(basePath, baseSprite);
      console.log(`  Saved: ${basePath}`);
    }

    await sleep(API_DELAY_MS);

    // Generate hollowed variant
    console.log(`  Generating hollowed variant...`);
    const hollowedPrompt = creature.prompt.replace('32x32 GBC pixel art', 'faded, scarred, worn, 32x32 GBC pixel art');
    const hollowedPalette = await generateHollowedVariant(null, creature.palette);
    const hollowedSprite = await generateSprite(hollowedPrompt, hollowedPalette, 32, 32);

    if (hollowedSprite) {
      const hollowedPath = path.join(creatureDir, 'hollowed.png');
      fs.writeFileSync(hollowedPath, hollowedSprite);
      console.log(`  Saved: ${hollowedPath}`);
    }

    await sleep(API_DELAY_MS);
  }
}

async function generateBossSprites() {
  console.log('\n=== Generating Boss Sprites ===\n');

  for (const [id, boss] of Object.entries(BOSSES)) {
    const bossDir = path.join(BOSS_DIR, id);
    ensureDir(bossDir);

    // Generate phase 1
    console.log(`Generating ${id} phase 1...`);
    const phase1Sprite = await generateSprite(boss.phase1.prompt, boss.phase1.palette, 32, 32);

    if (phase1Sprite) {
      const phase1Path = path.join(bossDir, 'phase1.png');
      fs.writeFileSync(phase1Path, phase1Sprite);
      console.log(`  Saved: ${phase1Path}`);
    }

    await sleep(API_DELAY_MS);

    // Generate phase 2
    console.log(`Generating ${id} phase 2...`);
    const phase2Sprite = await generateSprite(boss.phase2.prompt, boss.phase2.palette, 32, 32);

    if (phase2Sprite) {
      const phase2Path = path.join(bossDir, 'phase2.png');
      fs.writeFileSync(phase2Path, phase2Sprite);
      console.log(`  Saved: ${phase2Path}`);
    }

    await sleep(API_DELAY_MS);
  }
}

async function generatePlayerSprites() {
  console.log('\n=== Generating Player Sprites ===\n');

  ensureDir(PLAYER_DIR);

  for (const direction of PLAYER.directions) {
    console.log(`Generating player ${direction}...`);
    const sprite = await generateSprite(PLAYER.prompts[direction], PLAYER.palette, 32, 32);

    if (sprite) {
      const spritePath = path.join(PLAYER_DIR, `${direction}.png`);
      fs.writeFileSync(spritePath, sprite);
      console.log(`  Saved: ${spritePath}`);
    }

    await sleep(API_DELAY_MS);
  }
}

async function main() {
  console.log('========================================');
  console.log('  Scars of Ash - Sprite Generator');
  console.log('========================================');
  console.log(`\nAPI Key: ${API_KEY.slice(0, 8)}...${API_KEY.slice(-4)}`);
  console.log(`Output: ${OUTPUT_BASE}\n`);

  // Ensure base output directories exist
  ensureDir(OUTPUT_BASE);
  ensureDir(CREATURE_DIR);
  ensureDir(BOSS_DIR);
  ensureDir(PLAYER_DIR);

  const startTime = Date.now();
  let successCount = 0;
  let failCount = 0;

  try {
    await generateCreatureSprites();
    await generateBossSprites();
    await generatePlayerSprites();
  } catch (error) {
    console.error(`\nFatal error: ${error.message}`);
    failCount++;
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

main().catch(console.error);
