/**
 * Baby — XPBadge Component
 * Displays Level, Love XP, and Care Streak in cute pixel badges.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS, FONT_SIZES, SPACING, BORDER_RADIUS, SHADOWS } from '../../constants/theme';

interface XPBadgeProps {
  level: number;
  totalXP: number;
  streak: number;
}

export default function XPBadge({ level, totalXP, streak }: XPBadgeProps) {
  return (
    <View style={styles.container}>
      {/* Level Badge */}
      <View style={[styles.badge, styles.levelBadge]}>
        <Text style={styles.badgeEmoji}>👑</Text>
        <View>
          <Text style={styles.badgeLabel}>LVL</Text>
          <Text style={styles.badgeValue}>{level}</Text>
        </View>
      </View>

      {/* XP Badge */}
      <View style={[styles.badge, styles.xpBadge]}>
        <Text style={styles.badgeEmoji}>💖</Text>
        <View>
          <Text style={styles.badgeLabel}>LOVE XP</Text>
          <Text style={styles.badgeValue}>{totalXP}</Text>
        </View>
      </View>

      {/* Streak Badge */}
      <View style={[styles.badge, styles.streakBadge]}>
        <Text style={styles.badgeEmoji}>🔥</Text>
        <View>
          <Text style={styles.badgeLabel}>STREAK</Text>
          <Text style={styles.badgeValue}>{streak}d</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: SPACING.sm,
    gap: SPACING.sm,
  },
  badge: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.xs + 2,
    paddingHorizontal: SPACING.sm,
    borderWidth: 2,
    borderColor: COLORS.brownOutline,
    borderRadius: BORDER_RADIUS.lg,
    ...SHADOWS.pixel,
  },
  levelBadge: {
    backgroundColor: '#FFE5EC',
  },
  xpBadge: {
    backgroundColor: '#FFF0F5',
  },
  streakBadge: {
    backgroundColor: '#FFF3E0',
  },
  badgeEmoji: {
    fontSize: 18,
    marginRight: 6,
  },
  badgeLabel: {
    fontFamily: FONTS.pixel,
    fontSize: 7,
    color: COLORS.textLight,
  },
  badgeValue: {
    fontFamily: FONTS.pixel,
    fontSize: FONT_SIZES.sm,
    color: COLORS.text,
    marginTop: 2,
  },
});
