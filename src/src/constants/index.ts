/**
 * Baby — Constants
 * All static data: phases, symptoms, moods, missions, achievements, pet data.
 */

import {
  MoodType, SymptomType, FlowLevel, CyclePhase,
  Achievement, MissionCategory, ShopItem, PetEvolution,
} from '../types';

// ─── Cycle Phase Info ────────────────────────────────────

export interface PhaseInfo {
  id: CyclePhase;
  name: string;
  emoji: string;
  color: string;
  hormones: { name: string; level: string }[];
  whatsHappening: string;
  possibleExperiences: string[];
  possibleSymptoms: string[];
  partnerTips: string[];
}

export const PHASE_DATA: Record<CyclePhase, PhaseInfo> = {
  menstrual: {
    id: 'menstrual',
    name: 'Menstrual Phase',
    emoji: '🌙',
    color: '#F6B6C8',
    hormones: [
      { name: 'Estrogen', level: 'Low' },
      { name: 'Progesterone', level: 'Low' },
    ],
    whatsHappening:
      'The uterine lining is shedding. Hormone levels are at their lowest, which may affect energy and mood.',
    possibleExperiences: [
      'Low energy',
      'Cramps',
      'Fatigue',
      'Mood changes',
      'Headaches',
      'Need for rest',
      'Cravings',
    ],
    possibleSymptoms: [
      'cramps', 'back_pain', 'headache', 'fatigue', 'bloating', 'nausea',
    ],
    partnerTips: [
      'Offer a heating pad for cramps',
      'Bring her favorite snacks',
      'Be extra patient and understanding',
      'Ask how she\'s feeling today',
      'Suggest a cozy movie night',
      'Make her warm tea or hot chocolate',
      'Give her space if she needs it',
    ],
  },
  follicular: {
    id: 'follicular',
    name: 'Follicular Phase',
    emoji: '🌸',
    color: '#B8E6CF',
    hormones: [
      { name: 'Estrogen', level: 'Rising' },
      { name: 'FSH', level: 'Increasing' },
    ],
    whatsHappening:
      'Follicles in the ovaries are developing. Estrogen begins to rise, which may boost energy and mood.',
    possibleExperiences: [
      'Higher energy',
      'Better focus',
      'More motivation',
      'Creative feelings',
      'Improved mood',
      'Increased confidence',
    ],
    possibleSymptoms: [],
    partnerTips: [
      'Plan fun activities together',
      'Go for walks or outdoor adventures',
      'Have a coffee date',
      'Start a new project together',
      'Try a new restaurant',
      'Be spontaneous and adventurous',
    ],
  },
  ovulation: {
    id: 'ovulation',
    name: 'Ovulation',
    emoji: '✨',
    color: '#FFC96B',
    hormones: [
      { name: 'LH', level: 'Surge' },
      { name: 'Estrogen', level: 'Peak' },
    ],
    whatsHappening:
      'An egg is released from the ovary. This is peak fertility. Estrogen and LH are at their highest.',
    possibleExperiences: [
      'Higher libido',
      'More confidence',
      'More social energy',
      'Better mood',
      'Higher energy',
      'Clearer skin',
      'Possible ovulation pain',
    ],
    possibleSymptoms: ['ovulation_pain', 'bloating'],
    partnerTips: [
      'Spend quality time together',
      'Plan a special date',
      'Take photos together',
      'Be extra affectionate',
      'Compliment her genuinely',
      'Try something new together',
    ],
  },
  luteal: {
    id: 'luteal',
    name: 'Luteal Phase',
    emoji: '🍂',
    color: '#E8C5F0',
    hormones: [
      { name: 'Progesterone', level: 'High' },
      { name: 'Estrogen', level: 'Moderate then declining' },
    ],
    whatsHappening:
      'Progesterone rises to prepare the uterine lining. As it falls near the end, PMS symptoms may appear.',
    possibleExperiences: [
      'Cravings',
      'Fatigue',
      'Mood swings',
      'Bloating',
      'Breast tenderness',
      'PMS symptoms',
      'Need for comfort',
    ],
    possibleSymptoms: [
      'bloating', 'breast_tenderness', 'headache', 'fatigue',
      'acne', 'insomnia', 'constipation',
    ],
    partnerTips: [
      'Bring her chocolate or comfort food',
      'Make warm drinks together',
      'Be extra patient with mood changes',
      'Suggest a cozy movie night',
      'Give extra hugs and support',
      'Listen without trying to fix things',
      'Remind her she\'s amazing',
    ],
  },
};

// ─── Mood Options ────────────────────────────────────────

export interface MoodOption {
  id: MoodType;
  label: string;
  emoji: string;
  color: string;
}

export const MOOD_OPTIONS: MoodOption[] = [
  { id: 'happy', label: 'Happy', emoji: '😊', color: '#FFD93D' },
  { id: 'calm', label: 'Calm', emoji: '😌', color: '#8FD3A8' },
  { id: 'sad', label: 'Sad', emoji: '😢', color: '#89CFF0' },
  { id: 'emotional', label: 'Emotional', emoji: '🥺', color: '#DDA0DD' },
  { id: 'angry', label: 'Angry', emoji: '😤', color: '#FF6B6B' },
  { id: 'romantic', label: 'Romantic', emoji: '🥰', color: '#FF69B4' },
  { id: 'anxious', label: 'Anxious', emoji: '😰', color: '#FFB347' },
  { id: 'tired', label: 'Tired', emoji: '😴', color: '#B0C4DE' },
  { id: 'stressed', label: 'Stressed', emoji: '😫', color: '#CD853F' },
  { id: 'overwhelmed', label: 'Overwhelmed', emoji: '😵', color: '#9B59B6' },
];

// ─── Symptom Options ─────────────────────────────────────

export interface SymptomOption {
  id: SymptomType;
  label: string;
  emoji: string;
}

export const SYMPTOM_OPTIONS: SymptomOption[] = [
  { id: 'cramps', label: 'Cramps', emoji: '😣' },
  { id: 'back_pain', label: 'Back Pain', emoji: '🔙' },
  { id: 'headache', label: 'Headache', emoji: '🤕' },
  { id: 'acne', label: 'Acne', emoji: '😶' },
  { id: 'fatigue', label: 'Fatigue', emoji: '😩' },
  { id: 'bloating', label: 'Bloating', emoji: '🫧' },
  { id: 'breast_tenderness', label: 'Tenderness', emoji: '💗' },
  { id: 'nausea', label: 'Nausea', emoji: '🤢' },
  { id: 'spotting', label: 'Spotting', emoji: '🩸' },
  { id: 'heavy_flow', label: 'Heavy Flow', emoji: '🔴' },
  { id: 'light_flow', label: 'Light Flow', emoji: '🟡' },
  { id: 'ovulation_pain', label: 'Ovulation Pain', emoji: '⚡' },
  { id: 'constipation', label: 'Constipation', emoji: '😖' },
  { id: 'diarrhea', label: 'Diarrhea', emoji: '😓' },
  { id: 'insomnia', label: 'Insomnia', emoji: '🌙' },
];

// ─── Flow Options ────────────────────────────────────────

export interface FlowOption {
  id: FlowLevel;
  label: string;
  emoji: string;
  color: string;
}

export const FLOW_OPTIONS: FlowOption[] = [
  { id: 'spotting', label: 'Spotting', emoji: '💧', color: '#FFD6E0' },
  { id: 'light', label: 'Light', emoji: '🩸', color: '#F6B6C8' },
  { id: 'medium', label: 'Medium', emoji: '🔴', color: '#E96B7A' },
  { id: 'heavy', label: 'Heavy', emoji: '🟥', color: '#D94F5C' },
  { id: 'very_heavy', label: 'Very Heavy', emoji: '⬛', color: '#C0392B' },
];

// ─── XP Values ───────────────────────────────────────────

export const XP_VALUES = {
  dailyLogin: 5,
  moodLog: 10,
  symptomLog: 15,
  periodLogged: 25,
  journal: 10,
  missionComplete: 20,
  achievement: 50,
} as const;

export const LEVEL_THRESHOLDS = [
  0, 50, 120, 210, 320, 450, 600, 780, 980, 1200,
  1450, 1720, 2020, 2350, 2700, 3100, 3550, 4050, 4600, 5200,
  5900, 6700, 7600, 8600, 9700, 10900, 12200, 13600, 15100, 16700,
];

// ─── Mission Templates ──────────────────────────────────

export interface MissionTemplate {
  title: string;
  description: string;
  icon: string;
  xpReward: number;
  category: MissionCategory;
}

export const MISSION_TEMPLATES: MissionTemplate[] = [
  // Morning
  { title: 'Good Morning Message', description: 'Send her a sweet good morning text', icon: '☀️', xpReward: 20, category: 'morning' },
  { title: 'Morning Compliment', description: 'Tell her something you love about her', icon: '💕', xpReward: 20, category: 'morning' },
  { title: 'Breakfast Surprise', description: 'Make or bring her breakfast', icon: '🥞', xpReward: 25, category: 'morning' },

  // Afternoon
  { title: 'Ask About Her Day', description: 'Check in and ask how her day is going', icon: '💬', xpReward: 20, category: 'afternoon' },
  { title: 'Water Reminder', description: 'Remind her (and yourself!) to drink water', icon: '💧', xpReward: 15, category: 'afternoon' },
  { title: 'Send a Meme', description: 'Send her something that\'ll make her smile', icon: '😂', xpReward: 15, category: 'afternoon' },
  { title: 'Lunch Together', description: 'Plan to eat together or send food', icon: '🍱', xpReward: 20, category: 'afternoon' },

  // Evening
  { title: 'Evening Walk', description: 'Take a relaxing walk together', icon: '🚶', xpReward: 25, category: 'evening' },
  { title: 'Movie Night', description: 'Watch something together', icon: '🎬', xpReward: 20, category: 'evening' },
  { title: 'Goodnight Message', description: 'Send a sweet goodnight message', icon: '🌙', xpReward: 20, category: 'evening' },
  { title: 'Cook Together', description: 'Make dinner together or for her', icon: '👩‍🍳', xpReward: 25, category: 'evening' },

  // Anytime
  { title: 'Hug Her', description: 'Give her a warm, long hug', icon: '🤗', xpReward: 15, category: 'anytime' },
  { title: 'Compliment Her', description: 'Give a genuine, specific compliment', icon: '✨', xpReward: 15, category: 'anytime' },
  { title: 'Buy Chocolate', description: 'Get her favorite chocolate or treat', icon: '🍫', xpReward: 20, category: 'anytime' },
  { title: 'Listen Actively', description: 'Put your phone down and really listen', icon: '👂', xpReward: 20, category: 'anytime' },
  { title: 'Plan a Date', description: 'Think of and suggest a fun date idea', icon: '📅', xpReward: 20, category: 'anytime' },
  { title: 'Say I Love You', description: 'Tell her how much she means to you', icon: '❤️', xpReward: 15, category: 'anytime' },
  { title: 'Small Gift', description: 'Surprise her with something small but thoughtful', icon: '🎁', xpReward: 25, category: 'anytime' },
  { title: 'Take a Photo', description: 'Capture a moment together', icon: '📸', xpReward: 15, category: 'anytime' },

  // Special (phase-dependent)
  { title: 'Heating Pad Ready', description: 'Have a heating pad ready for her', icon: '🔥', xpReward: 25, category: 'special' },
  { title: 'Comfort Snacks', description: 'Prepare her favorite comfort snacks', icon: '🍿', xpReward: 20, category: 'special' },
  { title: 'Warm Drink', description: 'Make her a warm tea or hot chocolate', icon: '☕', xpReward: 20, category: 'special' },
  { title: 'Extra Patience', description: 'Be extra patient and understanding today', icon: '💝', xpReward: 20, category: 'special' },
];

// ─── Achievement Definitions ─────────────────────────────

export const ACHIEVEMENT_DEFINITIONS: Omit<Achievement, 'progress' | 'unlocked' | 'unlockedAt'>[] = [
  { id: 'first_cycle', title: 'First Cycle', description: 'Log your first complete cycle', icon: '🌙', requirement: 1, xpReward: 50 },
  { id: 'streak_7', title: 'Week Warrior', description: 'Maintain a 7-day care streak', icon: '🔥', requirement: 7, xpReward: 50 },
  { id: 'streak_30', title: 'Monthly Hero', description: 'Maintain a 30-day care streak', icon: '⭐', requirement: 30, xpReward: 100 },
  { id: 'logs_100', title: 'Dedicated Partner', description: 'Complete 100 daily logs', icon: '📝', requirement: 100, xpReward: 100 },
  { id: 'first_journal', title: 'Dear Diary', description: 'Write your first journal entry', icon: '📖', requirement: 1, xpReward: 50 },
  { id: 'level_10', title: 'Level 10!', description: 'Reach Level 10', icon: '🏆', requirement: 10, xpReward: 100 },
  { id: 'perfect_month', title: 'Perfect Month', description: 'Log every single day for a month', icon: '💯', requirement: 30, xpReward: 150 },
  { id: 'supportive', title: 'Supportive Partner', description: 'Complete 50 care missions', icon: '💪', requirement: 50, xpReward: 100 },
  { id: 'memory_keeper', title: 'Memory Keeper', description: 'Fill out all memory fields', icon: '💎', requirement: 18, xpReward: 100 },
  { id: 'streak_100', title: 'Legendary Streak', description: 'Maintain a 100-day streak', icon: '👑', requirement: 100, xpReward: 200 },
];

// ─── Pet Data ────────────────────────────────────────────

export const PET_EVOLUTION_THRESHOLDS: Record<PetEvolution, number> = {
  egg: 0,
  baby: 5,
  teen: 15,
  adult: 30,
  legendary: 50,
};

export const PET_DIALOGUES = {
  greetings: [
    "I'm cheering for both of you! 💕",
    "Remember to ask how she's feeling! 🌸",
    "Today might be a good day for a walk together! 🚶",
    "You're doing great! Keep it up! ✨",
    "Don't forget to drink water today! 💧",
    "A small surprise can make her day! 🎁",
    "Every day is a chance to show you care! ❤️",
    "Have you smiled at her today? 😊",
  ],
  menstrual: [
    "She may need extra comfort today... 🌙",
    "A heating pad and snacks could help! 🔥",
    "Be extra gentle and patient today 💗",
    "Maybe offer to make her some warm tea? ☕",
    "Just being there means a lot right now 🤗",
  ],
  follicular: [
    "She might have more energy today! 🌸",
    "Great time to plan something fun! 🎉",
    "How about a coffee date? ☕",
    "She may feel more creative today! 🎨",
    "Adventure time! Plan something exciting! ✨",
  ],
  ovulation: [
    "She might be feeling confident today! ✨",
    "Perfect time for quality time together! 💕",
    "Take some photos together! 📸",
    "Plan a special date for today! 🌟",
    "Be extra affectionate today! 🥰",
  ],
  luteal: [
    "She may be craving comfort food... 🍫",
    "Movie night could be perfect today! 🎬",
    "Extra patience goes a long way 💝",
    "Warm drinks and cozy vibes! ☕",
    "She might need extra reassurance today 🤗",
  ],
};

// ─── Daily Quotes ────────────────────────────────────────

export const DAILY_QUOTES = [
  "Love is in the little things you do every day. 💕",
  "Being a caring partner is a superpower. ✨",
  "Understanding her is the greatest gift you can give. 🎁",
  "Small acts of kindness build big love. ❤️",
  "Today is a perfect day to make her smile. 😊",
  "Patience and love can move mountains. 🏔️",
  "The best relationships are built on understanding. 💗",
  "Every day you show up is a win. 🏆",
  "Love grows when you pay attention. 🌱",
  "You don't have to be perfect, just present. 🌸",
  "She doesn't need you to fix it, just listen. 👂",
  "Your effort today becomes tomorrow's beautiful memory. 📸",
  "Kindness is the language of love. 💝",
  "The little things ARE the big things. ✨",
  "Being her safe space is the greatest honor. 🏡",
  "Love isn't about grand gestures, it's about showing up. 💕",
  "A warm hug can heal more than words. 🤗",
  "You're learning and growing together. 🌿",
  "Today's patience is tomorrow's strength. 💪",
  "She chose you. Show up for her. ❤️",
  "Remember: her feelings are valid, always. 💗",
  "Sometimes the best support is silent presence. 🌙",
  "Love is choosing her, every single day. 💕",
  "Your care matters more than you know. ✨",
  "The fact that you're here shows you care. 🌟",
  "Relationships bloom when both people try. 🌺",
  "Be the partner you'd want to have. 💝",
  "Every small effort adds up to something beautiful. 🎨",
  "Listening is the most underrated act of love. 👂",
  "You're becoming a better partner every day. 🌱",
];

// ─── Default Values ──────────────────────────────────────

export const DEFAULT_CYCLE_LENGTH = 28;
export const DEFAULT_PERIOD_LENGTH = 5;
export const OVULATION_DAY_OFFSET = 14; // typically 14 days before next period
export const FERTILE_WINDOW_BEFORE = 5; // 5 days before ovulation
export const FERTILE_WINDOW_AFTER = 1; // 1 day after ovulation

// ─── Shop Items ──────────────────────────────────────────

export const SHOP_ITEMS: ShopItem[] = [
  // Furniture
  { id: 'cozy_bed', name: 'Cozy Bed', category: 'furniture', cost: 100, icon: '🛏️', unlocked: false },
  { id: 'bookshelf', name: 'Bookshelf', category: 'furniture', cost: 80, icon: '📚', unlocked: false },
  { id: 'desk', name: 'Study Desk', category: 'furniture', cost: 120, icon: '🪑', unlocked: false },
  { id: 'lamp', name: 'Fairy Lamp', category: 'furniture', cost: 60, icon: '💡', unlocked: false },

  // Plants
  { id: 'succulent', name: 'Succulent', category: 'plant', cost: 40, icon: '🪴', unlocked: false },
  { id: 'flowers', name: 'Flower Pot', category: 'plant', cost: 50, icon: '🌸', unlocked: false },
  { id: 'cactus', name: 'Mini Cactus', category: 'plant', cost: 35, icon: '🌵', unlocked: false },

  // Wallpapers
  { id: 'starry', name: 'Starry Night', category: 'wallpaper', cost: 150, icon: '🌃', unlocked: false },
  { id: 'sunset', name: 'Sunset Glow', category: 'wallpaper', cost: 150, icon: '🌅', unlocked: false },
  { id: 'sakura', name: 'Sakura Garden', category: 'wallpaper', cost: 200, icon: '🌸', unlocked: false },

  // Decorations
  { id: 'hearts', name: 'Heart Garland', category: 'decoration', cost: 70, icon: '💕', unlocked: false },
  { id: 'stars', name: 'Star Mobile', category: 'decoration', cost: 80, icon: '⭐', unlocked: false },
  { id: 'rug', name: 'Fluffy Rug', category: 'decoration', cost: 90, icon: '🟤', unlocked: false },
];
