/**
 * Baby — React Hooks for Data Access
 * Re-exports reactive access to the unified BabyProvider context,
 * ensuring all screens and tabs stay perfectly in sync.
 */

import { useBaby } from '../context/BabyContext';
import { UserProfile, CycleRecord, DailyLog, JournalEntry, Memories, PetState, AppSettings } from '../types';
import * as Storage from '../storage/storage';
import {
  processDailyLogin,
  updateCareStreak,
  checkAchievements as calcCheckAchievements,
} from '../storage/xpSystem';

export function useProfile() {
  const { profile, loading, saveProfile, reloadAll } = useBaby();
  return { profile, loading, save: saveProfile, reload: reloadAll };
}

export function useCycleData() {
  const { history, loading, reloadAll } = useBaby();
  return { history, loading, addRecord: async () => {}, reload: reloadAll };
}

export function useCycleState(_profile?: UserProfile | null) {
  const { cycleState, history } = useBaby();
  return { cycleState, history };
}

export function useDailyLogs() {
  const { logs, loading, saveDailyLog, reloadAll } = useBaby();
  return {
    logs,
    loading,
    saveLog: (date: string, log: DailyLog, earnedXP: number = 0) => saveDailyLog(date, log, earnedXP),
    getLog: async (date: string) => logs[date] || null,
    reload: reloadAll,
  };
}

export function useJournal() {
  const { journal: entries, loading, saveJournalEntry, deleteJournalEntry, reloadAll } = useBaby();
  return {
    entries,
    loading,
    saveEntry: saveJournalEntry,
    deleteEntry: deleteJournalEntry,
    reload: reloadAll,
  };
}

export function useMemories() {
  const { memories, loading, saveMemories, reloadAll } = useBaby();
  return { memories, loading, save: saveMemories, reload: reloadAll };
}

export function useMissions(_currentPhase?: string) {
  const { missions, loading, completeMissionItem, reloadAll } = useBaby();
  return {
    missions,
    loading,
    complete: completeMissionItem,
    reload: reloadAll,
  };
}

export function usePet() {
  const { pet, loading, savePet, reloadAll } = useBaby();
  return { pet, loading, save: savePet, reload: reloadAll };
}

export function useXP() {
  const { xp, loading, addXP, deductXP, reloadAll } = useBaby();
  return {
    xp,
    loading,
    addXP,
    deductXP,
    loginBonus: async () => {
      const current = await Storage.getXP();
      const { xp: updated, xpEarned } = processDailyLogin(current);
      if (xpEarned > 0) {
        await Storage.saveXP(updated);
        await reloadAll();
      }
      return xpEarned;
    },
    recordCare: async () => {
      const current = await Storage.getXP();
      const updated = updateCareStreak(current);
      await Storage.saveXP(updated);
      await reloadAll();
    },
    reload: reloadAll,
  };
}

export function useAchievements() {
  const { achievements, loading, reloadAll } = useBaby();
  return {
    achievements,
    loading,
    check: async (context: {
      careStreak: number;
      totalLogs: number;
      totalMissions: number;
      totalJournals: number;
      level: number;
      memoryFields: number;
      cycleCount: number;
    }) => {
      const current = await Storage.getAchievements();
      const { achievements: updated, newlyUnlocked } = calcCheckAchievements(current, context);
      await Storage.saveAchievements(updated);
      await reloadAll();
      return newlyUnlocked;
    },
    reload: reloadAll,
  };
}

export function useSettings() {
  const { settings, loading, saveSettings, resetAllData, reloadAll } = useBaby();
  return {
    settings,
    loading,
    save: saveSettings,
    resetAllData,
    reload: reloadAll,
  };
}
