/**
 * Baby — Core Storage Layer
 * AsyncStorage wrapper with typed JSON operations.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  AppDatabase, UserProfile, CycleRecord, DailyLog,
  JournalEntry, Memories, DailyMissions, PetState,
  XPData, Achievement, AppSettings,
} from '../types';
import { ACHIEVEMENT_DEFINITIONS } from '../constants';

// ─── Storage Keys ────────────────────────────────────────

const KEYS = {
  profile: '@baby_profile',
  cycleHistory: '@baby_cycles',
  dailyLogs: '@baby_daily_logs',
  journal: '@baby_journal',
  memories: '@baby_memories',
  missions: '@baby_missions',
  pet: '@baby_pet',
  xp: '@baby_xp',
  achievements: '@baby_achievements',
  settings: '@baby_settings',
} as const;

// ─── Generic Helpers ─────────────────────────────────────

async function getItem<T>(key: string): Promise<T | null> {
  try {
    const json = await AsyncStorage.getItem(key);
    return json ? JSON.parse(json) : null;
  } catch (e) {
    console.error(`[Storage] Error reading ${key}:`, e);
    return null;
  }
}

async function setItem<T>(key: string, value: T): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`[Storage] Error writing ${key}:`, e);
  }
}

async function removeItem(key: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {
    console.error(`[Storage] Error removing ${key}:`, e);
  }
}

// ─── Profile ─────────────────────────────────────────────

export async function getProfile(): Promise<UserProfile | null> {
  return getItem<UserProfile>(KEYS.profile);
}

export async function saveProfile(profile: UserProfile): Promise<void> {
  await setItem(KEYS.profile, profile);
}

// ─── Cycle History ───────────────────────────────────────

export async function getCycleHistory(): Promise<CycleRecord[]> {
  return (await getItem<CycleRecord[]>(KEYS.cycleHistory)) || [];
}

export async function saveCycleHistory(cycles: CycleRecord[]): Promise<void> {
  await setItem(KEYS.cycleHistory, cycles);
}

export async function addCycleRecord(record: CycleRecord): Promise<void> {
  const history = await getCycleHistory();
  history.push(record);
  await saveCycleHistory(history);
}

// ─── Daily Logs ──────────────────────────────────────────

export async function getDailyLogs(): Promise<Record<string, DailyLog>> {
  return (await getItem<Record<string, DailyLog>>(KEYS.dailyLogs)) || {};
}

export async function getDailyLog(date: string): Promise<DailyLog | null> {
  const logs = await getDailyLogs();
  return logs[date] || null;
}

export async function saveDailyLog(date: string, log: DailyLog): Promise<void> {
  const logs = await getDailyLogs();
  logs[date] = log;
  await setItem(KEYS.dailyLogs, logs);
}

// ─── Journal ─────────────────────────────────────────────

export async function getJournal(): Promise<JournalEntry[]> {
  return (await getItem<JournalEntry[]>(KEYS.journal)) || [];
}

export async function saveJournalEntry(entry: JournalEntry): Promise<void> {
  const journal = await getJournal();
  const idx = journal.findIndex(e => e.id === entry.id);
  if (idx >= 0) {
    journal[idx] = entry;
  } else {
    journal.unshift(entry); // newest first
  }
  await setItem(KEYS.journal, journal);
}

export async function deleteJournalEntry(id: string): Promise<void> {
  const journal = await getJournal();
  await setItem(KEYS.journal, journal.filter(e => e.id !== id));
}

// ─── Memories ────────────────────────────────────────────

export const DEFAULT_MEMORIES: Memories = {
  favoriteChocolate: '',
  favoriteFlowers: '',
  favoriteFood: '',
  coffeeOrder: '',
  favoriteDrink: '',
  favoriteColor: '',
  favoriteMovies: [],
  favoriteSongs: [],
  favoriteAnime: [],
  favoriteRestaurants: [],
  dreamPlaces: [],
  birthday: '',
  anniversary: '',
  firstDate: '',
  ringSize: '',
  clothingSize: '',
  shoeSize: '',
  loveLanguage: '',
  specialNotes: '',
};

export async function getMemories(): Promise<Memories> {
  return (await getItem<Memories>(KEYS.memories)) || DEFAULT_MEMORIES;
}

export async function saveMemories(memories: Memories): Promise<void> {
  await setItem(KEYS.memories, memories);
}

// ─── Missions ────────────────────────────────────────────

export async function getMissions(): Promise<DailyMissions | null> {
  return getItem<DailyMissions>(KEYS.missions);
}

export async function saveMissions(missions: DailyMissions): Promise<void> {
  await setItem(KEYS.missions, missions);
}

// ─── Pet ─────────────────────────────────────────────────

export const DEFAULT_PET: PetState = {
  name: 'Baby',
  evolution: 'egg',
  mood: 'content',
  happiness: 50,
  room: {
    wallpaper: 'default',
    furniture: [],
    plants: [],
    decorations: [],
  },
};

export async function getPet(): Promise<PetState> {
  return (await getItem<PetState>(KEYS.pet)) || DEFAULT_PET;
}

export async function savePet(pet: PetState): Promise<void> {
  await setItem(KEYS.pet, pet);
}

// ─── XP ──────────────────────────────────────────────────

export const DEFAULT_XP: XPData = {
  totalXP: 0,
  currentLevel: 1,
  xpForNextLevel: 50,
  xpProgress: 0,
  dailyLoginStreak: 0,
  careStreak: 0,
  lastLoginDate: '',
  lastCareDate: '',
};

export async function getXP(): Promise<XPData> {
  return (await getItem<XPData>(KEYS.xp)) || DEFAULT_XP;
}

export async function saveXP(xp: XPData): Promise<void> {
  await setItem(KEYS.xp, xp);
}

// ─── Achievements ────────────────────────────────────────

export function getDefaultAchievements(): Achievement[] {
  return ACHIEVEMENT_DEFINITIONS.map(a => ({
    ...a,
    progress: 0,
    unlocked: false,
  }));
}

export async function getAchievements(): Promise<Achievement[]> {
  return (await getItem<Achievement[]>(KEYS.achievements)) || getDefaultAchievements();
}

export async function saveAchievements(achievements: Achievement[]): Promise<void> {
  await setItem(KEYS.achievements, achievements);
}

// ─── Settings ────────────────────────────────────────────

export const DEFAULT_SETTINGS: AppSettings = {
  notifications: {
    enabled: true,
    periodReminder: true,
    dailyLogReminder: true,
    dailyLogReminderTime: '20:00',
    waterReminder: true,
    waterReminderInterval: 2,
    missionReminder: true,
  },
  theme: 'default',
  hapticFeedback: true,
  showTips: true,
};

export async function getSettings(): Promise<AppSettings> {
  return (await getItem<AppSettings>(KEYS.settings)) || DEFAULT_SETTINGS;
}

export async function saveSettings(settings: AppSettings): Promise<void> {
  await setItem(KEYS.settings, settings);
}

// ─── Clear All Data ──────────────────────────────────────

export async function clearAllData(): Promise<void> {
  const keys = Object.values(KEYS);
  await AsyncStorage.multiRemove(keys);
}

// ─── Check First Launch ─────────────────────────────────

export async function isFirstLaunch(): Promise<boolean> {
  const profile = await getProfile();
  return !profile || !profile.onboardingComplete;
}
