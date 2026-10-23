const ACHIEVEMENTS_KEY = 'developer-terminal-quest-achievements';
const BEST_SCORE_KEY = 'developer-terminal-quest-snake-best';

export function readAchievements() {
  try {
    const saved = window.localStorage.getItem(ACHIEVEMENTS_KEY);
    const parsed = saved ? JSON.parse(saved) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function writeAchievements(achievements) {
  try {
    window.localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(achievements));
  } catch {
    // The quest remains playable when browser storage is unavailable.
  }
}

export function readBestScore() {
  try {
    const score = Number(window.localStorage.getItem(BEST_SCORE_KEY));
    return Number.isFinite(score) && score > 0 ? score : 0;
  } catch {
    return 0;
  }
}

export function writeBestScore(score) {
  try {
    window.localStorage.setItem(BEST_SCORE_KEY, String(score));
  } catch {
    // The current run still keeps its score in memory.
  }
}
