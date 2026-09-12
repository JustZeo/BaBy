/**
 * Baby — Unified Global App Context
 * Provides a single source of truth across all screens and tabs so that
 * saving daily logs, awarding/deducting XP, and updating pet/missions
 * instantly synchronizes everywhere without stale state.
 */

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
  UserProfile, CycleRecord, DailyLog, JournalEntry,
  Memories, DailyMissions, PetState, XPData, Achievement,
  AppSettings, CycleState,
} from '../types';
import * as Storage from '../storage/storage';
import { getCycleState, getTodayString } from '../storage/cycle';
import { generateDailyMissions, completeMission as completeMissionStorage } from '../storage/missions';
import {
  awardXP as calcAwardXP,
  deductXP as calcDeductXP,
  processDailyLogin,
  updateCareStreak,
  updatePetEvolution,
  checkAchievements as calcCheckAchievements,
} from '../storage/xpSystem';

interface BabyContextType {
  loading: boolean;
  isOnboarded: boolean;
  profile: UserProfile | null;
  history: CycleRecord[];
  cycleState: CycleState | null;
  logs: Record<string, DailyLog>;
  journal: JournalEntry[];
  memories: Memories;
  missions: DailyMissions | null;
  pet: PetState;
  xp: XPData;
  achievements: Achievement[];
  settings: AppSettings;

  // Actions
  saveProfile: (p: UserProfile) => Promise<void>;
  saveDailyLog: (date: string, log: DailyLog, earnedXP?: number) => Promise<void>;
  addXP: (amount: number) => Promise<XPData>;
  deductXP: (amount: number) => Promise<XPData>;
  savePet: (p: PetState) => Promise<void>;
  completeMissionItem: (missionId: string) => Promise<number>;
  saveMemories: (m: Memories) => Promise<void>;
  saveJournalEntry: (entry: JournalEntry) => Promise<void>;
  deleteJournalEntry: (id: string) => Promise<void>;
  saveSettings: (s: AppSettings) => Promise<void>;
  resetAllData: () => Promise<void>;
  reloadAll: () => Promise<void>;
}

const BabyContext = createContext<BabyContextType | undefined>(undefined);

export function BabyProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [history, setHistory] = useState<CycleRecord[]>([]);
  const [logs, setLogs] = useState<Record<string, DailyLog>>({});
  const [journal, setJournal] = useState<JournalEntry[]>([]);
  const [memories, setMemories] = useState<Memories>(Storage.DEFAULT_MEMORIES);
  const [missions, setMissions] = useState<DailyMissions | null>(null);
  const [pet, setPet] = useState<PetState>(Storage.DEFAULT_PET);
  const [xp, setXP] = useState<XPData>(Storage.DEFAULT_XP);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [settings, setSettings] = useState<AppSettings>(Storage.DEFAULT_SETTINGS);

  // Load all data from disk into memory
  const loadAll = useCallback(async () => {
    try {
      const [
        storedProfile,
        storedHistory,
        storedLogs,
        storedJournal,
        storedMemories,
        storedPet,
        storedXP,
        storedAchievements,
        storedSettings,
      ] = await Promise.all([
        Storage.getProfile(),
        Storage.getCycleHistory(),
        Storage.getDailyLogs(),
        Storage.getJournal(),
        Storage.getMemories(),
        Storage.getPet(),
        Storage.getXP(),
        Storage.getAchievements(),
        Storage.getSettings(),
      ]);

      const onboarded = !!storedProfile?.onboardingComplete;
      setIsOnboarded(onboarded);
      setProfile(storedProfile);
      setHistory(storedHistory);
      setLogs(storedLogs);
      setJournal(storedJournal);
      setMemories(storedMemories);
      setPet(storedPet);
      setXP(storedXP);
      setAchievements(storedAchievements);
      setSettings(storedSettings);

      // Missions setup
      let currentMissions = await Storage.getMissions();
      const today = getTodayString();
      if (!currentMissions || currentMissions.date !== today) {
        let phase = 'follicular' as any;
        if (storedProfile) {
          const cState = getCycleState(storedProfile, storedHistory);
          phase = cState.currentPhase;
        }
        currentMissions = generateDailyMissions(phase);
        await Storage.saveMissions(currentMissions);
      }
      setMissions(currentMissions);

      // Process daily login bonus once per day
      const { xp: updatedXP } = processDailyLogin(storedXP);
      if (updatedXP.lastLoginDate !== storedXP.lastLoginDate) {
        await Storage.saveXP(updatedXP);
        setXP(updatedXP);
      }
    } catch (err) {
      console.error('[BabyProvider] Error loading state:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  // Derived cycle state
  const cycleState = useMemo(() => {
    if (!profile) return null;
    return getCycleState(profile, history);
  }, [profile, history]);

  // ── Actions ─────────────────────────────────────────────

  const saveProfile = useCallback(async (newProfile: UserProfile) => {
    await Storage.saveProfile(newProfile);
    setProfile(newProfile);
    setIsOnboarded(newProfile.onboardingComplete);
  }, []);

  const addXP = useCallback(async (amount: number) => {
    const current = await Storage.getXP();
    const updated = calcAwardXP(current, amount);
    await Storage.saveXP(updated);
    setXP(updated);
    return updated;
  }, []);

  const deductXP = useCallback(async (amount: number) => {
    const current = await Storage.getXP();
    const updated = calcDeductXP(current, amount);
    await Storage.saveXP(updated);
    setXP(updated);
    return updated;
  }, []);

  const saveDailyLog = useCallback(async (date: string, log: DailyLog, earnedXP: number = 0) => {
    // 1. Save log to disk & state
    await Storage.saveDailyLog(date, log);
    setLogs(prev => ({ ...prev, [date]: log }));

    // 2. If period was toggled on, update cycle start if appropriate
    if (log.isPeriod && profile) {
      if (date >= profile.lastPeriodStart) {
        const updatedProfile = { ...profile, lastPeriodStart: date };
        await Storage.saveProfile(updatedProfile);
        setProfile(updatedProfile);
      }
    }

    // 3. Award XP and update streak
    let updatedXP = await Storage.getXP();
    if (earnedXP > 0) {
      updatedXP = calcAwardXP(updatedXP, earnedXP);
    }
    updatedXP = updateCareStreak(updatedXP);
    await Storage.saveXP(updatedXP);
    setXP(updatedXP);

    // 4. Update pet happiness and evolution
    const currentPet = await Storage.getPet();
    const evolvedPet = updatePetEvolution(currentPet, updatedXP.currentLevel);
    await Storage.savePet(evolvedPet);
    setPet(evolvedPet);

    // 5. Check achievements
    const allLogs = await Storage.getDailyLogs();
    const currentAchievements = await Storage.getAchievements();
    const { achievements: newAchievements } = calcCheckAchievements(currentAchievements, {
      careStreak: updatedXP.careStreak,
      totalLogs: Object.keys(allLogs).length,
      totalMissions: missions?.completedCount || 0,
      totalJournals: journal.length,
      level: updatedXP.currentLevel,
      memoryFields: 0,
      cycleCount: 0,
    });
    await Storage.saveAchievements(newAchievements);
    setAchievements(newAchievements);
  }, [journal.length, missions?.completedCount, profile]);

  const savePet = useCallback(async (newPet: PetState) => {
    await Storage.savePet(newPet);
    setPet(newPet);
  }, []);

  const completeMissionItem = useCallback(async (missionId: string) => {
    if (!missions) return 0;
    const { updatedMissions, xpEarned } = completeMissionStorage(missions, missionId);
    await Storage.saveMissions(updatedMissions);
    setMissions(updatedMissions);

    if (xpEarned > 0) {
      await addXP(xpEarned);
      const currentXP = await Storage.getXP();
      const updatedXP = updateCareStreak(currentXP);
      await Storage.saveXP(updatedXP);
      setXP(updatedXP);
    }

    return xpEarned;
  }, [addXP, missions]);

  const saveMemories = useCallback(async (newMemories: Memories) => {
    await Storage.saveMemories(newMemories);
    setMemories(newMemories);
  }, []);

  const saveJournalEntry = useCallback(async (entry: JournalEntry) => {
    await Storage.saveJournalEntry(entry);
    const updated = await Storage.getJournal();
    setJournal(updated);
  }, []);

  const deleteJournalEntry = useCallback(async (id: string) => {
    await Storage.deleteJournalEntry(id);
    setJournal(prev => prev.filter(e => e.id !== id));
  }, []);

  const saveSettings = useCallback(async (newSettings: AppSettings) => {
    await Storage.saveSettings(newSettings);
    setSettings(newSettings);
  }, []);

  const resetAllData = useCallback(async () => {
    await Storage.clearAllData();
    setIsOnboarded(false);
    setProfile(null);
    setHistory([]);
    setLogs({});
    setJournal([]);
    setMemories(Storage.DEFAULT_MEMORIES);
    setMissions(null);
    setPet(Storage.DEFAULT_PET);
    setXP(Storage.DEFAULT_XP);
    setAchievements(Storage.getDefaultAchievements());
    setSettings(Storage.DEFAULT_SETTINGS);
  }, []);

  const value = useMemo(() => ({
    loading,
    isOnboarded,
    profile,
    history,
    cycleState,
    logs,
    journal,
    memories,
    missions,
    pet,
    xp,
    achievements,
    settings,

    saveProfile,
    saveDailyLog,
    addXP,
    deductXP,
    savePet,
    completeMissionItem,
    saveMemories,
    saveJournalEntry,
    deleteJournalEntry,
    saveSettings,
    resetAllData,
    reloadAll: loadAll,
  }), [
    loading, isOnboarded, profile, history, cycleState, logs,
    journal, memories, missions, pet, xp, achievements, settings,
    saveProfile, saveDailyLog, addXP, deductXP, savePet,
    completeMissionItem, saveMemories, saveJournalEntry,
    deleteJournalEntry, saveSettings, resetAllData, loadAll,
  ]);

  return <BabyContext.Provider value={value}>{children}</BabyContext.Provider>;
}

export function useBaby() {
  const context = useContext(BabyContext);
  if (!context) {
    throw new Error('useBaby must be used within a BabyProvider');
  }
  return context;
}