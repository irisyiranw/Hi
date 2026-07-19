/* =========================================================
   Cat Chase – cat-game.js
   ========================================================= */

// ——— Zone definitions ———
const ZONES = [
  {
    id: 'backyard', name: 'Backyard', emoji: '🏡', minDist: 0,
    bgTop: '#e8f5e9', bgMid: '#a5d6a7', bgBot: '#4caf50',
    cityItems:  ['🌿', '🌸', '🌼', '🍃', '🌱', '🐛'],
    obstacles:  ['🐶', '🧱', '🗑️'],
    speedMult: 1.0, chaserAccelMult: 1.0, obstacleRate: 1.0,
  },
  {
    id: 'neighborhood', name: 'Neighborhood', emoji: '🏘️', minDist: 200,
    bgTop: '#fffde7', bgMid: '#fff176', bgBot: '#f9a825',
    cityItems:  ['🏠', '🚲', '📬', '🌳', '🌲', '🪴'],
    obstacles:  ['🐶', '🧱', '🚧'],
    speedMult: 1.22, chaserAccelMult: 1.15, obstacleRate: 1.12,
  },
  {
    id: 'downtown', name: 'Downtown', emoji: '🏪', minDist: 500,
    bgTop: '#fce4ec', bgMid: '#f48fb1', bgBot: '#c2185b',
    cityItems:  ['🏪', '🛒', '☕', '🍕', '💈', '🚕'],
    obstacles:  ['🐶', '🧱', '🚧'],
    speedMult: 1.5, chaserAccelMult: 1.32, obstacleRate: 1.25,
  },
  {
    id: 'highway', name: 'Highway', emoji: '🚗', minDist: 900,
    bgTop: '#e3f2fd', bgMid: '#90caf9', bgBot: '#1565c0',
    cityItems:  ['🚗', '🚛', '🏎️', '🚦', '⛽', '🚧'],
    obstacles:  ['🐶', '🧱', '💥'],
    speedMult: 1.82, chaserAccelMult: 1.55, obstacleRate: 1.42,
  },
  {
    id: 'citycenter', name: 'City Center', emoji: '🌆', minDist: 1400,
    bgTop: '#212121', bgMid: '#424242', bgBot: '#000000',
    cityItems:  ['🌆', '🏙️', '🌃', '✨', '💡', '🌉'],
    obstacles:  ['🐶', '💥', '🧱'],
    speedMult: 2.15, chaserAccelMult: 1.85, obstacleRate: 1.6,
  },
];

// ——— Character definitions with special abilities ———
const CATS = [
  { id: 'tabby',  emoji: '🐱',   label: 'Tabby',
    ability: { name: 'Pounce',     emoji: '⚡', cooldown: 8,  duration: 3.5, desc: 'Doubles run speed!' } },
  { id: 'black',  emoji: '🐈‍⬛', label: 'Black Cat',
    ability: { name: 'Shadow',     emoji: '🌑', cooldown: 12, duration: 4,   desc: 'Full invincibility 4s!' } },
  { id: 'tiger',  emoji: '🐯',   label: 'Tiger Cat',
    ability: { name: 'Roar',       emoji: '💢', cooldown: 9,  duration: 0,   desc: 'Shoves dog far back!' } },
  { id: 'lion',   emoji: '🦁',   label: 'Lion Cat',
    ability: { name: 'Pride Roar', emoji: '🔊', cooldown: 10, duration: 0,   desc: 'Blasts all obstacles!' } },
];

// ——— Power-up types ———
const POWERUP_TYPES = [
  { id: 'speed',  emoji: '⚡', label: 'Speed Boost' },
  { id: 'shield', emoji: '🛡️', label: 'Shield' },
  { id: 'heal',   emoji: '💊', label: 'HP Kit' },
  { id: 'magnet', emoji: '🧲', label: 'Magnet' },
];

const COLLECTIBLE_EMOJIS = ['🐟', '🧶', '🎀', '🐾'];

// ——— DOM references ———
const startScreen      = document.getElementById('cat-start-screen');
const gameScreen       = document.getElementById('cat-game-screen');
const gameOverScreen   = document.getElementById('cat-gameover-screen');
const catOptions       = document.getElementById('cat-options');
const inGameCat        = document.getElementById('ingame-cat');
const startBtn         = document.getElementById('start-cat-btn');
const restartBtn       = document.getElementById('restart-cat-btn');
const abilityBtn       = document.getElementById('ability-btn');
const catStage         = document.getElementById('cat-stage');
const cityLayer        = document.getElementById('city-layer');
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
const chaseDisplay     = document.getElementById('chase-display');
const zoneDisplay      = document.getElementById('zone-display');
const finalChase       = document.getElementById('final-chase');
const finalScore       = document.getElementById('final-score');
const finalZone        = document.getElementById('final-zone');

// ——— Game constants ———
const PLAYER_LEFT_OFFSET          = 84;
const PLAYER_SIZE                 = 40;
const HP_MAX                      = 100;
const PLAYER_SPEED                = 320;
const INVULNERABLE_MS             = 800;
const MIN_CITY_ITEM_Y             = 18;
const CITY_ITEM_FALLBACK_MAX_Y    = 22;
const CITY_ITEM_BOTTOM_PADDING    = 40;
const MIN_OBSTACLE_Y              = 22;
const OBSTACLE_FALLBACK_MAX_Y     = 30;
const OBSTACLE_BOTTOM_PADDING     = 46;
const COLLISION_PADDING           = 6;
const MAX_CITY_ITEMS              = 7;
const CITY_ITEM_SPAWN_RATE        = 2.4;
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
const TIGER_ROAR_PUSHBACK         = 160;

// ——— Module state ———
let selectedCat = CATS[0].id;
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

function getCatDef(id) {
  return CATS.find(c => c.id === (id || selectedCat)) || CATS[0];
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

function buildCatSelectors() {
  catOptions.innerHTML = '';
  inGameCat.innerHTML  = '';

  CATS.forEach(cat => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'cat-option-btn';
    btn.dataset.characterId = cat.id;
    btn.innerHTML = `
      <span class="emoji">${cat.emoji}</span>
      ${cat.label}
      <span class="ability-tag">${cat.ability.emoji} ${cat.ability.name}</span>
      <span class="ability-desc">${cat.ability.desc}</span>
    `;
    btn.addEventListener('click', () => { selectedCat = cat.id; syncCatUI(); });
    catOptions.appendChild(btn);

    const opt = document.createElement('option');
    opt.value = cat.id;
    opt.textContent = `${cat.emoji} ${cat.label}`;
    inGameCat.appendChild(opt);
  });

  inGameCat.addEventListener('change', e => {
    selectedCat = e.target.value;
    syncCatUI();
  });
}

function syncCatUI() {
  catOptions.querySelectorAll('.cat-option-btn').forEach(btn =>
    btn.classList.toggle('active', btn.dataset.characterId === selectedCat)
  );
  inGameCat.value = selectedCat;
  const cat = getCatDef();
  if (cat) {
    playerEl.textContent = cat.emoji;
    playerEl.dataset.character = cat.id;
  }
  if (gameState && gameState.running) {
    playerEl.classList.remove('ability-active', 'shielded');
    gameState.ability = { cooldown: 0, active: false, activeRemaining: 0 };
    updateAbilityDisplay();
  }
}

// =========================================================
// City items (background decoration)
// =========================================================

function createCityItem() {
  const emojis = gameState.zone.cityItems;
  const el = document.createElement('div');
  el.className = 'city-item';
  el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
  const size = random(20, 36);
  const y = random(MIN_CITY_ITEM_Y,
    Math.max(CITY_ITEM_FALLBACK_MAX_Y, catStage.clientHeight - CITY_ITEM_BOTTOM_PADDING));
  el.style.fontSize = `${size}px`;
  el.style.left = `${catStage.clientWidth + random(0, 240)}px`;
  el.style.top  = `${y}px`;
  cityLayer.appendChild(el);
  return { el, x: parseFloat(el.style.left), y, speed: random(70, 140) };
}

function updateCityItems(dt) {
  if (gameState.cityItems.length < MAX_CITY_ITEMS && Math.random() < dt * CITY_ITEM_SPAWN_RATE)
    gameState.cityItems.push(createCityItem());

  gameState.cityItems.slice().forEach(item => {
    item.x -= item.speed * dt;
    item.el.style.left = `${item.x}px`;
    if (item.x < -60) removeEntity(item, gameState.cityItems);
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
    Math.max(OBSTACLE_FALLBACK_MAX_Y, catStage.clientHeight - OBSTACLE_BOTTOM_PADDING));
  el.style.left = `${catStage.clientWidth + random(0, 80)}px`;
  el.style.top  = `${y}px`;
  obstacleLayer.appendChild(el);
  const speed = random(220, 330) * gameState.zone.speedMult;
  return { el, x: parseFloat(el.style.left), y, speed, size: 34 };
}

function intersectsPlayer(obs) {
  const playerTop    = gameState.playerY;
  const playerBottom = gameState.playerY + PLAYER_SIZE;
  const playerLeft   = PLAYER_LEFT_OFFSET;
  const playerRight  = PLAYER_LEFT_OFFSET + PLAYER_SIZE;
  const obsLeft      = obs.x + COLLISION_PADDING;
  const obsRight     = obs.x + obs.size - COLLISION_PADDING;
  const obsTop       = obs.y + COLLISION_PADDING;
  const obsBottom    = obs.y + obs.size - COLLISION_PADDING;

  return (
    playerRight > obsLeft &&
    playerLeft  < obsRight &&
    playerBottom > obsTop &&
    playerTop   < obsBottom
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

    const blackShadow = gameState.ability.active && selectedCat === 'black';
    if (blackShadow) return;

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
  playerEl.classList.remove('hit');
  void playerEl.offsetWidth;
  playerEl.classList.add('hit');

  catStage.classList.remove('shaking');
  void catStage.offsetWidth;
  catStage.classList.add('shaking');
  catStage.addEventListener('animationend', () => catStage.classList.remove('shaking'), { once: true });

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
  catStage.appendChild(el);
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
    Math.max(COLLECTIBLE_FALLBACK_MAX_Y, catStage.clientHeight - COLLECTIBLE_BOTTOM_PADDING));
  el.style.left = `${catStage.clientWidth + random(0, 120)}px`;
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
    Math.max(COLLECTIBLE_FALLBACK_MAX_Y, catStage.clientHeight - COLLECTIBLE_BOTTOM_PADDING));
  el.style.left = `${catStage.clientWidth + random(0, 80)}px`;
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

  const targetY = gameState.playerY + (PLAYER_SIZE - CHASER_SIZE) / 2;
  if (ch.y < targetY) ch.y = Math.min(targetY, ch.y + CHASER_Y_SPEED * dt);
  else if (ch.y > targetY) ch.y = Math.max(targetY, ch.y - CHASER_Y_SPEED * dt);

  // Black cat shadow physically blocks chaser
  const blackShadow = gameState.ability.active && selectedCat === 'black';
  if (blackShadow && ch.x < PLAYER_LEFT_OFFSET + PLAYER_SIZE + 15)
    ch.x = PLAYER_LEFT_OFFSET + PLAYER_SIZE + 15;

  chaserEl.style.left = `${ch.x}px`;
  chaserEl.style.top  = `${ch.y}px`;

  updateLeadDisplay();
  const lead = ch.x - (PLAYER_LEFT_OFFSET + PLAYER_SIZE);
  catStage.classList.toggle('danger', lead < MAX_LEAD_DISPLAY * 0.28);

  if (!blackShadow && lead <= 0) endGame();
}

// =========================================================
// Special abilities
// =========================================================

function activateAbility() {
  const catDef = getCatDef();
  if (gameState.ability.cooldown > 0 || gameState.ability.active) return;

  gameState.ability.cooldown = catDef.ability.cooldown;
  const py = gameState.playerY - 10;

  switch (selectedCat) {
    case 'tabby':
      gameState.ability.active = true;
      gameState.ability.activeRemaining = catDef.ability.duration;
      playerEl.classList.add('ability-active');
      showFloatingText('⚡ POUNCE!', PLAYER_LEFT_OFFSET, py, '#ffe066');
      break;

    case 'lion':
      gameState.obstacles.forEach(obs => {
        obs.el.classList.add('pride-blasted');
        setTimeout(() => obs.el.remove(), 340);
      });
      gameState.obstacles = [];
      playerEl.classList.add('ability-active');
      showFloatingText('🔊 PRIDE ROAR!', PLAYER_LEFT_OFFSET, py, '#ffd54f');
      setTimeout(() => playerEl.classList.remove('ability-active'), 520);
      break;

    case 'tiger':
      gameState.chaser.x += TIGER_ROAR_PUSHBACK;
      updateLeadDisplay();
      playerEl.classList.add('ability-active');
      showFloatingText('💢 ROAR! 🐕←←←', PLAYER_LEFT_OFFSET, py, '#ff6060');
      setTimeout(() => playerEl.classList.remove('ability-active'), 620);
      break;

    case 'black':
      gameState.ability.active = true;
      gameState.ability.activeRemaining = catDef.ability.duration;
      playerEl.classList.add('ability-active', 'shielded');
      showFloatingText('🌑 SHADOW ON!', PLAYER_LEFT_OFFSET, py, '#b0bec5');
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
      if (selectedCat === 'black') playerEl.classList.remove('shielded');
    }
  }
  updateAbilityDisplay();
}

// =========================================================
// Player movement
// =========================================================

function updatePlayer(dt) {
  let speed = PLAYER_SPEED;
  if (gameState.ability.active && selectedCat === 'tabby') {
    speed *= SPRINT_SPEED_MULT;
  } else if (gameState.powerups.speed > 0) {
    speed *= SPEED_BOOST_MULT;
  }

  const up   = keys.up   && !keys.down;
  const down = keys.down && !keys.up;
  if (up)   gameState.playerY -= speed * dt;
  if (down) gameState.playerY += speed * dt;

  const maxY = Math.max(0, catStage.clientHeight - PLAYER_SIZE);
  gameState.playerY = Math.min(maxY, Math.max(0, gameState.playerY));
  playerEl.style.top = `${gameState.playerY}px`;
}

// =========================================================
// Zone management
// =========================================================

function applyZoneTheme(zone) {
  const grad = `linear-gradient(180deg, ${zone.bgTop}, ${zone.bgMid} 45%, ${zone.bgBot})`;
  catStage.style.background = grad;
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
  chaseDisplay.textContent = `${Math.floor(gameState.distance)}m`;
}

function updateAbilityDisplay() {
  if (!gameState) return;
  const catDef = getCatDef();
  const ab     = gameState.ability;
  let text, ready;
  if (ab.active) {
    text  = `${catDef.ability.emoji} ${catDef.ability.name} ▶ ACTIVE`;
    ready = false;
  } else if (ab.cooldown > 0) {
    text  = `${catDef.ability.emoji} ${catDef.ability.name} ${Math.ceil(ab.cooldown)}s`;
    ready = false;
  } else {
    text  = `${catDef.ability.emoji} ${catDef.ability.name} ✓ READY`;
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
  updateCityItems(dt);
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
  cityLayer.innerHTML        = '';
  collectibleLayer.innerHTML = '';
  powerupLayer.innerHTML     = '';
  obstacleLayer.innerHTML    = '';
}

function beginGame() {
  clearGameEntities();
  syncCatUI();
  setActiveScreen(gameScreen);

  catStage.classList.remove('danger', 'shaking');
  hitOverlay.classList.remove('active');
  zoneBanner.classList.remove('visible');
  playerEl.classList.remove('hit', 'shielded', 'ability-active', 'powered-speed', 'powered-magnet');

  const startY      = Math.max(0, catStage.clientHeight / 2 - PLAYER_SIZE / 2);
  const stageW      = catStage.clientWidth || 640;
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
    cityItems: [],
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
  catStage.classList.remove('danger');
  if (loopId) cancelAnimationFrame(loopId);

  finalChase.textContent = `You ran ${Math.floor(gameState.distance)}m`;
  finalScore.textContent = `Score: ${gameState.score}`;
  finalZone.textContent  = `Zone reached: ${gameState.zone.emoji} ${gameState.zone.name}`;
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
  catStage.addEventListener('touchstart', e => { touchY = e.touches[0].clientY; }, { passive: true });
  catStage.addEventListener('touchmove',  e => {
    if (touchY === null) return;
    const dy = e.touches[0].clientY - touchY;
    keys.up   = dy < -12;
    keys.down = dy > 12;
  }, { passive: true });
  catStage.addEventListener('touchend', () => { keys.up = false; keys.down = false; touchY = null; }, { passive: true });
}

// =========================================================
// Init
// =========================================================
buildCatSelectors();
syncCatUI();
setupEvents();
