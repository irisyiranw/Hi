const CHARACTERS = [
  { id: 'swimmer', emoji: '🏊', label: 'Swimmer' },
  { id: 'dolphin', emoji: '🐬', label: 'Dolphin' },
  { id: 'shark', emoji: '🦈', label: 'Shark' },
  { id: 'turtle', emoji: '🐢', label: 'Turtle' }
];

const SEA_ANIMAL_EMOJIS = ['🐠', '🐟', '🐙', '🦑', '🪸', '🐡'];
const OBSTACLES = ['🪨', '🪵', '🪼'];

const startScreen = document.getElementById('swim-start-screen');
const gameScreen = document.getElementById('swim-game-screen');
const gameOverScreen = document.getElementById('swim-gameover-screen');
const characterOptions = document.getElementById('character-options');
const inGameCharacter = document.getElementById('ingame-character');
const startBtn = document.getElementById('start-swim-btn');
const restartBtn = document.getElementById('restart-swim-btn');
const swimStage = document.getElementById('swim-stage');
const seaLayer = document.getElementById('sea-layer');
const obstacleLayer = document.getElementById('obstacle-layer');
const playerEl = document.getElementById('player');
const hpBarFill = document.getElementById('hp-bar-fill');
const hpText = document.getElementById('hp-text');
const distanceDisplay = document.getElementById('distance-display');
const finalDistance = document.getElementById('final-distance');

const PLAYER_LEFT_OFFSET = 84;
const PLAYER_SIZE = 40;
const HP_MAX = 100;
const PLAYER_SPEED = 320;
const INVULNERABLE_MS = 650;
const MIN_SEA_ANIMAL_Y = 18;
const SEA_ANIMAL_FALLBACK_MAX_Y = 22;
const SEA_ANIMAL_BOTTOM_PADDING = 40;
const MIN_OBSTACLE_Y = 22;
const OBSTACLE_FALLBACK_MAX_Y = 30;
const OBSTACLE_BOTTOM_PADDING = 46;
const COLLISION_PADDING = 6; // Reduces false-positive edge collisions for emoji-sized sprites.
const MAX_SEA_ANIMALS = 7;
const SEA_ANIMAL_SPAWN_RATE = 2.4;
const MIN_OBSTACLE_INTERVAL = 0.62;
const MAX_OBSTACLE_INTERVAL = 1.1;
const MAX_FRAME_TIME = 0.05;
const DISTANCE_RATE = 13;
const INITIAL_OBSTACLE_SPAWN_DELAY = 0.85;

let selectedCharacter = CHARACTERS[0].id;
let keys = { up: false, down: false };
let gameState = null;
let loopId = null;

function setActiveScreen(screenEl) {
  [startScreen, gameScreen, gameOverScreen].forEach(el => el.classList.remove('active'));
  screenEl.classList.add('active');
}

function buildCharacterSelectors() {
  characterOptions.innerHTML = '';
  inGameCharacter.innerHTML = '';

  CHARACTERS.forEach(character => {
    const charBtn = document.createElement('button');
    charBtn.type = 'button';
    charBtn.className = 'char-btn';
    charBtn.dataset.characterId = character.id;
    charBtn.innerHTML = `<span class="emoji">${character.emoji}</span>${character.label}`;
    charBtn.addEventListener('click', () => {
      selectedCharacter = character.id;
      syncCharacterUI();
    });
    characterOptions.appendChild(charBtn);

    const option = document.createElement('option');
    option.value = character.id;
    option.textContent = `${character.emoji} ${character.label}`;
    inGameCharacter.appendChild(option);
  });

  inGameCharacter.addEventListener('change', event => {
    selectedCharacter = event.target.value;
    syncCharacterUI();
  });
}

function syncCharacterUI() {
  characterOptions.querySelectorAll('.char-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.characterId === selectedCharacter);
  });
  inGameCharacter.value = selectedCharacter;
  const active = CHARACTERS.find(char => char.id === selectedCharacter);
  if (active) playerEl.textContent = active.emoji;
}

function random(min, max) {
  return Math.random() * (max - min) + min;
}

function createSeaAnimal() {
  const animal = document.createElement('div');
  animal.className = 'sea-animal';
  animal.textContent = SEA_ANIMAL_EMOJIS[Math.floor(Math.random() * SEA_ANIMAL_EMOJIS.length)];
  const size = random(20, 36);
  const y = random(
    MIN_SEA_ANIMAL_Y,
    Math.max(SEA_ANIMAL_FALLBACK_MAX_Y, swimStage.clientHeight - SEA_ANIMAL_BOTTOM_PADDING)
  );
  animal.style.fontSize = `${size}px`;
  animal.style.left = `${swimStage.clientWidth + random(0, 240)}px`;
  animal.style.top = `${y}px`;
  seaLayer.appendChild(animal);

  return {
    el: animal,
    x: parseFloat(animal.style.left),
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
    Math.max(OBSTACLE_FALLBACK_MAX_Y, swimStage.clientHeight - OBSTACLE_BOTTOM_PADDING)
  );
  obstacle.style.left = `${swimStage.clientWidth + random(0, 80)}px`;
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

function updateDistanceDisplay() {
  distanceDisplay.textContent = `${Math.floor(gameState.distance)}m`;
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

  const stageHeight = swimStage.clientHeight;
  const maxY = Math.max(0, stageHeight - PLAYER_SIZE);
  gameState.playerY = Math.min(maxY, Math.max(0, gameState.playerY));
  playerEl.style.top = `${gameState.playerY}px`;
}

function updateSeaAnimals(dt) {
  if (gameState.seaAnimals.length < MAX_SEA_ANIMALS && Math.random() < dt * SEA_ANIMAL_SPAWN_RATE) {
    gameState.seaAnimals.push(createSeaAnimal());
  }

  gameState.seaAnimals.slice().forEach(animal => {
    animal.x -= animal.speed * dt;
    animal.el.style.left = `${animal.x}px`;
    if (animal.x < -60) removeEntity(animal, gameState.seaAnimals);
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
      void playerEl.offsetWidth; // Force reflow so the hit animation restarts each time.
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
  gameState.distance += dt * DISTANCE_RATE;

  updatePlayer(dt);
  updateSeaAnimals(dt);
  updateObstacles(dt);
  updateDistanceDisplay();

  loopId = requestAnimationFrame(gameLoop);
}

function clearGameEntities() {
  seaLayer.innerHTML = '';
  obstacleLayer.innerHTML = '';
}

function beginGame() {
  clearGameEntities();
  syncCharacterUI();

  const startY = Math.max(0, swimStage.clientHeight / 2 - PLAYER_SIZE / 2);
  playerEl.style.left = `${PLAYER_LEFT_OFFSET}px`;
  playerEl.style.top = `${startY}px`;

  gameState = {
    running: true,
    hp: HP_MAX,
    distance: 0,
    playerY: startY,
    seaAnimals: [],
    obstacles: [],
    obstacleSpawnTimer: INITIAL_OBSTACLE_SPAWN_DELAY,
    lastDamageAt: -INVULNERABLE_MS,
    lastFrameAt: performance.now()
  };

  updateHpDisplay();
  updateDistanceDisplay();
  setActiveScreen(gameScreen);
  loopId = requestAnimationFrame(gameLoop);
}

function endGame() {
  if (!gameState || !gameState.running) return;
  gameState.running = false;
  if (loopId) cancelAnimationFrame(loopId);
  finalDistance.textContent = `You swam ${Math.floor(gameState.distance)}m`;
  setActiveScreen(gameOverScreen);
}

function onKey(event, isDown) {
  const key = event.key.toLowerCase();
  if (key === 'arrowup' || key === 'w') {
    keys.up = isDown;
    event.preventDefault();
  } else if (key === 'arrowdown' || key === 's') {
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

buildCharacterSelectors();
syncCharacterUI();
setupEvents();
