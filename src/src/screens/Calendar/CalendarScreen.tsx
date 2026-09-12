/**
 * Baby — CalendarScreen Component
 * Color-coded pixel calendar with interactive day inspector and fast log jump.
 */

import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS, FONT_SIZES, SPACING, BORDER_RADIUS } from '../../constants/theme';
import Header from '../../components/common/Header';
import PixelCalendar from '../../components/calendar/PixelCalendar';
import PixelCard from '../../components/cards/PixelCard';
import PixelButton from '../../components/buttons/PixelButton';
import { useProfile, useCycleData, useDailyLogs } from '../../hooks/useStorage';
import { format } from 'date-fns';
import { getDayType } from '../../storage/cycle';
import { PHASE_DATA } from '../../constants';

export default function CalendarScreen({ navigation }: any) {
  const { profile } = useProfile();
  const { history } = useCycleData();
  const { logs } = useDailyLogs();

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  if (!profile) {
    return null;
  }

  const dateStr = format(selectedDate, 'yyyy-MM-dd');
  const dayLog = logs[dateStr];
  const dayType = getDayType(selectedDate, profile, history);

  const getDayTypeDescription = () => {
    switch (dayType) {
      case 'period':
        return 'Period Phase (Menstrual) 🌙';
      case 'ovulation':
        return 'Ovulation Peak Window ✨';
      case 'fertile':
        return 'Fertile Window 🌸';
      default:
        return 'Normal Cycle Day ☀️';
    }
  };

  const handleOpenTracker = () => {
    navigation.navigate('Tracker', { date: dateStr });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <Header
        title="CYCLE CALENDAR"
        subtitle="Pixel-art monthly cycle overview"
        emoji="📅"
      />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Pixel Calendar Component */}
        <PixelCalendar
          profile={profile}
          cycleHistory={history}
          dailyLogs={logs}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
        />

        {/* Selected Day Inspector Card */}
        <PixelCard style={styles.detailCard}>
          <View style={styles.detailHeader}>
            <View>
              <Text style={styles.dateLabel}>{format(selectedDate, 'EEEE, MMMM d, yyyy')}</Text>
              <Text style={styles.phaseLabel}>{getDayTypeDescription()}</Text>
            </View>
            {dayLog?.isPeriod && (
              <View style={styles.periodBadge}>
                <Text style={styles.periodBadgeText}>🩸 Period Logged</Text>
              </View>
            )}
          </View>

          {/* If Log exists for this day */}
          {dayLog ? (
            <View style={styles.logContent}>
              {/* Flow */}
              {dayLog.flow && (
                <View style={styles.logRow}>
                  <Text style={styles.logRowLabel}>Flow:</Text>
                  <Text style={styles.logRowVal}>{dayLog.flow.toUpperCase()}</Text>
                </View>
              )}

              {/* Moods */}
              {dayLog.moods?.length > 0 && (
                <View style={styles.logSection}>
                  <Text style={styles.logSectionTitle}>Moods Logged:</Text>
                  <View style={styles.chipRow}>
                    {dayLog.moods.map((m, i) => (
                      <View key={i} style={styles.miniChip}>
                        <Text style={styles.miniChipText}>{m}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {/* Symptoms */}
              {dayLog.symptoms?.length > 0 && (
                <View style={styles.logSection}>
                  <Text style={styles.logSectionTitle}>Symptoms Noticed:</Text>
                  <View style={styles.chipRow}>
                    {dayLog.symptoms.map((s, i) => (
                      <View key={i} style={[styles.miniChip, { backgroundColor: '#FFE8EC' }]}>
                        <Text style={styles.miniChipText}>{s.replace('_', ' ')}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {/* Health */}
              {dayLog.health && (
                <View style={styles.healthStatsRow}>
                  <Text style={styles.healthStat}>💧 {dayLog.health.waterIntake || 0} glasses</Text>
                  <Text style={styles.healthStat}>🌙 {dayLog.health.sleepHours || 0}h sleep</Text>
                  {dayLog.temperature && <Text style={styles.healthStat}>🌡️ {dayLog.temperature}°C</Text>}
                </View>
              )}

              {/* Notes */}
              {dayLog.notes ? (
                <View style={styles.notesBox}>
                  <Text style={styles.notesLabel}>Notes:</Text>
                  <Text style={styles.notesText}>{dayLog.notes}</Text>
                </View>
              ) : null}
            </View>
          ) : (
            <View style={styles.emptyDayBox}>
              <Text style={styles.emptyDayEmoji}>📝</Text>
              <Text style={styles.emptyDayText}>No log recorded for this day yet.</Text>
            </View>
          )}

          {/* Quick Action Button */}
          <PixelButton
            title={dayLog ? "EDIT LOG FOR THIS DAY" : "LOG CARE & SYMPTOMS"}
            onPress={handleOpenTracker}
            variant={dayLog ? "secondary" : "primary"}
            size="md"
            style={{ marginTop: SPACING.md }}
          />
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
  detailCard: {
    padding: SPACING.md,
  },
  detailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottomWidth: 1.5,
    borderBottomColor: '#FFE5EC',
    paddingBottom: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  dateLabel: {
    fontFamily: FONTS.pixel,
    fontSize: 9,
    color: COLORS.text,
  },
  phaseLabel: {
    fontFamily: FONTS.pixelBody,
    fontSize: FONT_SIZES.lg,
    color: COLORS.accent,
    marginTop: 2,
  },
  periodBadge: {
    backgroundColor: '#FFE3E8',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.brownOutline,
  },
  periodBadgeText: {
    fontFamily: FONTS.pixel,
    fontSize: 7,
    color: COLORS.accent,
  },
  logContent: {
    gap: 8,
  },
  logRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  logRowLabel: {
    fontFamily: FONTS.pixel,
    fontSize: 8,
    color: COLORS.textLight,
  },
  logRowVal: {
    fontFamily: FONTS.pixel,
    fontSize: 8,
    color: COLORS.accent,
  },
  logSection: {
    marginTop: 4,
  },
  logSectionTitle: {
    fontFamily: FONTS.pixel,
    fontSize: 7,
    color: COLORS.textLight,
    marginBottom: 4,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  miniChip: {
    backgroundColor: '#FFF0F5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.brownOutline,
  },
  miniChipText: {
    fontFamily: FONTS.pixelBody,
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
  },
  healthStatsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
    backgroundColor: '#FFF7F1',
    padding: 8,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: '#FFE3D1',
  },
  healthStat: {
    fontFamily: FONTS.pixelBody,
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
  },
  notesBox: {
    backgroundColor: '#FFFDF9',
    padding: 8,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.brownOutline,
    marginTop: 4,
  },
  notesLabel: {
    fontFamily: FONTS.pixel,
    fontSize: 7,
    color: COLORS.textLight,
    marginBottom: 2,
  },
  notesText: {
    fontFamily: FONTS.pixelBody,
    fontSize: FONT_SIZES.lg,
    color: COLORS.text,
    lineHeight: 18,
  },
  emptyDayBox: {
    alignItems: 'center',
    paddingVertical: 14,
  },
  emptyDayEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  emptyDayText: {
    fontFamily: FONTS.pixelBody,
    fontSize: FONT_SIZES.lg,
    color: COLORS.textLight,
  },
});
