/**
 * Baby — Analytics Computation
 * All analytics generated locally from stored data.
 */

import { DailyLog, MoodType, SymptomType, CycleRecord, FlowLevel, UserProfile } from '../types';
import { MOOD_OPTIONS, SYMPTOM_OPTIONS } from '../constants';

// ─── Cycle Analytics ─────────────────────────────────────

export function computeAverageCycleLength(cycles: CycleRecord[]): number {
  const lengths = cycles.filter(c => c.cycleLength).map(c => c.cycleLength!);
  if (lengths.length === 0) return 0;
  return Math.round(lengths.reduce((a, b) => a + b, 0) / lengths.length);
}

export function computeAveragePeriodLength(cycles: CycleRecord[]): number {
  const lengths = cycles.filter(c => c.periodLength).map(c => c.periodLength!);
  if (lengths.length === 0) return 0;
  return Math.round(lengths.reduce((a, b) => a + b, 0) / lengths.length);
}

export function getCycleLengthHistory(cycles: CycleRecord[]): number[] {
  return cycles.filter(c => c.cycleLength).map(c => c.cycleLength!).slice(-12);
}

export function getPeriodLengthHistory(cycles: CycleRecord[]): number[] {
  return cycles.filter(c => c.periodLength).map(c => c.periodLength!).slice(-12);
}

// ─── Mood Analytics ──────────────────────────────────────

export function computeMoodFrequency(logs: Record<string, DailyLog>): Record<string, number> {
  const frequency: Record<string, number> = {};
  MOOD_OPTIONS.forEach(m => { frequency[m.id] = 0; });

  Object.values(logs).forEach(log => {
    log.moods?.forEach(mood => {
      frequency[mood] = (frequency[mood] || 0) + 1;
    });
  });

  return frequency;
}

export function getTopMoods(logs: Record<string, DailyLog>, count: number = 5): { mood: MoodType; count: number }[] {
  const freq = computeMoodFrequency(logs);
  return Object.entries(freq)
    .map(([mood, cnt]) => ({ mood: mood as MoodType, count: cnt }))
    .sort((a, b) => b.count - a.count)
    .slice(0, count);
}

// ─── Symptom Analytics ───────────────────────────────────

export function computeSymptomFrequency(logs: Record<string, DailyLog>): Record<string, number> {
  const frequency: Record<string, number> = {};
  SYMPTOM_OPTIONS.forEach(s => { frequency[s.id] = 0; });

  Object.values(logs).forEach(log => {
    log.symptoms?.forEach(symptom => {
      frequency[symptom] = (frequency[symptom] || 0) + 1;
    });
  });

  return frequency;
}

export function getTopSymptoms(logs: Record<string, DailyLog>, count: number = 5): { symptom: SymptomType; count: number }[] {
  const freq = computeSymptomFrequency(logs);
  return Object.entries(freq)
    .map(([symptom, cnt]) => ({ symptom: symptom as SymptomType, count: cnt }))
    .sort((a, b) => b.count - a.count)
    .filter(s => s.count > 0)
    .slice(0, count);
}

// ─── Flow Analytics ──────────────────────────────────────

export function getFlowDistribution(logs: Record<string, DailyLog>): Record<FlowLevel, number> {
  const dist: Record<string, number> = {
    spotting: 0,
    light: 0,
    medium: 0,
    heavy: 0,
    very_heavy: 0,
  };

  Object.values(logs).forEach(log => {
    if (log.flow) {
      dist[log.flow] = (dist[log.flow] || 0) + 1;
    }
  });

  return dist as Record<FlowLevel, number>;
}

// ─── Health Correlations ─────────────────────────────────

export function getSleepVsMoodData(logs: Record<string, DailyLog>): { sleep: number; moodScore: number; date: string }[] {
  return Object.entries(logs)
    .filter(([_, log]) => log.health?.sleepHours > 0 && log.moods?.length > 0)
    .map(([date, log]) => ({
      date,
      sleep: log.health.sleepHours,
      moodScore: getMoodScore(log.moods),
    }))
    .slice(-30);
}

export function getWaterVsSymptomData(logs: Record<string, DailyLog>): { water: number; symptomCount: number; date: string }[] {
  return Object.entries(logs)
    .filter(([_, log]) => log.health?.waterIntake > 0)
    .map(([date, log]) => ({
      date,
      water: log.health.waterIntake,
      symptomCount: log.symptoms?.length || 0,
    }))
    .slice(-30);
}

// ─── Monthly Summary ─────────────────────────────────────

export interface MonthlySummary {
  month: string;
  totalLogs: number;
  periodDays: number;
  dominantMood: string;
  topSymptom: string;
  avgSleep: number;
  avgWater: number;
}

export function getMonthlyChartData(
  logs: Record<string, DailyLog>,
  months: number = 6,
): MonthlySummary[] {
  const now = new Date();
  const summaries: MonthlySummary[] = [];

  for (let i = months - 1; i >= 0; i--) {
    const targetMonth = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthStr = `${targetMonth.getFullYear()}-${String(targetMonth.getMonth() + 1).padStart(2, '0')}`;
    const monthName = targetMonth.toLocaleDateString('en', { month: 'short', year: '2-digit' });

    const monthLogs = Object.entries(logs).filter(([date]) => date.startsWith(monthStr));
    const logValues = monthLogs.map(([_, l]) => l);

    const moodCounts: Record<string, number> = {};
    const symptomCounts: Record<string, number> = {};
    let totalSleep = 0;
    let sleepCount = 0;
    let totalWater = 0;
    let waterCount = 0;
    let periodDays = 0;

    logValues.forEach(log => {
      if (log.isPeriod) periodDays++;
      log.moods?.forEach(m => { moodCounts[m] = (moodCounts[m] || 0) + 1; });
      log.symptoms?.forEach(s => { symptomCounts[s] = (symptomCounts[s] || 0) + 1; });
      if (log.health?.sleepHours) { totalSleep += log.health.sleepHours; sleepCount++; }
      if (log.health?.waterIntake) { totalWater += log.health.waterIntake; waterCount++; }
    });

    const dominantMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'none';
    const topSymptom = Object.entries(symptomCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'none';

    summaries.push({
      month: monthName,
      totalLogs: monthLogs.length,
      periodDays,
      dominantMood,
      topSymptom,
      avgSleep: sleepCount > 0 ? Math.round((totalSleep / sleepCount) * 10) / 10 : 0,
      avgWater: waterCount > 0 ? Math.round((totalWater / waterCount) * 10) / 10 : 0,
    });
  }

  return summaries;
}

// ─── Helpers ─────────────────────────────────────────────

/**
 * Convert a mood array to a numeric score (0-10) for charting.
 * Positive moods score higher, negative moods score lower.
 */
function getMoodScore(moods: MoodType[]): number {
  const scores: Record<MoodType, number> = {
    happy: 9,
    calm: 8,
    romantic: 8,
    tired: 4,
    sad: 3,
    emotional: 5,
    anxious: 3,
    stressed: 3,
    angry: 2,
    overwhelmed: 2,
  };

  if (moods.length === 0) return 5;
  const total = moods.reduce((sum, m) => sum + (scores[m] || 5), 0);
  return Math.round((total / moods.length) * 10) / 10;
}

/**
 * Count total logging days.
 */
export function getTotalLogDays(logs: Record<string, DailyLog>): number {
  return Object.keys(logs).length;
}
