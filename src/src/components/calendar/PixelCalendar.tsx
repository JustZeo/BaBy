/**
 * Baby — PixelCalendar Component
 * Pixel art monthly calendar with cycle phase color coding:
 * Pink = Period, Green = Fertile Window, Yellow = Ovulation, Cream = Normal.
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import {
  startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  eachDayOfInterval, format, isSameMonth, isSameDay,
  addMonths, subMonths, isToday,
} from 'date-fns';
import { COLORS, FONTS, FONT_SIZES, BORDER_RADIUS, SHADOWS, SPACING } from '../../constants/theme';
import { UserProfile, CycleRecord, DailyLog } from '../../types';
import { getDayType, DayType } from '../../storage/cycle';
import * as Haptics from 'expo-haptics';

interface PixelCalendarProps {
  profile: UserProfile;
  cycleHistory: CycleRecord[];
  dailyLogs: Record<string, DailyLog>;
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
}

export default function PixelCalendar({
  profile,
  cycleHistory,
  dailyLogs,
  selectedDate,
  onSelectDate,
}: PixelCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState<Date>(selectedDate);

  const prevMonth = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const nextMonth = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  const weekDays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  const handleDayPress = (day: Date) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSelectDate(day);
  };

  return (
    <View style={styles.container}>
      {/* Month Navigation Header */}
      <View style={styles.headerRow}>
        <Pressable onPress={prevMonth} style={styles.navBtn}>
          <Text style={styles.navBtnText}>◀</Text>
        </Pressable>
        <View style={styles.monthTitleBox}>
          <Text style={styles.monthTitle}>
            {format(currentMonth, 'MMMM yyyy').toUpperCase()}
          </Text>
        </View>
        <Pressable onPress={nextMonth} style={styles.navBtn}>
          <Text style={styles.navBtnText}>▶</Text>
        </Pressable>
      </View>

      {/* Weekday Row */}
      <View style={styles.weekDaysRow}>
        {weekDays.map((wd, i) => (
          <View key={i} style={styles.weekDayCell}>
            <Text style={styles.weekDayText}>{wd}</Text>
          </View>
        ))}
      </View>

      {/* Days Grid */}
      <View style={styles.grid}>
        {days.map((day, idx) => {
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const isSelected = isSameDay(day, selectedDate);
          const isCurrentDay = isToday(day);
          const dayType: DayType = getDayType(day, profile, cycleHistory);

          const dateStr = format(day, 'yyyy-MM-dd');
          const hasLog = !!dailyLogs[dateStr];
          const isLoggedPeriod = dailyLogs[dateStr]?.isPeriod;

          const cellBg = getDayCellBg(dayType, isLoggedPeriod);

          return (
            <Pressable
              key={idx}
              onPress={() => handleDayPress(day)}
              style={[
                styles.dayCell,
                { backgroundColor: cellBg },
                !isCurrentMonth && styles.outsideMonth,
                isSelected && styles.selectedCell,
                isCurrentDay && styles.todayRing,
              ]}
            >
              <Text
                style={[
                  styles.dayText,
                  !isCurrentMonth && styles.outsideMonthText,
                  isSelected && styles.selectedDayText,
                ]}
              >
                {format(day, 'd')}
              </Text>

              {/* Indicator Dot if day has logged entry */}
              {hasLog && (
                <View style={styles.logIndicator}>
                  <View style={styles.dot} />
                </View>
              )}
            </Pressable>
          );
        })}
      </View>

      {/* Legend */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendBox, { backgroundColor: COLORS.periodDay }]} />
          <Text style={styles.legendText}>Period</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendBox, { backgroundColor: COLORS.fertileDay }]} />
          <Text style={styles.legendText}>Fertile</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendBox, { backgroundColor: COLORS.ovulationDay }]} />
          <Text style={styles.legendText}>Ovulation</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendBox, { backgroundColor: COLORS.normalDay }]} />
          <Text style={styles.legendText}>Normal</Text>
        </View>
      </View>
    </View>
  );
}

function getDayCellBg(dayType: DayType, isLoggedPeriod?: boolean): string {
  if (isLoggedPeriod) return COLORS.periodDay;
  switch (dayType) {
    case 'period':
      return COLORS.periodDay;
    case 'fertile':
      return COLORS.fertileDay;
    case 'ovulation':
      return COLORS.ovulationDay;
    default:
      return COLORS.normalDay;
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFDF9',
    borderWidth: 2,
    borderColor: COLORS.brownOutline,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.md,
    ...SHADOWS.pixel,
    marginBottom: SPACING.md,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  navBtn: {
    width: 32,
    height: 32,
    backgroundColor: '#FFF0F5',
    borderWidth: 1.5,
    borderColor: COLORS.brownOutline,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navBtnText: {
    fontFamily: FONTS.pixel,
    fontSize: 10,
    color: COLORS.text,
  },
  monthTitleBox: {
    alignItems: 'center',
  },
  monthTitle: {
    fontFamily: FONTS.pixel,
    fontSize: 10,
    color: COLORS.text,
    letterSpacing: 0.5,
  },
  weekDaysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
    borderBottomWidth: 1.5,
    borderBottomColor: '#FFE5EC',
    paddingBottom: 4,
  },
  weekDayCell: {
    flex: 1,
    alignItems: 'center',
  },
  weekDayText: {
    fontFamily: FONTS.pixel,
    fontSize: 7,
    color: COLORS.textLight,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.brownOutline,
    position: 'relative',
  },
  outsideMonth: {
    opacity: 0.25,
  },
  outsideMonthText: {
    color: COLORS.textMuted,
  },
  selectedCell: {
    borderColor: COLORS.accent,
    borderWidth: 2.5,
    zIndex: 2,
  },
  todayRing: {
    borderWidth: 2,
    borderColor: COLORS.accent,
  },
  dayText: {
    fontFamily: FONTS.pixel,
    fontSize: 9,
    color: COLORS.text,
  },
  selectedDayText: {
    fontWeight: 'bold',
  },
  logIndicator: {
    position: 'absolute',
    bottom: 2,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.accent,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: SPACING.md,
    paddingTop: SPACING.sm,
    borderTopWidth: 1.5,
    borderTopColor: '#FFE5EC',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendBox: {
    width: 12,
    height: 12,
    borderWidth: 1,
    borderColor: COLORS.brownOutline,
    borderRadius: 2,
  },
  legendText: {
    fontFamily: FONTS.pixel,
    fontSize: 7,
    color: COLORS.textLight,
  },
});
