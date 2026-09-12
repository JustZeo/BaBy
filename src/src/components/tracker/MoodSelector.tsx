/**
 * Baby — MoodSelector Component
 * Pixel-styled mood selection grid supporting multi-select.
 */

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { MoodType } from '../../types';
import { MOOD_OPTIONS } from '../../constants';
import { COLORS, FONTS, FONT_SIZES, BORDER_RADIUS, SHADOWS } from '../../constants/theme';
import * as Haptics from 'expo-haptics';

interface MoodSelectorProps {
  selectedMoods: MoodType[];
  onToggleMood: (mood: MoodType) => void;
}

export default function MoodSelector({ selectedMoods, onToggleMood }: MoodSelectorProps) {
  const handlePress = (mood: MoodType) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onToggleMood(mood);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>HOW IS SHE FEELING TODAY?</Text>
      <Text style={styles.subtitle}>Select any moods noticed or shared:</Text>
      <View style={styles.grid}>
        {MOOD_OPTIONS.map(opt => {
          const isSelected = selectedMoods.includes(opt.id);
          return (
            <Pressable
              key={opt.id}
              onPress={() => handlePress(opt.id)}
              style={[
                styles.chip,
                isSelected && styles.chipSelected,
                isSelected && { borderColor: opt.color },
              ]}
            >
              <Text style={styles.emoji}>{opt.emoji}</Text>
              <Text style={[styles.label, isSelected && styles.labelSelected]}>
                {opt.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 6,
  },
  sectionTitle: {
    fontFamily: FONTS.pixel,
    fontSize: 10,
    color: COLORS.brownOutline,
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: FONTS.pixelBody,
    fontSize: FONT_SIZES.md,
    color: COLORS.textLight,
    marginBottom: 8,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFDF9',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderWidth: 1.5,
    borderColor: COLORS.brownOutline,
    borderRadius: BORDER_RADIUS.md,
    ...SHADOWS.pixel,
  },
  chipSelected: {
    backgroundColor: '#FFF0F5',
    borderWidth: 2,
  },
  emoji: {
    fontSize: 18,
    marginRight: 6,
  },
  label: {
    fontFamily: FONTS.pixelBody,
    fontSize: FONT_SIZES.lg,
    color: COLORS.text,
  },
  labelSelected: {
    color: COLORS.accent,
    fontWeight: 'bold',
  },
});
