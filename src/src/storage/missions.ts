/**
 * Baby — Mission Generation
 * Generates daily care missions from templates.
 */

import { Mission, DailyMissions, CyclePhase, MissionCategory } from '../types';
import { MISSION_TEMPLATES, XP_VALUES } from '../constants';
import { getTodayString } from './cycle';

/**
 * Generate a set of daily missions based on the current cycle phase.
 */
export function generateDailyMissions(currentPhase: CyclePhase): DailyMissions {
  const today = getTodayString();
  const missions: Mission[] = [];

  // Pick 1 morning, 1 afternoon, 1 evening, 2 anytime
  const morning = pickRandom(MISSION_TEMPLATES.filter(m => m.category === 'morning'), 1);
  const afternoon = pickRandom(MISSION_TEMPLATES.filter(m => m.category === 'afternoon'), 1);
  const evening = pickRandom(MISSION_TEMPLATES.filter(m => m.category === 'evening'), 1);
  const anytime = pickRandom(MISSION_TEMPLATES.filter(m => m.category === 'anytime'), 2);

  // Add phase-specific mission during menstrual or luteal
  const special = (currentPhase === 'menstrual' || currentPhase === 'luteal')
    ? pickRandom(MISSION_TEMPLATES.filter(m => m.category === 'special'), 1)
    : [];

  const allPicked = [...morning, ...afternoon, ...evening, ...anytime, ...special];

  allPicked.forEach((template, index) => {
    missions.push({
      id: `${today}_${index}`,
      title: template.title,
      description: template.description,
      icon: template.icon,
      xpReward: template.xpReward,
      completed: false,
      category: template.category,
    });
  });

  return {
    date: today,
    missions,
    totalXP: missions.reduce((sum, m) => sum + m.xpReward, 0),
    completedCount: 0,
  };
}

/**
 * Mark a mission as complete and return updated missions.
 */
export function completeMission(
  dailyMissions: DailyMissions,
  missionId: string,
): { updatedMissions: DailyMissions; xpEarned: number } {
  const updated = { ...dailyMissions };
  const mission = updated.missions.find(m => m.id === missionId);

  if (!mission || mission.completed) {
    return { updatedMissions: updated, xpEarned: 0 };
  }

  mission.completed = true;
  updated.completedCount = updated.missions.filter(m => m.completed).length;

  return { updatedMissions: updated, xpEarned: mission.xpReward };
}

// ─── Helpers ─────────────────────────────────────────────

function pickRandom<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
