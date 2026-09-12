/**
 * Baby — MoodChart Component
 * Visualizes mood distribution using cozy horizontal pixel progress bars.
 * Cleanly handles empty state and only shows moods that were actually logged.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS, FONT_SIZES, BORDER_RADIUS, SHADOWS, SPACING } from '../../constants/theme';
import { MOOD_OPTIONS } from '../../constants';

interface MoodChartProps {
  moodCounts: Record<string, number>;
}

export default function MoodChart({ moodCounts }: MoodChartProps) {
  const activeMoods = MOOD_OPTIONS
    .map(opt => ({
      ...opt,
      count: moodCounts[opt.id] || 0,
    }))
    .filter(m => m.count > 0)
    .sort((a, b) => b.count - a.count);

  const total = activeMoods.reduce((a, b) => a + b.count, 0);
  const maxCount = activeMoods.length > 0 ? activeMoods[0].count : 1;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>MOOD FREQUENCY</Text>
        <Text style={styles.totalBadge}>{total} logs</Text>
      </View>

      {activeMoods.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyEmoji}>🌸</Text>
          <Text style={styles.emptyTitle}>No Moods Logged Yet</Text>
          <Text style={styles.emptySubtitle}>
            When you log her feelings in the Tracker, mood patterns will show here!
          </Text>
        </View>
      ) : (
        <View style={styles.list}>
          {activeMoods.slice(0, 5).map(item => {
            const barPercent = Math.round((item.count / maxCount) * 100);
            return (
              <View key={item.id} style={styles.itemRow}>
                {/* Emoji & Label */}
                <View style={styles.labelCol}>
                  <Text style={styles.emoji}>{item.emoji}</Text>
                  <Text style={styles.label}>{item.label}</Text>
                </View>

                {/* Pixel Horizontal Bar */}
                <View style={styles.barContainer}>
                  <View
                    style={[
                      styles.barFill,
                      {
                        width: `${Math.max(12, barPercent)}%`,
                        backgroundColor: item.color,
                      },
                    ]}
                  >
                    <View style={styles.highlight} />
                  </View>
                </View>

                {/* Count */}
                <Text style={styles.countText}>{item.count}x</Text>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFDF9',
    borderWidth: 2,
    borderColor: COLORS.brownOutline,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOWS.pixel,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  title: {
    fontFamily: FONTS.pixel,
    fontSize: 9,
    color: COLORS.brownOutline,
  },
  totalBadge: {
    fontFamily: FONTS.pixelBody,
    fontSize: FONT_SIZES.md,
    color: COLORS.textLight,
  },
  list: {
    gap: 10,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  labelCol: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 100,
  },
  emoji: {
    fontSize: 16,
    marginRight: 4,
  },
  label: {
    fontFamily: FONTS.pixelBody,
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
  },
  barContainer: {
    flex: 1,
    height: 14,
    backgroundColor: '#FFF0F5',
    borderWidth: 1.5,
    borderColor: COLORS.brownOutline,
    borderRadius: BORDER_RADIUS.md,
    overflow: 'hidden',
    marginHorizontal: 8,
  },
  barFill: {
    height: '100%',
    position: 'relative',
  },
  highlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '35%',
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  countText: {
    fontFamily: FONTS.pixel,
    fontSize: 8,
    color: COLORS.text,
    width: 28,
    textAlign: 'right',
  },
  emptyBox: {
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 12,
  },
  emptyEmoji: {
    fontSize: 26,
    marginBottom: 4,
  },
  emptyTitle: {
    fontFamily: FONTS.pixel,
    fontSize: 9,
    color: COLORS.text,
    marginBottom: 4,
  },
  emptySubtitle: {
    fontFamily: FONTS.pixelBody,
    fontSize: FONT_SIZES.md,
    color: COLORS.textLight,
    textAlign: 'center',
  },
});
