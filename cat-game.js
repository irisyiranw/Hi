const CATS = [
  { id: 'tabby', emoji: '🐱', label: 'Tabby' },
  { id: 'black', emoji: '🐈‍⬛', label: 'Black Cat' },
  { id: 'tiger', emoji: '🐯', label: 'Tiger Cat' },
  { id: 'lion', emoji: '🦁', label: 'Lion Cat' }
];

const CITY_ITEMS = ['🐭', '🧶', '🐟', '🕊️'];
const OBSTACLES = ['🐶', '🧱', '🗑️'];

const startScreen = document.getElementById('cat-start-screen');
const gameScreen = document.getElementById('cat-game-screen');
const gameOverScreen = document.getElementById('cat-gameover-screen');
const catOptions = document.getElementById('cat-options');
const inGameCat = document.getElementById('ingame-cat');
const startBtn = document.getElementById('start-cat-btn');
const restartBtn = document.getElementById('restart-cat-btn');
const catStage = document.getElementById('cat-stage');
const cityLayer = document.getElementById('city-layer');
const obstacleLayer = document.getElementById('obstacle-layer');
const playerEl = document.getElementById('player');
const hpBarFill = document.getElementById('hp-bar-fill');
const hpText = document.getElementById('hp-text');
const chaseDisplay = document.getElementById('chase-display');
const finalChase = document.getElementById('final-chase');

const PLAYER_LEFT_OFFSET = 84;
const PLAYER_SIZE = 40;
const HP_MAX = 100;
const PLAYER_SPEED = 320;
const INVULNERABLE_MS = 650;
const MIN_CITY_ITEM_Y = 18;
const CITY_ITEM_MIN_MAX_Y = 22;
const CITY_ITEM_BOTTOM_PADDING = 40;
const MIN_OBSTACLE_Y = 22;
const OBSTACLE_MIN_MAX_Y = 30;
const OBSTACLE_BOTTOM_PADDING = 46;
const COLLISION_PADDING = 6;
const MAX_CITY_ITEMS = 7;
const CITY_ITEM_SPAWN_RATE = 2.4;
const MIN_OBSTACLE_INTERVAL = 0.62;
const MAX_OBSTACLE_INTERVAL = 1.1;
const MAX_FRAME_TIME = 0.05;
const CHASE_RATE = 13;
const INITIAL_OBSTACLE_SPAWN_DELAY = 0.85;

let selectedCat = CATS[0].id;
let keys = { up: false, down: false };
let gameState = null;
let loopId = null;

function setActiveScreen(screenEl) {
  [startScreen, gameScreen, gameOverScreen].forEach(el => el.classList.remove('active'));
  screenEl.classList.add('active');
}

function buildCatSelectors() {
  catOptions.innerHTML = '';
  inGameCat.innerHTML = '';

  CATS.forEach(cat => {
    const catBtn = document.createElement('button');
    catBtn.type = 'button';
    catBtn.className = 'cat-option-btn';
    catBtn.dataset.catId = cat.id;
    catBtn.innerHTML = `<span class="emoji">${cat.emoji}</span>${cat.label}`;
    catBtn.addEventListener('click', () => {
      selectedCat = cat.id;
      syncCatUI();
    });
    catOptions.appendChild(catBtn);

    const option = document.createElement('option');
    option.value = cat.id;
    option.textContent = `${cat.emoji} ${cat.label}`;
    inGameCat.appendChild(option);
  });

  inGameCat.addEventListener('change', event => {
    selectedCat = event.target.value;
    syncCatUI();
  });
}

function syncCatUI() {
  catOptions.querySelectorAll('.cat-option-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.catId === selectedCat);
  });
  inGameCat.value = selectedCat;
  const active = CATS.find(cat => cat.id === selectedCat);
  if (active) playerEl.textContent = active.emoji;
}

function random(min, max) {
  return Math.random() * (max - min) + min;
}

function createCityItem() {
  const item = document.createElement('div');
  item.className = 'city-item';
  item.textContent = CITY_ITEMS[Math.floor(Math.random() * CITY_ITEMS.length)];
  const size = random(20, 36);
  const y = random(
    MIN_CITY_ITEM_Y,
    Math.max(CITY_ITEM_MIN_MAX_Y, catStage.clientHeight - CITY_ITEM_BOTTOM_PADDING)
  );
  item.style.fontSize = `${size}px`;
  item.style.left = `${catStage.clientWidth + random(0, 240)}px`;
  item.style.top = `${y}px`;
  cityLayer.appendChild(item);

  return {
    el: item,
    x: parseFloat(item.style.left),
    y,
    speed: random(70, 140)
  };
}

function createObstacle() {
  const obstacle = document.createElement('div');
  obstacle.className = 'obstacle';
  obstacle.textContent = OBSTACLES[Math.floor(Math.random() * OBSTACLES.length)];
  const y = random(
    MIN_OBSTACLE_Y,
    Math.max(OBSTACLE_MIN_MAX_Y, catStage.clientHeight - OBSTACLE_BOTTOM_PADDING)
  );
  obstacle.style.left = `${catStage.clientWidth + random(0, 80)}px`;
  obstacle.style.top = `${y}px`;
  obstacleLayer.appendChild(obstacle);

  return {
    el: obstacle,
    x: parseFloat(obstacle.style.left),
    y,
    speed: random(220, 330),
    size: 34
  };
}

function updateHpDisplay() {
  const hp = Math.max(0, gameState.hp);
  hpText.textContent = String(Math.round(hp));
  hpBarFill.style.width = `${hp}%`;
  if (hp > 60) hpBarFill.style.backgroundColor = '#43a047';
  else if (hp > 30) hpBarFill.style.backgroundColor = '#f9a825';
  else hpBarFill.style.backgroundColor = '#e53935';
}

function updateChaseDisplay() {
  chaseDisplay.textContent = `${Math.floor(gameState.chase)}m`;
}

function removeEntity(entity, collection) {
  entity.el.remove();
  const index = collection.indexOf(entity);
  if (index >= 0) collection.splice(index, 1);
}

function intersectsPlayer(obstacle) {
  const playerTop = gameState.playerY;
  const playerBottom = gameState.playerY + PLAYER_SIZE;
  const playerLeft = PLAYER_LEFT_OFFSET;
  const playerRight = PLAYER_LEFT_OFFSET + PLAYER_SIZE;

  const obstacleLeft = obstacle.x + COLLISION_PADDING;
  const obstacleRight = obstacle.x + obstacle.size - COLLISION_PADDING;
  const obstacleTop = obstacle.y + COLLISION_PADDING;
  const obstacleBottom = obstacle.y + obstacle.size - COLLISION_PADDING;

  return (
    playerRight > obstacleLeft &&
    playerLeft < obstacleRight &&
    playerBottom > obstacleTop &&
    playerTop < obstacleBottom
  );
}

function updatePlayer(dt) {
  const upPressed = keys.up && !keys.down;
  const downPressed = keys.down && !keys.up;
  if (upPressed) gameState.playerY -= PLAYER_SPEED * dt;
  if (downPressed) gameState.playerY += PLAYER_SPEED * dt;

  const stageHeight = catStage.clientHeight;
  const maxY = Math.max(0, stageHeight - PLAYER_SIZE);
  gameState.playerY = Math.min(maxY, Math.max(0, gameState.playerY));
  playerEl.style.top = `${gameState.playerY}px`;
}

function updateCityItems(dt) {
  if (gameState.cityItems.length < MAX_CITY_ITEMS && Math.random() < dt * CITY_ITEM_SPAWN_RATE) {
    gameState.cityItems.push(createCityItem());
  }

  gameState.cityItems.slice().forEach(item => {
    item.x -= item.speed * dt;
    item.el.style.left = `${item.x}px`;
    if (item.x < -60) removeEntity(item, gameState.cityItems);
  });
}

function updateObstacles(dt) {
  gameState.obstacleSpawnTimer -= dt;
  if (gameState.obstacleSpawnTimer <= 0) {
    gameState.obstacles.push(createObstacle());
    gameState.obstacleSpawnTimer = random(MIN_OBSTACLE_INTERVAL, MAX_OBSTACLE_INTERVAL);
  }

  const now = performance.now();
  gameState.obstacles.slice().forEach(obstacle => {
    obstacle.x -= obstacle.speed * dt;
    obstacle.el.style.left = `${obstacle.x}px`;

    if (obstacle.x < -50) {
      removeEntity(obstacle, gameState.obstacles);
      return;
    }

    if (intersectsPlayer(obstacle) && now - gameState.lastDamageAt > INVULNERABLE_MS) {
      gameState.lastDamageAt = now;
      gameState.hp -= 20;
      playerEl.classList.remove('hit');
      void playerEl.offsetWidth;
      playerEl.classList.add('hit');
      updateHpDisplay();
      if (gameState.hp <= 0) {
        endGame();
      }
    }
  });
}

function gameLoop(now) {
  if (!gameState.running) return;

  const dt = Math.min((now - gameState.lastFrameAt) / 1000, MAX_FRAME_TIME);
  gameState.lastFrameAt = now;
  gameState.chase += dt * CHASE_RATE;

  updatePlayer(dt);
  updateCityItems(dt);
  updateObstacles(dt);
  updateChaseDisplay();

  loopId = requestAnimationFrame(gameLoop);
}

function clearGameEntities() {
  cityLayer.innerHTML = '';
  obstacleLayer.innerHTML = '';
}

function beginGame() {
  clearGameEntities();
  syncCatUI();

  const startY = Math.max(0, catStage.clientHeight / 2 - PLAYER_SIZE / 2);
  playerEl.style.left = `${PLAYER_LEFT_OFFSET}px`;
  playerEl.style.top = `${startY}px`;

  gameState = {
    running: true,
    hp: HP_MAX,
    chase: 0,
    playerY: startY,
    cityItems: [],
    obstacles: [],
    obstacleSpawnTimer: INITIAL_OBSTACLE_SPAWN_DELAY,
    lastDamageAt: -INVULNERABLE_MS,
    lastFrameAt: performance.now()
  };

  updateHpDisplay();
  updateChaseDisplay();
  setActiveScreen(gameScreen);
  loopId = requestAnimationFrame(gameLoop);
}

function endGame() {
  if (!gameState || !gameState.running) return;
  gameState.running = false;
  if (loopId) cancelAnimationFrame(loopId);
  finalChase.textContent = `You chased ${Math.floor(gameState.chase)}m`;
  setActiveScreen(gameOverScreen);
}

function onKey(event, isDown) {
  const key = event.key;
  if (key === 'ArrowUp' || key === 'w' || key === 'W') {
    keys.up = isDown;
    event.preventDefault();
  } else if (key === 'ArrowDown' || key === 's' || key === 'S') {
    keys.down = isDown;
    event.preventDefault();
  }
}

function setupEvents() {
  startBtn.addEventListener('click', beginGame);
  restartBtn.addEventListener('click', beginGame);
  document.addEventListener('keydown', event => onKey(event, true));
  document.addEventListener('keyup', event => onKey(event, false));
  window.addEventListener('blur', () => {
    keys.up = false;
    keys.down = false;
  });
}

buildCatSelectors();
syncCatUI();
setupEvents();
