/* =========================================================
   Ocean Chase – swim-game.js
   ========================================================= */

// ——— Zone definitions ———
const ZONES = [
  {
    id: 'shallow', name: 'Shallow Waters', emoji: '🏖️', minDist: 0,
    bgTop: '#a8e8f5', bgMid: '#4ab8d8', bgBot: '#1a78a8',
    seaAnimals: ['🐠', '🐟', '🐙', '🦑', '🪸', '🐡'],
    obstacles:  ['🪨', '🪵', '🪼'],
    speedMult: 1.0, chaserAccelMult: 1.0, obstacleRate: 1.0,
  },
  {
    id: 'reef', name: 'Coral Reef', emoji: '🪸', minDist: 200,
    bgTop: '#3a9cc0', bgMid: '#1a5c8e', bgBot: '#082e60',
    seaAnimals: ['🪸', '🐠', '🦀', '🦞', '🐡', '🐙'],
    obstacles:  ['🪨', '🪵', '🪸'],
    speedMult: 1.22, chaserAccelMult: 1.15, obstacleRate: 1.12,
  },
  {
    id: 'twilight', name: 'Twilight Zone', emoji: '🌆', minDist: 500,
    bgTop: '#1e2e7a', bgMid: '#0e1550', bgBot: '#04052a',
    seaAnimals: ['🦑', '🐙', '🐟', '🐬', '🪼', '💙'],
    obstacles:  ['🪨', '🪼', '💣'],
    speedMult: 1.5, chaserAccelMult: 1.32, obstacleRate: 1.25,
  },
  {
    id: 'midnight', name: 'Midnight Zone', emoji: '🌙', minDist: 900,
    bgTop: '#060618', bgMid: '#02020c', bgBot: '#000004',
    seaAnimals: ['🦑', '🐙', '🌟', '⭐', '🫧', '💙'],
    obstacles:  ['💣', '🪼', '❄️'],
    speedMult: 1.82, chaserAccelMult: 1.55, obstacleRate: 1.42,
  },
  {
    id: 'abyss', name: 'The Abyss', emoji: '🕳️', minDist: 1400,
    bgTop: '#000000', bgMid: '#01000a', bgBot: '#000000',
    seaAnimals: ['💀', '👁️', '🦑', '🐙', '⭐', '🌑'],
    obstacles:  ['💣', '❄️', '🌑'],
    speedMult: 2.15, chaserAccelMult: 1.85, obstacleRate: 1.6,
  },
];

// ——— Character definitions with special abilities ———
const CHARACTERS = [
  { id: 'swimmer', emoji: '🏊', label: 'Swimmer',
    ability: { name: 'Sprint', emoji: '⚡', cooldown: 8,  duration: 3.5, desc: 'Doubles swim speed!' } },
  { id: 'ragdoll', emoji: '🐱', label: 'Ragdoll Cat',
    ability: { name: 'Zoomies', emoji: '⚡', cooldown: 8,  duration: 3.5, desc: 'Quick burst of speed!' } },
  { id: 'dolphin', emoji: '🐬', label: 'Dolphin',
    ability: { name: 'Sonar',  emoji: '🔊', cooldown: 10, duration: 0,   desc: 'Blasts all obstacles!' } },
  { id: 'shark',   emoji: '🦈', label: 'Shark',
    ability: { name: 'Roar',   emoji: '💢', cooldown: 9,  duration: 0,   desc: 'Shoves chaser far back!' } },
  { id: 'turtle',  emoji: '🐢', label: 'Turtle',
    ability: { name: 'Shell',  emoji: '🛡️', cooldown: 12, duration: 4,   desc: 'Full invincibility 4s!' } },
];

// ——— Power-up types ———
const POWERUP_TYPES = [
  { id: 'speed',  emoji: '⚡', label: 'Speed Boost' },
  { id: 'shield', emoji: '🛡️', label: 'Shield' },
  { id: 'heal',   emoji: '💊', label: 'HP Kit' },
  { id: 'magnet', emoji: '🧲', label: 'Magnet' },
];

const COLLECTIBLE_EMOJIS = ['🌟', '💎', '🪙', '🐚'];

// ——— DOM references ———
const startScreen      = document.getElementById('swim-start-screen');
const gameScreen       = document.getElementById('swim-game-screen');
const gameOverScreen   = document.getElementById('swim-gameover-screen');
const characterOptions = document.getElementById('character-options');
const inGameCharacter  = document.getElementById('ingame-character');
const startBtn         = document.getElementById('start-swim-btn');
const restartBtn       = document.getElementById('restart-swim-btn');
const abilityBtn       = document.getElementById('ability-btn');
const swimStage        = document.getElementById('swim-stage');
const seaLayer         = document.getElementById('sea-layer');
const collectibleLayer = document.getElementById('collectible-layer');
const powerupLayer     = document.getElementById('powerup-layer');
const obstacleLayer    = document.getElementById('obstacle-layer');
const hitOverlay       = document.getElementById('hit-overlay');
const zoneBanner       = document.getElementById('zone-banner');
const playerEl         = document.getElementById('player');
const chaserEl         = document.getElementById('chaser');
const hpBarFill        = document.getElementById('hp-bar-fill');
const hpText           = document.getElementById('hp-text');
const leadBarFill      = document.getElementById('lead-bar-fill');
const scoreDisplay     = document.getElementById('score-display');
const abilityDisplay   = document.getElementById('ability-display');
const distanceDisplay  = document.getElementById('distance-display');
const zoneDisplay      = document.getElementById('zone-display');
const finalDistance    = document.getElementById('final-distance');
const finalScore       = document.getElementById('final-score');
const finalZone        = document.getElementById('final-zone');

// ——— Game constants ———
const PLAYER_LEFT_OFFSET          = 84;
const PLAYER_SIZE                 = 40;
const HP_MAX                      = 100;
const PLAYER_SPEED                = 320;
const INVULNERABLE_MS             = 800;
const MIN_SEA_ANIMAL_Y            = 18;
const SEA_ANIMAL_FALLBACK_MAX_Y   = 22;
const SEA_ANIMAL_BOTTOM_PADDING   = 40;
const MIN_OBSTACLE_Y              = 22;
const OBSTACLE_FALLBACK_MAX_Y     = 30;
const OBSTACLE_BOTTOM_PADDING     = 46;
const COLLISION_PADDING           = 6;
const MAX_SEA_ANIMALS             = 7;
const SEA_ANIMAL_SPAWN_RATE       = 2.4;
const MIN_OBSTACLE_INTERVAL       = 0.62;
const MAX_OBSTACLE_INTERVAL       = 1.1;
const MAX_FRAME_TIME              = 0.05;
const DISTANCE_RATE               = 13;
const INITIAL_OBSTACLE_SPAWN_DELAY = 0.85;

const MAX_COLLECTIBLES            = 5;
const COLLECTIBLE_SPAWN_RATE      = 0.75;
const COLLECTIBLE_SIZE            = 28;
const COLLECTIBLE_SCORE           = 10;
const COLLECTIBLE_CHASER_PUSH     = 65;
const MIN_COLLECTIBLE_Y           = 18;
const COLLECTIBLE_FALLBACK_MAX_Y  = 22;
const COLLECTIBLE_BOTTOM_PADDING  = 46;

const MAX_POWERUPS                = 2;
const POWERUP_MIN_INTERVAL        = 9;
const POWERUP_MAX_INTERVAL        = 16;
const POWERUP_SIZE                = 32;
const POWERUP_SPEED_DURATION      = 5;
const POWERUP_MAGNET_DURATION     = 6;
const POWERUP_MAGNET_RANGE        = 130;
const SPEED_BOOST_MULT            = 1.85;

const CHASER_SIZE                 = 48;
const CHASER_Y_SPEED              = 190;
const CHASER_BASE_SPEED           = 28;
const CHASER_ACCELERATION         = 1.6;
const CHASER_MAX_SPEED            = 115;
const CHASER_OBSTACLE_GAIN        = 55;
const MAX_LEAD_DISPLAY            = 460;

const SPRINT_SPEED_MULT           = 2.0;
const SHARK_ROAR_PUSHBACK         = 160;

// ——— Module state ———
let selectedCharacter = CHARACTERS[0].id;
let keys = { up: false, down: false };
let gameState = null;
let loopId    = null;

// =========================================================
// Core utilities
// =========================================================

function setActiveScreen(screenEl) {
  [startScreen, gameScreen, gameOverScreen].forEach(el => el.classList.remove('active'));
  screenEl.classList.add('active');
}

function getCharDef(id) {
  return CHARACTERS.find(c => c.id === (id || selectedCharacter)) || CHARACTERS[0];
}

function random(min, max) {
  return Math.random() * (max - min) + min;
}

function removeEntity(entity, collection) {
  entity.el.remove();
  const idx = collection.indexOf(entity);
  if (idx >= 0) collection.splice(idx, 1);
}

// =========================================================
// Character UI
// =========================================================

function buildCharacterSelectors() {
  characterOptions.innerHTML = '';
  inGameCharacter.innerHTML  = '';

  CHARACTERS.forEach(ch => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'char-btn';
    btn.dataset.characterId = ch.id;
    btn.innerHTML = `
      <span class="emoji">${ch.emoji}</span>
      ${ch.label}
      <span class="ability-tag">${ch.ability.emoji} ${ch.ability.name}</span>
      <span class="ability-desc">${ch.ability.desc}</span>
    `;
    btn.addEventListener('click', () => { selectedCharacter = ch.id; syncCharacterUI(); });
    characterOptions.appendChild(btn);

    const opt = document.createElement('option');
    opt.value = ch.id;
    opt.textContent = `${ch.emoji} ${ch.label}`;
    inGameCharacter.appendChild(opt);
  });

  inGameCharacter.addEventListener('change', e => {
    selectedCharacter = e.target.value;
    syncCharacterUI();
  });
}

function syncCharacterUI() {
  characterOptions.querySelectorAll('.char-btn').forEach(btn =>
    btn.classList.toggle('active', btn.dataset.characterId === selectedCharacter)
  );
  inGameCharacter.value = selectedCharacter;
  const ch = getCharDef();
  if (ch) {
    playerEl.textContent = ch.emoji;
    playerEl.dataset.character = ch.id;
  }
  if (gameState && gameState.running) {
    playerEl.classList.remove('ability-active', 'shielded');
    gameState.ability = { cooldown: 0, active: false, activeRemaining: 0 };
    updateAbilityDisplay();
  }
}

// =========================================================
// Sea animals
// =========================================================

function createSeaAnimal() {
  const emojis = gameState.zone.seaAnimals;
  const el = document.createElement('div');
  el.className = 'sea-animal';
  el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
  const size = random(20, 36);
  const y = random(MIN_SEA_ANIMAL_Y,
    Math.max(SEA_ANIMAL_FALLBACK_MAX_Y, swimStage.clientHeight - SEA_ANIMAL_BOTTOM_PADDING));
  el.style.fontSize = `${size}px`;
  el.style.left = `${swimStage.clientWidth + random(0, 240)}px`;
  el.style.top  = `${y}px`;
  seaLayer.appendChild(el);
  return { el, x: parseFloat(el.style.left), y, speed: random(70, 140) };
}

function updateSeaAnimals(dt) {
  if (gameState.seaAnimals.length < MAX_SEA_ANIMALS && Math.random() < dt * SEA_ANIMAL_SPAWN_RATE)
    gameState.seaAnimals.push(createSeaAnimal());

  gameState.seaAnimals.slice().forEach(a => {
    a.x -= a.speed * dt;
    a.el.style.left = `${a.x}px`;
    if (a.x < -60) removeEntity(a, gameState.seaAnimals);
  });
}

// =========================================================
// Obstacles
// =========================================================

function createObstacle() {
  const list = gameState.zone.obstacles;
  const el = document.createElement('div');
  el.className = 'obstacle';
  el.textContent = list[Math.floor(Math.random() * list.length)];
  const y = random(MIN_OBSTACLE_Y,
    Math.max(OBSTACLE_FALLBACK_MAX_Y, swimStage.clientHeight - OBSTACLE_BOTTOM_PADDING));
  el.style.left = `${swimStage.clientWidth + random(0, 80)}px`;
  el.style.top  = `${y}px`;
  obstacleLayer.appendChild(el);
  const speed = random(220, 330) * gameState.zone.speedMult;
  return { el, x: parseFloat(el.style.left), y, speed, size: 34 };
}

function intersectsPlayer(obs) {
  const playerTop = gameState.playerY;
  const playerBottom = gameState.playerY + PLAYER_SIZE;
  const playerLeft = PLAYER_LEFT_OFFSET;
  const playerRight = PLAYER_LEFT_OFFSET + PLAYER_SIZE;
  const obstacleLeft = obs.x + COLLISION_PADDING;
  const obstacleRight = obs.x + obs.size - COLLISION_PADDING;
  const obstacleTop = obs.y + COLLISION_PADDING;
  const obstacleBottom = obs.y + obs.size - COLLISION_PADDING;

  return (
    playerRight > obstacleLeft &&
    playerLeft < obstacleRight &&
    playerBottom > obstacleTop &&
    playerTop < obstacleBottom
  );
}

function updateObstacles(dt) {
  gameState.obstacleSpawnTimer -= dt;
  if (gameState.obstacleSpawnTimer <= 0) {
    gameState.obstacles.push(createObstacle());
    gameState.obstacleSpawnTimer =
      random(MIN_OBSTACLE_INTERVAL, MAX_OBSTACLE_INTERVAL) / gameState.zone.obstacleRate;
  }

  const now = performance.now();
  gameState.obstacles.slice().forEach(obs => {
    obs.x -= obs.speed * dt;
    obs.el.style.left = `${obs.x}px`;
    if (obs.x < -50) { removeEntity(obs, gameState.obstacles); return; }

    const turtleShell = gameState.ability.active && selectedCharacter === 'turtle';
    if (turtleShell) return;

    if (intersectsPlayer(obs) && now - gameState.lastDamageAt > INVULNERABLE_MS) {
      gameState.lastDamageAt = now;
      if (gameState.powerups.shield) {
        gameState.powerups.shield = false;
        playerEl.classList.remove('shielded');
        showHitEffect(false);
        return;
      }
      gameState.hp -= 20;
      gameState.chaser.x -= CHASER_OBSTACLE_GAIN;
      updateHpDisplay();
      updateLeadDisplay();
      showHitEffect(true);
      if (gameState.hp <= 0) endGame();
    }
  });
}

// =========================================================
// Visual hit effect
// =========================================================

function showHitEffect(damaging) {
  // Player knockback animation
  playerEl.classList.remove('hit');
  void playerEl.offsetWidth; // force reflow to restart animation
  playerEl.classList.add('hit');

  // Screen shake
  swimStage.classList.remove('shaking');
  void swimStage.offsetWidth;
  swimStage.classList.add('shaking');
  swimStage.addEventListener('animationend', () => swimStage.classList.remove('shaking'), { once: true });

  if (damaging) {
    hitOverlay.classList.add('active');
    setTimeout(() => hitOverlay.classList.remove('active'), 380);
    showFloatingText('💢 OUCH!', PLAYER_LEFT_OFFSET, gameState.playerY - 10, '#ff4d4d');
  } else {
    showFloatingText('🛡️ Blocked!', PLAYER_LEFT_OFFSET, gameState.playerY - 10, '#6fb8ff');
  }
}

function showFloatingText(text, x, y, color) {
  const el = document.createElement('div');
  el.className = 'float-text';
  el.textContent = text;
  el.style.left  = `${x}px`;
  el.style.top   = `${y}px`;
  el.style.color = color || '#fff';
  swimStage.appendChild(el);
  setTimeout(() => el.remove(), 1100);
}

// =========================================================
// Collectibles
// =========================================================

function createCollectible() {
  const el = document.createElement('div');
  el.className = 'collectible';
  el.textContent = COLLECTIBLE_EMOJIS[Math.floor(Math.random() * COLLECTIBLE_EMOJIS.length)];
  const y = random(MIN_COLLECTIBLE_Y,
    Math.max(COLLECTIBLE_FALLBACK_MAX_Y, swimStage.clientHeight - COLLECTIBLE_BOTTOM_PADDING));
  el.style.left = `${swimStage.clientWidth + random(0, 120)}px`;
  el.style.top  = `${y}px`;
  collectibleLayer.appendChild(el);
  return { el, x: parseFloat(el.style.left), y, speed: random(160, 240), size: COLLECTIBLE_SIZE, collected: false };
}

function intersectsItem(item) {
  const pt = gameState.playerY, pb = gameState.playerY + PLAYER_SIZE;
  const pl = PLAYER_LEFT_OFFSET, pr = PLAYER_LEFT_OFFSET + PLAYER_SIZE;
  return pr > item.x && pl < item.x + item.size &&
         pb > item.y && pt < item.y + item.size;
}

function doCollect(item, collection) {
  if (item.collected) return;
  item.collected = true;
  gameState.score += COLLECTIBLE_SCORE;
  gameState.chaser.x += COLLECTIBLE_CHASER_PUSH;
  updateScoreDisplay();
  updateLeadDisplay();
  showFloatingText('+10 ✨', item.x, item.y - 8, '#ffe066');
  item.el.classList.add('collected');
  setTimeout(() => removeEntity(item, collection), 360);
}

function updateCollectibles(dt) {
  if (gameState.collectibles.length < MAX_COLLECTIBLES && Math.random() < dt * COLLECTIBLE_SPAWN_RATE)
    gameState.collectibles.push(createCollectible());

  const magnet = gameState.powerups.magnet > 0;
  gameState.collectibles.slice().forEach(item => {
    if (item.collected) return;
    item.x -= item.speed * dt;
    item.el.style.left = `${item.x}px`;
    if (item.x < -60) { removeEntity(item, gameState.collectibles); return; }

    const cx = item.x + item.size / 2, cy = item.y + item.size / 2;
    const px = PLAYER_LEFT_OFFSET + PLAYER_SIZE / 2, py = gameState.playerY + PLAYER_SIZE / 2;
    const inMagnet = magnet && Math.abs(cx - px) < POWERUP_MAGNET_RANGE && Math.abs(cy - py) < POWERUP_MAGNET_RANGE;

    if (intersectsItem(item) || inMagnet) doCollect(item, gameState.collectibles);
  });
}

// =========================================================
// Power-ups
// =========================================================

function createPowerup() {
  const type = POWERUP_TYPES[Math.floor(Math.random() * POWERUP_TYPES.length)];
  const el = document.createElement('div');
  el.className = 'powerup';
  el.dataset.type = type.id;
  el.textContent = type.emoji;
  const y = random(MIN_COLLECTIBLE_Y,
    Math.max(COLLECTIBLE_FALLBACK_MAX_Y, swimStage.clientHeight - COLLECTIBLE_BOTTOM_PADDING));
  el.style.left = `${swimStage.clientWidth + random(0, 80)}px`;
  el.style.top  = `${y}px`;
  powerupLayer.appendChild(el);
  return { el, type: type.id, x: parseFloat(el.style.left), y, speed: random(140, 200), size: POWERUP_SIZE, collected: false };
}

function applyPowerup(type, x, y) {
  switch (type) {
    case 'speed':
      gameState.powerups.speed = POWERUP_SPEED_DURATION;
      playerEl.classList.remove('powered-magnet');
      playerEl.classList.add('powered-speed');
      showFloatingText('⚡ Speed!', x, y - 8, '#ffe066');
      break;
    case 'shield':
      gameState.powerups.shield = true;
      playerEl.classList.add('shielded');
      showFloatingText('🛡️ Shield!', x, y - 8, '#6fb8ff');
      break;
    case 'heal':
      gameState.hp = Math.min(HP_MAX, gameState.hp + 30);
      updateHpDisplay();
      showFloatingText('+30 ❤️', x, y - 8, '#ff7070');
      break;
    case 'magnet':
      gameState.powerups.magnet = POWERUP_MAGNET_DURATION;
      playerEl.classList.remove('powered-speed');
      playerEl.classList.add('powered-magnet');
      showFloatingText('🧲 Magnet!', x, y - 8, '#ff80e0');
      break;
  }
}

function updatePowerups(dt) {
  gameState.powerupSpawnTimer -= dt;
  if (gameState.powerupSpawnTimer <= 0 && gameState.powerupsList.length < MAX_POWERUPS) {
    gameState.powerupsList.push(createPowerup());
    gameState.powerupSpawnTimer = random(POWERUP_MIN_INTERVAL, POWERUP_MAX_INTERVAL);
  }

  gameState.powerupsList.slice().forEach(item => {
    if (item.collected) return;
    item.x -= item.speed * dt;
    item.el.style.left = `${item.x}px`;
    if (item.x < -60) { removeEntity(item, gameState.powerupsList); return; }
    if (intersectsItem(item)) {
      item.collected = true;
      applyPowerup(item.type, item.x, item.y);
      item.el.classList.add('collected');
      setTimeout(() => removeEntity(item, gameState.powerupsList), 360);
    }
  });

  // Tick timers
  if (gameState.powerups.speed > 0) {
    gameState.powerups.speed -= dt;
    if (gameState.powerups.speed <= 0) { gameState.powerups.speed = 0; playerEl.classList.remove('powered-speed'); }
  }
  if (gameState.powerups.magnet > 0) {
    gameState.powerups.magnet -= dt;
    if (gameState.powerups.magnet <= 0) { gameState.powerups.magnet = 0; playerEl.classList.remove('powered-magnet'); }
  }
}

// =========================================================
// Chaser
// =========================================================

function updateChaser(dt) {
  const ch   = gameState.chaser;
  const zone = gameState.zone;
  const maxSpeed = CHASER_MAX_SPEED * zone.speedMult;
  ch.speed = Math.min(maxSpeed, ch.speed + CHASER_ACCELERATION * zone.chaserAccelMult * dt);
  ch.x -= ch.speed * dt;

  // Track player Y
  const targetY = gameState.playerY + (PLAYER_SIZE - CHASER_SIZE) / 2;
  if (ch.y < targetY) ch.y = Math.min(targetY, ch.y + CHASER_Y_SPEED * dt);
  else if (ch.y > targetY) ch.y = Math.max(targetY, ch.y - CHASER_Y_SPEED * dt);

  // Turtle shell physically blocks chaser
  const turtleShell = gameState.ability.active && selectedCharacter === 'turtle';
  if (turtleShell && ch.x < PLAYER_LEFT_OFFSET + PLAYER_SIZE + 15)
    ch.x = PLAYER_LEFT_OFFSET + PLAYER_SIZE + 15;

  chaserEl.style.left = `${ch.x}px`;
  chaserEl.style.top  = `${ch.y}px`;

  updateLeadDisplay();
  const lead = ch.x - (PLAYER_LEFT_OFFSET + PLAYER_SIZE);
  swimStage.classList.toggle('danger', lead < MAX_LEAD_DISPLAY * 0.28);

  if (!turtleShell && lead <= 0) endGame();
}

// =========================================================
// Special abilities
// =========================================================

function activateAbility() {
  const chDef = getCharDef();
  if (gameState.ability.cooldown > 0 || gameState.ability.active) return;

  gameState.ability.cooldown = chDef.ability.cooldown;
  const py = gameState.playerY - 10;

  switch (selectedCharacter) {
    case 'swimmer':
    case 'ragdoll':
      gameState.ability.active = true;
      gameState.ability.activeRemaining = chDef.ability.duration;
      playerEl.classList.add('ability-active');
      showFloatingText(
        selectedCharacter === 'ragdoll' ? '⚡ ZOOMIES!' : '⚡ SPRINT!',
        PLAYER_LEFT_OFFSET,
        py,
        '#ffe066'
      );
      break;

    case 'dolphin':
      // Blast all obstacles off-screen
      gameState.obstacles.forEach(obs => {
        obs.el.classList.add('sonar-blasted');
        setTimeout(() => obs.el.remove(), 340);
      });
      gameState.obstacles = [];
      playerEl.classList.add('ability-active');
      showFloatingText('🔊 SONAR BLAST!', PLAYER_LEFT_OFFSET, py, '#00d4ff');
      setTimeout(() => playerEl.classList.remove('ability-active'), 520);
      break;

    case 'shark':
      gameState.chaser.x += SHARK_ROAR_PUSHBACK;
      updateLeadDisplay();
      playerEl.classList.add('ability-active');
      showFloatingText('💢 ROAR! 🦈←←←', PLAYER_LEFT_OFFSET, py, '#ff6060');
      setTimeout(() => playerEl.classList.remove('ability-active'), 620);
      break;

    case 'turtle':
      gameState.ability.active = true;
      gameState.ability.activeRemaining = chDef.ability.duration;
      playerEl.classList.add('ability-active', 'shielded');
      showFloatingText('🛡️ SHELL ON!', PLAYER_LEFT_OFFSET, py, '#80ff80');
      break;
  }
  updateAbilityDisplay();
}

function updateAbility(dt) {
  if (gameState.ability.cooldown > 0)
    gameState.ability.cooldown = Math.max(0, gameState.ability.cooldown - dt);

  if (gameState.ability.active && gameState.ability.activeRemaining > 0) {
    gameState.ability.activeRemaining -= dt;
    if (gameState.ability.activeRemaining <= 0) {
      gameState.ability.activeRemaining = 0;
      gameState.ability.active = false;
      playerEl.classList.remove('ability-active');
      if (selectedCharacter === 'turtle') playerEl.classList.remove('shielded');
    }
  }
  updateAbilityDisplay();
}

// =========================================================
// Player movement
// =========================================================

function updatePlayer(dt) {
  let speed = PLAYER_SPEED;
  if (gameState.ability.active && (selectedCharacter === 'swimmer' || selectedCharacter === 'ragdoll')) {
    speed *= SPRINT_SPEED_MULT;
  } else if (gameState.powerups.speed > 0) {
    speed *= SPEED_BOOST_MULT;
  }

  const up   = keys.up   && !keys.down;
  const down = keys.down && !keys.up;
  if (up)   gameState.playerY -= speed * dt;
  if (down) gameState.playerY += speed * dt;

  const maxY = Math.max(0, swimStage.clientHeight - PLAYER_SIZE);
  gameState.playerY = Math.min(maxY, Math.max(0, gameState.playerY));
  playerEl.style.top = `${gameState.playerY}px`;
}

// =========================================================
// Zone management
// =========================================================

function applyZoneTheme(zone) {
  const grad = `linear-gradient(180deg, ${zone.bgTop}, ${zone.bgMid} 45%, ${zone.bgBot})`;
  swimStage.style.background = grad;
  document.body.style.background = grad;
  zoneDisplay.textContent = `${zone.emoji} ${zone.name}`;
}

function showZoneBanner(zone) {
  zoneBanner.textContent = `${zone.emoji}  ${zone.name}`;
  zoneBanner.classList.add('visible');
  clearTimeout(gameState.bannerTimer);
  gameState.bannerTimer = setTimeout(() => zoneBanner.classList.remove('visible'), 2600);
}

function updateZone() {
  const dist = gameState.distance;
  let next = ZONES[0];
  for (let i = ZONES.length - 1; i >= 0; i--) {
    if (dist >= ZONES[i].minDist) { next = ZONES[i]; break; }
  }
  if (next.id !== gameState.zone.id) {
    gameState.zone = next;
    applyZoneTheme(next);
    showZoneBanner(next);
  }
}

// =========================================================
// HUD display helpers
// =========================================================

function updateHpDisplay() {
  const hp = Math.max(0, gameState.hp);
  hpText.textContent = Math.round(hp);
  hpBarFill.style.width = `${hp}%`;
  hpBarFill.style.backgroundColor = hp > 60 ? '#43a047' : hp > 30 ? '#f9a825' : '#e53935';
}

function updateLeadDisplay() {
  const lead = gameState.chaser.x - (PLAYER_LEFT_OFFSET + PLAYER_SIZE);
  const pct  = Math.max(0, Math.min(100, (lead / MAX_LEAD_DISPLAY) * 100));
  leadBarFill.style.width = `${pct}%`;
  leadBarFill.style.backgroundColor = pct > 55 ? '#43a047' : pct > 28 ? '#f9a825' : '#e53935';
}

function updateScoreDisplay() {
  scoreDisplay.textContent = String(gameState.score);
}

function updateDistanceDisplay() {
  distanceDisplay.textContent = `${Math.floor(gameState.distance)}m`;
}

function updateAbilityDisplay() {
  if (!gameState) return;
  const chDef = getCharDef();
  const ab    = gameState.ability;
  let text, ready;
  if (ab.active) {
    text  = `${chDef.ability.emoji} ${chDef.ability.name} ▶ ACTIVE`;
    ready = false;
  } else if (ab.cooldown > 0) {
    text  = `${chDef.ability.emoji} ${chDef.ability.name} ${Math.ceil(ab.cooldown)}s`;
    ready = false;
  } else {
    text  = `${chDef.ability.emoji} ${chDef.ability.name} ✓ READY`;
    ready = true;
  }
  abilityDisplay.textContent = text;
  abilityDisplay.className   = `ability-display${ready ? ' ability-ready' : ''}`;
}

// =========================================================
// Game loop
// =========================================================

function gameLoop(now) {
  if (!gameState || !gameState.running) return;

  const dt = Math.min((now - gameState.lastFrameAt) / 1000, MAX_FRAME_TIME);
  gameState.lastFrameAt = now;
  gameState.distance += dt * DISTANCE_RATE;

  updatePlayer(dt);
  updateSeaAnimals(dt);
  updateObstacles(dt);
  updateCollectibles(dt);
  updatePowerups(dt);
  updateChaser(dt);
  updateAbility(dt);
  updateZone();
  updateDistanceDisplay();

  loopId = requestAnimationFrame(gameLoop);
}

// =========================================================
// Game state management
// =========================================================

function clearGameEntities() {
  seaLayer.innerHTML         = '';
  collectibleLayer.innerHTML = '';
  powerupLayer.innerHTML     = '';
  obstacleLayer.innerHTML    = '';
}

function beginGame() {
  clearGameEntities();
  syncCharacterUI();
  setActiveScreen(gameScreen);

  swimStage.classList.remove('danger', 'shaking');
  hitOverlay.classList.remove('active');
  zoneBanner.classList.remove('visible');
  playerEl.classList.remove('hit', 'shielded', 'ability-active', 'powered-speed', 'powered-magnet');

  const startY     = Math.max(0, swimStage.clientHeight / 2 - PLAYER_SIZE / 2);
  const stageW     = swimStage.clientWidth || 640;
  const chaserStartX = stageW + 100;

  playerEl.style.left = `${PLAYER_LEFT_OFFSET}px`;
  playerEl.style.top  = `${startY}px`;
  chaserEl.style.left = `${chaserStartX}px`;
  chaserEl.style.top  = `${startY}px`;

  gameState = {
    running: true,
    hp: HP_MAX,
    score: 0,
    distance: 0,
    playerY: startY,
    zone: ZONES[0],
    seaAnimals: [],
    obstacles: [],
    collectibles: [],
    powerupsList: [],
    obstacleSpawnTimer: INITIAL_OBSTACLE_SPAWN_DELAY,
    powerupSpawnTimer:  random(POWERUP_MIN_INTERVAL, POWERUP_MAX_INTERVAL),
    lastDamageAt: -INVULNERABLE_MS,
    lastFrameAt:  performance.now(),
    bannerTimer:  null,
    chaser:   { x: chaserStartX, y: startY, speed: CHASER_BASE_SPEED },
    powerups: { speed: 0, shield: false, magnet: 0 },
    ability:  { cooldown: 0, active: false, activeRemaining: 0 },
  };

  applyZoneTheme(ZONES[0]);
  updateHpDisplay();
  updateScoreDisplay();
  updateLeadDisplay();
  updateDistanceDisplay();
  updateAbilityDisplay();

  loopId = requestAnimationFrame(gameLoop);
}

function endGame() {
  if (!gameState || !gameState.running) return;
  gameState.running = false;
  clearTimeout(gameState.bannerTimer);
  swimStage.classList.remove('danger');
  if (loopId) cancelAnimationFrame(loopId);

  finalDistance.textContent = `You swam ${Math.floor(gameState.distance)}m`;
  finalScore.textContent    = `Score: ${gameState.score}`;
  finalZone.textContent     = `Zone reached: ${gameState.zone.emoji} ${gameState.zone.name}`;
  setActiveScreen(gameOverScreen);
}

// =========================================================
// Input / events
// =========================================================

function onKey(event, isDown) {
  const k = event.key;
  if      (k === 'ArrowUp'   || k === 'w' || k === 'W') { keys.up   = isDown; event.preventDefault(); }
  else if (k === 'ArrowDown' || k === 's' || k === 'S') { keys.down = isDown; event.preventDefault(); }
  else if ((k === ' ' || k === 'Enter') && isDown && gameState && gameState.running) {
    activateAbility();
    event.preventDefault();
  }
}

function setupEvents() {
  startBtn.addEventListener('click', beginGame);
  restartBtn.addEventListener('click', beginGame);
  abilityBtn.addEventListener('click', () => { if (gameState && gameState.running) activateAbility(); });

  document.addEventListener('keydown', e => onKey(e, true));
  document.addEventListener('keyup',   e => onKey(e, false));
  window.addEventListener('blur', () => { keys.up = false; keys.down = false; });

  // Touch controls: swipe up/down to move
  let touchY = null;
  swimStage.addEventListener('touchstart', e => { touchY = e.touches[0].clientY; }, { passive: true });
  swimStage.addEventListener('touchmove',  e => {
    if (touchY === null) return;
    const dy = e.touches[0].clientY - touchY;
    keys.up   = dy < -12;
    keys.down = dy > 12;
  }, { passive: true });
  swimStage.addEventListener('touchend', () => { keys.up = false; keys.down = false; touchY = null; }, { passive: true });
}

// =========================================================
// Init
// =========================================================
buildCharacterSelectors();
syncCharacterUI();
setupEvents();
