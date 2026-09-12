/**
 * Baby — Type Definitions
 * All TypeScript interfaces for the cozy pixel-art relationship companion app.
 */

// ─── Cycle Types ─────────────────────────────────────────

export type CyclePhase = 'menstrual' | 'follicular' | 'ovulation' | 'luteal';

export type FlowLevel = 'spotting' | 'light' | 'medium' | 'heavy' | 'very_heavy';

export type MoodType =
  | 'happy' | 'calm' | 'sad' | 'emotional' | 'angry'
  | 'romantic' | 'anxious' | 'tired' | 'stressed' | 'overwhelmed';

export type SymptomType =
  | 'cramps' | 'back_pain' | 'headache' | 'acne' | 'fatigue'
  | 'bloating' | 'breast_tenderness' | 'nausea' | 'spotting'
  | 'heavy_flow' | 'light_flow' | 'ovulation_pain'
  | 'constipation' | 'diarrhea' | 'insomnia';

// ─── User Profile ────────────────────────────────────────

export interface UserProfile {
  girlfriendName: string;
  averageCycleLength: number; // days, default 28
  averagePeriodLength: number; // days, default 5
  lastPeriodStart: string; // ISO date string
  createdAt: string;
  onboardingComplete: boolean;
}

// ─── Cycle Data ──────────────────────────────────────────

export interface CycleRecord {
  id: string;
  startDate: string; // ISO date
  endDate?: string; // ISO date (period end)
  cycleLength?: number;
  periodLength?: number;
}

export interface CycleState {
  currentDay: number;
  currentPhase: CyclePhase;
  daysUntilNextPeriod: number;
  daysUntilOvulation: number;
  isInFertileWindow: boolean;
  periodProgress: number; // 0-1 for progress bar
  phaseProgress: number; // 0-1 within current phase
}

// ─── Daily Log ───────────────────────────────────────────

export interface DailyLog {
  date: string; // ISO date string (YYYY-MM-DD)
  isPeriod: boolean;
  flow?: FlowLevel;
  moods: MoodType[];
  symptoms: SymptomType[];
  health: HealthLog;
  notes: string;
  medication: string;
  temperature?: number;
}

export interface HealthLog {
  waterIntake: number; // glasses
  sleepHours: number;
  exercise: boolean;
  exerciseMinutes?: number;
  weight?: number;
  medication?: string;
  vitamin?: boolean;
}

// ─── Journal ─────────────────────────────────────────────

export interface JournalEntry {
  id: string;
  date: string;
  title: string;
  content: string;
  category: JournalCategory;
  mood?: MoodType;
  createdAt: string;
  updatedAt: string;
}

export type JournalCategory =
  | 'daily_note' | 'special_moment' | 'date_idea'
  | 'gift_idea' | 'future_plan' | 'memory';

// ─── Memories / Favorites ────────────────────────────────

export interface Memories {
  favoriteChocolate: string;
  favoriteFlowers: string;
  favoriteFood: string;
  coffeeOrder: string;
  favoriteDrink: string;
  favoriteColor: string;
  favoriteMovies: string[];
  favoriteSongs: string[];
  favoriteAnime: string[];
  favoriteRestaurants: string[];
  dreamPlaces: string[];
  birthday: string;
  anniversary: string;
  firstDate: string;
  ringSize: string;
  clothingSize: string;
  shoeSize: string;
  loveLanguage: string;
  specialNotes: string;
}

// ─── Missions ────────────────────────────────────────────

export interface Mission {
  id: string;
  title: string;
  description: string;
  icon: string;
  xpReward: number;
  completed: boolean;
  category: MissionCategory;
}

export type MissionCategory =
  | 'morning' | 'afternoon' | 'evening' | 'anytime' | 'special';

export interface DailyMissions {
  date: string;
  missions: Mission[];
  totalXP: number;
  completedCount: number;
}

// ─── Pet System ──────────────────────────────────────────

export type PetMood = 'happy' | 'content' | 'sleepy' | 'excited' | 'love';

export type PetEvolution = 'egg' | 'baby' | 'teen' | 'adult' | 'legendary';

export interface PetState {
  name: string;
  evolution: PetEvolution;
  mood: PetMood;
  happiness: number; // 0-100
  room: RoomState;
}

export interface RoomState {
  wallpaper: string;
  furniture: string[];
  plants: string[];
  decorations: string[];
}

export interface ShopItem {
  id: string;
  name: string;
  category: 'furniture' | 'plant' | 'wallpaper' | 'decoration' | 'outfit' | 'toy';
  cost: number; // XP cost
  icon: string;
  unlocked: boolean;
}

// ─── XP & Achievements ──────────────────────────────────

export interface XPData {
  totalXP: number;
  currentLevel: number;
  xpForNextLevel: number;
  xpProgress: number; // 0-1
  dailyLoginStreak: number;
  careStreak: number;
  lastLoginDate: string;
  lastCareDate: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  requirement: number;
  progress: number;
  unlocked: boolean;
  unlockedAt?: string;
  xpReward: number;
}

// ─── Analytics ───────────────────────────────────────────

export interface CycleAnalytics {
  averageCycleLength: number;
  averagePeriodLength: number;
  cycleLengthHistory: number[];
  periodLengthHistory: number[];
  moodFrequency: Record<MoodType, number>;
  symptomFrequency: Record<SymptomType, number>;
  flowHistory: Record<string, FlowLevel>;
  monthlyMoodTrends: MoodTrend[];
  sleepVsMood: CorrelationPoint[];
  waterVsSymptoms: CorrelationPoint[];
}

export interface MoodTrend {
  month: string;
  dominantMood: MoodType;
  moodCounts: Partial<Record<MoodType, number>>;
}

export interface CorrelationPoint {
  date: string;
  xValue: number;
  yValue: number;
}

// ─── Settings ────────────────────────────────────────────

export interface AppSettings {
  notifications: NotificationSettings;
  theme: 'default' | 'dark' | 'sakura';
  hapticFeedback: boolean;
  showTips: boolean;
}

export interface NotificationSettings {
  enabled: boolean;
  periodReminder: boolean;
  dailyLogReminder: boolean;
  dailyLogReminderTime: string; // HH:MM
  waterReminder: boolean;
  waterReminderInterval: number; // hours
  missionReminder: boolean;
}

// ─── App Database (root JSON shape) ─────────────────────

export interface AppDatabase {
  profile: UserProfile;
  cycleHistory: CycleRecord[];
  dailyLogs: Record<string, DailyLog>; // keyed by date
  journal: JournalEntry[];
  memories: Memories;
  missions: DailyMissions;
  pet: PetState;
  xp: XPData;
  achievements: Achievement[];
  settings: AppSettings;
}

// ─── Navigation ──────────────────────────────────────────

export type RootTabParamList = {
  Home: undefined;
  Calendar: undefined;
  Tracker: { date?: string };
  Analytics: undefined;
  Memories: undefined;
  Settings: undefined;
};

export type RootStackParamList = {
  Onboarding: undefined;
  MainTabs: undefined;
  Journal: undefined;
  JournalEntry: { entryId?: string };
  DayDetail: { date: string };
};
