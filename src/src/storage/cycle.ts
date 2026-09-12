/**
 * Baby — Cycle Calculation Engine
 * All menstrual cycle math: phase detection, day counting, predictions.
 * Everything computed locally with no internet dependency.
 */

import {
  differenceInDays, addDays, format, parseISO, isWithinInterval,
  startOfDay, isSameDay, isBefore, isAfter,
} from 'date-fns';
import { CyclePhase, CycleState, CycleRecord, UserProfile } from '../types';
import {
  DEFAULT_CYCLE_LENGTH, DEFAULT_PERIOD_LENGTH,
  OVULATION_DAY_OFFSET, FERTILE_WINDOW_BEFORE, FERTILE_WINDOW_AFTER,
} from '../constants';

// ─── Core Cycle State ────────────────────────────────────

/**
 * Calculate the current cycle state from profile and history.
 */
export function getCycleState(
  profile: UserProfile,
  cycleHistory: CycleRecord[],
): CycleState {
  const today = startOfDay(new Date());
  const lastPeriodStart = startOfDay(parseISO(profile.lastPeriodStart));
  const cycleLength = getAverageCycleLength(profile, cycleHistory);
  const periodLength = getAveragePeriodLength(profile, cycleHistory);

  // Current cycle day (1-indexed)
  const currentDay = differenceInDays(today, lastPeriodStart) + 1;

  // Handle if cycle day exceeds expected length (period may be late)
  const effectiveDay = currentDay > 0 ? currentDay : 1;

  // Current phase
  const currentPhase = getPhaseForDay(effectiveDay, cycleLength, periodLength);

  // Days until next period
  const daysUntilNextPeriod = Math.max(0, cycleLength - effectiveDay + 1);

  // Ovulation day (typically 14 days before the end of cycle)
  const ovulationDay = cycleLength - OVULATION_DAY_OFFSET;
  const daysUntilOvulation = Math.max(0, ovulationDay - effectiveDay);

  // Fertile window
  const fertileStart = ovulationDay - FERTILE_WINDOW_BEFORE;
  const fertileEnd = ovulationDay + FERTILE_WINDOW_AFTER;
  const isInFertileWindow = effectiveDay >= fertileStart && effectiveDay <= fertileEnd;

  // Progress through cycle (0-1)
  const periodProgress = Math.min(1, Math.max(0, (effectiveDay - 1) / (cycleLength - 1)));

  // Progress within current phase
  const phaseProgress = getPhaseProgress(effectiveDay, cycleLength, periodLength, currentPhase);

  return {
    currentDay: effectiveDay,
    currentPhase,
    daysUntilNextPeriod,
    daysUntilOvulation,
    isInFertileWindow,
    periodProgress,
    phaseProgress,
  };
}

// ─── Phase Detection ─────────────────────────────────────

/**
 * Determine which phase a given cycle day falls in.
 * Day 1 is the first day of the period.
 */
export function getPhaseForDay(
  day: number,
  cycleLength: number = DEFAULT_CYCLE_LENGTH,
  periodLength: number = DEFAULT_PERIOD_LENGTH,
): CyclePhase {
  const ovulationDay = cycleLength - OVULATION_DAY_OFFSET;

  if (day <= periodLength) {
    return 'menstrual';
  } else if (day <= ovulationDay - 1) {
    return 'follicular';
  } else if (day <= ovulationDay + 1) {
    return 'ovulation';
  } else {
    return 'luteal';
  }
}

/**
 * Get progress (0-1) within the current phase.
 */
function getPhaseProgress(
  day: number,
  cycleLength: number,
  periodLength: number,
  phase: CyclePhase,
): number {
  const ovulationDay = cycleLength - OVULATION_DAY_OFFSET;

  switch (phase) {
    case 'menstrual':
      return (day - 1) / Math.max(1, periodLength - 1);
    case 'follicular': {
      const follicularStart = periodLength + 1;
      const follicularEnd = ovulationDay - 1;
      return (day - follicularStart) / Math.max(1, follicularEnd - follicularStart);
    }
    case 'ovulation': {
      const ovStart = ovulationDay - 1;
      return (day - ovStart) / 2;
    }
    case 'luteal': {
      const lutealStart = ovulationDay + 2;
      return (day - lutealStart) / Math.max(1, cycleLength - lutealStart);
    }
    default:
      return 0;
  }
}

// ─── Averages ────────────────────────────────────────────

/**
 * Calculate average cycle length from history, falling back to profile default.
 */
export function getAverageCycleLength(
  profile: UserProfile,
  history: CycleRecord[],
): number {
  const lengths = history
    .filter(c => c.cycleLength && c.cycleLength > 0)
    .map(c => c.cycleLength!);

  if (lengths.length === 0) return profile.averageCycleLength || DEFAULT_CYCLE_LENGTH;

  const sum = lengths.reduce((a, b) => a + b, 0);
  return Math.round(sum / lengths.length);
}

/**
 * Calculate average period length from history, falling back to profile default.
 */
export function getAveragePeriodLength(
  profile: UserProfile,
  history: CycleRecord[],
): number {
  const lengths = history
    .filter(c => c.periodLength && c.periodLength > 0)
    .map(c => c.periodLength!);

  if (lengths.length === 0) return profile.averagePeriodLength || DEFAULT_PERIOD_LENGTH;

  const sum = lengths.reduce((a, b) => a + b, 0);
  return Math.round(sum / lengths.length);
}

// ─── Predictions ─────────────────────────────────────────

/**
 * Predict next period start date.
 */
export function predictNextPeriod(
  profile: UserProfile,
  history: CycleRecord[],
): Date {
  const cycleLength = getAverageCycleLength(profile, history);
  const lastStart = parseISO(profile.lastPeriodStart);
  return addDays(lastStart, cycleLength);
}

/**
 * Predict next ovulation date.
 */
export function predictNextOvulation(
  profile: UserProfile,
  history: CycleRecord[],
): Date {
  const nextPeriod = predictNextPeriod(profile, history);
  return addDays(nextPeriod, -OVULATION_DAY_OFFSET);
}

/**
 * Get the fertile window dates.
 */
export function getFertileWindow(
  profile: UserProfile,
  history: CycleRecord[],
): { start: Date; end: Date } {
  const ovulation = predictNextOvulation(profile, history);
  return {
    start: addDays(ovulation, -FERTILE_WINDOW_BEFORE),
    end: addDays(ovulation, FERTILE_WINDOW_AFTER),
  };
}

// ─── Calendar Helpers ────────────────────────────────────

export type DayType = 'period' | 'fertile' | 'ovulation' | 'normal';

/**
 * Get the type of a calendar day for color coding.
 */
export function getDayType(
  date: Date,
  profile: UserProfile,
  history: CycleRecord[],
): DayType {
  const cycleLength = getAverageCycleLength(profile, history);
  const periodLength = getAveragePeriodLength(profile, history);
  const lastStart = startOfDay(parseISO(profile.lastPeriodStart));

  // Figure out which cycle this date falls in
  const daysDiff = differenceInDays(startOfDay(date), lastStart);
  const cycleDay = ((daysDiff % cycleLength) + cycleLength) % cycleLength + 1;

  const ovulationDay = cycleLength - OVULATION_DAY_OFFSET;

  if (cycleDay <= periodLength) return 'period';
  if (cycleDay >= ovulationDay - 1 && cycleDay <= ovulationDay + 1) return 'ovulation';
  if (cycleDay >= ovulationDay - FERTILE_WINDOW_BEFORE && cycleDay <= ovulationDay + FERTILE_WINDOW_AFTER) return 'fertile';
  return 'normal';
}

/**
 * Format a date for display.
 */
export function formatDate(date: Date | string, formatStr: string = 'MMM d, yyyy'): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, formatStr);
}

/**
 * Get today's date as YYYY-MM-DD string.
 */
export function getTodayString(): string {
  return format(new Date(), 'yyyy-MM-dd');
}
