/**
 * Baby — Pixel ProgressBar Component
 * Chunky pixel-bordered progress bar with inner fill and optional label.
 */

import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { COLORS, FONTS, FONT_SIZES, SPACING, BORDER_RADIUS } from '../../constants/theme';

interface ProgressBarProps {
  progress: number; // 0 to 1
  height?: number;
  color?: string;
  backgroundColor?: string;
  label?: string;
  showPercentage?: boolean;
  style?: ViewStyle;
}

export default function ProgressBar({
  progress,
  height = 16,
  color = COLORS.accent,
  backgroundColor = COLORS.secondary,
  label,
  showPercentage = false,
  style,
}: ProgressBarProps) {
  const clampedProgress = Math.min(1, Math.max(0, isNaN(progress) ? 0 : progress));
  const percentString = `${Math.round(clampedProgress * 100)}%`;

  return (
    <View style={[styles.container, style]}>
      {(label || showPercentage) && (
        <View style={styles.labelRow}>
          {label ? <Text style={styles.label}>{label}</Text> : <View />}
          {showPercentage ? <Text style={styles.percentage}>{percentString}</Text> : null}
        </View>
      )}
      <View
        style={[
          styles.barWrapper,
          { height, backgroundColor },
        ]}
      >
        <View
          style={[
            styles.fill,
            {
              width: `${clampedProgress * 100}%`,
              backgroundColor: color,
            },
          ]}
        >
          {/* Pixel highlight strip on top half */}
          <View style={styles.highlight} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: SPACING.xs,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  label: {
    fontFamily: FONTS.pixel,
    fontSize: FONT_SIZES.xs,
    color: COLORS.text,
  },
  percentage: {
    fontFamily: FONTS.pixel,
    fontSize: FONT_SIZES.xs,
    color: COLORS.textLight,
  },
  barWrapper: {
    width: '100%',
    borderWidth: 2,
    borderColor: COLORS.brownOutline,
    borderRadius: BORDER_RADIUS.md,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    position: 'relative',
  },
  highlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '35%',
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
  },
});
