/**
 * Baby — SymptomChart Component
 * Visualizes most common symptoms logged to help partner prepare ahead of time.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS, FONT_SIZES, BORDER_RADIUS, SHADOWS, SPACING } from '../../constants/theme';
import { SYMPTOM_OPTIONS } from '../../constants';

interface SymptomChartProps {
  symptomCounts: Record<string, number>;
}

export default function SymptomChart({ symptomCounts }: SymptomChartProps) {
  const total = Object.values(symptomCounts).reduce((a, b) => a + b, 0) || 1;

  const activeList = SYMPTOM_OPTIONS
    .map(opt => ({
      ...opt,
      count: symptomCounts[opt.id] || 0,
    }))
    .filter(s => s.count > 0)
    .sort((a, b) => b.count - a.count);

  const maxVal = Math.max(5, ...(activeList.length > 0 ? activeList.map(s => s.count) : [5]));

  const activeSymptoms = activeList.slice(0, 5).map(s => ({
    ...s,
    percent: Math.min(100, Math.round((s.count / maxVal) * 100)),
  }));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>FREQUENT SYMPTOMS</Text>
        <Text style={styles.subtitle}>Helpful for care preparedness</Text>
      </View>

      {activeSymptoms.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyEmoji}>🌸</Text>
          <Text style={styles.emptyText}>No symptoms logged yet!</Text>
        </View>
      ) : (
        <View style={styles.list}>
          {activeSymptoms.map(item => (
            <View key={item.id} style={styles.itemRow}>
              <View style={styles.labelCol}>
                <Text style={styles.emoji}>{item.emoji}</Text>
                <Text style={styles.label}>{item.label}</Text>
              </View>

              <View style={styles.barContainer}>
                <View
                  style={[
                    styles.barFill,
                    {
                      width: `${Math.max(8, item.percent)}%`,
                      backgroundColor: COLORS.accent,
                    },
                  ]}
                >
                  <View style={styles.highlight} />
                </View>
              </View>

              <Text style={styles.countText}>{item.count}x</Text>
            </View>
          ))}
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
  subtitle: {
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
    backgroundColor: '#FFE8EC',
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
    paddingVertical: 12,
  },
  emptyEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  emptyText: {
    fontFamily: FONTS.pixelBody,
    fontSize: FONT_SIZES.lg,
    color: COLORS.textLight,
  },
});
