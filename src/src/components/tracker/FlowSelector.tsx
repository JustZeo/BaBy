/**
 * Baby — FlowSelector Component
 * Single-select flow level tracker with visual blood drop indicators.
 */

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { FlowLevel } from '../../types';
import { FLOW_OPTIONS } from '../../constants';
import { COLORS, FONTS, FONT_SIZES, BORDER_RADIUS, SHADOWS } from '../../constants/theme';
import * as Haptics from 'expo-haptics';

interface FlowSelectorProps {
  selectedFlow?: FlowLevel;
  onSelectFlow: (flow: FlowLevel | undefined) => void;
}

export default function FlowSelector({ selectedFlow, onSelectFlow }: FlowSelectorProps) {
  const handlePress = (flow: FlowLevel) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (selectedFlow === flow) {
      onSelectFlow(undefined); // Deselect
    } else {
      onSelectFlow(flow);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>PERIOD FLOW LEVEL</Text>
      <Text style={styles.subtitle}>Optional: Tap to toggle flow level</Text>
      <View style={styles.row}>
        {FLOW_OPTIONS.map(opt => {
          const isSelected = selectedFlow === opt.id;
          return (
            <Pressable
              key={opt.id}
              onPress={() => handlePress(opt.id)}
              style={[
                styles.item,
                isSelected && styles.itemSelected,
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 4,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#FFFDF9',
    paddingVertical: 8,
    paddingHorizontal: 2,
    borderWidth: 1.5,
    borderColor: COLORS.brownOutline,
    borderRadius: BORDER_RADIUS.md,
    ...SHADOWS.pixel,
  },
  itemSelected: {
    backgroundColor: '#FFE8EC',
    borderWidth: 2,
  },
  emoji: {
    fontSize: 18,
    marginBottom: 2,
  },
  label: {
    fontFamily: FONTS.pixel,
    fontSize: 7,
    color: COLORS.text,
    textAlign: 'center',
  },
  labelSelected: {
    color: COLORS.accent,
  },
});
