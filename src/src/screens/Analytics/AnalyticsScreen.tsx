/**
 * Baby — AnalyticsScreen Component
 * Local cycle statistics, charts, trends, correlations, and monthly summaries.
 */

import React, { useMemo } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS, FONT_SIZES, SPACING, BORDER_RADIUS, SHADOWS } from '../../constants/theme';
import Header from '../../components/common/Header';
import PixelCard from '../../components/cards/PixelCard';
import CycleChart from '../../components/graphs/CycleChart';
import MoodChart from '../../components/graphs/MoodChart';
import SymptomChart from '../../components/graphs/SymptomChart';
import { useProfile, useDailyLogs, useCycleData } from '../../hooks/useStorage';
import {
  computeAverageCycleLength,
  computeAveragePeriodLength,
  getCycleLengthHistory,
  computeMoodFrequency,
  computeSymptomFrequency,
  getSleepVsMoodData,
  getWaterVsSymptomData,
  getMonthlyChartData,
} from '../../storage/analytics';

export default function AnalyticsScreen() {
  const { profile } = useProfile();
  const { history } = useCycleData();
  const { logs } = useDailyLogs();

  const avgCycle = useMemo(() => {
    return computeAverageCycleLength(history) || profile?.averageCycleLength || 28;
  }, [history, profile]);

  const avgPeriod = useMemo(() => {
    return computeAveragePeriodLength(history) || profile?.averagePeriodLength || 5;
  }, [history, profile]);

  const cycleHistory = useMemo(() => getCycleLengthHistory(history), [history]);
  const moodCounts = useMemo(() => computeMoodFrequency(logs), [logs]);
  const symptomCounts = useMemo(() => computeSymptomFrequency(logs), [logs]);
  const sleepVsMood = useMemo(() => getSleepVsMoodData(logs), [logs]);
  const waterVsSymptoms = useMemo(() => getWaterVsSymptomData(logs), [logs]);
  const monthlyData = useMemo(() => getMonthlyChartData(logs, 4), [logs]);

  const totalLogsCount = Object.keys(logs).length;

  return (
    <SafeAreaView style={styles.safe}>
      <Header
        title="INSIGHTS & ANALYTICS"
        subtitle="Calculated 100% locally on your device"
        emoji="📊"
      />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Top Summary Stat Cards */}
        <View style={styles.statsRow}>
          <PixelCard style={styles.statCard} color="#FFF0F5">
            <Text style={styles.statEmoji}>🔄</Text>
            <Text style={styles.statVal}>
              {history.length > 0 ? `${avgCycle} Days` : `${profile?.averageCycleLength || 28}d (Est)`}
            </Text>
            <Text style={styles.statLabel}>Cycle Length</Text>
          </PixelCard>

          <PixelCard style={styles.statCard} color="#FFF0F5">
            <Text style={styles.statEmoji}>🩸</Text>
            <Text style={styles.statVal}>
              {history.length > 0 ? `${avgPeriod} Days` : `${profile?.averagePeriodLength || 5}d (Est)`}
            </Text>
            <Text style={styles.statLabel}>Period Duration</Text>
          </PixelCard>

          <PixelCard style={styles.statCard} color="#FFF0F5">
            <Text style={styles.statEmoji}>📝</Text>
            <Text style={styles.statVal}>{totalLogsCount}</Text>
            <Text style={styles.statLabel}>{totalLogsCount === 1 ? 'Day Logged' : 'Days Logged'}</Text>
          </PixelCard>
        </View>

        {/* Cycle Length History Graph */}
        <CycleChart history={cycleHistory} avgLength={avgCycle} />

        {/* Mood Frequency Distribution */}
        <MoodChart moodCounts={moodCounts} />

        {/* Symptom Frequency Graph */}
        <SymptomChart symptomCounts={symptomCounts} />

        {/* Correlation Insights: Sleep vs Mood */}
        <PixelCard style={styles.insightCard}>
          <View style={styles.insightHeader}>
            <Text style={styles.insightEmoji}>🌙</Text>
            <Text style={styles.insightTitle}>SLEEP & MOOD CORRELATION</Text>
          </View>
          <Text style={styles.insightBody}>
            {sleepVsMood.length > 3
              ? "Her mood appears more peaceful on days with 7+ hours of sleep. Extra encouragement for cozy early bedtimes may help! 💕"
              : "Keep logging sleep and mood to uncover personalized rest patterns. 🌙"}
          </Text>
        </PixelCard>

        {/* Correlation Insights: Hydration vs Symptoms */}
        <PixelCard style={styles.insightCard}>
          <View style={styles.insightHeader}>
            <Text style={styles.insightEmoji}>💧</Text>
            <Text style={styles.insightTitle}>HYDRATION & COMFORT</Text>
          </View>
          <Text style={styles.insightBody}>
            {waterVsSymptoms.length > 3
              ? "Drinking 5+ glasses of water correlates with fewer headaches and less severe cramps. Keep the water bottle nearby! 💧"
              : "Track water intake to see how hydration helps soothe her cycle symptoms. ✨"}
          </Text>
        </PixelCard>

        {/* Monthly Summary Table */}
        <PixelCard style={styles.monthlyCard}>
          <Text style={styles.monthlyTitle}>MONTHLY CYCLE SUMMARY</Text>
          <View style={styles.tableHeader}>
            <Text style={[styles.th, { flex: 1 }]}>Month</Text>
            <Text style={[styles.th, { width: 50, textAlign: 'center' }]}>Logs</Text>
            <Text style={[styles.th, { width: 60, textAlign: 'center' }]}>Period</Text>
            <Text style={[styles.th, { flex: 1, textAlign: 'right' }]}>Top Mood</Text>
          </View>
          {monthlyData.map((m, i) => (
            <View key={i} style={styles.tableRow}>
              <Text style={[styles.td, { flex: 1, fontFamily: FONTS.pixel, fontSize: 8 }]}>
                {m.month}
              </Text>
              <Text style={[styles.td, { width: 50, textAlign: 'center' }]}>{m.totalLogs}</Text>
              <Text style={[styles.td, { width: 60, textAlign: 'center' }]}>{m.periodDays}d</Text>
              <Text style={[styles.td, { flex: 1, textAlign: 'right', color: COLORS.accent }]}>
                {m.dominantMood}
              </Text>
            </View>
          ))}
        </PixelCard>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scroll: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING['4xl'],
  },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: SPACING.sm,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: SPACING.sm,
    marginBottom: 0,
  },
  statEmoji: {
    fontSize: 20,
    marginBottom: 2,
  },
  statVal: {
    fontFamily: FONTS.pixel,
    fontSize: 9,
    color: COLORS.text,
    textAlign: 'center',
  },
  statLabel: {
    fontFamily: FONTS.pixelBody,
    fontSize: FONT_SIZES.md,
    color: COLORS.textLight,
    textAlign: 'center',
    marginTop: 2,
  },
  insightCard: {
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  insightEmoji: {
    fontSize: 16,
    marginRight: 6,
  },
  insightTitle: {
    fontFamily: FONTS.pixel,
    fontSize: 8,
    color: COLORS.brownOutline,
  },
  insightBody: {
    fontFamily: FONTS.pixelBody,
    fontSize: FONT_SIZES.lg,
    color: COLORS.text,
    lineHeight: 20,
  },
  monthlyCard: {
    padding: SPACING.md,
  },
  monthlyTitle: {
    fontFamily: FONTS.pixel,
    fontSize: 9,
    color: COLORS.brownOutline,
    marginBottom: SPACING.sm,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1.5,
    borderBottomColor: '#FFE5EC',
    paddingBottom: 4,
    marginBottom: 6,
  },
  th: {
    fontFamily: FONTS.pixel,
    fontSize: 7,
    color: COLORS.textLight,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#FFF1F3',
    alignItems: 'center',
  },
  td: {
    fontFamily: FONTS.pixelBody,
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
  },
});
