/**
 * Baby — MissionCard Component
 * Daily Care Missions card with interactive pixel checkboxes and XP rewards.
 */

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import PixelCard from './PixelCard';
import { COLORS, FONTS, FONT_SIZES, SPACING, BORDER_RADIUS, SHADOWS } from '../../constants/theme';
import { DailyMissions } from '../../types';
import * as Haptics from 'expo-haptics';

interface MissionCardProps {
  missionsData: DailyMissions | null;
  onToggleMission: (missionId: string) => void;
}

export default function MissionCard({ missionsData, onToggleMission }: MissionCardProps) {
  if (!missionsData || missionsData.missions.length === 0) {
    return null;
  }

  const handlePress = (id: string, alreadyCompleted: boolean) => {
    if (!alreadyCompleted) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      onToggleMission(id);
    }
  };

  const completedCount = missionsData.missions.filter(m => m.completed).length;
  const totalCount = missionsData.missions.length;

  return (
    <PixelCard style={styles.card}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View style={styles.titleGroup}>
          <Text style={styles.headerEmoji}>📋</Text>
          <Text style={styles.headerTitle}>DAILY CARE MISSIONS</Text>
        </View>
        <View style={styles.counterBadge}>
          <Text style={styles.counterText}>{completedCount}/{totalCount}</Text>
        </View>
      </View>

      <Text style={styles.subtitle}>
        Complete small loving acts to support her and earn Love XP!
      </Text>

      {/* Mission List */}
      <View style={styles.list}>
        {missionsData.missions.map(mission => (
          <Pressable
            key={mission.id}
            onPress={() => handlePress(mission.id, mission.completed)}
            style={[
              styles.missionItem,
              mission.completed && styles.missionCompleted,
            ]}
          >
            {/* Custom Pixel Checkbox */}
            <View style={[styles.checkbox, mission.completed && styles.checkboxChecked]}>
              {mission.completed ? <Text style={styles.checkmark}>✔</Text> : null}
            </View>

            {/* Mission Icon & Info */}
            <Text style={styles.missionEmoji}>{mission.icon}</Text>
            <View style={styles.missionInfo}>
              <Text
                style={[
                  styles.missionTitle,
                  mission.completed && styles.missionTitleDone,
                ]}
              >
                {mission.title}
              </Text>
              <Text style={styles.missionDesc}>{mission.description}</Text>
            </View>

            {/* XP Badge */}
            <View style={[styles.xpPill, mission.completed && styles.xpPillDone]}>
              <Text style={styles.xpText}>+{mission.xpReward} XP</Text>
            </View>
          </Pressable>
        ))}
      </View>
    </PixelCard>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.whiteCard,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  titleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerEmoji: {
    fontSize: 20,
    marginRight: 6,
  },
  headerTitle: {
    fontFamily: FONTS.pixel,
    fontSize: FONT_SIZES.sm,
    color: COLORS.text,
  },
  counterBadge: {
    backgroundColor: '#FFE3E8',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.brownOutline,
  },
  counterText: {
    fontFamily: FONTS.pixel,
    fontSize: 8,
    color: COLORS.accent,
  },
  subtitle: {
    fontFamily: FONTS.pixelBody,
    fontSize: FONT_SIZES.md,
    color: COLORS.textLight,
    marginBottom: SPACING.md,
  },
  list: {
    gap: 8,
  },
  missionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFDF9',
    padding: SPACING.sm,
    borderWidth: 1.5,
    borderColor: COLORS.brownOutline,
    borderRadius: BORDER_RADIUS.lg,
    ...SHADOWS.pixel,
  },
  missionCompleted: {
    backgroundColor: '#F0F9F3',
    borderColor: COLORS.success,
    opacity: 0.85,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 2,
    borderColor: COLORS.brownOutline,
    borderRadius: 4,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  checkboxChecked: {
    backgroundColor: COLORS.success,
    borderColor: '#4E9E6D',
  },
  checkmark: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  missionEmoji: {
    fontSize: 20,
    marginRight: 8,
  },
  missionInfo: {
    flex: 1,
  },
  missionTitle: {
    fontFamily: FONTS.pixel,
    fontSize: 9,
    color: COLORS.text,
  },
  missionTitleDone: {
    textDecorationLine: 'line-through',
    color: COLORS.textMuted,
  },
  missionDesc: {
    fontFamily: FONTS.pixelBody,
    fontSize: FONT_SIZES.md,
    color: COLORS.textLight,
    marginTop: 1,
  },
  xpPill: {
    backgroundColor: '#FFF0F5',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: COLORS.accent,
    borderRadius: BORDER_RADIUS.md,
    marginLeft: 4,
  },
  xpPillDone: {
    backgroundColor: '#E8F5E9',
    borderColor: COLORS.success,
  },
  xpText: {
    fontFamily: FONTS.pixel,
    fontSize: 7,
    color: COLORS.accent,
  },
});
