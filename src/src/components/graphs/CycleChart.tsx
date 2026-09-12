/**
 * Baby — CycleChart Component
 * Pixel-art styled cycle length history chart.
 * Shows true cycle history without fake dummy data.
 */

import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { COLORS, FONTS, FONT_SIZES, BORDER_RADIUS, SHADOWS, SPACING } from '../../constants/theme';
import Svg, { Rect, Line, Text as SvgText } from 'react-native-svg';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface CycleChartProps {
  history: number[]; // cycle lengths in days
  avgLength: number;
}

export default function CycleChart({ history, avgLength }: CycleChartProps) {
  const hasHistory = history && history.length > 0;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>CYCLE LENGTH HISTORY</Text>
        <Text style={styles.avgBadge}>Avg: {avgLength || 28}d</Text>
      </View>

      {!hasHistory ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyEmoji}>🌱</Text>
          <Text style={styles.emptyTitle}>No Cycle History Yet</Text>
          <Text style={styles.emptySubtitle}>
            When her period starts and finishes, complete cycles will appear here as history bars!
          </Text>
        </View>
      ) : (
        renderChart(history, avgLength)
      )}
    </View>
  );
}

function renderChart(history: number[], avgLength: number) {
  const data = history.slice(-8); // Show up to last 8 cycles
  const maxVal = Math.max(35, ...data);
  const chartHeight = 120;
  const chartWidth = SCREEN_WIDTH - 64;
  const barWidth = Math.min(28, (chartWidth - 40) / data.length);
  const gap = 12;

  return (
    <Svg width={chartWidth} height={chartHeight} style={styles.svg}>
      {/* Baseline */}
      <Line
        x1="0"
        y1={chartHeight - 20}
        x2={chartWidth}
        y2={chartHeight - 20}
        stroke={COLORS.brownOutline}
        strokeWidth="2"
      />

      {/* Reference dashed line */}
      <Line
        x1="0"
        y1={chartHeight - 20 - (28 / maxVal) * (chartHeight - 35)}
        x2={chartWidth}
        y2={chartHeight - 20 - (28 / maxVal) * (chartHeight - 35)}
        stroke={COLORS.accent}
        strokeWidth="1"
        strokeDasharray="4 4"
      />

      {/* Bars */}
      {data.map((len, idx) => {
        const barHeight = (len / maxVal) * (chartHeight - 35);
        const x = 20 + idx * (barWidth + gap);
        const y = chartHeight - 20 - barHeight;

        return (
          <React.Fragment key={idx}>
            {/* Value label */}
            <SvgText
              x={x + barWidth / 2}
              y={y - 4}
              fill={COLORS.text}
              fontSize="8"
              fontFamily={FONTS.pixel}
              textAnchor="middle"
            >
              {len}
            </SvgText>

            {/* Bar */}
            <Rect
              x={x}
              y={y}
              width={barWidth}
              height={barHeight}
              fill={COLORS.primary}
              stroke={COLORS.brownOutline}
              strokeWidth="1.5"
              rx="2"
            />

            {/* Cycle index label */}
            <SvgText
              x={x + barWidth / 2}
              y={chartHeight - 6}
              fill={COLORS.textLight}
              fontSize="7"
              fontFamily={FONTS.pixel}
              textAnchor="middle"
            >
              #{idx + 1}
            </SvgText>
          </React.Fragment>
        );
      })}
    </Svg>
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
    marginBottom: SPACING.sm,
  },
  title: {
    fontFamily: FONTS.pixel,
    fontSize: 9,
    color: COLORS.brownOutline,
  },
  avgBadge: {
    fontFamily: FONTS.pixel,
    fontSize: 8,
    color: COLORS.accent,
    backgroundColor: '#FFF0F5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.accent,
  },
  svg: {
    marginTop: 4,
  },
  emptyBox: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 12,
  },
  emptyEmoji: {
    fontSize: 28,
    marginBottom: 6,
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
    lineHeight: 18,
  },
});
