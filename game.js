/* ======================================
   KITCHEN RUSH — COOKING GAME LOGIC
   Vanilla JavaScript, no frameworks
   ====================================== */

'use strict';

// ============================================================
//  RECIPE & INGREDIENT DATA
// ============================================================

const INGREDIENTS = {
  lettuce:    { emoji: '🥬', name: 'Lettuce'     },
  tomato:     { emoji: '🍅', name: 'Tomato'      },
  cucumber:   { emoji: '🥒', name: 'Cucumber'    },
  egg:        { emoji: '🥚', name: 'Egg'         },
  butter:     { emoji: '🧈', name: 'Butter'      },
  banana:     { emoji: '🍌', name: 'Banana'      },
  strawberry: { emoji: '🍓', name: 'Strawberry'  },
  milk:       { emoji: '🥛', name: 'Milk'        },
  pasta:      { emoji: '🍝', name: 'Pasta'       },
  onion:      { emoji: '🧅', name: 'Onion'       },
  carrot:     { emoji: '🥕', name: 'Carrot'      },
  potato:     { emoji: '🥔', name: 'Potato'      },
  broth:      { emoji: '🫙', name: 'Broth'       },
  flour:      { emoji: '🌾', name: 'Flour'       },
  bun:        { emoji: '🥖', name: 'Bun'         },
  beef:       { emoji: '🥩', name: 'Beef'        },
  broccoli:   { emoji: '🥦', name: 'Broccoli'    },
  pepper:     { emoji: '🫑', name: 'Pepper'      },
  mushroom:   { emoji: '🍄', name: 'Mushroom'    },
  soysauce:   { emoji: '🍶', name: 'Soy Sauce'   },
  rice:       { emoji: '🍚', name: 'Rice'        },
  fish:       { emoji: '🐟', name: 'Fish'        },
  seaweed:    { emoji: '🌿', name: 'Seaweed'     },
  cheese:     { emoji: '🧀', name: 'Cheese'      },
  bread:      { emoji: '🍞', name: 'Bread'       },
};

const STEP_ICONS = {
  chop:  '🔪',
  mix:   '🥣',
  cook:  '🔥',
  blend: '🥤',
  plate: '🍽',
};

/** @type {Recipe[]} */
const RECIPES = [
  {
    id: 'salad',
    name: 'Fresh Salad',
    emoji: '🥗',
    difficulty: 1,
    description: 'A refreshing green salad',
    ingredients: ['lettuce', 'tomato', 'cucumber'],
    steps: ['chop', 'mix', 'plate'],
    stepHints: ['Chop the veggies!', 'Toss everything together!', 'Plate beautifully!'],
    urgencyTime: 25,
    points: 80,
  },
  {
    id: 'scrambledeggs',
    name: 'Scrambled Eggs',
    emoji: '🍳',
    difficulty: 1,
    description: 'Fluffy, buttery eggs',
    ingredients: ['egg', 'butter'],
    steps: ['mix', 'cook', 'plate'],
    stepHints: ['Beat the eggs!', 'Cook on low heat!', 'Plate while hot!'],
    urgencyTime: 22,
    points: 80,
  },
  {
    id: 'smoothie',
    name: 'Fruit Smoothie',
    emoji: '🥤',
    difficulty: 1,
    description: 'Sweet and healthy',
    ingredients: ['banana', 'strawberry', 'milk'],
    steps: ['chop', 'blend', 'plate'],
    stepHints: ['Chop the fruits!', 'Blend until smooth!', 'Pour and serve!'],
    urgencyTime: 22,
    points: 80,
  },
  {
    id: 'toast',
    name: 'Cheese Toast',
    emoji: '🧀',
    difficulty: 1,
    description: 'Crispy cheesy toast',
    ingredients: ['bread', 'cheese'],
    steps: ['cook', 'plate'],
    stepHints: ['Toast until golden!', 'Slice and serve!'],
    urgencyTime: 18,
    points: 70,
  },
  {
    id: 'pasta',
    name: 'Tomato Pasta',
    emoji: '🍝',
    difficulty: 2,
    description: 'Classic Italian pasta',
    ingredients: ['pasta', 'tomato', 'onion'],
    steps: ['chop', 'cook', 'mix', 'plate'],
    stepHints: ['Dice the veggies!', 'Boil the pasta!', 'Mix in the sauce!', 'Plate it up!'],
    urgencyTime: 28,
    points: 120,
  },
  {
    id: 'soup',
    name: 'Veggie Soup',
    emoji: '🍲',
    difficulty: 2,
    description: 'Hearty and warming',
    ingredients: ['carrot', 'potato', 'onion', 'broth'],
    steps: ['chop', 'cook', 'mix', 'plate'],
    stepHints: ['Chop veggies!', 'Heat the broth!', 'Simmer together!', 'Serve in a bowl!'],
    urgencyTime: 28,
    points: 120,
  },
  {
    id: 'pancakes',
    name: 'Fluffy Pancakes',
    emoji: '🥞',
    difficulty: 2,
    description: 'Golden breakfast treat',
    ingredients: ['flour', 'egg', 'milk'],
    steps: ['mix', 'cook', 'plate'],
    stepHints: ['Mix the batter!', 'Cook on griddle!', 'Stack and serve!'],
    urgencyTime: 25,
    points: 110,
  },
  {
    id: 'burger',
    name: 'Classic Burger',
    emoji: '🍔',
    difficulty: 3,
    description: 'Juicy beef burger',
    ingredients: ['bun', 'beef', 'lettuce', 'tomato'],
    steps: ['chop', 'cook', 'mix', 'plate'],
    stepHints: ['Prep toppings!', 'Grill the patty!', 'Assemble!', 'Wrap and serve!'],
    urgencyTime: 30,
    points: 150,
  },
  {
    id: 'stirfry',
    name: 'Veggie Stir-Fry',
    emoji: '🥘',
    difficulty: 3,
    description: 'Colorful wok dish',
    ingredients: ['broccoli', 'pepper', 'mushroom', 'soysauce'],
    steps: ['chop', 'cook', 'mix', 'plate'],
    stepHints: ['Chop veggies!', 'Heat the wok!', 'Stir-fry!', 'Plate and garnish!'],
    urgencyTime: 28,
    points: 150,
  },
  {
    id: 'sushi',
    name: 'Sushi Roll',
    emoji: '🍱',
    difficulty: 3,
    description: 'Fresh homemade sushi',
    ingredients: ['rice', 'fish', 'seaweed', 'cucumber'],
    steps: ['cook', 'chop', 'mix', 'plate'],
    stepHints: ['Cook the rice!', 'Slice the fish!', 'Roll it up!', 'Slice and arrange!'],
    urgencyTime: 30,
    points: 160,
  },
];

// ============================================================
//  GAME CONFIG
// ============================================================

const CFG = {
  gameDuration:    90,  // seconds
  mistakePenalty:  20,  // wrong ingredients
  expirePenalty:   30,  // order expires
  wrongStepPenalty: 5,  // wrong action button
  timeBonusRate:    2,  // pts per second remaining
  distractorCount:  8,  // extra ingredient buttons shown
};

// ============================================================
//  STATE
// ============================================================

/** Central game state — mutated in place, never reassigned */
let S = {};

function resetState() {
  // Clear any running timers before resetting
  clearInterval(S.gameTimerId);
  clearInterval(S.orderTimerId);
  clearTimeout(S.feedbackTimerId);

  S = {
    running:       false,
    score:         0,
    dishesServed:  0,
    mistakes:      0,
    timeLeft:      CFG.gameDuration,
    gameTimerId:   null,
    orderTimerId:  null,
    feedbackTimerId: null,
    recipe:        null,  // current Recipe object
    orderTimeLeft: 0,
    // 'ingredients' | 'prep' | 'done'
    phase:         'ingredients',
    selected:      [],    // array of ingredient IDs
    stepIndex:     0,
  };
}

// ============================================================
//  HELPERS
// ============================================================

/** @param {string} id @returns {HTMLElement} */
const $ = id => document.getElementById(id);

/** Fisher-Yates shuffle (returns new array) */
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Pick next recipe, weighted by current score, no immediate repeat */
function pickRecipe() {
  let pool;
  if (S.score < 200)      pool = RECIPES.filter(r => r.difficulty === 1);
  else if (S.score < 500) pool = RECIPES.filter(r => r.difficulty <= 2);
  else                     pool = [...RECIPES];

  if (pool.length === 0) pool = [...RECIPES]; // safety fallback

  if (S.recipe && pool.length > 1) {
    const filtered = pool.filter(r => r.id !== S.recipe.id);
    if (filtered.length > 0) pool = filtered;
  }

  return pool[Math.floor(Math.random() * pool.length)];
}

// ============================================================
//  SCREEN MANAGEMENT
// ============================================================

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  $(id).classList.add('active');
}

// ============================================================
//  INGREDIENT GRID
// ============================================================

/** Rebuild the ingredient grid for the current order */
function buildIngredientGrid() {
  const grid = $('ingredient-grid');
  grid.innerHTML = '';

  const currentIds = S.recipe ? S.recipe.ingredients : [];
  const allIds     = Object.keys(INGREDIENTS);
  const others     = shuffle(allIds.filter(id => !currentIds.includes(id)));
  const displayIds = shuffle([...currentIds, ...others.slice(0, CFG.distractorCount)]);

  displayIds.forEach(id => {
    const ing = INGREDIENTS[id];
    const btn = document.createElement('button');
    btn.className = 'ingredient-btn';
    btn.dataset.id = id;
    btn.setAttribute('aria-pressed', 'false');
    btn.setAttribute('aria-label', ing.name);
    btn.innerHTML =
      `<span class="ie" aria-hidden="true">${ing.emoji}</span>` +
      `<span class="in">${ing.name}</span>`;
    btn.addEventListener('click', () => onIngredientClick(id));
    grid.appendChild(btn);
  });
}

/** Sync .selected CSS class on all ingredient buttons */
function syncIngredientGrid() {
  document.querySelectorAll('.ingredient-btn').forEach(btn => {
    const sel = S.selected.includes(btn.dataset.id);
    btn.classList.toggle('selected', sel);
    btn.setAttribute('aria-pressed', sel ? 'true' : 'false');
  });
}

// ============================================================
//  ORDER RENDERING
// ============================================================

function renderOrder() {
  const r = S.recipe;
  $('order-emoji').textContent = r.emoji;
  $('order-name').textContent  = r.name;
  $('order-desc').textContent  = r.description;

  $('order-needs').innerHTML =
    `<span class="need-label">Needs:</span>` +
    r.ingredients.map(id => {
      const ing = INGREDIENTS[id];
      return `<span class="need-chip">${ing.emoji} ${ing.name}</span>`;
    }).join('');

  $('order-recipe-steps').innerHTML =
    `<span class="step-label">Steps:</span>` +
    r.steps.map(step =>
      `<span class="step-chip">${STEP_ICONS[step] || ''} ${step}</span>`
    ).join(' ');

  updateUrgencyBar();
}

function updateUrgencyBar() {
  if (!S.recipe) return;
  const pct = Math.max(0, (S.orderTimeLeft / S.recipe.urgencyTime) * 100);
  const bar = $('urgency-bar');
  bar.style.width = pct + '%';
  bar.style.backgroundColor =
    pct > 50 ? 'var(--success)' :
    pct > 25 ? 'var(--warning)' :
               'var(--error)';
}

// ============================================================
//  PREP STATION RENDERING
// ============================================================

function renderPrepBowl() {
  const bowl = $('prep-bowl');
  if (S.selected.length === 0) {
    bowl.innerHTML = '<span class="prep-empty-hint">← Select ingredients first</span>';
    return;
  }
  bowl.innerHTML = S.selected.map(id => {
    const ing = INGREDIENTS[id];
    return (
      `<div class="prep-item" data-id="${id}" role="button" ` +
      `tabindex="0" title="Click to remove ${ing.name}">` +
      `<span class="pie">${ing.emoji}</span>${ing.name}</div>`
    );
  }).join('');

  // Allow removing items from the bowl while in ingredients phase
  bowl.querySelectorAll('.prep-item').forEach(item => {
    const remove = () => {
      if (S.phase !== 'ingredients') return;
      S.selected = S.selected.filter(id => id !== item.dataset.id);
      renderPrepBowl();
      syncIngredientGrid();
    };
    item.addEventListener('click',  remove);
    item.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') remove(); });
  });
}

function renderStepTrack() {
  const track = $('step-track');
  if (!S.recipe) { track.innerHTML = ''; return; }

  track.innerHTML = S.recipe.steps.map((step, i) => {
    let cls = 'step-bubble';
    if (S.phase === 'prep' || S.phase === 'done') {
      if (i < S.stepIndex)                               cls += ' done';
      else if (i === S.stepIndex && S.phase === 'prep')  cls += ' active';
    }
    const sep = i < S.recipe.steps.length - 1
      ? '<span class="step-sep" aria-hidden="true">›</span>'
      : '';
    return (
      `<div class="${cls}" aria-label="${step}">` +
      `<span class="sicon" aria-hidden="true">${STEP_ICONS[step] || ''}</span>` +
      `<span>${step}</span></div>${sep}`
    );
  }).join('');
}

function syncActionButtons() {
  document.querySelectorAll('.action-btn').forEach(btn => {
    const action = btn.dataset.action;
    const isPrep  = S.phase === 'prep';
    btn.disabled  = !isPrep;
    btn.classList.toggle(
      'active-step',
      isPrep && S.recipe && action === S.recipe.steps[S.stepIndex]
    );
  });
}

function syncPrepButtons() {
  $('prepare-btn').classList.toggle('hidden', S.phase !== 'ingredients');
  $('serve-btn')  .classList.toggle('hidden', S.phase !== 'done');
  $('clear-btn')  .disabled = (S.phase === 'done');
}

// ============================================================
//  FEEDBACK
// ============================================================

function showFeedback(msg, type) {
  const el = $('feedback-area');
  el.textContent = msg;
  el.className   = 'feedback-area' + (type ? ' ' + type : '');

  clearTimeout(S.feedbackTimerId);
  if (msg) {
    S.feedbackTimerId = setTimeout(() => {
      el.textContent = '';
      el.className   = 'feedback-area';
    }, 3000);
  }
}

function addShake(el) {
  if (!el) return;
  el.classList.remove('shake');
  void el.offsetWidth; // reflow to restart animation
  el.classList.add('shake');
  setTimeout(() => el.classList.remove('shake'), 450);
}

function addCelebrate(el) {
  if (!el) return;
  el.classList.remove('celebrate');
  void el.offsetWidth;
  el.classList.add('celebrate');

  // Confetti stars
  el.style.position = 'relative';
  const emojis = ['⭐', '🌟', '✨', '🎉'];
  for (let i = 0; i < 6; i++) {
    const star = document.createElement('span');
    star.className   = 'confetti-star';
    star.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    star.style.left  = (15 + Math.random() * 70) + '%';
    star.style.top   = '30%';
    star.style.animationDelay = (Math.random() * 0.25) + 's';
    el.appendChild(star);
    setTimeout(() => star.remove(), 1000);
  }

  setTimeout(() => el.classList.remove('celebrate'), 700);
}

// ============================================================
//  HUD
// ============================================================

function updateHUD() {
  $('score-display') .textContent = S.score;
  $('dishes-display').textContent = S.dishesServed;

  const el = $('timer-display');
  el.textContent = S.timeLeft;
  el.classList.toggle('urgent', S.timeLeft <= 10);
}

// ============================================================
//  GAME FLOW
// ============================================================

function startGame() {
  resetState();
  S.running = true;
  showScreen('game-screen');
  updateHUD();
  loadNewOrder();

  S.gameTimerId = setInterval(() => {
    if (!S.running) return;
    S.timeLeft--;
    updateHUD();
    if (S.timeLeft <= 0) endGame();
  }, 1000);
}

function loadNewOrder() {
  clearInterval(S.orderTimerId);

  S.recipe       = pickRecipe();
  S.phase        = 'ingredients';
  S.selected     = [];
  S.stepIndex    = 0;
  S.orderTimeLeft = S.recipe.urgencyTime;

  renderOrder();
  buildIngredientGrid();
  renderPrepBowl();
  renderStepTrack();
  syncActionButtons();
  syncPrepButtons();
  showFeedback('', '');

  S.orderTimerId = setInterval(() => {
    if (!S.running) return;
    S.orderTimeLeft--;
    updateUrgencyBar();
    if (S.orderTimeLeft <= 0) onOrderExpired();
  }, 1000);
}

function onOrderExpired() {
  clearInterval(S.orderTimerId);
  S.score = Math.max(0, S.score - CFG.expirePenalty);
  S.mistakes++;
  updateHUD();
  showFeedback(`⏰ Order expired! −${CFG.expirePenalty} pts`, 'error');
  addShake($('order-card'));
  setTimeout(loadNewOrder, 1600);
}

function endGame() {
  S.running = false;
  clearInterval(S.gameTimerId);
  clearInterval(S.orderTimerId);

  $('go-score')   .textContent = S.score;
  $('go-dishes')  .textContent = S.dishesServed;
  $('go-mistakes').textContent = S.mistakes;
  $('go-grade')   .textContent = computeGrade();

  showScreen('gameover-screen');
}

function computeGrade() {
  const { score, dishesServed } = S;
  if (dishesServed === 0)  return '😅 Keep Practicing — you can do it!';
  if (score >= 800)        return '⭐⭐⭐ Master Chef! Incredible!';
  if (score >= 500)        return '⭐⭐ Great Cook! Almost perfect!';
  if (score >= 200)        return '⭐ Nice Work! Keep it up!';
  return '👍 Good Try! Practice makes perfect!';
}

// ============================================================
//  EVENT HANDLERS
// ============================================================

function onIngredientClick(id) {
  if (S.phase !== 'ingredients') return;
  const idx = S.selected.indexOf(id);
  if (idx === -1) S.selected.push(id);
  else            S.selected.splice(idx, 1);
  renderPrepBowl();
  syncIngredientGrid();
}

function onPrepare() {
  const r        = S.recipe;
  const required = [...r.ingredients].sort();
  const selected = [...S.selected].sort();

  if (required.join(',') !== selected.join(',')) {
    const missing = required.filter(id => !S.selected.includes(id));
    const extra   = S.selected.filter(id => !required.includes(id));
    let msg = '❌ Wrong ingredients!';
    if (missing.length) msg += ` Need: ${missing.map(id => INGREDIENTS[id].name).join(', ')}.`;
    if (extra.length)   msg += ` Remove: ${extra.map(id => INGREDIENTS[id].name).join(', ')}.`;
    showFeedback(msg, 'error');
    S.score = Math.max(0, S.score - CFG.mistakePenalty);
    S.mistakes++;
    updateHUD();
    addShake($('prep-bowl'));
    return;
  }

  // ✅ Correct — advance to prep phase
  S.phase     = 'prep';
  S.stepIndex = 0;
  renderStepTrack();
  syncActionButtons();
  syncPrepButtons();
  showFeedback(
    `✅ Ingredients correct! Now: ${STEP_ICONS[r.steps[0]]} ${r.steps[0]}`,
    'success'
  );
}

function onActionClick(action) {
  if (S.phase !== 'prep') return;
  const r      = S.recipe;
  const needed = r.steps[S.stepIndex];

  if (action === needed) {
    const hint = r.stepHints[S.stepIndex];
    S.stepIndex++;

    if (S.stepIndex >= r.steps.length) {
      // All steps done!
      S.phase = 'done';
      renderStepTrack();
      syncActionButtons();
      syncPrepButtons();
      showFeedback('🎉 Dish ready! Hit Serve!', 'success');
      return;
    }

    renderStepTrack();
    syncActionButtons();
    showFeedback(`✅ ${hint}`, 'success');
    const next = r.steps[S.stepIndex];
    setTimeout(
      () => showFeedback(`Next step: ${STEP_ICONS[next] || ''} ${next}`, 'success'),
      550
    );
  } else {
    showFeedback(`❌ Wrong! Need to "${needed}" right now.`, 'error');
    S.score = Math.max(0, S.score - CFG.wrongStepPenalty);
    S.mistakes++;
    updateHUD();
    addShake(document.querySelector('.action-row'));
  }
}

function onServe() {
  if (S.phase !== 'done') return;
  clearInterval(S.orderTimerId);

  const r         = S.recipe;
  const timeBonus = Math.floor(S.orderTimeLeft * CFG.timeBonusRate);
  const earned    = r.points + timeBonus;

  S.score += earned;
  S.dishesServed++;
  updateHUD();

  showFeedback(`🎉 Served! +${earned} pts  (${r.points} + ${timeBonus} time bonus)`, 'success');
  addCelebrate($('order-card'));

  setTimeout(loadNewOrder, 1900);
}

function onClear() {
  if (S.phase === 'done') return;
  S.selected  = [];
  S.phase     = 'ingredients';
  S.stepIndex = 0;
  renderPrepBowl();
  renderStepTrack();
  syncIngredientGrid();
  syncActionButtons();
  syncPrepButtons();
  showFeedback('', '');
}

// ============================================================
//  KEYBOARD SHORTCUTS
// ============================================================

function handleKeydown(e) {
  if (!S.running) return;
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

  switch (e.key.toLowerCase()) {
    case 'c':      onActionClick('chop');  break;
    case 'm':      onActionClick('mix');   break;
    case 'k':      onActionClick('cook');  break;
    case 'b':      onActionClick('blend'); break;
    case 'p':      onActionClick('plate'); break;
    case 'enter':  onServe();              break;
    case ' ':
      e.preventDefault();
      if (S.phase === 'ingredients') onPrepare();
      break;
    case 'escape': onClear(); break;
  }
}

// ============================================================
//  BOOT
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  resetState();

  $('start-btn')  .addEventListener('click', startGame);
  $('restart-btn').addEventListener('click', startGame);
  $('prepare-btn').addEventListener('click', onPrepare);
  $('serve-btn')  .addEventListener('click', onServe);
  $('clear-btn')  .addEventListener('click', onClear);

  document.querySelectorAll('.action-btn').forEach(btn => {
    btn.addEventListener('click', () => onActionClick(btn.dataset.action));
  });

  document.addEventListener('keydown', handleKeydown);
});
