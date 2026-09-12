/**
 * Baby — HealthInputs Component
 * Health logging for water, sleep, exercise, temperature, medication, vitamins.
 */

import React from 'react';
import { View, Text, StyleSheet, Pressable, TextInput } from 'react-native';
import { HealthLog } from '../../types';
import { COLORS, FONTS, FONT_SIZES, SPACING, BORDER_RADIUS, SHADOWS } from '../../constants/theme';
import * as Haptics from 'expo-haptics';

interface HealthInputsProps {
  health: HealthLog;
  onChange: (updated: HealthLog) => void;
  temperature?: number;
  onTemperatureChange?: (temp: number | undefined) => void;
}

export default function HealthInputs({
  health,
  onChange,
  temperature,
  onTemperatureChange,
}: HealthInputsProps) {
  const updateWater = (delta: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const newWater = Math.max(0, (health.waterIntake || 0) + delta);
    onChange({ ...health, waterIntake: newWater });
  };

  const updateSleep = (delta: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const newSleep = Math.max(0, Math.min(24, (health.sleepHours || 7) + delta));
    onChange({ ...health, sleepHours: newSleep });
  };

  const toggleExercise = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onChange({ ...health, exercise: !health.exercise });
  };

  const toggleVitamin = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onChange({ ...health, vitamin: !health.vitamin });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>HEALTH & WELLNESS TRACKER</Text>

      {/* Row 1: Water & Sleep Counters */}
      <View style={styles.counterRow}>
        {/* Water Intake */}
        <View style={styles.counterCard}>
          <Text style={styles.counterEmoji}>💧</Text>
          <Text style={styles.counterTitle}>WATER</Text>
          <Text style={styles.counterValue}>{health.waterIntake || 0} glasses</Text>
          <View style={styles.btnRow}>
            <Pressable onPress={() => updateWater(-1)} style={styles.stepBtn}>
              <Text style={styles.stepBtnText}>-</Text>
            </Pressable>
            <Pressable onPress={() => updateWater(1)} style={styles.stepBtn}>
              <Text style={styles.stepBtnText}>+</Text>
            </Pressable>
          </View>
        </View>

        {/* Sleep Hours */}
        <View style={styles.counterCard}>
          <Text style={styles.counterEmoji}>🌙</Text>
          <Text style={styles.counterTitle}>SLEEP</Text>
          <Text style={styles.counterValue}>{health.sleepHours || 7} hours</Text>
          <View style={styles.btnRow}>
            <Pressable onPress={() => updateSleep(-0.5)} style={styles.stepBtn}>
              <Text style={styles.stepBtnText}>-</Text>
            </Pressable>
            <Pressable onPress={() => updateSleep(0.5)} style={styles.stepBtn}>
              <Text style={styles.stepBtnText}>+</Text>
            </Pressable>
          </View>
        </View>
      </View>

      {/* Row 2: Toggles for Exercise & Vitamins */}
      <View style={styles.toggleRow}>
        {/* Exercise Toggle */}
        <Pressable
          onPress={toggleExercise}
          style={[styles.toggleCard, health.exercise && styles.toggleActive]}
        >
          <Text style={styles.toggleEmoji}>🏃‍♀️</Text>
          <Text style={styles.toggleTitle}>Exercise</Text>
          <Text style={styles.toggleStatus}>{health.exercise ? 'Done ✔' : 'None'}</Text>
        </Pressable>

        {/* Vitamin Toggle */}
        <Pressable
          onPress={toggleVitamin}
          style={[styles.toggleCard, health.vitamin && styles.toggleActive]}
        >
          <Text style={styles.toggleEmoji}>💊</Text>
          <Text style={styles.toggleTitle}>Vitamins</Text>
          <Text style={styles.toggleStatus}>{health.vitamin ? 'Taken ✔' : 'Not yet'}</Text>
        </Pressable>
      </View>

      {/* Row 3: Temperature & Medication Input */}
      <View style={styles.inputRow}>
        <View style={styles.textInputBox}>
          <Text style={styles.inputLabel}>🌡️ Temp (°C):</Text>
          <TextInput
            style={styles.textInput}
            value={temperature ? String(temperature) : ''}
            onChangeText={txt => {
              const num = parseFloat(txt);
              if (onTemperatureChange) onTemperatureChange(isNaN(num) ? undefined : num);
            }}
            placeholder="36.5"
            placeholderTextColor={COLORS.textMuted}
            keyboardType="decimal-pad"
          />
        </View>

        <View style={styles.textInputBox}>
          <Text style={styles.inputLabel}>💊 Medication:</Text>
          <TextInput
            style={styles.textInput}
            value={health.medication || ''}
            onChangeText={txt => onChange({ ...health, medication: txt })}
            placeholder="Ibuprofen, etc."
            placeholderTextColor={COLORS.textMuted}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  sectionTitle: {
    fontFamily: FONTS.pixel,
    fontSize: 10,
    color: COLORS.brownOutline,
    marginBottom: 8,
  },
  counterRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  counterCard: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#FFFDF9',
    padding: 10,
    borderWidth: 1.5,
    borderColor: COLORS.brownOutline,
    borderRadius: BORDER_RADIUS.lg,
    ...SHADOWS.pixel,
  },
  counterEmoji: {
    fontSize: 22,
    marginBottom: 2,
  },
  counterTitle: {
    fontFamily: FONTS.pixel,
    fontSize: 8,
    color: COLORS.textLight,
  },
  counterValue: {
    fontFamily: FONTS.pixel,
    fontSize: 10,
    color: COLORS.text,
    marginVertical: 4,
  },
  btnRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  stepBtn: {
    width: 28,
    height: 28,
    backgroundColor: '#FFF0F5',
    borderWidth: 1.5,
    borderColor: COLORS.brownOutline,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBtnText: {
    fontFamily: FONTS.pixel,
    fontSize: 12,
    color: COLORS.text,
  },
  toggleRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  toggleCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFDF9',
    padding: 10,
    borderWidth: 1.5,
    borderColor: COLORS.brownOutline,
    borderRadius: BORDER_RADIUS.lg,
    ...SHADOWS.pixel,
  },
  toggleActive: {
    backgroundColor: '#E8F8F0',
    borderColor: COLORS.success,
  },
  toggleEmoji: {
    fontSize: 20,
    marginRight: 6,
  },
  toggleTitle: {
    fontFamily: FONTS.pixel,
    fontSize: 8,
    color: COLORS.text,
    flex: 1,
  },
  toggleStatus: {
    fontFamily: FONTS.pixelBody,
    fontSize: FONT_SIZES.md,
    color: COLORS.textLight,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 8,
  },
  textInputBox: {
    flex: 1,
    backgroundColor: '#FFFDF9',
    padding: 8,
    borderWidth: 1.5,
    borderColor: COLORS.brownOutline,
    borderRadius: BORDER_RADIUS.lg,
    ...SHADOWS.pixel,
  },
  inputLabel: {
    fontFamily: FONTS.pixel,
    fontSize: 7,
    color: COLORS.textLight,
    marginBottom: 4,
  },
  textInput: {
    fontFamily: FONTS.pixelBody,
    fontSize: FONT_SIZES.lg,
    color: COLORS.text,
    paddingVertical: 2,
  },
});
