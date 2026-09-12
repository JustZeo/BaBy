/**
 * Baby — XP & Level System Hook
 * Manages XP tracking, leveling, streaks, and achievements.
 */

import { XPData, Achievement, PetState, PetEvolution } from '../types';
import { LEVEL_THRESHOLDS, PET_EVOLUTION_THRESHOLDS, ACHIEVEMENT_DEFINITIONS } from '../constants';
import { getTodayString } from './cycle';

/**
 * Award XP and recalculate level.
 */
export function awardXP(current: XPData, amount: number): XPData {
  const newTotal = current.totalXP + amount;
  const newLevel = calculateLevel(newTotal);
  const nextThreshold = LEVEL_THRESHOLDS[newLevel] || LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1] + 1000;
  const prevThreshold = LEVEL_THRESHOLDS[newLevel - 1] || 0;
  const xpInLevel = newTotal - prevThreshold;
  const xpNeeded = nextThreshold - prevThreshold;

  return {
    ...current,
    totalXP: newTotal,
    currentLevel: newLevel,
    xpForNextLevel: nextThreshold,
    xpProgress: xpNeeded > 0 ? xpInLevel / xpNeeded : 1,
  };
}

/**
 * Deduct XP when purchasing shop items.
 */
export function deductXP(current: XPData, amount: number): XPData {
  const newTotal = Math.max(0, current.totalXP - amount);
  const newLevel = calculateLevel(newTotal);
  const nextThreshold = LEVEL_THRESHOLDS[newLevel] || LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1] + 1000;
  const prevThreshold = LEVEL_THRESHOLDS[newLevel - 1] || 0;
  const xpInLevel = newTotal - prevThreshold;
  const xpNeeded = nextThreshold - prevThreshold;

  return {
    ...current,
    totalXP: newTotal,
    currentLevel: newLevel,
    xpForNextLevel: nextThreshold,
    xpProgress: xpNeeded > 0 ? xpInLevel / xpNeeded : 1,
  };
}

/**
 * Process daily login: update streak, award login XP.
 */
export function processDailyLogin(current: XPData): { xp: XPData; xpEarned: number } {
  const today = getTodayString();

  if (current.lastLoginDate === today) {
    return { xp: current, xpEarned: 0 };
  }

  const yesterday = getYesterdayString();
  const isConsecutive = current.lastLoginDate === yesterday;

  const updated: XPData = {
    ...current,
    lastLoginDate: today,
    dailyLoginStreak: isConsecutive ? current.dailyLoginStreak + 1 : 1,
  };

  const withXP = awardXP(updated, 5);
  return { xp: withXP, xpEarned: 5 };
}

/**
 * Update care streak (logging mood/symptoms counts as caring).
 */
export function updateCareStreak(current: XPData): XPData {
  const today = getTodayString();
  if (current.lastCareDate === today) return current;

  const yesterday = getYesterdayString();
  const isConsecutive = current.lastCareDate === yesterday;

  return {
    ...current,
    lastCareDate: today,
    careStreak: isConsecutive ? current.careStreak + 1 : 1,
  };
}

/**
 * Calculate level from total XP.
 */
function calculateLevel(totalXP: number): number {
  let level = 1;
  for (let i = 1; i < LEVEL_THRESHOLDS.length; i++) {
    if (totalXP >= LEVEL_THRESHOLDS[i]) {
      level = i + 1;
    } else {
      break;
    }
  }
  return level;
}

/**
 * Update pet evolution based on level.
 */
export function updatePetEvolution(pet: PetState, level: number): PetState {
  let evolution: PetEvolution = 'egg';

  if (level >= PET_EVOLUTION_THRESHOLDS.legendary) evolution = 'legendary';
  else if (level >= PET_EVOLUTION_THRESHOLDS.adult) evolution = 'adult';
  else if (level >= PET_EVOLUTION_THRESHOLDS.teen) evolution = 'teen';
  else if (level >= PET_EVOLUTION_THRESHOLDS.baby) evolution = 'baby';

  const happiness = Math.min(100, Math.max(0, pet.happiness + 2));

  return {
    ...pet,
    evolution,
    happiness,
    mood: happiness > 80 ? 'happy' : happiness > 50 ? 'content' : 'sleepy',
  };
}

/**
 * Check and unlock achievements.
 */
export function checkAchievements(
  achievements: Achievement[],
  context: {
    careStreak: number;
    totalLogs: number;
    totalMissions: number;
    totalJournals: number;
    level: number;
    memoryFields: number;
    cycleCount: number;
  },
): { achievements: Achievement[]; newlyUnlocked: Achievement[] } {
  const newlyUnlocked: Achievement[] = [];

  const updatedAchievements = achievements.map(a => {
    if (a.unlocked) return a;

    let progress = 0;
    switch (a.id) {
      case 'first_cycle': progress = context.cycleCount; break;
      case 'streak_7': progress = context.careStreak; break;
      case 'streak_30': progress = context.careStreak; break;
      case 'streak_100': progress = context.careStreak; break;
      case 'logs_100': progress = context.totalLogs; break;
      case 'first_journal': progress = context.totalJournals; break;
      case 'level_10': progress = context.level; break;
      case 'perfect_month': progress = context.careStreak; break;
      case 'supportive': progress = context.totalMissions; break;
      case 'memory_keeper': progress = context.memoryFields; break;
    }

    const updated = { ...a, progress };

    if (progress >= a.requirement && !a.unlocked) {
      updated.unlocked = true;
      updated.unlockedAt = getTodayString();
      newlyUnlocked.push(updated);
    }

    return updated;
  });

  return { achievements: updatedAchievements, newlyUnlocked };
}

// ─── Helpers ─────────────────────────────────────────────

function getYesterdayString(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split('T')[0];
}
