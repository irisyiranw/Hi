/* ======================================
   CRAFT STUDIO — CRAFTING GAME LOGIC
   Vanilla JavaScript, no frameworks
   ====================================== */

'use strict';

// ============================================================
//  SUPPLY & PROJECT DATA
// ============================================================

const SUPPLIES = {
  pencil:      { emoji: '✏️',  name: 'Pencil'       },
  paintbrush:  { emoji: '🖌️', name: 'Paintbrush'   },
  scissors:    { emoji: '✂️',  name: 'Scissors'     },
  glue:        { emoji: '🧴',  name: 'Glue'         },
  paper:       { emoji: '📄',  name: 'Paper'        },
  crayons:     { emoji: '🖍️', name: 'Crayons'      },
  stickers:    { emoji: '⭐',  name: 'Stickers'     },
  glitter:     { emoji: '🌟',  name: 'Glitter'      },
  ribbon:      { emoji: '🎀',  name: 'Ribbon'       },
  yarn:        { emoji: '🧶',  name: 'Yarn'         },
  sequins:     { emoji: '💜',  name: 'Sequins'      },
  tissue:      { emoji: '🌸',  name: 'Tissue Paper' },
  watercolors: { emoji: '🎨',  name: 'Watercolors'  },
  clay:        { emoji: '🫙',  name: 'Clay'         },
  beads:       { emoji: '📿',  name: 'Beads'        },
  foam:        { emoji: '🟣',  name: 'Foam Sheet'   },
  tape:        { emoji: '🩹',  name: 'Tape'         },
  cardboard:   { emoji: '📦',  name: 'Cardboard'    },
  feathers:    { emoji: '🪶',  name: 'Feathers'     },
  markers:     { emoji: '🖊️', name: 'Markers'      },
};

const STEP_ICONS = {
  sketch:   '✏️',
  color:    '🖌️',
  cut:      '✂️',
  fold:     '📐',
  glue:     '🧴',
  decorate: '✨',
};

/** @type {Project[]} */
const PROJECTS = [
  {
    id: 'rainbow',
    name: 'Rainbow Painting',
    emoji: '🌈',
    difficulty: 1,
    description: 'Paint a colorful rainbow!',
    supplies: ['paintbrush', 'watercolors', 'paper'],
    steps: ['sketch', 'color', 'decorate'],
    stepHints: ['Sketch the arc!', 'Fill in all the colors!', 'Add sparkly clouds!'],
    urgencyTime: 25,
    points: 80,
  },
  {
    id: 'greetingcard',
    name: 'Greeting Card',
    emoji: '💌',
    difficulty: 1,
    description: 'Make a cute card for someone!',
    supplies: ['paper', 'crayons', 'stickers'],
    steps: ['fold', 'color', 'decorate'],
    stepHints: ['Fold the paper in half!', 'Draw your design!', 'Add stickers!'],
    urgencyTime: 22,
    points: 80,
  },
  {
    id: 'paperflower',
    name: 'Paper Flower',
    emoji: '🌸',
    difficulty: 1,
    description: 'Craft a beautiful flower!',
    supplies: ['tissue', 'scissors', 'glue'],
    steps: ['cut', 'fold', 'glue'],
    stepHints: ['Cut petal shapes!', 'Fold into petals!', 'Glue together!'],
    urgencyTime: 22,
    points: 80,
  },
  {
    id: 'starmobile',
    name: 'Star Mobile',
    emoji: '⭐',
    difficulty: 1,
    description: 'A twinkling star hanging!',
    supplies: ['paper', 'scissors', 'glitter'],
    steps: ['cut', 'glue', 'decorate'],
    stepHints: ['Cut out star shapes!', 'Glue the string!', 'Sprinkle with glitter!'],
    urgencyTime: 22,
    points: 75,
  },
  {
    id: 'butterfly',
    name: 'Butterfly Picture',
    emoji: '🦋',
    difficulty: 2,
    description: 'A beautiful butterfly artwork!',
    supplies: ['paper', 'crayons', 'scissors', 'glue'],
    steps: ['sketch', 'color', 'cut', 'decorate'],
    stepHints: ['Sketch the wings!', 'Color with bright colors!', 'Cut along the outline!', 'Add glitter details!'],
    urgencyTime: 28,
    points: 120,
  },
  {
    id: 'origami',
    name: 'Origami Boat',
    emoji: '⛵',
    difficulty: 2,
    description: 'Fold a paper boat!',
    supplies: ['paper', 'pencil'],
    steps: ['sketch', 'fold', 'decorate'],
    stepHints: ['Mark the fold lines!', 'Fold step by step!', 'Add a flag design!'],
    urgencyTime: 25,
    points: 110,
  },
  {
    id: 'bracelet',
    name: 'Friendship Bracelet',
    emoji: '📿',
    difficulty: 2,
    description: 'Make a bracelet for a friend!',
    supplies: ['beads', 'yarn', 'scissors'],
    steps: ['cut', 'fold', 'decorate'],
    stepHints: ['Cut the yarn to length!', 'Thread the beads!', 'Tie the ends with a bow!'],
    urgencyTime: 28,
    points: 115,
  },
  {
    id: 'mosaicframe',
    name: 'Mosaic Frame',
    emoji: '🖼️',
    difficulty: 3,
    description: 'A sparkling mosaic picture frame!',
    supplies: ['cardboard', 'sequins', 'glue', 'crayons'],
    steps: ['sketch', 'color', 'cut', 'glue', 'decorate'],
    stepHints: ['Draw the frame shape!', 'Paint the base!', 'Cut into frame!', 'Glue on sequins!', 'Add finishing sparkles!'],
    urgencyTime: 32,
    points: 160,
  },
  {
    id: 'dreamcatcher',
    name: 'Dream Catcher',
    emoji: '🌙',
    difficulty: 3,
    description: 'Catch sweet dreams!',
    supplies: ['yarn', 'feathers', 'ribbon', 'scissors', 'beads'],
    steps: ['cut', 'fold', 'glue', 'decorate'],
    stepHints: ['Cut yarn to length!', 'Weave the web!', 'Glue the frame!', 'Hang feathers and beads!'],
    urgencyTime: 30,
    points: 155,
  },
  {
    id: 'sparklecrown',
    name: 'Sparkle Crown',
    emoji: '👑',
    difficulty: 3,
    description: 'Wear your creativity!',
    supplies: ['cardboard', 'scissors', 'glitter', 'stickers', 'tape'],
    steps: ['sketch', 'cut', 'glue', 'decorate'],
    stepHints: ['Sketch the crown points!', 'Cut out the crown!', 'Glue the ends together!', 'Decorate with stickers and glitter!'],
    urgencyTime: 30,
    points: 160,
  },
];

// ============================================================
//  GAME CONFIG
// ============================================================

const CFG = {
  gameDuration:     90,  // seconds
  mistakePenalty:   20,  // wrong supplies
  expirePenalty:    30,  // project expires
  wrongStepPenalty:  5,  // wrong action button
  timeBonusRate:     2,  // pts per second remaining
  distractorCount:   8,  // extra supply buttons shown
};

// ============================================================
//  STATE
// ============================================================

/** Central game state — mutated in place, never reassigned */
let S = {
  running: false,
  gameTimerId:    null,
  orderTimerId:   null,
  feedbackTimerId: null,
};

function resetState() {
  // Clear any running timers from the previous game session
  if (S.running) {
    clearInterval(S.gameTimerId);
    clearInterval(S.orderTimerId);
    clearTimeout(S.feedbackTimerId);
  }

  S = {
    running:       false,
    score:         0,
    craftsFinished: 0,
    mistakes:      0,
    timeLeft:      CFG.gameDuration,
    gameTimerId:   null,
    orderTimerId:  null,
    feedbackTimerId: null,
    project:       null,  // current Project object
    orderTimeLeft: 0,
    // 'supplies' | 'craft' | 'done'
    phase:         'supplies',
    selected:      [],    // array of supply IDs
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

/** Pick next project, weighted by current score, no immediate repeat */
function pickProject() {
  let pool;
  if (S.score < 200)      pool = PROJECTS.filter(p => p.difficulty === 1);
  else if (S.score < 500) pool = PROJECTS.filter(p => p.difficulty <= 2);
  else                     pool = [...PROJECTS];

  if (pool.length === 0) pool = [...PROJECTS]; // safety fallback

  if (S.project && pool.length > 1) {
    const filtered = pool.filter(p => p.id !== S.project.id);
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
//  SUPPLY GRID
// ============================================================

/** Rebuild the supply grid for the current project */
function buildSupplyGrid() {
  const grid = $('ingredient-grid');
  grid.innerHTML = '';

  const currentIds = S.project ? S.project.supplies : [];
  const allIds     = Object.keys(SUPPLIES);
  const others     = shuffle(allIds.filter(id => !currentIds.includes(id)));
  const displayIds = shuffle([...currentIds, ...others.slice(0, CFG.distractorCount)]);

  displayIds.forEach(id => {
    const sup = SUPPLIES[id];
    const btn = document.createElement('button');
    btn.className = 'ingredient-btn';
    btn.dataset.id = id;
    btn.setAttribute('aria-pressed', 'false');
    btn.setAttribute('aria-label', sup.name);
    btn.innerHTML =
      `<span class="ie" aria-hidden="true">${sup.emoji}</span>` +
      `<span class="in">${sup.name}</span>`;
    btn.addEventListener('click', () => onSupplyClick(id));
    grid.appendChild(btn);
  });
}

/** Sync .selected CSS class on all supply buttons */
function syncSupplyGrid() {
  document.querySelectorAll('.ingredient-btn').forEach(btn => {
    const sel = S.selected.includes(btn.dataset.id);
    btn.classList.toggle('selected', sel);
    btn.setAttribute('aria-pressed', sel ? 'true' : 'false');
  });
}

// ============================================================
//  PROJECT RENDERING
// ============================================================

function renderProject() {
  const p = S.project;
  $('order-emoji').textContent = p.emoji;
  $('order-name').textContent  = p.name;
  $('order-desc').textContent  = p.description;

  $('order-needs').innerHTML =
    `<span class="need-label">Needs:</span>` +
    p.supplies.map(id => {
      const sup = SUPPLIES[id];
      return `<span class="need-chip">${sup.emoji} ${sup.name}</span>`;
    }).join('');

  $('order-recipe-steps').innerHTML =
    `<span class="step-label">Steps:</span>` +
    p.steps.map(step =>
      `<span class="step-chip">${STEP_ICONS[step] || ''} ${step}</span>`
    ).join(' ');

  updateUrgencyBar();
}

function updateUrgencyBar() {
  if (!S.project) return;
  const pct = Math.max(0, (S.orderTimeLeft / S.project.urgencyTime) * 100);
  const bar = $('urgency-bar');
  bar.style.width = pct + '%';
  bar.style.backgroundColor =
    pct > 50 ? 'var(--success)' :
    pct > 25 ? 'var(--warning)' :
               'var(--error)';
}

// ============================================================
//  CRAFT STATION RENDERING
// ============================================================

function renderSupplyTray() {
  const bowl = $('prep-bowl');
  if (S.selected.length === 0) {
    bowl.innerHTML = '<span class="prep-empty-hint">← Select supplies first</span>';
    return;
  }
  bowl.innerHTML = S.selected.map(id => {
    const sup = SUPPLIES[id];
    return (
      `<div class="prep-item" data-id="${id}" role="button" ` +
      `tabindex="0" title="Click to remove ${sup.name}">` +
      `<span class="pie">${sup.emoji}</span>${sup.name}</div>`
    );
  }).join('');

  // Allow removing items from the tray while in supplies phase
  bowl.querySelectorAll('.prep-item').forEach(item => {
    const remove = () => {
      if (S.phase !== 'supplies') return;
      S.selected = S.selected.filter(id => id !== item.dataset.id);
      renderSupplyTray();
      syncSupplyGrid();
    };
    item.addEventListener('click',  remove);
    item.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') remove(); });
  });
}

function renderStepTrack() {
  const track = $('step-track');
  if (!S.project) { track.innerHTML = ''; return; }

  track.innerHTML = S.project.steps.map((step, i) => {
    let cls = 'step-bubble';
    if (S.phase === 'craft' || S.phase === 'done') {
      if (i < S.stepIndex)                              cls += ' done';
      else if (i === S.stepIndex && S.phase === 'craft') cls += ' active';
    }
    const sep = i < S.project.steps.length - 1
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
    const action  = btn.dataset.action;
    const isCraft = S.phase === 'craft';
    btn.disabled  = !isCraft;
    btn.classList.toggle(
      'active-step',
      isCraft && S.project && action === S.project.steps[S.stepIndex]
    );
  });
}

function syncPrepButtons() {
  $('prepare-btn').classList.toggle('hidden', S.phase !== 'supplies');
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
  void el.offsetWidth;
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
  const emojis = ['⭐', '🌟', '✨', '🎀', '🌈'];
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
  $('crafts-display').textContent = S.craftsFinished;

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
  loadNewProject();

  S.gameTimerId = setInterval(() => {
    if (!S.running) return;
    S.timeLeft--;
    updateHUD();
    if (S.timeLeft <= 0) endGame();
  }, 1000);
}

function loadNewProject() {
  clearInterval(S.orderTimerId);

  S.project      = pickProject();
  S.phase        = 'supplies';
  S.selected     = [];
  S.stepIndex    = 0;
  S.orderTimeLeft = S.project.urgencyTime;

  renderProject();
  buildSupplyGrid();
  renderSupplyTray();
  renderStepTrack();
  syncActionButtons();
  syncPrepButtons();
  showFeedback('', '');

  S.orderTimerId = setInterval(() => {
    if (!S.running) return;
    S.orderTimeLeft--;
    updateUrgencyBar();
    if (S.orderTimeLeft <= 0) onProjectExpired();
  }, 1000);
}

function onProjectExpired() {
  clearInterval(S.orderTimerId);
  S.score = Math.max(0, S.score - CFG.expirePenalty);
  S.mistakes++;
  updateHUD();
  showFeedback(`⏰ Project expired! −${CFG.expirePenalty} pts`, 'error');
  addShake($('order-card'));
  setTimeout(loadNewProject, 1600);
}

function endGame() {
  S.running = false;
  clearInterval(S.gameTimerId);
  clearInterval(S.orderTimerId);

  $('go-score')   .textContent = S.score;
  $('go-crafts')  .textContent = S.craftsFinished;
  $('go-mistakes').textContent = S.mistakes;
  $('go-grade')   .textContent = computeGrade();

  showScreen('gameover-screen');
}

function computeGrade() {
  const { score, craftsFinished } = S;
  if (craftsFinished === 0) return '😅 Keep Practicing — you can do it!';
  if (score >= 800)         return '⭐⭐⭐ Master Artist! Incredible!';
  if (score >= 500)         return '⭐⭐ Great Crafter! Almost perfect!';
  if (score >= 200)         return '⭐ Nice Work! Keep it up!';
  return '👍 Good Try! Practice makes perfect!';
}

// ============================================================
//  EVENT HANDLERS
// ============================================================

function onSupplyClick(id) {
  if (S.phase !== 'supplies') return;
  const idx = S.selected.indexOf(id);
  if (idx === -1) S.selected.push(id);
  else            S.selected.splice(idx, 1);
  renderSupplyTray();
  syncSupplyGrid();
}

function onPrepare() {
  const p        = S.project;
  const required = [...p.supplies].sort();
  const selected = [...S.selected].sort();

  if (required.join(',') !== selected.join(',')) {
    const missing = required.filter(id => !S.selected.includes(id));
    const extra   = S.selected.filter(id => !required.includes(id));
    let msg = '❌ Wrong supplies!';
    if (missing.length) msg += ` Need: ${missing.map(id => SUPPLIES[id].name).join(', ')}.`;
    if (extra.length)   msg += ` Remove: ${extra.map(id => SUPPLIES[id].name).join(', ')}.`;
    showFeedback(msg, 'error');
    S.score = Math.max(0, S.score - CFG.mistakePenalty);
    S.mistakes++;
    updateHUD();
    addShake($('prep-bowl'));
    return;
  }

  // ✅ Correct — advance to craft phase
  S.phase     = 'craft';
  S.stepIndex = 0;
  renderStepTrack();
  syncActionButtons();
  syncPrepButtons();
  showFeedback(
    `✅ Supplies ready! Now: ${STEP_ICONS[p.steps[0]]} ${p.steps[0]}`,
    'success'
  );
}

function onActionClick(action) {
  if (S.phase !== 'craft') return;
  const p      = S.project;
  const needed = p.steps[S.stepIndex];

  if (action === needed) {
    const hint = p.stepHints[S.stepIndex];
    S.stepIndex++;

    if (S.stepIndex >= p.steps.length) {
      // All steps done!
      S.phase = 'done';
      renderStepTrack();
      syncActionButtons();
      syncPrepButtons();
      showFeedback('🎉 Craft ready! Hit Show Off!', 'success');
      return;
    }

    renderStepTrack();
    syncActionButtons();
    showFeedback(`✅ ${hint}`, 'success');
    const next = p.steps[S.stepIndex];
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

  const p         = S.project;
  const timeBonus = Math.floor(S.orderTimeLeft * CFG.timeBonusRate);
  const earned    = p.points + timeBonus;

  S.score += earned;
  S.craftsFinished++;
  updateHUD();

  showFeedback(`🎉 Showed off! +${earned} pts  (${p.points} + ${timeBonus} time bonus)`, 'success');
  addCelebrate($('order-card'));

  setTimeout(loadNewProject, 1900);
}

function onClear() {
  if (S.phase === 'done') return;
  S.selected  = [];
  S.phase     = 'supplies';
  S.stepIndex = 0;
  renderSupplyTray();
  renderStepTrack();
  syncSupplyGrid();
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
    case 's':      onActionClick('sketch');   break;
    case 'c':      onActionClick('color');    break;
    case 'x':      onActionClick('cut');      break;
    case 'f':      onActionClick('fold');     break;
    case 'g':      onActionClick('glue');     break;
    case 'd':      onActionClick('decorate'); break;
    case 'enter':  onServe();                 break;
    case ' ':
      e.preventDefault();
      if (S.phase === 'supplies') onPrepare();
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
