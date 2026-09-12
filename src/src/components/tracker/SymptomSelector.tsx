/**
 * Baby — SymptomSelector Component
 * Multi-select symptom grid with pixel aesthetic.
 */

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { SymptomType } from '../../types';
import { SYMPTOM_OPTIONS } from '../../constants';
import { COLORS, FONTS, FONT_SIZES, BORDER_RADIUS, SHADOWS } from '../../constants/theme';
import * as Haptics from 'expo-haptics';

interface SymptomSelectorProps {
  selectedSymptoms: SymptomType[];
  onToggleSymptom: (symptom: SymptomType) => void;
}

export default function SymptomSelector({
  selectedSymptoms,
  onToggleSymptom,
}: SymptomSelectorProps) {
  const handlePress = (symptom: SymptomType) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onToggleSymptom(symptom);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>ANY SYMPTOMS NOTICED?</Text>
      <Text style={styles.subtitle}>Helps you prepare heating pads, tea, or snacks:</Text>
      <View style={styles.grid}>
        {SYMPTOM_OPTIONS.map(opt => {
          const isSelected = selectedSymptoms.includes(opt.id);
          return (
            <Pressable
              key={opt.id}
              onPress={() => handlePress(opt.id)}
              style={[
                styles.chip,
                isSelected && styles.chipSelected,
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
    backgroundColor: '#FFE8EC',
    borderColor: COLORS.accent,
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
