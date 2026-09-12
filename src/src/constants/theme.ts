/**
 * Baby — Theme & Design Tokens
 * Pixel art design system: colors, typography, spacing, shadows.
 */

export const COLORS = {
  // Main palette
  background: '#FFF7F1',
  primary: '#F6B6C8',
  secondary: '#FFD6E0',
  accent: '#E96B7A',
  success: '#8FD3A8',
  warning: '#FFC96B',
  brownOutline: '#6F4E37',
  whiteCard: '#FFFDF9',

  // Extended
  text: '#4A3728',
  textLight: '#8B7355',
  textMuted: '#B8A692',
  white: '#FFFFFF',
  black: '#2D1F14',
  overlay: 'rgba(111, 78, 55, 0.3)',

  // Phase colors
  menstrual: '#F6B6C8',
  follicular: '#B8E6CF',
  ovulation: '#FFC96B',
  luteal: '#E8C5F0',

  // Calendar
  periodDay: '#F6B6C8',
  fertileDay: '#B8E6CF',
  ovulationDay: '#FFC96B',
  normalDay: '#FFFDF9',
  todayRing: '#E96B7A',

  // Mood colors
  moodHappy: '#FFD93D',
  moodCalm: '#8FD3A8',
  moodSad: '#89CFF0',
  moodEmotional: '#DDA0DD',
  moodAngry: '#FF6B6B',
  moodRomantic: '#FF69B4',
  moodAnxious: '#FFB347',
  moodTired: '#B0C4DE',
  moodStressed: '#CD853F',
  moodOverwhelmed: '#9B59B6',

  // Gradients (as arrays)
  gradientPrimary: ['#FFD6E0', '#F6B6C8'],
  gradientWarm: ['#FFF7F1', '#FFE8D6'],
  gradientAccent: ['#F6B6C8', '#E96B7A'],
} as const;

export const FONTS = {
  pixel: 'PressStart2P',
  pixelBody: 'VT323',
  system: 'System',
} as const;

export const FONT_SIZES = {
  xs: 8,
  sm: 10,
  md: 12,
  lg: 14,
  xl: 16,
  '2xl': 20,
  '3xl': 24,
  '4xl': 32,
} as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
  '5xl': 48,
} as const;

export const BORDER_RADIUS = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 20,
  full: 9999,
} as const;

export const SHADOWS = {
  pixel: {
    shadowColor: '#6F4E37',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 0,
    elevation: 3,
  },
  pixelLg: {
    shadowColor: '#6F4E37',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 0,
    elevation: 5,
  },
  soft: {
    shadowColor: '#6F4E37',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  glow: {
    shadowColor: '#F6B6C8',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 4,
  },
} as const;

export const PIXEL_BORDER = {
  borderWidth: 2,
  borderColor: COLORS.brownOutline,
  borderRadius: BORDER_RADIUS.lg,
} as const;

export const PIXEL_BORDER_THIN = {
  borderWidth: 1.5,
  borderColor: COLORS.brownOutline,
  borderRadius: BORDER_RADIUS.md,
} as const;
