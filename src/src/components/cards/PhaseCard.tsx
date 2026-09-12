/**
 * Baby — PhaseCard Component
 * The primary hero card displaying girlfriend's name, cycle day, phase,
 * progress bar, next period countdown, and fertile/ovulation info.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PixelCard from './PixelCard';
import ProgressBar from '../common/ProgressBar';
import { COLORS, FONTS, FONT_SIZES, SPACING, BORDER_RADIUS } from '../../constants/theme';
import { CycleState, UserProfile } from '../../types';
import { PHASE_DATA } from '../../constants';
import SparklesGroup from '../common/Sparkles';

interface PhaseCardProps {
  profile: UserProfile;
  cycleState: CycleState;
}

export default function PhaseCard({ profile, cycleState }: PhaseCardProps) {
  const phaseInfo = PHASE_DATA[cycleState.currentPhase] || PHASE_DATA.follicular;

  return (
    <PixelCard style={styles.card} color="#FFF9F5">
      <SparklesGroup count={3} />

      {/* Top Row: Girlfriend Name & Cycle Day */}
      <View style={styles.topRow}>
        <View style={styles.nameBadge}>
          <Text style={styles.heartIcon}>❤️</Text>
          <Text style={styles.nameText}>{profile.girlfriendName || 'Sweetheart'}</Text>
        </View>
        <View style={styles.dayBadge}>
          <Text style={styles.dayLabel}>DAY</Text>
          <Text style={styles.dayNumber}>{cycleState.currentDay}</Text>
        </View>
      </View>

      {/* Phase Banner */}
      <View style={[styles.phaseBanner, { backgroundColor: phaseInfo.color }]}>
        <Text style={styles.phaseEmoji}>{phaseInfo.emoji}</Text>
        <View style={styles.phaseTextGroup}>
          <Text style={styles.phaseTitle}>{phaseInfo.name}</Text>
          <Text style={styles.phaseHormones}>
            {phaseInfo.hormones.map(h => `${h.name}: ${h.level}`).join(' • ')}
          </Text>
        </View>
      </View>

      {/* Progress Bar through cycle */}
      <View style={styles.progressSection}>
        <ProgressBar
          progress={cycleState.periodProgress}
          label={`Cycle Progress (Avg ${profile.averageCycleLength || 28} days)`}
          showPercentage
          color={phaseInfo.color}
          height={14}
        />
      </View>

      {/* Countdowns Grid */}
      <View style={styles.statsGrid}>
        {/* Next Period */}
        <View style={styles.statBox}>
          <Text style={styles.statEmoji}>🩸</Text>
          <Text style={styles.statValue}>
            {cycleState.daysUntilNextPeriod === 0 ? 'Due Today' : `${cycleState.daysUntilNextPeriod} days`}
          </Text>
          <Text style={styles.statLabel}>Next Period</Text>
        </View>

        {/* Ovulation Countdown */}
        <View style={styles.statBox}>
          <Text style={styles.statEmoji}>✨</Text>
          <Text style={styles.statValue}>
            {cycleState.daysUntilOvulation === 0 ? 'Today!' : `${cycleState.daysUntilOvulation} days`}
          </Text>
          <Text style={styles.statLabel}>Ovulation</Text>
        </View>

        {/* Fertile Window status */}
        <View style={[styles.statBox, cycleState.isInFertileWindow && styles.fertileActive]}>
          <Text style={styles.statEmoji}>🌸</Text>
          <Text style={[styles.statValue, cycleState.isInFertileWindow && styles.fertileText]}>
            {cycleState.isInFertileWindow ? 'Active' : 'Not Active'}
          </Text>
          <Text style={styles.statLabel}>Fertile Window</Text>
        </View>
      </View>
    </PixelCard>
  );
}

const styles = StyleSheet.create({
  card: {
    position: 'relative',
    overflow: 'hidden',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  nameBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF0F5',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    borderWidth: 1.5,
    borderColor: COLORS.brownOutline,
    borderRadius: BORDER_RADIUS.full,
  },
  heartIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  nameText: {
    fontFamily: FONTS.pixel,
    fontSize: FONT_SIZES.sm,
    color: COLORS.text,
  },
  dayBadge: {
    alignItems: 'center',
    backgroundColor: COLORS.whiteCard,
    paddingHorizontal: SPACING.md,
    paddingVertical: 4,
    borderWidth: 1.5,
    borderColor: COLORS.brownOutline,
    borderRadius: BORDER_RADIUS.md,
  },
  dayLabel: {
    fontFamily: FONTS.pixel,
    fontSize: 7,
    color: COLORS.textLight,
  },
  dayNumber: {
    fontFamily: FONTS.pixel,
    fontSize: FONT_SIZES.md,
    color: COLORS.accent,
  },
  phaseBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.sm + 2,
    borderWidth: 2,
    borderColor: COLORS.brownOutline,
    borderRadius: BORDER_RADIUS.lg,
    marginVertical: SPACING.xs,
  },
  phaseEmoji: {
    fontSize: 28,
    marginRight: SPACING.sm,
  },
  phaseTextGroup: {
    flex: 1,
  },
  phaseTitle: {
    fontFamily: FONTS.pixel,
    fontSize: FONT_SIZES.sm,
    color: COLORS.text,
  },
  phaseHormones: {
    fontFamily: FONTS.pixelBody,
    fontSize: FONT_SIZES.md + 2,
    color: COLORS.textLight,
    marginTop: 2,
  },
  progressSection: {
    marginTop: SPACING.xs,
    marginBottom: SPACING.sm,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: SPACING.xs,
    marginTop: SPACING.xs,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: COLORS.whiteCard,
    paddingVertical: SPACING.xs + 4,
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: COLORS.brownOutline,
    borderRadius: BORDER_RADIUS.md,
  },
  statEmoji: {
    fontSize: 16,
    marginBottom: 2,
  },
  statValue: {
    fontFamily: FONTS.pixel,
    fontSize: 9,
    color: COLORS.text,
    textAlign: 'center',
  },
  statLabel: {
    fontFamily: FONTS.pixelBody,
    fontSize: FONT_SIZES.md,
    color: COLORS.textLight,
    marginTop: 2,
  },
  fertileActive: {
    backgroundColor: '#E8F8F0',
    borderColor: COLORS.success,
  },
  fertileText: {
    color: '#2E7D32',
  },
});
