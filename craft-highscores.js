/* Craft Studio high scores — saved only in this browser/device. */
'use strict';

(() => {
  const STORAGE_KEY = 'craft-studio-high-scores';
  const LIMIT = 5;
  let lastSavedGameOverScore = null;

  function getScores() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      return Array.isArray(saved)
        ? saved.filter(score => Number.isFinite(score) && score >= 0).sort((a, b) => b - a).slice(0, LIMIT)
        : [];
    } catch {
      return [];
    }
  }

  function saveScore(score) {
    if (!Number.isFinite(score) || score < 0) return getScores();
    const scores = [...getScores(), score].sort((a, b) => b - a).slice(0, LIMIT);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(scores));
    } catch {
      // The game still works if browser storage is unavailable.
    }
    return scores;
  }

  function renderHighScores() {
    const scores = getScores();
    document.querySelectorAll('.high-scores-list').forEach(list => {
      if (!scores.length) {
        list.innerHTML = '<li class="high-scores-empty">No scores yet — play a game to be the first artist on the board!</li>';
        return;
      }

      list.innerHTML = scores.map((score, index) => {
        const medals = ['🥇', '🥈', '🥉'];
        const rank = medals[index] || `#${index + 1}`;
        return `<li class="high-score-row"><span class="high-score-rank">${rank}</span><span class="high-score-value">${score} pts</span></li>`;
      }).join('');
    });
  }

  function recordFinishedGame() {
    const scoreElement = document.getElementById('go-score');
    const score = Number(scoreElement?.textContent);
    if (!Number.isFinite(score) || score === lastSavedGameOverScore) return;

    lastSavedGameOverScore = score;
    saveScore(score);
    renderHighScores();
  }

  document.addEventListener('DOMContentLoaded', () => {
    renderHighScores();

    const gameOverScreen = document.getElementById('gameover-screen');
    if (!gameOverScreen) return;

    new MutationObserver(() => {
      if (gameOverScreen.classList.contains('active')) recordFinishedGame();
    }).observe(gameOverScreen, { attributes: true, attributeFilter: ['class'] });
  });
})();
